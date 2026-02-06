// Readability service - wraps the text-readability library
// This gives us the Flesch-Kincaid grade level for any block of text
const rs = require("text-readability").default;

/**
 * Returns the Flesch-Kincaid grade level for the given text.
 * We use this to check if the LLM's simplified output is actually
 * simple enough (target is grade 8 or lower).
 */
function getFleschKincaidGrade(text) {
  return rs.fleschKincaidGrade(text);
}

module.exports = { getFleschKincaidGrade };
