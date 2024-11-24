import{_ as Y}from"./DlByl_3x.js";import{e as I,f as r,o as t,c as e,t as u,h as o,m as B,r as j,a as s,g as E,F as x,i as C,b as d,j as b,n as Z,p as G,q as D,s as ss,v as ts,x as os,k as es,d as N,w as z}from"./CLIvMcHX.js";import{_ as ns,a as is,c as cs,b as ls}from"./fXtGPtzG.js";import{_ as H,a as as}from"./BRERTzvE.js";import{_ as ds}from"./C8BIUtIW.js";import{_ as _s,a as rs,b as us,c as ms,d as ps}from"./By2U5ASP.js";import{_ as hs}from"./CN4bJpYi.js";const gs={class:"opacity-50"},vs={__name:"ItemMax",props:["id"],setup(g){const v=g,l=I(),c=r(()=>l.elems.find(a=>a.id==v.id));return(a,m)=>(t(),e("span",gs,u(o(B)(o(c).max,"",0)),1))}},fs={type:"button",class:"btn btn-secondary","data-bs-toggle":"dropdown"},ws=["src"],ys={class:"dropdown-menu p-2",style:{width:"17rem"}},$s={class:"row g-3"},ks={key:0,class:"col-12"},bs={class:"row g-1"},xs={class:"col-12"},Ss={class:"text-subtitle"},Cs={key:1,class:"col-12"},Is={class:"row g-1"},Ms={class:"col-12"},Es={class:"text-subtitle"},Bs={key:2,class:"col-12"},Ls={class:"row g-1"},Ns={class:"col-12"},js={class:"text-subtitle"},Ps={key:3,class:"col-12"},Vs={class:"row g-1"},zs={class:"col-12"},Fs={class:"text-subtitle"},Rs={__name:"ManualInfo",props:["id","img"],setup(g){const v=g,l=I(),c=r(()=>l.elems.find(k=>k.id==v.id)),a=r(()=>l.getCosts(c.value)),m=r(()=>l.getInputs(c.value)),$=r(()=>l.getResults(c.value)),y=r(()=>l.getUpgrades(c.value));return(k,w)=>{const p=j("font-awesome-icon"),M=ns,n=is,_=H,f=ds;return t(),e(x,null,[s("button",fs,[g.img?(t(),e("img",{key:0,src:g.img,width:"18",height:"18"},null,8,ws)):(t(),E(p,{key:1,icon:"fas fa-info-circle","fixed-width":""}))]),s("div",ys,[s("div",$s,[o(m)?(t(),e("div",ks,[s("div",bs,[s("div",xs,[s("span",Ss,u(k.$t("word_inputs")),1)]),(t(!0),e(x,null,C(o(m),(S,h)=>(t(),e("div",{key:h,class:"col-12"},[d(M,{id:h,count:S},null,8,["id","count"])]))),128))])])):b("",!0),o(y)?(t(),e("div",Cs,[s("div",Is,[s("div",Ms,[s("span",Es,u(k.$t("word_upgrades")),1)]),(t(!0),e(x,null,C(o(y),(S,h)=>(t(),e("div",{key:h,class:"col-12"},[d(n,{id:h,count:S},null,8,["id","count"])]))),128))])])):b("",!0),o(a)?(t(),e("div",Bs,[s("div",Ls,[s("div",Ns,[s("span",js,u(k.$t("word_costs")),1)]),(t(!0),e(x,null,C(o(a),(S,h)=>(t(),e("div",{key:h,class:"col-12"},[d(_,{id:h,count:S},null,8,["id","count"])]))),128))])])):b("",!0),o($)?(t(),e("div",Ps,[s("div",Vs,[s("div",zs,[s("span",Fs,u(k.$t("word_results")),1)]),(t(!0),e(x,null,C(o($),(S,h)=>(t(),e("div",{key:h,class:"col-12"},[d(f,{id:h,count:S},null,8,["id","count"])]))),128))])])):b("",!0)])])],64)}}},Ts={__name:"ManualButtonStop",props:["id"],setup(g){const v=g,l=I(),c=r(()=>l.elems.find(w=>w.id==v.id)),a=r(()=>l.getCosts(c.value)),m=r(()=>l.getInputs(c.value)),$=r(()=>l.getUpgrades(c.value)),y=r(()=>c.value.status=="started"),k=function(){if(m.value)for(let w in m.value){let p=l.getElem(w);p.prod+=m.value[w],p.prod=Math.round(p.prod*100)/100}if(a.value)for(let w in a.value){let p=l.getElem(w);p.count+=a.value[w],p.count=Math.round(p.count*100)/100}if($.value)for(let w in $.value){let p=l.getElem(w);p.count+=$.value[w],p.count=Math.round(p.count*100)/100}c.value.status="waiting",c.value.remainingSeconds=c.value.seconds};return(w,p)=>{const M=j("font-awesome-icon");return t(),e("button",{type:"button",class:G(["btn btn-danger",{disabled:!o(y)}]),onClick:p[0]||(p[0]=Z(n=>{o(y)&&k()},["prevent"]))},[d(M,{icon:"fas fa-stop","fixed-width":""})],2)}}},Us={key:0,class:"text-center"},qs={key:1,class:"text-center text-yellow"},As={__name:"ManualSeconds",props:["id"],setup(g){const v=g,l=I(),c=r(()=>l.elems.find(a=>a.id==v.id));return(a,m)=>o(c).status==="waiting"?(t(),e("div",Us,u(o(D)(o(c).seconds)),1)):(t(),e("div",qs,u(o(D)(o(c).remainingSeconds)),1))}},Ds={class:"progress",style:{height:"3px"}},Gs={__name:"ManualProgress",props:["id"],setup(g){const v=g,l=I(),c=r(()=>l.elems.find(m=>m.id==v.id)),a=r(()=>c.value.status==="waiting"?0:100-Math.floor(100*c.value.remainingSeconds/c.value.seconds));return(m,$)=>(t(),e("div",Ds,[s("div",{class:"progress-bar bg-success",style:ss("width:"+o(a)+"%;")},null,4)]))}},Hs={class:"row gx-1 align-items-center justify-content-end"},Js=["title"],Ks=["src"],Os={class:"col text-white text-truncate"},Qs={class:"col-auto"},Ws={class:"badge d-block text-bg-success",style:{width:"55px"}},Xs={__name:"BlockStorage",props:["id","count"],setup(g){const v=g,l=I(),c=r(()=>l.getElem(v.id));return(a,m)=>(t(),e("div",Hs,[o(c).img!=null?(t(),e("div",{key:0,class:"col-auto",title:a.$t(o(c).name)},[s("img",{src:o(c).img,width:"16",height:"16"},null,8,Ks)],8,Js)):b("",!0),s("div",Os,u(a.$t(o(c).name)),1),s("div",Qs,[s("span",Ws,"+"+u(o(B)(g.count)),1)])]))}},Ys={type:"button",class:"btn btn-secondary","data-bs-toggle":"dropdown"},Zs=["src"],st={class:"dropdown-menu p-2",style:{width:"17rem"}},tt={class:"row g-3"},ot={key:0,class:"col-12"},et={class:"row g-1"},nt={class:"col-12"},it={class:"text-subtitle"},ct={key:1,class:"col-12"},lt={class:"row g-1"},at={class:"col-12"},dt={class:"text-subtitle"},_t={__name:"StorerInfo",props:["id"],setup(g){const v=g,l=I(),c=r(()=>l.elems.find(y=>y.id==v.id)),a=r(()=>l.elems.find(y=>y.id==c.value.assign.id)),m=r(()=>l.getCosts(c.value)),$=r(()=>l.getStorages(c.value));return(y,k)=>{const w=j("font-awesome-icon"),p=H,M=Xs;return t(),e(x,null,[s("button",Ys,[o(a).img?(t(),e("img",{key:0,src:o(a).img,width:"18",height:"18"},null,8,Zs)):(t(),E(w,{key:1,icon:"fas fa-info-circle","fixed-width":""}))]),s("div",st,[s("div",tt,[o(m)?(t(),e("div",ot,[s("div",et,[s("div",nt,[s("span",it,u(y.$t("word_costs")),1)]),(t(!0),e(x,null,C(o(m),(n,_)=>(t(),e("div",{key:_,class:"col-12"},[d(p,{id:_,count:n},null,8,["id","count"])]))),128))])])):b("",!0),o($)?(t(),e("div",ct,[s("div",lt,[s("div",at,[s("span",dt,u(y.$t("word_storages")),1)]),(t(!0),e(x,null,C(o($),(n,_)=>(t(),e("div",{key:_,class:"col-12"},[d(M,{id:_,count:n},null,8,["id","count"])]))),128))])])):b("",!0)])])],64)}}},rt={__name:"ItemProd",props:["id"],setup(g){const v=g,l=I(),c=r(()=>l.elems.find(a=>a.id==v.id));return(a,m)=>(t(),e("span",{class:G({"opacity-50":o(c).prod==0,"text-success":o(c).prod>0})},"+ "+u(o(B)(o(c).prod))+" /s",3))}},ut={class:"w-100 h-100 scroll-content"},mt={class:"container p-2"},pt={class:"row g-3"},ht={class:"col-12"},gt={class:"card"},vt={class:"card-header"},ft={class:"row gx-2 align-items-center"},wt={class:"col"},yt={class:"fs-6 text-white"},$t={class:"col-auto"},kt={class:"bg-dark rounded py-1 px-2"},bt={class:"text-white"},xt={class:"card-body"},St={class:"row g-3"},Ct={key:0,class:"col-12"},It={class:"row gy-1 gx-4"},Mt={class:"col-12"},Et={class:"text-subtitle"},Bt={class:"row gx-2 align-items-center"},Lt={class:"col-auto"},Nt={class:"col text-truncate"},jt={class:"text-white"},Pt={class:"col-auto"},Vt={class:"col-auto",style:{width:"65px"}},zt={class:"col-auto"},Ft={key:1,class:"col-12"},Rt={class:"row gy-1 gx-4"},Tt={class:"col-12"},Ut={class:"text-subtitle"},qt={key:0,class:"row gx-2 align-items-center"},At={class:"col-auto position-relative"},Dt={class:"col text-truncate"},Gt={class:"text-white"},Ht={class:"col-auto"},Jt={class:"col-auto"},Kt={class:"input-group"},Ot={key:1,class:"row gx-2 align-items-center"},Qt={class:"col-auto"},Wt={type:"button",class:"btn btn-secondary",disabled:"",style:{width:"40px"}},Xt={class:"col text-truncate"},Yt={class:"opacity-50"},Zt={key:0,class:"col-12"},so={class:"card"},to={class:"card-header"},oo={class:"row gx-2 align-items-center justify-content-center"},eo={class:"col"},no={class:"fs-6 text-white"},io={class:"col-auto"},co={class:"bg-dark rounded py-1 px-2"},lo={class:"text-white"},ao={class:"card-body"},_o={class:"row gy-1 gx-4"},ro={class:"col-12"},uo={class:"text-subtitle"},mo={key:0,class:"ms-2 text-success"},po={key:0,class:"row gx-2 align-items-center"},ho={class:"col-auto position-relative"},go={class:"col text-truncate"},vo={class:"text-white"},fo={class:"col-auto"},wo={class:"col-auto"},yo={class:"input-group"},$o={key:1,class:"row gx-2 align-items-center"},ko={class:"col-auto"},bo={type:"button",class:"btn btn-secondary",disabled:"",style:{width:"40px"}},xo={class:"col text-truncate"},So={class:"opacity-50"},Co={key:0,class:"card-body"},Io={class:"row gy-1 gx-4"},Mo={class:"col-12"},Eo={class:"text-subtitle"},Bo={key:0,class:"ms-2 text-danger"},Lo={class:"row gx-2 align-items-center"},No={class:"col-auto"},jo=["src"],Po=["src"],Vo=["src"],zo={class:"col col-lg-auto text-truncate"},Fo={class:"text-white"},Ro={class:"col-auto"},To={class:"text-danger"},Ko={__name:"[id]",setup(g){const v=ts(),l=os(),c=es(),a=I(),m=r(()=>a.elems.find(n=>n.type=="item"&&n.id==l.params.id)),$=r(()=>a.elems.filter(n=>(c.showLocked?!0:n.unlocked)&&n.type=="storer"&&n.storages[l.params.id])),y=r(()=>a.elems.filter(n=>(c.showLocked?!0:n.unlocked)&&n.type=="manual"&&n.results[l.params.id])),k=r(()=>a.elems.filter(n=>(c.showLocked?!0:n.unlocked)&&n.type=="producer"&&n.outputs[l.params.id])),w=r(()=>{let n=[];return n=n.concat(a.elems.filter(f=>f.unlocked&&f.type=="producer"&&f.inputs&&f.inputs[l.params.id]&&f.assign.count>0)),a.elems.filter(f=>f.unlocked&&f.type=="generator"&&f.count>0).forEach(f=>{a.elems.filter(h=>h.unlocked&&h.type=="manual"&&h.results[f.id]&&h.inputs&&h.inputs[l.params.id]).forEach(h=>{let P={id:f.id,img:f.img,name:f.name,inputs:h.inputs,assign:{count:f.count}};n.push(P)})}),n}),p=r(()=>{let n=0;return k.value.forEach(_=>{n+=_.assign.count*_.outputs[l.params.id]}),n}),M=r(()=>{let n=0;return w.value.forEach(_=>{n+=_.assign.count*_.inputs[l.params.id]}),n});return(n,_)=>{const f=Y,S=vs,h=Rs,P=Ts,J=As,K=Gs,O=as,Q=_t,F=cs,R=_s,T=rs,U=us,q=ls,A=ms,L=j("font-awesome-icon"),W=rt,X=ps,V=hs;return t(),e("div",ut,[s("div",mt,[s("div",pt,[s("div",ht,[s("div",gt,[s("div",vt,[s("div",ft,[s("div",wt,[s("span",yt,u(n.$t("word_count")),1)]),s("div",$t,[s("div",kt,[s("span",bt,[d(f,{id:o(m).id},null,8,["id"]),_[0]||(_[0]=N(" / ")),d(S,{id:o(m).id},null,8,["id"])])])])])]),s("div",xt,[s("div",St,[o(y).length>0?(t(),e("div",Ct,[s("div",It,[s("div",Mt,[s("span",Et,u(n.$t("word_manuals")),1)]),(t(!0),e(x,null,C(o(y),i=>(t(),e("div",{key:i.id,class:"col-12 col-lg-6"},[s("div",Bt,[s("div",Lt,[d(h,{id:i.id,img:o(m).img},null,8,["id","img"])]),s("div",Nt,[s("span",jt,u(n.$t(o(m).name)),1)]),s("div",Pt,[d(P,{id:i.id},null,8,["id"])]),s("div",Vt,[d(J,{id:i.id},null,8,["id"]),d(K,{id:i.id},null,8,["id"])]),s("div",zt,[d(O,{id:i.id,icon:"fas fa-play"},null,8,["id"])])])]))),128))])])):b("",!0),o($).length>0?(t(),e("div",Ft,[s("div",Rt,[s("div",Tt,[s("span",Ut,u(n.$t("word_storers")),1)]),(t(!0),e(x,null,C(o($),i=>(t(),e("div",{key:i.id,class:"col-12 col-lg-6"},[i.unlocked?(t(),e("div",qt,[s("div",At,[d(Q,{id:i.id},null,8,["id"]),d(F,{id:i.assign.id,class:"position-absolute",style:{top:"0",left:"0px"}},null,8,["id"])]),s("div",Dt,[s("span",Gt,[d(R,{id:i.id},null,8,["id"])])]),s("div",Ht,[_[1]||(_[1]=s("small",null,"x",-1)),_[2]||(_[2]=N()),d(T,{id:i.id},null,8,["id"])]),s("div",Jt,[s("div",Kt,[d(U,{id:i.id},null,8,["id"]),d(q,{id:i.id},null,8,["id"]),d(A,{id:i.id},null,8,["id"])])])])):(t(),e("div",Ot,[s("div",Qt,[s("button",Wt,[d(L,{icon:"fas fa-lock","fixed-width":""})])]),s("div",Xt,[s("span",Yt,u(n.$t("word_locked")),1)])]))]))),128))])])):b("",!0)])])])]),o(k).length>0?(t(),e("div",Zt,[s("div",so,[s("div",to,[s("div",oo,[s("div",eo,[s("span",no,u(n.$t("word_prod")),1)]),s("div",io,[s("div",co,[s("span",lo,[d(W,{id:o(m).id},null,8,["id"])])])])])]),s("div",ao,[s("div",_o,[s("div",ro,[s("span",uo,u(n.$t("word_producers")),1),_[3]||(_[3]=N()),o(p)!=0?(t(),e("span",mo,"+ "+u(o(B)(o(p)))+" /s",1)):b("",!0)]),(t(!0),e(x,null,C(o(k),i=>(t(),e("div",{key:i.id,class:"col-12 col-lg-6"},[i.unlocked?(t(),e("div",po,[s("div",ho,[d(X,{id:i.id},null,8,["id"]),d(F,{id:i.assign.id,class:"position-absolute",style:{top:"0",left:"0px"}},null,8,["id"])]),s("div",go,[s("span",vo,[d(R,{id:i.id},null,8,["id"])])]),s("div",fo,[_[4]||(_[4]=s("small",null,"x",-1)),_[5]||(_[5]=N()),d(T,{id:i.id},null,8,["id"])]),s("div",wo,[s("div",yo,[d(U,{id:i.id},null,8,["id"]),d(q,{id:i.id},null,8,["id"]),d(A,{id:i.id},null,8,["id"])])])])):(t(),e("div",$o,[s("div",ko,[s("button",bo,[d(L,{icon:"fas fa-lock","fixed-width":""})])]),s("div",xo,[s("span",So,u(n.$t("word_locked")),1)])]))]))),128))])]),o(w).length>0?(t(),e("div",Co,[s("div",Io,[s("div",Mo,[s("span",Eo,u(n.$t("word_consumers")),1),_[6]||(_[6]=N()),o(M)!=0?(t(),e("span",Bo,"- "+u(o(B)(o(M)))+" /s",1)):b("",!0)]),(t(!0),e(x,null,C(o(w),i=>(t(),e("div",{key:i.id,class:"col-12 col-lg-6"},[s("div",Lo,[s("div",No,[i.mainId&&i.mainId=="point"?(t(),E(V,{key:0,to:o(v)("/recycling"),class:"w-100 btn btn-primary",title:n.$t(i.name)},{default:z(()=>[i.img?(t(),e("img",{key:0,src:i.img,width:"18",height:"18"},null,8,jo)):(t(),E(L,{key:1,icon:"fas fa-info-circle","fixed-width":""}))]),_:2},1032,["to","title"])):i.mainId?(t(),E(V,{key:1,to:o(v)("/item/"+i.mainId),class:"w-100 btn btn-primary",title:n.$t(i.name)},{default:z(()=>[i.img?(t(),e("img",{key:0,src:i.img,width:"18",height:"18"},null,8,Po)):(t(),E(L,{key:1,icon:"fas fa-info-circle","fixed-width":""}))]),_:2},1032,["to","title"])):(t(),E(V,{key:2,to:o(v)("/buildings/"),class:"w-100 btn btn-primary",title:n.$t(i.name)},{default:z(()=>[i.img?(t(),e("img",{key:0,src:i.img,width:"18",height:"18"},null,8,Vo)):(t(),E(L,{key:1,icon:"fas fa-info-circle","fixed-width":""}))]),_:2},1032,["to","title"]))]),s("div",zo,[s("span",Fo,u(n.$t(i.name)),1)]),s("div",Ro,[s("span",To,"- "+u(o(B)(i.assign.count*i.inputs[o(m).id]))+" /s",1)])])]))),128))])])):b("",!0)])])):b("",!0)])])])}}};export{Ko as default};
