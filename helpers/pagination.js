module.exports = (objectPagination, query, countProduct) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;

  const totalPages = Math.ceil(countProduct / objectPagination.limitItem);
  objectPagination.totalPages = totalPages;

  return objectPagination;
};
