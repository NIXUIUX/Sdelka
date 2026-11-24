/* Если что-то упало — показываем текст ошибки вместо белого экрана */
window.addEventListener('error',e=>{const r=document.getElementById('root');if(r&&!r.children.length)r.innerHTML='<div style="padding:24px;font:14px Geist,sans-serif;color:#c34455">Ошибка запуска прототипа: '+String(e.message).replace(/</g,'&lt;')+'</div>'});
if(!window.React||!window.ReactDOM||!window.htm){setTimeout(()=>{const r=document.getElementById('root');if(r)r.innerHTML='<div style="padding:24px;font:14px sans-serif;color:#c34455">Не загрузились библиотеки React/htm — проверьте интернет или откройте офлайн-файл</div>'},0)}
const {useState,useEffect,useRef,useMemo,useContext,createContext}=React;
const html=htm.bind(React.createElement);

/* ---------- icons (Lucide) ---------- */
const I=(d,s=16)=>html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d.split('|').map(p=>html`<path d=${p}/>`)}</svg>`;
const ic={
  chev:s=>I('m6 9 6 6 6-6',s), chevL:s=>I('m15 18-6-6 6-6',s), chevR:s=>I('m9 18 6-6-6-6',s), check:s=>I('M20 6 9 17l-5-5',s), x:s=>I('M18 6 6 18|M6 6l12 12',s),
  sliders:s=>I('M10 5H3|M12 19H3|M14 3v4|M16 17v4|M21 12h-9|M21 19h-5|M21 5h-7|M8 10v4|M8 12H3',s),
  reset:s=>I('M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8|M3 3v5h5',s),
  refresh:s=>I('M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8|M21 3v5h-5|M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16|M8 16H3v5',s),
  search:s=>I('m21 21-4.34-4.34|M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16',s),
  menu:s=>I('M4 12h16|M4 6h16|M4 18h16',s), help:s=>I('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3|M12 17h.01',s),
  info:s=>I('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M12 16v-4|M12 8h.01',s),
  alert:s=>I('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M12 8v4|M12 16h.01',s),
  warn:s=>I('m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3|M12 9v4|M12 17h.01',s),
  upload:s=>I('M12 13v8|M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242|m8 17 4-4 4 4',s),
  done2:s=>I('M18 6 7 17l-5-5|m22 10-7.5 7.5L13 16',s),
  phone:s=>I('M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z|M12 18h.01',s),
  send:s=>I('M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z|M21.854 2.147l-10.94 10.939',s),
  pen:s=>I('M12 20h9|M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z',s),
  download:s=>I('M12 15V3|M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|m7 10 5 5 5-5',s),
  shield:s=>I('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z|m9 12 2 2 4-4',s),
  folder:s=>I('M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',s),
  lock:s=>I('M6 11h12v10H6z|M8 11V7a4 4 0 0 1 8 0v4',s),
  clock:s=>I('M12 6v6l4 2|M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',s),
  msg:s=>I('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',s),
  file:s=>I('M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z|M14 2v4a2 2 0 0 0 2 2h4|M16 13H8|M16 17H8',s),
  mail:s=>I('M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|m22 6-10 7L2 6',s),
  archive:s=>I('M3 4h18v4H3z|M5 8v11c0 1 1 2 2 2h10c1 0 2-1 2-2V8|M10 12h4',s),
  unarchive:s=>I('M3 4h18v4H3z|M5 8v11c0 1 1 2 2 2h10c1 0 2-1 2-2V8|M12 18v-7|M9 14l3-3 3 3',s),
  gauge:s=>I('m12 14 4-4|M3.34 19a10 10 0 1 1 17.32 0',s),
  minus:s=>I('M5 12h14',s),
  plus:s=>I('M5 12h14|M12 5v14',s), arrowR:s=>I('M5 12h14|m12 5 7 7-7 7',s), trash:s=>I('M3 6h18|M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6|M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',s),
  badgeCheck:s=>I('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|m9 12 2 2 4-4',s),
};

/* ---------- data ---------- */
const GOALS=['Квартира в новостройке','Квартира на вторичном рынке','Дом с участком','Земельный участок','ИЖС / строительство дома','Кладовая','Машиноместо / парковка'];
const PROGRAMS=[{n:'Стандартная ипотека',r:18.6},{n:'Семейная ипотека',r:6},{n:'IT-ипотека',r:6},{n:'Военная ипотека',r:5.5},{n:'Семейная военная ипотека',r:5.5},{n:'Дальневосточная ипотека',r:2},{n:'Господдержка 2% · новые территории',r:2}];
const REGIONS=['г. Москва','Московская область','г. Санкт-Петербург','Ленинградская область','Краснодарский край','Республика Татарстан','Свердловская область'];
const CERTS=['Материнский капитал','Региональный капитал','Военный сертификат','Жилищный сертификат'];
const OBJECTS=['ЖК «Северный парк», корпус 2','ЖК «Речной квартал», корпус 1','ЖК «Сиреневый сад», корпус 4','ЖК «Город на реке», корпус 7'];
const BANKS=[['Абсолют Банк','АБ',0],['Уралсиб','УР',.09],['Совкомбанк','СО',.2],['МКБ','МК',.35],['Банк России','РО',.4],['ДОМ.РФ','ДР',-.1],['Альфа-Банк','АЛ',.5],['ВТБ','ВТ',.3],['Газпромбанк','ГП',.15],['Райффайзен','РФ',.7],['Т-Банк','ТБ',.6],['Сбербанк','СБ',.25],['Банк Санкт-Петербург','БС',.45],['Росбанк','РБ',.55],['Промсвязьбанк','ПС',.38],['Россельхозбанк','РХ',.12],['ОТП Банк','ОТ',.8],['Почта Банк','ПБ',.9],['Ак Барс','АК',.33],['Металлинвестбанк','МИ',.65],['Банк Зенит','БЗ',.72],['Новикомбанк','НК',.5],['Транскапиталбанк','ТК',.85],['Инвестторгбанк','ИТ',.95]];
/* Плюсы банка в карточке предложения (демо): скидки к ставке и удобства сделки. Ставку не меняют — это подсказка брокеру */
const PERKS={'Абсолют Банк':['−1 п.п. для зарплатного проекта банка'],'Уралсиб':['−0,5 п.п. при страховании жизни в банке','Решение за 1 день'],
  'Совкомбанк':['Без подтверждения дохода до 6 млн ₽'],'МКБ':['−0,3 п.п. при подаче онлайн'],'ДОМ.РФ':['Субсидия застройщика без доплат'],
  'Альфа-Банк':['−0,6 п.п. для зарплатных клиентов','Одобрение за 2 часа'],'ВТБ':['−0,5 п.п. для зарплатного проекта','Без справки о доходах для клиентов банка'],
  'Газпромбанк':['Решение за 1 рабочий день'],'Райффайзен':['Досрочное погашение без комиссии'],'Т-Банк':['Сделка онлайн без визита в офис'],
  'Сбербанк':['−0,3 п.п. при электронной регистрации'],'Банк Санкт-Петербург':['Справка о доходах по форме банка'],'Росбанк':['Кредитные каникулы до 6 месяцев'],
  'Промсвязьбанк':['−0,5 п.п. для военных и госслужащих'],'Россельхозбанк':['−0,4 п.п. для зарплатного проекта']};
/* Скидка к ставке для зарплатных клиентов банка, п.п. — применяется, если банк выбран в «Зарплатный банк» */
const SALARY_CUT={'Абсолют Банк':1,'Альфа-Банк':.6,'ВТБ':.5,'Россельхозбанк':.4};
const SEXES=['Мужской','Женский'];
const EMPLOYMENTS=['По найму','ИП','Самозанятый','Собственник бизнеса','Пенсионер'];
const PROOFS=['Госуслуги / СФР','2-НДФЛ','Справка по форме банка','Без подтверждения дохода'];
const FULL_STEPS=[['podbor','Подбор условий'],['personal','Персональные данные'],['family','Семейное положение'],['income','Доход и работа'],['signing','Подписание и отправка']];
/* Короткий флоу: если в заявке выбран только Сбербанк — анкета из одного шага и отправка без подписания */
const SBER_STEPS=[['podbor','Подбор условий'],['personal','Персональные данные'],['signing','Отправка в банк']];
const isSberOnly=sel=>sel.size===1&&sel.has('Сбербанк');
let STEPS=FULL_STEPS;
const nextOf=k=>{const i=STEPS.findIndex(s=>s[0]===k);return STEPS[i+1]?STEPS[i+1][0]:'status'};
const SCREENS=[['','0.0 Ипотечные заявки'],['podbor','1.0 Подбор условий'],['personal','1.1 Персональные данные'],['family','1.2 Семейное положение'],['income','1.3 Доход и работа'],['signing','1.4 Подписание и отправка'],['status','1.5 Статус в банках'],['client','Клиент · загрузка документов']];

const rub=n=>Math.round(n).toLocaleString('ru-RU')+' ₽';
const pct=n=>(Math.round(n*100)/100).toString().replace('.',',')+'%';
const annuity=(S,r,y)=>{const m=r/1200,n=y*12;return m?S*m/(1-Math.pow(1+m,-n)):S/n};
const years=n=>n+' '+(n%10===1&&n%100!==11?'год':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'года':'лет');
const plural=(n,a,b,c)=>n%10===1&&n%100!==11?a:(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?b:c;
const digits=v=>String(v).replace(/\D/g,'');
/* Маски полей: формат и длина — по подсказке поля. Лишние символы и буквы не вводятся */
const fmt=(d,parts,seps)=>{let o='',i=0;parts.forEach((n,k)=>{const p=d.slice(i,i+n);if(!p)return;o+=(k&&i<d.length?seps[k-1]:'')+p;i+=n});return o};
const MASKS={
  phone:v=>{let d=digits(v);if(!d)return'';if(d[0]==='8')d='7'+d.slice(1);if(d[0]!=='7')d='7'+d;d=d.slice(0,11);const b=d.slice(1);
    let o='+7';if(b.length)o+=' ('+b.slice(0,3);if(b.length>3)o+=') '+b.slice(3,6);if(b.length>6)o+='-'+b.slice(6,8);if(b.length>8)o+='-'+b.slice(8,10);return o},
  date:v=>fmt(digits(v).slice(0,8),[2,2,4],['.','.']),
  snils:v=>fmt(digits(v).slice(0,11),[3,3,3,2],['-','-',' ']),
  pass:v=>fmt(digits(v).slice(0,10),[4,6],[' ']),
  passSer:v=>fmt(digits(v).slice(0,4),[2,2],[' ']), passNo:v=>digits(v).slice(0,6),
  code:v=>fmt(digits(v).slice(0,6),[3,3],['-']),
  inn10:v=>digits(v).slice(0,10), inn12:v=>digits(v).slice(0,12),
  year:v=>digits(v).slice(0,4),
  months:v=>digits(v).slice(0,2).replace(/^0(\d)/,'$1'),
  years:v=>digits(v).slice(0,2).replace(/^0(\d)/,'$1'),
  money:v=>digits(v).slice(0,10),
  name:v=>v.replace(/[^A-Za-zА-Яа-яЁё\s-]/g,'').replace(/\s{2,}/g,' ').slice(0,100),
  email:v=>v.replace(/\s/g,'').slice(0,80),
  text:v=>v.slice(0,200),
};
const MASK_LEN={phone:18,date:10,snils:14,pass:11,code:7,inn10:10,inn12:12,years:2,year:4,months:2,email:80,name:100,text:200};
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/* ---------- store ---------- */
const Ctx=createContext(null);
const useApp=()=>useContext(Ctx);
const DEFAULT_FILTERS={goal:GOALS[0],program:PROGRAMS[0].n,kids:2,kidsDisabled:false,region:REGIONS[0],price:10000000,down:4000000,term:25,certOn:false,certType:CERTS[0],certAmount:690267,subsidyOn:false,domrf:null,
  /* клиент и платёжеспособность */ birth:'',sex:'Мужской',emp:'По найму',proof:'Госуслуги / СФР',salaryBank:'Не выбран',income:0,oblig:0};
const PASSPORT_DATA={fio:'Иванов Иван Иванович',birthPlace:'г. Тверь',birthDate:'17.04.1986',citizenship:'Российская Федерация',passNum:'6915 482731',passDate:'23.07.2015',passCode:'690-014',passWho:'УМВД России по Тверской области',regAddr:'г. Тверь, ул. Озёрная, д. 18, кв. 42'};
const DEFAULT_ANKETA={recognized:false,fio:'',birthPlace:'',birthDate:'',citizenship:'Российская Федерация',passNum:'',passDate:'',passCode:'',passWho:'',regAddr:'',phone:'',changedName:'Не менялось',gender:'Мужской',inn:'',snils:'',email:'',factDiff:false,factAddr:'',prevPassport:false,
  marital:'Женат / замужем',spouseExcluded:'Нет',kids:'Нет',spouseCo:false,
  empType:'По найму',contract:'Бессрочный трудовой договор',proof:'Госуслуги / СФР',income:'',salaryBank:'Не выбран',extraIncome:'Нет',org:'',orgInn:'',position:'',workPhone:'',startDate:'',jobs:[],
  edus:[{level:'Выберите',year:'',place:'',spec:''}],eduLevel:'Выберите из списка',expYears:'',jobs3:'',exp5:'Выберите из списка'};
const go=h=>{location.hash=h?('#'+h):'';window.scrollTo(0,0)};
function useRoute(){const [r,setR]=useState((location.hash||'').slice(1));useEffect(()=>{const f=()=>setR((location.hash||'').slice(1));addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return SCREENS.some(s=>s[0]===r)?r:''}

/* ---------- atoms ---------- */
function useOutside(ref,cb,active){
  useEffect(()=>{if(!active)return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))cb()};
    const k=e=>{if(e.key==='Escape')cb()};
    document.addEventListener('mousedown',h);document.addEventListener('keydown',k);
    return()=>{document.removeEventListener('mousedown',h);document.removeEventListener('keydown',k)}},[active]);
}
function FieldError({text}){return typeof text==='string'&&text?html`<p class="err-text" role="alert">${ic.alert(14)}<span>${text}</span></p>`:null}
/* Плейсхолдер по маске, если поле его не задало — чтобы при фокусе был виден формат */
const MASK_PH={phone:'+7 (000) 000-00-00',date:'дд.мм.гггг',snils:'000-000-000 00',pass:'0000 000000',passSer:'00 00',passNo:'000000',code:'000-000',inn10:'0000000000',inn12:'000000000000',year:'гггг',email:'name@example.com'};
const MASK_IM={phone:'tel',date:'numeric',snils:'numeric',pass:'numeric',code:'numeric',inn10:'numeric',inn12:'numeric',year:'numeric',years:'numeric',months:'numeric',money:'numeric',email:'email'};
function Field({id,label,value,onChange,placeholder,helper,error,disabled,suffix,inputMode,mask,sm}){
  const m=mask&&MASKS[mask];
  return html`<div><label class=${'field'+(sm?' sm':'')+(error?' err':'')+(disabled?' dis':'')} for=${id}><span class="lab">${label}</span>
    <input id=${id} value=${value} placeholder=${placeholder||(mask&&MASK_PH[mask])||''} disabled=${disabled} inputmode=${inputMode||(mask&&MASK_IM[mask])||'text'} maxlength=${mask?MASK_LEN[mask]:null} onInput=${e=>{const x=m?m(e.target.value):e.target.value;if(m)e.target.value=x;onChange&&onChange(x)}}/>
    ${suffix&&html`<span class="suffix">${suffix}</span>`}</label>
    ${error&&typeof error==='string'?html`<${FieldError} text=${error}/>`:helper&&html`<p class="helper">${helper}</p>`}</div>`;
}
function MoneyField({id,label,value,onChange,suffix='₽',error}){
  return html`<${Field} id=${id} label=${label} value=${Math.round(value).toLocaleString('ru-RU')} suffix=${suffix} error=${error} inputMode="numeric" onChange=${v=>onChange(+digits(v)||0)}/>`;
}
/* Поле со слайдером по нижней границе: ввод цифрами или перетаскиванием. Значение применяется через полсекунды после остановки, на blur и Enter */
/* Быстрый выбор первого взноса и срока */
const DOWN_PICKS=[20,30,40,50];
const TERM_PICKS=[10,15,20,30];
const pctStr=p=>(Math.round(p*10)/10).toLocaleString('ru-RU')+'%';
function RangeField({id,label,value,onCommit,min,max,step=1,unit='money',suffix='₽',aside,map,error,below}){
  const [d,setD]=useState(value); useEffect(()=>setD(value),[value]);
  useEffect(()=>{if(d===value)return;const t=setTimeout(()=>onCommit(d),450);return()=>clearTimeout(t)},[d]);
  const rv=map?map.to(d):d, p=Math.max(0,Math.min(100,(rv-min)/(max-min)*100));
  const shown=unit==='money'?Math.round(d).toLocaleString('ru-RU'):String(d);
  return html`<div><label class=${'field sm rf'+(error?' err':'')} for=${id}><span class="lab">${label}</span>
    <input id=${id} value=${shown} inputmode="numeric" onInput=${e=>setD(+digits(e.target.value)||0)} onBlur=${()=>{if(d!==value)onCommit(d)}} onKeyDown=${e=>{if(e.key==='Enter')e.target.blur()}}/>
    <span class="suffix">${typeof suffix==='function'?suffix(d):suffix}${aside!=null&&html`<b class="rf-aside">${typeof aside==='function'?aside(d):aside}</b>`}</span>
    <input class="rf-range" type="range" tabindex="-1" aria-label=${label} min=${min} max=${max} step=${step} value=${Math.max(min,Math.min(max,rv))} style=${{'--p':p+'%'}} onInput=${e=>setD(map?map.from(+e.target.value):+e.target.value)}/></label>
    ${below&&below(d,v=>{setD(v);onCommit(v)})}<${FieldError} text=${error}/></div>`;
}
function Menu({items,value,onPick}){
  return html`<div class="menu" role="listbox">${items.map(it=>html`<button role="option" aria-selected=${it===value} class=${'mi'+(it===value?' sel':'')} onClick=${()=>onPick(it)}><span>${it}</span>${it===value&&ic.check(16)}</button>`)}</div>`;
}
function SelectField({label,value,items,onPick,error,helper,sm}){
  const [open,setOpen]=useState(false); const ref=useRef();
  useOutside(ref,()=>setOpen(false),open);
  return html`<div class="anchor" ref=${ref}>
    <button class=${'field select'+(sm?' sm':'')+(error?' err':'')} onClick=${()=>setOpen(!open)} aria-expanded=${open}><span class="lab">${label}</span><span class=${'val'+(String(value).startsWith('Выберите')?' ph':'')}>${value}</span>${ic.chev(18)}</button>
    ${error?html`<${FieldError} text=${error}/>`:helper&&html`<p class="helper">${helper}</p>`}
    ${open&&html`<div class="pop" style=${{width:'100%',minWidth:'0'}}><${Menu} items=${items} value=${value} onPick=${v=>{onPick(v);setOpen(false)}}/></div>`}
  </div>`;
}
function Switch({checked,onChange,label,disabled,helper}){
  const sw=html`<button class=${'switch'+(checked?' on':'')+(disabled?' dis':'')} role="switch" aria-checked=${checked} disabled=${disabled} onClick=${()=>!disabled&&onChange(!checked)}><span class="t"></span><span>${label}</span></button>`;
  return helper?html`<div class="sw-wrap">${sw}<p class="helper">${helper}</p></div>`:sw;
}
/* Время отправки в банк: «сегодня, 10:50» или «08.11, 10:50» */
const nowAt=()=>new Date().toISOString();
const fmtAt=at=>{if(!at)return 'сегодня, 10:50';const d=new Date(at),t=d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
  return (d.toDateString()===new Date().toDateString()?'сегодня':d.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'}))+', '+t};
/* Справочник организаций (демо): по названию подставляем ИНН и наоборот */
const ORG_DB=[['ООО «СделкаРФ»','7714852963'],['ООО «Северсталь-Инфо»','7701234567']];
const orgKey=s=>String(s).toLowerCase().replace(/ооо|ао|пао|[«»"'\s.-]/g,'');
const orgByName=s=>{const k=orgKey(s);return k.length>=4?ORG_DB.find(([n])=>orgKey(n).startsWith(k)||k.startsWith(orgKey(n))):null};
const orgByInn=s=>ORG_DB.find(([,i])=>i===digits(s));
function Checkbox({checked,onChange,label,showLabel}){
  const box=html`<span class=${'cb'+(checked?' on':'')}>${checked&&ic.check(14)}</span>`;
  return showLabel?html`<button class="cb-row" role="checkbox" aria-checked=${checked} onClick=${()=>onChange(!checked)}>${box}<span>${label}</span></button>`
    :html`<button class=${'cb'+(checked?' on':'')} role="checkbox" aria-checked=${checked} aria-label=${label} onClick=${()=>onChange(!checked)}>${checked&&ic.check(14)}</button>`;
}
function Badge({tone='neutral',children}){return html`<span class=${'badge '+tone}><span class="dot"></span>${children}</span>`}
function Alert({type='info',title,children}){return html`<div class=${'alert'+(type==='warning'?' warning':'')} role=${type==='warning'?'alert':'note'}>${type==='warning'?ic.warn(20):ic.info(20)}<div><b>${title}</b>${children&&html`<span>${children}</span>`}</div></div>`}
function Chip({label,value,active=true,open,onClick}){
  return html`<button class=${'chip'+(active?' active':'')+(open?' open':'')} onClick=${onClick} aria-expanded=${!!open}><span class="l">${label}</span><span class="v">${value}</span>${ic.chev(14)}</button>`;
}
function Anchor({id,open,setOpen,trigger,children,right}){
  const ref=useRef(); useOutside(ref,()=>setOpen(null),open===id);
  return html`<div class=${'anchor'+(right?' pop-right':'')} ref=${ref}>${trigger(open===id,()=>setOpen(open===id?null:id))}${open===id&&children}</div>`;
}
function UploadZone({id,title,limits='PDF, JPEG, PNG до 10 МБ',onFiles,error,multiple}){
  const ref=useRef();
  return html`<div><button class=${'upz'+(error?' err':'')} onClick=${()=>ref.current.click()}
      onDragOver=${e=>e.preventDefault()} onDrop=${e=>{e.preventDefault();onFiles([...e.dataTransfer.files])}}>
    <span class="icon-tile">${ic.upload(20)}</span><span class="tx"><b>${title}</b><small>${limits}</small></span><span class="act">Выбрать файл</span></button>
    <input ref=${ref} id=${id} class="sr" type="file" multiple=${multiple} accept=".pdf,.jpg,.jpeg,.png" onChange=${e=>{onFiles([...e.target.files]);e.target.value=''}}/>
    <${FieldError} text=${error}/></div>`;
}
const fileObj=f=>({name:f.name,size:(f.size/1048576).toFixed(1).replace('.',',')+' МБ'});
function FileItem({f,onRemove,owner}){
  const ext=(f.name.split('.').pop()||'').toUpperCase().slice(0,4);
  return html`<div class="file"><span class="fmt">${ext}</span><span class="tx"><b title=${f.name}>${f.name}</b><small>${owner||f.size+' · загружен'}</small></span>
    <span class="ok">${ic.badgeCheck(18)}</span>${onRemove&&html`<button onClick=${onRemove} aria-label=${'Удалить '+f.name}>${ic.x(16)}</button>`}</div>`;
}

/* ---------- layout ---------- */
function AppHeader(){
  const [open,setOpen]=useState(false); const ref=useRef(); const route=useRoute(); const {devJump}=useApp();
  useOutside(ref,()=>setOpen(false),open);
  return html`<header class="header"><div class="wrap">
    <button class="icon-btn" aria-label="Меню" onClick=${()=>go('')}>${ic.menu(22)}</button>
    <a class="logo" href="#" onClick=${e=>{e.preventDefault();go('')}} style=${{textDecoration:'none'}}>сделка.рф</a><span class="vdiv"></span><span class="section-name">Ипотека</span>
    <div class="org"><span class="org-name"><b>ООО «Сделка.РФ» ▾</b>Дмитрий Сорокин</span>
      <div class="anchor pop-right" ref=${ref}><button class="icon-btn" aria-label="Экраны прототипа" aria-expanded=${open} onClick=${()=>setOpen(!open)}>${ic.help(20)}</button>
        ${open&&html`<div class="pop screens" style=${{minWidth:'280px'}}><small>Экраны прототипа</small>${SCREENS.map(([h,n])=>html`<a href=${'#'+h} class=${route===h?'on':''} onClick=${e=>{e.preventDefault();setOpen(false);devJump(h)}}>${n}</a>`)}<small>Для просмотра: предыдущие шаги заполнятся демо-данными</small></div>`}</div>
      <span class="avatar">ДС</span></div>
  </div></header>`;
}
function LineTabs({active=0}){
  const {say}=useApp();
  return html`<nav class="linetabs" aria-label="Разделы">${['Ипотечные заявки','Моя статистика'].map((t,i)=>html`<button class=${i===active?'on':''} onClick=${()=>i===0?go(''):say('Моя статистика — следующий этап прототипа')}>${t}</button>`)}</nav>`;
}
/* Футер: без скролла стоит в 24px от низа; пока под ним есть контент — прибит к краю, без нижних скруглений, с тенью */
function useStuck(){
  const [s,setS]=React.useState(false);
  React.useEffect(()=>{const upd=()=>{const el=document.scrollingElement||document.documentElement;setS(el.scrollHeight-el.clientHeight-el.scrollTop>12)};
    upd();addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);const ro=new ResizeObserver(upd);ro.observe(document.body);
    return()=>{removeEventListener('scroll',upd);removeEventListener('resize',upd);ro.disconnect()}},[]);
  return s;
}
function BottomBar({left,secondary,primary,onSecondary,onPrimary,alert,narrow}){
  const stuck=useStuck();
  return html`<div class=${'bottom'+(stuck?' stuck':'')}><div class="wrap" style=${narrow?{maxWidth:'824px'}:null}>${alert}
    <div class="bar"><div class="left">${left}</div>
      <div class="btns">${secondary&&html`<button class="btn outline" onClick=${onSecondary}>${secondary}</button>`}<button class="btn primary" onClick=${onPrimary}>${primary}</button></div></div></div></div>`;
}
function Toast(){const {toast}=useApp();return toast?html`<div class="toast" role="status">${toast}</div>`:null}

/* Параметры кредита: свёрнуто — банки и сумма; развёрнуто — условия каждого банка и срок, который можно поменять */
/* Срок в конкретном банке — меняется прямо в карточке банка на экране статусов */
function BankTerm({name,approved}){
  const {calc,f,termBy,setTermBy,say}=useApp(); const t=calc.termOf(name); const changed=termBy[name]&&termBy[name]!==f.term;
  const set=v=>{v=Math.max(1,Math.min(30,v));setTermBy(o=>({...o,[name]:v}));say(`Срок в ${name} — ${years(v)}. Отправим банку уточнение`)};
  return html`<div class="term-edit">
    <div class="tx"><b>Срок кредита в этом банке</b><small>${changed?'Изменён · в подборе было '+years(f.term):approved?'После одобрения банк пересчитает платёж':'Можно поменять до решения банка'}</small></div>
    <div class="row" style=${{gap:'12px',flexWrap:'nowrap'}}>
      ${changed&&html`<button class="link s" style=${{margin:0}} onClick=${()=>{setTermBy(x=>{const n={...x};delete n[name];return n});say('Срок в '+name+' — как в подборе')}}>Вернуть</button>`}
      <div class="mini-stp"><button aria-label="Уменьшить срок" disabled=${t<=1} onClick=${()=>set(t-1)}>${ic.minus(16)}</button><b class="num">${t}</b>
        <button aria-label="Увеличить срок" disabled=${t>=30} onClick=${()=>set(t+1)}>${ic.plus(16)}</button></div><span class="desc" style=${{fontSize:'13px'}}>${plural(t,'год','года','лет')}</span></div>
  </div>`;
}
function CreditParams({banks,backLabel='Изменить параметры подбора'}){
  const {selected,calc,f,termBy,setTermBy,say}=useApp();
  const names=banks||[...selected]; const list=(names.length?names:['Абсолют Банк','Уралсиб']).map(n=>calc.offers.find(o=>o.name===n)).filter(Boolean);
  const [open,setOpen]=useState(false);
  const shown=list.slice(0,3), extra=Math.max(0,list.length-3);
  return html`<section class="side-card cp">
    <button class="cp-h" onClick=${()=>setOpen(!open)} aria-expanded=${open}><h4>Параметры кредита</h4><span class=${'cp-chev'+(open?' up':'')}>${ic.chev(20)}</span></button>
    <div class="row" style=${{justifyContent:'space-between'}}>
      <div class="avatars">${shown.map(b=>html`<span class="avatar" title=${b.name}>${b.ini}</span>`)}${extra>0&&html`<span class="avatar">+${extra}</span>`}</div>
      <div style=${{textAlign:'right'}}><span class="desc" style=${{fontSize:'12px'}}>${f.program}</span><div style=${{fontSize:'20px',fontWeight:700}} class="num">${rub(calc.loan)}</div></div></div>
    ${open&&html`<dl class="cp-rows cp-params num">
        <dt>Цель</dt><dd>${f.goal}</dd>
        <dt>Программа</dt><dd>${f.program}</dd>
        ${f.program.includes('Семейная')&&html`<dt>Дети</dt><dd>${f.kids>=5?'5+':f.kids}</dd>`}
        <dt>Регион</dt><dd>${f.region}</dd>
        <dt>Стоимость</dt><dd>${rub(f.price)}</dd>
        <dt>Первый взнос</dt><dd>${rub(f.down)} · ${Math.round(f.down/f.price*100)}%</dd>
        ${f.certOn&&html`<dt>Сертификат</dt><dd>${rub(f.certAmount)}</dd>`}
        <dt>Срок</dt><dd>${years(f.term)}</dd></dl>
      <a class="link cp-back" href="#podbor" onClick=${e=>{e.preventDefault();go('podbor')}}>${backLabel} ${ic.chevR(16)}</a>`}
  </section>`;
}
/* Боковая карточка на шаге подбора: что выбрано и на какую сумму */
function PickedBanks({onRemove}){
  const {selected,calc,f,sent}=useApp(); const list=calc.offers.filter(o=>selected.has(o.name));
  return html`<section class="side-card"><div class="row" style=${{justifyContent:'space-between'}}><h4>Выбранные банки</h4><span class=${'badge num'+(list.length?' accent':'')}>${list.length}</span></div>
    <div class="row" style=${{justifyContent:'space-between'}}><span class="desc" style=${{fontSize:'13px'}}>${f.program}</span><b class="num" style=${{fontSize:'20px'}}>${rub(calc.loan)}</b></div>
    ${isSberOnly(selected)&&html`<div class="sber-note">${ic.info(14)}<span>Короткая анкета: 3 шага и отправка без подписания</span></div>`}
    ${list.length?html`<div class="picked">${list.map(o=>html`<div class="pk" key=${o.name}><span class="avatar">${o.ini}</span><div class="tx"><b>${o.name}</b><small class="num">${(x=>x?(x.status==='approved'?'Одобрено':'Отправлено')+' '+fmtAt(x.at):pct(o.rate)+' · '+rub(o.pay)+' в месяц')(sent.find(q=>q.name===o.name))}</small></div>
        ${sent.some(q=>q.name===o.name)?html`<span class="pk-lock" title="Анкета уже отправлена в банк — убрать нельзя" aria-label="Анкета отправлена, убрать нельзя">${ic.lock(16)}</span>`:html`<button class="part-x" aria-label=${'Убрать '+o.name} onClick=${()=>onRemove(o.name)}>${ic.x(16)}</button>`}</div>`)}</div>`
      :html`<p class="desc" style=${{fontSize:'13px',margin:0}}>Отметьте банки в списке — они появятся здесь</p>`}
  </section>`;
}
/* Прескоринг в боковой колонке: до проверки — короткое объяснение и кнопка, после — рейтинг и вход в отчёт */
function PrescoreCard(){
  const {prescore:r,setPsOpen}=useApp();
  if(!r)return html`<section class="side-card ps-side"><div class="ps-side-h"><span class="icon-tile">${ic.gauge(20)}</span>
      <div><h4>Прескоринг клиента</h4><p class="desc">Получить рейтинг и портрет заемщика за несколько секунд</p></div></div>
    <button class="btn outline s" onClick=${()=>setPsOpen(true)}>Проверить клиента</button></section>`;
  const p=r.people[0], lv=scoreLvl(p.score);
  return html`<section class="side-card ps-side"><div class="row" style=${{justifyContent:'space-between'}}><h4>Прескоринг</h4><span class=${'lvl '+lv[1]}>${lv[0]}</span></div>
    <div class="ps-side-score"><b class="num">${p.score}</b><span>из 999</span></div>
    <div class="ps-scale"><i style=${{left:(p.score/999*100)+'%'}}></i></div>
    <p class="desc ps-side-who">${p.name} · ${r.date}</p>
    <button class="btn outline s" onClick=${()=>setPsOpen(true)}>Открыть отчёт</button></section>`;
}
function StepsNav({current}){
  const {done}=useApp();
  return html`<section class="side-card"><h4>Шаги анкеты</h4><div class="steps">${STEPS.map(([k,n],i)=>{const cur=k===current, d=done[k]&&!cur;
    return d?html`<button class="step done" onClick=${()=>go(k)}><span class="n">${ic.check(14)}</span><span class="t">${n}</span>${ic.chevR(18)}</button>`
      :html`<div class=${'step'+(cur?' cur':' locked')} aria-current=${cur?'step':null} aria-disabled=${!cur}><span class="n">${i+1}</span><span class="t">${n}</span></div>`})}</div></section>`;
}
function HelpCard(){
  const {say}=useApp();
  return html`<section class="side-card blue"><span class="icon-tile">${ic.folder(20)}</span><h4>Помощь по ипотеке</h4>
    <p class="desc" style=${{fontSize:'13px'}}>Задайте вопрос и получите больше информации на консультации с нашим специалистом</p>
    <div><button class="btn outline s" onClick=${()=>say('Чат со специалистом откроется здесь')}>Открыть чат</button></div></section>
    <p class="faq">Ответы на частые вопросы собрали <a class="link" href="#" onClick=${e=>{e.preventDefault();say('Раздел FAQ — вне прототипа')}}>здесь</a></p>`;
}
function StepFooter(){
  return html`<span class="autosave">${ic.done2(16)}Изменения сохраняются автоматически</span>`;
}
const initials=n=>(n||'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
/* Участники заявки: заёмщик заполняется первым, созаёмщики — после него */
function Participants(){
  const {a,co,setCo,say,prescore,setPsOpen}=useApp();
  const ps=pid=>pplOf(prescore).find(p=>p.pid===pid);
  const list=[{id:'main',name:a.fio,role:'Заёмщик',state:'Заполняется'}, ...(a.spouseCo?[{id:'spouse',name:'',role:'Созаёмщик · супруг(а)',state:'После заёмщика'}]:[]),
    ...co.map(c=>({...c,role:'Созаёмщик',state:'После заёмщика',removable:true}))];
  const add=()=>{if(list.length>=4){say('В заявке может быть до 4 участников');return}setCo(o=>[...o,{id:'c'+Date.now(),name:''}]);say('Созаёмщик добавлен — его анкету заполним после заёмщика')};
  return html`<section class="card parts"><div class="parts-head"><h2>Участники заявки</h2>
      <button class="btn outline s" onClick=${add}>${ic.plus(16)} Добавить созаёмщика</button></div>
    <div class="parts-list">${list.map((p,i)=>html`<div class=${'part'+(i===0?' cur':'')} aria-current=${i===0?'true':null}>
      <span class="avatar">${p.name?initials(p.name):i+1}</span>
      <div class="tx"><b>${p.name||'Новый участник'}</b><div class="meta"><small>${p.role}</small>${i===0?html`<${Badge} tone="accent">${p.state}<//>`:html`<${Badge}>${p.state}<//>`}</div>
        ${p.id!=='spouse'&&(()=>{const r=ps(p.id);if(!r)return html`<button class="ps-link" onClick=${()=>setPsOpen(true)}>${ic.gauge(14)} Пройти прескоринг</button>`;
          const lv=scoreLvl(r.score),warn=r.checks.length;
          return html`<button class="ps-mini" onClick=${()=>setPsOpen(true)} title="Открыть результат прескоринга">${ic.gauge(14)}<span>Прескоринг</span><b class="num">${r.score}</b><span class=${'lvl xs '+lv[1]}>${lv[0]}</span>${warn?html`<span class="ps-warn">${ic.info(12)} ${warn} ${plural(warn,'замечание','замечания','замечаний')}</span>`:''}</button>`})()}</div>
      ${p.removable&&html`<button class="part-x" aria-label="Убрать созаёмщика" onClick=${()=>setCo(o=>o.filter(c=>c.id!==p.id))}>${ic.x(16)}</button>`}
    </div>`)}</div></section>`;
}
/* Шапка флоу новой заявки: возврат к списку + горизонтальные шаги */
function FlowHead({current,steps,inParts}){
  const {done,dealId,prescore}=useApp(); const idx=STEPS.findIndex(s=>s[0]===current);
  const {psOpen:pm,setPsOpen:setPm}=useApp();
  return html`<div class="flow-head">
    <a class="link back" href="#" onClick=${e=>{e.preventDefault();go('')}}>${ic.chevL(16)} Ипотечные заявки</a>
    <div class="flow-row"><div class="flow-title"><h1>Заявка № ${dealId}</h1></div>
</div>
    ${pm&&html`<${PrescoreModal} onClose=${()=>setPm(false)}/>`}
    ${steps&&html`<ol class="hsteps">${STEPS.map(([k,n],i)=>{const d=done[k]&&i!==idx;return html`<li class=${i===idx?'cur':d?'done':''}>
      ${d?html`<button onClick=${()=>go(k)}><span class="n">${ic.check(12)}</span>${n}</button>`:html`<span><span class="n">${i+1}</span>${n}</span>`}</li>`})}</ol>`}
  </div>`;
}
function AnketaPage({step,children,onNext,extraSide,alert,primary='Продолжить'}){
  const idx=STEPS.findIndex(s=>s[0]===step);
  const back=idx===0?['Вернуться к выбору банков','']:['Назад',STEPS[idx-1][0]];
  return html`<${AppHeader}/><main class="wrap"><${FlowHead} current=${step} inParts=${step!=='signing'}/><div class="layout">
    <div class="main-col">${step!=='signing'&&html`<${Participants}/>`}<section class="card pad32 stack-24 anketa">${children}</section></div>
    <aside class="side"><${PrescoreCard}/><${CreditParams}/>${extraSide}<${StepsNav} current=${step}/><${HelpCard}/></aside></div></main>
    <${BottomBar} alert=${alert} secondary=${back[0]} onSecondary=${()=>go(back[1])} primary=${primary} onPrimary=${onNext}/>`;
}
/* run validation; returns true if ok */
/* Якорь к первому полю с ошибкой: скроллим к самому верхнему и ставим в него фокус */
const toFirstErr=()=>setTimeout(()=>{const root=document.querySelector('.overlay .modal')||document.querySelector('main')||document;
  const el=root.querySelector('.field.err,.upz.err,.err-text');if(!el)return;
  const box=el.classList.contains('err-text')?(el.previousElementSibling||el):el;
  box.scrollIntoView({block:'center',behavior:'smooth'});
  const inp=box.matches('input,button')?box:box.querySelector('input,textarea,button');inp&&inp.focus({preventScroll:true})},40);
function useValidation(){
  const [errs,setErrs]=useState({}); const [tried,setTried]=useState(false);
  const run=(rules)=>{const e={};for(const [k,msg] of Object.entries(rules)) if(msg) e[k]=msg; setErrs(e); setTried(true); if(Object.keys(e).length)toFirstErr(); return !Object.keys(e).length};
  return {errs,tried,run,setErrs,clear:k=>setErrs(o=>{const n={...o};delete n[k];return n})};
}
/* Названия полей для плашки ошибок — чтобы было понятно, что именно не заполнено */
const FIELD_NAMES={passport:'Паспорт',fio:'ФИО',birthDate:'Дата рождения',birthPlace:'Место рождения',passNum:'Серия и номер',passDate:'Когда выдан',passCode:'Код подразделения',passWho:'Кем выдан',regAddr:'Адрес регистрации',
  phone:'Номер телефона',snils:'СНИЛС',email:'Электронная почта',inn:'ИНН физлица',factAddr:'Фактический адрес',
  income:'Основной доход',org:'Организация',orgInn:'ИНН организации',position:'Должность',workPhone:'Рабочий телефон',startDate:'Дата начала работы',
  eduLevel:'Образование',expYears:'Общий трудовой стаж',jobs3:'Мест работы за 3 года',exp5:'Стаж за последние 5 лет',prevSer:'Серия предыдущего паспорта',prevNo:'Номер предыдущего паспорта',prevDate:'Когда выдан предыдущий паспорт',monthsHere:'Месяцев на текущем месте',level:'Уровень образования',year:'Год окончания',place:'Учебное заведение'};
const JOB_NAMES={jorg:'организация',jinn:'ИНН организации',jpos:'должность',jstart:'дата начала работы',jincome:'доход'};
const fieldName=k=>{if(FIELD_NAMES[k])return FIELD_NAMES[k];const m=/^(j[a-z]+)(\d+)$/.exec(k);if(m&&JOB_NAMES[m[1]])return 'Доп. место работы'+(+m[2]?' '+(+m[2]+1):'')+': '+JOB_NAMES[m[1]];
  const e=/^([a-z]+)(\d+)$/.exec(k);return e&&FIELD_NAMES[e[1]]?FIELD_NAMES[e[1]]:null};
const listRu=a=>a.length<2?a[0]:a.slice(0,-1).join(', ')+' и '+a[a.length-1];
const firstErrAlert=(errs,title)=>{const keys=Object.keys(errs);if(!keys.length)return null;
  const raw=keys.map(fieldName),names=[...new Set(raw.filter(Boolean))].map(n=>'«'+n+'»');const shown=names.slice(0,3),rest=names.length-shown.length+raw.filter(x=>!x).length;
  const txt=!shown.length?`Проверьте поля, отмеченные красным: ${keys.length} ${plural(keys.length,'поле требует','поля требуют','полей требуют')} внимания`
    :names.length===1&&rest===0?`Заполните поле ${shown[0]}`
    :`Проверьте ${rest>0?'поля '+shown.join(', ')+' и ещё '+rest:'поля '+listRu(shown)}`;
  return html`<${Alert} type="warning" title=${title}>${txt}. Остальное уже сохранено<//>`};

/* ---------- 1.0 Подбор условий ---------- */
function Podbor(){
  const app=useApp(); const {f:s,setF,selected,setSelected,calc,say,sent}=app;
  const set=p=>setF(o=>({...o,...p}));
  const [open,setOpen]=useState(null);
  const [modal,setModal]=useState(null); const [bankInfo,setBankInfo]=useState(null);
  const [ftab,setFtab]=useState('all'); const [q,setQ]=useState(''); const [sort,setSort]=useState('По комиссии платформы'); const [page,setPage]=useState(1);
  const [errs,setErrs]=useState({}); const [needBanks,setNeedBanks]=useState(false);
  const [clOpen,setClOpen]=useState(false);
  const clFilled=[s.birth,s.salaryBank!=='Не выбран',s.income>0,s.oblig>0].filter(Boolean).length;
  const freeIncome=s.income>0?s.income-s.oblig:0;
  useEffect(()=>setPage(1),[ftab,q,sort]);
  const isFamily=/Семейная/.test(s.program);
  const minDownPct=/Семейная|IT|Военная/.test(s.program)?20:10;
  const downPct=s.price?Math.round(s.down/s.price*100):0;
  const checkPrice=()=>s.price<500000?'Минимальная стоимость — 500 000 ₽. Проверьте сумму: банки не выдают ипотеку на меньшие объекты':'';
  const checkDown=()=>downPct<minDownPct?`Для программы «${s.program}» взнос от ${minDownPct}% — это ${rub(s.price*minDownPct/100)}. Увеличьте взнос или добавьте сертификат`:'';
  useEffect(()=>{if(selected.size)setNeedBanks(false)},[selected]);
  const goNext=fn=>{if(!selected.size){setNeedBanks(true);return}fn()};
  const fitArgs={term:s.term,loan:calc.loan,downPct:s.price?(s.down+(s.certOn?s.certAmount:0))/s.price*100:0};
  const offers=calc.offers.map(o=>({...o,why:bankFit(bankLimits(BANKS.findIndex(b=>b[0]===o.name),s.program),fitArgs)}));
  const unfit=offers.filter(o=>o.why.length);
  let list=offers.filter(o=>!o.why.length).filter(o=>o.name.toLowerCase().includes(q.trim().toLowerCase()));
  if(ftab==='params') list=list.filter(o=>o.delta<0.6);
  if(ftab==='sel') list=list.filter(o=>selected.has(o.name));
  const sorters={'По комиссии платформы':(a,b)=>b.commission-a.commission,'По ставке':(a,b)=>a.rate-b.rate,'По платежу':(a,b)=>a.pay-b.pay,'По названию':(a,b)=>a.name.localeCompare(b.name)};
  list=[...list].sort(sorters[sort]);
  /* банки, куда уже отправили заявку, держим наверху списка */
  list=[...list.filter(o=>sent.some(x=>x.name===o.name)),...list.filter(o=>!sent.some(x=>x.name===o.name))];
  const per=6, shown=list.slice(0,page*per), rest=list.length-shown.length;
  const [unfitOpen,setUnfitOpen]=useState(false); const unfitShown=unfitOpen?unfit:unfit.slice(0,3);
  /* банк перестал подходить после смены параметров — снимаем выбор */
  useEffect(()=>{const bad=[...selected].filter(n=>unfit.some(u=>u.name===n)&&!sentOf(n));if(bad.length){setSelected(o=>{const x=new Set(o);bad.forEach(n=>x.delete(n));return x});say(bad.join(', ')+': не подходит под новые параметры — убрали из выбранных')}},[unfit.map(u=>u.name).join()]);
  const sentOf=n=>sent.find(x=>x.name===n);
  const toggleSel=n=>{if(sentOf(n)){say('В '+n+' заявка уже отправлена — убрать банк нельзя');return}setSelected(o=>{const x=new Set(o);x.has(n)?x.delete(n):x.add(n);return x})};
  const P=(id,trig,body,right)=>html`<${Anchor} id=${id} open=${open} setOpen=${setOpen} right=${right} trigger=${trig}>${body}<//>`;
  const n=selected.size;

  return html`<${AppHeader}/>
  <main class="wrap">
    <${FlowHead} current="podbor"/><div class="layout"><div class="main-col">
    <section class="card pad32 stack-20 pf-card">
      <div class="pf-head"><div class="stack" style=${{gap:'6px'}}><h1 class="sec">Подбор условий</h1><p class="desc" style=${{margin:0}}>Задайте параметры сделки — предложения банков ниже пересчитываются сразу</p></div>
        <button class="ghost-link" onClick=${()=>{setF(DEFAULT_FILTERS);say('Параметры сброшены')}}>${ic.reset(16)}Сбросить</button></div>
      <div class="pf">
        <${SelectField} sm label="Цель" value=${s.goal} items=${GOALS} onPick=${v=>set({goal:v})}/>
        <${SelectField} sm label="Программа" value=${s.program} items=${PROGRAMS.map(p=>p.n)} onPick=${v=>set({program:v})}/>
        <div class="pf-half"><${SelectField} sm label="Регион" value=${s.region} items=${REGIONS} onPick=${v=>set({region:v})}/></div>
        <${RangeField} id="f-price" label="Стоимость недвижимости" value=${s.price} min=${1000000} max=${50000000} step=${100000} error=${checkPrice()}
          onCommit=${v=>set({price:v,down:Math.min(s.down,v)})}/>
        <${RangeField} id="f-down" label="Первоначальный взнос" value=${s.down} min=${0} max=${90} error=${checkDown()}
          map=${{to:v=>s.price?v/s.price*100:0,from:p=>Math.round(s.price*p/100)}} aside=${v=>pctStr(s.price?v/s.price*100:0)}
          below=${(v,pick)=>html`<div class="qchips" role="group" aria-label="Быстрый выбор взноса">${DOWN_PICKS.map(q=>{const on=s.price&&Math.abs(v/s.price*100-q)<0.05;
            return html`<button class=${'qchip'+(on?' on':'')} aria-pressed=${!!on} onClick=${()=>pick(Math.round(s.price*q/100))}>${pctStr(q)}</button>`})}</div>`}
          onCommit=${v=>set({down:Math.min(v,s.price)})}/>
        <div class="pf-half"><${RangeField} id="f-term" label="Срок кредита" value=${s.term} unit="years" min=${1} max=${30} suffix=${v=>years(v).replace(/^\d+ /,'')}
          below=${(v,pick)=>html`<div class="qchips" role="group" aria-label="Быстрый выбор срока">${TERM_PICKS.map(q=>html`<button class=${'qchip'+(v===q?' on':'')} aria-pressed=${v===q} aria-label=${years(q)} onClick=${()=>pick(q)}>${q}</button>`)}</div>`}
          onCommit=${v=>set({term:Math.max(1,Math.min(30,v||1))})}/></div>
      </div>
      ${isFamily&&html`<div class="pf-kids"><span class="pf-lab">Детей</span>
        <div class="seg pf-seg" role="radiogroup" aria-label="Количество детей">${[1,2,3,4,5].map(k=>html`<button role="radio" aria-checked=${s.kids===k} class=${s.kids===k?'on':''} onClick=${()=>set({kids:k})}>${k===5?'5+':k}</button>`)}</div>
        <${Checkbox} showLabel checked=${s.kidsDisabled} onChange=${v=>set({kidsDisabled:v})} label="Ребёнок с инвалидностью до 18 лет"/>
        <p class="hint pf-hint">Хотя бы один ребёнок младше 7 лет на дату кредитного договора, с инвалидностью — до 18 лет</p></div>`}
      <div class="pf-opts">
        <${Switch} checked=${s.certOn} onChange=${v=>set({certOn:v})} label="Сертификат или маткапитал"/>
        <${Switch} checked=${s.subsidyOn} onChange=${v=>set({subsidyOn:v})} label="Субсидия застройщика"/>
      </div>
      ${s.certOn&&html`<div class="pf two">
        <${SelectField} sm label="Тип сертификата" value=${s.certType} items=${CERTS} onPick=${v=>set({certType:v})}/>
        <${RangeField} id="f-cert" label="Сумма сертификата · к собственным средствам" value=${s.certAmount} min=${0} max=${3000000} step=${10000} onCommit=${v=>set({certAmount:v})}/>
      </div>`}
      ${s.subsidyOn&&html`<div class="pf-sub">${s.domrf?html`<span class="subsidy-note">${ic.check(14)}Применено: ${s.domrf.label}</span>`:html`<span class="hint" style=${{margin:0}}>Выберите объект или размер снижения ставки по программе ДОМ.РФ</span>`}
        <button class="btn outline sm" onClick=${()=>setModal('domrf')}>${s.domrf?'Изменить условия':'Настроить условия ДОМ.РФ'}</button></div>`}
      <div class=${'pf-more'+(clOpen?' open':'')}>
        <button class="pf-more-h" aria-expanded=${clOpen} onClick=${()=>setClOpen(!clOpen)}>
          <span class="pf-more-t"><b>Клиент и платёжеспособность</b><span>${clOpen?'Точнее покажем ставку и доход, который ждёт банк':clFilled?'Заполнено '+clFilled+' из 4 · '+[s.emp,s.salaryBank!=='Не выбран'&&'зарплата в '+s.salaryBank,s.income>0&&'доход '+rub(s.income)].filter(Boolean).join(' · '):'Возраст, занятость, доход и зарплатный банк — необязательно'}</span></span>
          <span class="cp-chev">${ic.chev(18)}</span></button>
        ${clOpen&&html`<div class="pf pf-more-b">
          <div class="pf-half"><${Field} sm id="f-birth" label="Дата рождения" mask="date" value=${s.birth} onChange=${v=>set({birth:v})}/></div>
          <div class="pf-half"><${SelectField} sm label="Пол" value=${s.sex} items=${SEXES} onPick=${v=>set({sex:v})}/></div>
          <${SelectField} sm label="Тип занятости" value=${s.emp} items=${EMPLOYMENTS} onPick=${v=>set({emp:v})}/>
          <${SelectField} sm label="Подтверждение дохода" value=${s.proof} items=${PROOFS} onPick=${v=>set({proof:v})}/>
          <${SelectField} sm label="Зарплатный банк" value=${s.salaryBank} items=${['Не выбран',...BANKS.map(b=>b[0])]} onPick=${v=>set({salaryBank:v})}
            helper=${SALARY_CUT[s.salaryBank]?'−'+String(SALARY_CUT[s.salaryBank]).replace('.',',')+' п.п. учтено в ставке':null}/>
          <${RangeField} id="f-income" label="Доход в месяц" value=${s.income} min=${0} max=${1000000} step=${5000} onCommit=${v=>set({income:v})}/>
          <div><${RangeField} id="f-oblig" label=${html`Сумма обязательных платежей <span class="tip" tabindex="0" aria-label="Что входит">${ic.info(14)}<span class="tip-b" role="tooltip">Сумма расходов на аренду жилья, ежемесячные платежи по кредитам, алименты при наличии</span></span>`}
            value=${s.oblig} min=${0} max=${300000} step=${1000} onCommit=${v=>set({oblig:v})}/></div>
        </div>`}
      </div>
    </section>
    <section class="card pad32 stack-24">
      <div class="row"><h1 class="sec">Предложения банков</h1><span class="badge num">${list.length}</span></div>
      <div class="offers-head" style=${{marginTop:0}}>
        <div class="ftabs">
          <button class=${ftab==='all'?'on':''} onClick=${()=>setFtab('all')}>Все</button>
          <button class=${ftab==='params'?'on':''} onClick=${()=>setFtab('params')}>По параметрам</button>
          <button class=${ftab==='sel'?'on':''} onClick=${()=>setFtab('sel')}>Выбрано: ${n}</button>
        </div>
        ${P('sort',(o,t)=>html`<${Chip} label="Сортировка:" value=${sort} active=${false} open=${o} onClick=${t}/>`,html`<div class="pop"><${Menu} items=${Object.keys(sorters)} value=${sort} onPick=${v=>{setSort(v);setOpen(null)}}/></div>`,true)}
      </div>
      <label class="search" for="q">${ic.search(18)}<input id="q" placeholder="Найти банк" value=${q} onInput=${e=>setQ(e.target.value)}/></label>
      <div>${shown.length?shown.map(o=>html`<article class=${'bank'+(sentOf(o.name)?' sent':selected.has(o.name)?' sel':'')} key=${o.name}>
          <div class="bank-id"><span class="avatar">${o.ini}</span><div><div class="row" style=${{gap:'8px'}}><b>${o.name}</b>${sentOf(o.name)&&html`<span class="sent-tag">${ic.send(12)} ${sentOf(o.name).status==='approved'?'Одобрено':'Отправлено'} · ${fmtAt(sentOf(o.name).at)}</span>`}</div><small>${s.program}</small></div></div>
          <div class="bank-act">${sentOf(o.name)?html`<span class="cb on locked" role="img" aria-label=${'Заявка в '+o.name+' уже отправлена'} title="Заявка уже отправлена — снять выбор нельзя">${ic.check(14)}</span>`:html`<${Checkbox} checked=${selected.has(o.name)} onChange=${()=>toggleSel(o.name)} label=${'Выбрать '+o.name}/>`}
            <button class="btn outline s" onClick=${()=>setBankInfo(o.name)}>Подробнее</button></div>
          <div class="metrics num">
            <div class="metric"><span>Ставка</span><b class=${calc.cut?'acc':''}>${pct(o.rate)}</b></div>
            <div class="metric"><span>Платёж в месяц</span><b>${rub(o.pay)}</b></div>
            <div class="metric"><span>Рекомендуемый доход</span><b>${rub(o.income)}</b></div>
          </div>${PERKS[o.name]&&html`<ul class="perks" aria-label="Плюсы банка">${PERKS[o.name].map(t=>html`<li class=${o.salaryCut&&/зарплат/.test(t)?'on':''}>${ic.badgeCheck(14)}<span>${t}${o.salaryCut&&/зарплат/.test(t)?' · учтено в ставке':''}</span></li>`)}</ul>`}
          ${freeIncome>0&&freeIncome<o.income&&html`<p class="why-warn">${ic.info(14)}<span>Дохода может не хватить: после обязательных платежей ${rub(freeIncome)}, банк ждёт от ${rub(o.income)}</span></p>`}</article>`)
        :html`<div class="empty">${ftab==='sel'?'Вы ещё не выбрали банки — отметьте их галочкой в списке':'Банк не найден. Проверьте название'}</div>`}</div>
      ${rest>0&&html`<button class="more-btn" onClick=${()=>setPage(page+1)}>Ещё ${Math.min(per,rest)} ${plural(Math.min(per,rest),'предложение','предложения','предложений')}${rest>per?' из '+rest:''}${ic.chev(16)}</button>`}
      ${ftab!=='sel'&&unfit.length>0&&html`<div class="unfit"><div class="row" style=${{gap:'8px'}}><h3 class="bm-h">Не подошли под параметры</h3><span class="badge num">${unfit.length}</span></div>
        <p class="desc" style=${{margin:'-4px 0 0',fontSize:'13px'}}>Измените параметры сделки, чтобы эти банки появились в подборе</p>
        <div>${unfitShown.map(o=>html`<article class="bank dis" key=${o.name} aria-disabled="true">
          <div class="bank-id"><span class="avatar">${o.ini}</span><div><b>${o.name}</b><small>${s.program}</small></div></div>
          <div class="bank-act" aria-hidden="true"><span class="btn outline s">Подробнее</span></div>
          <div class="metrics num">
            <div class="metric"><span>Ставка</span><b>${pct(o.rate)}</b></div>
            <div class="metric"><span>Платёж в месяц</span><b>${rub(o.pay)}</b></div>
            <div class="metric"><span>Рекомендуемый доход</span><b>${rub(o.income)}</b></div></div>
          <p class="why">${ic.info(14)}<span>Укажите ${o.why.join(', ')}</span></p></article>`)}</div>
        ${unfit.length>3&&html`<button class="more-btn" onClick=${()=>setUnfitOpen(!unfitOpen)}>${unfitOpen?'Свернуть':'Ещё '+(unfit.length-3)+' '+plural(unfit.length-3,'банк','банка','банков')}<span class=${'cp-chev'+(unfitOpen?' up':'')}>${ic.chev(16)}</span></button>`}
      </div>`}
    </section></div>
    <aside class="side"><${PrescoreCard}/><${PickedBanks} onRemove=${toggleSel}/><${StepsNav} current="podbor"/><${HelpCard}/></aside></div>
  </main>
  <${BottomBar}
    alert=${needBanks&&html`<${Alert} type="warning" title="Сначала выберите банки">Отметьте галочкой хотя бы один банк в списке — так мы поймём, кому отправить предложение и анкету клиента<//>`}
    secondary="Отправить предложение на почту" onSecondary=${()=>goNext(()=>setModal('offer'))}
    primary="Продолжить" onPrimary=${()=>goNext(()=>{app.markDone('podbor');go('personal')})}/>
  ${modal==='domrf'&&html`<${DomrfModal} initial=${s.domrf} onClose=${()=>setModal(null)} onApply=${d=>{set({domrf:d,subsidyOn:true});setModal(null);say('Условия ДОМ.РФ применены')}}/>`}
  ${modal==='offer'&&html`<${OfferModal} onClose=${()=>setModal(null)}/>`}
  ${bankInfo&&html`<${BankModal} name=${bankInfo} onClose=${()=>setBankInfo(null)} onToggle=${toggleSel}/>`}`;
}

/* ---------- Прескоринг: телефон + паспорт → кредитный рейтинг ---------- */
/* Диапазоны рейтинга — по внутренней методике */
const scoreLvl=s=>s>=979?['Очень высокий','top']:s>=861?['Высокий','ok']:s>=633?['Средний','mid']:['Низкий','low'];
const CO_DEMO=[['Иванова Мария Сергеевна',744,'fine'],['Петров Олег Андреевич',655,'ok'],['Смирнова Анна Викторовна',880,'ok']];
/* Отчёт БКИ по участнику: разделы и строки [название, значение, ok|mid] */
const psReport=kind=>{const fine=kind==='fine';return [
  ['Общие сведения',[['Банкротство','Нет','ok'],['Дееспособность','Да','ok'],['Судебные споры и обязательства','Нет','ok']]],
  ['Кредитная нагрузка',[['Действующие кредиты','Есть','ok'],['Количество кредитов',fine?'1–2':'3–4','ok'],['Сумма кредитов',fine?'до 50 000 ₽':'50 000–100 000 ₽','ok'],['Среднемесячный платёж','1–10 000 ₽ / мес','ok'],['Кредиты в качестве поручителя','Нет','ok']]],
  ['Риски и просрочки',[['Просрочки','Нет','ok'],['Активные просрочки','Нет','ok'],['Сумма просрочки','0 ₽','ok'],['Безнадёжная задолженность / взыскание','Нет','ok']]],
  ['Структура кредитов',[['Кредитная карта','Открытая без просрочки','ok'],['Другой кредит',fine?'Нет':'Открытый без просрочки','ok']]],
  ['Кредитная активность',[['Запросы за 7 дней','0','ok'],['Запросы за 14 дней','1','ok'],['Запросы за 30 дней',fine?'4':'2',fine?'mid':'ok'],['Всего запросов',fine?'9':'12','ok']]],
  ['Исполнительные производства',[['Результат проверки',fine?'1 штраф ГИБДД до 10 000 ₽ — допустимо':'Не найдено',fine?'mid':'ok']]]]};
const psFlags=rep=>rep.flatMap(([,rows])=>rows).filter(r=>r[2]!=='ok');
/* Короткая сводка — 6 ключевых сигналов вместо всего отчёта */
const psKey=rep=>{const all=Object.fromEntries(rep.flatMap(([,rows])=>rows).map(r=>[r[0],r]));
  return [['Банкротство',all['Банкротство']],['Дееспособность',all['Дееспособность']],['Суды',all['Судебные споры и обязательства']],['Просрочки',all['Активные просрочки']],['Исп. производства',all['Результат проверки']],['Запросы за 30 дней',all['Запросы за 30 дней']]]
    .map(([t,r])=>[t,t==='Исп. производства'?(r[2]==='ok'?'Нет':'Штраф ГИБДД'):r[1],r[2]])};
const pplOf=ps=>ps?ps.people:[];
/* Форма прескоринга по API подрядчика: скан паспорта (PDF/JPG до 10 МБ) распознаётся в те же пять полей, их можно ввести и вручную */
const PS_EMPTY={last:'',first:'',middle:'',series:'',number:'',docs:[],recog:'idle',auto:{}};
const PS_FIELDS=[['last','Фамилия','фамилию'],['first','Имя','имя'],['middle','Отчество','отчество']];
const psFromPassport=()=>{const [last,first,middle]=PASSPORT_DATA.fio.split(' ');const [ser,num]=PASSPORT_DATA.passNum.split(' ');return {last,first,middle,series:MASKS.passSer(ser),number:num}};
function psCheck(v){const e={};
  for(const [k,,acc] of PS_FIELDS){const t=v[k].trim();if(!t)e[k]='Укажите '+acc;else if(!/^[А-Яа-яЁё]+(-[А-Яа-яЁё]+)?$/.test(t))e[k]='Только русские буквы, как в паспорте'}
  if(digits(v.series).length!==4)e.series='Серия — 4 цифры';
  if(digits(v.number).length!==6)e.number='Номер — 6 цифр';
  return e}
function PsForm({v,setV,errs,setErrs}){
  const set=(k,val)=>{setV(o=>({...o,[k]:val,auto:{...o.auto,[k]:false}}));setErrs(o=>({...o,[k]:''}))};
  const onFiles=fs=>{const f=fs[0];if(!f)return;
    if(!/\.(pdf|jpe?g)$/i.test(f.name)){setErrs(o=>({...o,docs:'Нужен файл PDF или JPG'}));return}
    if(f.size>10*1048576){setErrs(o=>({...o,docs:'Файл больше 10 МБ — сожмите его или отсканируйте заново'}));return}
    setErrs(o=>({...o,docs:''}));setV(o=>({...o,docs:[fileObj(f)],recog:'busy'}));
    /* демо: очень маленький файл считаем нечитаемым сканом */
    setTimeout(()=>{if(f.size<20*1024){setV(o=>({...o,recog:'fail'}));return}
      const d=psFromPassport();setV(o=>({...o,...d,recog:'done',auto:{last:true,first:true,middle:true,series:true,number:true}}));
      setErrs({})},1200)};
  return html`<div class="stack">
    <div class="stack" style=${{gap:'12px'}}>
      <${UploadZone} id="ps-pass" title="Скан паспорта РФ · разворот с фото" limits="PDF или JPG до 10 МБ" error=${errs.docs} onFiles=${onFiles}/>
      ${v.docs.map(f=>html`<${FileItem} f=${f} onRemove=${()=>setV(o=>({...o,docs:[],recog:'idle',auto:{}}))}/>`)}
      ${v.recog==='busy'&&html`<div class="ps-recog"><span class="spinner sm"></span>Распознаём паспорт — подставим данные в поля ниже</div>`}
      ${v.recog==='fail'&&html`<${Alert} type="warning" title="Не удалось распознать паспорт">Заполните поля вручную или загрузите более чёткий скан<//>`}
    </div>
    <p class="hint" style=${{margin:0}}>${v.recog==='done'?'Данные подставлены из скана — сверьте их с паспортом':'Загрузите скан или заполните поля вручную — все поля обязательны'}</p>
    <div class="ps-grid">
      ${PS_FIELDS.map(([k,l])=>html`<${Field} id=${'ps-'+k} label=${l} mask="name" value=${v[k]} onChange=${x=>set(k,x)} error=${errs[k]}/>`)}
      <${Field} id="ps-series" label="Серия" mask="passSer" inputMode="numeric" value=${v.series} onChange=${x=>set('series',x)} error=${errs.series} helper="4 цифры"/>
      <${Field} id="ps-number" label="Номер" mask="passNo" inputMode="numeric" value=${v.number} onChange=${x=>set('number',x)} error=${errs.number} helper="6 цифр"/>
    </div>
  </div>`;
}
function PsResult({p,i}){
  const lv=scoreLvl(p.score); const [full,setFull]=useState(false);
  return html`<div class="ps-res">
    <div class="ps-score"><div class="ps-num"><b>${p.score}</b><span>из 999</span></div>
      <div class="ps-meta"><div class="row" style=${{gap:'8px'}}><b style=${{fontSize:'15px'}}>${p.name}</b><span class="desc" style=${{fontSize:'12px'}}>${p.role||(i===0?'Заёмщик':'Созаёмщик')}</span></div>
        <span class=${'lvl '+lv[1]}>${lv[0]} рейтинг</span>
        <div class="ps-scale"><i style=${{left:(p.score/999*100)+'%'}}></i></div>
        <div class="ps-ticks">${[1,633,861,979].map((v,k)=>html`<span style=${{left:(v/999*100)+'%',transform:k===0?'none':k===3?'translateX(-100%)':'translateX(-50%)'}}>${v}</span>`)}</div></div></div>
    <div class="ps-key">${psKey(p.report).map(([t,v,k])=>html`<div class=${'ps-k '+k}><span>${t}</span><b>${k==='ok'?ic.check(12):ic.info(12)}${v}</b></div>`)}</div>
    <button class="ps-full-btn" onClick=${()=>setFull(!full)} aria-expanded=${full}>Полный отчёт БКИ<span class=${'cp-chev'+(full?' up':'')}>${ic.chev(16)}</span></button>
    ${full&&html`<div class="ps-full">${p.report.map(([h,rows])=>html`<div class="ps-sec"><h5>${h}</h5><dl>${rows.map(([t,v,k])=>html`<dt>${t}</dt><dd class=${k}>${v}</dd>`)}</dl></div>`)}</div>`}
  </div>`;
}
/* ---------- PDF-отчёт для клиента: рендерим страницу A4 в canvas и собираем PDF ---------- */
const loadScript=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('load'));document.head.appendChild(s)});
async function ensurePdfLibs(){
  if(!window.html2canvas)await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  if(!window.jspdf)await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function psReportHtml(r,dealId){
  const col={low:'#c34455',mid:'#946319',ok:'#26795d',top:'#0c2ad0'};
  return `<div class="pdf-page">
    <div class="pdf-h"><div><div class="pdf-logo">сделка.рф</div><div class="pdf-sub">Отчёт по прескорингу · заявка № ${dealId}</div></div><div class="pdf-date">${esc(r.date)}</div></div>
    ${r.people.map((p,i)=>{const lv=scoreLvl(p.score);return `<div class="pdf-person">
      <div class="pdf-ph"><div><div class="pdf-name">${esc(p.name)}</div><div class="pdf-role">${p.role||(i===0?'Заёмщик':'Созаёмщик')}</div></div>
        <div class="pdf-score" style="color:${col[lv[1]]}"><b>${p.score}</b><span>из 999 · ${lv[0].toLowerCase()} рейтинг</span></div></div>
      <div class="pdf-grid">${p.report.map(([h,rows])=>`<div class="pdf-sec"><h5>${esc(h)}</h5>${rows.map(([t,v,k])=>`<div class="pdf-row"><span>${esc(t)}</span><b${k!=='ok'?' style="color:#946319"':''}>${esc(v)}</b></div>`).join('')}</div>`).join('')}</div></div>`}).join('')}
    <p class="pdf-note">Предварительная оценка по данным бюро кредитных историй. Не является решением банка и офертой. Окончательные условия определяет банк после рассмотрения заявки</p>
  </div>`;
}
async function makePrescorePdf(r,dealId){
  await ensurePdfLibs();
  const host=document.createElement('div');host.className='pdf-host';host.innerHTML=psReportHtml(r,dealId);document.body.appendChild(host);
  try{
    /* каждый блок рендерим отдельно, чтобы разрыв страницы не резал участника пополам */
    const blocks=[...host.firstElementChild.children];
    const {jsPDF}=window.jspdf; const pdf=new jsPDF({unit:'mm',format:'a4'});
    const W=210,H=297,M=14,CW=W-2*M; let y=M;
    for(const el of blocks){
      const c=await window.html2canvas(el,{scale:2,backgroundColor:'#ffffff'});
      const h=c.height*CW/c.width;
      if(y+h>H-M&&y>M){pdf.addPage();y=M}
      pdf.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',M,y,CW,h);y+=h+4;
    }
    return pdf.output('blob');
  } finally{host.remove()}
}
async function savePdf(blob,filename){
  const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;
  if(dl){await dl.save({filename,data:blob});return 'saved'}
  /* вне claude.ai (офлайн-файл) — обычное скачивание */
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);return 'saved';
}
function PrescoreModal({onClose}){
  const {prescore,setPrescore,a,setA,files,setFiles,co,setCo,client,say,calc,dealId}=useApp();
  const [pdfBusy,setPdfBusy]=useState(false);
  const downloadPdf=async()=>{setPdfBusy(true);try{const blob=await makePrescorePdf(prescore,dealId);await savePdf(blob,`Прескоринг · заявка ${dealId}.pdf`);say('PDF-отчёт готов — его можно распечатать или отправить клиенту')}catch(e){const c=e&&e.code;say(c==='declined'?'Сохранение отменено':c==='rate_limited'?'Подождите — окно сохранения уже открыто':e&&e.message==='load'?'Не удалось загрузить модуль PDF — проверьте интернет':'Не получилось сформировать PDF')}finally{setPdfBusy(false)}};
  /* первая проверка — по данным заёмщика, если паспорт уже распознан в анкете; «Проверить нового клиента» — пустая форма */
  const fromDeal=()=>a.recognized?{...PS_EMPTY,...psFromPassport()}:{...PS_EMPTY};
  const [phase,setPhase]=useState(prescore?'result':'form');
  const [v,setV]=useState(fromDeal);
  const [errs,setErrs]=useState({});
  const [isNew,setIsNew]=useState(false);
  const newClient=()=>{setPrescore(null);setV({...PS_EMPTY});setErrs({});setIsNew(true);setPhase('form')};
  const run=()=>{const e=psCheck(v);setErrs(e);
    if(Object.values(e).some(Boolean)){setTimeout(()=>{const el=document.querySelector('.modal .err,.modal .err-text');el&&el.scrollIntoView({block:'center',behavior:'smooth'})},30);return}
    setPhase('loading');
    setTimeout(()=>{const total=calc.offers.length;const name=[v.last,v.first,v.middle].map(x=>x.trim()).join(' ');
      const borrower=!isNew&&(!a.fio||a.fio===name);
      const d=borrower?['',902,'ok']:CO_DEMO[(Date.now()/1000|0)%CO_DEMO.length];const rep=psReport(d[2]);
      const p={pid:borrower?'main':'client-'+Date.now(),name,role:borrower?'Заёмщик':'Клиент',passport:digits(v.series)+' '+digits(v.number),score:d[1],report:rep,checks:psFlags(rep)};
      setPrescore({people:[p],score:p.score,banks:Math.round(total*(p.score>=861?0.8:p.score>=633?0.6:0.25)),total,date:new Date().toLocaleDateString('ru-RU')});
      setPhase('result')},1600)};
  const r=prescore;
  return html`<${ModalShell} wide=${phase==='result'} title="Прескоринг" sub=${phase==='result'?'Предварительная оценка по данным БКИ от '+r.date:'Предварительная оценка по данным бюро кредитных историй. На заявку в банк не влияет'} onClose=${onClose}>
    ${phase==='form'&&html`<${PsForm} v=${v} setV=${setV} errs=${errs} setErrs=${setErrs}/>
    <div class="modal-act"><button class="btn outline" onClick=${onClose}>Отмена</button><button class="btn primary" disabled=${v.recog==='busy'} onClick=${run}>Запустить прескоринг</button></div>`}
    ${phase==='loading'&&html`<div class="ps-load"><span class="spinner"></span><b>Запрашиваем кредитную историю</b><span class="desc">Обычно это занимает несколько секунд</span></div>`}
    ${phase==='result'&&html`<div class="stack">
      ${r.people.map((p,i)=>html`<${PsResult} key=${p.pid} p=${p} i=${i}/>`)}
      <div class="ps-reco">${(m=>m>=861?'Высокая':m>=633?'Хорошая':'Низкая')(r.score)} вероятность одобрения в ${r.banks} из ${r.total} банков подборки</div>
    </div>
    <div class="modal-act"><button class="btn outline" style=${{marginRight:'auto'}} disabled=${pdfBusy} onClick=${downloadPdf}>${pdfBusy?html`<span class="spinner sm"></span>Готовим PDF`:html`${ic.download(16)}PDF для клиента`}</button><button class="btn outline" onClick=${newClient}>${ic.plus(16)}Проверить нового клиента</button><button class="btn primary" onClick=${()=>{onClose();say('Рейтинг сохранён в заявке')}}>Готово</button></div>`}
  <//>`;
}
/* Карточка банка из списка предложений. Значения — демо, детерминированы от позиции банка */
/* Лимиты банка (демо): максимальный срок, сумма и минимальный взнос. Несколько банков специально строже — чтобы было видно блок «Не подошли» */
const bankLimits=(i,program)=>{const progMin=/Семейная|IT|Военная/.test(program)?20:10;
  const k=i<12?i:0;return {term:[30,30,15,30,25,30,30,14,30,30,30,30][k],sum:[100,60,80,50,60,100,80,60,5,100,60,80][k]*1e6,down:Math.max(progMin,[10,15,20,10,15,50,10,20,15,10,15,20][k])}};
const bankFit=(lim,{term,loan,downPct})=>{const r=[];
  if(term>lim.term)r.push(`срок кредита до ${years(lim.term)}`);
  if(loan>lim.sum)r.push(`сумму кредита до ${rub(lim.sum)}`);
  if(downPct<lim.down)r.push(`первый взнос от ${String(lim.down).replace('.',',')}%`);
  return r};
function BankModal({name,onClose,onToggle}){
  const {calc,f,selected,say}=useApp(); const o=calc.offers.find(x=>x.name===name); const idx=calc.offers.indexOf(o);
  const lim=bankLimits(BANKS.findIndex(b=>b[0]===name),f.program); const minDown=String(lim.down).replace('.',',');
  const psk=[o.rate+0.9,o.rate+3.1].map(v=>v.toFixed(2).replace('.',','));
  const maxSum=lim.sum, maxTerm=lim.term;
  const ageMax=[70,75,75,85][idx%4];
  const sel=selected.has(name);
  const reqs=[`Возраст от 21 года до ${ageMax} лет на момент погашения`,'Гражданство РФ',`Стаж на текущем месте от ${[3,4,6][idx%3]} месяцев`,'Общий стаж от 1 года за последние 5 лет'];
  const docs=[['Для рассмотрения заявки',['Паспорт РФ','СНИЛС',f.program.includes('Семейная')?'Свидетельства о рождении детей':'Справка о доходах или выписка из СФР']],
    ['Для сделки',['Договор долевого участия или купли-продажи','Отчёт об оценке объекта','Выписка из ЕГРН']]];
  return html`<${ModalShell} wide title=${name} sub=${f.program+' · '+f.goal} onClose=${onClose}>
    <div class="bm-top num"><div><span>Расчётная ставка</span><b class=${calc.cut?'acc':''}>${pct(o.rate)}*</b></div>
      <div><span>Платёж в месяц · ${years(f.term)}</span><b>${rub(o.pay)}</b></div>
      <div><span>Сумма кредита</span><b>${rub(calc.loan)}</b></div>
      <div><span>Рекомендуемый доход</span><b>${rub(o.income)}</b></div></div>
    <p class="desc" style=${{fontSize:'12px',margin:'-8px 0 0'}}>* Окончательные условия банк определит после рассмотрения заявки</p>
    <div class="bm-grid num">
      <div><span>ПСК</span><b>${psk[0]}–${psk[1]}%</b></div><div><span>Первоначальный взнос</span><b>от ${minDown}%</b></div>
      <div><span>Максимальный срок</span><b>${years(maxTerm)}</b></div><div><span>Максимальная сумма</span><b>${rub(maxSum)}</b></div></div>
    <div class="bm-cols">
      <div class="stack" style=${{gap:'10px'}}><h3 class="bm-h">Требования к заёмщику</h3><ul class="bm-list">${reqs.map(r=>html`<li>${ic.check(14)}<span>${r}</span></li>`)}</ul></div>
      <div class="stack" style=${{gap:'10px'}}><h3 class="bm-h">Необходимые документы</h3>
        ${docs.map(([h,l])=>html`<div><h5 class="bm-sub">${h}</h5><ul class="bm-list docs">${l.map(d=>html`<li>${ic.file(14)}<span>${d}</span></li>`)}</ul></div>`)}</div></div>
    <div class="modal-act"><button class="btn outline" onClick=${onClose}>Закрыть</button>
      <button class=${'btn '+(sel?'outline':'primary')} onClick=${()=>{onToggle(name);say(sel?name+' убран из выбранных':name+' добавлен в выбранные');onClose()}}>${sel?'Убрать из выбранных':'Выбрать банк'}</button></div>
  <//>`;
}
function ModalShell({title,sub,onClose,children,wide}){
  useEffect(()=>{const k=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',k);return()=>document.removeEventListener('keydown',k)},[]);
  return html`<div class="overlay" onMouseDown=${e=>{if(e.target===e.currentTarget)onClose()}}>
    <div class=${'modal'+(wide?' wide':'')} role="dialog" aria-modal="true" aria-labelledby="mt">
      <div class="modal-h"><div><h2 id="mt">${title}</h2>${sub&&html`<p>${sub}</p>`}</div><button class="close" onClick=${onClose} aria-label="Закрыть">${ic.x(18)}</button></div>
      ${children}</div></div>`;
}
function DomrfModal({initial,onClose,onApply}){
  const [tab,setTab]=useState(initial?.tab||'project');
  const [obj,setObj]=useState(initial?.obj||'Объект не выбран');
  const [cut,setCut]=useState(initial?.tab==='cut'?initial.label:'Снижение на 1 п.п.');
  const [err,setErr]=useState('');
  useEffect(()=>setErr(''),[obj,tab]);
  const apply=()=>{ if(tab==='project'&&obj==='Объект не выбран'){setErr('Выберите объект — ДОМ.РФ считает субсидированную ставку для конкретного корпуса застройщика');return}
    if(tab==='project') onApply({tab,obj,cut:1.5,label:obj+', −1,5 п.п.'});
    else onApply({tab,cut:parseFloat(cut.match(/[\d,]+/)[0].replace(',','.')),label:cut});};
  return html`<${ModalShell} title="Условия ставки ДОМ.РФ" sub="Субсидированная ставка по программе застройщика" onClose=${onClose}>
    <div class="segtabs"><button class=${tab==='project'?'on':''} onClick=${()=>setTab('project')}>Проектное финансирование</button><button class=${tab==='cut'?'on':''} onClick=${()=>setTab('cut')}>Снижение ставки</button></div>
    ${tab==='project'?html`<${SelectField} label="Проект финансирования" value=${obj} items=${OBJECTS} onPick=${setObj} error=${err}/>`
      :html`<${SelectField} label="Размер снижения" value=${cut} items=${['Снижение на 0,5 п.п.','Снижение на 1 п.п.','Снижение на 2 п.п.','Снижение на 3 п.п.']} onPick=${setCut}/>`}
    <${Alert} title="Условия субсидии согласуются с застройщиком">Итоговая ставка пересчитается после выбора ${tab==='project'?'объекта':'размера снижения'}.<//>
    <div class="modal-act"><button class="btn outline" onClick=${onClose}>Отмена</button><button class="btn primary" onClick=${apply}>Применить условия</button></div><//>`;
}
const firstName=n=>{const p=(n||'').trim().split(/\s+/);return p.length>1?p[1]:''};
/* Иллюстрация письма: дом, ключ и монета в цветах бренда */
const HOUSE_ART=html`<svg class="l-art" viewBox="0 0 200 150" aria-hidden="true">
  <ellipse cx="100" cy="136" rx="84" ry="9" fill="#c3d3f7" opacity=".55"/>
  <circle cx="150" cy="38" r="26" fill="#ffffff"/>
  <path d="M46 70 100 28l54 42" fill="none" stroke="#0c2ad0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M58 66v66h84V66L100 36Z" fill="#ffffff" stroke="#0c2ad0" stroke-width="3" stroke-linejoin="round"/>
  <rect x="88" y="94" width="24" height="38" rx="4" fill="#0c2ad0"/>
  <circle cx="106" cy="114" r="2" fill="#ffffff"/>
  <rect x="68" y="78" width="16" height="16" rx="3" fill="#c3d3f7"/><rect x="116" y="78" width="16" height="16" rx="3" fill="#c3d3f7"/>
  <rect x="124" y="34" width="10" height="22" rx="2" fill="#0c2ad0"/>
  <g transform="rotate(-28 160 104)"><circle cx="160" cy="104" r="11" fill="none" stroke="#4e68de" stroke-width="5"/>
    <path d="M171 104h22M187 104v8M181 104v6" stroke="#4e68de" stroke-width="5" stroke-linecap="round"/></g>
  <circle cx="36" cy="112" r="16" fill="#0c2ad0"/><text x="36" y="118" text-anchor="middle" font-family="Geist,sans-serif" font-size="17" font-weight="700" fill="#ffffff">₽</text>
  <path d="M30 40v10M25 45h10M178 74v8M174 78h8" stroke="#4e68de" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;
function OfferModal({onClose}){
  const {client,setClient,calc,selected,f,say}=useApp();
  const v=useValidation(); const set=(k,val)=>{setClient(o=>({...o,[k]:val}));v.clear(k)};
  const banks=calc.offers.filter(o=>selected.has(o.name));
  const send=()=>{ if(v.run({name:client.name.trim().split(/\s+/).length<2?'Укажите фамилию и имя — так клиент поймёт, что предложение подготовлено для него':'',
      phone:digits(client.phone).length<11?'Номер нужен полностью, 11 цифр — по нему клиент получит ссылку на анкету':'',
      email:!emailOk(client.email)?'Проверьте почту: на этот адрес придёт предложение, ошибка в одной букве — и письмо не дойдёт':''})){onClose();say('Предложение отправлено на '+client.email)} };
  return html`<${ModalShell} wide title="Предложение для клиента" sub="Заполните контакты — клиент получит предварительный расчёт на почту" onClose=${onClose}>
    <div class="grid g2">
      <${Field} id="c-name" label="ФИО клиента" value=${client.name} placeholder="Фамилия, имя, отчество" mask="name" helper="Как в паспорте" error=${v.errs.name} onChange=${x=>set('name',x)}/>
      <${Field} id="c-phone" label="Мобильный телефон" value=${client.phone} placeholder="+7 (000) 000-00-00" inputMode="tel" mask="phone" helper="Для связи по заявке" error=${v.errs.phone} onChange=${x=>set('phone',x)}/>
      <${Field} id="c-mail" label="Электронная почта" value=${client.email} placeholder="name@example.com" inputMode="email" mask="email" helper="Сюда придёт предложение" error=${v.errs.email} onChange=${x=>set('email',x)}/>
    </div>
    <div class="mail-prev">
      <div class="mail-meta"><span class="cap">Так письмо увидит клиент</span>
        <div><span>Кому</span><b>${client.email||'почта клиента'}</b></div>
        <div><span>Тема</span><b>Ипотечное предложение по вашей заявке</b></div></div>
      <div class="mail-canvas"><article class="letter">
        <div class="l-top"><span class="l-logo">сделка.рф</span><small>Заявка № BD2A6E33 · ${new Date().toLocaleDateString('ru-RU')}</small></div>
        <div class="l-hero">
          <div class="tx"><h3>${firstName(client.name)?firstName(client.name)+', мы':'Мы'} подобрали для вас ипотеку</h3>
            <p>${f.program} · ${f.region}. Предварительный расчёт по ${banks.length} ${plural(banks.length,'банку','банкам','банкам')}. Чтобы брокер заполнил анкету и отправил её в банки, загрузите документы</p></div>
          ${HOUSE_ART}</div>
        <div class="l-params">
          <div><span>Стоимость</span><b>${rub(f.price)}</b></div><div><span>Взнос</span><b>${rub(f.down)}</b></div>
          <div><span>Кредит</span><b>${rub(calc.loan)}</b></div><div><span>Срок</span><b>${years(f.term)}</b></div></div>
        <div class="l-banks">${banks.map(b=>html`<div class="l-bank">
          <span class="avatar">${b.ini}</span>
          <div class="nm"><b>${b.name}</b><small>Доход от ${rub(b.income)}</small></div>
          <div class="rt"><b>${pct(b.rate)}*</b><small>${rub(b.pay)} / мес*</small></div></div>`)}</div>
        <div class="l-docs"><h4>Необходимые документы для заполнения ипотечной анкеты</h4>
          <ul>${[['Паспорт РФ','Разворот с фото и страница с регистрацией'],['СНИЛС','Лицевая сторона']].map(([t,d])=>html`<li><span class="ic">${ic.file(16)}</span><div><b>${t}</b><small>${d}</small></div></li>`)}</ul>
          <p>Анкету заполнять не нужно — это сделает ваш брокер по загруженным документам</p></div>
        <div class="l-cta"><a class="btn primary" href="#client" title="Откроется страница загрузки документов на сайте" onClick=${e=>{e.preventDefault();onClose();go('client')}}>Загрузить документы</a><small>Откроется страница на сайте сделка.рф · ссылка действует 14 дней</small></div>
        <div class="l-manager">
          <div class="who"><span class="avatar">ДС</span><div><small>Ваш персональный менеджер</small><b>Дмитрий Сорокин</b><small>Ипотечный брокер · ООО «Сделка.РФ»</small></div></div>
          <div class="contacts">
            <div>${ic.phone(16)}<span>+7 900 000-00-00</span></div>
            <div>${ic.mail(16)}<span>d.sorokin@sdelka.rf</span></div>
            <div>${ic.clock(16)}<span>Пн–Пт, 9:00–19:00 (МСК)</span></div>
          </div>
          <p>Ответим на вопросы по условиям банков и поможем с документами</p></div>
        <p class="l-foot">* Предварительный расчёт, не является публичной офертой. Окончательные условия определяет банк после рассмотрения анкеты</p>
      </article></div></div>
    <div class="modal-act" style=${{justifyContent:'flex-start'}}><button class="btn outline" onClick=${()=>say('PDF с предложением сформирован')}>Сохранить в PDF</button><button class="btn primary" onClick=${send}>Отправить предложение на почту</button></div><//>`;
}


/* ---------- 0.0 Ипотечные заявки ---------- */
const DEAL_STATUS={'Консультация':'neutral','Заполнение':'accent','Подписание':'accent','Отправлено в банки':'accent','Доработка':'warning','Одобрено':'success','Отказ':'error'};
const DEAL_TARGET={'Консультация':'podbor','Заполнение':'income','Подписание':'signing','Отправлено в банки':'status','Доработка':'status','Одобрено':'status','Отказ':'status'};
const DEALS0=[
  {id:1001,program:'Стандартная ипотека',name:'Алексей Морозов',co:[],org:'ООО «Сделка.РФ»',region:'Москва',banks:['ПСБ'],sum:3000000,term:25,created:'01.10.2026',updated:'05.10.2026',status:'Консультация',mine:true},
  {id:1002,program:'Семейная ипотека',name:'Марина Соколова',co:['Сергей Соколов'],org:'ООО «Сделка.ЦП»',region:'Екатеринбург',banks:['ДОМ.РФ','Совкомбанк'],sum:4200000,term:20,created:'02.10.2026',updated:'05.10.2026',status:'Заполнение',mine:false},
  {id:1003,program:'Стандартная ипотека',name:'Илья Волков',co:[],org:'ООО «Сделка.РФ»',region:'Тюмень',banks:['ПСБ','ВТБ'],sum:5600000,term:30,created:'03.10.2026',updated:'05.10.2026',status:'Доработка',mine:true,unread:true},
  {id:1004,program:'IT-ипотека',name:'Анна Лебедева',co:[],org:'ООО «Сделка.ЦП»',region:'Казань',banks:['ПСБ'],sum:2800000,term:15,created:'04.10.2026',updated:'05.10.2026',status:'Одобрено',mine:false},
  {id:1005,program:'Стандартная ипотека',name:'Павел Орлов',co:[],org:'ООО «Сделка.РФ»',region:'Санкт-Петербург',banks:['ВТБ'],sum:6400000,term:25,created:'05.10.2026',updated:'05.10.2026',status:'Отказ',mine:true},
  {id:1006,program:'Семейная ипотека',name:'Ольга Белова',co:['Дмитрий Белов'],org:'ООО «Сделка.ЦП»',region:'Москва',banks:['ДОМ.РФ'],sum:7100000,term:30,created:'06.10.2026',updated:'06.10.2026',status:'Подписание',mine:false},
  {id:1007,program:'Стандартная ипотека',name:'Иван Иванов',co:[],org:'ООО «Сделка.РФ»',region:'Тверь',banks:['Абсолют Банк','Уралсиб'],sum:6000000,term:25,created:'07.10.2026',updated:'08.10.2026',status:'Отправлено в банки',mine:true,unread:true},
  {id:1008,program:'Дальневосточная ипотека',name:'Екатерина Смирнова',co:[],org:'ООО «Сделка.РФ»',region:'Казань',banks:['Сбербанк'],sum:3500000,term:20,created:'12.09.2026',updated:'20.09.2026',status:'Одобрено',mine:true,archived:true},
];
const dnum=d=>{const m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(d||'');return m?+(m[3]+m[2]+m[1]):null};
const allTxt=v=>v.startsWith('Все ')?'все':v;
const DF0={from:'',to:'',upFrom:'',upTo:'',region:'Все регионы',program:'Все программы',status:'Все статусы',bank:'Все банки',archive:false};
function Deals(){
  const {say,devJump}=useApp();
  const [deals,setDeals]=useState(DEALS0);
  const [q,setQ]=useState(''); const [mine,setMine]=useState(false); const [unread,setUnread]=useState(false);
  const [openP,setOpenP]=useState(null); const [df,setDf]=useState(DF0);
  const [draft,setDraft]=useState({}); const [rangeErr,setRangeErr]=useState('');
  const P=(id,trig,body,right)=>html`<${Anchor} id=${id} open=${openP} setOpen=${x=>{setOpenP(x);setRangeErr('')}} right=${right} trigger=${trig}>${body}<//>`;
  const pick=(k,items)=>html`<div class="pop"><${Menu} items=${items} value=${df[k]} onPick=${x=>{setF(k,x);setOpenP(null)}}/></div>`;
  const rangeTxt=(a,b)=>a&&b?`${a} – ${b}`:a?`с ${a}`:b?`по ${b}`:'любая';
  const openRange=(id,a,b,t)=>{setDraft({a:df[a],b:df[b]});t()};
  const rangePop=(title,a,b)=>html`<div class="pop form"><h4>${title}</h4>
      <div class="grid g2" style=${{gap:'8px'}}><${Field} id=${'r-'+a} label="С" value=${draft.a||''} placeholder="дд.мм.гггг" inputMode="numeric" mask="date" onChange=${x=>{setDraft(o=>({...o,a:x}));setRangeErr('')}}/>
        <${Field} id=${'r-'+b} label="По" value=${draft.b||''} placeholder="дд.мм.гггг" inputMode="numeric" mask="date" onChange=${x=>{setDraft(o=>({...o,b:x}));setRangeErr('')}}/></div>
      <${FieldError} text=${rangeErr}/>
      <button class="btn primary full" onClick=${()=>{const A=draft.a||'',B=draft.b||'';
        if((A&&A.length<10)||(B&&B.length<10)){setRangeErr('Введите дату полностью — дд.мм.гггг');return}
        if(A&&B&&dnum(A)>dnum(B)){setRangeErr('Дата «с» должна быть раньше даты «по»');return}
        setDf(o=>({...o,[a]:A,[b]:B}));setOpenP(null)}}>Применить</button></div>`;
  const setF=(k,val)=>setDf(o=>({...o,[k]:val}));
  const nFilters=Object.keys(DF0).filter(k=>df[k]!==DF0[k]).length;
  const regions=['Все регионы',...[...new Set(DEALS0.map(d=>d.region))].sort()];
  const banks=['Все банки',...[...new Set(DEALS0.flatMap(d=>d.banks))].sort()];
  const inRange=(d,a,b)=>{const x=dnum(d),f=dnum(a),t=dnum(b);return (f==null||x>=f)&&(t==null||x<=t)};
  const list=deals.filter(d=>(df.archive||!d.archived)
    &&(!q.trim()||[d.name,...d.co,String(d.id)].join(' ').toLowerCase().includes(q.trim().toLowerCase()))
    &&(!mine||d.mine)&&(!unread||d.unread)
    &&(df.region==='Все регионы'||d.region===df.region)&&(df.program==='Все программы'||d.program===df.program)&&(df.status==='Все статусы'||d.status===df.status)
    &&(df.bank==='Все банки'||d.banks.includes(df.bank))
    &&inRange(d.created,df.from,df.to)&&inRange(d.updated,df.upFrom,df.upTo));
  const unreadN=deals.filter(d=>d.unread&&!d.archived).length;
  const total=deals.filter(d=>!d.archived).length;
  const open=d=>{setDeals(o=>o.map(x=>x.id===d.id?{...x,unread:false}:x));devJump(DEAL_TARGET[d.status])};
  const toArchive=d=>{setDeals(o=>o.map(x=>x.id===d.id?{...x,archived:!x.archived}:x));say(d.archived?`Заявка № ${d.id} возвращена из архива`:`Заявка № ${d.id} перенесена в архив`)};
  const reset=()=>{setDf(DF0);setQ('');setMine(false);setUnread(false)};
  const newDeal=()=>go('podbor');
  return html`<${AppHeader}/>
  <main class="wrap">
    <${LineTabs} active=${0}/>
    <section class="card deals">
      <div class="row" style=${{justifyContent:'space-between'}}><div><h2>Ипотечные заявки</h2><p class="desc">Клиенты, заявки и ответы банков</p></div>
        <${Badge} tone="accent">${total} ${plural(total,'заявка','заявки','заявок')}<//></div>
      <div class="deals-bar">
        <label class="search" for="dq">${ic.search(18)}<input id="dq" placeholder="Заёмщик, созаёмщик или номер заявки" value=${q} onInput=${e=>setQ(e.target.value)}/></label>
        <${Checkbox} showLabel checked=${mine} onChange=${setMine} label="Созданные мной"/>
        <${Checkbox} showLabel checked=${unread} onChange=${setUnread} label=${html`Только непрочитанные <span class="unread-n">${unreadN}</span>`}/>
        <${Checkbox} showLabel checked=${df.archive} onChange=${x=>setF('archive',x)} label="Показывать архив"/>
      </div>
      <div class="chips" style=${{marginTop:0}}>
        ${P('region',(o,t)=>html`<${Chip} label="Регион:" value=${allTxt(df.region)} open=${o} onClick=${t}/>`,pick('region',regions))}
        ${P('program',(o,t)=>html`<${Chip} label="Программа:" value=${allTxt(df.program)} open=${o} onClick=${t}/>`,pick('program',['Все программы','Стандартная ипотека','Семейная ипотека','IT-ипотека','Дальневосточная ипотека']))}
        ${P('status',(o,t)=>html`<${Chip} label="Статус:" value=${allTxt(df.status)} open=${o} onClick=${t}/>`,pick('status',['Все статусы',...Object.keys(DEAL_STATUS)]))}
        ${P('bank',(o,t)=>html`<${Chip} label="Банк:" value=${allTxt(df.bank)} open=${o} onClick=${t}/>`,pick('bank',banks))}
        ${P('created',(o,t)=>html`<${Chip} label="Создана:" value=${rangeTxt(df.from,df.to)} open=${o} onClick=${()=>openRange('created','from','to',t)}/>`,rangePop('Дата создания','from','to'))}
        ${P('updated',(o,t)=>html`<${Chip} label="Статус обновлён:" value=${rangeTxt(df.upFrom,df.upTo)} open=${o} onClick=${()=>openRange('updated','upFrom','upTo',t)}/>`,rangePop('Дата обновления статуса','upFrom','upTo'),true)}
        <button class="ghost-link" onClick=${()=>{setDf(DF0);setOpenP(null);say('Фильтры сброшены')}}>${ic.reset(16)}Сброс фильтров</button>
      </div>
      ${list.length?html`<div class="table-wrap"><table class="deals-t">
        <thead><tr><th>Заёмщик и созаёмщики</th><th>Регион</th><th>Банки</th><th>Сумма и срок</th><th>№ заявки</th><th>Создана</th><th>Обновлён статус</th><th>Статус</th><th><span class="sr">Действия</span></th></tr></thead>
        <tbody>${[...list.filter(d=>!d.archived),...(list.some(d=>d.archived)?[{group:1}]:[]),...list.filter(d=>d.archived)].map(d=>d.group?html`<tr class="arch-head"><td colspan="9">${ic.archive(16)} Архив · ${list.filter(x=>x.archived).length}</td></tr>`:html`<tr class=${(d.unread?'unread':'')+(d.archived?' arch':'')} onClick=${()=>open(d)}>
          <td><button class="deal-name" onClick=${e=>{e.stopPropagation();open(d)}}>${d.unread&&html`<span class="mail-ic" title="Есть новое сообщение от банка">${ic.mail(16)}</span>`}<b>${d.name}</b>${ic.arrowR(14)}</button>
            ${d.co.map(c=>html`<small>${c}</small>`)}<small>${d.org}</small></td>
          <td>${d.region}</td>
          <td>${d.banks.map(b=>html`<div>${b}</div>`)}</td>
          <td class="num"><b>${rub(d.sum)}</b><small>на ${years(d.term)}</small></td>
          <td class="num">${d.id}</td><td class="num">${d.created}</td><td class="num">${d.updated}</td>
          <td><${Badge} tone=${d.archived?'neutral':DEAL_STATUS[d.status]}>${d.status}<//></td>
          <td><button class=${'icon-btn'+(d.archived?' restore':'')} aria-label=${d.archived?'Вернуть из архива':'В архив'} title=${d.archived?'Вернуть из архива':'В архив'} onClick=${e=>{e.stopPropagation();toArchive(d)}}>${d.archived?ic.unarchive(18):ic.archive(18)}</button></td>
        </tr>`)}</tbody></table></div>`
      :html`<div class="empty"><span class="icon-tile">${ic.search(22)}</span><h3>Ничего не нашли</h3><p class="desc">Попробуйте изменить запрос или сбросить фильтры</p><button class="btn outline" onClick=${reset}>Сбросить всё</button></div>`}
    </section>
  </main>
  <${BottomBar} left=${`Показано ${list.length} из ${total}${df.archive?' + архив':''}`} primary="Создать заявку" onPrimary=${newDeal}/>`;
}

/* ---------- 1.1 Персональные данные ---------- */
function Personal(){
  const {a,setA,files,setFiles,markDone,sber,say}=useApp(); const v=useValidation();
  const set=(k,val)=>{setA(o=>({...o,[k]:val}));v.clear(k)};
  const [recog,setRecog]=useState(false);
  const uploadPassport=fs=>{if(!fs.length)return;setFiles(o=>({...o,passport:[...o.passport,...fs.map(fileObj)]}));v.setErrs({});
    if(!a.recognized){setRecog(true);setTimeout(()=>{setA(o=>({...o,...PASSPORT_DATA,recognized:true}));setRecog(false)},1500)}};
  const R=a.recognized;
  const man=(k,id,label,ph,helper,mask='text',im)=>R?html`<${Field} id=${id} label=${label} value=${a[k]} disabled helper="Распознано из паспорта"/>`:html`<${Field} id=${id} label=${label} value=${a[k]} placeholder=${ph} helper=${helper} mask=${mask} inputMode=${im} error=${v.errs[k]} onChange=${x=>set(k,x)}/>`;
  const req=(k,msg)=>!R&&!String(a[k]).trim()?msg:'';
  const next=()=>{ if(v.run({
      passport:!files.passport.length?'Загрузите паспорт — по нему банк сверит личность, а мы заполним данные за вас':'',
      fio:req('fio','Укажите ФИО как в паспорте'),birthDate:!R&&!/^\d{2}\.\d{2}\.\d{4}$/.test(a.birthDate)?'Введите дату рождения в формате дд.мм.гггг':'',
      birthPlace:req('birthPlace','Укажите место рождения — как в паспорте'),passNum:!R&&digits(a.passNum).length!==10?'Серия и номер — 10 цифр с разворота паспорта':'',
      passDate:!R&&!/^\d{2}\.\d{2}\.\d{4}$/.test(a.passDate)?'Введите дату выдачи в формате дд.мм.гггг':'',passCode:!R&&digits(a.passCode).length!==6?'Код подразделения — 6 цифр, например 690-014':'',
      passWho:req('passWho','Укажите, кем выдан паспорт'),regAddr:req('regAddr','Укажите адрес регистрации со страницы прописки'),
      phone:digits(a.phone).length<11?'Нужен полный номер, 11 цифр — банк позвонит по нему, чтобы подтвердить заявку':'',
      snils:digits(a.snils).length!==11?'В СНИЛС 11 цифр. Его можно найти на лицевой стороне свидетельства или в Госуслугах':'',
      email:!emailOk(a.email)?'Проверьте адрес: на него придут уведомления по заявке и ответ банка':'',
      inn:a.inn&&digits(a.inn).length!==12?'ИНН физлица — 12 цифр. Можно оставить поле пустым, если клиент его не знает':'',
      factAddr:a.factDiff&&!a.factAddr.trim()?'Укажите, где клиент живёт сейчас — банк проверяет оба адреса':'',
      ...(a.prevPassport&&!a.firstPassport?{prevSer:digits(a.prevSer||'').length!==4?'Серия — 4 цифры':'',prevNo:digits(a.prevNo||'').length!==6?'Номер — 6 цифр':'',prevDate:!/^\d{2}\.\d{2}\.\d{4}$/.test(a.prevDate||'')?'Введите дату в формате дд.мм.гггг':''}:{}),
      ...(sber?{income:!+digits(a.income||'')?'Укажите ежемесячный доход после вычета налогов':'',monthsHere:a.monthsHere===''||a.monthsHere==null?'Укажите, сколько месяцев клиент работает на текущем месте':''}:{})})){markDone('personal');go(nextOf('personal'))} };
  return html`<${AnketaPage} step="personal" onNext=${next} alert=${firstErrAlert(v.errs,'Чтобы перейти дальше, заполните недостающие данные')}>
    <div class="stack"><h1 class="sec">Персональные данные</h1><p class="desc">Загрузите паспорт и СНИЛС для заполнения данных или введите реквизиты вручную</p>
      <div class="grid g2">
        <div class="stack" style=${{gap:'12px'}}><${UploadZone} id="up-pass" title="Паспорт РФ" error=${v.errs.passport} onFiles=${uploadPassport}/>
          ${recog&&html`<p class="helper" role="status">${ic.clock(14)} Распознаём паспорт — заполним поля автоматически…</p>`}
          ${files.passport.map((f,i)=>html`<${FileItem} f=${f} owner=${f.from?f.size+' · из прескоринга':''} onRemove=${()=>setFiles(o=>({...o,passport:o.passport.filter((_,j)=>j!==i)}))}/>`)}</div>
        <div class="stack" style=${{gap:'12px'}}><${UploadZone} id="up-snils" title="СНИЛС" onFiles=${fs=>{setFiles(o=>({...o,snils:[...o.snils,...fs.map(fileObj)]}));if(!digits(a.snils||'')){set('snils','123-456-789 01');say('Номер СНИЛС распознан и подставлен в поле')}}}/>
          ${files.snils.map((f,i)=>html`<${FileItem} f=${f} onRemove=${()=>setFiles(o=>({...o,snils:o.snils.filter((_,j)=>j!==i)}))}/>`)}</div>
      </div>
      ${R&&html`<${Alert} title=${a.fromPrescore&&files.passport.some(f=>f.from)?'Паспорт и телефон подтянуты из прескоринга':'Данные распознаны из паспорта'}>Проверьте их — если что-то не так, загрузите более чёткий скан<//>`}
      <div class="grid g2" style=${{marginTop:'8px'}}>
        ${man('fio','p-fio','ФИО','Фамилия, имя, отчество','Как в паспорте','name')}
        <${Field} id="p-phone" label="Номер телефона" value=${a.phone} placeholder="+7 (000) 000-00-00" inputMode="tel" mask="phone" error=${v.errs.phone} onChange=${x=>set('phone',x)}/>
      </div>
      <${SelectField} label="Менялась фамилия, имя, отчество" value=${a.changedName} items=${['Не менялось','Менялась фамилия','Менялось имя','Менялось отчество']} onPick=${x=>set('changedName',x)}/>
      <div class="grid g2">${man('birthPlace','p-place','Место рождения','Город или населённый пункт')}${man('birthDate','p-bd','Дата рождения','дд.мм.гггг',null,'date','numeric')}</div>
      <div class="grid g2"><${SelectField} label="Пол" value=${a.gender} items=${['Мужской','Женский']} onPick=${x=>set('gender',x)}/>${R?html`<${Field} id="p-cit" label="Гражданство" value=${a.citizenship} disabled helper="Распознано из паспорта"/>`:html`<${SelectField} label="Гражданство" value=${a.citizenship} items=${['Российская Федерация','Другое']} onPick=${x=>set('citizenship',x)}/>`}</div>
      <div class="grid g2"><${Field} id="p-inn" label="ИНН физлица" value=${a.inn} placeholder="000000000000" inputMode="numeric" mask="inn12" helper="12 цифр, необязательно" error=${v.errs.inn} onChange=${x=>set('inn',x)}/></div>
    </div>
    <div class="stack"><h1 class="sec">Паспорт и СНИЛС</h1>
      <div class="grid g3">${man('passNum','p-ser','Серия и номер','0000 000000','10 цифр','pass','numeric')}${man('passDate','p-iss','Когда выдан','дд.мм.гггг',null,'date','numeric')}${man('passCode','p-code','Код подразделения','000-000','6 цифр','code','numeric')}</div>
      ${man('passWho','p-who','Кем выдан','Как указано в паспорте')}
      <div class="grid g2">${man('regAddr','p-addr','Адрес регистрации','Город, улица, дом, квартира')}
        <${Field} id="p-snils" label="СНИЛС" value=${a.snils} placeholder="000-000-000 00" inputMode="numeric" mask="snils" helper="11 цифр" error=${v.errs.snils} onChange=${x=>set('snils',x)}/></div>
      <${Switch} checked=${a.factDiff} onChange=${x=>set('factDiff',x)} label="Фактический адрес отличается от регистрации"/>
      ${a.factDiff&&html`<${Field} id="p-fact" label="Фактический адрес" value=${a.factAddr} placeholder="Город, улица, дом, квартира" mask="text" error=${v.errs.factAddr} onChange=${x=>set('factAddr',x)}/>`}
      <${Field} id="p-mail" label="Электронная почта контактного лица" value=${a.email} placeholder="name@example.com" inputMode="email" mask="email" helper="Сюда придут уведомления по заявке" error=${v.errs.email} onChange=${x=>set('email',x)}/>
      <div class="stack" style=${{gap:'12px'}}>
        <${Switch} checked=${!!a.firstPassport} onChange=${x=>{set('firstPassport',x);if(x)set('prevPassport',false)}} label="Паспорт РФ получен впервые" helper="Ранее паспорт РФ не выдавался, например при получении гражданства РФ"/>
        <${Switch} checked=${a.prevPassport} disabled=${!!a.firstPassport} onChange=${x=>set('prevPassport',x)} label="Есть предыдущий паспорт"/>
        ${a.prevPassport&&!a.firstPassport&&html`<div class="stack" style=${{gap:'12px'}}><h5 class="bm-sub" style=${{margin:'8px 0 0'}}>Предыдущий паспорт</h5>
          <div class="grid g3">
            <${Field} id="p-pser" label="Серия" value=${a.prevSer||''} mask="passSer" helper="4 цифры" error=${v.errs.prevSer} onChange=${x=>set('prevSer',x)}/>
            <${Field} id="p-pno" label="Номер" value=${a.prevNo||''} mask="passNo" helper="6 цифр" error=${v.errs.prevNo} onChange=${x=>set('prevNo',x)}/>
            <${Field} id="p-pdate" label="Когда выдан" value=${a.prevDate||''} mask="date" error=${v.errs.prevDate} onChange=${x=>set('prevDate',x)}/>
          </div></div>`}
      </div>
    </div>
    ${sber&&html`<div class="stack"><h1 class="sec">Доход и работа</h1><p class="desc">Для заявки в Сбербанк достаточно двух вопросов — остальное банк уточнит сам</p>
      <div class="grid g2">
        <${Field} id="p-inc" label="Основной доход, ₽ / мес" value=${a.income?(+digits(a.income)).toLocaleString('ru-RU'):''} placeholder="0" suffix="₽" inputMode="numeric" mask="money" helper="После вычета налогов" error=${v.errs.income} onChange=${x=>set('income',digits(x))}/>
        <${StepperField} id="p-months" label="Месяцев на текущем месте работы" value=${a.monthsHere??''} max=${600} error=${v.errs.monthsHere} onChange=${x=>set('monthsHere',x)}/>
      </div></div>`}<//>`;
}
/* ---------- 1.2 ---------- */
function Family(){
  const {a,setA,markDone}=useApp(); const set=(k,val)=>setA(o=>({...o,[k]:val}));
  return html`<${AnketaPage} step="family" onNext=${()=>{markDone('family');go('income')}}>
    <div class="stack"><h1 class="sec">Семейное положение</h1><p class="desc">Укажите семейное положение и количество несовершеннолетних детей</p>
      <div class="grid g3">
        <${SelectField} label="Семейное положение" value=${a.marital} items=${['Холост / не замужем','Женат / замужем','В разводе','Вдовец / вдова','Гражданский брак']} onPick=${x=>set('marital',x)}/>
        <${SelectField} label="Супруг исключён из сделки" value=${a.spouseExcluded} items=${['Нет','Да, по брачному договору','Да, по нотариальному согласию']} onPick=${x=>set('spouseExcluded',x)}/>
        <${SelectField} label="Несовершеннолетние дети" value=${a.kids} items=${['Нет','1','2','3','4 и больше']} onPick=${x=>set('kids',x)}/>
      </div>
      ${a.marital==='Женат / замужем'&&html`<${Switch} checked=${a.spouseCo} onChange=${x=>set('spouseCo',x)} label="Супруг(а) участвует как созаёмщик"/>`}
      ${a.spouseCo&&html`<${Alert} title="Добавим созаёмщика после основной анкеты">Ссылку на анкету для супруга(и) можно будет отправить на шаге подписания<//>`}
      <p class="desc" style=${{fontSize:'13px'}}>Данные семьи используются для проверки комплекта документов</p></div><//>`;
}
/* ---------- 1.3 ---------- */
const PICK='Выберите из списка';
const EXP5=['Менее 6 месяцев','От 6 месяцев до 1 года','От 1 года до 3 лет','От 3 до 5 лет','5 лет и более'];
/* Поле-счётчик: можно ввести число или нажать − / + */
function StepperField({id,label,value,onChange,min=0,max=60,error,helper}){
  const n=value===''?null:+value; const setN=x=>onChange(String(Math.max(min,Math.min(max,x))));
  return html`<div><label class=${'field stepper'+(error?' err':'')} for=${id}><span class="lab">${label}</span>
    <input id=${id} value=${value} placeholder="0" inputmode="numeric" maxlength=${String(max).length} onInput=${e=>{const d=digits(e.target.value);e.target.value=d;onChange(d===''?'':String(Math.min(max,+d)))}}/>
    <span class="stp"><button type="button" aria-label="Уменьшить" disabled=${n===null||n<=min} onClick=${e=>{e.preventDefault();setN((n||0)-1)}}>${ic.minus(18)}</button>
      <button type="button" aria-label="Увеличить" disabled=${n!==null&&n>=max} onClick=${e=>{e.preventDefault();setN(n===null?Math.max(min,1):n+1)}}>${ic.plus(18)}</button></span></label>
    ${error&&typeof error==='string'?html`<${FieldError} text=${error}/>`:helper&&html`<p class="helper">${helper}</p>`}</div>`;
}
function Income(){
  const {a,setA,markDone,say}=useApp(); const v=useValidation();
  const set=(k,val)=>{setA(o=>({...o,[k]:val}));v.clear(k)};
  const jobs=a.jobs||[];
  const updJ=(i,k,val)=>{setA(o=>({...o,jobs:o.jobs.map((x,j)=>j===i?{...x,[k]:val}:x)}));v.clear('j'+k+i)};
  const addJ=()=>setA(o=>({...o,jobs:[...(o.jobs||[]),{kind:'Совместительство',org:'',inn:'',pos:'',start:'',income:''}]}));
  const delJ=i=>{setA(o=>({...o,jobs:o.jobs.filter((_,j)=>j!==i)}));v.setErrs({})};
  const jobRules={};jobs.forEach((x,i)=>{
    jobRules['jorg'+i]=!x.org.trim()?'Укажите организацию — как в договоре':'';
    jobRules['jinn'+i]=digits(x.inn).length!==10?'ИНН организации — 10 цифр':'';
    jobRules['jpos'+i]=!x.pos.trim()?'Укажите должность или вид работ':'';
    jobRules['jstart'+i]=!/^\d{2}\.\d{2}\.\d{4}$/.test(x.start)?'Введите дату начала в формате дд.мм.гггг':'';
    jobRules['jincome'+i]=!(+digits(x.income)>0)?'Укажите доход на этом месте после вычета налогов':''});
  const next=()=>{ if(v.run({
      income:!(+digits(a.income)>0)?'Укажите доход после вычета налогов — от него зависит, какую сумму одобрит банк':'',
      org:!a.org.trim()?'Укажите работодателя так, как в трудовом договоре — банк проверит его по ИНН':'',
      orgInn:digits(a.orgInn).length!==10?'У организации ИНН из 10 цифр. Его можно взять из справки или трудового договора':'',
      position:!a.position.trim()?'Укажите должность — банк учитывает её при оценке стабильности дохода':'',
      workPhone:digits(a.workPhone).length<11?'Нужен рабочий номер полностью — банк может позвонить в отдел кадров для подтверждения':'',
      startDate:!/^\d{2}\.\d{2}\.\d{4}$/.test(a.startDate)?'Введите дату в формате дд.мм.гггг — по ней считается стаж на текущем месте':'',...jobRules,eduLevel:a.eduLevel===PICK?'Выберите уровень образования':'',expYears:a.expYears===''?'Укажите общий стаж — можно 0, если клиент только начал работать':'',
      jobs3:a.jobs3===''||+a.jobs3<1?'Укажите хотя бы одно место работы за последние 3 года':'',exp5:a.exp5===PICK?'Выберите стаж за последние 5 лет':''})){markDone('income');go('signing')} };
  return html`<${AnketaPage} step="income" onNext=${next} alert=${firstErrAlert(v.errs,'Не хватает данных о доходе и работе')}>
    <div class="stack"><h1 class="sec">Доход участника</h1><p class="desc">Изменения сразу влияют на расчёт платёжеспособности</p>
      <div class="grid g2">
        <${SelectField} label="Тип занятости" value=${a.empType} items=${['По найму','ИП','Самозанятый','Собственник бизнеса','Пенсионер']} onPick=${x=>set('empType',x)}/>
        <${SelectField} label="Вид трудового договора" value=${a.contract} items=${['Бессрочный трудовой договор','Срочный трудовой договор','ГПХ']} onPick=${x=>set('contract',x)}/>
        <${SelectField} label="Тип подтверждения дохода" value=${a.proof} items=${['Госуслуги / СФР','2-НДФЛ','Справка по форме банка','Без подтверждения']} onPick=${x=>set('proof',x)}/>
        <${Field} id="i-inc" label="Основной доход, ₽ / мес" value=${a.income?(+digits(a.income)).toLocaleString('ru-RU'):''} placeholder="0" suffix="₽" inputMode="numeric" mask="money" helper="Сумма после вычета налогов" error=${v.errs.income} onChange=${x=>set('income',digits(x))}/>
        <${SelectField} label="Зарплатный банк" value=${a.salaryBank} items=${['Не выбран',...BANKS.slice(0,10).map(b=>b[0])]} onPick=${x=>set('salaryBank',x)}/>
        <${SelectField} label="Дополнительный доход" value=${a.extraIncome} items=${['Нет','Аренда','Совместительство','Пенсия']} onPick=${x=>set('extraIncome',x)}/>
      </div>
      ${a.proof==='Госуслуги / СФР'?html`<${Alert} title="Справка о доходах не требуется">Для выбранного способа подтверждения достаточно выписки с Госуслуг<//>`
        :html`<${Alert} title="Понадобится справка о доходах">Загрузите её на шаге подписания вместе с остальными документами<//>`}</div>
    <div class="stack"><h1 class="sec">Место работы</h1>
      <div class="inset-white"><h3>Основное место работы</h3>
        <div class="grid g2">
          <${Field} id="w-org" label="Организация" value=${a.org} placeholder="Название организации" mask="text" helper=${a.orgAuto==='org'?'Подставили по ИНН':'Как в трудовом договоре'} error=${v.errs.org} onChange=${x=>{set('org',x);const m=orgByName(x);if(m&&digits(a.orgInn||'')!==m[1]){set('orgInn',m[1]);set('orgAuto','inn')}else if(!m&&a.orgAuto==='inn'){set('orgAuto','')}}}/>
          <${Field} id="w-inn" label="ИНН организации" value=${a.orgInn} placeholder="0000000000" inputMode="numeric" mask="inn10" helper=${a.orgAuto==='inn'?'Подставили по названию организации':'10 цифр'} error=${v.errs.orgInn} onChange=${x=>{set('orgInn',x);const m=orgByInn(x);if(m&&a.org!==m[0]){set('org',m[0]);set('orgAuto','org')}else if(!m&&a.orgAuto==='org'){set('orgAuto','')}}}/>
          <${Field} id="w-pos" label="Должность" value=${a.position} placeholder="Например, менеджер" mask="name" helper="Как в трудовом договоре" error=${v.errs.position} onChange=${x=>set('position',x)}/>
          <${Field} id="w-ph" label="Рабочий телефон" value=${a.workPhone} placeholder="+7 (000) 000-00-00" inputMode="tel" mask="phone" helper="Отдел кадров или бухгалтерия" error=${v.errs.workPhone} onChange=${x=>set('workPhone',x)}/>
          <${Field} id="w-start" label="Дата начала работы" value=${a.startDate} placeholder="дд.мм.гггг" inputMode="numeric" mask="date" helper="На текущем месте" error=${v.errs.startDate} onChange=${x=>set('startDate',x)}/>
        </div></div>
      ${jobs.map((x,i)=>html`<div class="inset-white" key=${'job'+i}>
        <div class="row" style=${{justifyContent:'space-between'}}><h3>Дополнительное место работы${jobs.length>1?' '+(i+1):''}</h3>
          <button class="part-x" aria-label="Убрать место работы" onClick=${()=>delJ(i)}>${ic.x(16)}</button></div>
        <div class="grid g2">
          <${SelectField} label="Тип работы" value=${x.kind} items=${['Совместительство','ГПХ','Самозанятость','ИП']} onPick=${val=>updJ(i,'kind',val)}/>
          <${Field} id=${'j-inc'+i} label="Доход на этом месте, ₽ / мес" value=${x.income?(+digits(x.income)).toLocaleString('ru-RU'):''} placeholder="0" suffix="₽" inputMode="numeric" mask="money" helper="После вычета налогов" error=${v.errs['jincome'+i]} onChange=${val=>updJ(i,'income',digits(val))}/>
          <${Field} id=${'j-org'+i} label="Организация" value=${x.org} placeholder="Название организации" mask="text" helper="Как в договоре" error=${v.errs['jorg'+i]} onChange=${val=>updJ(i,'org',val)}/>
          <${Field} id=${'j-inn'+i} label="ИНН организации" value=${x.inn} placeholder="0000000000" inputMode="numeric" mask="inn10" helper="10 цифр" error=${v.errs['jinn'+i]} onChange=${val=>updJ(i,'inn',val)}/>
          <${Field} id=${'j-pos'+i} label="Должность или вид работ" value=${x.pos} placeholder="Например, консультант" mask="text" helper="Как в договоре" error=${v.errs['jpos'+i]} onChange=${val=>updJ(i,'pos',val)}/>
          <${Field} id=${'j-start'+i} label="Дата начала работы" value=${x.start} placeholder="дд.мм.гггг" inputMode="numeric" mask="date" helper="На этом месте" error=${v.errs['jstart'+i]} onChange=${val=>updJ(i,'start',val)}/>
        </div></div>`)}
      ${jobs.length<3&&html`<div><button class="btn outline" onClick=${addJ}>${ic.plus(16)} Добавить дополнительное место работы</button></div>`}</div>
    <div class="stack"><h1 class="sec">Образование и стаж</h1><p class="desc">Банки учитывают их при оценке стабильности дохода</p>
      <div class="grid g2">
        <${SelectField} label="Образование" value=${a.eduLevel} items=${EDU_LEVELS} error=${v.errs.eduLevel} onPick=${x=>set('eduLevel',x)}/>
        <${StepperField} id="e-exp" label="Общий трудовой стаж, лет" value=${a.expYears} error=${v.errs.expYears} onChange=${x=>set('expYears',x)}/>
        <${StepperField} id="e-jobs3" label="Мест работы за 3 года" value=${a.jobs3} min=${1} max=${20} error=${v.errs.jobs3} onChange=${x=>set('jobs3',x)}/>
        <${SelectField} label="Стаж за последние 5 лет" value=${a.exp5} items=${EXP5} error=${v.errs.exp5} onPick=${x=>set('exp5',x)}/>
      </div></div><//>`;
}
/* ---------- 1.4 ---------- */
const ymText=m=>{const y=Math.floor(m/12),r=m%12;return [y&&y+' '+plural(y,'год','года','лет'),r&&r+' '+plural(r,'месяц','месяца','месяцев')].filter(Boolean).join(' ')||'меньше месяца'};
/* стаж на текущем месте — из даты начала работы на шаге «Доход и работа» */
const tenureMonths=d=>{const m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(d||'');if(!m)return null;const s=new Date(+m[3],+m[2]-1,+m[1]),n=new Date();
  let t=(n.getFullYear()-s.getFullYear())*12+n.getMonth()-s.getMonth();if(n.getDate()<s.getDate())t--;return t<0?null:t};
const EDU_LEVELS=['Среднее','Среднее специальное','Неоконченное высшее','Высшее','Учёная степень'];
const EDU_EMPTY={level:'Выберите',year:'',place:'',spec:''};
const eduText=x=>`${x.level}${x.year?', '+x.year:''}${x.place?' · '+x.place:''}`;
function Education(){
  const {a,setA,markDone}=useApp(); const v=useValidation();
  const edus=a.edus;
  const upd=(i,k,val)=>{setA(o=>({...o,edus:o.edus.map((x,j)=>j===i?{...x,[k]:val}:x)}));v.clear(k+i)};
  const add=()=>setA(o=>({...o,edus:[...o.edus,{...EDU_EMPTY}]}));
  const del=i=>{setA(o=>({...o,edus:o.edus.filter((_,j)=>j!==i)}));v.setErrs({})};
  const nowY=new Date().getFullYear(), birthY=+(a.birthDate||'').slice(6)||0;
  const next=()=>{ const rules={};
    edus.forEach((x,i)=>{const picked=x.level!=='Выберите',school=x.level==='Среднее',unf=x.level==='Неоконченное высшее',y=+x.year;
      rules['level'+i]=!picked?(i?'Выберите уровень или уберите это образование':'Выберите уровень образования — это один из параметров скоринга банка'):'';
      rules['place'+i]=picked&&!school&&!x.place.trim()?'Укажите учебное заведение — как в дипломе':'';
      rules['year'+i]=!picked?'':x.year.length!==4?(unf?'Укажите ожидаемый год окончания — 4 цифры':'Укажите год окончания — 4 цифры, например 2008'):
        (unf?(y<nowY||y>nowY+6?`Ожидаемый год окончания — с ${nowY} по ${nowY+6}.`:''):
        (y>nowY?'Год окончания не может быть в будущем. Если ещё учитесь — выберите «Неоконченное высшее»':(birthY&&y<birthY+14?`Год окончания не может быть раньше ${birthY+14} — заёмщику тогда было меньше 14 лет`:(y<1950?'Проверьте год окончания':''))));
    });
    if(v.run(rules)){markDone('education');go('signing')} };
  const block=(x,i)=>{const picked=x.level!=='Выберите',school=x.level==='Среднее',unf=x.level==='Неоконченное высшее';
    return html`<div class="inset-white" key=${i}>
      <div class="row" style=${{justifyContent:'space-between'}}><h3>${i?'Дополнительное образование':'Основное образование'}</h3>
        ${i>0&&html`<button class="part-x" aria-label="Убрать образование" onClick=${()=>del(i)}>${ic.x(16)}</button>`}</div>
      <div class="grid g2">
        <${SelectField} label="Уровень образования" value=${x.level} items=${EDU_LEVELS} onPick=${val=>upd(i,'level',val)} error=${v.errs['level'+i]}/>
        ${picked&&html`<${Field} id=${'e-year'+i} label=${unf?'Ожидаемый год окончания':school?'Год окончания школы':'Год окончания'} value=${x.year} placeholder="гггг" inputMode="numeric" mask="year" helper=${unf?'Если ещё учитесь':'Как в дипломе или аттестате'} error=${v.errs['year'+i]} onChange=${val=>upd(i,'year',val)}/>`}
      </div>
      ${picked&&!school&&html`<div class="grid g2">
        <${Field} id=${'e-place'+i} label="Учебное заведение" value=${x.place} placeholder="Например, ТвГУ" mask="text" helper="Как в дипломе" error=${v.errs['place'+i]} onChange=${val=>upd(i,'place',val)}/>
        <${Field} id=${'e-spec'+i} label="Специальность" value=${x.spec} placeholder="Например, экономист" mask="text" helper="Необязательно" onChange=${val=>upd(i,'spec',val)}/>
      </div>`}</div>`};
  return html`<${AnketaPage} step="education" onNext=${next} alert=${firstErrAlert(v.errs,'Заполните образование')}>
    <div class="stack"><h1 class="sec">Образование</h1><p class="desc">Уровень образования учитывается в скоринге банка. Если дипломов несколько — добавьте каждый</p>
      ${edus.map(block)}
      ${edus.length<4&&html`<div><button class="btn outline" onClick=${add}>${ic.plus(16)} Добавить образование</button></div>`}
    </div><//>`;
}
/* ---------- 1.5 Подписание ---------- */
function SignaturePad({onDraw,clearKey,error}){
  const ref=useRef(); const drawing=useRef(false); const [has,setHas]=useState(false);
  useEffect(()=>{const c=ref.current;const r=c.getBoundingClientRect();c.width=r.width*2;c.height=r.height*2;const x=c.getContext('2d');x.scale(2,2);x.lineWidth=2.2;x.lineCap='round';x.strokeStyle='#0c2ad0';setHas(false);onDraw(false)},[clearKey]);
  const pos=e=>{const r=ref.current.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  const down=e=>{drawing.current=true;ref.current.setPointerCapture(e.pointerId);const x=ref.current.getContext('2d');x.beginPath();x.moveTo(...pos(e))};
  const move=e=>{if(!drawing.current)return;const x=ref.current.getContext('2d');x.lineTo(...pos(e));x.stroke();if(!has){setHas(true);onDraw(true)}};
  return html`<div class=${'pad'+(error?' err':'')}><canvas ref=${ref} onPointerDown=${down} onPointerMove=${move} onPointerUp=${()=>drawing.current=false} aria-label="Поле для подписи"></canvas>
    ${!has&&html`<div class="ph">${ic.pen(22)}Нарисуйте подпись мышью или пальцем</div>`}</div>`;
}
function SberSend({onSend}){
  const app=useApp(); const {files,a,f,calc}=app;
  const docs=[...files.passport,...files.snils];
  const summary=[['personal','Персональные данные',`${a.fio||'—'} · ${a.birthDate||'—'} · паспорт ${a.passNum||'—'}`],
    ['personal','Доход и работа',`${a.income?rub(+digits(a.income)):'—'} в месяц · ${a.monthsHere||0} ${plural(+a.monthsHere||0,'месяц','месяца','месяцев')} на текущем месте`],
    ['podbor','Условия',`${f.program} · ${rub(calc.loan)} · ${years(calc.termOf('Сбербанк'))}`]];
  const side=html`<section class="side-card"><span class="icon-tile blue">${ic.send(20)}</span><div><h4>Отправка без подписания</h4><p class="desc" style=${{fontSize:'13px'}}>Для заявки в Сбербанк подписание анкеты не нужно — после отправки заявка сразу уходит в банк</p></div>
    <div class="row" style=${{justifyContent:'space-between'}}><span>Сбербанк</span><${Badge} tone="accent">Готово к отправке<//></div></section>`;
  return html`<${AnketaPage} step="signing" onNext=${onSend} primary="Отправить в Сбербанк" extraSide=${side}>
    <div class="stack"><h1 class="sec">Проверьте данные заявки</h1><p class="desc">Короткая анкета для Сбербанка. Если что-то не так — вернитесь к нужному шагу</p>
      <div class="sum">${summary.map(([k,t,d])=>html`<div class="sum-row" key=${t}><span class=${'tick'+(app.done[k]?'':' no')}>${app.done[k]?ic.check(14):'!'}</span><div class="tx"><b>${t}</b><small>${d}</small></div><a class="link" href=${'#'+k} onClick=${e=>{e.preventDefault();go(k)}}>Изменить</a></div>`)}</div></div>
    ${docs.length>0&&html`<div class="stack"><h1 class="sec">Документы</h1><div class="grid g2">${docs.map(d=>html`<${FileItem} f=${d}/>`)}</div></div>`}
  <//>`;
}
function Signing(){
  const app=useApp(); const {sign,setSign,files,a,f,calc,selected,say,markDone}=app;
  const [needSign,setNeedSign]=useState(false); const v=useValidation();
  const [clearKey,setClearKey]=useState(0);
  const banks=[...selected].length?[...selected]:['Абсолют Банк','Уралсиб'];
  useEffect(()=>{if(sign.status==='signed')setNeedSign(false)},[sign.status]);
  const setS=p=>setSign(o=>({...o,...p}));
  const sendSms=()=>{setS({status:'sent'});say('Ссылка отправлена на +7 (900) 123-45-67');setTimeout(()=>{setSign(o=>o.status==='sent'?{...o,status:'signed'}:o)},2500)};
  const confirmPaper=()=>{if(v.run({paper:!sign.paperFiles.length?'Загрузите сканы подписанных анкеты и согласия — без них банк не примет заявку':''})){setS({status:'signed'});say('Комплект подтверждён')}};
  const signScreen=()=>{if(v.run({agree:!sign.agree?'Отметьте, что клиент ознакомился с документами — это обязательное условие банка':'',drawn:!sign.drawn?'Нужна подпись клиента в поле ниже':''})){setS({status:'signed'});say('Документы подписаны')}};
  const toBanks=()=>{if(!app.sber&&sign.status!=='signed'){setNeedSign(true);return}if(app.sent.length&&banks.every(n=>app.sent.some(x=>x.name===n))){say('Во все выбранные банки заявка уже отправлена — отметьте новый банк на шаге подбора');return}markDone('signing');app.sendToBanks(banks);if(app.sber)say('Заявка отправлена в Сбербанк');go('status')};
  if(app.sber)return html`<${SberSend} onSend=${toBanks}/>`;
  const docs=[...files.passport,...files.snils,{name:'Выписка СФР о доходах.pdf',size:'0,9 МБ'},{name:'Трудовая книжка.pdf',size:'1,2 МБ'}];
  const statusBadge=sign.status==='signed'?html`<${Badge} tone="success">Подписано<//>`:sign.status==='sent'?html`<${Badge} tone="accent">Ссылка отправлена<//>`:html`<span class="badge" style=${{background:'var(--color-warning-bg)',color:'var(--color-warning-text)'}}><span class="dot"></span>Не подписано</span>`;
  const summary=[['personal','Персональные данные',`${a.fio||'—'} · ${a.birthDate||'—'} · паспорт ${a.passNum||'—'}`],['family','Семейное положение',`${a.marital} · детей: ${a.kids.toLowerCase()} · ${a.spouseCo?'супруг — созаёмщик':'супруг не созаёмщик'}`],['income','Доход и работа',`${a.empType} · ${a.income?rub(+a.income)+' / мес':'доход не указан'} · ${a.org||'место работы не указано'}${a.jobs&&a.jobs.length?' + '+a.jobs.length+' доп.':''}`],['income','Образование и стаж',a.eduLevel===PICK?'Не заполнено':`${a.eduLevel} · стаж ${a.expYears||0} ${plural(+a.expYears||0,'год','года','лет')} · мест работы за 3 года: ${a.jobs3||0}`]];
  const pkg=html`<section class="side-card"><span class="icon-tile blue">${ic.shield(20)}</span><div><h4>Пакет к отправке</h4><p class="desc" style=${{fontSize:'13px'}}>Каждый участник подписывает свою анкету и согласие</p></div>
    <div class="row" style=${{flexWrap:'nowrap'}}><span style=${{color:'var(--color-text-secondary)'}}>${ic.file(20)}</span><div style=${{flex:1}}><b style=${{fontSize:'14px'}}>${a.fio||'Заёмщик'}</b><div class="desc" style=${{fontSize:'12px'}}>Анкета и согласие · ${sign.status==='signed'?'подписаны':'ожидают подпись'}</div></div><span style=${{color:sign.status==='signed'?'var(--color-success)':'var(--color-text-secondary)'}}>${sign.status==='signed'?ic.badgeCheck(18):ic.clock(18)}</span></div>
    <b style=${{marginTop:'8px'}}>Банки-получатели</b>${banks.map(b=>html`<div class="row" style=${{justifyContent:'space-between'}}><span>${b}</span><${Badge} tone=${sign.status==='signed'?'success':'neutral'}>${sign.status==='signed'?'Готово':'Ждёт подписи'}<//></div>`)}</section>`;
  return html`<${AnketaPage} step="signing" onNext=${toBanks} primary="Отправить в банки" extraSide=${pkg}
      alert=${needSign&&html`<${Alert} type="warning" title="Документы ещё не подписаны">Выберите способ подписания для участника и завершите его — после этого пакет уйдёт в ${banks.length} ${plural(banks.length,'банк','банка','банков')}.<//>`}>
    <div class="stack"><h1 class="sec">Проверьте данные заявки</h1><p class="desc">Краткая сводка по шагам анкеты. Если что-то не так — вернитесь к нужному разделу</p>
      <div class="sum">${summary.map(([k,t,d])=>html`<div class="sum-row" key=${t}><span class=${'tick'+(app.done[k]?'':' no')}>${app.done[k]?ic.check(14):'!'}</span><div class="tx"><b>${t}</b><small>${d}</small></div><a class="link" href=${'#'+k}>Изменить</a></div>`)}</div></div>
    <div class="stack"><h1 class="sec">Документы</h1><div class="grid g2">${docs.map(d=>html`<${FileItem} f=${d}/>`)}</div></div>
    <div class="stack"><h1 class="sec">Способ подписания</h1><p class="desc">Каждый участник выбирает удобный способ подписания анкеты и согласия</p>
      <div class="participant">
        <div class="p-head"><span class="avatar">ИИ</span><div class="tx"><h3>${a.fio||'Заёмщик'}</h3><small>Заёмщик · анкета и согласие</small></div>${statusBadge}</div>
        ${sign.status==='signed'?html`<div class="hero-blue ok"><span class="icon-tile">${ic.badgeCheck(24)}</span><h3>Документы подписаны</h3><p>Анкета и согласие готовы к отправке. Нажмите «Отправить в банки»</p>
            <button class="link" onClick=${()=>{setS({status:'none',agree:false,drawn:false,paperFiles:[]});setClearKey(k=>k+1)}}>Подписать заново</button></div>`
        :html`<div class="segtabs" role="tablist">${[['phone','На телефоне'],['paper','Бумажная версия'],['screen','На экране']].map(([k,n])=>html`<button role="tab" aria-selected=${sign.method===k} class=${sign.method===k?'on':''} onClick=${()=>{setS({method:k});v.setErrs({})}}>${n}</button>`)}</div>
        ${sign.method==='phone'&&html`<div class="row" style=${{flexWrap:'nowrap',alignItems:'center',gap:'20px'}}><span class="icon-tile blue" style=${{width:'72px',height:'72px',borderRadius:'16px'}}>${ic.phone(28)}</span>
          <div class="stack" style=${{gap:'12px'}}><h3>Отправьте ссылку участнику</h3><p class="desc" style=${{fontSize:'13px'}}>+7 (900) 123-45-67 · отдельная ссылка на анкету и согласие</p>
            <div>${sign.status==='sent'?html`<span class="desc" style=${{fontSize:'13px'}}>${ic.clock(14)} Ждём, пока клиент подпишет по ссылке…</span>`:html`<button class="btn outline" onClick=${sendSms}>${ic.send(16)} Отправить ссылку по СМС</button>`}</div></div></div>`}
        ${sign.method==='paper'&&html`<div class="stack">
          <div class="num-step"><span class="n">1</span><div class="tx"><b>Скачайте и распечатайте документы</b><small>Анкета и согласие для этого участника</small></div><button class="btn outline" onClick=${()=>say('Анкета и согласие скачаны')}>${ic.download(16)} Скачать анкету и согласие</button></div>
          <div class="num-step"><span class="n">2</span><div class="tx"><b>Получите подпись на анкете и согласии</b><small>Проверьте комплект перед загрузкой</small></div></div>
          <${UploadZone} id="up-paper" title="Подписанные документы" limits="PDF, JPEG, PNG до 20 МБ · можно один PDF с обоими документами" multiple error=${v.errs.paper} onFiles=${fs=>{setS({paperFiles:[...sign.paperFiles,...fs.map(fileObj)]});v.clear('paper')}}/>
          ${sign.paperFiles.map((p,i)=>html`<${FileItem} f=${p} onRemove=${()=>setS({paperFiles:sign.paperFiles.filter((_,j)=>j!==i)})}/>`)}
          <div class="row-btns"><button class="btn outline" onClick=${confirmPaper}>${ic.check(16)} Подтвердить комплект</button></div></div>`}
        ${sign.method==='screen'&&html`<div class="stack">
          <div class="doc-box"><div class="row" style=${{justifyContent:'space-between'}}><h3>Анкета и согласие</h3><button class="link" onClick=${()=>say('Полный текст документов — вне прототипа')}>Открыть полностью</button></div>
            <p>Участник ознакомлен с параметрами ипотечной заявки: ${f.program}, ${rub(calc.loan)} на ${years(f.term)}.</p><p>Подписываемые документы: анкета участника и согласие на обработку персональных данных</p></div>
          <div><${Checkbox} showLabel checked=${sign.agree} onChange=${x=>{setS({agree:x});v.clear('agree')}} label="Ознакомлен с документами"/><${FieldError} text=${v.errs.agree}/></div>
          <div><${SignaturePad} clearKey=${clearKey} error=${v.errs.drawn} onDraw=${d=>{setSign(o=>({...o,drawn:d}));if(d)v.clear('drawn')}}/><${FieldError} text=${v.errs.drawn}/></div>
          <div class="row-btns"><button class="btn outline" onClick=${()=>setClearKey(k=>k+1)}>Очистить</button><button class="btn outline" onClick=${()=>{setS({drawn:true});v.clear('drawn');say('Подпись из профиля клиента вставлена')}}>Вставить подпись</button><button class="btn outline" onClick=${signScreen}>${ic.check(16)} Подписать документы</button></div></div>`}`}
      </div></div><//>`;
}
/* ---------- 1.6 Статус ---------- */
/* Параметры, на которых банк одобрил заявку; брокер может поправить их по ответу банка */
function ApprovedParams({b,o,onSave}){
  const {calc,f}=useApp();
  const base=b.appr||{sum:calc.loan,rate:+(o.rate-0.4).toFixed(2),term:calc.termOf(b.name)};
  const [edit,setEdit]=useState(false); const [d,setD]=useState({sum:String(base.sum),rate:String(base.rate).replace('.',','),term:String(base.term)});
  const pay=annuity(base.sum,base.rate,base.term); const until=new Date(Date.now()+90*864e5).toLocaleDateString('ru-RU');
  const save=()=>{const sum=+digits(d.sum),rate=parseFloat(d.rate.replace(',','.')),term=+digits(d.term);if(!sum||!rate||!term)return;onSave({sum,rate,term});setEdit(false)};
  return html`<div class="appr">
    <div class="row" style=${{justifyContent:'space-between'}}><div class="row" style=${{gap:'8px'}}><span class="appr-ic">${ic.badgeCheck(18)}</span><h3>Параметры одобрения</h3></div>
      ${!edit&&html`<button class="btn outline s" onClick=${()=>setEdit(true)}>Изменить</button>`}</div>
    ${edit?html`<div class="grid g3">
        <${Field} id="ap-sum" label="Сумма кредита, ₽" value=${(+digits(d.sum)).toLocaleString('ru-RU')} mask="money" suffix="₽" onChange=${x=>setD({...d,sum:digits(x)})}/>
        <${Field} id="ap-rate" label="Ставка, %" value=${d.rate} inputMode="decimal" onChange=${x=>setD({...d,rate:x.replace(/[^\d,.]/g,'').slice(0,5)})}/>
        <${Field} id="ap-term" label="Срок, лет" value=${d.term} mask="years" onChange=${x=>setD({...d,term:x})}/></div>
      <div class="row-btns"><button class="btn outline s" onClick=${()=>setEdit(false)}>Отмена</button><button class="btn primary s" onClick=${save}>Сохранить</button></div>`
    :html`<div class="appr-grid num">
        <div><span>Сумма кредита</span><b>${rub(base.sum)}</b></div><div><span>Ставка</span><b class="ok">${pct(base.rate)}</b></div>
        <div><span>Срок</span><b>${years(base.term)}</b></div><div><span>Платёж в месяц</span><b>${rub(pay)}</b></div>
        <div><span>Первый взнос</span><b>${rub(f.down)}</b></div><div><span>Решение действует до</span><b>${until}</b></div></div>
      <p class="desc" style=${{fontSize:'12px',margin:0}}>Направляли: ${pct(o.rate)} · ${rub(calc.loan)} · ${years(calc.termOf(b.name))}${b.appr?' · параметры изменены вручную':''}</p>`}
  </div>`;
}
function Status(){
  const {sent,setSent,calc,f,say,setSelected}=useApp();
  const list=sent.length?sent:[{name:'Абсолют Банк',status:'sent'},{name:'Уралсиб',status:'sent'}];
  const [cur,setCur]=useState(list[0].name); const [openMail,setOpenMail]=useState(true); const [ans,setAns]=useState(false);
  const [exp,setExp]=useState(null); const [compose,setCompose]=useState(false); const [mails,setMails]=useState({}); const [draft,setDraft]=useState('');
  const [updated,setUpdated]=useState('сегодня в '+new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}));
  const offer=n=>calc.offers.find(o=>o.name===n)||calc.offers[0];
  const b=list.find(x=>x.name===cur)||list[0]; const o=offer(b.name); const ini=(BANKS.find(x=>x[0]===b.name)||['','??'])[1];
  const refresh=()=>{const idx=list.findIndex(x=>x.status==='sent');setUpdated('только что');
    if(idx<0){say('Новых решений пока нет');return}
    const nl=list.map((x,i)=>i===idx?{...x,status:'approved'}:x);setSent(nl);say(nl[idx].name+': заявка одобрена')};
  const saveAppr=v=>{setSent(list.map(x=>x.name===b.name?{...x,appr:v}:x));say('Параметры одобрения сохранены')};
  const badge=s=>s==='approved'?html`<${Badge} tone="success">Одобрено<//>`:html`<${Badge} tone="accent">Отправлено<//>`;
  const files=['Анкета и согласие.pdf','Паспорт.pdf','СНИЛС.pdf','Справка о доходах.pdf','Свидетельство.pdf'];
  const myMails=mails[b.name]||[];
  const sendMail=()=>{if(!draft.trim()){say('Напишите текст письма');return}const t=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
    setMails(m=>({...m,[b.name]:[...(m[b.name]||[]),{text:draft.trim(),t}]}));setDraft('');setCompose(false);say('Письмо отправлено в '+b.name)};
  const bankRows=x=>{const ox=offer(x.name),ap=x.appr||(x.status==='approved'?{sum:calc.loan,rate:+(ox.rate-0.4).toFixed(2),term:calc.termOf(x.name)}:null);
    const r=ap?{sum:ap.sum,rate:ap.rate,term:ap.term}:{sum:calc.loan,rate:ox.rate,term:calc.termOf(x.name)};
    return [['Ставка',pct(r.rate)],['Платёж в месяц',rub(annuity(r.sum,r.rate,r.term))],['Сумма кредита',rub(r.sum)],['Срок',years(r.term)],['Первый взнос',rub(f.down)],['Программа',f.program]]};
  const toOther=()=>{setSelected(o=>{const x=new Set(o);list.forEach(q=>x.add(q.name));return x});go('podbor')};
  return html`<${AppHeader}/><main class="wrap">
    <div class="layout">
      <section class="card pad32 stack-24">
        <div class="p-head"><span class="avatar">${ini}</span><div class="tx"><h2>${b.name}</h2><small>Заявка № 036968-58791 · отправлена ${fmtAt(b.at)}</small></div>${badge(b.status)}</div>
        ${b.status==='approved'
          ?html`<${ApprovedParams} key=${b.name} b=${b} o=${o} onSave=${saveAppr}/>`
          :html`<div class="cond num"><div><span>Ставка</span><b class="acc">${pct(o.rate)}*</b></div><div><span>Платёж в месяц</span><b>${rub(calc.payOf(o))}</b></div><div><span>Сумма кредита</span><b>${rub(calc.loan)}</b></div><div><span>Срок</span><b>${years(calc.termOf(b.name))}</b></div></div>
            <p class="desc" style=${{fontSize:'12px',marginTop:'-12px'}}>* Направлено по анкете. Окончательные условия подтверждает банк</p>
            <div class="hero-blue"><span class="icon-tile">${ic.clock(24)}</span><h3>Ожидаем решение банка</h3><p>Направленные параметры сохранены. Сумма, ставка и платёж по решению появятся после ответа банка — обычно в течение 1–3 рабочих дней</p></div>`}
        <div class="stack"><div class="row" style=${{justifyContent:'space-between'}}><div class="row" style=${{gap:'8px'}}><span style=${{color:'var(--color-action-primary)'}}>${ic.msg(20)}</span><h3>Переписка с банком</h3></div>
            ${!compose&&html`<button class="link" style=${{display:'inline-flex',alignItems:'center',gap:'6px'}} onClick=${()=>setCompose(true)}>${ic.msg(16)} Написать письмо</button>`}</div>
          ${compose&&html`<div class="compose">
            <p class="desc" style=${{fontSize:'13px',margin:0}}><b style=${{color:'var(--color-text-primary)'}}>Кому:</b> ${b.name} · mortgage@example.com<br/><b style=${{color:'var(--color-text-primary)'}}>Тема:</b> Re: Новая заявка на ипотеку № 036968-58791</p>
            <label class="field ta" for="mail-text"><span class="lab">Текст письма</span><textarea id="mail-text" rows="4" placeholder="Например: направляем дополнительные документы по заявке" value=${draft} onInput=${e=>setDraft(e.target.value)}></textarea></label>
            <div class="row-btns"><button class="btn outline s" onClick=${()=>{setCompose(false);setDraft('')}}>Отмена</button><button class="btn primary s" onClick=${sendMail}>${ic.send(16)} Отправить</button></div></div>`}
          ${myMails.slice().reverse().map(m=>html`<div class="mail"><div class="row" style=${{flexWrap:'nowrap'}}><span class="icon-tile">${ic.send(18)}</span><div style=${{flex:1}}><b style=${{fontSize:'14px'}}>Письмо в банк</b><div class="desc" style=${{fontSize:'12px'}}>Дмитрий Сорокин</div></div><span class="desc" style=${{fontSize:'12px'}}>${m.t}</span></div>
            <div class="mail-body"><p style=${{whiteSpace:'pre-wrap'}}>${m.text}</p></div></div>`)}
          <div class="mail"><button class="row" style=${{flexWrap:'nowrap',width:'100%',textAlign:'left'}} onClick=${()=>setOpenMail(!openMail)} aria-expanded=${openMail}>
              <span class="icon-tile">${ic.send(18)}</span><div style=${{flex:1}}><b style=${{fontSize:'14px'}}>Письмо с заявкой</b><div class="desc" style=${{fontSize:'12px'}}>Исходный пакет и направленные условия</div></div><span class="desc" style=${{fontSize:'12px'}}>${fmtAt(b.at).split(', ')[1]}</span><span class=${'cp-chev'+(openMail?' up':'')}>${ic.chev(18)}</span></button>
            ${openMail&&html`<div class="mail-body"><p><b>Получатели:</b> mortgage@example.com</p><p><b>Тема:</b> Новая заявка на ипотеку № 036968-58791</p>
              <${Alert} type="warning" title="Не меняйте тему письма и отвечайте через «Ответить всем»">Так ответ банка не потеряется и мы быстрее его обработаем<//>
              <p>Добрый день! Просим рассмотреть новую заявку на ипотеку № 036968-58791 и отправить результат рассмотрения ответным письмом. Документы по заявке во вложении</p>
              <p class="desc">С уважением, ООО «Сделка.РФ», Дмитрий Сорокин, +7 900 000-00-00</p></div>
              <b style=${{fontSize:'13px'}}>Вложения · ${files.length}</b><div class="grid g2">${files.map(n=>html`<${FileItem} f=${{name:n}} owner="Иванов Иван Иванович"/>`)}</div>`}</div>
          <button class="collapse" onClick=${()=>setAns(!ans)} aria-expanded=${ans}><b>Ответ банка</b>${b.status==='approved'?html`<${Badge} tone="success">Получен<//>`:html`<span class="badge" style=${{background:'var(--color-warning-bg)',color:'var(--color-warning-text)'}}><span class="dot"></span>Ожидаем</span>`}</button>
          ${ans&&html`<div class="mail-body">${b.status==='approved'?html`<p>Заявка одобрена. Ставка ${pct(o.rate-0.4)}, сумма ${rub(calc.loan)}, срок ${years(calc.termOf(b.name))}. Решение действует 90 дней</p>`:html`<p class="desc">Ответа пока нет. Нажмите «Обновить статусы», чтобы проверить</p>`}</div>`}
        </div></section>
      <aside class="side">
        <div class="row" style=${{justifyContent:'space-between',flexWrap:'nowrap'}}><span class="desc" style=${{fontSize:'12px'}}>Статусы обновлены<br/>${updated}</span><button class="btn outline s" onClick=${refresh}>${ic.refresh(16)} Обновить статусы</button></div>
        ${list.map(x=>{const ox=offer(x.name),open=exp===x.name;return html`<div class=${'bank-pick'+(x.name===cur?' on':'')} key=${x.name}>
          <button class="bp-main" onClick=${()=>setCur(x.name)} aria-pressed=${x.name===cur}>
            <div class="hd"><span class="avatar">${(BANKS.find(q=>q[0]===x.name)||['','??'])[1]}</span><b>${x.name}</b>${badge(x.status)}</div>
            <small>Отправлено ${fmtAt(x.at)}</small></button>
          <button class="bp-toggle" onClick=${()=>setExp(open?null:x.name)} aria-expanded=${open}><span>Параметры кредита</span><span class=${'cp-chev'+(open?' up':'')}>${ic.chev(16)}</span></button>
          ${open&&html`<dl class="cp-rows bp-rows num">${bankRows(x).map(([t,v])=>html`<dt>${t}</dt><dd>${v}</dd>`)}</dl>`}
        </div>`})}
        <button class="btn outline full" onClick=${toOther}>${ic.plus(16)} Отправить в другой банк</button>
      </aside></div></main>
    <${BottomBar} left=${`Заявка № 036968-58791 · отправлена в ${list.length} ${plural(list.length,'банк','банка','банков')}`} primary="Новый подбор" onPrimary=${()=>go('')}/>`;
}
/* ---------- client upload ---------- */
function Client(){
  const {say}=useApp();
  const [docs,setDocs]=useState({passport:[],snils:[]}); const [co,setCo]=useState(false); const [sent,setSentC]=useState(false); const [later,setLater]=useState(false); const v=useValidation();
  const count=(docs.passport.length?1:0)+(docs.snils.length?1:0);
  const submit=()=>{if(v.run({any:!count?'Добавьте хотя бы один документ — паспорт или СНИЛС. Остальное можно дослать позже по этой же ссылке':''})){setSentC(true)}};
  const add=k=>fs=>{setDocs(o=>({...o,[k]:[...o[k],...fs.map(fileObj)]}));v.clear('any')};
  return html`<header class="client-head"><div class="wrap" style=${{maxWidth:'824px'}}><span class="logo">сделка.рф</span><span class="vdiv"></span><span class="desc" style=${{flex:1}}>Заявка на ипотеку</span><a class="link" href="#" onClick=${e=>{e.preventDefault();say('Помощь — вне прототипа')}}>Помощь</a></div></header>
  <main class="client-wrap">
    <section class="c-hero"><div class="tx"><div><${Badge} tone="accent">Заявка № 69670348<//></div><h1>${sent?'Документы отправлены брокеру':later?'Хорошо, загрузите документы позже':'Загрузите документы для ипотечной анкеты'}</h1>
      <p class="desc">${sent?'Дмитрий Сорокин проверит их и свяжется с вами. Если чего-то не хватит, мы пришлём новую ссылку':later?'Ссылка из письма действует 14 дней. Брокер получил уведомление, что документы будут позже':'Ваш брокер подготовил предложение по стандартной ипотеке. Осталось загрузить документы — это займёт пару минут'}</p></div>
      <svg class="ill" width="200" height="160" viewBox="0 0 220 176" fill="none" aria-hidden="true"><circle cx="112" cy="90" r="78" fill="#fff" fill-opacity=".7"/><rect x="44" y="40" width="96" height="120" rx="12" transform="rotate(-8 44 40)" fill="#fff" stroke="#c3d3f7" stroke-width="2"/><rect x="72" y="30" width="96" height="120" rx="12" fill="#fff" stroke="#c3d3f7" stroke-width="2"/><rect x="88" y="50" width="40" height="8" rx="4" fill="#0c2ad0"/><rect x="88" y="68" width="64" height="6" rx="3" fill="#d6e4f5"/><rect x="88" y="82" width="56" height="6" rx="3" fill="#d6e4f5"/><rect x="88" y="96" width="62" height="6" rx="3" fill="#d6e4f5"/><circle cx="168" cy="132" r="26" fill=${sent?'#26795d':'#0c2ad0'}/>${sent?html`<path d="M157 132l8 8 15-16" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`:html`<path d="M168 144v-22M159 130l9-9 9 9" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`}</svg></section>
    ${!sent&&!later&&html`<section class="card stack">
      <div class="row" style=${{justifyContent:'space-between'}}><div><h2>Документы</h2><p class="desc" style=${{fontSize:'13px'}}>Можно отправить часть сейчас и дополнить позднее</p></div><b class="desc num">${count} из 2</b></div>
      <div class="progress"><i style=${{width:(count/2*100)+'%'}}></i></div>
      <div class="grid g2"><div class="stack" style=${{gap:'12px'}}><${UploadZone} id="c-pass" title="Паспорт РФ" error=${!!v.errs.any} onFiles=${add('passport')}/>${docs.passport.map((f,i)=>html`<${FileItem} f=${f} onRemove=${()=>setDocs(o=>({...o,passport:o.passport.filter((_,j)=>j!==i)}))}/>`)}</div>
        <div class="stack" style=${{gap:'12px'}}><${UploadZone} id="c-snils" title="СНИЛС" error=${!!v.errs.any} onFiles=${add('snils')}/>${docs.snils.map((f,i)=>html`<${FileItem} f=${f} onRemove=${()=>setDocs(o=>({...o,snils:o.snils.filter((_,j)=>j!==i)}))}/>`)}</div></div>
      <${Switch} checked=${co} onChange=${setCo} label="Будет участвовать созаёмщик"/>
      ${co&&html`<${Alert} title="Ссылка для созаёмщика">После отправки мы пришлём отдельную ссылку, чтобы созаёмщик загрузил свои документы<//>`}
</section>`}
    <section class="card"><div class="row" style=${{flexWrap:'nowrap'}}><span class="avatar">ДС</span><div style=${{flex:1}}><b>Дмитрий Сорокин</b><div class="desc" style=${{fontSize:'13px'}}>Ваш ипотечный брокер · ООО «Сделка.РФ»</div></div><b class="num" style=${{color:'var(--color-action-primary)',userSelect:'all'}}>+7 900 000-00-00</b></div></section>
    <p class="secure">${ic.shield(16)} Документы передаются по защищённому соединению и доступны только вашему брокеру</p>
    <p class="secure"><a class="link" href="#status">← Вернуться в кабинет брокера</a></p>
  </main>
  ${sent||later?html`<${BottomBar} narrow left=${sent?'Документы у брокера':'Ссылка действует 14 дней'} primary="Загрузить ещё документы" onPrimary=${()=>{setSentC(false);setLater(false)}}/>`
    :html`<${BottomBar} narrow alert=${v.errs.any&&html`<${Alert} type="warning" title="Пока нечего отправлять">${v.errs.any}<//>`} left=${`Загружено ${count} из 2`} secondary="Передам документы позже" onSecondary=${()=>setLater(true)} primary="Отправить документы" onPrimary=${submit}/>`}`;
}

/* ---------- root ---------- */
function Root(){
  const route=useRoute();
  const [f,setF]=useState(DEFAULT_FILTERS);
  const [selected,setSelected]=useState(new Set());
  const [client,setClient]=useState({name:'',phone:'',email:''});
  const [a,setA]=useState(DEFAULT_ANKETA);
  const [files,setFiles]=useState({passport:[],snils:[]});
  const [co,setCo]=useState([]);
  const [sign,setSign]=useState({method:'phone',status:'none',paperFiles:[],agree:false,drawn:false});
  const [done,setDone]=useState({});
  const [sent,setSent]=useState([]);
  const [toast,setToast]=useState('');
  const [prescore,setPrescore]=useState(null); const [psOpen,setPsOpen]=useState(false);
  const [termBy,setTermBy]=useState({});
  const dealId=useMemo(()=>Math.max(...DEALS0.map(d=>d.id))+1,[]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(t)},[toast]);
  const prog=PROGRAMS.find(p=>p.n===f.program);
  const loan=Math.max(0,f.price-f.down-(f.certOn?f.certAmount:0));
  const cut=f.subsidyOn&&f.domrf?f.domrf.cut:0;
  const offers=useMemo(()=>BANKS.map(([name,ini,d],i)=>{const sc=f.salaryBank===name?SALARY_CUT[name]||0:0;const rate=Math.max(0.1,prog.r+d-cut-sc);const pay=annuity(loan,rate,f.term);return {name,ini,delta:d,rate,pay,income:pay/0.6,salaryCut:sc,commission:(i*7)%11}}),[f.program,loan,f.term,cut,f.salaryBank]);
  const value={psOpen,setPsOpen,termBy,setTermBy,prescore,setPrescore,dealId,co,setCo,f,setF,selected,setSelected,client,setClient,a,setA,files,setFiles,sign,setSign,done,sent,setSent,toast,
    say:setToast,markDone:k=>setDone(o=>({...o,[k]:true})),calc:{loan,cut,offers,termOf:n=>termBy[n]||f.term,payOf:(o,minus=0)=>annuity(loan,o.rate-minus,termBy[o.name]||f.term)},
    sendToBanks:names=>setSent(o=>[...o,...names.filter(n=>!o.some(x=>x.name===n)).map(n=>({name:n,status:'sent',at:nowAt()}))])};
  const sber=isSberOnly(selected); STEPS=sber?SBER_STEPS:FULL_STEPS; value.sber=sber;
  const order=STEPS.map(s=>s[0]);
  const DEMO={...PASSPORT_DATA,recognized:true,phone:'+7 (900) 123-45-67',snils:'123-456-789 01',email:'ivanov@example.com',income:'180000',org:'ООО «Северсталь-Инфо»',orgInn:'7701234567',position:'Ведущий инженер',workPhone:'+7 (495) 123-45-67',startDate:'01.03.2021',edus:[{level:'Высшее',year:'2008',place:'ТвГУ',spec:'Прикладная информатика'}],eduLevel:'Высшее',expYears:'14',jobs3:'1',exp5:'5 лет и более'};
  const devJump=h=>{const i=order.indexOf(h);const need=h==='status'?order.length:i;
    if(i>0||h==='status'){setA(o=>({...o,...DEMO}));setFiles(o=>o.passport.length?o:{...o,passport:[{name:'Паспорт.pdf',size:'1,8 МБ'}]});setDone(o=>{const n={...o};order.slice(0,need).forEach(k=>n[k]=true);return n})}
    if(h&&h!=='client'&&h!=='podbor'&&!selected.size)setSelected(new Set(['Абсолют Банк','Уралсиб']));
    if(h==='status'){setSign(o=>({...o,status:'signed'}));setSent(s=>s.length?s:[{name:'Абсолют Банк',status:'sent'},{name:'Уралсиб',status:'sent'}])}
    go(h)};
  /* guard: шаги идут строго по порядку */
  let target=route;
  if(order.includes(route)){ if(!selected.size&&route!=='podbor') target='podbor'; else { const first=order.find(k=>!done[k]); const fi=first?order.indexOf(first):order.length; if(order.indexOf(route)>fi) target=first; } }
  if(route==='status'&&!sent.length) target=done[STEPS[STEPS.length-2][0]]?'signing':'podbor';
  useEffect(()=>{if(target!==route){go(target);setToast(target==='podbor'?'Сначала выберите банки на шаге «Подбор условий»':'Шаги анкеты заполняются по порядку')}},[target,route]);
  value.devJump=devJump;
  const Page={'':Deals,podbor:Podbor,personal:Personal,family:Family,income:Income,signing:Signing,status:Status,client:Client}[target];
  return html`<${Ctx.Provider} value=${value}><${Page} key=${target}/><${Toast}/><//>`;
}
ReactDOM.createRoot(document.getElementById('root')).render(html`<${Root}/>`);
