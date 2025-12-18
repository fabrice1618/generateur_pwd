def utf8_encode(text):
    return list(text.encode('utf-8', errors='ignore'))

def utf8_decode(byte_list):
    return bytes(byte_list).decode('utf-8', errors='ignore')

def hex_encode(byte_list):
    return bytes(byte_list).hex()

def hex_decode(hex_string):
    return list(bytes.fromhex(hex_string))
