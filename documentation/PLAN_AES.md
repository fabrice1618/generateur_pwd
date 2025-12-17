# État actuel du code
- Le flux n’est toujours pas AES-256 : pas d’AddRoundKey initial, même clé statique à chaque tour, pas de key schedule, pas de MixColumns/InvMixColumns, dernière ronde non différenciée, déchiffrement sans InvMixColumns.
- `ShiftRows` est maintenant corrigé mais reste non vérifié par tests (dépend aussi de la représentation du state colonne-major).
- `MixColumns` est un stub (simple `print`), aucune multiplication dans GF(2^8).
- La clé dans `main.py` fait 32 hex chars (=16 octets), donc clé 128 bits au lieu de 256.
- `JPCRow` référence `self.bytes` qui n’existe pas (devrait passer par `self.bloc.bytes`) et n’est pas utilisée.
- Padding zéro non standard (ambigu si présence d’octets nuls) au lieu de PKCS#7.
- Aucun vecteur de test NIST ni mode d’opération (ECB/CBC/CTR) pour un usage réel.

# Trame de développement
1) Stabiliser le bloc 4x4 (state)  
   - Vérifier `ShiftRows` avec tests et clarifier la représentation colonne-major.  
   - Simplifier ou supprimer `JPCRow/JPCColumn` si redondants; utiliser `get_row/get_column` fiables.  
   - Ajouter `AddRoundKey` explicite (XOR avec la round key courante).

2) Implémenter toutes les primitives AES  
   - `MixColumns` et `InvMixColumns` avec multiplication GF(2^8) ({02,03,01,01} / {0e,0b,0d,09}).  
   - Vérifier les tables S-Box/InvS-Box (index 0-255, ints).

3) Key schedule AES-256  
   - Étendre une clé 32 octets en 60 mots (4 octets) avec Rcon, RotWord, SubWord, et l’injection `word[i-8]`.  
   - Générer 15 round keys (round 0 + 14 tours) de 16 octets.  
   - Préparer la liste inversée pour le déchiffrement.

4) Chaîne de chiffrement/déchiffrement complète  
   - Chiffrement : AddRoundKey initial, 13 rounds (SubBytes → ShiftRows → MixColumns → AddRoundKey), round final sans MixColumns.  
   - Déchiffrement : InvShiftRows → InvSubBytes → AddRoundKey → InvMixColumns, sans InvMixColumns au dernier round.  
   - Passer le padding en PKCS#7.  
   - Utiliser une clé 256 bits (64 hex chars).  
   - Choisir un mode (ECB pour démo, CBC/CTR pour usage réel) et gérer IV/compteur.

5) Tests et validation  
   - Tests unitaires sur les primitives : ShiftRows, MixColumns/InvMixColumns, KeySchedule.  
   - Tests d’intégration avec vecteurs NIST AES-256 (clair/chiffré attendus).  
   - Tests de round-trip encrypt/decrypt sur textes de tailles variées.

6) Organisation et API  
   - Séparer l’implémentation (`aes.py`) de la démo/CLI (`main.py`).  
   - Documenter l’API : `encrypt(bytes, key, iv=None, mode='ECB')` / `decrypt(...)`.  
   - Ajouter un `requirements.txt` si besoin (sinon pur stdlib).

# Ordre conseillé de correction rapide
- Vérifier `ShiftRows` par test et basculer le padding en PKCS#7.  
- Implémenter MixColumns/InvMixColumns.  
- Implémenter le key schedule 256 bits et injecter les round keys dans les rondes.  
- Aligner le flux chiffrement/déchiffrement sur l’ordre AES officiel.  
- Valider avec un vecteur NIST AES-256.
