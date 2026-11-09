// El Pollo Loco level with Pepe, an enemy and their hitboxes. Ported from docs/design/prototype/art.js; classes are styled by the cover.
const PolloArt = () => (
  <>
    <circle className='ln' cx='560' cy='70' r='26' />
    <path
      className='ln'
      d='M0 262 L60 262 L74 200 L130 200 L144 262 M300 262 L318 186 L392 186 L410 262 M470 262 L480 226 L540 226 L552 262'
    />
    <g className='ln'>
      <path d='M36 26c-6-8-18-2-12 8l12 10 12-10c6-10-6-16-12-8z' />
      <path d='M68 26c-6-8-18-2-12 8l12 10 12-10c6-10-6-16-12-8z' />
      <path d='M100 26c-6-8-18-2-12 8l12 10 12-10c6-10-6-16-12-8z' className='acs' />
    </g>
    <circle className='acs' cx='566' cy='30' r='10' />
    <text className='tx big2' x='584' y='36'>
      × 37
    </text>
    <path className='ln' d='M0 290H640' />
    <g className='ln dash2'>
      <path d='M0 306H640M0 324H640M0 342H640' />
    </g>
    <g className='ln'>
      <path d='M216 290v-62a12 12 0 0 1 24 0v62M216 252h-14a8 8 0 0 1-8-8v-18M240 240h12a8 8 0 0 0 8-8v-16' />
      <path d='M590 290v-40a10 10 0 0 1 20 0v40M590 262h-10v-14' />
    </g>
    <g>
      <circle className='acs' cx='420' cy='140' r='11' />
      <circle className='acs' cx='452' cy='132' r='11' />
      <circle className='acs' cx='484' cy='140' r='11' />
    </g>
    <path className='ln dash' d='M96 286 C 140 150, 230 120, 300 170' />
    <g className='ln' opacity='.5'>
      <circle cx='146' cy='196' r='3' />
      <circle cx='190' cy='154' r='3' />
      <circle cx='244' cy='146' r='3' />
    </g>
    <g className='hero'>
      <ellipse className='ln fl2' cx='96' cy='262' rx='22' ry='20' />
      <circle className='ln fl2' cx='112' cy='232' r='12' />
      <path className='acs' d='M88 226c4-12 40-12 46 0z' strokeWidth='2' />
      <path className='ln' d='M80 228h62' />
      <path className='ln' d='M122 234l8 3-8 3' />
      <circle className='ln' cx='114' cy='230' r='1.5' />
      <path className='ln' d='M86 280l-4 10M106 280l4 10' />
    </g>
    <rect className='hit' x='70' y='214' width='56' height='78' />
    <text className='tx acc' x='70' y='208'>
      hitbox
    </text>
    <g className='ln'>
      <ellipse cx='350' cy='276' rx='16' ry='13' className='ln fl2' />
      <circle cx='362' cy='258' r='8' className='ln fl2' />
      <path d='M342 288l-3 4M356 288l3 4' />
    </g>
    <rect className='hit' x='332' y='246' width='40' height='46' />
    <text className='tx dim' x='24' y='356'>
      x 96 y 262 vx 4.2
    </text>
  </>
)

export default PolloArt
