import { _refWithOptions } from "firebase-functions/v1/database";
import jsonwebtoken from "jsonwebtoken";
import connectDb from "../connectDb.js";
import jwt from "jsonwebtoken";
import mySecretKey from "../secret.js";

export function getUsers(req, res) {
  const db = connectDb();
  db.collection("users")
    .get()
    .then((snapshot) => {
      const userArray = snapshot.docs.map((doc) => {
        let user = doc.data();
        user.email = undefined;
        user.password = undefined;

        return user;
      });
      res.send(userArray);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export function postNewUser(req, res) {
  if (!req.body) {
    res.status(401).send("Invalid request");
    return;
  }
  const db = connectDb();
  db.collection("users")
    .add(req.body.newUser)
    .then((doc) => {
      res.send("user added! " + doc.id);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export function login(req, res) {
  const { email, password } = req.body;
  console.log(req.body);
  if (!req.body) {
    res.status(401).send("invalid request");
    return;
  }
  const db = connectDb();

  const userCol = db
    .collection("users")
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get()
    .then((userCol) => {
      if (userCol.docs.length === 0) {
        res
          .status(400)
          .send({ error: "Invalid Email or Password, please try again." });
        return;
      }
      const user = userCol.docs[0].data();
      user.id = userCol.docs[0].id;
      user.password = undefined;

      const newToken = jwt.sign(user, mySecretKey, { expiresIn: "90d" });
      user.token = newToken;

      res.send({ user }); //change to send user object with token, id. use id to patch atCourt
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export function checkIn(req, res) {
  const id = req.body.id;
  if (!req.body) {
    res.status(401).send("Invalid request");
    return;
  }

  const db = connectDb();
  db.collection("users")
    .doc(id)
    .update({ atCourt: true })
    .then(() => {
      res.send("Checked in!");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export function checkOut(req, res) {
  const id = req.body.id;
  if (!req.body) {
    res.status(401).send("Invalid request");
    return;
  }

  const db = connectDb();
  db.collection("users")
    .doc(id)
    .update({ atCourt: false })
    .then(() => {
      res.send("Checked out!");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}
