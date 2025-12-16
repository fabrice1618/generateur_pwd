from JPCBloc import JPCBloc
from JPCRow import JPCRow
from JPCColumn import JPCColumn

def split_bytes_into_blocks(byte_list, block_size=16):
    """
    Divise une liste d'octets en blocs de taille fixe.
    Si le dernier bloc est plus petit que la taille spécifiée, il est complété avec des zéros.
    """
    blocks = []
    for i in range(0, len(byte_list), block_size):
        block = byte_list[i:i + block_size]
        if len(block) < block_size: #  Ajouter du padding pour que le bloc fasse la bonne taille
            block += [0x00] * (block_size - len(block))
        blocks.append(block)
    return blocks

def utf8_encode(text):
    return list(text.encode('utf-8', errors='ignore'))
def utf8_decode(byte_list):
    return bytes(byte_list).decode('utf-8', errors='ignore')
def hex_encode(byte_list):
    return bytes(byte_list).hex()
def hex_decode(hex_string):
    return list(bytes.fromhex(hex_string))

def remove_padding(byte_list):
    while byte_list and byte_list[-1] == 0x00:
        byte_list.pop()
    return byte_list

def crypt_bytes(bytes_list, key=None):
    blocks = split_bytes_into_blocks(bytes_list)
    cipher=[]
    for block in blocks:
        bloc_instance = JPCBloc(block)

        bloc_instance.XOR(key)
        bloc_instance.SBox()
        bloc_instance.SwitchRows()
        cipher.extend(bloc_instance.bytes)
    return cipher

def decrypt_bytes(bytes_list, key=None):
    decipher=[]
    cipher_blocks = split_bytes_into_blocks(bytes_list)
    for block in cipher_blocks:
        bloc_instance = JPCBloc(block)
        bloc_instance.SwitchRows(reverse=True)
        bloc_instance.InvSBox()
        bloc_instance.XOR(key)
        decipher.extend(bloc_instance.bytes)
    return remove_padding(decipher)

if __name__ == "__main__":
    key='f3eb9305ae395fb905b62e1d76df333f'
    plain_test = "Yeah zebi ! 🚀🔒"
    cipher = crypt_bytes(utf8_encode(plain_test), hex_decode(key))
    print("Cipher (hex):", hex_encode(cipher))
    decipher = decrypt_bytes(cipher, hex_decode(key))
    print("Decipher (utf-8):", utf8_decode(decipher))