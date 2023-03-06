function checkFieldType(str) {
  const keys = ["email", "phone", "name"];
  const matchingKeys = [];

  keys.forEach((key) => {
    if (str.includes(key)) {
      matchingKeys.push(key);
    }
  });

  return matchingKeys.join(", ");
}

module.exports = checkFieldType;
