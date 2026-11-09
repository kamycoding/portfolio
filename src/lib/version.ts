import pkg from '../../package.json'

// The release version from package.json, so the top bar and the intro update with every version bump.
// Read on the server only; components get plain strings as props, package.json never reaches the browser.
export const APP_VERSION = pkg.version

// "2.1.0" -> "v2.1"; prerelease and build parts are dropped ("2.0.0-alpha.0" -> "v2.0").
export const versionLabel = (version: string) => {
  const [major, minor] = version.split(/[.+-]/)

  return `v${major}.${minor}`
}

type BuildEnv = Readonly<Record<string, string | undefined>>

// Facts for the footer's EOF line, baked into the static pages at build time.
// Netlify sets COMMIT_REF during builds; local builds have none and show "dev". Server only.
export const buildInfo = (env: BuildEnv = process.env, now = new Date()) => ({
  commit: env.COMMIT_REF?.trim().slice(0, 7) || 'dev',
  version: versionLabel(APP_VERSION),
  date: now.toISOString().slice(0, 10)
})
