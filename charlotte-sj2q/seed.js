/* Charlotte — revision bank seed (practice engine).
   Each entry is one problem. variant 0 = the original miss from her test; 1, 2, ... = your variations.
   Fields: id (unique forever), topic, variant, type (qc | mc | ma | ne), stem, qa/qb (qc only),
           choices (mc/ma), answer (index, array of indices, or string for ne), given (what she put on the test),
           source, explain, trap, figure (optional inline SVG), frac:true (ne with a fraction box).
   Add new problems at the END. Never reuse or edit an id once it has shipped. */
var FIG_ANGLES = '<svg class="fig" width="300" height="270" viewBox="0 0 340 300" fill="none" stroke="#222" stroke-width="1.7" stroke-linecap="round" font-family="Times New Roman" font-style="italic" font-size="16">'
 +'<line x1="80" y1="41" x2="268" y2="270"/><line x1="170" y1="15" x2="170" y2="290"/><line x1="238" y1="30" x2="102" y2="270"/><line x1="170" y1="150" x2="335" y2="210"/>'
 +'<text x="66" y="34" stroke="none" fill="#222" font-size="18">k</text><text x="164" y="10" stroke="none" fill="#222" font-size="18">&#8467;</text><text x="244" y="26" stroke="none" fill="#222" font-size="18">m</text>'
 +'<text x="139" y="104" stroke="none" fill="#222">w&deg;</text><text x="178" y="101" stroke="none" fill="#222">x&deg;</text><text x="196" y="140" stroke="none" fill="#222">y&deg;</text>'
 +'<text x="214" y="196" stroke="none" fill="#222">z&deg;</text><text x="128" y="168" stroke="none" fill="#222">v&deg;</text></svg>';

window.RBANK_SEED = [
 /* ---- Topic 1: QC with ranges / extremes ---- */
 { id:'qc-extremes-0', topic:'QC: extremes of a range', variant:0, type:'qc',
   stem:'', qa:'The greatest possible value of $\\dfrac{2}{x-y}$, where $6 \\le x \\le 8$ and $2 \\le y \\le 5$', qb:'$\\dfrac{2}{3}$',
   answer:0, given:3, source:'Practice test, Q1',
   explain:'$x-y$ runs from $6-5=1$ up to $8-2=6$, and it is always positive. A fraction with a fixed positive numerator is biggest when the denominator is smallest, so the greatest value is $\\dfrac{2}{1}=2$, which beats $\\dfrac{2}{3}$.',
   trap:'&ldquo;Cannot be determined&rdquo; is tempting because $x$ and $y$ are ranges, not numbers. But the question asks for the <em>greatest possible value</em> &mdash; that is a single number, found by pushing the denominator to its extreme. Ranges in a QC stem are a cue to test endpoints, not to bail out.' },
 { id:'qc-extremes-1', topic:'QC: extremes of a range', variant:1, type:'qc',
   stem:'', qa:'The least possible value of $\\dfrac{3}{a-b}$, where $10 \\le a \\le 12$ and $1 \\le b \\le 4$', qb:'$\\dfrac{1}{3}$',
   answer:1,
   explain:'$a-b$ ranges from $6$ to $11$ (always positive). The fraction is smallest when the denominator is largest: $\\dfrac{3}{11}\\approx 0.27 < \\dfrac{1}{3}\\approx 0.33$. Quantity B is greater.',
   trap:'Same trap as the original: ranges invite choice D. Test both endpoints of the denominator before deciding anything.' },

 /* ---- Topic 2: Recursive sequences & exponents ---- */
 { id:'seq-exp-0', topic:'Sequences & exponent rules', variant:0, type:'qc',
   stem:'$C_1, C_2, C_3, \\ldots, C_j, \\ldots$<br>The sequence shown is defined by $C_1 = 5$ and $C_{j+1} = \\dfrac{1}{5}C_j$ for each positive integer $j$.',
   qa:'$C_{10}$', qb:'$\\left(5^{15}\\right)C_{25}$', answer:2, given:1, source:'Practice test, Q2',
   explain:'Each step multiplies by $\\frac15$, so $C_n = 5\\cdot\\left(\\frac15\\right)^{n-1} = 5^{2-n}$. Then $C_{10}=5^{-8}$ and $5^{15}C_{25} = 5^{15}\\cdot 5^{-23} = 5^{-8}$. Equal.',
   trap:'B looks bigger because $5^{15}$ is huge and $25 > 10$. But $C_{25}$ is <em>tiny</em> ($5^{-23}$), and the $5^{15}$ only partly cancels it. Write the closed form $C_n=5^{2-n}$ first; never compare by eyeballing which subscript is larger.' },
 { id:'seq-exp-1', topic:'Sequences & exponent rules', variant:1, type:'qc',
   stem:'The sequence $a_1, a_2, a_3, \\ldots$ is defined by $a_1 = 3$ and $a_{n+1} = 3a_n$ for each positive integer $n$.',
   qa:'$a_8$', qb:'$3^8$', answer:2,
   explain:'$a_n = 3\\cdot 3^{n-1} = 3^n$, so $a_8 = 3^8$. Equal.',
   trap:'Easy to think $a_8 = 3\\cdot 3^8$ (one factor too many) or $3^7$ (one too few). Check with $n=1$: the formula must give $a_1=3$.' },

 /* ---- Topic 3: Simple interest / two-account setup ---- */
 { id:'interest-0', topic:'Simple interest, two accounts', variant:0, type:'mc',
   stem:'An investor placed a total of \\$6,400 in two accounts for one year. One of the accounts earned simple annual interest at a rate of 5 percent, and the other earned simple annual interest at a rate of 3 percent. The investor made no deposits or withdrawals from the accounts. If each account earned the same amount of interest after one year, what was the total amount of interest earned from both accounts?',
   choices:['\\$128','\\$144','\\$240','\\$256','\\$512'], answer:2, given:0, source:'Practice test, Q3',
   explain:'Let the 5% account hold $a$ and the 3% account hold $b$. Equal interest means $0.05a = 0.03b$, so $a:b = 3:5$. Split \\$6,400 in that ratio: $a=2{,}400$, $b=4{,}000$. Each earns \\$120, total \\$240.',
   trap:'\\$128 is what you get from $6400 \\times 0.04 \\div 2$ &mdash; averaging the two rates. Averaging only works when the accounts hold equal money, and here they can&rsquo;t (equal interest at different rates forces unequal balances).' },
 { id:'interest-1', topic:'Simple interest, two accounts', variant:1, type:'mc',
   stem:'A total of \\$10,000 was placed in two accounts for one year. One account earned simple annual interest at 6 percent and the other at 4 percent. If each account earned the same amount of interest after one year, what was the total interest earned from both accounts?',
   choices:['\\$400','\\$480','\\$500','\\$600','\\$960'], answer:1,
   explain:'$0.06a = 0.04b \\Rightarrow a:b = 2:3$, so $a=4{,}000$, $b=6{,}000$. Each earns \\$240; total \\$480.',
   trap:'\\$500 is the average-rate trap ($10{,}000\\times 5\\%$). Equal interest at different rates means unequal balances &mdash; set up the ratio.' },

 /* ---- Topic 4: Angles at a point ---- */
 { id:'angles-0', topic:'Angles at a point', variant:0, type:'ne', frac:true, figure:FIG_ANGLES,
   stem:'In the figure, lines $k$, $\\ell$, and $m$ intersect at a single point, which is the vertex of all the angles shown. If $x = z$, $y = 2w$, and $v = 110$, what is the ratio of $x$ to $w$?<br><span style="font-size:16px">Give your answer as a fraction.</span>',
   answer:'3/4', given:'2/3', source:'Practice test, Q4',
   explain:'Look at the figure before the equations. The region straight across the vertex from $v$ is bounded by the same two lines, and it contains <em>both</em> $y$ and $z$ (the extra ray splits it). Vertical angles are equal, so $y + z = v = 110$. Along line $k$, the four angles on one side make a straight line: $w + x + y + z = 180$, so $w + x = 70$. Now substitute $y = 2w$ and $z = x$ into the first equation: $2w + x = 110$. Subtract $w + x = 70$ to get $w = 40$, then $x = 30$. Ratio $x:w = 30:40 = \\dfrac{3}{4}$.',
   trap:'$\\frac23$ comes from treating $v$ as vertical to $y$ alone and never noticing the extra ray. In a busy figure, trace each labeled region straight through the vertex with your finger first: the partner of $v$ is $y$ and $z$ together. Get the two geometry facts (vertical pair, straight line) down, then the algebra is two lines.' },
 { id:'angles-1', topic:'Angles at a point', variant:1, type:'ne',
   stem:'Three lines intersect at a single point, forming six angles. Three consecutive angles, measuring $p°$, $q°$, and $r°$, together make up a straight line. If $p = q$ and $r = 4p$, what is the value of $r$?',
   answer:'120',
   explain:'$p+q+r = 180$ and $q=p$, $r=4p$, so $6p = 180$, $p = 30$, $r = 120$.',
   trap:'Forgetting that consecutive angles along a line sum to $180°$ (not $360°$) doubles everything.' },

 /* ---- Topic 5: Area unit conversion ---- */
 { id:'units-0', topic:'Unit conversion for area', variant:0, type:'ma',
   stem:'A flat rectangular tile has a length that is between 4 inches and 6 inches and a width that is between 3 inches and 6 inches. Which of the following could be the value of the area, in square feet, of the top surface of the tile? (1 foot = 12 inches)<br><span style="font-size:16px">Indicate <u>all</u> such values.</span>',
   choices:['$\\dfrac{1}{8}$','$\\dfrac{1}{6}$','$\\dfrac{1}{2}$','$\\dfrac{4}{3}$'], answer:[0,1], given:[3], source:'Practice test, Q5',
   explain:'Area in square inches is between $4\\cdot 3 = 12$ and $6\\cdot 6 = 36$. One square foot is $12\\times 12 = 144$ square inches, so the area in square feet is between $\\dfrac{12}{144}=\\dfrac{1}{12}$ and $\\dfrac{36}{144}=\\dfrac{1}{4}$. Only $\\dfrac18$ and $\\dfrac16$ fit.',
   trap:'$\\frac43$ is exactly what you get by dividing by 12 instead of 144 (12&ndash;36 in&sup2; becomes 1&ndash;3 &ldquo;ft&sup2;&rdquo;). Converting <em>area</em> means the conversion factor gets squared. Convert the side lengths to feet first, then multiply.' },
 { id:'units-1', topic:'Unit conversion for area', variant:1, type:'ma',
   stem:'A rectangular rug has a length between 5 feet and 8 feet and a width between 3 feet and 4 feet. Which of the following could be the area of the rug, in square yards? (1 yard = 3 feet)<br><span style="font-size:16px">Indicate <u>all</u> such values.</span>',
   choices:['$1$','$2$','$3$','$4$','$10$'], answer:[1,2],
   explain:'Area in ft&sup2; is between $15$ and $32$. One square yard is $9$ ft&sup2;, so the area in yd&sup2; is between $\\frac{15}{9}\\approx 1.67$ and $\\frac{32}{9}\\approx 3.56$. Only $2$ and $3$ fit.',
   trap:'Dividing by 3 instead of 9 gives 5&ndash;10.7, which makes $10$ look right. Square the conversion factor for area.' },

 /* ---- Topic 6: Digit arrangement / min difference ---- */
 { id:'digits-0', topic:'Digits & least difference', variant:0, type:'mc',
   stem:'If 2, 4, 6, and 9 are the digits of two 2-digit integers, what is the least possible positive difference between the integers?',
   choices:['28','27','17','13','9'], answer:3, given:2, source:'Practice test, Q6',
   explain:'To make the difference small, give the two numbers tens digits that are as close as possible (consecutive in the list), then make the larger number&rsquo;s units digit small and the smaller number&rsquo;s units digit large. Tens 4 and 6: $62 - 49 = 13$. Tens 2 and 4: $42 - 29 = 13$. Tens 6 and 9: $92-69=23$. Least is $13$.',
   trap:'17 comes from a &ldquo;reasonable-looking&rdquo; pair like $46 - 29$ without pushing the units digits to their extremes. Once the tens digits are chosen, you still have a second optimization: largest units on the small number, smallest units on the big number.' },
 { id:'digits-1', topic:'Digits & least difference', variant:1, type:'mc',
   stem:'If 1, 4, 5, and 7 are the digits of two 2-digit integers, what is the least possible positive difference between the integers?',
   choices:['4','6','13','14','27'], answer:0,
   explain:'Tens digits 4 and 5 are closest: $51 - 47 = 4$. (Tens 1 and 4: $41-17=24$; tens 5 and 7: $71-54=17$.) Least is $4$.',
   trap:'Stopping at $54-41=13$ uses consecutive tens but the wrong units placement. Always finish the second step.' },

 /* ---- Topic 7: Remainders ---- */
 { id:'remainder-0', topic:'Remainders', variant:0, type:'mc',
   stem:'When the positive integer $d$ is divided by 12, the remainder is 5. What is the remainder when $d^2$ is divided by 8?',
   choices:['1','3','5','6','7'], answer:0, given:1, source:'Practice test, Q7',
   explain:'Pick the simplest $d$ that works: $d = 5$. Then $d^2 = 25$ and $25 \\div 8$ leaves remainder $1$. (Check $d=17$: $289 = 36\\cdot 8 + 1$. Same.) Algebraically, $d = 12k+5 \\Rightarrow d^2 = 144k^2 + 120k + 25$, and the first two terms are multiples of 8, so the remainder is that of $25$, which is $1$.',
   trap:'The divisor changes from 12 to 8 mid-problem, which makes people freeze or guess. Remainder problems almost always surrender to <em>plug in the smallest valid number</em>. There was no reason to reason abstractly here.' },
 { id:'remainder-1', topic:'Remainders', variant:1, type:'mc',
   stem:'When the positive integer $n$ is divided by 10, the remainder is 7. What is the remainder when $n^2$ is divided by 5?',
   choices:['0','1','2','3','4'], answer:4,
   explain:'Try $n = 7$: $49 \\div 5$ leaves remainder $4$. (Check $n=17$: $289 = 57\\cdot5+4$.) Remainder $4$.',
   trap:'Changing divisors (10 &rarr; 5) is a cue to plug in, not to derive.' },

 /* ---- Topic 8: Algebraic fractions from a story ---- */
 { id:'algfrac-0', topic:'Algebraic fractions from a story', variant:0, type:'mc',
   stem:'A group of $n$ college students bought three identical round cakes to share. They divided the first cake into equal-sized pieces, one piece for each of them. They did the same with the second cake. After 3 of the students decided they did not want any more cake, the remaining students divided the third cake into equal-sized pieces, one piece for each of them. If Silvia received 1 piece from each of the three cakes, then, in terms of $n$, the amount of cake that she received was the same as what fraction of 1 cake?',
   choices:['$\\dfrac{n+2}{n(n-3)}$','$\\dfrac{2n-3}{n(n-3)}$','$\\dfrac{3n-3}{n(n-3)}$','$\\dfrac{3n-6}{n(n-3)}$','$\\dfrac{3n-3}{2n(n-3)}$'], answer:3, given:2, source:'Practice test, Q8',
   explain:'Silvia gets $\\frac1n + \\frac1n + \\frac{1}{n-3} = \\frac{2}{n} + \\frac{1}{n-3}$. Common denominator $n(n-3)$: $\\dfrac{2(n-3) + n}{n(n-3)} = \\dfrac{3n-6}{n(n-3)}$.',
   trap:'$3n-3$ is what you get if $2(n-3)$ becomes $2n-3$ &mdash; distributing the 2 to only the first term. The distractor is built from exactly that slip. Alternative safety net: plug in $n=6$. She gets $\\frac16+\\frac16+\\frac13 = \\frac23$; only choice D gives $\\frac{12}{18}=\\frac23$.' },
 { id:'algfrac-1', topic:'Algebraic fractions from a story', variant:1, type:'mc',
   stem:'$m$ friends bought three identical pizzas. They split the first pizza equally, one slice each, and did the same with the second. Then 2 friends left, and the remaining friends split the third pizza equally, one slice each. If Lena got one slice from each pizza, what fraction of 1 pizza did she receive, in terms of $m$?',
   choices:['$\\dfrac{3m-2}{m(m-2)}$','$\\dfrac{3m-4}{m(m-2)}$','$\\dfrac{m+2}{m(m-2)}$','$\\dfrac{2m-4}{m(m-2)}$','$\\dfrac{3m-4}{2m(m-2)}$'], answer:1,
   explain:'$\\frac2m + \\frac{1}{m-2} = \\dfrac{2(m-2)+m}{m(m-2)} = \\dfrac{3m-4}{m(m-2)}$.',
   trap:'$3m-2$ is the &ldquo;distribute to one term only&rdquo; slip again. Plug in $m=4$ to check: $\\frac14+\\frac14+\\frac12 = 1$; only B gives $\\frac{8}{8}$.' }
];
