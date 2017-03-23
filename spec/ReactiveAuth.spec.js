import ReactiveAuth from '../src/ReactiveAuth';

describe('ReactiveAuth', () => {
  describe('#constructor', () => {
    // These are the default values
    const dName = 'sessionId';
    const dValRe = new RegExp(`(?:(?:^|.*;\\s*)${dName}\\s*=\\s*([^;]*).*$)|^.*$`, '');
    const dCookieVal = undefined;
    const dWatchAuthCookie = undefined;
    // eslint-disable-next-line no-console
    const dHandler = console.log;

    it('Should construct a new ReactiveAuth instance with defaults', () => {
      const ra = new ReactiveAuth();

      expect(ra.cookieValRe.toString()).toBe(dValRe.toString());
      expect(ra.cookieVal).toBe(dCookieVal);
      expect(ra.watchAuthCookie).toBe(dWatchAuthCookie);
      expect(ra.updateHandler).toBe(dHandler);
      expect(ra.expireHandler).toBe(dHandler);
    });

    it('Should construct a new ReactiveAuth instance with a name', () => {
      const tName = 'localsessionId';
      const tValRe = new RegExp(`(?:(?:^|.*;\\s*)${tName}\\s*=\\s*([^;]*).*$)|^.*$`, '');

      const ra = new ReactiveAuth(tName);

      expect(ra.cookieValRe.toString()).toBe(tValRe.toString());
      expect(ra.cookieVal).toBe(dCookieVal);
      expect(ra.watchAuthCookie).toBe(dWatchAuthCookie);
      expect(ra.updateHandler).toBe(dHandler);
      expect(ra.expireHandler).toBe(dHandler);
    });

    it('Should construct a new ReactiveAuth instance with a name and default handler', () => {
      const tName = 'localsessionId';
      const tValRe = new RegExp(`(?:(?:^|.*;\\s*)${tName}\\s*=\\s*([^;]*).*$)|^.*$`, '');
      function tHandler() {}

      const ra = new ReactiveAuth(tName, tHandler);

      expect(ra.cookieValRe.toString()).toBe(tValRe.toString());
      expect(ra.cookieVal).toBe(dCookieVal);
      expect(ra.watchAuthCookie).toBe(dWatchAuthCookie);
      expect(ra.updateHandler).toBe(tHandler);
      expect(ra.expireHandler).toBe(tHandler);
    });

    it('Should use default values when provided incorrect parameter types', () => {
      const tName = 4;
      const tHandler = 'string';

      const ra = new ReactiveAuth(tName, tHandler);

      expect(ra.cookieValRe.toString()).toBe(dValRe.toString());
      expect(ra.cookieVal).toBe(dCookieVal);
      expect(ra.watchAuthCookie).toBe(dWatchAuthCookie);
      expect(ra.updateHandler).toBe(dHandler);
      expect(ra.expireHandler).toBe(dHandler);
    });
  });

  describe('#subscribe', () => {
    it('Should work properly with no parameters passed in', () => {

    });

    it('Should take a frequency', () => {

    });

    it('Should take custom callbacks for update and expire events', () => {

    });

    it('Should create the event listeners', () => {

    });
  });

  describe('#unsubscribe', () => {

  });

  describe('#createEventListeners', () => {

  });
});
