// "See it in action": the buttons switch the demo; the pop-up boxes follow the video's own clock
(function(){
  var KEYS = ['plan','mix','split','brands'];
  document.querySelectorAll('[data-demos]').forEach(function(root){
    var box = root.querySelector('.dbox'), sc = root.querySelector('.dscale'), raf = 0, cur = 'plan';
    function fit(){
      // room for the pop-up boxes: measure how far they reach past the 390px stage and make space for it
      var desk = window.matchMedia('(min-width:900px)').matches;
      var minL = 0, maxR = 390;
      sc.querySelectorAll('.dc').forEach(function(c){ minL = Math.min(minL, c.offsetLeft - 6); maxR = Math.max(maxR, c.offsetLeft + c.offsetWidth + 6); });
      // phones: the demo may use 16px of the page's side margin on each side, so the phone shows a bit bigger
      var need = maxR - minL, cw = (box.parentNode.clientWidth || 390) + (desk ? 0 : 32);
      var s = desk ? 1 : Math.min(1, cw / need);
      var st = sc.querySelector('.dstage:not([hidden])') || sc.firstElementChild;
      sc.style.transform = 'translateX(' + (-minL * s) + 'px) scale(' + s + ')';
      box.style.width = (need * s) + 'px';
      box.style.maxWidth = 'none';
      box.style.height = (st.offsetHeight * s) + 'px';
    }
    function tick(stage){
      var v = stage.querySelector('video'); if (!v) return;
      var t = v.currentTime;
      stage.querySelectorAll('.dc').forEach(function(c){ c.classList.toggle('on', t >= +c.dataset.a && t < +c.dataset.b); });
      raf = requestAnimationFrame(function(){ tick(stage); });
    }
    function show(key){
      cur = key; cancelAnimationFrame(raf);
      root.querySelectorAll('.dchip').forEach(function(b){ var on = b.dataset.for === key; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      root.querySelectorAll('.dtx').forEach(function(t){ t.hidden = t.dataset.tx !== key; });
      root.querySelectorAll('.dstage').forEach(function(s){
        var on = s.dataset.demo === key, v = s.querySelector('video');
        s.hidden = !on;
        if (v) { if (on) { v.currentTime = 0; v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function(){}); } else v.pause(); }
        if (on && !v) { var a = s.querySelector('.danim'); a.style.display = 'none'; void a.offsetHeight; a.style.display = ''; }
        if (on && v) tick(s);
      });
      fit();
    }
    root.querySelectorAll('.dchip').forEach(function(b){ b.addEventListener('click', function(){ show(b.dataset.for); }); });
    var step = function(d){ show(KEYS[(KEYS.indexOf(cur) + d + KEYS.length) % KEYS.length]); };
    var pv = root.querySelector('.dprev'), nx = root.querySelector('.dnext');
    if (pv) pv.addEventListener('click', function(){ step(-1); });
    if (nx) nx.addEventListener('click', function(){ step(1); });
    window.addEventListener('resize', fit);
    show('plan');
  });
})();
