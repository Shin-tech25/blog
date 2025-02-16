---
templateKey: blog-post
title: "Pythonでサブプロセスを管理する方法 - subprocess"
date: "2025-02-11"
description: "Pythonの標準ライブラリsubprocessモジュールを使用して、システムコマンドの実行、プロセス管理、入出力のキャプチャ方法について詳しく解説します。初心者から上級者まで役立つ実践例を紹介。"
tags: ["Python", "subprocess"]
featuredImage: ../thumbnails/python2.jpg
---

## 概要

`subprocess` モジュールは、Python スクリプトの中からシステムコマンドを実行したり、その実行に関連する出力や結果を取得するための機能を提供します。このガイドでは、`subprocess` モジュールの使い方や具体的な例を紹介します。

## サブプロセスの実行

Python でサブプロセスを実行するには、`subprocess.run(args, *, **kwargs)` 関数を使用します。この関数は、指定されたコマンドを実行し、その結果を取得します。

### 例:コマンドの実行

```python
import subprocess

result = subprocess.run(['echo', 'Hello World!'], capture_output=True, text=True)
print(result.stdout)
```

上記のコードは、システムコマンドとして `echo` を実行し、その出力を取得します。

### 戻り値について

`subprocess.run()` の戻り値は `subprocess.CompletedProcess` クラスのインスタンスです。このクラスは以下の属性を持っています。

| 属性       | 説明                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| args       | 実行したコマンドの引数のリスト                                                                 |
| returncode | コマンドの終了ステータスコード（0 は成功、0 以外はエラー）                                     |
| stdout     | 標準出力の内容（`capture_output=True` または `stdout=subprocess.PIPE` の場合に利用可能）       |
| stderr     | 標準エラー出力の内容（`capture_output=True` または `stderr=subprocess.PIPE` の場合に利用可能） |

例えば、以下のコードで戻り値を確認できます。

```python
result = subprocess.run(['echo', 'Hello World!'], capture_output=True, text=True)
print(f"Command: {result.args}")
print(f"Return code: {result.returncode}")
print(f"Output: {result.stdout}")
```

## `run()` 関数の詳細

`subprocess.run(args, *, **kwargs)` は、多様な引数を指定できます。下記に主な引数を説明します。

### 主な引数

| 引数           | 説明                                                       |
| -------------- | ---------------------------------------------------------- |
| args           | 実行するコマンドと引数のリスト                             |
| stdin          | 標準入力を指定する                                         |
| stdout         | 標準出力を指定する                                         |
| stderr         | 標準エラー出力を指定する                                   |
| capture_output | True の場合、標準出力・標準エラー出力をキャプチャする      |
| shell          | True の場合、シェルを経由してコマンドを実行する            |
| cwd            | 作業ディレクトリを指定する                                 |
| timeout        | 実行タイムアウトの秒数を指定する                           |
| check          | True の場合、終了ステータスが 0 以外の時に例外を発生させる |
| text           | True の場合、入出力を文字列として処理する                  |
| env            | 環境変数を指定する                                         |

### 実践例

#### capture_output

`capture_output=True` を指定することで、標準出力や標準エラー出力を簡単に取得できます。

```python
result = subprocess.run(['echo', 'Hello World!'], capture_output=True, text=True)
print(result.stdout)
```

#### check

`check=True` を指定すると、コマンドがエラー終了した場合に `subprocess.CalledProcessError` が発生します。

```python
try:
    subprocess.run(['cat', 'nonexistent_file.txt'], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
```

#### timeout

`timeout` を設定することで、指定秒数以内に終了しないプロセスを停止できます。

```python
try:
    subprocess.run(['sleep', '10'], timeout=3)
except subprocess.TimeoutExpired:
    print('The process timed out!')
```

## Popen クラスの利用

より高度な管理を行いたい場合、`Popen` クラスを使用します。`Popen` はサブプロセスを開始し、出力を利用して別のプロセスへ入力することも可能です。

### 例:パイプを使用した出力の実行

```python
from subprocess import Popen, PIPE

cmd1 = ['echo', 'Hello World!']
cmd2 = ['tr', '[a-z]', '[A-Z]']

p1 = Popen(cmd1, stdout=PIPE)
p2 = Popen(cmd2, stdin=p1.stdout, stdout=PIPE)

stdout_data, stderr_data = p2.communicate()
print(stdout_data.decode())
```

上記の例は、`echo` の出力を大文字変換するプロセスの入力として使用しています。

## よくあるエラーと対処法

### 1. TimeoutExpired

タイムアウト例外が発生した場合、`timeout` を設定していることを確認してください。

```python
try:
    subprocess.run(['sleep', '10'], timeout=3)
except subprocess.TimeoutExpired as e:
    print(f"Error: {e}")
```

### 2. CalledProcessError

`check=True` を設定した場合、コマンドが失敗するとこの例外が発生します。

```python
try:
    subprocess.run(['non_existent_command'], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
```
