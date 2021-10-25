def list_to_string(input_list:list):
    return_string = ""
    for word in input_list:
        return_string = return_string + " " + word
    return return_string


class Command:
    def __init__(self, user_input_string) -> None:
        self._command_list = [
            "echo",
            "shout",
            "quit"
        ]
        self._whole_string = user_input_string

        if self._whole_string.split()[0] in self._command_list:
            self._is_valid = True
            self._type = self._whole_string.split()[0]
            argument_list = self._whole_string.split()[1:]
            if argument_list is not None:
                self._argument_list = argument_list
            else:
                self._argument_list = []
        else:
            self._is_valid = False
            self._type = None
            self._argument_list = None

    def is_valid_command(self):
        return self._is_valid
    
    def get_type(self):
        return self._type

    def perform(self):
        if not self.is_valid_command:
            return False
        
        if self._type == "echo":
            return self.__echo()

        elif self._type == "shout":
            return self.__shout()
        
        elif self._type == "quit":
            return self.__quit()

        else:
            return False


    ## command definitions:

    def __echo(self):
        if not self._argument_list == []:
            return list_to_string(self._argument_list)
        else:
            return ""
    
    def __shout(self):
        if not self._argument_list == []:
            return list_to_string(self._argument_list).upper()
        else:
            return ""

    def __quit(self):
        return False


def print_on_console(display_user, message):
    print(display_user, " -> ", message)

noErrorHappend = True

while noErrorHappend:
    user_input = input("> ")

    current_command = Command(user_input)

    noErrorHappend = current_command.is_valid_command()

    if noErrorHappend:
        message = current_command.perform()
        if not message == False:
            print_on_console("bot", message)
        else:
            noErrorHappend = False
