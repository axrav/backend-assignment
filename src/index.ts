import express from "express";
import router from "./routes/routes";
import { startScheduler } from "./scheduler/scheduler";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();

startScheduler();

app.use("/coins", router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is up on port ${process.env.PORT || 3000}`);
});

