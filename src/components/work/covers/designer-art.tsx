// Designer portfolio landing page with the portrait selected in a design tool. Ported from docs/design/prototype/art.js; classes are styled by the cover.
const DesignerArt = () => (
  <>
    <path className='ln' d='M0 40H640' />
    <path className='acs' d='M28 14c10 0 10 10 0 10s-10 10 0 10' strokeWidth='2.4' />
    <g className='tx'>
      <text x='250' y='25'>
        my story
      </text>
      <text x='320' y='25'>
        case studies
      </text>
    </g>
    <rect className='acf' x='520' y='12' width='78' height='18' rx='9' />
    <path d='M536 21h46' style={{ stroke: 'var(--panel)' }} strokeWidth='2' />
    <text className='tx acc' x='40' y='100'>
      ux/ui and product designer
    </text>
    <text className='serif' x='38' y='150'>
      Hi, I&apos;m
    </text>
    <text className='serif acc2' x='38' y='198'>
      Sogand.
    </text>
    <path className='ln' d='M40 222h170M40 236h140' />
    <rect className='acf' x='40' y='258' width='96' height='28' rx='14' />
    <path d='M58 272h48' style={{ stroke: 'var(--panel)' }} strokeWidth='2' />
    <rect className='ln' x='146' y='258' width='96' height='28' rx='14' />
    <path className='ln' d='M164 272h48' />
    <rect className='ln fl2' x='380' y='70' width='190' height='220' rx='16' />
    <g className='ln'>
      <circle cx='475' cy='150' r='34' />
      <path d='M445 140c0-30 60-30 60 0M440 156c-6 20 2 34 8 40M510 156c6 20-2 34-8 40' />
      <path d='M420 290c4-50 30-70 55-70s51 20 55 70' />
    </g>
    <g className='sel'>
      <rect x='380' y='70' width='190' height='220' fill='none' />
      <rect x='376' y='66' width='8' height='8' />
      <rect x='566' y='66' width='8' height='8' />
      <rect x='376' y='286' width='8' height='8' />
      <rect x='566' y='286' width='8' height='8' />
    </g>
    <rect className='selbadge' x='438' y='300' width='74' height='18' rx='4' />
    <text className='tx inv' x='446' y='313'>
      320 × 400
    </text>
    <g className='ln'>
      <rect x='596' y='110' width='24' height='36' rx='6' />
      <circle cx='608' cy='122' r='4' />
      <circle cx='608' cy='134' r='4' />
    </g>
    <g className='ln'>
      <path d='M352 220v-30M360 220v-46M368 220v-20' />
    </g>
    <path className='ln' d='M0 334H640' />
    <g className='ln'>
      <rect x='40' y='342' width='12' height='12' rx='3' />
      <rect x='110' y='342' width='12' height='12' rx='3' />
      <rect x='180' y='342' width='12' height='12' rx='3' />
      <rect x='250' y='342' width='12' height='12' rx='3' />
      <rect x='320' y='342' width='12' height='12' rx='3' />
      <rect x='390' y='342' width='12' height='12' rx='3' />
      <rect x='460' y='342' width='12' height='12' rx='3' />
      <rect x='530' y='342' width='12' height='12' rx='3' />
    </g>
  </>
)

export default DesignerArt
