---
templateKey: blog-post
title: "Pythonでコード実行時間を計測する - timeit"
date: "2025-02-08"
description: "Pythonの標準ライブラリtimeitを使用してコードの実行時間を正確に測定し、ボトルネックを特定する方法を詳しく解説。コマンドラインとスクリプトでの使い方を網羅し、実用的な例も豊富に紹介します。"
tags: ["Python", "timeit"]

---


Pythonでプログラムのパフォーマンスを向上させるためには、コードの実行時間を計測し、ボトルネックを見つけることが重要です。`timeit` モジュールは、この目的のために設計された標準ライブラリで、簡単かつ正確にコードの実行時間を測定することができます。本記事では、`timeit` モジュールの使用方法や、実用的な活用例について詳しく解説します。


## 1. `timeit` モジュールの概要

`timeit` は、Pythonコードの実行時間を高精度で計測するためのモジュールです。特に、以下の特徴があります：

- **簡単にコードのパフォーマンスを測定**：わずかなコードで実行時間を計測可能。
- **ノイズを排除**：計測中にガベージコレクションを一時停止することで、より正確な時間を測定。
- **柔軟な使用方法**：コマンドラインインターフェース（CLI）とスクリプト実行の両方をサポート。


## 2. `timeit` の基本的な使い方

### コマンドラインインターフェースでの使用

コマンドラインから `timeit` を実行する場合、シンプルなワンライナーや短いコードを計測するのに適しています。

```bash
python -m timeit [-n N] [-r N] [-s S] [statement]
```

#### 主なオプション

- `-n N`：コードを実行する回数を指定します。
- `-r N`：計測を繰り返す回数（デフォルトは5回）。
- `-s S`：実行前に1度だけ実行されるセットアップコード。

#### 使用例

```bash
$ python -m timeit -s 'text = "hello world"' '"world" in text'
10000000 loops, best of 5: 0.045 sec per loop
```

一方、スクリプト内で `timeit` を使用する場合は、より柔軟な計測が可能です。


### スクリプト内での使用

スクリプト内で `timeit` を使用する場合は、以下の関数が利用可能です：

- **`timeit.timeit`**：指定したコードを一定回数実行し、実行時間を計測。
- **`timeit.repeat`**：計測を複数回繰り返し、リスト形式で結果を返します。

#### 基本的な使用例

```python
import timeit

# 単純なコードの実行時間を計測
print(timeit.timeit('"-".join(str(n) for n in range(100))', number=10000))

# 繰り返し回数を指定して複数回計測
print(timeit.repeat('"-".join(str(n) for n in range(100))', number=10000, repeat=5))
```


## 3. Timerクラスを使用した計測

`Timer` クラスを使用すると、セットアップコードを柔軟に指定できます。

#### 使用例

```python
from timeit import Timer

setup_code = 'numbers = list(range(1000))'
test_code = 'sum(numbers)'

t = Timer(stmt=test_code, setup=setup_code)
print(t.timeit(number=10000))
```

ここでは、リストの合計を計算するコードの実行時間を測定しています。


### 複数行コードの計測

複数行にわたるコードも `timeit` で計測できます。

```python
code = '''
for i in range(100):
    x = i ** 2
'''

print(timeit.timeit(stmt=code, number=1000))
```


## 4. よくあるエラーと対処法

### NameError の対処

`timeit` モジュールでは、デフォルトでコードをグローバル名前空間内で実行します。そのため、ローカル名前空間で定義された関数や変数を認識できず、`NameError` が発生することがあります。この仕様により、計測対象のコードはグローバルスコープにある必要があります。

#### エラー例

```python
def example_function():
    return sum(range(100))

import timeit
# これではエラーになる
print(timeit.timeit('example_function()'))
```

上記のコードでは、`example_function` がローカル名前空間に定義されているため、`timeit` がその名前を認識できず `NameError` が発生します。

#### 修正版

この問題を解決するには、`globals` 引数を指定して、`timeit` に現在のグローバル名前空間を渡します。

```python
def example_function():
    return sum(range(100))

import timeit
# globals を指定して関数を認識させる
print(timeit.timeit('example_function()', globals=globals()))
```

このように、`globals` を使用することで、`timeit` がグローバルスコープ内の関数や変数を正しく認識できるようになります。


## 5. ガベージコレクションと `timeit`

`timeit` は、デフォルトで計測中にガベージコレクションを無効化します。この挙動は計測結果にノイズを含ませないためですが、ガベージコレクションが重要な場合は有効にする必要があります。

#### ガベージコレクションを有効化

```python
import timeit

gc_enabled_code = 'for i in range(100): oct(i)'
setup_code = 'import gc; gc.enable()'

print(timeit.timeit(gc_enabled_code, setup=setup_code, number=10000))
```


## 6. 実用例：コードの最適化

`timeit` を使用すると、異なるコード実装のパフォーマンスを比較できます。

#### リスト内包表記 vs. forループ

```python
list_comp = '[i**2 for i in range(1000)]'
for_loop = '''
result = []
for i in range(1000):
    result.append(i**2)
'''

print("List Comprehension:", timeit.timeit(list_comp, number=10000))
print("For Loop:", timeit.timeit(for_loop, number=10000))
```


## 結論

`timeit` モジュールは、Pythonプログラムのパフォーマンスを向上させるために非常に役立つツールです。コードの実行時間を正確に測定することで、効率的なアルゴリズムや実装方法を見つけることができます。ぜひ、日常のコーディングやプロジェクトで活用してみてください！

