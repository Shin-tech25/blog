---
templateKey: blog-post
title: "Pythonでドキュメントを自動生成するモジュール - pydoc"
date: "2025-02-11"
description: "Python標準ライブラリのpydocモジュールを使用して、ソースコードから自動的にドキュメントを生成する方法を解説します。オンラインヘルプ、HTMLドキュメント作成、HTTPサーバーによる閲覧方法について詳しく紹介します。"
tags: ["Python", "pydoc"]
featuredImage: ../thumbnails/python2.jpg
---

Python には、ソースコード内のコメントを利用してドキュメントを生成するための機能が用意されています。この機能を構築するための標準モジュールが「pydoc」です。pydoc を使用することで、ソースコード上のドキュメントから自動的に HTML やテキストベースのドキュメントを生成することが可能です。本記事は、pydoc の基礎的な機能と実用的な使い方について解説します。

## 1. pydoc の基本機能

pydoc は、以下の主な機能を提供します。

### 1.1 モジュールのドキュメントを確認

Python インタープリタ上で`help()`を実行すると、指定したモジュールのドキュメントを表示できます。この機能により、現在利用可能なモジュールや関数の情報を即座に確認できます。

#### 例

```python
>>> help("string")
Help on module string:

NAME
    string - A collection of string constants.

MODULE REFERENCE
    https://docs.python.org/3/library/string.html

...
```

また、`pydoc` コマンドを使用することで、同じ情報をコマンドライン上からも確認できます。

```bash
$ pydoc string
```

### 1.2 ドキュメントの HTML 生成

`pydoc` は、ソースコード上のコメントや情報を基に HTML ドキュメントを生成することができます。`pydoc -w` オプションを使用して実行すると、ローカルディレクトリに HTML ファイルが作成されます。

#### 例

```bash
$ pydoc -w sample_module
wrote sample_module.html
```

作成された HTML ファイルは、ブラウザ上で開いて全体を視覚的に確認できます。

### 1.3 HTTP サーバーの起動

`pydoc -p` オプションを指定することで、ローカルマシン上で HTTP サーバーを起動し、ブラウザ上でドキュメントを触れるようにすることが可能です。

#### 例

```bash
$ pydoc -p 1234
Server ready at http://localhost:1234/
```

ブラウザから`http://localhost:1234/` にアクセスすることで、モジュールのインデックスページを見ることができます。

## 2. pydoc の実用例

### 2.1 モジュール内のコメントを活用したドキュメントの生成

ファイル上にあるドキュメントのサンプルを実装し、`pydoc` で生成した例を解説します。

#### サンプルコード

**sample_module.py**

```python
"""
モジュールに関するコメントを書きます。
"""

__author__ = "Python 太郎 <sample@example.com>"
__version__ = "0.0.1"

class SampleClass:
    """
    クラスに関するコメントを書きます。
    """

    def sample_method(self, sample_param):
        """
        :param str sample_param: 引数に関するコメントを書きます
        """
        pass
```

#### pydoc の実行

```bash
$ pydoc sample_module
```

生成されたドキュメントは以下のように表示されます。

```
Help on module sample_module:

NAME
    sample_module - モジュールに関するコメントを書きます。

CLASSES
    builtins.object
        SampleClass

    class SampleClass(builtins.object)
     |  クラスに関するコメントを書きます。
     |
     |  Methods defined here:
     |
     |  sample_method(self, sample_param)
     |      :param str sample_param: 引数に関するコメントを書きます
     |
     |  ...

VERSION
    0.0.1

AUTHOR
    Python 太郎 <sample@example.com>
```

## 3. pydoc の利用場面

- ソースコード内のコメントを活用してドキュメントを自動生成
- HTTP サーバーを起動してドキュメントをブラウザ上で視覚化
- HTML ファイルとしてドキュメントを生成

## 4. 結論

pydoc は Python プログラムのメンテナンス性を向上させるための強力なツールです。これを活用することで、ソースコードの読解性を高め、ドキュメント化や現場での実用性を大きく向上させることができます。
