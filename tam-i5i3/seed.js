/* Tam — revision bank seed (practice engine).
   Each entry is one problem. variant 0 = the original miss from his test; 1, 2, ... = variations.
   Fields: id (unique forever), topic, variant, type (qc | mc | ma | ne), stem, qa/qb (qc only),
           choices (mc/ma), answer (index, array of indices, or string for ne), given (what he put on the test),
           source, explain, trap, figure (optional inline SVG), frac:true (ne with a fraction box).
   Add new problems at the END. Never reuse or edit an id once it has shipped. */

var FIG_RIBBON = '<svg class="fig" width="300" height="150" viewBox="0 0 300 150" fill="none" stroke="#222" stroke-width="1.6" font-family="Times New Roman" font-style="italic" font-size="15">'
 +'<line x1="50" y1="35" x2="270" y2="35"/><line x1="50" y1="115" x2="270" y2="115"/>'
 +'<ellipse cx="50" cy="75" rx="16" ry="40"/>'
 +'<path d="M175 35 A16 40 0 0 0 175 115" stroke-dasharray="4 3"/><path d="M175 35 A16 40 0 0 1 175 115"/>'
 +'<path d="M205 35 A16 40 0 0 0 205 115" stroke-dasharray="4 3"/><path d="M205 35 A16 40 0 0 1 205 115"/>'
 +'<path d="M175 35 L205 35 A16 40 0 0 1 205 115 L175 115 A16 40 0 0 0 175 35 Z" fill="#d9cdb8" fill-opacity=".7" stroke="none"/>'
 +'<line x1="50" y1="75" x2="50" y2="36" stroke-width="1.2"/><text x="54" y="60" stroke="none" fill="#222">n</text>'
 +'<line x1="175" y1="22" x2="205" y2="22" stroke-width="1.2"/><line x1="175" y1="18" x2="175" y2="26" stroke-width="1.2"/><line x1="205" y1="18" x2="205" y2="26" stroke-width="1.2"/><text x="186" y="14" stroke="none" fill="#222">x</text>'
 +'</svg>';

window.RBANK_SEED = [
 /* ---- Topic 1: Cylinder surface vs. base area (QC) ---- */
 { id:'ribbon-area-0', topic:'Lateral area vs. base area', variant:0, type:'qc', figure:FIG_RIBBON,
   stem:'A rectangular ribbon of width $x$ is wrapped around the circumference of a right circular cylinder of radius $n$, encircling the cylinder without overlap as shown in the figure above. The area of the ribbon is equal to the area of the base of the cylinder.',
   qa:'$x$', qb:'$n$', answer:1, given:0, source:'Practice test, Q4',
   explain:'Unwrap the ribbon: it is a rectangle whose length is the circumference, $2\\pi n$, and whose width is $x$, so its area is $2\\pi n \\cdot x$. The base is a circle of area $\\pi n^2$. Set them equal: $2\\pi n x = \\pi n^2$. Divide both sides by $\\pi n$ (allowed since $n>0$): $2x = n$, so $x = \\dfrac{n}{2}$. That is less than $n$, so Quantity B is greater.',
   trap:'The slip was writing $2xn = \\pi n^2$ &mdash; the $\\pi$ went missing from the ribbon&rsquo;s area. Then $x = \\frac{\\pi}{2}n \\approx 1.57n$, which makes A look right. The ribbon&rsquo;s length is a <em>circumference</em>, and circumference always carries a $\\pi$: $2\\pi n$, not $2n$. Write the formula before you plug anything in.' },
 { id:'ribbon-area-1', topic:'Lateral area vs. base area', variant:1, type:'qc',
   stem:'A strip of width $w$ is wrapped once around a right circular cylinder of radius $r$, without overlap. The area of the strip is twice the area of the cylinder&rsquo;s base.',
   qa:'$w$', qb:'$r$', answer:2,
   explain:'Strip area $= 2\\pi r \\cdot w$. Twice the base area $= 2\\pi r^2$. Setting them equal gives $2\\pi r w = 2\\pi r^2$, so $w = r$. The quantities are equal.',
   trap:'Same structure as the original. If you drop the $\\pi$ from the circumference you get $w = \\pi r$ and choose A. Circumference $= 2\\pi r$, every time.' },

 /* ---- Topic 2: Percent change compared to percent change ---- */
 { id:'pct-compare-0', topic:'Percent greater than a percent', variant:0, type:'mc',
   stem:'At Megalomania Industries, factory workers were paid \\$20 per hour in 1990 and \\$10 per hour in 2000. The CEO of Megalomania Industries was paid \\$5 million in 1990 and \\$50 million in 2000. The percent increase in the pay of Megalomania&rsquo;s CEO from 1990 to 2000 was what percent greater than the percent decrease in the hourly pay of Megalomania&rsquo;s factory workers over the same period?',
   choices:['850%','900%','950%','1,700%','1,900%'], answer:3, given:4, source:'Practice test, Q10',
   explain:'Two percent changes first. CEO: from 5 to 50 is an increase of 45 on a base of 5, so $\\dfrac{45}{5} = 900\\%$. Workers: from 20 to 10 is a decrease of 10 on a base of 20, so $50\\%$. Now the question asks how much greater $900$ is than $50$, <em>as a percent of 50</em>: $\\dfrac{900 - 50}{50} = \\dfrac{850}{50} = 17 = 1{,}700\\%$.',
   trap:'This question stacks two percent calculations, and the second one is where people slip. &ldquo;$900$ is what percent <em>greater than</em> $50$&rdquo; means $\\frac{900-50}{50}$, not $\\frac{900}{50}$ ($=1{,}800\\%$, &ldquo;percent <em>of</em>&rdquo;) and not $\\frac{950}{50}$ ($=1{,}900\\%$, choice E). Whenever you see &ldquo;percent greater than,&rdquo; subtract first, then divide by the thing you&rsquo;re comparing to.' },
 { id:'pct-compare-1', topic:'Percent greater than a percent', variant:1, type:'mc',
   stem:'The price of stock A rose from \\$40 to \\$60 over a year. In the same year the price of stock B fell from \\$80 to \\$20. The percent decrease in the price of stock B was what percent greater than the percent increase in the price of stock A?',
   choices:['25%','50%','75%','125%','150%'], answer:1,
   explain:'Stock A: $\\dfrac{60-40}{40} = 50\\%$ increase. Stock B: $\\dfrac{80-20}{80} = 75\\%$ decrease. Then $75$ is $\\dfrac{75-50}{50} = 50\\%$ greater than $50$.',
   trap:'$\\frac{75}{50} = 150\\%$ (choice E) is &ldquo;percent of,&rdquo; not &ldquo;percent greater than.&rdquo; Subtract before you divide.' },

 /* ---- Topic 3: Average with an inequality ---- */
 { id:'avg-bound-0', topic:'Average inside a range', variant:0, type:'mc',
   stem:'If the average (arithmetic mean) of 6, 8, 10, and $z$ is between 6 and 12, what is the greatest possible integer value of $z$?',
   choices:['8','11','23','28','44'], answer:2, given:2, source:'Practice test, Q13 (guessed)',
   explain:'Write the average as an inequality: $6 < \\dfrac{6+8+10+z}{4} < 12$. Multiply everything by 4: $24 < 24 + z < 48$, so $0 < z < 24$. The greatest <em>integer</em> strictly less than 24 is $23$.',
   trap:'Two places to lose this: forgetting to multiply the whole inequality by 4 (not just one side), and treating &ldquo;between 6 and 12&rdquo; as allowing 12 itself, which gives $z = 24$ &mdash; not a choice here, but it will be on a harder version. &ldquo;Between&rdquo; on the GRE means strictly between unless it says &ldquo;inclusive.&rdquo;' },
 { id:'avg-bound-1', topic:'Average inside a range', variant:1, type:'mc',
   stem:'If the average (arithmetic mean) of 4, 9, 11, and $w$ is between 5 and 10, what is the greatest possible integer value of $w$?',
   choices:['9','15','16','20','36'], answer:1,
   explain:'$5 < \\dfrac{24+w}{4} < 10 \\Rightarrow 20 < 24 + w < 40 \\Rightarrow -4 < w < 16$. Greatest integer: $15$.',
   trap:'$16$ is the trap for reading &ldquo;between&rdquo; as inclusive. Strictly less than 16 means 15.' }
];
