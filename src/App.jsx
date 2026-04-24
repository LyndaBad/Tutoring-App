/**
 * LYNDA BADMUS EDUCATION — COMPLETE RESPONSIVE PLATFORM
 * "Academic excellence with purpose."
 *
 * ✦ Fully responsive: desktop · tablet · mobile (hamburger nav)
 * ✦ Zoom integration throughout all portals (Phase 1 + Phase 2 ready)
 * ✦ 20 courses — IB properly split (AA≠AI, SL≠HL)
 * ✦ Student · Parent · Tutor · Admin portals
 * ✦ Booking calendar with credit deduction
 * ✦ Lesson viewer with equations + PPT mock
 * ✦ 4-tier assessments + tutor entry form
 * ✦ Tutor payout workflow (submit → approve → mark paid)
 * ✦ AI Course Guide assistant (Claude API)
 *
 * DEMO LOGINS:
 *   student@demo.com / demo   |   parent@demo.com / demo
 *   tutor@demo.com  / demo   |   admin@lbe.com   / admin
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./lib/supabase";
import {
  Home as HomeIcon, BookOpen, Calendar, TrendingUp, Award, Users, FileText,
  CreditCard, CheckCircle, Eye, EyeOff, ArrowUp, Download, Menu,
  X, Clock, Settings, GraduationCap, Video, LogOut, Lock, Mail,
  ClipboardList, BarChart2, Zap, MessageSquare,
  DraftingCompass, FlaskConical, Microscope
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

/* ─── TOKENS ─────────────────────────────────────────────────────── */
const T={
  n:"#050B1A",n2:"#090F22",n3:"#0F1B36",n4:"#162444",
  cr:"#F5F0E8",c2:"#D8D0C4",ash:"#8090B8",ash2:"#4A5E82",
  gd:"#F5C842",g2:"#FFE07A",gda:"rgba(245,200,66,.18)",gdaa:"rgba(245,200,66,.09)",
  gr:"#00D491",gra:"rgba(0,212,145,.18)",
  bl:"#5AABFF",bla:"rgba(90,171,255,.18)",
  am:"#FF9340",ama:"rgba(255,147,64,.18)",
  rd:"#FF4E72",rda:"rgba(255,78,114,.18)",
  vi:"#A07AFF",via:"rgba(160,122,255,.18)",
  te:"#00C9AE",tea:"rgba(0,201,174,.18)",
  rl:"rgba(245,200,66,.14)",r2:"rgba(255,255,255,.09)",r3:"rgba(255,255,255,.04)",
  s2:"0 8px 48px rgba(0,0,0,.65)",s3:"0 24px 72px rgba(0,0,0,.8)",
};

/* ─── GLOBAL CSS ──────────────────────────────────────────────────── */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:'Jost',system-ui,sans-serif;background:${T.n};color:${T.cr};-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden;}
h1,h2,h3,h4{font-family:'Cormorant Garamond',Georgia,serif;line-height:1.1;font-weight:500;}
button,input,select,textarea{font-family:inherit;}
a{text-decoration:none;color:inherit;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:rgba(245,200,66,.3);border-radius:4px;}
@keyframes rise{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fIn{from{opacity:0;}to{opacity:1;}}
@keyframes drift{0%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-22px) rotate(3deg);}100%{transform:translateY(0) rotate(0deg);}}
@keyframes glowPulse{0%,100%{opacity:.55;}50%{opacity:1;}}
.rise{animation:rise .42s cubic-bezier(0,.6,.4,1) both;}
.r1{animation-delay:.09s;}.r2{animation-delay:.18s;}.r3{animation-delay:.27s;}.r4{animation-delay:.36s;}
.fIn{animation:fIn .28s ease both;}
.drift{animation:drift 8s ease-in-out infinite;}
.glow-pulse{animation:glowPulse 3s ease-in-out infinite;}
.drawer{position:fixed;top:0;left:0;bottom:0;width:270px;background:${T.n2};border-right:1px solid ${T.rl};z-index:401;transform:translateX(-100%);transition:transform .28s ease;overflow-y:auto;}
.drawer.open{transform:translateX(0);}
.overlay{position:fixed;inset:0;background:rgba(3,8,20,.85);z-index:400;display:none;backdrop-filter:blur(5px);}
.overlay.open{display:block;}
`;

/* ─── SCHEDULE ────────────────────────────────────────────────────── */
const SCHED={
  1:{l:"Mon",s:["15:30","16:30","17:30","18:30","19:00"]},
  2:{l:"Tue",s:["15:30","16:30","17:30","18:30","19:00"]},
  3:{l:"Wed",s:["15:30","16:30"]},
  4:{l:"Thu",s:["15:30","16:30","17:30","18:30","19:00"]},
  6:{l:"Sat",s:["10:00","11:00","12:00","13:00"]},
};

/* ─── COURSES (20, IB split) ──────────────────────────────────────── */
const COURSES=[
  {id:"ib-aa-sl",g:"ib",sub:"math",path:"aa",lvl:"sl",icon:"∑",col:T.vi,pale:T.via,rate:{gbp:50,usd:70},hours:{full:36,half:18,q:9},lessons:27,title:"IB Math AA SL",curr:"IB Diploma · SL",desc:"Full AA SL: algebra, proof, functions, trig, stats, calculus with embedded IA guidance.",assess:["Diagnostic (L1)","Unit Check (L9)","Mid-Course (L17)","Mock (L27)"],outcomes:["Full AA SL syllabus","IA support","Target: 5–7"],eq:{l:"Sum of Series",d:"Sₙ = n/2·(2a+(n−1)d)"}},
  {id:"ib-aa-hl",g:"ib",sub:"math",path:"aa",lvl:"hl",icon:"∑",col:T.vi,pale:T.via,rate:{gbp:50,usd:70},hours:{full:50,half:25,q:12},lessons:30,title:"IB Math AA HL",curr:"IB Diploma · HL",desc:"Full HL: complex numbers, matrices, proof by induction, ODEs, Paper 3 technique.",assess:["Diagnostic (L1)","Unit Check (L9)","Mid-Course (L17)","Paper 3 (L27)","Mock (L30)"],outcomes:["Full AA HL syllabus","Complex numbers & matrices","Target: 6–7"],eq:{l:"Binomial Theorem",d:"(a+b)ⁿ = Σ C(n,r)·aⁿ⁻ʳ·bʳ"}},
  {id:"ib-ai-sl",g:"ib",sub:"math",path:"ai",lvl:"sl",icon:"∑",col:T.bl,pale:T.bla,rate:{gbp:50,usd:70},hours:{full:30,half:15,q:7},lessons:22,title:"IB Math AI SL",curr:"IB Diploma · SL",desc:"Stats-focused: real-world modelling, financial maths, GDC proficiency, data analysis.",assess:["Diagnostic (L1)","Unit Check (L8)","Mid-Course (L15)","Mock (L22)"],outcomes:["Full AI SL syllabus","GDC proficiency","Target: 5–7"],eq:{l:"Normal Distribution",d:"X~N(μ,σ²) | z=(x−μ)/σ"}},
  {id:"ib-ai-hl",g:"ib",sub:"math",path:"ai",lvl:"hl",icon:"∑",col:T.bl,pale:T.bla,rate:{gbp:50,usd:70},hours:{full:42,half:21,q:10},lessons:25,title:"IB Math AI HL",curr:"IB Diploma · HL",desc:"Graph theory, Voronoi, Markov chains, advanced stats, Paper 3 technique.",assess:["Diagnostic (L1)","Unit Check (L7)","Mid (L14)","Paper 3 (L23)","Mock (L25)"],outcomes:["Full AI HL syllabus","Graph theory","Target: 6–7"],eq:{l:"Markov Chain",d:"Sₙ₊₁ = T·Sₙ"}},
  {id:"ib-chem-sl",g:"ib",sub:"chem",icon:"⚗",col:T.gr,pale:T.gra,rate:{gbp:50,usd:70},hours:{full:32,half:16,q:8},lessons:19,title:"IB Chemistry SL",curr:"IB Diploma · SL",desc:"Complete IB Chem SL — Structure & Reactivity with IA guidance.",assess:["Diagnostic (L1)","Unit Check (L6)","Mid (L12)","Mock (L19)"],outcomes:["Full Chem SL syllabus","IA included","Target: 5–7"],eq:{l:"pH",d:"pH = −log[H⁺]"}},
  {id:"ib-chem-hl",g:"ib",sub:"chem",icon:"⚗",col:T.gr,pale:T.gra,rate:{gbp:50,usd:70},hours:{full:48,half:24,q:12},lessons:24,title:"IB Chemistry HL",curr:"IB Diploma · HL",desc:"Born-Haber, mechanisms, NMR spectroscopy, multi-step synthesis, IA at HL standard.",assess:["Diagnostic (L1)","Unit Check (L5)","Mid (L14)","Paper 3 (L22)","Mock (L24)"],outcomes:["Full Chem HL","NMR & Born-Haber","Target: 6–7"],eq:{l:"Equilibrium",d:"Kc=[C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ"}},
  {id:"al-math",g:"al",sub:"math",icon:"∑",col:T.rd,pale:T.rda,rate:{gbp:45,usd:60},hours:{full:45,half:22,q:11},lessons:19,title:"A-Level Mathematics",curr:"UK AQA/Edexcel/OCR",desc:"Full A-Level: Pure, Statistics, Mechanics with A* exam technique.",assess:["Diagnostic (L1)","Unit Check (L9)","Mid (L15)","Mock (L19)"],outcomes:["Full A-Level","Three-paper technique","Target: A/A*"],eq:{l:"Integration by Parts",d:"∫u dv = uv − ∫v du"}},
  {id:"al-chem",g:"al",sub:"chem",icon:"⚗",col:T.rd,pale:T.rda,rate:{gbp:45,usd:60},hours:{full:45,half:22,q:11},lessons:14,title:"A-Level Chemistry",curr:"UK AQA/Edexcel/OCR",desc:"Physical, Inorganic, Organic — mechanisms, synoptic thinking, competitive prep.",assess:["Diagnostic (L1)","Unit Check (L7)","Mid (L10)","Mock (L14)"],outcomes:["Full A-Level Chem","Organic mechanisms","Target: A/A*"],eq:{l:"Arrhenius",d:"k=A·e^(−Eₐ/RT)"}},
  {id:"gcse-math",g:"gcse",sub:"math",icon:"∑",col:T.gr,pale:T.gra,rate:{gbp:38,usd:50},hours:{full:36,half:18,q:9},lessons:13,title:"GCSE Mathematics",curr:"UK AQA/Edexcel/OCR · Yr 10–11",desc:"Higher tier: number, algebra, geometry, statistics with mark-scheme precision.",assess:["Diagnostic (L1)","Unit Check (L5)","Mid (L10)","Mock (L13)"],outcomes:["Higher tier","Three-paper technique","Target: 7–9"],eq:{l:"Quadratic Formula",d:"x=(−b±√(b²−4ac))/2a"}},
  {id:"gcse-chem",g:"gcse",sub:"chem",icon:"⚗",col:T.gr,pale:T.gra,rate:{gbp:38,usd:50},hours:{full:30,half:15,q:7},lessons:11,title:"GCSE Chemistry",curr:"UK AQA/Edexcel/OCR · Yr 10–11",desc:"Full GCSE Chem with six-mark question technique for grade 7–9.",assess:["Diagnostic (L1)","Unit Check (L4)","Mid (L7)","Mock (L11)"],outcomes:["Full GCSE Chem","Six-mark technique","Target: 7–9"],eq:{l:"Moles",d:"n = mass / Mᵣ"}},
  {id:"pre-gcse-m",g:"pre",sub:"math",icon:"∑",col:T.te,pale:T.tea,rate:{gbp:38,usd:50},hours:{full:24,half:12,q:6},lessons:12,title:"Pre-GCSE Maths",curr:"UK Years 7–9",desc:"GCSE readiness: algebraic thinking, number fluency, problem-solving confidence.",assess:["Diagnostic (L1)","Mid (L5)","End (L12)"],outcomes:["GCSE readiness","Foundations report"],eq:{l:"Area of Triangle",d:"A=½·base·height"}},
  {id:"pre-gcse-c",g:"pre",sub:"chem",icon:"⚗",col:T.te,pale:T.tea,rate:{gbp:38,usd:50},hours:{full:20,half:10,q:5},lessons:10,title:"Pre-GCSE Chemistry",curr:"UK Years 7–9",desc:"Particle thinking, bonding concepts, and quantitative foundations.",assess:["Diagnostic (L1)","Mid (L5)","End (L10)"],outcomes:["GCSE Chem readiness","Conceptual foundations"],eq:{l:"Density",d:"ρ=mass/volume"}},
  {id:"pre-ib",g:"preib",sub:"math",icon:"∑",col:T.am,pale:T.ama,rate:{gbp:45,usd:60},hours:{full:24,half:12,q:6},lessons:12,title:"Pre-IB Mathematics",curr:"IB Preparation",desc:"Close the gap before IB — algebraic precision, IB-style problems, SL/HL advice.",assess:["Diagnostic (L1)","Mid (L5)","IB Readiness (L12)"],outcomes:["IB readiness","SL/HL recommendation"],eq:{l:"Laws of Logs",d:"log(xy)=log x+log y"}},
  {id:"ap-chem",g:"ap",sub:"chem",icon:"⚗",col:T.am,pale:T.ama,rate:{gbp:45,usd:60},hours:{full:40,half:20,q:10},lessons:15,title:"AP Chemistry",curr:"College Board — US",desc:"Full AP Chemistry with FRQ technique — equilibrium, kinetics, electrochemistry.",assess:["Diagnostic (L1)","Unit Check (L4)","Mid (L10)","Mock (L15)"],outcomes:["Full AP curriculum","FRQ technique","Target: 4 or 5"],eq:{l:"Gibbs Free Energy",d:"ΔG=ΔH−TΔS"}},
  {id:"hon-math",g:"hon",sub:"math",icon:"∑",col:T.am,pale:T.ama,rate:{gbp:45,usd:60},hours:{full:36,half:18,q:9},lessons:12,title:"Honors Mathematics",curr:"US Accelerated Track",desc:"Advanced Algebra through Pre-Calculus — depth that makes AP/IB accessible.",assess:["Diagnostic (L1)","Unit Check (L5)","Mid (L9)","Mock (L12)"],outcomes:["Honors coverage","AP/IB readiness"],eq:{l:"Law of Cosines",d:"c²=a²+b²−2ab·cos(C)"}},
  {id:"hon-chem",g:"hon",sub:"chem",icon:"⚗",col:T.am,pale:T.ama,rate:{gbp:45,usd:60},hours:{full:36,half:18,q:9},lessons:12,title:"Honors Chemistry",curr:"US Accelerated Track",desc:"Honors depth: stoichiometry, kinetics, thermochemistry with AP preparation.",assess:["Diagnostic (L1)","Unit Check (L5)","Mid (L9)","Mock (L12)"],outcomes:["Honors coverage","AP Chem readiness"],eq:{l:"Ideal Gas",d:"PV=nRT"}},
  {id:"ms-math",g:"ms",sub:"math",icon:"∑",col:T.te,pale:T.tea,rate:{gbp:30,usd:40},hours:{full:24,half:12,q:6},lessons:12,title:"Middle School Math",curr:"US Grades 6–8",desc:"Patient, concept-first MS Maths building algebraic thinking and number sense.",assess:["Diagnostic (L1)","Mid (L6)","End (L12)"],outcomes:["HS readiness","Confidence restored"],eq:{l:"Percentage",d:"%=(part/whole)×100"}},
  {id:"ms-sci",g:"ms",sub:"sci",icon:"🔬",col:T.te,pale:T.tea,rate:{gbp:30,usd:40},hours:{full:20,half:10,q:5},lessons:10,title:"Middle School Science",curr:"US Grades 6–8",desc:"Wide-ranging MS Science building vocabulary, inquiry habits, and scientific thinking.",assess:["Diagnostic (L1)","Mid (L5)","End (L10)"],outcomes:["HS readiness","Scientific thinking"],eq:{l:"Speed",d:"v=distance/time"}},
  {id:"hs-math",g:"us",sub:"math",icon:"∑",col:T.bl,pale:T.bla,rate:{gbp:38,usd:50},hours:{full:36,half:18,q:9},lessons:14,title:"High School Math",curr:"US Grades 9–12",desc:"Algebra through Pre-Calculus — concept-first sessions making AP and Honors accessible.",assess:["Diagnostic (L1)","Unit Check (L5)","Mid (L10)","Mock (L14)"],outcomes:["Algebra 2 & Pre-Calc","AP/Honors readiness"],eq:{l:"Slope",d:"m=(y₂−y₁)/(x₂−x₁)"}},
  {id:"hs-chem",g:"us",sub:"chem",icon:"⚗",col:T.bl,pale:T.bla,rate:{gbp:38,usd:50},hours:{full:30,half:15,q:7},lessons:12,title:"High School Chemistry",curr:"US Grades 9–12",desc:"Atomic structure, bonding, stoichiometry, thermochemistry as a coherent whole.",assess:["Diagnostic (L1)","Unit Check (L4)","Mid (L8)","Mock (L12)"],outcomes:["HS Chem coverage","Honors/AP readiness"],eq:{l:"Molar Mass",d:"n=mass/M (mol)"}},
];
const CAT={ib:{l:"IB Diploma",c:T.vi,bg:T.via},al:{l:"A-Level",c:T.rd,bg:T.rda},gcse:{l:"GCSE",c:T.gr,bg:T.gra},pre:{l:"Pre-GCSE",c:T.te,bg:T.tea},preib:{l:"Pre-IB",c:T.am,bg:T.ama},ap:{l:"AP",c:T.am,bg:T.ama},hon:{l:"Honors",c:T.am,bg:T.ama},ms:{l:"Middle School",c:T.te,bg:T.tea},us:{l:"US Curriculum",c:T.bl,bg:T.bla}};
function SubIcon({sub,col,size=20}){
  const s={color:col,opacity:.8,flexShrink:0};
  if(sub==="chem") return <FlaskConical size={size} style={s} strokeWidth={1.5}/>;
  if(sub==="sci") return <Microscope size={size} style={s} strokeWidth={1.5}/>;
  return <DraftingCompass size={size} style={s} strokeWidth={1.5}/>;
}

/* ─── MOCK USERS ──────────────────────────────────────────────────── */
const USERS=[
  {id:"u1",email:"student@demo.com",pw:"demo",name:"Alex Chen",role:"student",av:"AC",
   enrollments:[{id:"e1",courseId:"ib-aa-hl",pkg:"full",credits:50,used:9,enrolledAt:"2025-09-01",
     completedLessons:[1,2,3,4,5,6,7,8,9],
     bookings:[
       {id:"b1",date:"2025-11-22",time:"15:30",ln:10,status:"scheduled",zoom:"https://zoom.us/j/123456789?pwd=abc",meetingId:"123 456 789",tutor:"Lynda Badmus"},
       {id:"b2",date:"2025-11-26",time:"16:30",ln:11,status:"scheduled",zoom:"https://zoom.us/j/987654321?pwd=xyz",meetingId:"987 654 321",tutor:"Dr. Sarah Mills"},
       {id:"b3",date:"2025-11-15",time:"15:30",ln:9,status:"completed",zoom:"",meetingId:"",tutor:"Lynda Badmus"},
     ],
     assessments:[
       {id:"a1",title:"Diagnostic Assessment",type:"baseline",score:62,max:100,date:"2025-09-03",done:true,notes:"Strong on algebra. Complex numbers need work.",strengths:["Clear working","Algebra solid"],work:["Complex numbers","Proof writing"]},
       {id:"a2",title:"Unit 1–2 Topic Check",type:"topic_check",score:37,max:50,date:"2025-10-08",done:true,notes:"Good improvement. Binomial theorem solid.",strengths:["Binomial technique","GDC use"],work:["Arithmetic series proofs","Sigma notation"]},
       {id:"a3",title:"Mid-Course Assessment",type:"mid_course",score:null,max:100,done:false},
       {id:"a4",title:"End-of-Course Mock",type:"final",score:null,max:100,done:false},
     ]
   }]
  },
  {id:"u2",email:"parent@demo.com",pw:"demo",name:"Wei Chen",role:"parent",av:"WC",childId:"u1",childName:"Alex Chen"},
  {id:"u3",email:"tutor@demo.com",pw:"demo",name:"Dr. Sarah Mills",role:"tutor",av:"SM",payRate:25,
   sessions:[
     {id:"s1",student:"Alex Chen",course:"IB Math AA HL",date:"2025-11-22",time:"15:30",dur:60,status:"upcoming",zoom:"https://zoom.us/j/123456789?pwd=abc",meetingId:"123 456 789",amount:25,payStatus:null},
     {id:"s2",student:"Jamie Lee",course:"IB Math AI SL",date:"2025-11-23",time:"16:30",dur:60,status:"upcoming",zoom:"https://zoom.us/j/555444333?pwd=def",meetingId:"555 444 333",amount:25,payStatus:null},
     {id:"s3",student:"Alex Chen",course:"IB Math AA HL",date:"2025-11-15",time:"15:30",dur:60,status:"completed",zoom:"",meetingId:"",amount:25,payStatus:"paid"},
     {id:"s4",student:"Sophie K.",course:"GCSE Maths",date:"2025-11-13",time:"17:30",dur:60,status:"completed",zoom:"",meetingId:"",amount:25,payStatus:"pending"},
   ],
   invoices:[
     {id:"inv1",period:"Oct 2025",sessions:8,hours:8,rate:25,total:200,status:"paid",submitted:"2025-11-01",paid:"2025-11-07"},
     {id:"inv2",period:"Nov 2025",sessions:4,hours:4,rate:25,total:100,status:"pending",submitted:"2025-11-18"},
   ]
  },
  {id:"u4",email:"admin@lbe.com",pw:"admin",name:"Lynda Badmus",role:"admin",av:"LB"},
];

const ADM={
  tutors:[
    {id:"t1",name:"Dr. Sarah Mills",email:"tutor@demo.com",status:"active",subjects:["Mathematics"],sessions:58,payRate:25,pending:100},
    {id:"t2",name:"James Okafor",email:"james@lbe.com",status:"active",subjects:["Chemistry"],sessions:32,payRate:22,pending:154},
    {id:"t3",name:"Priya Nair",email:"priya@lbe.com",status:"pending",subjects:["Math","Chem"],sessions:0,payRate:20,pending:0},
  ],
  students:[
    {id:"s1",name:"Alex Chen",course:"IB Math AA HL",credits:41,done:9,joined:"2025-09-01"},
    {id:"s2",name:"Jamie Lee",course:"IB Math AI SL",credits:13,done:2,joined:"2025-10-05"},
    {id:"s3",name:"Sophie K.",course:"GCSE Maths",credits:18,done:9,joined:"2025-09-15"},
    {id:"s4",name:"Noah Harris",course:"AP Chemistry",credits:30,done:5,joined:"2025-10-20"},
  ],
  bookings:[
    {id:"bk1",student:"Alex Chen",tutor:"Dr. Sarah Mills",course:"IB Math AA HL",date:"2025-11-22",time:"15:30",zoom:"https://zoom.us/j/123456789?pwd=abc",meetingId:"123 456 789",status:"scheduled"},
    {id:"bk2",student:"Jamie Lee",tutor:"Dr. Sarah Mills",course:"IB Math AI SL",date:"2025-11-23",time:"16:30",zoom:"https://zoom.us/j/987654321?pwd=xyz",meetingId:"987 654 321",status:"scheduled"},
    {id:"bk3",student:"Sophie K.",tutor:"Dr. Sarah Mills",course:"GCSE Maths",date:"2025-11-24",time:"17:30",zoom:"",meetingId:"",status:"scheduled"},
    {id:"bk4",student:"Alex Chen",tutor:"Lynda Badmus",course:"IB Math AA HL",date:"2025-11-15",time:"15:30",zoom:"",meetingId:"",status:"completed"},
  ],
  payouts:[
    {id:"p1",tutor:"Dr. Sarah Mills",period:"Oct 2025",hours:8,rate:25,total:200,status:"paid",paidAt:"2025-11-07",ref:"BACS-OCT25-SM"},
    {id:"p2",tutor:"James Okafor",period:"Oct 2025",hours:7,rate:22,total:154,status:"approved"},
    {id:"p3",tutor:"Dr. Sarah Mills",period:"Nov 2025",hours:4,rate:25,total:100,status:"pending"},
    {id:"p4",tutor:"James Okafor",period:"Nov 2025",hours:3,rate:22,total:66,status:"pending"},
  ],
};

const SCORE_DATA=[{w:"W1",s:62,a:57},{w:"W2",s:65,a:59},{w:"W3",s:63,a:61},{w:"W4",s:74,a:63},{w:"W5",s:77,a:65},{w:"W6",s:79,a:67},{w:"W7",s:83,a:69},{w:"W8",s:87,a:71}];
const WEEK_DATA=[{d:"Mon",n:7},{d:"Tue",n:9},{d:"Wed",n:4},{d:"Thu",n:11},{d:"Fri",n:6},{d:"Sat",n:8}];
const UNITS=[{u:"Number & Algebra",p:100,c:T.gr},{u:"Functions",p:85,c:T.bl},{u:"Geometry & Trig",p:62,c:T.am},{u:"Statistics",p:28,c:T.vi},{u:"Calculus",p:0,c:T.ash2}];
const ATCOL={baseline:T.te,topic_check:T.bl,mid_course:T.am,final:T.vi};
const ATLBL={baseline:"Baseline",topic_check:"Topic Check",mid_course:"Mid-Course",final:"Final"};

const AI_SYS=`You are the Course Guide for Lynda Badmus Education ("Academic excellence with purpose.").
Lynda: BEng Chemical Engineering + MSc Mathematics Education (Cambridge) + 12+ years IB/A-Level/GCSE/US curricula.
IB COURSES — 6 SEPARATE (AA≠AI, SL≠HL):
IB Math AA SL (36h £50) AA HL (50h £50) AI SL (30h £50) AI HL (42h £50) Chem SL (32h £50) Chem HL (48h £50)
AA=algebraic/proof (maths/physics/engineering). AI=stats/modelling (social science/business). HL=more content+Paper 3.
Other: A-Level Math/Chem £45 | GCSE £38 | Pre-GCSE/Pre-IB £38-45 | AP/Honors £45 | MS £30 | HS US £38
1 credit = 1 hour = 1 live Zoom session. Packages: Full/Half/Quarter.
Keep replies under 80 words. Warm, precise. End with a clear next step.`;

/* ─── HELPERS ─────────────────────────────────────────────────────── */
const uid=()=>Math.random().toString(36).slice(2,10);
const today=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
const fmtD=s=>s?new Date(s+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"";
const fmt12=t=>{if(!t)return"";const[h,m]=t.split(":").map(Number);return`${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;};
const fccy=(g,u,c)=>c==="GBP"?`£${g}`:`$${u}`;
const dow=d=>new Date(d+"T12:00:00").getDay();
const ptc=(s,m)=>Math.round(s/m*100);
const gc=p=>p>=80?T.gr:p>=65?T.bl:p>=50?T.am:T.rd;
const wkDates=off=>{const n=new Date();n.setDate(n.getDate()+off*7);const m=new Date(n);m.setDate(n.getDate()-((n.getDay()||7)-1));return Array.from({length:7},(_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;});};

function useBreakpoint(){
  const[w,sW]=useState(window.innerWidth);
  useEffect(()=>{const f=()=>sW(window.innerWidth);window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);
  return{mobile:w<640,tablet:w>=640&&w<1024,desktop:w>=1024};
}

/* ─── LOGO ────────────────────────────────────────────────────────── */
function Logo({size=32,text=true}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:".75rem",flexShrink:0}}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A07AFF"/>
            <stop offset=".55" stopColor="#5AABFF"/>
            <stop offset="1" stopColor="#00C9AE"/>
          </linearGradient>
          <linearGradient id="logo-ring" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(160,122,255,.6)"/>
            <stop offset="1" stopColor="rgba(0,201,174,.4)"/>
          </linearGradient>
        </defs>
        {/* Outer glow ring */}
        <rect width="40" height="40" rx="12" stroke="url(#logo-ring)" strokeWidth="1.5" fill="none"/>
        {/* Main background */}
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logo-bg)"/>
        {/* Subtle inner shadow overlay */}
        <rect x="2" y="2" width="36" height="36" rx="10" fill="rgba(5,11,26,.18)"/>
        {/* Diamond accent */}
        <polygon points="20,7 33,20 20,33 7,20" stroke="rgba(255,255,255,.18)" strokeWidth="1" fill="none"/>
        {/* LB monogram */}
        <text x="20" y="26" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fontWeight="700" fill="white" letterSpacing=".5">LB</text>
      </svg>
      {text&&<div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:size>28?"1.08rem":".9rem",fontWeight:600,color:T.cr,lineHeight:1.1,letterSpacing:"-.01em"}}>Lynda Badmus</p>
        <p style={{fontFamily:"'Jost',sans-serif",fontSize:size>28?".6rem":".52rem",color:T.ash,letterSpacing:".2em",textTransform:"uppercase",lineHeight:1,marginTop:".12rem",fontWeight:500}}>Tuition</p>
      </div>}
    </div>
  );
}

/* ─── UI ATOMS ────────────────────────────────────────────────────── */
function Btn({ch,v="gold",sz="md",onClick,dis,sx={},type="button"}){
  const[h,sH]=useState(false);
  const S={xl:{p:".9rem 2.2rem",fs:".92rem"},lg:{p:".78rem 1.8rem",fs:".87rem"},md:{p:".58rem 1.2rem",fs:".82rem"},sm:{p:".38rem .9rem",fs:".76rem"},xs:{p:".22rem .6rem",fs:".7rem"}};
  const V={gold:{bg:h?"linear-gradient(135deg,#F5C842,#FF9340)":"linear-gradient(135deg,#FFD060,#F5C842)",c:T.n,b:"none",sh:`0 10px 28px rgba(245,200,66,.35)`},navy:{bg:h?T.n3:T.n2,c:T.cr,b:`1px solid ${T.rl}`},outline:{bg:"transparent",c:h?T.g2:T.gd,b:`1px solid ${T.gd}`},ghost:{bg:h?"rgba(255,255,255,.06)":"transparent",c:h?T.cr:T.ash,b:`1px solid ${T.r2}`},success:{bg:h?"#228A5A":T.gr,c:"#fff",b:"none"},danger:{bg:h?"#A03A3A":T.rd,c:"#fff",b:"none"}};
  const v2=V[v]||V.gold;const sz2=S[sz]||S.md;
  return<button type={type} disabled={dis} onClick={onClick} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{fontFamily:"inherit",fontWeight:500,borderRadius:8,cursor:dis?"not-allowed":"pointer",transition:"all .18s",display:"inline-flex",alignItems:"center",gap:".4rem",whiteSpace:"nowrap",opacity:dis?.5:1,padding:sz2.p,fontSize:sz2.fs,background:v2.bg,color:v2.c,border:v2.b,boxShadow:v2.sh||"none",...sx}}>{ch}</button>;
}

function Modal({title,ch,onClose,wide=false}){
  useEffect(()=>{const f=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",f);return()=>window.removeEventListener("keydown",f);},[onClose]);
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(5,12,24,.82)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",backdropFilter:"blur(8px)"}}>
      <div className="rise" style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:20,width:"100%",maxWidth:wide?880:560,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:T.s3}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.2rem 1.75rem",borderBottom:`1px solid ${T.rl}`,flexShrink:0}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:400}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.ash,fontSize:"1.5rem",cursor:"pointer",lineHeight:1}}>&times;</button>
        </div>
        <div style={{padding:"1.75rem",overflowY:"auto",flex:1}}>{ch}</div>
      </div>
    </div>
  );
}

function Inp({label,val,onChange,as,type,opts,ph,rows,hint}){
  const[f,sF]=useState(false);
  const s={width:"100%",background:T.n3,border:`1px solid ${f?T.gd:T.rl}`,borderRadius:8,padding:".62rem 1rem",fontSize:".85rem",color:T.cr,outline:"none",transition:"border-color .18s",fontFamily:"inherit"};
  return(
    <div style={{marginBottom:"1rem"}}>
      {label&&<label style={{display:"block",fontSize:".68rem",fontWeight:500,letterSpacing:".1em",textTransform:"uppercase",color:T.ash,marginBottom:".38rem"}}>{label}</label>}
      {as==="select"?<select value={val} onChange={onChange} onFocus={()=>sF(true)} onBlur={()=>sF(false)} style={{...s,appearance:"none"}}>{(opts||[]).map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}</select>
      :as==="textarea"?<textarea value={val} onChange={onChange} placeholder={ph} rows={rows||3} onFocus={()=>sF(true)} onBlur={()=>sF(false)} style={{...s,resize:"vertical"}}/>
      :<input type={type||"text"} value={val} onChange={onChange} placeholder={ph} onFocus={()=>sF(true)} onBlur={()=>sF(false)} style={s}/>}
      {hint&&<p style={{fontSize:".72rem",color:T.ash2,marginTop:".3rem"}}>{hint}</p>}
    </div>
  );
}

function Tag({l,c,bg,sz}){
  const col=c||T.gd;return<span style={{background:bg||col+"18",color:col,border:`1px solid ${col}28`,borderRadius:4,padding:sz==="xs"?".15rem .45rem":".22rem .65rem",fontSize:sz==="xs"?".62rem":".7rem",fontWeight:600,letterSpacing:".06em",whiteSpace:"nowrap",display:"inline-block"}}>{l}</span>;
}

function PBar({p,col,h=5}){
  return<div style={{background:T.r2,borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(p||0,100)}%`,height:"100%",background:col||T.gd,borderRadius:99,transition:"width .6s ease"}}/></div>;
}

function SBadge({s}){
  const m={active:{c:T.gr,bg:T.gra,l:"Active"},pending:{c:T.am,bg:T.ama,l:"Pending"},paid:{c:T.gr,bg:T.gra,l:"Paid"},approved:{c:T.bl,bg:T.bla,l:"Approved"},scheduled:{c:T.bl,bg:T.bla,l:"Scheduled"},completed:{c:T.gr,bg:T.gra,l:"Completed"},upcoming:{c:T.bl,bg:T.bla,l:"Upcoming"}};
  const x=m[s]||{c:T.am,bg:T.ama,l:s};return<Tag l={x.l} c={x.c} bg={x.bg}/>;
}

function CurrToggle({cur,set}){
  return(
    <div style={{display:"flex",border:`1px solid ${T.rl}`,borderRadius:8,overflow:"hidden",flexShrink:0}}>
      {[["GBP","£"],["USD","$"]].map(([c,s])=>(
        <button key={c} onClick={()=>set(c)} style={{background:cur===c?T.gd:"transparent",color:cur===c?T.n:T.ash,border:"none",padding:".38rem .85rem",fontSize:".72rem",fontWeight:600,cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}}>{s} {c}</button>
      ))}
    </div>
  );
}

/* ─── ZOOM CARD ───────────────────────────────────────────────────── */
function ZoomCard({link,meetingId,date,time,course,tutor,status,compact=false}){
  const up=status==="scheduled"||status==="upcoming";
  return(
    <div style={{background:up?T.bla:"transparent",border:`1px solid ${up?T.bl+"50":T.r2}`,borderRadius:10,padding:compact?"1rem":"1.1rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".45rem",flexWrap:"wrap",gap:".4rem"}}>
        <div>
          <p style={{fontWeight:600,fontSize:compact?".82rem":".88rem",marginBottom:".15rem"}}>{fmtD(date)} · {fmt12(time)}</p>
          {course&&<p style={{fontSize:".74rem",color:T.ash}}>{course}{tutor?` · ${tutor}`:""}</p>}
        </div>
        <SBadge s={status}/>
      </div>
      {up&&(
        link?(
          <div style={{marginTop:".5rem",display:"flex",gap:".65rem",alignItems:"center",flexWrap:"wrap"}}>
            <a href={link} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#2D8CFF",color:"#fff",borderRadius:8,padding:".35rem .9rem",fontSize:".78rem",fontWeight:600,textDecoration:"none"}}>
              <Video size={13}/> Join Zoom Session
            </a>
            {meetingId&&<p style={{fontSize:".68rem",color:T.ash}}>ID: {meetingId}</p>}
          </div>
        ):(
          <p style={{fontSize:".75rem",color:T.ash,fontStyle:"italic",marginTop:".4rem"}}>🎥 Zoom link pending — admin will add before session</p>
        )
      )}
    </div>
  );
}

function Stat({v,l,c,delta}){
  return(
    <div>
      <div style={{display:"flex",alignItems:"baseline",gap:".45rem"}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.2rem",fontWeight:300,color:c||T.gd,lineHeight:1}}>{v}</span>
        {delta&&<span style={{fontSize:".72rem",color:delta>0?T.gr:T.rd}}>{delta>0?"↑":"↓"}{Math.abs(delta)}%</span>}
      </div>
      <p style={{fontSize:".7rem",color:T.ash,marginTop:".18rem"}}>{l}</p>
    </div>
  );
}

/* ─── TOP NAV ─────────────────────────────────────────────────────── */
function TopNav({pg,go,cur,setCur,user,logout,bp,drawerOpen,setDrawerOpen}){
  const[sc,sSc]=useState(false);
  useEffect(()=>{const f=()=>sSc(window.scrollY>40);window.addEventListener("scroll",f,{passive:true});return()=>window.removeEventListener("scroll",f);},[]);
  const inApp=["dashboard","my-courses","booking","assessments","progress","account","parent","par-assess","par-sessions","par-billing","tutor-dash","tutor-schedule","tutor-hours","tutor-invoices","admin","admin-tutors","admin-students","admin-courses","admin-bookings","admin-payouts"].includes(pg);
  const solid=sc||inApp;
  const navItems=[["home","Home"],["about","About"],["courses","Courses"],["pricing","Pricing"],["faqs","FAQs"],["contact","Contact"]];
  return(
    <header style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:solid?"rgba(5,11,26,.97)":"transparent",backdropFilter:solid?"blur(20px)":"none",borderBottom:solid?`1px solid ${T.rl}`:`1px solid rgba(245,200,66,.08)`,transition:"all .3s"}}>
      <div style={{maxWidth:1360,margin:"0 auto",display:"flex",alignItems:"center",height:66,padding:"0 1.5rem",gap:"1rem"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}><Logo size={bp.mobile?28:32}/></button>
        {bp.desktop&&(
          <nav style={{display:"flex",gap:0,flex:1}}>
            {navItems.map(([id,l])=>(
              <button key={id} onClick={()=>go(id)} style={{background:"none",border:"none",borderBottom:pg===id?`2px solid ${T.gd}`:"2px solid transparent",color:pg===id?T.gd:T.ash,fontFamily:"inherit",fontWeight:500,fontSize:".72rem",letterSpacing:".1em",textTransform:"uppercase",padding:".3rem .85rem",cursor:"pointer",transition:"color .18s",whiteSpace:"nowrap"}}>{l}</button>
            ))}
          </nav>
        )}
        <div style={{display:"flex",alignItems:"center",gap:bp.mobile?".5rem":".85rem",marginLeft:"auto"}}>
          {!bp.mobile&&<CurrToggle cur={cur} set={setCur}/>}
          {!bp.mobile&&!bp.tablet&&user&&<Btn ch={user.role==="admin"?"Admin":user.role==="tutor"?"Tutor":user.role==="parent"?"Parent":"Dashboard"} v="navy" sz="sm" onClick={()=>go(user.role==="admin"?"admin":user.role==="tutor"?"tutor-dash":user.role==="parent"?"parent":"dashboard")}/>}
          {!bp.mobile&&!bp.tablet&&user&&<Btn ch="Sign Out" v="ghost" sz="sm" onClick={logout}/>}
          {!bp.mobile&&!bp.tablet&&!user&&<Btn ch="Sign In" v="ghost" sz="sm" onClick={()=>go("login")}/>}
          {!bp.mobile&&!bp.tablet&&!user&&<Btn ch="Courses" v="gold" sz="sm" onClick={()=>go("courses")}/>}
          {(bp.mobile||bp.tablet)&&(
            <button onClick={()=>setDrawerOpen(true)} style={{background:"none",border:`1px solid ${T.rl}`,color:T.ash,borderRadius:8,padding:".4rem .6rem",cursor:"pointer",display:"flex",alignItems:"center",lineHeight:1}}>
              <Menu size={18}/>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── SIDE DRAWER (mobile/tablet) ────────────────────────────────── */
function SideDrawer({pg,go,cur,setCur,user,logout,open,onClose}){
  const navItems=[["home","Home"],["about","About"],["courses","Courses"],["pricing","Pricing"],["faqs","FAQs"],["contact","Contact"]];
  return(
    <>
      <div className={`overlay${open?" open":""}`} onClick={onClose}/>
      <div className={`drawer${open?" open":""}`}>
        <div style={{padding:"1.2rem 1.5rem",borderBottom:`1px solid ${T.rl}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Logo size={30}/><button onClick={onClose} style={{background:"none",border:"none",color:T.ash,cursor:"pointer"}}><X size={20}/></button>
        </div>
        <div style={{padding:"1rem 0"}}>
          {navItems.map(([id,l])=>(
            <button key={id} onClick={()=>{go(id);onClose();}} style={{display:"block",width:"100%",background:"none",border:"none",borderLeft:`3px solid ${pg===id?T.gd:"transparent"}`,color:pg===id?T.gd:T.ash,fontFamily:"inherit",fontWeight:pg===id?600:400,fontSize:".88rem",padding:".72rem 1.4rem",cursor:"pointer",textAlign:"left",transition:"all .18s"}}>{l}</button>
          ))}
        </div>
        <div style={{padding:".85rem 1.25rem",borderTop:`1px solid ${T.rl}`}}>
          <CurrToggle cur={cur} set={setCur}/>
          <div style={{display:"flex",flexDirection:"column",gap:".6rem",marginTop:"1rem"}}>
            {user?(
              <>
                <Btn ch={user.role==="admin"?"Admin Dashboard":user.role==="tutor"?"Tutor Portal":user.role==="parent"?"Parent Portal":"Dashboard"} v="gold" sx={{width:"100%",justifyContent:"center"}} onClick={()=>{go(user.role==="admin"?"admin":user.role==="tutor"?"tutor-dash":user.role==="parent"?"parent":"dashboard");onClose();}}/>
                <Btn ch="Sign Out" v="ghost" sx={{width:"100%",justifyContent:"center"}} onClick={()=>{logout();onClose();}}/>
              </>
            ):(
              <>
                <Btn ch="Sign In" v="navy" sx={{width:"100%",justifyContent:"center"}} onClick={()=>{go("login");onClose();}}/>
                <Btn ch="Browse Courses" v="gold" sx={{width:"100%",justifyContent:"center"}} onClick={()=>{go("courses");onClose();}}/>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── APP SIDEBAR ─────────────────────────────────────────────────── */
function Sidebar({pg,go,user,bp,open,onClose}){
  const sLinks=[["dashboard",<HomeIcon size={15}/>,"Dashboard"],["my-courses",<BookOpen size={15}/>,"My Courses"],["booking",<Calendar size={15}/>,"Book Lessons"],["assessments",<ClipboardList size={15}/>,"Assessments"],["progress",<TrendingUp size={15}/>,"Progress"],["account",<Settings size={15}/>,"Account"]];
  const pLinks=[["parent",<HomeIcon size={15}/>,"Overview"],["par-assess",<Award size={15}/>,"Assessments"],["par-sessions",<Calendar size={15}/>,"Sessions"],["par-billing",<CreditCard size={15}/>,"Billing"]];
  const tLinks=[["tutor-dash",<HomeIcon size={15}/>,"Dashboard"],["tutor-schedule",<Calendar size={15}/>,"Schedule"],["tutor-hours",<Clock size={15}/>,"Hours Log"],["tutor-invoices",<CreditCard size={15}/>,"Invoices"]];
  const aLinks=[["admin",<HomeIcon size={15}/>,"Overview"],["admin-tutors",<Users size={15}/>,"Tutors"],["admin-students",<GraduationCap size={15}/>,"Students"],["admin-courses",<BookOpen size={15}/>,"Courses"],["admin-bookings",<Calendar size={15}/>,"Bookings"],["admin-payouts",<CreditCard size={15}/>,"Payouts"]];
  const links=user?.role==="admin"?aLinks:user?.role==="tutor"?tLinks:user?.role==="parent"?pLinks:sLinks;
  const rc={student:T.bl,parent:T.te,tutor:T.am,admin:T.gd}[user?.role]||T.gd;
  const rl={student:"Student Portal",parent:"Parent Portal",tutor:"Tutor Portal",admin:"Platform Admin"}[user?.role]||"Portal";
  const inner=(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"1.2rem 1.2rem .9rem",borderBottom:`1px solid ${T.rl}`}}>
        {(bp.mobile||bp.tablet)&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}><Logo size={28}/><button onClick={onClose} style={{background:"none",border:"none",color:T.ash,cursor:"pointer"}}><X size={18}/></button></div>}
        {!bp.mobile&&!bp.tablet&&<Logo size={28}/>}
        <div style={{display:"flex",alignItems:"center",gap:".7rem",marginTop:bp.mobile||bp.tablet?0:"1rem",paddingTop:bp.mobile||bp.tablet?0:"1rem",borderTop:bp.mobile||bp.tablet?"none":`1px solid ${T.r2}`}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:rc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,color:T.n,flexShrink:0}}>{user?.av||"?"}</div>
          <div style={{minWidth:0}}><p style={{fontSize:".82rem",fontWeight:600,color:T.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</p><p style={{fontSize:".62rem",color:T.ash,marginTop:1}}>{rl}</p></div>
        </div>
      </div>
      <nav style={{flex:1,padding:".5rem 0"}}>
        {links.map(([id,icon,lbl])=>{
          const act=pg===id;
          return<button key={id} onClick={()=>{go(id);if(bp.mobile||bp.tablet)onClose?.();}} style={{width:"100%",background:act?`${rc}15`:"none",border:"none",borderLeft:`3px solid ${act?rc:"transparent"}`,display:"flex",alignItems:"center",gap:".82rem",padding:".7rem 1.2rem",cursor:"pointer",fontSize:".8rem",fontWeight:act?600:400,color:act?rc:T.ash,transition:"all .18s",fontFamily:"inherit",textAlign:"left"}}><span style={{opacity:act?1:.7}}>{icon}</span>{lbl}</button>;
        })}
      </nav>
      <div style={{padding:".85rem 1.2rem",borderTop:`1px solid ${T.rl}`}}>
        <Btn ch="← Public Site" v="ghost" sz="xs" onClick={()=>{go("home");onClose?.();}} sx={{width:"100%",justifyContent:"center"}}/>
      </div>
    </div>
  );
  if(bp.mobile||bp.tablet){
    return(
      <>
        <div className={`overlay${open?" open":""}`} onClick={onClose}/>
        <div className={`drawer${open?" open":""}`}>{inner}</div>
      </>
    );
  }
  return<aside style={{width:212,background:"rgba(8,15,28,.98)",borderRight:`1px solid ${T.rl}`,display:"flex",flexDirection:"column",height:"100%",flexShrink:0}}>{inner}</aside>;
}

/* ─── FOOTER ──────────────────────────────────────────────────────── */
function Footer({go,bp}){
  return(
    <footer style={{background:T.n2,borderTop:`1px solid ${T.rl}`,padding:`3.5rem 0 2rem`}}>
      <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${bp?.mobile?"1.5rem":"2rem"}`}}>
        <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr 1fr":"2fr 1fr 1fr 1fr",gap:"2rem",marginBottom:"2.5rem"}}>
          <div>
            <Logo size={34}/><p style={{fontSize:".82rem",color:T.ash,lineHeight:1.7,maxWidth:240,marginTop:".9rem",fontWeight:300}}>Premium academic tuition. IB · A-Level · GCSE · AP · US curriculum.</p>
            <p style={{fontSize:".7rem",color:T.ash2,fontStyle:"italic",marginTop:".5rem"}}>"Academic excellence with purpose."</p>
          </div>
          {!bp?.mobile&&[{h:"Courses",ls:[["courses","All Courses"],["courses","IB Diploma"],["courses","A-Level"],["courses","GCSE"]]},{h:"Platform",ls:[["pricing","Pricing"],["faqs","FAQs"],["about","About"],["contact","Contact"]]},{h:"Account",ls:[["login","Sign In"],["signup","Sign Up"],["dashboard","Dashboard"],["parent","Parent Portal"]]}].map(col=>(
            <div key={col.h}>
              <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.gd,marginBottom:"1rem"}}>{col.h}</p>
              {col.ls.map(([id,l])=><button key={l} onClick={()=>go(id)} style={{display:"block",background:"none",border:"none",color:T.ash,fontSize:".82rem",cursor:"pointer",fontFamily:"inherit",padding:".25rem 0",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.color=T.gd} onMouseLeave={e=>e.currentTarget.style.color=T.ash}>{l}</button>)}
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${T.rl}`,paddingTop:"1.5rem",display:"flex",justifyContent:"space-between",fontSize:".7rem",color:T.ash2,flexWrap:"wrap",gap:".5rem"}}>
          <span>© {new Date().getFullYear()} Lynda Badmus Education. All rights reserved.</span>
          <span>IB AA SL/HL · AI SL/HL · Chem SL/HL · A-Level · GCSE · AP · Zoom live sessions</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PUBLIC PAGES
═══════════════════════════════════════════════════════════════════ */

function Home({go,cur,bp}){
  const p=bp?.mobile?"1.25rem":"2rem";
  return(
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"flex-end",paddingBottom:"5rem",position:"relative",overflow:"hidden"}}>
        {/* Rich background */}
        <div style={{position:"absolute",inset:0,background:`linear-gradient(175deg,${T.n} 0%,${T.n2} 100%)`}}/>
        {/* Colored glow orbs */}
        <div className="glow-pulse" style={{position:"absolute",top:"8%",left:"62%",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(160,122,255,.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div className="glow-pulse" style={{position:"absolute",top:"40%",left:"75%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(90,171,255,.14) 0%,transparent 70%)",pointerEvents:"none",animationDelay:"1.4s"}}/>
        <div className="glow-pulse" style={{position:"absolute",bottom:"15%",left:"55%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,145,.12) 0%,transparent 70%)",pointerEvents:"none",animationDelay:"2.2s"}}/>
        {/* Decorative symbols */}
        {!bp?.mobile&&<div className="drift" style={{position:"absolute",right:"4%",top:"42%",transform:"translateY(-50%)",fontFamily:"'Cormorant Garamond',serif",fontSize:"min(28vw,340px)",fontWeight:600,lineHeight:1,background:"linear-gradient(135deg,rgba(245,200,66,.12),rgba(160,122,255,.08))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",userSelect:"none",pointerEvents:"none"}}>∑</div>}
        {!bp?.mobile&&<div className="drift" style={{position:"absolute",right:"20%",bottom:"10%",fontFamily:"'Cormorant Garamond',serif",fontSize:"min(12vw,140px)",fontWeight:300,lineHeight:1,background:"linear-gradient(135deg,rgba(0,212,145,.16),rgba(90,171,255,.1))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",userSelect:"none",pointerEvents:"none",animationDelay:"2s"}}>⚗</div>}
        {/* Thin top accent line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,rgba(245,200,66,.6),rgba(160,122,255,.5),rgba(90,171,255,.4),transparent)"}}/>

        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${p}`,width:"100%",position:"relative"}}>
          {!bp?.mobile&&<div className="rise" style={{marginBottom:"1.4rem",display:"flex",alignItems:"center",gap:".85rem"}}>
            <div style={{height:1,width:40,background:`linear-gradient(90deg,${T.gd},${T.vi})`}}/>
            <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".22em",textTransform:"uppercase",background:`linear-gradient(90deg,${T.gd},${T.vi})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Specialist Maths & Chemistry Tuition · IB · A-Level · GCSE · AP</p>
          </div>}
          <h1 className="rise r1" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"18vw":"10vw"},8.5rem)`,fontWeight:600,lineHeight:.9,letterSpacing:"-.03em",marginBottom:"2.2rem"}}>
            Academic<br/>excellence<br/><em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.gd},${T.am})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>with purpose.</em>
          </h1>
          <p className="rise r2" style={{fontSize:bp?.mobile?".9rem":"1.05rem",color:T.ash,lineHeight:1.82,maxWidth:440,fontWeight:300,marginBottom:"2.5rem"}}>Students enrol in structured courses — lesson by lesson, assessment by assessment — and book live Zoom sessions at their own pace.</p>
          <div className="rise r3" style={{display:"flex",gap:"1rem",flexWrap:"wrap",marginBottom:"3rem"}}>
            <Btn ch="Explore Courses" v="gold" sz={bp?.mobile?"md":"lg"} onClick={()=>go("courses")}/>
            <Btn ch="Meet Lynda" v="outline" sz={bp?.mobile?"md":"lg"} onClick={()=>go("about")}/>
          </div>
          {/* Stats grid — vivid color-coded */}
          <div className="rise r4" style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr 1fr":"repeat(4,1fr)",gap:1,background:"rgba(255,255,255,.06)",borderRadius:14,overflow:"hidden",maxWidth:bp?.mobile?"100%":640}}>
            {[["MSc","Cambridge Maths",T.vi],["12+","Years teaching",T.gd],["20","Courses",T.gr],["6","IB pathways",T.bl]].map(([n,l,c])=>(
              <div key={n} style={{background:T.n2,padding:"1.2rem 1.35rem",borderBottom:`2px solid ${c}`,transition:"background .2s"}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",fontWeight:500,color:c,lineHeight:1,marginBottom:".2rem"}}>{n}</p>
                <p style={{fontSize:".62rem",color:T.ash2,letterSpacing:".04em"}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IB Spotlight ──────────────────────────────────────────── */}
      <section style={{background:T.n2,borderTop:`1px solid ${T.rl}`,borderBottom:`1px solid ${T.rl}`,padding:`${bp?.mobile?"3rem":"4.5rem"} ${p}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 90% 50%,rgba(160,122,255,.08),transparent 55%)"}}/>
        <div style={{maxWidth:1360,margin:"0 auto",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:".85rem",marginBottom:"1.2rem"}}>
            <div style={{height:1,width:32,background:T.vi}}/>
            <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".25em",textTransform:"uppercase",color:T.vi}}>IB Mathematics — 6 Separate Courses · AA ≠ AI · SL ≠ HL</p>
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"8vw":"4vw"},3rem)`,fontWeight:500,marginBottom:`${bp?.mobile?"2rem":"3rem"}`}}>Choose the <em style={{fontStyle:"italic",color:T.vi}}>exact</em> course you study.</h2>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${bp?.mobile?2:3},1fr)`,gap:"1px",background:"rgba(255,255,255,.05)",borderRadius:14,overflow:"hidden"}}>
            {[{id:"ib-aa-sl",l:"Math AA SL",d:"Analysis & Approaches · SL",c:T.vi,sub:"math"},{id:"ib-aa-hl",l:"Math AA HL",d:"Analysis & Approaches · HL",c:T.vi,sub:"math"},{id:"ib-ai-sl",l:"Math AI SL",d:"Applications · SL",c:T.bl,sub:"math"},{id:"ib-ai-hl",l:"Math AI HL",d:"Applications · HL",c:T.bl,sub:"math"},{id:"ib-chem-sl",l:"Chemistry SL",d:"IB Chemistry · SL",c:T.gr,sub:"chem"},{id:"ib-chem-hl",l:"Chemistry HL",d:"IB Chemistry · HL",c:T.gr,sub:"chem"}].map(c=>(
              <button key={c.id} onClick={()=>go("course-"+c.id)} style={{background:T.n2,border:"none",cursor:"pointer",padding:"1.35rem",textAlign:"left",transition:"background .2s",fontFamily:"inherit",borderLeft:`3px solid transparent`}} onMouseEnter={e=>{e.currentTarget.style.background=T.n3;e.currentTarget.style.borderLeftColor=c.c;}} onMouseLeave={e=>{e.currentTarget.style.background=T.n2;e.currentTarget.style.borderLeftColor="transparent";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <Tag l="IB" c={c.c} bg={c.c+"20"} sz="xs"/>
                  <SubIcon sub={c.sub||"math"} col={c.c} size={20}/>
                </div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:bp?.mobile?"1.05rem":"1.15rem",fontWeight:500,color:T.cr,margin:".65rem 0 .25rem"}}>{c.l}</p>
                <p style={{fontSize:".7rem",color:T.ash}}>{c.d}</p>
              </button>
            ))}
          </div>
          <p style={{fontSize:".72rem",color:T.ash,marginTop:"1rem",lineHeight:1.7}}>AA = algebraic/proof-based (maths, physics, engineering). AI = statistics & modelling (social science, business). These are completely different syllabuses — SL and HL are also entirely separate courses.</p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section style={{padding:`${bp?.mobile?"4rem":"7rem"} ${p}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 50%,rgba(0,212,145,.05),transparent 50%)"}}/>
        <div style={{maxWidth:1360,margin:"0 auto",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:".85rem",marginBottom:".85rem"}}>
            <div style={{height:1,width:32,background:T.gr}}/>
            <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".25em",textTransform:"uppercase",color:T.gr}}>How It Works</p>
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"9vw":"5vw"},3.5rem)`,fontWeight:500,marginBottom:`${bp?.mobile?"2.5rem":"4rem"}`}}>Enrol. Learn. <em style={{fontStyle:"italic",color:T.gr}}>Progress.</em></h2>
          <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr 1fr":"repeat(4,1fr)",gap:bp?.mobile?"1.75rem":"0"}}>
            {[["01",T.vi,"Choose a course","Browse 20 structured programmes — each with a lesson-by-lesson plan before you commit."],["02",T.gd,"Select a package","Full, Half, or Quarter. Receive lesson credits to book live Zoom sessions at your pace."],["03",T.bl,"Book via Zoom","Pick a slot from the schedule. One booking uses one credit. Zoom link appears instantly."],["04",T.gr,"Track progress","Lesson completions, assessment scores, tutor feedback, and credits remaining — all in one place."]].map((s,i)=>(
              <div key={s[0]} style={{paddingRight:!bp?.mobile&&!bp?.tablet?"2.5rem":"0",paddingLeft:!bp?.mobile&&!bp?.tablet&&i>0?"2.5rem":"0",borderRight:!bp?.mobile&&!bp?.tablet&&i<3?`1px solid ${T.r2}`:"none"}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.5rem",fontWeight:600,color:s[1],marginBottom:"1.25rem",lineHeight:1}}>{s[0]}</p>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:500,color:T.cr,marginBottom:".55rem"}}>{s[2]}</p>
                <p style={{fontSize:".83rem",color:T.ash,lineHeight:1.75,fontWeight:300}}>{s[3]}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"3.5rem"}}>
            <Btn ch="Browse All Courses →" v="gold" sz="lg" onClick={()=>go("courses")}/>
          </div>
        </div>
      </section>

      {/* ── Why Lynda ────────────────────────────────────────────── */}
      <section style={{background:T.n2,borderTop:`1px solid ${T.rl}`,padding:`${bp?.mobile?"4rem":"7rem"} ${p}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 50%,rgba(245,200,66,.06),transparent 50%)"}}/>
        <div style={{maxWidth:1360,margin:"0 auto",display:"grid",gridTemplateColumns:bp?.mobile||bp?.tablet?"1fr":"1fr 1fr",gap:bp?.mobile?"2.5rem":"7rem",alignItems:"center",position:"relative"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:".85rem",marginBottom:".85rem"}}>
              <div style={{height:1,width:32,background:T.gd}}/>
              <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".25em",textTransform:"uppercase",color:T.gd}}>Why Lynda Badmus Education</p>
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"9vw":"5vw"},3.5rem)`,fontWeight:500,lineHeight:1.08,marginBottom:"1.5rem"}}>Most tutors explain.<br/><em style={{fontStyle:"italic",color:T.gd}}>Lynda diagnoses.</em></h2>
            <p style={{fontSize:".92rem",color:T.ash,lineHeight:1.88,fontWeight:300,marginBottom:"2rem"}}>MSc Mathematics Education (Cambridge) + BEng Chemical Engineering + 12+ years across IB, A-Level, GCSE, and American curricula. Every session starts with a diagnostic. Every lesson has a structure.</p>
            <Btn ch="Read Lynda's Story →" v="outline" onClick={()=>go("about")}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"rgba(255,255,255,.05)",borderRadius:14,overflow:"hidden"}}>
            {[["MSc Cambridge","Mathematics Education",T.vi],["BEng","Chemical Engineering",T.gr],["12+ years","UK & US schools",T.bl],["IB · A-Level · GCSE · AP","All major curricula",T.gd]].map(([n,l,c])=>(
              <div key={n} style={{background:T.n2,padding:"1.65rem",borderBottom:`3px solid ${c}`}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.35rem",fontWeight:500,color:c,marginBottom:".35rem"}}>{n}</p>
                <p style={{fontSize:".73rem",color:T.ash}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{padding:`${bp?.mobile?"5rem":"8rem"} ${p}`,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(160,122,255,.1) 0%,rgba(245,200,66,.06) 40%,transparent 70%)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(160,122,255,.4),rgba(245,200,66,.4),transparent)"}}/>
        <div style={{maxWidth:640,margin:"0 auto",position:"relative"}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"10vw":"6vw"},4.5rem)`,fontWeight:600,lineHeight:1.05,marginBottom:"1.5rem"}}>Your strongest year starts with the <em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.gd},${T.vi})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>right course.</em></h2>
          <p style={{fontSize:".92rem",color:T.ash,lineHeight:1.85,maxWidth:420,margin:"0 auto 2.5rem",fontWeight:300}}>Browse the catalogue, enrol in a structured programme, and book your first Zoom session within 24 hours.</p>
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <Btn ch="Browse All Courses" v="gold" sz={bp?.mobile?"md":"xl"} onClick={()=>go("courses")}/>
            <Btn ch="Sign Up Free" v="outline" sz={bp?.mobile?"md":"xl"} onClick={()=>go("signup")}/>
          </div>
        </div>
      </section>
      <Footer go={go} bp={bp}/>
    </div>
  );
}

function About({go,bp}){
  const p=bp?.mobile?"1.5rem":"2rem";
  return(
    <div style={{paddingTop:66}}>
      <section style={{background:T.n2,padding:`${bp?.mobile?"5rem":"7rem"} ${p} 4rem`,borderBottom:`1px solid ${T.rl}`}}>
        <div style={{maxWidth:1360,margin:"0 auto"}}>
          <p style={{fontSize:".65rem",color:T.gd,letterSpacing:".25em",textTransform:"uppercase",marginBottom:".85rem"}}>About Lynda Badmus</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"14vw":"8vw"},6rem)`,fontWeight:300,lineHeight:.96,marginBottom:"3rem"}}>Most tutors explain.<br/><em style={{fontStyle:"italic",color:T.gd}}>Lynda diagnoses.</em></h1>
          <div style={{display:"grid",gridTemplateColumns:bp?.mobile||bp?.tablet?"1fr":"1fr 1.65fr",gap:bp?.mobile?"2.5rem":"7rem",alignItems:"start"}}>
            <div>
              <div style={{background:T.n3,border:`1px solid ${T.rl}`,borderRadius:20,padding:"2.5rem",textAlign:"center",marginBottom:"1.5rem"}}>
                {/* ── Drop your headshot at src/assets/lynda.jpg ── */}
                <div style={{position:"relative",width:160,height:160,margin:"0 auto 1.4rem"}}>
                  <div style={{position:"absolute",inset:-3,borderRadius:"50%",background:`linear-gradient(135deg,${T.gd},${T.vi})`,zIndex:0}}/>
                  <div style={{position:"relative",width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",border:`3px solid ${T.n3}`,zIndex:1,background:`linear-gradient(135deg,${T.vi},${T.bl})`}}>
                    <img
                      src="/src/assets/lynda.png"
                      alt="Lynda Badmus"
                      onError={e=>{e.currentTarget.style.display="none";e.currentTarget.nextSibling.style.display="flex";}}
                      style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}
                    />
                    <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"2.5rem",fontWeight:500,color:"#fff"}}>LB</div>
                  </div>
                </div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:400,marginBottom:".3rem"}}>Lynda Badmus</p>
                <p style={{fontSize:".75rem",color:T.gd,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".2rem"}}>Founder & Principal Tutor</p>
                <p style={{fontSize:".68rem",color:T.ash}}>MSc Mathematics Education, Cambridge</p>
              </div>
              {[["Post-grad","MSc Mathematics Education — University of Cambridge"],["Degree","BEng Chemical Engineering"],["Experience","12+ years teaching & leadership"],["Curricula","IB · A-Level · GCSE · US Curriculum"],["Schools","Prestigious UK & US institutions"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:".72rem 0",borderBottom:`1px solid ${T.r2}`}}>
                  <span style={{fontSize:".68rem",color:T.ash2,letterSpacing:".08em",textTransform:"uppercase"}}>{k}</span>
                  <span style={{fontSize:".82rem",color:T.ash,textAlign:"right",maxWidth:"57%"}}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{width:36,height:3,background:T.gd,borderRadius:2,marginBottom:"2rem"}}/>
              {["Lynda Badmus holds a Bachelor's degree in Chemical Engineering and a Master's degree in Mathematics Education from the University of Cambridge. This rare combination of scientific rigour and deep pedagogical expertise shapes every lesson she teaches.",
               "Over 12 years, she has worked across prestigious schools in the United Kingdom and the United States, teaching IB, GCSE, A-Level, and American curriculum students from Middle School through to IB Higher Level.",
               "Her approach rests on one principle: students don't fail because they lack ability — they fail because one conceptual gap was never properly addressed. Every course starts with a diagnostic. Every lesson has a structure. Every student has a plan."].map((para,i)=>(
                <p key={i} style={{fontSize:".92rem",color:T.ash,lineHeight:1.85,fontWeight:300,marginBottom:"1.4rem"}}>{para}</p>
               ))}
              <Btn ch="Browse All Courses →" v="gold" sx={{marginTop:"1rem"}} onClick={()=>go("courses")}/>
            </div>
          </div>
        </div>
      </section>
      <Footer go={go} bp={bp}/>
    </div>
  );
}

function CoursesPage({go,cur,bp}){
  const[sub,sSub]=useState("all");
  const p=bp?.mobile?"1.5rem":"2rem";
  const groups=[
    {key:"intl",label:"IB & International",accent:T.vi,gs:["ib","preib"],note:"AA ≠ AI · SL ≠ HL — choose your exact programme."},
    {key:"uk",label:"UK Curriculum",accent:T.rd,gs:["al","gcse","pre"],note:"A-Level · GCSE · Pre-GCSE — all major UK exam boards."},
    {key:"us",label:"US Curriculum",accent:T.bl,gs:["ap","hon","us","ms"],note:"AP · Honors · High School · Middle School."},
  ];
  function CourseCard({c}){
    const m=CAT[c.g]||CAT.ib;
    const qP=cur==="GBP"?`£${Math.round(c.hours.q*c.rate.gbp*.96)}`:`$${Math.round(c.hours.q*c.rate.usd*.96)}`;
    return(
      <div onClick={()=>go("course-"+c.id)} style={{background:T.n,cursor:"pointer",transition:"background .2s",border:`1px solid rgba(255,255,255,.07)`,borderRadius:10,overflow:"hidden",borderBottom:`3px solid ${c.col}`}} onMouseEnter={e=>e.currentTarget.style.background=T.n2} onMouseLeave={e=>e.currentTarget.style.background=T.n}>
        <div style={{borderBottom:`1px solid ${T.rl}`,padding:"1.5rem 1.75rem 1.1rem",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{display:"flex",gap:".4rem",marginBottom:".75rem",flexWrap:"wrap"}}>
              <Tag l={m.l} c={m.c} bg={m.bg}/>
              {c.lvl&&<Tag l={c.lvl.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}
              {c.path&&<Tag l={"AA/AI: "+c.path.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}
            </div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:500,marginBottom:".2rem"}}>{c.title}</h3>
            <p style={{fontSize:".72rem",color:T.ash}}>{c.curr}</p>
          </div>
          <SubIcon sub={c.sub} col={c.col} size={22}/>
        </div>
        <div style={{padding:"1.1rem 1.75rem"}}>
          <p style={{fontSize:".81rem",color:T.ash,lineHeight:1.65,marginBottom:"1rem",fontWeight:300}}>{c.desc.slice(0,115)}…</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:".75rem"}}>
            <div><p style={{fontSize:".62rem",color:T.ash2,letterSpacing:".06em"}}>FROM (quarter)</p><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.35rem",fontWeight:500,color:T.gd,lineHeight:1}}>{qP}</p></div>
            <div style={{textAlign:"right"}}><p style={{fontSize:".68rem",color:T.c2}}>{c.hours.full}h full</p><p style={{fontSize:".68rem",color:T.ash}}>{c.lessons} lessons</p></div>
          </div>
        </div>
      </div>
    );
  }
  return(
    <div style={{paddingTop:66}}>
      <section style={{background:T.n2,padding:`4.5rem ${p} 2.5rem`,borderBottom:`1px solid ${T.rl}`}}>
        <div style={{maxWidth:1360,margin:"0 auto"}}>
          <p style={{fontSize:".65rem",color:T.gd,letterSpacing:".25em",textTransform:"uppercase",marginBottom:".75rem"}}>Course Catalogue</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"10vw":"6vw"},4rem)`,fontWeight:300,marginBottom:"1rem"}}>Every curriculum. <em style={{fontStyle:"italic",color:T.gd}}>Every level.</em></h1>
          <div style={{background:T.gdaa,border:`1px solid ${T.rl}`,borderRadius:8,padding:".85rem 1.25rem",maxWidth:580}}>
            <p style={{fontSize:".78rem",color:T.cr,fontWeight:500}}>⚠ IB students: AA ≠ AI · SL ≠ HL. Choose your exact course — each is a separate programme.</p>
          </div>
        </div>
      </section>
      <div style={{background:T.n2,borderBottom:`1px solid ${T.rl}`,position:"sticky",top:66,zIndex:50,padding:".5rem 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${p}`,display:"flex",gap:".5rem",alignItems:"center"}}>
          <span style={{fontSize:".65rem",color:T.ash,letterSpacing:".1em",textTransform:"uppercase",marginRight:".25rem"}}>Filter:</span>
          {[["all","All subjects"],["math","Maths only"],["chem","Chemistry only"],["sci","Science only"]].map(([k,l])=>(
            <button key={k} onClick={()=>sSub(k)} style={{background:sub===k?T.gd:"transparent",color:sub===k?T.n:T.ash,border:`1px solid ${sub===k?T.gd:T.rl}`,borderRadius:20,padding:".25rem .85rem",fontSize:".7rem",cursor:"pointer",fontFamily:"inherit",transition:"all .18s",whiteSpace:"nowrap",fontWeight:sub===k?600:400}}>{l}</button>
          ))}
        </div>
      </div>
      <section style={{padding:`3rem ${p} 5rem`}}>
        <div style={{maxWidth:1360,margin:"0 auto"}}>
          {groups.map(grp=>{
            const courses=COURSES.filter(c=>grp.gs.includes(c.g)&&(sub==="all"||c.sub===sub));
            if(!courses.length) return null;
            return(
              <div key={grp.key} style={{marginBottom:"4rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:".6rem"}}>
                  <div style={{height:2,width:28,background:grp.accent,borderRadius:2}}/>
                  <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:bp?.mobile?"1.6rem":"2rem",fontWeight:500,color:T.cr}}>{grp.label}</h2>
                  <div style={{height:"1px",flex:1,background:`linear-gradient(90deg,${grp.accent}30,transparent)`}}/>
                </div>
                <p style={{fontSize:".72rem",color:T.ash,marginBottom:"1.5rem",marginLeft:"2.75rem"}}>{grp.note} · {courses.length} course{courses.length!==1?"s":""}</p>
                <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr 1fr":"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem"}}>
                  {courses.map(c=><CourseCard key={c.id} c={c}/>)}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer go={go} bp={bp}/>
    </div>
  );
}

function CourseDetail({courseId,go,cur,user,setUser,bp}){
  const c=COURSES.find(x=>x.id===courseId);
  const[selPkg,sSelPkg]=useState("full");
  const[enrolled,sEnrolled]=useState(false);
  const p=bp?.mobile?"1.5rem":"2rem";
  if(!c)return<div style={{paddingTop:80,padding:"5rem 2rem",textAlign:"center"}}><Btn ch="← Back" v="ghost" onClick={()=>go("courses")}/></div>;
  const m=CAT[c.g]||CAT.ib;
  const pkgs={
    full:{l:"Full Course",h:c.hours.full,credits:c.hours.full,gbp:c.hours.full*c.rate.gbp,usd:c.hours.full*c.rate.usd,disc:null},
    half:{l:"Half Course",h:c.hours.half,credits:c.hours.half,gbp:Math.round(c.hours.half*c.rate.gbp*.98),usd:Math.round(c.hours.half*c.rate.usd*.98),disc:"2% off"},
    quarter:{l:"Quarter",h:c.hours.q,credits:c.hours.q,gbp:Math.round(c.hours.q*c.rate.gbp*.96),usd:Math.round(c.hours.q*c.rate.usd*.96),disc:"4% off"},
  };
  const pk=pkgs[selPkg];
  const handleEnrol=()=>{
    if(!user){go("login");return;}
    const ne={id:uid(),courseId:c.id,pkg:selPkg,credits:pk.credits,used:0,completedLessons:[],enrolledAt:today(),bookings:[],assessments:[{id:uid(),title:"Diagnostic Assessment",type:"baseline",score:null,max:100,done:false}]};
    setUser({...user,enrollments:[...(user.enrollments||[]),ne]});
    sEnrolled(true);
  };
  return(
    <div style={{paddingTop:66}}>
      <section style={{background:T.n2,padding:`4.5rem ${p} 3rem`,borderBottom:`1px solid ${T.rl}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 72% 50%,${c.col}08 0%,transparent 55%)`}}/>
        <div style={{maxWidth:1360,margin:"0 auto",position:"relative"}}>
          <button onClick={()=>go("courses")} style={{background:"none",border:"none",color:T.ash,fontSize:".72rem",cursor:"pointer",marginBottom:"1.75rem",fontFamily:"inherit",display:"flex",alignItems:"center",gap:".35rem"}}>← All Courses</button>
          <div style={{display:"grid",gridTemplateColumns:bp?.mobile||bp?.tablet?"1fr":"1fr 360px",gap:bp?.mobile?"2rem":"3.5rem",alignItems:"start"}}>
            <div>
              <div style={{display:"flex",gap:".5rem",marginBottom:"1.2rem",flexWrap:"wrap"}}>
                <Tag l={m.l} c={m.c} bg={m.bg}/>
                {c.lvl&&<Tag l={c.lvl.toUpperCase()+" Level"} c={T.ash} bg={T.r2}/>}
                {c.path&&<Tag l={"Math "+c.path.toUpperCase()} c={T.ash} bg={T.r2}/>}
              </div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"8vw":"5.5vw"},3.2rem)`,fontWeight:300,lineHeight:1.08,marginBottom:".85rem"}}>{c.title}</h1>
              <p style={{fontSize:".9rem",color:T.ash,lineHeight:1.78,maxWidth:540,fontWeight:300,marginBottom:"1.75rem"}}>{c.desc}</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:bp?.mobile?"1rem":"2rem"}}>
                {[[c.hours.full+"h","Full course"],[c.lessons+" lessons","Structured plan"],[c.assess.length+" assessments","Checkpoints"],[fccy(c.rate.gbp,c.rate.usd,cur)+"/hr","Rate"]].map(([v,l])=>(
                  <div key={l}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.45rem",fontWeight:300,color:T.gd,lineHeight:1,marginBottom:".18rem"}}>{v}</p><p style={{fontSize:".65rem",color:T.ash2}}>{l}</p></div>
                ))}
              </div>
              {c.eq&&<div style={{background:T.gdaa,border:`1px solid ${T.rl}`,borderRadius:10,padding:"1rem 1.25rem",marginTop:"1.5rem",display:"inline-flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                <span style={{fontSize:".62rem",color:T.gd,letterSpacing:".1em",textTransform:"uppercase"}}>{c.eq.l}</span>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.cr}}>{c.eq.d}</span>
              </div>}
            </div>
            <div style={{background:T.n,border:`1px solid ${T.rl}`,borderRadius:20,padding:"1.75rem",boxShadow:T.s2}}>
              <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".16em",textTransform:"uppercase",color:T.gd,marginBottom:"1.1rem"}}>Choose Package</p>
              {Object.entries(pkgs).map(([k,pk2])=>(
                <button key={k} onClick={()=>sSelPkg(k)} style={{background:selPkg===k?T.gdaa:"transparent",border:`1px solid ${selPkg===k?c.col:T.rl}`,borderRadius:8,padding:".95rem 1.1rem",cursor:"pointer",textAlign:"left",width:"100%",transition:"all .18s",marginBottom:".55rem",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
                  <div><p style={{fontWeight:500,fontSize:".88rem",color:T.cr,marginBottom:".18rem"}}>{pk2.l}</p><p style={{fontSize:".72rem",color:T.ash}}>{pk2.credits} credits · {pk2.h}h{pk2.disc&&<span style={{color:T.gr,marginLeft:".4rem"}}>{pk2.disc}</span>}</p></div>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:300,color:selPkg===k?c.col:T.gd,lineHeight:1}}>{cur==="GBP"?`£${pk2.gbp}`:`$${pk2.usd}`}</p>
                </button>
              ))}
              <div style={{height:1,background:T.rl,margin:"1rem 0"}}/>
              <div style={{background:T.bla,border:`1px solid ${T.bl}40`,borderRadius:8,padding:".85rem",marginBottom:".9rem"}}>
                <p style={{fontSize:".75rem",fontWeight:600,color:T.bl,marginBottom:".3rem"}}>🎥 Zoom Integration</p>
                <p style={{fontSize:".72rem",color:T.ash,lineHeight:1.5}}>All sessions live via Zoom. Your link appears in your dashboard after booking. Phase 2: auto-generated on confirmation.</p>
              </div>
              <Btn ch={enrolled?"✓ Enrolled — Go to Dashboard":`Enrol Now — ${cur==="GBP"?`£${pk.gbp}`:`$${pk.usd}`}`} v="gold" sz="lg" sx={{width:"100%",justifyContent:"center"}} onClick={enrolled?()=>go("dashboard"):handleEnrol}/>
            </div>
          </div>
        </div>
      </section>
      {enrolled&&<div style={{background:T.gdaa,borderBottom:"1px solid rgba(201,168,108,.3)",padding:"1rem 2rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}><p style={{fontSize:".88rem",color:T.gd,fontWeight:500}}>✓ Enrolled — {pk.credits} lesson credits added.</p><Btn ch="Go to Dashboard →" v="gold" sz="sm" onClick={()=>go("dashboard")}/></div>}
      <section style={{padding:`4rem ${p} 5rem`}}>
        <div style={{maxWidth:1360,margin:"0 auto",display:"grid",gridTemplateColumns:bp?.mobile?"1fr":"2fr 1fr",gap:bp?.mobile?"2rem":"3.5rem",alignItems:"start"}}>
          <div>
            <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".16em",textTransform:"uppercase",color:T.gd,marginBottom:"1.25rem"}}>Assessments Included</p>
            {c.assess.map(a=><div key={a} style={{display:"flex",gap:".65rem",padding:".55rem 0",borderBottom:`1px solid ${T.r2}`}}><span style={{color:T.gd,fontSize:".8rem"}}>◈</span><p style={{fontSize:".82rem",color:T.ash}}>{a}</p></div>)}
            <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".16em",textTransform:"uppercase",color:T.gd,margin:"2rem 0 1rem"}}>Target Outcomes</p>
            {c.outcomes.map(o=><div key={o} style={{display:"flex",gap:".65rem",padding:".5rem 0",borderBottom:`1px solid ${T.r2}`}}><span style={{color:T.bl,fontSize:".8rem"}}>→</span><p style={{fontSize:".82rem",color:T.ash,lineHeight:1.5}}>{o}</p></div>)}
          </div>
          <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:14,padding:"1.6rem"}}>
            <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".16em",textTransform:"uppercase",color:T.gd,marginBottom:"1rem"}}>Every Course Includes</p>
            {["Lesson-by-lesson structured plan","PowerPoint slides for every lesson","Guided examples + student practice","Homework after each lesson","Diagnostic baseline assessment","Mid-course progress check","Final mock exam","🎥 Live Zoom session booking","Dashboard progress tracking","Parent portal access"].map(f=>(
              <div key={f} style={{display:"flex",gap:".55rem",padding:".45rem 0",borderBottom:`1px solid ${T.r2}`}}><CheckCircle size={13} style={{color:T.gr,flexShrink:0,marginTop:2}}/><span style={{fontSize:".8rem",color:T.ash,lineHeight:1.5}}>{f}</span></div>
            ))}
          </div>
        </div>
      </section>
      <Footer go={go} bp={bp}/>
    </div>
  );
}

function PricingPage({go,cur,bp}){
  const groups=[["ib","IB Diploma"],["al","A-Level"],["gcse","GCSE"],["pre","Pre-GCSE"],["ap","AP"],["hon","Honors"],["preib","Pre-IB"],["ms","Middle School"],["us","US Curriculum"]];
  const p=bp?.mobile?"1.5rem":"2rem";
  return(
    <div style={{paddingTop:66}}>
      <section style={{background:T.n2,padding:`4.5rem ${p} 3rem`,borderBottom:`1px solid ${T.rl}`}}>
        <div style={{maxWidth:1360,margin:"0 auto"}}>
          <p style={{fontSize:".65rem",color:T.gd,letterSpacing:".25em",textTransform:"uppercase",marginBottom:".75rem"}}>Pricing</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"10vw":"6vw"},4rem)`,fontWeight:300}}>Course <em style={{fontStyle:"italic",color:T.gd}}>Packages.</em></h1>
          <p style={{fontSize:".88rem",color:T.ash,maxWidth:480,lineHeight:1.75,fontWeight:300,marginTop:".85rem"}}>Full, Half, or Quarter packages. Credits book live Zoom sessions at your own pace. All IB at £50/$70/hr.</p>
        </div>
      </section>
      <section style={{padding:`3.5rem ${p} 5rem`}}>
        <div style={{maxWidth:1360,margin:"0 auto"}}>
          {groups.map(([gk,gl])=>{
            const gcs=COURSES.filter(c=>c.g===gk);if(!gcs.length)return null;
            const m=CAT[gk]||CAT.ib;
            return(
              <div key={gk} style={{marginBottom:"2.5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.1rem"}}><Tag l={gl} c={m.c} bg={m.bg}/><div style={{flex:1,height:1,background:T.rl}}/></div>
                <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr 1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:1,background:T.rl}}>
                  {gcs.map(c=>{
                    const fP=cur==="GBP"?`£${c.hours.full*c.rate.gbp}`:`$${c.hours.full*c.rate.usd}`;
                    const hP=cur==="GBP"?`£${Math.round(c.hours.half*c.rate.gbp*.98)}`:`$${Math.round(c.hours.half*c.rate.usd*.98)}`;
                    const qP=cur==="GBP"?`£${Math.round(c.hours.q*c.rate.gbp*.96)}`:`$${Math.round(c.hours.q*c.rate.usd*.96)}`;
                    return(
                      <div key={c.id} style={{background:T.n2,padding:"2rem"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.1rem"}}>
                          <div>
                            <div style={{display:"flex",gap:".4rem",marginBottom:".6rem",flexWrap:"wrap"}}>
                              {c.lvl&&<Tag l={c.lvl.toUpperCase()} c={m.c} bg={m.bg} sz="xs"/>}
                              {c.path&&<Tag l={c.path.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}
                            </div>
                            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:400,marginBottom:".2rem"}}>{c.title}</p>
                            <p style={{fontSize:".7rem",color:T.ash}}>{c.hours.full}h · {fccy(c.rate.gbp,c.rate.usd,cur)}/hr</p>
                          </div>
                          <span style={{color:c.col,fontSize:"1.5rem",opacity:.35}}>{c.icon}</span>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:T.rl,borderRadius:8,overflow:"hidden"}}>
                          {[["Quarter",qP,c.hours.q,"4%"],["Half",hP,c.hours.half,"2%"],["Full",fP,c.hours.full,null]].map(([l2,price,h2,d])=>(
                            <div key={l2} style={{background:T.n,padding:".9rem .65rem",textAlign:"center"}}>
                              <p style={{fontSize:".6rem",color:T.ash2,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".4rem"}}>{l2}</p>
                              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",color:l2==="Full"?T.gd:T.cr,fontWeight:300}}>{price}</p>
                              <p style={{fontSize:".6rem",color:T.ash2,marginTop:".15rem"}}>{h2}h{d&&<span style={{color:T.gr}}> {d}</span>}</p>
                            </div>
                          ))}
                        </div>
                        <Btn ch="View Course →" v="ghost" sz="xs" sx={{marginTop:"1rem",width:"100%",justifyContent:"center"}} onClick={()=>go("course-"+c.id)}/>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer go={go} bp={bp}/>
    </div>
  );
}

function FAQsPage({bp}){
  const[open,sOpen]=useState(null);
  const p=bp?.mobile?"1.5rem":"2rem";
  const faqs=[
    {q:"Why are IB Math AA and AI listed as separate courses?",a:"Because they are completely different syllabuses. AA (Analysis & Approaches) is algebra, proof, and calculus — for students going into maths, physics, or engineering. AI (Applications & Interpretation) is statistics, modelling, and real-world applications — for social science, business, and economics. SL and HL are further separated because HL covers significantly more content and includes Paper 3."},
    {q:"How does Zoom integration work?",a:"All live sessions are delivered via Zoom. Phase 1 (current): admin adds Zoom links manually after booking — you see the link in your dashboard and receive an email. Phase 2 (in development): Zoom meetings auto-generate via the Zoom API immediately on booking confirmation, with meeting ID and link saved directly to your dashboard."},
    {q:"How do lesson credits work?",a:"Purchase a course package and receive lesson credits equal to the number of hours. Each 1-hour live Zoom session deducts 1 credit. Full course = all credits upfront. Half or Quarter = proportional. Your dashboard always shows total, used, and remaining credits."},
    {q:"What does each lesson include?",a:"Every lesson has a planned objective, a topic list, a PowerPoint slide deck, guided worked examples, student practice questions, homework, and key equations formatted for maths and science teaching. Assessment checkpoints are built into the course at diagnostic, topic-check, mid-course, and final points."},
    {q:"Can parents monitor progress?",a:"Yes. Parents have a separate Parent Portal login, linked to their child's account. They can see enrolled courses, upcoming sessions, Zoom links, assessment results (where the tutor has enabled parent visibility), attendance, and billing history."},
    {q:"Can I cancel or reschedule a session?",a:"Sessions can be rescheduled with 24 hours' notice without credit penalty. Late cancellations or no-shows deduct the credit. Contact Lynda directly via the platform for any rescheduling."},
  ];
  return(
    <div style={{paddingTop:66}}>
      <section style={{background:T.n2,padding:`4.5rem ${p} 3rem`,borderBottom:`1px solid ${T.rl}`}}>
        <div style={{maxWidth:1360,margin:"0 auto"}}>
          <p style={{fontSize:".65rem",color:T.gd,letterSpacing:".25em",textTransform:"uppercase",marginBottom:".75rem"}}>FAQs</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"10vw":"6vw"},4rem)`,fontWeight:300}}>Common questions <em style={{fontStyle:"italic",color:T.gd}}>answered.</em></h1>
        </div>
      </section>
      <section style={{padding:`4rem ${p} 6rem`}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          {faqs.map((f,i)=>(
            <div key={i} style={{borderBottom:`1px solid ${T.rl}`}}>
              <button onClick={()=>sOpen(open===i?null:i)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.35rem 0",gap:"1rem",fontFamily:"inherit",textAlign:"left"}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",color:open===i?T.gd:T.cr,transition:"color .2s"}}>{f.q}</p>
                <span style={{color:T.gd,fontSize:"1.1rem",transition:"transform .2s",transform:open===i?"rotate(45deg)":"none",display:"inline-block",lineHeight:1,flexShrink:0}}>+</span>
              </button>
              {open===i&&<p style={{paddingBottom:"1.5rem",fontSize:".87rem",color:T.ash,lineHeight:1.82,fontWeight:300,animation:"fIn .2s ease"}}>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Contact({go,bp}){
  const[sent,sSent]=useState(false);
  const[f,sF]=useState({name:"",email:"",msg:""});
  const p=bp?.mobile?"1.5rem":"2rem";
  return(
    <div style={{paddingTop:66,maxWidth:1000,margin:"0 auto",padding:`5rem ${p}`}}>
      <p style={{fontSize:".65rem",color:T.gd,letterSpacing:".25em",textTransform:"uppercase",marginBottom:".75rem"}}>Contact</p>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:`min(${bp?.mobile?"10vw":"6vw"},3.8rem)`,fontWeight:300,marginBottom:"2.5rem"}}>Questions before you enrol?</h1>
      {sent?(
        <div style={{textAlign:"center",padding:"4rem"}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.5rem",color:T.gd,marginBottom:"1rem"}}>✓</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300}}>Message received.</h2>
          <p style={{fontSize:".88rem",color:T.ash,marginTop:".75rem"}}>Lynda will reply to {f.email} within 24 hours.</p>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":"1fr 1.5fr",gap:bp?.mobile?"2rem":"5rem",alignItems:"start"}}>
          <div>
            {[["Email","badmusl@outlook.com"],["Platform","Zoom · Online · All time zones"],["Response","Within 24 hours"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:".75rem 0",borderBottom:`1px solid ${T.rl}`}}><span style={{fontSize:".68rem",color:T.ash2,letterSpacing:".1em",textTransform:"uppercase"}}>{k}</span><span style={{fontSize:".83rem",color:T.ash}}>{v}</span></div>
            ))}
            <div style={{marginTop:"1.5rem"}}><Btn ch="Browse Courses →" v="gold" sz="sm" onClick={()=>go("courses")}/></div>
          </div>
          <div>
            <Inp label="Name" val={f.name} onChange={e=>sF({...f,name:e.target.value})} ph="Full name"/>
            <Inp label="Email" val={f.email} onChange={e=>sF({...f,email:e.target.value})} type="email" ph="your@email.com"/>
            <Inp label="Message" as="textarea" val={f.msg} onChange={e=>sF({...f,msg:e.target.value})} ph="Your question…" rows={5}/>
            <Btn ch="Send Message" v="gold" sz="lg" sx={{width:"100%",justifyContent:"center"}} onClick={()=>sSent(true)}/>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AUTH ────────────────────────────────────────────────────────── */
// Merge a real Supabase profile with the mock data shape the portals expect.
// Until we migrate the downstream screens off USERS[], we graft the nested
// enrollments/sessions from a role-matched mock user onto the real profile.
// When a tutor/student actually has DB-backed data, this fallback is harmless —
// you'll just overwrite it once real queries land.
function hydrateUserFromProfile(profile){
  const mock=USERS.find(u=>u.role===profile.role)||{};
  return{
    id:profile.id,
    email:profile.email,
    name:profile.name||mock.name||profile.email,
    role:profile.role,
    av:profile.avatar||mock.av||(profile.name||profile.email).split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2),
    payRate:profile.pay_rate??mock.payRate,
    childId:profile.child_id??mock.childId,
    childName:mock.childName,
    enrollments:mock.enrollments||[],
    sessions:mock.sessions||[],
    invoices:mock.invoices||[],
  };
}

async function loadUserFromAuth(authUser){
  const{data:profile,error}=await supabase.from("profiles").select("*").eq("id",authUser.id).single();
  if(error||!profile){
    // Profile row missing — fall back to the auth user so the app can still render.
    console.warn("[auth] profile row missing for",authUser.id,error);
    return{id:authUser.id,email:authUser.email,name:authUser.email,role:"student",av:"?",enrollments:[]};
  }
  return hydrateUserFromProfile(profile);
}

function roleLanding(role){
  return role==="admin"?"admin":role==="tutor"?"tutor-dash":role==="parent"?"parent":"dashboard";
}

function Login({go,setUser,bp}){
  const[email,sEmail]=useState("");const[pw,sPw]=useState("");const[err,sErr]=useState("");const[busy,sBusy]=useState(false);
  const handle=async()=>{
    sErr("");sBusy(true);
    try{
      const{data,error}=await supabase.auth.signInWithPassword({email,password:pw});
      if(error)throw error;
      const u=await loadUserFromAuth(data.user);
      setUser(u);go(roleLanding(u.role));
    }catch(e){
      // Fallback: demo accounts still work when Supabase isn't configured or the user hasn't been created yet.
      const demo=USERS.find(u=>u.email===email&&u.pw===pw);
      if(demo){setUser(demo);go(roleLanding(demo.role));}
      else sErr(e?.message||"Incorrect email or password.");
    }finally{sBusy(false);}
  };
  return(
    <div style={{paddingTop:70,minHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:20,padding:"3rem",width:"100%",maxWidth:440,boxShadow:T.s2}}>
        <Logo size={36}/>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginTop:"1.5rem",marginBottom:".4rem"}}>Sign In</p>
        <p style={{fontSize:".75rem",color:T.ash,marginBottom:"2rem"}}>student@demo.com / demo &nbsp;·&nbsp; parent@demo.com / demo<br/>tutor@demo.com / demo &nbsp;·&nbsp; admin@lbe.com / admin</p>
        <Inp label="Email" val={email} onChange={e=>sEmail(e.target.value)} type="email" ph="your@email.com"/>
        <Inp label="Password" val={pw} onChange={e=>sPw(e.target.value)} type="password" ph="••••••••"/>
        {err&&<p style={{fontSize:".78rem",color:T.rd,marginBottom:"1rem"}}>{err}</p>}
        <Btn ch={busy?"Signing in…":"Sign In"} v="gold" sz="lg" sx={{width:"100%",justifyContent:"center"}} onClick={handle} dis={busy}/>
        <p style={{fontSize:".78rem",color:T.ash,textAlign:"center",marginTop:"1.25rem"}}>No account? <button onClick={()=>go("signup")} style={{background:"none",border:"none",color:T.gd,cursor:"pointer",fontFamily:"inherit",fontSize:".78rem"}}>Sign up free</button></p>
      </div>
    </div>
  );
}

function Signup({go,setUser}){
  const[f,sF]=useState({name:"",email:"",pw:"",role:"student"});
  const[err,sErr]=useState("");const[busy,sBusy]=useState(false);
  const handle=async()=>{
    if(!f.name||!f.email||!f.pw)return;
    sErr("");sBusy(true);
    try{
      const{data,error}=await supabase.auth.signUp({
        email:f.email,password:f.pw,
        options:{data:{name:f.name,role:f.role}},
      });
      if(error)throw error;
      // If email confirmations are on, data.session will be null and the user must verify before we can load a profile.
      if(data.session&&data.user){
        const u=await loadUserFromAuth(data.user);
        setUser(u);go(roleLanding(u.role));
      }else{
        sErr("Check your email to confirm your account, then sign in.");
        setTimeout(()=>go("login"),1200);
      }
    }catch(e){
      sErr(e?.message||"Could not create account.");
    }finally{sBusy(false);}
  };
  return(
    <div style={{paddingTop:70,minHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:20,padding:"3rem",width:"100%",maxWidth:440}}>
        <Logo size={36}/>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginTop:"1.5rem",marginBottom:"2rem"}}>Create Account</p>
        <Inp label="Full Name" val={f.name} onChange={e=>sF({...f,name:e.target.value})} ph="Your full name"/>
        <Inp label="Email" val={f.email} onChange={e=>sF({...f,email:e.target.value})} type="email" ph="your@email.com"/>
        <Inp label="Password" val={f.pw} onChange={e=>sF({...f,pw:e.target.value})} type="password" ph="Choose a password"/>
        <Inp label="I am a" as="select" val={f.role} onChange={e=>sF({...f,role:e.target.value})} opts={[{v:"student",l:"Student / Parent (student access)"},{v:"parent",l:"Parent (parent portal access)"},{v:"tutor",l:"Tutor (apply to join)"}]}/>
        {err&&<p style={{fontSize:".78rem",color:T.rd,marginBottom:"1rem"}}>{err}</p>}
        <Btn ch={busy?"Creating…":"Create Account"} v="gold" sz="lg" sx={{width:"100%",justifyContent:"center"}} onClick={handle} dis={busy}/>
        <p style={{fontSize:".78rem",color:T.ash,textAlign:"center",marginTop:"1.25rem"}}>Already have an account? <button onClick={()=>go("login")} style={{background:"none",border:"none",color:T.gd,cursor:"pointer",fontFamily:"inherit",fontSize:".78rem"}}>Sign in</button></p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BOOKING MODAL
═══════════════════════════════════════════════════════════════════ */
function BookModal({enrollId,user,setUser,onClose}){
  const enr=user.enrollments.find(e=>e.id===enrollId);
  const course=enr?COURSES.find(c=>c.id===enr.courseId):null;
  const[wOff,sWOff]=useState(0);const[selD,sSelD]=useState(null);const[selT,sSelT]=useState(null);const[done,sDone]=useState(false);
  const wk=wkDates(wOff);const left=enr?(enr.credits-enr.used):0;const nxt=enr?(enr.completedLessons.length+1):1;
  const confirm=()=>{
    if(!selD||!selT||!enr)return;
    const meetId=String(Math.floor(Math.random()*900000000+100000000));
    const nb={id:uid(),date:selD,time:selT,ln:nxt,status:"scheduled",zoom:`https://zoom.us/j/${meetId}?pwd=lbe${uid()}`,meetingId:meetId.replace(/(\d{3})(\d{3})(\d{3})/,"$1 $2 $3"),tutor:"Lynda Badmus"};
    setUser({...user,enrollments:user.enrollments.map(e=>e.id===enrollId?{...e,used:e.used+1,bookings:[...(e.bookings||[]),nb]}:e)});
    sDone(true);
  };
  return(
    <Modal title="Book Your Zoom Session" onClose={onClose} wide ch={
      done?(
        <div style={{textAlign:"center",padding:"2rem 0"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>✅</div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",marginBottom:".75rem"}}>Session confirmed!</p>
          <p style={{fontSize:".85rem",color:T.ash,marginBottom:".6rem"}}>{fmtD(selD)} at {fmt12(selT)} · 1 credit used · {left-1} remaining</p>
          <div style={{background:T.bla,border:`1px solid ${T.bl}40`,borderRadius:10,padding:"1rem",margin:"1rem auto",maxWidth:360}}>
            <p style={{fontSize:".82rem",fontWeight:600,color:T.bl,marginBottom:".3rem"}}>🎥 Zoom link added to your dashboard</p>
            <p style={{fontSize:".78rem",color:T.ash}}>You'll also receive a confirmation email. Admin adds meeting ID in Phase 1; Phase 2 auto-generates on confirmation.</p>
          </div>
          <Btn ch="Back to Dashboard" v="gold" onClick={onClose}/>
        </div>
      ):(
        <>
          <div style={{background:T.gdaa,border:`1px solid ${T.rl}`,borderRadius:8,padding:".85rem 1.1rem",marginBottom:"1.4rem"}}>
            <p style={{fontWeight:500,fontSize:".85rem"}}>{course?.title} · Lesson {nxt}</p>
            <p style={{fontSize:".72rem",color:T.ash}}>{left} credits remaining · 1 credit used · 🎥 Zoom link generated on confirm</p>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:".75rem"}}>
            <p style={{fontSize:".75rem",color:T.ash}}>Week of {fmtD(wk[0])}</p>
            <div style={{display:"flex",gap:".4rem"}}>
              <Btn ch="←" v="navy" sz="xs" onClick={()=>sWOff(w=>Math.max(0,w-1))}/>
              <Btn ch="Now" v="navy" sz="xs" onClick={()=>sWOff(0)}/>
              <Btn ch="→" v="navy" sz="xs" onClick={()=>sWOff(w=>w+1)}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:1,background:T.rl,borderRadius:8,overflow:"hidden",marginBottom:"1.4rem"}}>
            {wk.filter(d=>([1,2,3,4,6]).includes(dow(d))).map(d=>{
              const ds=SCHED[dow(d)];if(!ds)return null;const isSel=selD===d;
              return(
                <div key={d} style={{background:isSel?T.gdaa:T.n2}}>
                  <button onClick={()=>{sSelD(d);sSelT(null);}} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:".62rem .4rem",textAlign:"center",borderBottom:`1px solid ${isSel?T.gd:T.rl}`,fontFamily:"inherit"}}>
                    <p style={{fontSize:".62rem",color:isSel?T.gd:T.ash,letterSpacing:".08em",textTransform:"uppercase"}}>{ds.l}</p>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",color:isSel?T.gd:T.cr,lineHeight:1.2}}>{new Date(d+"T12:00:00").getDate()}</p>
                  </button>
                  <div style={{padding:".4rem"}}>
                    {ds.s.map(sl=>{const ss=selD===d&&selT===sl;return<button key={sl} onClick={()=>{sSelD(d);sSelT(sl);}} style={{width:"100%",background:ss?T.gd:T.n3,color:ss?T.n:T.ash,border:`1px solid ${ss?T.gd:T.rl}`,borderRadius:6,padding:".3rem .2rem",fontSize:".65rem",cursor:"pointer",marginBottom:".25rem",fontFamily:"inherit",transition:"all .18s"}}>{fmt12(sl)}</button>;})}
                  </div>
                </div>
              );
            })}
          </div>
          {selD&&selT&&<div style={{background:T.gdaa,border:`1px solid ${T.gd}`,borderRadius:8,padding:".85rem 1.1rem",marginBottom:"1.1rem"}}><p style={{fontSize:".83rem",fontWeight:500}}>{fmtD(selD)} · {fmt12(selT)} · 🎥 Zoom link generated on confirm</p></div>}
          <div style={{display:"flex",justifyContent:"flex-end",gap:".75rem",borderTop:`1px solid ${T.rl}`,paddingTop:"1rem"}}>
            <Btn ch="Cancel" v="ghost" onClick={onClose}/>
            <Btn ch="Confirm & Book →" v="gold" dis={!selD||!selT} onClick={confirm}/>
          </div>
        </>
      )
    }/>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STUDENT PORTAL
═══════════════════════════════════════════════════════════════════ */
function StudentDash({user,setUser,go,bp}){
  const[bookModal,sBookM]=useState(null);
  const totalC=(user.enrollments||[]).reduce((a,e)=>a+e.credits,0);
  const usedC=(user.enrollments||[]).reduce((a,e)=>a+e.used,0);
  const upcoming=(user.enrollments||[]).flatMap(e=>(e.bookings||[]).filter(b=>b.status==="scheduled"&&b.date>=today())).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
  const gc2=bp?.mobile?"1fr":bp?.tablet?"1fr 1fr":"1.4fr 1fr";
  return(
    <div style={{padding:bp?.mobile?"1.25rem":"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem"}}>
        <div>
          <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Student Dashboard</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:bp?.mobile?"1.8rem":"2.1rem",fontWeight:300}}>Welcome, <em style={{fontStyle:"italic",color:T.gd}}>{user.name.split(" ")[0]}</em></h1>
        </div>
        <Btn ch="+ Enrol in a Course" v="gold" sz="sm" onClick={()=>go("courses")}/>
      </div>
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr 1fr":"repeat(4,1fr)",gap:1,background:T.rl,borderRadius:10,overflow:"hidden",marginBottom:"1.5rem"}}>
        {[[(user.enrollments||[]).length,"Enrolled",T.gd],[usedC,"Done",T.gr],[totalC-usedC,"Credits left",T.bl],[upcoming.length,"Upcoming Zoom",T.am]].map(([v,l,c])=>(
          <div key={l} style={{background:T.n2,padding:"1.1rem 1.4rem"}}><Stat v={v} l={l} c={c}/></div>
        ))}
      </div>
      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr":"1.5fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
        <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem"}}>
          <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".4rem"}}>Score Trend</p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:300,marginBottom:"1rem"}}>Up 25 points since baseline — on track</p>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={SCORE_DATA}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.gd} stopOpacity={.2}/><stop offset="95%" stopColor={T.gd} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.r2}/><XAxis dataKey="w" tick={{fill:T.ash,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:T.ash,fontSize:10}} axisLine={false} tickLine={false} domain={[40,100]}/>
              <Tooltip contentStyle={{background:T.n3,border:`1px solid ${T.rl}`,borderRadius:8,color:T.cr,fontSize:11}}/>
              <Area type="monotone" dataKey="s" stroke={T.gd} strokeWidth={2.5} fill="url(#sg)" name="Score" dot={{fill:T.gd,r:3}}/>
              <Line type="monotone" dataKey="a" stroke={T.ash2} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Class avg"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem"}}>
          <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Course Units</p>
          {UNITS.map(u=>(
            <div key={u.u} style={{marginBottom:".82rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:".3rem"}}>
                <p style={{fontSize:".78rem",color:u.p>0?T.cr:T.ash2}}>{u.u}</p>
                <p style={{fontSize:".73rem",color:u.p===100?T.gr:u.p>0?u.c:T.ash2,fontWeight:600}}>{u.p}%</p>
              </div>
              <PBar p={u.p} col={u.c} h={4}/>
            </div>
          ))}
        </div>
      </div>
      {/* Enrolled + Upcoming */}
      <div style={{display:"grid",gridTemplateColumns:gc2,gap:"1.25rem"}}>
        <div>
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Enrolled Courses</p>
          {(user.enrollments||[]).length===0&&(
            <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"2.5rem",textAlign:"center"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,marginBottom:".6rem"}}>No courses yet</p>
              <Btn ch="Browse Courses →" v="gold" sz="sm" onClick={()=>go("courses")}/>
            </div>
          )}
          {(user.enrollments||[]).map(enr=>{
            const c=COURSES.find(x=>x.id===enr.courseId);if(!c)return null;
            const m=CAT[c.g]||CAT.ib;
            const pct2=c.lessons?Math.round(enr.completedLessons.length/c.lessons*100):0;
            const left=enr.credits-enr.used;
            return(
              <div key={enr.id} style={{background:T.n2,border:`1px solid ${c.col}28`,borderRadius:12,padding:"1.5rem",marginBottom:"1rem",borderLeftWidth:4,borderLeftColor:c.col}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem",gap:".75rem",flexWrap:"wrap"}}>
                  <div>
                    <div style={{display:"flex",gap:".45rem",marginBottom:".6rem",flexWrap:"wrap"}}><Tag l={m.l} c={m.c} bg={m.bg}/>{c.lvl&&<Tag l={c.lvl.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}</div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontWeight:400}}>{c.title}</h3>
                    <p style={{fontSize:".72rem",color:T.ash,marginTop:".2rem"}}>Enrolled {fmtD(enr.enrolledAt)} · {enr.pkg} course</p>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:left>10?T.gr:left>5?T.am:T.rd,lineHeight:1}}>{left}</p>
                    <p style={{fontSize:".65rem",color:T.ash}}>credits left</p>
                  </div>
                </div>
                <PBar p={pct2} col={c.col} h={5}/>
                <p style={{fontSize:".7rem",color:T.ash,marginTop:".4rem",marginBottom:"1rem"}}>{enr.completedLessons.length}/{c.lessons} lessons · {pct2}%</p>
                <div style={{display:"flex",gap:".65rem",flexWrap:"wrap"}}>
                  <Btn ch={`🎥 Book Lesson (${left})`} v="gold" sz="sm" onClick={()=>sBookM(enr.id)} dis={left===0}/>
                  <Btn ch="Assessments" v="navy" sz="sm" onClick={()=>go("assessments")}/>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Upcoming Zoom Sessions</p>
          {upcoming.length===0&&<p style={{fontSize:".83rem",color:T.ash2}}>No upcoming sessions. Book from an enrolled course.</p>}
          {upcoming.map(b=>{
            const enr2=(user.enrollments||[]).find(e=>(e.bookings||[]).some(bk=>bk.id===b.id));
            const c2=enr2?COURSES.find(x=>x.id===enr2.courseId):null;
            return<ZoomCard key={b.id} link={b.zoom} meetingId={b.meetingId} date={b.date} time={b.time} course={c2?.short||"Session"} tutor={b.tutor} status={b.status}/>;
          })}
          <Btn ch="Full Booking Calendar →" v="navy" sz="sm" sx={{marginTop:"1rem"}} onClick={()=>go("booking")}/>
          {/* Assessments summary */}
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,margin:"1.75rem 0 1rem"}}>Assessments</p>
          {(user.enrollments||[]).flatMap(e=>e.assessments||[]).slice(0,3).map(a=>(
            <div key={a.id} style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:8,padding:"1rem",marginBottom:".6rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><p style={{fontWeight:500,fontSize:".85rem",marginBottom:".2rem"}}>{a.title}</p><Tag l={ATLBL[a.type]||a.type} c={ATCOL[a.type]||T.gd} bg={(ATCOL[a.type]||T.gd)+"18"} sz="xs"/></div>
              {a.done?<div style={{textAlign:"right"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:gc(ptc(a.score,a.max)),lineHeight:1}}>{ptc(a.score,a.max)}%</p><p style={{fontSize:".65rem",color:T.ash}}>{a.score}/{a.max}</p></div>:<Tag l="Pending" c={T.am} bg={T.ama}/>}
            </div>
          ))}
        </div>
      </div>
      {bookModal&&<BookModal enrollId={bookModal} user={user} setUser={setUser} onClose={()=>sBookM(null)}/>}
    </div>
  );
}

function MyCourses({user,go}){
  return(
    <div style={{padding:"2rem"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>My Courses</h2>
      {(user.enrollments||[]).length===0&&<div style={{textAlign:"center",padding:"4rem"}}><Btn ch="Browse Courses" v="gold" onClick={()=>go("courses")}/></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"1.25rem"}}>
        {(user.enrollments||[]).map(enr=>{
          const c=COURSES.find(x=>x.id===enr.courseId);if(!c)return null;
          const m=CAT[c.g]||CAT.ib;
          const pct2=c.lessons?Math.round(enr.completedLessons.length/c.lessons*100):0;
          return(
            <div key={enr.id} style={{background:T.n2,border:`1px solid ${c.col}28`,borderRadius:12,padding:"1.6rem",borderLeftWidth:4,borderLeftColor:c.col}}>
              <div style={{display:"flex",gap:".45rem",marginBottom:".75rem",flexWrap:"wrap"}}><Tag l={m.l} c={m.c} bg={m.bg}/>{c.lvl&&<Tag l={c.lvl.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontWeight:400,marginBottom:".85rem"}}>{c.title}</h3>
              <PBar p={pct2} col={c.col} h={6}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:".45rem",marginBottom:"1.25rem"}}>
                <p style={{fontSize:".72rem",color:T.ash}}>{enr.completedLessons.length}/{c.lessons} lessons</p>
                <p style={{fontSize:".72rem",color:T.cr,fontWeight:500}}>{pct2}%</p>
              </div>
              {/* Lesson viewer mock */}
              <div style={{background:T.n3,borderRadius:10,padding:"1rem",marginBottom:"1rem"}}>
                <p style={{fontSize:".65rem",color:T.gd,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".5rem"}}>Sample Lesson</p>
                <p style={{fontSize:".85rem",fontWeight:500,color:T.cr,marginBottom:".3rem"}}>Lesson {enr.completedLessons.length+1}: {c.lessons>9?"Functions & Transformations":"Introduction & Diagnostic"}</p>
                {c.eq&&<div style={{background:T.n4,borderRadius:7,padding:".65rem .85rem",marginTop:".5rem",textAlign:"center"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.cr}}>{c.eq.d}</span></div>}
                <p style={{fontSize:".7rem",color:T.ash,marginTop:".5rem"}}>📊 PPT: 24 slides · ✏ Examples + Practice · 📋 Homework set</p>
              </div>
              <div style={{display:"flex",gap:".5rem",flexWrap:"wrap"}}>
                <Btn ch="View Course" v="gold" sz="sm" onClick={()=>go("course-"+c.id)}/>
                <Btn ch="Assessments" v="navy" sz="sm" onClick={()=>go("assessments")}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Assessments({user}){
  const all=(user.enrollments||[]).flatMap(enr=>{
    const c=COURSES.find(x=>x.id===enr.courseId);
    return(enr.assessments||[]).map(a=>({...a,courseName:c?.short||"Course",courseCol:c?.col||T.gd}));
  });
  return(
    <div style={{padding:"2rem"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>Assessments & Feedback</h2>
      {all.length===0&&<p style={{fontSize:".85rem",color:T.ash}}>Enrol in a course to access assessments.</p>}
      {all.map(a=>{
        const col=ATCOL[a.type]||T.gd;
        return(
          <div key={a.id} style={{background:T.n2,border:`1px solid ${col}30`,borderRadius:10,padding:"1.35rem",marginBottom:".85rem",borderLeftWidth:4,borderLeftColor:col}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:a.done&&a.strengths?".85rem":"0",flexWrap:"wrap",gap:".75rem"}}>
              <div>
                <div style={{display:"flex",gap:".5rem",marginBottom:".6rem",flexWrap:"wrap"}}><Tag l={ATLBL[a.type]||a.type} c={col} bg={col+"18"}/><p style={{fontSize:".83rem",fontWeight:500,color:T.cr,alignSelf:"center"}}>{a.title}</p></div>
                <p style={{fontSize:".72rem",color:T.ash}}>{a.courseName}{a.date?` · ${fmtD(a.date)}`:""}</p>
                {a.notes&&<p style={{fontSize:".78rem",color:T.ash,marginTop:".3rem",fontStyle:"italic"}}>{a.notes}</p>}
              </div>
              {a.done?<div style={{textAlign:"right",flexShrink:0}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",fontWeight:300,color:gc(ptc(a.score,a.max)),lineHeight:1}}>{ptc(a.score,a.max)}%</p><p style={{fontSize:".7rem",color:T.ash}}>{a.score}/{a.max}</p></div>:<Tag l="Pending" c={T.am} bg={T.ama}/>}
            </div>
            {a.done&&a.strengths&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginTop:".85rem",paddingTop:".85rem",borderTop:`1px solid ${T.r2}`}}>
                <div><p style={{fontSize:".65rem",color:T.gr,fontWeight:700,letterSpacing:".08em",marginBottom:".4rem"}}>✓ Strengths</p>{(a.strengths||[]).map((s,i)=><p key={i} style={{fontSize:".78rem",color:T.c2,marginBottom:".2rem"}}>· {s}</p>)}</div>
                <div><p style={{fontSize:".65rem",color:T.am,fontWeight:700,letterSpacing:".08em",marginBottom:".4rem"}}>→ To Develop</p>{(a.work||[]).map((s,i)=><p key={i} style={{fontSize:".78rem",color:T.c2,marginBottom:".2rem"}}>· {s}</p>)}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── PARENT PORTAL ───────────────────────────────────────────────── */
function ParentPortal({user,go,bp}){
  const child=USERS.find(u=>u.id===user.childId)||USERS[0];
  const enr=child?.enrollments?.[0];
  const c=enr?COURSES.find(x=>x.id===enr.courseId):null;
  const m=c?CAT[c.g]||CAT.ib:null;
  const upcoming=(child?.enrollments||[]).flatMap(e=>(e.bookings||[]).filter(b=>b.status==="scheduled"&&b.date>=today())).slice(0,3);
  const gc2=bp?.mobile?"1fr":bp?.tablet?"1fr":"1.2fr 1fr";
  return(
    <div style={{padding:bp?.mobile?"1.25rem":"2rem"}}>
      <div style={{marginBottom:"1.75rem"}}>
        <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Parent Portal</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:bp?.mobile?"1.8rem":"2rem",fontWeight:300}}>Hello, <em style={{fontStyle:"italic",color:T.te}}>{user.name.split(" ")[0]}</em> — {child?.name}'s progress</h1>
      </div>
      {c&&m&&<div style={{background:T.n2,border:`1px solid ${c.col}30`,borderRadius:12,padding:"1.6rem",marginBottom:"1.25rem",borderLeftWidth:4,borderLeftColor:c.col}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.25rem",flexWrap:"wrap",gap:".75rem"}}>
          <div>
            <div style={{display:"flex",gap:".45rem",marginBottom:".65rem",flexWrap:"wrap"}}><Tag l={m.l} c={m.c} bg={m.bg}/>{c.lvl&&<Tag l={c.lvl.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.35rem",fontWeight:400}}>{c.title}</h3>
            <p style={{fontSize:".75rem",color:T.ash,marginTop:".25rem"}}>Enrolled {fmtD(enr.enrolledAt)} · {enr.pkg} course</p>
          </div>
          <SBadge s="active"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:T.rl,borderRadius:8,overflow:"hidden",marginBottom:"1.25rem"}}>
          {[[enr.completedLessons.length+"/"+c.lessons,"Lessons",T.bl],[enr.credits-enr.used,"Credits left",T.gr],[(enr.assessments||[]).filter(a=>a.done).length,"Assessments done",T.gd]].map(([v,l,col])=>(
            <div key={l} style={{background:T.n3,padding:".9rem 1rem",textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:300,color:col,lineHeight:1}}>{v}</p><p style={{fontSize:".68rem",color:T.ash,marginTop:".2rem"}}>{l}</p></div>
          ))}
        </div>
        <PBar p={c.lessons?Math.round(enr.completedLessons.length/c.lessons*100):0} col={c.col} h={6}/>
        <p style={{fontSize:".72rem",color:T.ash,marginTop:".4rem"}}>{c.lessons?Math.round(enr.completedLessons.length/c.lessons*100):0}% complete</p>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:gc2,gap:"1.25rem",marginBottom:"1.25rem"}}>
        <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem"}}>
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Upcoming Sessions</p>
          {upcoming.length===0&&<p style={{fontSize:".83rem",color:T.ash2}}>No upcoming sessions.</p>}
          {upcoming.map(b=>{
            const enr2=(child?.enrollments||[]).find(e=>(e.bookings||[]).some(bk=>bk.id===b.id));
            const c2=enr2?COURSES.find(x=>x.id===enr2.courseId):null;
            return<ZoomCard key={b.id} link={b.zoom} meetingId={b.meetingId} date={b.date} time={b.time} course={c2?.short||"Session"} tutor={b.tutor} status={b.status} compact/>;
          })}
          <div style={{marginTop:"1.25rem",background:T.n3,borderRadius:8,padding:".85rem",borderLeft:`3px solid ${T.te}`}}>
            <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".5rem"}}>Last Session Note (tutor)</p>
            <p style={{fontSize:".8rem",color:T.c2,lineHeight:1.65}}>Covered Complex Numbers — polar form and De Moivre's theorem. {child?.name?.split(" ")[0]||"Student"} engaged well with the graphical approach. Recommended reviewing Lesson 5 slides before Thursday.</p>
          </div>
        </div>
        <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem"}}>
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Assessment Results</p>
          {(enr?.assessments||[]).map(a=>(
            <div key={a.id} style={{background:T.n3,borderRadius:8,padding:".95rem 1rem",marginBottom:".6rem",border:`1px solid ${T.r2}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".35rem"}}>
                <div><p style={{fontSize:".82rem",fontWeight:500,marginBottom:".2rem"}}>{a.title}</p><Tag l={ATLBL[a.type]||a.type} c={ATCOL[a.type]||T.gd} bg={(ATCOL[a.type]||T.gd)+"18"} sz="xs"/></div>
                {a.done?<div style={{textAlign:"right"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:gc(ptc(a.score,a.max)),lineHeight:1}}>{ptc(a.score,a.max)}%</p><p style={{fontSize:".65rem",color:T.ash}}>{a.score}/{a.max}</p></div>:<Tag l="Pending" c={T.am} bg={T.ama}/>}
              </div>
              {a.done&&a.notes&&<p style={{fontSize:".72rem",color:T.ash,marginTop:".3rem",fontStyle:"italic"}}>{a.notes}</p>}
            </div>
          ))}
        </div>
      </div>
      {/* Billing */}
      <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem"}}>
        <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Billing History</p>
        <div style={{background:T.n3,borderRadius:8,padding:"1.1rem 1.25rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
          <div><p style={{fontWeight:500,fontSize:".88rem"}}>{c?.title||"Course"} — Full Course</p><p style={{fontSize:".72rem",color:T.ash}}>Enrolled {fmtD(enr?.enrolledAt||today())} · Stripe payment · Reference: LBE-{uid().toUpperCase()}</p></div>
          <div style={{textAlign:"right"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:300,color:T.gd}}>£{(enr?.credits||50)*(c?.rate?.gbp||50)}</p><SBadge s="paid"/></div>
        </div>
      </div>
    </div>
  );
}

/* ─── TUTOR PORTAL ────────────────────────────────────────────────── */
function TutorDash({user,go,bp}){
  const t=USERS.find(u=>u.role==="tutor");
  const sessions=t?.sessions||[];
  const upcoming=sessions.filter(s=>s.status==="upcoming");
  const completed=sessions.filter(s=>s.status==="completed");
  const pendingPay=completed.filter(s=>!s.payStatus||s.payStatus==="pending").reduce((a,s)=>a+s.amount,0);
  return(
    <div style={{padding:bp?.mobile?"1.25rem":"2rem"}}>
      <div style={{marginBottom:"1.75rem"}}>
        <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Tutor Portal</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:bp?.mobile?"1.8rem":"2rem",fontWeight:300}}>Welcome, <em style={{fontStyle:"italic",color:T.am}}>{user.name.split(" ")[0]}</em></h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr 1fr":"repeat(4,1fr)",gap:1,background:T.rl,borderRadius:10,overflow:"hidden",marginBottom:"1.5rem"}}>
        {[[upcoming.length,"Upcoming",T.bl],[completed.length,"Completed",T.gr],[`£${pendingPay}`,"Pending payout",T.am],[sessions.length+"h","Hours logged",T.gd]].map(([v,l,c])=>(
          <div key={l} style={{background:T.n2,padding:"1.1rem 1.4rem"}}><Stat v={v} l={l} c={c}/></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr":"1.3fr 1fr",gap:"1.25rem"}}>
        <div>
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Upcoming Sessions (Zoom)</p>
          {upcoming.map(s=>(
            <div key={s.id} style={{marginBottom:".65rem"}}>
              <ZoomCard link={s.zoom} meetingId={s.meetingId} date={s.date} time={s.time} course={s.course} tutor={s.student} status={s.status==="upcoming"?"scheduled":"completed"}/>
            </div>
          ))}
          <Btn ch="Full Schedule →" v="navy" sz="sm" sx={{marginTop:".75rem"}} onClick={()=>go("tutor-schedule")}/>
        </div>
        <div>
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Recent Sessions</p>
          {completed.slice(0,3).map(s=>(
            <div key={s.id} style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:8,padding:"1rem",marginBottom:".55rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".5rem"}}>
              <div><p style={{fontSize:".83rem",fontWeight:500}}>{s.student}</p><p style={{fontSize:".72rem",color:T.ash}}>{fmtD(s.date)} · {s.course}</p></div>
              <div style={{textAlign:"right"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.gr}}>£{s.amount}</p><SBadge s={s.payStatus||"pending"}/></div>
            </div>
          ))}
          <Btn ch="Hours Log & Invoices →" v="navy" sz="sm" sx={{marginTop:".75rem"}} onClick={()=>go("tutor-hours")}/>
        </div>
      </div>
    </div>
  );
}

function TutorSchedule(){
  const t=USERS.find(u=>u.role==="tutor");
  return(
    <div style={{padding:"2rem"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>My Schedule</h2>
      <div style={{display:"flex",flexDirection:"column",gap:".65rem"}}>
        {(t?.sessions||[]).sort((a,b)=>b.date.localeCompare(a.date)).map(s=>(
          <div key={s.id}>
            <ZoomCard link={s.zoom} meetingId={s.meetingId} date={s.date} time={s.time} course={s.course} tutor={s.student} status={s.status==="upcoming"?"scheduled":s.status}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function TutorHours({go}){
  const t=USERS.find(u=>u.role==="tutor");
  const sessions=(t?.sessions||[]).filter(s=>s.status==="completed");
  const totalGBP=sessions.reduce((a,s)=>a+s.amount,0);
  const pendingGBP=sessions.filter(s=>!s.payStatus||s.payStatus==="pending").reduce((a,s)=>a+s.amount,0);
  return(
    <div style={{padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300}}>Hours Log</h2>
        <Btn ch="Submit Invoice →" v="gold" sz="sm" onClick={()=>go("tutor-invoices")}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:T.rl,borderRadius:10,overflow:"hidden",marginBottom:"2rem"}}>
        {[[sessions.length+"h","Total hours",T.gd],[`£${totalGBP}`,"Total earned",T.gr],[`£${pendingGBP}`,"Pending",T.am]].map(([v,l,c])=>(
          <div key={l} style={{background:T.n2,padding:"1.2rem 1.4rem"}}><Stat v={v} l={l} c={c}/></div>
        ))}
      </div>
      {sessions.map(s=>(
        <div key={s.id} style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:8,padding:".95rem 1.2rem",display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:"1.5rem",alignItems:"center",marginBottom:".5rem",flexWrap:"wrap"}}>
          <div><p style={{fontWeight:500,fontSize:".87rem"}}>{s.student}</p><p style={{fontSize:".72rem",color:T.ash}}>{fmtD(s.date)} · {s.course}</p></div>
          <p style={{fontSize:".83rem",color:T.c2}}>{s.dur/60}h</p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.gd}}>£{s.amount}</p>
          <SBadge s={s.payStatus||"pending"}/>
        </div>
      ))}
    </div>
  );
}

function TutorInvoices(){
  const t=USERS.find(u=>u.role==="tutor");
  const[invoices,sInv]=useState(t?.invoices||[]);
  const[showForm,sSF]=useState(false);
  return(
    <div style={{padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300}}>Invoices & Payouts</h2>
        <Btn ch="+ Submit Invoice" v="gold" sz="sm" onClick={()=>sSF(true)}/>
      </div>
      {invoices.map(inv=>(
        <div key={inv.id} style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:8,padding:"1.25rem 1.5rem",marginBottom:".65rem",display:"grid",gridTemplateColumns:"1fr auto auto",gap:"2rem",alignItems:"center"}}>
          <div><p style={{fontWeight:500,fontSize:".92rem"}}>{inv.period}</p><p style={{fontSize:".75rem",color:T.ash}}>{inv.sessions} sessions · {inv.hours}h · £{inv.rate}/hr{inv.paid?` · Paid ${fmtD(inv.paid)}`:""}</p></div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:300,color:T.gd}}>£{inv.total}</p>
          <SBadge s={inv.status}/>
        </div>
      ))}
      {showForm&&<Modal title="Submit Invoice" onClose={()=>sSF(false)} ch={
        <div>
          <p style={{fontSize:".85rem",color:T.ash,marginBottom:"1.5rem"}}>Submit your hours for admin review and payment approval.</p>
          <Inp label="Invoice Period" as="select" val="Dec 2025" onChange={()=>{}} opts={["Dec 2025","Nov 2025","Oct 2025"]}/>
          <div style={{background:T.n3,borderRadius:8,padding:"1.25rem",marginBottom:"1.25rem"}}>
            <p style={{fontSize:".72rem",color:T.ash,marginBottom:".5rem",letterSpacing:".08em",textTransform:"uppercase"}}>Auto-calculated from sessions</p>
            <p style={{fontSize:".9rem"}}>3 sessions · 3 hours · £25/hr · <strong style={{color:T.gd}}>Total: £75</strong></p>
          </div>
          <div style={{background:T.bla,border:`1px solid ${T.bl}40`,borderRadius:8,padding:".85rem",marginBottom:"1rem"}}><p style={{fontSize:".78rem",color:T.bl}}>Invoice will be reviewed by admin. You'll receive a notification when approved and when paid.</p></div>
          <Btn ch="Submit Invoice" v="gold" sx={{width:"100%",justifyContent:"center"}} onClick={()=>{sInv([...invoices,{id:uid(),period:"Dec 2025",sessions:3,hours:3,rate:25,total:75,status:"pending",submitted:today()}]);sSF(false);}}/>
        </div>
      }/>}
    </div>
  );
}

/* ─── POST-SESSION FORM (tutor) ───────────────────────────────────── */
function PostSession(){
  const[step,setStep]=useState(1);
  const[att,sAtt]=useState("yes");const[dur,sDur]=useState(60);
  const[notes,sNotes]=useState("");const[psumm,sPsumm]=useState("");
  const[pptDone,sPptDone]=useState(true);const[hwSet,sHwSet]=useState(true);
  const[score,sScore]=useState("");const[grade,sGrade]=useState("");const[fb,sFb]=useState("");
  const[submitted,sSubmitted]=useState(false);
  if(submitted)return(
    <div style={{padding:"2rem",textAlign:"center"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"3rem",color:T.gd,marginBottom:"1rem"}}>✓</div>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,marginBottom:".75rem"}}>Session logged.</h2>
      <p style={{fontSize:".85rem",color:T.ash}}>Hours added to your log. Parent-visible summary saved. Assessment result entered.</p>
    </div>
  );
  return(
    <div style={{padding:"2rem",maxWidth:760}}>
      <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Post-Session Form</p>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",fontWeight:300,marginBottom:"1.75rem"}}>Alex Chen · IB Math AA HL · Lesson 9</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:"1.5rem",alignItems:"start"}}>
        <div>
          <div style={{display:"flex",gap:0,marginBottom:"1.5rem",borderRadius:8,overflow:"hidden",border:`1px solid ${T.rl}`}}>
            {[["1","Attendance"],["2","Session Notes"],["3","Assessment"]].map(([n,l],i)=>{const act=step===i+1;return<button key={n} onClick={()=>setStep(i+1)} style={{flex:1,background:act?T.ama:"transparent",color:act?T.am:T.ash,border:"none",borderRight:i<2?`1px solid ${T.rl}`:"none",padding:".7rem",fontFamily:"inherit",fontSize:".75rem",fontWeight:act?600:400,cursor:"pointer",transition:"all .18s"}}>{n} {l}</button>;})}
          </div>
          {step===1&&<div>
            <p style={{fontSize:".75rem",color:T.ash,marginBottom:".75rem"}}>Did the student attend?</p>
            <div style={{display:"flex",gap:".5rem",marginBottom:"1.1rem"}}>{["yes","no","partial"].map(v=><button key={v} onClick={()=>sAtt(v)} style={{flex:1,background:att===v?T.ama:"transparent",border:`1px solid ${att===v?T.am:T.rl}`,color:att===v?T.am:T.ash,borderRadius:8,padding:".6rem",fontFamily:"inherit",fontSize:".8rem",cursor:"pointer",transition:"all .2s",textTransform:"capitalize"}}>{v}</button>)}</div>
            <p style={{fontSize:".75rem",color:T.ash,marginBottom:".5rem"}}>Actual duration</p>
            <div style={{display:"flex",gap:".5rem",marginBottom:"1.1rem"}}>{[45,55,60,75].map(d=><button key={d} onClick={()=>sDur(d)} style={{flex:1,background:dur===d?T.ama:"transparent",border:`1px solid ${dur===d?T.am:T.rl}`,color:dur===d?T.am:T.ash,borderRadius:8,padding:".6rem",fontFamily:"inherit",fontSize:".82rem",cursor:"pointer",transition:"all .2s"}}>{d}m</button>)}</div>
            <Btn ch="Next: Session Notes →" v="gold" sx={{width:"100%",justifyContent:"center"}} onClick={()=>setStep(2)}/>
          </div>}
          {step===2&&<div>
            <p style={{fontSize:".75rem",color:T.ash,marginBottom:".4rem"}}>Session notes (private — tutor only)</p>
            <textarea value={notes} onChange={e=>sNotes(e.target.value)} placeholder="Covered Unit 1–2 topic check. Alex was strong on series, needed support on binomial coefficients…" rows={3} style={{width:"100%",background:T.n3,border:`1px solid ${T.rl}`,borderRadius:8,padding:".75rem",color:T.c2,fontFamily:"inherit",fontSize:".82rem",resize:"vertical",outline:"none",marginBottom:"1rem"}}/>
            <p style={{fontSize:".75rem",color:T.ash,marginBottom:".4rem"}}>Parent-visible summary</p>
            <textarea value={psumm} onChange={e=>sPsumm(e.target.value)} placeholder="Alex completed the Unit 1–2 topic check today and performed well on algebra sections…" rows={2} style={{width:"100%",background:T.n3,border:`1px solid ${T.rl}`,borderRadius:8,padding:".75rem",color:T.c2,fontFamily:"inherit",fontSize:".82rem",resize:"vertical",outline:"none",marginBottom:"1rem"}}/>
            <div style={{display:"flex",gap:".75rem",marginBottom:"1rem"}}>
              {[[pptDone,sPptDone,"PPT covered"],[hwSet,sHwSet,"Homework set"]].map(([v,fn,l])=>(
                <button key={l} onClick={()=>fn(!v)} style={{flex:1,display:"flex",alignItems:"center",gap:".5rem",background:v?T.gra:"transparent",border:`1px solid ${v?T.gr+"40":T.rl}`,color:v?T.gr:T.ash,borderRadius:8,padding:".55rem .85rem",fontFamily:"inherit",fontSize:".8rem",cursor:"pointer",transition:"all .2s"}}><CheckCircle size={13}/>{l}</button>
              ))}
            </div>
            <Btn ch="Next: Enter Assessment →" v="gold" sx={{width:"100%",justifyContent:"center"}} onClick={()=>setStep(3)}/>
          </div>}
          {step===3&&<div>
            <div style={{background:T.via,border:`1px solid ${T.vi}30`,borderRadius:10,padding:".85rem",marginBottom:"1.1rem"}}><p style={{fontSize:".75rem",fontWeight:600,color:T.vi,marginBottom:".25rem"}}>Assessment Lesson — Topic Check</p><p style={{fontSize:".78rem",color:T.c2}}>Enter the result for this topic check assessment below.</p></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".85rem",marginBottom:".85rem"}}>
              <div><p style={{fontSize:".72rem",color:T.ash,marginBottom:".4rem"}}>Score (out of 50)</p><input type="number" value={score} onChange={e=>sScore(e.target.value)} placeholder="e.g. 41" style={{width:"100%",background:T.n3,border:`1px solid ${T.rl}`,borderRadius:8,padding:".65rem .85rem",color:T.cr,fontFamily:"inherit",fontSize:".9rem",outline:"none"}}/></div>
              <div><p style={{fontSize:".72rem",color:T.ash,marginBottom:".4rem"}}>Grade / IB Level</p><input type="text" value={grade} onChange={e=>sGrade(e.target.value)} placeholder="e.g. 7" style={{width:"100%",background:T.n3,border:`1px solid ${T.rl}`,borderRadius:8,padding:".65rem .85rem",color:T.cr,fontFamily:"inherit",fontSize:".9rem",outline:"none"}}/></div>
            </div>
            <p style={{fontSize:".72rem",color:T.ash,marginBottom:".4rem"}}>Feedback (visible to student + parent)</p>
            <textarea value={fb} onChange={e=>sFb(e.target.value)} placeholder="Alex scored well on algebra questions. Coefficient technique needs more practice before the mid-course assessment…" rows={3} style={{width:"100%",background:T.n3,border:`1px solid ${T.rl}`,borderRadius:8,padding:".75rem",color:T.c2,fontFamily:"inherit",fontSize:".82rem",resize:"vertical",outline:"none",marginBottom:"1rem"}}/>
            <Btn ch="Submit Session Complete ✓" v="success" sx={{width:"100%",justifyContent:"center"}} onClick={()=>sSubmitted(true)}/>
          </div>}
        </div>
        <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem"}}>
          <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.ash,marginBottom:"1rem"}}>Session Zoom Details</p>
          <ZoomCard link="https://zoom.us/j/123456789?pwd=abc" meetingId="123 456 789" date="2025-11-22" time="15:30" course="IB Math AA HL" tutor="Alex Chen" status="scheduled"/>
          <div style={{marginTop:"1rem",background:T.n3,borderRadius:8,padding:".85rem"}}>
            <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".5rem"}}>Zoom Phase 1 / Phase 2</p>
            <p style={{fontSize:".78rem",color:T.c2,lineHeight:1.6}}>Phase 1 (now): Admin adds Zoom links manually. You see them here and in your schedule. Phase 2: Links auto-generate via Zoom OAuth API on booking confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN PANEL ─────────────────────────────────────────────────── */
function AdminDash({go,bp}){
  return(
    <div style={{padding:bp?.mobile?"1.25rem":"2rem"}}>
      <div style={{marginBottom:"1.75rem"}}>
        <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".3rem"}}>Platform Admin</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:bp?.mobile?"1.8rem":"2rem",fontWeight:300}}>Lynda <em style={{fontStyle:"italic",color:T.gd}}>Badmus Education</em></h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr 1fr":"repeat(4,1fr)",gap:1,background:T.rl,borderRadius:10,overflow:"hidden",marginBottom:"1.5rem"}}>
        {[[ADM.tutors.length,"Tutors",T.vi],[ADM.students.length,"Students",T.bl],[COURSES.length,"Courses",T.gd],[ADM.bookings.filter(b=>b.status==="scheduled").length,"Live bookings",T.gr]].map(([v,l,c])=>(
          <div key={l} style={{background:T.n2,padding:"1.1rem 1.4rem"}}><Stat v={v} l={l} c={c}/></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr":"1.5fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
        <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem"}}>
          <p style={{fontSize:".65rem",color:T.ash,letterSpacing:".12em",textTransform:"uppercase",marginBottom:"1rem"}}>Sessions This Week</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={WEEK_DATA}><CartesianGrid strokeDasharray="3 3" stroke={T.r2}/><XAxis dataKey="d" tick={{fill:T.ash,fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:T.ash,fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:T.n3,border:`1px solid ${T.rl}`,borderRadius:8,color:T.cr,fontSize:12}}/><Bar dataKey="n" fill={T.gd} radius={[4,4,0,0]} name="Sessions"/></BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{background:T.ama,border:`1px solid ${T.am}40`,borderRadius:12,padding:"1.4rem",marginBottom:"1rem"}}>
            <p style={{fontSize:".72rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.am,marginBottom:".75rem"}}>⚠ Pending Actions</p>
            {[`${ADM.tutors.filter(t=>t.status==="pending").length} tutor awaiting approval`,`${ADM.payouts.filter(p=>p.status==="pending").length} invoices pending review`,`${ADM.bookings.filter(b=>!b.zoom&&b.status==="scheduled").length} Zoom links missing`].map((s,i)=>(
              <p key={i} style={{fontSize:".82rem",color:T.c2,padding:".3rem 0",borderBottom:`1px solid ${T.r3}`}}>· {s}</p>
            ))}
            <div style={{display:"flex",gap:".6rem",marginTop:".9rem",flexWrap:"wrap"}}>
              <Btn ch="Tutors" v="navy" sz="xs" onClick={()=>go("admin-tutors")}/>
              <Btn ch="Payouts" v="navy" sz="xs" onClick={()=>go("admin-payouts")}/>
              <Btn ch="Zoom Links" v="navy" sz="xs" onClick={()=>go("admin-bookings")}/>
            </div>
          </div>
          <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.25rem"}}>
            <p style={{fontSize:".65rem",color:T.gr,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:".65rem"}}>PPT Coverage</p>
            <PBar p={87} col={T.gr} h={8}/>
            <p style={{fontSize:".75rem",color:T.ash,marginTop:".5rem"}}>87% of lessons have slides uploaded</p>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:bp?.mobile?"1fr":bp?.tablet?"1fr 1fr":"repeat(3,1fr)",gap:"1rem"}}>
        {[["admin-tutors","Manage Tutors","Approve, assign, set pay rates."],["admin-bookings","Bookings & Zoom","Add Zoom links, manage all sessions."],["admin-payouts","Payouts","Approve invoices, mark paid."]].map(([id,h,b])=>(
          <button key={id} onClick={()=>go(id)} style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.5rem",textAlign:"left",cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gd} onMouseLeave={e=>e.currentTarget.style.borderColor=T.rl}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:400,marginBottom:".35rem"}}>{h}</p>
            <p style={{fontSize:".8rem",color:T.ash,lineHeight:1.6,fontWeight:300}}>{b}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminTutors(){
  const[tutors,setTutors]=useState(ADM.tutors);
  return(
    <div style={{padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300}}>Tutor Manager</h2>
        <div style={{display:"flex",gap:".65rem"}}><Tag l={`${tutors.filter(t=>t.status==="pending").length} pending`} c={T.am} bg={T.ama}/><Tag l={`${tutors.filter(t=>t.status==="active").length} active`} c={T.gr} bg={T.gra}/></div>
      </div>
      {tutors.map(t=>(
        <div key={t.id} style={{background:T.n2,border:`1px solid ${t.status==="pending"?T.am:T.rl}`,borderRadius:8,padding:"1.25rem 1.5rem",marginBottom:".65rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
            <div><p style={{fontWeight:500,fontSize:".92rem"}}>{t.name}</p><p style={{fontSize:".75rem",color:T.ash}}>{t.email} · {t.subjects.join(", ")} · £{t.payRate}/hr · {t.sessions} sessions</p>{t.pending>0&&<p style={{fontSize:".72rem",color:T.am,marginTop:".15rem"}}>£{t.pending} pending payout</p>}</div>
            <div style={{display:"flex",gap:".65rem",alignItems:"center",flexWrap:"wrap"}}>
              <SBadge s={t.status}/>
              {t.status==="pending"&&<Btn ch="Approve" v="success" sz="xs" onClick={()=>setTutors(tutors.map(x=>x.id===t.id?{...x,status:"active"}:x))}/>}
              <Btn ch="Edit Pay Rate" v="navy" sz="xs" onClick={()=>{}}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminStudents(){
  return(
    <div style={{padding:"2rem"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>Students</h2>
      {ADM.students.map(s=>(
        <div key={s.id} style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:8,padding:"1.1rem 1.3rem",marginBottom:".6rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
            <div><p style={{fontWeight:500,fontSize:".9rem"}}>{s.name}</p><p style={{fontSize:".72rem",color:T.ash}}>{s.course} · Joined {fmtD(s.joined)}</p></div>
            <div style={{display:"flex",gap:"1.5rem",alignItems:"center"}}>
              <div style={{textAlign:"right"}}><p style={{fontSize:".78rem",color:T.c2}}>{s.done} done · {s.credits} left</p><PBar p={Math.round(s.done/(s.done+s.credits)*100)||0} col={T.gd} h={4}/></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminBookings(){
  const[bookings,setBookings]=useState(ADM.bookings);
  const[zModal,sZModal]=useState(null);
  const[zLink,sZLink]=useState("");const[zId,sZId]=useState("");
  const saveZoom=()=>{setBookings(bookings.map(b=>b.id===zModal?{...b,zoom:zLink,meetingId:zId}:b));sZModal(null);sZLink("");sZId("");};
  return(
    <div style={{padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem",flexWrap:"wrap",gap:"1rem"}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300}}>Bookings & Zoom Links</h2>
      </div>
      <div style={{background:T.bla,border:`1px solid ${T.bl}40`,borderRadius:8,padding:".85rem 1.2rem",marginBottom:"1.5rem",fontSize:".82rem",color:T.c2}}>
        <strong style={{color:T.bl}}>Phase 1 (Active):</strong> Admin adds Zoom links manually below. <strong style={{color:T.am}}>Phase 2 (Coming):</strong> Auto-generated via Zoom Server-to-Server OAuth on booking confirmation.
      </div>
      {bookings.map(b=>(
        <div key={b.id} style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:8,padding:"1.1rem 1.3rem",marginBottom:".65rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:"1.5rem",alignItems:"center",flexWrap:"wrap"}}>
            <div>
              <p style={{fontWeight:500,fontSize:".9rem"}}>{b.student} → {b.tutor}</p>
              <p style={{fontSize:".75rem",color:T.ash}}>{b.course} · {fmtD(b.date)} · {fmt12(b.time)}</p>
              {b.meetingId&&<p style={{fontSize:".68rem",color:T.ash2,marginTop:".15rem"}}>Meeting ID: {b.meetingId}</p>}
            </div>
            <div style={{display:"flex",gap:".65rem",alignItems:"center",flexWrap:"wrap"}}>
              <SBadge s={b.status}/>
              {b.zoom?<a href={b.zoom} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#2D8CFF",color:"#fff",borderRadius:8,padding:".3rem .8rem",fontSize:".75rem",fontWeight:600,textDecoration:"none"}}><Video size={12}/> Zoom</a>:<span style={{fontSize:".75rem",color:T.ash,fontStyle:"italic"}}>No link yet</span>}
            </div>
            <Btn ch={b.zoom?"Edit Zoom":"+ Add Zoom"} v={b.zoom?"navy":"gold"} sz="xs" onClick={()=>{sZModal(b.id);sZLink(b.zoom||"");sZId(b.meetingId||"");}}/>
          </div>
        </div>
      ))}
      {zModal&&<Modal title="Add / Update Zoom Link" onClose={()=>sZModal(null)} ch={
        <div>
          <p style={{fontSize:".83rem",color:T.ash,marginBottom:"1.25rem"}}>Paste the Zoom meeting link and meeting ID. Student, parent, and tutor will see it immediately in their dashboards.</p>
          <Inp label="Zoom Meeting Link" val={zLink} onChange={e=>sZLink(e.target.value)} ph="https://zoom.us/j/...?pwd=..."/>
          <Inp label="Meeting ID (optional)" val={zId} onChange={e=>sZId(e.target.value)} ph="123 456 789"/>
          <div style={{background:T.bla,border:`1px solid ${T.bl}40`,borderRadius:8,padding:".85rem",marginBottom:"1rem"}}><p style={{fontSize:".78rem",color:T.bl}}>Phase 2 note: In the production build, Zoom OAuth auto-creates meetings and saves the link to the DB on booking confirmation. No manual entry needed.</p></div>
          <div style={{display:"flex",gap:".75rem"}}>
            <Btn ch="Save Zoom Link" v="gold" sx={{flex:1,justifyContent:"center"}} onClick={saveZoom}/>
            <Btn ch="Cancel" v="ghost" onClick={()=>sZModal(null)}/>
          </div>
        </div>
      }/>}
    </div>
  );
}

function AdminCourses(){
  const[sel,sSel]=useState(null);
  return(
    <div style={{padding:"2rem"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>Course Manager</h2>
      <div style={{display:"grid",gridTemplateColumns:"230px 1fr",gap:"1.5rem",alignItems:"start"}}>
        <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,overflow:"hidden"}}>
          {COURSES.map(c=>{const m=CAT[c.g]||CAT.ib;return(
            <button key={c.id} onClick={()=>sSel(c.id)} style={{width:"100%",background:sel===c.id?T.gdaa:"none",border:"none",borderLeft:`3px solid ${sel===c.id?c.col:"transparent"}`,display:"flex",alignItems:"center",gap:".75rem",padding:".8rem 1rem",cursor:"pointer",textAlign:"left",borderBottom:`1px solid ${T.r2}`,transition:"all .15s",fontFamily:"inherit"}}>
              <span style={{fontSize:".9rem",color:c.col}}>{c.icon}</span>
              <div style={{flex:1,minWidth:0}}><p style={{fontSize:".8rem",fontWeight:sel===c.id?600:400,color:sel===c.id?T.gd:T.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.title}</p><p style={{fontSize:".65rem",color:T.ash}}>{c.hours.full}h</p></div>
            </button>
          );})}
        </div>
        {sel?(()=>{const c=COURSES.find(x=>x.id===sel);if(!c)return null;const m=CAT[c.g]||CAT.ib;return(
          <div>
            <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"2rem",marginBottom:"1.25rem"}}>
              <div style={{display:"flex",gap:".45rem",marginBottom:"1rem",flexWrap:"wrap"}}><Tag l={m.l} c={m.c} bg={m.bg}/>{c.lvl&&<Tag l={c.lvl.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}{c.path&&<Tag l={"Math "+c.path.toUpperCase()} c={T.ash} bg={T.r2} sz="xs"/>}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:400,marginBottom:"1.25rem"}}>{c.title}</h3>
              {c.eq&&<div style={{background:T.gdaa,border:`1px solid ${T.rl}`,borderRadius:8,padding:".85rem 1.25rem",marginBottom:"1.25rem",display:"inline-flex",alignItems:"center",gap:"1rem"}}><span style={{fontSize:".62rem",color:T.gd,letterSpacing:".1em",textTransform:"uppercase"}}>{c.eq.l}</span><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.cr}}>{c.eq.d}</span></div>}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:T.rl,borderRadius:8,overflow:"hidden"}}>
                {[[c.hours.full+"h","Full"],[c.hours.half+"h","Half"],[c.hours.q+"h","Quarter"],[`£${c.rate.gbp}/$${c.rate.usd}`,"/hr"]].map(([v,l])=>(
                  <div key={l} style={{background:T.n3,padding:".9rem 1rem"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:T.gd}}>{v}</p><p style={{fontSize:".68rem",color:T.ash}}>{l}</p></div>
                ))}
              </div>
            </div>
            <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"1.75rem"}}>
              <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.gd,marginBottom:"1rem"}}>Assessments</p>
              {c.assess.map(a=><p key={a} style={{fontSize:".83rem",color:T.ash,padding:".38rem 0",borderBottom:`1px solid ${T.r2}`}}>{a}</p>)}
              <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.bl,margin:"1.25rem 0 .85rem"}}>Outcomes</p>
              {c.outcomes.map(o=><p key={o} style={{fontSize:".83rem",color:T.ash,padding:".35rem 0",borderBottom:`1px solid ${T.r2}`}}>{o}</p>)}
              <div style={{marginTop:"1.25rem",display:"flex",gap:".65rem"}}>
                <Btn ch="Edit Lessons" v="navy" sz="sm" onClick={()=>{}}/>
                <Btn ch="Assign Tutor" v="gold" sz="sm" onClick={()=>{}}/>
                <Btn ch="Manage Assessments" v="navy" sz="sm" onClick={()=>{}}/>
              </div>
            </div>
          </div>
        );})():<div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:12,padding:"4rem",textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:300,color:T.ash}}>Select a course to manage</p></div>}
      </div>
    </div>
  );
}

function AdminPayouts(){
  const[payouts,setPayouts]=useState(ADM.payouts);
  const approve=id=>setPayouts(payouts.map(p=>p.id===id?{...p,status:"approved"}:p));
  const markPaid=id=>setPayouts(payouts.map(p=>p.id===id?{...p,status:"paid",paidAt:today(),ref:"BACS-"+uid().toUpperCase()}:p));
  const total=payouts.reduce((a,p)=>a+p.total,0);
  const pending=payouts.filter(p=>p.status==="pending").reduce((a,p)=>a+p.total,0);
  const approved=payouts.filter(p=>p.status==="approved").reduce((a,p)=>a+p.total,0);
  return(
    <div style={{padding:"2rem"}}>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1.5rem"}}>Tutor Payouts</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:T.rl,borderRadius:10,overflow:"hidden",marginBottom:"2rem"}}>
        {[[`£${total}`,"Total recorded",T.gd],[`£${pending}`,"Pending review",T.am],[`£${approved}`,"Approved, unpaid",T.bl]].map(([v,l,c])=>(
          <div key={l} style={{background:T.n2,padding:"1.2rem 1.4rem"}}><Stat v={v} l={l} c={c}/></div>
        ))}
      </div>
      {payouts.map(p=>(
        <div key={p.id} style={{background:T.n2,border:`1px solid ${p.status==="pending"?T.am:p.status==="approved"?T.bl:T.rl}`,borderRadius:8,padding:"1.25rem 1.5rem",marginBottom:".65rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
            <div><p style={{fontWeight:500,fontSize:".92rem"}}>{p.tutor}</p><p style={{fontSize:".75rem",color:T.ash}}>{p.period} · {p.hours}h · £{p.rate}/hr{p.ref?` · Ref: ${p.ref}`:""}</p>{p.paidAt&&<p style={{fontSize:".72rem",color:T.ash2,marginTop:".1rem"}}>Paid: {fmtD(p.paidAt)}</p>}</div>
            <div style={{display:"flex",gap:".65rem",alignItems:"center",flexWrap:"wrap"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:300,color:T.gd}}>£{p.total}</p>
              <SBadge s={p.status}/>
              {p.status==="pending"&&<Btn ch="Approve" v="success" sz="xs" onClick={()=>approve(p.id)}/>}
              {p.status==="approved"&&<Btn ch="Mark Paid ✓" v="gold" sz="xs" onClick={()=>markPaid(p.id)}/>}
            </div>
          </div>
        </div>
      ))}
      <div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:10,padding:"1.5rem",marginTop:"1.5rem"}}>
        <p style={{fontSize:".72rem",fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:T.gd,marginBottom:".65rem"}}>Pay Rate Configuration</p>
        <p style={{fontSize:".82rem",color:T.ash,fontWeight:300}}>Admin sets per-tutor pay rates individually. Rate is snapshotted on session completion and used for invoice calculation. Cannot be retroactively changed on submitted invoices.</p>
        {ADM.tutors.filter(t=>t.status==="active").map(t=>(
          <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:".75rem 0",borderBottom:`1px solid ${T.r2}`}}>
            <p style={{fontSize:".85rem",fontWeight:500}}>{t.name}</p>
            <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.gd}}>£{t.payRate}/hr</p>
              <Btn ch="Edit Rate" v="navy" sz="xs" onClick={()=>{}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AI WIDGET ───────────────────────────────────────────────────── */
function AIWidget(){
  const[open,sOpen]=useState(false);
  const[msgs,sMsgs]=useState([{role:"assistant",text:"Hello! I'm the Course Guide for Lynda Badmus Education. Tell me your subject and year group and I'll help you choose the right course. 😊"}]);
  const[inp,sInp]=useState("");const[loading,sLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const PROMPTS=["IB Math AA or AI — difference?","Which IB level suits me?","How do Zoom sessions work?","AP or A-Level Chem?","IB Chemistry SL vs HL?"];
  const send=useCallback(async text=>{
    const txt=(text||inp).trim();if(!txt||loading)return;
    const hist=[...msgs,{role:"user",text:txt}];
    sMsgs(hist);sInp("");sLoading(true);
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,system:AI_SYS,messages:hist.map(m=>({role:m.role,content:m.text}))})});
      const data=await res.json();
      const reply=data.content?.map(b=>b.text||"").join("")||"Connection issue — please try again.";
      sMsgs(p=>[...p,{role:"assistant",text:reply}]);
    }catch{sMsgs(p=>[...p,{role:"assistant",text:"Connection issue — please try again."}]);}
    finally{sLoading(false);}
  },[msgs,inp,loading]);
  return(
    <>
      <div style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:999}}>
        {!open&&<button onClick={()=>sOpen(true)} style={{width:52,height:52,borderRadius:"50%",background:T.gd,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",boxShadow:T.s2,transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>💬</button>}
      </div>
      {open&&(
        <div style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:1000,width:360,maxWidth:"calc(100vw - 2rem)",background:T.n2,border:`1px solid ${T.rl}`,borderRadius:20,display:"flex",flexDirection:"column",height:470,overflow:"hidden",boxShadow:T.s3}}>
          <div style={{background:T.n3,padding:".9rem 1.2rem",display:"flex",alignItems:"center",gap:".65rem",borderBottom:`1px solid ${T.rl}`,flexShrink:0}}>
            <Logo size={26} text={false}/>
            <div style={{flex:1}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".95rem"}}>Course Guide</p><p style={{fontSize:".62rem",color:T.ash}}>Lynda Badmus Education · AI</p></div>
            <div style={{display:"flex",alignItems:"center",gap:".35rem",flexShrink:0}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:T.gr}}/>
              <button onClick={()=>sOpen(false)} style={{background:"none",border:"none",color:T.ash,fontSize:"1.2rem",cursor:"pointer",marginLeft:".4rem"}}>&times;</button>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"1rem",display:"flex",flexDirection:"column",gap:".55rem"}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"85%",background:m.role==="user"?T.gdaa:T.n3,border:`1px solid ${m.role==="user"?T.rl:T.r2}`,borderRadius:11,borderBottomRightRadius:m.role==="user"?3:11,borderBottomLeftRadius:m.role==="user"?11:3,padding:".65rem .9rem",fontSize:".82rem",color:T.c2,lineHeight:1.62,fontWeight:300,whiteSpace:"pre-line"}}>{m.text}</div>
              </div>
            ))}
            {loading&&<div style={{alignSelf:"flex-start",background:T.n3,border:`1px solid ${T.r2}`,borderRadius:11,borderBottomLeftRadius:3,padding:".65rem .9rem",fontSize:".78rem",color:T.ash,fontStyle:"italic"}}>Thinking…</div>}
            <div ref={endRef}/>
          </div>
          <div style={{padding:".55rem .85rem",borderTop:`1px solid ${T.rl}`,display:"flex",flexWrap:"wrap",gap:".28rem",flexShrink:0,maxHeight:76,overflowY:"auto"}}>
            {PROMPTS.map((p,i)=><button key={i} onClick={()=>send(p)} style={{background:"transparent",border:`1px solid ${T.rl}`,borderRadius:3,padding:".15rem .55rem",fontSize:".6rem",color:T.ash,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gd;e.currentTarget.style.color=T.gd;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.rl;e.currentTarget.style.color=T.ash;}}>{p.length>28?p.slice(0,28)+"…":p}</button>)}
          </div>
          <div style={{padding:".75rem .95rem",borderTop:`1px solid ${T.rl}`,display:"flex",gap:".55rem",alignItems:"flex-end",flexShrink:0}}>
            <textarea value={inp} onChange={e=>sInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask about courses…" rows={1} style={{flex:1,background:"transparent",border:"none",borderBottom:`1px solid ${T.rl}`,padding:".4rem 0",fontFamily:"inherit",fontSize:".82rem",color:T.cr,outline:"none",resize:"none",maxHeight:66,lineHeight:1.5,transition:"border-color .2s"}} onFocus={e=>e.currentTarget.style.borderBottomColor=T.gd} onBlur={e=>e.currentTarget.style.borderBottomColor=T.rl}/>
            <button onClick={()=>send()} disabled={loading||!inp.trim()} style={{background:T.gd,border:"none",width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.n,fontSize:"1rem",transition:"background .18s",opacity:loading||!inp.trim()?.4:1,flexShrink:0}} onMouseEnter={e=>{if(!loading&&inp.trim())e.currentTarget.style.background="#9A7848";}} onMouseLeave={e=>e.currentTarget.style.background=T.gd}>›</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════ */
export default function App(){
  const[pg,setPg]=useState("home");
  const[cur,setCur]=useState("GBP");
  const[user,setUser]=useState(null);
  const[drawerOpen,setDrawerOpen]=useState(false);
  const[sideOpen,setSideOpen]=useState(false);
  const bp=useBreakpoint();

  useEffect(()=>{
    let cancelled=false;
    // Rehydrate: prefer a live Supabase session; fall back to the cached demo user.
    (async()=>{
      try{
        const{data}=await supabase.auth.getSession();
        if(cancelled)return;
        if(data?.session?.user){
          const u=await loadUserFromAuth(data.session.user);
          if(!cancelled)setUser(u);
          return;
        }
      }catch{}
      try{const saved=localStorage.getItem("lbe-v3");if(saved&&!cancelled)setUser(JSON.parse(saved));}catch{}
    })();
    // Keep the app in sync with auth events (sign-in in another tab, token refresh, etc.).
    const{data:sub}=supabase.auth.onAuthStateChange(async(_evt,session)=>{
      if(session?.user){const u=await loadUserFromAuth(session.user);setUser(u);}
      else setUser(null);
    });
    return()=>{cancelled=true;sub?.subscription?.unsubscribe?.();};
  },[]);
  useEffect(()=>{
    try{if(user)localStorage.setItem("lbe-v3",JSON.stringify(user));else localStorage.removeItem("lbe-v3");}catch{}
  },[user]);

  const go=useCallback(p=>{setPg(p);setSideOpen(false);requestAnimationFrame(()=>window.scrollTo({top:0,behavior:"smooth"}));},[]);
  const logout=useCallback(async()=>{try{await supabase.auth.signOut();}catch{}setUser(null);go("home");},[go]);

  const studentPgs=["dashboard","my-courses","booking","assessments","progress","account"];
  const parentPgs=["parent","par-assess","par-sessions","par-billing"];
  const tutorPgs=["tutor-dash","tutor-schedule","tutor-hours","tutor-invoices","tutor-post"];
  const adminPgs=["admin","admin-tutors","admin-students","admin-courses","admin-bookings","admin-payouts"];
  const appPgs=[...studentPgs,...parentPgs,...tutorPgs,...adminPgs];

  let courseId=null;if(pg.startsWith("course-"))courseId=pg.slice(7);

  // Auth guards
  const authWall=(pages,role)=>{
    if(!pages.includes(pg))return false;
    if(!user||user.role!==role){return true;}
    return false;
  };
  if(authWall(studentPgs,"student")||authWall(parentPgs,"parent")||authWall(tutorPgs,"tutor")||authWall(adminPgs,"admin")){
    return(<><style dangerouslySetInnerHTML={{__html:CSS}}/><TopNav pg={pg} go={go} cur={cur} setCur={setCur} user={user} logout={logout} bp={bp} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/><SideDrawer pg={pg} go={go} cur={cur} setCur={setCur} user={user} logout={logout} open={drawerOpen} onClose={()=>setDrawerOpen(false)}/><Login go={go} setUser={setUser} bp={bp}/><AIWidget/></>);
  }

  const inApp=appPgs.includes(pg);

  const renderPage=()=>{
    if(courseId)return<CourseDetail courseId={courseId} go={go} cur={cur} user={user} setUser={setUser} bp={bp}/>;
    switch(pg){
      case"home":       return<Home go={go} cur={cur} bp={bp}/>;
      case"about":      return<About go={go} bp={bp}/>;
      case"courses":    return<CoursesPage go={go} cur={cur} bp={bp}/>;
      case"pricing":    return<PricingPage go={go} cur={cur} bp={bp}/>;
      case"faqs":       return<FAQsPage bp={bp}/>;
      case"contact":    return<Contact go={go} bp={bp}/>;
      case"login":      return<Login go={go} setUser={setUser} bp={bp}/>;
      case"signup":     return<Signup go={go} setUser={setUser}/>;
      case"dashboard":  return<StudentDash user={user} setUser={setUser} go={go} bp={bp}/>;
      case"my-courses": return<MyCourses user={user} go={go}/>;
      case"booking":    return<div style={{padding:"2rem"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1rem"}}>🎥 Book Zoom Lessons</h2><p style={{fontSize:".85rem",color:T.ash}}>Use the "Book Lesson" button on your enrolled course in the Dashboard to open the full booking calendar with credit deduction and Zoom link generation.</p></div>;
      case"assessments":return<Assessments user={user}/>;
      case"progress":   return<div style={{padding:"2rem"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1rem"}}>Progress Tracker</h2><p style={{fontSize:".85rem",color:T.ash,marginBottom:"1.5rem"}}>Score trend and unit progress are displayed on your Dashboard. Full progress view available here in production.</p>{UNITS.map(u=><div key={u.u} style={{marginBottom:"1rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:".4rem"}}><p style={{fontSize:".88rem",color:u.p>0?T.cr:T.ash2}}>{u.u}</p><p style={{fontSize:".82rem",color:u.p===100?T.gr:u.p>0?u.c:T.ash2,fontWeight:600}}>{u.p}%</p></div><PBar p={u.p} col={u.c} h={7}/></div>)}</div>;
      case"account":    return<div style={{padding:"2rem",maxWidth:500}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"2rem"}}>Account</h2>{[["Name",user.name],["Email",user.email],["Role",user.role],["Timezone","Europe/London"],["Currency",cur]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:".8rem 0",borderBottom:`1px solid ${T.r2}`}}><span style={{fontSize:".72rem",color:T.ash2,letterSpacing:".08em",textTransform:"uppercase"}}>{k}</span><span style={{fontSize:".85rem",color:T.ash}}>{v}</span></div>)}</div>;
      case"parent":     return<ParentPortal user={user} go={go} bp={bp}/>;
      case"par-assess": return<Assessments user={USERS.find(u=>u.id==(user.childId))||USERS[0]}/>;
      case"par-sessions":return<div style={{padding:"2rem"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1rem"}}>Session History</h2>{(USERS.find(u=>u.id==user.childId)||USERS[0]).enrollments?.[0]?.bookings?.map(b=><div key={b.id} style={{marginBottom:".65rem"}}><ZoomCard link={b.zoom} meetingId={b.meetingId} date={b.date} time={b.time} course="IB Math AA HL" tutor={b.tutor} status={b.status}/></div>)}</div>;
      case"par-billing":return<div style={{padding:"2rem"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,marginBottom:"1rem"}}>Billing</h2><div style={{background:T.n2,border:`1px solid ${T.rl}`,borderRadius:8,padding:"1.2rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontWeight:500}}>IB Math AA HL — Full Course</p><p style={{fontSize:".72rem",color:T.ash}}>Sep 2025 · Stripe</p></div><div style={{textAlign:"right"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:T.gd}}>£2,500</p><SBadge s="paid"/></div></div></div>;
      case"tutor-dash": return<TutorDash user={user} go={go} bp={bp}/>;
      case"tutor-schedule":return<TutorSchedule/>;
      case"tutor-hours":return<TutorHours go={go}/>;
      case"tutor-invoices":return<TutorInvoices/>;
      case"tutor-post": return<PostSession/>;
      case"admin":      return<AdminDash go={go} bp={bp}/>;
      case"admin-tutors":return<AdminTutors/>;
      case"admin-students":return<AdminStudents/>;
      case"admin-courses":return<AdminCourses/>;
      case"admin-bookings":return<AdminBookings/>;
      case"admin-payouts":return<AdminPayouts/>;
      default: return<Home go={go} cur={cur} bp={bp}/>;
    }
  };

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <TopNav pg={pg} go={go} cur={cur} setCur={setCur} user={user} logout={logout} bp={bp} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
      {!inApp&&<SideDrawer pg={pg} go={go} cur={cur} setCur={setCur} user={user} logout={logout} open={drawerOpen} onClose={()=>setDrawerOpen(false)}/>}
      {inApp?(
        <div style={{paddingTop:66,height:"100vh",display:"flex",overflow:"hidden"}}>
          <Sidebar pg={pg} go={go} user={user} bp={bp} open={sideOpen} onClose={()=>setSideOpen(false)}/>
          {(bp.mobile||bp.tablet)&&(
            <div style={{position:"fixed",top:66,left:0,right:0,background:T.n2,borderBottom:`1px solid ${T.rl}`,padding:".6rem 1.25rem",zIndex:50,display:"flex",alignItems:"center",gap:"1rem"}}>
              <button onClick={()=>setSideOpen(true)} style={{background:"none",border:`1px solid ${T.rl}`,color:T.ash,borderRadius:8,padding:".38rem .65rem",cursor:"pointer",display:"flex",alignItems:"center",gap:".4rem",fontFamily:"inherit",fontSize:".8rem"}}><Menu size={16}/> Menu</button>
              <p style={{fontSize:".78rem",color:T.ash}}>{({dashboard:"Dashboard",parent:"Parent Portal","tutor-dash":"Tutor Portal",admin:"Admin"}[pg])||pg}</p>
            </div>
          )}
          <main style={{flex:1,overflowY:"auto",background:T.n,marginTop:bp.mobile||bp.tablet?42:0}} className="fIn" key={pg}>
            {renderPage()}
          </main>
        </div>
      ):(
        <main className="fIn" key={pg}>{renderPage()}</main>
      )}
      <AIWidget/>
    </>
  );
}
