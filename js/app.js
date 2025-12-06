// Shared app script for Neon Models demo
const sampleData = [
  {id:1,title:'Turbo Coupe',price:24,category:'Vehicles',pop:'high',img:'../assets/images/model1.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'A high-speed coupe model with glossy paint, perfect for city scenes.'},
  {id:2,title:'Cyber Jacket',price:8,category:'Clothing',pop:'medium',img:'../assets/images/model2.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'Futuristic jacket with neon trims and customizable textures.'},
  {id:3,title:'Retro Palm Tree',price:5,category:'Environment',pop:'low',img:'../assets/images/model3.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'Stylized palm tree, great for Miami-style scenes.'},
  {id:4,title:'Armored SUV',price:49,category:'Vehicles',pop:'high',img:'../assets/images/model4.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'Heavy-duty SUV with mount points and LODs.'},
  {id:5,title:'Neon Billboard',price:12,category:'Props',pop:'medium',img:'../assets/images/model5.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'Animated billboard with neon emissive textures.'},
  {id:6,title:'Hover Bike',price:34,category:'Vehicles',pop:'high',img:'../assets/images/model6.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'Sleek hover bike with dynamic glow and rigging.'},
  {id:7,title:'Stereo Speaker',price:6,category:'Props',pop:'low',img:'../assets/images/model2.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'Portable speaker with retro-future design.'},
  {id:8,title:'Luxury Sunglasses',price:4,category:'Clothing',pop:'medium',img:'../assets/images/model3.svg',glb:'https://modelviewer.dev/shared-assets/models/Astronaut.glb',desc:'Stylish sunglasses with reflective shaders.'}
];

/* Utility */
function qs(sel,root=document){return root.querySelector(sel)}
function qsa(sel,root=document){return Array.from(root.querySelectorAll(sel))}

/* Home */
function initHome(){
  const track = qs('#carouselTrack');
  const featured = sampleData.slice(0,6);
  const more = sampleData.slice(6);
  // If a carousel exists on the page, populate it. If not, skip carousel logic.
  if(track){
    featured.forEach(m=>{
      const el = document.createElement('div'); el.className='carousel-card';
      const thumb = m.glb ? `<model-viewer src="${m.glb}" alt="${m.title}" class="model-thumb" interaction-prompt="none" auto-rotate camera-controls></model-viewer>` : `<img class="model-thumb" src="${m.img}" alt="${m.title}">`;
      el.innerHTML = `${thumb}<div style="padding:6px"><div class="card-title">${m.title}</div><div class="price">$${m.price}</div></div>`;
      el.addEventListener('click',()=>location.href = `model.html?id=${m.id}`)
      track.appendChild(el);
    })

    // simple auto-slide
    let idx=0; setInterval(()=>{
      idx=(idx+1)%featured.length; track.style.transform = `translateX(${ - (idx*202)}px)`
    },3600)
  }

  // featured row
  const featuredRow = qs('#featuredRow');
  featured.forEach(m=>{
    const c=document.createElement('div'); c.className='card'; c.style.minWidth='220px';
    const thumb = m.glb ? `<model-viewer src="${m.glb}" alt="${m.title}" class="model-thumb" interaction-prompt="none" auto-rotate camera-controls></model-viewer>` : `<img src="${m.img}">`;
    c.innerHTML = `${thumb}<div class="card-title">${m.title}</div><div class="card-meta"><div class="pill">${m.category}</div><div class="price">$${m.price}</div></div>`;
    c.addEventListener('click',()=>location.href=`model.html?id=${m.id}`)
    featuredRow.appendChild(c);
  })

  // populate second row with remaining models
  if(featuredRow2){
    more.forEach(m=>{
      const c=document.createElement('div'); c.className='card'; c.style.minWidth='220px';
      const thumb = m.glb ? `<model-viewer src="${m.glb}" alt="${m.title}" class="model-thumb" interaction-prompt="none" auto-rotate camera-controls></model-viewer>` : `<img src="${m.img}">`;
      c.innerHTML = `${thumb}<div class="card-title">${m.title}</div><div class="card-meta"><div class="pill">${m.category}</div><div class="price">$${m.price}</div></div>`;
      c.addEventListener('click',()=>location.href=`model.html?id=${m.id}`)
      featuredRow2.appendChild(c);
    })
  }

  const s = qs('#searchMain'); if(s){s.addEventListener('input',(e)=>{
    const q=e.target.value.toLowerCase();
    [featuredRow, featuredRow2].forEach(row=>{
      if(!row) return;
      row.childNodes.forEach(n=>{n.style.display = n.textContent.toLowerCase().includes(q)?'block':'none'})
    })
  })}

  // Setup custom bottom scrollbars for the featured rows
  function setupHScrollbar(id){
    const content = qs('#'+id); const bar = document.querySelector(`.h-scrollbar[data-target="${id}"]`);
    if(!content || !bar) return;
    const thumb = bar.querySelector('.h-thumb');

    function update(){
      const cw = content.clientWidth; const sw = content.scrollWidth; const bw = bar.clientWidth;
      if(sw <= cw){ thumb.style.width='0px'; thumb.style.opacity='0'; return; }
      const ratio = cw / sw; const tw = Math.max(24, Math.round(bw * ratio));
      thumb.style.width = tw + 'px'; thumb.style.opacity='1';
      const left = (content.scrollLeft / (sw - cw)) * (bw - tw);
      thumb.style.left = Math.max(0, Math.round(left)) + 'px';
    }

    // sync from content scroll
    content.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();

    // drag support
    let dragging = false, startX=0, startScroll=0;
    thumb.addEventListener('mousedown', (e)=>{ dragging=true; startX = e.clientX; startScroll = content.scrollLeft; e.preventDefault(); document.body.style.userSelect='none';});
    document.addEventListener('mousemove', (e)=>{
      if(!dragging) return; const dx = e.clientX - startX; const bw = bar.clientWidth; const tw = thumb.clientWidth; const sw = content.scrollWidth; const cw = content.clientWidth;
      const ratio = (sw - cw) / (bw - tw); content.scrollLeft = Math.round(startScroll + dx * ratio);
    });
    document.addEventListener('mouseup', ()=>{ if(dragging){ dragging=false; document.body.style.userSelect='auto'; }});

    // click on track jumps
    bar.addEventListener('click', (e)=>{
      if(e.target === thumb) return; const rect = bar.getBoundingClientRect(); const clickX = e.clientX - rect.left; const bw = bar.clientWidth; const tw = thumb.clientWidth; const sw = content.scrollWidth; const cw = content.clientWidth;
      const left = Math.max(0, Math.min(bw - tw, clickX - tw/2));
      const scrollPos = (left / (bw - tw)) * (sw - cw); content.scrollLeft = scrollPos;
    });
  }

  setupHScrollbar('featuredRow');
  setupHScrollbar('featuredRow2');

  // Hero interactivity: mouse parallax/tilt and CTA opens modal with first model
  (function(){
    const hero = qs('.hero'); if(!hero) return;
    // wrap inner content for 3d transform
    if(!hero.querySelector('.hero-inner')){
      const inner = document.createElement('div'); inner.className='hero-inner';
      while(hero.firstChild) inner.appendChild(hero.firstChild);
      hero.appendChild(inner);
    }
    const inner = hero.querySelector('.hero-inner'); const bg = qs('.hero-bg'); const visual = qs('.hero-visual');
    const maxTilt = 8; const maxTranslate = 14;
    function onMove(e){
      const r = hero.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
      const rotY = x * maxTilt * -1; const rotX = y * maxTilt;
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      if(bg) bg.style.transform = `translate(${x * maxTranslate}px, ${y * maxTranslate}px) scale(1.04)`;
      if(visual) visual.style.transform = `translate(${x * (maxTranslate*0.6)}px, ${y * (maxTranslate*0.6)}px)`;
    }
    function onLeave(){ inner.style.transform='rotateX(0deg) rotateY(0deg)'; if(bg) { bg.style.transform='none'; bg.style.filter='blur(40px)'; } if(visual) visual.style.transform='none'; }
    hero.addEventListener('mousemove', onMove); hero.addEventListener('mouseleave', onLeave);

    // CTA -> modal
    const cta = qs('.cta'); const modal = qs('#heroModelModal'); const modalContainer = qs('#heroModelContainer');
    if(cta && modal && modalContainer){
      cta.addEventListener('click', (ev)=>{
        ev.preventDefault(); modal.setAttribute('aria-hidden','false');
        // insert model-viewer (use first sampleData glb if available)
        const glb = (sampleData[0] && sampleData[0].glb) ? sampleData[0].glb : 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
        modalContainer.innerHTML = `<model-viewer src="${glb}" camera-controls auto-rotate interaction-prompt="auto"></model-viewer>`;
      });
      // close handlers
      modal.querySelector('.modal-close').addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); modalContainer.innerHTML=''; });
      modal.querySelector('.modal-backdrop').addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); modalContainer.innerHTML=''; });
    }
  })();
}

/* Marketplace */
function initMarketplace(){
  const grid = qs('#marketGrid');
  const catSel = qs('#categoryFilter');
  const popSel = qs('#popFilter');
  const priceSel = qs('#priceFilter');
  const search = qs('#searchBar');
  const clearBtn = qs('#clearBtn');

  // populate categories
  const cats = ['All Categories', ...new Set(sampleData.map(s=>s.category))];
  cats.slice(1).forEach(c=>{const o=document.createElement('option'); o.value=c; o.textContent=c; catSel.appendChild(o)})

  function render(list){
    grid.innerHTML='';
    list.forEach(m=>{
      const el=document.createElement('div'); el.className='card';
      const thumb = m.glb ? `<model-viewer src="${m.glb}" alt="${m.title}" class="model-thumb" interaction-prompt="none" auto-rotate camera-controls></model-viewer>` : `<img src="${m.img}" alt="${m.title}">`;
      el.innerHTML = `${thumb}<div class="card-title">${m.title}</div><div class="card-meta"><div class="pill">${m.category}</div><div style="display:flex;gap:8px;align-items:center"><div class="price">$${m.price}</div><button class="btn" onclick="location.href='model.html?id=${m.id}'">View</button></div></div>`;
      grid.appendChild(el);
    })
  }

  function applyFilters(){
    let res = sampleData.slice();
    const cat = catSel.value; if(cat && cat!=='all' && cat!=='All Categories') res = res.filter(r=>r.category===cat);
    const pop = popSel.value; if(pop && pop!=='all') res = res.filter(r=>r.pop===pop);
    const price = priceSel.value; if(price && price!=='all'){
      const [min,max]=price.split('-').map(Number); res = res.filter(r=>r.price>=min && r.price<= (max||9999));
    }
    const q = search.value.trim().toLowerCase(); if(q) res = res.filter(r=>r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    render(res);
  }

  // events
  [catSel,popSel,priceSel].forEach(el=>el.addEventListener('change',applyFilters));
  search.addEventListener('input',applyFilters);
  clearBtn.addEventListener('click',()=>{search.value='';catSel.value='all';popSel.value='all';priceSel.value='all';applyFilters()});

  render(sampleData);
}

/* Model page */
function initModel(){
  const params = new URLSearchParams(location.search); const id = Number(params.get('id'))||1;
  const model = sampleData.find(s=>s.id===id) || sampleData[0];
  const el = qs('#modelView');
  const preview = model.glb ? `<model-viewer class="model-preview-viewer" src="${model.glb}" alt="${model.title}" camera-controls auto-rotate interaction-prompt="auto"></model-viewer>` : `<img src="${model.img}" style="width:100%;border-radius:12px">`;
  el.innerHTML = `
    <div class="model-preview">${preview}</div>
    <div class="model-info">
      <h2 style="margin-top:0">${model.title}</h2>
      <div class="pill">${model.category}</div>
      <p style="margin-top:16px;color:#cfc6e6">${model.desc}</p>
      <h3 style="margin-top:18px">$${model.price}</h3>
      <div style="display:flex;gap:12px;margin-top:12px">
        <button class="btn btn-primary" onclick="alert('Mock purchase: $'+${model.price})">Purchase</button>
        <button class="btn" onclick="alert('Mock download started')">Download</button>
      </div>
    </div>
  `;

  // related
  const related = sampleData.filter(s=>s.category===model.category && s.id!==model.id).slice(0,5);
  const row = qs('#relatedRow'); row.innerHTML=''; related.forEach(r=>{
    const c=document.createElement('div'); c.className='card'; c.style.minWidth='180px';
    const thumb = r.glb ? `<model-viewer src="${r.glb}" alt="${r.title}" class="model-thumb" interaction-prompt="none" auto-rotate camera-controls></model-viewer>` : `<img src="${r.img}">`;
    c.innerHTML = `${thumb}<div class="card-title">${r.title}</div><div class="price">$${r.price}</div>`;
    c.addEventListener('click',()=>location.href=`model.html?id=${r.id}`);
    row.appendChild(c);
  })
}

// Expose for inline calls
window.initHome = initHome; window.initMarketplace = initMarketplace; window.initModel = initModel;

// Simple laser-like cursor trail (line between last and current mouse positions)
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let last = 0; const THROTTLE = 16; // milliseconds between updates
  let lastPos = null;

  function createLaser(x1,y1,x2,y2){
    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.hypot(dx,dy);
    if(dist < 4) return; // skip very small moves
    const angle = Math.atan2(dy,dx) * 180 / Math.PI;

    const el = document.createElement('div'); el.className = 'cursor-laser';
    el.style.left = x1 + 'px'; el.style.top = y1 + 'px';
    el.style.width = Math.max(2, dist) + 'px';
    el.style.transform = `translate(0,-50%) rotate(${angle}deg) scaleX(0)`;
    document.body.appendChild(el);

    // animate to full length and visible
    requestAnimationFrame(()=>{
      el.style.transform = `translate(0,-50%) rotate(${angle}deg) scaleX(1)`;
      el.style.opacity = '1';
    });

    // fade out shortly after drawing
    setTimeout(()=>{
      el.style.opacity = '0';
      el.style.transform = `translate(0,-50%) rotate(${angle}deg) scaleX(1) translateY(-6px)`;
    }, 160);

    // remove after transition
    setTimeout(()=>{ if(el && el.parentNode) el.parentNode.removeChild(el) }, 420);
  }

  function onMove(e){
    const now = Date.now(); if(now - last < THROTTLE) return; last = now;
    if(lastPos){ createLaser(lastPos.x, lastPos.y, e.clientX, e.clientY); }
    lastPos = {x:e.clientX, y:e.clientY};
  }

  function onTouch(e){
    const t = e.touches && e.touches[0]; if(!t) return; const now = Date.now(); if(now - last < THROTTLE) return; last = now;
    if(lastPos){ createLaser(lastPos.x, lastPos.y, t.clientX, t.clientY); }
    lastPos = {x:t.clientX, y:t.clientY};
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onTouch, {passive:true});
  document.addEventListener('mouseleave', ()=> lastPos = null);
  document.addEventListener('touchend', ()=> lastPos = null);
})();

// Background canvas particles (neon, performant)
(function(){
  // Respect reduced motion
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'bgParticlesCanvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  let w=0,h=0,dpr=1, particles = [], rafId = null;

  function hexToRgba(hex, a){
    hex = String(hex).trim();
    if(!hex) return `rgba(255,255,255,${a})`;
    if(hex.startsWith('rgb')) return hex.replace('rgb','rgba').replace(')',`,${a})`);
    if(hex[0] === '#'){
      if(hex.length===4) hex = '#'+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return hex;
  }

  function resize(){
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    initParticles();
  }

  function initParticles(){
    particles = [];
    const area = w * h;
    const count = Math.max(30, Math.min(150, Math.round(area * 0.00006)));
    const rootStyle = getComputedStyle(document.documentElement);
    const colors = [rootStyle.getPropertyValue('--pink'), rootStyle.getPropertyValue('--purple'), rootStyle.getPropertyValue('--cyan')].map(s=>s.trim()).filter(Boolean);
    for(let i=0;i<count;i++){
      const radius = Math.random() * 2.8 + 0.4;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.12,
        r: radius,
        baseAlpha: Math.random() * 0.18 + 0.03,
        color: colors[Math.floor(Math.random() * colors.length)] || '#7b2cff'
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -50) p.x = w + 50; if(p.x > w + 50) p.x = -50;
      if(p.y < -50) p.y = h + 50; if(p.y > h + 50) p.y = -50;

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
      g.addColorStop(0, hexToRgba(p.color, p.baseAlpha));
      g.addColorStop(1, hexToRgba(p.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    rafId = requestAnimationFrame(draw);
  }

  // Pause animation on hidden tabs to save CPU
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ if(rafId) cancelAnimationFrame(rafId); rafId = null; }
    else { if(!rafId) rafId = requestAnimationFrame(draw); }
  });

  window.addEventListener('resize', resize);
  // initial
  resize();
  rafId = requestAnimationFrame(draw);

})();
