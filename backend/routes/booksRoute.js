import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();


// Route to save a new book
router.post('/', async (request, response) => {
    try {
        if (!request.body.title ||
            !request.body.author ||
            !request.body.publishYear) {
            return response.status(400).send({
                message: "Send all required fields"
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };

        const book = await Book.create(newBook);
        return response.status(201).send(book);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

// Route to get all Books from database
router.get('/', async (request, response) => {
    try {
        const books = await Book.find({}); // Passing an empty object as argument to retrieve all the books
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
})


// Route to get a single book by ID
router.get('/:id', async (request, response) => {
    try {
        const book = await Book.findById(request.params.id);
        if (!book) {
            return response.status(404).send({ message: "Book not found" });
        }
        return response.status(200).send(book);
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}
);

// Route to update a book by ID
router.put('/:id', async (request, response) => {
    try {
        if (!request.body.title ||
            !request.body.author ||
            !request.body.publishYear) {
            return response.status(400).send({ message: "Send all required fields" });
        }
        const { id } = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).send({ message: "Book not found" });
        }

        return response.status(200).send({ message: "Book updated successfully" });
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
});

// Route to delete a book by ID
router.delete('/:id', async (request, response) => {
    try {
        const result = await Book.findByIdAndDelete(request.params.id);
        if (!result) {
            return response.status(404).send({ message: "Book not found" });
        }
        return response.status(200).send({ message: "Book deleted successfully" });
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
});

export default router;