#!/usr/bin/env python3
"""
Tests fumée pédagogiques pour le générateur/chiffreur.
Chaque scénario imprime ce qui entre, ce qui sort, et pourquoi on vérifie.
"""

from main import crypt_bytes, decrypt_bytes
from sources.encoding import utf8_encode, utf8_decode, hex_encode, hex_decode

KEY_HEX = "f3eb9305ae395fb905b62e1d76df333f"
KEY = hex_decode(KEY_HEX)


def explain(title: str):
    print("\n" + "=" * 72)
    print(title)
    print("=" * 72)


def run_case(label: str, plain_text: str, expected_cipher_hex: str | None):
    explain(f"Cas : {label}")
    print(f"Clé utilisée (hex) : {KEY_HEX}")
    print(f"Texte clair : {repr(plain_text)}")

    plain_bytes = utf8_encode(plain_text)
    print(f"Encodage UTF-8 -> octets : {plain_bytes}")

    cipher_bytes = crypt_bytes(plain_bytes, KEY)
    cipher_hex = hex_encode(cipher_bytes)
    print(f"Chiffrement -> hex : {cipher_hex}")

    if expected_cipher_hex is not None:
        assert cipher_hex == expected_cipher_hex, (
            f"Cipher attendu {expected_cipher_hex}, obtenu {cipher_hex}"
        )
        print("✔ Cipher exact comme attendu.")
    else:
        print("✔ Pas de cipher attendu (cas entrée vide).")

    decipher_bytes = decrypt_bytes(cipher_bytes, KEY)
    decipher_text = utf8_decode(decipher_bytes)
    print(f"Déchiffrement -> octets : {decipher_bytes}")
    print(f"Déchiffrement -> texte : {repr(decipher_text)}")

    assert decipher_text == plain_text, "Le texte déchiffré doit égaler le texte clair"
    print("✔ Round-trip OK (texte déchiffré identique).")


def main():
    explain("Smoke tests — tour d'horizon rapide")

    run_case(
        "Texte court (1 bloc)",
        plain_text="Texte",
        expected_cipher_hex="4e5d7a10a25fb5fe189f6d15d8ddd869",
    )

    run_case(
        "Deux blocs + padding zéro",
        plain_text="abcdefghijklmnopqrstu",  # 21 octets -> 2 blocs de 16
        expected_cipher_hex="9b96ecfea215ab8fd2e4f81cd6133344a95db0105b5fb5fe18df6d15d8ddd869",
    )

    run_case(
        "Unicode (UTF‑8)",
        plain_text="éà漢",
        expected_cipher_hex="865da410d85fb6fe18bd6de4d8f7d869",
    )

    run_case(
        "Entrée vide",
        plain_text="",
        expected_cipher_hex="",
    )

    print("\n✅ Tous les scénarios fumée sont passés.")


if __name__ == "__main__":
    main()
