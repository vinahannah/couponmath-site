// "Top 5 deals this week": reads the snapshot saved in Admin → Website Top 5 (app_content "website_top5") and draws the cards.
(function(){
  var box=document.getElementById('top5'); if(!box) return;
  var K="sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P";
  var URL="https://noylxdmcugembxnwpipb.supabase.co/rest/v1/app_content?key=eq.website_top5&select=content";
  var IOS=/iPhone|iPad|iPod/.test(navigator.userAgent);
  var STORE="https://apps.apple.com/app/id6812436686";
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function money(n){return '$'+Number(n).toFixed(2);}
  function soft(hex){return /^#[0-9a-f]{6}$/i.test(hex||'')?hex+'1F':'#F5F7FB';}
  function tr(ev){try{if(typeof track==='function')track(ev);}catch(e){}}
  // "after coupons", "after rewards" or both, from what the deal has (older saves: both)
  function after(d){
    if(d.coupons==null&&d.rewards==null) return 'after coupons and rewards';
    var c=d.coupons>0,r=d.rewards>0;
    return c&&r?'after coupons and rewards':r?'after rewards':c?'after coupons':'';
  }
  function price(d){
    var reg=d.reg>0&&d.reg>Math.max(0,d.net)+0.004?'<s>'+money(d.reg)+'</s>':'';
    var a=after(d), sm=a?'<small>'+a+'</small>':'';
    if(d.net<=0) return '<div class="pr free'+(d.net<0?' mm':'')+'"><span class="pl"><b>'+(d.net<0?'Money maker':'Free')+'</b>'+reg+'</span>'+sm+'</div>';
    if(d.each!=null) return '<div class="pr"><b>'+money(d.each)+'</b>'+(d.reg>0&&d.units?'<s>'+money(d.reg/d.units)+'</s>':'')+'<small>each, when you buy '+d.units+(a?', '+a:'')+'</small></div>';
    return '<div class="pr"><b>'+money(d.net)+'</b>'+reg+sm+'</div>';
  }
  fetch(URL,{headers:{apikey:K,Authorization:'Bearer '+K}}).then(function(r){return r.json();}).then(function(rows){
    var v=rows&&rows[0]&&rows[0].content?JSON.parse(rows[0].content):null; if(!v||!v.weeks) return;
    var now=Date.now(), w=null;
    function has(p){return p&&p.deals&&p.deals.length;}
    Object.keys(v.weeks).forEach(function(k){var x=v.weeks[k]; if(new Date(x.start).getTime()<=now&&now<new Date(x.end).getTime()&&(has(x)||has(x.part2))) w=x;});
    if(!w) return;
    // Part 1 is the week itself; Part 2 (optional) has its own deals, video and storefront links
    var parts=[w,w.part2].filter(has), cur=0;
    function cardsOf(p){return p.deals.slice(0,5).map(function(d,i){
      var tags=(d.tags||[]).slice(0,3).map(function(t){return '<span class="tag" style="color:'+esc(t.color)+';background:'+soft(t.color)+'">'+esc(t.text)+'</span>';}).join('');
      return '<a class="card" href="/app/deal/'+encodeURIComponent(d.id)+'"><span class="rank">'+(i+1)+'</span>'+
        '<div class="ph">'+(d.imageUrl?'<img loading="lazy" src="'+esc(d.imageUrl)+'" alt="">':'')+'</div>'+
        '<div class="mid"><div class="br">'+esc(d.brand)+'</div>'+(d.title?'<div class="ti">'+esc(d.title)+'</div>':'')+
        (tags?'<div class="tags">'+tags+'</div>':'')+price(d)+'</div><span class="go" aria-hidden="true">›</span></a>';
    }).join('');}
    function vidOf(p){return p.tiktokUrl?function(c){return '<a class="b bp '+c+'" data-ev="top5_video" href="'+esc(p.tiktokUrl)+'" target="_blank" rel="noopener">▶ Watch the video</a>';}:function(){return '';};}
    function shopOf(p){return p.shopUrl?'<a class="b bs" data-ev="top5_shop" href="'+esc(p.shopUrl)+'" target="_blank" rel="noopener">Shop these deals ↗</a>':'';}
    var VARY='Prices can vary by store. Change the price to match yours in the app.';
    var wk=esc((w.label||'').replace(/\s*–\s*/,'–').replace(/^([A-Za-z]+) (\d+)–\1 (\d+)$/,'$1 $2–$3'));
    var app='<div class="appwrap"><div class="appband"><img src="/media/top5-app.png" alt="Coupon Math deal details screen" loading="lazy">'+
      '<div class="at"><div class="ah">Plan this trip in <span>Coupon Math</span></div>'+
      '<p>Add these deals to your planner and see what you\'ll pay.</p>'+
      '<div class="acts"><a class="asb toStore" data-ev="top5_get_app" href="'+STORE+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.9-.8-3.1-.8a4.6 4.6 0 0 0-3.9 2.4c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4a10 10 0 0 0 1.3-2.7c0 0-2.6-1-2.7-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg><span><small>Download on the</small><b>App Store</b></span></a>'+
      '<span class="appweb">or <a data-ev="top5_web" href="/app/">use it on the web</a></span></div></div></div></div>';
    function partBtns(){return parts.length<2?'':'<div class="parts" role="tablist">'+parts.map(function(_,i){return '<button type="button" role="tab" class="pt'+(i===cur?' on':'')+'" aria-selected="'+(i===cur)+'" data-part="'+i+'">Part '+(i+1)+'</button>';}).join('')+'</div>';}
    function draw(){
    var P=parts[cur], vid=vidOf(P), shop=shopOf(P), cards=cardsOf(P);
    box.innerHTML='<div class="eyb">THIS WEEK</div>'+
      '<div class="h"><div class="ht"><h2>Top 5 deals this week</h2><span class="wk">'+wk+'</span></div>'+vid('vd')+'</div>'+
      '<div class="vary vm">'+VARY+'</div>'+
      '<div class="chips"><span class="chip">'+esc(w.store||'CVS')+'</span>'+partBtns()+'</div>'+vid('vm')+
      '<div class="cards">'+cards+'</div>'+
      '<div class="foot"><div class="vary vd">'+VARY+'</div>'+shop+'</div>'+
      (P.shopUrl?'<div class="note">ⓘ Some links may earn a commission.</div>':'')+app;
    }
    draw();
    box.hidden=false;
    box.addEventListener('click',function(e){
      var pt=e.target.closest('[data-part]');
      if(pt){var i=+pt.getAttribute('data-part'); if(i!==cur){cur=i; draw(); tr(i===1?'top5_part2':'top5_part1');} return;}
      var a=e.target.closest('[data-ev]'); if(a) tr(a.getAttribute('data-ev')); else if(e.target.closest('.card')) tr('top5_card');});
  }).catch(function(){});
})();
