import tokenize
from io import BytesIO

def remove_comments(code):
    result = []
    previous_end = (1, 0)  

    tokens = tokenize.tokenize(BytesIO(code.encode('utf-8')).readline)
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

sample_code = """
def   spaced_out ( a ,   b ) :  # weird spacing
    x = a + b  # inline comment
    y= a* b#commentwithoutspace
    z = (  a  +  b  )  #   excessive   spaces   
    return   z  # multiple spaces before and after
"""

print(remove_comments(sample_code))
