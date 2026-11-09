import { Fragment } from 'react'

type BreadcrumbProps = Readonly<{
  path: readonly string[]
  file: string
  meta: string
}>

// Sticky file path under the rulers, one per section.
const Breadcrumb = ({ path, file, meta }: BreadcrumbProps) => {
  return (
    <div className='border-hair bg-bg/88 text-faint sticky top-[calc(var(--top)+var(--ruler))] z-12 h-9.5 border-b font-mono text-xs backdrop-blur-sm'>
      <div className='mx-auto flex h-full max-w-(--max) items-center justify-between gap-4 px-(--gutter)'>
        <span className='flex items-center gap-1.75 overflow-hidden whitespace-nowrap'>
          {path.map(segment => (
            <Fragment key={segment}>
              {segment}
              <span aria-hidden='true' className='opacity-60'>
                ›
              </span>
            </Fragment>
          ))}
          <b className='text-text font-medium'>{file}</b>
        </span>
        <span className='whitespace-nowrap'>{meta}</span>
      </div>
    </div>
  )
}

export default Breadcrumb
