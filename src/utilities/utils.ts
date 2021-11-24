import fs from "fs"
import path from "path"
import joi, {string} from "joi"

export const entryValidation = (data: author) => {
    const structure = joi.object({
        author: joi.string().required(),
        age: joi.number().required(),
        address: joi.string().required(),
        books: joi.array().required(),
    }).unknown();
    return structure.validate(data)
}

export const enteredValidation = (data: books) => {
        const structure = joi.object({
            name: joi.string().required(),
            isPublished: joi.boolean().required(),
            serialNumber: joi.number().required(),

        }).unknown();
    return structure.validate(data)
}

export interface author{
    id ? : number,
    author : string,
    dateRegistered: Date,
    age: number,
    address: string,
    books: {[key:string]:string|number}
}


export interface books{
    id ? : string,
    name: string,
    isPublished: Boolean,
    datePublished: Date | null,
    serialNumber: Date | null
}

const filePath = path.join(__dirname, "../database.json");

export function readFile() {
    try{
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    }catch (error) {
        return [];
    }
}

export function generateBookID (book: books[]): books[] {
    return book.map((book : books, i)  => {
        return {
        id : `book${i + 1}`,...book
        }
    })
}

export function writeFile(data: author[]){
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}