import { exec } from "child_process";
import path from "path";

export async function buildProject(id: string){
    return new Promise((resolve) => {
        try {
            const child = exec(`cd ${path.join(__dirname,`output/${id}`).replace(/\\/g,"/")} && npm install && npm run build`);
    
            child.stdout?.on("data", (data) =>{
                console.log("Stdoout:", data);
            })
    
            child.stderr?.on("data", (data) =>{
                console.log("Stderr:", data);
            })
    
            child.on("close", () => {
                resolve("");
            })
            
        } catch (error) {
            const path1 = `${path.join(__dirname,`output/${id}`)}`;
            console.log(path1);
        }
        
    });
}