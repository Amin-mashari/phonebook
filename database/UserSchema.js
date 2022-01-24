const mongoose = require("mongoose");
const URL = "mongodb://localhost:27017/userdata";
mongoose.connect(URL);
const validate = require("mongoose-validator");

const nameValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 30],
    message: "Name should be between 3 and 30 characters",
  }),
  validate({
    validator: "isAlphanumeric",
    passIfEmpty: true,
    message: "Name should contain alpha-numeric characters only",
  }),
];

const userSchema = mongoose.Schema({
  codeMeli: { type: Number, unique: true, required: true },
  firstName: { type: String, unique: false, required: true },
  lastName: { type: String, unique: false, required: true },
  fatherName: { type: String, unique: false, required: true },
  password: { type: String, unique: false, required: true },
  cellphone: [
    {
      type: String,
      index: true,
      unique: false,
      minLength: 11,
      maxLength: 11,
    },
  ],
  telephone: [
    {
      type: String,
      index: true,
      unique: false,
      minLength: 11,
      maxLength: 11,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
