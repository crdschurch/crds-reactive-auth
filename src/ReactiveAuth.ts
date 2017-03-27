
type anyFunc = (...args: any[]) => void;

class ReactiveAuth {
  public cookieVal: string | void;
  public cookieValRe: RegExp;
  public watchCookie: any | void;
  public updateHandler: anyFunc;
  public expireHandler: anyFunc;

  /**
   * Handles watching for changes with the auth cookie and dispatches the appropriate events.
   *
   * @method  constructor
   * @param   {string}  name            the name of the auth cookie that should be watched.
   * @param   {anyFunc} defaultHandler  A default callback for the event listeners.
   */
  constructor(name: string = 'sessionId', defaultHandler: anyFunc = console.log) {
    this.cookieValRe = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*=\\s*([^;]*).*$)|^.*$`, '');
    this.cookieVal = this.getCookie();
    this.updateHandler = defaultHandler;
    this.expireHandler = defaultHandler;
  }

  /**
   * Subscribes the client to the events that are dispatched by this class.
   *
   * @method  subscribe
   *
   * @param   {number}  frequency=3000 The frequency in milliseconds that this class will check the
   *     cookie.
   * @param   {anyFunc} updateCb       A specific function that should be called when the
   *     `updateAuth` event is dispatched.
   * @param   {anyFunc} expireCb       A specific function that should be called when the
   *     `expireAuth` event is dispatched.
   *
   * @returns {any}                    The object that identifies the interval that was started.
   */
  public subscribe(frequency = 3000, updateCb?: anyFunc, expireCb?: anyFunc): any {
    this.createEventListeners(updateCb, expireCb);

    if (this.watchCookie) { clearInterval(this.watchCookie); }

    this.watchCookie = setInterval(() => {
      const currentBrowserCookieVal: string | void = this.getCookie();

      if (!currentBrowserCookieVal && this.cookieVal) {
        // The cookie expired
        window.dispatchEvent(new CustomEvent('expireAuth', {
          detail: {
            message: 'Auth Cookie Expired',
            oldValue: this.cookieVal,
            currentValue: currentBrowserCookieVal
          },
          bubbles: true,
          cancelable: true
        }));
      } else if (this.cookieVal !== currentBrowserCookieVal) {
        window.dispatchEvent(new CustomEvent('updateAuth', {
          detail: {
            message: 'Auth Cookie Updated',
            oldValue: this.cookieVal,
            currentValue: currentBrowserCookieVal
          },
          bubbles: true,
          cancelable: true
        }));
      }

      this.cookieVal = currentBrowserCookieVal;
    }, frequency);

    return this.watchCookie;
  }

  /**
   * Unsubscribes the client from the events that this class dispatches.
   *
   * @method unsubscribe
   */
  public unsubscribe(): void {
    clearInterval(this.watchCookie);
    this.watchCookie = null;

    window.removeEventListener('updateAuth');
    window.removeEventListener('expireAuth');
  }

  /**
   * Grabs the current subscription that is active on the window.
   *
   * @method getSubscription
   * @returns {any}            The current interval on window.
   * @throws  {ReferenceError} If the subscription is not found.
   */
  public getSubscription(): any | never {
    if (!this.watchCookie) {
      throw new ReferenceError('ReactiveAuth#getSubscription(): No subscriptions found on window. Call subscribe() to create one.');
    }

    return this.watchCookie;
  }

  /**
   * Creates the event listeners for the `updateAuth` and `expireAuth` events.
   *
   * @method createEventListeners
   * @private
   *
   * @param  {anyFunc} updateCb A specific function that should be called when the `updateAuth`
   *     event is dispatched.
   * @param  {anyFunc} expireCb A specific function that should be called when the `expireAuth`
   *     event is dispatched.
   */
  private createEventListeners(updateCb?: anyFunc, expireCb?: anyFunc): void {
    if (updateCb) { this.updateHandler = updateCb; }
    if (expireCb) { this.expireHandler = expireCb; }

    window.addEventListener('updateAuth', this.updateHandler, false);
    window.addEventListener('expireAuth', this.expireHandler, false);
  }

  /**
   * Gets the cookie string and isolates the cookie we want using regex replacement.
   *
   * @method getCookie
   * @private
   * @returns {string}  The isolated auth cookie.
   */
  private getCookie(): string | void {
    return document.cookie.replace(this.cookieValRe, '$1') || undefined;
  }
}

export default ReactiveAuth;
