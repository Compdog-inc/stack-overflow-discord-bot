import { readFile, writeFile } from "fs/promises";

export const readGuilds = async ()=>{
    try{
    const fl = await readFile('./guilds.json');
    return JSON.parse(fl.toString('utf8'));
    } catch{
        await writeGuilds({});
        return {};
    }
};

export const writeGuilds = async(obj:any)=>{
    await writeFile('./guilds.json', JSON.stringify(obj), {encoding:'utf8'});
};