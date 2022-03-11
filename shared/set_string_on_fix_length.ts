/**
 * This function sets a string on a given length.
 * If the string is bigger than the fixLength it is cut.
 * If not, the missing chars are filled with spaces. 
 * @param {string} input the string to set on the fixLength
 * @param {number} fixLength the requested length of the string
 * @returns {string} the result string with the given length
 * @category Helper
 */
export function setStringOnFixLength(input: string, fixLength: number): string {
  if (input.length > fixLength) {
    return input.substring(0, fixLength);
  } else {
    const spacesToAdd = fixLength - input.length;
    for (let i = 0; i < spacesToAdd; i++) {
      input += "\u00A0";
    }
    return input;
  }
}