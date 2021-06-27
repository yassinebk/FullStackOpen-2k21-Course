const palindrome = (string) => string.split("").reverse().join("");

const average = (array) => {
  const reducer = (sum, item) => sum + item;
  return array.reduce(reducer, 0);
};

module.exports = { palindrome, average };
