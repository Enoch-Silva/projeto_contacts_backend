const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/teste", (req, res) => {
  res.send("ESTA É UMA ROTA DE TESTE DA NOSSA APLICAÇÃO!");
});

//rota pa vizualizar todos os contactos
router.get("/list", async (req, res) => {
  let search = req.query.searchForm;
  let query = "%" + search + "%";

  if (!search) {
    try {
      const contacts = await Contact.findAll({ order: [["name", "ASC"]] });

      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    try {
      const contacts = await Contact.findAll({
        where: { name: { [Op.like]: query } },
        order: [["name", "ASC"]],
      });

      res.status(200).json({ contacts, search });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
});

// add contacto via post
router.post("/add", (req, res) => {
  let { name, number, email } = req.body;

  var erros = [];

  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
  ) {
    res.send({ message: "Insira um nome válido!" });
  }

  if (
    !req.body.number ||
    typeof req.body.number == undefined ||
    req.body.number == null
  ) {
    res.send({ message: "Insira um numero válido!" });
  }

  if (req.body.number.length < 9) {
    return res.send({ message: "O numero tem que ter ao menos 9 caracteres!" });
  }

  if (erros.length > 0) {
    res.send(message, erros);
  } else {
    Contact.create({
      name,
      number,
      email,
    })
      .then(() => res.send({ message: "Contacto adicionado com sucesso!" }))
      .catch((err) => console.log(err));
  }
});

//rota para ver apenas o contacto selecionado
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const contact = await Contact.findByPk(id);

    if (!contact) {
      res.status(422).json({ message: "O contacto não foi encontrado!" });
      return;
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//rota para apagar apenas o contacto selecionado
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findByPk(id);

  if (!contact) {
    res.status(422).json({ message: "O contacto não foi encontrado!" });
    return;
  }

  Contact.destroy({
    where: {
      id: id,
    },
  })
    .then(() => res.send({ message: "Contacto apagado com sucesso!" }))
    .catch((err) => console.log(err));
});

//rota para atualizar um contacto selecionado
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  var erros = [];

  if (!req.body.name || req.body.name == null) {
    return res.send({ message: "Insira um novo nome!" });
  }

  if (!req.body.number || req.body.number == null) {
    return res.send({ message: "Insira um novo numero!" });
  }

  if (erros.length > 0) {
    res.send(message, erros);
  } else {
    Contact.findByPk(id)
      .then((contact) => {
        contact.name = req.body.name;
        contact.number = req.body.number;
        contact.email = req.body.email;
        return contact.save();
      })
      .then(() => res.send({ message: "Contacto atualizado com sucesso!" }))
      .catch((err) => console.log(err));
  }
});

module.exports = router;
