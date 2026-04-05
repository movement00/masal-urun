import { get, set, keys, del } from "idb-keyval";
import type { GeneratedBook } from "../types";

const PREFIX = "book_";

export async function saveBook(book: GeneratedBook): Promise<void> {
  await set(PREFIX + book.id, book);
}

export async function getBook(id: string): Promise<GeneratedBook | undefined> {
  return await get(PREFIX + id);
}

export async function getAllBooks(): Promise<GeneratedBook[]> {
  const allKeys = await keys();
  const bookKeys = allKeys.filter(k => typeof k === "string" && k.startsWith(PREFIX));
  const books: GeneratedBook[] = [];
  for (const key of bookKeys) {
    const book = await get(key);
    if (book) books.push(book as GeneratedBook);
  }
  return books.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getBooksByCategory(categoryId: string): Promise<GeneratedBook[]> {
  const all = await getAllBooks();
  return all.filter(b => b.categoryId === categoryId);
}

export async function deleteBook(id: string): Promise<void> {
  await del(PREFIX + id);
}

export async function getPreviousTitles(categoryId: string): Promise<string[]> {
  const books = await getBooksByCategory(categoryId);
  return books.map(b => b.concept.baslik);
}
