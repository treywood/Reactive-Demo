function Http(options) {
  return new Promise(resolve => {
    _.extend(options, {
      success: resolve
    });
    $.ajax(options);
  });
}

Http.get = function(url, options = {}) {
  _.extend(options, {
    method: "GET",
    url: url
  });
  return Http(options);
};

export default Http;
