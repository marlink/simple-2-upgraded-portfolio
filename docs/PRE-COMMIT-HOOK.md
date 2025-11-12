# Pre-Commit Hook Setup

A pre-commit hook has been set up to automatically run validation and consistency checks before each commit.

## What It Does

The pre-commit hook automatically runs:
1. **HTML and CSS validation** (`npm run validate:all`)
2. **Consistency checks** (`npm run check:consistency`)

## Behavior

- ✅ **All checks pass:** Commit proceeds normally
- ⚠️ **Warnings only:** Commit proceeds (warnings are informational)
- ❌ **Errors found:** Commit is blocked (must fix errors first)

## Location

The hook is located at: `.git/hooks/pre-commit`

## Manual Testing

Test the hook manually:
```bash
# Test the hook
.git/hooks/pre-commit

# Or simulate a commit
git commit --dry-run
```

## Bypassing the Hook (If Needed)

If you need to bypass the hook for an emergency commit:
```bash
git commit --no-verify -m "Emergency commit message"
```

**⚠️ Warning:** Only bypass when absolutely necessary. The hook helps maintain code quality.

## Disabling the Hook

To temporarily disable:
```bash
chmod -x .git/hooks/pre-commit
```

To re-enable:
```bash
chmod +x .git/hooks/pre-commit
```

## Requirements

The hook requires:
- Node.js installed
- `node_modules` directory (run `npm install`)

If these aren't available, the hook will skip checks and allow the commit.

## Customization

To modify the hook, edit `.git/hooks/pre-commit`:
- Add additional checks
- Change exit behavior
- Modify output messages

## Benefits

- ✅ Catches issues before they're committed
- ✅ Maintains code quality automatically
- ✅ Prevents committing broken code
- ✅ Enforces project standards

---

**Status:** ✅ Pre-commit hook installed and active

