---
templateKey: blog-post
title: "PythonのcsvモジュールでCSVファイルを扱う方法"
date: "2025-03-02"
description: "Pythonのcsvモジュールを使ってCSVファイルを読み書きする方法を解説します。基本的な使い方からDictReader、DictWriter、Snifferクラスまでを網羅し、実用的なコード例を交えて詳しく説明します。"
tags:
  - "Python"
  - "CSV"
featuredImage: ../../thumbnails/python2.jpg
relatedPosts:
---

## 概要

CSV (Comma-Separated Values) ファイルは、シンプルなテキスト形式でデータを保存・交換するのに適したフォーマットです。Python では、`csv` モジュールを利用することで、CSV ファイルの読み書きを簡単に行えます。本記事では、`csv` モジュールの使い方を解説し、実際にコードを交えながら理解を深めます。

## CSV モジュールの基本

Python の `csv` モジュールを使うことで、CSV や TSV (Tab-Separated Values) 形式のデータを簡単に読み書きできます。

### CSV ファイルの基本構造

CSV ファイルのデータは、以下のようにカンマ (`,`) で区切られたテキストデータです。

```csv
id, 都道府県, 人口 (人), 面積 (km2)
1, 東京都, 13900000, 2194.05
2, 神奈川県, 9200000, 2416.10
3, 千葉県, 6200000, 5157.50
4, 埼玉県, 7300000, 3797.75
```

TSV 形式では、カンマの代わりにタブ (`\t`) を使用します。

```tsv
id\t都道府県\t人口 (人)\t面積 (km2)
1\t東京都\t13900000\t2194.05
2\t神奈川県\t9200000\t2416.10
```

## CSV ファイルの読み込み

Python では `csv.reader` を使用することで、CSV ファイルを簡単に読み込むことができます。

### `csv.reader` を使った基本的な読み込み

以下のコードは、CSV ファイルを開き、各行をリスト形式で取得する方法を示しています。

```python
import csv

with open('sample.csv', mode='r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
```

### `DictReader` を使用して辞書形式で読み込む

`csv.DictReader` を使用すると、CSV ファイルのヘッダーを辞書のキーとして扱うことができます。

```python
import csv

with open('sample.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)
```

出力例:

```python
{'id': '1', '都道府県': '東京都', '人口 (人)': '13900000', '面積 (km2)': '2194.05'}
{'id': '2', '都道府県': '神奈川県', '人口 (人)': '9200000', '面積 (km2)': '2416.10'}
```

## CSV ファイルへの書き込み

`csv.writer` を使用すると、CSV ファイルにデータを書き込むことができます。

### `csv.writer` を使った基本的な書き込み

以下のコードは、リスト形式のデータを CSV ファイルに書き込む方法です。

```python
import csv

data = [
    [1, '東京都', 13900000, 2194.05],
    [2, '神奈川県', 9200000, 2416.10]
]

with open('output.csv', mode='w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['id', '都道府県', '人口 (人)', '面積 (km2)'])  # ヘッダー行の書き込み
    writer.writerows(data)  # データの一括書き込み
```

### `DictWriter` を使用して辞書形式で書き込む

辞書データを CSV に書き込むには `csv.DictWriter` を使用します。

```python
import csv

data = [
    {'id': 1, '都道府県': '東京都', '人口 (人)': 13900000, '面積 (km2)': 2194.05},
    {'id': 2, '都道府県': '神奈川県', '人口 (人)': 9200000, '面積 (km2)': 2416.10}
]

with open('output_dict.csv', mode='w', newline='', encoding='utf-8') as f:
    fieldnames = ['id', '都道府県', '人口 (人)', '面積 (km2)']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(data)
```

## Sniffer クラスを用いたフォーマット自動判別

Python の `csv.Sniffer` クラスを使用すると、CSV ファイルのデリミタ (区切り文字) を自動的に判別できます。

```python
import csv

with open('unknown.csv', newline='', encoding='utf-8') as f:
    sample = f.read(1024)
    dialect = csv.Sniffer().sniff(sample)
    f.seek(0)
    reader = csv.reader(f, dialect)
    for row in reader:
        print(row)
```

## CSV のよくあるエラーと対処法

### 改行コードの問題

デフォルトでは、Windows では `\r\n` (CRLF)、Linux では `\n` が改行コードとして使用されます。誤った改行コードが使われると、意図しない動作をすることがあります。`newline=''` を指定することで正しく処理できます。

```python
with open('sample_write.csv', mode='w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerow([1, 10, 100])
```

## まとめ

Python の `csv` モジュールを使用すると、CSV ファイルの読み書きを簡単に行えます。本記事では基本的な使い方から `DictReader`、`DictWriter`、`Sniffer` クラスまでを解説しました。CSV を利用するシステムを構築する際に、適切な方法を選択できるようにしておきましょう。
