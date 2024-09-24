import { createServer } from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router.js";

dotenv.config();
const ORIGIN = process.env.ORIGIN;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ORIGIN }));
router(app);

const server = createServer(app);

const PORT = 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
