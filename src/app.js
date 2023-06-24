import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import displayRoutes from "express-routemap";
import cors from "cors";
import morgan from "morgan";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import __dirname from "./utils/index.js";
import { swaggerOpts } from "./config/swagger.config.js";
import { logger, stream } from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT;

const PORT_APP = Number(PORT) || 5000;
// const DB_HOST_ENV = "mongodb";
const DB_HOST_ENV = "localhost";
const DB_PORT = 27017;
const DB_NAME = "MongoDBAdoptMe";

export const MONGO_URL = `mongodb://${DB_HOST_ENV}:${DB_PORT}/${DB_NAME}`;

console.log("🚀 ~ file: app.js:19 ~ MONGO_URL:", MONGO_URL);

const connection = mongoose
  .connect(`${MONGO_URL}`)
  .then((conn) => {
    logger.info(`🚀 ~ file: app.js:25 ~ CONECT WITH MONGO URL:`);
  })
  .catch((err) => {
    logger.info("🚀 ~ file: app.js:28 ~ err:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `*`,
    methods: ["GET", "PUT", "DELETE", "POST"],
  })
);
app.use(morgan("../logs", { stream }));

const specs = swaggerJSDoc(swaggerOpts);

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/docs/", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT_APP, () => {
  displayRoutes(app);
  logger.info(`Listening on ${PORT_APP}`);
});
