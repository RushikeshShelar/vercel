
import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.ACCESS_ID);
console.log(process.env.SECRET_ACCESS_KEY);
console.log(process.env.ENDPOINT);


const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();


async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            5000
          );
        // @ts-ignore;
        const id = res.element
        
        await downloadS3Folder(`output/${id}`);
        await buildProject(id);
        await copyFinalDist(id);

        publisher.hSet("status", id, "deployed");
    }
}
main();