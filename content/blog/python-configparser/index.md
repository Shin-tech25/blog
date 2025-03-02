---
templateKey: blog-post
title: "Pythonによる設定管理 - configparser"
date: "2025-03-01"
description: "INIファイルの基本構造や特徴、Pythonのconfigparserモジュールを使った設定管理の方法について、具体的なコード例と共に分かりやすく解説します。"
tags: ["Python", "INI", "configparser", "設定管理", "技術記事"]
featuredImage: ../../thumbnails/python3.jpg
relatedPosts:
  - python-pyyaml
---

## 1. INI ファイルとは

**INI ファイル** は、Windows OS で古くから使われている設定ファイル形式です。テキスト形式で構成され、以下のように **セクション** と **オプション**（キーと値のペア）から構成される点が特徴です。

```ini
[DEFAULT]
home_dir = /home/user
limit = 100

[USER_A]
group = Viewer
active = true
```

- `[DEFAULT]` はデフォルト設定を定義するセクションで、他のセクションで値が指定されない場合に適用されます。
- `[USER_A]` や `[USER_B]` のようにセクション名を指定し、その下にオプションと値を記述します。

Windows 以外の環境でも、INI は分かりやすい構造を持つため、設定ファイルやアプリケーションのコンフィグ管理に利用されることがあります。

## 2. `configparser` モジュールの概要

Python では、`configparser` モジュールを使うことで INI ファイルの読み書きを簡単に行えます。

- **INI ファイルを読み込む**: ファイル内のセクションやオプションを Python のオブジェクトとして扱える
- **INI ファイルへ書き込む**: Python のオブジェクトを INI ファイル形式で保存できる
- **値の補間機能（Interpolation）**: 別のセクションやオプションの値を参照しながら設定を上書きする機能を提供

## 3. INI ファイルを読み込む

### 3.1 基本的な読み込み

まずは、最もシンプルな読み込み方法を見てみましょう。

```python
import configparser

# ConfigParserインスタンスを生成
config = configparser.ConfigParser()

# INIファイルを読み込む
config.read("config.ini")

# セクション名を一覧表示
print(config.sections())

# セクション[USER_A]のオプション値を取得
user_a_group = config["USER_A"]["group"]
user_a_active = config.getboolean("USER_A", "active")

print(user_a_group)   # 例: 'Viewer'
print(user_a_active)  # 例: True
```

- `config = configparser.ConfigParser()` で `ConfigParser` クラスのインスタンスを作成します。
- `config.read("config.ini")` で指定した INI ファイルを読み込みます。
- `config.sections()` を使うと、`[DEFAULT]` を除いたセクション名のリストを取得できます。
- `config["USER_A"]["group"]` のように辞書感覚で値を取得できますが、型はすべて文字列です。
- 真偽値を取得したい場合は、`config.getboolean(section, option)` のように型に合わせたメソッドを使うと便利です。

### 3.2 `DEFAULT` セクションの扱い

INI ファイルに `[DEFAULT]` セクションがある場合、他のセクションから参照されます。以下のように `[USER_A]` セクションで指定されていないオプションは、`DEFAULT` セクションの値が適用されます。

```ini
[DEFAULT]
home_dir = /home/default
limit = 200

[USER_A]
group = Viewer
```

```python
import configparser

config = configparser.ConfigParser()
config.read("config.ini")

print(config["USER_A"]["home_dir"])  # /home/default (DEFAULTの値が適用される)
print(config["USER_A"]["limit"])     # 200 (DEFAULTの値が適用される)
```

## 4. INI ファイルへの書き込み

INI ファイルへ設定を保存するときは、`config.write()` を使います。たとえば、以下の例では新しいセクションやオプションを追加してからファイルに書き込みます。

```python
import configparser

config = configparser.ConfigParser()

# セクション追加
config["DEFAULT"] = {
    "app_name": "SampleApp",
    "debug_mode": "false"
}

config["USER_A"] = {
    "group": "Developer",
    "mail": "user_a@example.com"
}

# ファイルへ書き込み
with open("output.ini", "w", encoding="utf-8") as f:
    config.write(f)
```

書き込み後の `output.ini` は、次のような形式になります。

```ini
[DEFAULT]
app_name = SampleApp
debug_mode = false

[USER_A]
group = Developer
mail = user_a@example.com
```

## 5. 値の補間機能（Interpolation）

`configparser` は、INI ファイルの値を他の値で補間（置き換え）する機能を持っています。補間を利用すると、以下のように別のセクション・オプションの値を参照して設定を動的に作ることができます。

### 5.1 BasicInterpolation

デフォルトの補間方法は `BasicInterpolation` です。たとえば、`%(option_name)s` と書くと、同じセクションや `DEFAULT` セクションから値を探して置き換えてくれます。

```ini
[DEFAULT]
base_dir = /var/app

[USER_B]
data_dir = %(base_dir)s/data
```

```python
import configparser

config = configparser.ConfigParser()  # デフォルトでBasicInterpolation
config.read("config_basic.ini")

print(config["USER_B"]["data_dir"])  # /var/app/data
```

### 5.2 ExtendedInterpolation

`ExtendedInterpolation` を使うと、`[セクション名].オプション名` の形式でより明示的な補間が可能です。

```ini
[USER_A]
home_dir = /home/a_user
mail = a_user@example.com

[USER_B]
inherit = ${USER_A.home_dir}
user_info = ${USER_A.mail}
```

```python
import configparser

config = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())
config.read("config_extend.ini")

print(config["USER_B"]["inherit"])   # /home/a_user
print(config["USER_B"]["user_info"]) # a_user@example.com
```

## 6. よくあるエラーと対処法

### 6.1 オプションやセクションの存在しない場合

存在しないセクションやオプションを参照すると、`KeyError` や `NoOptionError` が発生します。これを回避するには、`config.has_section()` や `config.has_option()` で事前に確認するか、`config.get()` にデフォルト値を指定する方法があります。

```python
if config.has_section("USER_C"):
    user_c_group = config.get("USER_C", "group", fallback="Guest")
```

### 6.2 型変換の注意点

#### INI ファイルの値は基本的に文字列

`configparser` で INI ファイルを読み込むと、全てのオプションの値は文字列として扱われます。

例えば、設定ファイルに

```ini
[DEFAULT]
limit = 100
```

と記述されていても、

```python
limit_val = config["DEFAULT"]["limit"]
```

で取得した場合、`limit_val` は `"100"` という文字列になります。

#### 数値に変換する場合

計算や数値的な比較を行いたいときは、取得した文字列を整数や浮動小数点数に変換する必要があります。

`config.getint()` や `config.getfloat()` を使うと、INI ファイル内の数値文字列を自動で変換してくれます。

```python
limit_val = config.getint("DEFAULT", "limit")
```

**注意点:**

もし設定値に余計な空白や数字以外の文字が含まれている場合、変換処理で `ValueError` が発生する可能性があるため、設定ファイル側での記述ルールを統一しておくことが大切です。

#### 真偽値（Boolean）に変換する場合

真偽値として扱いたい場合、`config.getboolean()` を利用します。これにより、文字列が自動的に論理値に変換されます。

```python
active = config.getboolean("USER_A", "active")
```

**認識される文字列:**

`getboolean()` は、以下の文字列表現を標準でサポートしています（大文字・小文字は区別されません）:

- **True として認識:** `"1"`, `"yes"`, `"true"`, `"on"`
- **False として認識:** `"0"`, `"no"`, `"false"`, `"off"`

**注意点:**

これ以外の表現（たとえば `"enabled"` や `"True!"` など）はサポートされておらず、変換に失敗する可能性があります。設定ファイルを書く際は、必ずこれらの標準的な表現に従うことが求められます。

### 6.3 補間エラー

補間（Interpolation）を使うときに、存在しないキーを参照していると `InterpolationMissingOptionError` が発生します。補間を使わない場合は、`interpolation=None` を指定して機能を無効にすることも可能です。

```python
config = configparser.ConfigParser(interpolation=None)
```

## 7. まとめ

- **INI ファイル** はセクションとオプション（キー＝値）で構成されるシンプルな設定ファイル形式で、Windows 以外の環境でも幅広く利用されています。
- **`configparser` モジュール** を使うと、INI ファイルの読み書きや補間（Interpolation）機能を簡単に扱えます。
- `DEFAULT` セクションで共通の設定を管理したり、**BasicInterpolation** や **ExtendedInterpolation** を使って値を柔軟に参照したりできるため、大規模な設定管理にも対応可能です。
- データ型の変換や補間エラーなどの注意点を把握しておけば、設定ファイルの整合性を保ちつつ、読みやすくメンテナンスしやすいアプリケーションを開発できます。

INI ファイルは JSON よりも人間にとって読みやすい場合も多く、特にアプリケーションの設定やユーザーカスタマイズを管理するのに適したフォーマットです。Python の `configparser` を活用して、アプリケーション開発や運用の効率化を図ってみてください。

### 参考リンク

- [公式ドキュメント: configparser — Configuration file parser](https://docs.python.org/3/library/configparser.html)
- [INI ファイルの形式 (Wikipedia)](https://ja.wikipedia.org/wiki/INI%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB)
