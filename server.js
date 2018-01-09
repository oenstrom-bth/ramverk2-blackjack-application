"use strict";
const mongoClient     = require("mongodb").MongoClient;
const http            = require("http");
const jwt             = require("express-jwt");
const app             = require("./app");
const dsn             = process.env.DBWEBB_DSN || "mongodb://localhost:27017/blackjack";
const port            = process.env.DBWEBB_PORT || 1337;
const server          = http.createServer(app);
const { createIO }    = require("./src/socket");

mongoClient.connect(dsn, (err, db) => {
    if (err) { throw err; }

    createIO(server, db);
    app.all('/*', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    app.use(jwt({
        secret: require("./secret"),
        algorithms: ["HS512"]
    }).unless({path: [/\/public\/.+/]}));
    app.use("/public", require("./routes/public")(db));

    server.listen(port);
    server.on("error", err => { throw err; });
    server.on("listening", () => console.log(`Server listening on ${port}`));
});
