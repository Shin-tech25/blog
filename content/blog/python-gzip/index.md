---
templateKey: blog-post
title: "Pythonでgzipファイルを扱う - gzip"
date: "2025-02-09"
description: "Python標準ライブラリのgzipモジュールを使って、gzip形式のファイルやデータを効率的に圧縮・展開する方法を徹底解説。基本的な使い方からエラー対処法、応用例まで幅広くカバーします。"
tags: ["Python", "gzip", "データ圧縮"]
featuredImage: ../thumbnails/archive-files.jpg
relatedPosts:
  - python-zipfile
  - python-tarfile
---

Python の標準ライブラリである`gzip`モジュールを使用すると、gzip 形式のファイルを簡単に圧縮・展開できます。本記事では、`gzip`モジュールの基本的な使い方から応用的な活用方法、エラー対処法までを詳しく解説します。

## 1. `gzip`モジュールとは

`gzip`モジュールを利用することで、Python コード内で直接 gzip 形式のファイルを圧縮・展開できます。これにより、外部コマンド（gzip, gunzip）を使用する必要がなくなり、ファイルの処理が容易になります。

### 主な用途

- ファイルの gzip 圧縮・展開
- メモリ上のデータの gzip 圧縮・展開
- コマンドラインインターフェースとしての利用

## 2. gzip ファイルを圧縮・展開する

### 2.1 ファイルを圧縮する

以下の例では、テキストファイルを gzip 形式で圧縮しています。

```python
import gzip

# gzip圧縮ファイルを作成
with gzip.open('sample.gz', 'wt') as f:
    f.write('これはgzip圧縮されたテキストファイルです。' * 100)
```

実行すると、圧縮された`sample.gz`が作成されます。

### 2.2 ファイルを展開する

作成した gzip ファイルを展開するには以下のようにします。

```python
import gzip

# gzipファイルを展開
with gzip.open('sample.gz', 'rt') as f:
    content = f.read()

print(content[:50])  # 展開したテキストの一部を表示
```

このコードは、gzip 圧縮ファイルをテキスト形式で展開し、展開された内容を表示します。

### 2.3 メモリ上のデータを圧縮・展開する

ファイルではなく、文字列やバイト列を直接 gzip 圧縮・展開することも可能です。

#### 圧縮

```python
import gzip

text = '短いテキストをgzip圧縮します。'
b = text.encode('utf-8')  # 文字列をバイト列に変換
compressed_data = gzip.compress(b)
print(len(compressed_data))
```

#### 展開

```python
import gzip

decompressed_data = gzip.decompress(compressed_data)
print(decompressed_data.decode('utf-8'))
```

## 3. gzip モジュールの応用例

### 3.1 大きなデータの圧縮

大きな文字列やデータを gzip 形式で効率的に圧縮する方法を紹介します。

```python
import gzip

# 長い文字列を圧縮
long_text = '圧縮するデータが非常に長い場合、gzipを使用すると効率的です。' * 10000
b = long_text.encode('utf-8')
compressed_data = gzip.compress(b)
print(f"圧縮前: {len(b)} バイト, 圧縮後: {len(compressed_data)} バイト")
```

### 3.2 コマンドラインインターフェースの利用

`gzip`モジュールはコマンドラインインターフェースとしても利用できます。

#### 使用例

```bash
$ python3 -m gzip sample.txt  # ファイルをgzip形式で圧縮
$ python3 -m gzip -d sample.txt.gz  # 圧縮ファイルを展開
```

コマンドラインで簡単に圧縮・展開ができるため、外部コマンドが利用できない環境で便利です。

## 4. よくあるエラーと対処法

### 4.1 gzip 形式ではないファイルを展開しようとした場合

非 gzip 形式のファイルを`gzip.open()`で展開しようとすると、`gzip.BadGzipFile`例外が発生します。

#### 例外処理を加えたコード

```python
import gzip

try:
    with gzip.open('not_gzip.txt', 'rb') as f:
        data = f.read()
except gzip.BadGzipFile:
    print("指定されたファイルはgzip形式ではありません。")
```

### 4.2 バイト列以外のデータを渡した場合

`gzip.compress()`や`gzip.decompress()`にバイト列以外のデータを渡すと、`TypeError`が発生します。

#### 対処法

バイト列に変換してから処理を行います。

```python
import gzip

try:
    text = '文字列はそのままでは圧縮できません。'
    gzip.compress(text)  # ここでエラー
except TypeError:
    print("文字列をバイト列に変換してください。")
```

修正例:

```python
b = text.encode('utf-8')
compressed_data = gzip.compress(b)
```

## 5. gzip の使いどころ

### 主な利用シーン

- **大容量データの保存**:
  - ディスク容量を節約したい場合に便利です。
- **ネットワーク通信の効率化**:
  - 圧縮されたデータを送信することで通信量を削減できます。
- **ファイル転送の簡略化**:
  - テキストやログファイルをまとめて圧縮して転送できます。

## 6. 結論

`gzip`モジュールは、Python で gzip 形式のファイルを簡単に扱うための便利なツールです。ファイルやメモリ上のデータを効率よく圧縮・展開できるため、大容量データの処理やネットワーク通信の最適化に活用できます。本記事を参考に、`gzip`モジュールを活用してみてください。
