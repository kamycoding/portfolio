type NotFoundViewProps = Readonly<{
  copy: {
    code: string
    heading: string
    description: string
    navigationAria: string
    home: string
    projects: string
  }
  homeHref: string
}>

// Shared by the localized 404 (inside the shell) and the root 404. The caller provides <main>.
const NotFoundView = ({ copy, homeHref }: NotFoundViewProps) => {
  return (
    <div className='mx-auto flex max-w-(--max) flex-col justify-center px-(--gutter) py-24'>
      <p className='text-com mb-4.5 font-mono text-[13px]'>{`// ${copy.code}`}</p>
      <h1 className='text-[clamp(32px,3.6vw,54px)] leading-[1.06] font-semibold tracking-[-0.035em]'>{copy.heading}</h1>
      <p className='text-muted mt-4.5 max-w-[56ch] text-[16.5px] leading-[1.65]'>{copy.description}</p>
      <nav aria-label={copy.navigationAria} className='mt-9 flex flex-wrap gap-3'>
        <a
          href={homeHref}
          className='bg-text text-bg border-text inline-flex h-11.5 items-center rounded-[10px] border px-5 text-[15px] font-medium'
        >
          {copy.home}
        </a>
        <a
          href={`${homeHref}#work`}
          className='border-hair-2 hover:border-hair-3 inline-flex h-11.5 items-center rounded-[10px] border px-5 text-[15px] font-medium'
        >
          {copy.projects}
        </a>
      </nav>
    </div>
  )
}

export default NotFoundView
