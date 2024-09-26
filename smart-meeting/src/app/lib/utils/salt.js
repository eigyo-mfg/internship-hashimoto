const { randomBytes } = require("crypto");

const salt = randomBytes(16).toString("hex");
console.log(salt);
