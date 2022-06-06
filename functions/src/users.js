import connectDb from "../connectDb.js";

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

export function postUser(req, res) {
  if (!req.body) {
    res.status(401).send("Invalid request");
    return;
  }
  const db = connectDb();

  db.collection("users")
    .add(req.body)
    .then((doc) => {
      res.send("Sent!" + doc.id);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}
