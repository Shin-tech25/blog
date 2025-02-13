---
templateKey: blog-post
title: "PythonでZIPファイルを操作する - zipfile"
date: "2025-02-09"
description: "Pythonの標準ライブラリであるzipfileモジュールを使用して、ZIPファイルの作成、展開、操作方法を詳しく解説します。圧縮ファイルの扱い方や、便利なユースケースについても網羅しています。"
tags: ["Python", "zipfile", "データ圧縮"]

---


Pythonでは、ZIP形式のアーカイブファイルを操作するために、標準ライブラリの`zipfile`モジュールを使用できます。このモジュールを利用することで、zipコマンドなどを使用せずに、ファイルの圧縮や展開をPythonコード内で簡単に行うことが可能です。本記事では、`zipfile`モジュールの使い方やその応用について詳しく解説します。


## 1. `zipfile`モジュールの概要

`zipfile`モジュールは、ZIP形式のファイルを圧縮、展開、あるいはその内容を操作するための便利なツールです。特に次のような機能を提供します：

- ZIPファイルを読み込む
- ZIPファイルにデータを追加する
- ファイルのリストを取得する
- ファイルを展開する

これらの機能を活用することで、Pythonコード内で柔軟なファイル操作を行うことができます。


## 2. 基本的な使い方

### 2.1 ZIPファイルを開く

まず、対象のZIPファイルを指定して`ZipFile`オブジェクトを生成します。ファイルモードを指定することで、読み込み、書き込み、追記などの操作を選択できます。

#### 例：ZIPファイルを開く
```python
import zipfile

# ZIPファイルを読み込みモードで開く
with zipfile.ZipFile('example.zip', 'r') as zip:
    print(zip.namelist())  # ZIPファイル内のファイルリストを表示
```

### 2.2 ファイルの圧縮

ファイルを新しいZIPファイルに圧縮する場合は、`ZipFile`オブジェクトを作成し、`write()`または`writestr()`メソッドを使用します。

#### 例：ファイルを圧縮
```python
with zipfile.ZipFile('example.zip', 'w', zipfile.ZIP_DEFLATED) as zip:
    zip.write('file1.txt')  # ファイルを追加
    zip.writestr('file2.txt', 'このテキストは直接ZIPファイルに追加されました。')
```

### 2.3 ファイルの展開

ZIPファイル内のファイルを展開するには、`extract()`または`extractall()`メソッドを使用します。

#### 例：ファイルを展開
```python
with zipfile.ZipFile('example.zip', 'r') as zip:
    zip.extractall('extracted_files')  # ZIP内の全ファイルを展開
```


## 3. ZIPファイル操作の応用

### 3.1 ファイルリストの取得

ZIPファイル内のファイルリストを取得するには、`namelist()`メソッドを使用します。

#### 例：ファイルリストの取得
```python
with zipfile.ZipFile('example.zip', 'r') as zip:
    print(zip.namelist())  # ファイル名のリストを取得
```

### 3.2 特定のファイルを展開

特定のファイルのみを展開する場合は、`extract()`メソッドを使用します。

#### 例：特定ファイルの展開
```python
with zipfile.ZipFile('example.zip', 'r') as zip:
    zip.extract('file1.txt', 'target_directory')  # file1.txtを特定のディレクトリに展開
```

### 3.3 圧縮レベルの調整

圧縮レベルを指定することで、圧縮率を調整することができます。デフォルトでは`ZIP_DEFLATED`が使用されますが、他の圧縮方式も利用可能です。

#### 例：圧縮レベルの設定
```python
with zipfile.ZipFile('example.zip', 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zip:
    zip.write('file1.txt')
```


## 4. よくあるエラーと対処法

### 4.1 `BadZipFile` エラー

ZIP形式でないファイルを`ZipFile`として開こうとすると、`BadZipFile`例外が発生します。

#### 対処法
```python
try:
    with zipfile.ZipFile('not_a_zip_file.txt', 'r') as zip:
        pass
except zipfile.BadZipFile:
    print("指定されたファイルは有効なZIPファイルではありません。")
```

### 4.2 ファイル操作後のエラー

閉じたZIPファイルに対して操作を行おうとすると、`ValueError`例外が発生します。

#### 対処法
ZIPファイルを操作する際は、`with`文を使用して自動的に閉じるようにしましょう。


## 5. 実用例

### 5.1 ZIPファイル内の日本語ファイル名を扱う

ZIPファイルに日本語ファイル名が含まれている場合、環境依存で文字コードの問題が発生することがあります。その場合、文字コードを指定してデコードすることで対応できます。

#### 例：日本語ファイル名の扱い
```python
with zipfile.ZipFile('sample.zip', 'r') as zip:
    for name in zip.namelist():
        print(name.encode('cp437').decode('utf-8', 'ignore'))
```


## 6. 結論

`zipfile`モジュールは、PythonでZIP形式のファイルを操作するための強力なツールです。基本的な使い方を理解し、適切な方法でファイルの圧縮や展開を行うことで、効率的なデータ管理が可能になります。ファイルのリスト取得、特定ファイルの展開、圧縮レベルの調整など、多彩な機能を活用してさまざまな用途に対応しましょう。

