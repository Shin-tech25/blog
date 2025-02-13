---
templateKey: blog-post
title: "Pythonでtarファイルを扱う - tarfile"
date: "2025-02-09"
description: "Pythonの標準ライブラリであるtarfileモジュールを使用して、tarファイルの作成、展開、操作方法を詳しく解説します。gzipやbz2形式の圧縮アーカイブの扱い方や便利なユースケースについても網羅しています。"
tags: ["Python", "tarfile", "データ圧縮"]

---


Python標準ライブラリの`tarfile`モジュールは、tar形式のアーカイブファイルをPythonコードから操作するための便利なツールです。このモジュールを使用すると、tarアーカイブの作成、展開、内容確認など、tarコマンドを使用せずに実行できます。また、gzip（`.tar.gz`）、bz2（`.tar.bz2`）、lzma（`.tar.xz`）形式にも対応しています。本記事では、`tarfile`モジュールの基本的な使い方から応用的な活用方法までを解説します。


## 1. 概要

`tarfile`モジュールは、tar形式のアーカイブをPythonコードで扱うためのツールです。このモジュールを利用することで、以下の操作が可能になります：

- tarアーカイブの作成
- tarアーカイブ内の内容の確認
- tarアーカイブの展開
- tarアーカイブ内の特定のファイルの抽出

gzipやbz2形式で圧縮されたtarアーカイブにも対応しており、幅広い場面で利用できます。


## 2. tarアーカイブを操作する

### 2.1 tarアーカイブを開く

tarアーカイブを操作するには、`tarfile.open()`関数を使用します。この関数は以下の引数を受け取ります：

- `name`：操作対象のファイル名
- `mode`：操作モード（例：`'r'`で読み取り、`'w'`で書き込み）
- 圧縮形式（例：`'gz'`、`'bz2'`、`'xz'`）

#### 使用例

```python
import tarfile

# tarアーカイブを読み取りモードで開く
tar = tarfile.open('example.tar.gz', mode='r:gz')

# アーカイブ内のファイル名一覧を取得
print(tar.getnames())

# tarアーカイブを閉じる
tar.close()
```

### 2.2 tarアーカイブの中身を確認する

`getnames()`メソッドを使用してアーカイブ内のファイル一覧を取得できます。

#### 使用例

```python
with tarfile.open('example.tar.gz', mode='r:gz') as tar:
    # ファイル名一覧を表示
    for name in tar.getnames():
        print(name)
```


## 3. tarアーカイブを作成する

`tarfile`モジュールを使用すると、既存のファイルをまとめて新しいtarアーカイブを作成できます。

### 3.1 tarアーカイブを新規作成

`tarfile.open()`関数でモードを`'w'`（新規作成）または`'w:gz'`（gzip形式で新規作成）に指定します。

#### 使用例

```python
import tarfile

# tarアーカイブを作成
with tarfile.open('example.tar.gz', mode='w:gz') as tar:
    tar.add('file1.txt')  # ファイルを追加
    tar.add('file2.txt', arcname='renamed_file2.txt')  # ファイル名を変更して追加

# 作成したアーカイブの確認
with tarfile.open('example.tar.gz', mode='r:gz') as tar:
    print(tar.getnames())
```


## 4. tarアーカイブを展開する

`tarfile`モジュールを使用すると、tarアーカイブを簡単に展開できます。

### 4.1 すべてのファイルを展開

`extractall()`メソッドを使用してアーカイブ内のすべてのファイルを展開します。

#### 使用例

```python
with tarfile.open('example.tar.gz', mode='r:gz') as tar:
    tar.extractall(path='output_dir')  # 指定したディレクトリに展開
```

### 4.2 特定のファイルを展開

特定のファイルのみを展開する場合は、`extract()`または`extractfile()`を使用します。

#### 使用例

```python
with tarfile.open('example.tar.gz', mode='r:gz') as tar:
    tar.extract('file1.txt', path='output_dir')  # file1.txtのみを展開

    # ファイルの中身を直接読み込む
    with tar.extractfile('file1.txt') as f:
        content = f.read()
        print(content.decode('utf-8'))
```


## 5. よくあるエラーと対処法

### 5.1 非tar形式ファイルを開こうとした場合

非tar形式のファイルを`tarfile.open()`で開こうとすると、`ReadError`が発生します。

#### 対策

事前に`tarfile.is_tarfile()`でファイル形式を確認します。

#### 使用例

```python
if tarfile.is_tarfile('example.tar.gz'):
    with tarfile.open('example.tar.gz', mode='r:gz') as tar:
        print(tar.getnames())
else:
    print('指定されたファイルはtar形式ではありません。')
```

### 5.2 閉じたtarファイルへのアクセス

閉じたTarFileオブジェクトを操作しようとすると、`OSError`が発生します。

#### 対策

`with`文を使用して、自動的にリソースを解放するようにします。


## 6. 実用例

### 6.1 大量のファイルをアーカイブして圧縮

大量のログファイルなどをアーカイブしてgzip形式で圧縮する例です。

```python
import tarfile
import os

# 複数のログファイルをアーカイブ
with tarfile.open('logs_archive.tar.gz', mode='w:gz') as tar:
    for log_file in os.listdir('logs'):
        tar.add(os.path.join('logs', log_file))
```

### 6.2 展開先ディレクトリに特定の条件を適用

アーカイブ内のファイルを展開し、特定のファイルのみ処理する例です。

```python
with tarfile.open('example.tar.gz', mode='r:gz') as tar:
    for member in tar.getmembers():
        if member.name.endswith('.txt'):
            tar.extract(member, path='output_dir')
```


## 7. 結論

`tarfile`モジュールを使用すると、Pythonコード内でtar形式のアーカイブを簡単かつ効率的に操作できます。特にgzipやbz2形式との互換性を持つ点が強力で、ログファイルのバックアップやデータ転送など、さまざまな用途に役立ちます。この記事を参考に、`tarfile`モジュールを活用してみてください。

