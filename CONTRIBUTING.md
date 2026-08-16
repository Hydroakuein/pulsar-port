# Contributing to Pulsar Port

## Branches

Create short-lived branches from `main` using one of these prefixes:

- `feat/` for product work
- `fix/` for bug fixes
- `chore/` for tooling and maintenance
- `docs/` for documentation-only changes

Use lowercase kebab-case, for example `feat/art-asset-browser`.

## Commits

Use Conventional Commits:

```text
<type>(optional-scope): <imperative summary>
```

Examples:

```text
feat(api): add health endpoint
fix(desktop): preserve rounded corners when maximized
docs: document local API setup
```

Supported types are `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`,
`chore`, `perf` and `revert`.

## Local checks

Run the complete JavaScript and TypeScript quality gate before opening a pull request:

```bash
npm run check
```

Check the Tauri Rust crate separately:

```bash
npm run check:rust
```

Check the Cloudflare Worker:

```bash
npm run check:worker
```

Enable the repository pre-commit hook once after cloning:

```bash
npm run hooks:install
```

Pull requests must pass both CI jobs. Never commit `.env`, access tokens, or other credentials.
