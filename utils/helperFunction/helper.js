function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomNumber (minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
  };

  function areKeysNumeric(obj) {
    return Object.keys(obj).every(key => !isNaN(Number(key)));
  }

  function isISODate(str) {
    // ISO date format pattern: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ
    var isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$/;
  
    return isoDatePattern.test(str);
  }


module.exports = {capitalizeFirstLetter,getRandomNumber , areKeysNumeric,isISODate}