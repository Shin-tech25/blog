---
templateKey: blog-post
title: "DNFの概要とパッケージ、リポジトリーの検索 - DNF(1)"
date: "2024-09-17"
description: "DNFコマンドとパッケージ管理システムの概念について体系的にまとめました。パッケージ管理は実務上よく使用されますが、しっかりと理解されている方は少ないと思います。そこで、自分の学習も兼ねてRedHat本家ドキュメントを参照しつつ編集しました。"
tags: ["Linux", "dnf", "RHEL"]
featuredImage: ../../thumbnails/linux.jpg
relatedPosts:
  - dnf-2
  - dnf-error-check
  - managing-dnf-history
---

## 概要

インフラエンジニアなら`dnf`コマンドを使用したことが無いという人はまずいない、と言っても過言ではないくらいよく使うパッケージ管理コマンドですが、パッケージ管理は奥が深く、しっかりと理解するのも難しく、自分の学習も兼ねてまとめてみました。

`dnf`コマンドに関しては、Red Hat 本家が出しているドキュメントが最も参考になると思います。この記事は、以下のドキュメントから適宜抜粋し編纂したものです。しっかりと理解したい方は以下も参照してください。

[Red Hat Enterprise Linux 9 DNF ツールを使用したソフトウェアの管理](https://docs.redhat.com/ja-jp/documentation/red_hat_enterprise_linux/9/pdf/managing_software_with_the_dnf_tool/Red_Hat_Enterprise_Linux-9-Managing_software_with_the_DNF_tool-ja-JP.pdf)

今回は、上記の「第 2 章 RHEL 9 のコンテンツの配布」および「第 4 章 RHEL 9 コンテンツの検索」の内容になります。

## リポジトリー

Red Hat Enterprise Linux (RHEL)は、次のようなさまざまなリポジトリーを通してコンテンツを配信します。

### BaseOS

BaseOS とは、Red Hat Enterprise Linux (RHEL) のリポジトリーの一つであり、オペレーティングシステムの基盤を提供する基本的なコンポーネントを含んでいます。BaseOS リポジトリーに含まれるパッケージは、RHEL のインストールに必要な基本的な機能やコアセットで構成されており、以下のような要素が含まれます。

- カーネル や システムユーティリティ、ネットワーク機能 などの基本的な OS 機能
- RHEL の安定性やセキュリティを支えるための必須コンポーネント
- インフラストラクチャーサービス、システム管理ツール

BaseOS は、RHEL の以前のバージョンにおける従来のリポジトリー構成と類似しており、システムを正常に稼働させるために不可欠な部分で、サポート対象となることが保証されています。BaseOS は、全ての RHEL インストールの中心的な役割を果たし、RHEL の他のリポジトリー（例えば AppStream）と連携して、特定のアプリケーションや追加機能を提供する役割を担っています。

### AppStream

AppStream とは、Red Hat Enterprise Linux (RHEL) のリポジトリーの一つで、様々なワークロードやユースケースに対応するためのユーザー空間アプリケーション、ランタイム、データベース、開発ツールなどを提供するリポジトリーです。AppStream の特徴として、BaseOS リポジトリーとは異なり、システム上で実行されるアプリケーションや開発環境に関連するパッケージが含まれている点があります。

AppStream リポジトリーには以下のような要素が含まれます:

- プログラミング言語のランタイム（例: Python、Ruby、Node.js など）
- データベースソフトウェア（例: MySQL、PostgreSQL など）
- ユーザー空間のアプリケーション（例: LibreOffice、GIMP など）
- コンパイラ や 開発ツール（例: GCC、CMake など）

AppStream の大きな特徴の一つは、モジュール性です。AppStream では、特定のバージョンのアプリケーションやランタイムを必要に応じて選択できるモジュールという概念が導入されており、異なるバージョンのパッケージを並行して管理することができます。例えば、あるバージョンの Python が必要なワークロードではそのバージョンを選択し、別のワークロードでは異なるバージョンを使うことができます。

このリポジトリーは、システムの基本的な機能を提供する BaseOS リポジトリーを補完する形で、より幅広いアプリケーションやツールを追加でインストールできる柔軟な仕組みを提供しており、RHEL の汎用性を高めるために重要な役割を果たしています。

### CodeReady Linux Builder

CodeReady Linux Builder とは、Red Hat Enterprise Linux (RHEL) のサブスクリプションを持っているユーザー向けに提供されるリポジトリーで、主に開発者向けの追加パッケージを含んでいます。このリポジトリーには、オープンソースのライブラリや開発ツールが含まれており、特定の開発作業やアプリケーションのビルドに必要なコンポーネントを提供します。

ただし、Red Hat がこのリポジトリーに含まれるパッケージに対して公式なサポートを提供していないことが特徴です。そのため、CodeReady Linux Builder リポジトリーにあるパッケージは、主に開発環境での利用が推奨されますが、運用環境で使用する際には、自己責任で管理する必要があります。

主に次のようなものが提供されることがあります:

- 開発ツール
- ランタイム
- デバッグパッケージ

RHEL の基本機能だけでは足りない、開発に特化した追加パッケージが必要な場合に利用するリポジトリーです。

## パッケージ検索

必要なソフトウェアを提供するパッケージを特定するには、DNF を使用してリポジトリーを検索します。

ユースケースが似ていますが、コマンドの使い分けは以下の通りです:

- `dnf search (term)`…パッケージの名前・概要・説明からの検索。
- `dnf provides (file_name)`…ファイルやコマンドからの検索。
- `dnf repoquery (package_name)`…パッケージ名からの詳細情報取得。

まず、パッケージ名が分からない時、`dnf search (term)`や`dnf provides (file_name)`によってパッケージを特定します。パッケージが特定されたら、`dnf repoquery`によって、パッケージの詳細情報を取得します。このような流れになります。

### dnf search (term)

パッケージの名前または概要内の用語を検索するには次のように入力します。

```bash
dnf search <term>
```

### dnf repoquery (package_name)

パッケージ名を検索し、出力にパッケージ名とそのバージョンをリストするには、次のように入力します。

```bash
dnf repoquery <package_name>
```

`--info`オプションを付与すると、パッケージのサイズ、パッケージの依存関係、ソース、パッケージの簡単な説明とライセンス情報、リポジトリー名パッケージに関する詳細な情報などが追加されます。

```bash
dnf repoquery --info <package_name>
```

### dnf provides (file_name)

ファイルを提供するパッケージを検索するには、ファイル名またはファイルへのパスを指定します。

```bash
dnf provides <file_name>
```

## パッケージ一覧

DNF を使用すると、リポジトリーで使用可能なパッケージとそのバージョンのリストを表示できます。必要に応じてこのリストをフィルタして、たとえば更新を利用できるパッケージのみをリストすることができます。

### dnf list

パッケージのアーキテクチャ、バージョン番号、インストール元のリポジトリーを含めてリストします。

必要に応じてオプションを付与することでフィルターします。これは、インストール済みのパッケージ、リポジトリーで使用可能なパッケージ、新しいバージョンを利用できるパッケージなどの分類に基づき、フィルターされます。

**オプション**

- オプションなし: インストール済みのパッケージ、リポジトリーで使用可能なパッケージ
- `--all`: インストール済みのパッケージ、リポジトリーで使用可能なパッケージ、**無効化されているリポジトリーで使用可能なパッケージ**
- `--installed`: インストール済みのパッケージ
- `--available`: リポジトリーで使用可能なパッケージ
- `--upgrades`: 新しいバージョンを利用できるパッケージ（インストール済みパッケージ）

## リポジトリー一覧

システムで有効または無効になっているリポジトリーの概要を取得するには、リポジトリーをリスト表示します。

### dnf repolist

システムで有効になっているすべてのリポジトリーをリスト表示します。

**オプション**

- `--disabled`: 無効なリポジトリーのみがリストされます。
- `--all`: 有効なリポジトリーと無効なリポジトリーの両方がリストされます。

### dnf repoinfo (repository_name)

特定のリポジトリーについての詳細情報を取得します。

```bash
dnf repoinfo <repository_name>
```

## パッケージグループ

パッケージグループには複数のパッケージをバンドルされています。パッケージグループを使用すると、グループに割り当てられたすべてのパッケージを 1 回の手順でインストールできます。ただし、インストールする前に、必要なパッケージグループの名前を特定する必要があります。

### dnf group list

インストールされているグループと使用可能なグループの両方をリストします。

**オプション**

- `--installed`: インストールされているパッケージグループをリストします。
- `--available`: 使用可能なパッケージグループをリストします。

### dnf group info "(group_name)"

特定のグループに含まれる必須、オプション、およびデフォルトのパッケージをリストします。

```bash
dnf group info "<group_name>"
```

## モジュール

DNF を使用してモジュールを検索し、モジュールに関する情報を表示すると、モジュールをインストールする前に、リポジトリーで使用可能なモジュールを特定し、適切なストリームを選択できます。

パッケージグループと似ていますが、パッケージグループが**特定の目的や役割に基づいて、関連する複数のパッケージを一括してインストールできるようにまとめたもの**です。これにより関連するソフトウェアを簡単に一度にインストールできます。

例:

- Development Tools グループ: 開発に必要なコンパイラやツールが含まれてます。
- Server with GUI グループ: GUI ベースのサーバーを構築するために必要なパッケージが含まれます。

一方、モジュールとは、**特定のアプリケーションやツールの異なるバージョンを管理するための仕組み**で、複数のバージョンをシステム上に共存させることができます。モジュールには複数のパッケージが含まれており、ある程度の依存関係が整理されています。

例:

- nodejs モジュールには、バージョン 10, 12, 14 など異なるバージョンが含まれており、ユーザーは必要なバージョンを選択してインストールできます。

### dnf module list

利用可能なすべてのモジュールをリストします。

```bash
dnf module list
```

特定のモジュールのみを対象に同じ情報をリスト表示するには、`dnf module list <module_name>`コマンドを使用します。

```bash
dnf module list <module_name>
```

### dnf module provides (package_name)

パッケージがどのモジュール、プロファイルによって提供されているかを検索します。

```bash
dnf module provides <package_name>
```

### dnf module info (module_name)

ストリーム、サポートされているプロファイル、依存関係など全般的なモジュール情報を取得します。モジュールの全体像やストリームのバージョンに関する情報を知りたいときに使います。

```bash
dnf module info <module_name>
```

さらに、各プロファイルがインストールするパッケージのリストを表示するには、`--profile`オプションを使用します。プロファイルごとのパッケージの違いや、どのプロファイルがどのパッケージを含むかを確認したい場合に使います。

```bash
dnf module info --profile <module_name>
```

## References

- [Red Hat Enterprise Linux 9 DNF ツールを使用したソフトウェアの管理](https://docs.redhat.com/ja-jp/documentation/red_hat_enterprise_linux/9/pdf/managing_software_with_the_dnf_tool/Red_Hat_Enterprise_Linux-9-Managing_software_with_the_DNF_tool-ja-JP.pdf)
- [パッケージ管理ツール](https://docs.aws.amazon.com/ja_jp/linux/al2023/ug/package-management.html)
- [【 dnf 】コマンド（基礎編）――ソフトウェア（パッケージ）をインストールする：Linux 基本コマンド Tips（368） - ＠IT](https://atmarkit.itmedia.co.jp/ait/articles/2001/09/news018.html)
- [yum の後継、dnf について（Linux2023） #AWS - Qiita](https://qiita.com/zenden/items/de1860f9e976d87a1c6c)
- [パッケージ管理 (dnf yum) – Int Design LLC.](https://int-design.jp/content/dnf/)
- [定時帰る術-Linux パッケージ管理（dnf コマンド） #Linux - Qiita](https://qiita.com/Snow315/items/123ba83064019064b36d)
- [yum および dnf パッケージ マネージャーの一般的な問題のトラブルシューティング - Virtual Machines | Microsoft Learn](https://learn.microsoft.com/ja-jp/troubleshoot/azure/virtual-machines/linux/yum-dnf-common-issues)
- [yum と dnf について | Linux 入門 PartⅣ | 演習で学ぶインフラ Linux](https://www.infra-linux.com/menu-linux5/yum-dnf/)
- [【 dnf 】コマンド（応用編その 3）――複雑な条件を付けてソフトウェア（パッケージ）の情報を表示する：Linux 基本コマンド Tips（371） - ＠IT](https://atmarkit.itmedia.co.jp/ait/articles/2001/17/news016.html)
