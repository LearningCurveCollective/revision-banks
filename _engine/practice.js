/* Learning Curve Collective — Revision Bank engine (practice edition)
   Shared by every student on this engine. Student data comes from <slug>/index.html (window.RBANK)
   and <slug>/seed.js (window.RBANK_SEED). Progress lives in the student's browser. */
(function(){
'use strict';

var CFG = Object.assign({ name:'Student', slug:'student', tagline:'', exam:'', requireReattempt:true, tutor:'your tutor' }, window.RBANK || {});
var NAME = CFG.name;
var TUTOR = /[?&]tutor/.test(location.search);
var ENGINE_DIR = (function(){ var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^\/]*$/, '') : '../_engine/'; })();
(function mount(){
    function e(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    var root = document.getElementById('rbank-app') || document.body;
    root.innerHTML = ''
    + '<div class="header"><div style="display:flex;align-items:center;gap:16px"><a href="https://learningcurvecollective.com" target="_blank" rel="noopener"><img src="'+ENGINE_DIR+'logo.png" alt="" style="width:56px;height:56px;object-fit:contain"></a><div><h1>'+e(NAME)+' &mdash; Revision Bank</h1><div class="sub">'+e(CFG.tagline||'Every miss, tracked & retested')+'</div></div></div>'
    + '<div class="right"><a href="https://learningcurvecollective.com" target="_blank" rel="noopener">Learning Curve Collective</a><div class="sub">'+e(CFG.exam||'')+'</div></div></div>'
    + '<div class="container">'
    + (TUTOR ? '<div class="tnote">&#128295; <b>Tutor controls:</b> <button class="btn btn-sm btn-ghost" id="demo-on">Load sample history</button> <button class="btn btn-sm btn-ghost" id="demo-off">Reset this student</button> <span class="muted">Re-attempt lock: '+(CFG.requireReattempt?'on':'off')+' (set in index.html)</span></div>' : '')
    + '<div class="tabs"><button class="tab active" data-v="home">&#127968; Home <span class="pill" id="due-pill">0</span></button><button class="tab" data-v="log">&#128221; Error Log</button><button class="tab" data-v="bank">&#128218; Bank</button><button class="tab" data-v="session">&#9654; Session</button><button class="tab" data-v="results">&#128202; Results</button><button class="tab" data-v="build">&#9998; Write Your Own Version</button><button class="tab" data-v="ptest">&#9201; Practice Test</button></div>'
    + '<div id="v-home" class="view active"></div><div id="v-log" class="view"></div><div id="v-bank" class="view"></div><div id="v-session" class="view"></div><div id="v-results" class="view"></div><div id="v-build" class="view"></div><div id="v-ptest" class="view"></div>'
    + '</div>'
    + '<div class="footer">Learning Curve Collective &bull; '+e(NAME)+' &mdash; Revision Bank</div>';
    document.title = NAME+' — Revision Bank';
})();

/* ============================================================
   SEED — Charlotte's 8 practice-test misses + 1 variant each.
   type: qc (quantitative comparison) | mc | ma (select all) | ne (numeric entry)
   ============================================================ */
var PROBLEMS = Array.isArray(window.RBANK_SEED) ? window.RBANK_SEED : [];
var QC = ['Quantity A is greater.','Quantity B is greater.','The two quantities are equal.','The relationship cannot be determined from the information given.'];

var TOPICS = []; PROBLEMS.forEach(function(p){ if(TOPICS.indexOf(p.topic)===-1) TOPICS.push(p.topic); });
var byId = {}; PROBLEMS.forEach(function(p){ byId[p.id]=p; });
var ERR_TYPES = ['Content gap','Trap / distractor','Careless slip','Misread the question','Pacing / rushed'];
var CONF = { sure:'Sure', pretty:'Pretty sure', guess:'Guessing' };

/* ============================================================ STATE ============================================================ */
var KEY = 'rb2:'+CFG.slug;
var S = load();
function fresh(){ return { att:{}, log:[], rules:{}, traps:[], lastResults:null, settings:{} }; }
function load(){ try { var v = localStorage.getItem(KEY); return v ? Object.assign(fresh(), JSON.parse(v)) : fresh(); } catch(e){ return fresh(); } }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
function att(id){ return S.att[id] || (S.att[id] = { box:0, due:0, history:[], b3:0 }); }
var DAY = 86400000;
function now(){ return Date.now(); }
function isDue(id){ var a = S.att[id]; return !a || a.box===0 || (a.box<4 && a.due <= now()); }
function dueList(){ return PROBLEMS.filter(function(p){ return isDue(p.id); }); }
function originals(){ return PROBLEMS.filter(function(p){ return p.variant===0; }); }
function pendingOriginals(){ return originals().filter(function(p){ return !S.att[p.id] || S.att[p.id].history.length===0; }); }
function reattemptLocked(){ return CFG.requireReattempt && pendingOriginals().length>0; }
function lastAttempt(id){ var a=S.att[id]; return a && a.history.length ? a.history[a.history.length-1] : null; }

/* scheduler */
function record(id, correct, conf, seconds, mode){
    var a = att(id);
    a.history.push({ t:now(), correct:correct, conf:conf, s:seconds, mode:mode });
    var confWrong = !correct && conf==='sure';
    if(correct){
        if(a.box>=3){ a.b3 = (a.b3||0)+1; if(a.b3>=2) a.box = 4; else a.box = 3; }
        else a.box = Math.min(a.box+1, 3);
    } else { a.box = 1; a.b3 = 0; }
    if(confWrong) a.box = 1;
    var gap = {1:1,2:3,3:7,4:30}[a.box] || 1;
    a.due = now() + gap*DAY;
    save();
}

/* ============================================================ HELPERS ============================================================ */
function $(id){ return document.getElementById(id); }
function esc(s){ return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function ts(el){ if(window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise(el?[el]:undefined).catch(function(){}); }
function fmtD(t){ return new Date(t).toLocaleDateString(undefined,{month:'short',day:'numeric'}); }
function plain(s){
    return (s||'').replace(/<[^>]+>/g,' ').replace(/\$\$?([^$]*)\$\$?/g,function(m,t){
        return t.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g,'($1)/($2)').replace(/\\left|\\right/g,'').replace(/\\le\b/g,'≤').replace(/\\ge\b/g,'≥').replace(/\\times/g,'×').replace(/\\cdot/g,'·').replace(/\\ldots/g,'…').replace(/\\sqrt/g,'√').replace(/\\[a-zA-Z]+/g,'').replace(/[{}]/g,'').replace(/\s+/g,' ');
    }).replace(/\\\$/g,'$').replace(/\s+/g,' ').trim();
}
function stemPreview(p){ var s = p.preview ? p.preview : (p.type==='qc' && (!p.stem || /<table/.test(p.stem)) ? 'QC: '+plain(p.qa)+' vs '+plain(p.qb) : plain(p.stem)); return s.length>110 ? s.slice(0,110)+'…' : s; }
function answerText(p, a){
    if(a==null) return '—';
    if(p.type==='qc') return ['A','B','C','D'][a];
    if(p.type==='mc') return String.fromCharCode(65+a);
    if(p.type==='ma') return (a||[]).map(function(i){ return String.fromCharCode(65+i); }).join(', ') || '(none)';
    return String(a);
}
function isCorrect(p, a){
    if(a==null) return false;
    if(p.type==='ma'){ var x=(a||[]).slice().sort().join(','), y=p.answer.slice().sort().join(','); return x===y && x!==''; }
    if(p.type==='ne'){ return numEq(a, p.answer); }
    return a===p.answer;
}
function numEq(a,b){ function v(s){ s=String(s).trim(); if(!s) return NaN; var m=s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/); return m? +m[1]/+m[2] : +s; } var x=v(a), y=v(b); return !isNaN(x)&&!isNaN(y)&&Math.abs(x-y)<1e-9; }
function topicsWithRules(ids){ var t={}; ids.forEach(function(id){ var tp=byId[id].topic; if(S.rules[tp]) t[tp]=S.rules[tp]; }); return t; }
function ruleHitRate(topic){
    var r = S.rules[topic]; if(!r) return null; var n=0,c=0;
    PROBLEMS.filter(function(p){ return p.topic===topic; }).forEach(function(p){ (S.att[p.id]?S.att[p.id].history:[]).forEach(function(h){ if(h.t>=r.t){ n++; if(h.correct) c++; } }); });
    return n? {n:n, c:c, pct:Math.round(c/n*100)} : {n:0,c:0,pct:null};
}

/* ============================================================ TABS ============================================================ */
function show(v){
    document.querySelectorAll('.view').forEach(function(x){ x.classList.remove('active'); });
    document.querySelectorAll('.tab').forEach(function(x){ x.classList.toggle('active', x.dataset.v===v); });
    $('v-'+v).classList.add('active');
    ({home:renderHome, log:renderLog, bank:renderBank, session:renderSessionHome, results:renderResults, build:renderBuild, ptest:renderPTest})[v]();
    window.scrollTo({top:0});
}
document.querySelectorAll('.tab').forEach(function(b){ b.addEventListener('click', function(){ show(b.dataset.v); }); });

/* ============================================================ HOME ============================================================ */
function renderHome(){
    var due = dueList(), locked = reattemptLocked();
    $('due-pill').textContent = due.length;
    var allH = []; PROBLEMS.forEach(function(p){ (S.att[p.id]?S.att[p.id].history:[]).forEach(function(h){ allH.push(Object.assign({pid:p.id},h)); }); });
    var cw=allH.filter(function(h){ return h.conf==='sure'&&!h.correct; }), cr=allH.filter(function(h){ return h.conf==='sure'&&h.correct; }), gr=allH.filter(function(h){ return h.conf==='guess'&&h.correct; }), gw=allH.filter(function(h){ return h.conf==='guess'&&!h.correct; });
    var h = '<div class="hero"><div>';
    if(locked){ var po=pendingOriginals(), firstTime = po.length===originals().length;
        h += firstTime ? '<div class="big">Let&rsquo;s start with the '+po.length+' you missed.</div><div class="small">Try each one again, no notes. It&rsquo;s fine if some still go wrong &mdash; that&rsquo;s what we&rsquo;re here to find out. Then we&rsquo;ll dig into why.</div></div>'
                     : '<div class="big">'+po.length+' new '+(po.length===1?'one':'ones')+' from your latest test.</div><div class="small">Same drill: try '+(po.length===1?'it':'them')+' again first, no notes, then the log opens back up for '+(po.length===1?'it':'them')+'.</div></div>';
        h += '<button class="btn btn-gold btn-big" id="hero-start">'+(firstTime?'Start re-attempt':'Try the new '+(po.length===1?'one':'ones'))+' &rarr;</button>'; }
    else if(due.length){ h += '<div class="big">Due today: '+due.length+' problem'+(due.length===1?'':'s')+'</div><div class="small">'+summarizeTopics(due)+'</div></div><button class="btn btn-gold btn-big" id="hero-start">Start &rarr;</button>'; }
    else { var next = nextDue(); h += '<div class="big">You&rsquo;re all caught up.</div><div class="small">'+(next?'Next review: '+fmtD(next):'Everything is mastered.')+' &mdash; or pull something from the Bank.</div></div><button class="btn btn-ghost btn-big" style="color:#fff;border-color:#fff" id="hero-bank">Open bank</button>'; }
    h += '</div>';
    h += '<div class="grid2">';
    /* calibration */
    h += '<div class="card red"><h3 class="sub">Calibration &mdash; confidence vs. correctness</h3>';
    if(!allH.length) h += '<p class="muted">After each session your answers sort into four boxes. The red one is the interesting one &mdash; those are the questions that <em>felt</em> right and weren&rsquo;t.</p>';
    h += '<div class="calib"><div></div><div class="lab">Answered correctly</div><div class="lab">Answered wrong</div>'
       + '<div class="lab">Felt<br>sure</div><div class="cell cr"><div class="n">'+cr.length+'</div><small>Solid</small></div><div class="cell cw"><div class="n">'+cw.length+'</div><small>Felt right, wasn&rsquo;t'+(cw.length?' &middot; <a data-drill="cw">drill these</a>':'')+'</small></div>'
       + '<div class="lab">Was<br>guessing</div><div class="cell gr"><div class="n">'+gr.length+'</div><small>Lucky guess</small></div><div class="cell gw"><div class="n">'+gw.length+'</div><small>Knew you didn&rsquo;t know</small></div></div>'
       + '<p class="muted" style="margin-top:8px;font-size:12px">&ldquo;Pretty sure&rdquo; answers ('+allH.filter(function(x){return x.conf==='pretty';}).length+') sit out of the grid so the two extremes stay clear.</p></div>';
    /* mastery pips */
    h += '<div class="card blue pips"><h3 class="sub">Mastery by topic</h3>';
    TOPICS.forEach(function(t){
        var ps = PROBLEMS.filter(function(p){ return p.topic===t; });
        h += '<div class="row"><span>'+esc(t)+'</span><span>'+ps.map(function(p){ var b=S.att[p.id]?S.att[p.id].box:0; return '<span class="pip b'+b+'" title="'+esc(p.variant?'Variant '+p.variant:'Original')+' &middot; '+boxName(b)+'"></span>'; }).join('')+'</span></div>';
    });
    h += '<div class="legend"><span><span class="pip b0"></span> new</span><span><span class="pip b1"></span> learning (box 1)</span><span><span class="pip b2"></span> box 2</span><span><span class="pip b3"></span> reviewing (box 3)</span><span><span class="pip b4"></span> mastered</span></div></div>';
    /* error profile */
    h += '<div class="card"><h3 class="sub">Error-type profile</h3>';
    if(!S.log.length) h += '<p class="muted">This fills in from your error log. Over a few weeks it shows what kind of miss you tend to make, which tells us what to practice.</p>';
    else { var m={}; S.log.forEach(function(e){ m[e.err]=(m[e.err]||0)+1; }); Object.keys(m).sort(function(a,b){return m[b]-m[a];}).forEach(function(k){ var w=Math.round(m[k]/S.log.length*100); h += '<div class="bar"><div class="top"><span>'+esc(k)+'</span><span>'+m[k]+'</span></div><div class="track"><div class="fill" style="width:'+w+'%"></div></div></div>'; }); }
    h += '</div>';
    /* rules scoreboard */
    h += '<div class="card green"><h3 class="sub">Rules scoreboard</h3>';
    var rk = Object.keys(S.rules);
    if(!rk.length) h += '<p class="muted">Every rule you write shows up here with how you&rsquo;ve done on that topic since. If a rule isn&rsquo;t helping, we&rsquo;ll rewrite it together.</p>';
    rk.forEach(function(t){ var r=ruleHitRate(t); h += '<div class="rule"><span class="hit">'+(r.pct==null?'not tested yet':r.c+'/'+r.n+' &middot; '+r.pct+'%')+'</span><b>'+esc(t)+'</b><br>&ldquo;'+esc(S.rules[t].text)+'&rdquo;</div>'; });
    h += '</div></div>';
    h += '<div class="card" style="margin-top:4px"><h3 class="sub">Backup</h3><p class="muted" style="margin-bottom:10px">Everything here lives in this browser. Export a backup now and then, and import it if you ever switch computers or clear your browser.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm btn-gold" id="btn-export">&#11015; Export backup</button><label class="btn btn-sm btn-ghost" style="cursor:pointer">&#11014; Import backup<input type="file" id="in-import" accept="application/json,.json" style="display:none"></label></div></div>';
    $('v-home').innerHTML = h;
    $('btn-export').onclick=exportAll; $('in-import').addEventListener('change', importAll);
    var hs = $('hero-start'); if(hs) hs.onclick = function(){ show('session'); if(locked) startSession('learn', pendingOriginals().map(function(p){return p.id;}), true); };
    var hb = $('hero-bank'); if(hb) hb.onclick = function(){ show('bank'); };
    var dr = document.querySelector('[data-drill="cw"]'); if(dr) dr.onclick = function(){ var ids = {}; cw.forEach(function(x){ ids[x.pid]=1; }); show('session'); startSession('learn', Object.keys(ids)); };
}
function boxName(b){ return ['new','learning','box 2','reviewing','mastered'][b]; }
function nextDue(){ var t=null; PROBLEMS.forEach(function(p){ var a=S.att[p.id]; if(a&&a.box<4&&(t==null||a.due<t)) t=a.due; }); return t; }
function summarizeTopics(ps){ var t={}; ps.forEach(function(p){ t[p.topic]=(t[p.topic]||0)+1; }); var k=Object.keys(t); return k.slice(0,3).map(function(x){ return x+' ('+t[x]+')'; }).join(' · ')+(k.length>3?' · +'+(k.length-3)+' more':''); }

/* ============================================================ ERROR LOG ============================================================ */
function questionHTML(p){
    var h = '<div class="q-ref">';
    if(p.figure) h += p.figure;
    if(p.stem) h += '<div class="q-stem" style="font-size:16px">'+p.stem+'</div>';
    if(p.type==='qc'){ h += '<div class="qc" style="font-size:16px"><div><div class="h">Quantity A</div>'+p.qa+'</div><div><div class="h">Quantity B</div>'+p.qb+'</div></div>'; QC.forEach(function(c){ h += '<div class="choice ro"><span class="dot"></span><span>'+c+'</span></div>'; }); }
    else if(p.type==='mc'||p.type==='ma'){ p.choices.forEach(function(c){ h += '<div class="choice ro'+(p.type==='ma'?' box':'')+'"><span class="dot"></span><span>'+c+'</span></div>'; }); }
    else { h += '<div class="ne-row">'+(p.frac?'<span>'+(p.fracLabel||'$\\dfrac{x}{w}$')+' =</span><span class="frac"><span class="ne-box"></span><span class="ne-box" style="border-top:3px solid #000"></span></span>':'<span class="ne-box" style="width:140px"></span>')+'</div>'; }
    return h+'</div>';
}
var logPrefill = null;
function renderLog(){
    var h = '<h2 class="sec">Error Log</h2>';
    var po = pendingOriginals();
    if(po.length){
        h += '<div class="lock" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span>'+(po.length===1?'One question':po.length+' questions')+' from your test '+(po.length===1?'hasn&rsquo;t':'haven&rsquo;t')+' been re-tried yet. '+(CFG.requireReattempt?'Each one opens up here right after you try it.':'')+'</span><button class="btn btn-green btn-sm" id="lock-go">Try '+(po.length===1?'it':'them')+' now</button></div>';
    }
    var tried = CFG.requireReattempt ? PROBLEMS.filter(function(p){ return S.att[p.id]&&S.att[p.id].history.length; }) : PROBLEMS.slice();
    var wrongFirst = tried.slice().sort(function(a,b){ var la=lastAttempt(a.id), lb=lastAttempt(b.id); return ((!la||la.correct)?1:0)-((!lb||lb.correct)?1:0); });
    h += '<div class="card green"><h3 class="sub">Log a miss</h3><div class="form">';
    h += '<div class="field full"><label>Which problem?</label><select id="lg-pid"><option value="">— choose —</option>'+wrongFirst.map(function(p){ var la=lastAttempt(p.id); return '<option value="'+p.id+'">'+(!la?'· ':la.correct?'✓ ':'✗ ')+esc(p.topic)+(p.variant?' · variant '+p.variant:' · original')+'</option>'; }).join('')+'</select><div id="lg-qref"></div></div>';
    h += '<div class="field"><label>Error type</label><select id="lg-err">'+ERR_TYPES.map(function(e){ return '<option>'+e+'</option>'; }).join('')+'</select></div>';
    h += '<div class="field"><label>On the test you put</label><input id="lg-given" readonly style="background:var(--cream)"></div>';
    h += '<div class="field full"><label>Why did the wrong answer look right?</label><textarea id="lg-why" placeholder="What made it tempting in the moment?"></textarea><div class="hint">Specific helps: &ldquo;I divided by 12 because I saw inches&rdquo; is more useful than &ldquo;I messed up units.&rdquo;</div></div>';
    h += '<div class="field full"><label>What happened</label><textarea id="lg-what" placeholder="Walk me through what you actually did."></textarea></div>';
    h += '<div class="field full"><label>My rule for this topic</label><input id="lg-rule" placeholder="One sentence you can say to yourself next time, e.g. &quot;Ranges in a QC: test the endpoints.&quot;"><div class="hint">One rule per topic. If you already have one it shows here; change it whenever you find better words.</div></div>';
    h += '</div><div style="margin-top:12px;display:flex;gap:8px;align-items:center"><button class="btn btn-green" id="lg-save">Save entry</button><span class="muted" id="lg-msg"></span></div></div>';
    h += '<h3 class="sub" style="margin-top:20px">Entries ('+S.log.length+')</h3>';
    if(!S.log.length) h += '<div class="empty">Nothing here yet. After a session, the &ldquo;Log it&rdquo; button on any missed question brings you straight here.</div>';
    S.log.slice().reverse().forEach(function(e){ var p=byId[e.pid]; h += '<div class="log"><div class="h"><b>'+esc(p.topic)+(p.variant?' · v'+p.variant:'')+'</b><span class="muted">'+fmtD(e.t)+' · '+esc(e.err)+'</span></div><div class="muted" style="font-style:italic;margin-bottom:6px">'+esc(stemPreview(p))+'</div>'
        + (e.why?'<div class="why"><b>Why it was attractive:</b> '+esc(e.why)+'</div>':'') + (e.what?'<div class="muted">'+esc(e.what)+'</div>':'') + (e.rule?'<div class="rule-l" style="margin-top:6px"><b>Rule:</b> '+esc(e.rule)+'</div>':'')+'</div>'; });
    $('v-log').innerHTML = h;
    var lg=$('lock-go'); if(lg) lg.onclick=function(){ show('session'); startSession('learn', pendingOriginals().map(function(p){return p.id;}), true); };
    var sel = $('lg-pid');
    function onPick(){ var p = byId[sel.value]; var qr=$('lg-qref'); qr.innerHTML = p ? questionHTML(p) : ''; ts(qr); $('lg-given').value = p ? (p.given!=null ? answerText(p,p.given) : (lastAttempt(p.id)? 'last attempt: '+answerText(p,lastAttempt(p.id).a):'')) : ''; if(p && S.rules[p.topic]) $('lg-rule').value = S.rules[p.topic].text; }
    sel.onchange = onPick;
    if(logPrefill){ sel.value = logPrefill; logPrefill=null; onPick(); }
    $('lg-save').onclick = function(){
        var pid = sel.value; if(!pid){ $('lg-msg').textContent='Pick a problem first.'; return; }
        var rule = $('lg-rule').value.trim(), p = byId[pid];
        S.log.push({ t:now(), pid:pid, err:$('lg-err').value, why:$('lg-why').value.trim(), what:$('lg-what').value.trim(), rule:rule });
        if(rule && (!S.rules[p.topic] || S.rules[p.topic].text!==rule)) S.rules[p.topic] = { text:rule, t:now() };
        save(); renderLog(); $('lg-msg').textContent = 'Saved.';
    };
}

/* ============================================================ BANK ============================================================ */
function wireExpand(){
    document.querySelectorAll('[data-expand]').forEach(function(el){ el.onclick=function(){
        var p = byId[el.dataset.expand], row = el.closest('.prow'), box = row && row.nextElementSibling; if(!box || !box.classList.contains('pfull')) return;
        var open = box.style.display!=='none';
        if(open){ box.style.display='none'; el.classList.remove('open'); return; }
        if(!box.dataset.loaded){ box.innerHTML = questionHTML(p) + '<div class="muted" style="font-size:12px;margin:6px 0 2px">'+(p.source?esc(p.source)+' · ':'')+'Answer is shown after you attempt it in a session.</div>'; box.dataset.loaded='1'; }
        box.style.display='block'; el.classList.add('open'); ts(box);
    }; });
}
var bankFilter = 'all', bankPick = {};
function renderBank(){
    var h = '<h2 class="sec">Bank</h2><div class="toolbar">';
    [['all','All'],['due','Due today'],['cw','Confident-wrongs'],['new','Never tried'],['b1','Struggling (box 1)']].forEach(function(f){ h += '<button class="chip'+(bankFilter===f[0]?' on':'')+'" data-f="'+f[0]+'">'+f[1]+'</button>'; });
    h += '<span style="flex:1"></span><button class="btn btn-sm btn-gold" id="bank-run" disabled>Run selected (0)</button></div><p class="muted" style="margin:-6px 0 12px;font-size:13px">Click any question to see it in full. Tick the ones you want and run them.</p>';
    TOPICS.forEach(function(t){
        var ps = PROBLEMS.filter(function(p){ return p.topic===t && passFilter(p); }); if(!ps.length) return;
        h += '<div class="topic"><div class="th"><span>'+esc(t)+'</span><span class="muted" style="font-weight:500">'+ps.length+' problem'+(ps.length===1?'':'s')+'</span></div>';
        ps.forEach(function(p){ var a=S.att[p.id], la=lastAttempt(p.id); h += '<div class="prow"><input type="checkbox" data-pick="'+p.id+'"'+(bankPick[p.id]?' checked':'')+'><span class="stem" data-expand="'+p.id+'" title="Click to show the full question"><span class="v'+(p.variant?'':' orig')+'">'+(p.variant?'v'+p.variant:'original')+'</span> &nbsp;'+esc(stemPreview(p))+(p.figure?' <span class="figmark" title="Has a figure">&#128208; figure</span>':'')+'</span><span class="badge tb-'+p.type+'">'+({qc:'QC',mc:'MC',ma:'Select all',ne:'Numeric'})[p.type]+'</span><span><span class="pip b'+(a?a.box:0)+'"></span> <span class="meta">'+boxName(a?a.box:0)+'</span></span><span class="meta">'+(la?('last '+fmtD(la.t)+(la.correct?' ✓':' ✗')+(la.conf==='sure'&&!la.correct?' (sure)':'')):'never tried')+'</span></div><div class="pfull" style="display:none"></div>'; });
        h += '</div>';
    });
    $('v-bank').innerHTML = h;
    wireExpand();
    document.querySelectorAll('[data-f]').forEach(function(b){ b.onclick=function(){ bankFilter=b.dataset.f; renderBank(); }; });
    document.querySelectorAll('[data-pick]').forEach(function(c){ c.onchange=function(){ if(c.checked) bankPick[c.dataset.pick]=1; else delete bankPick[c.dataset.pick]; var n=Object.keys(bankPick).length; $('bank-run').disabled=!n; $('bank-run').textContent='Run selected ('+n+')'; }; });
    var n=Object.keys(bankPick).length; $('bank-run').disabled=!n; $('bank-run').textContent='Run selected ('+n+')';
    $('bank-run').onclick=function(){ var ids=Object.keys(bankPick); bankPick={}; show('session'); pendingIds = ids; renderSessionHome(); };
}
function passFilter(p){ var a=S.att[p.id], la=lastAttempt(p.id);
    if(bankFilter==='due') return isDue(p.id); if(bankFilter==='new') return !a||!a.history.length; if(bankFilter==='b1') return a&&a.box===1;
    if(bankFilter==='cw') return la&&!la.correct&&la.conf==='sure'; return true; }

/* ============================================================ SESSION ============================================================ */
var pendingIds = null, sess = null, sessMode = 'learn';
function renderSessionHome(){
    if(sess){ renderQuestion(); return; }
    var ids = pendingIds || dueList().map(function(p){ return p.id; });
    var locked = reattemptLocked();
    var h = '<h2 class="sec">Session</h2>';
    if(locked && !pendingIds){ var po=pendingOriginals(); h += '<div class="lock">'+(po.length===originals().length?'Suggested first session: the '+po.length+' questions from your test':'Suggested: the '+po.length+' new '+(po.length===1?'question':'questions')+' from your latest test')+', in Learn mode.</div>'; ids = po.map(function(p){return p.id;}); }
    h += '<p class="muted" style="margin-bottom:12px">Queue: <b>'+ids.length+'</b> problem'+(ids.length===1?'':'s')+(pendingIds?' (hand-picked from the Bank)':' (due today)')+(ids.length?' &mdash; '+summarizeTopics(ids.map(function(i){return byId[i];})):'')+'</p>';
    h += '<div class="mode"><div class="opt'+(sessMode==='learn'?' on':'')+'" data-m="learn"><h4>Learn mode</h4><p class="muted">No timer. Answer, jot a line on why you went that way, then see the solution and where the trap was. Topics are labeled.</p></div>'
       + '<div class="opt'+(sessMode==='test'?' on':'')+'" data-m="test"><h4>Test mode</h4><p class="muted">Like the real thing: timed, no feedback until the end, topics mixed and unlabeled so you practice spotting the setup yourself. Pace shows at the end.</p></div></div>';
    h += '<div style="display:flex;gap:10px;align-items:center"><button class="btn btn-green btn-big" id="sess-start"'+(ids.length?'':' disabled')+'>Begin '+ids.length+' &rarr;</button>'+(pendingIds?'<button class="btn btn-ghost" id="sess-clear">Use due list instead</button>':'')+'</div>';
    $('v-session').innerHTML = h;
    document.querySelectorAll('[data-m]').forEach(function(o){ o.onclick=function(){ if(o.classList.contains('locked')) return; sessMode=o.dataset.m; renderSessionHome(); }; });
    $('sess-start').onclick=function(){ startSession(sessMode, ids, locked && !pendingIds); };
    var sc=$('sess-clear'); if(sc) sc.onclick=function(){ pendingIds=null; renderSessionHome(); };
}
function startSession(mode, ids, isReattempt){
    pendingIds = null;
    var q = ids.slice();
    if(mode==='test') for(var i=q.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=q[i]; q[i]=q[j]; q[j]=t; }
    sess = { mode:mode, ids:q, i:0, answers:{}, conf:{}, secs:{}, explain:{}, revealed:false, t0:now(), reattempt:!!isReattempt };
    var rules = topicsWithRules(q);
    if(Object.keys(rules).length && !isReattempt){
        var h = '<div class="flash"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-light)">Before you start, your own reminders</div>';
        Object.keys(rules).forEach(function(t){ h += '<div class="r"><b>'+esc(t)+':</b> '+esc(rules[t].text)+'</div>'; });
        h += '<div class="muted" style="color:var(--gold-light);margin-top:10px">Starting in <span id="cnt">5</span>&hellip; <a style="color:#fff;cursor:pointer;text-decoration:underline" id="skip">start now</a></div></div>';
        $('v-session').innerHTML = h; var n=5; var iv=setInterval(function(){ n--; var c=$('cnt'); if(c) c.textContent=n; if(n<=0){ clearInterval(iv); renderQuestion(); } },1000); $('skip').onclick=function(){ clearInterval(iv); renderQuestion(); };
    } else renderQuestion();
}
function renderQuestion(){
    var p = byId[sess.ids[sess.i]], learn = sess.mode==='learn';
    if(!sess.qStart) sess.qStart = now();
    var h = '<div class="progress"><div style="width:'+Math.round(sess.i/sess.ids.length*100)+'%"></div></div><div class="q-wrap">';
    h += '<div class="q-top"><span>Question '+(sess.i+1)+' of '+sess.ids.length+(learn?' &middot; <b>'+esc(p.topic)+'</b>'+(p.variant?' (variant)':' (your original miss)'):'')+'</span><span class="badge tb-'+p.type+'">'+({qc:'Quantitative Comparison',mc:'Select one',ma:'Select all that apply',ne:'Numeric entry'})[p.type]+'</span></div>';
    if(p.figure) h += p.figure;
    if(p.stem) h += '<div class="q-stem">'+p.stem+'</div>';
    var a = sess.answers[p.id];
    if(p.type==='qc'){ h += '<div class="qc"><div><div class="h">Quantity A</div>'+p.qa+'</div><div><div class="h">Quantity B</div>'+p.qb+'</div></div>'; QC.forEach(function(c,i){ h += '<div class="choice'+(a===i?' sel':'')+'" data-c="'+i+'"><span class="dot"></span><span>'+c+'</span></div>'; }); }
    else if(p.type==='mc'){ p.choices.forEach(function(c,i){ h += '<div class="choice'+(a===i?' sel':'')+'" data-c="'+i+'"><span class="dot"></span><span>'+c+'</span></div>'; }); }
    else if(p.type==='ma'){ p.choices.forEach(function(c,i){ h += '<div class="choice box'+((a||[]).indexOf(i)!==-1?' sel':'')+'" data-c="'+i+'"><span class="dot"></span><span>'+c+'</span></div>'; }); }
    else { if(p.frac){ var parts=(a||'/').split('/'); h += '<div class="ne-row"><span>'+(p.fracLabel||'$\\dfrac{x}{w}$')+' =</span><span class="frac"><input id="ne-n" value="'+esc(parts[0]||'')+'" inputmode="numeric"><input id="ne-d" value="'+esc(parts[1]||'')+'" inputmode="numeric"></span></div>'; } else h += '<div class="ne-row"><input id="ne-v" value="'+esc(a||'')+'" inputmode="decimal" style="width:140px"></div>'; }
    h += '<div class="conf"><span class="lab">How sure are you?</span>'+Object.keys(CONF).map(function(k){ return '<button data-conf="'+k+'"'+(sess.conf[p.id]===k?' class="on"':'')+'>'+CONF[k]+'</button>'; }).join('')+'</div>';
    if(learn && !sess.revealed) h += '<div class="gate"><b>Optional, but worth it:</b> why that answer?<textarea id="gate-txt" placeholder="A few words if you want — or just hit Check.">'+esc(sess.explain[p.id]||'')+'</textarea></div>';
    if(learn && sess.revealed){ var ok = isCorrect(p,a); h += '<div class="reveal"><div class="tag">'+(ok?'&#10003; Got it':'&#10007; Not this time')+' &middot; answer: '+answerText(p, p.answer)+(p.type==='ne'?'':'')+'</div><div>'+p.explain+'</div>'
        + (!ok || true ? '<div class="trap"><div class="tag">The trap</div>'+p.trap+'</div>' : '') + (p.given!=null && p.variant===0 ? '<p class="muted" style="margin-top:8px">On the practice test you put <b>'+answerText(p,p.given)+'</b>.</p>':'') + '</div>'; }
    h += '<div class="nav"><span class="muted">'+(learn?'':'Timer running &middot; pace shown at the end')+'</span><span style="display:flex;gap:8px">'+(sess.i>0&&!learn?'<button class="btn btn-ghost" id="q-prev">&larr; Back</button>':'')
        + (learn && !sess.revealed ? '<button class="btn btn-gold" id="q-check" disabled>Check answer</button>' : '<button class="btn btn-green" id="q-next" disabled>'+(sess.i===sess.ids.length-1?'Finish':'Next &rarr;')+'</button>')+'</span></div>';
    h += '</div>';
    $('v-session').innerHTML = h; ts($('v-session'));
    function cur(){ if(p.type==='ne'){ if(p.frac){ var n=$('ne-n').value.trim(), d=$('ne-d').value.trim(); return (n&&d)? n+'/'+d : ''; } return $('ne-v').value.trim(); } return sess.answers[p.id]; }
    function ready(){ var a=cur(); var has = p.type==='ma' ? (a&&a.length) : (p.type==='ne' ? !!a : a!=null); var b=$('q-check')||$('q-next'); if(!b) return; var gateOK = true; b.disabled = !(has && sess.conf[p.id] && gateOK); }
    if(!(learn&&sess.revealed)) document.querySelectorAll('[data-c]').forEach(function(c){ c.onclick=function(){ var i=+c.dataset.c; if(p.type==='ma'){ var arr=(sess.answers[p.id]||[]).slice(); var k=arr.indexOf(i); if(k===-1) arr.push(i); else arr.splice(k,1); sess.answers[p.id]=arr; } else sess.answers[p.id]=i; renderQuestion(); }; });
    document.querySelectorAll('[data-conf]').forEach(function(b){ b.onclick=function(){ sess.conf[p.id]=b.dataset.conf; document.querySelectorAll('[data-conf]').forEach(function(x){ x.classList.toggle('on', x===b); }); ready(); }; });
    ['ne-n','ne-d','ne-v','gate-txt'].forEach(function(id){ var el=$(id); if(el) el.oninput=function(){ if(id==='gate-txt') sess.explain[p.id]=el.value; else sess.answers[p.id]=cur(); ready(); }; });
    if(learn && sess.revealed){ document.querySelectorAll('[data-c]').forEach(function(c){ var i=+c.dataset.c; var corr = p.type==='ma'? p.answer.indexOf(i)!==-1 : p.answer===i; var picked = p.type==='ma'? (a||[]).indexOf(i)!==-1 : a===i; if(corr) c.classList.add('correct'); else if(picked) c.classList.add('wrong'); }); document.querySelectorAll('[data-conf]').forEach(function(b){ b.disabled=true; }); }
    var qc=$('q-check'); if(qc) qc.onclick=function(){ sess.answers[p.id]=cur(); sess.secs[p.id]=(sess.secs[p.id]||0)+Math.round((now()-sess.qStart)/1000); sess.revealed=true; record(p.id, isCorrect(p,sess.answers[p.id]), sess.conf[p.id], sess.secs[p.id], 'learn'); renderQuestion(); };
    var qn=$('q-next'); if(qn) qn.onclick=function(){ if(!learn){ sess.answers[p.id]=cur(); sess.secs[p.id]=(sess.secs[p.id]||0)+Math.round((now()-sess.qStart)/1000); } sess.revealed=false; sess.qStart=null; if(sess.i===sess.ids.length-1) finishSession(); else { sess.i++; renderQuestion(); } };
    var qp=$('q-prev'); if(qp) qp.onclick=function(){ sess.secs[p.id]=(sess.secs[p.id]||0)+Math.round((now()-sess.qStart)/1000); sess.qStart=null; sess.i--; renderQuestion(); };
    ready();
}
function finishSession(){
    var rows = sess.ids.map(function(id){ var p=byId[id], a=sess.answers[id], ok=isCorrect(p,a); if(sess.mode==='test') record(id, ok, sess.conf[id], sess.secs[id]||0, 'test'); return { pid:id, a:a, ok:ok, conf:sess.conf[id], s:sess.secs[id]||0 }; });
    S.lastResults = { t:now(), mode:sess.mode, rows:rows, total:Math.round((now()-sess.t0)/1000), reattempt:sess.reattempt, ruleCheck:{} }; save();
    sess = null; show('results');
}

/* ============================================================ RESULTS ============================================================ */
function renderResults(){
    var R = S.lastResults;
    if(!R){ $('v-results').innerHTML = '<h2 class="sec">Results</h2><div class="empty">Finish a session and your results will show up here.</div>'; return; }
    var rows = R.rows.slice().sort(function(a,b){ var ca=(!a.ok&&a.conf==='sure')?0:(!a.ok?1:2), cb=(!b.ok&&b.conf==='sure')?0:(!b.ok?1:2); return ca-cb; });
    var n=rows.length, c=rows.filter(function(r){return r.ok;}).length, cw=rows.filter(function(r){return !r.ok&&r.conf==='sure';}).length, avg=n?Math.round(rows.reduce(function(s,r){return s+r.s;},0)/n):0;
    var h = '<h2 class="sec">Results &mdash; '+(R.mode==='test'?'Test mode':'Learn mode')+(R.reattempt?' (cold re-attempt)':'')+'</h2>';
    h += '<div class="stat-grid"><div class="stat"><div class="n">'+c+'/'+n+'</div><div class="l">Correct</div></div><div class="stat"><div class="n" style="color:var(--red)">'+cw+'</div><div class="l">Confident-wrong</div></div><div class="stat"><div class="n">'+Math.floor(avg/60)+':'+String(avg%60).padStart(2,'0')+'</div><div class="l">Avg per question</div></div><div class="stat"><div class="n" style="color:'+(avg>105?'var(--red)':'var(--green-light)')+'">'+(avg>105?'Over':'On')+'</div><div class="l">vs 1:45 pace</div></div></div>';
    if(R.reattempt) h += '<div class="card green"><b>Nice work getting through those.</b> Each of these is open in the Error Log now. Start with the ones at the top &mdash; the questions that felt right but weren&rsquo;t.</div>';
    var first=true;
    rows.forEach(function(r){ var p=byId[r.pid]; var isCW=!r.ok&&r.conf==='sure';
        if(isCW && first){ h += '<h3 class="sub" style="color:var(--red)">Felt right, wasn&rsquo;t &mdash; start here</h3>'; first=false; }
        if(!isCW && !first){ h += '<h3 class="sub" style="margin-top:14px">Everything else</h3>'; first=true; }
        var rule = S.rules[p.topic];
        h += '<div class="res'+(isCW?' cw':'')+'"><div class="mark '+(r.ok?'ok':'no')+'">'+(r.ok?'✓':'✗')+'</div><div><b>'+esc(p.topic)+'</b>'+(p.variant?' · v'+p.variant:' · original')+'<div class="muted">You: <b>'+answerText(p,r.a)+'</b> · Key: <b>'+answerText(p,p.answer)+'</b> · '+CONF[r.conf]+' · '+r.s+'s</div>'
           + (rule?'<div class="muted" style="margin-top:4px">Your rule: &ldquo;'+esc(rule.text)+'&rdquo; — followed? '+(R.ruleCheck[r.pid]!=null?('<b>'+(R.ruleCheck[r.pid]?'yes':'no')+'</b>'):'<button class="btn btn-sm btn-ghost" data-rc="'+r.pid+'|1">yes</button> <button class="btn btn-sm btn-ghost" data-rc="'+r.pid+'|0">no</button>')+'</div>':'')+'</div>'
           + '<div class="acts"><button class="btn btn-sm btn-ghost" data-show="'+r.pid+'">Solution</button>'+(r.ok?'':'<button class="btn btn-sm btn-brown" data-log="'+r.pid+'">Log it</button>')+'</div></div><div id="sol-'+r.pid+'" style="display:none" class="reveal"><div>'+p.explain+'</div><div class="trap"><div class="tag">The trap</div>'+p.trap+'</div></div>'; });
    if(first===false) {}
    $('v-results').innerHTML = h;
    document.querySelectorAll('[data-show]').forEach(function(b){ b.onclick=function(){ var el=$('sol-'+b.dataset.show); el.style.display = el.style.display==='none'?'block':'none'; ts(el); }; });
    document.querySelectorAll('[data-log]').forEach(function(b){ b.onclick=function(){ logPrefill=b.dataset.log; show('log'); }; });
    document.querySelectorAll('[data-rc]').forEach(function(b){ b.onclick=function(){ var x=b.dataset.rc.split('|'); R.ruleCheck[x[0]]=x[1]==='1'; save(); renderResults(); }; });
}

/* ============================================================ WRITE YOUR OWN VERSION ============================================================ */
function renderBuild(){
    var h = '<h2 class="sec">Write Your Own Version</h2><p class="muted" style="margin-bottom:14px">Turn the tables: write your own version of a question type, with the right answer and one wrong answer that would fool someone, plus a note on why it&rsquo;s tempting. Send it to '+esc(CFG.tutor)+' and the good ones get added to your bank.</p>';
    h += '<div class="card"><div class="form"><div class="field full"><label>Topic</label><select id="bt-topic">'+TOPICS.map(function(t){ return '<option>'+esc(t)+'</option>'; }).join('')+'</select></div>'
       + '<div class="field full"><label>Your question</label><textarea id="bt-stem"></textarea></div><div class="field"><label>Correct answer</label><input id="bt-ans"></div><div class="field"><label>Tempting wrong answer</label><input id="bt-dis"></div>'
       + '<div class="field full"><label>Why is the wrong answer tempting?</label><textarea id="bt-why"></textarea></div></div><div style="margin-top:12px;display:flex;gap:8px;align-items:center"><button class="btn btn-green" id="bt-save">Save draft</button><span class="muted" id="bt-msg"></span></div></div>';
    h += '<h3 class="sub">Drafts ('+S.traps.length+')</h3>';
    if(!S.traps.length) h += '<div class="empty">Nothing yet. Whenever you&rsquo;re ready.</div>';
    S.traps.slice().reverse().forEach(function(t){ h += '<div class="log"><div class="h"><b>'+esc(t.topic)+'</b><span class="muted">'+fmtD(t.t)+' · '+(t.sent?'copied to send':'draft')+'</span></div><div>'+esc(t.stem)+'</div><div class="muted" style="margin-top:4px">Correct: <b>'+esc(t.ans)+'</b> · Tempting: <b>'+esc(t.dis)+'</b></div><div class="why">'+esc(t.why)+'</div>'+(t.sent?'':'<button class="btn btn-sm btn-gold" data-send="'+t.t+'">Copy to send</button>')+'</div>'; });
    $('v-build').innerHTML = h;
    $('bt-save').onclick=function(){ if(!$('bt-stem').value.trim()){ $('bt-msg').textContent='Write the question first.'; return; } S.traps.push({ t:now(), topic:$('bt-topic').value, stem:$('bt-stem').value.trim(), ans:$('bt-ans').value.trim(), dis:$('bt-dis').value.trim(), why:$('bt-why').value.trim() }); save(); renderBuild(); };
    document.querySelectorAll('[data-send]').forEach(function(b){ b.onclick=function(){ var t=S.traps.find(function(x){ return String(x.t)===b.dataset.send; }); navigator.clipboard.writeText(JSON.stringify(t,null,2)).then(function(){ t.sent=true; save(); renderBuild(); }); }; });
}


/* ============================================================ PRACTICE TEST ============================================================ */
var ptPick = {};
function renderPTest(){
    var n = Object.keys(ptPick).length;
    var h = '<h2 class="sec">Practice Test</h2><p class="muted" style="margin-bottom:14px">Pick what you want on the test and go. Timed, mixed up, no feedback until the end &mdash; just like the real thing. Your results and the solutions are waiting when you finish.</p>';
    h += '<div class="toolbar">';
    [['all','Everything'],['orig','Originals only'],['var','Variations only'],['none','Clear']].forEach(function(f){ h += '<button class="chip" data-pt="'+f[0]+'">'+f[1]+'</button>'; });
    h += '<span style="flex:1"></span><button class="btn btn-green" id="pt-start"'+(n?'':' disabled')+'>&#9654; Start test ('+n+')</button></div><p class="muted" style="margin:-6px 0 12px;font-size:13px">Click any question to see it in full before you decide.</p>';
    TOPICS.forEach(function(t){
        var ps = PROBLEMS.filter(function(p){ return p.topic===t; });
        h += '<div class="topic"><div class="th"><span>'+esc(t)+'</span><span><label style="font-weight:500;font-size:12.5px;cursor:pointer"><input type="checkbox" data-pt-topic="'+esc(t)+'"'+(ps.every(function(p){return ptPick[p.id];})?' checked':'')+'> whole topic</label></span></div>';
        ps.forEach(function(p){ var a=S.att[p.id]; h += '<div class="prow" style="grid-template-columns:auto 1fr auto auto"><input type="checkbox" data-pt-pick="'+p.id+'"'+(ptPick[p.id]?' checked':'')+'><span class="stem" data-expand="'+p.id+'" title="Click to show the full question"><span class="v'+(p.variant?'':' orig')+'">'+(p.variant?'variation '+p.variant:'original')+'</span> &nbsp;'+esc(stemPreview(p))+(p.figure?' <span class="figmark" title="Has a figure">&#128208; figure</span>':'')+'</span><span class="badge tb-'+p.type+'">'+({qc:'QC',mc:'MC',ma:'Select all',ne:'Numeric'})[p.type]+'</span><span><span class="pip b'+(a?a.box:0)+'"></span> <span class="meta">'+boxName(a?a.box:0)+'</span></span></div><div class="pfull" style="display:none"></div>'; });
        h += '</div>';
    });
    $('v-ptest').innerHTML = h;
    wireExpand();
    document.querySelectorAll('[data-pt]').forEach(function(b){ b.onclick=function(){ var f=b.dataset.pt; ptPick={}; if(f!=='none') PROBLEMS.forEach(function(p){ if(f==='all'||(f==='orig'&&p.variant===0)||(f==='var'&&p.variant>0)) ptPick[p.id]=1; }); renderPTest(); }; });
    document.querySelectorAll('[data-pt-topic]').forEach(function(c){ c.onchange=function(){ PROBLEMS.filter(function(p){ return p.topic===c.dataset.ptTopic; }).forEach(function(p){ if(c.checked) ptPick[p.id]=1; else delete ptPick[p.id]; }); renderPTest(); }; });
    document.querySelectorAll('[data-pt-pick]').forEach(function(c){ c.onchange=function(){ if(c.checked) ptPick[c.dataset.ptPick]=1; else delete ptPick[c.dataset.ptPick]; renderPTest(); }; });
    $('pt-start').onclick=function(){ var ids=Object.keys(ptPick); ptPick={}; show('session'); startSession('test', ids, false); };
}


/* ============================================================ BACKUP ============================================================ */
function exportAll(){
    var out = { app:'lcc-revision-bank-practice', version:2, student:CFG.slug, exportedAt:new Date().toISOString(), data:S };
    var blob = new Blob([JSON.stringify(out, null, 2)], {type:'application/json'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = CFG.slug+'-backup-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function importAll(ev){
    var f = ev.target.files && ev.target.files[0]; if(!f) return;
    var r = new FileReader();
    r.onload = function(){
        try { var d = JSON.parse(r.result); if(!d || !d.data || !d.data.att) throw new Error('not a backup file');
              if(!confirm('Replace everything in this browser with the backup from '+(d.exportedAt||'').slice(0,10)+'?')) return;
              S = Object.assign(fresh(), d.data); save(); show('home'); alert('Backup restored.'); }
        catch(e){ alert('Could not read that file: '+e.message); }
    };
    r.readAsText(f); ev.target.value='';
}

/* ============================================================ DEMO DATA ============================================================ */
function loadDemo(){
    S = fresh(); var t0 = now()-16*DAY;
    function add(id, daysAgo, correct, conf, s, mode){ if(!byId[id]) return; var a=att(id); a.history.push({t:now()-daysAgo*DAY, correct:correct, conf:conf, s:s, mode:mode}); }
    /* cold re-attempt 16 days ago */
    [['qc-extremes-0',false,'sure'],['seq-exp-0',false,'pretty'],['interest-0',false,'sure'],['angles-0',false,'guess'],['units-0',false,'sure'],['digits-0',true,'pretty'],['remainder-0',false,'guess'],['algfrac-0',false,'pretty']].forEach(function(x){ add(x[0],16,x[1],x[2],90+Math.round(Math.random()*60),'learn'); });
    /* later sessions */
    [['qc-extremes-0',12,true,'pretty'],['interest-0',12,true,'sure'],['units-0',12,false,'sure'],['angles-0',12,true,'pretty'],['qc-extremes-1',10,true,'sure'],['interest-1',10,true,'sure'],['units-1',10,true,'pretty'],['units-0',9,true,'pretty'],['seq-exp-0',8,true,'sure'],['remainder-0',8,true,'sure'],['algfrac-0',7,false,'sure'],['algfrac-1',7,false,'pretty'],['digits-1',6,true,'sure'],['qc-extremes-0',5,true,'sure'],['interest-0',4,true,'sure'],['seq-exp-1',3,true,'pretty'],['remainder-1',3,true,'sure'],['units-0',2,true,'sure'],['algfrac-0',1,true,'pretty']].forEach(function(x){ add(x[0],x[1],x[2],x[3],60+Math.round(Math.random()*70),'test'); });
    /* set boxes */
    var boxes = {'qc-extremes-0':4,'qc-extremes-1':3,'seq-exp-0':3,'seq-exp-1':2,'interest-0':4,'interest-1':3,'angles-0':2,'angles-1':0,'units-0':3,'units-1':2,'digits-0':2,'digits-1':2,'remainder-0':3,'remainder-1':2,'algfrac-0':1,'algfrac-1':1};
    Object.keys(boxes).forEach(function(id){ if(!byId[id]) return; var a=att(id); a.box=boxes[id]; var la=a.history.length?a.history[a.history.length-1].t:now(); a.due = la + ({0:0,1:1,2:3,3:7,4:30}[a.box])*DAY; });
    S.rules = { 'QC: extremes of a range':{text:'Ranges in a QC mean TEST THE ENDPOINTS, not pick D.', t:now()-15*DAY}, 'Unit conversion for area':{text:'Convert the sides first, then multiply. Area = factor squared.', t:now()-11*DAY}, 'Algebraic fractions from a story':{text:'Distribute to EVERY term, then plug in n=6 to check.', t:now()-6*DAY} };
    S.log = [ {t:now()-15*DAY,pid:'qc-extremes-0',err:'Trap / distractor',why:'Seeing two ranges made me feel like nothing was pinned down, so D felt like the honest answer.',what:'Read the ranges, never computed x−y, chose D in about 20 seconds.',rule:'Ranges in a QC mean TEST THE ENDPOINTS, not pick D.'},
              {t:now()-15*DAY,pid:'interest-0',err:'Content gap',why:'4% is between 5% and 3%, so averaging felt natural and gave a clean number.',what:'Took 4% of 6400, halved it.',rule:''},
              {t:now()-11*DAY,pid:'units-0',err:'Trap / distractor',why:'I saw inches and feet and divided by 12 once. 4/3 was sitting right there as a reward.',what:'12–36 in² → divided by 12 → 1–3 → picked 4/3.',rule:'Convert the sides first, then multiply. Area = factor squared.'},
              {t:now()-7*DAY,pid:'algfrac-0',err:'Careless slip',why:'3n−3 looked like the tidiest numerator and I had a 3 and an n floating around.',what:'2(n−3) became 2n−3.',rule:'Distribute to EVERY term, then plug in n=6 to check.'},
              {t:now()-16*DAY,pid:'remainder-0',err:'Pacing / rushed',why:'Divisor changed from 12 to 8 and I panicked, picked something odd.',what:'Guessed.',rule:''} ];
    S.log = S.log.filter(function(e){ return byId[e.pid]; });
    save();
}
if(TUTOR){ $('demo-on').onclick=function(){ loadDemo(); show('home'); }; $('demo-off').onclick=function(){ if(confirm('Reset all of '+CFG.name+'\'s data in this browser?')){ S=fresh(); save(); show('home'); } }; }
    S.log = S.log || [];
show('home');

})();
