import { nanoid } from "nanoid";
import books from "./books.js";

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBook = books;
  if (name !== undefined) filteredBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  if (reading === '1') filteredBook = books.filter((book) => book.reading === true);
  if (reading === '0') filteredBook = books.filter((book) => book.reading === false);
  if (finished === '1') filteredBook = books.filter((book) => book.finished === true);
  if (finished === '0') filteredBook = books.filter((book) => book.finished === false);

  return h.response({
    status: 'success',
    data: {
      books: filteredBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
};

const getDetailBookById = (request, h) => {
  const book = books.filter((b) => b.id === request.params.bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const createNewBooks = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined || readPage > pageCount) {
    const message = name === undefined ? 'Gagal menambahkan buku. Mohon isi nama buku'
      : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
    const response = h.response({
      status: 'fail',
      message,
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const updateBookById = (request, h) => {
  const index = books.findIndex((book) => book.id === request.params.bookId);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  if (name === undefined || readPage > pageCount) {
    const message = name === undefined ? 'Gagal memperbarui buku. Mohon isi nama buku'
      : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
    const response = h.response({
      status: 'fail',
      message,
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const index = books.findIndex((book) => book.id === request.params.bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

export {
  getAllBooks,
  createNewBooks,
  getDetailBookById,
  updateBookById,
  deleteBookById,
};
