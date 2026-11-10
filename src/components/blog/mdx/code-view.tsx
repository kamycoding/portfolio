import { tokenizeLine } from '@/lib/blog/tokenize'

import styles from './interactive.module.css'

type CodeViewProps = Readonly<{
  code: string
  label: string

  // The 1-based line being run; the stepper highlights it.
  current?: number | null
}>

// A short, read-only snippet for the interactive components, framed like a code block. The highlighted line also
// has a bar, and the stepper describes it in words, so colour is never the only signal.
const CodeView = ({ code, label, current }: CodeViewProps) => (
  <div className={styles.codeFrame}>
    <p className={styles.codeHeader}>{label}</p>
    {/* Focusable, so a keyboard user can scroll a long line. */}
    <pre className={styles.code} tabIndex={0} aria-label={label}>
      <code>
        {code.split('\n').map((line, index) => (
          <span key={index} className={styles.codeLine} data-current={current === index + 1 || undefined}>
            {tokenizeLine(line).map((token, position) => (
              <span key={position} className={styles[token.kind]}>
                {token.text}
              </span>
            ))}
            {line === '' && ' '}
          </span>
        ))}
      </code>
    </pre>
  </div>
)

export default CodeView
