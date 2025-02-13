---
templateKey: blog-post
title: "Pythonでセキュアな乱数を生成する - secrets"
date: "2025-02-09"
description: "Pythonのsecretsモジュールを使って、安全なパスワードやトークンを生成する方法を解説。タイミング攻撃への対策や実用例も詳しく紹介します。"
tags: ["Python", "セキュリティ", "secrets", "random"]

---


Pythonには、セキュアな乱数生成をサポートする標準ライブラリ `secrets` があります。このモジュールは、暗号学的に安全な乱数を生成するために設計されており、パスワードやトークンなどの機密情報を扱う際に推奨されます。本記事では、`secrets` モジュールの基本的な使い方から応用例までを解説します。


## 1. 概要

### `random` モジュールとの違い

Pythonの乱数生成には `random` モジュールもありますが、これは暗号学的なセキュリティが必要ない場合（例: シミュレーションや統計計算）に適しています。一方で、`secrets` は機密性が必要な場合（例: パスワード生成やトークン生成）に使用されます。

### 主な用途

- 安全なパスワード生成
- 認証トークンの生成
- URLなどに埋め込む推測困難なキーの生成

`secrets` モジュールを利用することで、ブルートフォース攻撃やタイミング攻撃といったセキュリティリスクを軽減できます。


## 2. パスワードを生成する

### 基本的なパスワード生成

文字列からランダムに選択された文字を組み合わせてパスワードを生成するには、`secrets.choice()` を使用します。

#### 使用例

```python
import secrets
import string

# アルファベットと数字を含む文字セット
alpha_num = string.ascii_letters + string.digits

# 8文字のランダムなパスワードを生成
password = ''.join(secrets.choice(alpha_num) for _ in range(8))
print(password)  # 例: 'Ab1Cd2Ef'
```

`string` モジュールを使うことで、アルファベットや数字、特殊文字を簡単に指定できます。

### 条件付きパスワード生成

アルファベット、数字、特殊文字をすべて含むパスワードを生成するには、以下のような方法を取ります。

#### 使用例

```python
import secrets
import string

# 使用する文字セット
special_chars = '!@#$%^&*'
pwd_chars = string.ascii_letters + string.digits + special_chars

while True:
    password = ''.join(secrets.choice(pwd_chars) for _ in range(10))
    # 必須条件を満たしているか確認
    if (any(c in string.ascii_letters for c in password) and
        any(c in string.digits for c in password) and
        any(c in special_chars for c in password)):
        break

print(password)  # 例: 'A1@d3$FgH'
```

この方法により、条件を満たした安全なパスワードを生成できます。


## 3. トークンを生成する

### トークン生成の概要

`secrets` モジュールは、以下の関数を使ってトークンを生成します：

- `secrets.token_bytes(n=None)`：ランダムなバイト列を生成
- `secrets.token_hex(n=None)`：ランダムな16進数文字列を生成
- `secrets.token_urlsafe(n=None)`：URLセーフなBase64エンコード文字列を生成

### トークン生成の例

#### 使用例

```python
import secrets

# ランダムなバイト列を生成
print(secrets.token_bytes(16))  # 例: b'\x1f\x8b\xe3...'

# ランダムな16進数文字列を生成
print(secrets.token_hex(16))  # 例: '1f8be37f...'

# URLセーフなBase64エンコード文字列を生成
print(secrets.token_urlsafe(16))  # 例: '7Fhc3Qx...'
```

### トークンサイズの考慮

トークンサイズはセキュリティに影響します。小さいサイズは推測を容易にするため、利用シーンに応じて十分な長さを指定してください。デフォルトのトークンサイズは、一般的な用途において十分な安全性を提供します。


## 4. トークンの比較

生成したトークンを検証する際は、`secrets.compare_digest()` を使用します。これは、タイミング攻撃を防ぐために設計されています。

#### 使用例

```python
import secrets
from urllib import parse

# トークンを生成
reset_token = secrets.token_urlsafe()

# URLにトークンを埋め込む
url = f'https://example.com/?reset={reset_token}'

# URLからトークンをパース
parsed_url = parse.urlparse(url)
query_params = parse.parse_qs(parsed_url.query)
received_token = query_params['reset'][0]

# トークンを比較
if secrets.compare_digest(reset_token, received_token):
    print("トークンが一致しました")
else:
    print("トークンが一致しません")
```

`compare_digest()` を使用することで、比較処理が同じ時間で行われ、タイミング攻撃のリスクを軽減できます。


## 5. 実用例

### ワンタイムパスワードの生成

ワンタイムパスワード（OTP）の生成に `secrets` モジュールを活用できます。

#### 使用例

```python
import secrets

# 6桁のワンタイムパスワードを生成
otp = ''.join(str(secrets.randbelow(10)) for _ in range(6))
print(otp)  # 例: '837295'
```

### 安全なURLの生成

認証URLや一時的なリンクの生成にも役立ちます。

#### 使用例

```python
import secrets

# ランダムなキーを含むURLを生成
key = secrets.token_urlsafe(16)
url = f'https://example.com/reset?key={key}'
print(url)  # 例: 'https://example.com/reset?key=7Fhc3Qx...'
```


## 6. 結論

`secrets` モジュールは、暗号学的に安全な乱数を生成するための強力なツールです。パスワードやトークンの生成、機密性が求められるシステムでの使用が推奨されます。本記事で紹介した基本的な使い方や応用例を参考に、セキュリティの高いPythonプログラムを構築してください！

