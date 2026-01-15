(function () {
  if (window.innerWidth < 768) return;

  let models=[], index=0, tips, priority=0, idleTimer;
  const $ = id => document.getElementById(id);
  const rand = a => Array.isArray(a)?a[Math.floor(Math.random()*a.length)]:a;

  function show(t, ms=4000, p=1){
    if(p < priority) return;
    priority=p;
    const b=$("l2d-tips");
    b.innerHTML=t;
    b.classList.add("show");
    clearTimeout(b.timer);
    b.timer=setTimeout(()=>{b.classList.remove("show");priority=0;},ms);
  }

  function load(i){
    index=i;
    loadlive2d("l2d-canvas", models[i]);
    localStorage.setItem("l2d-model",i);
  }

  function idle(){
    clearInterval(idleTimer);
    idleTimer=setInterval(()=>show(rand(tips.idle)),20000);
  }

  function drag(el){
    let x=0,y=0,dx=0,dy=0;
    el.onmousedown=e=>{
      dx=e.clientX;dy=e.clientY;
      document.onmousemove=m=>{
        x+=m.clientX-dx;y+=m.clientY-dy;
        el.style.transform=`translate(${x}px,${y}px)`;
        dx=m.clientX;dy=m.clientY;
      };
      document.onmouseup=()=>document.onmousemove=null;
    };
  }

  window.Live2DVi={
    init:async cfg=>{
      tips=await fetch(cfg.messages).then(r=>r.json());
      models=cfg.models;

      document.body.insertAdjacentHTML("beforeend",`
        <div id="l2d-toggle">👧</div>
        <div id="l2d">
          <div id="l2d-tips"></div>
          <canvas id="l2d-canvas" width="800" height="800"></canvas>
          <div id="l2d-tools">
            <span id="l2d-hide">✖</span>
            <span id="l2d-photo">📷</span>
            <span id="l2d-switch">🔁</span>
          </div>
        </div>`);

      drag($("l2d"));
      load(localStorage.getItem("l2d-model")||0);
      show(tips.welcome,7000,10);
      idle();

      document.addEventListener("mouseover",e=>{
        tips.hover.forEach(h=>{
          if(e.target.closest(h.selector)) show(rand(h.text),4000,5);
        });
      });

      document.addEventListener("click",e=>{
        tips.click.forEach(c=>{
          if(e.target.closest(c.selector)) show(rand(c.text),4000,6);
        });
      });

      $("l2d-hide").onclick=()=>{
        $("l2d").style.display="none";
        $("l2d-toggle").style.display="block";
      };
      $("l2d-toggle").onclick=()=>{
        $("l2d").style.display="block";
        $("l2d-toggle").style.display="none";
      };
      $("l2d-switch").onclick=()=>{
        load((index+1)%models.length);
        show(tips.tool.switch,4000,8);
      };
      $("l2d-photo").onclick=()=>{
        const a=document.createElement("a");
        a.download="live2d.png";
        a.href=$("l2d-canvas").toDataURL();
        a.click();
        show(tips.tool.photo,4000,9);
      };
    }
  };
})();
