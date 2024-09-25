import{_ as x,a as S}from"./CcbLNUag.js";import{_ as u}from"./DlAUqK2U.js";import{r as m,o as l,c as r,a as s,t as o,b as n,q as h,u as C,s as D,d as A,F as b,i as B,g as i,n as F}from"./EBHw3XF1.js";import{a as L}from"./DKqwsp4J.js";const E={},I={id:"toastImportEmpty",class:"toast align-items-center text-bg-danger border-0",role:"alert","aria-live":"assertive","aria-atomic":"true"},N={class:"d-flex align-items-center"},V={class:"col toast-body"},M=["aria-label"];function U(d,e){const _=m("font-awesome-icon");return l(),r("div",I,[s("div",N,[s("div",V,o(d.$t("toast_importEmpty")),1),s("button",{type:"button",class:"btn-close p-2 me-2","data-bs-dismiss":"toast","aria-label":d.$t("toast_close")},[n(_,{icon:"fas fa-times"})],8,M)])])}const X=u(E,[["render",U]]),q={},z={id:"toastImportCorrupted",class:"toast align-items-center text-bg-danger border-0",role:"alert","aria-live":"assertive","aria-atomic":"true"},H={class:"d-flex align-items-center"},J={class:"col toast-body"},K=["aria-label"];function P(d,e){const _=m("font-awesome-icon");return l(),r("div",z,[s("div",H,[s("div",J,o(d.$t("toast_importCorrupted")),1),s("button",{type:"button",class:"btn-close p-2 me-2","data-bs-dismiss":"toast","aria-label":d.$t("toast_close")},[n(_,{icon:"fas fa-times"})],8,K)])])}const Q=u(q,[["render",P]]),R=h("/patreon.png"),T=h("/kofi.png"),W=h("/paypal.png"),Y=h("/discord.png"),Z={class:"container"},j={class:"row g-3"},G={class:"col-12"},O={class:"card"},ss={class:"card-header"},ts={class:"text-white"},os={class:"card-body"},ns={class:"row gx-2 gy-3"},es={class:"col-12"},as={class:"row g-2"},cs={class:"col-12"},is={class:"col"},ds={href:"https://www.patreon.com/bePatron?u=61283131",class:"w-100 btn btn-secondary",target:"_blank"},_s=s("img",{src:R,width:"16",height:"16"},null,-1),ls={class:"ms-2 d-none d-sm-inline"},rs={class:"col"},ps={href:"https://ko-fi.com/freddecgames",class:"w-100 btn btn-secondary",target:"_blank"},hs=s("img",{src:T,width:"16",height:"16"},null,-1),ms={class:"ms-2 d-none d-sm-inline"},bs={class:"col",action:"https://www.paypal.com/cgi-bin/webscr",method:"post",target:"_blank"},us=s("input",{type:"hidden",name:"cmd",value:"_s-xclick"},null,-1),vs=s("input",{type:"hidden",name:"hosted_button_id",value:"7XYD7SJFKQ8M4"},null,-1),fs={type:"submit",class:"w-100 btn btn-secondary"},gs=s("img",{src:W,width:"16",height:"16"},null,-1),ws={class:"ms-2 d-none d-sm-inline"},ys={class:"col"},$s={href:"https://discord.gg/ZXrggavUpv",class:"w-100 btn btn-secondary",target:"_blank"},ks=s("img",{src:Y,width:"16",height:"16"},null,-1),xs={class:"ms-2 d-none d-sm-inline"},Ss={class:"col-12"},Cs=s("a",{href:"https://fontawesome.com/",target:"_blank"},"Fontawesome",-1),Ds={class:"col-12"},As={class:"card"},Bs={class:"card-header"},Fs={class:"text-white"},Ls={class:"card-body"},Es={class:"row g-2"},Is=["onClick"],Ns=["src"],Vs={class:"col-12"},Ms={class:"card"},Us={class:"card-header"},Xs={class:"text-white"},qs={class:"card-body"},zs={class:"row gx-3 gy-3"},Hs={class:"col-12 col-md-6"},Js={class:"row g-2"},Ks={class:"col-12"},Ps={id:"localData",spellcheck:"false",rows:"3",class:"w-100 form-control",disabled:"",readonly:""},Qs={class:"col-4"},Rs={class:"ms-2"},Ts={class:"col-4"},Ws={class:"ms-2"},Ys={class:"col-4"},Zs={class:"ms-2"},js={class:"col-12 col-md-6"},Gs={class:"row g-2"},Os=s("div",{class:"col-12"},[s("textarea",{spellcheck:"false",rows:"3",id:"importData",class:"w-100 form-control"})],-1),st={class:"col-4 ms-auto"},tt={class:"ms-2"},ot={id:"toast-container",class:"toast-container position-fixed bottom-0 end-0 p-3"},dt={__name:"options",setup(d){C({title:"page_options"});const e=L(),{locale:_,locales:v,setLocale:f}=D(),g=function(t){f(t),e.locale=t};return(t,a)=>{const p=m("font-awesome-icon"),w=x,y=X,$=Q,k=S;return l(),r(b,null,[s("div",Z,[s("div",j,[s("div",G,[s("div",O,[s("div",ss,[s("span",ts,o(t.$t("options_about")),1)]),s("div",os,[s("div",ns,[s("div",es,[s("div",as,[s("div",cs,o(t.$t("options_love")),1),s("div",is,[s("a",ds,[_s,s("span",ls,o(t.$t("options_patreon")),1)])]),s("div",rs,[s("a",ps,[hs,s("span",ms,o(t.$t("options_kofi")),1)])]),s("form",bs,[us,vs,s("button",fs,[gs,s("span",ws,o(t.$t("options_paypal")),1)])]),s("div",ys,[s("a",$s,[ks,s("span",xs,o(t.$t("options_discord")),1)])])])]),s("div",Ss,[A(o(t.$t("options_iconsBy"))+" ",1),Cs])])])])]),s("div",Ds,[s("div",As,[s("div",Bs,[s("span",Fs,o(t.$t("options_language")),1)]),s("div",Ls,[s("div",Es,[(l(!0),r(b,null,B(i(v),c=>(l(),r("div",{key:c.code,class:"col-auto"},[s("button",{type:"button",class:F(["btn btn-secondary btn-icon",{"text-bg-primary":i(_)==c.code}]),onClick:nt=>g(c.code)},[s("img",{src:"/flags/"+c.code+".png",height:"24"},null,8,Ns)],10,Is)]))),128))])])])]),s("div",Vs,[s("div",Ms,[s("div",Us,[s("span",Xs,o(t.$t("options_localData")),1)]),s("div",qs,[s("div",zs,[s("div",Hs,[s("div",Js,[s("div",Ks,[s("textarea",Ps,o(i(e).localStorageData),1)]),s("div",Qs,[s("button",{type:"button",class:"w-100 btn btn-danger px-0",onClick:a[0]||(a[0]=c=>{i(e).showModal("modalWipe")})},[s("span",null,[n(p,{icon:"fas fa-fw fa-skull"})]),s("span",Rs,o(t.$t("options_wipeSave")),1)])]),s("div",Ts,[s("button",{type:"button",class:"w-100 btn btn-secondary px-0",onClick:a[1]||(a[1]=c=>{i(e).exportAppState()})},[s("span",null,[n(p,{icon:"fas fa-fw fa-copy"})]),s("span",Ws,o(t.$t("options_exportSave")),1)])]),s("div",Ys,[s("button",{type:"button",class:"w-100 btn btn-secondary px-0",onClick:a[2]||(a[2]=c=>{i(e).downloadAppState()})},[s("span",null,[n(p,{icon:"fas fa-fw fa-download"})]),s("span",Zs,o(t.$t("options_downloadSave")),1)])])])]),s("div",js,[s("div",Gs,[Os,s("div",st,[s("button",{type:"button",class:"w-100 btn btn-secondary px-0",onClick:a[3]||(a[3]=c=>{i(e).importAppState()})},[s("span",null,[n(p,{icon:"fas fa-fw fa-upload"})]),s("span",tt,o(t.$t("options_importSave")),1)])])])])])])])])])]),s("div",ot,[n(w),n(y),n($)]),n(k)],64)}}};export{dt as default};
