---
templateKey: blog-post
title: "Managing dnf Transactions with dnf history and Rollback"
date: "2025-07-10"
description: "Learn how to use dnf history to inspect and revert package transactions on RHEL-based systems using undo and rollback commands."
tags: ["dnf", "Linux", "RHEL"]
featuredImage: ../../thumbnails/linux.jpg
relatedPosts:
  - dnf-1
  - dnf-2
  - dnf-error-check
---

This article explains how to leverage the `dnf history` command to inspect past package transactions and perform rollbacks or undos when necessary. Use this guide to maintain reliable package management on RHEL‑based systems like Rocky Linux and CentOS.

## Introduction

Package management on RHEL‑based distributions (e.g., RHEL, CentOS, Rocky Linux) is handled by `dnf`. The `dnf history` feature provides a record of all transactions (installations, removals, upgrades), allowing you to audit and even revert undesired changes.

## Prerequisites

- Root or sudo privileges.
- A system using `dnf` for package management.
- Basic familiarity with installing and removing packages using `dnf`.

## Viewing Transaction History

### Listing All Transactions

Run:

```bash
dnf history list
```

This shows a table of the last N transactions with:

- **ID**: Transaction identifier.
- **Command line**: The `dnf` command that was run.
- **Date and time**: When the transaction started.
- **Action(s)**: Install, Remove, Upgrade, etc.
- **Altered**: Number of packages affected.

### Inspecting Details of a Transaction

To view what changed in a specific transaction, use its **ID**:

```bash
# Replace <ID> with a real transaction number
dnf history info <ID>
```

You’ll see:

- **Begin and end time** of the transaction
- **Command line** invoked
- **List of packages** installed, upgraded, or erased

## Undoing and Rolling Back Transactions

### `undo` vs. `rollback`

- **undo**: Reverses a single transaction by ID (can remove installed packages and re-install erased ones).
- **rollback**: Rolls the entire RPM database to a given transaction scope, effectively undoing multiple transactions in one go.

### Undoing a Single Transaction

```bash
# Revert transaction 53
sudo dnf history undo 53
```

This will:

- Erase any packages installed in transaction 53.
- Re-install any packages that were removed in transaction 53.

### Rolling Back to a Previous State

```bash
# Roll the system back to transaction 50
sudo dnf history rollback 50
```

This will undo **all** transactions that occurred _after_ transaction 50, restoring the system state as of that transaction.

## Best Practices and Caveats

- **Inspect before reverting**: Always use `dnf history info` to confirm which packages will be affected.
- **Avoid partial rollbacks**: Rolling back complex dependency operations may lead to conflicts; prefer `undo` for single, targeted transactions.
- **Back up critical data**: Although `dnf history` is powerful, always maintain backups of configuration files and important data.
- **Limit rollback depth**: Long rollback chains can leave the system in an inconsistent state; plan and test in a staging environment first.

## Examples

1. **List the last 10 transactions**

   ```bash
   dnf history list | head -n 12
   ```

2. **View details of transaction 58**

   ```bash
   dnf history info 58
   ```

3. **Undo a bad install**

   ```bash
   sudo dnf history undo 58
   ```

4. **Rollback two transactions**

   ```bash
   sudo dnf history rollback 56
   ```

## References

- [dnf(8) Manual Page](https://man7.org/linux/man-pages/man8/dnf.8.html)
- [Chapter 9. Handling package management history | Installing managing and removing user-space components | Red Hat Enterprise Linux | 8 | Red Hat Documentation](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/installing_managing_and_removing_user-space_components/handling-package-management-history_using-appstream)
