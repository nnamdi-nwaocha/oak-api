import { Router } from "@oak/oak/router";
import type { CreateBookDTO } from "../dto/book.dto.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import type { Book } from "../types/books.types.ts";
import { CreateBook, getBookById, getbooks, updateBook } from "../services/books.service.ts";
import { AppError } from "../types/index.ts";

const db = new DB("books.db");

db.query(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT
  )
`);

const bookRouter = new Router;

bookRouter.get("/books", (context) => {
    const books = getbooks();
    if (!books) {
        throw new AppError("Books not found", 404);
    }
    context.response.body = { message: "Books retrieved Successfully", books };
});

bookRouter.post("/books", async (context) => {
    const body: CreateBookDTO = await context.request.body.json();
    const createdBook = CreateBook(body);
    if (!createdBook) {
        throw new AppError("Unable to create book", 500);
    }
    context.response.body = { message: "Book created successfully", book: createdBook };
});

bookRouter.put("/books/:id", async (context) => {
    const id = parseInt(context.params.id);
    const body: Partial<CreateBookDTO> = await context.request.body.json();
    const updatedBook = updateBook({ id, updates: body })

    if (!updatedBook) {
        throw new AppError("Could not update book", 500);
    }

    context.response.body = { message: "Book updated successfully", book: updatedBook };
});


bookRouter.get("/books/:id", (context) => {
    const id = parseInt(context.params.id);
    const book = getBookById(id);
    if (!book) {
        throw new AppError("Book not found", 404);
    }
    context.response.body = { message: "Book retrieved successfully", book };
});

bookRouter.delete("/books/:id", (context) => {
    const id = parseInt(context.params.id);
    const book = getBookById(id)
    if (!book) {
        throw new AppError("Book not found", 404);
    }

    db.query("DELETE FROM books WHERE id = ?", [id]);

    context.response.body = { message: "Book deleted successfully", book };
});


export { bookRouter }