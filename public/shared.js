'use strict';var h;Array.i=function(...a){return(a[0]||[]).map((b,d)=>a.map((a)=>a[d]))};h=Array.prototype;h.i=function(...a){return Array.i(this,...a)};h.G=function(){return this.reduce((a,b)=>a+b,0)};h.product=function(){return this.reduce((a,b)=>a*b,1)};h.add=function(...a){return this.i(...a).map((a)=>a.G())};h.B=function(){return this.map((a)=>-a)};h.sub=function(a){return this.add(a.B())};h.scale=function(a){return this.map((b)=>b*a)};h.h=function(...a){return Array.h(this,...a)};
h.A=function(){return this.reduce((a,b)=>a.concat(b),[])};Array.h=function(a,...b){return void 0===a?[[]]:a.map((a)=>Array.h(...b).map((b)=>[a,...b])).A()};Array.prototype.w=function(){return Array(Math.ceil(this.length/2)).fill().map((a,b)=>this.slice(2*b,2*b+2))};Number.prototype.a=function(){return(this%1024+1024)%1024};const m=([a,b],[d,c])=>[a+d,b+c],t=([a,b])=>[-a,-b],u=(a,b)=>m(a,t(b)),v=([a,b])=>Math.sqrt(a*a+b*b),w=([a,b],[d,c])=>{var [e,n]=[0,0];return e<=a&&a<d&&n<=b&&b<c},x=(a,b)=>b.add(a).scale(.03125).map(Math.floor);function y(a,b,d,c){this.source=a;this.g=b;this.offset=d||[0,0];this.size=c||m(b,t(this.offset))}h=y.prototype;h.keys=function*(){for(let a=0;a<this.size[0];a++)for(let b=0;b<this.size[1];b++)yield[a,b]};function B([a,b],[,d]){return a*d+b}h.get=function(a){if(!(0>a[0]||a[0]>this.size[0]||0>a[1]||a[1]>this.size[1]))return this.source[B(m(a,this.offset),this.g)]};h.set=function(a,b){0>a[0]||a[0]>this.size[0]||0>a[1]||a[1]>this.size[1]||(this.source[B(m(a,this.offset),this.g)]=b)};
h.update=function(a,b){this.set(a,b(this.get(a),a))};h.shift=function(a){return new y(this.source,this.g,m(this.offset,a),m(this.size,t(a)))};h.F=function(a){return new y(this.source,this.g,this.offset,a)};h.window=function(a,b){return this.shift(a).F(b)};h.toJSON=function(){return Array.from(this.keys()).map((a)=>this.get(a))};function C(a){this.v=a;this.origin=[0,0];this.size=[0,0];this.data=[]}let D=([a,b],[,d])=>a*d+b;C.prototype.get=function(a){return this.data[D(m(a,t(this.origin)),this.size)]};C.prototype.m=function(a,b,d){for(let c=0;c<d[0];c++)for(let e=0;e<d[1];e++){let n=[c,e],f=m(m(n,b),t(this.origin));w(f,this.size)&&(this.data[D(f,this.size)]=a[D(n,d)])}};C.prototype.b=function(a,b){let d=this.data,c=this.origin,e=this.size;this.data=Array(b[0]*b[1]).fill();this.origin=a;this.size=b;this.m(d,c,e)};
C.prototype.update=function(a,b){a=a||this.origin;b=b||this.size;return fetch(`${this.v}/${a[0]}/${a[1]}/${b[0]}/${b[1]}/`).then((a)=>a.json()).then((d)=>this.m(d,a,b))};const E=Uint8Array.from("0061736d01000000012e0960027f7f017d60047f7f7f7f006000006000017c60027d7d017d60047f7f7f7d0060017f0060017d006000017f022e0403656e760672616e646f6d000303656e76036c6f67000603656e76046c6f6766000703656e7604706f776600040309080001020402050802050401009102074a06066d656d6f7279020004696e69740006047469636b00080f6164645f696e737472756374696f6e00090761646472657373000a13727573745f65685f706572736f6e616c697479000b0ad50f082b002000410a744180f83f71200141ff07717241027422004180086a2a0200200041808880026a2a0200920bf30101037d200020011004200220031004932204430000000020044300000000601b2106430000803f21042000410a744180f83f71200141ff077172410274220041808880026a22012a0200220543000000005e4504402005430000404095430000803f922204430000803f2004430000803f5d1b2204430000000020044300000000601b21040b20012005200620049443cdcccc3e942204933802002002410a744180f83f71200341ff077172410274220241808880026a220320032a020020049238020020004180086a220320032a02002004436f12833a9422049338020020024180086a2202200420022a0200923802000ba60303027f027d017c41807e2100024003402000450d01200041818a80086a027f41001000440000000000007040a2220444000000000000f0416320044400000000000000006671450d001a2004ab0b3a0000200041016a21000c000b000b418080807e2100024003402000450d01200041808880026a200141ff0771b22202430000003e942001410a76b22203430000003e941007430000003f92433333333f942002430000804492430000c041952003430000c041951007430000803f92436666e63f94922002430000004592430000803c942003430000803c941007430000803f9243cdcc4c3f949243abaa2a4294380200200041046a2100200141016a21010c000b000b418080800221000240034020004180808004460d0120004180086a1000b6430000704194430000a0c092380200200041046a21000c000b000b418080800421000240034020004180808006460d0120004180086a1000b64300007f4394380200200041046a21000c000b000b418080800621000240034020004180808008460d0120004180086a1000b64300007f4394380200200041046a21000c000b000b0bb70502047f067d027f4100430000803f43000000002000200020019243ae67bb3e9422082000928e2206200620082001928e220892438c65583e94220793932200200120082007939322015e22031b2207430000804f5d200743000000006071450d001a2007a90b027f41808080807820068b430000004f5d450d001a2006a80b22026a027f41004300000000430000803f20031b2206430000804f5d200643000000006071450d001a2006a90b027f41808080807820088b430000004f5d450d001a2008a80b22036a41ff017141818880086a2d00006a41ff017141818880086a2d0000410c7021042001200693438c65583e9221062000200793438c65583e922108200143000080bf922107200043000080bf9221092002200341016a41ff017141818880086a2d00006a41016a41ff017141818880086a2d0000410c702105430000003f200020009493200120019493220a43000000005d450440200341ff017141818880086a2d000020026a41ff017141818880086a2d00002102200a4300008040100320002002410c7041036c41828a80086a22022f0000200241026a2d0000411074722202411874411875b29420012002411074411875b2949294210b0b2007438c65d83e9221002009438c65d83e9221014300000000210743000000002109430000003f200820089493200620069493220a43000000005d450440200a430000804010032008200441ff017141036c41828a80086a22022f0000200241026a2d0000411074722202411874411875b29420062002411074411875b294929421090b430000003f200120019493200020009493220643000000005d4504402006430000804010032001200541ff017141036c41828a80086a22022f0000200241026a2d0000411074722202411874411875b29420002002411074411875b294929421070b200b2009922007924300008c42940bda0303087f017d017c024003402002418008460d01200241016a2101410021034180082107024003402007450d012002200320012003100520012003200220031005200220032002200341016a22001005200220002002200310052007417f6a2107200021030c000b000b200121020c000b000b024003402006418008460d012006410a7422034180f83f71210220034180086a4180f83f71210520034180f83f6a4180f83f71210441002103024003402003418008460d01200341ff0771220720027241027441808880046a22002a020021080240024041024101200341ff076a41ff077120027241027441808880046a2a020043000000435e22011b2001200341016a220341ff077120027241027441808880046a2a020043000000435e1b200720047241027441808880046a2a020043000000435e6a200720057241027441808880046a2a020043000000435e6a2207410347044020074104470d012008430000a0419221080c020b200843000020419221080c010b200741ff017141014b0d001000220944000000000000e03f662009200962720d00200843000070c19221080b20002008430000000020084300000000601b22084300007f4320084300007f435d1b3802000c000b000b200641016a21060c000b000b0b6b0020024118744118751001200310020240027f0240200241ff01712202044020024102460d0120024101470d034180080c020b41808880020c010b41808880040b2000410a744180f83f71200141ff0771724102746a2202200343000070429420022a0200923802000b0b05004180080b0300010b0b2d010041828a80080b24010100ff010001ff00ffff00010001ff00010100ffff00ff00010100ff010001ff00ffff".split("").w().map(([a,
b])=>parseInt(a+b,16)));function F(){var a=new WebAssembly.Module(E);this.c=new WebAssembly.Instance(a,{env:{random:Math.random,log:(a)=>console.log("from rust with love: "+a),logf:(a)=>console.log("from rust with love: "+a),powf:Math.pow}});this.c.exports.init();a=this.c.exports.memory;this.f=this.c.exports.address();console.log("address: "+this.f);this.H=new y(new Float32Array(a.buffer,this.f,1048576),[1024,1024]);this.J=new y(new Float32Array(a.buffer,this.f+4194304,1048576),[1024,1024]);this.I=new y(new Float32Array(a.buffer,
this.f+8388608,1048576),[1024,1024])}F.prototype.o=function(){this.c.exports.tick()};F.prototype.s=function(a,b){this.c.exports.add_instruction(a[0],a[1],b.code,b.l)};let G,J=null,K=[];function L(a,b,d){this.name=a;this.code=b;this.l=d;if("undefined"!==typeof document){a=document.createElement("div");a.innerText=this.name;a.className="instruction";let b=this;a.addEventListener("click",()=>{let a=b.C;K.forEach((a)=>a.setActive(!1));b.setActive(!a);J&&J(a?null:b)});this.node=a;K.push(this)}}h=L.prototype;h.setActive=function(a){this.C=a;this.node.className="instruction"+(a?" active":"")};h.u=function(){G.appendChild(this.node)};
h.remove=function(){G.removeChild(this.node);let a=K.indexOf(this);-1<a&&K.splice(a,1)};h.D=function(){this.className="instruction placed"};h.j=function({water:a}){return 0>a};const M=["Water","Grow","Plant"];function N(){let a=new F,b=a.H,d=a.J,c=a.I,e=(b,d)=>{setTimeout(()=>{let f=new Date;for(let b=0;10>b;b++)a.o();console.log("Time for 10 generations: "+(new Date-f)+"ms");0<b?e(b-10,d):d()},100)},n=()=>{let b=new Date;a.o();console.log("tick time: "+(new Date-b));setTimeout(n,1E3)};e(0,n);return{io:(a)=>{a.on("disconnect",()=>{console.log("Disconnected: "+a.id)});console.log("Connected: "+a.id)},"terrain/:col/:row/:width/:height":(a,d)=>{let [c,g,q,e]=["col","row","width","height"].map((b)=>parseInt(a.params[b])),
f=[];for(let a=c;a<c+q;a++)for(let l=g;l<g+e;l++)f.push(b.get([a.a(),l.a()]));d.json(f)},"water/:col/:row/:width/:height":(a,b)=>{let [c,g,e,f]=["col","row","width","height"].map((b)=>parseInt(a.params[b])),k=[];for(let a=c;a<c+e;a++)for(let b=g;b<g+f;b++)k.push(d.get([a.a(),b.a()]));b.json(k)},"vegetation/:col/:row/:width/:height":(a,b)=>{let [d,g,e,f]=["col","row","width","height"].map((b)=>parseInt(a.params[b])),k=[];for(let a=d;a<d+e;a++)for(let b=g;b<g+f;b++)k.push(c.get([a.a(),b.a()]));b.json(k)},
"place_instruction/:x/:y/:code/:impact":(b,d)=>{let [c,g,e]=["x","y","code"].map((a)=>parseInt(b.params[a])),f=new L(M[e],e,parseFloat(b.params.impact));console.log(`Placing ${e} at ${c},${g}`);a.s([c,g],f);d.json({ok:"sick"})}}};"undefined"!==eval("typeof window")?window.addEventListener("load",()=>{let a=new C("/terrain"),b=new C("/water"),d=new C("/vegetation"),c;c=io({K:!1,transports:["websocket"]});let e=[0,0],n=null,f=null,H=[-1,-1],p=null,g=document.getElementById("c"),q=g.getContext("2d"),r=()=>{g.width=window.innerWidth;g.height=window.innerHeight;let l=x(e,[0,0]),c=u(x(e,[g.width,g.height]),l);a.b(u(l,[5,5]),m(c,[10,10]));b.b(u(l,[5,5]),m(c,[10,10]));d.b(u(l,[5,5]),m(c,[10,10]))};window.addEventListener("resize",
r);r();g.addEventListener("mousedown",(a)=>{n=f=[a.x,a.y]});g.addEventListener("mouseup",()=>{if(5>v(m(f,t(n)))&&p){let [l,c]=x(e,f);if(p.j({vegetation:d.get([l,c]),water:b.get([l,c]),terrain:a.get([l,c])})){p.D();let a=p;p=null;fetch(`/place_instruction/${l}/${c}/${a.code}/${a.l}`).then(()=>a.remove())}}f=null});g.addEventListener("mousemove",(c)=>{H=[c.x,c.y];if(f){c=[c.x,c.y].sub(f);e=e.sub(c);f=H;c=x(e,[0,0]);let l=u(x(e,[g.width,g.height]),c);a.b(u(c,[5,5]),m(l,[10,10]));b.b(u(c,[5,5]),m(l,[10,
10]));d.b(u(c,[5,5]),m(l,[10,10]))}window.requestAnimationFrame(k)});G=document.getElementById("toolbar");J=(a)=>{p=a};setInterval(()=>{if(5>K.length){var a=Math.floor(Math.random()*M.length);a=new L(M[a],a,Math.random());a.u()}},5E3);let k=()=>{{var c=e,f=H,n=p;q.clearRect(0,0,g.width,g.height);let [l,r]=x(c,[0,0]),[A,O]=x(c,[g.width,g.height]),[P,Q]=x(c,f);for(f=l;f<=A;f++)for(let e=r;e<=O;e++){var k=a.get([f,e]),z=b.get([f,e]);let g=d.get([f,e]),l={water:z||NaN,terrain:k||NaN,vegetation:g||NaN};
var I=c;I=[f,e].scale(32).sub(I);let [p,r]=I;z=k+z;k=z>k?"hsl(230,80%,"+Math.floor(32+z/255*40)+"%)":240<k?"hsl(0,0%,"+Math.floor(70+(k-240)/15*20)+"%)":220<k?"hsl(35,48%,"+Math.floor(29+(k-220)/35*-14)+"%)":"hsl(70,56%,"+Math.floor(55+k/110*-21)+"%)";q.fillStyle=k;q.fillRect(p,r,32,32);0<g&&(q.fillStyle="hsla(131, 70%, 31%, "+Math.floor((g+40)/295*100)+"%)",q.fillRect(p,r,32,32));n&&f==P&&e==Q&&(n.j(l)?(q.fillStyle="rgba(255,255,255,30%)",q.fillRect(p,r,32,32)):(q.strokeStyle="rgba(255,255,255,30%)",
q.lineWidth=1,q.strokeRect(p,r,31,31)))}}},A=()=>{a.update().then(k);b.update().then(k);d.update().then(k);setTimeout(A,1E3)};A();(()=>{c.on("start",()=>{console.log("Started")});c.on("connect",()=>{console.log("Connected")});c.on("disconnect",()=>{console.log("Disconnected")});c.on("error",()=>{console.log("Oh shit")})})()},!1):module.exports=N();
