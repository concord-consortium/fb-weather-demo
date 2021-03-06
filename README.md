# fb-weather-demo

A quick and dirty demo of using firebase for a classroom weather simulation.

## Selecting a scenario

You can select a scenario using the `scenario` url parameter with an id value found in the `weather-scenario-specs.json.ts` file.
If no parameter is supplied or a parameter with an id that does not exist in the json data is supplied the first scenario is selected.

Here is an example url with the scenario defined:

`?scenario=NE_EP2`

## Adjusting student weather station display

By default the student weather station displays the time, the temperature, the precipitation and the moisture content.  The last three measurements can be disabled via giving the following url parameters a false value (either `false`, `0` or `no`):

1. showStudentTemperature
2. showStudentPrecipitation
3. showStudentMoisture

Here is an example url where precipitation and moisture are not displayed:

`?showStudentPrecipitation=no&showStudentMoisture=no`

## Working with this project:

1. Prerequisits: Install [`yarn`](https://yarnpkg.com/) and [`npm`](https://www.npmjs.com/)
if they are not already installed  your development system.  Also install `live-server` using `npm install -g live-server`
2. Install dependencies by running `yarn` in this directory.
3. Start `webpack-dev-server`
4. Open [http://localhost:8080/](http://localhost:8080/) note: `127.0.0.1` will not work at the moment, because it isn't a white-listed host on the Firebase site.
5. Work.

## Libraries used:
* [Firebase](https://firebase.google.com/) is used for storing data and sending messages.
* [React](https://facebook.github.io/react/) is the javascript view engine developed by Facebook.
* [MobX State Tree](https://github.com/mobxjs/mobx-state-tree) helps with passing state changes through components.
* [Material-UI](http://www.material-ui.com/) is a react widget set developed by Google.
* [React-Router](https://reacttraining.com/react-router/) url based view routing for react.

## Misc:
* [TypeScript](https://www.typescriptlang.org/) type support for better tooling and fewer bugs in your javascript.
* [TSLint](https://palantir.github.io/tslint/) An extensible linter for the TypeScript language
* [ESLint](http://eslint.org/) The pluggable linting utility for JavaScript and JSX

## Important files:
* `src/js/firebase-imp.ts` – Manages all connections to firebase.
* `src/js/data-store.ts` – Monolithic application state management. Brokers through `firebase-imp`. TODO: split this store into multiple smaller stores, extracting common core firebase setting / getting. Also look in to automating this with mobX triggers.
* `src/js/main.tsx` – Configures the nested react-router routes, and the setups up the initial React view. The general form of URL routes is `/sessions/<sessionName>/show/<viewname>`.

## A note about Dependencies:

As this codebase has evolved, the dependencies between versions of the various
packages have become a bit brittle.

Beware of adding new packages, or updating
packages already in use, in that it can be impossible to build without a
significant effort to update many of the other packages. This may not be worth
the development time, give the constraints of the problem or feature being addressed.

Also, it is worth keeping in mind the exact versions of development tools used
in the dev environment. Here
are the current tools used to build the project, as of February, 2019.

~~~
  $ node --version
  v8.15.0
  $ yarn --version
  1.13.0
  $ npm --version
  6.4.1
~~~