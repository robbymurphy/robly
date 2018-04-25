const { expect } = require('chai');
const slugGenerator = require('../src/slugGenerator');

describe('slugGenerator', () => {
  it('should generate a random 6-digit slug', () => {
    const slug1 = slugGenerator();
    const slug2 = slugGenerator();

    expect(slug1).to.not.equal(slug2);
    expect(slug1.length).to.equal(6);
    expect(slug2.length).to.equal(6);
  });
});