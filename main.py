from sources.JPCBloc import JPCBloc
from sources.Encoding import hex_decode, hex_encode, utf8_encode, utf8_decode


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



def remove_padding(byte_list):
    while byte_list and byte_list[-1] == 0x00:
        byte_list.pop()
    return byte_list

def crypt_bytes(bytes_list, key=None):
    blocks = split_bytes_into_blocks(bytes_list)
    cipher=[]
    for block in blocks:
        bloc_instance = JPCBloc(block)
        bloc_instance.MixColumns()
        bloc_instance.XOR(key)
        for i in range(14):
            bloc_instance.SBox()
            bloc_instance.ShiftRows()
            bloc_instance.XOR(key)
        cipher.extend(bloc_instance.bytes)
    return cipher

def decrypt_bytes(bytes_list, key=None):
    decipher=[]
    cipher_blocks = split_bytes_into_blocks(bytes_list)
    for block in cipher_blocks:
        bloc_instance = JPCBloc(block)
        for i in range(14):
            bloc_instance.XOR(key)
            bloc_instance.ShiftRows(reverse=True)
            bloc_instance.InvSBox()
        bloc_instance.XOR(key)
        decipher.extend(bloc_instance.bytes)
    return remove_padding(decipher)

if __name__ == "__main__":
    key='f3eb9305ae395fb905b62e1d76df333f'
    plain_text="Texte"
    cipher = crypt_bytes(utf8_encode(plain_text), hex_decode(key))
    print("Plain (utf-8):", plain_text)
    print("Cipher (hex):", hex_encode(cipher))
    decipher = decrypt_bytes(cipher, hex_decode(key))
    print("Decipher (utf-8):", utf8_decode(decipher))