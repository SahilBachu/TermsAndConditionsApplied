const rs = require("text-readability").default;

function getFleschKincaidGrade(text) {
  return rs.fleschKincaidGrade(text);
}

module.exports = { getFleschKincaidGrade };