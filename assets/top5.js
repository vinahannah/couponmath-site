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
    Object.keys(v.weeks).forEach(function(k){var x=v.weeks[k]; if(new Date(x.start).getTime()<=now&&now<new Date(x.end).getTime()&&x.deals&&x.deals.length) w=x;});
    if(!w) return;
    var cards=w.deals.slice(0,5).map(function(d,i){
      var tags=(d.tags||[]).slice(0,3).map(function(t){return '<span class="tag" style="color:'+esc(t.color)+';background:'+soft(t.color)+'">'+esc(t.text)+'</span>';}).join('');
      return '<a class="card" href="/app/deal/'+encodeURIComponent(d.id)+'"><span class="rank">'+(i+1)+'</span>'+
        '<div class="ph">'+(d.imageUrl?'<img loading="lazy" src="'+esc(d.imageUrl)+'" alt="">':'')+'</div>'+
        '<div class="mid"><div class="br">'+esc(d.brand)+'</div>'+(d.title?'<div class="ti">'+esc(d.title)+'</div>':'')+
        (tags?'<div class="tags">'+tags+'</div>':'')+price(d)+'</div><span class="go" aria-hidden="true">›</span></a>';
    }).join('');
    var btns=(w.tiktokUrl?'<a class="b bp" data-ev="top5_video" href="'+esc(w.tiktokUrl)+'" target="_blank" rel="noopener">▶ Watch the video</a>':'')+
      (w.shopUrl?'<a class="b bs" data-ev="top5_shop" href="'+esc(w.shopUrl)+'" target="_blank" rel="noopener">Shop these deals ↗</a>':'');
    var app='<div class="appband"><img src="/media/top5-app.png" alt="Coupon Math deal details screen" loading="lazy">'+
      '<div class="at"><div class="ah">Plan this trip in <span>Coupon Math</span></div>'+
      '<p>Add these deals to your planner and see what you\'ll pay.</p>'+
      '<a class="getapp toStore" data-ev="top5_get_app" href="'+STORE+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.8zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>Get the iPhone app</a></div></div>'+
      '<div class="appweb">Not on iPhone? <a data-ev="top5_web" href="/app/">Use it on the web</a></div>';
    box.innerHTML='<div class="eyb">THIS WEEK</div><div class="h"><h2>Top 5 deals this week</h2><span class="wk">'+esc((w.label||'').replace(/\s*–\s*/,'–').replace(/^([A-Za-z]+) (\d+)–\1 (\d+)$/,'$1 $2–$3'))+'</span></div>'+
      '<div class="chips"><span class="chip">'+esc(w.store||'CVS')+'</span></div><div class="cards">'+cards+'</div>'+
      '<div class="vary">Prices can vary by store. Change the price to match yours in the app.</div>'+
      (btns?'<div class="btns">'+btns+'</div>':'')+
      (w.shopUrl?'<div class="note">ⓘ Some links may earn a commission.</div>':'')+app;
    box.hidden=false;
    box.addEventListener('click',function(e){var a=e.target.closest('[data-ev]'); if(a) tr(a.getAttribute('data-ev')); else if(e.target.closest('.card')) tr('top5_card');});
  }).catch(function(){});
})();
