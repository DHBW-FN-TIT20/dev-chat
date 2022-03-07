/**
 * This function is used to create a date object from a string in german format.
 * @param {string} germanString The string which should be converted to a date. Pattern: "DD.MM.YYYY-HH:MM".
 * @returns {Date} the result date (null indicates string is in wrong format)
 * @category Helper
 */
export function getDateByGermanString(germanString: string): Date | null {

  if (germanString === undefined || germanString === "" || germanString === null || germanString.length !== 16) {
    return null;
  }

  const day: number = parseInt(germanString.substring(0, 2));
  const month: number = parseInt(germanString.substring(3, 5));
  const year: number = parseInt(germanString.substring(6, 10));
  const hour: number = parseInt(germanString.substring(11, 13));
  const minute: number = parseInt(germanString.substring(14, 16));

  if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}