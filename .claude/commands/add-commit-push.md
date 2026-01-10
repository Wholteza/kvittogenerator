---
allowed-tools: Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git diff:*), Bash(git log:*)
description: Add all files, commit with message, and push
argument-hint: <commit message>
---

Add all non-ignored files, commit with the provided message, and push to the remote branch.

1. Run `git add .` to stage all non-ignored files
2. Commit with message: $ARGUMENTS
3. Push to the current remote branch

Do not include Co-Authored-By attribution. Keep it simple.
