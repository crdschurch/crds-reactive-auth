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
    let ra;

    beforeEach(() => {
      ra = new ReactiveAuth();
    });

    afterEach(() => {
      ra = undefined;
    });

    it('Should work properly with no params passed in', () => {
      expect(ra.cookieVal).toBe(undefined);
    });

    it('Should accept and use valid params', () => {

    });

    it('Should revert to default params when given invalid params', () => {

    });

    it('Should call #createEventListeners class method', () => {

    });

    it('Should create and return an interval object', () => {

    });

    it('Should take custom callbacks for update and expire events', () => {

    });
  });

  describe('#unsubscribe', () => {
    let ra;

    beforeEach(() => {
      ra = new ReactiveAuth();
    });

    afterEach(() => {
      ra = undefined;
    });

    it('Should stop watching the auth cookie and reset the watchAuthCookie variable', () => {

    });

    it('Should remove the event listeners from the window object', () => {

    });
  });

  describe('#createEventListeners', () => {
    let ra;

    beforeEach(() => {
      ra = new ReactiveAuth();
    });

    afterEach(() => {
      ra = undefined;
    });

    it('Should accept and use valid params', () => {

    });

    it('Should add event listeners to the window object', () => {

    });
  });
});
