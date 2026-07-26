# Release Process

This project uses [release-please](https://github.com/googleapis/release-please-action) to automate releases.

## How It Works

1. release-please runs on every push to `main`
2. It analyzes commits with [conventional commits](https://www.conventionalcommits.org/)
3. It automatically opens or updates a release PR with changelog
4. When you merge the release PR, it automatically creates a GitHub Release with the generated changelog and tags the version

## Conventional Commits

We follow the conventional commit format:

```
<type>(<scope>): <description>

- fix: ...  -> patches version (1.0.0 → 1.0.1)
- feat: ...  → minor version (1.0.0 → 1.1.0)
- BREAKING CHANGE: ... → major version (1.0.0 → 2.0.0)
```

Common types:

- `fix` - bug fixes
- `feat` - new features
- `docs` - documentation changes
- `chore` - build/tooling changes
- `refactor` - code refactoring
- `test` - testing changes
- `security` - security fixes

## Manual Release

If you need to release manually:

1. Update version in `package.json`
2. Update `docs/CHANGELOG.md` with changes
3. Commit and push
4. Create a git tag: `git tag v1.0.0`
5. Push tag: `git push origin v1.0.0`
6. Create GitHub Release from the tag

## Release Assets

After building, run:

```bash
npm run build:zip
```

This creates a zip file in `.output/` that can be uploaded to Chrome Web Store.

## Chrome Web Store Publishing

1. Build the extension: `npm run build:zip`
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload the zip file
4. Fill out store listing
5. Submit for review
