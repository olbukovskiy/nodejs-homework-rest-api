const checkFavoriteType = (someStr) => {
  if (someStr === "true") return true;
  if (someStr === "false") return false;
  return someStr;
};

module.exports = checkFavoriteType;
