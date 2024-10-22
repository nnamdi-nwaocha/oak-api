import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { bookRouter } from "./routes/book.routes.ts";


const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Books Books Books!</title><head>
      <body>
        <h1>We love books!</h1>
      </body>
    </html>
  `;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(bookRouter.routes());
app.use(bookRouter.allowedMethods());

app.listen({ port: 3000 });
