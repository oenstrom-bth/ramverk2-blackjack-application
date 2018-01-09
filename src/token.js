"use strict";
const jwt = require("jsonwebtoken");
const secret = require("../secret");

const sign = (payload) => {
    return jwt.sign(payload, secret, {algorithm: "HS512"});
};

const verify = (token) => {
    return jwt.verify(token, secret, {algorithms: ["HS512"]});
};

module.exports = { sign, verify };
