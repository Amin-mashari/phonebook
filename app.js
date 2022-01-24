const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const path = require("path");

const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const router = express.Router();
const User = require("./database/User");

const initializePassport = require("./passport-config");
initializePassport(passport);

const app = express();
const port = 3000;

const urlEncodeParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(path.join(__dirname, "/public")));
// app.use(express.cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "html");
app.use(flash());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "anything",
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/phone", checkAuthenticated, require("./route/phone.js"));

app.get("/", (req, res) => {
  res.set({
    "Access-control-Allow-Origin": "*",
  });
  res.redirect("/login");
});

// app.post("/login", async function (req, res) {
//   //flash error handler
//   //
//   const codeMeli = req.body.codeMeli;
//   const password = req.body.password;
//   console.log(`app 47`);
//   console.log(codeMeli);
//   console.log(password);
//   // console.log(data.codeMeli);
//   const user = await User.find({}, "codeMeli telephone cellphone");
//   let find = false;
//   let _id;

//   user.forEach((user) => {
//     if (user.codeMeli == codeMeli) {
//       _id = user.id;
//       find = true;
//       console.log(
//         `app 59\ncode in by${codeMeli} AND in loop code :${user.codeMeli}`
//       );
//       // console.log(`59\n${user.id}`);
//     }
//   });
//   console.log(`63\n${_id}`);

//   if (!find) {
//     console.log("64 \n not found! signup");
//   } else return res.sendFile(path.resolve("src/front/phoneListPage.html"));
// });

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render(__dirname + "/views/login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res) => {
    const id = await User.getUserId(req.body.codeMeli);
    res.redirect(`/phone/${id}`);
  }
);

app.get("/register", (req, res) => {
  res.render(__dirname + "/views/register.ejs");
});

app.post(
  "/register",
  urlEncodeParser,
  [
    check("firstName", "name not in form").exists().isLength({ min: 5 }),
    check("telephone", "telephnoe not correct").exists().isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // const alert = errors.array();
      // res.render("register", {
      //   alert,
      // });
    }

    try {
      const hashedPass = await bcrypt.hash(req.body.password, 10);

      // console.log(req.body)
      const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fatherName: req.body.fatherName,
        codeMeli: req.body.codeMeli,
        password: hashedPass,
        cellphone: [req.body.cellphone],
        telephone: [req.body.telephone],
      };

      console.log(data);
      User.addUser(data);

      console.log("redirect login");
      res.redirect("/login");
    } catch {
      res.redirect("/register");
    }
    console.log("done! 116");
  }
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/phone");
  }
  next();
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
