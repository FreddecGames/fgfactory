import{f as u}from"./C1xH3N-8.js";import{u as m}from"./BMyf1R2r.js";import{f as g,o as i,c as l,h as t,a as o,j as h,t as d,n as _}from"./f8AjloxH.js";const p={class:"row gx-2 align-items-center justify-content-end"},b=["title"],f=["src"],v={class:"col text-white text-truncate"},x={class:"col-auto"},N={__name:"BlockInput",props:["id","count"],setup(s){const c=s,n=m(),e=g(()=>n.getElem(c.id));return(a,r)=>(i(),l("div",p,[t(e).img!=null?(i(),l("div",{key:0,class:"col-auto",title:a.$t(t(e).name)},[o("img",{src:t(e).img,width:"16",height:"16"},null,8,f)],8,b)):h("",!0),o("div",v,d(a.$t(t(e).name)),1),o("div",x,[o("span",{class:_(["badge d-block",{"text-bg-success":t(e).prod>=s.count,"text-bg-danger":t(e).prod<s.count}]),style:{width:"55px"}},d(t(u)(s.count))+" /s",3)])]))}},$={class:"row gx-2 align-items-center justify-content-end"},k=["title"],w=["src"],y={class:"col text-white text-truncate"},C={class:"col-auto"},I={__name:"BlockUpgrade",props:["id","count"],setup(s){const c=s,n=m(),e=g(()=>n.getElem(c.id)),a=n.getAvailableCount(c.id);return(r,S)=>(i(),l("div",$,[t(e).img!=null?(i(),l("div",{key:0,class:"col-auto",title:r.$t(t(e).name)},[o("img",{src:t(e).img,width:"16",height:"16"},null,8,w)],8,k)):h("",!0),o("div",y,d(r.$t(t(e).name)),1),o("div",C,[o("span",{class:_(["badge d-block",{"text-bg-success":t(a)>=s.count,"text-bg-danger":t(a)<s.count}]),style:{width:"55px"}},d(t(u)(s.count)),3)])]))}},B={key:0,class:"badge text-bg-success"},V={__name:"ItemAvailable",props:["id"],setup(s){const c=s,n=m(),e=g(()=>n.getAvailableCount(c.id));return(a,r)=>t(e)>0?(i(),l("span",B,d(t(u)(t(e))),1)):h("",!0)}};export{N as _,I as a,V as b};