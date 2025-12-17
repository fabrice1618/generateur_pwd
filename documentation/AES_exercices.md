# AES - Exercices et Vérification de compréhension

## Section 1: Questions de conceptualisation

### Niveau Débutant

**Q1. Qu'est-ce qu'un bloc en AES?**
```
Réponse: 
Un bloc est une unité fixe de 128 bits (16 bytes) de plaintext 
que AES chiffre à la fois. Tous les blocs AES font exactement 
128 bits, indépendamment de la taille de la clé.
```

**Q2. Combien de rondes pour AES-256?**
```
Réponse:
14 rondes complètes (10 pour AES-128, 12 pour AES-192)

Formule: Nr = Nk + 6
où Nk = nombre de mots de 32 bits de la clé
AES-256: Nk = 8 mots → Nr = 8 + 6 = 14 rondes
```

**Q3. Quelles sont les 4 opérations principales?**
```
Réponse:
1. SubBytes (confusion) - S-box lookup
2. ShiftRows (permutation) - rotation linéaire
3. MixColumns (diffusion) - multiplication matricielle GF(2^8)
4. AddRoundKey (clé) - XOR avec la clé de ronde
```

**Q4. Qu'est-ce que la confusion?**
```
Réponse:
La confusion est un principe de Shannon qui rend la relation 
entre le plaintext et le ciphertext aussi complexe que possible.

En AES: Réalisée par SubBytes
- Chaque byte est remplacé indépendamment par SBOX[byte]
- La S-box est non-linéaire et pré-calculée
- Aucun byte ne reste inchangé (SBOX[x] ≠ x)
```

**Q5. Qu'est-ce que la diffusion?**
```
Réponse:
La diffusion est un principe de Shannon qui propage l'influence 
de chaque bit du plaintext à tous les bits du ciphertext.

En AES: Réalisée par ShiftRows + MixColumns
- ShiftRows: Rotation cyclique des lignes (diffusion horizontale)
- MixColumns: Multiplication matricielle (diffusion verticale)
- Combinées: Un byte change → 4 bytes affectés après ShiftRows+MixColumns
- 2 rondes: 1 byte → 16 bytes affectés (diffusion complète)
```

---

### Niveau Intermédiaire

**Q6. Pourquoi AddRoundKey est-elle placée avant les 13 rondes?**
```
Réponse:
Sans AddRoundKey avant les rondes:
  plaintext → SubBytes → ShiftRows → MixColumns → ciphertext
  
  Les trois opérations sont déterministes et publiques!
  Aucune dépendance de la clé au début.

Avec AddRoundKey(0):
  plaintext ⊕ key → SubBytes → ShiftRows → ...
  
  La clé affecte immédiatement tous les bits du state dès le départ.
  Chaque byte du plaintext est mélangé avec la clé dès le début.
  
Bénéfice: Augmente la dépendance des mots clés dès la ronde 0.
```

**Q7. Pourquoi MixColumns n'existe pas en ronde 14?**
```
Réponse:
Structure du déchiffrement:

Si on avait MixColumns en ronde 14:
  Chiffrement: ... → MixColumns → AddRoundKey(14)
  
  Déchiffrement: AddRoundKey(14) → InvMixColumns → ...
  
Problème mathématique:
  InvMixColumns(AddRoundKey(x, k)) ≠ AddRoundKey(InvMixColumns(x), k)
  
Avec absence de MixColumns en ronde 14:
  Chiffrement: ... → SubBytes → ShiftRows → AddRoundKey(14)
  
  Déchiffrement: AddRoundKey(14) → InvShiftRows → InvSubBytes → ...
  
Avantage:
  • Permet InvMixColumns(AddRoundKey(...)) = AddRoundKey(InvMixColumns(...))
  • Optimise la structure du déchiffrement
  • Réduit les opérations nécessaires
  
(Note: La sécurité n'est pas affectée car les 13 rondes précédentes suffisent)
```

**Q8. Comment fonctionne la S-box?**
```
Réponse:
Construction de SBOX[x]:

Pour chaque valeur d'entrée x (0-255):

Étape 1: Calculer l'inverse multiplicatif en GF(2^8)
         x_inv = valeur telle que x × x_inv = 1 en GF(2^8)
         (Exception: 0_inv = 0)

Étape 2: Appliquer une transformation affine
         résultat = (matrice_affine × x_inv) + 0x63
         
         Matrice affine (8×8):
         ┌ 1 0 0 0 1 1 1 1 ┐
         │ 1 1 0 0 0 1 1 1 │
         │ 1 1 1 0 0 0 1 1 │
         │ 1 1 1 1 0 0 0 1 │
         │ 1 1 1 1 1 0 0 0 │
         │ 0 1 1 1 1 1 0 0 │
         │ 0 0 1 1 1 1 1 0 │
         └ 0 0 0 1 1 1 1 1 ┘
         
Exemple concret: SBOX[0x19]
  0x19 en binaire: 00011001
  
  Inverse en GF(2^8): 0x19 × 0xB4 = 0x01 en GF(2^8)
                       Donc 0x19_inv = 0xB4 = 10110100
  
  Transformation affine de 10110100: (application de la matrice)
                                      11010010 = 0xD2
  
  Ajout de 0x63:                       11010010 ⊕ 01100011 = 10110001 = 0xB1
  
  SBOX[0x19] = 0xB1 (valeur pré-calculée)
```

**Q9. Qu'est-ce que GF(2^8) et pourquoi l'utiliser?**
```
Réponse:
GF(2^8) = Galois Field avec 2^8 = 256 éléments

Définition:
  • Chaque élément = un polynôme de degré ≤ 7 (8 coefficients)
  • Coefficients = bits {0, 1} seulement
  • Arithmétique modulo 2 (pas de retenue)

Opérations:
  
  Addition: a ⊕ b = XOR bitwise (simple!)
  
  Multiplication: a × b modulo (x⁸ + x⁴ + x³ + x + 1)
                 Polynôme irréductible d'AES: 0x11B

Utilité en AES:
  ✓ Addition = XOR = très rapide
  ✓ Multiplication définie et inversible (corps fini)
  ✓ Inverse multiplicatif existe pour tout x ≠ 0
  ✓ Propriétés mathématiques robustes contre la cryptanalyse
  ✓ Implémentation efficace en hardware
  ✓ Chiffrement non-linéaire et sûr
  
Propriété clé:
  Multiplication par constante fixe (×2, ×3) est inversible
  → Permet InvMixColumns pour le déchiffrement
```

**Q10. Comment fonctionne la multiplication en GF(2^8)?**
```
Réponse:
Algorithme pour a × b en GF(2^8):

Entrée: a = 0x57 = 01010111, b = 0x83 = 10000011

Étape 1: result = 0

Étape 2: Pour chaque bit de b (LSB d'abord):
  
  Itération 1 (b & 0x01 = 1):
    result ^= a  →  result = 0x57
    a = 0xAE (a << 1, pas de réduction car MSB de 0x57 = 0)
    b >>= 1  →  b = 0x41 = 01000001
  
  Itération 2 (b & 0x01 = 1):
    result ^= a  →  result = 0x57 ⊕ 0xAE = 0xFB
    overflow = 0xAE & 0x80 = 0x80 (MSB est set)
    a = ((0xAE << 1) ^ 0x1B) & 0xFF = (0x5C ^ 0x1B) & 0xFF = 0x47
    b >>= 1  →  b = 0x20 = 00100000
  
  Itération 3 (b & 0x01 = 0): skip
    a = (0x47 << 1) & 0xFF = 0x8E
    b >>= 1  →  b = 0x10
  
  ... (continuer jusqu'à b = 0)

Résultat final: 0x57 × 0x83 = 0xC1 en GF(2^8)

Optimisation pour × 2:
  mult_2(x):
    if x & 0x80:  # MSB est set
      return ((x << 1) ^ 0x1B) & 0xFF
    else:
      return (x << 1) & 0xFF

Optimisation pour × 3:
  mult_3(x) = mult_2(x) ⊕ x
```

---

### Niveau Avancé

**Q11. Expliquer le "branch number" dans MixColumns**
```
Réponse:
Le "branch number" est une mesure mathématique de la diffusion.

Définition:
  Branch number = min(Hamming_weight(entrée non-zéro) + 
                      Hamming_weight(sortie non-zéro))
  
  où Hamming_weight = nombre de bytes non-zéro

Pour MixColumns d'AES:
  Branch number = 5
  
Implication de pratique:
  Si k bytes d'entrée changent:
    Au minimum (5 - k) bytes de sortie changent
  
  Cas k = 1: Au minimum 4 bytes changent (5 - 1 = 4)
  Cas k = 4: Au minimum 1 byte change (5 - 4 = 1)

Signification pour la sécurité:
  • Maximum: 1 byte change → minimum 4 bytes changent
  • Diffusion maximale en une opération
  • Après ShiftRows + MixColumns: 1 byte original → 4 bytes modifiés
  • Après 1 ronde: 1 byte → 16 bytes affectés (complète)
```

**Q12. Comparer les variantes AES-128, AES-192, AES-256**
```
Réponse:
┌──────────────┬──────────────┬─────────────┬─────────────┬──────────────┐
│  Variante    │  Clé (bits)  │ Mots clés   │ Rondes      │ Sécurité eff │
├──────────────┼──────────────┼─────────────┼─────────────┼──────────────┤
│ AES-128      │  128 bits    │ 4 mots      │ 10 rondes   │ ~128 bits    │
│ AES-192      │  192 bits    │ 6 mots      │ 12 rondes   │ ~192 bits    │
│ AES-256      │  256 bits    │ 8 mots      │ 14 rondes   │ ~256 bits    │
└──────────────┴──────────────┴─────────────┴─────────────┴──────────────┘

Formule générale:
  Nk = taille clé / 32 (nombre de mots)
  Nr = Nk + 6 (nombre de rondes)
  Total mots clés pour déchiffrement = 4 × (Nr + 1)

Expansion de clé:
  AES-128: 4 mots initiaux → 44 mots (11 clés rondes de 4 mots)
  AES-192: 6 mots initiaux → 52 mots (13 clés rondes)
  AES-256: 8 mots initiaux → 60 mots (15 clés rondes)

Recommandations NIST 2025:
  • AES-128: Suffisant pour données classifiées jusqu'à 2030
  • AES-192: Protection additionnelle
  • AES-256: Recommandé pour long-term security (> 2030)
            Résiste aux attaques quantiques partiellement
            (brute force quantique: 2^128 au lieu de 2^256)

Sécurité contre attaques quantiques:
  • Grover's algorithm: réduit de 2^n à 2^(n/2)
  • AES-256: 2^256 → 2^128 (toujours secure)
  • AES-128: 2^128 → 2^64 (peut être problématique)
```

**Q13. Expliquer l'expansion de clé pour AES-256**
```
Réponse:
Objectif: Convertir 32 bytes de clé → 60 mots (15 clés rondes)

Structure:
  Entrée: W[0..7]  (8 mots de 32 bits = 32 bytes)
  Sortie: W[0..59] (60 mots)
  
  Regroupement en clés rondes:
    Ronde 0: W[0..3]
    Ronde 1: W[4..7]
    ...
    Ronde 14: W[56..59]

Algorithme (pour i = 8 à 59):
  
  temp = W[i-1]
  
  Si i % 8 == 0 (tous les 8 mots):
    temp = RotWord(temp)      # Rotation: [a,b,c,d] → [b,c,d,a]
    temp = SubWord(temp)      # Appliquer S-box à chaque byte
    temp ^= Rcon[i/8 - 1]    # XOR avec constante de ronde
  
  Sinon si i % 8 == 4 (tous les 4 mots):
    temp = SubWord(temp)      # Appliquer S-box
  
  Sinon:
    (temp reste inchangé)
  
  W[i] = W[i-8] ^ temp        # XOR linéaire

Constantes Rcon (Round Constants):
  Rcon[i] = [x^(i+1), 0, 0, 0] en GF(2^8)
  où x = 0x02
  
  Rcon[0] = 0x01000000
  Rcon[1] = 0x02000000
  Rcon[2] = 0x04000000
  Rcon[3] = 0x08000000
  Rcon[4] = 0x10000000
  Rcon[5] = 0x20000000
  Rcon[6] = 0x40000000
  Rcon[7] = 0x80000000
  Rcon[8] = 0x1B000000  (réduction: 0x100 en GF(2^8) = 0x1B)
  Rcon[9] = 0x36000000  (réduction)

Propriétés de sécurité:
  ✓ Non-linéarité: S-box dans RotWord + SubWord
  ✓ Dépendance: Tous les bits originaux affectent W[8..59]
  ✓ Asymétrie: Rcon brise les symétries
  ✓ Diffusion: RotWord + SubWord + XOR linéaire
  
Attaque contre clés faibles:
  • AES n'a pas de clés faibles connues
  • Expansion de clé dépend de toute la clé originale
  • Changement d'un bit → affecte environ 4 mots de clé
  • Changement d'un bit de plus → affecte 8 mots
  • Après plusieurs étapes: affecte tous les 60 mots
```

**Q14. Analyser le flux de dépendances et l'avalanche**
```
Réponse:
Dépendance: Comment un bit du plaintext affecte le ciphertext

RONDE 0 (juste AddRoundKey):
  1 bit du plaintext → 1 bit du state

RONDE 1 - SubBytes:
  1 bit du state → ~4 bits du SBOX[state] (en moyenne)
  (Non-linéaire, ~50% effet sur tous les bits)

RONDE 1 - ShiftRows:
  ~4 bits → permutation → ~4 bits différents positions

RONDE 1 - MixColumns:
  ~4 bits de la colonne affectée
  → 4×4 = 16 multiplications GF(2^8)
  → Chaque multiplication affecte ~4 bits
  → TOUS les 4 bytes de la colonne changent

RONDE 1 - Complète:
  1 byte du plaintext
  → SubBytes: ~4 bits changés
  → ShiftRows: même 4 bits, position différente
  → MixColumns: TOUS les 4 bytes de la colonne changent (~16 bits)
  → TOTAL: 1 byte original → 4 bytes changés

RONDE 2:
  4 bytes affectés (de la même colonne)
  → SubBytes: 4×4 = ~16 bits changés
  → ShiftRows: permutation des bytes
  → MixColumns: TOUS les 4 colonnes affectées!
  → TOTAL: 4 bytes originaux → 16 bytes changés (complète)

CONCLUSION:
  • Après 2 rondes: 1 byte → 16 bytes affectés
  • "Avalanche effect": Changement très rapide
  • Propriété de sécurité: Bien distribuée, pas de structure observable
```

**Q15. Résistance contre la cryptanalyse linéaire et différentielle**
```
Réponse:
Linéaire Cryptanalysis (attaque linéaire):
  Concept: Trouver des relations linéaires entre plaintext/ciphertext
  
  Exemple d'attaque: P[0] ⊕ C[15] = Clé[7] (relation idéale hypothétique)
  
  Comptage des paires (P, C) respectant cette relation
  → Peut révéler la clé partiellement
  
  Résistance d'AES:
    • S-box: Non-linéarité maximale
    • ShiftRows + MixColumns: Diffusion complète
    • Au minimum 3 rondes → Complexité 2^127 (plus que brute force)
    • AES-256 avec 14 rondes: Complètement sûr
    • Aucune relation linéaire exploitable trouvée


Differential Cryptanalysis (attaque différentielle):
  Concept: Analyser comment les différences (XOR) de plaintext
           se propagent à travers le ciphertext
  
  Exemple: Si P1 ⊕ P2 = ΔP, quel est ΔC = C1 ⊕ C2?
  
  Si on peut prédire ΔC avec haute probabilité → faille de sécurité
  
  Résistance d'AES:
    • S-box: Étendue différentielle bornée
    • MixColumns: Branch number = 5 → diffusion optimale
    • Au minimum 8 rondes → Complexité 2^125 (plus que brute force)
    • AES-256 avec 14 rondes: Complètement sûr
    • Aucune différence exploitable trouvée


Attaques quantiques (Grover):
  Brute force classique: 2^n tentatives
  Grover quantique: √(2^n) = 2^(n/2) tentatives
  
  AES-256: 2^256 → 2^128 (toujours très sécurisé)
  AES-128: 2^128 → 2^64 (deviendrait insecure)
  
  → AES-256 recommandé pour long-term security


Conclusion:
  • 10 rondes (AES-128): Sûr contre toutes les attaques connues
  • 12 rondes (AES-192): Marge de sécurité additionnelle
  • 14 rondes (AES-256): Marge de sécurité maximale
  • Aucune attaque mieux que brute force connue depuis 2001
```

---

## Section 2: Exercices pratiques

### Exercice 1: Multiplication en GF(2^8)

**Énoncé:**
Calculer 0x53 × 0xCA en GF(2^8)

**Étapes:**
```
a = 0x53 = 01010011
b = 0xCA = 11001010

result = 0
temp_a = 0x53

Itération 1 (b & 1 = 0): skip
  temp_a = 0xA6 (0x53 << 1, pas de réduction: MSB=0)
  b >>= 1

Itération 2 (b & 1 = 1): result = 0 ⊕ 0xA6 = 0xA6
  overflow = 0xA6 & 0x80 = 0x80 (MSB set)
  temp_a = ((0xA6 << 1) ^ 0x1B) & 0xFF = (0x4C ^ 0x1B) & 0xFF = 0x57
  b >>= 1

Itération 3 (b & 1 = 0): skip
  temp_a = 0xAE
  b >>= 1

Itération 4 (b & 1 = 1): result = 0xA6 ⊕ 0xAE = 0x08
  ...

Résultat final: 0x53 × 0xCA = 0x01 en GF(2^8)
```

**Vérification:**
```
0x53 × 0xCA = 0x01 signifie que 0x53 et 0xCA sont inverses multiplicatifs!
0x53 × 0xCA ≡ 1 (mod x^8 + x^4 + x^3 + x + 1)
```

---

### Exercice 2: ShiftRows

**Énoncé:**
Appliquer ShiftRows à la matrice suivante:

```
État avant:
┌──────────────┐
│ 87 F2 4D 97  │
│ 6E 4C 90 EC  │
│ DA A2 60 39  │
│ 48 D1 CC 9B  │
└──────────────┘
```

**Solution:**
```
Ligne 0: [87, F2, 4D, 97] → [87, F2, 4D, 97] (pas de rotation)
Ligne 1: [6E, 4C, 90, EC] → [4C, 90, EC, 6E] (rotation gauche 1)
Ligne 2: [DA, A2, 60, 39] → [60, 39, DA, A2] (rotation gauche 2)
Ligne 3: [48, D1, CC, 9B] → [9B, 48, D1, CC] (rotation gauche 3)

État après:
┌──────────────┐
│ 87 4C 60 9B  │
│ F2 90 39 48  │
│ 4D EC DA D1  │
│ 97 6E A2 CC  │
└──────────────┘
```

---

### Exercice 3: MixColumns

**Énoncé:**
Calculer le résultat de MixColumns pour la colonne [0x87, 0xF2, 0x4D, 0x97]

**Solution:**
```
Colonne entrée: [a=0x87, b=0xF2, c=0x4D, d=0x97]

Formules:
  e = (2·a) ⊕ (3·b) ⊕ c ⊕ d
  f = a ⊕ (2·b) ⊕ (3·c) ⊕ d
  g = a ⊕ b ⊕ (2·c) ⊕ (3·d)
  h = (3·a) ⊕ b ⊕ c ⊕ (2·d)

Calcul de e:
  2·0x87 = mult_2(0x87) = ((0x87 << 1) ^ 0x1B) & 0xFF = (0x0E ^ 0x1B) & 0xFF = 0x15
  3·0xF2 = mult_3(0xF2) = mult_2(0xF2) ⊕ 0xF2
           mult_2(0xF2) = ((0xF2 << 1) ^ 0x1B) & 0xFF = (0xE4 ^ 0x1B) & 0xFF = 0xFB
           3·0xF2 = 0xFB ⊕ 0xF2 = 0x09
  
  e = 0x15 ⊕ 0x09 ⊕ 0x4D ⊕ 0x97 = ...

Résultat final: Colonne de sortie [e, f, g, h]
(Calcul complet implique beaucoup d'opérations, résultat = [0x47, 0x40, 0xA3, 0x4C])
```

---

## Section 3: Questions de réflexion

**Q1. Pourquoi AES utilise-t-il des corps finis GF(2^8) au lieu d'arithmétique entière classique?**

**Q2. Si on augmentait le nombre de rondes à 20, la sécurité doublerait-elle? Pourquoi?**

**Q3. Qu'est-ce qui arriverait si on utilisait AES sans la ronde initiale AddRoundKey?**

**Q4. Expliquer pourquoi MixColumns ne peut pas être une simple permutation?**

**Q5. Comparer la diffusion d'AES avec un simple XOR itéré. Quel est l'avantage?**

---

## Réponses aux questions de réflexion

**Réponse Q1:**
Raisons mathématiques:
- Addition en GF(2^8) = XOR très rapide
- Chaque élément a un inverse multiplicatif (corps fini)
- Structure mathématique robuste contre la cryptanalyse algébrique
- Implémentation efficace en hardware
- Propriétés des polynômes irréductibles permettent MixColumns optimal

**Réponse Q2:**
Non, la sécurité ne doublerait pas linéairement:
- 10 rondes (AES-128) → Complexité ~2^127
- 14 rondes (AES-256) → Complexité ~2^256
- 20 rondes → Complexité ~2^260
- L'ajout de rondes augmente, mais pas exponentiellement

Avec 14 rondes: Tous les bits affectent tous les bits
Ajouter 6 rondes: Pas d'amélioration significative

**Réponse Q3:**
Sans AddRoundKey(0):
- Les 4 opérations seraient publiques et déterministes
- plaintext → SubBytes → ShiftRows → MixColumns → intermédiaire
- La clé n'affecterait que plus tard
- Serait plus faible contre certaines attaques

**Réponse Q4:**
MixColumns doit être une multiplication matricielle en GF(2^8), pas une permutation:
- Permutation: Chaque sortie reçoit une entrée (bijection)
- Multiplication: Chaque sortie dépend de TOUS les inputs linéairement
- Branch number = 5 (4 bytes changent pour 1 changement)
- Permutation: Branch number = 1 ou 4 (insuffisant)

**Réponse Q5:**
AES vs XOR itéré:
- XOR itéré: (plaintext ⊕ key) ⊕ key = plaintext (inverse trivial)
- AES: Mélange confusion + diffusion non-inversible sans clé
- 2 rondes AES: Diffusion complète (1 byte → 16 bytes)
- 2 XOR: Pas de diffusion du tout
- AES: 14 rondes suffisent, XOR: Impractical même avec 1000 rondes
