# Check Release for Tag

This GitHub Action checks whether a Git tag pushed to the repository has a corresponding GitHub Release.

## Purpose

- Ensure that every pushed tag is associated with a published release.
- Automate release validation as part of a CI/CD pipeline.
- Improve version management and traceability.

## Inputs

| Name | Description | Required |
|------|-------------|----------|
| `tag` | The Git tag to check (e.g., `refs/tags/v1.0.0`) | Yes |

## Outputs

This action does not produce output variables. It exits with a success status if the release exists, or a failure status if not.

## Required Permissions

This action requires the `GITHUB_TOKEN` secret, which is automatically provided by GitHub Actions, to access the repository’s releases.

# Build Instruction

cd action
npm install
npx ncc build index.js -o dist

## Example Usage

```yaml
name: Check Release for Tag

on:
  push:
    tags:
      - '*'

jobs:
  check-release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Check Release for Tag
        uses: ./action
        with:
          tag: ${{ github.ref }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}