# Comprehensive Review Schedule

## Overview

A comprehensive project review is automatically required **every 5 versions** to ensure code quality, consistency, and maintainability.

## How It Works

1. **Version Tracking**: The system tracks versions in `version.json` (currently using patch version increments: 0.0.1, 0.0.2, etc.)

2. **Automatic Check**: When you run `npm run version:increment`, the system automatically checks if a review is needed

3. **Review Milestones**: Reviews are required at versions that are multiples of 5:
   - 0.0.5
   - 0.1.0 (if counting continues)
   - 0.1.5
   - etc.

4. **Tracking**: Review status is tracked in `.review-tracker.json` (automatically created)

## Commands

### Check if Review is Needed
```bash
npm run review:check
```

### Mark Review as Complete
After completing a review, mark it as done:
```bash
npm run review:complete
```

## Review Checklist

When a review is required, complete the following:

### 1. Code Optimization
- [ ] Remove duplicate code
- [ ] Remove unnecessary utility function fallbacks
- [ ] Consolidate similar functions
- [ ] Optimize imports and dependencies

### 2. File References
- [ ] Verify all file references exist
- [ ] Remove broken links/references
- [ ] Check image paths
- [ ] Verify favicon references

### 3. Sitemap & SEO
- [ ] Update sitemap.xml with current date
- [ ] Verify all public pages are included
- [ ] Check meta tags consistency

### 4. HTML Consistency
- [ ] Standardize formatting across all HTML files
- [ ] Ensure consistent structure
- [ ] Verify navigation consistency
- [ ] Check accessibility attributes

### 5. Documentation
- [ ] Consolidate redundant documentation
- [ ] Move outdated docs to archive
- [ ] Update README if needed
- [ ] Document any new patterns

### 6. Archive Folder
- [ ] Review archive folder contents
- [ ] Document purpose of archived files
- [ ] Remove truly unused files

### 7. Verification
- [ ] Run `npm run check:consistency`
- [ ] Run `npm run lint:all`
- [ ] Run `npm test`
- [ ] Test critical functionality manually

### 8. Generate Report
- [ ] Create optimization report (see OPTIMIZATION-REPORT.md for template)
- [ ] Document all changes made
- [ ] Note any issues found

## Review Process

1. **Check Status**: Run `npm run review:check` to see if review is needed

2. **Complete Review**: Follow the checklist above systematically

3. **Run Tests**: Ensure all tests pass and consistency checks pass

4. **Mark Complete**: Run `npm run review:complete` to mark review as done

5. **Continue Development**: Normal version increments can continue

## Manual Review Trigger

You can also trigger a review check manually at any time:
```bash
npm run review:check
```

## Integration with Git

The review system works independently of git commits. However, you can integrate it with your git workflow:

### Option 1: Pre-commit Hook
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm run review:check || exit 1
```

### Option 2: CI/CD Integration
Add to your CI pipeline:
```yaml
- name: Check Review Status
  run: npm run review:check
```

## Notes

- Reviews are based on version numbers, not git commits
- The system tracks the last review version automatically
- You can review more frequently if desired (just mark as complete)
- Reviews ensure code quality and prevent technical debt accumulation

## Reference

- See `OPTIMIZATION-REPORT.md` for a complete review example
- See `docs/REVIEW-AND-OPTIMIZATION.md` for detailed optimization guidelines

