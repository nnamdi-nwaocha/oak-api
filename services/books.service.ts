import type { CreateBookDTO, updateBookDTO } from "../dto/book.dto.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import type { Book } from "../types/books.types.ts";

const db = new DB("books.db");

export function CreateBook(payload: CreateBookDTO): Book | undefined {
    const { title, author, description } = payload
    db.query(
        "INSERT INTO books (title, author, description) VALUES (?, ?, ?)",
        [title, author, description],
    );

    const newBookId = db.lastInsertRowId;
    return getBookById(newBookId)
}

export function getbooks(): Book[] | undefined {
    const books: Book[] = [];
    for (const [id, title, author, description] of db.query("SELECT * FROM books")) {
        books.push({
            id: id as number,
            title: title as string,
            author: author as string,
            description: description as string
        });
    }
    return books.length > 0 ? books : undefined;
}

export function getBookById(id: number): Book | undefined {
    const currentBook = db.query("SELECT title, author, description FROM books WHERE id = ?", [id]);
    const [currentTitle, currentAuthor, currentDescription] = currentBook[0];

    if (currentBook.length === 0) {
        return;
    }
    const book: Book = {
        id: id,
        title: currentTitle as string,
        author: currentAuthor as string,
        description: currentDescription as string
    }
    return book
}

export function updateBook(payload: updateBookDTO): Book | undefined {
    const currentBook = getBookById(payload.id)

    if (!currentBook) {
        return;
    }

    const updatedBook = Object.assign(currentBook, payload.updates)

    // Update the book in the database
    db.query(
        "UPDATE books SET title = ?, author = ?, description = ? WHERE id = ?",
        [updatedBook.title, updatedBook.author, updatedBook.description, payload.id]
    );
    return updatedBook;
}