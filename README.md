# crds-reactive-auth
Library for watching crossroads authentication token

### Usage
---------

Installation:
```
npm i --save-dev crds-reactive-auth
```

Consumption:
```ts
import ReactiveAuth from 'crds-reactive-auth';

let reactiveAuth = new ReactiveAuth();
```

This package currently only supports being used in packages that can consume `Typescript`.

### Documentation
-----------------

#### Constructor

This creates a new instance of `ReactiveAuth`, checks for the current value of the named cookie, and sets up the default event handler callbacks.

```ts
const reactiveAuth = new ReactiveAuth(name: string = 'sessionId', defaultHandler: Function = console.log)
```

* `name`: (optional) the name of the cookie that is going to be watched.
  * default: `'sessionId'`
* `defaultHandler`: (optional) this function will be called whenever the cookie gets updated or expires.
  * default: `console.log`

### Methods
-----------

#### `#subscribe`

Subscribes the client to the events that are dispatched by this class.

```ts
reactiveAuth.subscribe(frequency: number = 3000, updateCb?: Function, expireCb?: Function): any
```

* `frequency`: (optional) The number of milliseconds the between checks for changes to the cookie.
  * default: `3000`
* `updateCb`: (optional) The callback function that will be called whenever the cookie is updated.
  * If not passed will retain value that was used in the constructor.
* `expireCb`: (optional) The callback function that will be called whenever the cookie is removed.
  * If not passed will retain value that was used in the constructor.

#### `#unsubscribe`

Unsubscribes the client from the events that this class dispatches.

```ts
reactiveAuth.unsubscribe(): void
```

#### `#getSubscription`

Grabs the current subscription that is active on the window for this instance of `ReactiveAuth`.

```ts
const subscription = reactiveAuth.getSubscription(): number | never
```

* returns the subscription associated with that instance of `ReactiveAuth`
