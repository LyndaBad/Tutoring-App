import { useState } from "react";
import { Home, BookOpen, Calendar, TrendingUp, Award, Users, FileText, CreditCard, CheckCircle, Eye, EyeOff, ArrowUp, Download, BarChart2, Star, Zap } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* ── TOKENS ──────────────────────────────────────────────────────── */
const C = {
  navy:"#0A1628", n2:"#0F2040", n3:"#162952", n4:"#1E3564",
  cream:"#F0EBE1", c2:"#C8C0B4", ash:"#7080A0", ash2:"#3E5060",
  gold:"#C9A86C", g2:"#E4CA90", ga:"rgba(201,168,108,.13)", gaa:"rgba(201,168,108,.06)",
  green:"#2EAD76", ga2:"rgba(46,173,118,.13)",
  blue:"#2E7DD1",  ba:"rgba(46,125,209,.12)",
  amber:"#D48A2E", aa:"rgba(212,138,46,.12)",
  red:"#C84E4E",   ra:"rgba(200,78,78,.1)",
  violet:"#6E5BB8",va:"rgba(110,91,184,.12)",
  teal:"#2DA89A",  ta:"rgba(45,168,154,.12)",
  rl:"rgba(201,168,108,.14)", r2:"rgba(255,255,255,.08)", r3:"rgba(255,255,255,.04)",
};

/* ── DATA ────────────────────────────────────────────────────────── */
const SCORE_DATA = [
  {w:"W1",s:62,a:57},{w:"W2",s:65,a:59},{w:"W3",s:63,a:61},
  {w:"W4",s:74,a:63},{w:"W5",s:77,a:65},{w:"W6",s:79,a:67},
  {w:"W7",s:83,a:69},{w:"W8",s:87,a:71},
];
const SESSIONS_DATA = [
  {d:"Mon",n:7},{d:"Tue",n:9},{d:"Wed",n:4},{d:"Thu",n:11},{d:"Fri",n:6},{d:"Sat",n:8}
];
const ASSESS_DATA = [
  {n:"Baseline",s:62,m:100,t:"baseline"},
  {n:"Unit 1",  s:74,m:50, t:"topic"},
  {n:"Unit 2",  s:82,m:50, t:"topic"},
  {n:"Mid-Course",s:79,m:100,t:"mid"},
];
const UNITS = [
  {u:"Number & Algebra",p:100,c:C.green},
  {u:"Functions",p:85,c:C.blue},
  {u:"Geometry & Trig",p:62,c:C.amber},
  {u:"Statistics",p:28,c:C.violet},
  {u:"Calculus",p:0,c:C.ash2},
];
const COURSES_SAMPLE = [
  {id:"ib-aa-hl",badge:"IB AA HL",title:"IB Mathematics AA HL",hrs:"50h",rate:"£50/hr",col:C.violet,icon:"∑",lessons:30,target:"IB Diploma · Higher Level"},
  {id:"ib-ai-sl",badge:"IB AI SL",title:"IB Mathematics AI SL",hrs:"30h",rate:"£50/hr",col:C.blue,  icon:"∑",lessons:22,target:"IB Diploma · Standard Level"},
  {id:"al-math", badge:"A-Level", title:"A-Level Mathematics",  hrs:"45h",rate:"£45/hr",col:C.red,   icon:"∑",lessons:19,target:"UK — AQA / Edexcel / OCR"},
  {id:"gcse-m",  badge:"GCSE",    title:"GCSE Mathematics",     hrs:"36h",rate:"£38/hr",col:C.green, icon:"∑",lessons:13,target:"Year 10 & 11"},
  {id:"ap-chem", badge:"AP",      title:"AP Chemistry",         hrs:"40h",rate:"£45/hr",col:C.amber, icon:"⚗",lessons:15,target:"College Board — US"},
  {id:"ib-chem-hl",badge:"IB HL", title:"IB Chemistry HL",      hrs:"48h",rate:"£50/hr",col:C.teal,  icon:"⚗",lessons:24,target:"IB Diploma · Higher Level"},
];
const EQS = [
  {l:"Binomial Theorem",  d:"(a + b)ⁿ = Σ C(n,r) · aⁿ⁻ʳ · bʳ",  k:"\\sum_{r=0}^{n}\\binom{n}{r}a^{n-r}b^r"},
  {l:"Derivative — Power Rule", d:"d/dx [xⁿ] = n · xⁿ⁻¹",       k:"\\frac{d}{dx}[x^n] = nx^{n-1}"},
  {l:"Normal Distribution", d:"X ~ N(μ, σ²)  |  z = (x − μ) / σ",k:"z=\\frac{x-\\mu}{\\sigma}"},
];
const TUTORS = [
  {n:"Dr. Sarah Mills", sub:"IB Mathematics",  rate:25, sessions:58, av:"SM", status:"active",  c:C.blue},
  {n:"James Okafor",   sub:"IB Chemistry",     rate:22, sessions:32, av:"JO", status:"active",  c:C.green},
  {n:"Priya Nair",     sub:"Math & Chemistry", rate:20, sessions:0,  av:"PN", status:"pending", c:C.amber},
];
const ATCOLOR = {baseline:C.teal,topic:C.blue,mid:C.amber,final:C.violet};

/* ── HELPERS ─────────────────────────────────────────────────────── */
const pct = (s,m) => Math.round(s/m*100);
const gc  = (p)   => p>=80?C.green:p>=65?C.blue:p>=50?C.amber:C.red;

/* ── ATOMS ───────────────────────────────────────────────────────── */
function Tag({l,c,bg}){
  return <span style={{background:bg||c+"18",color:c,border:"1px solid "+c+"30",borderRadius:4,padding:".18rem .65rem",fontSize:".65rem",fontWeight:700,letterSpacing:".07em",display:"inline-block"}}>{l}</span>;
}
function Dot({c}){
  return <span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block",flexShrink:0}}/>;
}
function PBar({p,c,h=5}){
  return <div style={{background:C.r2,borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:Math.min(p||0,100)+"%",height:"100%",background:c||C.gold,borderRadius:99,transition:"width .6s ease"}}/></div>;
}
function Card({children,accent,sx={}}){
  return <div style={{background:C.n2,border:"1px solid "+(accent||C.rl),borderRadius:14,padding:"1.5rem",...sx}}>{children}</div>;
}
function Num({v,l,c,delta}){
  return <div>
    <div style={{display:"flex",alignItems:"baseline",gap:".5rem"}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.4rem",fontWeight:300,color:c||C.gold,lineHeight:1}}>{v}</span>
      {delta&&<span style={{fontSize:".72rem",color:delta>0?C.green:C.red,display:"flex",alignItems:"center",gap:2}}><ArrowUp size={11} style={{transform:delta>0?"none":"rotate(180deg)"}}/>{Math.abs(delta)}%</span>}
    </div>
    <p style={{fontSize:".7rem",color:C.ash,marginTop:".2rem"}}>{l}</p>
  </div>;
}

/* ── LOGO ────────────────────────────────────────────────────────── */
function Logo({size=32}){
  return <div style={{display:"flex",alignItems:"center",gap:".7rem"}}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="9" fill={C.gold}/>
      <path d="M8 28L20 10L32 28" stroke={C.navy} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M12 22L28 22" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="20" cy="32.5" r="2.5" fill={C.navy}/>
    </svg>
    <div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:size>28?"1.05rem":".88rem",fontWeight:600,color:C.cream,lineHeight:1.1}}>Lynda Badmus</p>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:size>28?".68rem":".58rem",color:C.gold,letterSpacing:".14em",textTransform:"uppercase",lineHeight:1}}>Education</p>
    </div>
  </div>;
}

/* ── SWITCHER ────────────────────────────────────────────────────── */
const VIEWS = [
  ["home",    "🏠 Public Site"],
  ["student", "👤 Student"],
  ["parent",  "👨‍👧 Parent"],
  ["tutor",   "🎓 Tutor"],
  ["admin",   "⚙️ Admin"],
];
function Switcher({view,set}){
  return <div style={{background:C.n3,borderBottom:"1px solid "+C.rl,padding:".55rem 1.5rem",display:"flex",gap:".4rem",alignItems:"center",overflowX:"auto"}}>
    <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".1em",marginRight:".5rem",whiteSpace:"nowrap",flexShrink:0}}>VIEW →</p>
    {VIEWS.map(([v,l])=><button key={v} onClick={()=>set(v)} style={{background:view===v?"rgba(201,168,108,.18)":"transparent",color:view===v?C.gold:C.ash2,border:"1px solid "+(view===v?C.gold+"50":C.r2),borderRadius:20,padding:".28rem .9rem",fontSize:".72rem",fontWeight:600,cursor:"pointer",transition:"all .2s",fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>)}
    <p style={{marginLeft:"auto",fontSize:".62rem",color:C.ash2,flexShrink:0}}>All mock data · no server</p>
  </div>;
}

/* ── SIDEBAR ─────────────────────────────────────────────────────── */
const NAVS = {
  student:[[<Home size={16}/>,"Dashboard"],[<BookOpen size={16}/>,"Lesson Viewer"],[<Award size={16}/>,"Assessments"],[<TrendingUp size={16}/>,"Progress"]],
  parent: [[<Home size={16}/>,"Overview"],[<Award size={16}/>,"Assessments"],[<Calendar size={16}/>,"Sessions"],[<CreditCard size={16}/>,"Billing"]],
  tutor:  [[<Home size={16}/>,"Dashboard"],[<CheckCircle size={16}/>,"Post-Session"],[<FileText size={16}/>,"Upload PPT"]],
  admin:  [[<Home size={16}/>,"Overview"],[<Users size={16}/>,"Tutors"],[<BookOpen size={16}/>,"Courses"],[<CreditCard size={16}/>,"Payouts"]],
};
const RCOL = {student:C.blue,parent:C.teal,tutor:C.amber,admin:C.gold};
const RNAME = {student:"Alex Chen",parent:"Wei Chen",tutor:"Dr. S. Mills",admin:"Lynda Badmus"};
const RAV   = {student:"AC",parent:"WC",tutor:"SM",admin:"LB"};
const RLBL  = {student:"Student Portal",parent:"Parent Portal",tutor:"Tutor Portal",admin:"Platform Admin"};

function Sidebar({view,tab,setTab}){
  if(view==="home") return null;
  const col = RCOL[view]||C.gold;
  const nav = NAVS[view]||[];
  return <aside style={{width:210,background:"rgba(8,15,28,.98)",borderRight:"1px solid "+C.rl,display:"flex",flexDirection:"column",height:"100%",flexShrink:0}}>
    <div style={{padding:"1.25rem 1.2rem 1rem",borderBottom:"1px solid "+C.rl}}>
      <Logo size={30}/>
      <div style={{display:"flex",alignItems:"center",gap:".7rem",marginTop:"1rem",paddingTop:"1rem",borderTop:"1px solid "+C.r2}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,color:C.navy,flexShrink:0}}>{RAV[view]}</div>
        <div><p style={{fontSize:".82rem",fontWeight:600,color:C.cream,lineHeight:1.2}}>{RNAME[view]}</p><p style={{fontSize:".63rem",color:C.ash,marginTop:2}}>{RLBL[view]}</p></div>
      </div>
    </div>
    <nav style={{flex:1,padding:".5rem 0"}}>
      {nav.map(([icon,lbl],i)=>{
        const act=tab===i;
        return <button key={i} onClick={()=>setTab(i)} style={{width:"100%",background:act?col+"15":"none",border:"none",borderLeft:"3px solid "+(act?col:"transparent"),display:"flex",alignItems:"center",gap:".75rem",padding:".7rem 1.2rem",cursor:"pointer",fontSize:".8rem",fontWeight:act?600:400,color:act?col:C.ash,transition:"all .18s",fontFamily:"inherit",textAlign:"left"}}><span style={{opacity:act?1:.7}}>{icon}</span>{lbl}</button>;
      })}
    </nav>
    <div style={{padding:".85rem 1.2rem",borderTop:"1px solid "+C.rl}}>
      <p style={{fontSize:".62rem",color:C.ash2}}>PROTOTYPE · MOCK DATA</p>
    </div>
  </aside>;
}

/* ── EQUATION CARD ───────────────────────────────────────────────── */
function EqCard({eq}){
  const [show,setShow]=useState(false);
  return <div style={{background:C.n3,border:"1px solid "+C.rl,borderRadius:12,padding:"1.25rem",marginBottom:".75rem"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
      <p style={{fontSize:".68rem",fontWeight:700,color:C.gold,letterSpacing:".1em",textTransform:"uppercase"}}>{eq.l}</p>
      <button onClick={()=>setShow(!show)} style={{background:"none",border:"none",color:C.ash,cursor:"pointer",fontSize:".65rem",display:"flex",alignItems:"center",gap:3,fontFamily:"inherit"}}>{show?<EyeOff size={12}/>:<Eye size={12}/>} KaTeX</button>
    </div>
    <div style={{background:C.n4,borderRadius:8,padding:"1.1rem 1.5rem",textAlign:"center",marginBottom:".75rem"}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.35rem",color:C.cream,display:"block",lineHeight:1.6}}>{eq.d}</span>
    </div>
    {show&&<div style={{background:"#060e1a",borderRadius:6,padding:".65rem .9rem",fontFamily:"'JetBrains Mono',monospace",fontSize:".7rem",color:C.g2,border:"1px solid "+C.rl,marginBottom:".6rem"}}>{eq.k}</div>}
  </div>;
}

/* ═══════════════════
   PAGE: PUBLIC HOME
═══════════════════ */
function PageHome({setView}){
  return <div style={{overflowY:"auto",height:"100%",background:C.navy}}>
    {/* Nav */}
    <div style={{background:"rgba(10,22,40,.97)",borderBottom:"1px solid "+C.rl,padding:"1rem 2.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
      <Logo size={36}/>
      <nav style={{display:"flex",gap:0}}>
        {["Courses","Pricing","About","FAQs"].map(l=><button key={l} style={{background:"none",border:"none",color:C.ash,fontFamily:"inherit",fontSize:".72rem",letterSpacing:".1em",textTransform:"uppercase",padding:".3rem .85rem",cursor:"pointer"}}>{l}</button>)}
      </nav>
      <div style={{display:"flex",gap:".75rem"}}>
        <button style={{background:"transparent",border:"1px solid "+C.rl,color:C.ash,borderRadius:8,padding:".4rem 1rem",fontFamily:"inherit",fontSize:".8rem",cursor:"pointer"}}>Sign In</button>
        <button onClick={()=>setView("student")} style={{background:C.gold,border:"none",color:C.navy,borderRadius:8,padding:".4rem 1.1rem",fontFamily:"inherit",fontSize:".8rem",fontWeight:600,cursor:"pointer"}}>Browse Courses</button>
      </div>
    </div>

    {/* Hero */}
    <div style={{padding:"7rem 2.5rem 5rem",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 65% 35%,rgba(201,168,108,.06) 0%,transparent 55%)"}}/>
      <div style={{position:"absolute",right:"2%",top:"45%",transform:"translateY(-55%)",fontFamily:"'Cormorant Garamond',serif",fontSize:"min(32vw,380px)",fontWeight:300,color:"rgba(201,168,108,.03)",userSelect:"none",pointerEvents:"none",lineHeight:1}}>∑⚗</div>
      <div style={{maxWidth:760,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:".85rem",marginBottom:"1.5rem"}}>
          <div style={{height:1,width:36,background:C.gold}}/>
          <p style={{fontSize:".65rem",fontWeight:500,letterSpacing:".3em",textTransform:"uppercase",color:C.gold}}>Cambridge-Educated · 12+ Years · UK & US Curricula</p>
        </div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(3.5rem,9vw,7.5rem)",fontWeight:300,lineHeight:.93,letterSpacing:"-.02em",marginBottom:"2.5rem"}}>
          Academic<br/>excellence<br/><em style={{fontStyle:"italic",color:C.gold}}>with purpose.</em>
        </h1>
        <p style={{fontSize:".95rem",color:"#8090a8",lineHeight:1.78,maxWidth:440,fontWeight:300,marginBottom:"2.75rem"}}>Students enrol in structured courses — not random sessions. Lesson by lesson, assessment by assessment, with live Zoom sessions booked at their own pace.</p>
        <div style={{display:"flex",gap:"1.25rem",flexWrap:"wrap"}}>
          <button onClick={()=>setView("student")} style={{background:C.gold,border:"none",color:C.navy,borderRadius:8,padding:".85rem 2.2rem",fontFamily:"inherit",fontSize:".92rem",fontWeight:600,cursor:"pointer"}}>Explore Courses</button>
          <button style={{background:"transparent",border:"1px solid "+C.gold,color:C.gold,borderRadius:8,padding:".85rem 2.2rem",fontFamily:"inherit",fontSize:".92rem",cursor:"pointer"}}>Meet Lynda</button>
        </div>
        <div style={{marginTop:"4rem",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.rl,borderRadius:10,overflow:"hidden",maxWidth:600}}>
          {[["MSc","Cambridge Maths Education"],["12+","Years IB/A-Level/GCSE"],["20","Structured courses"],["4","IB pathways, split correctly"]].map(([n,l])=>(
            <div key={n} style={{background:C.n2,padding:"1.2rem 1.25rem"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",fontWeight:300,color:C.gold,lineHeight:1,marginBottom:".18rem"}}>{n}</p>
              <p style={{fontSize:".62rem",color:C.ash2}}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* IB callout */}
    <div style={{background:C.n2,borderTop:"1px solid "+C.rl,borderBottom:"1px solid "+C.rl,padding:"3rem 2.5rem"}}>
      <p style={{fontSize:".65rem",fontWeight:500,letterSpacing:".25em",textTransform:"uppercase",color:C.gold,marginBottom:"1.2rem"}}>IB Mathematics — 6 separate courses · AA ≠ AI · SL ≠ HL</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.rl,borderRadius:10,overflow:"hidden",maxWidth:860}}>
        {[{l:"Math AA SL",d:"Analysis & Approaches · SL",c:C.violet},{l:"Math AA HL",d:"Analysis & Approaches · HL",c:C.violet},{l:"Math AI SL",d:"Applications & Interpretation · SL",c:C.blue},{l:"Math AI HL",d:"Applications & Interpretation · HL",c:C.blue},{l:"Chemistry SL",d:"IB Chemistry · Standard Level",c:C.green},{l:"Chemistry HL",d:"IB Chemistry · Higher Level",c:C.green}].map(c=>(
          <div key={c.l} style={{background:C.n2,padding:"1.35rem",cursor:"pointer",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.n3} onMouseLeave={e=>e.currentTarget.style.background=C.n2}>
            <Tag l="IB" c={c.c} bg={c.c+"18"}/>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.cream,margin:".55rem 0 .2rem"}}>{c.l}</p>
            <p style={{fontSize:".7rem",color:C.ash}}>{c.d}</p>
          </div>
        ))}
      </div>
      <p style={{fontSize:".72rem",color:C.ash,marginTop:"1rem",maxWidth:680}}>AA is algebraic/proof-based (maths, physics, engineering). AI is statistics and modelling (social science, business). These are different syllabuses and cannot be substituted for each other.</p>
    </div>

    {/* Course grid */}
    <div style={{padding:"4rem 2.5rem"}}>
      <p style={{fontSize:".65rem",fontWeight:500,letterSpacing:".25em",textTransform:"uppercase",color:C.gold,marginBottom:".85rem"}}>Course Catalogue</p>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,marginBottom:"2.5rem"}}>Every curriculum. <em style={{fontStyle:"italic",color:C.gold}}>Every level.</em></h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:1,background:C.rl}}>
        {COURSES_SAMPLE.map(c=>(
          <div key={c.id} style={{background:C.navy,padding:"1.75rem",cursor:"pointer",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.n2} onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
              <Tag l={c.badge} c={c.col} bg={c.col+"18"}/>
              <span style={{fontSize:"1.6rem",color:c.col,opacity:.35,fontFamily:"'Cormorant Garamond',serif"}}>{c.icon}</span>
            </div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",color:C.cream,marginBottom:".25rem"}}>{c.title}</p>
            <p style={{fontSize:".72rem",color:C.ash,marginBottom:"1rem"}}>{c.target}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <p style={{fontSize:".62rem",color:C.ash2,letterSpacing:".06em"}}>HOURLY RATE</p>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:300,color:C.gold,lineHeight:1}}>{c.rate}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{fontSize:".68rem",color:C.c2}}>{c.hrs} full course</p>
                <p style={{fontSize:".68rem",color:C.ash}}>{c.lessons} lessons</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div style={{background:C.n2,borderTop:"1px solid "+C.rl,padding:"6rem 2.5rem",textAlign:"center"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3.8rem)",fontWeight:300,lineHeight:1.1,marginBottom:"1.5rem"}}>
        Your strongest year starts<br/>with the <em style={{fontStyle:"italic",color:C.gold}}>right course.</em>
      </h2>
      <p style={{fontSize:".9rem",color:C.ash,maxWidth:420,margin:"0 auto 2.5rem",lineHeight:1.78,fontWeight:300}}>Browse the catalogue, enrol in a structured programme, and book your first live Zoom session within 24 hours.</p>
      <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={()=>setView("student")} style={{background:C.gold,border:"none",color:C.navy,borderRadius:8,padding:".85rem 2.4rem",fontFamily:"inherit",fontSize:".92rem",fontWeight:600,cursor:"pointer"}}>Browse All Courses</button>
        <button style={{background:"transparent",border:"1px solid "+C.gold,color:C.gold,borderRadius:8,padding:".85rem 2.4rem",fontFamily:"inherit",fontSize:".92rem",cursor:"pointer"}}>Sign Up Free</button>
      </div>
    </div>
  </div>;
}

/* ═════════════════════
   PAGE: STUDENT DASH
═════════════════════ */
function PageStudent({tab}){
  const [revIdx,setRevIdx]=useState(null);

  if(tab===1) return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    {/* Lesson Viewer */}
    <div style={{marginBottom:"1.5rem"}}>
      <div style={{display:"flex",gap:".5rem",marginBottom:".75rem",flexWrap:"wrap"}}>
        <Tag l="IB AA HL" c={C.violet}/><Tag l="Lesson 3" c={C.ash}/><Tag l="Unit 1" c={C.ash}/>
      </div>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:C.cream,marginBottom:".35rem"}}>Binomial Theorem</h1>
      <p style={{fontSize:".85rem",color:C.ash,maxWidth:540,lineHeight:1.65}}>Expand binomial expressions using the general term, find specific coefficients, and apply to approximation problems.</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",alignItems:"start"}}>
      <div>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".85rem"}}>Topics Covered</p>
        {["General term T(r+1) = C(n,r)·aⁿ⁻ʳ·bʳ","Pascal's triangle and coefficient patterns","Finding specific term coefficients","Approximation using binomial theorem"].map((t,i)=>(
          <div key={i} style={{display:"flex",gap:".65rem",padding:".55rem 0",borderBottom:"1px solid "+C.r3}}>
            <Dot c={C.gold}/><p style={{fontSize:".83rem",color:C.c2}}>{t}</p>
          </div>
        ))}
        <div style={{marginTop:"1.5rem",background:C.n3,border:"1px solid "+C.rl,borderRadius:12,padding:"1.25rem"}}>
          <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".85rem"}}>Practice Questions</p>
          {[{n:1,q:"Expand (x − 2)⁵",ans:"x⁵ − 10x⁴ + 40x³ − 80x² + 80x − 32",m:3},{n:2,q:"Find coefficient of x³ in (1 + 2x)⁷",ans:"280",m:3},{n:3,q:"Term independent of x in (x + 1/x)⁶",ans:"20",m:4}].map((q,i)=>{
            const rev=revIdx===i;
            return <div key={i} style={{marginBottom:".75rem",background:C.n4,borderRadius:8,padding:".85rem 1rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".5rem"}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:C.cream}}>Q{q.n}: {q.q}</p>
                <Tag l={q.m+" marks"} c={C.blue}/>
              </div>
              <button onClick={()=>setRevIdx(rev?null:i)} style={{display:"flex",alignItems:"center",gap:".4rem",background:rev?C.ga:"transparent",border:"1px solid "+(rev?C.gold+"50":C.rl),borderRadius:6,padding:".35rem .75rem",cursor:"pointer",color:rev?C.gold:C.ash,fontSize:".75rem",fontFamily:"inherit",transition:"all .18s"}}>
                {rev?<EyeOff size={12}/>:<Eye size={12}/>} {rev?"Hide":"Reveal"} answer
              </button>
              {rev&&<p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.green,marginTop:".5rem"}}>{q.ans}</p>}
            </div>;
          })}
        </div>
      </div>
      <div>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".85rem"}}>Key Equations</p>
        {EQS.map((eq,i)=><EqCard key={i} eq={eq}/>)}
        <Card sx={{marginTop:"1rem"}}>
          <p style={{fontSize:".65rem",color:C.gold,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".6rem"}}>📋 Lesson Slides</p>
          <div style={{background:C.n3,borderRadius:10,padding:"1rem",marginBottom:".85rem"}}>
            <div style={{background:"linear-gradient(135deg,#0F2040 0%,#162952 100%)",borderRadius:8,minHeight:140,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:".75rem",padding:"1.5rem",marginBottom:".65rem"}}>
              <p style={{fontSize:".62rem",color:C.ash,letterSpacing:".2em",textTransform:"uppercase"}}>Lesson 3</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",color:C.cream,textAlign:"center",lineHeight:1.1}}>Binomial Theorem</p>
              <div style={{background:"rgba(201,168,108,.12)",border:"1px solid "+C.rl,borderRadius:7,padding:".5rem 1.25rem"}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.gold}}>(a + b)ⁿ = Σ C(n,r) · aⁿ⁻ʳ · bʳ</span>
              </div>
            </div>
            <p style={{fontSize:".72rem",color:C.ash}}>24 slides · IB Math AA HL · Unit 1</p>
          </div>
          <button style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",background:C.n4,border:"1px solid "+C.rl,color:C.c2,borderRadius:8,padding:".6rem",cursor:"pointer",fontSize:".8rem",fontFamily:"inherit"}}><Download size={13}/> Download .pptx</button>
        </Card>
      </div>
    </div>
  </div>;

  if(tab===2) return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <div style={{marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem"}}>
      <div><p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".2rem"}}>IB Math AA HL</p><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300}}>Assessments & Feedback</h1></div>
      <Num v="76%" l="avg score" c={C.gold} delta={14}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:"1.25rem"}}>
      <div>
        {ASSESS_DATA.map((a,i)=>{
          const p=pct(a.s,a.m); const col=gc(p);
          return <Card key={i} accent={ATCOLOR[a.t]+"40"} sx={{marginBottom:"1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
              <div><Tag l={{baseline:"Baseline",topic:"Topic Check",mid:"Mid-Course",final:"Final"}[a.t]} c={ATCOLOR[a.t]}/><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",color:C.cream,marginTop:".5rem"}}>{a.n}</p></div>
              <div style={{textAlign:"right"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:col,lineHeight:1}}>{p}%</p><p style={{fontSize:".7rem",color:C.ash}}>{a.s}/{a.m}</p></div>
            </div>
            <PBar p={p} c={col} h={6}/>
            {a.t==="mid"&&<div style={{marginTop:"1rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              <div><p style={{fontSize:".65rem",color:C.green,fontWeight:700,letterSpacing:".08em",marginBottom:".45rem"}}>✓ Strengths</p>{["Strong algebraic manipulation","Clear exam technique"].map((s,j)=><p key={j} style={{fontSize:".78rem",color:C.c2,marginBottom:".2rem"}}>· {s}</p>)}</div>
              <div><p style={{fontSize:".65rem",color:C.amber,fontWeight:700,letterSpacing:".08em",marginBottom:".45rem"}}>→ Focus Areas</p>{["Complex number applications","IA-style proof questions"].map((s,j)=><p key={j} style={{fontSize:".78rem",color:C.c2,marginBottom:".2rem"}}>· {s}</p>)}</div>
            </div>}
          </Card>;
        })}
      </div>
      <div>
        <Card sx={{marginBottom:"1rem"}}>
          <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Score History</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ASSESS_DATA.map(a=>({n:a.n.split(" ")[0],s:pct(a.s,a.m),t:a.t}))}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.r2}/>
              <XAxis dataKey="n" tick={{fill:C.ash,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.ash,fontSize:11}} axisLine={false} tickLine={false} domain={[0,100]}/>
              <Tooltip contentStyle={{background:C.n3,border:"1px solid "+C.rl,borderRadius:8,color:C.cream,fontSize:12}} formatter={v=>[v+"%","Score"]}/>
              <Bar dataKey="s" radius={[5,5,0,0]}>{ASSESS_DATA.map((a,i)=><Cell key={i} fill={ATCOLOR[a.t]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:"1rem",marginTop:"1rem",flexWrap:"wrap"}}>
            {[["baseline","Baseline",C.teal],["topic","Topic Check",C.blue],["mid","Mid-Course",C.amber]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:".35rem"}}><Dot c={c}/><p style={{fontSize:".7rem",color:C.ash}}>{v}</p></div>
            ))}
          </div>
        </Card>
        <Card accent={C.violet+"40"}>
          <Tag l="Final Assessment" c={C.violet}/><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.cream,margin:".5rem 0 .25rem"}}>End-of-Course Assessment</p><p style={{fontSize:".75rem",color:C.ash}}>Lesson 30 · Full syllabus · 90 min</p>
        </Card>
      </div>
    </div>
  </div>;

  if(tab===3) return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,marginBottom:"1.5rem"}}>Progress Tracker</h1>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:"1.25rem"}}>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".4rem"}}>Score Trend — IB Math AA HL</p>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:300,marginBottom:"1.1rem"}}>Up 25 points since baseline</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={SCORE_DATA}>
            <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={.2}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.r2}/>
            <XAxis dataKey="w" tick={{fill:C.ash,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.ash,fontSize:11}} axisLine={false} tickLine={false} domain={[40,100]}/>
            <Tooltip contentStyle={{background:C.n3,border:"1px solid "+C.rl,borderRadius:8,color:C.cream,fontSize:12}}/>
            <Area type="monotone" dataKey="s" stroke={C.gold} strokeWidth={2.5} fill="url(#sg)" name="Score" dot={{fill:C.gold,r:3}}/>
            <Line type="monotone" dataKey="a" stroke={C.ash2} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Class avg"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <div>
        <Card sx={{marginBottom:"1rem"}}>
          <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Unit Progress</p>
          {UNITS.map(u=><div key={u.u} style={{marginBottom:".9rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:".32rem"}}>
              <p style={{fontSize:".8rem",color:u.p>0?C.cream:C.ash2}}>{u.u}</p>
              <p style={{fontSize:".75rem",color:u.p===100?C.green:u.p>0?u.c:C.ash2,fontWeight:600}}>{u.p}%</p>
            </div>
            <PBar p={u.p} c={u.c} h={4}/>
          </div>)}
        </Card>
        <Card>
          <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".75rem"}}>Credits</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rl,borderRadius:8,overflow:"hidden"}}>
            {[["50","Total",C.gold],["9","Used",C.ash],["41","Left",C.green]].map(([v,l,c])=><div key={l} style={{background:C.n3,padding:"1rem .85rem",textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:300,color:c,lineHeight:1}}>{v}</p><p style={{fontSize:".68rem",color:C.ash,marginTop:".2rem"}}>{l}</p></div>)}
          </div>
        </Card>
      </div>
    </div>
  </div>;

  /* Default: Dashboard */
  return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
      <div><p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Student Dashboard</p><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.1rem",fontWeight:300}}>Welcome, <em style={{fontStyle:"italic",color:C.gold}}>Alex</em></h1></div>
      <div style={{display:"flex",gap:".65rem",flexWrap:"wrap"}}><Tag l="41 credits left" c={C.green}/><Tag l="IB AA HL" c={C.violet}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.rl,borderRadius:10,overflow:"hidden",marginBottom:"1.5rem"}}>
      {[["9/30","Lessons done",C.blue,18],["41","Credits left",C.green,null],["79%","Mid-course",C.gold,12],["87%","Latest check",C.violet,7]].map(([v,l,c,d])=><div key={l} style={{background:C.n2,padding:"1.2rem 1.4rem"}}><Num v={v} l={l} c={c} delta={d}/></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".35rem"}}>Score Trend</p>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:300,marginBottom:"1rem",color:C.cream}}>Up 25% since baseline · On track</p>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={SCORE_DATA}>
            <defs><linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={.2}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.r2}/>
            <XAxis dataKey="w" tick={{fill:C.ash,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.ash,fontSize:10}} axisLine={false} tickLine={false} domain={[40,100]}/>
            <Tooltip contentStyle={{background:C.n3,border:"1px solid "+C.rl,borderRadius:8,color:C.cream,fontSize:11}}/>
            <Area type="monotone" dataKey="s" stroke={C.gold} strokeWidth={2} fill="url(#sg2)" dot={{fill:C.gold,r:3}} name="Score"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Course Units</p>
        {UNITS.map(u=><div key={u.u} style={{marginBottom:".85rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:".3rem"}}>
            <p style={{fontSize:".79rem",color:u.p>0?C.cream:C.ash2}}>{u.u}</p>
            <p style={{fontSize:".73rem",color:u.p===100?C.green:u.p>0?u.c:C.ash2,fontWeight:600}}>{u.p}%</p>
          </div>
          <PBar p={u.p} c={u.c} h={4}/>
        </div>)}
      </Card>
    </div>
    <Card accent={C.blue+"40"}>
      <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".85rem"}}>Next Zoom Session</p>
      <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"1rem",alignItems:"center"}}>
        <div style={{background:C.ba,border:"1px solid "+C.blue+"30",borderRadius:10,padding:"1.1rem"}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",color:C.cream,marginBottom:".35rem"}}>Thu 22 Nov · 3:30 PM</p>
          <p style={{fontSize:".8rem",color:C.c2,marginBottom:".25rem"}}>Lesson 10 — Functions & Transformations</p>
          <p style={{fontSize:".73rem",color:C.ash}}>Dr. Sarah Mills · IB Math AA HL · 60 min</p>
        </div>
        <div>
          <a href="#" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",background:"#2D8CFF",color:"#fff",borderRadius:8,padding:".75rem 1.25rem",textDecoration:"none",fontSize:".85rem",fontWeight:600,marginBottom:".75rem"}}>🎥 Join Zoom Session</a>
          <div style={{background:C.n3,borderRadius:8,padding:".75rem"}}>
            <p style={{fontSize:".72rem",color:C.ash,marginBottom:".25rem"}}>Prepare:</p>
            <p style={{fontSize:".78rem",color:C.c2}}>Review Lesson 6 slides. Complete Homework Q1–8.</p>
          </div>
        </div>
      </div>
    </Card>
  </div>;
}

/* ═══════════════════
   PAGE: PARENT
═══════════════════ */
function PageParent(){
  return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <div style={{marginBottom:"2rem"}}>
      <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Parent Portal</p>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300}}>Hello <em style={{fontStyle:"italic",color:C.teal}}>Wei</em> — Alex's progress</h1>
    </div>
    <div style={{background:C.n2,border:"1px solid "+C.violet+"30",borderRadius:12,padding:"1.75rem",marginBottom:"1.25rem",borderLeftWidth:4,borderLeftColor:C.violet}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.25rem",flexWrap:"wrap",gap:"1rem"}}>
        <div><Tag l="IB AA HL" c={C.violet}/><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.35rem",color:C.cream,marginTop:".55rem"}}>IB Mathematics Analysis & Approaches HL</p><p style={{fontSize:".75rem",color:C.ash,marginTop:".25rem"}}>Dr. Sarah Mills · Full Course · Sep 2025</p></div>
        <Tag l="Active" c={C.green} bg={C.ga2}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.rl,borderRadius:8,overflow:"hidden",marginBottom:"1.25rem"}}>
        {[["9 / 30","Lessons done",C.blue],["41","Credits left",C.green],["76%","Avg score",C.gold]].map(([v,l,c])=><div key={l} style={{background:C.n3,padding:".9rem 1rem",textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:300,color:c,lineHeight:1}}>{v}</p><p style={{fontSize:".68rem",color:C.ash,marginTop:".2rem"}}>{l}</p></div>)}
      </div>
      <PBar p={30} c={C.violet} h={7}/>
      <p style={{fontSize:".72rem",color:C.ash,marginTop:".4rem"}}>30% complete · On track for final assessment</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Next Session</p>
        <div style={{background:C.ba,border:"1px solid "+C.blue+"30",borderRadius:10,padding:"1.1rem",marginBottom:".85rem"}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",color:C.cream,marginBottom:".3rem"}}>Thu 22 Nov · 3:30 PM</p>
          <p style={{fontSize:".78rem",color:C.c2,marginBottom:".2rem"}}>Lesson 10 — Functions & Transformations</p>
          <p style={{fontSize:".73rem",color:C.ash}}>Dr. Sarah Mills · 60 min · Zoom</p>
        </div>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".6rem"}}>Last Session Note</p>
        <div style={{background:C.n3,borderRadius:8,padding:".85rem",fontSize:".8rem",color:C.c2,lineHeight:1.65,borderLeft:"3px solid "+C.teal}}>Covered Complex Numbers — polar form and De Moivre's theorem. Alex engaged well with the graphical approach. Recommended reviewing Lesson 5 slides before Thursday.</div>
      </Card>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Assessment Results</p>
        {ASSESS_DATA.map((a,i)=>{const p=pct(a.s,a.m);const col=gc(p);return <div key={i} style={{background:C.n3,borderRadius:8,padding:".85rem 1rem",marginBottom:".6rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{fontSize:".82rem",fontWeight:500,marginBottom:".2rem"}}>{a.n}</p><Tag l={{baseline:"Baseline",topic:"Topic Check",mid:"Mid-Course"}[a.t]||a.t} c={ATCOLOR[a.t]} bg={ATCOLOR[a.t]+"15"} /></div>
          <div style={{textAlign:"right"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:300,color:col,lineHeight:1}}>{p}%</p><p style={{fontSize:".65rem",color:C.ash}}>{a.s}/{a.m}</p></div>
        </div>;})}
      </Card>
    </div>
    <div style={{background:C.n2,border:"1px solid "+C.rl,borderRadius:12,padding:"1.5rem"}}>
      <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".85rem"}}>Tutor Feedback — Mid-Course</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
        <div><p style={{fontSize:".65rem",color:C.green,fontWeight:700,letterSpacing:".08em",marginBottom:".5rem"}}>✓ Strengths</p>{["Strong algebraic manipulation","Good exam technique","Clear and structured working"].map((s,i)=><p key={i} style={{fontSize:".78rem",color:C.c2,marginBottom:".2rem"}}>· {s}</p>)}</div>
        <div><p style={{fontSize:".65rem",color:C.amber,fontWeight:700,letterSpacing:".08em",marginBottom:".5rem"}}>→ Focus Areas</p>{["Complex number applications","Extended proof questions","IA-style multi-step problems"].map((s,i)=><p key={i} style={{fontSize:".78rem",color:C.c2,marginBottom:".2rem"}}>· {s}</p>)}</div>
      </div>
    </div>
  </div>;
}

/* ═══════════════════
   PAGE: TUTOR
═══════════════════ */
function PageTutor({tab}){
  const [step,setStep]=useState(1);
  const [att,setAtt]=useState("yes");
  const [dur,setDur]=useState(60);
  const [score,setScore]=useState("");
  const [feedback,setFeedback]=useState("");

  if(tab===1) return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <div style={{marginBottom:"1.5rem"}}><p style={{fontSize:".65rem",color:C.ash,textTransform:"uppercase",letterSpacing:".12em",marginBottom:".2rem"}}>Post-Session Form</p><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",fontWeight:300}}>Alex Chen · IB Math AA HL · Lesson 9</h1></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
      <div>
        <div style={{display:"flex",gap:0,marginBottom:"1.5rem",borderRadius:8,overflow:"hidden",border:"1px solid "+C.rl}}>
          {[["1","Attendance"],["2","Notes"],["3","Assessment"]].map(([n,l],i)=>{const act=step===i+1;return <button key={n} onClick={()=>setStep(i+1)} style={{flex:1,background:act?C.aa:"transparent",color:act?C.amber:C.ash,border:"none",borderRight:i<2?"1px solid "+C.rl:"none",padding:".7rem",fontFamily:"inherit",fontSize:".75rem",fontWeight:act?600:400,cursor:"pointer",transition:"all .18s"}}>{n} {l}</button>;})}
        </div>
        {step===1&&<div>
          <p style={{fontSize:".75rem",color:C.ash,marginBottom:".75rem"}}>Did the student attend?</p>
          <div style={{display:"flex",gap:".6rem",marginBottom:"1.1rem"}}>{["yes","no","partial"].map(v=><button key={v} onClick={()=>setAtt(v)} style={{flex:1,background:att===v?C.aa:"transparent",border:"1px solid "+(att===v?C.amber:C.rl),color:att===v?C.amber:C.ash,borderRadius:8,padding:".6rem",fontFamily:"inherit",fontSize:".8rem",cursor:"pointer",transition:"all .2s",textTransform:"capitalize"}}>{v}</button>)}</div>
          <p style={{fontSize:".75rem",color:C.ash,marginBottom:".5rem"}}>Actual duration</p>
          <div style={{display:"flex",gap:".5rem",marginBottom:"1.1rem"}}>{[45,55,60,75].map(d=><button key={d} onClick={()=>setDur(d)} style={{flex:1,background:dur===d?C.aa:"transparent",border:"1px solid "+(dur===d?C.amber:C.rl),color:dur===d?C.amber:C.ash,borderRadius:8,padding:".6rem",fontFamily:"inherit",fontSize:".82rem",cursor:"pointer",transition:"all .2s"}}>{d}m</button>)}</div>
          <button onClick={()=>setStep(2)} style={{width:"100%",background:C.amber,border:"none",color:C.navy,borderRadius:8,padding:".7rem",fontFamily:"inherit",fontWeight:600,fontSize:".85rem",cursor:"pointer"}}>Next: Session Notes →</button>
        </div>}
        {step===2&&<div>
          <p style={{fontSize:".75rem",color:C.ash,marginBottom:".4rem"}}>Session notes (private)</p>
          <textarea placeholder="Covered Unit 1–2 topic check. Alex was strong on series but needed support on binomial coefficient problems…" rows={3} style={{width:"100%",background:C.n3,border:"1px solid "+C.rl,borderRadius:8,padding:".75rem",color:C.c2,fontFamily:"inherit",fontSize:".82rem",resize:"vertical",outline:"none",marginBottom:"1rem"}}/>
          <p style={{fontSize:".75rem",color:C.ash,marginBottom:".4rem"}}>Parent-visible summary</p>
          <textarea placeholder="Alex completed the Unit 1–2 topic check today and performed well on algebra…" rows={2} style={{width:"100%",background:C.n3,border:"1px solid "+C.rl,borderRadius:8,padding:".75rem",color:C.c2,fontFamily:"inherit",fontSize:".82rem",resize:"vertical",outline:"none",marginBottom:"1rem"}}/>
          <div style={{display:"flex",gap:"1rem",marginBottom:"1rem"}}>{[["PPT covered",true],["Homework set",true]].map(([l,v],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:".5rem",background:C.ga2,border:"1px solid "+C.green+"40",borderRadius:8,padding:".55rem .85rem"}}><CheckCircle size={14} color={C.green}/><p style={{fontSize:".78rem",color:C.green}}>{l}</p></div>)}</div>
          <button onClick={()=>setStep(3)} style={{width:"100%",background:C.amber,border:"none",color:C.navy,borderRadius:8,padding:".7rem",fontFamily:"inherit",fontWeight:600,fontSize:".85rem",cursor:"pointer"}}>Next: Enter Assessment →</button>
        </div>}
        {step===3&&<div>
          <div style={{background:C.va,border:"1px solid "+C.violet+"30",borderRadius:10,padding:".85rem",marginBottom:"1.1rem"}}><p style={{fontSize:".75rem",fontWeight:600,color:C.violet,marginBottom:".25rem"}}>Assessment Lesson — Topic Check</p><p style={{fontSize:".78rem",color:C.c2}}>Enter the result for this topic check assessment below.</p></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".85rem",marginBottom:".85rem"}}>
            <div><p style={{fontSize:".72rem",color:C.ash,marginBottom:".4rem"}}>Score (out of 50)</p><input type="number" value={score} onChange={e=>setScore(e.target.value)} placeholder="e.g. 41" style={{width:"100%",background:C.n3,border:"1px solid "+C.rl,borderRadius:8,padding:".65rem .85rem",color:C.cream,fontFamily:"inherit",fontSize:".9rem",outline:"none"}}/></div>
            <div><p style={{fontSize:".72rem",color:C.ash,marginBottom:".4rem"}}>Grade / IB Level</p><input type="text" placeholder="e.g. 7" style={{width:"100%",background:C.n3,border:"1px solid "+C.rl,borderRadius:8,padding:".65rem .85rem",color:C.cream,fontFamily:"inherit",fontSize:".9rem",outline:"none"}}/></div>
          </div>
          <p style={{fontSize:".72rem",color:C.ash,marginBottom:".4rem"}}>Feedback (student + parent)</p>
          <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Alex scored well on algebra questions. Coefficient technique needs more practice…" rows={3} style={{width:"100%",background:C.n3,border:"1px solid "+C.rl,borderRadius:8,padding:".75rem",color:C.c2,fontFamily:"inherit",fontSize:".82rem",resize:"vertical",outline:"none",marginBottom:"1rem"}}/>
          <button style={{width:"100%",background:C.green,border:"none",color:"#fff",borderRadius:8,padding:".8rem",fontFamily:"inherit",fontWeight:600,fontSize:".88rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem"}}><CheckCircle size={16}/> Submit Session Complete</button>
        </div>}
      </div>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Today's Other Sessions</p>
        {[{st:"Alex Chen",co:"IB Math AA HL",t:"3:30 PM",up:true},{st:"Jamie Lee",co:"IB Math AI SL",t:"5:00 PM",up:true},{st:"Noah H.",co:"AP Chemistry",t:"Yesterday",up:false}].map((s,i)=>(
          <div key={i} style={{background:C.n3,borderRadius:10,padding:"1rem",marginBottom:".7rem",border:"1px solid "+(s.up?C.blue+"40":C.r2)}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:".5rem"}}><p style={{fontWeight:600,fontSize:".88rem",color:C.cream}}>{s.st}</p><Tag l={s.up?"Upcoming":"Done"} c={s.up?C.blue:C.green}/></div>
            <p style={{fontSize:".75rem",color:C.ash}}>{s.co} · {s.t}</p>
          </div>
        ))}
      </Card>
    </div>
  </div>;

  /* Default: Tutor Dashboard */
  return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <div style={{marginBottom:"2rem"}}><p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Tutor Portal</p><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300}}>Welcome, <em style={{fontStyle:"italic",color:C.amber}}>Dr. Mills</em></h1></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.rl,borderRadius:10,overflow:"hidden",marginBottom:"1.5rem"}}>
      {[["2","Upcoming today",C.blue],["58","Completed total",C.green],["£100","Pending payout",C.amber],["8h","This month",C.gold]].map(([v,l,c])=><div key={l} style={{background:C.n2,padding:"1.2rem 1.4rem"}}><Num v={v} l={l} c={c}/></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:"1.25rem"}}>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Today's Sessions</p>
        {[{st:"Alex Chen",co:"IB Math AA HL",dt:"3:30 PM",zm:"zoom.us/j/123",up:true},{st:"Jamie Lee",co:"IB Math AI SL",dt:"5:00 PM",zm:"zoom.us/j/456",up:true},{st:"Sophie K.",co:"GCSE Maths",dt:"Yesterday",zm:"",up:false}].map((s,i)=>(
          <div key={i} style={{background:C.n3,borderRadius:10,padding:"1rem",marginBottom:".7rem",border:"1px solid "+(s.up?C.blue+"40":C.r2)}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:".5rem"}}><p style={{fontWeight:600,fontSize:".88rem",color:C.cream}}>{s.st}</p><Tag l={s.up?"Upcoming":"Done"} c={s.up?C.blue:C.green}/></div>
            <p style={{fontSize:".75rem",color:C.ash,marginBottom:".4rem"}}>{s.co} · {s.dt}</p>
            {s.zm&&<a href="#" style={{fontSize:".75rem",color:"#2D8CFF",fontWeight:600}}>🎥 {s.zm}</a>}
          </div>
        ))}
      </Card>
      <div>
        <Card accent={C.amber+"40"} sx={{marginBottom:"1rem"}}>
          <p style={{fontSize:".65rem",color:C.amber,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".85rem"}}>⚠ Pending Assessment</p>
          <div style={{background:C.aa,borderRadius:8,padding:".85rem"}}><p style={{fontWeight:500,fontSize:".85rem",color:C.cream}}>Noah H. — AP Chemistry</p><p style={{fontSize:".75rem",color:C.ash}}>Topic Check · Lesson 4 not entered</p></div>
        </Card>
        <Card>
          <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Nov 2025 Earnings</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rl,borderRadius:8,overflow:"hidden"}}>
            {[["4h","Logged",C.gold],["£100","Earned",C.green]].map(([v,l,c])=><div key={l} style={{background:C.n3,padding:".9rem",textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:300,color:c,lineHeight:1}}>{v}</p><p style={{fontSize:".68rem",color:C.ash,marginTop:".2rem"}}>{l}</p></div>)}
          </div>
        </Card>
      </div>
    </div>
  </div>;
}

/* ═══════════════════
   PAGE: ADMIN
═══════════════════ */
function PageAdmin({tab}){
  const [tutors,setTutors]=useState(TUTORS);

  if(tab===1) return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <div style={{marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300}}>Tutor Manager</h2>
      <div style={{display:"flex",gap:".65rem"}}><Tag l={tutors.filter(t=>t.status==="pending").length+" pending"} c={C.amber} bg={C.aa}/><Tag l={tutors.filter(t=>t.status==="active").length+" active"} c={C.green} bg={C.ga2}/></div>
    </div>
    {tutors.map(t=>(
      <div key={t.n} style={{background:C.n2,border:"1px solid "+(t.status==="pending"?C.amber:C.rl),borderRadius:10,padding:"1.25rem 1.5rem",marginBottom:".65rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto",gap:"1.25rem",alignItems:"center"}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:t.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".78rem",fontWeight:700,color:C.navy,flexShrink:0}}>{t.av}</div>
          <div>
            <p style={{fontWeight:600,fontSize:".92rem",color:C.cream}}>{t.n}</p>
            <p style={{fontSize:".75rem",color:C.ash}}>{t.sub} · {t.sessions} sessions · £{t.rate}/hr</p>
          </div>
          <Tag l={t.status==="active"?"Active":"Pending"} c={t.status==="active"?C.green:C.amber} bg={t.status==="active"?C.ga2:C.aa}/>
          {t.status==="pending"&&<button onClick={()=>setTutors(tutors.map(x=>x.n===t.n?{...x,status:"active"}:x))} style={{background:C.green,border:"none",color:"#fff",borderRadius:7,padding:".35rem .85rem",cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:"inherit"}}>Approve</button>}
          <button style={{background:"none",border:"1px solid "+C.rl,color:C.ash,borderRadius:7,padding:".35rem .75rem",cursor:"pointer",fontSize:".75rem",fontFamily:"inherit"}}>View</button>
        </div>
      </div>
    ))}
  </div>;

  if(tab===2) return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>Course Manager</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:1,background:C.rl}}>
      {COURSES_SAMPLE.map(c=>(
        <div key={c.id} style={{background:C.n2,padding:"1.5rem",borderLeft:"4px solid "+c.col}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".85rem"}}><Tag l={c.badge} c={c.col}/><span style={{fontSize:"1.4rem",color:c.col,opacity:.35,fontFamily:"'Cormorant Garamond',serif"}}>{c.icon}</span></div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.cream,marginBottom:".2rem"}}>{c.title}</p>
          <p style={{fontSize:".72rem",color:C.ash,marginBottom:"1rem"}}>{c.target}</p>
          <div style={{display:"flex",gap:".5rem"}}>
            <button style={{flex:1,background:C.n3,border:"1px solid "+C.rl,color:C.c2,borderRadius:7,padding:".45rem .6rem",cursor:"pointer",fontSize:".72rem",fontFamily:"inherit"}}>Edit Lessons</button>
            <button style={{background:C.gaa,border:"1px solid "+C.rl,color:C.gold,borderRadius:7,padding:".45rem .75rem",cursor:"pointer",fontSize:".72rem",fontFamily:"inherit"}}>Assign Tutor</button>
          </div>
        </div>
      ))}
    </div>
  </div>;

  if(tab===3) return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>Tutor Payouts</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.rl,borderRadius:10,overflow:"hidden",marginBottom:"1.5rem"}}>
      {[["£520","Total recorded",C.gold],["£166","Pending review",C.amber],["£154","Approved, unpaid",C.blue]].map(([v,l,c])=><div key={l} style={{background:C.n2,padding:"1.2rem 1.4rem"}}><Num v={v} l={l} c={c}/></div>)}
    </div>
    {[{tutor:"Dr. Sarah Mills",period:"Oct 2025",hrs:8,rate:25,total:200,status:"paid"},{tutor:"James Okafor",period:"Oct 2025",hrs:7,rate:22,total:154,status:"approved"},{tutor:"Dr. Sarah Mills",period:"Nov 2025",hrs:4,rate:25,total:100,status:"pending"},{tutor:"James Okafor",period:"Nov 2025",hrs:3,rate:22,total:66,status:"pending"}].map((p,i)=>(
      <div key={i} style={{background:C.n2,border:"1px solid "+(p.status==="pending"?C.amber:p.status==="approved"?C.blue:C.rl),borderRadius:8,padding:"1.25rem 1.5rem",marginBottom:".65rem",display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:"1.5rem",alignItems:"center"}}>
        <div><p style={{fontWeight:500,fontSize:".92rem",color:C.cream}}>{p.tutor}</p><p style={{fontSize:".75rem",color:C.ash}}>{p.period} · {p.hrs}h · £{p.rate}/hr</p></div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:300,color:C.gold}}>£{p.total}</p>
        <Tag l={p.status==="paid"?"Paid":p.status==="approved"?"Approved":"Pending"} c={p.status==="paid"?C.green:p.status==="approved"?C.blue:C.amber}/>
        <div style={{display:"flex",gap:".4rem"}}>
          {p.status==="pending"&&<button style={{background:C.green,border:"none",color:"#fff",borderRadius:7,padding:".3rem .75rem",cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:"inherit"}}>Approve</button>}
          {p.status==="approved"&&<button style={{background:C.gold,border:"none",color:C.navy,borderRadius:7,padding:".3rem .75rem",cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:"inherit"}}>Mark Paid</button>}
        </div>
      </div>
    ))}
  </div>;

  /* Default: Admin Overview */
  return <div style={{padding:"2rem",overflowY:"auto",height:"100%"}}>
    <div style={{marginBottom:"2rem"}}><p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Platform Admin</p><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300}}>Lynda <em style={{fontStyle:"italic",color:C.gold}}>Badmus Education</em></h1></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.rl,borderRadius:10,overflow:"hidden",marginBottom:"1.5rem"}}>
      {[[<Users size={16}/>,48,"Students",C.blue],[<BookOpen size={16}/>,20,"Courses",C.gold],[<Calendar size={16}/>,31,"Sessions/week",C.green],[<FileText size={16}/>,"87%","PPTs uploaded",C.violet]].map(([icon,v,l,c],i)=><div key={i} style={{background:C.n2,padding:"1.25rem 1.4rem",display:"flex",alignItems:"center",gap:".85rem"}}><div style={{width:36,height:36,borderRadius:9,background:c+"15",display:"flex",alignItems:"center",justifyContent:"center",color:c,flexShrink:0}}>{icon}</div><Num v={String(v)} l={l} c={c}/></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:"1.25rem"}}>
      <Card>
        <p style={{fontSize:".65rem",color:C.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Sessions This Week</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={SESSIONS_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.r2}/>
            <XAxis dataKey="d" tick={{fill:C.ash,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.ash,fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:C.n3,border:"1px solid "+C.rl,borderRadius:8,color:C.cream,fontSize:12}}/>
            <Bar dataKey="n" fill={C.gold} radius={[5,5,0,0]} name="Sessions"/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div>
        <Card accent={C.amber+"40"} sx={{marginBottom:"1rem"}}>
          <p style={{fontSize:".65rem",color:C.amber,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".75rem"}}>⚠ Pending Actions</p>
          {["1 tutor awaiting approval","3 invoices to review","4 Zoom links missing"].map((s,i)=><div key={i} style={{display:"flex",gap:".65rem",padding:".55rem 0",borderBottom:"1px solid "+C.r3}}><Dot c={[C.amber,C.red,C.blue][i]}/><p style={{fontSize:".8rem",color:C.c2}}>{s}</p></div>)}
        </Card>
        <Card accent={C.green+"40"}>
          <p style={{fontSize:".65rem",color:C.green,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".65rem"}}>PPT Coverage</p>
          <PBar p={87} c={C.green} h={8}/>
          <p style={{fontSize:".75rem",color:C.ash,marginTop:".5rem"}}>87% of lessons have slides uploaded</p>
        </Card>
      </div>
    </div>
  </div>;
}

/* ── ROOT ─────────────────────────────────────────────────────────── */
export default function App(){
  const [view,setView]=useState("home");
  const [tab,setTab]=useState(0);

  const handleView = (v) => { setView(v); setTab(0); };

  const content = {
    home:    <PageHome setView={handleView}/>,
    student: <PageStudent tab={tab}/>,
    parent:  <PageParent/>,
    tutor:   <PageTutor tab={tab}/>,
    admin:   <PageAdmin tab={tab}/>,
  };

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",fontFamily:"'Jost',system-ui,sans-serif",background:C.navy,color:C.cream}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(201,168,108,.22);border-radius:4px;}
        h1,h2,h3{font-family:'Cormorant Garamond',serif;}
        button,input,textarea{font-family:'Jost',system-ui,sans-serif;}
      `}</style>

      <Switcher view={view} set={handleView}/>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <Sidebar view={view} tab={tab} setTab={setTab}/>
        <div style={{flex:1,overflow:"hidden"}}>
          {content[view]||content.home}
        </div>
      </div>
    </div>
  );
}
