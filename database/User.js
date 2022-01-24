const res = require("express/lib/response");
const UserSchama = require("./UserSchema");

class User {
  isUserExist() {}

  addUser(data) {
    console.log(data);

    const user = new UserSchama();
    user.collection.insertOne(data, (err, collection) => {
      if (err) throw console.log(err.message);
      console.log("Record inserted Successfully");
      return true;
    });
  }

  async getUser(codeMeli) {
    const user = await UserSchama.find({});
    let result = null;
    user.forEach((user) => {
      if (user.codeMeli == codeMeli) {
        result = user;
      }
    });
    return result;
  }

  async getUserById(_id) {
    const user = await UserSchama.find({ id: _id });
    let result = null;
    user.forEach((user) => {
      if (user.id == _id) {
        result = user;
      }
    });
    return result;
  }

  async getUserId(codeMeli) {
    const user = await UserSchama.find({});
    let result = null;

    user.forEach((user) => {
      if (user.codeMeli == codeMeli) result = user.id;
    });
    return result;
  }

  async getUserPhones(id) {
    const user = await UserSchama.find({});
    let result = null;
    user.forEach((user) => {
      if (user.id == id) result = (user.telephone, user.cellphone);
    });
    return result;
  }
  async addphone(id, phone) {
    console.log(`59 User Id:${id}`);
    console.log(`59 User phone:${phone}`);
    if (
      (phone) => {
        //is cellphone
        return true;
      }
    ) {
      //add cellphone
      this.addCellphone(id, phone);
    } else {
      //add tellephone
      this.addTelephone(id, phone);
    }
  }

  addCellphone(_id, phone) {
    console.log(`cellphone id ${_id}`);
    UserSchama.findOneAndUpdate(
      { id: _id },
      { $addToSet: { cellphone: phone } },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
          console.log("Cell phone ADDED");
        }
      }
    );
  }

  addTelephone(_id, phone) {
    console.log(`telephone id ${_id}`);
    UserSchama.findOneAndUpdate(
      { id: _id },
      { $addToSet: { telephone: phone } },

      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
          console.log("TELL phone ADDED");
        }
      }
    );
  }
}

module.exports = new User();
