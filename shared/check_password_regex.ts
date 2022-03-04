/**
 * Function to check if the entered password does fulfill the requirements.
 * The missing requirements are returned as a string. If the requirements are fulfilled, an empty string is returned.
 * The requirements are:
 * - at least 8 characters long
 * - at least one number
 * - at least one uppercase letter
 * - at least one lowercase letter
 * - at least one of the following special characters: ! * # , ; ? + - _ . = ~ ^ % ( ) { } | : " /
 * - only alphanumeric characters and the special characters mentioned above
 * @param password the Password to check
 * @returns the feedback message (empty if password is valid)
 * @category Helper
 */
export function checkPasswordOnRegex(password: string): string {
 let feedbackMessage = "";
 const atLeast8Characters: boolean = password.length >= 8;
 const atLeastOneNumber: boolean = password.match(/[0-9]/) ? true : false;
 const atLeastOneUppercaseLetter: boolean = password.match(/[A-Z]/) ? true : false;
 const atLeastOneLowercaseLetter: boolean = password.match(/[a-z]/) ? true : false;
 const specialCharacters = `!*#,;?+-_.=~^%(){}|:"/`;
 const atLeastOneSpecialCharacter: boolean = password.match(/[!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/]/) ? true : false;
 const onlyValidCharacters: boolean = password.match('^[a-z,A-Z,0-9,!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/]*$') ? true : false;
 if (atLeast8Characters && atLeastOneNumber && atLeastOneUppercaseLetter && atLeastOneLowercaseLetter && atLeastOneSpecialCharacter && onlyValidCharacters) {
   return feedbackMessage;
 } else {
   feedbackMessage = "Following requirements missing: ";
   const bulletPoint = `\n●`;
   if (!atLeast8Characters) {
     feedbackMessage += ` ${bulletPoint} at least 8 characters  `;
   }
   if (!atLeastOneNumber) {
     feedbackMessage += ` ${bulletPoint} at least one number  `;
   }
   if (!atLeastOneUppercaseLetter) {
     feedbackMessage += ` ${bulletPoint} at least one uppercase letter  `;
   }
   if (!atLeastOneLowercaseLetter) {
     feedbackMessage += ` ${bulletPoint} at least one lowercase letter  `;
   }
   if (!atLeastOneSpecialCharacter) {
     feedbackMessage += ` ${bulletPoint} at least one of the following special characters: ${specialCharacters.split('').join(' ')}  `;
   }
   if (!onlyValidCharacters) {
     feedbackMessage += ` ${bulletPoint} only alphanumeric characters and the following special characters: ${specialCharacters.split('').join(' ')}  `;
   }
 }
 return feedbackMessage;
}