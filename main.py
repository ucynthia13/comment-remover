import tokenize
from io import BytesIO
import sys

def remove_comments(code):
    result = []
    previous_end = (1, 0)  
    code_bytes = BytesIO(code.encode('utf-8'))

    tokens = tokenize.tokenize(code_bytes.readline)
    for token in tokens:
        token_type = token.type
        token_string = token.string
        starting_line, starting_col = token.start
        ending_line, ending_col = token.end

        if token_type in (tokenize.COMMENT, tokenize.ENCODING):
            continue
        
        if previous_end[0] < starting_line:
            result.append(' ' * starting_col)
        
        elif previous_end[1] < starting_col:

            result.append(' ' * (starting_col - previous_end[1]))

        result.append(token_string)
            
        previous_end = (ending_line, ending_col)

    return ''.join(result)

if __name__ == "__main__":
    input = sys.stdin.read()
    print(remove_comments(input), end='')
