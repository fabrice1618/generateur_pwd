class JPCColumn:
    def __init__(self, bloc):
        self.bloc = bloc
        
    def get_column(self, col_index):
        """Récupère une colonne du bloc (4x4)"""
        return [self.bloc.bytes[i * 4 + col_index] for i in range(4)]
        
    def get_all_columns(self):
        """Récupère toutes les colonnes"""
        return [self.get_column(i) for i in range(4)]