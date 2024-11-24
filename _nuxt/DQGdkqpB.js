import{_ as L}from"./DlByl_3x.js";import{_ as T,a as F,b as V,c as I}from"./fXtGPtzG.js";import{_ as j,a as C}from"./BRERTzvE.js";import{_ as A}from"./C8BIUtIW.js";import{e as B,f as r,r as N,o as e,c as n,a as s,g as D,h as t,t as h,F as y,i as k,b as l,j as b,d as E,k as R}from"./CLIvMcHX.js";import{_ as U}from"./BXGW6hyX.js";const q={type:"button",class:"btn btn-secondary","data-bs-toggle":"dropdown"},z=["src"],H={class:"dropdown-menu p-2",style:{width:"17rem"}},J={class:"row g-3"},K={key:0,class:"col-12"},M={class:"row g-1"},O={class:"col-12"},P={class:"text-subtitle"},Q={key:1,class:"col-12"},W={class:"row g-1"},X={class:"col-12"},Y={class:"text-subtitle"},Z={class:"col-12"},ss={class:"row g-1"},ts={class:"col-12"},os={class:"text-subtitle"},es={class:"col-12"},ns={class:"row g-1"},is={class:"col-12"},cs={class:"text-subtitle"},ls={class:"col-12"},ds={__name:"GeneratorInfo",props:["id","img"],setup(g){const m=g,a=B(),o=r(()=>a.elems.find(d=>d.id==m.id)),u=r(()=>a.getCosts(o.value)),i=r(()=>a.getInputs(o.value)),_=r(()=>a.getResults(o.value)),c=r(()=>a.getUpgrades(o.value));return(d,w)=>{const v=N("font-awesome-icon"),$=T,p=F,S=j,G=A;return e(),n(y,null,[s("button",q,[g.img?(e(),n("img",{key:0,src:g.img,width:"18",height:"18"},null,8,z)):(e(),D(v,{key:1,icon:"fas fa-info-circle","fixed-width":""}))]),s("div",H,[s("div",J,[t(i)?(e(),n("div",K,[s("div",M,[s("div",O,[s("span",P,h(d.$t("word_inputs")),1)]),(e(!0),n(y,null,k(t(i),(x,f)=>(e(),n("div",{key:f,class:"col-12"},[l($,{id:f,count:x},null,8,["id","count"])]))),128))])])):b("",!0),t(c)?(e(),n("div",Q,[s("div",W,[s("div",X,[s("span",Y,h(d.$t("word_upgrades")),1)]),(e(!0),n(y,null,k(t(c),(x,f)=>(e(),n("div",{key:f,class:"col-12"},[l(p,{id:f,count:x},null,8,["id","count"])]))),128))])])):b("",!0),s("div",Z,[s("div",ss,[s("div",ts,[s("span",os,h(d.$t("word_costs")),1)]),(e(!0),n(y,null,k(t(u),(x,f)=>(e(),n("div",{key:f,class:"col-12"},[l(S,{id:f,count:x},null,8,["id","count"])]))),128))])]),s("div",es,[s("div",ns,[s("div",is,[s("span",cs,h(d.$t("word_results")),1)]),s("div",ls,[l(G,{id:"energy",count:t(_).energy},null,8,["count"])])])])])])],64)}}},as={class:"row gx-2 align-items-center"},_s={class:"col-auto position-relative"},rs={key:0,class:"position-absolute lh-1 small text-success",style:{right:"0",top:"0"}},us={class:"col text-truncate"},ms={class:"text-white"},ps={class:"col-auto"},hs={class:"col-auto"},gs={class:"input-group"},fs={__name:"Generator",props:["id"],setup(g){const m=g,a=B(),o=r(()=>a.elems.find(i=>i.id==m.id)),u=r(()=>a.elems.find(i=>i.type=="manual"&&i.results[o.value.id]));return o.value.notified&&setTimeout(()=>{o.value.notified=!1},1e3),(i,_)=>{const c=ds,d=N("font-awesome-icon"),w=L,v=V,$=C;return e(),n("div",as,[s("div",_s,[l(c,{id:t(u).id,img:t(o).img},null,8,["id","img"]),t(o).notified?(e(),n("div",rs,[l(d,{icon:"fas fa-certificate"})])):b("",!0)]),s("div",us,[s("span",ms,h(i.$t(t(o).name)),1)]),s("div",ps,[_[0]||(_[0]=s("small",null,"x",-1)),_[1]||(_[1]=E()),l(w,{id:t(o).id},null,8,["id"])]),s("div",hs,[s("div",gs,[l(v,{id:t(u).id},null,8,["id"]),l($,{id:t(u).id,icon:"fas fa-plus-circle"},null,8,["id"])])])])}}},vs={key:0,class:"row gx-1 align-items-center"},$s={class:"col-auto position-relative"},ys={key:0,class:"position-absolute lh-1 small text-success",style:{right:"0",top:"0"}},ws={class:"col text-truncate"},ks={class:"text-white"},bs={class:"col-auto"},xs={class:"col-auto"},Ss={class:"input-group"},Bs={key:1,class:"row gx-1 align-items-center"},Ls={class:"col-auto"},Ns={type:"button",class:"btn btn-secondary",disabled:"",style:{width:"40px"}},Vs={class:"col text-truncate"},Cs={class:"opacity-50"},Es={__name:"Building",props:["id"],setup(g){const m=g,a=B(),o=r(()=>a.elems.find(i=>i.id==m.id)),u=r(()=>a.elems.find(i=>i.type=="manual"&&i.results[o.value.id]));return o.value.notified&&setTimeout(()=>{o.value.notified=!1},1e3),(i,_)=>{const c=U,d=N("font-awesome-icon"),w=I,v=L,$=V,p=C;return t(o).unlocked?(e(),n("div",vs,[s("div",$s,[l(c,{id:t(u).id,img:t(o).img},null,8,["id","img"]),t(o).notified?(e(),n("div",ys,[l(d,{icon:"fas fa-certificate"})])):b("",!0),l(w,{id:t(o).id,class:"position-absolute",style:{top:"0",left:"0px"}},null,8,["id"])]),s("div",ws,[s("span",ks,h(i.$t(t(o).name)),1)]),s("div",bs,[_[0]||(_[0]=s("small",null,"x",-1)),_[1]||(_[1]=E()),l(v,{id:t(o).id},null,8,["id"])]),s("div",xs,[s("div",Ss,[l($,{id:t(u).id},null,8,["id"]),l(p,{id:t(u).id,icon:"fas fa-plus-circle"},null,8,["id"])])])])):(e(),n("div",Bs,[s("div",Ls,[s("button",Ns,[l(d,{icon:"fas fa-lock","fixed-width":""})])]),s("div",Vs,[s("span",Cs,h(i.$t("word_locked")),1)])]))}}},Gs={class:"container p-2"},Ts={class:"row g-3"},Fs={key:0,class:"col-12"},Is={class:"card"},js={class:"card-header"},As={class:"row gx-2 align-items-center"},Ds={class:"col"},Rs={class:"fs-6 text-white"},Us={class:"col-auto"},qs={class:"bg-dark rounded py-1 px-2"},zs={class:"text-white"},Hs=["src"],Js={key:0,class:"card-body"},Ks={class:"row gy-1 gx-4"},Ms={class:"card"},Os={class:"card-header"},Ps={class:"fs-6 text-white"},Qs={class:"card-body"},Ws={class:"row gy-1 gx-4"},et={__name:"buildings",setup(g){const m=R(),a=B(),o=r(()=>a.elems.filter(c=>(m.showLocked?!0:c.unlocked)&&c.type=="generator")),u=r(()=>[...new Set(a.elems.filter(c=>(m.showLocked?!0:c.unlocked)&&c.type=="building").map(c=>c.group))]),i=function(c){return a.elems.filter(d=>(m.showLocked?!0:d.unlocked)&&d.type=="building"&&d.group==c).map(d=>d.id)},_=r(()=>a.getElem("energy"));return(c,d)=>{const w=L,v=fs,$=Es;return e(),n("div",Gs,[s("div",Ts,[t(m).showLocked||t(_).unlocked?(e(),n("div",Fs,[s("div",Is,[s("div",js,[s("div",As,[s("div",Ds,[s("span",Rs,h(c.$t(t(_).name)),1)]),s("div",Us,[s("div",qs,[s("span",zs,[s("img",{src:t(_).img,width:"16",height:"16"},null,8,Hs),l(w,{id:"energy",class:"ms-2"})])])])])]),t(o).length>0?(e(),n("div",Js,[s("div",Ks,[(e(!0),n(y,null,k(t(o),p=>(e(),n("div",{key:p.id,class:"col-12 col-lg-6"},[l(v,{id:p.id},null,8,["id"])]))),128))])])):b("",!0)])])):b("",!0),(e(!0),n(y,null,k(t(u),p=>(e(),n("div",{key:p,class:"col-12"},[s("div",Ms,[s("div",Os,[s("span",Ps,h(c.$t(p)),1)]),s("div",Qs,[s("div",Ws,[(e(!0),n(y,null,k(i(p),S=>(e(),n("div",{key:S,class:"col-12 col-lg-6"},[l($,{id:S},null,8,["id"])]))),128))])])])]))),128))])])}}};export{et as default};