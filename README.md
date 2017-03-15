# fb-weather-demo

A quick and dirty demo of using firebase for a classroom weather simulation.

## Working with this project:

1. Prerequisits: Install [`yarn`](https://yarnpkg.com/en/) and [`npm`](https://www.npmjs.com/)
if they are not already installed  your development system.  Also install `live-server` using `npm install -g live-server`
2. Install dependencies by running `yarn` in this directory.
3. Start `webpack --watch`
4. Open a new terminal window and run `live-server .` from the top directory of this project.
4. Open [http://localhost:8080/](http://localhost:8080/) See also [weather-station.html](http://localhost:8080/weather-station.html) and [sim-controller.html](http://localhost:8080/sim-controller.html)
note: `127.0.0.1` will not work at the moment, because it isn't a white-listed host on the firebase site.
5. Work.

## Libraries used:
* [Firebase](https://firebase.google.com/) is used for storing data and sending messages.
* [React](https://facebook.github.io/react/) is the javascript view engine developed by Facebook.
* [Matrial-UI](www.material-ui.com) is a react widget set developed by Google.

## Misc:
* [eslint](http://eslint.org/)
