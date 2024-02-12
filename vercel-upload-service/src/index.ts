import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";

import { generate } from "./utils";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";

// initialise a Redis Publisher
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1).replace(/\\/g, "/"), file);
    });

    publisher.lPush("build-queue",id);

    publisher.hSet("status", id, "uploaded");

    const value = await publisher.hGet("status", id);

    res.json({
        id: id
    });
})

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    });
})

app.listen(PORT, () => {
    console.log("Server Running on Port ", PORT);
})


