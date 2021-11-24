import express from "express"
import { getAllAuthors, postAuthors, updateAuthor ,getAuthor, deleteAuthor, postBook, getABook, updateBook, deleteBook} from "../controller/authorsController"
const router = express.Router();

router.get('/', getAllAuthors);//To get all the authors
router.get('/:id', getAuthor);// To get a particular Author
router.get('/:id/books/:bookId', getABook)// To get a particular bookId
router.post('/', postAuthors)// To post new Authors
router.post('/:id/books', postBook)// To post in books array
router.put('/:id', updateAuthor);// To Update an Author
router.put('/:id/books/:bookId', updateBook) // To Update bookId
router.delete('/:id', deleteAuthor); // To delete an author
router.delete('/:id/books/:bookId', deleteBook); // To delete a particular book

export default router;