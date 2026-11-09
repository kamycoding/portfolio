// Heldio dashboard: learning path, activity heatmap and lessons. Ported from docs/design/prototype/art.js; classes are styled by the cover.
// Heatmap levels from the prototype, so the pattern looks like a real week of practice.
const LEVELS = [3, 4, 4, 2, 4, 3, 4, 2, 0, 3, 2, 3, 4, 1, 1, 2, 3, 4, 3, 2, 0, 3, 0, 4, 2, 4, 3, 0, 4, 1, 0, 2, 0, 0, 1]

const HEAT = LEVELS.map((level, index) => {
  const x = 142 + (index % 7) * 34
  const y = 228 + Math.floor(index / 7) * 22

  return <rect key={index} className={level ? `heat h${level}` : 'ln'} x={x} y={y} width='26' height='16' rx='4' />
})

const HeldioArt = () => (
  <>
    <rect className='fl' x='0' y='0' width='118' height='360' />
    <path className='ln' d='M118 0V360' />
    <rect className='acf' x='20' y='20' width='22' height='22' rx='6' />
    <path className='ln' d='M52 31h36' />
    <g className='ln'>
      <rect x='14' y='62' width='90' height='22' rx='6' className='acs' />
      <path d='M26 73h8M42 73h40' />
      <path d='M26 103h8M42 103h34M26 131h8M42 131h44M26 159h8M42 159h30' />
    </g>
    <circle className='ln' cx='30' cy='326' r='10' />
    <path className='ln' d='M48 322h40M48 331h26' />
    <text className='tx big' x='142' y='40'>
      Good afternoon, Alex
    </text>
    <path className='ln' d='M142 52h120' />
    <rect className='ln' x='142' y='70' width='270' height='112' rx='10' />
    <text className='tx' x='158' y='92'>
      path
    </text>
    <text className='tx dim' x='196' y='92'>
      german job interview
    </text>
    <path className='ln dash' d='M170 140 C 210 108, 240 108, 266 128 S 330 160, 390 120' />
    <g className='node'>
      <circle className='acf' cx='170' cy='140' r='6' />
      <text className='tx' x='158' y='164'>
        goal
      </text>
    </g>
    <g className='node'>
      <circle className='acf' cx='238' cy='114' r='6' />
      <text className='tx' x='226' y='104'>
        plan
      </text>
    </g>
    <g className='node'>
      <circle className='acs fl2' cx='310' cy='146' r='6' />
      <text className='tx' x='290' y='170'>
        practice
      </text>
    </g>
    <g className='node'>
      <circle className='ln fl2' cx='390' cy='120' r='6' />
      <text className='tx dim' x='360' y='110'>
        feedback
      </text>
    </g>
    <rect className='ln' x='428' y='70' width='190' height='52' rx='10' />
    <circle className='ln' cx='450' cy='96' r='9' />
    <path className='ln' d='M468 90h90M468 102h60' />
    <rect className='ln' x='428' y='130' width='190' height='52' rx='10' />
    <circle className='ln' cx='450' cy='156' r='9' />
    <path className='ln' d='M468 150h80M468 162h70' />
    <text className='tx' x='142' y='214'>
      learning activity
    </text>
    {HEAT}
    <rect className='ln' x='428' y='200' width='190' height='140' rx='10' />
    <g className='ln'>
      <path d='M444 222h60M444 250h70M444 278h54M444 306h64' />
    </g>
    <g>
      <rect className='acs' x='560' y='214' width='42' height='14' rx='7' />
      <rect className='acs' x='560' y='242' width='42' height='14' rx='7' />
      <rect className='ln' x='560' y='270' width='42' height='14' rx='7' />
      <rect className='acs' x='560' y='298' width='42' height='14' rx='7' />
    </g>
  </>
)

export default HeldioArt
