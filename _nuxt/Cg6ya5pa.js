import{f as B,a as U}from"./C1xH3N-8.js";import{u as w,a as z}from"./Cv2lR2oM.js";import{f as m,o,c as n,g as t,a as s,h as p,t as g,n as k,d as V,r as A,b as v,i as Y,j as Z,v as ee,F as C,k as S,l as M,u as te}from"./RU1EJBCX.js";const se={class:"row gx-2 align-items-center"},oe={key:0,class:"col-auto"},ne=["src"],ce={class:"col text-truncate"},le={key:0,class:"text-uppercase small"},ie={key:1,class:"text-uppercase small"},ae={key:1,class:"col-auto"},ue={__name:"LineGroup",props:["id"],setup(i){const l=i,c=w(),e=m(()=>c.getElem(l.id)),a=m(()=>e.value?c.getAvailableCount(e.value.id):null);return(r,h)=>(o(),n("div",se,[t(e)&&t(e).img!=null?(o(),n("div",oe,[s("img",{src:t(e).img,width:"16",height:"16"},null,8,ne)])):p("",!0),s("div",ce,[t(e)?(o(),n("span",le,g(r.$t(t(e).name)),1)):(o(),n("span",ie,g(r.$t(i.id)),1))]),t(a)!=null?(o(),n("div",ae,[s("span",{class:k(["badge",{"text-bg-success":t(a)>0,"text-bg-dark":t(a)<=0}])},g(t(B)(t(a))),3)])):p("",!0)]))}},de={__name:"ValueCount",props:["elem"],setup(i){return(l,c)=>(o(),n("span",{class:k({"opacity-50":i.elem.count==0,"text-white":i.elem.count>0&&i.elem.count<i.elem.max,"text-danger":i.elem.count>=i.elem.max})},g(t(B)(i.elem.count,"",0)),3))}},re={__name:"ValueMax",props:["elem"],setup(i){return(l,c)=>(o(),n("span",null,g(t(B)(i.elem.max)),1))}},_e={key:0},me={__name:"ValueProd",props:["elem"],setup(i){return(l,c)=>(o(),n("span",{class:k({"text-success":i.elem.prod>0,"text-danger":i.elem.prod<0,"opacity-50":i.elem.prod==0})},[i.elem.prod>0?(o(),n("span",_e,"+")):p("",!0),V(g(t(B)(i.elem.prod))+" /s",1)],2))}},pe={class:"row gx-2 align-items-center justify-content-end"},ge={class:"col text-truncate text-end"},he=["title"],ve=["src"],fe={class:"col-auto"},be={__name:"BlockInput",props:["id","count"],setup(i){const l=i,c=w(),e=m(()=>c.getElem(l.id));return(a,r)=>(o(),n("div",pe,[s("div",ge,g(a.$t(t(e).name)),1),t(e).img!=null?(o(),n("div",{key:0,class:"col-auto",title:a.$t(t(e).name)},[s("img",{src:t(e).img,width:"16",height:"16"},null,8,ve)],8,he)):p("",!0),s("div",fe,[s("span",{class:k(["badge d-block",{"text-bg-dark":t(e).prod>=i.count,"text-bg-danger":t(e).prod<i.count}]),style:{width:"55px"}},"+ "+g(t(B)(i.count))+" /s",3)])]))}},ye={class:"row gx-2 align-items-center justify-content-end"},$e={class:"col text-truncate text-end"},we=["title"],ke=["src"],xe={class:"col-auto"},Ce={__name:"BlockCost",props:["id","count"],setup(i){const l=i,c=w(),e=m(()=>c.getElem(l.id));return(a,r)=>(o(),n("div",ye,[s("div",$e,g(a.$t(t(e).name)),1),t(e).img!=null?(o(),n("div",{key:0,class:"col-auto",title:a.$t(t(e).name)},[s("img",{src:t(e).img,width:"16",height:"16"},null,8,ke)],8,we)):p("",!0),s("div",xe,[s("span",{class:k(["badge d-block",{"text-bg-success":t(e).count>=i.count,"text-bg-danger":t(e).count<i.count}]),style:{width:"55px"}},g(t(B)(i.count)),3)])]))}},Se={class:"row gx-2 align-items-center justify-content-end"},Ee={class:"col text-truncate text-end"},Be=["title"],Ae=["src"],Ie={class:"col-auto"},Me={__name:"BlockResult",props:["id","count"],setup(i){const l=i,c=w(),e=m(()=>c.getElem(l.id));return(a,r)=>(o(),n("div",Se,[s("div",Ee,g(a.$t(t(e).name)),1),t(e).img!=null?(o(),n("div",{key:0,class:"col-auto",title:a.$t(t(e).name)},[s("img",{src:t(e).img,width:"16",height:"16"},null,8,Ae)],8,Be)):p("",!0),s("div",Ie,[s("span",{class:k(["badge d-block",{"text-bg-dark":t(e).count+i.count<=t(e).max,"text-bg-danger":t(e).count+i.count>t(e).max}]),style:{width:"55px"}},"+ "+g(t(B)(i.count)),3)])]))}},Ve={class:"row gx-2 align-items-center justify-content-end"},je={class:"col text-truncate text-end"},Pe=["title"],De=["src"],Ne={class:"col-auto"},Oe={class:"badge d-block text-bg-dark",style:{width:"55px"}},Te={__name:"BlockOutput",props:["id","count"],setup(i){const l=i,c=w(),e=m(()=>c.getElem(l.id));return(a,r)=>(o(),n("div",Ve,[s("div",je,g(a.$t(t(e).name)),1),t(e).img!=null?(o(),n("div",{key:0,class:"col-auto",title:a.$t(t(e).name)},[s("img",{src:t(e).img,width:"16",height:"16"},null,8,De)],8,Pe)):p("",!0),s("div",Ne,[s("span",Oe,"+ "+g(t(B)(i.count))+" /s",1)])]))}},Ue={class:"row gx-2 align-items-center justify-content-end"},ze={class:"col text-truncate text-end"},Le=["title"],Re=["src"],qe={class:"col-auto"},Fe={class:"badge d-block text-bg-dark",style:{width:"55px"}},Ge={__name:"BlockStorage",props:["id","count"],setup(i){const l=i,c=w(),e=m(()=>c.getElem(l.id));return(a,r)=>(o(),n("div",Ue,[s("div",ze,g(a.$t(t(e).name)),1),t(e).img!=null?(o(),n("div",{key:0,class:"col-auto",title:a.$t(t(e).name)},[s("img",{src:t(e).img,width:"16",height:"16"},null,8,Re)],8,Le)):p("",!0),s("div",qe,[s("span",Fe,"+ "+g(t(B)(i.count)),1)])]))}},He={__name:"ButtonDestroy",props:["elem"],setup(i){const l=i,c=w(),e=m(()=>c.getBuildCosts(l.elem)),a=m(()=>c.getBuildInputs(l.elem)),r=m(()=>l.elem.build.status=="started"),h=function(){if(a.value)for(let _ in a.value){let f=c.getElem(_);f.prod+=a.value[_],f.prod=Math.round(f.prod*100)/100}if(e.value)for(let _ in e.value){let f=c.getElem(_);f.count+=e.value[_],f.count=Math.round(f.count*100)/100}l.elem.build.status="waiting",l.elem.build.remainingSeconds=l.elem.build.seconds*l.elem.select.count};return(_,f)=>{const d=A("font-awesome-icon");return o(),n("button",{type:"button",class:k(["btn btn-danger btn-icon",{disabled:!t(r)}]),onClick:f[0]||(f[0]=u=>{t(r)&&h()})},[v(d,{icon:"fas fa-stop"})],2)}}},Je={key:0,class:"text-center"},Ke={key:1,class:"text-center text-yellow"},Qe={__name:"ValueSeconds",props:["elem"],setup(i){return(l,c)=>i.elem.build.status==="waiting"?(o(),n("div",Je,g(t(U)(i.elem.build.seconds*i.elem.select.count)),1)):(o(),n("div",Ke,g(t(U)(i.elem.build.remainingSeconds)),1))}},We={class:"progress",style:{height:"3px"}},Xe={__name:"ValueProgress",props:["elem"],setup(i){const l=i,c=m(()=>l.elem.build.status==="waiting"?0:100-Math.floor(100*l.elem.build.remainingSeconds/(l.elem.build.seconds*l.elem.select.count)));return(e,a)=>(o(),n("div",We,[s("div",{class:"progress-bar bg-success",style:Y("width:"+t(c)+"%;")},null,4)]))}},Ye=s("small",{class:"opacity-50"},"x",-1),Ze={__name:"ValueAssignCount",props:["elem"],setup(i){return(l,c)=>(o(),n("span",{class:k({"opacity-50":i.elem.assign.count==0,"text-white":i.elem.assign.count>0})},[Ye,V(" "+g(t(B)(i.elem.assign.count,0)),1)],2))}},et=["disabled"],tt=["value"],st={__name:"ValueSelectCount",props:["elem"],setup(i){const l=i,c=m(()=>{let e=[];return l.elem.select.values.forEach(a=>{e.push({count:a,name:"value_"+a})}),e});return(e,a)=>Z((o(),n("select",{"onUpdate:modelValue":a[0]||(a[0]=r=>i.elem.select.count=r),class:"form-control text-end",disabled:t(c).length<=1||i.elem.status&&i.elem.status!="waiting",style:{width:"50px"}},[(o(!0),n(C,null,S(t(c),r=>(o(),n("option",{key:r.count,value:r.count},g(e.$t(r.name)),9,tt))),128))],8,et)),[[ee,i.elem.select.count]])}},ot={__name:"ButtonBuild",props:["elem","iconPlay","iconStop"],setup(i){const l=i,c=w(),e=m(()=>c.getBuildCosts(l.elem)),a=m(()=>c.getBuildInputs(l.elem)),r=m(()=>!(l.elem.build.status!="waiting"||l.elem.count+l.elem.select.count>l.elem.max||e.value&&!c.checkElemCounts(e.value)||a.value&&!c.checkElemProds(a.value))),h=function(){if(a.value)for(let _ in a.value){let f=c.getElem(_);f.prod-=a.value[_],f.prod=Math.round(f.prod*100)/100}if(e.value)for(let _ in e.value){let f=c.getElem(_);f.count-=e.value[_],f.count=Math.round(f.count*100)/100}l.elem.build.seconds&&l.elem.build.seconds>0?(l.elem.build.status="started",l.elem.build.remainingSeconds=l.elem.build.seconds*l.elem.select.count):c.onBuild(l.elem)};return(_,f)=>{const d=A("font-awesome-icon");return o(),n("button",{type:"button",class:k(["btn btn-primary btn-icon",{disabled:!t(r)}]),onClick:f[0]||(f[0]=u=>{t(r)&&h()})},[i.elem.build.seconds?(o(),M(d,{key:0,icon:"fas fa-play"})):(o(),M(d,{key:1,icon:"fas fa-check-circle"}))],2)}}},nt={__name:"ButtonUnassign",props:["elem"],setup(i){const l=i,c=w(),e=m(()=>c.getAssignCosts(l.elem)),a=m(()=>c.getAssignInputs(l.elem)),r=m(()=>c.getAssignOutputs(l.elem)),h=m(()=>c.getAssignStorages(l.elem)),_=m(()=>{if(l.elem.select.count>l.elem.assign.count)return!1;let d=!0;if(r.value){for(let u in r.value)if(c.getElem(u).prod-r.value[u]<0)return!1}if(h.value)for(let u in h.value){let y=c.getElem(u);if(y.max-h.value[u]<y.count)return!1}return d}),f=function(){if(e.value)for(let d in e.value){let u=c.getElem(d);u.count+=e.value[d],u.count>u.max&&(u.count=u.max),u.count=Math.round(u.count*100)/100}if(a.value)for(let d in a.value){let u=c.getElem(d);u.prod+=a.value[d],u.prod=Math.round(u.prod*100)/100}if(r.value)for(let d in r.value){let u=c.getElem(d);u.prod-=r.value[d],u.prod=Math.round(u.prod*100)/100}if(h.value)for(let d in h.value){let u=c.getElem(d);u.max-=h.value[d],u.max=Math.round(u.max*100)/100}l.elem.assign.count-=l.elem.select.count};return(d,u)=>{const y=A("font-awesome-icon");return o(),n("button",{type:"button",class:k(["btn btn-danger btn-icon",{disabled:!t(_)}]),onClick:u[0]||(u[0]=E=>{t(_)&&f()})},[v(y,{icon:"fas fa-minus-square"})],2)}}},ct={__name:"ButtonAssign",props:["elem"],setup(i){const l=i,c=w(),e=m(()=>c.getAssignCosts(l.elem)),a=m(()=>c.getAssignInputs(l.elem)),r=m(()=>c.getAssignOutputs(l.elem)),h=m(()=>c.getAssignStorages(l.elem)),_=m(()=>{let d=c.getAvailableCount(l.elem.assign.id);return!(l.elem.select.count>d||e.value&&!c.checkElemCounts(e.value)||a.value&&!c.checkElemProds(a.value))}),f=function(){if(l.elem.assign.count+=l.elem.select.count,e.value)for(let d in e.value){let u=c.getElem(d);u.count-=e.value[d],u.count=Math.round(u.count*100)/100}if(a.value)for(let d in a.value){let u=c.getElem(d);u.prod-=a.value[d],u.prod=Math.round(u.prod*100)/100}if(r.value)for(let d in r.value){let u=c.getElem(d);u.prod+=r.value[d],u.prod=Math.round(u.prod*100)/100}if(h.value)for(let d in h.value){let u=c.getElem(d);u.max+=h.value[d],u.max=Math.round(u.max*100)/100}};return(d,u)=>{const y=A("font-awesome-icon");return o(),n("button",{type:"button",class:k(["btn btn-primary btn-icon",{disabled:!t(_)}]),onClick:u[0]||(u[0]=E=>{t(_)&&f()})},[v(y,{icon:"fas fa-plus-square"})],2)}}},lt={class:"row gx-2 align-items-center"},it={key:0,class:"position-relative col-auto"},at={key:0,class:"position-absolute translate-middle lh-1"},ut=["src"],dt={class:"dropdown-menu p-2"},rt={class:"row g-3"},_t={key:0,class:"col-12"},mt={class:"row gx-2"},pt={key:0,class:"col-auto"},gt=["src"],ht={class:"col fs-6 text-white"},vt={key:1,class:"col-12"},ft={class:"col-12"},bt={class:"row g-2"},yt={key:0,class:"col-12"},$t={class:"row gx-2"},wt={class:"col-auto"},kt={class:"opacity-50 small text-uppercase fw-bold"},xt={class:"col"},Ct={class:"row gx-1 align-items-center justify-content-end"},St={class:"col-auto"},Et={key:0,class:"col-auto"},Bt={key:1,class:"col-12"},At={class:"row gx-2"},It={class:"col-auto"},Mt={class:"opacity-50 small text-uppercase fw-bold"},Vt={class:"col text-end"},jt={key:2,class:"col-12"},Pt={class:"row gx-2"},Dt={class:"col-auto"},Nt={class:"opacity-50 small text-uppercase fw-bold"},Ot={class:"col"},Tt={class:"row g-1"},Ut={key:3,class:"col-12"},zt={class:"row gx-2"},Lt={class:"col-auto"},Rt={class:"opacity-50 small text-uppercase fw-bold"},qt={class:"col"},Ft={class:"row g-1"},Gt={key:4,class:"col-12"},Ht={class:"row gx-2"},Jt={class:"col-auto"},Kt={class:"opacity-50 small text-uppercase fw-bold"},Qt={class:"col"},Wt={class:"row g-1"},Xt={key:5,class:"col-12"},Yt={class:"row gx-2"},Zt={class:"col-auto"},es={class:"opacity-50 small text-uppercase fw-bold"},ts={class:"col"},ss={class:"row g-1"},os={key:6,class:"col-12"},ns={class:"row gx-2"},cs={class:"col-auto"},ls={class:"opacity-50 small text-uppercase fw-bold"},is={class:"col"},as={class:"row g-1"},us={key:7,class:"col-12"},ds={class:"row gx-2"},rs={class:"col-auto"},_s={class:"opacity-50 small text-uppercase fw-bold"},ms={class:"col"},ps={class:"row g-1"},gs={key:8,class:"col-12"},hs={class:"row gx-2"},vs={class:"col-auto"},fs={class:"opacity-50 small text-uppercase fw-bold"},bs={class:"col"},ys={class:"row g-1"},$s={class:"col text-truncate"},ws={key:1,class:"col-auto"},ks={key:2,class:"col-auto"},xs={key:3,class:"col-auto",style:{width:"65px"}},Cs={key:4,class:"col-auto"},Ss={key:5,class:"col-auto"},Es={key:6,class:"col-auto text-end",style:{width:"50px"}},Bs={key:7,class:"col-auto"},As={key:8,class:"col-auto"},Is={type:"button",class:"btn btn-success btn-icon",disabled:""},Ms={key:9,class:"col-auto"},Vs={key:10,class:"col-auto"},js={key:11,class:"col-auto"},Ps={__name:"LineElem",props:["id"],setup(i){const l=i,c=w(),e=m(()=>c.getElem(l.id)),a=m(()=>e.value.assign&&e.value.assign.output?c.getElem(e.value.assign.output.id):null),r=m(()=>e.value.assign&&e.value.assign.storage?c.getElem(e.value.assign.storage.id):null),h=m(()=>c.getBuildCosts(e.value)),_=m(()=>c.getBuildInputs(e.value)),f=m(()=>c.getBuildResults(e.value)),d=m(()=>c.getAssignCosts(e.value)),u=m(()=>c.getAssignInputs(e.value)),y=m(()=>c.getAssignOutputs(e.value)),E=m(()=>c.getAssignStorages(e.value));return(x,j)=>{const I=A("font-awesome-icon"),P=de,D=re,N=me,O=be,T=Ce,L=Me,R=Te,q=Ge,F=He,G=Qe,H=Xe,J=Ze,K=st,Q=ot,W=nt,X=ct;return o(),n("div",lt,[t(e).type!="milestone"||t(e).count<1?(o(),n("div",it,[t(e).notified?(o(),n("div",at,[v(I,{icon:"fas fa-certificate",class:"text-success"})])):p("",!0),s("button",{type:"button",class:"btn btn-secondary btn-icon","data-bs-toggle":"dropdown",onClick:j[0]||(j[0]=$=>t(e).notified=!1)},[t(e).img?(o(),n("img",{key:0,src:t(e).img,width:"18",height:"18"},null,8,ut)):(o(),M(I,{key:1,icon:"fas fa-info-circle"}))]),s("div",dt,[s("div",rt,[t(e).type=="item"||t(e).type=="milestone"?(o(),n("div",_t,[s("div",mt,[t(e).img?(o(),n("div",pt,[s("img",{src:t(e).img,width:"16",height:"16"},null,8,gt)])):p("",!0),s("div",ht,g(x.$t(t(e).name)),1),t(e).desc?(o(),n("div",vt,g(x.$t(t(e).desc)),1)):p("",!0)])])):p("",!0),s("div",ft,[s("div",bt,[t(e).type=="item"?(o(),n("div",yt,[s("div",$t,[s("div",wt,[s("span",kt,g(x.$t("word_count")),1)]),s("div",xt,[s("div",Ct,[s("div",St,[v(P,{elem:t(e)},null,8,["elem"])]),t(e).max!=null&&t(e).max!=1/0?(o(),n("div",Et,[V(" / "),v(D,{elem:t(e)},null,8,["elem"])])):p("",!0)])])])])):p("",!0),t(e).prod!=null?(o(),n("div",Bt,[s("div",At,[s("div",It,[s("span",Mt,g(x.$t("word_prod")),1)]),s("div",Vt,[v(N,{elem:t(e)},null,8,["elem"])])])])):p("",!0),t(_)?(o(),n("div",jt,[s("div",Pt,[s("div",Dt,[s("span",Nt,g(x.$t("word_input")),1)]),s("div",Ot,[s("div",Tt,[(o(!0),n(C,null,S(t(_),($,b)=>(o(),n("div",{key:b,class:"col-12"},[v(O,{id:b,count:$},null,8,["id","count"])]))),128))])])])])):p("",!0),t(h)?(o(),n("div",Ut,[s("div",zt,[s("div",Lt,[s("span",Rt,g(x.$t("word_cost")),1)]),s("div",qt,[s("div",Ft,[(o(!0),n(C,null,S(t(h),($,b)=>(o(),n("div",{key:b,class:"col-12"},[v(T,{id:b,count:$},null,8,["id","count"])]))),128))])])])])):p("",!0),t(e).type!="milestone"&&t(f)?(o(),n("div",Gt,[s("div",Ht,[s("div",Jt,[s("span",Kt,g(x.$t("word_result")),1)]),s("div",Qt,[s("div",Wt,[(o(!0),n(C,null,S(t(f),($,b)=>(o(),n("div",{key:b,class:"col-12"},[v(L,{id:b,count:$},null,8,["id","count"])]))),128))])])])])):p("",!0),t(d)?(o(),n("div",Xt,[s("div",Yt,[s("div",Zt,[s("span",es,g(x.$t("word_cost")),1)]),s("div",ts,[s("div",ss,[(o(!0),n(C,null,S(t(d),($,b)=>(o(),n("div",{key:b,class:"col-12"},[v(T,{id:b,count:$},null,8,["id","count"])]))),128))])])])])):p("",!0),t(u)?(o(),n("div",os,[s("div",ns,[s("div",cs,[s("span",ls,g(x.$t("word_input")),1)]),s("div",is,[s("div",as,[(o(!0),n(C,null,S(t(u),($,b)=>(o(),n("div",{key:b,class:"col-12"},[v(O,{id:b,count:$},null,8,["id","count"])]))),128))])])])])):p("",!0),t(y)?(o(),n("div",us,[s("div",ds,[s("div",rs,[s("span",_s,g(x.$t("word_output")),1)]),s("div",ms,[s("div",ps,[(o(!0),n(C,null,S(t(y),($,b)=>(o(),n("div",{key:b,class:"col-12"},[v(R,{id:b,count:$},null,8,["id","count"])]))),128))])])])])):p("",!0),t(E)?(o(),n("div",gs,[s("div",hs,[s("div",vs,[s("span",fs,g(x.$t("word_storage")),1)]),s("div",bs,[s("div",ys,[(o(!0),n(C,null,S(t(E),($,b)=>(o(),n("div",{key:b,class:"col-12"},[v(q,{id:b,count:$},null,8,["id","count"])]))),128))])])])])):p("",!0)])])])])])):p("",!0),s("div",$s,[s("span",{class:k({"text-white":t(e).type!="milestone"||t(e).count<1,"text-success":t(e).type=="milestone"&&t(e).count>=1})},g(x.$t(t(e).name)),3)]),t(e).type=="item"?(o(),n("div",ws,[v(P,{elem:t(e)},null,8,["elem"])])):p("",!0),t(e).build&&t(e).build.seconds!=null?(o(),n("div",ks,[v(F,{elem:t(e)},null,8,["elem"])])):p("",!0),t(e).build&&t(e).build.seconds!=null?(o(),n("div",xs,[v(G,{elem:t(e)},null,8,["elem"]),v(H,{elem:t(e)},null,8,["elem"])])):p("",!0),t(e).type=="recipe"?(o(),n("div",Cs,[v(N,{elem:t(a)},null,8,["elem"])])):p("",!0),t(e).type=="storage"?(o(),n("div",Ss,[v(D,{elem:t(r)},null,8,["elem"])])):p("",!0),t(e).assign?(o(),n("div",Es,[v(J,{elem:t(e)},null,8,["elem"])])):p("",!0),t(e).select&&t(e).select.values&&t(e).select.values.length>1?(o(),n("div",Bs,[v(K,{elem:t(e)},null,8,["elem"])])):p("",!0),t(e).type=="milestone"&&t(e).count>=1?(o(),n("div",As,[s("button",Is,[v(I,{icon:"fas fa-check-circle"})])])):t(e).build?(o(),n("div",Ms,[v(Q,{elem:t(e)},null,8,["elem"])])):p("",!0),t(e).assign?(o(),n("div",Vs,[v(W,{elem:t(e)},null,8,["elem"])])):p("",!0),t(e).assign?(o(),n("div",js,[v(X,{elem:t(e)},null,8,["elem"])])):p("",!0)])}}},Ds={class:"card card-body"},Ns={class:"row g-1"},Os={__name:"PaneSubgroup",props:["subgroup"],setup(i){const l=i,c=w(),e=m(()=>c.elems.filter(a=>a.unlocked&&a.subgroup==l.subgroup));return(a,r)=>{const h=Ps;return o(),n("div",Ds,[s("div",Ns,[(o(!0),n(C,null,S(t(e),_=>(o(),n("div",{key:_.id,class:"col-12"},[v(h,{id:_.id},null,8,["id"])]))),128))])])}}},Ts={key:0,class:"row g-4"},Us={class:"col-12 text-center"},zs={key:1,class:"row g-4"},Ls={class:"row g-1"},Rs={class:"col-12"},qs=["data-bs-target","onClick"],Fs={class:"row gx-2 align-items-center"},Gs={class:"col-auto"},Hs={class:"col-auto"},Js=["id"],Ks={class:"row g-1"},Qs={__name:"PaneContent",props:["cat"],setup(i){const l=i,c=z(),e=w(),a=m(()=>[...new Set(e.elems.filter(h=>h.cat==l.cat&&h.unlocked).map(h=>h.group))]),r=function(h){return[...new Set(e.elems.filter(_=>_.cat==l.cat&&_.unlocked&&_.group==h).map(_=>_.subgroup))]};return(h,_)=>{const f=A("font-awesome-icon"),d=ue,u=Os;return t(a).length<1?(o(),n("div",Ts,[s("div",Us,[s("span",null,g(h.$t("text_nothing")),1)])])):(o(),n("div",zs,[(o(!0),n(C,null,S(t(a),y=>(o(),n("div",{key:y,class:"col-12"},[s("div",Ls,[s("div",Rs,[s("button",{type:"button",class:"btn p-0 border-0","data-bs-toggle":"collapse","data-bs-target":"#collapse"+y,onClick:E=>t(c).toggleCollapsed(y)},[s("div",Fs,[s("div",Gs,[v(f,{icon:"fas fa-caret-down",class:"opacity-50"})]),s("div",Hs,[v(d,{id:y},null,8,["id"])])])],8,qs)]),s("div",{id:"collapse"+y,class:k(["collapse col-12",{show:!t(c).isCollapsed(y)}])},[s("div",Ks,[(o(!0),n(C,null,S(r(y),E=>(o(),n("div",{key:E,class:"col-12"},[v(u,{subgroup:E},null,8,["subgroup"])]))),128))])],10,Js)])]))),128))]))}}},Ws={class:"w-100 h-100 d-flex flex-column"},Xs={class:"container px-lg-3 pb-0"},Ys={class:"nav nav-tabs flex-nowrap",style:{"overflow-x":"auto","overflow-y":"hidden","z-index":"1000"}},Zs=["onClick"],eo={key:0,class:"position-absolute translate-middle lh-1"},to={class:"row gx-2 align-items-center justify-content-center flex-nowrap"},so={class:"col-auto"},oo={class:"col text-truncate"},no={class:"flex-grow-1 scroll-content py-2"},co={class:"container"},uo={__name:"game",setup(i){te({title:"page_game"});const l=z(),c=w(),e=m(()=>c.elems.filter(r=>r.type=="cat"&&r.unlocked)),a=m(()=>{let r={};return e.value.forEach(h=>{r[h.id]=c.elems.filter(_=>_.cat==h.id&&_.unlocked&&_.notified).length}),r});return(r,h)=>{const _=A("font-awesome-icon"),f=Qs;return o(),n("div",Ws,[s("div",Xs,[s("div",Ys,[(o(!0),n(C,null,S(t(e),d=>(o(),n("div",{key:d.id,class:"col-3 nav-item"},[s("button",{type:"button",class:k(["w-100 nav-link text-nowrap position-relative",{active:t(l).gameTabId==d.id}]),onClick:u=>t(l).gameTabId=d.id},[t(a)[d.id]>0?(o(),n("div",eo,[v(_,{icon:"fas fa-certificate",class:"text-success"})])):p("",!0),s("div",to,[s("div",so,[v(_,{icon:d.icon},null,8,["icon"])]),s("div",oo,g(r.$t(d.name)),1)])],10,Zs)]))),128))])]),s("div",no,[s("div",co,[v(f,{cat:t(l).gameTabId},null,8,["cat"])])])])}}};export{uo as default};
