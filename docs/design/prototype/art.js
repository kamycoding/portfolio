"use strict";
// Line drawings of each project, in the same hand as the rest of the site.
// Colors come from CSS: .ln (muted line), .fl (soft fill), .ac (project accent), .tx (mono label).
const ART = {};

ART.heldio = `
<rect class="fl" x="0" y="0" width="118" height="360"/><path class="ln" d="M118 0V360"/>
<rect class="acf" x="20" y="20" width="22" height="22" rx="6"/><path class="ln" d="M52 31h36"/>
<g class="ln"><rect x="14" y="62" width="90" height="22" rx="6" class="acs"/><path d="M26 73h8M42 73h40"/><path d="M26 103h8M42 103h34M26 131h8M42 131h44M26 159h8M42 159h30"/></g>
<circle class="ln" cx="30" cy="326" r="10"/><path class="ln" d="M48 322h40M48 331h26"/>
<text class="tx big" x="142" y="40">Good afternoon, Alex</text>
<path class="ln" d="M142 52h120"/>
<rect class="ln" x="142" y="70" width="270" height="112" rx="10"/>
<text class="tx" x="158" y="92">path</text><text class="tx dim" x="196" y="92">german job interview</text>
<path class="ln dash" d="M170 140 C 210 108, 240 108, 266 128 S 330 160, 390 120"/>
<g class="node"><circle class="acf" cx="170" cy="140" r="6"/><text class="tx" x="158" y="164">goal</text></g>
<g class="node"><circle class="acf" cx="238" cy="114" r="6"/><text class="tx" x="226" y="104">plan</text></g>
<g class="node"><circle class="acs fl2" cx="310" cy="146" r="6"/><text class="tx" x="290" y="170">practice</text></g>
<g class="node"><circle class="ln fl2" cx="390" cy="120" r="6"/><text class="tx dim" x="360" y="110">feedback</text></g>
<rect class="ln" x="428" y="70" width="190" height="52" rx="10"/><circle class="ln" cx="450" cy="96" r="9"/><path class="ln" d="M468 90h90M468 102h60"/>
<rect class="ln" x="428" y="130" width="190" height="52" rx="10"/><circle class="ln" cx="450" cy="156" r="9"/><path class="ln" d="M468 150h80M468 162h70"/>
<text class="tx" x="142" y="214">learning activity</text>
<g id="heldio-heat"></g>
<rect class="ln" x="428" y="200" width="190" height="140" rx="10"/>
<g class="ln"><path d="M444 222h60M444 250h70M444 278h54M444 306h64"/></g>
<g><rect class="acs" x="560" y="214" width="42" height="14" rx="7"/><rect class="acs" x="560" y="242" width="42" height="14" rx="7"/><rect class="ln" x="560" y="270" width="42" height="14" rx="7"/><rect class="acs" x="560" y="298" width="42" height="14" rx="7"/></g>
`;

ART.join = `
<rect class="fl" x="0" y="0" width="104" height="360"/><path class="ln" d="M104 0V360"/>
<path class="acs" d="M44 22v26a10 10 0 0 1-20 0" stroke-width="3"/><rect class="acf" x="46" y="14" width="8" height="8"/>
<g class="ln"><rect x="12" y="84" width="80" height="20" rx="6"/><path d="M22 120h50M22 146h44M22 172h56"/></g>
<rect class="acs" x="12" y="134" width="80" height="22" rx="6"/>
<path class="ln" d="M104 44H640"/><text class="tx" x="124" y="28">kanban project management</text><circle class="ln" cx="612" cy="22" r="11"/><text class="tx" x="604" y="26">GU</text>
<text class="tx big" x="124" y="78">Board</text><rect class="ln" x="430" y="62" width="110" height="24" rx="8"/><rect class="acf" x="552" y="62" width="70" height="24" rx="8"/><path d="M566 74h42" stroke="var(--panel)" stroke-width="2"/>
<g class="tx"><text x="124" y="112">to do</text><text x="252" y="112">in progress</text><text x="380" y="112">await feedback</text><text x="508" y="112">done</text></g>
<g class="ln"><path d="M124 120h112M252 120h112M380 120h112M508 120h112"/></g>
<g class="ln">
  <rect x="124" y="132" width="112" height="86" rx="9"/><rect x="124" y="228" width="112" height="70" rx="9"/>
  <rect x="380" y="132" width="112" height="86" rx="9"/>
  <rect x="508" y="132" width="112" height="86" rx="9"/><rect x="508" y="228" width="112" height="70" rx="9"/>
</g>
<g><rect class="acs" x="134" y="142" width="44" height="12" rx="6"/><rect class="acs" x="390" y="142" width="54" height="12" rx="6"/><rect class="acs" x="518" y="142" width="54" height="12" rx="6"/><rect class="ln" x="134" y="238" width="44" height="12" rx="6"/></g>
<g class="ln"><path d="M134 166h80M134 176h60M390 166h84M390 176h56M518 166h76M518 176h64M134 262h70M518 248h80M518 258h60"/></g>
<g><path class="ln" d="M134 196h60"/><path class="acs" d="M134 196h18" stroke-width="3"/><path class="ln" d="M390 196h60"/><path class="acs" d="M390 196h60" stroke-width="3"/><path class="ln" d="M518 196h60"/><path class="acs" d="M518 196h60" stroke-width="3"/></g>
<g class="ln"><circle cx="216" cy="198" r="7"/><circle cx="470" cy="198" r="7"/><circle cx="462" cy="198" r="7" class="ln fl2"/><circle cx="598" cy="198" r="7"/></g>
<rect class="ln dash" x="252" y="132" width="112" height="86" rx="9"/>
<g transform="rotate(-5 316 210)"><rect class="ln fl2 lift" x="262" y="160" width="112" height="86" rx="9"/><rect class="acs" x="272" y="170" width="44" height="12" rx="6"/><path class="ln" d="M272 194h80M272 204h58"/><path class="ln" d="M272 224h60"/><path class="acs" d="M272 224h30" stroke-width="3"/><circle class="ln" cx="354" cy="226" r="7"/></g>
<path class="cursor" d="M352 238l0 22 6-6 5 10 4-2-5-10 8-1z"/>
<text class="tx dim" x="252" y="312">drag and drop</text><path class="ln dash" d="M296 214 C 296 250, 300 280, 270 300" />
`;

ART.designer = `
<path class="ln" d="M0 40H640"/><path class="acs" d="M28 14c10 0 10 10 0 10s-10 10 0 10" stroke-width="2.4"/>
<g class="tx"><text x="250" y="25">my story</text><text x="320" y="25">case studies</text></g>
<rect class="acf" x="520" y="12" width="78" height="18" rx="9"/><path d="M536 21h46" stroke="var(--panel)" stroke-width="2"/>
<text class="tx acc" x="40" y="100">ux/ui and product designer</text>
<text class="serif" x="38" y="150">Hi, I'm</text><text class="serif acc2" x="38" y="198">Sogand.</text>
<path class="ln" d="M40 222h170M40 236h140"/>
<rect class="acf" x="40" y="258" width="96" height="28" rx="14"/><path d="M58 272h48" stroke="var(--panel)" stroke-width="2"/>
<rect class="ln" x="146" y="258" width="96" height="28" rx="14"/><path class="ln" d="M164 272h48"/>
<rect class="ln fl2" x="380" y="70" width="190" height="220" rx="16"/>
<g class="ln"><circle cx="475" cy="150" r="34"/><path d="M445 140c0-30 60-30 60 0M440 156c-6 20 2 34 8 40M510 156c6 20-2 34-8 40"/><path d="M420 290c4-50 30-70 55-70s51 20 55 70"/></g>
<g class="sel"><rect x="380" y="70" width="190" height="220" fill="none"/><rect x="376" y="66" width="8" height="8"/><rect x="566" y="66" width="8" height="8"/><rect x="376" y="286" width="8" height="8"/><rect x="566" y="286" width="8" height="8"/></g>
<rect class="selbadge" x="438" y="300" width="74" height="18" rx="4"/><text class="tx inv" x="446" y="313">320 × 400</text>
<g class="ln"><rect x="596" y="110" width="24" height="36" rx="6"/><circle cx="608" cy="122" r="4"/><circle cx="608" cy="134" r="4"/></g>
<g class="ln"><path d="M352 220v-30M360 220v-46M368 220v-20"/></g>
<path class="ln" d="M0 334H640"/>
<g class="ln"><rect x="40" y="342" width="12" height="12" rx="3"/><rect x="110" y="342" width="12" height="12" rx="3"/><rect x="180" y="342" width="12" height="12" rx="3"/><rect x="250" y="342" width="12" height="12" rx="3"/><rect x="320" y="342" width="12" height="12" rx="3"/><rect x="390" y="342" width="12" height="12" rx="3"/><rect x="460" y="342" width="12" height="12" rx="3"/><rect x="530" y="342" width="12" height="12" rx="3"/></g>
`;

ART.pollo = `
<circle class="ln" cx="560" cy="70" r="26"/>
<path class="ln" d="M0 262 L60 262 L74 200 L130 200 L144 262 M300 262 L318 186 L392 186 L410 262 M470 262 L480 226 L540 226 L552 262"/>
<g class="ln"><path d="M36 26c-6-8-18-2-12 8l12 10 12-10c6-10-6-16-12-8z"/><path d="M68 26c-6-8-18-2-12 8l12 10 12-10c6-10-6-16-12-8z"/><path d="M100 26c-6-8-18-2-12 8l12 10 12-10c6-10-6-16-12-8z" class="acs"/></g>
<circle class="acs" cx="566" cy="30" r="10"/><text class="tx big2" x="584" y="36">× 37</text>
<path class="ln" d="M0 290H640"/><g class="ln dash2"><path d="M0 306H640M0 324H640M0 342H640"/></g>
<g class="ln"><path d="M216 290v-62a12 12 0 0 1 24 0v62M216 252h-14a8 8 0 0 1-8-8v-18M240 240h12a8 8 0 0 0 8-8v-16"/><path d="M590 290v-40a10 10 0 0 1 20 0v40M590 262h-10v-14"/></g>
<g><circle class="acs" cx="420" cy="140" r="11"/><circle class="acs" cx="452" cy="132" r="11"/><circle class="acs" cx="484" cy="140" r="11"/></g>
<path class="ln dash" d="M96 286 C 140 150, 230 120, 300 170"/>
<g class="ln" opacity=".5"><circle cx="146" cy="196" r="3"/><circle cx="190" cy="154" r="3"/><circle cx="244" cy="146" r="3"/></g>
<g class="hero">
  <ellipse class="ln fl2" cx="96" cy="262" rx="22" ry="20"/>
  <circle class="ln fl2" cx="112" cy="232" r="12"/><path class="acs" d="M88 226c4-12 40-12 46 0z" stroke-width="2"/><path class="ln" d="M80 228h62"/>
  <path class="ln" d="M122 234l8 3-8 3"/><circle class="ln" cx="114" cy="230" r="1.5"/>
  <path class="ln" d="M86 280l-4 10M106 280l4 10"/>
</g>
<rect class="hit" x="70" y="214" width="56" height="78"/>
<text class="tx acc" x="70" y="208">hitbox</text>
<g class="ln"><ellipse cx="350" cy="276" rx="16" ry="13" class="ln fl2"/><circle cx="362" cy="258" r="8" class="ln fl2"/><path d="M342 288l-3 4M356 288l3 4"/></g>
<rect class="hit" x="332" y="246" width="40" height="46"/>
<text class="tx dim" x="24" y="356">x 96  y 262  vx 4.2</text>
`;

// Heldio heatmap cells, generated so the pattern looks like a real week
(function () {
  const lv = [3, 4, 4, 2, 4, 3, 4, 2, 0, 3, 2, 3, 4, 1, 1, 2, 3, 4, 3, 2, 0, 3, 0, 4, 2, 4, 3, 0, 4, 1, 0, 2, 0, 0, 1];
  let g = "";
  lv.forEach((l, i) => {
    const x = 142 + (i % 7) * 34, y = 228 + Math.floor(i / 7) * 22;
    g += l ? `<rect class="heat h${l}" x="${x}" y="${y}" width="26" height="16" rx="4"/>` : `<rect class="ln" x="${x}" y="${y}" width="26" height="16" rx="4"/>`;
  });
  ART.heldio = ART.heldio.replace('<g id="heldio-heat"></g>', g);
})();
