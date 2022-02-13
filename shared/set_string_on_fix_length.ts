/**
 * This function sets a string on a given length.
 * If the string is bigger than the fixLength it is cut.
 * If not, the missing chars are filled with spaces. 
 * @param {string} input The string which should be cut.
 * @param {number} fixLength The length of the result. 
 * @returns 
 */
export function setStringOnFixLength(input: string, fixLength: number): string {
    if (input.length > fixLength) {
        return input.substring(0,fixLength)
    } else {
        let spacesToAdd = fixLength-input.length;
        for (let i = 0; i < spacesToAdd; i++) {
            input += " "
        }
        return input
    }
}