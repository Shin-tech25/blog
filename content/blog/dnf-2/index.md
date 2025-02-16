---
templateKey: blog-post
title: "DNFによるコンテンツのインストール - DNF(2)"
date: "2024-09-22"
description: "DNFコマンドとパッケージ管理システムの概念について体系的にまとめました。今回は2回目になります。DNFコマンドによるコンテンツインストールを扱います。"
tags: ["Linux", "dnf", "RHEL"]
featuredImage: ../thumbnails/linux.jpg
---

## 概要

インフラエンジニアなら`dnf`コマンドを使用したことが無いという人はまずいない、と言っても過言ではないくらいよく使うパッケージ管理コマンドですが、パッケージ管理は奥が深く、しっかりと理解するのも難しく、自分の学習も兼ねてまとめてみました。今回は 2 回目になります。

`dnf`コマンドに関しては、Red Hat 本家が出しているドキュメントが最も参考になると思います。この記事は、以下のドキュメントから適宜抜粋し編纂したものです。しっかりと理解したい方は以下も参照してください。

[Red Hat Enterprise Linux 9 DNF ツールを使用したソフトウェアの管理](https://docs.redhat.com/ja-jp/documentation/red_hat_enterprise_linux/9/pdf/managing_software_with_the_dnf_tool/Red_Hat_Enterprise_Linux-9-Managing_software_with_the_DNF_tool-ja-JP.pdf)

今回は、上記の「第 5 章 RHEL 9 コンテンツのインストール」および「第 6 章 RHEL 9 コンテンツの更新」の内容になります。

## パッケージのインストール

ソフトウェアがデフォルトのインストールに含まれていない場合は、手動でインストールできます。DNF は依存関係を解決してインストールします。

前提として、インストールするパッケージ名が分かっていなければなりません。これについては、前回の記事を参考にし、パッケージ検索の方法について理解してください。

### リポジトリーからのパッケージインストール

これが最も使われるパッケージインストール方法だと思われます。以下のコマンドでパッケージインストールが可能です。

```bash
dnf install <package_name_1> <package_name_2> ...
```

i686 や x86_64 などの複数のアーキテクチャをサポートするシステムにパッケージをインストールする場合は、パッケージ名にそれを追加することで、パッケージのアーキテクチャを指定できます。

```bash
dnf install <package_name>.<architecture>
```

### ローカル RPM ファイルからのインストール

ローカル RPM ファイルからのインストールも可能です。パッケージに依存関係がある場合は、これらの RPM ファイルへのパスも指定します。指定しなかった場合、DNF はリポジトリーから依存関係をダウンロードします。依存関係がリポジトリーで利用できない場合はインストールに失敗します。

```bash
dnf install <path_to_RPM_file>
```

## パッケージグループのインストール

パッケージグループには複数のパッケージがバンドルされています。パッケージグループを使用すると、グループに割り当てられたすべてのパッケージを 1 回の手順でインストールできます。

前提として、インストールするパッケージグループ名が分かっていなければなりません。これについては、前回の記事を参考にし、パッケージグループ検索の方法について理解してください。

**手順**

以下のコマンドでパッケージグループをインストールします。

```bash
dnf group install <group_name_or_ID>
```

## モジュールコンテンツのインストール

特定のソフトウェアについては、Red Hat がモジュールを提供しています。モジュールを使用して、特定のバージョン（ストリーム）とパッケージのセット（プロファイル）をインストールできます。

**手順**

インストールするパッケージを提供するモジュールをリスト表示します。

```bash
dnf module list <module_name>
```

モジュールをインストールします。

```bash
dnf module install <module_name>:<stream>/<profile>
```

ストリームのデフォルトプロファイルが定義されている場合は、コマンドの`/<profile>`を省略して、このストリームのデフォルトプロファイルをインストールできます。

たとえば、nodejs モジュールのストリーム 18 からデフォルトのプロファイル (common) をイ
ンストールするには、次のように入力します。

```bash
dnf module install nodejs:18

=====================================================================================================
Package Architecture Version Repository Size
=====================================================================================================
Red Hat Enterprise Linux 9 DNF ツールを使用したソフトウェアの管理
18
Installing group/module packages:
nodejs x86_64 ... rhel-9-for-x86_64-appstream-rpms 12 M
npm x86_64 ... rhel-9-for-x86_64-appstream-rpms 2.5 M
Installing weak dependencies:
nodejs-docs noarch .. rhel-9-for-x86_64-appstream-rpms 7.6 M
nodejs-full-i18n x86_64 .. rhel-9-for-x86_64-appstream-rpms 8.4 M
Installing module profiles:
nodejs/common
Enabling module streams:
nodejs 18
```

**検証**

正しいモジュールストリームが有効になっており（`[e]`）、必要なプロファイルがインストールされている（`[i]`）ことを確認します。

```bash
dnf module list nodejs

Updating Subscription Management repositories.
Last metadata expiration check: 0:33:24 ago on Mon 24 Jul 2023 04:59:01 PM CEST.
Red Hat Enterprise Linux 9 for x86_64 - AppStream (RPMs)
Name Stream Profiles Summary
nodejs 18 [e] common [d] [i], development, minimal, s2i Javascript runtime
...
Hint: [d]efault, [e]nabled, [x]disabled, [i]nstalled
```

## カスタムのデフォルトモジュールストリームとプロファイルの定義

Red Hat Enterprise Linux 9 では、AppStream リポジトリーにデフォルトのストリームが定義されていません。ただし、デフォルトのモジュールストリームとデフォルトのモジュールプロファイルを設定できます。設定すると、デフォルトのモジュールのストリームとプロファイルをインストールするときに、その情報を省略できます。

**手順**

`dnf module list <module_name>`コマンドを使用して、利用可能なストリームとそのプロファイルを表示します。次に例を示します。

```bash
dnf module list nodejs

Name Stream Profiles Summary
nodejs 18 common [d], development, minimal, s2i Javascript runtime
```

この例では、nodejs:18 はデフォルトストリームとして設定されておらず、このストリームの
デフォルトプロファイルは common です。

`etc/dnf/modules.defaults.d/`ディレクトリーに YAML ファイルを作成して、モジュールのデ
フォルトのストリームとプロファイルを定義します。

たとえば、次の内容を含む`/etc/dnf/modules.defaults.d/nodejs.yaml`ファイルを作成し
て、nodejs モジュールのデフォルトストリームとして 18 を定義し、デフォルトプロファイル
として minimum を定義します。

```YAML
document: modulemd-defaults
version: 1
data:
    module: nodejs
    stream: "18"
    profiles:
        '18': [minimal]
```

**検証**

`dnf module list <module_name>`コマンドを使用して、新しいデフォルトのストリームとプロ
ファイルの設定を確認します。次に例を示します。

```bash
dnf module list nodejs

Name   Stream Profiles                          Summary
nodejs 18 [d] common, development, minimal [d], s2i Javascript runtime
```

## コンテンツの更新

DNF では、システムに保留中の更新があるかどうかを確認できます。更新が必要なパッケージをリスト表示して、1 つのパッケージ、複数のパッケージ、またはすべてのパッケージを一度に更新できます。更新を選択したパッケージに依存関係がある場合は、これらの依存関係も更新されます。

### 更新の確認

システムにインストールされているパッケージに利用可能な更新があるかどうかを識別するには、それらをリストします。

インストールされたパッケージの利用可能な更新を確認します。以下のコマンドは、更新が利用可能なパッケージおよびその依存関係のリストを表示します。

```bash
dnf check-update
```

### パッケージの更新

DNF を使用すると、単一のパッケージ、パッケージグループ、またはすべてのパッケージとその依存関係を一度に更新できます。

シナリオに応じて、次のいずれかのオプションを使用して更新を適用します。

- すべてのパッケージとその依存関係を更新するには、次のコマンドを実行します。

```bash
dnf upgrade
```

- 単一のパッケージを更新するには、次のように入力します。

```bash
dnf upgrade <package_name>
```

- 特定のパッケージグループからのパッケージのみを更新するには、次のように実行します。

```bash
dnf group upgrade <group_name>
```

### セキュリティー関連パッケージの更新

DNF を使用して、セキュリティー関連のパッケージを更新できます。

以下のコマンドは、システム上で利用可能なすべてのセキュリティ関連のパッケージを最新バージョンにアップグレードします。

```bash
dnf upgrade --security
```

以下のコマンドは、セキュリティに関わる最小限のバージョンへのアップグレードのみ行われ、余分な機能追加や修正が含まれる最新バージョンには更新しません。システムの安定性を維持しながらセキュリティ対策を行いたい場合に便利です。

```bash
dnf upgrade-minimal --security
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
