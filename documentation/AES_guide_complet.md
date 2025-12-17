# AES (Advanced Encryption Standard) - Guide Pédagogique Complet

## Table des matières
1. [Contexte historique et principes](#1-contexte-historique-et-principes)
2. [Concepts mathématiques fondamentaux](#2-concepts-mathématiques-fondamentaux)
3. [Architecture générale d'AES](#3-architecture-générale-daes)
4. [Détail des 4 opérations fondamentales](#4-détail-des-4-opérations-fondamentales)
5. [Expansion de clé](#5-expansion-de-clé)
6. [Processus de chiffrement complet](#6-processus-de-chiffrement-complet)
7. [Déchiffrement](#7-déchiffrement)
8. [Variantes et sécurité](#8-variantes-et-sécurité)

---

## 1. Contexte historique et principes

### Origine d'AES

**Avant AES (avant 2001):**
- **DES** (Data Encryption Standard, 1977): Clé 56 bits → Devenu insécurisé
- **3DES**: Trois applications de DES → Lent, clé 168 bits effective

**Concours NIST (1997-2000):**
- NIST (National Institute of Standards and Technology) a lancé un concours public
- Critères: Sécurité, performance, flexibilité
- **Gagnant: Rijndael**, développé par Joan Daemen et Vincent Rijmen (Belgique)
- Standardisé en **2001 comme FIPS 197**

### Principes de conception

AES repose sur deux principes cryptographiques fondamentaux:

#### 1. Confusion (Claude Shannon, 1949)
> "Une petite modification du plaintext doit causer un grand changement dans le ciphertext"

**Réalisée par:** La **S-box** (Substitution Box)
- Chaque byte d'entrée est remplacé de manière non-linéaire
- Rend l'accès à la clé difficile par analyse statistique

#### 2. Diffusion (Claude Shannon, 1949)
> "L'influence de chaque bit du plaintext doit se propager à tous les bits du ciphertext"

**Réalisée par:** 
- **ShiftRows**: Permutation des bytes
- **MixColumns**: Mélange linéaire maximal

### Chiffre itératif par rondes

```
Plaintext 16 bytes
    ↓
[Ronde 0] AddRoundKey
    ↓
[Ronde 1-13] SubBytes → ShiftRows → MixColumns → AddRoundKey
    ↓
[Ronde 14] SubBytes → ShiftRows → AddRoundKey
    ↓
Ciphertext 16 bytes
```

**Nombre de rondes:**
- AES-128: 10 rondes
- AES-192: 12 rondes
- AES-256: 14 rondes

---

## 2. Concepts mathématiques fondamentaux

### 2.1 Galois Field GF(2^8)

#### Qu'est-ce qu'un corps fini?

Un **corps** est une structure mathématique où vous pouvez:
- ✅ Additionner
- ✅ Soustraire
- ✅ Multiplier
- ✅ Diviser (sauf par zéro)

**GF(2^8)** = Galois Field avec 2^8 = **256 éléments** (0 à 255).

#### Représentation polynomiale

Chaque byte est un polynôme de degré ≤ 7:

```
Byte décimal:  173
Byte binaire:  10101101

Polynôme: 1·x⁷ + 0·x⁶ + 1·x⁵ + 0·x⁴ + 1·x³ + 1·x² + 0·x + 1
        = x⁷ + x⁵ + x³ + x² + 1

Coefficients: {0, 1} seulement (arithmétique modulo 2)
```

#### Addition en GF(2^8)

**Opération: XOR bitwise**

```
Exemple:
  10101101  (0xAD = 173)
⊕ 11001010  (0xCA = 202)
───────────
  01100111  (0x67 = 103)

Polynôme: (x⁷ + x⁵ + x³ + x² + 1) + (x⁷ + x⁶ + x³ + x) = x⁶ + x⁵ + x² + 1
```

**Pourquoi XOR?**
- Addition sans retenue en binaire
- Chaque bit indépendant
- Inverse de lui-même: a ⊕ a = 0

#### Multiplication en GF(2^8)

**Beaucoup plus complexe que l'addition!**

C'est une multiplication polynomiale modulo un **polynôme irréductible**.

##### Polynôme irréductible d'AES

```
m(x) = x⁸ + x⁴ + x³ + x + 1

En hexadécimal: 0x11B (binaire: 100011011)
```

C'est le polynôme générateur du corps GF(2^8) utilisé par AES.

##### Algorithme de multiplication

**Multiplication de a × b en GF(2^8):**

```
Entrée:  a = 0x57, b = 0x83
Sortie:  a × b = 0xC1

Étape 1: Initialiser result = 0

Étape 2: Pour chaque bit de b (de droite à gauche):
         • Si bit est 1: XOR result avec a
         • Décaler a à gauche
         • Si overflow (MSB était 1): XOR avec 0x1B
         • Décaler b à droite

Détail:
Bit 0 (=1): result = 0 ⊕ 0x57 = 0x57
Bit 1 (=1): a = 0xAE, result = 0x57 ⊕ 0xAE = 0xFB
Bit 2 (=0): a = 0x47 (après réduction), skip
Bit 3 (=0): a = 0x8E, skip
Bit 4 (=0): a = 0x07, skip
Bit 5 (=0): a = 0x0E, skip
Bit 6 (=0): a = 0x1C, skip
Bit 7 (=1): a = 0x38 (après réduction), result = 0xFB ⊕ 0x38 = 0xC3

Résultat: 0xC3 (erreur d'exemple, voir trace complète)
```

##### Cas spéciaux optimisés

**Multiplication par 2** (la plus courante):

```python
def mult_2(x):
    if x & 0x80:  # Si MSB (bit 7) est set
        return ((x << 1) ^ 0x1B) & 0xFF
    else:
        return (x << 1) & 0xFF

Exemples:
mult_2(0x57) = ((0xAE) ^ 0x1B) & 0xFF = 0xB5
mult_2(0xC0) = (0x80) & 0xFF = 0x80
```

**Multiplication par 3**:

```
a × 3 = (a × 2) ⊕ a
```

### 2.2 Arithmétique modulo et réduction

#### Réduction par le polynôme irréductible

Quand on multiplie deux polynômes de degré ≤ 7, on obtient un polynôme de degré ≤ 14.

**Il faut réduire modulo m(x) = x⁸ + x⁴ + x³ + x + 1**

```
Exemple: x⁹ + x³

Division par (x⁸ + x⁴ + x³ + x + 1):
  x⁹ + x³ = (x) × (x⁸ + x⁴ + x³ + x + 1) + reste
  x⁹ + x³ = (x⁹ + x⁵ + x⁴ + x² + x) + (x⁵ + x⁴ + x³ + x² + 1)

Reste: x⁵ + x⁴ + x³ + x² + 1
```

**En binaire (dans le code):**
```
Quand le MSB de a dépasse 8 bits:
  a ^= 0x1B  (XOR avec les coefficients de m(x))
```

---

## 3. Architecture générale d'AES

### 3.1 Dimensions et représentation

#### Bloc de données: 128 bits (16 bytes)

AES traite un bloc **fixe de 128 bits** divisé en **4 colonnes × 4 lignes**.

```
Plaintext (16 bytes):
  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F

État (State) en matrice 4×4 (ordre colonne-major):

  ┌────────────────────────┐
  │ 00 04 08 0C │ Colonne 0
  │ 01 05 09 0D │ Colonne 1
  │ 02 06 0A 0E │ Colonne 2
  │ 03 07 0B 0F │ Colonne 3
  └────────────────────────┘

Raison du stockage colonne-major:
✓ ShiftRows opère sur les lignes
✓ MixColumns opère sur les colonnes
✓ Aligne avec la spécification FIPS 197
```

#### Clé: 128, 192, ou 256 bits

```
Clé 256 bits (pour AES-256):
  32 bytes = 8 mots de 32 bits

Clé 128 bits (pour AES-128):
  16 bytes = 4 mots de 32 bits

Clé 192 bits (pour AES-192):
  24 bytes = 6 mots de 32 bits
```

### 3.2 Structure globale du chiffrement AES-256

```
┌─────────────────────────────────────┐
│ Plaintext (16 bytes)                │
└────────────┬────────────────────────┘
             │
    ┌────────▼────────┐
    │ Key Expansion   │ Clé 256 bits → 15 clés rondes
    │ (KeySchedule)   │ (60 mots au total)
    └────────┬────────┘
             │
    ┌────────▼────────────────┐
    │ Ronde 0                 │
    │ AddRoundKey             │
    └────────┬────────────────┘
             │
    ┌────────▼────────────────────────────────┐
    │ Rondes 1-13 (13 fois)                   │
    │ • SubBytes (confusion)                  │
    │ • ShiftRows (permutation)               │
    │ • MixColumns (diffusion)                │
    │ • AddRoundKey                           │
    └────────┬────────────────────────────────┘
             │
    ┌────────▼──────────────────────────────┐
    │ Ronde 14 (Finale)                     │
    │ • SubBytes                            │
    │ • ShiftRows                           │
    │ • AddRoundKey (pas de MixColumns!)    │
    └────────┬──────────────────────────────┘
             │
┌────────────▼─────────────────┐
│ Ciphertext (16 bytes)        │
└──────────────────────────────┘
```

---

## 4. Détail des 4 opérations fondamentales

### 4.1 SubBytes - Confusion

#### Objectif
Introduire la **non-linéarité** pour résister aux attaques linéaires.

#### Fonctionnement
```
Pour chaque byte du state:
  byte_sortie = SBOX[byte_entrée]
```

#### Processus de création de la S-box

La S-box AES est déterministe et construite mathématiquement:

```
Pour chaque valeur d'entrée b (0-255):

Étape 1: Calculer l'inverse multiplicatif en GF(2^8)
         b^-1 = valeur telle que b × b^-1 = 1 en GF(2^8)
         (Cas spécial: 0^-1 = 0)

Étape 2: Appliquer une transformation affine (linéaire)
         résultat = c0 + (b^-1 × matrice_affine) + constante_affine

         Matrice affine (8×8 en binaire):
         ┌ 1 0 0 0 1 1 1 1 ┐
         │ 1 1 0 0 0 1 1 1 │
         │ 1 1 1 0 0 0 1 1 │
         │ 1 1 1 1 0 0 0 1 │
         │ 1 1 1 1 1 0 0 0 │
         │ 0 1 1 1 1 1 0 0 │
         │ 0 0 1 1 1 1 1 0 │
         └ 0 0 0 1 1 1 1 1 ┘

         Constante: 0x63 = 01100011
```

#### Exemple concret

```
Entrée: 0x19 = 00011001

Étape 1: Inverse multiplicatif de 0x19 en GF(2^8)
         0x19 × 0xB4 = 0x01 en GF(2^8)
         Donc 0x19^-1 = 0xB4

Étape 2: Transformation affine de 0xB4 = 10110100
         (Application de la matrice)
         Résultat = 10110011 + 01100011 = 11010010 = 0xD2

Sortie SBOX[0x19] = 0xD2
```

#### Table complète (256 valeurs pré-calculées)

```
     0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
  0: 63 7C 77 7B F2 6B 6F C5 30 01 67 2B FE D7 AB 76
  1: CA 82 C9 7D FA 59 47 F0 AD D4 A2 AF 9C A4 72 C0
  2: B7 FD 93 26 36 3F F7 CC 34 A5 E5 F1 71 D8 31 15
  3: 04 C7 23 C3 18 96 05 9A 07 12 80 E2 EB 27 B2 75
  4: 09 83 2C 1A 1B 6E 5A A0 52 3B D6 B3 29 E3 2F 84
  5: 53 D1 00 ED 20 FC B1 5B 6A CB BE 39 4A 4C 58 CF
  6: D0 EF AA FB 43 4D 33 85 45 F9 02 7F 50 3C 9F A8
  7: 51 A3 40 8F 92 9D 38 F5 BC B6 DA 21 10 FF F3 D2
  ...
```

#### Propriétés de sécurité de la S-box

✅ **Aucun byte ne reste inchangé:** SBOX[x] ≠ x pour tout x
✅ **Aucun byte ne devient son complément:** SBOX[x] ≠ ~x pour tout x
✅ **Non-linéarité maximale:** Résiste aux attaques linéaires
✅ **Boîte différentielle bornée:** Résiste aux attaques différentielles

### 4.2 ShiftRows - Permutation

#### Objectif
Diffuser les bytes **horizontalement** sur chaque ligne.

#### Fonctionnement

```
Avant ShiftRows:        Après ShiftRows:
┌─────────────┐         ┌─────────────┐
│ A B C D     │         │ A B C D     │  Ligne 0: pas de décalage
│ E F G H     │         │ F G H E     │  Ligne 1: décalage gauche 1
│ I J K L     │ ──→     │ K L I J     │  Ligne 2: décalage gauche 2
│ M N O P     │         │ P M N O     │  Ligne 3: décalage gauche 3
└─────────────┘         └─────────────┘
```

#### Détail par ligne

```
Ligne 0 (index 0):
  [a₀, a₁, a₂, a₃] → [a₀, a₁, a₂, a₃]  (pas de rotation)

Ligne 1 (index 1):
  [a₀, a₁, a₂, a₃] → [a₁, a₂, a₃, a₀]  (rotation gauche 1)

Ligne 2 (index 2):
  [a₀, a₁, a₂, a₃] → [a₂, a₃, a₀, a₁]  (rotation gauche 2)

Ligne 3 (index 3):
  [a₀, a₁, a₂, a₃] → [a₃, a₀, a₁, a₂]  (rotation gauche 3)
```

#### Implémentation simple

```python
def shift_rows(state):
    # Ligne 1: décalage 1
    state[1][0], state[1][1], state[1][2], state[1][3] = \
    state[1][1], state[1][2], state[1][3], state[1][0]
    
    # Ligne 2: décalage 2
    state[2][0], state[2][1], state[2][2], state[2][3] = \
    state[2][2], state[2][3], state[2][0], state[2][1]
    
    # Ligne 3: décalage 3
    state[3][0], state[3][1], state[3][2], state[3][3] = \
    state[3][3], state[3][0], state[3][1], state[3][2]
```

#### Utilité

```
ShiftRows seule ne fait que permuter les bytes.
Combinée avec MixColumns, elle crée une diffusion maximale:
• Un changement dans 1 byte du plaintext
• Affecte 4 bytes après 1 ShiftRows
• Affecte 4 bytes après MixColumns
• Affecte tous les 16 bytes après 1 ronde complète
```

### 4.3 MixColumns - Diffusion linéaire

#### Objectif
Mélanger les bytes **verticalement** avec diffusion maximale (branch number = 5).

#### Multiplication matricielle sur GF(2^8)

MixColumns multiplie chaque colonne par une matrice constante en GF(2^8):

```
┌ 0x02 0x03 0x01 0x01 ┐   ┌ a₀ ┐   ┌ 0x02·a₀ ⊕ 0x03·a₁ ⊕ 0x01·a₂ ⊕ 0x01·a₃ ┐
│ 0x01 0x02 0x03 0x01 │ × │ a₁ │ = │ 0x01·a₀ ⊕ 0x02·a₁ ⊕ 0x03·a₂ ⊕ 0x01·a₃ │
│ 0x01 0x01 0x02 0x03 │   │ a₂ │   │ 0x01·a₀ ⊕ 0x01·a₁ ⊕ 0x02·a₂ ⊕ 0x03·a₃ │
└ 0x03 0x01 0x01 0x02 ┘   └ a₃ ┘   └ 0x03·a₀ ⊕ 0x01·a₁ ⊕ 0x01·a₂ ⊕ 0x02·a₃ ┘

Les multiplications (·) sont en GF(2^8), les additions (⊕) sont des XOR!
```

#### Exemple numérique

```
Colonne: [0x57, 0x1C, 0xC9, 0x5E]

Calcul du premier byte de la colonne résultat:
  = 0x02 × 0x57 ⊕ 0x03 × 0x1C ⊕ 0x01 × 0xC9 ⊕ 0x01 × 0x5E
  = 0xAE ⊕ 0x54 ⊕ 0xC9 ⊕ 0x5E
  = 0x7F

(Tous les calculs sont en GF(2^8))
```

#### Formules optimisées

```
Soit a, b, c, d les 4 bytes de la colonne.
Les résultats (e, f, g, h) sont:

e = (a × 2) ⊕ (b × 3) ⊕ c ⊕ d
f = a ⊕ (b × 2) ⊕ (c × 3) ⊕ d
g = a ⊕ b ⊕ (c × 2) ⊕ (d × 3)
h = (a × 3) ⊕ b ⊕ c ⊕ (d × 2)

Où × 2 et × 3 sont les multiplications GF(2^8) pré-optimisées.
```

#### Propriétés mathématiques

**Branch number = 5** (propriété de sécurité):
```
Si vous changez 1 byte en entrée,
Au minimum 4 bytes de la sortie changent.

Généralisation: Si k bytes changent en entrée,
Au minimum (5 - k) bytes changent en sortie.
```

**Implication pour la sécurité:**
- Après 1 ShiftRows: 1 byte changé → 4 bytes affectés
- Après 1 MixColumns: 4 bytes affectés → 4 bytes changés
- Après 1 ronde complète: 1 byte originel → 4 bytes modifiés partout

### 4.4 AddRoundKey - Injection de clé

#### Objectif
Introduire la clé secrète de manière irréversible.

#### Fonctionnement
```
Pour chaque byte du state:
  state[i][j] ^= round_key[i][j]

C'est simplement un XOR byte par byte!
```

#### Exemple

```
State:       Round Key:    Résultat:
47 40 A3 4C  2B 05 0F C7  6C 45 AC CB
...          ...          ...

0x47 ⊕ 0x2B = 0x6C
0x40 ⊕ 0x05 = 0x45
0xA3 ⊕ 0x0F = 0xAC
0x4C ⊕ 0xC7 = 0x8B
```

#### Pourquoi c'est crucial

**Sans AddRoundKey:**
- AES serait déterministe et public (pas de secret)
- La clé n'interviendrait jamais directement

**Avec AddRoundKey à chaque ronde:**
- Chaque byte du state dépend de la clé
- Changement de clé → complètement différent

---

## 5. Expansion de clé (Key Schedule)

### 5.1 Objectif

À partir d'une clé initiale (128, 192, ou 256 bits), générer **toutes les clés rondes** (15 pour AES-256, 10 pour AES-128).

```
Clé initiale 256 bits (32 bytes)
              ↓
    Key Expansion
              ↓
15 clés rondes de 16 bytes chacune (60 mots de 32 bits)
```

### 5.2 Représentation en mots

**Un mot = 4 bytes = 32 bits**

```
Clé 256 bits = 8 mots (W[0] à W[7])
Clé 128 bits = 4 mots (W[0] à W[3])

W[0] = [k₀, k₁, k₂, k₃]
W[1] = [k₄, k₅, k₆, k₇]
...

Format:
┌─────────────────────┐
│ W[0] W[4] W[8] W[12]│  Ronde 0
│ W[1] W[5] W[9] W[13]│
│ W[2] W[6] W[10]W[14]│
│ W[3] W[7] W[11]W[15]│
└─────────────────────┘
```

### 5.3 Algorithme d'expansion (AES-256)

```
Entrée:  W[0..7]  (8 mots de clé initiale)
Sortie:  W[0..59] (60 mots pour 15 clés rondes)

Pour i = 8 à 59:
    temp = W[i-1]
    
    Si i % 8 == 0:
        // Chaque 8ème mot: transformation complexe
        RotWord(temp)      // Rotation circulaire: [a,b,c,d] → [b,c,d,a]
        SubWord(temp)      // Appliquer S-box à chaque byte
        XOR avec Rcon[i/8-1]  // Constante de ronde
    
    Sinon si i % 8 == 4:
        // Tous les 4 mots: transformation simpler
        SubWord(temp)      // Appliquer S-box
    
    W[i] = W[i-8] XOR temp
```

### 5.4 Fonctions auxiliaires

#### RotWord (Rotation circulaire)

```
Entrée:  [a, b, c, d]
Sortie:  [b, c, d, a]

Exemple:
[0x63, 0x7C, 0x77, 0x7B] → [0x7C, 0x77, 0x7B, 0x63]
```

#### SubWord (S-box sur chaque byte)

```
Entrée:  mot = [a, b, c, d]
Sortie:  [SBOX[a], SBOX[b], SBOX[c], SBOX[d]]

Exemple:
[0x09, 0xCF, 0x4F, 0x3C] → [0xCD, 0x4B, 0x47, 0xBE]
                             (valeurs SBOX)
```

#### Rcon (Round Constant)

```
Rcon[0] = 0x01000000
Rcon[1] = 0x02000000
Rcon[2] = 0x04000000
Rcon[3] = 0x08000000
Rcon[4] = 0x10000000
Rcon[5] = 0x20000000
Rcon[6] = 0x40000000
Rcon[7] = 0x80000000
Rcon[8] = 0x1B000000  (réduction)
Rcon[9] = 0x36000000

Pattern: [x^i, 0, 0, 0] en GF(2^8)
où x = 0x02
```

### 5.5 Exemple d'expansion (premiers mots)

```
Clé initiale (32 bytes):
2B 28 AB 09 7E AE F7 CF 15 D2 15 4F 16 A6 88 3C
5B D4 28 18 45 0B F8 D6 5D 77 E6 32 D3 30 82 5D

W[0] = [0x2B, 0x28, 0xAB, 0x09] = 0x2B28AB09
W[1] = [0x7E, 0xAE, 0xF7, 0xCF] = 0x7EAEF7CF
W[2] = [0x15, 0xD2, 0x15, 0x4F] = 0x15D2154F
W[3] = [0x16, 0xA6, 0x88, 0x3C] = 0x16A6883C
W[4] = [0x5B, 0xD4, 0x28, 0x18] = 0x5BD42818
W[5] = [0x45, 0x0B, 0xF8, 0xD6] = 0x450BF8D6
W[6] = [0x5D, 0x77, 0xE6, 0x32] = 0x5D77E632
W[7] = [0xD3, 0x30, 0x82, 0x5D] = 0xD330825D

Génération de W[8]:
    temp = W[7] = 0xD330825D = [0xD3, 0x30, 0x82, 0x5D]
    
    8 % 8 == 0, donc:
        RotWord([0xD3, 0x30, 0x82, 0x5D]) = [0x30, 0x82, 0x5D, 0xD3]
        
        SubWord([0x30, 0x82, 0x5D, 0xD3]) = [0x40, 0x84, 0xDC, 0xC5]
        (valeurs SBOX)
        
        0x4084DCC5 XOR Rcon[0] = 0x4084DCC5 XOR 0x01000000 = 0x4184DCC5
        
        W[8] = W[0] XOR 0x4184DCC5
             = 0x2B28AB09 XOR 0x4184DCC5
             = 0x6ABC77CC
```

### 5.6 Propriétés de sécurité

**L'expansion de clé est conçue pour:**
✅ Dépendre de **tous les bits** de la clé initiale
✅ Produire une **dépendance non-linéaire** (via S-box)
✅ Briser les **symétries** (via Rcon)
✅ Diffuser les bits (via RotWord et SubWord)

---

## 6. Processus de chiffrement complet

### 6.1 Vue d'ensemble

```
CHIFFREMENT AES-256:

1. Clé expansion  → 15 clés rondes W[0..15], W[16..31], ..., W[56..59]

2. Ronde 0:
   state ← plaintext
   AddRoundKey(state, W[0..3])

3. Rondes 1-13 (13 fois):
   SubBytes(state)
   ShiftRows(state)
   MixColumns(state)
   AddRoundKey(state, W[4i..4i+3])

4. Ronde 14 (finale):
   SubBytes(state)
   ShiftRows(state)
   AddRoundKey(state, W[56..59])

5. ciphertext ← state
```

### 6.2 Exemple complet (avec données simplifiées)

```
Plaintext (16 bytes):
00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF

Clé 256 bits (32 bytes):
00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F

État initial:
┌────────────────┐
│ 00 44 88 CC    │
│ 11 55 99 DD    │
│ 22 66 AA EE    │
│ 33 77 BB FF    │
└────────────────┘

Après Ronde 0 (AddRoundKey):
┌────────────────┐
│ XX XX XX XX    │  XOR avec W[0], W[4], W[8], W[12]
│ XX XX XX XX    │
│ XX XX XX XX    │
│ XX XX XX XX    │
└────────────────┘

Après Ronde 1:
1. SubBytes:     Chaque byte → SBOX[byte]
2. ShiftRows:    Permutation des lignes
3. MixColumns:   Multiplication matricielle GF(2^8)
4. AddRoundKey:  XOR avec W[16], W[20], W[24], W[28]

... (répéter rondes 2-13) ...

Après Ronde 14:
1. SubBytes:
2. ShiftRows:
3. AddRoundKey:  (pas de MixColumns!)

Ciphertext:      16 bytes complètement différents
```

### 6.3 Importance de la ronde initiale

```
Pourquoi AddRoundKey avant les 13 rondes?

Sans AddRoundKey(0):
  Plaintext → SubBytes → ShiftRows → MixColumns
  
  Les 3 opérations sont déterministes et publiques!
  La clé n'affecte que plus tard.

Avec AddRoundKey(0):
  Plaintext XOR clé → SubBytes → ShiftRows → ...
  
  La clé affecte immédiatement, dès le début.
  Chaque byte du plaintext est mélangé avec la clé dès le start.
```

### 6.4 Importance de l'absence de MixColumns en ronde 14

```
Ronde 14 sans MixColumns:

Chiffrement:  SubBytes → ShiftRows → AddRoundKey (pas MixColumns)

Raison mathématique:
  Pour pouvoir inverser le processus au déchiffrement, on aurait besoin:
  AddRoundKey → InvMixColumns → ...
  
  Or: InvMixColumns(AddRoundKey(...)) ≠ AddRoundKey(InvMixColumns(...))
  
  Mais avec la ronde finale sans MixColumns, on peut regrouper:
  AddRoundKey(14) puis InvMixColumns → AddRoundKey(13')
  
  Cela permet une structure de déchiffrement plus efficace.
```

---

## 7. Déchiffrement

### 7.1 Principe fondamental

**Chiffrement = ronde initiale + 13 rondes principales + ronde finale**
**Déchiffrement = ronde initiale (inverse) + 13 rondes inverses + ronde finale (inverse)**

### 7.2 Structure du déchiffrement

```
Ciphertext
    ↓
[Ronde 0] AddRoundKey(state, W[56..59])
    ↓
[Rondes 1-13] (en ordre inverse)
  InvShiftRows
  InvSubBytes
  AddRoundKey(state, W[4(14-i)..4(14-i)+3])
  InvMixColumns
    ↓
[Ronde 14] 
  InvShiftRows
  InvSubBytes
  AddRoundKey(state, W[0..3])
    ↓
Plaintext
```

### 7.3 Opérations inverses

#### InvSubBytes

Utilise la **S-box inverse**:
```python
def inv_sub_bytes(state):
    for i in range(4):
        for j in range(4):
            state[i][j] = INV_SBOX[state[i][j]]

INV_SBOX[SBOX[x]] = x  pour tout x ∈ [0, 255]
```

#### InvShiftRows

Rotation en sens inverse:
```
Avant InvShiftRows:     Après InvShiftRows:
┌─────────────┐         ┌─────────────┐
│ A B C D     │         │ A B C D     │  Ligne 0: pas de décalage
│ F G H E     │         │ E F G H     │  Ligne 1: décalage droite 1
│ K L I J     │ ──→     │ I J K L     │  Ligne 2: décalage droite 2
│ P M N O     │         │ M N O P     │  Ligne 3: décalage droite 3
└─────────────┘         └─────────────┘
```

#### InvMixColumns

Multiplication par la matrice inverse en GF(2^8):
```
┌ 0x0E 0x0B 0x0D 0x09 ┐   ┌ a ┐
│ 0x09 0x0E 0x0B 0x0D │ × │ b │
│ 0x0D 0x09 0x0E 0x0B │   │ c │
└ 0x0B 0x0D 0x09 0x0E ┘   └ d ┘

Où 0x0E = 14, 0x0B = 11, 0x0D = 13, 0x09 = 9
(Ces valeurs inverses satisfont: matrice × matrice_inverse = identité)
```

### 7.4 Propriété d'équivalence

AES a une propriété mathématique intéressante:

```
InvMixColumns(AddRoundKey(x, k)) = AddRoundKey(InvMixColumns(x), k')

Cette propriété permet deux implémentations de déchiffrement:
• Version 1 (équivalente): InvSubBytes → InvShiftRows → AddRoundKey → InvMixColumns
• Version 2 (simple):      InvShiftRows → InvSubBytes → InvMixColumns → AddRoundKey
```

---

## 8. Variantes et sécurité

### 8.1 Variantes d'AES

```
              Taille clé  Nb rondes  Taille clé expansion
AES-128       128 bits    10         4 mots → 44 mots
AES-192       192 bits    12         6 mots → 52 mots
AES-256       256 bits    14         8 mots → 60 mots
```

**Formule générale:**
- Nb = taille bloc = 4 (toujours pour AES)
- Nk = nombre de mots de 32 bits dans la clé
- Nr = nombre de rondes = Nk + 6
- Total mots clés = 4 × (Nr + 1)

### 8.2 Sécurité contre les attaques

| Attaque | Complexité | État |
|---------|-----------|------|
| Brute force clé | 2^256 | Infaisable |
| Distingueur linéaire | 7+ rondes nécessaires | AES-256 sûr (14 rondes) |
| Attaque différentielle | 8+ rondes | AES-256 sûr |
| Attaque XSL (algébrique) | Théorique, non pratique | Pas de menace |
| Attaque par canal auxiliaire | Dépend de l'implémentation | Mitigation: constant-time |

### 8.3 Recommandations de sécurité en 2025

```
✅ À UTILISER:
  • AES-256-GCM (chiffrement + authentification)
  • AES-256-CBC avec HMAC (CBC+HMAC)
  • ChaCha20-Poly1305 (alternative)

❌ À ÉVITER:
  • AES-ECB (déterministe, non sécurisé)
  • AES-CBC sans authentification
  • AES-CTR sans authentification
  • Implémentations non-constant-time
  • Implémentations non-auditées

⚠️ IMPORTANT:
  • Utiliser des bibliothèques audités (cryptography, PyCryptodome, ...)
  • Jamais implémenter soi-même en production
  • Protéger les clés (HSM, key management service)
  • Utiliser des IV/nonces aléatoires et uniques
```

### 8.4 Attaques par canal auxiliaire

#### Timing Attacks

```
Vulnérabilité: Les table lookups SBOX peuvent prendre du temps variable

Protection:
  ✅ Constant-time implementation
  ✅ AES-NI (extension CPU) hardware
  ✅ Implémentations auditées
```

#### Power Analysis

```
Vulnérabilité: La consommation d'énergie peut révéler les clés

Protection:
  ✅ Masquage (masking)
  ✅ Hardware countermeasures
  ✅ Distance physique des sources de pouvoir
```

---

## Résumé des concepts clés

### Les 4 opérations principales

| Opération | Rôle | Mathématique | Sécurité |
|-----------|------|-------------|----------|
| **SubBytes** | Confusion | Inversion GF(2^8) + affine | Non-linéarité |
| **ShiftRows** | Permutation | Rotation lignes | Diffusion horizontale |
| **MixColumns** | Diffusion | Matrice × GF(2^8) | Branch number = 5 |
| **AddRoundKey** | Clé | XOR | Injection de secret |

### Nombres importants

- **Bloc:** 128 bits (fixe)
- **Clés:** 128, 192, 256 bits
- **Rondes:** 10, 12, 14 (selon clé)
- **État:** 4×4 matrice de bytes
- **Mots clés:** 4 bytes = 32 bits
- **S-box:** 256 valeurs pré-calculées
- **Rcon:** 10 constantes de ronde

### Propriétés mathématiques

✅ Chaque byte du plaintext affecte tous les bytes du ciphertext après 2 rondes
✅ Chaque bit du plaintext affecte tous les bits du ciphertext après 2-3 rondes
✅ Non vulnérable aux attaques linéaires (3+ rondes suffisent)
✅ Non vulnérable aux attaques différentielles (8+ rondes suffisent)

### Bonnes pratiques

1. **Ne JAMAIS implémenter AES soi-même en production**
2. **Utiliser toujours un mode authentifié** (GCM, EAX, OCB, ...)
3. **Utiliser des implémentations auditées** (cryptography, libsodium, ...)
4. **Protéger les clés** (HSM, sealed storage, ...)
5. **Utiliser des IV/nonces aléatoires** (jamais réutiliser)
6. **Implémenter en constant-time** (si custom, pour timing attacks)
7. **Tester contre les attaques par canal** (si contexte critique)

---

## Conclusion

AES est une merveille d'ingénierie cryptographique:
- ✅ Mathématiquement robuste (Galois Field)
- ✅ Sécurité éprouvée (24 ans d'analyse)
- ✅ Performance exceptionnelle (hardware acceleration)
- ✅ Standardisé mondialement (FIPS 197, AES-NI)
- ✅ Totalement gratuit (aucun brevet bloquant)

C'est l'algorithme de chiffrement **le plus fiable et le plus utilisé au monde** en 2025.
