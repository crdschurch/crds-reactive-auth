import ReactiveAuth from '../src/ReactiveAuth';

describe('ReactiveAuth', () => {
  describe('#constructor', () => {
    // These are the default values
    const dName = 'sessionId';
    const dValRe = new RegExp(`(?:(?:^|.*;\\s*)${dName}\\s*=\\s*([^;]*).*$)|^.*$`, '');
    const dCookieVal = undefined;
    const dWatchCookie = undefined;
    // eslint-disable-next-line no-console
    const dHandler = console.log;

    it('Should construct a new ReactiveAuth instance with defaults', () => {
      const ra = new ReactiveAuth();

      expect(ra.cookieValRe.toString()).toBe(dValRe.toString());
      expect(ra.cookieVal).toBe(dCookieVal);
      expect(ra.watchCookie).toBe(dWatchCookie);
      expect(ra.updateHandler).toBe(dHandler);
      expect(ra.expireHandler).toBe(dHandler);
    });

    it('Should construct a new ReactiveAuth instance with a name', () => {
      const tName = 'localsessionId';
      const tValRe = new RegExp(`(?:(?:^|.*;\\s*)${tName}\\s*=\\s*([^;]*).*$)|^.*$`, '');

      const ra = new ReactiveAuth(tName);

      expect(ra.cookieValRe.toString()).toBe(tValRe.toString());
      expect(ra.cookieVal).toBe(dCookieVal);
      expect(ra.watchCookie).toBe(dWatchCookie);
      expect(ra.updateHandler).toBe(dHandler);
      expect(ra.expireHandler).toBe(dHandler);
    });

    it('Should construct a new ReactiveAuth instance with a name and default handler', () => {
      const tName = 'localsessionId';
      const tValRe = new RegExp(`(?:(?:^|.*;\\s*)${tName}\\s*=\\s*([^;]*).*$)|^.*$`, '');
      const tHandler = () => { };

      const ra = new ReactiveAuth(tName, tHandler);

      expect(ra.cookieValRe.toString()).toBe(tValRe.toString());
      expect(ra.cookieVal).toBe(dCookieVal);
      expect(ra.watchCookie).toBe(dWatchCookie);
      expect(ra.updateHandler).toBe(tHandler);
      expect(ra.expireHandler).toBe(tHandler);
    });

    xit('Should call the getCookie method', () => {
      const ra = new ReactiveAuth();

      spyOn(ra, 'getCookie');

      expect(ra.getCookie).toHaveBeenCalled();
    });
  });

  describe('#subscribe', () => {
    const dFreq = 3000;
    const dUpdateCb = undefined;
    const dExpireCb = undefined;

    let ra;

    beforeEach(() => {
      ra = new ReactiveAuth();
    });

    afterEach(() => {
      ra = undefined;
    });

    it('Should work properly with no params passed in', () => {
      const tInterval = setInterval(() => { }, 1000);

      spyOn(ra, 'createEventListeners');
      spyOn(window, 'setInterval').and.returnValue(tInterval);

      ra.subscribe();

      expect(ra.createEventListeners).toHaveBeenCalled();
      expect(ra.createEventListeners).toHaveBeenCalledWith(dUpdateCb, dExpireCb);
      // TODO: test the interval functionality separately
      /*expect(ra.cookieVal).toBe(undefined);*/
      expect(setInterval).toHaveBeenCalled();
      expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), dFreq);
      expect(ra.watchCookie).toEqual(tInterval);
    });

    it('Should accept and use valid params', () => {
      const tFreq = 1000;
      const tUpdateCb = () => { };
      const tExpireCb = () => { };
      const tInterval = setInterval(() => { }, tFreq);

      spyOn(ra, 'createEventListeners');
      spyOn(window, 'setInterval').and.returnValue(tInterval);

      ra.subscribe(tFreq, tUpdateCb, tExpireCb);

      expect(ra.createEventListeners).toHaveBeenCalled();
      expect(ra.createEventListeners).toHaveBeenCalledWith(tUpdateCb, tExpireCb);
      expect(setInterval).toHaveBeenCalled();
      expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), tFreq);
      expect(ra.watchCookie).toEqual(tInterval);
    });
  });

  describe('#unsubscribe', () => {
    let ra;
    let dWatchCookie;

    beforeEach(() => {
      ra = new ReactiveAuth();
      dWatchCookie = setInterval(() => { }, 3000);
      ra.watchCookie = dWatchCookie;
    });

    afterEach(() => {
      ra = undefined;
      clearInterval(dWatchCookie);
      dWatchCookie = undefined;
    });

    it('Should stop watching the auth cookie and reset the watchCookie variable', () => {
      spyOn(window, 'clearInterval').and.callThrough();

      ra.unsubscribe();

      expect(clearInterval).toHaveBeenCalled();
      expect(clearInterval).toHaveBeenCalledWith(dWatchCookie);
      expect(ra.watchCookie).toEqual(null);
    });

    it('Should remove the event listeners from the window object', () => {
      spyOn(window, 'removeEventListener');

      ra.unsubscribe();

      expect(removeEventListener.calls.count()).toEqual(2);
      expect(removeEventListener.calls.argsFor(0)).toEqual(['updateAuth']);
      expect(removeEventListener.calls.argsFor(1)).toEqual(['expireAuth']);
    });
  });

  describe('#createEventListeners', () => {
    const dUpdateCb = () => { };
    const dExpireCb = () => { };

    let ra;

    beforeEach(() => {
      ra = new ReactiveAuth();
      ra.updateHandler = dUpdateCb;
      ra.expireHandler = dExpireCb;
    });

    afterEach(() => {
      ra = undefined;
    });

    it('Should work properly when passed no params', () => {
      spyOn(window, 'addEventListener');

      ra.createEventListeners();

      expect(addEventListener.calls.count()).toEqual(2);
      expect(addEventListener.calls.argsFor(0)).toEqual(['updateAuth', dUpdateCb, false]);
      expect(addEventListener.calls.argsFor(1)).toEqual(['expireAuth', dExpireCb, false]);
    });

    it('Should accept and use valid params', () => {
      const tUpdateCb = () => { };
      const tExpireCb = () => { };

      spyOn(window, 'addEventListener');

      ra.createEventListeners(tUpdateCb, tExpireCb);

      expect(addEventListener.calls.count()).toEqual(2);
      expect(addEventListener.calls.argsFor(0)).toEqual(['updateAuth', tUpdateCb, false]);
      expect(addEventListener.calls.argsFor(1)).toEqual(['expireAuth', tExpireCb, false]);
    });
  });

  xdescribe('Dispatching Events', () => {
    let ra;

    beforeEach(() => {
      ra = new ReactiveAuth();
    });

    afterEach(() => {
      ra = undefined;
    });

    describe('updateAuth Event', () => {
      it('Should not dispatch if the auth cookie isn\'t initially found', () => {

      });
    });

    describe('expireAuth Event', () => {

    });
  });
});
