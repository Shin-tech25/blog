---
templateKey: blog-post
title: "Pythonでオブジェクトをコピーする: 参照、Sallow/Deep Copy - copyモジュール"
date: "2025-02-09"
description: "Pythonでのオブジェクトコピーに関する基本から応用までを解説。参照、浅いコピー（Shallow Copy）、深いコピー（Deep Copy）の違いと、それぞれの使い分けについて詳しく説明します。"
tags: ["Python", "copy"]
featuredImage: ../../thumbnails/python2.jpg
---

Python では、オブジェクトのコピーにはさまざまな方法がありますが、その挙動を正しく理解することが重要です。特に、ミュータブルなオブジェクトをコピーする際には、「参照」「浅いコピー（Shallow Copy）」「深いコピー（Deep Copy）」の違いを理解する必要があります。本記事では、これらの違いを解説し、`copy` モジュールを活用した具体的なコピー方法について詳しく説明します。

## 1. 参照、Shallow Copy、Deep Copy の違い

### 1.1 参照

Python では、変数への代入はオブジェクトをコピーしません。代入された変数は、元のオブジェクトへの**参照**として動作します。つまり、複数の変数が同じオブジェクトを指している場合、どちらかの変数を使ってオブジェクトを変更すると、他方からも変更が反映されます。

#### 例

```python
values = ['a', 'b', 'c']
v_ref = values  # オブジェクトへの参照を作成
v_ref[1] = 'x'  # 参照を通じてオブジェクトを変更

print(values)  # ['a', 'x', 'c']
print(v_ref)  # ['a', 'x', 'c']
```

このような挙動は、意図せぬ変更を引き起こす可能性があるため注意が必要です。

### 1.2 Shallow Copy（浅いコピー）

浅いコピー（Shallow Copy）は、コピー元オブジェクトの 1 階層目の要素をコピーして新しいオブジェクトを作成します。しかし、2 階層目以降の子オブジェクトは参照としてコピーされるため、コピー元とコピー先が子オブジェクトを共有します。

#### 例

```python
import copy

values = [[1, 2], [3, 4]]
shallow_copy = copy.copy(values)  # 浅いコピー（Shallow Copy）

shallow_copy[0][0] = 9  # 子オブジェクトを変更
print(values)  # [[9, 2], [3, 4]]
print(shallow_copy)  # [[9, 2], [3, 4]]
```

この例では、子オブジェクト（リスト）が共有されているため、片方の変更がもう片方にも反映されます。

### 1.3 Deep Copy（深いコピー）

深いコピー（Deep Copy）は、元のオブジェクトとそのすべての子オブジェクトを再帰的にコピーします。その結果、コピー元とコピー先は完全に独立したオブジェクトとなります。

#### 例

```python
import copy

values = [[1, 2], [3, 4]]
deep_copy = copy.deepcopy(values)  # 深いコピー（Deep Copy）

deep_copy[0][0] = 9  # 子オブジェクトを変更
print(values)  # [[1, 2], [3, 4]]
print(deep_copy)  # [[9, 2], [3, 4]]
```

この場合、コピー元とコピー先のオブジェクトは完全に独立しているため、片方の変更がもう片方に影響を与えることはありません。

## 2. `copy` モジュールの活用方法

`copy` モジュールは、オブジェクトをコピーするための便利な関数を提供します。以下に、代表的な 2 つの関数を紹介します。

### 2.1 `copy.copy()`

#### 特徴

- 浅いコピー（Shallow Copy）を作成します。
- 1 階層目の要素は新しいオブジェクトとしてコピーされますが、2 階層目以降は参照が共有されます。

#### 使用例

```python
import copy

values = ['a', 'b', 'c']
shallow_copy = copy.copy(values)
shallow_copy[1] = 'x'  # コピー先を変更

print(values)  # ['a', 'b', 'c']
print(shallow_copy)  # ['a', 'x', 'c']
```

多次元リストの場合の挙動については、先述の例を参照してください。

### 2.2 `copy.deepcopy()`

#### 特徴

- 深いコピー（Deep Copy）を作成します。
- すべての階層を再帰的にコピーするため、コピー元とコピー先が完全に独立します。

#### 使用例

```python
import copy

values = [[1, 2], [3, 4]]
deep_copy = copy.deepcopy(values)
deep_copy[0][0] = 9  # コピー先を変更

print(values)  # [[1, 2], [3, 4]]
print(deep_copy)  # [[9, 2], [3, 4]]
```

## 3. その他のコピー方法

`copy` モジュールを使用しなくても、以下の方法で浅いコピー（Shallow Copy）を作成することが可能です。

### 3.1 スライス

リスト全体をスライスすることで浅いコピー（Shallow Copy）を作成できます。

#### 使用例

```python
values = [1, 2, 3]
shallow_copy = values[:]
shallow_copy[0] = 9

print(values)  # [1, 2, 3]
print(shallow_copy)  # [9, 2, 3]
```

### 3.2 組み込み関数

リストや辞書、セットなどの組み込み関数を使用して浅いコピー（Shallow Copy）を作成できます。

#### 使用例

```python
values_list = [1, 2, 3]
values_dict = {'key': 'value'}
values_set = {1, 2, 3}

shallow_list = list(values_list)
shallow_dict = dict(values_dict)
shallow_set = set(values_set)

print(shallow_list)  # [1, 2, 3]
print(shallow_dict)  # {'key': 'value'}
print(shallow_set)  # {1, 2, 3}
```

## 4. 実用例

### 4.1 ループ内での辞書コピー

辞書をコピーして編集し、リストに追加する例を紹介します。

#### 使用例

```python
import copy

authors = ['Alice', 'Bob', 'Charlie']
base_dict = {'role': 'author'}
data = []

for author in authors:
    temp = copy.copy(base_dict)
    temp['name'] = author
    data.append(temp)

print(data)
# [{'role': 'author', 'name': 'Alice'}, {'role': 'author', 'name': 'Bob'}, {'role': 'author', 'name': 'Charlie'}]
```

### 4.2 クラスインスタンスのコピー

クラスインスタンスをコピーする際は、`copy.deepcopy()` を使用します。

#### 使用例

```python
import copy

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

person1 = Person('Alice', 30)
person2 = copy.deepcopy(person1)
person2.name = 'Bob'

print(person1.name)  # Alice
print(person2.name)  # Bob
```

## 5. 参照、Shallow Copy、Deep Copy の使い分け

実際にどの方法を使用するべきかは、状況によって異なります。以下に、具体的な使いどころを示します。

### 5.1 参照

- **使いどころ**:
  - パフォーマンスを重視する場合。
  - 同じオブジェクトを複数の箇所で共有して使用する必要がある場合。
- **注意点**:
  - 変更が他の箇所に影響を及ぼす可能性がある。

### 5.2 Shallow Copy（浅いコピー）

- **使いどころ**:
  - 1 階層目の要素だけをコピーしたい場合。
  - データ構造がシンプルで、子オブジェクトを共有しても問題ない場合。
- **注意点**:
  - 子オブジェクトを変更すると、コピー元にも影響が出る。

### 5.3 Deep Copy（深いコピー）

- **使いどころ**:
  - 多階層のデータ構造を完全に分離して扱いたい場合。
  - コピー元とコピー先が完全に独立している必要がある場合。
- **注意点**:
  - 階層が深いデータ構造では処理コストが高くなる。

## 6. 結論

`copy` モジュールを使用すると、Python でのオブジェクトコピーが簡単かつ安全に行えます。特に、`copy.copy()` と `copy.deepcopy()` の違いを正しく理解することで、意図しないデータ変更を防ぎ、プログラムの信頼性を向上させることができます。用途に応じて適切なコピー方法を選択し、効率的なコーディングを行いましょう。
