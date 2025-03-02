---
templateKey: blog-post
title: "Pythonで始めるYAML入門：PyYAMLで読み書きする方法"
date: "2025-03-02"
description: "この記事では、YAMLの基本概念と、PyYAMLライブラリを使ったYAMLファイルの読み書き方法、さらにセキュリティ上の注意点について具体例を交えて分かりやすく解説します。"
tags: ["Python", "YAML", "PyYAML", "設定管理"]
featuredImage: "../../thumbnails/python3.jpg"
relatedPosts:
    - python-configparser

---


以下では、**YAML (YAML Ain’t Markup Language)** と Python の **PyYAML** を使った設定ファイルの扱い方をまとめて解説します。JSON や INI と同様に、YAML はテキストベースのデータ形式であり、可読性が高く、Ansible などの構成管理ツールでも広く利用されています。Python で YAML を読み書きする場合には、主に **PyYAML** ライブラリを使います。この記事では、PyYAML のインストール方法から基本的な使い方、注意点を紹介します。

## 1. YAML とは

**YAML** は、JSON に似た構造を持つマークアップ言語の一種で、**人間にとって可読性が高い** という点が大きな特徴です。階層構造をインデントで表現し、オブジェクトやリストなどのデータ構造をシンプルに記述できます。

```yaml
db:
  server: localhost
  port: 3306
users:
  - name: Alice
  - name: Bob
```

上記の例のように、キーと値の組み合わせをインデントでネストさせることで、複雑なデータを見やすく整理できます。YAML は Ansible などのツールをはじめ、設定ファイルやデータ交換フォーマットとして広く利用されています。


## 2. PyYAML とは

Python で YAML を扱う際には、**PyYAML** というライブラリがよく利用されます。PyYAML は YAML の読み書き機能を提供し、**safe_load** や **load_all** といった関数を使って YAML データを Python のオブジェクトに変換することが可能です。

### 2.1 インストール

PyYAML は PyPI 上に公開されているため、`pip` で簡単にインストールできます。

```bash
pip install pyyaml
```

インストール後、Python スクリプト内で `import yaml` と記述して使用します。


## 3. YAML ファイルの読み込み

PyYAML では、**load()** や **safe_load()**、**load_all()** などの関数を使って、YAML データを Python の辞書やリストに変換できます。

### 3.1 `safe_load()`

最も推奨される読み込み方法は **`safe_load()`** です。安全に YAML を読み込み、信頼できないデータを扱う際にも比較的安全に利用できます。

```yaml
# sample.yml
db:
  host: localhost
  port: 3306
smtp:
  host: localhost
  user: test
  pass: secret
```

```python
import yaml

with open("sample.yml", "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)

print(data)
# 出力例: {'db': {'host': 'localhost', 'port': 3306}, 'smtp': {'host': 'localhost', 'user': 'test', 'pass': 'secret'}}
```

`safe_load()` は内部で `SafeLoader` を使用しており、特定の Python オブジェクト（例: `!!python/object`) をデシリアライズしないため、セキュリティリスクが低減されます。

### 3.2 `load()`

**`load()`** はより汎用的な読み込み関数で、指定しない限りデフォルトで `FullLoader` が使われます。`safe_load()` よりも柔軟ですが、信頼できないデータに対しては注意が必要です。

```python
import yaml

with open("sample.yml", "r", encoding="utf-8") as f:
    data = yaml.load(f, Loader=yaml.FullLoader)

print(data)
```

- `Loader=yaml.FullLoader` と指定しない場合、PyYAML のバージョンによってはデフォルトのローダーが異なる可能性があるため注意が必要です。

### 3.3 `load_all()`

YAML ファイル内に複数のドキュメントが連続して記述されている場合には、**`load_all()`** あるいは **`safe_load_all()`** を使うことで、各ドキュメントを順番に読み込むことができます。

```yaml
# multi_docs.yml
---
order: 1
menu: "spam"
---
order: 2
menu: "egg"
```

```python
import yaml

with open("multi_docs.yml", "r", encoding="utf-8") as f:
    for doc in yaml.safe_load_all(f):
        print(doc)
# 1つ目: {'order': 1, 'menu': 'spam'}
# 2つ目: {'order': 2, 'menu': 'egg'}
```


## 4. YAML ファイルの書き込み

YAML ファイルへデータを出力する際は、**`yaml.dump()`** 関数を使います。以下の例では、Python の辞書を YAML 形式でファイルに保存しています。

```python
import yaml

data = {
    "db_server": "localhost",
    "web_server": {
        "ip": "192.168.10.7",
        "port": 80
    },
    "is_active": True
}

with open("dump.yml", "w", encoding="utf-8") as f:
    yaml.dump(data, f, default_flow_style=False)
```

### 4.1 `default_flow_style=False`

`default_flow_style=False` を指定すると、ブロックスタイル（改行やインデントを使った形式）で出力されます。これにより可読性の高い YAML ファイルを生成できます。

```yaml
db_server: localhost
web_server:
  ip: 192.168.10.7
  port: 80
is_active: true
```

- `True` / `False` は YAML 形式では `true` / `false` と小文字で出力されます。


## 5. PyYAML で気をつけるべき点

### 5.1 ローダーの使い分け

PyYAML には複数のローダーが存在し、それぞれ読み込み時の挙動や安全性が異なります。  
- **SafeLoader**: `safe_load()` に対応。`!!python/object` タグなどをロードしないため、セキュリティリスクが低い。  
- **FullLoader**: Python オブジェクトを完全にロードする。外部からの信頼できないデータには推奨されない。  
- **UnsafeLoader**: さらに制限が緩いため、基本的には使用推奨されない。

信頼できないデータを扱う場合は、原則として **`safe_load()`** を使うことが望ましいです。

### 5.2 任意コード実行のリスク

YAML のタグ機能を使って Python オブジェクトを表現できるため、悪意のある YAML データを `FullLoader` や `UnsafeLoader` でロードすると、任意のコードが実行される危険性があります。外部から渡される YAML データは、**必ず** `safe_load()` を使うなどの対策を行いましょう。

```yaml
# 悪意のある例: !!python/object などで任意コード実行を狙う
!!python/object/new:os.system
args: ["echo attack!"]
```

```python
import yaml

with open("evil.yml", "r") as f:
    data = yaml.load(f, Loader=yaml.UnsafeLoader)  # 非推奨
# 悪意あるコードが実行される可能性あり
```


## 6. まとめ

- **YAML** はインデントベースで可読性の高いデータ形式であり、Ansible など多くのツールで採用されている。  
- Python では **PyYAML** ライブラリを用いて、`safe_load()` や `load_all()`、`dump()` などの関数で簡単に読み書きができる。  
- セキュリティ面では **ローダー** の使い分けが重要。信頼できないデータは `safe_load()` を使うことでリスクを低減できる。  
- YAML ファイルを使うことで、アプリケーションや設定管理ツールの設定を人間にとって読みやすい形式で管理できる。

JSON や INI ファイルと同様、YAML は設定ファイルやデータ交換の場面でよく利用されます。Python での開発・運用の際は、PyYAML の特性を理解して、安全かつ効率的に扱ってみてください。


### 参考リンク

- [公式ドキュメント: PyYAML Documentation](https://pypi.org/project/PyYAML/)
- [Ansible 公式サイト](https://www.ansible.com/) (YAML の具体的な活用例として)
- [YAML の仕様 (yaml.org)](https://yaml.org/)

以上が、YAML ファイルの基本と PyYAML を使った読み書きの概要です。アプリケーションの設定管理や構成管理ツールなどに活用する際に、ぜひ参考にしてみてください。
