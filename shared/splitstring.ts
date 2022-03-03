/**
 * This helper function is used to split a string into multiple words.
 * It splits the string at spaces.
 * Within quotation marks, it ignores spaces and reads the string as one word.
 * The quotation marks are removed from the string.
 * If there is a quotation mark standing alone, the input string is not valid.
 * Therefore, the function returns an empty array.
 * @returns The array of strings.
 */
export function splitString(str: string): string[] {
  let result: string[] = [];
  let currentWord: string = "";
  let inQuotation: boolean = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\"" || str[i] === "'") {
      if (inQuotation) {
        inQuotation = false;
        result.push(currentWord);
        currentWord = "";
      } else {
        inQuotation = true;
      }
    } else if (str[i] === " " && !inQuotation) {
      if (currentWord !== "") {
        result.push(currentWord);
      }
      currentWord = "";
    } else {
      currentWord += str[i];
    }
  }
  if (inQuotation) {
    return [];
  }
  if (currentWord !== "") {
    result.push(currentWord);
  }
  return result;
}
