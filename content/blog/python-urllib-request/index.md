---
templateKey: blog-post
title: "PythonでHTTPリクエストを送る - urllib.request"
date: "2025-02-17"
description: "Python標準ライブラリ urllib.request を使用して、GET・POST・DELETEなどのHTTPリクエストを送信し、レスポンスを取得する方法を解説します。"
tags: ["Python", "urllib"]
featuredImage: ../thumbnails/python2.jpg
relatedPosts: ["python-urlencode-parse_qs-parse_qsl"]
---

## 概要

Python の標準ライブラリ `urllib.request` は、Web 上のリソースにアクセスするためのインターフェースを提供します。HTTP リクエストを送信し、レスポンスを取得するための便利な機能が揃っています。

公式ドキュメントでも、より高機能な `requests` ライブラリの使用が推奨されていますが、`urllib.request` は追加のライブラリをインストールすることなく、シンプルな HTTP リクエストを実装するのに適しています。

本記事では、`urllib.request` を使用した基本的な HTTP リクエストの方法を解説し、GET・POST・DELETE などの HTTP メソッドの使い方や、レスポンスの処理方法について詳しく説明します。

## `urllib.request` の基本

### `urlopen()` を使用した基本的な GET リクエスト

`urllib.request.urlopen()` を使用すると、シンプルな GET リクエストを実行できます。

```python
from urllib import request

# GETリクエストを送信
with request.urlopen('https://httpbin.org/get') as response:
    res_data = response.read().decode('utf-8')
    print(res_data)
```

このコードでは `urlopen()` に URL を渡すだけで、HTTP リクエストを送信し、レスポンスデータを取得できます。レスポンスは `bytes` 型で返されるため、デコードして `str` 型に変換する必要があります。

## クエリ文字列を含む GET リクエスト

URL にクエリ文字列を含める場合、`urllib.parse` の `urlencode()` を利用すると便利です。

```python
from urllib import request, parse

# クエリパラメータを辞書で定義
params = {"key1": "value1", "key2": "value2"}
query_string = parse.urlencode(params)
url = f"https://httpbin.org/get?{query_string}"

# GETリクエストを送信
with request.urlopen(url) as response:
    res_data = response.read().decode('utf-8')
    print(res_data)
```

辞書で定義したクエリパラメータを `urlencode()` でエンコードすることで、安全に URL へ埋め込むことができます。

## `POST` メソッドを使用したリクエスト

POST リクエストを送る場合、`urlopen()` の `data` 引数に `bytes` 型のデータを渡します。

```python
from urllib import request

url = "https://httpbin.org/post"
data = "key1=value1&key2=value2".encode("utf-8")

# POSTリクエストを送信
with request.urlopen(url, data=data) as response:
    res_data = response.read().decode("utf-8")
    print(res_data)
```

`data` は `bytes` 型である必要があるため、`.encode("utf-8")` を使用してエンコードしています。

## `DELETE` メソッドを使用したリクエスト

DELETE リクエストを送る場合、`Request` クラスを使用し、HTTP メソッドを明示的に指定します。

```python
from urllib import request

url = "https://httpbin.org/delete"
req = request.Request(url, method="DELETE")

# DELETEリクエストを送信
with request.urlopen(req) as response:
    res_data = response.read().decode("utf-8")
    print(res_data)
```

## カスタムヘッダーを設定する

HTTP リクエスト時にカスタムヘッダーを設定する場合、`Request` クラスの `headers` 引数に辞書を渡します。

```python
from urllib import request

url = "https://httpbin.org/get"
headers = {"Accept": "application/json"}
req = request.Request(url, headers=headers)

with request.urlopen(req) as response:
    res_data = response.read().decode("utf-8")
    print(res_data)
```

これにより、リクエストに `Accept: application/json` ヘッダーを追加できます。

## レスポンスの処理

### ステータスコードの取得

レスポンスオブジェクトには、HTTP ステータスコードを取得する `status` 属性があります。

```python
from urllib import request

url = "https://httpbin.org/get"

with request.urlopen(url) as response:
    print("ステータスコード:", response.status)
```

### ヘッダー情報の取得

レスポンスのヘッダー情報を取得するには `headers` 属性を利用します。

```python
from urllib import request

url = "https://httpbin.org/get"

with request.urlopen(url) as response:
    print("レスポンスヘッダー:")
    print(response.headers)
```

## `urllib.request` のエラーハンドリング

`urllib.request` を使用する際には、`URLError` や `HTTPError` 例外に対応したエラーハンドリングを行うことが重要です。

```python
from urllib import request, error

url = "https://httpbin.org/status/404"  # 存在しないURL

try:
    with request.urlopen(url) as response:
        print(response.read().decode("utf-8"))
except error.HTTPError as e:
    print(f"HTTPエラー: {e.code} {e.reason}")
except error.URLError as e:
    print(f"URLエラー: {e.reason}")
```

このコードでは、`HTTPError`（HTTP ステータスエラー）と `URLError`（無効な URL や接続エラー）をキャッチし、適切に処理しています。

## まとめ

本記事では、`urllib.request` を使用して HTTP リクエストを送る方法について解説しました。

- `urlopen()` を使用した GET・POST リクエスト
- `Request` クラスを用いた DELETE リクエスト
- クエリパラメータの組み込み
- カスタムヘッダーの設定
- レスポンスの処理（ステータスコード、ヘッダー情報）
- エラーハンドリング

シンプルな HTTP リクエストを実装する場合には `urllib.request` で十分対応できますが、より柔軟で強力な機能を求める場合は `requests` ライブラリの利用を検討すると良いでしょう。
