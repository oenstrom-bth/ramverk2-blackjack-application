# Black Jack server

[![Build Status](https://travis-ci.org/oenstrom/ramverk2-blackjack-server.svg?branch=master)](https://travis-ci.org/oenstrom/ramverk2-blackjack-server)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/oenstrom/ramverk2-blackjack-server/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/oenstrom/ramverk2-blackjack-server/?branch=master)
[![Code Coverage](https://scrutinizer-ci.com/g/oenstrom/ramverk2-blackjack-server/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/oenstrom/ramverk2-blackjack-server/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/oenstrom/ramverk2-blackjack-server/badges/build.png?b=master)](https://scrutinizer-ci.com/g/oenstrom/ramverk2-blackjack-server/build-status/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/a5ea321a90f97fe77893/maintainability)](https://codeclimate.com/github/oenstrom/ramverk2-blackjack-server/maintainability)
[![BCH compliance](https://bettercodehub.com/edge/badge/oenstrom/ramverk2-blackjack-server?branch=master)](https://bettercodehub.com/)

## Installation
1. Clone the repo.
2. Run `npm install`
3. Run `npm run build-client-mac`, `npm run build-client-win` or `npm run build-client-linux`.
4. Run`npm run mongodb` or start your installation of MongoDB.
5. Run `npm start`to start the Express server.
6. You are done! Open the application located in `client/release-builds/`.

You can replace step 4 and 5 with the following: `npm run start-docker`.  
To stop docker run `npm run stop-docker`.


### Dev
1. Clone the repo.
2. Run `npm install`.
3. Start your installation of MongoDB or use `npm run mongodb`.
4. Run `npm run start-dev` to start the Express server.
5. Run `npm run start-client-dev` to start React in dev mode.
6. Run `npm run start-client-electron-dev`to start Electron.

### Configuration
Edit the variable `REACT_APP_API_URL` located in `client/.env.development` and `client/.env.production`to change the URL of the server the client will connect to.
`DBWEBB_PORT`determines the port the server is using and `DBWEBB_DSN` is for the MongoDB. If you are using Docker you will also have to edit the ports and DSN in the `docker-compose.yml`file.

## Specification
A client/server desktop application for playing Black Jack.

### Included features
* Sign up and sign in
* Table joining and creation
* Betting
* Hit, stand and double
* Payout 1:1 on win and 3:2 on Black Jack

### Excluded features
* Edit profile
* Insurance bet
* Splitting cards

### Server
The server is developed using Express.js. The need for Express is actually very small as it only have two routes. Maybe it would've been better to just use vanilla Node to handle the server. The reasons for choosing Express were that I know better how it works and I actually thought I would use it more than I did.

### Client
To develop the client I have used React and Electron. I choose to use React, as an application like this would've been much harder to develop using a teamplate language like PUG or similar. An other reason for using React is how popular it is. This makes it easier troubleshoot and find help compared to smaller frameworks like Mithril. React worked out pretty well. There were alot of new things to learn. For example how React wants you to handle state and send props. I thought of to also use Redux but I felt it would be one too many new things to use in this application.

Electron was a clear choice as it's the only framework for developing desktop applications using web technologies that I know of. Even though I didn't use much of Electron specific features I would not been able to create the desktop app without it.

## Testing
For testing I've been using Jest and I reached about 52% code coverage. The things that are not tested is socket.io. I really can't get the tests to work with Socket.io. I felt that 52% will have to do as I feel it's not reasonable to spend countless of hours just to try to fix tests for Socket.io. In the above 52% the client is not included. Same goes here, I'm not testing the React client as I'm not sure how snapshot testing works and it would take to much time to sort this out.

* Run `npm test` to run linters and tests.
* Run `npm run test-docker` to test on Node 9.3 (alpine) using docker.
* Run `npm run test-docker1` to test on Node 9.0 (alpine) using docker.
* Run `npm run test-docker2` to test on Node 8.9 (alpine) using docker.
* Run `npm run coverage` to generate code coverage.
* View the coverage by opening the `index.html` file located in `PROJECT_DIRECTORY/coverage/lcov-report/`

## CI
I choose to use Scrutinizer and Codeclimate. Scrutinizer got build status, code quality and code coverage, so it should be enough to just use that. However, I like Codeclimate so I decided to include that too.

I'm not the biggest fan of these kind of build tools but I have to admit it can really help you with your code. Scrutinizer finds issuses and bugs that you might not have thought of. Codeclimate works kinda similar. So my feelings are split, I don't like setting up the tools and working with them, but they are actually helpful, so I guess I just have to do it.

## Realtime
The first thing that is updated in realtime is the list of tables. If a user joins a new table or an existing one the server emits an event to the other clients with the array of rooms.

Once in a room comes the second part of the realtime. Here it starts with a round of betting. When a player places their bet the "player bet" event is emitted to the server. The server then removes the bet amount from the players account balance, and then emits a game update to all the clients at the table. Once all bets are done the players are dealt their two cards and the dealer one. The game is now turn based and the first player who joined is the first to act. The player can now hit, stand or double all emitting a corresponding event to the server. For example if a player hit, the server responds with a game update event where a card has been added to the players hand so all the clients can display the new card.

I've been using Socket.io to handle the realtime in this application. I really like the event based communication even though it's very different from what I'm used to. It's not as hard as I thought it would be before I tried it. However, I feel like the documentation is not so well organized which made it a bit more time consuming than it should be.

## Database
The database I've been using for this project is MongoDB with the default Node.js driver. Using MongoDB for this project have been working out pretty well. It feels more like working with JavaScript and JSON than a database.

I will continue to use traditional SQL databases, maybe less though, as I feel like relations between the tables can be really smooth and good. For example if I would need to make a pretty advanced database I would probably choose to use MariaDB as I'm much more comfortable with that compared to MongoDB.

## NPM module
The NPM module that I have made and used in this project is JOV. JOV is a module for validating JavaScript objects. I'm using this module to give me a simple way to validate the login and register post body. You declare a schema that the the object will be validated against. At it's current state the module only supports validating strings, but that's enough as I only need to validate username, email and password.

I think NPM is a really good package manager. For me it has been extremely easy to use and really fast. And a package manager needs that for it to be a legitimate choice.

And then there's yarn. I don't know much about it but apparently Facebook felt they needed something "better" than NPM. I'm not sure what's different but I will probably try it out in the near future. As for now, NPM is more than enough for me.

[JOV at NPM](https://www.npmjs.com/package/jov)
