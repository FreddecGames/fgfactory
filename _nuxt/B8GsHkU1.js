import{k as p,f as u,r as h,o as n,c,a as s,F as f,i as v,p as b,h as i,t as a,C as g,j as y,b as S}from"./D5_xpTW6.js";const w={class:"container p-2"},k={class:"row g-3 justify-content-center"},C={class:"card-header"},$={class:"row gx-1 align-items-center"},x={class:"col"},B={class:"fs-5 text-white"},I={class:"opacity-50"},N={key:0,class:"col-auto"},V={class:"card-body"},j={class:"row g-1 align-items-center"},F={class:"col-12"},z={class:"col-12 text-end"},A=["disabled","onClick"],D={class:"ms-2"},O={__name:"scenarios",setup(E){const o=p(),r=u(()=>o.scenarios.filter(t=>!t.implementing)),l=function(t){o.newScenarioId=t,o.showModal("modalScenario")},_=function(t){return o.completedScenarios.indexOf(t)};return(t,d)=>{const m=h("font-awesome-icon");return n(),c("div",w,[s("div",k,[(n(!0),c(f,null,v(i(r),e=>(n(),c("div",{key:e.id,class:"col-12"},[s("div",{class:b(["card",{"border-primary":e.id==i(o).currentScenarioId}])},[s("div",C,[s("div",$,[s("div",x,[s("span",B,a(t.$t(e.title)),1),s("div",I,a(t.$t(e.subtitle)),1)]),_(e.id)>-1?(n(),c("div",N,d[0]||(d[0]=[s("img",{src:g,width:"24",height:"24"},null,-1)]))):y("",!0)])]),s("div",V,[s("div",j,[s("div",F,[s("span",null,a(t.$t(e.desc)),1)]),s("div",z,[s("button",{type:"button",class:"btn btn-secondary text-start",disabled:e.id==i(o).currentScenarioId,onClick:L=>{l(e.id)}},[S(m,{icon:"fas fa-sync-alt"}),s("span",D,a(t.$t("modalScenario_close")),1)],8,A)])])])],2)]))),128))])])}}};export{O as default};
