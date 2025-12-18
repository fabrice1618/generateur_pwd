from sources.encoding import hex_decode, hex_encode, utf8_encode, utf8_decode
from sources.SBOX import SBOX, INV_SBOX
from sources.maths import gf_multiply
            

class JPCBloc:
        def __init__(self, bytes):
            self.bytes = bytes
        
        def __str__(self):
            return str(self.bytes)
        
        def sbox(self):
            result = []
            for byte in self.bytes:
                sbox_value = SBOX[byte]
                result.append(sbox_value)
            self.bytes = result
            
        def inv_sbox(self):
            """
            Applique la S-Box inverse sur une liste d'octets
            """
            result = []
            for byte in self.bytes:
                inv_sbox_value = INV_SBOX[byte]
                result.append(inv_sbox_value)
            self.bytes = result

        def get_row(self, row_index):
            """Récupère une ligne du bloc (4x4)"""
            return [self.bytes[i * 4 + row_index] for i in range(4)]
        def get_all_rows(self):
            """Récupère toutes les lignes"""
            return [self.get_row(i) for i in range(4)]
        
        def get_column(self, col_index):
            """Récupère une colonne du bloc (4x4)"""
            start = col_index * 4
            return self.bytes[start:start + 4]
            
        def get_all_columns(self):
            """Récupère toutes les colonnes"""
            return [self.get_column(i) for i in range(4)]
        
        def get_block(self):
            """Récupère le bloc complet sous forme de liste d'octets"""
            for i in range(4):
                print(self.get_row(i))
            print("\n")

        def XOR(self, key):
            """Effectue un XOR entre le bloc et une clé (liste d'octets de même taille)"""
            self.bytes = [b ^ k for b, k in zip(self.bytes, key)]
            
        def ShiftRows(self, reverse=False):
            """Effectue le ShiftRows sur le bloc"""
            if reverse:
                # Décalage circulaire à droite
                rows = self.get_all_rows()
                for i in range(4):
                    rows[i] = rows[i][-i:] + rows[i][:-i]
                # Reconstruire le bloc à partir des lignes modifiées
                self.bytes = [rows[j][i] for i in range(4) for j in range(4)]

            else:
                rows = self.get_all_rows()
                for i in range(4):
                    rows[i] = rows[i][i:] + rows[i][:i]  # Décalage circulaire à gauche
                # Reconstruire le bloc à partir des lignes modifiées
                self.bytes = [rows[j][i] for i in range(4) for j in range(4)]
        
        def MixColumns(self):
            """Effectue le MixColumns sur le bloc (non implémenté ici)"""
            mix_hex="02010103030201010103020101010302"
            mix_block = JPCBloc(hex_decode(mix_hex))
            self.get_block()
            mix_block.get_block()
            columns = self.get_all_columns()
            mix_rows = mix_block.get_all_rows()
            new_columns = []
            
            for col in columns:
                new_column = []
                for mix_row in mix_rows:
                    gf=[]
                    for j in range(4):
                        # print(f"Multiplier {mix_row[j]} par {col[j]}")
                        gf.append(gf_multiply(mix_row[j], col[j]))
                    # print("Résultats des multiplications en GF(2^8):", gf)
                    new_column.append(gf[0] ^ gf[1] ^ gf[2] ^ gf[3])
                new_columns.extend(new_column)
            print("Nouvelles colonnes après MixColumns:", new_columns)
            self.bytes = new_columns