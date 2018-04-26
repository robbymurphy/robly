const allCharacters = [];
const slugLength = 7;

function fillCharArray(startChar, endChar) {
  for(let i = startChar.charCodeAt(0); i <= endChar.charCodeAt(0); i++) {
    allCharacters.push(String.fromCharCode(i));
  }
}

function randChar() {
  return allCharacters[Math.floor(Math.random() * allCharacters.length)];
}

// map [A-Z][a-z][0-9] into lookup array
fillCharArray('a', 'z');
fillCharArray('A', 'Z');
fillCharArray('0', '9');

// poor man's slug generation, we can be smarter about this!
module.exports = function() {
  let slug = '';
  for(let i = 0; i < slugLength; i++) {
    slug += randChar();
  }
  return slug;
};
