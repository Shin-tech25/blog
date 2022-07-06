---
title: メンテナンスしやすいAnsiblePlaybookの書き方
date: "2022-07-06T11:29"
description: "メンテナンスしやすいAnsiblePlaybookの書き方"
---

このページでは、保守的な Playbook の書き方、冪等性などをしっかりと考慮した Playbook や tips を紹介しています。シンプルでクリーンな Playbook を作成しましょう。

Ansible は Red Hat 社により開発されているサーバプロビジョニング・ツールです。Linux を始めとして、Windows、Cisco 機器などに対しても設定変更を行うことができます。汎用性が高いことがメリットです。

一方、設計段階で Playbook( = Ansible 実行コード)の設計方針をしっかりと決めなければ、Playbook と処理の対応関係が次第に分かりづらくなり、保守に時間がかかるコードを量産してしまうことに繋がります。

業務で実際に複雑な Playbook を見てきました。見ただけでは実際に何をする処理なのか分かりづらく、ミスの温床になります。

そういった Playbook を作らないためにどうしたら良いか。以下に記載しました。

## 概要

保守的な Playbook を考える上でも観点はいくつかあります。
その中でも特に重要な観点である、以下の 3 つ:

- トップダウン設計
- ドライランチェック
- 冪等性
- 変数の設計

について挙げていきます。

### トップダウン設計

Playbook の設計で最も重視すべきなのがこのトップダウン設計です。

- site.yml
- 各種 Playbook
- role

この順番に Playbook を記述していきます。実際の処理(Task)は、role にだけ記述します。`site.yml`や Playbook には、対応関係のみを記述します。こうすることで、メンテナンスしやすくなります。

`site.yml`は以下のように、Playbook を`import_playbook`により import します。

```YAML
---
- name: Linuxの共通設定(all)
  import_playbook: linux-common.yml

- name: Manager 用の設定
  import_playbook: manager.yml

- name: Staging用の設定
  import_playbook: staging.yml

- name: Production用の設定
  import_playbook: production.yml
```

各種 Playbook は以下のように、`role` を用いて処理を記述していきます。なお、`role`は`roles`の下にネストして、`tags`を付与します。
このようにすることで、`role`の局所的使用を可能にします。

```YAML
---
- name: Linux の共通設定用の Playbook
  hosts: linux
  become: true
  gather_facts: true

  roles:
  # ホスト名変更
  - role: change_hostname
    tags: change_hostname

  # 共通パッケージインストール
  - role: linux_common_packages
    tags: linux_common_packages

  # firewalld 有効化と設定
  - role: firewalld_setup
    tags: firewalld_setup

  # sshd 有効化と設定
  - role: sshd
    tags: sshd

  # docker インストール
  - role: install_docker
    tags: install_docker

  # SELinux 無効化と必要なら再起動
  - role: selinux
    tags: selinux
```

### ドライランチェック
ドライランチェックには、`ansible-playbook site.yml --check`のように、`--check`をオプションとして付与して実行します。
Playbookを実行する前に、冪等性のチェックと同様にドライランチェックを実行しましょう。
ドライランチェックを実行した際に問題が無いようなPlaybookの設計をしましょう。

### 冪等性
Playbookが冪等性が保たれていることを確認するために、最も簡単な方法はPlaybookを二度実行して変更箇所が無いかどうか確認することです。
ただし、これはサーバの設定変更が反映されてしまいます。冪等性を確認するためにAnsibleが用意してくれているツールがあります。それが、`Ansible Molecule`です。

`Molecule`では、テスト環境の作成、テスト、テスト環境の削除が行われます。

1. テスト環境の構築
テスト環境を新規構築します。MoleculeではAnsibleがサポートしている環境（Docker, EC2など）の構築が可能です。Molecule内の定義ファイルへ、DockerやEC2などの構築したい環境を記載することが出来ます。


### 変数の設計



## Playbook



### Playbook の総本山 site.yml



### 役割単位で Playbook を設計する

### role に実際の処理を書く

### role はタグ付けし、局所的運用を可能にする

## Inventory の設計

### YAML 形式での Inventory 構成

### host_vars, group_vars

## role の書き方

### 車輪の再発明を防ぐ!Ansible-Galaxy

## リファクタリング

## リンク

### 内部リンク

### 参考
- [AnsibleのテストツールMoleculeでできること](https://dev.classmethod.jp/articles/ansible-molecule/)