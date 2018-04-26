const shortid = require('shortid');

const allCharacters = [];
const slugLength = 7;

function fillCharArray(startChar, endChar) {
  for(let i = startChar.charCodeAt(0); i <= endChar.charCodeAt(0); i++) {
    allCharacters.push(String.fromCharCode(i));
  }
}

function randChar() {
  // Generate a random character using a random number in the range of the allCharacters array length.
  return allCharacters[Math.floor(Math.random() * allCharacters.length)];
}

// Map [A-Z][a-z][0-9] into lookup array.
fillCharArray('a', 'z');
fillCharArray('A', 'Z');
fillCharArray('0', '9');

// Poor man's slug generation, we can be smarter about this!
// This approach is a bit naive and may generate slug collisions
// when the number of generated slugs increases.
function slugGenerator() {
  let slug = '';
  for(let i = 0; i < slugLength; i++) {
    slug += randChar();
  }
  return slug;
};

module.exports = shortid.generate;
