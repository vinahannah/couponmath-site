// Deals-first test page (/preview): every published deal for the current week, with category filters.
(function(){
  var box=document.getElementById('allDeals'); if(!box) return;
  var K="sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P";
  var BASE="https://noylxdmcugembxnwpipb.supabase.co/rest/v1/";
  var H={headers:{apikey:K,Authorization:'Bearer '+K}};
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function money(n){return '$'+Number(n||0).toFixed(2);}
  function label(c){c=String(c||'other').replace(/_/g,' ');return c.charAt(0).toUpperCase()+c.slice(1);}
  function firstUrl(s){var m=String(s||'').match(/https?:\/\/\S+/);return m?m[0]:'';}
  var now=new Date().toISOString();
  var q=BASE+'deals?select=id,brand,title,item_price,final_price,rewards_earned,coupons_list,image_url,category,link_url,week_label,store,sort_order'+
    '&published=eq.true&is_custom=eq.false&week_start=lte.'+encodeURIComponent(now)+'&expires_at=gt.'+encodeURIComponent(now)+'&order=sort_order.asc';
  var deals=[], cat='all';
  function card(d){
    var cps=(d.coupons_list||[]).map(function(c){return '<span class="c">'+esc(c.description||'Coupon')+' '+money(c.value)+'</span>';}).join('');
    if(d.rewards_earned>0) cps+='<span class="r">Rewards '+money(d.rewards_earned)+'</span>';
    var shop=firstUrl(d.link_url);
    var href='/app/deal/'+encodeURIComponent(d.id);
    return '<article class="dcard"><a class="ph" href="'+href+'" aria-hidden="true" tabindex="-1">'+(d.image_url?'<img loading="lazy" src="'+esc(d.image_url)+'" alt="">':'')+'</a>'+
      '<div><a class="br" href="'+href+'">'+esc(String(d.brand||'').replace(/\s*\n\s*/g,' '))+'</a>'+(d.title?'<div class="of">'+esc(d.title)+'</div>':'')+'</div>'+
      (cps?'<div class="cp">'+cps+'</div>':'')+
      '<div class="tot"><small>Subtotal '+money(d.item_price)+'</small><b>You pay '+money(d.final_price)+'</b></div>'+
      '<div class="act"><a class="add" href="'+href+'">Add to Planner</a>'+(shop?'<a class="shop" href="'+esc(shop)+'" target="_blank" rel="noopener">Shop ↗</a>':'')+'</div></article>';
  }
  function draw(){
    var cats=[];deals.forEach(function(d){var c=d.category||'other';if(cats.indexOf(c)<0)cats.push(c);});
    var list=cat==='all'?deals:deals.filter(function(d){return (d.category||'other')===cat;});
    box.innerHTML='<div class="h"><h2>All deals</h2><span class="n">'+deals.length+' deals</span></div>'+
      '<div class="fl" role="toolbar" aria-label="Filter deals"><button type="button" data-c="all" class="'+(cat==='all'?'on':'')+'">All deals</button>'+
      cats.map(function(c){return '<button type="button" data-c="'+esc(c)+'" class="'+(cat===c?'on':'')+'">'+esc(label(c))+'</button>';}).join('')+'</div>'+
      '<div class="grid">'+list.map(card).join('')+'</div>'+
      '<div class="note">ⓘ Some links may earn a commission.</div>';
  }
  box.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;cat=b.getAttribute('data-c');draw();});
  fetch(q,H).then(function(r){return r.json();}).then(function(rows){
    deals=Array.isArray(rows)?rows:[];
    if(!deals.length){box.innerHTML='<div class="empty">This week\'s deals are coming soon.</div>';return;}
    var wk=document.getElementById('dwk'); if(wk&&deals[0].week_label) wk.textContent=deals[0].week_label.replace(/\s*–\s*/,'–');
    var st=document.getElementById('dstore'); if(st&&deals[0].store) st.textContent=deals[0].store;
    draw();
  }).catch(function(){box.innerHTML='<div class="empty">Deals couldn\'t load. Try again in a moment.</div>';});
})();
