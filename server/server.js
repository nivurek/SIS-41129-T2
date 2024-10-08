import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import connectDB from "./db/connection.js";

const PORT = process.env.PORT || 5050;
const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});