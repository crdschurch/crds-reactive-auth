
class ReactiveAuth {

  /**
   * Handles watching for changes with the auth cookie and dispatches the
   *     appropriate events.
   *
   * @constructor
   * @param {string} name - the name of the auth cookie that should be watched.
   * @param {Function} defaultHandler - A default callback for the event
   *     listeners. @default console.log
   * @returns
   */
  constructor(name, defaultHandler) {
    // If name is falsy then set the cookieName to an empty string
    // FIXME: should defualt values be hard coded here...?
    const cookieName = name && typeof name === 'string' ? name : 'sessionId';

    // This regex extracts the value of the cookie `cookieName`
    this.cookieValRe = new RegExp(`(?:(?:^|.*;\\s*)${cookieName}\\s*=\\s*([^;]*).*$)|^.*$`, '');
    this.cookieVal = undefined;
    this.watchAuthCookie = undefined;

    /* eslint-disable no-console */
    // Sets up the default event handler for the update and expire events
    this.updateHandler = defaultHandler && typeof defaultHandler === 'function' ? defaultHandler : console.log;
    this.expireHandler = defaultHandler && typeof defaultHandler === 'function' ? defaultHandler : console.log;
    /* eslint-enable no-console */
  }

  /**
   * Subscribes the client to events that are dispatched by this class.
   *
   * @param {number} freq - the frequency in which changes should be looked for.
   *     @default 3000 (milliseconds)
   * @param {Function} updateCallback - a specific function that should be called
   *     when the `updateAuth` event is dispatched.
   * @param {Function} expireCallback - a specific function that should be called
   *     when the `expireAuth` event is dispatched.
   * @returns {number} The ID of the interval that was set.
   */
  subscribe(freq, updateCallback, expireCallback) {
    this.createEventListeners(updateCallback, expireCallback);

    if (this.watchAuthCookie) { clearInterval(this.watchAuthCookie); }

    const frequency = freq > 0 ? freq : 3000;

    this.watchAuthCookie = setInterval(() => {
      const browserCookieVal = document.cookie.replace(this.cookieValRe, '$1');

      if (!browserCookieVal && this.cookieVal) {
        // The cookie expired
        window.dispatchEvent(new CustomEvent('expireAuth', {
          detail: {
            message: 'Auth Cookie Expired',
            oldValue: this.cookieVal,
            currentValue: browserCookieVal,
          },
          bubbles: true,
          cancelable: true
        }));

        this.cookieVal = browserCookieVal;
      } else if (this.cookieVal !== browserCookieVal) {
        // The cookie was updated manually by the user
        window.dispatchEvent(new CustomEvent('updateAuth', {
          detail: {
            message: 'Updating Auth Cookie',
            oldValue: this.cookieVal,
            currentValue: browserCookieVal,
          },
          bubbles: true,
          cancelable: true
        }));

        this.cookieVal = browserCookieVal;
      }
    }, frequency);

    return this.watchAuthCookie;
  }

  /**
   * Unsubscribes the client from the events that this class dispatches
   *     and stops the interval that was running.
   *
   * @returns
   */
  unsubscribe() {
    clearInterval(this.watchAuthCookie);
    this.watchAuthCookie = null;

    window.removeEventListener('updateAuth');
    window.removeEventListener('expireAuth');
  }

  /**
   * Creates the event listeners for the `updateAuth` and `expireAuth` events
   *     and attaches them to the DOM.
   * @private
   * @param {Function} updateCb - a specific function that should be called
   *     when the `updateAuth` event is dispatched.
   * @param {Function} expireCb - a specific function that should be called
   *     when the `expireAuth` event is dispatched.
   * @returns
   */
  createEventListeners(updateCb, expireCb) {
    console.log(this);
    if (updateCb && typeof updateCb === 'function') { this.updateHandler = updateCb; }
    if (expireCb && typeof expireCb === 'function') { this.expireHandler = expireCb; }

    window.addEventListener('updateAuth', this.updateHandler, false);
    window.addEventListener('expireAuth', this.expireHandler, false);
  }
}

export default ReactiveAuth;
