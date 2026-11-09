// Stack groups from the approved prototype (docs/design/prototype/app.js), shown as folders in the stack explorer.
export const STACK = {
  frontend: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Angular', 'RxJS', 'Tailwind CSS', 'Sass', 'HTML', 'CSS'],
  backend: ['Node.js', 'NestJS', 'PostgreSQL', 'Supabase'],
  learning: ['Python', 'Django'],
  tools: ['Git', 'GitHub', 'Figma', 'VS Code']
} as const

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

// File name per technology in the stack explorer. Flavor only: the real name stays visible and in the accessible name.
export const FILE: Readonly<Record<(typeof STACK)[keyof typeof STACK][number], string>> = {
  TypeScript: 'typescript.ts',
  JavaScript: 'script.js',
  React: 'react.tsx',
  'Next.js': 'next.config.ts',
  Angular: 'app.component.ts',
  RxJS: 'stream$.ts',
  'Tailwind CSS': 'tailwind.css',
  Sass: 'styles.scss',
  HTML: 'index.html',
  CSS: 'style.css',
  'Node.js': 'server.js',
  NestJS: 'app.module.ts',
  PostgreSQL: 'schema.sql',
  Supabase: 'supabase.ts',
  Python: 'main.py',
  Django: 'manage.py',
  Git: '.gitignore',
  GitHub: '.github/',
  Figma: 'design.fig',
  'VS Code': '.vscode/'
}

// Black logos that need inverting on the dark theme.
export const INVERT_ON_DARK = new Set(['nextjs', 'github'])
