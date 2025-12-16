class JPCRow:
    def __init__(self, bloc):
        self.bloc = bloc
        
    def get_row(self, row_index):
        """Récupère une ligne du bloc (4x4)"""
        start = row_index * 4
        return self.bloc.characters[start:start + 4]
        
    def get_all_rows(self):
        """Récupère toutes les lignes"""
        return [self.get_row(i) for i in range(4)]