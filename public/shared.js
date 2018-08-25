'use strict';var g;Array.i=function(...a){return(a[0]||[]).map((b,c)=>a.map((a)=>a[c]))};g=Array.prototype;g.i=function(...a){return Array.i(this,...a)};g.G=function(){return this.reduce((a,b)=>a+b,0)};g.product=function(){return this.reduce((a,b)=>a*b,1)};g.add=function(...a){return this.i(...a).map((a)=>a.G())};g.B=function(){return this.map((a)=>-a)};g.sub=function(a){return this.add(a.B())};g.scale=function(a){return this.map((b)=>b*a)};g.h=function(...a){return Array.h(this,...a)};
g.A=function(){return this.reduce((a,b)=>a.concat(b),[])};Array.h=function(a,...b){return void 0===a?[[]]:a.map((a)=>Array.h(...b).map((b)=>[a,...b])).A()};Array.prototype.w=function(){return Array(Math.ceil(this.length/2)).fill().map((a,b)=>this.slice(2*b,2*b+2))};Number.prototype.b=function(){return(this%1024+1024)%1024};const k=([a,b],[c,d])=>[a+c,b+d],p=([a,b])=>[-a,-b],r=([a,b])=>Math.sqrt(a*a+b*b),u=([a,b],[c,d])=>{var [e,h]=[0,0];return e<=a&&a<c&&h<=b&&b<d},w=(a,b)=>b.add(a).scale(.03125).map(Math.floor);function x(a,b,c,d){this.source=a;this.f=b;this.offset=c||[0,0];this.size=d||k(b,p(this.offset))}g=x.prototype;g.keys=function*(){for(let a=0;a<this.size[0];a++)for(let b=0;b<this.size[1];b++)yield[a,b]};function A([a,b],[,c]){return a*c+b}g.get=function(a){if(!(0>a[0]||a[0]>this.size[0]||0>a[1]||a[1]>this.size[1]))return this.source[A(k(a,this.offset),this.f)]};g.set=function(a,b){0>a[0]||a[0]>this.size[0]||0>a[1]||a[1]>this.size[1]||(this.source[A(k(a,this.offset),this.f)]=b)};
g.update=function(a,b){this.set(a,b(this.get(a),a))};g.shift=function(a){return new x(this.source,this.f,k(this.offset,a),k(this.size,p(a)))};g.F=function(a){return new x(this.source,this.f,this.offset,a)};g.window=function(a,b){return this.shift(a).F(b)};g.toJSON=function(){return Array.from(this.keys()).map((a)=>this.get(a))};function B(a){this.v=a;this.origin=[0,0];this.size=[0,0];this.data=[]}let C=([a,b],[,c])=>a*c+b;B.prototype.get=function(a){return this.data[C(k(a,p(this.origin)),this.size)]};B.prototype.m=function(a,b,c){for(let d=0;d<c[0];d++)for(let e=0;e<c[1];e++){let h=[d,e],v=k(k(h,b),p(this.origin));u(v,this.size)&&(this.data[C(v,this.size)]=a[C(h,c)])}};B.prototype.c=function(a,b){let c=this.data,d=this.origin,e=this.size;this.data=Array(b[0]*b[1]).fill();this.origin=a;this.size=b;this.m(c,d,e)};
B.prototype.update=function(a,b){a=a||this.origin;b=b||this.size;return fetch(`${this.v}/${a[0]}/${a[1]}/${b[0]}/${b[1]}/`).then((a)=>a.json()).then((c)=>this.m(c,a,b))};const D=Uint8Array.from("0061736d01000000012e0960027f7f017d60047f7f7f7f006000006000017c60027d7d017d60047f7f7f7d0060017f0060017d006000017f022e0403656e760672616e646f6d000303656e76036c6f67000603656e76046c6f6766000703656e7604706f776600040309080001020402050802050401009101074a06066d656d6f7279020004696e69740006047469636b00080f6164645f696e737472756374696f6e00090761646472657373000a13727573745f65685f706572736f6e616c697479000b0af20b082b002000410a744180f83f71200141ff07717241027422004180086a2a0200200041808880026a2a0200920bf30101037d200020011004200220031004932204430000000020044300000000601b2106430000803f21042000410a744180f83f71200141ff077172410274220041808880026a22012a0200220543000000005e4504402005430000404095430000803f922204430000803f2004430000803f5d1b2204430000000020044300000000601b21040b20012005200620049443cdcccc3e942204933802002002410a744180f83f71200341ff077172410274220241808880026a220320032a020020049238020020004180086a220320032a02002004436f12833a9422049338020020024180086a2202200420022a0200923802000bc00203027f027d017c41807e2100024003402000450d01200041818a80046a027f41001000440000000000007040a2220444000000000000f0416320044400000000000000006671450d001a2004ab0b3a0000200041016a21000c000b000b418080807e2100024003402000450d01200041808880026a200141ff0771b22202430000003e942001410a76b22203430000003e941007430000003f92433333333f942002430000804492430000c041952003430000c041951007430000803f92436666e63f94922002430000004592430000803c942003430000803c941007430000803f9243cdcc4c3f949243abaa2a4294380200200041046a2100200141016a21010c000b000b418080800221000240034020004180808004460d0120004180086a1000b6430000704194430000a0c092380200200041046a21000c000b000b0bb70502047f067d027f4100430000803f43000000002000200020019243ae67bb3e9422082000928e2206200620082001928e220892438c65583e94220793932200200120082007939322015e22031b2207430000804f5d200743000000006071450d001a2007a90b027f41808080807820068b430000004f5d450d001a2006a80b22026a027f41004300000000430000803f20031b2206430000804f5d200643000000006071450d001a2006a90b027f41808080807820088b430000004f5d450d001a2008a80b22036a41ff017141818880046a2d00006a41ff017141818880046a2d0000410c7021042001200693438c65583e9221062000200793438c65583e922108200143000080bf922107200043000080bf9221092002200341016a41ff017141818880046a2d00006a41016a41ff017141818880046a2d0000410c702105430000003f200020009493200120019493220a43000000005d450440200341ff017141818880046a2d000020026a41ff017141818880046a2d00002102200a4300008040100320002002410c7041036c41828a80046a22022f0000200241026a2d0000411074722202411874411875b29420012002411074411875b2949294210b0b2007438c65d83e9221002009438c65d83e9221014300000000210743000000002109430000003f200820089493200620069493220a43000000005d450440200a430000804010032008200441ff017141036c41828a80046a22022f0000200241026a2d0000411074722202411874411875b29420062002411074411875b294929421090b430000003f200120019493200020009493220643000000005d4504402006430000804010032001200541ff017141036c41828a80046a22022f0000200241026a2d0000411074722202411874411875b29420002002411074411875b294929421070b200b2009922007924300008c42940b6f01057f024003402000418008460d01200041016a2102410021014180082104024003402004450d012000200120022001100520022001200020011005200020012000200141016a22031005200020032000200110052004417f6a2104200321010c000b000b200221000c000b000b0b5a0020024118744118751001200310020240027f200241ff01712202044020024101470d024180080c010b41808880020b2000410a744180f83f71200141ff0771724102746a2202200343000070429420022a0200923802000b0b05004180080b0300010b0b2d010041828a80040b24010100ff010001ff00ffff00010001ff00010100ffff00ff00010100ff010001ff00ffff".split("").w().map(([a,
b])=>parseInt(a+b,16)));function E(){var a=new WebAssembly.Module(D);this.a=new WebAssembly.Instance(a,{env:{random:Math.random,log:(a)=>console.log("from rust with love: "+a),logf:(a)=>console.log("from rust with love: "+a),powf:Math.pow}});this.a.exports.init();a=this.a.exports.memory;this.g=this.a.exports.address();console.log("address: "+this.g);this.H=new x(new Float32Array(a.buffer,this.g,1048576),[1024,1024]);this.I=new x(new Float32Array(a.buffer,this.g+4194304,1048576),[1024,1024])}E.prototype.o=function(){this.a.exports.tick()};
E.prototype.s=function(a,b){this.a.exports.add_instruction(a[0],a[1],b.code,b.l)};let F,H=null,I=[];function J(a,b,c){this.name=a;this.code=b;this.l=c;if("undefined"!==typeof document){a=document.createElement("div");a.innerText=this.name;a.className="instruction";let b=this;a.addEventListener("click",()=>{let a=b.C;I.forEach((a)=>a.setActive(!1));b.setActive(!a);H&&H(a?null:b)});this.node=a;I.push(this)}}g=J.prototype;g.setActive=function(a){this.C=a;this.node.className="instruction"+(a?" active":"")};g.u=function(){F.appendChild(this.node)};
g.remove=function(){F.removeChild(this.node);let a=I.indexOf(this);-1<a&&I.splice(a,1)};g.D=function(){this.className="instruction placed"};g.j=function({water:a}){return 0>a};const K=["Water","Grow"];function L(){let a=new E,b=a.H,c=a.I,d=(b,c)=>{setTimeout(()=>{let h=new Date;for(let b=0;10>b;b++)a.o();console.log("Time for 10 generations: "+(new Date-h)+"ms");0<b?d(b-10,c):c()},100)},e=()=>{let b=new Date;a.o();console.log("tick time: "+(new Date-b));setTimeout(e,1E3)};d(500,e);return{io:(a)=>{a.on("disconnect",()=>{console.log("Disconnected: "+a.id)});console.log("Connected: "+a.id)},"terrain/:col/:row/:width/:height":(a,c)=>{let [d,f,h,e]=["col","row","width","height"].map((b)=>parseInt(a.params[b])),
l=[];for(let a=d;a<d+h;a++)for(let m=f;m<f+e;m++)l.push(b.get([a.b(),m.b()]));c.json(l)},"water/:col/:row/:width/:height":(a,b)=>{let [d,f,h,e]=["col","row","width","height"].map((b)=>parseInt(a.params[b])),l=[];for(let a=d;a<d+h;a++)for(let b=f;b<f+e;b++)l.push(c.get([a.b(),b.b()]));b.json(l)},"place_instruction/:x/:y/:code/:impact":(b,c)=>{let [d,f,h]=["x","y","code"].map((a)=>parseInt(b.params[a])),e=new J(K[h],h,parseFloat(b.params.impact));console.log(`Placing ${h} at ${d},${f}`);a.s([d,f],e);
c.json({ok:"sick"})}}};"undefined"!==eval("typeof window")?window.addEventListener("load",()=>{let a=new B("/terrain"),b=new B("/water"),c;c=io({J:!1,transports:["websocket"]});let d=[0,0],e=null,h=null,v=[-1,-1],q=null,f=document.getElementById("c"),t=f.getContext("2d"),y=()=>{f.width=window.innerWidth;f.height=window.innerHeight;let m=w(d,[0,0]);var c=w(d,[f.width,f.height]);c=k(c,p(m));a.c(k(m,p([5,5])),k(c,[10,10]));b.c(k(m,p([5,5])),k(c,[10,10]))};window.addEventListener("resize",y);y();f.addEventListener("mousedown",
(a)=>{e=h=[a.x,a.y]});f.addEventListener("mouseup",()=>{if(5>r(k(h,p(e)))&&q){let [c,f]=w(d,h);if(q.j({water:b.get([c,f]),terrain:a.get([c,f])})){q.D();let a=q;q=null;fetch(`/place_instruction/${c}/${f}/${a.code}/${a.l}`).then(()=>a.remove())}}h=null});f.addEventListener("mousemove",(c)=>{v=[c.x,c.y];if(h){c=[c.x,c.y].sub(h);d=d.sub(c);h=v;c=w(d,[0,0]);var e=w(d,[f.width,f.height]);e=k(e,p(c));a.c(k(c,p([5,5])),k(e,[10,10]));b.c(k(c,p([5,5])),k(e,[10,10]))}window.requestAnimationFrame(l)});F=document.getElementById("toolbar");
H=(a)=>{q=a};setInterval(()=>{if(5>I.length){var a=Math.floor(Math.random()*K.length);a=new J(K[a],a,Math.random());a.u()}},5E3);let l=()=>{{var c=d,e=v,h=q;t.clearRect(0,0,f.width,f.height);let [m,y]=w(c,[0,0]),[z,M]=w(c,[f.width,f.height]),[N,O]=w(c,e);for(e=m;e<=z;e++)for(let d=y;d<=M;d++){var n=a.get([e,d]),l=b.get([e,d]);let f={water:l||NaN,terrain:n||NaN};var G=c;G=[e,d].scale(32).sub(G);let [m,q]=G;l=n+l;n=l>n?"hsl(230,80%,"+Math.floor(32+l/255*40)+"%)":240<n?"hsl(0,0%,"+Math.floor(70+(n-240)/
15*20)+"%)":220<n?"hsl(35,48%,"+Math.floor(29+(n-220)/35*-14)+"%)":110<n?"hsl(87,48%,"+Math.floor(40+(n-110)/110*-25)+"%)":"hsl(70,56%,"+Math.floor(55+n/110*-21)+"%)";t.fillStyle=n;t.fillRect(m,q,32,32);h&&e==N&&d==O&&(h.j(f)?(t.fillStyle="rgba(255,255,255,30%)",t.fillRect(m,q,32,32)):(t.strokeStyle="rgba(255,255,255,30%)",t.lineWidth=1,t.strokeRect(m,q,31,31)))}}},z=()=>{a.update().then(()=>console.log(a)).then(l);b.update().then(()=>console.log(a)).then(l);setTimeout(z,1E3)};z();(()=>{c.on("start",
()=>{console.log("Started")});c.on("connect",()=>{console.log("Connected")});c.on("disconnect",()=>{console.log("Disconnected")});c.on("error",()=>{console.log("Oh shit")})})()},!1):module.exports=L();
