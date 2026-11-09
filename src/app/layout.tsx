import type { ReactNode } from 'react'

// The real root layout with <html> is app/[locale]/layout.tsx. This pass-through only exists
// because app/not-found.tsx needs a root layout.
const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => children

export default RootLayout
