# AES - Visualisations et Diagrammes

## 1. Vue globale du chiffrement AES-256

```
┌───────────────────────────────────────────────────────────────┐
│                      PLAINTEXT (16 bytes)                     │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Key Expansion     │ ◄─── Clé (32 bytes)
                    │   (KeySchedule)     │
                    └─────────────────────┘
                              │
                    ┌─────────▼──────────────────────┐
                    │  RONDE 0: AddRoundKey          │
                    │  state ⊕ RoundKey[0]           │
                    └──────────┬───────────────────────┘
                              │
        ┌─────────────────────────────────────────────────┐
        │      RONDES PRINCIPALES 1-13 (13 fois)          │
        │                                                   │
        │  ┌──────────────────────────────────────────┐  │
        │  │ 1. SubBytes (Confusion)                 │  │
        │  │    Chaque byte → SBOX[byte]             │  │
        │  └──────────────────────────────────────────┘  │
        │                    ▼                            │
        │  ┌──────────────────────────────────────────┐  │
        │  │ 2. ShiftRows (Permutation)              │  │
        │  │    Rotation cyclique des lignes         │  │
        │  └──────────────────────────────────────────┘  │
        │                    ▼                            │
        │  ┌──────────────────────────────────────────┐  │
        │  │ 3. MixColumns (Diffusion)               │  │
        │  │    Multiplication matricielle GF(2^8)   │  │
        │  └──────────────────────────────────────────┘  │
        │                    ▼                            │
        │  ┌──────────────────────────────────────────┐  │
        │  │ 4. AddRoundKey                          │  │
        │  │    state ⊕ RoundKey[i]                  │  │
        │  └──────────────────────────────────────────┘  │
        │                                                   │
        └─────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────────────────┐
                    │ RONDE 14 FINALE (différente!)  │
                    │                                │
                    │ 1. SubBytes                    │
                    │ 2. ShiftRows                   │
                    │ 3. AddRoundKey                 │
                    │ (PAS DE MixColumns!)           │
                    └──────────┬───────────────────────┘
                              │
                              ▼
                ┌───────────────────────────────────────────────────────────────┐
                │                     CIPHERTEXT (16 bytes)                      │
                └───────────────────────────────────────────────────────────────┘
```

---

## 2. État (State Matrix) - Visualisation colonne-major

```
PLAINTEXT BYTES (16):
  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F

ÉTAT INITIAL (ordre colonne-major):

    Colonne 0   Colonne 1   Colonne 2   Colonne 3
    ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐
    │ 00  │     │ 04  │     │ 08  │     │ 0C  │  Ligne 0
    ├─────┤     ├─────┤     ├─────┤     ├─────┤
    │ 01  │     │ 05  │     │ 09  │     │ 0D  │  Ligne 1
    ├─────┤     ├─────┤     ├─────┤     ├─────┤
    │ 02  │     │ 06  │     │ 0A  │     │ 0E  │  Ligne 2
    ├─────┤     ├─────┤     ├─────┤     ├─────┤
    │ 03  │     │ 07  │     │ 0B  │     │ 0F  │  Ligne 3
    └─────┘     └─────┘     └─────┘     └─────┘

Matrix 4×4:
    ┌──────────────────────┐
    │ 00 04 08 0C │
    │ 01 05 09 0D │
    │ 02 06 0A 0E │
    │ 03 07 0B 0F │
    └──────────────────────┘
```

---

## 3. SubBytes - Substitution (Confusion)

```
ENTRÉE:                    PROCESSUS:                 SORTIE:

State matrix:              Pour chaque byte:          Nouvel état:
┌─────────────┐           byte → SBOX[byte]         ┌─────────────┐
│ 00 04 08 0C │                                      │ 63 C4 27 2E │
│ 01 05 09 0D │           SBOX =                     │ 7C 81 77 CB │
│ 02 06 0A 0E │           [0x63, 0x7C, 0x77, 0x7B,  │ 77 C0 F2 EB │
│ 03 07 0B 0F │            0xF2, 0x6B, 0x6F, 0xC5,  │ 7B F0 C5 12 │
└─────────────┘            ... (256 valeurs total)   └─────────────┘

            Propriétés:
            ✓ Non-linéaire (résiste cryptanalyse linéaire)
            ✓ Aucun byte ne reste inchangé
            ✓ Aucun byte ne devient son complément
            ✓ Étendue différentielle bornée
```

---

## 4. ShiftRows - Permutation des lignes

```
AVANT ShiftRows:              APRÈS ShiftRows:

┌────────────────┐            ┌────────────────┐
│ A  B  C  D     │            │ A  B  C  D     │  Ligne 0: ← pas de décalage
│ E  F  G  H     │            │ F  G  H  E     │  Ligne 1: ← rotation 1
│ I  J  K  L     │    ──→     │ K  L  I  J     │  Ligne 2: ← rotation 2
│ M  N  O  P     │            │ P  M  N  O     │  Ligne 3: ← rotation 3
└────────────────┘            └────────────────┘

            Utilité:
            ✓ Diffusion horizontale
            ✓ Combine avec MixColumns → diffusion complète
```

---

## 5. MixColumns - Diffusion verticale

```
AVANT MixColumns:             OPÉRATION MATRICIELLE GF(2^8):

Colonne 0:                    ┌ 0x02 0x03 0x01 0x01 ┐   ┌ a ┐   ┌ e ┐
┌───┐                         │ 0x01 0x02 0x03 0x01 │ × │ b │ = │ f │
│ a │                         │ 0x01 0x01 0x02 0x03 │   │ c │   │ g │
│ b │                         └ 0x03 0x01 0x01 0x02 ┘   └ d ┘   └ h ┘
│ c │
│ d │  Où:
└───┘  e = (2·a) ⊕ (3·b) ⊕ c ⊕ d
       f = a ⊕ (2·b) ⊕ (3·c) ⊕ d
       g = a ⊕ b ⊕ (2·c) ⊕ (3·d)
       h = (3·a) ⊕ b ⊕ c ⊕ (2·d)

APRÈS MixColumns:             Toutes les multiplications et additions
┌───┐                        sont en GF(2^8)!
│ e │
│ f │
│ g │                        Propriété: Branch number = 5
│ h │                        Si 1 byte change en entrée:
└───┘                        Au minimum 4 bytes changent en sortie
```

---

## 6. AddRoundKey - Injection de clé

```
STATE:                    ROUND KEY:                RÉSULTAT:

┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│ A B C D     │          │ K₀ K₁ K₂ K₃ │          │ A⊕K₀ ... D⊕K₃ │
│ E F G H     │  ⊕       │ K₄ K₅ K₆ K₇ │    =    │ E⊕K₄ ... H⊕K₇ │
│ I J K L     │          │ K₈ K₉ K_A K_B│         │ I⊕K₈ ... L⊕K_B│
│ M N O P     │          │ K_C K_D K_E K_F│       │ M⊕K_C... P⊕K_F│
└─────────────┘          └─────────────┘          └─────────────┘

            Opération: Byte-par-byte XOR avec la clé de ronde

            Propriété: SEULE opération qui dépend de la clé secrète!
```

---

## 7. Key Expansion pour AES-256

```
CLÉ INITIALE (32 bytes = 8 mots):
┌────────────────────────────────────────────────────────────────────┐
│ W[0] W[1] W[2] W[3] W[4] W[5] W[6] W[7]                             │
│ ┌──┬──┬──┬──┐┌──┬──┬──┬──┐┌──┬──┬──┬──┐┌──┬──┬──┬──┐...           │
│ │k₀│k₁│k₂│k₃││k₄│k₅│k₆│k₇││k₈│k₉│...││...                    │
│ └──┴──┴──┴──┘└──┴──┴──┴──┘└──┴──┴──┴──┘└──┴──┴──┴──┘                │
└────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Algorithme        │
                    │  d'expansion       │
                    │  (60 mots)         │
                    └─────────┬──────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────────┐
│ W[8..11] W[12..15] W[16..19] ... W[56..59] (15 clés rondes)       │
│ ┌─────┬─────┬─────┬─────┐   ┌─────┬─────┬─────┬─────┐             │
│ │ ... │ ... │ ... │ ... │...│ ... │ ... │ ... │ ... │             │
│ └─────┴─────┴─────┴─────┘   └─────┴─────┴─────┴─────┘             │
│  Ronde 1  Ronde 2  Ronde 3     Ronde 14                           │
└────────────────────────────────────────────────────────────────────┘

ALGORITHME D'EXPANSION (pour i = 8 à 59):

Si i % 8 == 0:                Si i % 8 == 4:            Sinon:
  temp = RotWord(W[i-1])        temp = SubWord(W[i-1])    temp = W[i-1]
  temp = SubWord(temp)          (pas RotWord)
  temp ^= Rcon[i/8-1]

W[i] = W[i-8] ⊕ temp

Constantes Rcon:
  Rcon[0] = 0x01000000
  Rcon[1] = 0x02000000
  Rcon[2] = 0x04000000
  ...
  Rcon[8] = 0x1B000000  (réduction GF(2^8))
  Rcon[9] = 0x36000000
```

---

## 8. Galois Field GF(2^8) - Opérations

```
ADDITION (XOR):
  10101101  (0xAD)
⊕ 11001010  (0xCA)
───────────
  01100111  (0x67)

Chaque bit indépendant, pas de retenue.


MULTIPLICATION (simple):
  Entrée:    a = 0x57,  b = 0x83
  
  Algorithme:
  result = 0
  Pour chaque bit de b (de droite à gauche):
    • Si bit est 1: result ^= a
    • Décaler a à gauche
    • Si MSB était 1: a ^= 0x1B (réduction)
    • Décaler b à droite
  
  Sortie: a × b = 0xC1


MULTIPLICATION PAR 2 (optimisée):
  
  Si MSB de a est 1:          Si MSB de a est 0:
    a × 2 = (a << 1) ^ 0x1B     a × 2 = (a << 1)
  
  Exemple:                      Exemple:
  0x57: 01010111              0x40: 01000000
   × 2                         × 2
  ──────────────────          ──────────────────
  0xAE: 10101110              0x80: 10000000
  (pas de réduction)          (pas de réduction)


MULTIPLICATION PAR 3:
  a × 3 = (a × 2) ⊕ a
```

---

## 9. Diagramme des dépendances - Effusion avalanche

```
APRÈS 0 RONDE:
  Plaintext byte [0]
        ▼
      [0]              Seul byte [0] affecté

APRÈS SubBytes (Ronde 0):
  [0] ──SubBytes──► [0]'             Seul byte [0]' affecté

APRÈS ShiftRows (Ronde 0):
  [0]' ──ShiftRows──► [position]     Un seul byte déplacé

APRÈS MixColumns (Ronde 0):
  [position] ──MixColumns──► [0,1,2,3]  Affecte toute la colonne (4 bytes)

APRÈS Ronde 1:
  Plaintext byte [0]
        │
        └──Ronde 0──► 4 bytes affectés dans la colonne [0]
              │
              └──Ronde 1──► Tous les 16 bytes du state affectés!


CONCLUSION: Après seulement 2 rondes, un seul byte du plaintext affecte les 16 bytes du ciphertext!
```

---

## 10. Comparaison des variantes AES

```
┌─────────────┬──────────────┬────────────────┬──────────────────┐
│  Variante   │  Taille clé  │  Nb. rondes   │  Sécurité (bits) │
├─────────────┼──────────────┼────────────────┼──────────────────┤
│ AES-128     │  128 bits    │  10 rondes     │  128 bits        │
│ AES-192     │  192 bits    │  12 rondes     │  192 bits        │
│ AES-256     │  256 bits    │  14 rondes     │  256 bits        │
└─────────────┴──────────────┴────────────────┴──────────────────┘

Formule: Nr (rondes) = Nk (mots clés) + 6

Recommendation NIST 2025:
  ✓ AES-128: Suffisant pour données classifiées jusqu'à 2030
  ✓ AES-256: Recommandé pour long-term security (> 2030)
```

---

## 11. Structure du déchiffrement (inverse)

```
CIPHERTEXT
    ▼
  AddRoundKey(W[56..59])
    ▼
  InvShiftRows    ◄─── Inverse de ShiftRows
    ▼
  InvSubBytes     ◄─── Utilise la S-box inverse
    ▼
  AddRoundKey(W[52..55])
    ▼
  InvMixColumns   ◄─── Multiplication par matrice inverse
    ▼
  InvShiftRows
    ▼
  InvSubBytes
    ▼
  AddRoundKey(W[0..3])
    ▼
  PLAINTEXT (retrouvé!)

NOTER: L'ordre des opérations est INVERSÉ et NON SYMÉTRIQUE par rapport au chiffrement!
(Pas simplement inverser le flux)
```

---

## 12. Attaques et résistance

```
ATTAQUES LINÉAIRES:
  ───────────────────
  
  Niveau de difficulté:
  Rondes: 0-3   → Possible (analyse linéaire)
  Rondes: 4-7   → Difficile
  Rondes: 8+    → Impractical
  
  AES-256 a 14 rondes → Complètement sûr

  Contre-mesure d'AES:
    • S-box maximale non-linéarité
    • ShiftRows + MixColumns diffusion complète


ATTAQUES DIFFÉRENTIELLES:
  ────────────────────────
  
  Rondes: 0-4   → Possible (différences détectables)
  Rondes: 5-7   → Difficile
  Rondes: 8+    → Impractical
  
  AES-256 a 14 rondes → Complètement sûr


BRUTE FORCE:
  ──────────
  AES-256: 2^256 possibilités
  
  Temps estimé (1 milliard tentatives/sec):
    2^256 / 10^9 ≈ 1.8 × 10^68 secondes
            ≈ 5.7 × 10^60 années
  
  → Infaisable avec la technologie actuelle


ATTAQUES PAR CANAL AUXILIAIRE:
  ─────────────────────────────
  
  Timing Attacks:    Nombre d'opérations différent selon les données
  Power Analysis:    Consommation énergétique révèle pattern
  Cache Attacks:     Temps d'accès mémoire varie
  
  Contre-mesures:
    ✓ Constant-time implementation
    ✓ AES-NI (hardware instruction set)
    ✓ Implémentations auditées
```

---

## 13. Flux complet d'un bloc - Exemple numérique

```
ENTRÉE:
  Plaintext:  00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF
  Clé:        00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
              10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F

  État initial:
  ┌─────────────────┐
  │ 00 44 88 CC     │
  │ 11 55 99 DD     │
  │ 22 66 AA EE     │
  │ 33 77 BB FF     │
  └─────────────────┘

RONDE 0 - AddRoundKey:
  state ^= W[0..3]
  ┌─────────────────┐
  │ XX XX XX XX     │
  │ XX XX XX XX     │ (changé après XOR avec la clé)
  │ XX XX XX XX     │
  │ XX XX XX XX     │
  └─────────────────┘

RONDE 1:
  1. SubBytes:      Chaque XX → SBOX[XX]
  2. ShiftRows:     Permutation
  3. MixColumns:    Multiplication GF(2^8)
  4. AddRoundKey:   ^= W[4..7]

... (Répéter rondes 2-13) ...

RONDE 14 (finale):
  1. SubBytes:      Chaque XX → SBOX[XX]
  2. ShiftRows:     Permutation
  3. AddRoundKey:   ^= W[56..59]
               (Pas de MixColumns!)

SORTIE:
  Ciphertext: RR SS TT UU VV WW XX YY ZZ AA BB CC DD EE FF GG
              (16 bytes complètement différents du plaintext)
```

---

## 14. Résumé visuel - Points clés

```
┌─────────────────────────────────────────────────────────────────┐
│                    4 OPÉRATIONS FONDAMENTALES                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  SUBBYTES       SHIFTROWS      MIXCOLUMNS     ADDROUNDKEY       │
│  (Confusion)    (Permutation)  (Diffusion)    (Clé secrète)     │
│                                                                   │
│  Non-linéaire   Rotation       Matrice        Injection du      │
│  S-box lookup   par lignes     GF(2^8)        secret             │
│                                                                   │
│  Résiste:       Résiste:       Résiste:       Résiste:          │
│  • Linéaire     • Patterns     • Patterns     • Déterminisme    │
│  • Différent.   • Symétries    • Symétries    • Uniformité      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   PRINCIPES DE SHANNON (1949)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CONFUSION              DIFFUSION                               │
│  (Camoufler la clé)    (Propager l'influence)                  │
│                                                                   │
│  ✓ SubBytes            ✓ ShiftRows (horizontal)                │
│  ✓ Non-linéarité       ✓ MixColumns (vertical)                 │
│  ✓ Affine transform.   ✓ Branch number = 5                     │
│                                                                   │
│  Résultat: Diffusion avalanche                                  │
│  1 bit change → 16 bytes changes (après 2 rondes)              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    NOMBRES IMPORTANTS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Bloc:           128 bits (16 bytes) - FIXE                    │
│  State matrix:   4×4 bytes (colonne-major)                     │
│  Rondes:         AES-128: 10   AES-192: 12   AES-256: 14      │
│  Clés rondes:    4(Nr+1) mots (4, 6, 8 mots par ronde)        │
│  S-box:          256 entrées pré-calculées                     │
│  Mots clés:      32-bit chunks                                 │
│  Constantes:     10 Rcon pour les clés rondes                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

