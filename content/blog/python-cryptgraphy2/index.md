---
templateKey: blog-post
title: "Pythonによる公開鍵暗号化方式 - cryptography"
date: "2025-02-15"
description: "Pythonで公開鍵暗号化方式を実装するためにcryptographyライブラリを使用した方法を解説します。実際のコード例を通して、公開鍵と秘密鍵を利用した暗号化、復号化を学びます。"
tags: ["Python", "暗号化", "cryptography", "セキュリティ"]
featuredImage: ../../thumbnails/security.jpg
relatedPosts:
  - python-cryptgraphy1
---

## 概要

公開鍵暗号化方式（非対称鍵暗号）では、暗号化と復号に異なる鍵（公開鍵と秘密鍵）を使用します。この方式では、公開鍵を使ってデータを暗号化し、秘密鍵でそのデータを復号します。公開鍵は自由に配布可能ですが、秘密鍵は所有者が厳重に保管する必要があります。

公開鍵暗号化の利点は、暗号化に使う鍵（公開鍵）が他者と共有できるため、鍵の配布問題が解決されることです。しかし、共通鍵暗号化方式と比べて、暗号化と復号に時間がかかるため、大量のデータを扱う場合には処理速度が遅くなるという欠点があります。

本記事では、`cryptography` ライブラリを使用して公開鍵暗号化を行う方法を、実践的なコード例を交えて解説します。

## 公開鍵暗号化の実践

公開鍵暗号化を行うためには、まず公開鍵と秘密鍵のペアを生成する必要があります。`cryptography` ライブラリでは、`hazmat` モジュールを使用して RSA 鍵ペアを生成し、公開鍵でデータを暗号化、秘密鍵で復号することができます。

以下に、公開鍵暗号化の実装例を示します。

### 1. `cryptography` ライブラリのインストール

まずは、`cryptography` ライブラリをインストールします。

```bash
$ pip install cryptography
```

### 2. 秘密鍵と公開鍵の生成

公開鍵暗号化方式では、秘密鍵と公開鍵をペアで生成します。`cryptography` ライブラリの `hazmat` モジュールを使用して、RSA 方式で鍵ペアを生成します。

```python
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

# 秘密鍵の生成
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=4096,
    backend=default_backend()
)

# 公開鍵の取得
public_key = private_key.public_key()

print(f"Generated Public Key: {public_key}")
```

このコードでは、RSA の秘密鍵を生成し、`public_key()` メソッドを使って対応する公開鍵を取得しています。生成した鍵は、暗号化や復号の操作に使用されます。

### 3. 公開鍵でデータの暗号化

公開鍵を使用してデータを暗号化するには、`encrypt()` メソッドを使用します。暗号化には、`OAEP`（Optimal Asymmetric Encryption Padding）というパディング方式を使用します。

```python
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

# 暗号化するデータ
message = b"encrypted data"

# 公開鍵で暗号化
cipher_text = public_key.encrypt(
    message,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

print(f"Encrypted Data: {cipher_text}")
```

ここでは、公開鍵を使用してメッセージを暗号化しています。`OAEP`パディングと SHA256 ハッシュアルゴリズムを使用して、セキュリティを高めています。

### 4. 秘密鍵でデータの復号

暗号化されたデータを復号するには、秘密鍵の `decrypt()` メソッドを使用します。復号も、暗号化時と同様に`OAEP`パディングと SHA256 を使用します。

```python
# 秘密鍵で復号
plain_text = private_key.decrypt(
    cipher_text,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

print(f"Decrypted Data: {plain_text.decode()}")
```

このコードでは、秘密鍵を使用して暗号化されたメッセージを復号し、元のメッセージを取り戻しています。

## 公開鍵暗号化のメリットと注意点

### メリット

- **鍵の配布が容易**：公開鍵は自由に配布可能であり、秘密鍵は安全に保管されます。そのため、鍵の配布問題が解決されます。
- **安全な通信**：公開鍵暗号化を使用すると、送信者と受信者の間で安全に通信ができます。公開鍵で暗号化したメッセージは、対応する秘密鍵でのみ復号できます。

### 注意点

- **処理速度の遅さ**：共通鍵暗号化に比べて、公開鍵暗号化は暗号化と復号に時間がかかります。大量のデータを暗号化する際にはパフォーマンスが低下する可能性があります。
- **鍵の管理**：公開鍵と秘密鍵を安全に管理することが重要です。特に秘密鍵は漏洩しないようにしっかりと管理しなければなりません。

## 実践的なコード例まとめ

以下は、公開鍵暗号化と復号化のコード例をまとめたものです。

```python
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend

# 秘密鍵の生成
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=4096,
    backend=default_backend()
)

# 公開鍵の取得
public_key = private_key.public_key()

# 暗号化するデータ
message = b"encrypted data"

# 公開鍵で暗号化
cipher_text = public_key.encrypt(
    message,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# 秘密鍵で復号
plain_text = private_key.decrypt(
    cipher_text,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

print(f"Decrypted Data: {plain_text.decode()}")
```

## まとめ

`cryptography` ライブラリを使用して公開鍵暗号化を行う方法について解説しました。公開鍵暗号化は、セキュリティを確保しつつ、安全に通信するために不可欠な技術です。鍵の管理に関しては注意が必要ですが、公開鍵と秘密鍵を適切に使用することで、安全で効率的な通信が可能になります。実践的なコード例を参考にして、公開鍵暗号化の実装を進めてください。
