function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomNumber (minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
  };

  function areKeysNumeric(obj) {
    return Object.keys(obj).every(key => !isNaN(Number(key)));
  }



module.exports = {capitalizeFirstLetter,getRandomNumber , areKeysNumeric}