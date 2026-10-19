/* ---------- state & infra ---------- */
let cur='home',catFilter=null,catQ='';
const stack=[];
function openModal(node,kind='b'){const ov=h('div',{class:'ov '+kind,onclick:e=>{if(e.target===ov)close()}},node);document.body.append(ov);document.body.classList.add('lock');
 const o={ov,close};function close(){ov.remove();const k=stack.indexOf(o);if(k>-1)stack.splice(k,1);if(!stack.length&&!$('.sv,.lb,.adm'))document.body.classList.remove('lock')}stack.push(o);return close}
addEventListener('keydown',e=>{if(e.key==='Escape'&&stack.length)stack[stack.length-1].close()});
const unlock=()=>{if(!stack.length&&!$('.sv,.lb,.adm'))document.body.classList.remove('lock')};
const lum=hex=>{const n=parseInt(hex.replace('#',''),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255};
function applyTheme(){const t=S.theme,r=document.documentElement,st=r.style;st.setProperty('--accent',t.accent);st.setProperty('--accent2',t.accent2);st.setProperty('--bgd',t.bgDark);st.setProperty('--bgl',t.bgLight);
 st.setProperty('--ga',t.glass/100);st.setProperty('--blur',t.blur+'px');st.setProperty('--r',t.radius+'px');st.setProperty('--on-accent',lum(t.accent)>.55?'#2a1c08':'#ffffff');
 r.setAttribute('data-theme',V.mode||t.mode||'dark')}
const isDark=()=>(V.mode||S.theme.mode)!=='light';
function toggleMode(){V.mode=isDark()?'light':'dark';saveV();applyTheme();document.querySelectorAll('.tg').forEach(e=>e.classList.toggle('on',isDark()))}
const curUser=()=>S.users.find(u=>u.id===V.user)||null;
function openUrl(u){const a=h('a',{href:u,target:'_blank',rel:'noopener'});document.body.append(a);a.click();a.remove()}
function runTarget(t){if(!t)return;
 if(t.startsWith('view:'))return go(t.slice(5));if(t==='about'){go('home');setTimeout(()=>{const e=$('#about');e&&e.scrollIntoView({behavior:'smooth',block:'center'})},120);return}
 if(t==='contact')return openContact();if(t.startsWith('url:'))return openUrl(t.slice(4));if(t.startsWith('product:'))return openProduct(t.slice(8));if(t==='login')return openAuth()}
const ago=ts=>{const m=Math.round((Date.now()-ts)/6e4);return m<1?'همین الان':m<60?fa(m)+' دقیقه پیش':m<1440?fa(Math.round(m/60))+' ساعت پیش':fa(Math.round(m/1440))+' روز پیش'};
const normNum=s=>String(s||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\D/g,'');

/* ---------- header / nav ---------- */
function renderHeader(){const hd=$('#hd'),u=curUser();hd.innerHTML='';
 hd.append(h('div',{class:'hd-in glass'},
  h('div',{class:'hd-grp'},h('button',{class:'ib','aria-label':'منو',onclick:openMenu,html:ic('menu')}),
   h('button',{class:'ib','aria-label':u?'حساب کاربری':'ورود یا ثبت‌نام',onclick:openAuth,html:u?`<b style="color:var(--accent2)">${u.name.trim()[0]||'؟'}</b>`:ic('user')})),
  h('a',{class:'logo',href:'#',onclick:e=>{e.preventDefault();go('home')}},S.store.logo?h('img',{src:S.store.logo,alt:S.store.name}):[I('bag',26),S.store.name])))}
function buildNav(){const nv=$('#nv');nv.innerHTML='';const inn=h('div',{class:'nv-in'}),bar=h('div',{class:'nv-bar glass'});
 S.nav.forEach(n=>bar.append(h('button',{class:'nv-b','data-v':n.view,'aria-label':n.label,onclick:()=>go(n.view)},I(n.icon,22),h('span',{},n.label),n.view==='cart'?h('em',{class:'cnt',hidden:true}):null)));
 inn.append(bar,h('div',{class:'nv-bub'}));nv.append(inn);cartBadge()}
function setNav(animate){const nv=$('#nv'),inn=$('.nv-in',nv),bub=$('.nv-bub',nv);if(!inn)return;const btns=[...nv.querySelectorAll('.nv-b')],act=btns.find(b=>b.dataset.v===cur),item=S.nav.find(n=>n.view===cur);
 const apply=()=>{btns.forEach(b=>b.classList.toggle('on',b===act));if(act){const x=act.offsetLeft+act.offsetWidth/2;inn.style.setProperty('--nx',x+'px');bub.style.left=x+'px';bub.innerHTML=ic(item.icon,26);inn.style.setProperty('--nr','37px')}else inn.style.setProperty('--nr','0px')};
 if(!animate){apply();return}nv.classList.add('sw');inn.style.setProperty('--nr','0px');setTimeout(()=>{nv.classList.remove('sw');apply()},180)}
addEventListener('resize',()=>setNav(false));
function cartBadge(){const n=V.cart.reduce((a,c)=>a+c.qty,0);document.querySelectorAll('.nv-b .cnt').forEach(e=>{e.hidden=!n;e.textContent=fa(n)})}
function go(v){const was=cur;cur=v;if(v!=='categories'){catFilter=null;catQ=''}renderMain();setNav(was!==v);window.scrollTo({top:0})}

/* ---------- views ---------- */
function renderMain(){const app=$('#app');app.innerHTML='';const v={home:homeView,categories:catView,cart:cartView,track:trackView,pay:payView}[cur]||homeView;add(app,[v()]);app.classList.toggle('home',!!$('.hero',app));updateHd()}
function secHead(t,extra){return h('div',{class:'sec-h'},h('h3',{},t),extra)}
function homeView(){const sh=S.show,A=S.about,hn=sh.hero?hero(sh.stories?storiesSec(true):null):null;return[
 hn,!hn&&sh.stories&&storiesSec(false),
 sh.intro&&h('section',{class:'intro glass'},h('span',{class:'star',html:ic('star',34)}),h('span',{class:'k'},A.kicker),h('h3',{},A.introTitle),h('p',{},A.introText)),
 sh.products&&h('section',{},secHead(S.store.productsTitle,h('button',{onclick:()=>go('categories')},'مشاهده همه')),h('div',{class:'grid'},S.products.map(pcard))),
 sh.features&&h('section',{class:'feat'},S.features.map(f=>h('div',{class:'fc glass'},h('span',{class:'fi',html:ic(f.icon,26)}),h('b',{},f.title),h('span',{},f.text)))),
 sh.night&&h('button',{class:'night glass',onclick:toggleMode},h('span',{class:'ni',html:ic('moon',24)}),h('span',{class:'nt'},h('small',{},A.nightHint),h('b',{},A.nightTitle)),h('span',{class:'tg'+(isDark()?' on':'')})),
 sh.about&&h('section',{class:'about glass',id:'about'},h('h3',{},A.title),h('p',{},A.text),
  sh.social&&h('div',{class:'soc'},S.socials.map(s=>h('a',{href:s.url,target:'_blank',rel:'noopener','aria-label':s.name,title:s.name,html:ic(s.icon,24)}))),
  h('div',{class:'links'},S.links.map(l=>h('a',{href:'#',onclick:e=>{e.preventDefault();runTarget(l.target)}},l.label)))),
 h('div',{class:'copy'},S.store.copy)]}
function hero(panel){const sl=S.hero;if(!sl.length)return null;let i=0,timer,moved=false,sx=0;
 const slides=sl.map(s=>h('div',{class:'sl',onclick:()=>{if(moved)return;prod(s.productId)?openProduct(s.productId):go('categories')}},h('img',{src:s.img,alt:s.title}),
  h('div',{class:'tx'},s.badge&&h('span',{class:'chip'},I('sparkle',14),s.badge),h('h2',{},s.title),s.sub&&h('p',{},s.sub),h('span',{class:'btn-g'},'مشاهده جزئیات',I('chl',16)))));
 const dots=h('div',{class:'dots'},sl.map(()=>h('i')));const root=h('div',{class:'hero'+(panel?' has-st':'')},slides,dots,h('button',{class:'ib hero-search','aria-label':'جستجو',html:ic('search',20),onclick:openSearch}),panel);
 const show=n=>{i=(n+sl.length)%sl.length;slides.forEach((e,k)=>e.classList.toggle('on',k===i));[...dots.children].forEach((e,k)=>e.classList.toggle('on',k===i))};
 const run=()=>{clearInterval(timer);if(sl.length>1)timer=setInterval(()=>{if(!root.isConnected)return clearInterval(timer);show(i+1)},5200)};
 root.addEventListener('pointerdown',e=>{sx=e.target.closest('.hero-st,.hero-search')?null:e.clientX;moved=false});root.addEventListener('pointerup',e=>{if(sx==null)return;const d=e.clientX-sx;if(Math.abs(d)>40){moved=true;show(i+(d<0?1:-1));run()}});
 show(0);run();return root}
function thumbEl(s){return s.type==='video'&&!s.thumb?h('video',{src:s.src+'#t=0.1',muted:true,playsinline:true,preload:'metadata'}):h('img',{src:s.thumb||s.src,alt:s.title,loading:'lazy'})}
function storiesSec(inPanel){const list=S.stories,seen=list.filter(s=>V.seen[s.id]).length,all=seen===list.length;
 const row=h('div',{class:'stories',role:'list'},list.map((s,i)=>h('button',{class:'st',role:'listitem',onclick:()=>openStory(i)},h('div',{class:'ring'+(V.seen[s.id]?' seen':'')},thumbEl(s),s.type==='video'?h('span',{class:'pl',html:ic('play',11)}):null),h('span',{},s.title))));
 return h('section',{id:'stories-sec',class:inPanel?'hero-st glass':''},inPanel?h('div',{class:'st-h'},h('span',{html:ic('sparkle',16)}),h('b',{},'استوری‌ها')):null,row,h('div',{class:inPanel?'hint':'hint glass'},h('button',{class:'nb','aria-label':'بعدی',onclick:()=>row.scrollBy({left:-240,behavior:'smooth'}),html:ic('chl',18)}),
  h('span',{class:'bar'},h('b',{style:{width:(list.length?seen/list.length*100:0)+'%'}})),
  h('span',{},list.length?(all?`${fa(list.length)} استوری · ${S.store.storiesHintDone}`:`${fa(list.length-seen)} استوری جدید · ${fa(seen)} دیده شده`):'هنوز استوری‌ای نیست')))}
function refreshStories(){const e=$('#stories-sec');if(e&&S.show.stories)e.replaceWith(storiesSec(e.classList.contains('hero-st')))}
function toggleWish(id,btn){V.wish[id]=!V.wish[id];if(!V.wish[id])delete V.wish[id];saveV();btn&&btn.classList.toggle('on',!!V.wish[id]);toast(V.wish[id]?'به علاقه‌مندی‌ها اضافه شد':'از علاقه‌مندی‌ها حذف شد')}
function pcard(p){const d=disc(p);return h('article',{class:'pc glass',onclick:()=>openProduct(p.id)},p.badge?h('div',{class:'bd'},p.badge):null,
 h('div',{class:'im'},h('img',{src:p.images[0]||'',alt:p.title,loading:'lazy'}),d?h('span',{class:'off'},fa(d)+'٪ تخفیف'):null,
  h('button',{class:'rb add','aria-label':'افزودن به سبد',html:ic('plus'),onclick:e=>{e.stopPropagation();p.colors.length>1?openProduct(p.id):(addCart(p.id,p.colors[0]?.id||'',1),toast('به سبد اضافه شد'))}}),
  h('button',{class:'rb fav'+(V.wish[p.id]?' on':''),'aria-label':'علاقه‌مندی',html:ic('heart',20),onclick:e=>{e.stopPropagation();toggleWish(p.id,e.currentTarget)}})),
 h('div',{class:'in'},h('h4',{},p.title),h('div',{class:'old'},p.oldPrice>p.price?money(p.oldPrice):''),h('div',{class:'price'},fa(p.price),' ',h('small',{},S.store.currency)),
  p.colors.length>1?h('div',{class:'sw-row'},p.colors.slice(0,6).map(c=>h('i',{style:{background:c.hex}}))):null))}

/* ---------- product sheet + gallery ---------- */
function openProduct(id){const p=prod(id);if(!p)return;let sel=p.colors[0]?.id||'',qty=1;
 const all=[...new Set([...p.images,...p.colors.map(c=>c.img).filter(Boolean)])];
 const mainImg=h('img',{src:p.images[0]||all[0]||'',alt:p.title});
 const thumbs=p.images.map((src,k)=>h('button',{class:k?'':'on','aria-label':'تصویر '+fa(k+1),onclick:()=>{mainImg.src=src;mark(k)}},h('img',{src,alt:''})));
 const mark=k=>thumbs.forEach((b,j)=>b.classList.toggle('on',j===k));
 const fav=h('button',{class:'rb fav'+(V.wish[p.id]?' on':''),style:{position:'absolute',top:'10px',left:'10px',bottom:'auto',right:'auto'},'aria-label':'علاقه‌مندی',html:ic('heart',20),onclick:e=>{e.stopPropagation();toggleWish(p.id,fav)}});
 const main=h('div',{class:'main',onclick:()=>openLightbox(all,Math.max(0,all.indexOf(mainImg.getAttribute('src'))))},mainImg,h('span',{class:'hn'},'برای بزرگ‌نمایی لمس کن'),fav);
 const cname=h('span',{},p.colors[0]?.name||''),cbtn=p.colors.map(c=>h('button',{class:c.id===sel?'on':'','aria-label':c.name,title:c.name,onclick:()=>{sel=c.id;cbtn.forEach((b,j)=>b.classList.toggle('on',p.colors[j].id===sel));cname.textContent=c.name;if(c.img){mainImg.src=c.img;mark(-1)}}},h('i',{style:{background:c.hex}})));
 const qv=h('b',{},fa(1)),d=disc(p);
 const similar=S.products.filter(x=>x.id!==p.id&&x.cat===p.cat).slice(0,6);
 let close;const addNow=()=>addCart(p.id,sel,qty);
 const sheet=h('div',{class:'sh',role:'dialog','aria-label':p.title},h('div',{class:'grab'}),h('button',{class:'xb','aria-label':'بستن',html:ic('close',20),onclick:()=>close()}),
  h('div',{class:'pg'},main,h('div',{class:'th'},h('div',{class:'th-in'},thumbs))),
  h('h2',{class:'pt'},p.title),h('div',{class:'pp'},h('span',{class:'price'},money(p.price)),p.oldPrice>p.price?h('span',{class:'old'},money(p.oldPrice)):null,d?h('span',{class:'disc'},fa(d)+'٪ تخفیف'):null),
  p.colors.length?[h('div',{class:'cl-t'},'رنگ‌بندی',cname),h('div',{class:'cl'},cbtn)]:null,
  h('div',{class:'cl-t'},'تعداد',h('span',{},p.stock>0?`موجود: ${fa(p.stock)} عدد`:'ناموجود')),
  h('div',{class:'qty',style:{marginInline:'2px'}},h('button',{'aria-label':'افزایش',html:ic('plus',16),onclick:()=>{qty=Math.min(qty+1,Math.max(1,p.stock||99));qv.textContent=fa(qty)}}),qv,h('button',{'aria-label':'کاهش',html:ic('down',16),onclick:()=>{qty=Math.max(1,qty-1);qv.textContent=fa(qty)}})),
  h('div',{class:'desc'},p.desc),
  similar.length?[h('div',{class:'cl-t'},'محصولات مشابه'),h('div',{class:'sim'},similar.map(x=>{const c=pcard(x);c.onclick=()=>{close();openProduct(x.id)};return c}))]:null,
  h('div',{class:'actions'},h('button',{class:'pbtn',disabled:p.stock<=0,onclick:()=>{addNow();toast('به سبد خرید اضافه شد');close()}},I('bag',20),'افزودن به سبد'),h('button',{class:'pbtn ghost',disabled:p.stock<=0,onclick:()=>{addNow();close();go('cart')}},'سفارش مستقیم')));
 close=openModal(sheet,'b')}
function openLightbox(list,start){if(!list.length)return;let i=start,x0=0;const img=h('img',{alt:'',draggable:false}),cnt=h('span',{}),th=list.map((s,k)=>h('button',{'aria-label':'تصویر '+fa(k+1),onclick:()=>set(k)},h('img',{src:s,alt:''})));
 const set=n=>{i=(n+list.length)%list.length;img.src=list[i];img.classList.remove('z');cnt.textContent=`${fa(i+1)} / ${fa(list.length)}`;th.forEach((b,k)=>b.classList.toggle('on',k===i))};
 const close=()=>{root.remove();unlock()};
 img.addEventListener('click',e=>{const r=img.getBoundingClientRect();img.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`;img.classList.toggle('z')});
 const st=h('div',{class:'lb-st'},img,list.length>1?[h('button',{class:'lb-n p','aria-label':'قبلی',html:ic('chr',24),onclick:()=>set(i-1)}),h('button',{class:'lb-n n','aria-label':'بعدی',html:ic('chl',24),onclick:()=>set(i+1)})]:null);
 st.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});st.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>60&&!img.classList.contains('z'))set(i+(d<0?1:-1))});
 const root=h('div',{class:'lb',role:'dialog','aria-label':'گالری تصاویر'},h('div',{class:'lb-top'},cnt,h('button',{class:'ib','aria-label':'بستن',html:ic('close'),onclick:close})),st,list.length>1?h('div',{class:'lb-th'},th):null);
 document.body.append(root);document.body.classList.add('lock');set(i);
 const esc=e=>{if(e.key==='Escape'){close();removeEventListener('keydown',esc)}};addEventListener('keydown',esc)}

/* ---------- cart / orders ---------- */
function addCart(pid,color,qty){const l=V.cart.find(c=>c.pid===pid&&c.color===color);l?l.qty+=qty:V.cart.push({pid,color,qty});saveV();cartBadge()}
const lineInfo=l=>{const p=prod(l.pid);if(!p)return null;const c=p.colors.find(x=>x.id===l.color);return{p,c,img:(c&&c.img)||p.images[0],price:p.price*l.qty}};
function cartView(){const lines=V.cart.map(l=>({l,i:lineInfo(l)})).filter(x=>x.i);V.cart=lines.map(x=>x.l);
 if(!lines.length)return[h('h2',{class:'pg-h'},'سبد خرید'),h('div',{class:'empty glass'},I('bag',46),h('div',{},'سبد خرید شما خالی است'),h('button',{class:'btn',onclick:()=>go('home')},'مشاهده محصولات'))];
 const total=lines.reduce((a,x)=>a+x.i.price,0);
 const name=h('input',{class:'in',id:'o-name',placeholder:'نام و نام خانوادگی',value:curUser()?.name||''}),phone=h('input',{class:'in',id:'o-phone',type:'tel',inputmode:'tel',placeholder:'شماره موبایل (۰۹…)',value:curUser()?.phone||''}),addr=h('textarea',{class:'in',id:'o-addr',rows:3,placeholder:'آدرس کامل و کد پستی'}),note=h('input',{class:'in',id:'o-note',placeholder:'توضیحات (اختیاری)'});
 return[h('h2',{class:'pg-h'},'سبد خرید'),
  h('div',{style:{display:'flex',flexDirection:'column',gap:'12px'}},lines.map(({l,i})=>h('div',{class:'ci glass'},h('img',{src:i.img,alt:''}),h('div',{class:'m'},h('b',{},i.p.title),i.c?h('small',{},'رنگ: '+i.c.name):null,h('div',{class:'price'},money(i.price))),
   h('div',{style:{display:'flex',flexDirection:'column',gap:'8px',alignItems:'center'}},h('div',{class:'qty'},h('button',{'aria-label':'افزایش',html:ic('plus',14),onclick:()=>{l.qty++;saveV();renderMain();cartBadge()}}),h('b',{},fa(l.qty)),h('button',{'aria-label':'کاهش',html:ic('down',14),onclick:()=>{l.qty=Math.max(1,l.qty-1);saveV();renderMain();cartBadge()}})),
    h('button',{class:'x','aria-label':'حذف',html:ic('trash',18),onclick:()=>{V.cart=V.cart.filter(c=>c!==l);saveV();renderMain();cartBadge()}}))))),
  h('div',{class:'tot glass'},h('div',{},h('span',{},'جمع کالاها'),h('span',{},money(total))),h('div',{},h('span',{},'هزینه ارسال'),h('span',{},'در مرحله پرداخت')),h('div',{class:'g'},h('span',{},'مبلغ قابل پرداخت'),h('span',{},money(total)))),
  h('form',{class:'frm glass',onsubmit:e=>{e.preventDefault();
    const ph=normNum(phone.value);if(!name.value.trim())return toast('نام را وارد کنید');if(!/^09\d{9}$/.test(ph))return toast('شماره موبایل معتبر نیست');if(addr.value.trim().length<8)return toast('آدرس را کامل‌تر بنویسید');
    const code='K'+Math.floor(100000+Math.random()*900000);
    S.orders.unshift({id:uid(),code,created:Date.now(),name:name.value.trim(),phone:ph,address:addr.value.trim(),note:note.value.trim(),status:'new',payRef:'',total,
     items:lines.map(({l,i})=>({pid:l.pid,title:i.p.title,color:i.c?.name||'',qty:l.qty,price:i.p.price,img:i.img}))});
    V.orders.push(code);V.cart=[];saveV();persist();cartBadge();toast('سفارش ثبت شد · کد پیگیری: '+code);go('pay')}},
   h('h3',{style:{margin:0}},'اطلاعات ارسال'),name,phone,addr,note,h('button',{class:'pbtn',type:'submit'},I('check',20),'ثبت سفارش'))]}
const myOrders=()=>S.orders.filter(o=>V.orders.includes(o.code));
const stName=k=>(STATUSES.find(s=>s[0]===k)||[0,k])[1];
function orderCard(o){const steps=STATUSES.slice(0,5),idx=steps.findIndex(s=>s[0]===o.status);
 return h('div',{class:'oc glass'},h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'8px'}},h('b',{style:{direction:'ltr'}},o.code),h('span',{class:'pill'},stName(o.status))),
  h('small',{style:{color:'var(--muted)'}},new Date(o.created).toLocaleDateString('fa-IR')+' · '+o.items.map(i=>`${i.title}${i.color?' ('+i.color+')':''} × ${fa(i.qty)}`).join('، ')),h('div',{class:'price'},money(o.total)),
  o.status==='canceled'?h('div',{style:{color:'var(--bad)'}},'این سفارش لغو شده است'):h('div',{class:'tl'},steps.map((s,k)=>h('div',{class:k<=idx?'d':''},s[1]))))}
function trackView(){const q=h('input',{class:'in',id:'t-q',placeholder:'کد پیگیری یا شماره موبایل',style:{flex:1}}),out=h('div',{style:{display:'flex',flexDirection:'column',gap:'12px'}});
 const show=list=>{out.innerHTML='';add(out,list.length?list.map(orderCard):[h('div',{class:'empty glass'},I('truck',44),h('div',{},'سفارشی پیدا نشد؛ کد یا شماره را بررسی کنید'))])};
 const mine=myOrders();
 const view=[h('h2',{class:'pg-h'},'پیگیری خرید'),h('form',{class:'search glass',onsubmit:e=>{e.preventDefault();const v=q.value.trim().toUpperCase(),n=normNum(q.value);if(!v)return;show(S.orders.filter(o=>o.code===v||(n.length>=10&&o.phone===n)))}},I('search',20),q,h('button',{class:'btn',type:'submit',style:{padding:'8px 16px'}},'جستجو')),out];
 if(mine.length){add(out,[h('div',{class:'sec-h'},h('h3',{},'سفارش‌های شما'))]);add(out,mine.map(orderCard))}else out.append(h('div',{class:'empty glass'},I('truck',44),h('div',{},'کد پیگیری سفارش را وارد کنید')));
 return view}
function payView(){const un=myOrders().filter(o=>o.status==='new'),P=S.pay;
 if(!un.length)return[h('h2',{class:'pg-h'},'پرداخت'),h('div',{class:'empty glass'},I('card',46),h('div',{},'سفارش در انتظار پرداختی ندارید'),h('button',{class:'btn',onclick:()=>go('home')},'ادامه خرید'))];
 let sel=un[0];const ref=h('input',{class:'in',id:'p-ref',placeholder:'شماره پیگیری / ۴ رقم آخر کارت پرداخت‌کننده'}),box=h('div',{style:{display:'flex',flexDirection:'column',gap:'14px'}});
 const draw=()=>{box.innerHTML='';add(box,[h('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap'}},un.map(o=>h('button',{class:'tb'+(o===sel?' on':''),onclick:()=>{sel=o;draw()}},o.code))),
  h('div',{class:'tot glass'},h('div',{class:'g'},h('span',{},'مبلغ سفارش '+sel.code),h('span',{},money(sel.total)))),
  h('div',{class:'frm glass'},h('b',{},'کارت‌به‌کارت · '+P.bank),h('div',{class:'card-n'},P.card),h('small',{style:{color:'var(--muted)',textAlign:'center'}},P.owner),
   h('button',{class:'pbtn ghost',onclick:()=>copyText(P.card.replace(/\D/g,''))},I('link',18),'کپی شماره کارت'),P.gateway?h('button',{class:'pbtn',onclick:()=>openUrl(P.gateway)},I('card',18),'پرداخت آنلاین'):null,
   h('small',{style:{color:'var(--muted)'}},P.note),ref,h('button',{class:'pbtn',onclick:()=>{if(ref.value.trim().length<3)return toast('شماره پیگیری را وارد کنید');sel.status='paid';sel.payRef=ref.value.trim();persist();toast('پرداخت ثبت شد؛ سفارش در حال بررسی است');go('track')}},I('check',20),'پرداخت را انجام دادم'))])};
 draw();return[h('h2',{class:'pg-h'},'پرداخت'),box]}
function catView(){const q=h('input',{id:'c-q',placeholder:'جستجوی کیف…',value:catQ,'aria-label':'جستجو'}),res=h('div',{});
 const draw=()=>{res.innerHTML='';const l=S.products.filter(p=>(!catFilter||p.cat===catFilter)&&(!catQ||p.title.includes(catQ)));const c=S.categories.find(x=>x.id===catFilter);
  add(res,[secHead(c?c.name:'همه محصولات',h('span',{style:{color:'var(--muted)',fontSize:'13px'}},fa(l.length)+' محصول')),l.length?h('div',{class:'grid'},l.map(pcard)):h('div',{class:'empty glass'},I('search',40),h('div',{},'محصولی پیدا نشد'))])};
 q.addEventListener('input',()=>{catQ=q.value.trim();draw()});draw();
 return[h('h2',{class:'pg-h'},'دسته‌بندی‌ها'),h('div',{class:'search glass'},I('search',20),q),
  h('div',{class:'cats'},S.categories.map(c=>h('button',{class:'cat'+(catFilter===c.id?' on':''),onclick:e=>{catFilter=catFilter===c.id?null:c.id;e.currentTarget.parentNode.querySelectorAll('.cat').forEach(x=>x.classList.remove('on'));if(catFilter)e.currentTarget.classList.add('on');draw()}},h('img',{src:c.img,alt:''}),h('b',{},c.name)))),res]}

/* ---------- menu / auth / contact ---------- */
function openMenu(){let close;const u=curUser();
 const go2=t=>{close();setTimeout(()=>runTarget(t),60)};
 const dr=h('div',{class:'dr',role:'dialog','aria-label':'منو'},
  h('div',{class:'dr-ban'},h('img',{src:S.menu.banner,alt:''}),h('button',{class:'dr-x','aria-label':'بستن منو',html:ic('chr',20),onclick:()=>close()}),h('div',{class:'t'},h('b',{},S.menu.title),h('span',{},S.menu.sub))),
  h('button',{class:'prof glass',onclick:()=>{close();openAuth()}},h('span',{class:'av'},u?(u.name.trim()[0]||'؟'):I('user',24)),h('span',{style:{flex:1}},h('b',{},u?u.name:'ورود / ثبت‌نام'),h('small',{},u?u.phone:'برای پیگیری و ثبت سفارش')),h('span',{class:'ch',html:ic('chl',18)})),
  h('div',{class:'lbl'},'ناوبری'),h('div',{class:'mg glass'},S.menu.items.map(m=>h('button',{class:'mi',onclick:()=>go2(m.target)},h('span',{class:'mc',style:{background:m.color},html:ic(m.icon,22)}),h('b',{},m.label),h('span',{class:'ch',html:ic('chl',16)})))),
  h('div',{class:'lbl'},'تنظیمات'),h('div',{class:'mg glass'},h('button',{class:'mi',onclick:toggleMode},h('span',{class:'mc',style:{background:'#4b5563'},html:ic('moon',22)}),h('b',{},'حالت شب'),h('span',{class:'tg'+(isDark()?' on':'')}))),
  h('div',{class:'soc',style:{marginTop:'auto'}},S.socials.map(s=>h('a',{href:s.url,target:'_blank',rel:'noopener','aria-label':s.name,html:ic(s.icon,22),style:{width:'46px',height:'46px'}}))),
  h('button',{class:'tb',style:{alignSelf:'center'},onclick:()=>{close();openAdminLogin()}},I('lock',16),'ورود مدیر'));
 close=openModal(dr,'s')}
function openAuth(){let close;const u=curUser();
 if(u){close=openModal(h('div',{class:'sh'},h('div',{class:'grab'}),h('div',{class:'prof'},h('span',{class:'av'},u.name.trim()[0]||'؟'),h('span',{},h('b',{},u.name),h('small',{},u.phone))),
  h('div',{style:{display:'grid',gap:'10px',marginTop:'14px'}},h('button',{class:'pbtn ghost',onclick:()=>{close();go('track')}},I('truck',20),'سفارش‌های من'),h('button',{class:'pbtn ghost',onclick:()=>{V.user=null;saveV();close();renderHeader();toast('از حساب خارج شدید')}},I('logout',20),'خروج از حساب'))),'b');return}
 let mode='in';const name=h('input',{class:'in',id:'a-name',placeholder:'نام و نام خانوادگی'}),phone=h('input',{class:'in',id:'a-phone',type:'tel',inputmode:'tel',placeholder:'شماره موبایل'}),tabs=h('div',{class:'row'}),form=h('form',{style:{display:'grid',gap:'12px'}});
 const draw=()=>{tabs.innerHTML='';add(tabs,[['in','ورود'],['up','ثبت‌نام']].map(([k,t])=>h('button',{class:'tb'+(mode===k?' on':''),type:'button',style:{flex:1,justifyContent:'center'},onclick:()=>{mode=k;draw()}},t)));form.innerHTML='';add(form,[mode==='up'?name:null,phone,h('button',{class:'pbtn',type:'submit'},mode==='in'?'ورود':'ساخت حساب')])};
 form.onsubmit=e=>{e.preventDefault();const ph=normNum(phone.value);if(!/^09\d{9}$/.test(ph))return toast('شماره موبایل معتبر نیست');let x=S.users.find(y=>y.phone===ph);
  if(mode==='in'){if(!x)return toast('حسابی با این شماره نیست؛ ثبت‌نام کنید')}else{if(!name.value.trim())return toast('نام را وارد کنید');if(!x){x={id:uid(),name:name.value.trim(),phone:ph,created:Date.now()};S.users.push(x);persist()}}
  V.user=x.id;saveV();close();renderHeader();toast('خوش آمدید '+x.name)};
 draw();close=openModal(h('div',{class:'sh'},h('div',{class:'grab'}),h('h3',{},'ورود یا ثبت‌نام'),tabs,h('div',{style:{height:'12px'}}),form),'c')}
function openContact(){const c=openModal(h('div',{class:'sh'},h('div',{class:'grab'}),h('h3',{},'تماس با ما'),
 h('div',{style:{display:'grid',gap:'10px'}},h('div',{class:'tgl'},h('span',{},'تلفن'),h('b',{style:{direction:'ltr'}},S.store.phone)),h('div',{class:'tgl'},h('span',{},'آدرس'),h('b',{style:{textAlign:'left'}},S.store.address)),h('div',{class:'soc'},S.socials.map(s=>h('a',{href:s.url,target:'_blank',rel:'noopener','aria-label':s.name,html:ic(s.icon,22)}))))),'c')}

/* ---------- stories viewer ---------- */
function openStory(start){const list=S.stories;if(!list.length)return;let i=start,prog=0,last=0,paused=false,raf=0,vid=null,hold=0,hx=0,sheetOpen=false;
 const bars=h('div',{class:'sv-bars'},list.map(()=>h('i',{},h('b')))),media=h('div',{class:'sv-m'}),hdImg=h('img',{alt:''}),hdT=h('b'),hdS=h('small'),cap=h('div',{class:'sv-cap'}),
  likeB=h('button',{class:'sv-a'}),cmB=h('button',{class:'sv-a'}),shB=h('button',{class:'sv-a','aria-label':'اشتراک‌گذاری',html:ic('share',20)}),prB=h('button',{class:'sv-a pr'},'مشاهده محصول',I('chl',16));
 const stop=()=>{cancelAnimationFrame(raf);root.remove();unlock();refreshStories();removeEventListener('keydown',key)};
 const key=e=>{if(e.key==='Escape')stop()};addEventListener('keydown',key);
 const closeB=h('button',{'aria-label':'بستن',html:ic('close',20),onclick:stop});
 const zones=h('div',{class:'sv-z'},h('i'),h('i'),h('i'));
 const setPause=v=>{paused=v;if(vid)v?vid.pause():vid.play().catch(()=>{})};
 zones.addEventListener('pointerdown',e=>{hold=Date.now();hx=e.clientX;setPause(true)});
 zones.addEventListener('pointerup',e=>{setPause(sheetOpen);if(Date.now()-hold<250){const r=zones.getBoundingClientRect(),p=(e.clientX-r.left)/r.width;p<.33?next():p>.67?prev():0}});
 zones.addEventListener('pointercancel',()=>setPause(sheetOpen));
 function paint(){const s=list[i];likeB.className='sv-a'+(V.liked[s.id]?' on':'');likeB.innerHTML=ic('heart',20)+`<span>${fa(s.likes)}</span>`;likeB.setAttribute('aria-label','پسندیدن');cmB.innerHTML=ic('comment',20)+`<span>${fa(s.comments.length)}</span>`;cmB.setAttribute('aria-label','نظرات')}
 function load(n){i=n;prog=0;last=performance.now();const s=list[i];V.seen[s.id]=1;saveV();vid=null;media.innerHTML='';
  [...bars.children].forEach((b,k)=>b.firstChild.style.width=k<i?'100%':'0');
  if(s.type==='video'){vid=h('video',{src:s.src,playsinline:true,autoplay:true});media.append(vid);vid.play().catch(()=>{vid.muted=true;vid.play().catch(()=>{})});vid.addEventListener('ended',next)}else media.append(h('img',{src:s.src,alt:s.title}));
  hdImg.src=s.thumb||(s.type==='image'?s.src:'');hdImg.style.display=hdImg.src?'':'none';hdT.textContent=s.title;hdS.textContent=S.store.name;cap.textContent=s.caption||'';
  const pr=prod(s.productId);prB.style.display=pr?'':'none';prB.onclick=()=>{stop();openProduct(pr.id)};paint()}
 const next=()=>i<list.length-1?load(i+1):stop(),prev=()=>load(Math.max(0,i-1));
 function frame(ts){if(!paused){if(vid)prog=vid.duration?vid.currentTime/vid.duration:0;else{prog+=(ts-last)/5500;}last=ts;bars.children[i].firstChild.style.width=Math.min(100,prog*100)+'%';if(prog>=1&&!vid)next()}else last=ts;raf=requestAnimationFrame(frame)}
 likeB.onclick=()=>{const s=list[i];if(V.liked[s.id]){delete V.liked[s.id];s.likes=Math.max(0,s.likes-1)}else{V.liked[s.id]=1;s.likes++}saveV();persist();paint()};
 const sheetIn=node=>{sheetOpen=true;setPause(true);const w=h('div',{class:'sv-sheet'},node);root.firstChild.append(w);const c=()=>{w.remove();sheetOpen=false;setPause(false)};return c};
 cmB.onclick=()=>{const s=list[i];let c;const lst=h('div',{class:'cm'}),inp=h('input',{class:'in',id:'cm-in',placeholder:'نظر خود را بنویسید…'});
  const draw=()=>{lst.innerHTML='';add(lst,s.comments.length?s.comments.map(m=>h('div',{class:'cmi'},h('span',{class:'av'},m.name[0]||'؟'),h('div',{},h('b',{},m.name+' '),h('small',{},ago(m.time)),h('p',{},m.text)))):h('div',{class:'empty',style:{padding:'16px'}},'اولین نظر را شما بنویسید'))};
  draw();c=sheetIn(h('div',{class:'sh'},h('div',{class:'grab'}),h('button',{class:'xb',style:{background:'var(--field)',color:'var(--fg)'},'aria-label':'بستن',html:ic('close',18),onclick:()=>c()}),h('h3',{},'نظرات'),lst,
   h('form',{class:'row',onsubmit:e=>{e.preventDefault();const t=inp.value.trim();if(!t)return;s.comments.push({id:uid(),name:curUser()?.name||'مهمان',text:t,time:Date.now()});inp.value='';persist();draw();paint()}},inp,h('button',{class:'btn',type:'submit'},'ارسال'))))};
 shB.onclick=()=>{const s=list[i],url=location.href.split('#')[0]+'#story-'+s.id,txt=encodeURIComponent(S.store.name+' · '+s.title+'\n'+(s.caption||'')),u=encodeURIComponent(url);let c;
  c=sheetIn(h('div',{class:'sh'},h('div',{class:'grab'}),h('button',{class:'xb',style:{background:'var(--field)',color:'var(--fg)'},'aria-label':'بستن',html:ic('close',18),onclick:()=>c()}),h('h3',{},'اشتراک‌گذاری استوری'),
   h('div',{class:'sharel'},h('a',{href:`https://t.me/share/url?url=${u}&text=${txt}`,target:'_blank',rel:'noopener'},I('telegram',26),'تلگرام'),h('a',{href:`https://wa.me/?text=${txt}%20${u}`,target:'_blank',rel:'noopener'},I('whatsapp',26),'واتساپ'),h('button',{onclick:()=>copyText(url)},I('link',26),'کپی لینک'))))};
 const root=h('div',{class:'sv',role:'dialog','aria-label':'استوری'},h('div',{class:'sv-in'},media,h('div',{class:'sv-sh'}),bars,h('div',{class:'sv-hd'},hdImg,h('div',{},hdT,hdS),h('span',{class:'sp'}),closeB),zones,h('div',{class:'sv-ft'},cap,h('div',{class:'sv-act'},likeB,cmB,shB,prB))));
 document.body.append(root);document.body.classList.add('lock');load(i);last=performance.now();raf=requestAnimationFrame(frame)}

function updateHd(){const hd=$('#hd');if(!hd)return;const hr=$('.hero');hd.classList.toggle('over',cur==='home'&&!!hr&&scrollY<70)}
addEventListener('scroll',updateHd,{passive:true});
function openSearch(){let close;const inp=h('input',{id:'s-q',placeholder:'جستجوی کیف، رنگ یا دسته…','aria-label':'جستجو',autocomplete:'off'}),res=h('div',{class:'grid'});
 const draw=()=>{const q=inp.value.trim();res.innerHTML='';const l=S.products.filter(p=>!q||(p.title+' '+p.desc+' '+(S.categories.find(c=>c.id===p.cat)?.name||'')+' '+p.colors.map(c=>c.name).join(' ')).includes(q));
  add(res,l.length?l.map(p=>{const c=pcard(p);c.onclick=()=>{close();openProduct(p.id)};return c}):h('div',{class:'empty',style:{gridColumn:'1/-1'}},I('search',40),'محصولی پیدا نشد'))};
 inp.addEventListener('input',draw);draw();
 close=openModal(h('div',{class:'sh',style:{minHeight:'70vh'}},h('div',{class:'grab'}),h('div',{class:'search glass'},I('search',20),inp),h('div',{style:{height:'14px'}}),res),'b');setTimeout(()=>inp.focus(),150)}
/* ---------- boot ---------- */
let rT=0;function refreshStore(){clearTimeout(rT);rT=setTimeout(()=>{applyTheme();renderHeader();buildNav();renderMain();setNav(false)},120)}
async function boot(){await loadState();applyTheme();renderHeader();buildNav();renderMain();requestAnimationFrame(()=>setNav(false));document.fonts&&document.fonts.ready.then(()=>setNav(false));
 if(location.hash==='#admin')openAdminLogin()}
