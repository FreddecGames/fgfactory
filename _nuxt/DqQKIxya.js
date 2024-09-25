import{S as O,T as M,U as E}from"./DmypThwR.js";class B{constructor(e){Object.getOwnPropertyNames(e).forEach(t=>{Object.defineProperty(this,t,Object.getOwnPropertyDescriptor(e,t))}),this.count=this.count?this.count:0,this.max=this.max?this.max:1/0,this.notified=!1,this.unlocked=!this.reqs,this.assign&&(this.assign.count||(this.assign.count=0),this.select||(this.select={count:1,values:[1]})),this.build&&(this.build.status||(this.build.status="waiting"),this.select||(this.select={count:1,values:[1]}))}load(e){e.assignCount&&(this.assign.count=e.assignCount),e.count&&(this.count=e.count),e.notified&&(this.notified=e.notified),e.remainingSeconds&&(this.build.remainingSeconds=e.remainingSeconds),e.selectCount&&(this.select.count=e.selectCount),e.status&&(this.build.status=e.status)}getDataToSave(){let e={};return this.assign&&(e.assignCount=this.assign.count),this.build&&this.build.remainingSeconds&&(e.remainingSeconds=this.build.remainingSeconds),this.build&&this.build.status&&(e.status=this.build.status),this.count&&(e.count=this.count),this.id&&(e.id=this.id),this.notified&&(e.notified=this.notified),this.select&&(e.selectCount=this.select.count),e}}const A=O({id:"game-store",state:()=>({elems:[],victory:!1}),getters:{getElem:s=>e=>s.elems.find(r=>r.id==e),checkElemCounts:s=>e=>{let r=!0;for(let t in e)s.getElem(t).count<e[t]&&(r=!1);return r},checkElemProds:s=>e=>{let r=!0;for(let t in e)s.getElem(t).prod<e[t]&&(r=!1);return r},getAvailableCount:s=>e=>{let t=s.getElem(e).count;return s.elems.filter(h=>h.assign&&h.assign.id==e&&h.assign.count>0).forEach(h=>t-=h.assign.count),t},getBuildCosts:s=>e=>{if(e.build&&e.build.costs){let r={};for(let t in e.build.costs)r[t]=e.build.costs[t]*e.select.count;return r}return null},getBuildInputs:s=>e=>{if(e.build&&e.build.inputs){let r={};for(let t in e.build.inputs)r[t]=e.build.inputs[t]*e.select.count;return r}return null},getBuildResults:s=>e=>{if(e.build&&e.build.result){let r={};if(r[e.id]=e.build.result*e.select.count,e.build.rewards)for(let t in e.build.rewards)r[t]=e.build.rewards[t]*e.select.count;return r}return null},getAssignCosts:s=>e=>{if(e.assign&&e.assign.costs){let r={};for(let t in e.assign.costs)r[t]=e.assign.costs[t]*e.select.count;return r}return null},getAssignInputs:s=>e=>{if(e.assign&&e.assign.inputs){let r={};for(let t in e.assign.inputs)r[t]=e.assign.inputs[t]*e.select.count;return r}return null},getAssignOutputs:s=>e=>{if(e.assign&&e.assign.output){let r={};return r[e.assign.output.id]=e.assign.output.count*e.select.count,r}return null},getAssignStorages:s=>e=>{if(e.assign&&e.assign.storage){let r={};return r[e.assign.storage.id]=e.assign.storage.count*e.select.count,r}return null},isVictoryReached:s=>s.victory?!1:s.terraformationIndex>=5e12},actions:{loadScenario(s){s.elems.forEach(r=>{let t=new B(r);this.elems.push(t)})},loadGameState(s){s.elems!=null&&s.elems.forEach(t=>{let p=this.getElem(t.id);p&&p.load(t)}),this.victory=s.victory??this.victory,this.elems.filter(t=>t.reqs).forEach(t=>{t.unlocked=!0}),this.elems.filter(t=>t.assign&&t.assign.count>0||t.build&&t.build.inputs&&t.count>0).forEach(t=>{if(t.build&&t.build.inputs)for(let p in t.build.inputs){let h=this.getElem(p);h.prod-=t.build.inputs[p]*t.count}if(t.assign&&t.assign.inputs)for(let p in t.assign.inputs){let h=this.getElem(p);h.prod-=t.assign.inputs[p]*t.assign.count}if(t.assign&&t.assign.output){let p=this.getElem(t.assign.output.id);p.prod+=t.assign.output.count*t.assign.count}if(t.assign&&t.assign.storage){let p=this.getElem(t.assign.storage.id);p.max+=t.assign.storage.count*t.assign.count}})},computeOfflineProgress(s){this.doTick(s)},saveGameState(s){s.elems=[],this.elems.forEach(e=>s.elems.push(e.getDataToSave())),s.victory=this.victory},doTick(s){this.elems.filter(t=>t.build&&t.build.status==="started").forEach(t=>{t.build.remainingSeconds-=s,t.build.remainingSeconds<=0&&this.onBuild(t)}),this.elems.filter(t=>t.prod>0&&t.count<t.max).forEach(t=>{t.count+=t.prod*s,t.count>=t.max&&(t.count=t.max)})},doVictory(){this.victory=!0},onBuild(s){s.build&&(s.build.status&&(s.build.status="waiting"),s.build.remainingSeconds&&(s.build.remainingSeconds=0));let e=this.getBuildResults(s);if(e)for(let t in e){let p=this.getElem(t);if(p.count>=p.max)continue;let h=e[t];p.count+=h,p.count>=p.max&&(p.count=p.max)}this.elems.filter(t=>t.reqs&&t.unlocked==!1).forEach(t=>{t.notified=!0,t.unlocked=this.checkElemCounts(t.reqs)})}}}),j=window.setInterval;var I={exports:{}};I.exports;(function(s){var e=function(){var r=String.fromCharCode,t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",h={};function T(o,n){if(!h[o]){h[o]={};for(var l=0;l<o.length;l++)h[o][o.charAt(l)]=l}return h[o][n]}var w={compressToBase64:function(o){if(o==null)return"";var n=w._compress(o,6,function(l){return t.charAt(l)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(o){return o==null?"":o==""?null:w._decompress(o.length,32,function(n){return T(t,o.charAt(n))})},compressToUTF16:function(o){return o==null?"":w._compress(o,15,function(n){return r(n+32)})+" "},decompressFromUTF16:function(o){return o==null?"":o==""?null:w._decompress(o.length,16384,function(n){return o.charCodeAt(n)-32})},compressToUint8Array:function(o){for(var n=w.compress(o),l=new Uint8Array(n.length*2),a=0,c=n.length;a<c;a++){var y=n.charCodeAt(a);l[a*2]=y>>>8,l[a*2+1]=y%256}return l},decompressFromUint8Array:function(o){if(o==null)return w.decompress(o);for(var n=new Array(o.length/2),l=0,a=n.length;l<a;l++)n[l]=o[l*2]*256+o[l*2+1];var c=[];return n.forEach(function(y){c.push(r(y))}),w.decompress(c.join(""))},compressToEncodedURIComponent:function(o){return o==null?"":w._compress(o,6,function(n){return p.charAt(n)})},decompressFromEncodedURIComponent:function(o){return o==null?"":o==""?null:(o=o.replace(/ /g,"+"),w._decompress(o.length,32,function(n){return T(p,o.charAt(n))}))},compress:function(o){return w._compress(o,16,function(n){return r(n)})},_compress:function(o,n,l){if(o==null)return"";var a,c,y={},S={},x="",v="",f="",b=2,m=3,_=2,g=[],i=0,d=0,u;for(u=0;u<o.length;u+=1)if(x=o.charAt(u),Object.prototype.hasOwnProperty.call(y,x)||(y[x]=m++,S[x]=!0),v=f+x,Object.prototype.hasOwnProperty.call(y,v))f=v;else{if(Object.prototype.hasOwnProperty.call(S,f)){if(f.charCodeAt(0)<256){for(a=0;a<_;a++)i=i<<1,d==n-1?(d=0,g.push(l(i)),i=0):d++;for(c=f.charCodeAt(0),a=0;a<8;a++)i=i<<1|c&1,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=c>>1}else{for(c=1,a=0;a<_;a++)i=i<<1|c,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=0;for(c=f.charCodeAt(0),a=0;a<16;a++)i=i<<1|c&1,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=c>>1}b--,b==0&&(b=Math.pow(2,_),_++),delete S[f]}else for(c=y[f],a=0;a<_;a++)i=i<<1|c&1,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=c>>1;b--,b==0&&(b=Math.pow(2,_),_++),y[v]=m++,f=String(x)}if(f!==""){if(Object.prototype.hasOwnProperty.call(S,f)){if(f.charCodeAt(0)<256){for(a=0;a<_;a++)i=i<<1,d==n-1?(d=0,g.push(l(i)),i=0):d++;for(c=f.charCodeAt(0),a=0;a<8;a++)i=i<<1|c&1,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=c>>1}else{for(c=1,a=0;a<_;a++)i=i<<1|c,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=0;for(c=f.charCodeAt(0),a=0;a<16;a++)i=i<<1|c&1,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=c>>1}b--,b==0&&(b=Math.pow(2,_),_++),delete S[f]}else for(c=y[f],a=0;a<_;a++)i=i<<1|c&1,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=c>>1;b--,b==0&&(b=Math.pow(2,_),_++)}for(c=2,a=0;a<_;a++)i=i<<1|c&1,d==n-1?(d=0,g.push(l(i)),i=0):d++,c=c>>1;for(;;)if(i=i<<1,d==n-1){g.push(l(i));break}else d++;return g.join("")},decompress:function(o){return o==null?"":o==""?null:w._decompress(o.length,32768,function(n){return o.charCodeAt(n)})},_decompress:function(o,n,l){var a=[],c=4,y=4,S=3,x="",v=[],f,b,m,_,g,i,d,u={val:l(0),position:n,index:1};for(f=0;f<3;f+=1)a[f]=f;for(m=0,g=Math.pow(2,2),i=1;i!=g;)_=u.val&u.position,u.position>>=1,u.position==0&&(u.position=n,u.val=l(u.index++)),m|=(_>0?1:0)*i,i<<=1;switch(m){case 0:for(m=0,g=Math.pow(2,8),i=1;i!=g;)_=u.val&u.position,u.position>>=1,u.position==0&&(u.position=n,u.val=l(u.index++)),m|=(_>0?1:0)*i,i<<=1;d=r(m);break;case 1:for(m=0,g=Math.pow(2,16),i=1;i!=g;)_=u.val&u.position,u.position>>=1,u.position==0&&(u.position=n,u.val=l(u.index++)),m|=(_>0?1:0)*i,i<<=1;d=r(m);break;case 2:return""}for(a[3]=d,b=d,v.push(d);;){if(u.index>o)return"";for(m=0,g=Math.pow(2,S),i=1;i!=g;)_=u.val&u.position,u.position>>=1,u.position==0&&(u.position=n,u.val=l(u.index++)),m|=(_>0?1:0)*i,i<<=1;switch(d=m){case 0:for(m=0,g=Math.pow(2,8),i=1;i!=g;)_=u.val&u.position,u.position>>=1,u.position==0&&(u.position=n,u.val=l(u.index++)),m|=(_>0?1:0)*i,i<<=1;a[y++]=r(m),d=y-1,c--;break;case 1:for(m=0,g=Math.pow(2,16),i=1;i!=g;)_=u.val&u.position,u.position>>=1,u.position==0&&(u.position=n,u.val=l(u.index++)),m|=(_>0?1:0)*i,i<<=1;a[y++]=r(m),d=y-1,c--;break;case 2:return v.join("")}if(c==0&&(c=Math.pow(2,S),S++),a[d])x=a[d];else if(d===y)x=b+b.charAt(0);else return null;v.push(x),a[y++]=b+x.charAt(0),c--,b=x,c==0&&(c=Math.pow(2,S),S++)}}};return w}();s!=null?s.exports=e:typeof angular<"u"&&angular!=null&&angular.module("LZString",[]).factory("LZString",function(){return e})})(I);var R=I.exports;const k=M(R),q={};q.id="sfy_vanilla";q.name="sfy_vanilla";q.desc="sfy_vanilla_desc";q.elems=[{type:"milestone",group:"sfy_project",id:"space_elevator",name:"sfy_space_elevator",desc:"sfy_space_elevator_desc",max:1,build:{result:1,costs:{concrete:500,wire:1500,iron_plate:250,iron_rod:400}},reqs:{hub_upgrade_6:1}},{type:"milestone",group:"sfy_tier",id:"hub_upgrade_6",name:"sfy_hub_upgrade_6",desc:"sfy_hub_upgrade_6_desc",max:1,build:{result:1,costs:{concrete:50,wire:100,iron_plate:100,iron_rod:100}},reqs:{hub_upgrade_5:1}},{type:"milestone",group:"sfy_tier",id:"hub_upgrade_5",name:"sfy_hub_upgrade_5",desc:"sfy_hub_upgrade_5_desc",max:1,build:{result:1,rewards:{energy:2e7},costs:{concrete:20,cable:75,iron_rod:75}},reqs:{hub_upgrade_4:1}},{type:"milestone",group:"sfy_tier",id:"hub_upgrade_4",name:"sfy_hub_upgrade_4",desc:"sfy_hub_upgrade_4_desc",max:1,build:{result:1,costs:{concrete:10,cable:50,iron_rod:75}},reqs:{hub_upgrade_3:1}},{type:"milestone",group:"sfy_tier",id:"hub_upgrade_3",name:"sfy_hub_upgrade_3",desc:"sfy_hub_upgrade_3_desc",max:1,build:{result:1,costs:{wire:20,iron_plate:20,iron_rod:20}},reqs:{hub_upgrade_2:1}},{type:"milestone",group:"sfy_tier",id:"hub_upgrade_2",name:"sfy_hub_upgrade_2",desc:"sfy_hub_upgrade_2_desc",max:1,build:{result:1,rewards:{energy:2e7},costs:{iron_plate:10,iron_rod:20}},reqs:{hub_upgrade_1:1}},{type:"milestone",group:"sfy_tier",id:"hub_upgrade_1",name:"sfy_hub_upgrade_1",desc:"sfy_hub_upgrade_1_desc",max:1,build:{result:1,costs:{iron_rod:10}},reqs:{intro:1}},{type:"milestone",group:"sfy_start",id:"intro",name:"sfy_intro",desc:"sfy_intro_desc",max:1,build:{result:1}},{type:"item",group:"sfy_power",id:"energy",name:"sfy_energy",desc:"sfy_energy_desc",img:"/icons/energy.png",reqs:{hub_upgrade_2:1}},{type:"item",group:"sfy_generators",id:"biomass_burner",name:"sfy_biomass_burner",desc:"sfy_biomass_burner_desc",img:"/icons/biomass_burner.png",build:{result:1,seconds:.25,rewards:{energy:3e7},costs:{wire:25,iron_plate:15,iron_rod:15},inputs:{biomass:.1}},reqs:{hub_upgrade_6:1}},{type:"item",group:"sfy_machines",id:"miner_1",name:"sfy_miner_1",desc:"sfy_miner_1_desc",img:"/icons/miner_1.png",build:{result:1,seconds:.25,costs:{concrete:10,iron_plate:10,iron_plate:12,iron_rod:4}},reqs:{hub_upgrade_5:1}},{type:"item",group:"sfy_machines",id:"constructor",name:"sfy_constructor",desc:"sfy_constructor_desc",img:"/icons/constructor.png",build:{result:1,seconds:.25,costs:{cable:8,iron_plate_2:2}},reqs:{hub_upgrade_3:1}},{type:"item",group:"sfy_machines",id:"smelter",name:"sfy_smelter",desc:"sfy_smelter_desc",img:"/icons/smelter.png",build:{result:1,seconds:.25,costs:{wire:8,iron_rod:5}},reqs:{hub_upgrade_2:1}},{type:"item",group:"sfy_machines",id:"miner",name:"sfy_miner",desc:"sfy_miner_desc",max:1,img:"/icons/miner.png",build:{result:1,seconds:.25,costs:{iron_plate:2,iron_rod:4}},reqs:{hub_upgrade_1:1}},{type:"item",group:"sfy_containers",id:"box_1",name:"sfy_box_1",desc:"sfy_box_1_desc",img:"/icons/box_1.png",build:{result:1,seconds:.25,costs:{iron_plate:10,iron_rod:10}},reqs:{hub_upgrade_5:1}},{type:"item",group:"sfy_containers",id:"box",name:"sfy_box",desc:"sfy_box_desc",max:1,img:"/icons/box.png",build:{result:1,seconds:.25,costs:{iron_plate:6,iron_rod:6}},reqs:{hub_upgrade_1:1}},{type:"item",group:"sfy_materials",id:"concrete",name:"sfy_concrete",desc:"sfy_concrete_desc",max:500,img:"/icons/concrete.png",prod:0,build:{result:1,seconds:.5,costs:{stone:3}},reqs:{hub_upgrade_3:1}},{type:"item",group:"sfy_materials",id:"cable",name:"sfy_cable",desc:"sfy_cable_desc",max:200,img:"/icons/cable.png",prod:0,build:{result:1,seconds:.25,costs:{wire:2}},reqs:{hub_upgrade_3:1}},{type:"item",group:"sfy_materials",id:"wire",name:"sfy_wire",desc:"sfy_wire_desc",max:500,img:"/icons/wire.png",prod:0,build:{result:2,seconds:.5,costs:{copper_ingot:1}},reqs:{hub_upgrade_2:1}},{type:"item",group:"sfy_materials",id:"copper_ingot",name:"sfy_copper_ingot",desc:"sfy_copper_ingot_desc",max:100,img:"/icons/copper_ingot.png",prod:0,build:{result:1,seconds:.75,costs:{copper_ore:1}},reqs:{hub_upgrade_2:1}},{type:"item",group:"sfy_materials",id:"iron_plate_2",name:"sfy_iron_plate_2",desc:"sfy_iron_plate_2_desc",max:100,img:"/icons/iron_plate_2.png",prod:0,build:{result:1,seconds:1.5,costs:{screw:12,iron_plate:6}},reqs:{hub_upgrade_3:1}},{type:"item",group:"sfy_materials",id:"iron_plate",name:"sfy_iron_plate",desc:"sfy_iron_plate_desc",max:200,img:"/icons/iron_plate.png",prod:0,build:{result:2,seconds:.75,costs:{iron_ingot:3}},reqs:{hub_upgrade_1:1}},{type:"item",group:"sfy_materials",id:"screw",name:"sfy_screw",desc:"sfy_screw_desc",max:500,img:"/icons/screw.png",prod:0,build:{result:4,seconds:.75,costs:{iron_rod:1}},reqs:{hub_upgrade_3:1}},{type:"item",group:"sfy_materials",id:"iron_rod",name:"sfy_iron_rod",desc:"sfy_iron_rod_desc",max:200,img:"/icons/iron_rod.png",prod:0,build:{result:1,seconds:.25,costs:{iron_ingot:1}},reqs:{intro:1}},{type:"item",group:"sfy_materials",id:"iron_ingot",name:"sfy_iron_ingot",desc:"sfy_iron_ingot_desc",max:100,img:"/icons/iron_ingot.png",prod:0,build:{result:1,seconds:.75,costs:{iron_ore:1}},reqs:{intro:1}},{type:"item",group:"sfy_raw",id:"biomass",name:"sfy_biomass",desc:"sfy_biomass_desc",max:200,img:"/icons/biomass.png",prod:0,build:{result:1,seconds:.25},reqs:{hub_upgrade_6:1}},{type:"item",group:"sfy_raw",id:"stone",name:"sfy_stone",desc:"sfy_stone_desc",max:100,img:"/icons/stone.png",prod:0,build:{result:1,seconds:.25},reqs:{hub_upgrade_3:1}},{type:"item",group:"sfy_raw",id:"copper_ore",name:"sfy_copper_ore",desc:"sfy_copper_ore_desc",img:"/icons/copper.png",max:100,prod:0,build:{result:1,seconds:.25},reqs:{hub_upgrade_2:1}},{type:"item",group:"sfy_raw",id:"iron_ore",name:"sfy_iron_ore",desc:"sfy_iron_ore_desc",img:"/icons/iron.png",max:100,prod:0,build:{result:1,seconds:.25},reqs:{intro:1}},{type:"recipe",id:"constructor_concrete",name:"sfy_concrete",assign:{id:"constructor",costs:{energy:4e6},output:{id:"concrete",count:.25},inputs:{stone:.75}},reqs:{hub_upgrade_3:1}},{type:"recipe",id:"constructor_cable",name:"sfy_cable",assign:{id:"constructor",costs:{energy:4e6},output:{id:"cable",count:.5},inputs:{wire:1}},reqs:{hub_upgrade_3:1}},{type:"recipe",id:"constructor_wire",name:"sfy_wire",assign:{id:"constructor",costs:{energy:4e6},output:{id:"wire",count:.5},inputs:{copper_ingot:.25}},reqs:{hub_upgrade_3:1}},{type:"recipe",id:"constructor_screw",name:"sfy_screw",assign:{id:"constructor",costs:{energy:4e6},output:{id:"screw",count:.5},inputs:{iron_rod:.1}},reqs:{hub_upgrade_3:1}},{type:"recipe",id:"constructor_iron_rod",name:"sfy_iron_rod",assign:{id:"constructor",costs:{energy:4e6},output:{id:"iron_rod",count:.25},inputs:{iron_ingot:.25}},reqs:{hub_upgrade_3:1}},{type:"recipe",id:"smelter_copper_ingot",name:"sfy_copper_ingot",assign:{id:"smelter",costs:{energy:4e6},output:{id:"copper_ingot",count:.5},inputs:{copper_ore:.5}},reqs:{hub_upgrade_2:1}},{type:"recipe",id:"smelter_iron_ingot",name:"sfy_iron_ingot",assign:{id:"smelter",costs:{energy:4e6},output:{id:"iron_ingot",count:.5},inputs:{iron_ore:.5}},reqs:{hub_upgrade_2:1}},{type:"recipe",id:"miner_stone",name:"sfy_stone",assign:{id:"miner",output:{id:"stone",count:.65}},reqs:{hub_upgrade_3:1}},{type:"recipe",id:"miner_copper_ore",name:"sfy_copper_ore",assign:{id:"miner",output:{id:"copper_ore",count:.65}},reqs:{hub_upgrade_2:1}},{type:"recipe",id:"miner_iron_ore",name:"sfy_iron_ore",assign:{id:"miner",output:{id:"iron_ore",count:.65}},reqs:{hub_upgrade_1:1}},{type:"storage",id:"box_concrete",name:"sfy_concrete",assign:{id:"box",storage:{id:"concrete",count:500}},reqs:{hub_upgrade_3:1}},{type:"storage",id:"box_stone",name:"sfy_stone",assign:{id:"box",storage:{id:"stone",count:100}},reqs:{hub_upgrade_3:1}},{type:"storage",id:"box_cable",name:"sfy_cable",assign:{id:"box",storage:{id:"cable",count:200}},reqs:{hub_upgrade_3:1}},{type:"storage",id:"box_wire",name:"sfy_wire",assign:{id:"box",storage:{id:"wire",count:500}},reqs:{hub_upgrade_2:1}},{type:"storage",id:"box_copper_ingot",name:"sfy_copper_ingot",assign:{id:"box",storage:{id:"copper_ingot",count:100}},reqs:{hub_upgrade_2:1}},{type:"storage",id:"box_copper_ore",name:"sfy_copper_ore",assign:{id:"box",storage:{id:"copper_ore",count:100}},reqs:{hub_upgrade_2:1}},{type:"storage",id:"box_iron_plate_2",name:"sfy_iron_plate_2",assign:{id:"box",storage:{id:"iron_plate_2",count:100}},reqs:{hub_upgrade_3:1}},{type:"storage",id:"box_iron_plate",name:"sfy_iron_plate",assign:{id:"box",storage:{id:"iron_plate",count:200}},reqs:{hub_upgrade_1:1}},{type:"storage",id:"box_screw",name:"sfy_screw",assign:{id:"box",storage:{id:"screw",count:500}},reqs:{hub_upgrade_3:1}},{type:"storage",id:"box_iron_rod",name:"sfy_iron_rod",assign:{id:"box",storage:{id:"iron_rod",count:200}},reqs:{hub_upgrade_1:1}},{type:"storage",id:"box_iron_ingot",name:"sfy_iron_ingot",assign:{id:"box",storage:{id:"iron_ingot",count:100}},reqs:{hub_upgrade_1:1}},{type:"storage",id:"box_iron_ore",name:"sfy_iron_ore",assign:{id:"box",storage:{id:"iron_ore",count:100}},reqs:{hub_upgrade_1:1}}];const U=O({id:"app-store",state:()=>({collapsed:[],currentModalId:null,currentScenarioId:null,error:null,firstTime:!0,gameTabId:"milestones",isAppRunning:!1,loaded:!1,lastSavedTime:Date.now(),localStorageName:"fgfactory",loopInterval:null,offlineTime:0,resetInProgress:!1,version:.01,scenarios:[q]}),getters:{localStorageData:s=>localStorage.getItem(s.localStorageName),isCollapsed:s=>e=>s.collapsed.includes(e),currentScenario:s=>s.scenarios.find(e=>e.id==s.currentScenarioId)},actions:{startApp(){if(this.loaded==!0)return;this.error=null,this.loaded=!1;let s=A();try{let e=localStorage.getItem(this.localStorageName);if(e&&e!==null&&e.length%4==0){let r=k.decompressFromBase64(e);if(!r)throw"Local data corrupted";e=JSON.parse(r),console.log(e),this.loadAppState(e);let t=this.scenarios.find(p=>p.id==this.currentScenarioId);s.loadScenario(t),s.loadGameState(e)}else{this.currentScenarioId=this.scenarios[0].id;let r=this.scenarios.find(t=>t.id==this.currentScenarioId);s.loadScenario(r)}this.computeOfflineProgress(),this.loaded=!0}catch(e){this.error=e,console.error(this.error)}},loadAppState(s){this.collapsed=s.collapsed??this.collapsed,this.currentScenarioId=s.currentScenarioId??this.currentScenarioId,this.firstTime=s.firstTime??this.firstTime,this.gameTabId=s.gameTabId??this.gameTabId,this.lastSavedTime=s.lastSavedTime??this.lastSavedTime},computeOfflineProgress(){let e=(Date.now()-this.lastSavedTime)/1e3;e>15*60&&(this.offlineTime=e,this.showModal("modalOffline")),A().computeOfflineProgress(e)},saveAppState(){this.lastSavedTime=Date.now();let s={};s.collapsed=this.collapsed,s.currentScenarioId=this.currentScenarioId,s.firstTime=this.firstTime,s.gameTabId=this.gameTabId,s.lastSavedTime=this.lastSavedTime,A().saveGameState(s),console.log(s);let r=JSON.stringify(s),t=k.compressToBase64(r);localStorage.setItem(this.localStorageName,t)},exportAppState(){navigator.clipboard.writeText(this.localStorageData),this.showToast("toastExport")},downloadAppState(){let s=document.createElement("a");s.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(this.localStorageData)),s.setAttribute("download",this.localStorageName+"_save_"+new Date().getTime()+".txt"),s.style.display="none",document.body.appendChild(s),s.click(),document.body.removeChild(s)},importAppState(){let e=document.getElementById("importData").value.trim();if(!e)return this.showToast("toastImportEmpty");if(e.length%4!==0)return this.showToast("toastImportCorrupted");this.resetInProgress=!0,localStorage.setItem(this.localStorageName,e),window.location.replace("/game")},wipeAppState(){this.resetInProgress=!0,localStorage.removeItem(this.localStorageName),window.location.replace("/game")},startGameLoop(){if(this.isAppRunning)return;this.isAppRunning=!0;let s=1/60,e=performance.now(),r=0,t=()=>{let p=A(),h=performance.now(),T=(h-e)/1e3;r+=T,r>=s&&(p.doTick(s),r-=s),e=h,p.isVictoryReached&&(p.doVictory(),this.showModal("modalVictory"))};this.loopInterval=j(()=>{t()},s*1e3)},stopGameLoop(){this.isAppRunning=!1,this.loopInterval&&clearInterval(this.loopInterval)},showToast(s){let e=document.getElementById(s);new E.Toast(e).show()},showModal(s){if(this.currentModalId==s)return;this.currentModalId=s;let e=document.getElementById(s);new E.Modal(e).show()},toggleCollapsed(s){if(this.isCollapsed(s)){let e=this.collapsed.indexOf(s);this.collapsed.splice(e,1)}else this.collapsed.push(s)}}});export{U as a,j as s,A as u};
