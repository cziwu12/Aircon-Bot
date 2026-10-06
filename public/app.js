const chat=document.querySelector('#chat'),form=document.querySelector('#form'),input=document.querySelector('#input');
const sid=crypto.randomUUID(); let lang='en';
const add=(text,who='bot')=>{const d=document.createElement('div');d.className=`msg ${who}`;d.textContent=text;chat.append(d);chat.scrollTop=chat.scrollHeight};
const show=reply=>{add(reply.text);if(reply.options){const w=document.createElement('div');w.className='options';reply.options.forEach(([value,label])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>send(value,label);w.append(b)});chat.append(w);chat.scrollTop=chat.scrollHeight}};
async function api(payload){const r=await fetch('/api/demo',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sessionId:sid,lang,...payload})});return r.json()}
async function reset(){chat.innerHTML='';const out=await api({reset:true});show(out.reply);document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang))}
async function send(value,label=value){if(!value)return;add(label,'user');input.value='';show((await api({message:value})).reply)}
form.onsubmit=e=>{e.preventDefault();send(input.value)};document.querySelector('#reset').onclick=reset;document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;reset()});reset();
