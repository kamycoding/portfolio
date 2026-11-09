// Join Kanban board with a card being dragged. Ported from docs/design/prototype/art.js; classes are styled by the cover.
const JoinArt = () => (
  <>
    <rect className='fl' x='0' y='0' width='104' height='360' />
    <path className='ln' d='M104 0V360' />
    <path className='acs' d='M44 22v26a10 10 0 0 1-20 0' strokeWidth='3' />
    <rect className='acf' x='46' y='14' width='8' height='8' />
    <g className='ln'>
      <rect x='12' y='84' width='80' height='20' rx='6' />
      <path d='M22 120h50M22 146h44M22 172h56' />
    </g>
    <rect className='acs' x='12' y='134' width='80' height='22' rx='6' />
    <path className='ln' d='M104 44H640' />
    <text className='tx' x='124' y='28'>
      kanban project management
    </text>
    <circle className='ln' cx='612' cy='22' r='11' />
    <text className='tx' x='604' y='26'>
      GU
    </text>
    <text className='tx big' x='124' y='78'>
      Board
    </text>
    <rect className='ln' x='430' y='62' width='110' height='24' rx='8' />
    <rect className='acf' x='552' y='62' width='70' height='24' rx='8' />
    <path d='M566 74h42' style={{ stroke: 'var(--panel)' }} strokeWidth='2' />
    <g className='tx'>
      <text x='124' y='112'>
        to do
      </text>
      <text x='252' y='112'>
        in progress
      </text>
      <text x='380' y='112'>
        await feedback
      </text>
      <text x='508' y='112'>
        done
      </text>
    </g>
    <g className='ln'>
      <path d='M124 120h112M252 120h112M380 120h112M508 120h112' />
    </g>
    <g className='ln'>
      <rect x='124' y='132' width='112' height='86' rx='9' />
      <rect x='124' y='228' width='112' height='70' rx='9' />
      <rect x='380' y='132' width='112' height='86' rx='9' />
      <rect x='508' y='132' width='112' height='86' rx='9' />
      <rect x='508' y='228' width='112' height='70' rx='9' />
    </g>
    <g>
      <rect className='acs' x='134' y='142' width='44' height='12' rx='6' />
      <rect className='acs' x='390' y='142' width='54' height='12' rx='6' />
      <rect className='acs' x='518' y='142' width='54' height='12' rx='6' />
      <rect className='ln' x='134' y='238' width='44' height='12' rx='6' />
    </g>
    <g className='ln'>
      <path d='M134 166h80M134 176h60M390 166h84M390 176h56M518 166h76M518 176h64M134 262h70M518 248h80M518 258h60' />
    </g>
    <g>
      <path className='ln' d='M134 196h60' />
      <path className='acs' d='M134 196h18' strokeWidth='3' />
      <path className='ln' d='M390 196h60' />
      <path className='acs' d='M390 196h60' strokeWidth='3' />
      <path className='ln' d='M518 196h60' />
      <path className='acs' d='M518 196h60' strokeWidth='3' />
    </g>
    <g className='ln'>
      <circle cx='216' cy='198' r='7' />
      <circle cx='470' cy='198' r='7' />
      <circle cx='462' cy='198' r='7' className='ln fl2' />
      <circle cx='598' cy='198' r='7' />
    </g>
    <rect className='ln dash' x='252' y='132' width='112' height='86' rx='9' />
    <g transform='rotate(-5 316 210)'>
      <rect className='ln fl2 lift' x='262' y='160' width='112' height='86' rx='9' />
      <rect className='acs' x='272' y='170' width='44' height='12' rx='6' />
      <path className='ln' d='M272 194h80M272 204h58' />
      <path className='ln' d='M272 224h60' />
      <path className='acs' d='M272 224h30' strokeWidth='3' />
      <circle className='ln' cx='354' cy='226' r='7' />
    </g>
    <path className='cursor' d='M352 238l0 22 6-6 5 10 4-2-5-10 8-1z' />
    <text className='tx dim' x='252' y='312'>
      drag and drop
    </text>
    <path className='ln dash' d='M296 214 C 296 250, 300 280, 270 300' />
  </>
)

export default JoinArt
