// Runs on staged files only. Markdown is left alone so hand-written docs keep their formatting.
const config = {
  '*.{js,mjs,cjs,ts,mts,tsx}': ['eslint --fix --no-warn-ignored', 'prettier --write'],
  '*.{css,json,yml,yaml}': 'prettier --write'
}

export default config
