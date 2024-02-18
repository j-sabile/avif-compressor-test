import express from "express";

const app = express();

app.get("/", (req,res) => res.send("TEST PORT 3000"));

app.listen(3000, console.log(`Listening to Port 3000`));
