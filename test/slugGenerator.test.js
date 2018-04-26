const { expect } = require('chai');
const slugGenerator = require('../src/slugGenerator');

describe('slugGenerator', () => {
  it('should generate a random slug', () => {
    // Arrange/Act
    const slug1 = slugGenerator();
    const slug2 = slugGenerator();

    // Assert
    expect(slug1).to.not.equal(slug2);
  });
});