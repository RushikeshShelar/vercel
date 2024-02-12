import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: "40b975a406bb32372a86b160708621be",
    secretAccessKey: "72fb8a4f428bdf52e1903ef2b1a09b26d3134dc2e6487aefc80c94e6a01a83a2",
    endpoint: "https://421818089520ad8f5c1bdcb48f02ce8f.r2.cloudflarestorage.com"
});


const PORT = process.env.PORT || 3001;
const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: 'vercel',
        Key: `dist/${id}/${filePath}`
    }).promise();

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type);
    res.send(contents.Body);
});

app.listen(PORT, () => {
    console.log("Server Running on Port:", PORT);

})