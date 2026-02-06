const rs = require("text-readability");

function getFleschKincaidGrade(text) {
  return rs.fleschKincaidGrade(text);
}

module.exports = { getFleschKincaidGrade };