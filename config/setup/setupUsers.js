/**
 * Connect to the database and setup it with some default data.
 */
"use strict";

const mongo = require("mongodb").MongoClient;
const path  = require("path");
const fs    = require("fs");
const dsn   = process.env.DBWEBB_DSN || "mongodb://localhost:27017/blackjack";
const docs  = JSON.parse(fs.readFileSync(path.resolve(__dirname, "userData.json"), "utf8"));



/**
 * Reset a collection by removing existing content and insert a default
 * set of documents.
 *
 * @async
 *
 * @param {string} dsn      DSN to connect to database.
 * @param {string} collName Name of collection.
 * @param {string} doc      Documents to be inserted into collection.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<void>} Void
 */
async function resetCollection(dsn, collName, doc) {
    const db   = await mongo.connect(dsn);
    const coll = await db.collection(collName);

    await coll.deleteMany();
    await coll.insertMany(doc);
    await db.close();
}

resetCollection(dsn, "users", docs)
    .then(() => console.log("Users have been reset"))
    .catch(err => console.log(err));
