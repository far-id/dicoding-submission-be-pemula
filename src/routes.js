import {
  createNewBooks,
  deleteBookById,
  getAllBooks,
  getDetailBookById,
  updateBookById,
} from "./handler.js";

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBookById,
  },
  {
    method: 'POST',
    path: '/books',
    handler: createNewBooks,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookById,
  },
  {
    method: 'delete',
    path: '/books/{bookId}',
    handler: deleteBookById,
  },
];

export default routes;
