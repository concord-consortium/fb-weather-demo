# fb-weather-demo

A quick and dirty demo of using firebase for a classroom weather simulation.


## Working with this project:

1. Prerequisits: Install [`yarn`](https://yarnpkg.com/en/) and [`npm`](https://www.npmjs.com/)
if they are not already installed  your development system.  Also install `live-server` using `npm install -g live-server`
2. Install dependencies by running `yarn` in this directory.
3. Start `webpack-dev-server`
4. Open [http://localhost:8080/](http://localhost:8080/) note: `127.0.0.1` will not work at the moment, because it isn't a white-listed host on the firebase site.
5. Work.

## Libraries used:
* [Firebase](https://firebase.google.com/) is used for storing data and sending messages.
* [React](https://facebook.github.io/react/) is the javascript view engine developed by Facebook.
* [mobx](https://github.com/mobxjs/mobx) helps with passing state changes through components.
* [Matrial-UI](www.material-ui.com) is a react widget set developed by Google.

## Misc:
* [typscrtipt](https://www.typescriptlang.org/) type support for better tooling and fewer bugs in your javascript.
* [eslint](http://eslint.org/)

## Important files:
* `src/js/firebase-imp.ts` – Manages all connections to firebase.
* `src/js/data-store.ts` – Monolithic application state management. Brokers through `firebase-imp`. TODO: split this store into multiple smaller stores, extracting common core firebase setting / getting. Also look in to automating this with mobX triggers.
* `src/js/router.ts` – Extracts configuration parameters from the URL.  The most important of which is the `session` parameter. This is intended to isolate simultanious simulations or class runs by giving them a specific name-space on the firebase server. TODO: This feature was disabled during a refactoring. It needs to be renabled. Expect to spend about 1-2 days getting that put back in. The tricky part will be switching all the DB references when the session changes. This will mean stopping listinging to old connections, and creating new connections.