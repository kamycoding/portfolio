// Hero terminal logic without React: command parsing and the inline ghost suggestion.

// Every command line the terminal understands, used for suggestions. Order sets the suggestion priority.
export const COMMAND_LINES = [
  'help',
  'whoami',
  'ls',
  'ls projects',
  'ls blog',
  'git log',
  'blueprint',
  'theme list',
  'theme dark',
  'theme light',
  'theme monokai',
  'theme solarized-dark',
  'lang de',
  'lang en',
  'contact',
  'pet cat',
  'sudo hire-kamyar',
  'clear'
] as const

export type ParsedCommand = Readonly<{ name: string; arg: string }>

// "  Git   LOG " -> { name: "git", arg: "log" }; names and arguments are case-insensitive.
export const parseCommand = (line: string): ParsedCommand => {
  const [name = '', ...args] = line.trim().toLowerCase().split(/\s+/)

  return { name, arg: args.join(' ') }
}

// Published posts are only known at runtime, so their command lines join the suggestions as `extra`.
export const postCommandLines = (slugs: readonly string[]) => [
  ...slugs.map(slug => `open ${slug}`),
  ...slugs.map(slug => `cat blog/${slug}`)
]

// "blog/my-post/", "my-post" or "blog/my-post/en.mdx" -> "my-post"; "blog" alone -> "" (the journal index).
export const postSlugFromArg = (arg: string) =>
  arg
    .replace(/^\.?\/+/, '')
    .replace(/\/(?:en|de)\.mdx$/, '')
    .replace(/\/+$/, '')
    .replace(/^blog(?:\/|$)/, '')

// The full line the ghost text completes to, or null. History wins over the lists, newest first.
// An empty prompt shows nothing, so the terminal stays calm until the visitor types.
export const suggest = (input: string, history: readonly string[], extra: readonly string[] = []): string | null => {
  if (!input.trim()) return null

  const prefix = input.toLowerCase()
  const fits = (line: string) => line.length > input.length && line.toLowerCase().startsWith(prefix)
  const fromHistory = [...history].reverse().find(fits)

  if (fromHistory) return input + fromHistory.slice(input.length)

  const fromList = [...COMMAND_LINES, ...extra].find(fits)

  return fromList ? input + fromList.slice(input.length) : null
}
