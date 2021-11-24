import http, { IncomingMessage, ServerResponse} from 'http'
import express, { NextFunction, Request, Response, json } from "express"
import { author, readFile ,writeFile,} from "../utilities/utils"
import { generateBookID , entryValidation, enteredValidation} from '../utilities/utils';
import { RequestHeaderFieldsTooLarge } from 'http-errors';


const control = express.Router();

// Get Author

export function getAllAuthors(req: Request, res: Response, next: NextFunction) {
    const data = readFile();
    res.status(200).json({message: "status", data})
}

export function getAuthor( req: Request, res: Response, next: NextFunction) {
    // console.log("oo")
    const data = readFile();
    const authorDetails = data.find((val: author) => `${val.id}` === req.params.id);

    if (!authorDetails){
        return res.status(404).json({message: `author with id ${req.params.id} not available`})
    }
    
    res.status(200).json({message: "success" , data: authorDetails})
}

export const getABook = (req: Request, res: Response, next:NextFunction)=>{

    const data = readFile();
    const authorData = data.find((item: author)=> `${item.id}` === req.params.id);
    
    if(!authorData){
    return res.status(404).json({message: `author with the id ${req.params.id} not found`})
    }
    
    const bookData = authorData.books.find((item:author) => `${item.id}` === req.params.bookId)
    
    if(!bookData){
    return res.status(404).json({message: `book with the id ${req.params.bookId} not found`})
    }
    
    res.status(200).json({mesaage: "success", data: bookData})
    
}

export const postBook = (req:Request, res:Response) => {
    const {error} = enteredValidation(req.body);

    if(error){
        return res.status(400).send(error.details[0].message)
    }else{
    const data = readFile();
    let authorFind = data.find(((item: {item:author, id: number})=> `${item.id}` === req.params.id));

    if(!authorFind){
    return res.status(404).json({message:"author does not exist"})
    }
    
    authorFind = {...authorFind,books: [ ...authorFind.books, { id: `book${authorFind.books.length + 1}`, ...req.body } ]
    }
    res.status(201).json({message: "new book added", author: authorFind })
    }
    
    }

export const postAuthors = (req: Request, res: Response, next:NextFunction) => {

    const {error} = entryValidation(req.body);

    if(error){
        return res.status(400).send(error.details[0].message)
    }else{
    const data = readFile();
    const newAuthor = {...req.body, books:generateBookID(req.body.books)}
    const newData = {id: data.length + 1, dateRegistered: new Date().getTime(), ...newAuthor}

    const allNewData = [...data, newData];

    writeFile(allNewData);

    res.status(201).json({message: " new Book Created" , data: newData})
    }
    
}

export const updateAuthor = (req: Request, res: Response, _next: NextFunction) => {
    const data = readFile();
    const UpdatedData = data.find((item: {item:author, id:number}) => `${item.id}` === req.params.id)
    if(!UpdatedData){
        return res.status(404).json({message: "It doesn't exist"})
    }
    const newData = {...UpdatedData, ...req.body};
    const dataIndex = data.findIndex((item: {id:number}) => `${item.id}` === req.params.id)
    data.splice(dataIndex, 1, newData);
    writeFile(data);
    res.status(201).json({mesage: "created new author" , data: newData})
}

export const updateBook = (req: Request, res:Response, next:NextFunction) =>{

    const data = readFile();
    const authorFind = data.find((item: {item:author, id: number})=> `${item.id}` === req.params.id);

    if (!authorFind){
    return res.status(404).json({message: `author with the id ${req.params.authorId} does not exist`})
    }
    
    const bookToUpdate = authorFind.books.find((item: {item:author, id: number})=> `${item.id}` === req.params.bookId)
    
    if (!bookToUpdate){
    return res.status(404).json({message: `book with the id ${req.params.bookId} does not exist`})
    }

    const newData = {...bookToUpdate, ...req.body};
    const dataIndex = authorFind.books.findIndex((item:author) => `${item.id}` === req.params.bookId);
    authorFind.books.splice(dataIndex, 1, newData);
    writeFile(authorFind.books)

    res.status(201).json({messag: "updates a book", data: newData});
}

export const deleteAuthor = (req: Request, res: Response, _next: NextFunction) => {
    const data = readFile();
    const newAuthors = data.filter((item: author) => `${item.id}` !== req.params.id)
    writeFile(newAuthors);
    res.status(201).json({message: `author ${req.params.id} deleted`, data: newAuthors})
}

export const deleteBook = (req:Request, res:Response, next:NextFunction) =>{
    const data = readFile();
    const authorFind = data.find((item: {item:author, id: number})=> `${item.id}` === req.params.authorId);
    
    if(!authorFind){
    return res.status(404).json({message: `author with the id ${req.params.authorId} does not exist`})
    }
    
    const bookToDelete = authorFind.books.find((item: {item:author, id: number})=> `${item.id}` === req.params.bookId)
    
    if(!bookToDelete){
    return res.status(404).json({message: `book with the id ${req.params.bookId} does not exist`})
    }

    const dataIndex = authorFind.books.findIndex((item:{item:author, id: number}) => `${item.id}` === req.params.id);
    authorFind.books.splice(authorFind.books, 1);
    writeFile(data);

    res.status(200).json({message: `Book with the id ${req.params.bookId} has been trashed`})
}
