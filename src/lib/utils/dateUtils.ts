/**
 * Returns a date string in hh:mm:ss format.
 */
export function getDate() {
    var date = new Date();
    var dateStr = date.toTimeString().substring(0,9);
    return dateStr;
  }