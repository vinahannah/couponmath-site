// couponmath.com home: CVS Deals this week, category chips, store promos (first cards), then every deal.
// Tapping a deal opens its details in a pop-up on the site; Add to Planner shows the sign-up sheet here,
// and Mix & match opens in a window over the site, so nobody has to leave couponmath.com (Nov 25).
(function(){
  var K="sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P";
  var BASE="https://noylxdmcugembxnwpipb.supabase.co/rest/v1/";
  var H={headers:{apikey:K,Authorization:'Bearer '+K}};
  var STORE_MSG='Deals currently available for CVS only. More stores will be added in the future.';
  var PENDING='@pending_add_v1', AUTH='sb-noylxdmcugembxnwpipb-auth-token';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function money(n){return '$'+Number(n||0).toFixed(2);}
  var CAT={beauty:'Beauty',oral_care:'Oral Care',hair:'Hair',skin_care:'Skin Care',personal_care:'Personal Care',household:'Household',health:'Health',baby:'Baby',grocery:'Grocery'};
  var ORDER=Object.keys(CAT);
  function label(c){if(CAT[c])return CAT[c];c=String(c||'other').replace(/_/g,' ');return c.replace(/\b\w/g,function(x){return x.toUpperCase();});}
  function oneLine(s){return String(s||'').replace(/\s*\n\s*/g,' ');}
  function $(id){return document.getElementById(id);}
  function isLink(u){u=String(u||'').trim();return !!u&&!/\s/.test(u)&&/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/|$|\?)/i.test(u);}
  function signedIn(){try{var v=localStorage.getItem(AUTH);return !!(v&&JSON.parse(v).access_token);}catch(e){return false;}}
  function track(name,props){try{if(window.cmTrack)window.cmTrack(name,props);}catch(e){}}

  // Store button: same message as the app
  var sb=$('storeBtn'), sp=$('storePop');
  if(sb&&sp){
    sp.textContent=STORE_MSG;
    sb.addEventListener('click',function(e){e.stopPropagation();sp.hidden=!sp.hidden;sb.setAttribute('aria-expanded',String(!sp.hidden));});
    document.addEventListener('click',function(){if(!sp.hidden){sp.hidden=true;sb.setAttribute('aria-expanded','false');}});
  }

  var deals=[], byId={}, cat='all';
  var SC='<svg class="sc" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 18M8.5 16.5L20 6"/></svg>';
  function photo(d){return d&&(d.image_url||(d.image_urls&&d.image_urls[0]))||'';}

  // Deal card (style 1): name, deal in gray, coupon tags, Earn left / You pay right
  function card(d){
    var cps=(d.coupons_list||[]).map(function(c){return '<span>'+esc(c.description||'Coupon')+' '+money(c.value)+SC+'</span>';}).join('');
    // Option B (Nov 25): Earn as a blue badge on the photo; You pay on one line
    // Nov 25 (option B): deal tags on one line at the top left of the photo; Earn is its own line under You pay
    var earn=d.rewards_earned>0?'<div class="ern"><small>Earn</small><b>'+money(d.rewards_earned)+'</b></div>':'';
    var id=esc(d.id);
    return '<article class="dcard">'+
      '<button type="button" class="ph" data-open="'+id+'" aria-label="'+esc(oneLine(d.brand))+' details">'+(photo(d)?'<img loading="lazy" src="'+esc(photo(d))+'" alt="">':'')+tagsHtml(d)+'</button>'+
      '<div><button type="button" class="br" data-open="'+id+'">'+esc(oneLine(d.brand))+'</button>'+(d.title?'<div class="of">'+esc(d.title)+'</div>':'')+'</div>'+
      (cps?'<div class="cp">'+cps+'</div>':'')+
      '<div class="tot"><small>You pay</small><b>'+money(d.final_price)+'</b></div>'+earn+
      '<button type="button" class="add" data-add="'+id+'">Add to Planner</button></article>';
  }
  function offerOf(p){return String(p.title||'').replace(/^Spend (\$[\d.]+) get (\$[\d.]+)$/i,'Spend $1, get $2 in Rewards');}
  // Store promo: the app's card (circle top right, STORE PROMO tag), in the grid like a deal
  function promoCard(p){
    var ids=p.mix.dealIds, imgs=[];
    ids.forEach(function(id){var u=photo(byId[id]);if(u&&imgs.indexOf(u)<0)imgs.push(u);});
    var cells=imgs.slice(0,4).map(function(u){return '<span><img loading="lazy" src="'+esc(u)+'" alt=""></span>';});
    return '<article class="pcard" data-mix="'+esc(p.id)+'" tabindex="0" role="button" aria-label="'+esc(p.mix.promoName||oneLine(p.brand))+', Mix and match">'+
      '<span class="tag">STORE PROMO</span><div class="pg n'+cells.length+'">'+cells.join('')+'</div>'+
      '<div><div class="br">'+esc(p.mix.promoName||oneLine(p.brand))+'</div><div class="of">'+esc(offerOf(p))+'</div></div>'+
      '<span class="mm">Mix &amp; match ›</span></article>';
  }

  function tagTexts(d){if(!d.deal_tag)return[];if(d.deal_tag!=='Custom')return[d.deal_tag];return String(d.deal_tag_custom||'').split('\n').map(function(t){return t.trim();}).filter(Boolean);}
  // Tags like the app: light color background, colored words; same order as the app (Top Pick, BOGO, Spend Deal, rest)
  var BUILT={BOGO:'#F76707',Freebie:'#2E7D32',Moneymaker:'#E65100'};
  function tagList(d){
    if(!d.deal_tag)return[];
    var t=[];
    if(d.deal_tag!=='Custom')t=[{x:d.deal_tag,c:BUILT[d.deal_tag]||'#3B63E8'}];
    else{var tx=String(d.deal_tag_custom||'').split('\n'),cs=String(d.deal_tag_color||'').split('\n');tx.forEach(function(v,i){v=v.trim();if(v)t.push({x:v,c:(/^\s*bogo\b/i.test(v)?'#F76707':(cs[i]||cs[0]||'#3B63E8').trim())});});}
    function rk(v){return /^\W*top\s*picks?\W*$/i.test(v)?0:/\bbogo\b/i.test(v)?1:/^\W*spend\s*deals?\W*$/i.test(v)?2:3;}
    return t.map(function(o,i){return {o:o,i:i};}).sort(function(a,b){return (rk(a.o.x)-rk(b.o.x))||(a.i-b.i);}).map(function(a){var o=a.o;if(/^\s*free\s*$/i.test(o.x))o.x='FREE';return o;});
  }
  function tagsHtml(d){
    var t=tagList(d);if(!t.length)return'';
    return '<span class="tg">'+t.map(function(o){var c=/^#[0-9a-f]{6}$/i.test(o.c)?o.c:'#3B63E8';var top=/^\W*top\s*picks?\W*$/i.test(o.x);return '<span style="color:'+c+';background:'+c+'22">'+(top?'★ ':'')+esc(o.x)+'</span>';}).join('')+'</span>';
  }
  function matchQ(d,q){
    if(q==='__top')return tagTexts(d).some(function(t){return /^\W*top\s*picks?\W*$/i.test(t);});
    return Number(d.item_price)>0&&Number(d.final_price)<=5;
  }
  function draw(){
    var box=$('allDeals'); if(!box) return;
    var pub=deals.filter(function(d){return d.published;});
    var promos=deals.filter(function(d){return d.mix&&d.mix.live!==false&&d.mix.dealIds&&d.mix.dealIds.length;});
    var cats=[];pub.forEach(function(d){var c=d.category||'other';if(cats.indexOf(c)<0)cats.push(c);});
    cats.sort(function(a,b){var x=ORDER.indexOf(a),y=ORDER.indexOf(b);return (x<0?99:x)-(y<0?99:y);});
    var ch=$('chips');
    // Nov 25: Top picks and Under $5 after All (same rules as the app's quick filters)
    var quick=[['__top','★ Top picks'],['__under5','Under $5']].filter(function(q){return pub.some(function(d){return matchQ(d,q[0]);});});
    if(ch) ch.innerHTML='<button type="button" data-c="all" class="'+(cat==='all'?'on':'')+'">All</button>'+quick.map(function(q){return '<button type="button" data-c="'+q[0]+'" class="'+(cat===q[0]?'on':'')+'">'+q[1]+'</button>';}).join('')+cats.map(function(c){return '<button type="button" data-c="'+esc(c)+'" class="'+(cat===c?'on':'')+'">'+esc(label(c))+'</button>';}).join('');
    var isQ=cat==='__top'||cat==='__under5';
    var list=cat==='all'?pub:isQ?pub.filter(function(d){return matchQ(d,cat);}):pub.filter(function(d){return (d.category||'other')===cat;});
    var shownPromos=cat==='all'?promos:isQ?[]:promos.filter(function(p){return p.mix.dealIds.some(function(id){return byId[id]&&(byId[id].category||'other')===cat;});});
    box.innerHTML='<div class="grid g4">'+shownPromos.map(promoCard).join('')+list.map(card).join('')+'</div>';
  }
  var ch0=$('chips');
  if(ch0) ch0.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;cat=b.getAttribute('data-c');draw();track('home_chip',{c:cat});});

  // ── Pop-ups ────────────────────────────────────────────────────────────
  var root=document.createElement('div'); root.className='cmov'; root.hidden=true; document.body.appendChild(root);
  var lastFocus=null;
  function openBox(html,cls){
    lastFocus=document.activeElement;
    root.innerHTML='<div class="cmbox '+(cls||'')+'" role="dialog" aria-modal="true">'+html+'</div>';
    root.hidden=false; document.documentElement.classList.add('cmlock');
    var x=root.querySelector('[data-x]'); if(x) x.focus();
  }
  function closeBox(){root.hidden=true;root.innerHTML='';document.documentElement.classList.remove('cmlock');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  root.addEventListener('click',function(e){
    if(e.target===root||e.target.closest('[data-x]')){closeBox();return;}
    var a=e.target.closest('[data-add]'); if(a){addDeal(a.getAttribute('data-add'));return;}
    var g=e.target.closest('[data-go]'); if(g){go(g.getAttribute('data-go'));}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!root.hidden)closeBox();});
  var X='<button type="button" class="cmx" data-x aria-label="Close">✕</button>';

  function lines(d){
    var cps=(d.coupons_list||[]).map(function(c){return '<div class="ln g"><span>'+esc(c.description||'Coupon')+'</span><b>-'+money(c.value)+'</b></div>';}).join('');
    return '<div class="ln"><span>Price</span><b>'+money(d.item_price)+'</b></div>'+cps;
  }
  function openDeal(id){
    var d=byId[id]; if(!d) return;
    var note=d.notes?'<div class="nt">'+esc(d.notes)+'</div>':'';
    openBox('<div class="cmhd"><span></span>'+X+'</div>'+
      '<div class="cmtop"><div class="cmph">'+(photo(d)?'<img src="'+esc(photo(d))+'" alt="">':'')+'</div><div class="dnm"><div class="br">'+esc(oneLine(d.brand))+'</div>'+(d.title?'<div class="of">'+esc(d.title)+'</div>':'')+'</div></div>'+
      note+'<div class="math">'+lines(d)+'<div class="ln yp"><span>You pay</span><b>'+money(d.final_price)+'</b></div>'+
      (d.rewards_earned>0?'<div class="ln er"><span>Earn</span><b>'+money(d.rewards_earned)+' Rewards</b></div>':'')+'</div>'+
      '<button type="button" class="cmbtn" data-add="'+esc(d.id)+'">Add to my planner</button>','deal');
    track('home_deal_open',{id:d.id});
  }
  // The sign-up sheet: the deal as it will look in the Planner, then Sign up and add deal
  function addDeal(id){
    var d=byId[id]; if(!d) return;
    savePending(id);
    // Already signed in on this browser: straight to the app, which adds it
    if(signedIn()){try{localStorage.setItem(PENDING,JSON.stringify({kind:'deal',dealId:id,at:Date.now()}));}catch(e){}track('home_add',{id:id,signed:1});closeBox();var g=document.createElement('div');g.className='cmgo';g.innerHTML='<img src="/icon.png" alt=""><b>Adding to your Planner</b><small>Opening Coupon Math…</small><i></i>';document.body.appendChild(g);setTimeout(function(){location.href='/app/';},900);return;}
    var cps=(d.coupons_list||[]).map(function(c){return '<div class="ln g"><span>'+esc(c.description||'Coupon')+'</span><b>-'+money(c.value)+'</b></div>';}).join('');
    openBox('<div class="cmhd"><span class="ey">PREVIEW OF YOUR PLANNER</span>'+X+'</div>'+
      '<div class="cmpv"><div class="cmpvl"><div class="cmpvp">'+(photo(d)?'<img src="'+esc(photo(d))+'" alt="">':'')+'</div>'+
      (d.rewards_earned>0?'<div class="cmpve"><small>Earn</small><b>'+money(d.rewards_earned)+'</b></div>':'')+'</div>'+
      '<div class="cmpvr"><div class="br">'+esc(oneLine(d.brand))+'</div>'+(d.title?'<div class="of">'+esc(d.title)+'</div>':'')+
      '<div class="ln"><span class="pc">Price<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span><b>'+money(d.item_price)+'</b></div>'+cps+
      '<div class="ln tt"><span>TOTAL</span><b>'+money(d.final_price)+'</b></div></div></div>'+
      '<button type="button" class="cmbtn" data-go="sign-up">Sign up and add deal</button>'+
      '<div class="alt">Already have an account? <button type="button" data-go="sign-in">Sign in</button></div>','sheet');
    track('home_add',{id:id});
  }
  var pendingId=null;
  function savePending(id){pendingId=id;}
  function go(to){
    try{if(pendingId)localStorage.setItem(PENDING,JSON.stringify({kind:'deal',dealId:pendingId,at:Date.now()}));}catch(e){}
    track('home_sheet_go',{to:to});
    location.href='/app/'+to;
  }
  // Mix & match: the app's screen in a window over the site
  function openMix(id){
    var p=byId[id]; if(!p) return;
    openBox('<div class="cmhd mx"><span class="mt">Mix &amp; match</span>'+X+'</div>'+
      '<div class="mxw"><div class="mxl">Loading…</div><iframe title="Mix &amp; match" src="/app/mix/'+encodeURIComponent(id)+'"></iframe></div>','mix');
    var f=root.querySelector('iframe'), l=root.querySelector('.mxl');
    if(f) f.addEventListener('load',function(){setTimeout(function(){if(l)l.style.display='none';},900);});
    track('home_mix_open',{id:id});
  }
  document.addEventListener('click',function(e){
    if(!root.hidden&&root.contains(e.target)) return;
    var o=e.target.closest('[data-open]'); if(o){openDeal(o.getAttribute('data-open'));return;}
    var a=e.target.closest('.dcard [data-add]'); if(a){addDeal(a.getAttribute('data-add'));return;}
    var m=e.target.closest('[data-mix]'); if(m){openMix(m.getAttribute('data-mix'));}
  });
  document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-mix]')){e.preventDefault();openMix(e.target.getAttribute('data-mix'));}});

  function weekShort(w){var m=String(w||'').match(/^([A-Za-z]{3}) (\d+)\s*[–-]\s*([A-Za-z]{3}) (\d+)$/);return m?(m[1]===m[3]?m[1]+' '+m[2]+' – '+m[4]:w):w;}
  var now=new Date().toISOString();
  var q=BASE+'deals?select=id,brand,title,deal_tag,deal_tag_custom,deal_tag_color,item_price,final_price,rewards_earned,coupons_list,image_url,category,week_label,store,sort_order,mix,published,notes,link_url'+
    '&is_custom=eq.false&or=(published.eq.true,mix.not.is.null)&week_start=lte.'+encodeURIComponent(now)+'&expires_at=gt.'+encodeURIComponent(now)+'&order=sort_order.asc';
  var ad=$('allDeals');
  fetch(q,H).then(function(r){return r.json();}).then(function(rows){
    deals=Array.isArray(rows)?rows:[];
    deals.forEach(function(d){byId[d.id]=d;});
    var pub=deals.filter(function(d){return d.published;});
    if(pub.length){
      var wl=pub[0].week_label||'';
      if($('dwk')) $('dwk').textContent=wl;
      if($('dwks')) $('dwks').textContent=weekShort(wl);
      var st=$('dstore'); if(st&&pub[0].store) st.textContent=pub[0].store;
    }
    if(!pub.length){if(ad)ad.innerHTML='<div class="empty">This week\'s deals are coming soon.</div>';return;}
    draw();
  }).catch(function(){if(ad)ad.innerHTML='<div class="empty">Deals couldn\'t load. Try again in a moment.</div>';});
})();
