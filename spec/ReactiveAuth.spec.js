// eslint-disable-next-line import/no-unresolved
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

    it('Should call the getCookie method', () => {
      const tCookieVal = 'abc123';
      spyOn(ReactiveAuth.prototype, 'getCookie').and.returnValue(tCookieVal);

      const ra = new ReactiveAuth();

      expect(ra.getCookie).toHaveBeenCalled();
      expect(ra.cookieVal).toEqual(tCookieVal);
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
      spyOn(window, 'clearInterval');

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

  describe('#getSubscription', () => {
    let ra;
    let dWatchCookie;

    beforeEach(() => {
      ra = new ReactiveAuth();
      dWatchCookie = setInterval(() => { }, 10000);

      spyOn(window, 'setInterval').and.returnValue(dWatchCookie);
    });

    afterEach(() => {
      ra = undefined;
      clearInterval(dWatchCookie);
      dWatchCookie = undefined;
    });

    it('Should get the current interval running on the window', () => {
      ra.subscribe();
      const tWatchCookie = ra.getSubscription();

      expect(tWatchCookie).toEqual(dWatchCookie);
    });

    it('Should throw an error when subscription doesn\'t exist', () => {
      expect(() => {
        ra.getSubscription();
      }).toThrowError(ReferenceError);
    });
  });

  describe('#createEventListeners', () => {
    const dUpdateCb = () => { };
    const dExpireCb = () => { };

    let ra;

    beforeEach(() => {
      spyOn(window, 'addEventListener');

      ra = new ReactiveAuth();
      ra.updateHandler = dUpdateCb;
      ra.expireHandler = dExpireCb;
    });

    afterEach(() => {
      ra = undefined;
    });

    it('Should work properly when passed no params', () => {
      ra.createEventListeners();

      expect(addEventListener.calls.count()).toEqual(2);
      expect(addEventListener.calls.argsFor(0)).toEqual(['updateAuth', dUpdateCb, false]);
      expect(addEventListener.calls.argsFor(1)).toEqual(['expireAuth', dExpireCb, false]);
    });

    it('Should accept and use valid params', () => {
      const tUpdateCb = () => { };
      const tExpireCb = () => { };

      ra.createEventListeners(tUpdateCb, tExpireCb);

      expect(addEventListener.calls.count()).toEqual(2);
      expect(addEventListener.calls.argsFor(0)).toEqual(['updateAuth', tUpdateCb, false]);
      expect(addEventListener.calls.argsFor(1)).toEqual(['expireAuth', tExpireCb, false]);
    });
  });

  describe('#getCookie', () => {
    const dCookieVal = 'abc123';
    let ra;

    beforeEach(() => {
      ra = new ReactiveAuth();
    });

    it('Should get the cookie', () => {
      spyOn(String.prototype, 'replace').and.returnValue(dCookieVal);

      const tCookieVal = ra.getCookie();

      expect(document.cookie.replace).toHaveBeenCalled();
      expect(tCookieVal).toEqual(dCookieVal);
    });

    it('Should return undefined if no cookie found', () => {
      spyOn(String.prototype, 'replace').and.returnValue('');

      const tCookieVal = ra.getCookie();

      expect(document.cookie.replace).toHaveBeenCalled();
      expect(tCookieVal).toBeUndefined();
    });
  });


  describe('Update Auth Events', () => {
    const dCookieVal0 = undefined;
    const dCookieVal1 = 'abc123';
    const dCookieVal2 = '123abc';
    const dFreq = 3000;
    const dUpdatedTitle = 'updateAuth';
    const dUpdatedMessage = 'Auth Cookie Updated';

    let ra;

    beforeEach(() => {
      spyOn(window, 'CustomEvent');
      spyOn(window, 'dispatchEvent');

      ra = new ReactiveAuth();

      jasmine.clock().install();
    });

    afterEach(() => {
      ra = undefined;
      jasmine.clock().uninstall();
    });

    it('Should dispatch when the cookie is added', () => {
      spyOn(ra, 'getCookie').and.returnValue(dCookieVal1);

      ra.cookieVal = dCookieVal0;
      ra.subscribe(dFreq);
      jasmine.clock().tick(dFreq + 1);

      expect(dispatchEvent).toHaveBeenCalled();
      expect(CustomEvent).toHaveBeenCalledWith(dUpdatedTitle, jasmine.objectContaining({
        detail: {
          message: dUpdatedMessage,
          oldValue: dCookieVal0,
          currentValue: dCookieVal1
        }
      }));
    });

    it('Should dispatch when the cookie changes', () => {
      spyOn(ra, 'getCookie').and.returnValue(dCookieVal2);

      ra.cookieVal = dCookieVal1;
      ra.subscribe(dFreq);
      jasmine.clock().tick(dFreq + 1);

      expect(dispatchEvent).toHaveBeenCalled();
      expect(CustomEvent).toHaveBeenCalledWith(dUpdatedTitle, jasmine.objectContaining({
        detail: {
          message: dUpdatedMessage,
          oldValue: dCookieVal1,
          currentValue: dCookieVal2
        }
      }));
    });

    it('Shouldn\'t dispatch if cookie isn\'t initially found', () => {
      spyOn(ra, 'getCookie').and.returnValue(dCookieVal0);

      ra.subscribe(dFreq);
      jasmine.clock().tick(dFreq + 1);

      expect(dispatchEvent).not.toHaveBeenCalled();
      expect(CustomEvent).not.toHaveBeenCalled();
    });

    it('Shouldn\'t dispatch if the cookie hasn\'t changed', () => {
      spyOn(ra, 'getCookie').and.returnValue(dCookieVal1);

      ra.cookieVal = dCookieVal1;
      ra.subscribe(dFreq);
      jasmine.clock().tick(dFreq + 1);

      expect(dispatchEvent).not.toHaveBeenCalled();
      expect(CustomEvent).not.toHaveBeenCalled();
    });
  });

  describe('Expire Auth Events', () => {
    const dCookieVal0 = undefined;
    const dCookieVal1 = 'abc123';
    const dFreq = 3000;
    const dExpiredTitle = 'expireAuth';
    const dExpiredMessage = 'Auth Cookie Expired';

    let ra;

    beforeEach(() => {
      spyOn(window, 'CustomEvent');
      spyOn(window, 'dispatchEvent');

      ra = new ReactiveAuth();

      jasmine.clock().install();
    });

    afterEach(() => {
      ra = undefined;
      jasmine.clock().uninstall();
    });

    it('Should dispatch when the cookie is removed', () => {
      spyOn(ra, 'getCookie').and.returnValue(dCookieVal0);

      ra.cookieVal = dCookieVal1;
      ra.subscribe(dFreq);
      jasmine.clock().tick(dFreq + 1);

      expect(dispatchEvent).toHaveBeenCalled();
      expect(CustomEvent).toHaveBeenCalledWith(dExpiredTitle, jasmine.objectContaining({
        detail: {
          message: dExpiredMessage,
          oldValue: dCookieVal1,
          currentValue: dCookieVal0
        }
      }));
    });

    it('Shouldn\'t dispatch if the cookie already didn\'t exist', () => {
      spyOn(ra, 'getCookie').and.returnValue(dCookieVal0);

      ra.cookieVal = dCookieVal0;
      ra.subscribe(dFreq);
      jasmine.clock().tick(dFreq + 1);

      expect(dispatchEvent).not.toHaveBeenCalled();
      expect(CustomEvent).not.toHaveBeenCalled();
    });

    it('Shouldn\'t dispatch if the cookie exists', () => {
      spyOn(ra, 'getCookie').and.returnValue(dCookieVal1);

      ra.subscribe(dFreq);
      jasmine.clock().tick(dFreq + 1);

      // This should dispatch the 'Update Auth Cookie' event
      expect(dispatchEvent.calls.count()).toEqual(1);
      expect(CustomEvent.calls.count()).toEqual(1);
      expect(CustomEvent.calls.argsFor(0)).not.toEqual([
        dExpiredTitle,
        jasmine.any(Object)
      ]);
    });
  });
});
