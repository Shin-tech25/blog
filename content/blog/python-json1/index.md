---
templateKey: blog-post
title: "Pythonで始めるJSON入門：基本からファイル操作、Web API活用まで"
date: "2025-02-28"
description: "この記事では、JSONの基本概念からPythonを使ったエンコード・デコード、ファイル操作、そしてWeb APIとの連携方法について、実例を交えて分かりやすく解説します。"
tags: ["Python", "JSON", "WebAPI"]
featuredImage: ../thumbnails/python3.jpg
relatedPosts:
---

## 1. JSON とは

**JSON (JavaScript Object Notation)** は、データをテキスト形式で表現する方法の一つです。JavaScript のオブジェクト表記をもとに考案されましたが、現在では多くのプログラミング言語で扱えるようになっており、データ交換や設定ファイルなど幅広い用途で利用されています。

JSON の大きな特徴は、キーと値の組み合わせ（オブジェクト）や配列を組み合わせるだけで、複雑な構造のデータをシンプルに表現できる点です。さらに、テキスト形式のため可読性が高く、人間が直接ファイルを開いて確認・編集しやすいというメリットがあります。  
最近では MySQL 5.7 以降や MongoDB のように、JSON 型をネイティブで扱えるデータベースも増えています。

## 2. Python での JSON エンコード・デコード

Python では、標準ライブラリとして提供されている `json` モジュールを使うことで、JSON 形式のデータを手軽に扱えます。主に “Python のオブジェクトを JSON 文字列に変換（エンコード）” する処理と、その逆の “JSON 文字列を Python のオブジェクトに変換（デコード）” する処理が簡単に行えます。

### 2.1 エンコード（Python → JSON）

Python の辞書やリストなどのオブジェクトを JSON 形式に変換するには、`json.dumps()` 関数を使います。以下は簡単な例です。

```python
import json

# Pythonの辞書をJSON文字列に変換する例
data = {
    "id": 456,
    "entities": {
        "urls": ["https://example.com"],
        "hashtags": ["mytag", "pythontag"],
        "user": "example_user"
    }
}

json_str = json.dumps(data)
print(json_str)  # 文字列として出力される
```

このとき、`json_str` は JSON 形式の文字列になっています。見やすく整形したい場合は、`indent` オプションでインデントを設定したり、`sort_keys=True` を指定してキーの順番をソートすることもできます。

```python
json_str_pretty = json.dumps(data, indent=2, sort_keys=True)
print(json_str_pretty)
```

### 2.2 デコード（JSON → Python）

JSON 文字列を Python の辞書やリストなどに変換するには、`json.loads()` 関数を使います。たとえば、以下のような JSON 文字列を読み込んでみましょう。

```python
import json

json_str = '{"id": 123, "entities": {"hashtags": ["python", "pythontips"], "user": "someone"}}'
python_obj = json.loads(json_str)
print(python_obj)
```

実行すると、Python の辞書として `{'id': 123, 'entities': {'hashtags': ['python', 'pythontips'], 'user': 'someone'}}` のような形で読み込まれます。なお、数値をすべて `Decimal` 型で読み込みたいときなどは、`parse_float=Decimal` のようにオプションを指定することで、変換先を自由にカスタマイズできます。

```python
from decimal import Decimal

json_str = '[1, 2.5, "text", null, true]'
loaded_data = json.loads(json_str, parse_float=Decimal)
print(loaded_data)
# 出力例: [1, Decimal('2.5'), 'text', None, True]
```

## 3. JSON ファイルの読み書き

JSON はファイルに保存されることが多く、Python ではファイル操作を行う際に `json.dump()` や `json.load()` を使うのが便利です。文字列を直接扱う `json.dumps()` / `json.loads()` と似ていますが、引数にファイルオブジェクトを渡す点が異なります。

### 3.1 JSON ファイルへの書き込み

たとえば、辞書形式のデータを JSON ファイルに保存する場合は、次のように書きます。

```python
import json

data = {
    "user": "example_user",
    "items": ["apple", "banana", "orange"]
}

with open("sample.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
```

ここで `indent=2` を指定すると、改行とインデントが入った読みやすい JSON 形式で書き込まれます。また、`ensure_ascii=False` を指定すると、日本語などの非 ASCII 文字もそのまま表示されるので、文字化けを防ぎたいときに便利です。

### 3.2 JSON ファイルの読み込み

逆に、ファイルから JSON を読み込む場合は `json.load()` を使います。

```python
import json

with open("sample.json", "r", encoding="utf-8") as f:
    loaded_data = json.load(f)

print(loaded_data)
```

`json.loads()` は文字列を引数に取る関数なので、ファイル全体を文字列として読み込んでから `json.loads()` を使う方法もありますが、`json.load()` を使うほうがシンプルです。

## 4. JSON でよくある応用例

### 4.1 Web API のレスポンス解析

多くの Web API は、レスポンスを JSON 形式で返してきます。Python では `requests` モジュールなどを使って API にアクセスし、その結果を `json.loads()` あるいは `response.json()` で処理するのが一般的です。

```python
import requests

response = requests.get("https://api.example.com/data")
if response.status_code == 200:
    data = response.json()  # json.loads(response.text) と同等
    print(data)
```

このように取得したデータは、そのまま Python の辞書やリストとして扱えるため、後続の処理をスムーズに行えます。

### 4.2 CLI ツールとしての利用

`curl` や `httpie` などのコマンドラインツールで JSON データを取得し、Python スクリプトにパイプで渡して解析する、という使い方もよく見かけます。大規模なログ処理やバッチ処理でも、JSON は軽量なフォーマットとして重宝されます。

## 5. JSON エンコード時のエラーと対処法

`json.dumps()` を使って Python のオブジェクトをエンコードしようとしたとき、たとえば `datetime` オブジェクトや `Decimal` オブジェクトなど、標準ではサポートされていない型が含まれていると `TypeError` が発生します。

### 5.1 TypeError の回避方法

このようなエラーを回避するには、`default` パラメータを利用して、標準ではシリアライズできないオブジェクトをどのように変換するかを定義します。次の例では、`datetime` オブジェクトを ISO 8601 形式の文字列に変換するようカスタマイズしています。

```python
import json
from datetime import datetime

def default_converter(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

data_with_datetime = {
    "user": "sample",
    "created_at": datetime(2022, 5, 10, 15, 30, 0)
}

json_str = json.dumps(data_with_datetime, default=default_converter)
print(json_str)
```

これで、`datetime` が含まれていても問題なくエンコードできます。他の独自クラスや型を扱う場合も、同じように `default` を使って独自のシリアライズ方法を定義すれば対応可能です。

## 6. まとめ

JSON は、軽量で可読性に優れたデータ形式として、Web API から設定ファイルまで幅広く使われています。Python では標準ライブラリの `json` モジュールを使うだけで、エンコード（Python → JSON）とデコード（JSON → Python）をとても簡単に実装できます。さらに、`dump` / `load` を活用すればファイル操作もシンプルに行えるため、ログの書き出しやデータの保存・読み込みなど、さまざまな場面で活用できるでしょう。

もし JSON エンコード時に `TypeError` が発生する場合は、`default` パラメータでカスタム変換ロジックを用意するとスムーズです。XML と比較すると扱いやすく、軽量なフォーマットであることから、現代の Web システムやマイクロサービスの連携において JSON はますます欠かせない存在になっています。興味があれば、公式ドキュメントを参考にさらに深掘りしてみてください。

### 参考リンク

- [公式ドキュメント: json — JSON encoder and decoder](https://docs.python.org/3/library/json.html)

以上が、JSON の概要と Python での基本的な活用方法です。自分のプロジェクトでも試してみると、コードの可読性やデータ交換のしやすさを実感できるはずです。
