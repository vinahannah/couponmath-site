// "See it in action": chips switch the demo; the pop-up boxes follow the video's own clock
(function(){
  document.querySelectorAll('[data-demos]').forEach(function(root){
    var box = root.querySelector('.dbox'), sc = root.querySelector('.dscale'), raf = 0;
    function fit(){ var w = Math.min(390, box.clientWidth || 390), s = w / 390; sc.style.transform = 'scale(' + s + ')'; box.style.height = (sc.firstElementChild ? (sc.querySelector('.dstage:not([hidden])') || sc.firstElementChild).offsetHeight * s : 0) + 'px'; }
    function tick(stage){
      var v = stage.querySelector('video'); if (!v) return;
      var t = v.currentTime;
      stage.querySelectorAll('.dc').forEach(function(c){ var on = t >= +c.dataset.a && t < +c.dataset.b; c.classList.toggle('on', on); });
      raf = requestAnimationFrame(function(){ tick(stage); });
    }
    function show(key){
      cancelAnimationFrame(raf);
      root.querySelectorAll('.dchip').forEach(function(b){ var on = b.dataset.for === key; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
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
    window.addEventListener('resize', fit);
    show('plan');
  });
})();
