"use strict";
const Jov = require("jov");
const schemas = require("./schemas");
const { hashPassword, verifyPassword } = require("./password");
const { sign } = require("../token");

class User {
    constructor(db, collection = "users") {
        this.db = db;
        this.setCollection(db, collection);
    }



    async setCollection(db, collection) {
        this.coll = await db.collection(collection);
    }



    async userExist(username, email) {
        return !!await this.coll.findOne({$or: [{username}, {email}]});
    }



    async register(postBody) {
        const error = Jov.validate(postBody, schemas.register);

        if (error) { return {status: 400, error: error.error}; }

        const { username, email, password } = postBody;

        if (await this.userExist(username, email)) {
            return {status: 400, error: {
                type: "user:exist",
                field: "username|email",
                message: "That user does already exist."
            }};
        }

        const { hash, salt } = hashPassword(password);

        await this.coll.insertOne({username, email, password: hash, salt, money: 1000});
        return {status: 200, username, email, password: hash, salt, error};
    }



    async login(postBody) {
        const error = Jov.validate(postBody, schemas.login);

        if (error) { return {status: 400, error: error.error}; }

        const { username, password } = postBody;
        const user = await this.coll.findOne({username});

        return !user || !verifyPassword(password, user.salt, user.password)
            ? {error: {
                type: "credentials:invalid",
                field: "username|password",
                message: "Invalid user credentials."
            }, status: 400}
            : {status: 200, token: sign({
                username: user.username,
                email: user.email
            }), user: {
                username: user.username, email: user.email
            }, error};
    }
}

module.exports = User;
