const express = require("express");
const router = express.Router();
const User = require("../database/User");
const path = require("path");

//phone numbers
// let numbers = [];

//page
router.get("/:id", async (req, res) => {
  console.log("GET");
  const user = await User.getUserById(req.params.id);
  res.render(path.resolve("src/views/phoneListPage.ejs"), {
    id: req.params.id,
    telephone: user.telephone,
    cellphone: user.cellphone,
    phone: null,
  });
});

router.post("/:id", async (req, res) => {
  console.log("POST");
  phone = req.body.phone;
  // numbers.push(phone);

  try {
    const user = await User.getUserById(req.params.id);
    //add to data base
    User.addphone(req.params.id, phone);
    //show in html
    res.render(path.resolve("src/views/phoneListPage.ejs"), {
      id: req.params.id,
      telephone: user.telephone,
      cellphone: user.cellphone,
      phone: phone,
    });
    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
