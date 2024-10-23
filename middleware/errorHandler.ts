import { Context } from "https://deno.land/x/oak/mod.ts";
import { AppError } from "../types/index.ts"; // Adjust the import path as necessary

const errorHandler = async (context: Context, next: () => Promise<unknown>) => {
  try {
    // Try executing the next middleware or route handler
    await next();
  } catch (err) {
    // Check if the error is an instance of AppError
    const error = err instanceof AppError ? err : new AppError("Internal Server Error", 500);

    console.error("Error caught:", error.message); // Log the error message
    console.error(error.stack); // Log the stack trace for debugging

    // Set the status and response body based on the error
    context.response.status = error.status; // Use the status from AppError
    context.response.body = {
      message: error.message || "Internal Server Error", // Set the message
    };
  }
};

export default errorHandler;
