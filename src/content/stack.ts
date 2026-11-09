// Stack groups from the approved prototype (docs/design/prototype/app.js), shown as the stack.json tree.
export const STACK = {
  frontend: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Angular', 'RxJS', 'Tailwind CSS', 'Sass', 'HTML', 'CSS'],
  backend: ['Node.js', 'NestJS', 'PostgreSQL', 'Supabase'],
  learning: ['Python', 'Django'],
  tools: ['Git', 'GitHub', 'Figma', 'VS Code']
} as const

// Ticker order from the prototype.
export const TICKER = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'Angular',
  'Tailwind CSS',
  'Supabase',
  'Python',
  'Django',
  'Figma',
  'Git'
] as const

// Icon file in public/stack/ per technology.
export const ICON: Readonly<Record<string, string>> = {
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  RxJS: 'rxjs',
  Sass: 'sass',
  SCSS: 'sass',
  HTML: 'html5',
  CSS: 'css3',
  React: 'react',
  'Next.js': 'nextjs',
  'Node.js': 'nodejs',
  NestJS: 'nestjs',
  PostgreSQL: 'postgresql',
  Angular: 'angular',
  'Tailwind CSS': 'tailwindcss',
  Supabase: 'supabase',
  Python: 'python',
  Django: 'django',
  Figma: 'figma',
  Git: 'git',
  GitHub: 'github',
  'VS Code': 'vscode'
}

// Black logos that need inverting on the dark theme.
export const INVERT_ON_DARK = new Set(['nextjs', 'github'])
