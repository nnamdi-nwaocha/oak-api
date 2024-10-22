import { Router } from "@oak/oak/router";
import type { Book } from "../types/books.types.ts";
import type { CreateBookDTO } from "../dto/book.dto.ts";
const kv = await Deno.openKv();

const bookRouter = new Router;

bookRouter.get('/books', async (context) => {
    const entries = kv.list({ prefix: ["books"] });
    console.log(entries)
    const books: Book[] = []
    for await (const entry of entries) {
        books.push(entry.value as Book)
    }
    context.response.body = books;
})

bookRouter.post("/books", async (context) => {
    const body: CreateBookDTO = await context.request.body.json();
    const uuid = crypto.randomUUID();
    if (!body.title || !body.author || !body.description) {
        context.response.status = 400; // Bad Request
        context.response.body = { message: "Missing required fields" };
        return;
    }


    const newBook: Book = {
        id: uuid,
        ...body,
    };

    const result = await kv.set(["books", uuid], newBook);
    console.log(result)

    context.response.status = 201; // Created
    context.response.body = { message: "Book added", book: newBook };
});

bookRouter.get('/books/:id', async (context) => {
    const id = context.params.id;
    const entry = await kv.get(["books", id]);
    const book = entry.value
    if (book) {
        context.response.body = book as Book;
    } else {
        context.response.status = 404;
        context.response.body = { message: "Book not found" };
    }
})

bookRouter.put('/books/:id', async (context) => {
    const id = context.params.id;
    const body: Partial<CreateBookDTO> = await context.request.body.json();
    const entry = await kv.get(["books", id]);
    const book = entry.value;
    if (!book) {
        context.response.status = 404;
        context.response.body = { message: "Book not found" };
        return;
    }

    const updatedBook = { ...book, ...body };
    const result = await kv.set(["books", id], updatedBook);
    console.log(result.ok)

    context.response.status = 200;
    context.response.body = { message: "Book updated", book: updatedBook };
})

bookRouter.delete("/books/:id", async (context) => {
    const id = context.params.id;

    const entry = await kv.get(["books", id]);
    const book = entry.value;

    if (!book) {
        context.response.status = 404;
        context.response.body = { message: "Book not found" };
        return;
    }

    await kv.delete(["books", id]);
    context.response.status = 200;
    context.response.body = { message: "Book deleted", book };
});


export { bookRouter }