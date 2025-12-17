def gf_multiply(a, b):
    result = 0
    magic_number = 0x1B  # Le polynôme irréductible en hexa
    
    while b > 0:

        if b & 1:
            result = result ^ a
        a = a << 1

        if a > 255:
            a = a ^ 0x1B
        
        b = b >> 1
        
    return result