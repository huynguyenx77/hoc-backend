module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i"); //* cú pháp trong chức năng tìm kiếm mà chỉ cần nhập từ có trong sản phẩm cần ví dụ iphoneX thì chỉ cần nhập iphone, và tham số i là dùng để không phân biệt chữ hoa hay thường
    objectSearch.regex = regex;
  }
  return objectSearch;
};
