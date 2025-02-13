---
templateKey: blog-post
title: "LEGB規則とPythonの変数スコープ"
date: "2025-02-08"
description: "Pythonで変数名がどのように解決されるかを示すLEGB規則（Local、Enclosing、Global、Built-in）について、例を交えながら詳しく解説します。"
tags: ["Python"]

---


Python における変数スコープと名前解決の順序を理解することは、コードの予測可能な動作やバグの防止において非常に重要です。Python では、変数を参照する際に **LEGB 規則**（Local、Enclosing、Global、Built-in）に従います。この規則を正しく理解することで、スコープの境界を意識した適切なコード設計が可能になります。

## **LEGB 規則とは？**

LEGB は、以下の 4 つのスコープの頭文字を組み合わせたものです：

1. **Local（ローカルスコープ）**：現在の関数内で定義された変数。
2. **Enclosing（外側のスコープ）**：ネストされた関数の外側の関数で定義された変数。
3. **Global（グローバルスコープ）**：モジュールレベルで定義された変数。
4. **Built-in（ビルトインスコープ）**：Python に組み込まれた関数や変数。

Python は変数名を解決する際、上記の順序でスコープを検索します。具体的には、まずローカルスコープを検索し、次に外側のスコープ、続いてグローバルスコープ、最後にビルトインスコープの順に検索します。

## **各スコープの詳細**

### 1. Local（ローカルスコープ）
- **説明**：関数やメソッド内で定義された変数が属します。
- **特徴**：関数の実行中のみ有効で、関数外からはアクセスできません。

#### 例：
```python
def my_function():
    x = 10  # ローカル変数
    print(x)

my_function()  # 出力: 10
print(x)  # エラー: NameError: name 'x' is not defined
```
上記のコードでは、`x` は `my_function` 内のローカル変数であり、関数外からはアクセスできません。

### 2. Enclosing（外側のスコープ）
- **説明**：ネストされた関数において、内側の関数から見た外側の関数のスコープを指します。
- **特徴**：内側の関数から外側の関数の変数にアクセスできますが、デフォルトでは変更はできません。

#### 例：
```python
def outer_function():
    y = '外側の変数'

    def inner_function():
        print(y)  # 外側の変数にアクセス

    inner_function()

outer_function()  # 出力: 外側の変数
```
ここでは、`inner_function` が `outer_function` 内の変数 `y` にアクセスしています。

### 3. Global（グローバルスコープ）
- **説明**：モジュールレベルで定義された変数が属します。
- **特徴**：モジュール内のどこからでもアクセス可能です。

#### 例：
```python
z = 'グローバル変数'

def my_function():
    print(z)  # グローバル変数にアクセス

my_function()  # 出力: グローバル変数
```
`z` はグローバル変数であり、`my_function` 内からアクセスできます。

### 4. Built-in（ビルトインスコープ）
- **説明**：Python が提供する組み込み関数や例外名が含まれます。
- **特徴**：特別なインポートなしで使用できます。

#### 例：
```python
def my_function():
    print(len([1, 2, 3]))  # 組み込み関数 len を使用

my_function()  # 出力: 3
```
`len` はビルトインスコープに属する組み込み関数です。

## **LEGB 規則の適用例**

以下のコードで、変数 `a` の値がどのように解決されるかを見てみましょう：

```python
a = 'グローバル'

def outer():
    a = '外側'

    def inner():
        a = 'ローカル'
        print(a)

    inner()

outer()
```

**出力**：
```
ローカル
```

### **解説**：
1. `inner` 関数内で `a` は 'ローカル' として定義されており、ローカルスコープで解決されます。
2. もし `inner` 関数内で `a` が定義されていなければ、次に外側の `outer` 関数のスコープで `a` を探します。
3. それでも見つからなければ、グローバルスコープで `a` を探します。
4. 最終的に、ビルトインスコープを検索します。

## **スコープの操作**

Python では、特定のキーワードを使用してスコープ内の変数を操作できます。

### **1. `global` キーワード**
- **説明**：関数内でグローバル変数を参照・変更する際に使用します。

#### 例：
```python
x = 5

def my_function():
    global x
    x = 10

my_function()
print(x)  # 出力: 10
```
ここでは、`global` キーワードにより、関数内でグローバル変数 `x` を直接変更しています。

#### **注意点**
`global` を使用すると、意図せずグローバル変数が変更される可能性があるため、乱用は避けるべきです。

### **2. `nonlocal` キーワード**
- **説明**：ネストされた関数内で、外側の関数のスコープに属する変数を変更する際に使用します。

#### 例：
```python
def outer_function():
    x = '外側の変数'

    def inner_function():
        nonlocal x
        x = '変更された外側の変数'

    inner_function()
    print(x)

outer_function()  # 出力: 変更された外側の変数
```
ここでは、`nonlocal` により、`outer_function` 内の変数 `x` を `inner_function` 内から変更しています。

#### **注意点**
`nonlocal` は、グローバル変数やローカル変数には使用できません。**ローカルでもグローバルでもない変数に対してのみ有効です**。

## **まとめ**

- Python の変数スコープは **LEGB 規則**（Local、Enclosing、Global、Built-in）の順に検索されます。
- スコープを正しく理解することで、意図しない変数の上書きやエラーを防ぐことができます。
- **`global`** と **`nonlocal`** キーワードを使うことで、スコープのルールを一部変更できますが、使用には注意が必要です。

## **参考リンク**
- [Python Documentation - Naming and Binding](https://docs.python.org/3/reference/executionmodel.html#naming-and-binding)
- [Real Python - Understanding Python Scopes](https://realpython.com/python-scope-legb-rule/)
