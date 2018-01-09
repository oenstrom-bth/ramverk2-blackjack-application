"use strict";
const crypto = require("crypto");

const genSalt = (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString("hex")
        .slice(0, length);
};

const sha512 = (password, salt) => {
    let hash = crypto.createHmac("sha512", salt);

    hash.update(password);
    return hash.digest("hex");
};

const hashPassword = (password, saltLength = 16) => {
    const salt = genSalt(saltLength);

    return { hash: sha512(password, salt), salt };
};

const verifyPassword = (password, salt, hash) => {
    return sha512(password, salt) === hash;
};

module.exports = { hashPassword, verifyPassword };
