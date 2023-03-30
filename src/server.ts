import express from "express";

import router from "./router";
import morgan from "morgan";

import cors from "cors";
import { checkToken } from "./modules/auth";
import { createUser, login } from "./handlers/user";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log(req["item"]);

  res.status(200);
  res.json({ msg: "hi", ir: req.i });
});

app.use("/api", checkToken, router);
app.post("/user", createUser);
app.post("/signin", login);

app.use((err, req, res, next) => {
  if (err.type == "auth") {
    res.status(401).json({ message: "unauthorisedd" });
  } else if (err.type == "input") {
    res.status(400).json({ message: "invalid input" });
  } else {
    res.status(500).json({ message: "Sry try again later" });
  }
});
export default app;
