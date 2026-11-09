# Contributing

This is my personal portfolio, so I build it myself. Bug reports and ideas are still very welcome.

## Issues

- Use the **bug report** or **feature request** form when you open an issue.
- Security problems never go into a public issue. See [SECURITY.md](SECURITY.md).

## Pull requests

Small fixes (typos, broken links, accessibility) are welcome. For anything bigger, please open an issue first so we can talk about it.

1. Use Node 24 (`.nvmrc`) and pnpm (`corepack enable pnpm`), then run `pnpm install`.
2. Create a branch from `main`.
3. Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`). A git hook checks the message and formats staged files.
4. Make sure `pnpm lint`, `pnpm check-types`, `pnpm test` and `pnpm build` pass. CI runs the same checks.
5. Fill in the pull request template, including both languages, both themes and reduced motion.

## Code of conduct

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your code contributions are licensed under the MIT part of the [LICENSE](LICENSE).
