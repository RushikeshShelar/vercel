import { S3 } from "aws-sdk"
import fs from "fs";

const s3 = new S3({
    accessKeyId: "40b975a406bb32372a86b160708621be",
    secretAccessKey: "72fb8a4f428bdf52e1903ef2b1a09b26d3134dc2e6487aefc80c94e6a01a83a2",
    endpoint: "https://421818089520ad8f5c1bdcb48f02ce8f.r2.cloudflarestorage.com"
});


export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
}