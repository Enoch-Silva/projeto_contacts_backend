const Sequelize = require("sequelize");
const db = require("../db/connection");

const Contact = db.define("Contact", {
  name: {
    type: Sequelize.STRING,

  },
  number: {
    type: Sequelize.INTEGER,

  },
  email: {
    type: Sequelize.STRING,
  },
});

module.exports = Contact;
