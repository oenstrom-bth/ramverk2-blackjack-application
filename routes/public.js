"use strict";
const router  = require("express").Router();
const User    = require("../src/User/user");

const publicRoutes = (db) => {
    const user = new User(db);

    router.post("/register", async (req, res) => {
        const result = await user.register(req.body);

        // const result = createUser(db, req.body);
        res.status(result.status);
        res.json(result);
    });

    router.post("/login", async (req, res) => {
        const result = await user.login(req.body);

        // const result = loginUser(db, req.body);
        // res.status(result.status);
        res.status(result.status).json(result);
    });

    return router;
};

module.exports = publicRoutes;
