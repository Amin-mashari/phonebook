const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./database/User");

function initialize(passport) {
  const authenticateUser = async (codeMeli, password, done) => {
    const user = await User.getUser(codeMeli);

    if (user == null) {
      return done(null, false, { message: "no user with that codeMeli" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(
    new localStrategy({ usernameField: "codeMeli" }, authenticateUser)
  );

  passport.serializeUser((user, done) => done(null, user.codeMeli));
  passport.deserializeUser((codeMeli, done) => {
    done(null, User.getUser(codeMeli));
  });
}

module.exports = initialize;
