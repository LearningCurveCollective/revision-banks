/* ============================================================
   Learning Curve Collective — Revision Bank engine
   Shared by every student folder. Edit THIS file to upgrade
   every bank at once. Student-specific data lives in:
     <slug>/index.html  →  window.RBANK  (name, slug, tagline)
     <slug>/seed.js     →  window.RBANK_SEED (questions you author)
   The student's own misses, mastery and photos live in THEIR
   browser (localStorage + IndexedDB) and never touch GitHub.
   ============================================================ */
(function(){
'use strict';

var CFG = Object.assign({ name:'Student', slug:'student', tagline:'SAT PREP', pronoun:null }, window.RBANK || {});
var SEED = Array.isArray(window.RBANK_SEED) ? window.RBANK_SEED : [];
var NAME = CFG.name;
var ENGINE_DIR = (function(){
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/[^\/]*$/, '') : '../_engine/';
})();

function esc(s){ return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ============ Markup ============ */
function markup(){
    var N = esc(NAME);
    return ''
+ '<div class="header">'
+ '  <div class="header-left">'
+ '    <div class="header-logo"><a href="https://learningcurvecollective.com" target="_blank" rel="noopener" aria-label="Learning Curve Collective home" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;"><img src="'+ENGINE_DIR+'logo.png" alt="Learning Curve Collective"></a></div>'
+ '    <div class="header-text"><h1>'+N+' &mdash; Revision Bank</h1><div class="subtitle">EVERY MISS, TRACKED &amp; RETESTED</div></div>'
+ '  </div>'
+ '  <div class="header-right">'
+ '    <a href="https://learningcurvecollective.com" target="_blank" rel="noopener" style="font-family:\'Switzer\',\'Space Grotesk\',sans-serif;font-size:18px;font-weight:700;letter-spacing:0.5px;color:white;text-decoration:none;">Learning Curve Collective</a>'
+ '    <div class="subtitle" style="margin-top:4px;">'+esc(CFG.tagline)+'</div>'
+ '  </div>'
+ '</div>'
+ '<div class="container">'
+ '  <div class="tab-buttons">'
+ '    <button class="tab-button active" data-group="core" data-tab="math">&#128208; Math</button>'
+ '    <button class="tab-button" data-group="practice" data-tab="verbal">&#128214; Verbal</button>'
+ '    <button class="tab-button" data-group="techniques" data-tab="add">&#10133; Add a Miss</button>'
+ '    <button class="tab-button" data-group="practice" data-tab="review">&#127919; Review</button>'
+ '    <button class="tab-button" data-group="core" data-tab="insights">&#128202; Insights</button>'
+ '  </div>'
+ '  <div id="store-banner" class="store-banner"></div>'
+ bankTab('math', '&#128208;', 'Math Bank', 'fm', 'math')
+ bankTab('verbal', '&#128214;', 'Verbal Bank', 'fv', 'verbal')
+ '  <div id="tab-add" class="tab-content">'
+ '    <div class="section-header"><div class="section-number">&#10133;</div><h2 id="add-title">Add a Miss</h2></div>'
+ '    <div class="card" style="border-left-color:var(--green-dark);">'
+ '      <div class="form-grid">'
+ '        <div class="field"><label>Subject</label><select id="in-subject"><option value="Math">Math</option><option value="Reading &amp; Writing">Reading &amp; Writing</option></select></div>'
+ '        <div class="field"><label>Topic / skill</label><input type="text" id="in-topic" list="topic-list" placeholder="e.g. Right-triangle trig">'
+ '          <datalist id="topic-list"><option>Algebra</option><option>Advanced Math</option><option>Geometry &amp; Trigonometry</option><option>Problem-Solving &amp; Data</option><option>Information &amp; Ideas</option><option>Craft &amp; Structure</option><option>Words in Context</option><option>Expression of Ideas</option><option>Standard English Conventions</option></datalist></div>'
+ '        <div class="field full"><label>Question</label><textarea id="in-qtext" placeholder="Paste or type the question. LaTeX works: wrap inline math in $&hellip;$ and display math in $$&hellip;$$"></textarea><span class="hint">Tip: use $x^2 + 3x - 4$ for inline math.</span></div>'
+ '        <div class="field full"><label>Question image <span style="font-weight:500;text-transform:none;">(optional &mdash; screenshot a chart or figure)</span></label><input type="file" id="in-image" accept="image/*">'
+ '          <div id="img-preview-wrap" style="display:none;margin-top:8px;"><img id="img-preview" class="qimg" style="max-height:220px;"><button class="btn btn-ghost btn-sm" type="button" id="btn-clear-img">Remove image</button></div></div>'
+ '        <div class="field"><label>Correct answer</label><input type="text" id="in-correct" placeholder="e.g. B  or  42  or  7/2"></div>'
+ '        <div class="field"><label>What '+N+' put</label><input type="text" id="in-given" placeholder="e.g. C  or  (blank)  or  24"></div>'
+ '        <div class="field"><label>Why it was missed</label><select id="in-err"><option>Content gap</option><option>Pacing / ran out of time</option><option>Careless slip</option><option>Misread question</option><option>Guessed</option></select></div>'
+ '        <div class="field"><label>Source</label><input type="text" id="in-source" placeholder="e.g. CB Practice Test 10, Q22"></div>'
+ '        <div class="field full"><label>The trap / the fix</label><textarea id="in-trap" placeholder="Name the misconception or trap, and the one thing to remember."></textarea></div>'
+ '      </div>'
+ '      <div class="form-actions"><button class="btn btn-green" id="btn-save"><span id="save-label">Add to bank</span></button><button class="btn btn-ghost" id="cancel-edit" style="display:none;">Cancel edit</button><span id="save-msg" style="font-size:13px;color:var(--green-light);font-weight:600;"></span></div>'
+ '    </div>'
+ '  </div>'
+ '  <div id="tab-review" class="tab-content">'
+ '    <div class="section-header"><div class="section-number">&#127919;</div><h2>Review Mode</h2></div>'
+ '    <div class="toolbar"><select id="rv-subject"><option value="">All subjects</option><option value="Math">Math</option><option value="Reading &amp; Writing">Reading &amp; Writing</option></select><select id="rv-scope"><option value="review">Only "needs review"</option><option value="all">Everything</option></select><button class="btn btn-brown" id="btn-start-review">&#9654; Start</button></div>'
+ '    <div id="review-area"></div>'
+ '  </div>'
+ '  <div id="tab-insights" class="tab-content">'
+ '    <div class="section-header"><div class="section-number">&#128202;</div><h2>Insights</h2></div>'
+ '    <div id="insights-area"></div>'
+ '    <div class="card" style="border-left-color:var(--green-dark);margin-top:24px;">'
+ '      <h3 style="font-family:\'Switzer\',\'Space Grotesk\',sans-serif;color:var(--green-dark);margin-bottom:6px;">Backup &amp; transfer</h3>'
+ '      <p style="font-size:13.5px;color:var(--text-medium);margin-bottom:12px;">Your bank saves automatically in <em>this browser</em>. Switching devices or clearing browser data will not carry it over &mdash; export a backup now and then, and import it on the new device.</p>'
+ '      <div style="display:flex;gap:10px;flex-wrap:wrap;"><button class="btn btn-gold" id="btn-export">&#11015; Export backup (.json)</button><label class="btn btn-ghost" style="cursor:pointer;">&#11014; Import backup<input type="file" id="in-import" accept="application/json,.json" style="display:none;"></label></div>'
+ '    </div>'
+ '  </div>'
+ '</div>'
+ '<div class="footer">'
+ '  <p><a href="https://learningcurvecollective.com" target="_blank" rel="noopener" style="color:white;text-decoration:none;font-family:\'Switzer\',\'Space Grotesk\',sans-serif;font-weight:700;letter-spacing:0.5px;">Learning Curve Collective</a>: '+N+' &mdash; Revision Bank</p>'
+ '  <p style="font-size:12px;margin-top:10px;"><a href="https://learningcurvecollective.com" target="_blank" rel="noopener" style="color:var(--gold-light);text-decoration:none;">learningcurvecollective.com</a></p>'
+ '</div>';
}
function bankTab(id, icon, title, pre, key){
    return ''
+ '<div id="tab-'+id+'" class="tab-content'+(id==='math'?' active':'')+'">'
+ '  <div class="section-header"><div class="section-number">'+icon+'</div><h2>'+title+'</h2></div>'
+ '  <div class="toolbar"><input type="text" id="'+pre+'-search" placeholder="Search question, topic, trap&hellip;">'
+ '    <select id="'+pre+'-err"><option value="">All miss types</option><option>Content gap</option><option>Pacing / ran out of time</option><option>Careless slip</option><option>Misread question</option><option>Guessed</option></select>'
+ '    <select id="'+pre+'-status"><option value="">All statuses</option><option value="review">Needs review</option><option value="mastered">Mastered</option></select>'
+ '    <span class="count-pill" id="'+key+'-count">0</span></div>'
+ '  <div id="'+key+'-list"></div>'
+ '</div>';
}

/* ============ Storage layer (localStorage + IndexedDB, per student) ============ */
var IDX_KEY = 'rbank:'+CFG.slug+':index';
var APPLIED_KEY = 'rbank:'+CFG.slug+':appliedSeeds';
var DB_NAME = 'rbank-'+CFG.slug;
var memIndex = [], memImg = {}, memApplied = [];
var lsOK = (function(){ try { var k='rbank:test'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; } catch(e){ return false; } })();

function lsGet(k, dflt){ if(!lsOK) return dflt; try { var v = localStorage.getItem(k); return v==null ? dflt : JSON.parse(v); } catch(e){ return dflt; } }
function lsSet(k, v){ if(!lsOK) return false; try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ console.error('localStorage full?', e); return false; } }

var dbPromise = null;
function db(){
    if(dbPromise) return dbPromise;
    dbPromise = new Promise(function(res){
        if(!window.indexedDB) return res(null);
        try {
            var req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = function(){ req.result.createObjectStore('img'); };
            req.onsuccess = function(){ res(req.result); };
            req.onerror = function(){ res(null); };
        } catch(e){ res(null); }
    });
    return dbPromise;
}
function idb(mode, fn){
    return db().then(function(d){
        if(!d) return null;
        return new Promise(function(res){
            var tx = d.transaction('img', mode), st = tx.objectStore('img'), r = fn(st);
            tx.oncomplete = function(){ res(r && 'result' in r ? r.result : true); };
            tx.onerror = tx.onabort = function(){ res(null); };
        });
    });
}

async function loadIndex(){ return lsOK ? lsGet(IDX_KEY, []) : memIndex.slice(); }
async function saveIndex(arr){ if(!lsSet(IDX_KEY, arr)) memIndex = arr.slice(); }
async function getApplied(){ return lsOK ? lsGet(APPLIED_KEY, []) : memApplied.slice(); }
async function setApplied(arr){ if(!lsSet(APPLIED_KEY, arr)) memApplied = arr.slice(); }
async function getImage(id){ var r = await idb('readonly', function(st){ return st.get(id); }); return (r==null ? (memImg[id]||null) : r); }
async function setImage(id, data){ var ok = await idb('readwrite', function(st){ st.put(data, id); }); if(!ok) memImg[id] = data; }
async function delImage(id){ await idb('readwrite', function(st){ st.delete(id); }); delete memImg[id]; }

/* ============ State ============ */
var entries = [], pendingImage = null, editingId = null, imgCache = {};
function uid(){ return 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function typeset(el){ if(window.MathJax && MathJax.typesetPromise){ MathJax.typesetPromise(el?[el]:undefined).catch(function(){}); } }
function $(id){ return document.getElementById(id); }

/* ============ Tabs ============ */
function switchTab(name, btn){
    document.querySelectorAll('.tab-content').forEach(function(t){ t.classList.remove('active'); });
    document.querySelectorAll('.tab-button').forEach(function(b){ b.classList.remove('active'); });
    $('tab-'+name).classList.add('active');
    if(btn) btn.classList.add('active');
    if(name==='insights') renderInsights();
    setTimeout(function(){ typeset($('tab-'+name)); }, 60);
}

/* ============ Add / edit ============ */
function onImagePick(ev){
    var f = ev.target.files && ev.target.files[0]; if(!f) return;
    var reader = new FileReader();
    reader.onload = function(){ pendingImage = reader.result; $('img-preview').src = pendingImage; $('img-preview-wrap').style.display = 'block'; };
    reader.readAsDataURL(f);
}
function clearPendingImage(){ pendingImage = null; $('in-image').value = ''; $('img-preview-wrap').style.display = 'none'; }
function resetForm(){
    editingId = null;
    ['in-topic','in-qtext','in-correct','in-given','in-source','in-trap'].forEach(function(id){ $(id).value=''; });
    $('in-subject').value = 'Math'; $('in-err').selectedIndex = 0;
    clearPendingImage();
    $('save-label').textContent = 'Add to bank'; $('add-title').textContent = 'Add a Miss'; $('cancel-edit').style.display = 'none';
}
async function saveEntry(){
    var qtext = $('in-qtext').value.trim(), topic = $('in-topic').value.trim();
    if(!qtext && !pendingImage && editingId===null){ flashSave('Add a question or an image first.', true); return; }
    var data = { subject:$('in-subject').value, topic:topic, qtext:qtext, correct:$('in-correct').value.trim(), given:$('in-given').value.trim(), err:$('in-err').value, source:$('in-source').value.trim(), trap:$('in-trap').value.trim() };
    if(editingId){
        var e = entries.find(function(x){ return x.id===editingId; });
        if(e){ Object.assign(e, data); if(pendingImage){ e.hasImage = true; await setImage(e.id, pendingImage); imgCache[e.id] = pendingImage; } }
        flashSave('Updated.');
    } else {
        var id = uid();
        var entry = Object.assign({ id:id, ts:Date.now(), status:'review', hasImage:!!pendingImage }, data);
        entries.unshift(entry);
        if(pendingImage){ await setImage(id, pendingImage); imgCache[id] = pendingImage; }
        flashSave('Added to the bank.');
    }
    await saveIndex(entries); resetForm(); renderBank();
}
function flashSave(msg, isErr){ var el = $('save-msg'); el.textContent = msg; el.style.color = isErr ? '#C0392B' : 'var(--green-light)'; setTimeout(function(){ el.textContent=''; }, 2600); }
async function editEntry(id){
    var e = entries.find(function(x){ return x.id===id; }); if(!e) return;
    editingId = id;
    $('in-subject').value = e.subject; $('in-topic').value = e.topic||''; $('in-qtext').value = e.qtext||''; $('in-correct').value = e.correct||'';
    $('in-given').value = e.given||''; $('in-err').value = e.err||'Content gap'; $('in-source').value = e.source||''; $('in-trap').value = e.trap||'';
    clearPendingImage();
    if(e.hasImage){ var img = imgCache[e.id] || await getImage(e.id); if(img){ pendingImage = img; imgCache[e.id]=img; $('img-preview').src = img; $('img-preview-wrap').style.display='block'; } }
    $('save-label').textContent = 'Save changes'; $('add-title').textContent = 'Edit Miss'; $('cancel-edit').style.display = 'inline-flex';
    document.querySelector('.tab-button[data-tab="add"]').click();
    window.scrollTo({top:0, behavior:'smooth'});
}
async function deleteEntry(id){
    if(!confirm('Delete this question from the bank? This cannot be undone.')) return;
    var e = entries.find(function(x){ return x.id===id; });
    if(e && e.hasImage) await delImage(id);
    entries = entries.filter(function(x){ return x.id!==id; }); delete imgCache[id];
    await saveIndex(entries); renderBank();
}
async function toggleMastered(id){
    var e = entries.find(function(x){ return x.id===id; }); if(!e) return;
    e.status = (e.status==='mastered') ? 'review' : 'mastered';
    await saveIndex(entries); renderBank();
}

/* ============ Bank render ============ */
function subjBadgeClass(s){ return s==='Math' ? 'badge-subj-math' : 'badge-subj-rw'; }
function firstLine(t, n){ t = (t||'').replace(/\s+/g,' ').trim(); n=n||120; return t.length>n ? t.slice(0,n)+'…' : (t||'(image question)'); }
function readBankControls(pre){ return { q:($(pre+'-search').value||'').toLowerCase().trim(), err:$(pre+'-err').value, st:$(pre+'-status').value }; }
function bankItems(subject, ctrl){
    return entries.filter(function(e){
        if(e.subject!==subject) return false;
        if(ctrl.err && e.err!==ctrl.err) return false;
        if(ctrl.st==='mastered' && e.status!=='mastered') return false;
        if(ctrl.st==='review' && e.status==='mastered') return false;
        if(ctrl.q){ var hay = [e.qtext,e.topic,e.trap,e.source,e.correct,e.given].join(' ').toLowerCase(); if(hay.indexOf(ctrl.q)===-1) return false; }
        return true;
    });
}
function entryCardHTML(e){
    var h = '<div class="entry'+(e.status==='mastered'?' mastered':'')+'" id="entry-'+e.id+'">';
    h += '<div class="entry-head" data-toggle="'+e.id+'"><div class="entry-q"><div class="entry-badges">';
    h += '<span class="badge '+subjBadgeClass(e.subject)+'">'+esc(e.subject)+'</span>';
    if(e.topic) h += '<span class="badge badge-topic">'+esc(e.topic)+'</span>';
    h += '<span class="badge badge-err">'+esc(e.err)+'</span>';
    if(e.status==='mastered') h += '<span class="badge badge-mastered">&#10003; Mastered</span>';
    h += '</div><div class="qpreview">'+esc(firstLine(e.qtext,140))+(e.hasImage?' &#128247;':'')+'</div>';
    h += '<div class="entry-meta">'+(e.source?esc(e.source)+' &bull; ':'')+new Date(e.ts).toLocaleDateString()+'</div>';
    h += '</div><div class="entry-arrow">&#9654;</div></div>';
    h += '<div class="entry-body"><div class="entry-full" id="full-'+e.id+'"></div></div></div>';
    return h;
}
var BANK_TABS = [
    { subject:'Math', pre:'fm', list:'math-list', count:'math-count', emptyH:'No math misses yet.', emptyP:'Use <strong>Add a Miss</strong> to log a wrong math question &mdash; it&rsquo;ll land here.' },
    { subject:'Reading & Writing', pre:'fv', list:'verbal-list', count:'verbal-count', emptyH:'No verbal misses yet.', emptyP:'Log a Reading &amp; Writing question in <strong>Add a Miss</strong> and it&rsquo;ll show up here.' }
];
function renderBankFor(cfg){
    var list = $(cfg.list); if(!list) return;
    var total = entries.filter(function(e){ return e.subject===cfg.subject; }).length;
    var items = bankItems(cfg.subject, readBankControls(cfg.pre));
    $(cfg.count).textContent = items.length + (total!==items.length ? ' / '+total : '');
    if(total===0){ list.innerHTML = '<div class="empty"><h3>'+cfg.emptyH+'</h3><p>'+cfg.emptyP+'</p></div>'; return; }
    if(items.length===0){ list.innerHTML = '<div class="empty"><p>No questions match those filters.</p></div>'; return; }
    list.innerHTML = items.map(entryCardHTML).join('');
}
function renderBank(){ BANK_TABS.forEach(renderBankFor); }
async function toggleEntry(id){
    var el = $('entry-'+id); if(!el) return;
    var wasOpen = el.classList.contains('open'); el.classList.toggle('open');
    if(!wasOpen){
        var e = entries.find(function(x){ return x.id===id; }), full = $('full-'+id);
        if(full && !full.dataset.loaded){ full.innerHTML = await buildFull(e); full.dataset.loaded = '1'; typeset(full); }
    }
}
async function buildFull(e){
    var h = '';
    if(e.qtext) h += '<div class="qblock">'+esc(e.qtext)+'</div>';
    if(e.hasImage){ var img = imgCache[e.id] || await getImage(e.id); if(img){ imgCache[e.id]=img; h += '<img class="qimg" src="'+img+'">'; } }
    h += '<div class="ans-row"><div class="ans-chip ans-correct"><div class="ans-label">Correct</div><div class="ans-val">'+(e.correct?esc(e.correct):'&mdash;')+'</div></div>';
    h += '<div class="ans-chip ans-given"><div class="ans-label">'+esc(NAME)+' put</div><div class="ans-val">'+(e.given?esc(e.given):'&mdash;')+'</div></div></div>';
    if(e.trap) h += '<div class="trap-box"><div class="trap-label">The trap / the fix</div>'+esc(e.trap)+'</div>';
    h += '<div class="entry-actions">';
    h += '<button class="btn '+(e.status==='mastered'?'btn-ghost':'btn-green')+' btn-sm" data-act="master" data-id="'+e.id+'">'+(e.status==='mastered'?'&#8634; Move back to review':'&#10003; Mark mastered')+'</button>';
    h += '<button class="btn btn-ghost btn-sm" data-act="edit" data-id="'+e.id+'">&#9998; Edit</button>';
    h += '<button class="btn btn-danger btn-sm" data-act="delete" data-id="'+e.id+'">&#128465; Delete</button></div>';
    return h;
}

/* ============ Review mode ============ */
var rvQueue = [], rvPos = 0;
function startReview(){
    var subj = $('rv-subject').value, scope = $('rv-scope').value;
    rvQueue = entries.filter(function(e){ if(subj && e.subject!==subj) return false; if(scope==='review' && e.status==='mastered') return false; return true; });
    for(var i=rvQueue.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=rvQueue[i]; rvQueue[i]=rvQueue[j]; rvQueue[j]=t; }
    rvPos = 0;
    if(rvQueue.length===0){ $('review-area').innerHTML = '<div class="empty"><p>Nothing to review with those settings. Add some misses or switch to &ldquo;Everything.&rdquo;</p></div>'; return; }
    showReviewCard();
}
async function showReviewCard(){
    var area = $('review-area');
    if(rvPos >= rvQueue.length){
        area.innerHTML = '<div class="review-card" style="text-align:center;"><h3 style="font-family:\'Switzer\',sans-serif;color:var(--green-dark);font-size:22px;margin-bottom:8px;">&#127881; Deck complete!</h3><p style="color:var(--text-medium);">You went through '+rvQueue.length+' question'+(rvQueue.length===1?'':'s')+'. Anything marked &ldquo;still shaky&rdquo; stays in the review pile.</p><div style="margin-top:16px;"><button class="btn btn-green" id="btn-start-review-again">Run it again</button></div></div>';
        return;
    }
    var e = rvQueue[rvPos];
    var h = '<div class="review-card"><div class="review-progress">'+(rvPos+1)+' of '+rvQueue.length+'</div>';
    h += '<div class="entry-badges" style="justify-content:center;margin-bottom:12px;"><span class="badge '+subjBadgeClass(e.subject)+'">'+esc(e.subject)+'</span>'+(e.topic?'<span class="badge badge-topic">'+esc(e.topic)+'</span>':'')+'</div>';
    if(e.qtext) h += '<div class="qblock" style="font-size:15.5px;">'+esc(e.qtext)+'</div>';
    if(e.hasImage){ var img = imgCache[e.id] || await getImage(e.id); if(img){ imgCache[e.id]=img; h += '<img class="qimg" src="'+img+'">'; } }
    h += '<div style="text-align:center;margin-top:16px;"><button class="btn btn-gold" id="btn-reveal">Show answer &amp; trap</button></div>';
    h += '<div class="review-reveal" id="rv-reveal"><div class="ans-row"><div class="ans-chip ans-correct"><div class="ans-label">Correct</div><div class="ans-val">'+(e.correct?esc(e.correct):'&mdash;')+'</div></div>';
    h += '<div class="ans-chip ans-given"><div class="ans-label">'+esc(NAME)+' put</div><div class="ans-val">'+(e.given?esc(e.given):'&mdash;')+'</div></div></div>';
    if(e.trap) h += '<div class="trap-box"><div class="trap-label">The trap / the fix</div>'+esc(e.trap)+'</div>';
    h += '<div class="review-nav"><button class="btn btn-green" data-rv="1" data-id="'+e.id+'">&#10003; Got it &mdash; mastered</button><button class="btn btn-brown" data-rv="0" data-id="'+e.id+'">&#8634; Still shaky</button></div></div></div>';
    area.innerHTML = h; typeset(area);
}
async function reviewMark(id, mastered){
    var e = entries.find(function(x){ return x.id===id; });
    if(e){ e.status = mastered ? 'mastered' : 'review'; await saveIndex(entries); }
    rvPos++; showReviewCard();
}

/* ============ Insights ============ */
function renderInsights(){
    var area = $('insights-area');
    if(entries.length===0){ area.innerHTML = '<div class="empty"><p>Add a few misses and patterns will show up here.</p></div>'; return; }
    var total = entries.length, mastered = entries.filter(function(e){ return e.status==='mastered'; }).length, review = total-mastered;
    var h = '<div class="stat-grid">';
    h += '<div class="stat-tile"><div class="stat-num">'+total+'</div><div class="stat-label">Total logged</div></div>';
    h += '<div class="stat-tile brown"><div class="stat-num">'+review+'</div><div class="stat-label">Needs review</div></div>';
    h += '<div class="stat-tile green"><div class="stat-num">'+mastered+'</div><div class="stat-label">Mastered</div></div>';
    h += '<div class="stat-tile"><div class="stat-num">'+(total?Math.round(mastered/total*100):0)+'%</div><div class="stat-label">Mastery</div></div></div>';
    h += barSection('By miss type', countBy(function(e){ return e.err; }), total, '#8B5E3C');
    h += barSection('By topic', countBy(function(e){ return e.topic || 'Untagged'; }), total, 'var(--gold)');
    h += barSection('By subject', countBy(function(e){ return e.subject; }), total, 'var(--green-light)');
    area.innerHTML = h;
}
function countBy(fn){ var m = {}; entries.forEach(function(e){ var k = fn(e); m[k] = (m[k]||0)+1; }); return Object.keys(m).map(function(k){ return {k:k, n:m[k]}; }).sort(function(a,b){ return b.n-a.n; }); }
function barSection(title, rows, total, color){
    var h = '<div class="card"><h3 style="font-family:\'Switzer\',\'Space Grotesk\',sans-serif;color:var(--green-dark);margin-bottom:14px;">'+title+'</h3>';
    rows.forEach(function(r){ var w = total?Math.round(r.n/total*100):0; h += '<div class="bar-row"><div class="bar-top"><span>'+esc(r.k)+'</span><span>'+r.n+'</span></div><div class="bar-track"><div class="bar-fill" style="width:'+Math.max(w,4)+'%;background:'+color+';">'+w+'%</div></div></div>'; });
    return h+'</div>';
}

/* ============ Export / import ============ */
async function exportBank(){
    var out = { app:'lcc-revision-bank', version:1, student:CFG.slug, exportedAt:new Date().toISOString(), entries:[] };
    for(var i=0;i<entries.length;i++){ var e = Object.assign({}, entries[i]); if(e.hasImage){ var img = imgCache[e.id] || await getImage(e.id); if(img) e.image = img; } out.entries.push(e); }
    var blob = new Blob([JSON.stringify(out, null, 2)], {type:'application/json'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = CFG.slug+'-revision-bank-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function importBank(ev){
    var f = ev.target.files && ev.target.files[0]; if(!f) return;
    var reader = new FileReader();
    reader.onload = async function(){
        try {
            var data = JSON.parse(reader.result), incoming = data.entries || [];
            if(!Array.isArray(incoming)){ alert('That file does not look like a revision-bank backup.'); return; }
            var added = 0, updated = 0;
            for(var i=0;i<incoming.length;i++){
                var e = Object.assign({}, incoming[i]); var img = e.image; delete e.image;
                var existing = e.id && entries.find(function(x){ return x.id===e.id; });
                if(existing){ Object.assign(existing, e); if(img){ existing.hasImage = true; await setImage(existing.id, img); imgCache[existing.id]=img; } updated++; continue; }
                if(!e.id) e.id = uid();
                if(typeof e.ts!=='number') e.ts = Date.now();
                if(!e.status) e.status = 'review';
                e.hasImage = !!img;
                if(img){ await setImage(e.id, img); imgCache[e.id]=img; }
                entries.push(e); added++;
            }
            entries.sort(function(a,b){ return b.ts-a.ts; });
            await saveIndex(entries); renderBank();
            alert('Imported '+added+' new question'+(added===1?'':'s')+(updated?' and updated '+updated:'')+'.');
        } catch(err){ alert('Could not read that file: '+err.message); }
    };
    reader.readAsText(f); ev.target.value = '';
}

/* ============ Seed merge ============ */
/* Only seed ids never applied before get merged in, so the bank grows across
   pushes without duplicating or resurrecting anything the student deleted. */
async function maybeSeed(){
    var idx = await loadIndex() || [], applied = await getApplied(), changed = false;
    for(var i=0;i<SEED.length;i++){
        var s = SEED[i]; if(!s || !s.id) continue;
        if(applied.indexOf(s.id)!==-1) continue;
        if(idx.some(function(e){ return e.id===s.id; })){ applied.push(s.id); changed=true; continue; }
        var c = Object.assign({ ts:Date.now(), status:'review', subject:'Math' }, s);
        var img = c.image; delete c.image;
        if(img){ await setImage(c.id, img); imgCache[c.id]=img; c.hasImage = true; } else if(c.hasImage==null){ c.hasImage = false; }
        idx.unshift(c); applied.push(s.id); changed = true;
    }
    if(changed){ idx.sort(function(a,b){ return (b.ts||0)-(a.ts||0); }); await saveIndex(idx); await setApplied(applied); }
    return idx;
}

/* ============ Events ============ */
function wire(){
    document.querySelectorAll('.tab-button').forEach(function(b){ b.addEventListener('click', function(){ switchTab(b.dataset.tab, b); }); });
    ['fm','fv'].forEach(function(p){ $(p+'-search').addEventListener('input', renderBank); $(p+'-err').addEventListener('change', renderBank); $(p+'-status').addEventListener('change', renderBank); });
    $('in-image').addEventListener('change', onImagePick);
    $('btn-clear-img').addEventListener('click', clearPendingImage);
    $('btn-save').addEventListener('click', saveEntry);
    $('cancel-edit').addEventListener('click', resetForm);
    $('btn-start-review').addEventListener('click', startReview);
    $('btn-export').addEventListener('click', exportBank);
    $('in-import').addEventListener('change', importBank);
    document.addEventListener('click', function(ev){
        var t = ev.target.closest('[data-toggle],[data-act],[data-rv],#btn-reveal,#btn-start-review-again'); if(!t) return;
        if(t.dataset.toggle){ toggleEntry(t.dataset.toggle); return; }
        if(t.dataset.act){ ev.stopPropagation(); var id = t.dataset.id; if(t.dataset.act==='master') toggleMastered(id); else if(t.dataset.act==='edit') editEntry(id); else deleteEntry(id); return; }
        if(t.dataset.rv!=null){ reviewMark(t.dataset.id, t.dataset.rv==='1'); return; }
        if(t.id==='btn-reveal'){ var r = $('rv-reveal'); if(r){ r.classList.add('show'); typeset(r); } return; }
        if(t.id==='btn-start-review-again'){ startReview(); }
    });
}

/* ============ Init ============ */
async function init(){
    var root = $('rbank-app') || document.body;
    root.innerHTML = markup();
    document.title = NAME+' — Revision Bank';
    wire();
    if(!lsOK){
        var b = $('store-banner'); b.className = 'store-banner warn';
        b.innerHTML = '&#9888;&#65039; This browser is blocking local storage (private window?), so new entries won&rsquo;t persist after you close the tab. Use <strong>Export backup</strong> to save your work.';
    }
    entries = await maybeSeed();
    entries.sort(function(a,b){ return (b.ts||0)-(a.ts||0); });
    renderBank();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
