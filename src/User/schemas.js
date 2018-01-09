"use strict";
const Jov = require("jov");

module.exports = {
    register: {
        username: new Jov.string().required().alphanum().min(3).max(20),
        email: new Jov.string().required().email().max(254),
        password: new Jov.string().required().min(6).max(180)
    },

    login: {
        username: new Jov.string().required().alphanum().min(3).max(20),
        password: new Jov.string().required().min(6).max(180)
    }
};
