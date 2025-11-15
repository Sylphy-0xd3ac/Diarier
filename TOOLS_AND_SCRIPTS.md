# Development Tools and Scripts

Complete guide to the development tools and scripts available in the Secure Diary API project.

## Quick Start

### Installation

```bash
# Install all dependencies
yarn install

# Copy environment variables
cp .env.example .env
```

### Most Used Commands

```bash
# Start development server with hot reload
yarn dev

# Format and lint code
yarn check

# Run tests
yarn test

# Build for production
yarn build
```

## Available Scripts

All scripts are defined in `package.json` and use Yarn 4.10.3.

### Development

#### `yarn dev`
Start the development server with hot reload using tsx.

```bash
yarn dev
```

- Watches `src/index.ts` and related files
- Auto-reloads on changes
- Uses nodemon-like behavior via tsx watch
- Connects to MongoDB automatically
- Perfect for local development

**Requirements:**
- `.env` file with `MONGODB_URI`
- MongoDB running and accessible

**Output:**
```
Starting application in development mode...
✓ MongoDB connected successfully
✓ Server running at http://localhost:3000
```

### Building

#### `yarn build`
Compile TypeScript to JavaScript with type checking.

```bash
yarn build
```

- Compiles all files in `src/` to `dist/`
- Generates source maps for debugging
- Creates `.d.ts` type definition files
- Strict type checking enabled
- Zero errors means ready for deployment

**Output Location:** `dist/` directory

#### `yarn start`
Run the compiled production build.

```bash
yarn start
```

- Runs `dist/index.js`
- Requires `yarn build` to run first
- Uses environment variables from `.env`
- Suitable for production deployments

### Testing

#### `yarn test`
Run Jest unit tests with ts-jest.

```bash
yarn test
```

- Auto-discovers `.test.ts` and `.spec.ts` files
- Runs in watch mode by default
- Fast feedback during development
- Coverage summary shown

**Test Location:** `src/__tests__/`

#### `yarn test:coverage`
Run tests with detailed coverage report.

```bash
yarn test:coverage
```

- Generates coverage statistics
- Creates HTML report in `coverage/lcov-report/`
- Shows statement, branch, function, and line coverage
- Useful before commits and releases

**Report Location:** `coverage/` directory

### Code Quality

#### `yarn check`
Run Biome to check, lint, and format code.

```bash
yarn check
```

- Checks code formatting consistency
- Organizes imports alphabetically
- Runs linting checks for code quality
- Automatically fixes issues (`--write` flag)
- Reports errors and warnings

**Biome Configuration:** `biome.json`

**What It Fixes:**
- Code formatting (indentation, spacing, quotes)
- Import organization
- Some type safety issues
- Unused imports

**Warnings to Address Manually:**
- `noExplicitAny`: Use typed parameters instead of `any`
- `noUnusedVariables`: Remove unused variables
- Other linting warnings

## Tool Configurations

### TypeScript (tsconfig.json)

**Key Settings:**
- Target: ES2020
- Module: CommonJS
- Strict mode: Enabled
- Source maps: Enabled
- Type checking: Strict

**Options:**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}
```

### Jest (jest.config.js)

**Test Configuration:**
- Preset: ts-jest (TypeScript support)
- Environment: Node.js
- Test paths: `src/**/*.test.ts`, `src/**/*.spec.ts`
- Coverage: Included in output

**Coverage Report:**
- Text summary in console
- HTML report: `coverage/lcov-report/index.html`

### Biome (biome.json)

**Linting:**
- Correctness rules: Warn on unused imports/variables
- Style rules: Enforce consistent code style
- Complexity rules: Flag overly complex code
- Suspicious rules: Warn on `any` types

**Formatting:**
- Indent: 2 spaces
- Line width: 100 characters
- Quotes: Single quotes (JS), Double quotes (JSON)
- Semicolons: Always

**Features:**
- Import organization enabled
- Fast formatting (written in Rust)
- Parallel file processing

### Yarn (package.json)

**Configuration:**
- Package manager: Yarn 4.10.3
- Uses Corepack for version management
- Node modules linking: node-modules

**.yarnrc.yml:**
```yaml
nodeLinker: node-modules
enableGlobalCache: true
```

## Development Workflow

### 1. Initial Setup

```bash
# Clone and setup
git clone <repo>
cd secure-diary-api

# Install dependencies
yarn install

# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 2. Development Loop

```bash
# Terminal 1: Start dev server
yarn dev

# Terminal 2: Check code quality
yarn check

# Terminal 3: Run tests
yarn test
```

### 3. Before Commit

```bash
# Format code
yarn check

# Run tests
yarn test

# Build to check for errors
yarn build

# Commit changes
git commit -m "Your message"
```

### 4. Prepare for Deployment

```bash
# Run comprehensive checks
yarn check && yarn test:coverage && yarn build

# If all passes, deploy
yarn start
```

## Common Tasks

### Add New Endpoint

1. Create controller in `src/app/controllers/`
2. Create model in `src/app/models/` (if needed)
3. Register route in `src/app/routes.ts`
4. Format code: `yarn check`
5. Test endpoint manually: `yarn dev`
6. Add tests: `src/__tests__/`
7. Run tests: `yarn test`

### Fix Code Style Issues

```bash
# Automatically fix formatting issues
yarn check

# If errors remain, review output and fix manually
```

### Debug Tests

```bash
# Run specific test file
yarn test utils.test.ts

# Run tests matching pattern
yarn test --testNamePattern="should hash"

# Run with verbose output
yarn test --verbose
```

### Create Production Build

```bash
# Check code quality
yarn check

# Run full test suite with coverage
yarn test:coverage

# Build application
yarn build

# Check output
ls -la dist/

# Test production build locally
yarn start
```

## Environment Variables

Create `.env` file with these variables:

```env
# Required
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/diary

# Optional
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
```

## Troubleshooting

### Issue: `yarn dev` won't start

**Solution:**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
PORT=3001 yarn dev
```

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Check specific errors
yarn build

# Fix errors reported and retry
yarn build
```

### Issue: Tests are failing

**Solution:**
```bash
# Run with verbose output
yarn test --verbose

# Run single test
yarn test utils.test.ts

# Check if MongoDB is running
mongosh
```

### Issue: `yarn check` finds too many errors

**Solution:**
- Most errors are automatically fixed
- Review warnings that aren't auto-fixed
- Fix `any` types manually if needed
- Run again after fixes: `yarn check`

### Issue: Yarn not found

**Solution:**
```bash
# Enable Corepack
corepack enable

# Prepare Yarn 4.10.3
corepack prepare yarn@4.10.3 --activate
```

## Performance Tips

1. **Fast Builds**: TypeScript compilation is fast (~2-3s)
2. **Fast Tests**: Jest runs quickly with ts-jest (~3s)
3. **Fast Linting**: Biome is very fast (~100ms)
4. **Watch Mode**: Use `yarn dev` for rapid feedback
5. **Parallel**: Run dev server and checks in separate terminals

## IDE Integration

### VS Code

**Extensions to Install:**
- Biome (biomejs.biome)
- TypeScript Vue Plugin (for TypeScript support)

**Settings (.vscode/settings.json):**
```json
{
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

## Git Hooks

Create `.git/hooks/pre-commit` for automated checks:

```bash
#!/bin/bash
set -e

yarn check && yarn test && yarn build
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Documentation

- [Yarn Documentation](https://yarnpkg.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/)
- [Biome Documentation](https://biomejs.dev/)
- [Express Documentation](https://expressjs.com/)

## Summary

| Tool | Purpose | Command |
|------|---------|---------|
| tsx | Dev server with hot reload | `yarn dev` |
| TypeScript | Type checking | `yarn build` |
| Jest | Unit testing | `yarn test` |
| Biome | Linting & formatting | `yarn check` |
| Yarn | Package management | All scripts |

Each tool is configured for best practices and can be customized via their respective configuration files.
