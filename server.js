import express from "express";
import { config } from "dotenv";
import { connectDb } from "./db/connection.js";
import { userRouter } from "./routes/userRoute.js";
import cors from "cors";
import { blogRoute } from "./routes/blogRoute.js";
config();

connectDb(process.env.MONGO_URI).then(() =>
  console.log("database connected☘️")
);
const PORT = process.env.PORT || 8000;
const app = express();

//& middlewares
app.use(cors({ origin: [process.env.URL, "http://localhost:5173"] }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.get("/", (req, res) => {
  return res.send("Hello");
});
app.use("/api/user", userRouter);
app.use("/api/blog", blogRoute);
if (process.env.PORT) {
  app.listen(PORT, () => console.log(`Server is listening on ${PORT}🚀`));
}
export default app;
