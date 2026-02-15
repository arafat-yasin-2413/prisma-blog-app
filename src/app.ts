import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'
import { commentRouter } from "./modules/comment/comment.route";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app : Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}))
app.use(express.json());

app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", (req, res)=>{
    res.send("Hello World")
});

app.use(errorHandler);
app.use(notFound)

export default app