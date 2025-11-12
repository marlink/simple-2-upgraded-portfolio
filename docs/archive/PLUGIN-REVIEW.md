# Cursor IDE Plugin & Settings Review

**Date:** 2025-01-XX  
**Project Type:** Static HTML/CSS/JS Website  
**Build System:** None (vanilla files)

---

## 📋 Project Overview

This is a **static website** with:
- ✅ Custom CSS framework (no build tools)
- ✅ Vanilla JavaScript (ES6+)
- ✅ HTML5 semantic markup
- ✅ No dependencies (no package.json)
- ✅ No build process required
- ✅ Prettier for code formatting

---

## 🔍 Current Settings Analysis

### `.vscode/settings.json` Review

**✅ Good Settings:**
- Format on save enabled
- Prettier as default formatter
- Live Server configuration
- File exclusions for performance
- Emmet enabled

**⚠️ Issues Found:**
1. **ESLint & Stylelint configured but no config files exist**
   - Settings reference `source.fixAll.eslint` and `source.fixAll.stylelint`
   - No `.eslintrc*` or `.stylelintrc*` files in project
   - These will fail silently or show errors

**Recommendation:** Either:
- Remove ESLint/Stylelint from settings, OR
- Add proper config files for these tools

---

## 🔌 Installed Extensions Analysis

### Currently Installed (23 extensions)

#### ❌ **SHOULD REMOVE** - Not Relevant to Project

1. **Python Extensions (5 extensions)**
   - `ms-python.python`
   - `ms-python.vscode-pylance`
   - `ms-python.vscode-python-envs`
   - `ms-python.debugpy`
   - **Reason:** No Python code in this project

2. **Jupyter Extensions (5 extensions)**
   - `ms-toolsai.jupyter`
   - `ms-toolsai.jupyter-keymap`
   - `ms-toolsai.jupyter-renderers`
   - `ms-toolsai.vscode-jupyter-cell-tags`
   - `ms-toolsai.vscode-jupyter-slideshow`
   - **Reason:** No Jupyter notebooks in this project

3. **Container/Cloud Extensions (3 extensions)**
   - `ms-azuretools.vscode-containers`
   - `ms-vscode-remote.remote-containers`
   - `googlecloudtools.cloudcode`
   - **Reason:** Static site doesn't need containers/cloud deployment tools

4. **GitHub Actions**
   - `github.vscode-github-actions`
   - **Reason:** Only needed if actively using GitHub Actions workflows

5. **Builder Extension**
   - `builder.builder`
   - **Reason:** Unclear purpose, not needed for static site

#### ⚠️ **CONSIDER REMOVING** - Redundant/Unnecessary

1. **Multiple AI Assistants (6 extensions)**
   - `github.copilot`
   - `github.copilot-chat`
   - `google.geminicodeassist`
   - `continue.continue`
   - `codium.codium`
   - `rooveterinaryinc.roo-cline`
   - **Reason:** Too many AI assistants - causes conflicts and confusion
   - **Recommendation:** Keep only 1-2 (e.g., GitHub Copilot + Cursor's built-in AI)

2. **Ollama Connection**
   - `diegoomal.ollama-connection`
   - **Reason:** Only needed if using local Ollama models
   - **Recommendation:** Remove unless actively using

3. **Figma Extension**
   - `sethford.mcp-figma-extension`
   - **Reason:** Only needed if actively designing in Figma
   - **Recommendation:** Remove unless actively using

#### ✅ **KEEP** - Relevant to Project

1. **Markdown Linter**
   - `davidanson.vscode-markdownlint`
   - **Reason:** Project has markdown documentation files

---

## 📦 Recommended Extensions (from extensions.json)

### ✅ **Already Recommended** (Check if installed)

1. `esbenp.prettier-vscode` - **ESSENTIAL** ✅ (configured in settings)
2. `dbaeumer.vscode-eslint` - ⚠️ (referenced in settings but no config)
3. `stylelint.vscode-stylelint` - ⚠️ (referenced in settings but no config)
4. `ecmel.vscode-html-css` - **HIGHLY RECOMMENDED** (HTML/CSS support)
5. `pranaygp.vscode-css-peek` - **HIGHLY RECOMMENDED** (CSS navigation)
6. `phoenisx.cssvar` - **HIGHLY RECOMMENDED** (CSS custom properties support)
7. `ritwickdey.LiveServer` - **ESSENTIAL** ✅ (configured in settings)
8. `shd101wyy.markdown-preview-enhanced` - **RECOMMENDED** (markdown docs)
9. `naumovs.color-highlight` - **RECOMMENDED** (visualize colors)
10. `cssho.vscode-svg-viewer` - **RECOMMENDED** (SVG icons in project)
11. `kisstkondoros.vscode-gutter-preview` - **RECOMMENDED** (image preview)
12. `deque-systems.vscode-axe-linter` - **HIGHLY RECOMMENDED** (accessibility)

---

## 🎯 Recommended Actions

### 1. **Remove Unnecessary Extensions** (13-15 extensions)

**High Priority Removals:**
```bash
# Python (5 extensions)
code --uninstall-extension ms-python.python
code --uninstall-extension ms-python.vscode-pylance
code --uninstall-extension ms-python.vscode-python-envs
code --uninstall-extension ms-python.debugpy

# Jupyter (5 extensions)
code --uninstall-extension ms-toolsai.jupyter
code --uninstall-extension ms-toolsai.jupyter-keymap
code --uninstall-extension ms-toolsai.jupyter-renderers
code --uninstall-extension ms-toolsai.vscode-jupyter-cell-tags
code --uninstall-extension ms-toolsai.vscode-jupyter-slideshow

# Containers (3 extensions)
code --uninstall-extension ms-azuretools.vscode-containers
code --uninstall-extension ms-vscode-remote.remote-containers
code --uninstall-extension googlecloudtools.cloudcode
```

**Medium Priority Removals:**
```bash
# Redundant AI assistants (keep only 1-2)
code --uninstall-extension continue.continue
code --uninstall-extension codium.codium
code --uninstall-extension rooveterinaryinc.roo-cline
code --uninstall-extension google.geminicodeassist  # Keep GitHub Copilot instead

# Optional
code --uninstall-extension github.vscode-github-actions  # Only if not using GitHub Actions
code --uninstall-extension builder.builder
code --uninstall-extension diegoomal.ollama-connection  # Only if not using Ollama
code --uninstall-extension sethford.mcp-figma-extension  # Only if not using Figma
```

### 2. **Install Missing Recommended Extensions**

**Essential:**
```bash
code --install-extension ecmel.vscode-html-css
code --install-extension pranaygp.vscode-css-peek
code --install-extension phoenisx.cssvar
code --install-extension deque-systems.vscode-axe-linter
```

**Highly Recommended:**
```bash
code --install-extension shd101wyy.markdown-preview-enhanced
code --install-extension naumovs.color-highlight
code --install-extension cssho.vscode-svg-viewer
code --install-extension kisstkondoros.vscode-gutter-preview
```

### 3. **Fix Settings Configuration**

**Option A: Remove ESLint/Stylelint (Recommended for static site)**
- Remove ESLint/Stylelint references from settings.json
- No need for linting on a simple static site

**Option B: Add Proper Config Files**
- Create `.eslintrc.json` for JavaScript linting
- Create `.stylelintrc.json` for CSS linting
- Install necessary npm packages (but project has no package.json)

---

## 📊 Extension Summary

### Current State
- **Total Installed:** 23 extensions
- **Relevant:** ~8 extensions
- **Unnecessary:** ~15 extensions (65% bloat)

### After Cleanup
- **Total Installed:** ~15-18 extensions
- **Relevant:** ~15-18 extensions
- **Unnecessary:** 0 extensions

### Performance Impact
- **Startup Time:** Faster (fewer extensions to load)
- **Memory Usage:** Lower (fewer background processes)
- **IntelliSense:** More focused (less conflicting suggestions)

---

## 🎨 Additional Recommendations

### For HTML/CSS/JS Development

1. **HTMLHint** (optional)
   - `mkaufman.htmlhint`
   - Validates HTML structure

2. **CSS Navigation** (already recommended)
   - `pranaygp.vscode-css-peek` - Jump to CSS definitions

3. **Browser Preview** (optional)
   - `auchenberg.vscode-browser-preview`
   - Preview HTML in VS Code

4. **Path Intellisense** (optional)
   - `christian-kohler.path-intellisense`
   - Autocomplete for file paths

5. **Auto Rename Tag** (optional)
   - `formulahendry.auto-rename-tag`
   - Automatically rename paired HTML tags

6. **Bracket Pair Colorizer** (optional)
   - Built into VS Code now, but can use `coenraads.bracket-pair-colorizer-2` for advanced features

### For Documentation

1. **Markdown All in One** (optional)
   - `yzhang.markdown-all-in-one`
   - Enhanced markdown support

---

## 🔧 Settings Improvements

### Recommended Settings Updates

```json
{
  // Remove ESLint/Stylelint if not using
  "editor.codeActionsOnSave": {
    // Remove these if no config files:
    // "source.fixAll.eslint": "explicit",
    // "source.fixAll.stylelint": "explicit"
  },
  
  // Add CSS custom properties support
  "css.customData": [".vscode/css-custom-data.json"],
  
  // Improve HTML formatting
  "html.format.wrapLineLength": 120,
  "html.format.wrapAttributes": "auto",
  
  // Better file associations
  "files.associations": {
    "*.css": "css",
    "*.html": "html",
    "*.js": "javascript"
  }
}
```

---

## ✅ Action Checklist

- [ ] Remove Python extensions (5)
- [ ] Remove Jupyter extensions (5)
- [ ] Remove Container/Cloud extensions (3)
- [ ] Consolidate AI assistants (remove 3-4 redundant ones)
- [ ] Remove optional extensions (GitHub Actions, Builder, Ollama, Figma if not used)
- [ ] Install missing recommended extensions (8)
- [ ] Fix settings.json (remove ESLint/Stylelint or add config files)
- [ ] Test that Prettier still works
- [ ] Test that Live Server still works
- [ ] Verify all recommended extensions are installed

---

## 📝 Notes

- **Cursor's Built-in AI:** Cursor already has powerful AI built-in, so multiple AI extensions may be redundant
- **No Build Tools:** Since this is a static site, most build-related extensions are unnecessary
- **Performance:** Fewer extensions = faster startup and better performance
- **Focus:** Keeping only relevant extensions improves IntelliSense accuracy

---

**Last Updated:** 2025-01-XX

