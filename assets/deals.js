// Deals-first test page (/preview): Top 5, store promos and every deal for the current week.
(function(){
  var K="sb_publishable_Til6cvd0tAebF5CKhA9qWw_Lx4ygo6P";
  var BASE="https://noylxdmcugembxnwpipb.supabase.co/rest/v1/";
  var H={headers:{apikey:K,Authorization:'Bearer '+K}};
  var STORE_MSG='Deals currently available for CVS only. More stores will be added in the future.';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function money(n){return '$'+Number(n||0).toFixed(2);}
  function label(c){c=String(c||'other').replace(/_/g,' ');return c.charAt(0).toUpperCase()+c.slice(1);}
  function oneLine(s){return String(s||'').replace(/\s*\n\s*/g,' ');}
  function $(id){return document.getElementById(id);}

  // Store button: same message as the app
  var sb=$('storeBtn'), sp=$('storePop');
  if(sb&&sp){
    sp.textContent=STORE_MSG;
    sb.addEventListener('click',function(e){e.stopPropagation();sp.hidden=!sp.hidden;sb.setAttribute('aria-expanded',String(!sp.hidden));});
    document.addEventListener('click',function(){if(!sp.hidden){sp.hidden=true;sb.setAttribute('aria-expanded','false');}});
  }

  // Deal card (style 1): name, deal in gray, coupon tags, Earn left, You pay right
  function card(d,num){
    var href='/app/deal/'+encodeURIComponent(d.id);
    var cps=(d.coupons_list||[]).map(function(c){return '<span>'+esc(c.description||'Coupon')+' '+money(c.value)+'</span>';}).join('');
    var earn=d.rewards_earned>0?'<span class="er">Earn <b>'+money(d.rewards_earned)+'</b></span>':'<span class="er none">Earn <b>—</b></span>';
    return '<article class="dcard">'+(num?'<span class="num">'+num+'</span>':'')+
      '<a class="ph" href="'+href+'" tabindex="-1" aria-hidden="true">'+(d.image_url?'<img loading="lazy" src="'+esc(d.image_url)+'" alt="">':'')+'</a>'+
      '<div><a class="br" href="'+href+'">'+esc(oneLine(d.brand))+'</a>'+(d.title?'<div class="of">'+esc(d.title)+'</div>':'')+'</div>'+
      (cps?'<div class="cp">'+cps+'</div>':'')+
      '<div class="tot">'+earn+'<span class="yp">You pay <b>'+money(d.final_price)+'</b></span></div>'+
      '<a class="add" href="'+href+'">Add to Planner</a></article>';
  }

  var now=new Date().toISOString();
  var q=BASE+'deals?select=id,brand,title,item_price,final_price,rewards_earned,coupons_list,image_url,category,week_label,store,sort_order,mix,published'+
    '&is_custom=eq.false&or=(published.eq.true,mix.not.is.null)&week_start=lte.'+encodeURIComponent(now)+'&expires_at=gt.'+encodeURIComponent(now)+'&order=sort_order.asc';
  var deals=[], byId={}, cat='all';

  function drawTop5(snap){
    var box=$('top5x'); if(!box||!snap||!snap.weeks) return;
    var t=Date.now(), w=null;
    function has(p){return p&&p.deals&&p.deals.length;}
    Object.keys(snap.weeks).forEach(function(k){var x=snap.weeks[k];if(new Date(x.start).getTime()<=t&&t<new Date(x.end).getTime()&&(has(x)||has(x.part2)))w=x;});
    if(!w) return;
    var parts=[w,w.part2].filter(has), cur=0;
    function draw(){
      var list=parts[cur].deals.slice(0,5).map(function(s,i){
        var d=byId[s.id]; if(!d) d={id:s.id,brand:s.brand,title:s.title,image_url:s.imageUrl,final_price:(s.reg||0)-(s.coupons||0),rewards_earned:s.rewards,coupons_list:s.coupons>0?[{description:'Coupon',value:s.coupons}]:[]};
        return card(d,i+1);
      }).join('');
      box.innerHTML='<div class="sh"><h2>Top 5 deals</h2>'+(parts.length>1?'<div class="parts">'+parts.map(function(_,i){return '<button type="button" data-part="'+i+'" class="'+(i===cur?'on':'')+'" aria-pressed="'+(i===cur)+'">Part '+(i+1)+'</button>';}).join('')+'</div>':'')+'</div>'+
        '<div class="grid g5">'+list+'</div>';
      box.hidden=false;
    }
    box.addEventListener('click',function(e){var b=e.target.closest('[data-part]');if(!b)return;cur=+b.getAttribute('data-part');draw();});
    draw();
  }

  function drawPromos(){
    var box=$('promosx'); if(!box) return;
    var promos=deals.filter(function(d){return d.mix&&d.mix.live!==false&&d.mix.dealIds&&d.mix.dealIds.length;});
    if(!promos.length){box.hidden=true;return;}
    box.innerHTML='<div class="grid g2">'+promos.map(function(p){
      var ids=p.mix.dealIds, imgs=ids.map(function(id){return byId[id]&&byId[id].image_url;}).filter(Boolean);
      var off=String(p.title||'').replace(/^Spend (\$[\d.]+) get (\$[\d.]+)$/i,'Spend $1, get $2 in Rewards');
      return '<article class="promo"><div class="pi"><span class="tag">STORE PROMO</span><div class="pn">'+esc(p.mix.promoName||oneLine(p.brand))+'</div>'+
        '<div class="po">'+esc(off)+' <span class="pc">· '+ids.length+' deals</span></div></div>'+
        '<div class="pr"><div class="th">'+imgs.slice(0,3).map(function(u){return '<span><img loading="lazy" src="'+esc(u)+'" alt=""></span>';}).join('')+
        (ids.length>3?'<span class="more">+'+(ids.length-3)+'</span>':'')+'</div>'+
        '<a class="mm" href="/app/mix/'+encodeURIComponent(p.id)+'">Mix &amp; match ›</a></div></article>';
    }).join('')+'</div>';
    box.hidden=false;
  }

  function drawAll(){
    var box=$('allDeals'); if(!box) return;
    var list0=deals.filter(function(d){return d.published;});
    var cats=[];list0.forEach(function(d){var c=d.category||'other';if(cats.indexOf(c)<0)cats.push(c);});
    var list=cat==='all'?list0:list0.filter(function(d){return (d.category||'other')===cat;});
    box.innerHTML='<div class="sh"><h2>All deals</h2></div>'+
      '<div class="fl" role="toolbar" aria-label="Filter deals"><button type="button" data-c="all" class="'+(cat==='all'?'on':'')+'">All</button>'+
      cats.map(function(c){return '<button type="button" data-c="'+esc(c)+'" class="'+(cat===c?'on':'')+'">'+esc(label(c))+'</button>';}).join('')+'</div>'+
      '<div class="grid g4">'+list.map(function(d){return card(d);}).join('')+'</div>';
  }
  var ad=$('allDeals');
  if(ad) ad.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;cat=b.getAttribute('data-c');drawAll();});

  Promise.all([
    fetch(q,H).then(function(r){return r.json();}),
    fetch(BASE+'app_content?key=eq.website_top5&select=content',H).then(function(r){return r.json();}).catch(function(){return [];})
  ]).then(function(res){
    deals=Array.isArray(res[0])?res[0]:[];
    deals.forEach(function(d){byId[d.id]=d;});
    var pub=deals.filter(function(d){return d.published;});
    if(pub.length){
      var wk=$('dwk'); if(wk&&pub[0].week_label) wk.textContent=' · '+pub[0].week_label;
      var st=$('dstore'); if(st&&pub[0].store) st.textContent=pub[0].store;
    }
    try{var row=res[1]&&res[1][0];drawTop5(row&&row.content?JSON.parse(row.content):null);}catch(e){}
    drawPromos();
    if(!pub.length){if(ad)ad.innerHTML='<div class="empty">This week\'s deals are coming soon.</div>';return;}
    drawAll();
  }).catch(function(){if(ad)ad.innerHTML='<div class="empty">Deals couldn\'t load. Try again in a moment.</div>';});
})();
