var L='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var R='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
var SLIDES=[
 {v:1,a:'Watch it ',b:'in action',d:'See how a coupon trip comes together, from picking deals to your total at the register.',n:'Watch it in action'},
 {i:1,a:'Browse ',b:'weekly deals',d:"See this week's deals in one place, with BOGO offers, coupons and the Rewards each one earns.",n:'Browse weekly deals'},
 {i:2,a:'Understand ',b:'every deal',d:"See the price, BOGO discount, coupon and Rewards for every deal, and what you'll pay.",n:'Understand every deal'},
 {i:3,a:'Plan your ',b:'trip',d:"Split your trip into transactions and see each one's total and the Rewards it earns.",n:'Plan your trip'},
 {i:4,a:'See your ',b:'trip summary',d:"All your transactions in one place: the total before and after coupons, Rewards used, and your estimated total.",n:'See your trip summary'},
 {i:5,a:'Add your ',b:'own deals',d:"Create custom deals and calculate your estimated totals.",n:'Add your own deals'},
 {i:6,a:'Check off ',b:'as you shop',d:'In the store, check off each deal as it goes in your cart and see how many are left.',n:'Check off as you shop'}
];
function buildLook(box){
  var st=document.createElement('div'); st.className='stage';
  st.innerHTML='<div class="lt"><div class="num"></div><h4></h4><p></p><div class="nb"><button class="cb pv1" type="button" aria-label="Previous">'+L+'</button><button class="cb nx1" type="button" aria-label="Next">'+R+'</button></div></div>'+
    '<div class="media"></div><div class="rt"></div>'+
    '<button class="parr pv2" type="button" aria-label="Previous" style="left:8px">'+L+'</button><button class="parr nx2" type="button" aria-label="Next" style="right:8px">'+R+'</button>';
  box.appendChild(st);
  var dots=document.createElement('div'); dots.className='dots'; box.appendChild(dots);
  var rt=st.querySelector('.rt'), media=st.querySelector('.media'), cur=0;
  SLIDES.forEach(function(s,k){
    var b=document.createElement('button'); b.type='button'; b.innerHTML='<b>'+(k===0?'▶':k+1)+'</b>'+s.n; b.onclick=function(){go(k)}; rt.appendChild(b);
    var d=document.createElement('button'); d.type='button'; d.setAttribute('aria-label',s.n); d.onclick=function(){go(k)}; dots.appendChild(d);
    var el;
    if(s.v){el=document.createElement('video'); el.src='/media/look-video.mp4'; el.poster='/media/look-video.jpg'; el.muted=true; el.loop=true; el.setAttribute('playsinline',''); el.preload='metadata';}
    else{el=document.createElement('div'); el.innerHTML='<img class="d" src="/media/d'+s.i+'.png" alt="'+s.n+'"'+(k>1?' loading="lazy"':'')+'><img class="m" src="/media/m'+s.i+'.png" alt="'+s.n+'"'+(k>1?' loading="lazy"':'')+'>';}
    el.hidden=true; media.appendChild(el);
  });
  function go(k){
    cur=(k+SLIDES.length)%SLIDES.length; var s=SLIDES[cur];
    st.querySelector('.num').textContent=(cur+1)+' OF '+SLIDES.length;
    st.querySelector('h4').innerHTML=s.a+'<span class="blue">'+s.b+'</span>';
    st.querySelector('.lt p').textContent=s.d;
    [].forEach.call(media.children,function(el,i){el.hidden=i!==cur; if(el.tagName==='VIDEO'){ if(i===cur){var p=el.play(); if(p&&p.catch)p.catch(function(){});} else el.pause(); }});
    [].forEach.call(rt.children,function(b,i){b.classList.toggle('on',i===cur)});
    [].forEach.call(dots.children,function(b,i){b.classList.toggle('on',i===cur)});
  }
  st.querySelector('.pv1').onclick=st.querySelector('.pv2').onclick=function(){go(cur-1)};
  st.querySelector('.nx1').onclick=st.querySelector('.nx2').onclick=function(){go(cur+1)};
  var x0=null; st.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  st.addEventListener('touchend',function(e){if(x0===null)return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>40)go(cur+(dx<0?1:-1)); x0=null});
  go(0);
}
document.querySelectorAll('[data-look]').forEach(buildLook);

function plannerCard(w){
  return '<div class="tc'+(w?' wide':'')+'"><div class="top" data-pc>'+
   '<div class="slide on"><img src="/planner.jpg" alt="Coupon Trip Planner fillable PDF"></div>'+
   '<div class="slide v"><video src="/media/planner-video.mp4" poster="/media/planner-video.jpg" muted loop playsinline preload="metadata" aria-label="Coupon Trip Planner video"></video></div>'+
   '<span class="vlab" hidden>▶ Video</span><button class="fs" type="button" hidden>⤢ Full screen</button>'+
   '<button class="ca pl" type="button" aria-label="Back to picture" style="left:14px" hidden>'+L+'</button><button class="ca pr" type="button" aria-label="Watch the video" style="right:14px">'+R+'</button>'+
   '<div class="cd"><i class="on"></i><i></i></div></div>'+
   '<div class="bd"><div class="eck">PRINTABLE</div><h3>Coupon Trip Planner</h3><p>Prefer planning on paper or in a PDF? Plan every transaction with this fillable trip planner.</p>'+
   '<ul class="ck"><li><span>✓</span>Totals add up automatically</li><li><span>✓</span>Check off items as you shop</li><li><span>✓</span>1, 2, 3 and 4 transaction versions</li></ul>'+
   '<a class="btn buyPlanner" href="https://vinahannah.gumroad.com/l/couponplanner">Get the planner</a><div class="note">Instant download · Fillable PDF</div></div></div>';
}
function tripCard(w){
  return '<div class="tc tcard'+(w?' wide rev':'')+'"><div class="top"><div class="slide on"><img src="/tripcheck.jpg" alt="Trip Check by Hannah Vina"></div></div>'+
   '<div class="bd"><div class="eck">PERSONAL HELP</div><h3>Trip Check</h3><p>Planned your coupon trip? Email it to me and I\'ll check it before you shop.</p>'+
   '<ul class="ck"><li><span>✓</span>A second look at your transactions</li><li><span>✓</span>Catch mistakes before you shop</li><li><span>✓</span>Personal feedback within 48 hours</li></ul>'+
   '<a class="btn buyTripCheck" href="https://vinahannah.gumroad.com/l/checkmytrip">✓ Check my trip</a><div class="note">Notes app, document or handwritten list</div></div></div>';
}
var HT=document.getElementById('homeTools'); if(HT) HT.innerHTML=plannerCard(true)+tripCard(true);
var TP=document.getElementById('toolsPage'); if(TP) TP.innerHTML=plannerCard()+tripCard();
var ov=document.getElementById('ov'), ovv=document.getElementById('ovv');
document.querySelectorAll('[data-pc]').forEach(function(t){
  var sl=t.querySelectorAll('.slide'), vid=t.querySelector('video'), dots=t.querySelectorAll('.cd i');
  function show(k){
    sl[0].classList.toggle('on',k===0); sl[1].classList.toggle('on',k===1);
    dots[0].classList.toggle('on',k===0); dots[1].classList.toggle('on',k===1);
    t.querySelector('.pl').hidden=k===0; t.querySelector('.pr').hidden=k===1;
    t.querySelector('.vlab').hidden=t.querySelector('.fs').hidden=k===0;
    if(k===1){var p=vid.play(); if(p&&p.catch)p.catch(function(){});} else vid.pause();
  }
  t.querySelector('.pr').onclick=function(){show(1)}; t.querySelector('.pl').onclick=function(){show(0)};
  vid.onclick=function(){ if(vid.paused){vid.play()} else vid.pause(); };
  t.querySelector('.fs').onclick=function(){ vid.pause(); ovv.currentTime=vid.currentTime||0; ov.hidden=false; var p=ovv.play(); if(p&&p.catch)p.catch(function(){}); };
  var x0=null; t.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  t.addEventListener('touchend',function(e){if(x0===null)return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>40)show(dx<0?1:0); x0=null});
});
function closeOv(){ovv.pause(); ov.hidden=true;}
if(ov){document.getElementById('ovx').onclick=closeOv;
ov.addEventListener('click',function(e){if(e.target===ov)closeOv()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)closeOv()});}

var PAGE=document.body.getAttribute('data-page');
var GROUP={'take-a-look':'app','updates':'app','planning-tools':'tools','about':'about'};
var ham=document.getElementById('ham'), pm=document.getElementById('pmenu');
document.querySelectorAll('.mi').forEach(function(m){m.classList.toggle('on',m.getAttribute('data-g')===GROUP[PAGE])});
pm.querySelectorAll('a[data-v]').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-v')===PAGE)});
document.querySelectorAll('[data-cp]').forEach(function(btn){btn.onclick=function(){var b=this,el=b.parentNode.querySelector('[data-em]'),t=el.textContent; function done(){b.classList.add('ok'); b.title='Copied'; setTimeout(function(){b.classList.remove('ok'); b.title='Copy'},1500)} function sel(){var r=document.createRange(); r.selectNodeContents(el); var g=getSelection(); g.removeAllRanges(); g.addRange(r)} try{navigator.clipboard.writeText(t).then(done,sel)}catch(e){sel()}}});
ham.onclick=function(e){e.stopPropagation(); pm.hidden=!pm.hidden; ham.setAttribute('aria-expanded',String(!pm.hidden));};
document.addEventListener('click',function(e){ if(!pm.hidden&&!pm.contains(e.target)) {pm.hidden=true; ham.setAttribute('aria-expanded','false');} });
document.querySelectorAll('.drop a,.brand').forEach(function(a){a.addEventListener('click',function(){ if(document.activeElement) document.activeElement.blur(); })});


// ---------- Text from Admin → Website (bio, photo, updates) ----------
function esc(t){return t.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function inl(t){return t.replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>').replace(/__([^_\n]+)__/g,'<u>$1</u>').replace(/\*([^*\n]+)\*/g,'<i>$1</i>');}
function fmt(text){return esc(text.trim()).split(/\n\s*\n/).map(function(p){var lines=p.split('\n');if(lines.every(function(l){return /^\s*- /.test(l);}))return '<ul>'+lines.map(function(l){return '<li>'+inl(l.replace(/^\s*- /,''))+'</li>';}).join('')+'</ul>';return '<p>'+inl(p).replace(/\n/g,'<br>')+'</p>';}).join('');}
function showUpdates(list){
  var box=document.getElementById('updates'); if(!box) return; box.innerHTML='';
  (list||[]).forEach(function(u){
    if(!u||u.show===false||!(u.message||'').trim()) return;
    var d=document.createElement('div'); d.className='post';
    d.innerHTML=(u.title?'<h3>'+esc(u.title)+'</h3>':'')+fmt(u.message)+(u.signature?'<div class="sig">– '+esc(u.signature)+'</div>':'');
    box.appendChild(d);
  });
  if(!box.children.length) box.innerHTML='<div class="post"><p>No updates yet.</p></div>';
}
function applySite(c){
  if(c.photo_url&&/^https:\/\//.test(c.photo_url)) document.querySelectorAll('[data-photo]').forEach(function(i){i.src=c.photo_url;});
  var st=document.getElementById('subtitle'); if(st&&typeof c.subtitle==='string'&&c.subtitle.trim()&&c.subtitle.trim()!=='Coupon Math') st.textContent=c.subtitle.trim();
  var at=document.getElementById('aboutTitle'); if(at&&typeof c.about_title==='string'&&c.about_title.trim()) at.textContent=c.about_title.trim();
  var ab=document.getElementById('aboutText'); if(ab&&typeof c.about_me==='string'&&c.about_me.trim()){ab.innerHTML=fmt(c.about_me); ab.hidden=false;}
  showUpdates(c.updates||(c.update?[c.update]:[]));
}
var cached=null,cachedRaw=null;
try{cachedRaw=localStorage.getItem('cm_site_v1'); cached=cachedRaw&&JSON.parse(cachedRaw);}catch(e){}
if(cached){try{applySite(cached);}catch(e){}}
fetch("https://noylxdmcugembxnwpipb.supabase.co/rest/v1/app_content?key=eq.website&select=content",{headers:{apikey:"sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P",Authorization:"Bearer sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P"},cache:'no-store'})
  .then(function(r){return r.json();})
  .then(function(rows){var raw=rows&&rows[0]&&rows[0].content,c=null;try{c=raw&&JSON.parse(raw);}catch(e){}
    if(!c){if(!cached)showUpdates([]);return;}
    try{localStorage.setItem('cm_site_v1',raw);}catch(e){}
    if(raw!==cachedRaw)applySite(c);})
  .catch(function(){if(!cached)showUpdates([]);});

// ---------- Visit counts (same as before) ----------
var ME=false,VISITOR=null;
function cookie(k){var m=document.cookie.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));return m?m[1]:null;}
function setCookie(k,v){try{document.cookie=k+'='+v+'; max-age=315360000; path=/; SameSite=Lax; Secure';}catch(e){}}
function keep(k,v){try{localStorage.setItem(k,v);}catch(e){}setCookie(k,v);}
function read(k){var v=null;try{v=localStorage.getItem(k);}catch(e){}return v||cookie(k);}
try{
  if(/[?&]me\b/.test(location.search)) keep('cm_me','1');
  ME=read('cm_me')==='1';
  if(/[?&]me\b/.test(location.search)){var n=document.createElement('div');n.textContent=ME?'✓ Visits from this browser are no longer counted':'Could not turn off counting in this browser (Private Browsing?)';n.style.cssText='position:fixed;left:12px;right:12px;top:12px;z-index:60;background:'+(ME?'#2E7D32':'#C62828')+';color:#fff;font-weight:700;font-size:14px;text-align:center;padding:12px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.2)';document.body.appendChild(n);setTimeout(function(){n.remove();},5000);}
}catch(e){}
VISITOR=read('cm_vid'); if(!VISITOR) VISITOR=Math.random().toString(36).slice(2)+Date.now().toString(36); keep('cm_vid',VISITOR);
var SRC=(function(){var q=(location.search.match(/[?&]src=([a-z]+)/i)||[])[1];var ua=navigator.userAgent||'',ref=document.referrer||'';
  if(/tiktok/i.test(q||'')||/musical_ly|BytedanceWebview|TikTok/i.test(ua)||/tiktok\./i.test(ref))return 'tiktok';
  if(/instagram/i.test(q||'')||/Instagram/i.test(ua)||/instagram\./i.test(ref))return 'instagram';return 'other';})();
function track(ev){if(ME&&ev!=='me')return;try{fetch("https://noylxdmcugembxnwpipb.supabase.co/rest/v1/site_events",{method:'POST',keepalive:true,headers:{apikey:"sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P",Authorization:"Bearer sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P",'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({event:ev,visitor:VISITOR,source:SRC})}).catch(function(){});}catch(e){}}
if(/[?&]me\b/.test(location.search)) track('me');
if(PAGE==='home') track('view');
(function(){var ph=document.getElementById('photo'); if(!ph) return; var taps=0,timer=null;
  ph.addEventListener('click',function(){taps++;clearTimeout(timer);timer=setTimeout(function(){taps=0;},1500);if(taps<5)return;taps=0;keep('cm_me','1');ME=true;track('me');
    var c=document.createElement('div');c.textContent='✓';c.style.cssText='position:absolute;width:22px;height:22px;border-radius:11px;background:#2E7D32;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:opacity .4s';
    var r=this.getBoundingClientRect();c.style.left=(r.right+window.scrollX-16)+'px';c.style.top=(r.top+window.scrollY-6)+'px';document.body.appendChild(c);setTimeout(function(){c.style.opacity='0';},1200);setTimeout(function(){c.remove();},1700);});})();
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a)return;
  if(a.classList.contains('buyPlanner'))track('planner'); else if(a.classList.contains('buyTripCheck'))track('tripcheck');
  else if(a.classList.contains('toStore'))track('appstore');
  else if(a.getAttribute('aria-label')==='TikTok')track('tiktok'); else if(a.getAttribute('aria-label')==='Instagram')track('instagram');},true);
