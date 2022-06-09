import functions from "firebase-functions";
import express from "express";
import cors from "cors";

import { getUsers, login, postNewUser } from "./src/users.js";

const app = express();
app.use(cors());
app.use(express.json());

//routes

app.get("/users", getUsers);
app.post("/signup", postNewUser);
app.post("/login", login);

export const api = functions.https.onRequest(app);
