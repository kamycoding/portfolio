// The kamycoding logo from public/favicon.svg: a blue "{" and a yellow "K". The brand colours are fixed on purpose and
// stay the same in every theme. Plain markup without hooks, so the OG image frame (Satori) renders it too.
export const LOGO_RATIO = 36 / 40

type LogoProps = Readonly<{
  /** Height in pixels; the width follows from the logo's proportions. */
  height?: number
  className?: string

  /** An accessible name. Leave it out when a visible "kamycoding" label sits next to the logo: it is hidden then. */
  label?: string
}>

const Logo = ({ height = 24, className, label }: LogoProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 36 40'
    width={Math.round(height * LOGO_RATIO * 100) / 100}
    height={height}
    fill='none'
    className={className}
    {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
  >
    <path
      d='M28.125 1.32422H35.709C35.9643 1.32422 36.092 1.63134 35.9115 1.8108L17.8225 19.7996C17.7106 19.9109 17.7106 20.0915 17.8225 20.2025L35.9115 38.1913C36.092 38.3707 35.9643 38.6778 35.709 38.6778H27.706C27.63 38.6778 27.5569 38.6477 27.5034 38.5945L9.11524 20.3082C9.0029 20.1964 9.00326 20.0152 9.11631 19.9039L27.9235 1.4065C27.977 1.35365 28.0494 1.32422 28.125 1.32422Z'
      fill='#F7C518'
    />
    <path
      d='M8.23977 15.052C8.23977 17.998 7.36034 19.4248 4.99985 20.0234C7.36034 20.5756 8.23977 22.0027 8.23977 24.9484V32.4974C8.23977 34.7991 9.35029 35.7655 12.6366 35.7655V40.0004H10.6463C5.46239 40.0004 3.42536 38.3892 3.42536 34.1086V24.6264C3.42536 22.8773 2.82338 22.1868 1.43505 22.1868C0.642634 22.1868 0 21.5477 0 20.7597V19.2411C0 18.453 0.642634 17.814 1.43505 17.814C2.82338 17.814 3.42536 17.1235 3.42536 15.3743V5.84566C3.42572 1.61116 5.46239 0 10.6466 0H12.6369V4.23485C9.35065 4.23485 8.24013 5.20162 8.24013 7.50293V15.052H8.23977Z'
      fill='#3355FF'
    />
  </svg>
)

export default Logo
