const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const db = require("./db/connection");
const Contact = require("./models/Contact");

db.authenticate()
  .then(() => {
    console.log("conectado ao banco com sucesso!");
  })
  .catch((err) => {
    console.log("Ocorreu um erro ao conectar", err);
  });

const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ESTA É A ROTA PRINCIPAL DA APLICAÇÃO!");
});

app.use("/contacts", require("./routes/contacts"));

app.use(express.json());

app.listen(PORT, () => {
  console.log("rodando em - http://localhost:3000");
});
