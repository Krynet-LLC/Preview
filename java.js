(() => {
'use strict';

/* =========================
   UTIL
========================= */
const $ = (s,p=document)=>p.querySelector(s);
const create = (tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e;};
const isURL = v => typeof v === 'string' && /^https?:\/\//i.test(v);
const isImage = v => isURL(v) && /\.(png|jpg|jpeg|gif|webp|svg)/i.test(v);

/* =========================
   LOAD CONFIG
========================= */
async function loadConfig(){
  const res = await fetch('https://raw.githubusercontent.com/Krynet-LLC/Preview/main/config.json');
  const config = await res.json();
  renderAll(config);
}

/* =========================
   RECURSIVE RENDER
========================= */
function renderAll(data){
  const container = $('.sections-container');
  container.innerHTML = '';
  container.appendChild(renderNode(data));
}

/* =========================
   NODE RENDERER (CORE MAGIC)
========================= */
function renderNode(value, key=null){

  // Wrapper
  const wrapper = create('div','json-block');

  // Title
  if(key){
    const title = create('h2');
    title.textContent = formatKey(key);
    wrapper.appendChild(title);
  }

  // STRING / NUMBER
  if(typeof value === 'string' || typeof value === 'number'){
    if(isImage(value)){
      const img = create('img');
      img.src = value;
      img.style.maxWidth='200px';
      wrapper.appendChild(img);
    }
    else if(isURL(value)){
      const a = create('a');
      a.href = value;
      a.textContent = value;
      a.target='_blank';
      wrapper.appendChild(a);
    }
    else{
      const p = create('p');
      p.textContent = value;
      wrapper.appendChild(p);
    }
    return wrapper;
  }

  // ARRAY
  if(Array.isArray(value)){
    const grid = create('div','json-array');
    value.forEach((item,i)=>{
      grid.appendChild(renderNode(item, `${key ? key+' ' : ''}${i+1}`));
    });
    wrapper.appendChild(grid);
    return wrapper;
  }

  // OBJECT
  if(typeof value === 'object' && value !== null){
    Object.entries(value).forEach(([k,v])=>{
      wrapper.appendChild(renderNode(v,k));
    });
    return wrapper;
  }

  return wrapper;
}

/* =========================
   FORMAT KEY NAMES
========================= */
function formatKey(k){
  return k
    .replace(/([A-Z])/g,' $1')
    .replace(/_/g,' ')
    .replace(/\b\w/g,c=>c.toUpperCase());
}

/* =========================
   COUNTDOWN
========================= */
function initCountdown(){
  const releaseDate = new Date('2030-12-31T00:00:00Z').getTime();
  const releaseEl = $('.release');
  if(!releaseEl) return;

  const update=()=>{
    const diff=releaseDate-Date.now();
    if(diff<=0){
      releaseEl.innerHTML='🚀 Krynet.ai is LIVE.';
      return;
    }
    const d=Math.floor(diff/86400000);
    const h=Math.floor(diff%86400000/3600000);
    const m=Math.floor(diff%3600000/60000);
    const s=Math.floor(diff%60000/1000);

    releaseEl.innerHTML=`🚀 ${d}d ${h}h ${m}m ${s}s`;
  };

  update();
  setInterval(update,1000);
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded',()=>{
  loadConfig();
  initCountdown();
});

})();
