# Biome Configuration

This project uses [Biome](https://biomejs.dev/) for fast code linting and formatting.

## Overview

Biome is a fast and modern toolchain for JavaScript/TypeScript projects that handles:
- **Linting**: Check code quality issues
- **Formatting**: Consistent code style
- **Import Sorting**: Organize imports automatically

## Configuration File

The Biome configuration is defined in `biome.json`:

```json
{
  "organizeImports": { "enabled": true },
  "linter": { ... },
  "formatter": { ... }
}
```

## Scripts

### yarn check

Runs Biome to check and automatically fix:
- Code formatting issues
- Import organization
- Linting warnings and errors

```bash
# Check and fix code
yarn check
```

Options used:
- `--write`: Write fixes back to files
- `--unsafe`: Enable unsafe transformations

## Rules

### Linter Rules

The linter checks for:

**Correctness:**
- Unused imports (`noUnusedImports`): warns
- Unused variables (`noUnusedVariables`): warns
- Array literals (`useArrayLiterals`): warns

**Style:**
- Const assertions (`useAsConstAssertion`): warns
- Using const (`useConst`): warns
- Template usage (`useTemplate`): warns

**Complexity:**
- Banned types (`noBannedTypes`): warns
- Extra boolean casts (`noExtraBooleanCast`): warns

**Suspicious:**
- Explicit any usage (`noExplicitAny`): warns

### Formatter Configuration

**Formatting Style:**
- **Indent Style**: Space (2 spaces)
- **Line Width**: 100 characters
- **Bracket Spacing**: true

**JavaScript/TypeScript:**
- **Quote Style**: Single quotes
- **JSX Quote Style**: Double quotes

**JSON:**
- **Trailing Commas**: None

## Usage Examples

### Format all files
```bash
yarn check
```

### Check without fixing (when run with different options)
```bash
npx biome check .
```

### Format specific file patterns
```bash
npx biome check src/**/*.ts
```

## Integration with IDE

### VS Code

Install the Biome extension:
```
biomejs.biome
```

Then configure `.vscode/settings.json`:
```json
{
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  }
}
```

## Common Issues

### Error: "some errors were emitted while running checks"

This is expected! Biome has found issues that need to be fixed:
1. Code formatting issues (auto-fixed with `--write`)
2. Linting warnings (shown in output)
3. Type warnings (like `noExplicitAny`)

Review the output to see what was fixed and what warnings need attention.

### Performance

Biome is extremely fast:
- Typically checks all files in < 100ms
- Written in Rust for performance
- Parallel processing of files

## Customization

To change rules or formatting style:

1. Edit `biome.json`
2. Update the relevant section:
   - `linter.rules.*`: Change severity or disable rules
   - `formatter.*`: Change formatting options
3. Run `yarn check` to apply changes

## Documentation

For more information about Biome:
- [Official Website](https://biomejs.dev/)
- [Configuration Guide](https://biomejs.dev/reference/configuration/)
- [Rules Reference](https://biomejs.dev/linter/rules/)

## Ignoring Files

To ignore files from Biome checking, add ignore patterns to `biome.json`:

```json
{
  "linter": {
    "ignore": ["dist", "node_modules", "coverage"]
  },
  "formatter": {
    "ignore": ["dist", "node_modules", "coverage"]
  }
}
```

## Pre-commit Hook

To run Biome before committing, add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
yarn check || exit 1
```

Then make it executable:
```bash
chmod +x .git/hooks/pre-commit
```
