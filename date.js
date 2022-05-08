// this shows what will be exported from this date.js module

exports.getDate = function() {

  const today = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return today.toLocaleDateString("ko-KR", options);
}


exports.getDay = function() {

  const today = new Date();
  const options = {
    weekday: 'long',
  };

  return today.toLocaleDateString("ko-KR", options);
}
