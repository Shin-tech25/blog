---
templateKey: blog-post
title: "Pythonでデータをエンコード・デコードする - base64"
date: "2025-02-08"
description: "Pythonの標準ライブラリbase64を使い、バイナリデータをエンコード・デコードする方法を詳しく解説します。Web開発やデータ転送で役立つ実用例も紹介します。"
tags: ["Python", "base64"]
featuredImage: ../thumbnails/python2.jpg
---

# Python でデータをエンコード・デコードする - base64

テキスト形式でのみバイナリデータ（画像やファイルなど）を取り扱う必要がある場面では、バイナリデータをエンコードする方法が重要です。Python 標準ライブラリの `base64` モジュールは、Base64 や Base16 などの形式でデータを簡単にエンコード・デコードできる便利なツールです。本記事では、この `base64` モジュールの基本的な使い方から応用的な活用方法までを解説します。

## 1. 概要

`base64` モジュールは、データをテキスト形式でエンコード・デコードするためのツールです。特に、バイナリデータ（画像、音声ファイルなど）をそのまま使用できない環境で役立ちます。

### なぜバイナリデータをそのまま利用できないのか？

多くの通信プロトコルやフォーマット（例: HTTP、電子メール、JSON）は、純粋なテキストデータしか扱えません。そのため、バイナリデータを直接これらのシステムで送信または保存しようとすると、不具合が発生したり、データが破損したりする可能性があります。

バイナリデータには、制御文字やシステムで解釈される特殊なバイト（例: NULL 文字）が含まれることがあります。これらの文字は、通信や保存時にエラーを引き起こす原因となります。

### テキスト形式に変換すると何が解決するのか？

Base64 エンコードなどの方法を使用すると、バイナリデータをアルファベット（a-z, A-Z）や数字（0-9）、記号（+ / =)のみを含むテキスト形式に変換できます。これにより、次のような利点があります：

- **通信の互換性**：電子メールや HTTP プロトコルで安全に送信可能。
- **可読性**：JSON や XML の中に埋め込むことで、構造化データの一部として利用可能。
- **エラー防止**：制御文字や特殊文字を除外するため、データ破損のリスクを低減。

### バイナリをテキストにエンコードして通信可能にし、デコードして利用する

Base64 はバイナリデータをテキストにエンコードすることで、テキスト形式しか扱えない環境でもデータの送受信を可能にします。データを受信した後は、デコードすることで元のバイナリデータに復元できます。この仕組みにより、安全かつ互換性の高いデータ転送が実現されます。

具体的には、Base64 エンコードはバイナリデータをテキスト形式に変換することで、データを安全に転送し、処理する方法を提供します。この仕組みが多くの分野で採用されています。

## 2. Base64 でエンコード/デコードする方法

### エンコード

Base64 エンコードを行うには、`b64encode()` 関数を使用します。ただし、この関数はバイト列（`bytes` 型）を受け取るため、文字列（`str` 型）の場合は `encode()` を使って事前にバイト列に変換する必要があります。

#### 基本的な使用例

```python
import base64

# エンコード対象の文字列
original_str = "Pythonは素晴らしい言語です。"

# バイト列に変換してエンコード
encoded = base64.b64encode(original_str.encode())
print(encoded)  # b'UHl0aG9u44Gu5a6i5LqL44Gn44GZ44CC'
```

#### エンコード結果のカスタマイズ

デフォルトでは、「+」と「/」が Base64 エンコードの結果に含まれますが、`altchars` 引数を使うことでこれらの文字をカスタマイズできます。

```python
# + を @ に、/ を * に置き換える
custom_encoded = base64.b64encode(original_str.encode(), altchars=b'@*')
print(custom_encoded)  # b'UHl0aG9u44Gu5a6i5LqL44Gn44GZ44CC@*'
```

### デコード

Base64 でエンコードされたデータを元に戻すには、`b64decode()` 関数を使用します。

#### 基本的な使用例

```python
# デコード
decoded = base64.b64decode(encoded).decode()
print(decoded)  # "Pythonは素晴らしい言語です。"
```

#### `altchars` を使ったデコード

エンコード時に `altchars` を使用した場合は、デコード時にも同じ `altchars` を指定する必要があります。

```python
# カスタムエンコードされたデータをデコード
custom_decoded = base64.b64decode(custom_encoded, altchars=b'@*').decode()
print(custom_decoded)  # "Pythonは素晴らしい言語です。"
```

## 3. 実用例

### URL に安全なエンコード

Web アプリケーションでは、URL に安全な形式でデータをエンコードする必要があります。この場合、`urlsafe_b64encode()` と `urlsafe_b64decode()` を使用します。

#### 使用例

```python
import base64

# URLセーフなエンコード
original_str = "データを安全にエンコード"
url_safe_encoded = base64.urlsafe_b64encode(original_str.encode())
print(url_safe_encoded)  # URLセーフなBase64エンコード結果

# URLセーフなデコード
url_safe_decoded = base64.urlsafe_b64decode(url_safe_encoded).decode()
print(url_safe_decoded)  # 元の文字列に戻る
```

URL のクエリパラメータやフォームデータに埋め込む場合に特に役立ちます。

### 電子メールや HTTP リクエスト

電子メールや HTTP リクエストでバイナリデータをテキスト形式で送信する際に Base64 が役立ちます。たとえば、画像やファイルのデータをエンコードして送信することができます。

#### 使用例

```python
import base64

# ファイルの読み込みとBase64エンコード
with open("sample.txt", "rb") as file:
    encoded_data = base64.b64encode(file.read())
    print(encoded_data)  # エンコードされたデータ

# デコードして元のデータに戻す
decoded_data = base64.b64decode(encoded_data)
with open("decoded_sample.txt", "wb") as file:
    file.write(decoded_data)
```

電子メールの添付ファイルや HTTP の POST リクエストの一部として利用可能です。

### JSON

画像データやバイナリデータを JSON に埋め込む場合にも Base64 が利用されます。これにより、バイナリデータを安全に JSON 形式で送信できます。

#### 使用例

```python
import base64
import json

# 画像データをBase64エンコード
with open("example.png", "rb") as img_file:
    encoded_img = base64.b64encode(img_file.read()).decode('utf-8')

# JSONオブジェクトに埋め込む
json_data = json.dumps({"image_data": encoded_img})
print(json_data)  # JSON形式のデータ

# JSONからデータをデコードして元の状態に戻す
decoded_json = json.loads(json_data)
decoded_img = base64.b64decode(decoded_json["image_data"])
with open("decoded_example.png", "wb") as img_file:
    img_file.write(decoded_img)
```

これにより、画像やバイナリファイルを安全に API やデータベースに送信できます。

### JWT

Base64 は JWT（JSON Web Token）のデータエンコードにも使用されます。JWT は 3 つの部分（ヘッダー、ペイロード、署名）で構成され、それぞれ Base64 でエンコードされています。

#### JWT のヘッダーとペイロードをデコード

以下は、JWT のヘッダーとペイロード部分をデコードする例です：

```python
import json
import base64

jwt_token = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
    "sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
)

# JWTの各部分を分割
header, payload, signature = jwt_token.split('.')

# ヘッダーをデコード
header_data = json.loads(base64.urlsafe_b64decode(header + "==").decode())
print("Header:", header_data)

# ペイロードをデコード
payload_data = json.loads(base64.urlsafe_b64decode(payload + "==").decode())
print("Payload:", payload_data)
```

JWT の構造を理解し、必要に応じてデータを検証する際に役立ちます。

## 4. 結論

`base64` モジュールは、バイナリデータを扱う際に非常に便利なツールです。エンコード・デコードの基本的な使い方から、応用的な活用方法まで幅広くサポートしており、特に Web 開発やデータ転送の場面で活躍します。このモジュールを活用し、安全かつ効率的なデータ操作を実現しましょう！
