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
        user.id = doc.id;
        return user;
      });
      res.send(userArray);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export function postNewUser(req, res) {
  //email .toLowerCase()
  if (!req.body) {
    res.status(401).send("Invalid request");
    return;
  }
  const db = connectDb();
  db.collection("users")
    .add(req.body)
    .then((doc) => {
      res.send("user added" + doc.id);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!req.body) {
    res.status(401).send("Invalid request");
    return;
  }
  const db = connectDb();
  const userCol = await db
    .collection("users")
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get();
  const user = userCol.docs[0].data();
  //is user id sent back in data?  or do I need to extract it w doc.id
  if (!user) {
    res
      .status(400)
      .send({ error: "Invalid Email or Password, please try again." });
    return;
  }
  user.password = undefined;
  const token = jwt.sign(user, mySecretKey, { expiresIn: "90d" });
  res.send({ token });
}

export async function checkin(req, res) {
  if (!req.body) {
    res.status(401).send("Invalid request");
    return;
  }

  const db = connectDb();
  const userCol = await db.collection("users").post();
}
