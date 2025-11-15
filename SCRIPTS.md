# Yarn Scripts Reference

Quick reference for all available Yarn scripts in the Secure Diary API project.

## Development

### yarn dev

Start the development server with hot reload using tsx.

```bash
yarn dev
```

**What it does:**
- Watches TypeScript files for changes
- Automatically restarts the server when files change
- Connects to MongoDB
- Registers all routes and middlewares
- Listens on port 3000 (default)

**Environment:**
- Uses `NODE_ENV=development` (from .env)
- Loads environment variables from `.env`
- Outputs logs to console

**Output Example:**
```
Starting application in development mode...
✓ MongoDB connected successfully
✓ Server running at http://localhost:3000
✓ Environment: development
✓ MongoDB: mongodb://localhost:27017/diary
```

## Building & Running

### yarn build

Compile TypeScript to JavaScript.

```bash
yarn build
```

**What it does:**
- Compiles all TypeScript files in `src/`
- Generates JavaScript files in `dist/`
- Creates source maps for debugging
- Exports type definitions
- Performs strict type checking

**Output:**
- `dist/` directory with compiled JavaScript
- `.d.ts` files for TypeScript type definitions
- `.js.map` and `.d.ts.map` source maps

### yarn start

Run the compiled production build.

```bash
yarn start
```

**What it does:**
- Runs the compiled JavaScript from `dist/index.js`
- Requires `yarn build` to be run first
- Uses environment variables from `.env`
- Suitable for production deployment

## Testing

### yarn test

Run Jest unit tests.

```bash
yarn test
```

**What it does:**
- Discovers all `.test.ts` and `.spec.ts` files
- Runs tests using ts-jest
- Prints test results and coverage summary
- Watches for changes (interactive mode)

**Example Output:**
```
PASS src/__tests__/utils.test.ts
  Utility Functions
    PasswordUtils
      ✓ should hash and verify passwords
      ✓ should handle multiple hashes of same password differently
    JwtUtils
      ✓ should sign and verify tokens
      ✓ should decode tokens
      ✓ should reject invalid tokens
    UuidUtils
      ✓ should generate valid UUIDs
      ✓ should validate UUIDs correctly
      ✓ should generate different UUIDs

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

### yarn test:coverage

Run tests with code coverage report.

```bash
yarn test:coverage
```

**What it does:**
- Runs all tests
- Generates coverage statistics
- Creates HTML coverage report in `coverage/`
- Shows coverage metrics

**Coverage Metrics:**
- Statements: % of code statements executed
- Branches: % of conditional branches tested
- Functions: % of functions called
- Lines: % of lines executed

**Output Files:**
- `coverage/lcov-report/index.html` - Visual coverage report
- `coverage/lcov.info` - Coverage data file

## Code Quality & Formatting

### yarn check

Check and fix code formatting, linting, and imports using Biome.

```bash
yarn check
```

**What it does:**
- Checks code formatting
- Organizes imports
- Runs linting checks
- Automatically fixes issues with `--write` flag
- Reports warnings and errors

**Fixed Issues:**
- Code style inconsistencies
- Import organization
- Formatting issues
- Type warnings

**Example Output:**
```
Checked 21 files in 69ms. Fixed 19 files.
Found 6 errors.
Found 25 warnings.
```

## Script Categories

### Quick Development Workflow

```bash
# 1. Start development
yarn dev

# 2. In another terminal, check code quality
yarn check

# 3. Run tests
yarn test
```

### Production Deployment Workflow

```bash
# 1. Install dependencies
yarn install

# 2. Format and lint code
yarn check

# 3. Run all tests
yarn test:coverage

# 4. Build for production
yarn build

# 5. Start production server
yarn start
```

### Before Committing

```bash
# 1. Format code
yarn check

# 2. Run all tests
yarn test

# 3. Build to check for errors
yarn build
```

## Environment Variables

All scripts respect the following environment variables from `.env`:

- `NODE_ENV`: Environment mode (development/production)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Token expiration time (default: 1h)

## Script Performance

### Typical Execution Times

| Script | Time |
|--------|------|
| `yarn dev` | Instant (watches) |
| `yarn build` | ~2-3 seconds |
| `yarn start` | Instant |
| `yarn test` | ~3 seconds |
| `yarn test:coverage` | ~4 seconds |
| `yarn check` | ~100ms |

## Troubleshooting

### yarn dev won't start

**Problem:** Port 3000 already in use

**Solution:**
```bash
# Change port in .env
PORT=3001 yarn dev

# Or kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Build fails with TypeScript errors

**Problem:** Code has type errors

**Solution:**
```bash
# Check errors in detail
yarn build

# Fix errors and try again
yarn build
```

### Tests fail randomly

**Problem:** Tests have timing issues or flaky conditions

**Solution:**
```bash
# Run tests with verbose output
yarn test --verbose

# Run specific test
yarn test utils.test.ts
```

### yarn check won't fix all issues

**Problem:** Some issues are warnings, not auto-fixable

**Solution:**
- Review the output
- Fix errors manually if needed
- Some warnings require code changes

## Combining Scripts

```bash
# Format, test, and build
yarn check && yarn test && yarn build

# Comprehensive check before commit
yarn check && yarn test:coverage && yarn build

# Quick dev workflow
yarn dev &  # Run in background
yarn check
yarn test
```

## Git Pre-commit Hook

Add this to `.git/hooks/pre-commit` to run checks before committing:

```bash
#!/bin/bash
set -e

echo "Running code quality checks..."
yarn check

echo "Running tests..."
yarn test

echo "Building..."
yarn build

echo "All checks passed!"
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Further Reading

- [Development Guide](./DEVELOPMENT.md)
- [Biome Configuration](./BIOME_CONFIG.md)
- [Security Best Practices](./SECURITY.md)
