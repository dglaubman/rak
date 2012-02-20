/**
 * Copyright (c) 2007-2011, Kaazing Corporation. All rights reserved.
 * 
 * Licensed under the Kaazing Corporation Developer Agreement (2010-02-22), see:
 * 
 *   http://www.kaazing.com/license
 */

var browser=null;
if(typeof (ActiveXObject)!="undefined"){
browser="ie";
}else{
if(Object.prototype.toString.call(window.opera)=="[object Opera]"){
browser="opera";
}else{
if(navigator.vendor.indexOf("Apple")!=-1){
browser="safari";
}else{
if(navigator.vendor.indexOf("Google")!=-1){
if(navigator.userAgent.indexOf("Android")!=-1){
browser="android";
}else{
browser="chrome";
}
}else{
if(navigator.product=="Gecko"&&window.find&&!navigator.savePreferences){
browser="firefox";
}else{
throw new Error("couldn't detect browser");
}
}
}
}
}
switch(browser){
case "ie":
(function(){
if(document.createEvent===undefined){
var _1=function(){
};
_1.prototype.initEvent=function(_2,_3,_4){
this.type=_2;
this.bubbles=_3;
this.cancelable=_4;
};
document.createEvent=function(_5){
if(_5!="Events"){
throw new Error("Unsupported event name: "+_5);
}
return new _1();
};
}
document._w_3_c_d_o_m_e_v_e_n_t_s_createElement=document.createElement;
document.createElement=function(_6){
var _7=this._w_3_c_d_o_m_e_v_e_n_t_s_createElement(_6);
if(_7.addEventListener===undefined){
var _8={};
_7.addEventListener=function(_9,_a,_b){
_7.attachEvent("on"+_9,_a);
return addEventListener(_8,_9,_a,_b);
};
_7.removeEventListener=function(_c,_d,_e){
return removeEventListener(_8,_c,_d,_e);
};
_7.dispatchEvent=function(_f){
return dispatchEvent(_8,_f);
};
}
return _7;
};
if(window.addEventListener===undefined){
var _10=document.createElement("div");
var _11=(typeof (postMessage)==="undefined");
window.addEventListener=function(_12,_13,_14){
if(_11&&_12=="message"){
_10.addEventListener(_12,_13,_14);
}else{
window.attachEvent("on"+_12,_13);
}
};
window.removeEventListener=function(_15,_16,_17){
if(_11&&_15=="message"){
_10.removeEventListener(_15,_16,_17);
}else{
window.detachEvent("on"+_15,_16);
}
};
window.dispatchEvent=function(_18){
if(_11&&_18.type=="message"){
_10.dispatchEvent(_18);
}else{
window.fireEvent("on"+_18.type,_18);
}
};
}
function addEventListener(_19,_1a,_1b,_1c){
if(_1c){
throw new Error("Not implemented");
}
var _1d=_19[_1a]||{};
_19[_1a]=_1d;
_1d[_1b]=_1b;
};
function removeEventListener(_1e,_1f,_20,_21){
if(_21){
throw new Error("Not implemented");
}
var _22=_1e[_1f]||{};
delete _22[_20];
};
function dispatchEvent(_23,_24){
var _25=_24.type;
var _26=_23[_25]||{};
for(var key in _26){
if(typeof (_26[key])=="function"){
try{
_26[key](_24);
}
catch(e){
}
}
}
};
})();
break;
case "chrome":
case "android":
case "safari":
if(typeof (window.postMessage)==="undefined"&&typeof (window.dispatchEvent)==="undefined"&&typeof (document.dispatchEvent)==="function"){
window.dispatchEvent=function(_28){
document.dispatchEvent(_28);
};
var addEventListener0=window.addEventListener;
window.addEventListener=function(_29,_2a,_2b){
if(_29==="message"){
document.addEventListener(_29,_2a,_2b);
}else{
addEventListener0.call(window,_29,_2a,_2b);
}
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_2c,_2d,_2e){
if(_2c==="message"){
document.removeEventListener(_2c,_2d,_2e);
}else{
removeEventListener0.call(window,_2c,_2d,_2e);
}
};
}
break;
case "opera":
var addEventListener0=window.addEventListener;
window.addEventListener=function(_2f,_30,_31){
var _32=_30;
if(_2f==="message"){
_32=function(_33){
if(_33.origin===undefined&&_33.uri!==undefined){
var uri=new URI(_33.uri);
delete uri.path;
delete uri.query;
delete uri.fragment;
_33.origin=uri.toString();
}
return _30(_33);
};
_30._$=_32;
}
addEventListener0.call(window,_2f,_32,_31);
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_35,_36,_37){
var _38=_36;
if(_35==="message"){
_38=_36._$;
}
removeEventListener0.call(window,_35,_38,_37);
};
break;
}
function URI(str){
str=str||"";
var _3a=0;
var _3b=str.indexOf("://");
if(_3b!=-1){
this.scheme=str.slice(0,_3b);
_3a=_3b+3;
var _3c=str.indexOf("/",_3a);
if(_3c==-1){
_3c=str.length;
str+="/";
}
var _3d=str.slice(_3a,_3c);
this.authority=_3d;
_3a=_3c;
this.host=_3d;
var _3e=_3d.indexOf(":");
if(_3e!=-1){
this.host=_3d.slice(0,_3e);
this.port=parseInt(_3d.slice(_3e+1),10);
if(isNaN(this.port)){
throw new Error("Invalid URI syntax");
}
}
}
var _3f=str.indexOf("?",_3a);
if(_3f!=-1){
this.path=str.slice(_3a,_3f);
_3a=_3f+1;
}
var _40=str.indexOf("#",_3a);
if(_40!=-1){
if(_3f!=-1){
this.query=str.slice(_3a,_40);
}else{
this.path=str.slice(_3a,_40);
}
_3a=_40+1;
this.fragment=str.slice(_3a);
}else{
if(_3f!=-1){
this.query=str.slice(_3a);
}else{
this.path=str.slice(_3a);
}
}
};
(function(){
var _41=URI.prototype;
_41.toString=function(){
var sb=[];
var _43=this.scheme;
if(_43!==undefined){
sb.push(_43);
sb.push("://");
sb.push(this.host);
var _44=this.port;
if(_44!==undefined){
sb.push(":");
sb.push(_44.toString());
}
}
if(this.path!==undefined){
sb.push(this.path);
}
if(this.query!==undefined){
sb.push("?");
sb.push(this.query);
}
if(this.fragment!==undefined){
sb.push("#");
sb.push(this.fragment);
}
return sb.join("");
};
var _45={"http":80,"ws":80,"https":443,"wss":443};
})();
(function(){
Base64={};
Base64.encode=function(_46){
var _47=[];
var _48;
var _49;
var _4a;
while(_46.length){
switch(_46.length){
case 1:
_48=_46.shift();
_47.push(_4b[(_48>>2)&63]);
_47.push(_4b[((_48<<4)&48)]);
_47.push("=");
_47.push("=");
break;
case 2:
_48=_46.shift();
_49=_46.shift();
_47.push(_4b[(_48>>2)&63]);
_47.push(_4b[((_48<<4)&48)|((_49>>4)&15)]);
_47.push(_4b[(_49<<2)&60]);
_47.push("=");
break;
default:
_48=_46.shift();
_49=_46.shift();
_4a=_46.shift();
_47.push(_4b[(_48>>2)&63]);
_47.push(_4b[((_48<<4)&48)|((_49>>4)&15)]);
_47.push(_4b[((_49<<2)&60)|((_4a>>6)&3)]);
_47.push(_4b[_4a&63]);
break;
}
}
return _47.join("");
};
Base64.decode=function(_4c){
if(_4c.length===0){
return [];
}
if(_4c.length%4!==0){
throw new Error("Invalid base64 string (must be quads)");
}
var _4d=[];
for(var i=0;i<_4c.length;i+=4){
var _4f=_4c.charAt(i);
var _50=_4c.charAt(i+1);
var _51=_4c.charAt(i+2);
var _52=_4c.charAt(i+3);
var _53=_54[_4f];
var _55=_54[_50];
var _56=_54[_51];
var _57=_54[_52];
_4d.push(((_53<<2)&252)|((_55>>4)&3));
if(_51!="="){
_4d.push(((_55<<4)&240)|((_56>>2)&15));
if(_52!="="){
_4d.push(((_56<<6)&192)|(_57&63));
}
}
}
return _4d;
};
var _4b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var _54={"=":0};
for(var i=0;i<_4b.length;i++){
_54[_4b[i]]=i;
}
if(typeof (window.btoa)==="undefined"){
window.btoa=function(s){
var _5a=s.split("");
for(var i=0;i<_5a.length;i++){
_5a[i]=(_5a[i]).charCodeAt();
}
return Base64.encode(_5a);
};
window.atob=function(_5c){
var _5d=Base64.decode(_5c);
for(var i=0;i<_5d.length;i++){
_5d[i]=String.fromCharCode(_5d[i]);
}
return _5d.join("");
};
}
})();
var postMessage0=(function(){
var _5f=new URI((browser=="ie")?document.URL:location.href);
var _60={"http":80,"https":443};
if(_5f.port==null){
_5f.port=_60[_5f.scheme];
_5f.authority=_5f.host+":"+_5f.port;
}
var _61=_5f.scheme+"://"+_5f.authority;
var _62="/.kr";
if(typeof (postMessage)!=="undefined"){
return function(_63,_64,_65){
if(typeof (_64)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
switch(browser){
case "ie":
case "opera":
case "firefox":
setTimeout(function(){
_63.postMessage(_64,_65);
},0);
break;
default:
_63.postMessage(_64,_65);
break;
}
};
}else{
function MessagePipe(_66){
this.sourceToken=toPaddedHex(Math.floor(Math.random()*(Math.pow(2,32)-1)),8);
this.iframe=_66;
this.bridged=false;
this.lastWrite=0;
this.lastRead=0;
this.lastReadIndex=2;
this.lastSyn=0;
this.lastAck=0;
this.queue=[];
this.escapedFragments=[];
};
var _67=MessagePipe.prototype;
_67.attach=function(_68,_69,_6a,_6b,_6c,_6d){
this.target=_68;
this.targetOrigin=_69;
this.targetToken=_6a;
this.reader=_6b;
this.writer=_6c;
this.writerURL=_6d;
try{
this._lastHash=_6b.location.hash;
this.poll=pollLocationHash;
}
catch(permissionDenied){
this._lastDocumentURL=_6b.document.URL;
this.poll=pollDocumentURL;
}
if(_68==parent){
dequeue(this,true);
}
};
_67.detach=function(){
this.poll=function(){
};
delete this.target;
delete this.targetOrigin;
delete this.reader;
delete this.lastFragment;
delete this.writer;
delete this.writerURL;
};
_67.poll=function(){
};
function pollLocationHash(){
var _6e=this.reader.location.hash;
if(this._lastHash!=_6e){
process(this,_6e.substring(1));
this._lastHash=_6e;
}
};
function pollDocumentURL(){
var _6f=this.reader.document.URL;
if(this._lastDocumentURL!=_6f){
var _70=_6f.indexOf("#");
if(_70!=-1){
process(this,_6f.substring(_70+1));
this._lastDocumentURL=_6f;
}
}
};
_67.post=function(_71,_72,_73){
bridgeIfNecessary(this,_71);
var _74=1000;
var _75=escape(_72);
var _76=[];
while(_75.length>_74){
var _77=_75.substring(0,_74);
_75=_75.substring(_74);
_76.push(_77);
}
_76.push(_75);
this.queue.push([_73,_76]);
if(this.writer!=null&&this.lastAck>=this.lastSyn){
dequeue(this,false);
}
};
function bridgeIfNecessary(_78,_79){
if(_78.lastWrite<1&&!_78.bridged){
if(_79.parent==window){
var src=_78.iframe.src;
var _7b=src.split("#");
var _7c=null;
var _7d=document.getElementsByTagName("meta");
for(var i=0;i<_7d.length;i++){
if(_7d[i].name=="kaazing:resources"){
alert("kaazing:resources is no longer supported. Please refer to the Administrator's Guide section entitled \"Configuring a Web Server to Integrate with Kaazing Gateway\"");
}
}
var _7f=_61;
var _80=_7f.toString()+_62+"?.kr=xsp&.kv=10.05";
if(_7c){
var _81=new URI(_7f.toString());
var _7b=_7c.split(":");
_81.host=_7b.shift();
if(_7b.length){
_81.port=_7b.shift();
}
_80=_81.toString()+_62+"?.kr=xsp&.kv=10.05";
}
for(var i=0;i<_7d.length;i++){
if(_7d[i].name=="kaazing:postMessageBridgeURL"){
var _82=_7d[i].content;
var _83=new URI(_82);
var _84=new URI(location.toString());
if(!_83.authority){
_83.host=_84.host;
_83.port=_84.port;
_83.scheme=_84.scheme;
if(_82.indexOf("/")!=0){
var _85=_84.path.split("/");
_85.pop();
_85.push(_82);
_83.path=_85.join("/");
}
}
postMessage0.BridgeURL=_83.toString();
}
}
if(postMessage0.BridgeURL){
_80=postMessage0.BridgeURL;
}
var _86=["I",_7f,_78.sourceToken,escape(_80)];
if(_7b.length>1){
var _87=_7b[1];
_86.push(escape(_87));
}
_7b[1]=_86.join("!");
setTimeout(function(){
_79.location.replace(_7b.join("#"));
},200);
_78.bridged=true;
}
}
};
function flush(_88,_89){
var _8a=_88.writerURL+"#"+_89;
_88.writer.location.replace(_8a);
};
function fromHex(_8b){
return parseInt(_8b,16);
};
function toPaddedHex(_8c,_8d){
var hex=_8c.toString(16);
var _8f=[];
_8d-=hex.length;
while(_8d-->0){
_8f.push("0");
}
_8f.push(hex);
return _8f.join("");
};
function dequeue(_90,_91){
var _92=_90.queue;
var _93=_90.lastRead;
if((_92.length>0||_91)&&_90.lastSyn>_90.lastAck){
var _94=_90.lastFrames;
var _95=_90.lastReadIndex;
if(fromHex(_94[_95])!=_93){
_94[_95]=toPaddedHex(_93,8);
flush(_90,_94.join(""));
}
}else{
if(_92.length>0){
var _96=_92.shift();
var _97=_96[0];
if(_97=="*"||_97==_90.targetOrigin){
_90.lastWrite++;
var _98=_96[1];
var _99=_98.shift();
var _9a=3;
var _94=[_90.targetToken,toPaddedHex(_90.lastWrite,8),toPaddedHex(_93,8),"F",toPaddedHex(_99.length,4),_99];
var _95=2;
if(_98.length>0){
_94[_9a]="f";
_90.queue.unshift(_96);
}
if(_90.resendAck){
var _9b=[_90.targetToken,toPaddedHex(_90.lastWrite-1,8),toPaddedHex(_93,8),"a"];
_94=_9b.concat(_94);
_95+=_9b.length;
}
flush(_90,_94.join(""));
_90.lastFrames=_94;
_90.lastReadIndex=_95;
_90.lastSyn=_90.lastWrite;
_90.resendAck=false;
}
}else{
if(_91){
_90.lastWrite++;
var _94=[_90.targetToken,toPaddedHex(_90.lastWrite,8),toPaddedHex(_93,8),"a"];
var _95=2;
if(_90.resendAck){
var _9b=[_90.targetToken,toPaddedHex(_90.lastWrite-1,8),toPaddedHex(_93,8),"a"];
_94=_9b.concat(_94);
_95+=_9b.length;
}
flush(_90,_94.join(""));
_90.lastFrames=_94;
_90.lastReadIndex=_95;
_90.resendAck=true;
}
}
}
};
function process(_9c,_9d){
var _9e=_9d.substring(0,8);
var _9f=fromHex(_9d.substring(8,16));
var _a0=fromHex(_9d.substring(16,24));
var _a1=_9d.charAt(24);
if(_9e!=_9c.sourceToken){
throw new Error("postMessage emulation tampering detected");
}
var _a2=_9c.lastRead;
var _a3=_a2+1;
if(_9f==_a3){
_9c.lastRead=_a3;
}
if(_9f==_a3||_9f==_a2){
_9c.lastAck=_a0;
}
if(_9f==_a3||(_9f==_a2&&_a1=="a")){
switch(_a1){
case "f":
var _a4=_9d.substr(29,fromHex(_9d.substring(25,29)));
_9c.escapedFragments.push(_a4);
dequeue(_9c,true);
break;
case "F":
var _a5=_9d.substr(29,fromHex(_9d.substring(25,29)));
if(_9c.escapedFragments!==undefined){
_9c.escapedFragments.push(_a5);
_a5=_9c.escapedFragments.join("");
_9c.escapedFragments=[];
}
var _a6=unescape(_a5);
dispatch(_a6,_9c.target,_9c.targetOrigin);
dequeue(_9c,true);
break;
case "a":
if(_9d.length>25){
process(_9c,_9d.substring(25));
}else{
dequeue(_9c,false);
}
break;
default:
throw new Error("unknown postMessage emulation payload type: "+_a1);
}
}
};
function dispatch(_a7,_a8,_a9){
var _aa=document.createEvent("Events");
_aa.initEvent("message",false,true);
_aa.data=_a7;
_aa.origin=_a9;
_aa.source=_a8;
dispatchEvent(_aa);
};
var _ab={};
var _ac=[];
function pollReaders(){
for(var i=0,len=_ac.length;i<len;i++){
var _af=_ac[i];
_af.poll();
}
setTimeout(pollReaders,20);
};
function findMessagePipe(_b0){
if(_b0==parent){
return _ab["parent"];
}else{
if(_b0.parent==window){
var _b1=document.getElementsByTagName("iframe");
for(var i=0;i<_b1.length;i++){
var _b3=_b1[i];
if(_b0==_b3.contentWindow){
return supplyIFrameMessagePipe(_b3);
}
}
}else{
throw new Error("Generic peer postMessage not yet implemented");
}
}
};
function supplyIFrameMessagePipe(_b4){
var _b5=_b4._name;
if(_b5===undefined){
_b5="iframe$"+String(Math.random()).substring(2);
_b4._name=_b5;
}
var _b6=_ab[_b5];
if(_b6===undefined){
_b6=new MessagePipe(_b4);
_ab[_b5]=_b6;
}
return _b6;
};
function postMessage0(_b7,_b8,_b9){
if(typeof (_b8)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_b7==window){
if(_b9=="*"||_b9==_61){
dispatch(_b8,window,_61);
}
}else{
var _ba=findMessagePipe(_b7);
_ba.post(_b7,_b8,_b9);
}
};
postMessage0.attach=function(_bb,_bc,_bd,_be,_bf,_c0){
var _c1=findMessagePipe(_bb);
_c1.attach(_bb,_bc,_bd,_be,_bf,_c0);
_ac.push(_c1);
};
var _c2=function(_c3){
var _c4=new URI((browser=="ie")?document.URL:location.href);
var _c5;
var _c6={"http":80,"https":443};
if(_c4.port==null){
_c4.port=_c6[_c4.scheme];
_c4.authority=_c4.host+":"+_c4.port;
}
var _c7=unescape(_c4.fragment||"");
if(_c7.length>0){
var _c8=_c7.split(",");
var _c9=_c8.shift();
var _ca=_c8.shift();
var _cb=_c8.shift();
var _cc=_c4.scheme+"://"+document.domain+":"+_c4.port;
var _cd=_c4.scheme+"://"+_c4.authority;
var _ce=_c9+"/.kr?.kr=xsc&.kv=10.05";
var _cf=document.location.toString().split("#")[0];
var _d0=_ce+"#"+escape([_cc,_ca,escape(_cf)].join(","));
if(typeof (ActiveXObject)!="undefined"){
_c5=new ActiveXObject("htmlfile");
_c5.open();
try{
_c5.parentWindow.opener=window;
}
catch(domainError){
if(_c3){
_c5.domain=_c3;
}
_c5.parentWindow.opener=window;
}
_c5.write("<html>");
_c5.write("<body>");
if(_c3){
_c5.write("<script>CollectGarbage();document.domain='"+_c3+"';</"+"script>");
}
_c5.write("<iframe src=\""+_ce+"\"></iframe>");
_c5.write("</body>");
_c5.write("</html>");
_c5.close();
var _d1=_c5.body.lastChild;
var _d2=_c5.parentWindow;
var _d3=parent;
var _d4=_d3.parent.postMessage0;
if(typeof (_d4)!="undefined"){
_d1.onload=function(){
var _d5=_d1.contentWindow;
_d5.location.replace(_d0);
_d4.attach(_d3,_c9,_cb,_d2,_d5,_ce);
};
}
}else{
var _d1=document.createElement("iframe");
_d1.src=_d0;
document.body.appendChild(_d1);
var _d2=window;
var _d6=_d1.contentWindow;
var _d3=parent;
var _d4=_d3.parent.postMessage0;
if(typeof (_d4)!="undefined"){
_d4.attach(_d3,_c9,_cb,_d2,_d6,_ce);
}
}
}
window.onunload=function(){
try{
var _d7=window.parent.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d7.detach(_d3);
}
}
catch(permissionDenied){
}
if(typeof (_c5)!=="undefined"){
_c5.parentWindow.opener=null;
_c5.open();
_c5.close();
_c5=null;
CollectGarbage();
}
};
};
postMessage0.__init__=function(_d8,_d9){
var _da=_c2.toString();
_d8.URI=URI;
_d8.browser=browser;
if(!_d9){
_d9="";
}
_d8.setTimeout("("+_da+")('"+_d9+"')",0);
};
postMessage0.bridgeURL=false;
postMessage0.detach=function(_db){
var _dc=findMessagePipe(_db);
for(var i=0;i<_ac.length;i++){
if(_ac[i]==_dc){
_ac.splice(i,1);
}
}
_dc.detach();
};
if(window!=top){
_ab["parent"]=new MessagePipe();
function initializeAsTargetIfNecessary(){
var _de=new URI((browser=="ie")?document.URL:location.href);
var _df=_de.fragment||"";
if(document.body!=null&&_df.length>0&&_df.charAt(0)=="I"){
var _e0=unescape(_df);
var _e1=_e0.split("!");
if(_e1.shift()=="I"){
var _e2=_e1.shift();
var _e3=_e1.shift();
var _e4=unescape(_e1.shift());
var _e5=_61;
if(_e2==_e5){
try{
parent.location.hash;
}
catch(permissionDenied){
document.domain=document.domain;
}
}
var _e6=_e1.shift()||"";
switch(browser){
case "firefox":
location.replace([location.href.split("#")[0],_e6].join("#"));
break;
default:
location.hash=_e6;
break;
}
var _e7=findMessagePipe(parent);
_e7.targetToken=_e3;
var _e8=_e7.sourceToken;
var _e9=_e4+"#"+escape([_e5,_e3,_e8].join(","));
var _ea;
_ea=document.createElement("iframe");
_ea.src=_e9;
_ea.style.position="absolute";
_ea.style.left="-10px";
_ea.style.top="10px";
_ea.style.visibility="hidden";
_ea.style.width="0px";
_ea.style.height="0px";
document.body.appendChild(_ea);
return;
}
}
setTimeout(initializeAsTargetIfNecessary,20);
};
initializeAsTargetIfNecessary();
}
var _eb=document.getElementsByTagName("meta");
for(var i=0;i<_eb.length;i++){
if(_eb[i].name==="kaazing:postMessage"){
if("immediate"==_eb[i].content){
var _ed=function(){
var _ee=document.getElementsByTagName("iframe");
for(var i=0;i<_ee.length;i++){
var _f0=_ee[i];
if(_f0.style["KaaPostMessage"]=="immediate"){
_f0.style["KaaPostMessage"]="none";
var _f1=supplyIFrameMessagePipe(_f0);
bridgeIfNecessary(_f1,_f0.contentWindow);
}
}
setTimeout(_ed,20);
};
setTimeout(_ed,20);
}
break;
}
}
for(var i=0;i<_eb.length;i++){
if(_eb[i].name==="kaazing:postMessagePrefix"){
var _f2=_eb[i].content;
if(_f2!=null&&_f2.length>0){
if(_f2.charAt(0)!="/"){
_f2="/"+_f2;
}
_62=_f2;
}
}
}
setTimeout(pollReaders,20);
return postMessage0;
}
})();
var XMLHttpRequest0=(function(){
var _f3=new URI((browser=="ie")?document.URL:location.href);
var _f4={"http":80,"https":443};
if(_f3.port==null){
_f3.port=_f4[_f3.scheme];
_f3.authority=_f3.host+":"+_f3.port;
}
var _f5={};
var _f6={};
var _f7=0;
function XMLHttpRequest0(){
if(browser=="firefox"&&typeof (Object.getPrototypeOf)=="function"){
var xhr=new XMLHttpRequest();
xhr.withCredentials=true;
return xhr;
}
};
var _f9=XMLHttpRequest0.prototype;
_f9.readyState=0;
_f9.responseText="";
_f9.status=0;
_f9.statusText="";
_f9.timeout=0;
_f9.onreadystatechange;
_f9.onerror;
_f9.onload;
_f9.onprogress;
_f9.open=function(_fa,_fb,_fc){
if(!_fc){
throw new Error("Asynchronous is required for cross-origin XMLHttpRequest emulation");
}
switch(this.readyState){
case 0:
case 4:
break;
default:
throw new Error("Invalid ready state");
}
if(_fb.indexOf(".kv=")==-1){
_fb+=((_fb.indexOf("?")==-1)?"?":"&")+".kv=10.05";
}else{
_fb=_fb.replace(/\.kv=[^&]*(.*)/,".kv=10.05$1");
}
var id=register(this);
var _fe=supplyPipe(this,_fb);
_fe.attach(id);
this._pipe=_fe;
this._requestHeaders=[];
this._method=_fa;
this._location=_fb;
this._responseHeaders=null;
this.readyState=1;
this.status=0;
this.statusText="";
this.responseText="";
var _ff=this;
setTimeout(function(){
_ff.readyState=1;
onreadystatechange(_ff);
},0);
};
_f9.setRequestHeader=function(_100,_101){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
this._requestHeaders.push([_100,_101]);
};
_f9.send=function(_102){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
var _103=this;
setTimeout(function(){
_103.readyState=2;
onreadystatechange(_103);
},0);
doSend(this,_102);
};
_f9.abort=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
};
_f9.getResponseHeader=function(_105){
if(this.status==0){
throw new Error("Invalid ready state");
}
var _106=this._responseHeaders;
return _106[_105];
};
_f9.getAllResponseHeaders=function(){
if(this.status==0){
throw new Error("Invalid ready state");
}
return null;
};
function onreadystatechange(_107){
if(typeof (_107.onreadystatechange)!=="undefined"){
_107.onreadystatechange();
}
switch(_107.readyState){
case 3:
if(typeof (_107.onprogress)!=="undefined"){
_107.onprogress();
}
break;
case 4:
switch(Math.floor(_107.status/100)){
case 0:
case 5:
if(typeof (_107.onerror)!=="undefined"){
_107.onerror();
}
break;
default:
if(typeof (_107.onprogress)!=="undefined"){
_107.onprogress();
}
if(typeof (_107.onload)!=="undefined"){
_107.onload();
}
break;
}
break;
}
};
function register(_108){
var id=toPaddedHex(_f7++,8);
_f6[id]=_108;
_108._id=id;
return id;
};
function doSend(_10a,_10b){
if(typeof (_10b)!=="string"){
_10b="";
}
var _10c=_10a._method.substring(0,10);
var _10d=_10a._location;
var _10e=_10a._requestHeaders;
var _10f=toPaddedHex(_10a.timeout,4);
var _110=(_10a.onprogress!==undefined)?"t":"f";
var _111=["s",_10a._id,_10c.length,_10c,toPaddedHex(_10d.length,4),_10d,toPaddedHex(_10e.length,4)];
for(var i=0;i<_10e.length;i++){
var _113=_10e[i];
_111.push(toPaddedHex(_113[0].length,4));
_111.push(_113[0]);
_111.push(toPaddedHex(_113[1].length,4));
_111.push(_113[1]);
}
_111.push(toPaddedHex(_10b.length,8),_10b,toPaddedHex(_10f,4),_110);
_10a._pipe.post(_111.join(""));
};
function supplyPipe(_114,_115){
var uri=new URI(_115);
var _117=(uri.scheme!=null&&uri.authority!=null);
var _118=_117?uri.scheme:_f3.scheme;
var _119=_117?uri.authority:_f3.authority;
if(_119!=null&&uri.port==null){
_119=uri.host+":"+_f4[_118];
}
var _11a=_118+"://"+_119;
var pipe=_f5[_11a];
if(pipe!==undefined){
if(!("iframe" in pipe&&"contentWindow" in pipe.iframe&&typeof pipe.iframe.contentWindow=="object")){
pipe=_f5[_11a]=undefined;
}
}
if(pipe===undefined){
var _11c=document.createElement("iframe");
_11c.style.position="absolute";
_11c.style.left="-10px";
_11c.style.top="10px";
_11c.style.visibility="hidden";
_11c.style.width="0px";
_11c.style.height="0px";
var _11d=new URI(_11a);
_11d.query=".kr=xs&.kv=10.05";
_11d.path="/";
_11c.src=_11d.toString();
function post(_11e){
this.buffer.push(_11e);
};
function attach(id){
var _120=this.attached[id];
if(_120===undefined){
_120={};
this.attached[id]=_120;
}
if(_120.timerID!==undefined){
clearTimeout(_120.timerID);
delete _120.timerID;
}
};
function detach(id){
var _122=this.attached[id];
if(_122!==undefined&&_122.timerID===undefined){
var _123=this;
_122.timerID=setTimeout(function(){
delete _123.attached[id];
var xhr=_f6[id];
if(xhr._pipe==pipe){
delete _f6[id];
delete xhr._id;
delete xhr._pipe;
}
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},10000);
}
};
pipe={"targetOrigin":_11a,"iframe":_11c,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_f5[_11a]=pipe;
function sendInitWhenReady(){
var _125=_11c.contentWindow;
if(!_125){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_125,"I",_11a);
}
};
pipe.handshakeID=setTimeout(function(){
_f5[_11a]=undefined;
pipe.post=function(_126){
_114.readyState=4;
_114.status=0;
onreadystatechange(_114);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_11c);
sendInitWhenReady();
}
return pipe;
};
function onmessage(_127){
var _128=_127.origin;
var _129={"http":":80","https":":443"};
var _12a=_128.split(":");
if(_12a.length===2){
_128+=_129[_12a[0]];
}
var pipe=_f5[_128];
if(pipe!==undefined&&pipe.iframe!==undefined&&_127.source==pipe.iframe.contentWindow){
if(_127.data=="I"){
clearTimeout(pipe.handshakeID);
var _12c;
while((_12c=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_12c,pipe.targetOrigin);
}
pipe.post=function(_12d){
postMessage0(pipe.iframe.contentWindow,_12d,pipe.targetOrigin);
};
}else{
var _12c=_127.data;
if(_12c.length>=9){
var _12e=0;
var type=_12c.substring(_12e,_12e+=1);
var id=_12c.substring(_12e,_12e+=8);
var _131=_f6[id];
if(_131!==undefined){
switch(type){
case "r":
var _132={};
var _133=fromHex(_12c.substring(_12e,_12e+=2));
for(var i=0;i<_133;i++){
var _135=fromHex(_12c.substring(_12e,_12e+=4));
var _136=_12c.substring(_12e,_12e+=_135);
var _137=fromHex(_12c.substring(_12e,_12e+=4));
var _138=_12c.substring(_12e,_12e+=_137);
_132[_136]=_138;
}
var _139=fromHex(_12c.substring(_12e,_12e+=4));
var _13a=fromHex(_12c.substring(_12e,_12e+=2));
var _13b=_12c.substring(_12e,_12e+=_13a);
switch(_139){
case 301:
case 302:
case 307:
var _13c=_132["Location"];
var id=register(_131);
var pipe=supplyPipe(_131,_13c);
pipe.attach(id);
_131._pipe=pipe;
_131._method="GET";
_131._location=_13c;
_131._redirect=true;
break;
default:
_131._responseHeaders=_132;
_131.status=_139;
_131.statusText=_13b;
break;
}
break;
case "p":
var _13d=parseInt(_12c.substring(_12e,_12e+=1));
if(_131._id===id){
_131.readyState=_13d;
var _13e=fromHex(_12c.substring(_12e,_12e+=8));
var _13f=_12c.substring(_12e,_12e+=_13e);
if(_13f.length>0){
_131.responseText+=_13f;
}
onreadystatechange(_131);
}else{
if(_131._redirect){
_131._redirect=false;
doSend(_131,"");
}
}
if(_13d==4){
pipe.detach(id);
}
break;
case "e":
if(_131._id===id){
_131.status=0;
_131.statusText="";
_131.readyState=4;
onreadystatechange(_131);
}
pipe.detach(id);
break;
case "t":
if(_131._id===id){
_131.status=0;
_131.statusText="";
_131.readyState=4;
if(typeof (_131.ontimeout)!=="undefined"){
_131.ontimeout();
}
}
pipe.detach(id);
break;
}
}
}
}
}else{
}
};
function fromHex(_140){
return parseInt(_140,16);
};
function toPaddedHex(_141,_142){
var hex=_141.toString(16);
var _144=[];
_142-=hex.length;
while(_142-->0){
_144.push("0");
}
_144.push(hex);
return _144.join("");
};
window.addEventListener("message",onmessage,false);
return XMLHttpRequest0;
})();
ByteOrder=function(){
};
(function(){
var _145=ByteOrder.prototype;
_145.toString=function(){
throw new Error("Abstract");
};
var _146=function(v){
return (v&255);
};
var _148=function(_149){
return (_149&128)?(_149|-256):_149;
};
var _14a=function(v){
return [((v>>8)&255),(v&255)];
};
var _14c=function(_14d,_14e){
return (_148(_14d)<<8)|(_14e&255);
};
var _14f=function(_150,_151){
return ((_150&255)<<8)|(_151&255);
};
var _152=function(_153,_154,_155){
return ((_153&255)<<16)|((_154&255)<<8)|(_155&255);
};
var _156=function(v){
return [((v>>16)&255),((v>>8)&255),(v&255)];
};
var _158=function(_159,_15a,_15b){
return ((_159&255)<<16)|((_15a&255)<<8)|(_15b&255);
};
var _15c=function(v){
return [((v>>24)&255),((v>>16)&255),((v>>8)&255),(v&255)];
};
var _15e=function(_15f,_160,_161,_162){
return (_148(_15f)<<24)|((_160&255)<<16)|((_161&255)<<8)|(_162&255);
};
var _163=function(_164,_165,_166,_167){
var _168=_14f(_164,_165);
var _169=_14f(_166,_167);
return (_168*65536+_169);
};
ByteOrder.BIG_ENDIAN=(function(){
var _16a=function(){
};
_16a.prototype=new ByteOrder();
var _16b=_16a.prototype;
_16b._toUnsignedByte=_146;
_16b._toByte=_148;
_16b._fromShort=_14a;
_16b._toShort=_14c;
_16b._toUnsignedShort=_14f;
_16b._toUnsignedMediumInt=_152;
_16b._fromMediumInt=_156;
_16b._toMediumInt=_158;
_16b._fromInt=_15c;
_16b._toInt=_15e;
_16b._toUnsignedInt=_163;
_16b.toString=function(){
return "<ByteOrder.BIG_ENDIAN>";
};
return new _16a();
})();
ByteOrder.LITTLE_ENDIAN=(function(){
var _16c=function(){
};
_16c.prototype=new ByteOrder();
var _16d=_16c.prototype;
_16d._toByte=_148;
_16d._toUnsignedByte=_146;
_16d._fromShort=function(v){
return _14a(v).reverse();
};
_16d._toShort=function(_16f,_170){
return _14c(_170,_16f);
};
_16d._toUnsignedShort=function(_171,_172){
return _14f(_172,_171);
};
_16d._toUnsignedMediumInt=function(_173,_174,_175){
return _152(_175,_174,_173);
};
_16d._fromMediumInt=function(v){
return _156(v).reverse();
};
_16d._toMediumInt=function(_177,_178,_179,_17a,_17b,_17c){
return _158(_17c,_17b,_17a,_179,_178,_177);
};
_16d._fromInt=function(v){
return _15c(v).reverse();
};
_16d._toInt=function(_17e,_17f,_180,_181){
return _15e(_181,_180,_17f,_17e);
};
_16d._toUnsignedInt=function(_182,_183,_184,_185){
return _163(_185,_184,_183,_182);
};
_16d.toString=function(){
return "<ByteOrder.LITTLE_ENDIAN>";
};
return new _16c();
})();
})();
function ByteBuffer(_186){
this.array=_186||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=ByteOrder.BIG_ENDIAN;
};
(function(){
ByteBuffer.allocate=function(_187){
var buf=new ByteBuffer();
buf.capacity=_187;
buf.limit=_187;
return buf;
};
ByteBuffer.wrap=function(_189){
return new ByteBuffer(_189);
};
var _18a=ByteBuffer.prototype;
_18a.autoExpand=true;
_18a.capacity=0;
_18a.position=0;
_18a.limit=0;
_18a.order=ByteOrder.BIG_ENDIAN;
_18a.array=[];
_18a.mark=function(){
this._mark=this.position;
return this;
};
_18a.reset=function(){
var m=this._mark;
if(m<0){
throw new Error("Invalid mark");
}
this.position=m;
return this;
};
_18a.compact=function(){
this.array.splice(0,this.position);
this.limit-=this.position;
this.position=0;
return this;
};
_18a.duplicate=function(){
var buf=new ByteBuffer(this.array);
buf.position=this.position;
buf.limit=this.limit;
buf.capacity=this.capacity;
return buf;
};
_18a.fill=function(size){
_autoExpand(this,size);
while(size-->0){
this.put(0);
}
return this;
};
_18a.fillWith=function(b,size){
_autoExpand(this,size);
while(size-->0){
this.put(b);
}
return this;
};
_18a.indexOf=function(b){
var _191=this.limit;
var _192=this.array;
for(var i=this.position;i<_191;i++){
if(_192[i]==b){
return i;
}
}
return -1;
};
_18a.put=function(v){
_autoExpand(this,1);
this.putAt(this.position++,v);
return this;
};
_18a.putAt=function(_195,v){
_checkForWriteAt(this,_195,1);
this.array[_195]=this.order._toUnsignedByte(v);
return this;
};
_18a.putUnsigned=function(v){
_autoExpand(this,1);
this.putUnsignedAt(this.position,v&255);
this.position+=1;
return this;
};
_18a.putUnsignedAt=function(_198,v){
_checkForWriteAt(this,_198,1);
this.putAt(_198,v&255);
return this;
};
_18a.putShort=function(v){
_autoExpand(this,2);
this.putShortAt(this.position,v);
this.position+=2;
return this;
};
_18a.putShortAt=function(_19b,v){
_checkForWriteAt(this,_19b,2);
this.putBytesAt(_19b,this.order._fromShort(v));
return this;
};
_18a.putUnsignedShort=function(v){
_autoExpand(this,2);
this.putUnsignedShortAt(this.position,v&65535);
this.position+=2;
return this;
};
_18a.putUnsignedShortAt=function(_19e,v){
_checkForWriteAt(this,_19e,2);
this.putShortAt(_19e,v&65535);
return this;
};
_18a.putMediumInt=function(v){
_autoExpand(this,3);
this.putMediumIntAt(this.position,v);
this.position+=3;
return this;
};
_18a.putMediumIntAt=function(_1a1,v){
this.putBytesAt(_1a1,this.order._fromMediumInt(v));
return this;
};
_18a.putInt=function(v){
_autoExpand(this,4);
this.putIntAt(this.position,v);
this.position+=4;
return this;
};
_18a.putIntAt=function(_1a4,v){
_checkForWriteAt(this,_1a4,4);
this.putBytesAt(_1a4,this.order._fromInt(v));
return this;
};
_18a.putUnsignedInt=function(v){
_autoExpand(this,4);
this.putUnsignedIntAt(this.position,v&4294967295);
this.position+=4;
return this;
};
_18a.putUnsignedIntAt=function(_1a7,v){
_checkForWriteAt(this,_1a7,4);
this.putIntAt(_1a7,v&4294967295);
return this;
};
_18a.putString=function(v,cs){
cs.encode(v,this);
return this;
};
_18a.putPrefixedString=function(_1ab,v,cs){
if(typeof (cs)==="undefined"||typeof (cs.encode)==="undefined"){
throw new Error("ByteBuffer.putPrefixedString: character set parameter missing");
}
if(_1ab===0){
return this;
}
_autoExpand(this,_1ab);
var len=v.length;
switch(_1ab){
case 1:
this.put(len);
break;
case 2:
this.putShort(len);
break;
case 4:
this.putInt(len);
break;
}
cs.encode(v,this);
return this;
};
_18a.putBytes=function(v){
_autoExpand(this,v.length);
this.putBytesAt(this.position,v);
this.position+=v.length;
return this;
};
_18a.putBytesAt=function(_1b0,v){
_checkForWriteAt(this,_1b0,v.length);
for(var j=0,k=_1b0,len=v.length;j<len;j++,k++){
this.putAt(k,v[j]);
}
return this;
};
_18a.putBuffer=function(v){
this.putBytes(v.array.slice(v.position,v.limit));
return this;
};
_18a.putBufferAt=function(_1b6,v){
this.putBytesAt(_1b6,v.array.slice(v.position,v.limit));
return this;
};
_18a.get=function(){
_checkForRead(this,1);
return this.getAt(this.position++);
};
_18a.getAt=function(_1b8){
_checkForReadAt(this,_1b8,1);
return this.order._toByte(this.array[_1b8]);
};
_18a.getUnsigned=function(){
_checkForRead(this,1);
var val=this.getUnsignedAt(this.position);
this.position+=1;
return val;
};
_18a.getUnsignedAt=function(_1ba){
_checkForReadAt(this,_1ba,1);
return this.order._toUnsignedByte(this.array[_1ba]);
};
_18a.getBytes=function(size){
_checkForRead(this,size);
var _1bc=new Array();
for(var i=0;i<size;i++){
_1bc.push(this.order._toByte(this.array[i+this.position]));
}
this.position+=size;
return _1bc;
};
_18a.getBytesAt=function(_1be,size){
_checkForReadAt(this,_1be,size);
var _1c0=new Array();
this.position=_1be;
for(var i=0;i<size;i++){
_1c0.push(this.order._toByte(this.array[i+this.position]));
}
this.position+=size;
return _1c0;
};
_18a.getShort=function(){
_checkForRead(this,2);
var val=this.getShortAt(this.position);
this.position+=2;
return val;
};
_18a.getShortAt=function(_1c3){
_checkForReadAt(this,_1c3,2);
var _1c4=this.array;
return this.order._toShort(_1c4[_1c3++],_1c4[_1c3++]);
};
_18a.getUnsignedShort=function(){
_checkForRead(this,2);
var val=this.getUnsignedShortAt(this.position);
this.position+=2;
return val;
};
_18a.getUnsignedShortAt=function(_1c6){
_checkForReadAt(this,_1c6,2);
var _1c7=this.array;
return this.order._toUnsignedShort(_1c7[_1c6++],_1c7[_1c6++]);
};
_18a.getUnsignedMediumInt=function(){
var _1c8=this.array;
return this.order._toUnsignedMediumInt(_1c8[this.position++],_1c8[this.position++],_1c8[this.position++]);
};
_18a.getMediumInt=function(){
var val=this.getMediumIntAt(this.position);
this.position+=3;
return val;
};
_18a.getMediumIntAt=function(i){
var _1cb=this.array;
return this.order._toMediumInt(_1cb[i++],_1cb[i++],_1cb[i++]);
};
_18a.getInt=function(){
_checkForRead(this,4);
var val=this.getIntAt(this.position);
this.position+=4;
return val;
};
_18a.getIntAt=function(_1cd){
_checkForReadAt(this,_1cd,4);
var _1ce=this.array;
return this.order._toInt(_1ce[_1cd++],_1ce[_1cd++],_1ce[_1cd++],_1ce[_1cd++]);
};
_18a.getUnsignedInt=function(){
_checkForRead(this,4);
var val=this.getUnsignedIntAt(this.position);
this.position+=4;
return val;
};
_18a.getUnsignedIntAt=function(_1d0){
_checkForReadAt(this,_1d0,4);
var _1d1=this.array;
return this.order._toUnsignedInt(_1d1[_1d0++],_1d1[_1d0++],_1d1[_1d0++],_1d1[_1d0++]);
return val;
};
_18a.getPrefixedString=function(_1d2,cs){
var len=0;
switch(_1d2||2){
case 1:
len=this.getUnsigned();
break;
case 2:
len=this.getUnsignedShort();
break;
case 4:
len=this.getInt();
break;
}
if(len===0){
return "";
}
var _1d5=this.limit;
try{
this.limit=this.position+len;
return cs.decode(this);
}
finally{
this.limit=_1d5;
}
};
_18a.getString=function(cs){
var _1d7=this.position;
var _1d8=this.limit;
var _1d9=this.array;
while(_1d7<_1d8&&_1d9[_1d7]!==0){
_1d7++;
}
try{
this.limit=_1d7;
return cs.decode(this);
}
finally{
if(_1d7!=_1d8){
this.limit=_1d8;
this.position=_1d7+1;
}
}
};
_18a.slice=function(){
return new ByteBuffer(this.array.slice(this.position,this.limit));
};
_18a.flip=function(){
this.limit=this.position;
this.position=0;
this._mark=-1;
return this;
};
_18a.rewind=function(){
this.position=0;
this._mark=-1;
return this;
};
_18a.clear=function(){
this.position=0;
this.limit=this.capacity;
this._mark=-1;
return this;
};
_18a.remaining=function(){
return (this.limit-this.position);
};
_18a.hasRemaining=function(){
return (this.limit>this.position);
};
_18a.skip=function(size){
this.position+=size;
return this;
};
_18a.getHexDump=function(){
var _1db=this.array;
var pos=this.position;
var _1dd=this.limit;
if(pos==_1dd){
return "empty";
}
var _1de=[];
for(var i=pos;i<_1dd;i++){
var hex=(_1db[i]||0).toString(16);
if(hex.length==1){
hex="0"+hex;
}
_1de.push(hex);
}
return _1de.join(" ");
};
_18a.toString=_18a.getHexDump;
_18a.expand=function(_1e1){
return this.expandAt(this.position,_1e1);
};
_18a.expandAt=function(i,_1e3){
var end=i+_1e3;
if(end>this.capacity){
this.capacity=end;
}
if(end>this.limit){
this.limit=end;
}
return this;
};
function _autoExpand(_1e5,_1e6){
if(_1e5.autoExpand){
_1e5.expand(_1e6);
}
return _1e5;
};
function _checkForRead(_1e7,_1e8){
var end=_1e7.position+_1e8;
if(end>_1e7.limit){
throw new Error("Buffer underflow");
}
return _1e7;
};
function _checkForReadAt(_1ea,_1eb,_1ec){
var end=_1eb+_1ec;
if(_1eb<0||end>_1ea.limit){
throw new Error("Index out of bounds");
}
return _1ea;
};
function _checkForWriteAt(_1ee,_1ef,_1f0){
var end=_1ef+_1f0;
if(_1ef<0||end>_1ee.limit){
throw new Error("Index out of bounds");
}
return _1ee;
};
})();
function Charset(){
};
(function(){
var _1f2=Charset.prototype;
_1f2.decode=function(buf){
};
_1f2.encode=function(text){
};
Charset.UTF8=(function(){
function UTF8(){
};
UTF8.prototype=new Charset();
var _1f5=UTF8.prototype;
_1f5.decode=function(buf){
var _1f7=[];
while(buf.hasRemaining()){
var _1f8=buf.remaining();
var _1f9=buf.getUnsigned();
var _1fa=charByteCount(_1f9);
if(_1f8<_1fa){
buf.skip(-1);
break;
}
var _1fb=null;
switch(_1fa){
case 1:
_1fb=_1f9;
break;
case 2:
_1fb=((_1f9&31)<<6)|(buf.getUnsigned()&63);
break;
case 3:
_1fb=((_1f9&15)<<12)|((buf.getUnsigned()&63)<<6)|(buf.getUnsigned()&63);
break;
case 4:
_1fb=((_1f9&7)<<18)|((buf.getUnsigned()&63)<<12)|((buf.getUnsigned()&63)<<6)|(buf.getUnsigned()&63);
break;
}
_1f7.push(_1fb);
}
return String.fromCharCode.apply(null,_1f7);
};
_1f5.encode=function(str,buf){
for(var i=0;i<str.length;i++){
var _1ff=str.charCodeAt(i);
if(_1ff<128){
buf.put(_1ff);
}else{
if(_1ff<2048){
buf.put((_1ff>>6)|192);
buf.put((_1ff&63)|128);
}else{
if(_1ff<65536){
buf.put((_1ff>>12)|224);
buf.put(((_1ff>>6)&63)|128);
buf.put((_1ff&63)|128);
}else{
if(_1ff<1114112){
buf.put((_1ff>>18)|240);
buf.put(((_1ff>>12)&63)|128);
buf.put(((_1ff>>6)&63)|128);
buf.put((_1ff&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
};
function charByteCount(b){
if((b&128)===0){
return 1;
}
if((b&32)===0){
return 2;
}
if((b&16)===0){
return 3;
}
if((b&8)===0){
return 4;
}
throw new Error("Invalid UTF-8 bytes");
};
return new UTF8();
})();
})();
(function(){
var _201="AmqpClient";
var _202=function(name){
this._name=name;
this._level=_202.Level.INFO;
};
(function(){
_202.Level={OFF:8,SEVERE:7,WARNING:6,INFO:5,CONFIG:4,FINE:3,FINER:2,FINEST:1,ALL:0};
var _204;
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:logging"){
_204=tags[i].content;
break;
}
}
_202._logConf={};
if(_204){
var _207=_204.split(",");
for(var i=0;i<_207.length;i++){
var _208=_207[i].split("=");
_202._logConf[_208[0]]=_208[1];
}
}
var _209={};
_202.getLogger=function(name){
var _20b=_209[name];
if(_20b===undefined){
_20b=new _202(name);
_209[name]=_20b;
}
return _20b;
};
var _20c=_202.prototype;
_20c.setLevel=function(_20d){
if(_20d&&_20d>=_202.Level.ALL&&_20d<=_202.Level.OFF){
this._level=_20d;
}
};
_20c.isLoggable=function(_20e){
for(var _20f in _202._logConf){
if(this._name.match(_20f)){
var _210=_202._logConf[_20f];
if(_210){
return (_202.Level[_210]<=_20e);
}
}
}
return (this._level<=_20e);
};
var noop=function(){
};
var _212={};
_212[_202.Level.OFF]=noop;
_212[_202.Level.SEVERE]=(window.console)?(console.error||console.log||noop):noop;
_212[_202.Level.WARNING]=(window.console)?(console.warn||console.log||noop):noop;
_212[_202.Level.INFO]=(window.console)?(console.info||console.log||noop):noop;
_212[_202.Level.CONFIG]=(window.console)?(console.info||console.log||noop):noop;
_212[_202.Level.FINE]=(window.console)?(console.debug||console.log||noop):noop;
_212[_202.Level.FINER]=(window.console)?(console.debug||console.log||noop):noop;
_212[_202.Level.FINEST]=(window.console)?(console.debug||console.log||noop):noop;
_212[_202.Level.ALL]=(window.console)?(console.log||noop):noop;
_20c.config=function(_213,_214){
this.log(_202.Level.CONFIG,_213,_214);
};
_20c.entering=function(_215,name,_217){
if(this.isLoggable(_202.Level.FINER)){
if(browser=="chrome"||browser=="safari"){
_215=console;
}
var _218=_212[_202.Level.FINER];
if(_217){
if(typeof (_218)=="object"){
_218("ENTRY "+name,_217);
}else{
_218.call(_215,"ENTRY "+name,_217);
}
}else{
if(typeof (_218)=="object"){
_218("ENTRY "+name);
}else{
_218.call(_215,"ENTRY "+name);
}
}
}
};
_20c.exiting=function(_219,name,_21b){
if(this.isLoggable(_202.Level.FINER)){
var _21c=_212[_202.Level.FINER];
if(browser=="chrome"||browser=="safari"){
_219=console;
}
if(_21b){
if(typeof (_21c)=="object"){
_21c("RETURN "+name,_21b);
}else{
_21c.call(_219,"RETURN "+name,_21b);
}
}else{
if(typeof (_21c)=="object"){
_21c("RETURN "+name);
}else{
_21c.call(_219,"RETURN "+name);
}
}
}
};
_20c.fine=function(_21d,_21e){
this.log(_202.Level.FINE,_21d,_21e);
};
_20c.finer=function(_21f,_220){
this.log(_202.Level.FINER,_21f,_220);
};
_20c.finest=function(_221,_222){
this.log(_202.Level.FINEST,_221,_222);
};
_20c.info=function(_223,_224){
this.log(_202.Level.INFO,_223,_224);
};
_20c.log=function(_225,_226,_227){
if(this.isLoggable(_225)){
var _228=_212[_225];
if(browser=="chrome"||browser=="safari"){
_226=console;
}
if(typeof (_228)=="object"){
_228(_227);
}else{
_228.call(_226,_227);
}
}
};
_20c.severe=function(_229,_22a){
this.log(_202.Level.SEVERE,_229,_22a);
};
_20c.warning=function(_22b,_22c){
this.log(_202.Level.WARNING,_22b,_22c);
};
})();
var _22d=function(key){
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
return v;
}
}
};
var _232=function(_233){
var _234=[];
for(var i=0;i<_233.length;i++){
_234.push(_233[i]);
}
return _234;
};
var _236=function(_237,_238){
var _239=[];
for(var i=0;i<_237.length;i++){
var elt=_237[i];
if(_238(elt)){
_239.push(_237[i]);
}
}
return _239;
};
var _23c=function(_23d,_23e){
for(var i=0;i<_23d.length;i++){
if(_23d[i]==_23e){
return i;
}
}
return -1;
};
var _240=function(s){
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=buf.getString(Charset.UTF8);
return v;
};
var _246=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _248="\n";
var _249=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _246:
a.push(_246);
a.push(_246);
break;
case NULL:
a.push(_246);
a.push("0");
break;
case _248:
a.push(_246);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
return v;
};
var _24f=function(buf,_251){
if(_251){
return _249(buf);
}else{
var _252=[];
while(buf.remaining()){
var n=buf.getUnsigned();
_252.push(String.fromCharCode(n));
}
var _254=_252.join("");
return _254;
}
};
var _255=window.WebSocket;
var _256=function(_257,_258){
if(typeof (_255)==="undefined"){
doError(this);
return;
}
if(_257.indexOf("javascript:")==0){
_257=_257.substr("javascript:".length);
}
var _259=_257.indexOf("?");
if(_259!=-1){
_257+="&.kl=Y";
}else{
_257+="?.kl=Y";
}
this._balanced=false;
this._sendQueue=[];
try{
if(_258){
this._delegate=new _255(_257,_258);
}else{
this._delegate=new _255(_257);
}
}
catch(e){
doError(this);
return;
}
bindHandlers(this);
};
var _25a=_256.prototype;
_25a.onerror=function(){
};
_25a.onmessage=function(){
};
_25a.onopen=function(){
};
_25a.onclose=function(){
};
_25a.close=function(){
this._delegate.close();
};
_25a.send=function(_25b){
if(this._balanced==true){
doSend(this,_25b);
}else{
this._sendQueue.push(_25b);
}
};
function doSend(_25c,_25d){
if(typeof (_25d)=="string"){
_25c._delegate.send(_25d);
}else{
if(_25d.constructor==ByteBuffer){
var _25e=_24f(_25d);
_25c._delegate.send(_25e);
}else{
throw new Error("Cannot call send() with that type");
}
}
};
function doError(_25f,e){
setTimeout(function(){
if(_25f.onerror){
_25f.onerror(e);
}
},0);
};
function messageHandler(_261,e){
if(_261._balanced==true){
_261.onmessage(e);
}else{
if(e.data.match("^\uf0ff")=="\uf0ff"){
var rest=e.data.substring(1);
if(rest.match("^R")=="R"){
var _264=rest.substring(1);
if(_264&&_264!=""){
var _265=_264.indexOf("?");
if(_265!=-1){
_264+="&.kl=Y";
}else{
_264+="?.kl=Y";
}
unbindHandlers(_261);
_261.close();
_261._delegate=new _255(_264);
bindHandlers(_261);
}else{
_261.close();
}
}else{
if(rest.match("^N$")=="N"){
_261._balanced=true;
var _266;
while(_266=_261._sendQueue.shift()){
doSend(_261,_266);
}
}else{
_261._balanced=true;
_261.onmessage(e);
}
}
}else{
_261._balanced=true;
_261.onmessage(e);
}
}
};
function closeHandler(_267,e){
_267.onclose(e);
};
function errorHandler(_269,e){
_269.onerror(e);
};
function openHandler(_26b,e){
_26b.onopen(e);
};
function bindHandlers(_26d){
var _26e=_26d._delegate;
_26e.onopen=function(e){
openHandler(_26d,e);
};
_26e.onmessage=function(e){
messageHandler(_26d,e);
};
_26e.onclose=function(e){
closeHandler(_26d,e);
};
_26e.onerror=function(e){
errorHandler(_26d,e);
};
};
function unbindHandlers(_273){
var _274=_273._delegate;
_274.onmessage=undefined;
_274.onclose=undefined;
_274.onopen=undefined;
_274.onerror=undefined;
};
var _275=function(_276,_277){
var _278;
if(_276.indexOf("?")==-1){
_278="?";
}else{
_278="&";
}
_276=_276+_278+"encoding=utf8";
return new _256(_276,_277);
};
var _279=(function(){
var _27a=function(_27b){
this.URL=_27b;
var _27c=this;
try{
_27d(_27c,_27b);
}
catch(e){
doError(_27c,e);
}
this.constructor=_27a;
};
var _27e=_27a.prototype;
_27a._flashBridge={};
_27a._flashBridge.readyWaitQueue=[];
_27a._flashBridge.failWaitQueue=[];
_27a._flashBridge.flashHasLoaded=false;
_27a._flashBridge.flashHasFailed=false;
_27e.URL="";
_27e.readyState=0;
_27e.bufferedAmount=0;
_27e.onopen=function(){
};
_27e.onmessage=function(_27f){
};
_27e.onclose=function(){
};
_27e.onerror=function(){
};
_27e.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_27a._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _281;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _281=a.join("");
_27a._flashBridge.sendByteString(this._instanceId,_281);
return;
}else{
throw new Error("Invalid type");
}
}
_284(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_27e.close=function(){
switch(this.readyState){
case 1:
case 2:
_27a._flashBridge.disconnect(this._instanceId);
break;
}
};
_27e.disconnect=_27e.close;
var _284=function(_285){
_285.bufferedAmount=_27a._flashBridge.getBufferedAmount(_285._instanceId);
if(_285.bufferedAmount!=0){
setTimeout(function(){
_284(_285);
},1000);
}
};
var _27d=function(_286,_287){
var _288=function(key,_28a){
_28a[key]=_286;
_286._instanceId=key;
};
var _28b=function(){
doError(_286);
};
_27a._flashBridge.registerWebSocketEmulated(_287,_288,_28b);
};
function doError(_28c,e){
setTimeout(function(){
if(_28c.onerror){
_28c.onerror(e);
}
},0);
};
return _27a;
})();
var _28e=(function(){
var _28f=function(_290){
this.URL=_290;
var _291=this;
try{
_292(_291,_290);
}
catch(e){
doError(_291,e);
}
this.constructor=_28f;
};
var _293=_28f.prototype;
_279._flashBridge={};
_279._flashBridge.readyWaitQueue=[];
_279._flashBridge.failWaitQueue=[];
_279._flashBridge.flashHasLoaded=false;
_279._flashBridge.flashHasFailed=false;
_293.URL="";
_293.readyState=0;
_293.bufferedAmount=0;
_293.onopen=function(){
};
_293.onmessage=function(_294){
};
_293.onclose=function(){
};
_293.onerror=function(){
};
_293.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_279._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _296;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _296=a.join("");
_279._flashBridge.sendByteString(this._instanceId,_296);
return;
}else{
throw new Error("Invalid type");
}
}
_299(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_293.close=function(){
switch(this.readyState){
case 1:
case 2:
_279._flashBridge.disconnect(this._instanceId);
break;
}
};
_293.disconnect=_293.close;
var _299=function(_29a){
_29a.bufferedAmount=_279._flashBridge.getBufferedAmount(_29a._instanceId);
if(_29a.bufferedAmount!=0){
setTimeout(function(){
_299(_29a);
},1000);
}
};
var _292=function(_29b,_29c){
var _29d=function(key,_29f){
_29f[key]=_29b;
_29b._instanceId=key;
};
var _2a0=function(){
doError(_29b);
};
_279._flashBridge.registerWebSocketRtmp(_29c,_29d,_2a0);
};
function doError(_2a1,e){
setTimeout(function(){
if(_2a1.onerror){
_2a1.onerror(e);
}
},0);
};
return _28f;
})();
(function(){
var _2a3={};
_279._flashBridge.registerWebSocketEmulated=function(_2a4,_2a5,_2a6){
var _2a7=function(){
var key=_279._flashBridge.doRegisterWebSocketEmulated(_2a4);
_2a5(key,_2a3);
};
if(_279._flashBridge.flashHasLoaded){
if(_279._flashBridge.flashHasFailed){
_2a6();
}else{
_2a7();
}
}else{
this.readyWaitQueue.push(_2a7);
this.failWaitQueue.push(_2a6);
}
};
_279._flashBridge.doRegisterWebSocketEmulated=function(_2a9,_2aa){
var key=_279._flashBridge.elt.registerWebSocketEmulated(_2a9,_2aa);
return key;
};
_279._flashBridge.registerWebSocketRtmp=function(_2ac,_2ad,_2ae){
var _2af=function(){
var key=_279._flashBridge.doRegisterWebSocketRtmp(_2ac);
_2ad(key,_2a3);
};
if(_279._flashBridge.flashHasLoaded){
if(_279._flashBridge.flashHasFailed){
_2ae();
}else{
_2af();
}
}else{
this.readyWaitQueue.push(_2af);
this.failWaitQueue.push(_2ae);
}
};
_279._flashBridge.doRegisterWebSocketRtmp=function(_2b1,_2b2){
var key=_279._flashBridge.elt.registerWebSocketRtmp(_2b1,_2b2);
return key;
};
_279._flashBridge.onready=function(){
var _2b4=_279._flashBridge.readyWaitQueue;
for(var i=0;i<_2b4.length;i++){
var _2b6=_2b4[i];
_2b6();
}
};
_279._flashBridge.onfail=function(){
var _2b7=_279._flashBridge.failWaitQueue;
for(var i=0;i<_2b7.length;i++){
var _2b9=_2b7[i];
_2b9();
}
};
_279._flashBridge.doOpen=function(key){
_2a3[key].readyState=1;
_2a3[key].onopen();
_2bb();
};
_279._flashBridge.doClose=function(key){
_2a3[key].readyState=2;
_2a3[key].onclose();
};
_279._flashBridge.doError=function(key){
_2a3[key].onerror();
};
_279._flashBridge.doMessage=function(key,data){
var _2c0=_2a3[key];
if(_2c0.readyState==1){
var e;
try{
e=document.createEvent("Events");
e.initEvent("message",true,true);
}
catch(ie){
e={type:"message",bubbles:true,cancelable:true};
}
e.data=unescape(data);
e.decoder=_240;
e.origin=document.domain;
e.source=null;
_2c0.onmessage(e);
}
};
var _2bb=function(){
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_279._flashBridge.sendText=function(key,_2c4){
this.elt.wsSend(key,escape(_2c4));
setTimeout(_2bb,200);
};
_279._flashBridge.sendByteString=function(key,_2c6){
this.elt.wsSendByteString(key,escape(_2c6));
setTimeout(_2bb,200);
};
_279._flashBridge.disconnect=function(key){
this.elt.wsDisconnect(key);
};
_279._flashBridge.getBufferedAmount=function(key){
var v=this.elt.getBufferedAmount(key);
return v;
};
})();
(function(){
var _2ca=function(_2cb){
var self=this;
var _2cd=300;
var ID="Loader";
var ie=false;
var _2d0=-1;
self.elt=null;
var _2d1=function(){
var exp=new RegExp(".*"+_2cb+".*.js$");
var _2d3=document.getElementsByTagName("script");
for(var i=0;i<_2d3.length;i++){
if(_2d3[i].src){
var name=(_2d3[i].src).match(exp);
if(name){
name=name.pop();
var _2d6=name.split("/");
_2d6.pop();
if(_2d6.length>0){
return _2d6.join("/")+"/";
}else{
return "";
}
}
}
}
};
var _2d7=_2d1();
var _2d8=_2d7+"Loader.swf?.kv=10.05";
self.loader=function(){
var _2d9="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_2d9=tags[i].content;
}
}
if(_2d9!="flash"||!_2dc([9,0,115])){
_2dd();
}else{
_2d0=setTimeout(_2dd,_2cd);
_2de();
}
};
self.clearFlashTimer=function(){
clearTimeout(_2d0);
_2d0="cleared";
setTimeout(function(){
_2df(self.elt.handshake(_2cb));
},0);
};
var _2df=function(_2e0){
if(_2e0){
_279._flashBridge.flashHasLoaded=true;
_279._flashBridge.elt=self.elt;
_279._flashBridge.onready();
}else{
_2dd();
}
window.___Loader=undefined;
};
var _2dd=function(){
_279._flashBridge.flashHasLoaded=true;
_279._flashBridge.flashHasFailed=true;
_279._flashBridge.onfail();
};
var _2e1=function(){
var _2e2=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _2e4=swf.GetVariable("$version");
var _2e5=_2e4.split(" ")[1].split(",");
_2e2=[];
for(var i=0;i<_2e5.length;i++){
_2e2[i]=parseInt(_2e5[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _2e4=navigator.plugins["Shockwave Flash"].description;
_2e4=_2e4.replace(/\s*r/g,".");
var _2e5=_2e4.split(" ")[2].split(".");
_2e2=[];
for(var i=0;i<_2e5.length;i++){
_2e2[i]=parseInt(_2e5[i]);
}
}
}
var _2e7=navigator.userAgent;
if(_2e2!==null&&_2e2[0]===10&&_2e2[1]===0&&_2e7.indexOf("Windows NT 6.0")!==-1){
_2e2=null;
}
return _2e2;
};
var _2dc=function(_2e8){
var _2e9=_2e1();
if(_2e9==null){
return false;
}
for(var i=0;i<Math.max(_2e9.length,_2e8.length);i++){
var _2eb=_2e9[i]-_2e8[i];
if(_2eb!=0){
return (_2eb>0)?true:false;
}
}
return true;
};
var _2de=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_2d8+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_2d8);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_2ed){
if(window.addEventListener){
window.addEventListener("load",_2ed,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_2ed);
}else{
onload=_2ed;
}
}
};
if(document.readyState==="complete"){
self.loader();
}else{
self.attachToOnload(self.loader);
}
};
var _2ee={};
(function(){
var _2ef={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _2f0={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_2ee.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _2f2=_2f0[n];
if(typeof (_2f2)=="undefined"){
throw new Error("could not find: "+n);
}
return _2f2;
}
};
_2ee.fromCharCode=function(code){
if(code<128||(code>159&&code<256)){
return code;
}else{
var _2f4=_2ef[code];
if(typeof (_2f4)=="undefined"){
throw new Error("could not find: "+code);
}
return _2f4;
}
};
var _2f5=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2f7="\n";
var _2f8=function(s){
var a=[];
for(var i=0;i<s.length;i++){
var code=_2ee.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _2fd=_2ee.fromCharCode(s.charCodeAt(i));
switch(_2fd){
case 127:
a.push(127);
break;
case 48:
a.push(0);
break;
case 110:
a.push(10);
break;
case 114:
a.push(13);
break;
default:
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _2fe=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_2ee.toCharCode(n));
switch(chr){
case _2f5:
a.push(_2f5);
a.push(_2f5);
break;
case NULL:
a.push(_2f5);
a.push("0");
break;
case _2f7:
a.push(_2f5);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_2ee.toArray=function(s,_304){
if(_304){
return _2f8(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_2ee.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_2ee.toByteString=function(buf,_308){
if(_308){
return _2fe(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_2ee.toCharCode(n)));
}
return a.join("");
}
};
})();
var _30b=(function(){
var _30c=function(_30d){
this.immediate=false;
this.retry=3000;
if(browser=="opera"||browser=="ie"){
this.requiresEscaping=true;
}
if(_30d.indexOf(".kv="==-1)){
_30d+=((_30d.indexOf("?")==-1)?"?":"&")+".kv=10.05";
}else{
_30d=_30d.replace(/\.kv=[^&]*(.*)/,".kv=10.05$1");
}
var _30e=new URI(_30d);
var _30f={"http":80,"https":443};
if(_30e.port==null){
_30e.port=_30f[_30e.scheme];
_30e.authority=_30e.host+":"+_30e.port;
}
this.origin=_30e.scheme+"://"+_30e.authority;
this.location=_30d;
this.xhr=null;
this.reconnectTimer=null;
var _310=this;
setTimeout(function(){
connect(_310,false);
},0);
};
_25a=_30c.prototype;
var _311=0;
var _312=255;
var _313=1;
var _314=128;
var _315=127;
var _316=3000;
_25a.readyState=0;
function connect(_317){
if(_317.reconnectTimer!==null){
_317.reconnectTimer=null;
}
_317.buf=new ByteBuffer();
var _318=new URI(_317.location);
var _319=[];
if(_317.location.indexOf("&.kb=")===-1&&_317.location.indexOf("?.kb=")===-1){
_319.push(".kb=512");
}
switch(browser){
case "ie":
_319.push(".kns=1");
break;
case "safari":
_319.push(".kp=256");
break;
case "firefox":
_319.push(".kp=1025");
_319.push(String(Math.random()).substring(2));
break;
case "android":
_319.push(".kp=4096");
_319.push(".kbp=4096");
break;
}
_319.push(".kc=text/plain;charset=windows-1252");
if(_319.length>0){
if(_318.query===undefined){
_318.query=_319.join("&");
}else{
_318.query+="&"+_319.join("&");
}
}
var xhr=_317.xhr=new XMLHttpRequest0();
var _31b={"xhr":xhr,"position":0};
_317.nextMessageAt=0;
if(_317.location.indexOf(".ki=p")==-1||_317.location.indexOf("https://")==0){
xhr.onprogress=function(){
setTimeout(function(){
_process(_317,_31b);
},0);
};
}
xhr.onload=function(){
_process(_317,_31b);
if(_317.xhr==_31b.xhr&&_317.readyState!=2){
_reconnect(_317);
}
};
xhr.onreadystatechange=function(){
if(!_317.immediate&&xhr.readyStateChange>3){
_317.readyState=1;
doOpen(_317);
xhr.onreadystatechange=function(){
};
}
};
xhr.ontimeout=function(){
if(_317.readyState!=2){
_317.disconnect();
doError(_317);
}
};
xhr.onerror=xhr.ontimeout;
xhr.open("GET",_318.toString(),true);
xhr.send("");
if(_317.location.indexOf("&.ki=p")==-1){
setTimeout(function(){
if(xhr.readyState<3&&_317.readyState<2){
_317.location+="&.ki=p";
connect(_317,false);
}
},_316);
}
};
_25a.disconnect=function(){
if(this.readyState!==2){
_disconnect(this);
}
};
function _reconnect(_31c){
if(_31c.immediate){
_31c.immediate=false;
connect(_31c);
}else{
doError(_31c);
}
};
function _disconnect(_31d){
if(_31d.reconnectTimer!==null){
clearTimeout(_31d.reconnectTimer);
_31d.reconnectTimer=null;
}
if(_31d.xhr!==null){
_31d.xhr.onprogress=function(){
};
_31d.xhr.onload=function(){
};
_31d.xhr.onerror=function(){
};
_31d.xhr.abort();
}
_31d.lineQueue=[];
_31d.lastEventId=null;
_31d.location=null;
_31d.readyState=2;
};
function _process(_31e,_31f){
var _320=_31f.xhr.responseText;
var _321=_320.slice(_31f.position);
_31f.position=_320.length;
var buf=_31e.buf;
var _323=_2ee.toArray(_321,_31e.requiresEscaping);
if(_323.hasRemainder){
_31f.position--;
}
buf.position=buf.limit;
buf.putBytes(_323);
buf.position=_31e.nextMessageAt;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _311:
var _325=buf.indexOf(_312);
if(_325==-1){
break parse;
}
var _326=buf.array.slice(buf.position,_325);
var data=new ByteBuffer(_326);
var _328=_325-buf.position;
buf.skip(_328+1);
buf.mark();
if(type==_313){
handleCommandFrame(_31e,data);
}else{
dispatchText(_31e,data);
}
break;
case _314:
var _329=0;
var _32a=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_329=_329<<7;
_329|=(b&127);
if((b&128)!=128){
_32a=true;
break;
}
}
if(!_32a){
break parse;
}
if(buf.remaining()<_329){
break parse;
}
var _32c=buf.array.slice(buf.position,buf.position+_329);
var _32d=new ByteBuffer(_32c);
buf.skip(_329);
buf.mark();
dispatchBytes(_31e,_32d);
break;
default:
throw new Error("Emulation protocol error. Unknown frame type: "+type);
}
}
buf.reset();
buf.compact();
nextMessageAt=buf.position;
};
function handleCommandFrame(_32e,data){
while(data.remaining()){
var _330=String.fromCharCode(data.getUnsigned());
switch(_330){
case "0":
break;
case "1":
_32e.immediate=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_330);
}
}
};
function dispatchBytes(_331,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_331.lastEventId;
e.data=_24f(buf);
e.decoder=_240;
e.origin=_331.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_331.onmessage)==="function"){
_331.onmessage(e);
}
};
function dispatchText(data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=$this.lastEventId;
e.data=data;
e.origin=$this.origin;
if(e.source!==null){
e.source=null;
}
if(typeof ($this.onmessage)==="function"){
$this.onmessage(e);
}
};
function doOpen(_336){
if(typeof (_336.onopen)==="function"){
_336.onopen();
}
};
function doError(_337){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_337.onerror)==="function"){
_337.onerror(e);
}
};
return _30c;
})();
var _339=(function(){
var _33a=function(_33b,_33c){
this.URL=_33b;
if(_33b.indexOf(".kv=")==-1){
_33b+=((_33b.indexOf("?")==-1)?"?":"&")+".kv=10.05";
}else{
_33b=_33b.replace(/\.kv=[^&]*(.*)/,".kv=10.05$1");
}
if(browser=="opera"||browser=="ie"){
this.requiresEscaping=true;
}
this._sendQueue=[];
_33d(this);
};
_25a=_33a.prototype;
_25a.readyState=0;
_25a.bufferedAmount=0;
_25a.URL="";
_25a.onopen=function(){
};
_25a.onerror=function(){
};
_25a.onmessage=function(_33e){
};
_25a.onclose=function(){
};
var _33f=128;
var _340=0;
var _341=255;
var _342=1;
var _343=[_342,48,49,_341];
var _344=[_342,48,50,_341];
_25a.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
buf.put(_340);
buf.putString(data,Charset.UTF8);
buf.put(_341);
}else{
if(data.constructor==ByteBuffer){
buf.put(_33f);
_347(buf,data.remaining());
buf.putBuffer(data);
}else{
throw new Error("Invalid type for send");
}
}
buf.flip();
doSend(this,buf);
return true;
case 2:
return false;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_25a.close=function(){
switch(this.readyState){
case 1:
doSend(this,new ByteBuffer(_344));
_348(this);
break;
}
};
function doSend(_349,buf){
_349.bufferedAmount+=buf.remaining();
_349._sendQueue.push(buf);
if(!_349._writeSuspended){
doFlush(_349);
}
};
function doFlush(_34b){
var _34c=_34b._sendQueue;
var _34d=_34c.length;
_34b._writeSuspended=(_34d>0);
if(_34d>0){
var xhr=new XMLHttpRequest0();
xhr.open("POST",_34b._upstream,true);
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_34b);
},0);
break;
default:
_348(_34b);
break;
}
}
};
var out=new ByteBuffer();
while(_34c.length){
out.putBuffer(_34c.shift());
}
out.putBytes(_343);
out.flip();
if(xhr.sendAsBinary){
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_24f(out));
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_24f(out,_34b.requiresEscaping));
}
}
_34b.bufferedAmount=0;
};
var _33d=function(_350){
var url=new URI(_350.URL);
url.scheme=url.scheme.replace("ws","http");
var _352=_350.requiresEscaping?"/;e/cte":"/;e/ct";
url.path=url.path.replace(/[\/]?$/,_352);
var _353=url.toString();
var _354=_353.indexOf("?");
if(_354==-1){
_353+="?";
}else{
_353+="&";
}
_353+=".kn="+String(Math.random()).substring(2);
var _355=new XMLHttpRequest0();
var _356=false;
_355.open("GET",_353,true);
_355.onreadystatechange=function(){
switch(_355.readyState){
case 2:
timer=setTimeout(function(){
if(!_356){
_357(_350);
}
},5000);
break;
case 4:
_356=true;
if(_350.readyState<2){
if(_355.status==201){
var _358=_355.responseText.split("\n");
_350._upstream=_358[0];
var _359=_358[1];
_350._downstream=new _30b(_359);
_35a(_350,_350._downstream);
_35b(_350);
}else{
_357(_350);
}
}
break;
}
};
_355.send(null);
};
var _35a=function(_35c,_35d){
_35d.onmessage=function(_35e){
switch(_35e.type){
case "message":
if(_35c.readyState==1){
_35c.onmessage(_35e);
}
break;
}
};
_35d.onerror=function(){
_35d.disconnect();
_348(_35c);
};
};
var _347=function(buf,_360){
var _361=0;
var _362=0;
do{
_362<<=8;
_362|=(_360&127);
_360>>=7;
_361++;
}while(_360>0);
do{
var _363=_362&255;
_362>>=8;
if(_361!=1){
_363|=128;
}
buf.put(_363);
}while(--_361>0);
};
var _35b=function(_364){
_364.readyState=1;
_364.onopen();
};
var _357=function(_365){
if(_365.readyState<2){
_365.readyState=2;
_365.onerror();
}
};
var _348=function(_366){
switch(_366.readyState){
case 0:
case 2:
break;
case 1:
_366.readyState=2;
_366.onclose();
break;
default:
}
};
return _33a;
})();
(function(){
var _367="javascript:ws";
var _368="javascript:wss";
var _369="javascript:wse";
var _36a="javascript:wse+ssl";
var _36b="flash:wse";
var _36c="flash:wse+ssl";
var _36d="flash:wsr";
var _36e="flash:wsr+ssl";
var _36f={};
_36f[_367]=_256;
_36f[_368]=_256;
_36f[_369]=_339;
_36f[_36a]=_339;
_36f[_36b]=_279;
_36f[_36c]=_279;
_36f[_36d]=_28e;
_36f[_36e]=_28e;
window.WebSocket=function(url,_371){
var _372=new URI(url);
if(_372.port===undefined){
var _373=_372.scheme;
_372.port=((_373.indexOf("wss")==-1)&&(_373.indexOf("ssl")==-1))?80:443;
}
url=_372.toString();
this.URL=_372.toString();
this.readyState=0;
this._subprotocol=_371;
var _374=splitScheme(url);
var _375=_374.shift();
this._urlRemainder=_374.shift();
if(_375=="ws"||_375=="wse"||_375=="wss"||_375=="wse+ssl"){
var _376=_22d("kaazing:WebSocketConnectionStrategies");
var _377=null;
if(_376){
_377=_376.split(" ");
}
if(!_377){
if(_375=="ws"){
this._connectionStrategies=_236(WebSocket.connectionStrategies,function(_378){
return !(_378.match("wss")||_378.match("ssl"));
});
}else{
if(_375=="wss"){
this._connectionStrategies=_236(WebSocket.connectionStrategies,function(_379){
return (_379.match("wss")||_379.match("ssl"));
});
}else{
if(_375.match("wse")){
var _37a=function(s){
return s.match("wse");
};
this._connectionStrategies=_236(WebSocket.connectionStrategies,_37a);
}
}
}
}
}else{
if(_36f[_375]){
this._connectionStrategies=[_375];
}else{
throw new Error("Unsupported composite scheme: "+_375);
}
}
this.URL=url.replace("flash:","").replace("javascript:","").replace("wse+ssl:","wss:").replace("wse:","ws:").replace("wsr+ssl:","wss:").replace("wsr:","ws:");
fallbackNext(this);
};
function pickStrategies(){
switch(browser){
case "chrome":
case "safari":
return [_367,_369,_36b,_36d,_368,_36a,_36c,_36e];
case "android":
case "opera":
return [_367,_369,_368,_36a];
case "ie":
return [_367,_36b,_369,_368,_36c,_36a];
case "firefox":
default:
return [_367,_369,_36b,_368,_36a,_36c];
}
};
window.WebSocket.connectionStrategies=pickStrategies();
window.WebSocket.__impls__=_36f;
var _37c=WebSocket.prototype;
function splitScheme(url){
var _37e=url.split("://");
var _37f=_37e.shift();
var _380=_37e.shift();
return [_37f,_380];
};
_37c.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
throw new Error("data is null");
}
this._delegate.send(data);
_382(this);
return true;
case 2:
return false;
default:
throw new Error("INVALID_STATE_ERR");
}
};
var _382=function(_383){
_383.bufferedAmount=_383._delegate.bufferedAmount;
if(_383.bufferedAmount!=0){
setTimeout(function(){
_382(_383);
},1000);
}
};
_37c.postMessage=_37c.send;
_37c.disconnect=_37c.close;
_37c.close=function(){
switch(this.readyState){
case 1:
case 2:
this._delegate.close();
break;
}
};
function initDelegate(_384,_385){
if(typeof (_384._subprotocol)!=="undefined"){
_384._delegate=new _385(_384.URL,_384._subprotocol);
}else{
_384._delegate=new _385(_384.URL);
}
bindHandlers(_384);
};
function fallbackNext(_386){
var _387=_386._connectionStrategies.shift();
var _388=_36f[_387];
if(_388){
initDelegate(_386,_388);
}else{
doClose(_386);
}
};
function doOpen(_389,ev){
if(_389.readyState<1){
_389.readyState=1;
if(typeof (_389.onopen)!=="undefined"){
if(!ev){
try{
ev=document.createEvent("Events");
ev.initEvent("open",true,true);
}
catch(ie){
ev={type:"open",bubbles:true,cancelable:true};
}
}
try{
_389.onopen(ev);
}
catch(e){
}
}
}
};
function doClose(_38b,ev){
if(_38b.readyState<2){
_38b.readyState=2;
if(typeof (_38b.onclose)!=="undefined"){
setTimeout(function(){
if(!ev){
try{
ev=document.createEvent("Events");
ev.initEvent("close",true,true);
}
catch(ie){
ev={type:"close",bubbles:true,cancelable:true};
}
}
try{
_38b.onclose(ev);
}
catch(e){
}
},0);
}
}
};
function errorHandler(_38d,ev){
unbindHandlers(_38d);
fallbackNext(_38d);
};
function openHandler(_38f,ev){
switch(_38f.readyState){
case 0:
doOpen(_38f,ev);
break;
case 1:
case 2:
var _391=(ev?" from "+ev.target:"");
throw new Error("Invalid readyState for open event"+_391);
default:
throw new Error("Socket has invalid readyState: "+_38f.readyState);
}
};
function closeHandler(_392,ev){
switch(_392.readyState){
case 0:
unbindHandlers(_392);
fallbackNext(_392);
break;
case 1:
doClose(_392,ev);
break;
case 2:
var _394=(ev?" from "+ev.target:"");
throw new Error("Invalid readyState for close event"+_394);
break;
default:
throw new Error("Socket has invalid readyState: "+_392.readyState);
}
};
function bindHandlers(_395){
var _396=_395._delegate;
_396.onmessage=function(e){
if(e.decoder){
var e2;
try{
e2=document.createEvent("Events");
e2.initEvent("message",true,true);
}
catch(ie){
e2={type:"message",bubbles:true,cancelable:true};
}
e2.data=e.decoder(e.data);
e2.origin=e.origin;
e2.source=_395;
_395.onmessage(e2);
}else{
_395.onmessage(e);
}
};
_396.onclose=function(e){
closeHandler(_395,e);
};
_396.onopen=function(e){
openHandler(_395,e);
};
_396.onerror=function(e){
errorHandler(_395,e);
};
};
function unbindHandlers(_39c){
var _39d=_39c._delegate;
if(_39d){
_39d.onerror=undefined;
_39d.onmessage=undefined;
_39d.onclose=undefined;
_39d.onopen=undefined;
}
};
}());
(function(){
var _39e="javascript:ws";
var _39f="javascript:wss";
var _3a0="javascript:wse";
var _3a1="javascript:wse+ssl";
var _3a2="flash:wse";
var _3a3="flash:wse+ssl";
var _3a4="flash:wsr";
var _3a5="flash:wsr+ssl";
var _3a6={};
_3a6[_39e]=_275;
_3a6[_39f]=_275;
_3a6[_3a0]=_339;
_3a6[_3a1]=_339;
_3a6[_3a2]=_279;
_3a6[_3a3]=_279;
_3a6[_3a4]=_28e;
_3a6[_3a5]=_28e;
window.ByteSocket=function(url,_3a8){
var _3a9=new URI(url);
if(_3a9.port===undefined){
var _3aa=_3a9.scheme;
_3a9.port=((_3aa.indexOf("wss")==-1)&&(_3aa.indexOf("ssl")==-1))?80:443;
}
url=_3a9.toString();
this.URL=_3a9.toString();
this.readyState=0;
this._subprotocol=_3a8;
var _3ab=splitScheme(url);
var _3ac=_3ab.shift();
this._urlRemainder=_3ab.shift();
if(_3ac=="ws"||_3ac=="wse"||_3ac=="wss"||_3ac=="wse+ssl"){
var _3ad=_22d("kaazing:ByteSocketConnectionStrategies");
var _3ae=null;
if(_3ad){
_3ae=_3ad.split(" ");
}
if(!_3ae){
if(_3ac=="ws"){
this._connectionStrategies=_236(ByteSocket.connectionStrategies,function(_3af){
return !(_3af.match("wss")||_3af.match("ssl"));
});
}else{
if(_3ac=="wss"){
this._connectionStrategies=_236(ByteSocket.connectionStrategies,function(_3b0){
return (_3b0.match("wss")||_3b0.match("ssl"));
});
}else{
if(_3ac.match("wse")){
var _3b1=function(s){
return s.match("wse");
};
this._connectionStrategies=_236(ByteSocket.connectionStrategies,_3b1);
}
}
}
}
}else{
if(_3a6[_3ac]){
this._connectionStrategies=[_3ac];
}else{
throw new Error("Unsupported composite scheme: "+_3ac);
}
}
this.URL=url.replace("flash:","").replace("javascript:","").replace("wse+ssl:","wss:").replace("wse:","ws:").replace("wsr+ssl:","wss:").replace("wsr:","ws:");
fallbackNext(this);
};
function pickStrategies(){
switch(browser){
case "chrome":
case "safari":
return [_39e,_3a0,_3a2,_3a4,_39f,_3a1,_3a3,_3a5];
case "android":
case "opera":
return [_39e,_3a0,_39f,_3a1];
case "ie":
return [_39e,_3a2,_3a0,_39f,_3a3,_3a1];
case "firefox":
default:
return [_39e,_3a0,_3a2,_39f,_3a1,_3a3];
}
};
window.ByteSocket.connectionStrategies=pickStrategies();
window.ByteSocket.__impls__=_3a6;
var _3b3=ByteSocket.prototype;
function splitScheme(url){
var _3b5=url.split("://");
var _3b6=_3b5.shift();
var _3b7=_3b5.shift();
return [_3b6,_3b7];
};
_3b3.send=function(data){
if(data.constructor!=window.ByteBuffer){
throw new Error("ByteSocket.send must be called with a ByteBuffer argument");
}
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
throw new Error("data is null");
}
this._delegate.send(data);
_3b9(this);
return true;
case 2:
return false;
default:
throw new Error("INVALID_STATE_ERR");
}
};
var _3b9=function(_3ba){
_3ba.bufferedAmount=_3ba._delegate.bufferedAmount;
if(_3ba.bufferedAmount!=0){
setTimeout(function(){
_3b9(_3ba);
},1000);
}
};
_3b3.postMessage=_3b3.send;
_3b3.disconnect=_3b3.close;
_3b3.close=function(){
switch(this.readyState){
case 1:
case 2:
this._delegate.close();
break;
}
};
function initDelegate(_3bb,_3bc){
if(typeof (_3bb._subprotocol)!=="undefined"){
_3bb._delegate=new _3bc(_3bb.URL,_3bb._subprotocol);
}else{
_3bb._delegate=new _3bc(_3bb.URL);
}
bindHandlers(_3bb);
};
function fallbackNext(_3bd){
var _3be=_3bd._connectionStrategies.shift();
var _3bf=_3a6[_3be];
if(_3bf){
initDelegate(_3bd,_3bf);
}else{
doClose(_3bd);
}
};
function doClose(_3c0){
if(typeof (_3c0.onclose)!=="undefined"){
_3c0.onclose();
}
};
function errorHandler(_3c1,e){
unbindHandlers(_3c1);
fallbackNext(_3c1);
};
function openHandler(_3c3,e){
switch(_3c3.readyState){
case 0:
_3c3.readyState=1;
_3c3.onopen(e);
break;
case 1:
case 2:
var _3c5=(e?" from "+e.target:"");
throw new Error("Invalid readyState for open event"+_3c5);
break;
default:
throw new Error("Socket has invalid readyState: "+_3c3.readyState);
}
};
function closeHandler(_3c6,e){
switch(_3c6.readyState){
case 0:
unbindHandlers(_3c6);
fallbackNext(_3c6);
break;
case 1:
_3c6.readyState=2;
setTimeout(function(){
doClose(_3c6);
},0);
break;
case 2:
var _3c8=(e?" from "+e.target:"");
throw new Error("Invalid readyState for close event"+_3c8);
break;
default:
throw new Error("Socket has invalid readyState: "+_3c6.readyState);
}
};
function bindHandlers(_3c9){
var _3ca=_3c9._delegate;
_3ca.onmessage=function(e){
var a=[];
for(var i=0;i<e.data.length;i++){
a.push(e.data.charCodeAt(i)&255);
}
var e2;
try{
e2=document.createEvent("Events");
e2.initEvent("message",true,true);
}
catch(ie){
e2={type:"message",bubbles:true,cancelable:true};
}
e2.data=new ByteBuffer(a);
e2.origin=e.origin;
e2.source=_3c9;
_3c9.onmessage(e2);
};
_3ca.onclose=function(e){
closeHandler(_3c9,e);
};
_3ca.onopen=function(e){
openHandler(_3c9,e);
};
_3ca.onerror=function(e){
errorHandler(_3c9,e);
};
};
function unbindHandlers(_3d2){
var _3d3=_3d2._delegate;
if(_3d3){
_3d3.onerror=undefined;
_3d3.onmessage=undefined;
_3d3.onclose=undefined;
_3d3.onopen=undefined;
}
};
}());
window.___Loader=new _2ca(_201);
})();
})();
var EventDispatcher=function(){
};
(function(){
var _3d4=EventDispatcher.prototype;
_3d4._initEventDispatcher=function(){
this._eventListeners={};
};
_3d4.addEventListener=function(type,_3d6){
var _3d7=this._eventListeners[type];
if(_3d7){
_3d7.push(_3d6);
}else{
this._eventListeners[type]=[_3d6];
}
};
_3d4.removeEventListener=function(type,_3d9){
var _3da=this._eventListeners[type];
if(_3da){
var _3db=[];
for(var i=0;i<_3da.length;i++){
if(_3da[i]!==_3d9){
_3db.push(_3da[i]);
}
}
this._eventListeners[type]=new Listeners;
}
};
_3d4.hasEventListener=function(type){
var _3de=this._eventListeners[type];
return Boolean(_3de);
};
_3d4.dispatchEvent=function(e){
var _3e0=this._eventListeners[e.type];
if(_3e0){
for(var i=0;i<_3e0.length;i++){
_3e0[i](e);
}
}
if(this["on"+e.type]){
this["on"+e.type](e);
}
};
})();
var AmqpClient=function(){
this._options={};
this._options.autoReconnect=true;
this._readyState=0;
this._init();
this._reconnectHandlers=new Array();
};
(function(){
var _3e2=function(_3e3){
this.context=_3e3;
this.states={};
};
(function(){
var _3e4=_3e2.prototype;
var _3e5=function _3e5(){
};
_3e4.enterState=function(_3e6,_3e7,args){
if(this.currentState){
this.currentState.exitBehavior(this.context,_3e7,args,_3e6);
}
var _3e9=this.states[_3e6];
this.currentState=_3e9;
try{
_3e9.entryBehavior(this.context,_3e7,args,_3e6);
}
catch(e){
var _3ea=new Error("Could not call behavior for state "+_3e9.stateName+"\n\n"+e.message);
_3ea.innerException=e;
throw (_3ea);
}
};
_3e4.addState=function(_3eb,_3ec,_3ed,_3ee){
var _3ef={};
_3ef.stateName=_3eb;
_3ef.entryBehavior=_3ed||_3e5;
_3ef.exitBehavior=_3ee||_3e5;
this.states[_3eb]=(_3ef);
_3ef.rules={};
var _3f0=_3ec||[];
for(var i=0;i<_3f0.length;i++){
var rule=_3f0[i];
for(var j=0;j<rule.inputs.length;j++){
var _3f4=rule.inputs[j];
_3ef.rules[_3f4]=rule.targetState;
}
}
};
_3e4.feedInput=function(_3f5,args){
var _3f7=this.currentState;
if(_3f7.rules[_3f5]){
var sm=this;
var func=function(){
sm.enterState(_3f7.rules[_3f5],_3f5,args);
};
func();
return true;
}else{
return false;
}
};
})();
var _3fa=function(){
};
(function(){
_3fa.prototype=new EventDispatcher();
var _3fb=_3fa.prototype;
var _3fc=function _3fc(){
};
var _3fd=function _3fd(ex){
throw ex;
};
_3fb._stateMachine=null;
_3fb.onerror=function(e){
};
_3fb._actions=[];
_3fb._processActions=function _processActions(){
if(!this._actions.length){
return;
}
var _400=this._actions[0];
var _401=this._stateMachine.feedInput(_400.actionName+"Action",_400);
if(_401){
var _402=this;
setTimeout(function(){
try{
_400.func.apply(_402,_400.args);
}
catch(ex1){
_400.error(ex1);
}
},0);
this._actions.shift();
}
};
_3fb._enqueueAction=function _enqueueAction(_403,func,args,_406,_407){
var _408={};
_408.actionName=_403||"";
_408.func=func||_3fc;
_408.args=args||null;
_408.continuation=_406||_3fc;
_408.error=_407||_3fd;
this._actions.push(_408);
var _409=this;
var func=function(){
_409._processActions();
};
setTimeout(func,0);
};
_3fb._initAsyncClient=function(){
this._initEventDispatcher();
this._stateMachine=new _3e2(this);
this._actions=[];
this._buffer=null;
this._socket=null;
};
_3fb._send=null;
_3fb._readHandler=null;
})();
var _40a={};
_40a.FRAME_METHOD={"value":1,"message":""};
_40a.FRAME_HEADER={"value":2,"message":""};
_40a.FRAME_BODY={"value":3,"message":""};
_40a.FRAME_HEARTBEAT={"value":8,"message":""};
_40a.FRAME_MIN_SIZE={"value":4096,"message":""};
_40a.FRAME_END={"value":206,"message":""};
_40a.REPLY_SUCCESS={"value":200,"message":"Indicates that the method completed successfully. This reply code is reserved for future use - the current protocol design does not use positive confirmation and reply codes are sent only in case of an error."};
_40a.CONTENT_TOO_LARGE={"value":311,"message":"The client attempted to transfer content larger than the server could accept at the present time. The client may retry at a later time."};
_40a.NO_CONSUMERS={"value":313,"message":"When the exchange cannot deliver to a consumer when the immediate flag is set. As a result of pending data on the queue or the absence of any consumers of the queue."};
_40a.CONNECTION_FORCED={"value":320,"message":"An operator intervened to close the connection for some reason. The client may retry at some later date."};
_40a.INVALID_PATH={"value":402,"message":"The client tried to work with an unknown virtual host."};
_40a.ACCESS_REFUSED={"value":403,"message":"The client attempted to work with a server entity to which it has no access due to security settings."};
_40a.NOT_FOUND={"value":404,"message":"The client attempted to work with a server entity that does not exist."};
_40a.RESOURCE_LOCKED={"value":405,"message":"The client attempted to work with a server entity to which it has no access because another client is working with it."};
_40a.PRECONDITION_FAILED={"value":406,"message":"The client requested a method that was not allowed because some precondition failed."};
_40a.FRAME_ERROR={"value":501,"message":"The sender sent a malformed frame that the recipient could not decode. This strongly implies a programming error in the sending peer."};
_40a.SYNTAX_ERROR={"value":502,"message":"The sender sent a frame that contained illegal values for one or more fields. This strongly implies a programming error in the sending peer."};
_40a.COMMAND_INVALID={"value":503,"message":"The client sent an invalid sequence of frames, attempting to perform an operation that was considered invalid by the server. This usually implies a programming error in the client."};
_40a.CHANNEL_ERROR={"value":504,"message":"The client attempted to work with a channel that had not been correctly opened. This most likely indicates a fault in the client layer."};
_40a.UNEXPECTED_FRAME={"value":505,"message":"The peer sent a frame that was not expected, usually in the context of a content header and body.  This strongly indicates a fault in the peer's content processing."};
_40a.RESOURCE_ERROR={"value":506,"message":"The server could not complete the method because it lacked sufficient resources. This may be due to the client creating too many of some type of entity."};
_40a.NOT_ALLOWED={"value":530,"message":"The client tried to work with some entity in a manner that is prohibited by the server, due to security settings or by some other criteria."};
_40a.NOT_IMPLEMENTED={"value":540,"message":"The client tried to use functionality that is not implemented in the server."};
_40a.INTERNAL_ERROR={"value":541,"message":"The server could not complete the method because of an internal error. The server may require intervention by an operator in order to resume normal operations."};
var _40b={"ClassId":{"type":"short","asserts":[]},"ConsumerTag":{"type":"shortstr","asserts":[]},"DeliveryTag":{"type":"longlong","asserts":[]},"ExchangeName":{"type":"shortstr","asserts":[]},"MethodId":{"type":"short","asserts":[]},"NoAck":{"type":"bit","asserts":[]},"NoLocal":{"type":"bit","asserts":[]},"NoWait":{"type":"bit","asserts":[]},"Path":{"type":"shortstr","asserts":[]},"PeerProperties":{"type":"table","asserts":[]},"QueueName":{"type":"shortstr","asserts":[]},"Redelivered":{"type":"bit","asserts":[]},"MessageCount":{"type":"long","asserts":[]},"ReplyCode":{"type":"short","asserts":[]},"ReplyText":{"type":"shortstr","asserts":[]},"Bit":{"type":"bit","asserts":[]},"Octet":{"type":"octet","asserts":[]},"Short":{"type":"short","asserts":[]},"Long":{"type":"long","asserts":[]},"Longlong":{"type":"longlong","asserts":[]},"Shortstr":{"type":"shortstr","asserts":[]},"Longstr":{"type":"longstr","asserts":[]},"Timestamp":{"type":"timestamp","asserts":[]},"Table":{"type":"table","asserts":[]}};
var _40c={};
_40c.Connection={};
_40c.Connection.startConnection={};
_40c.Connection.startConnection.allParameters=[{"name":"versionMajor","type":"Octet"},{"name":"versionMinor","type":"Octet"},{"name":"serverProperties","type":"PeerProperties"},{"name":"mechanisms","type":"Longstr"},{"name":"locales","type":"Longstr"}];
_40c.Connection.startConnection.returnType="StartOkConnection";
_40c.Connection.startConnection.index=10;
_40c.Connection.startConnection.classIndex=10;
_40c.Connection.startConnection.synchronous=true;
_40c.Connection.startConnection.hasContent=false;
_40c.Connection.startOkConnection={};
_40c.Connection.startOkConnection.allParameters=[{"name":"clientProperties","type":"PeerProperties"},{"name":"mechanism","type":"Shortstr"},{"name":"response","type":"Longstr"},{"name":"locale","type":"Shortstr"}];
_40c.Connection.startOkConnection.returnType="voidConnection";
_40c.Connection.startOkConnection.index=11;
_40c.Connection.startOkConnection.classIndex=10;
_40c.Connection.startOkConnection.synchronous=true;
_40c.Connection.startOkConnection.hasContent=false;
_40c.Connection.secureConnection={};
_40c.Connection.secureConnection.allParameters=[{"name":"challenge","type":"Longstr"}];
_40c.Connection.secureConnection.returnType="SecureOkConnection";
_40c.Connection.secureConnection.index=20;
_40c.Connection.secureConnection.classIndex=10;
_40c.Connection.secureConnection.synchronous=true;
_40c.Connection.secureConnection.hasContent=false;
_40c.Connection.secureOkConnection={};
_40c.Connection.secureOkConnection.allParameters=[{"name":"response","type":"Longstr"}];
_40c.Connection.secureOkConnection.returnType="voidConnection";
_40c.Connection.secureOkConnection.index=21;
_40c.Connection.secureOkConnection.classIndex=10;
_40c.Connection.secureOkConnection.synchronous=true;
_40c.Connection.secureOkConnection.hasContent=false;
_40c.Connection.tuneConnection={};
_40c.Connection.tuneConnection.allParameters=[{"name":"channelMax","type":"Short"},{"name":"frameMax","type":"Long"},{"name":"heartbeat","type":"Short"}];
_40c.Connection.tuneConnection.returnType="TuneOkConnection";
_40c.Connection.tuneConnection.index=30;
_40c.Connection.tuneConnection.classIndex=10;
_40c.Connection.tuneConnection.synchronous=true;
_40c.Connection.tuneConnection.hasContent=false;
_40c.Connection.tuneOkConnection={};
_40c.Connection.tuneOkConnection.allParameters=[{"name":"channelMax","type":"Short"},{"name":"frameMax","type":"Long"},{"name":"heartbeat","type":"Short"}];
_40c.Connection.tuneOkConnection.returnType="voidConnection";
_40c.Connection.tuneOkConnection.index=31;
_40c.Connection.tuneOkConnection.classIndex=10;
_40c.Connection.tuneOkConnection.synchronous=true;
_40c.Connection.tuneOkConnection.hasContent=false;
_40c.Connection.openConnection={};
_40c.Connection.openConnection.allParameters=[{"name":"virtualHost","type":"Path"},{"name":"reserved1","type":"Shortstr"},{"name":"reserved2","type":"Bit"}];
_40c.Connection.openConnection.returnType="OpenOkConnection";
_40c.Connection.openConnection.index=40;
_40c.Connection.openConnection.classIndex=10;
_40c.Connection.openConnection.synchronous=true;
_40c.Connection.openConnection.hasContent=false;
_40c.Connection.openOkConnection={};
_40c.Connection.openOkConnection.allParameters=[{"name":"reserved1","type":"Shortstr"}];
_40c.Connection.openOkConnection.returnType="voidConnection";
_40c.Connection.openOkConnection.index=41;
_40c.Connection.openOkConnection.classIndex=10;
_40c.Connection.openOkConnection.synchronous=true;
_40c.Connection.openOkConnection.hasContent=false;
_40c.Connection.closeConnection={};
_40c.Connection.closeConnection.allParameters=[{"name":"replyCode","type":"ReplyCode"},{"name":"replyText","type":"ReplyText"},{"name":"classId","type":"ClassId"},{"name":"methodId","type":"MethodId"}];
_40c.Connection.closeConnection.returnType="CloseOkConnection";
_40c.Connection.closeConnection.index=50;
_40c.Connection.closeConnection.classIndex=10;
_40c.Connection.closeConnection.synchronous=true;
_40c.Connection.closeConnection.hasContent=false;
_40c.Connection.closeOkConnection={};
_40c.Connection.closeOkConnection.allParameters=[];
_40c.Connection.closeOkConnection.returnType="voidConnection";
_40c.Connection.closeOkConnection.index=51;
_40c.Connection.closeOkConnection.classIndex=10;
_40c.Connection.closeOkConnection.synchronous=true;
_40c.Connection.closeOkConnection.hasContent=false;
_40c.Connection.methodLookup={10:"startConnection",11:"startOkConnection",20:"secureConnection",21:"secureOkConnection",30:"tuneConnection",31:"tuneOkConnection",40:"openConnection",41:"openOkConnection",50:"closeConnection",51:"closeOkConnection"};
_40c.Connection.className="Connection";
_40c.Channel={};
_40c.Channel.openChannel={};
_40c.Channel.openChannel.allParameters=[{"name":"reserved1","type":"Shortstr"}];
_40c.Channel.openChannel.returnType="OpenOkChannel";
_40c.Channel.openChannel.index=10;
_40c.Channel.openChannel.classIndex=20;
_40c.Channel.openChannel.synchronous=true;
_40c.Channel.openChannel.hasContent=false;
_40c.Channel.openOkChannel={};
_40c.Channel.openOkChannel.allParameters=[{"name":"reserved1","type":"Longstr"}];
_40c.Channel.openOkChannel.returnType="voidChannel";
_40c.Channel.openOkChannel.index=11;
_40c.Channel.openOkChannel.classIndex=20;
_40c.Channel.openOkChannel.synchronous=true;
_40c.Channel.openOkChannel.hasContent=false;
_40c.Channel.flowChannel={};
_40c.Channel.flowChannel.allParameters=[{"name":"active","type":"Bit"}];
_40c.Channel.flowChannel.returnType="FlowOkChannel";
_40c.Channel.flowChannel.index=20;
_40c.Channel.flowChannel.classIndex=20;
_40c.Channel.flowChannel.synchronous=true;
_40c.Channel.flowChannel.hasContent=false;
_40c.Channel.flowOkChannel={};
_40c.Channel.flowOkChannel.allParameters=[{"name":"active","type":"Bit"}];
_40c.Channel.flowOkChannel.returnType="voidChannel";
_40c.Channel.flowOkChannel.index=21;
_40c.Channel.flowOkChannel.classIndex=20;
_40c.Channel.flowOkChannel.synchronous=false;
_40c.Channel.flowOkChannel.hasContent=false;
_40c.Channel.closeChannel={};
_40c.Channel.closeChannel.allParameters=[{"name":"replyCode","type":"ReplyCode"},{"name":"replyText","type":"ReplyText"},{"name":"classId","type":"ClassId"},{"name":"methodId","type":"MethodId"}];
_40c.Channel.closeChannel.returnType="CloseOkChannel";
_40c.Channel.closeChannel.index=40;
_40c.Channel.closeChannel.classIndex=20;
_40c.Channel.closeChannel.synchronous=true;
_40c.Channel.closeChannel.hasContent=false;
_40c.Channel.closeOkChannel={};
_40c.Channel.closeOkChannel.allParameters=[];
_40c.Channel.closeOkChannel.returnType="voidChannel";
_40c.Channel.closeOkChannel.index=41;
_40c.Channel.closeOkChannel.classIndex=20;
_40c.Channel.closeOkChannel.synchronous=true;
_40c.Channel.closeOkChannel.hasContent=false;
_40c.Channel.methodLookup={10:"openChannel",11:"openOkChannel",20:"flowChannel",21:"flowOkChannel",40:"closeChannel",41:"closeOkChannel"};
_40c.Channel.className="Channel";
_40c.Exchange={};
_40c.Exchange.declareExchange={};
_40c.Exchange.declareExchange.allParameters=[{"name":"reserved1","type":"Short"},{"name":"exchange","type":"ExchangeName"},{"name":"type","type":"Shortstr"},{"name":"passive","type":"Bit"},{"name":"durable","type":"Bit"},{"name":"reserved2","type":"Bit"},{"name":"reserved3","type":"Bit"},{"name":"noWait","type":"NoWait"},{"name":"arguments","type":"Table"}];
_40c.Exchange.declareExchange.returnType="DeclareOkExchange";
_40c.Exchange.declareExchange.index=10;
_40c.Exchange.declareExchange.classIndex=40;
_40c.Exchange.declareExchange.synchronous=true;
_40c.Exchange.declareExchange.hasContent=false;
_40c.Exchange.declareOkExchange={};
_40c.Exchange.declareOkExchange.allParameters=[];
_40c.Exchange.declareOkExchange.returnType="voidExchange";
_40c.Exchange.declareOkExchange.index=11;
_40c.Exchange.declareOkExchange.classIndex=40;
_40c.Exchange.declareOkExchange.synchronous=true;
_40c.Exchange.declareOkExchange.hasContent=false;
_40c.Exchange.deleteExchange={};
_40c.Exchange.deleteExchange.allParameters=[{"name":"reserved1","type":"Short"},{"name":"exchange","type":"ExchangeName"},{"name":"ifUnused","type":"Bit"},{"name":"noWait","type":"NoWait"}];
_40c.Exchange.deleteExchange.returnType="DeleteOkExchange";
_40c.Exchange.deleteExchange.index=20;
_40c.Exchange.deleteExchange.classIndex=40;
_40c.Exchange.deleteExchange.synchronous=true;
_40c.Exchange.deleteExchange.hasContent=false;
_40c.Exchange.deleteOkExchange={};
_40c.Exchange.deleteOkExchange.allParameters=[];
_40c.Exchange.deleteOkExchange.returnType="voidExchange";
_40c.Exchange.deleteOkExchange.index=21;
_40c.Exchange.deleteOkExchange.classIndex=40;
_40c.Exchange.deleteOkExchange.synchronous=true;
_40c.Exchange.deleteOkExchange.hasContent=false;
_40c.Exchange.methodLookup={10:"declareExchange",11:"declareOkExchange",20:"deleteExchange",21:"deleteOkExchange"};
_40c.Exchange.className="Exchange";
_40c.Queue={};
_40c.Queue.declareQueue={};
_40c.Queue.declareQueue.allParameters=[{"name":"reserved1","type":"Short"},{"name":"queue","type":"QueueName"},{"name":"passive","type":"Bit"},{"name":"durable","type":"Bit"},{"name":"exclusive","type":"Bit"},{"name":"autoDelete","type":"Bit"},{"name":"noWait","type":"NoWait"},{"name":"arguments","type":"Table"}];
_40c.Queue.declareQueue.returnType="DeclareOkQueue";
_40c.Queue.declareQueue.index=10;
_40c.Queue.declareQueue.classIndex=50;
_40c.Queue.declareQueue.synchronous=true;
_40c.Queue.declareQueue.hasContent=false;
_40c.Queue.declareOkQueue={};
_40c.Queue.declareOkQueue.allParameters=[{"name":"queue","type":"QueueName"},{"name":"messageCount","type":"MessageCount"},{"name":"consumerCount","type":"Long"}];
_40c.Queue.declareOkQueue.returnType="voidQueue";
_40c.Queue.declareOkQueue.index=11;
_40c.Queue.declareOkQueue.classIndex=50;
_40c.Queue.declareOkQueue.synchronous=true;
_40c.Queue.declareOkQueue.hasContent=false;
_40c.Queue.bindQueue={};
_40c.Queue.bindQueue.allParameters=[{"name":"reserved1","type":"Short"},{"name":"queue","type":"QueueName"},{"name":"exchange","type":"ExchangeName"},{"name":"routingKey","type":"Shortstr"},{"name":"noWait","type":"NoWait"},{"name":"arguments","type":"Table"}];
_40c.Queue.bindQueue.returnType="BindOkQueue";
_40c.Queue.bindQueue.index=20;
_40c.Queue.bindQueue.classIndex=50;
_40c.Queue.bindQueue.synchronous=true;
_40c.Queue.bindQueue.hasContent=false;
_40c.Queue.bindOkQueue={};
_40c.Queue.bindOkQueue.allParameters=[];
_40c.Queue.bindOkQueue.returnType="voidQueue";
_40c.Queue.bindOkQueue.index=21;
_40c.Queue.bindOkQueue.classIndex=50;
_40c.Queue.bindOkQueue.synchronous=true;
_40c.Queue.bindOkQueue.hasContent=false;
_40c.Queue.unbindQueue={};
_40c.Queue.unbindQueue.allParameters=[{"name":"reserved1","type":"Short"},{"name":"queue","type":"QueueName"},{"name":"exchange","type":"ExchangeName"},{"name":"routingKey","type":"Shortstr"},{"name":"arguments","type":"Table"}];
_40c.Queue.unbindQueue.returnType="UnbindOkQueue";
_40c.Queue.unbindQueue.index=50;
_40c.Queue.unbindQueue.classIndex=50;
_40c.Queue.unbindQueue.synchronous=true;
_40c.Queue.unbindQueue.hasContent=false;
_40c.Queue.unbindOkQueue={};
_40c.Queue.unbindOkQueue.allParameters=[];
_40c.Queue.unbindOkQueue.returnType="voidQueue";
_40c.Queue.unbindOkQueue.index=51;
_40c.Queue.unbindOkQueue.classIndex=50;
_40c.Queue.unbindOkQueue.synchronous=true;
_40c.Queue.unbindOkQueue.hasContent=false;
_40c.Queue.purgeQueue={};
_40c.Queue.purgeQueue.allParameters=[{"name":"reserved1","type":"Short"},{"name":"queue","type":"QueueName"},{"name":"noWait","type":"NoWait"}];
_40c.Queue.purgeQueue.returnType="PurgeOkQueue";
_40c.Queue.purgeQueue.index=30;
_40c.Queue.purgeQueue.classIndex=50;
_40c.Queue.purgeQueue.synchronous=true;
_40c.Queue.purgeQueue.hasContent=false;
_40c.Queue.purgeOkQueue={};
_40c.Queue.purgeOkQueue.allParameters=[{"name":"messageCount","type":"MessageCount"}];
_40c.Queue.purgeOkQueue.returnType="voidQueue";
_40c.Queue.purgeOkQueue.index=31;
_40c.Queue.purgeOkQueue.classIndex=50;
_40c.Queue.purgeOkQueue.synchronous=true;
_40c.Queue.purgeOkQueue.hasContent=false;
_40c.Queue.deleteQueue={};
_40c.Queue.deleteQueue.allParameters=[{"name":"reserved1","type":"Short"},{"name":"queue","type":"QueueName"},{"name":"ifUnused","type":"Bit"},{"name":"ifEmpty","type":"Bit"},{"name":"noWait","type":"NoWait"}];
_40c.Queue.deleteQueue.returnType="DeleteOkQueue";
_40c.Queue.deleteQueue.index=40;
_40c.Queue.deleteQueue.classIndex=50;
_40c.Queue.deleteQueue.synchronous=true;
_40c.Queue.deleteQueue.hasContent=false;
_40c.Queue.deleteOkQueue={};
_40c.Queue.deleteOkQueue.allParameters=[{"name":"messageCount","type":"MessageCount"}];
_40c.Queue.deleteOkQueue.returnType="voidQueue";
_40c.Queue.deleteOkQueue.index=41;
_40c.Queue.deleteOkQueue.classIndex=50;
_40c.Queue.deleteOkQueue.synchronous=true;
_40c.Queue.deleteOkQueue.hasContent=false;
_40c.Queue.methodLookup={10:"declareQueue",11:"declareOkQueue",20:"bindQueue",21:"bindOkQueue",50:"unbindQueue",51:"unbindOkQueue",30:"purgeQueue",31:"purgeOkQueue",40:"deleteQueue",41:"deleteOkQueue"};
_40c.Queue.className="Queue";
_40c.Basic={};
_40c.Basic.qosBasic={};
_40c.Basic.qosBasic.allParameters=[{"name":"prefetchSize","type":"Long"},{"name":"prefetchCount","type":"Short"},{"name":"global","type":"Bit"}];
_40c.Basic.qosBasic.returnType="QosOkBasic";
_40c.Basic.qosBasic.index=10;
_40c.Basic.qosBasic.classIndex=60;
_40c.Basic.qosBasic.synchronous=true;
_40c.Basic.qosBasic.hasContent=false;
_40c.Basic.qosOkBasic={};
_40c.Basic.qosOkBasic.allParameters=[];
_40c.Basic.qosOkBasic.returnType="voidBasic";
_40c.Basic.qosOkBasic.index=11;
_40c.Basic.qosOkBasic.classIndex=60;
_40c.Basic.qosOkBasic.synchronous=true;
_40c.Basic.qosOkBasic.hasContent=false;
_40c.Basic.consumeBasic={};
_40c.Basic.consumeBasic.allParameters=[{"name":"reserved1","type":"Short"},{"name":"queue","type":"QueueName"},{"name":"consumerTag","type":"ConsumerTag"},{"name":"noLocal","type":"NoLocal"},{"name":"noAck","type":"NoAck"},{"name":"exclusive","type":"Bit"},{"name":"noWait","type":"NoWait"},{"name":"arguments","type":"Table"}];
_40c.Basic.consumeBasic.returnType="ConsumeOkBasic";
_40c.Basic.consumeBasic.index=20;
_40c.Basic.consumeBasic.classIndex=60;
_40c.Basic.consumeBasic.synchronous=true;
_40c.Basic.consumeBasic.hasContent=false;
_40c.Basic.consumeOkBasic={};
_40c.Basic.consumeOkBasic.allParameters=[{"name":"consumerTag","type":"ConsumerTag"}];
_40c.Basic.consumeOkBasic.returnType="voidBasic";
_40c.Basic.consumeOkBasic.index=21;
_40c.Basic.consumeOkBasic.classIndex=60;
_40c.Basic.consumeOkBasic.synchronous=true;
_40c.Basic.consumeOkBasic.hasContent=false;
_40c.Basic.cancelBasic={};
_40c.Basic.cancelBasic.allParameters=[{"name":"consumerTag","type":"ConsumerTag"},{"name":"noWait","type":"NoWait"}];
_40c.Basic.cancelBasic.returnType="CancelOkBasic";
_40c.Basic.cancelBasic.index=30;
_40c.Basic.cancelBasic.classIndex=60;
_40c.Basic.cancelBasic.synchronous=true;
_40c.Basic.cancelBasic.hasContent=false;
_40c.Basic.cancelOkBasic={};
_40c.Basic.cancelOkBasic.allParameters=[{"name":"consumerTag","type":"ConsumerTag"}];
_40c.Basic.cancelOkBasic.returnType="voidBasic";
_40c.Basic.cancelOkBasic.index=31;
_40c.Basic.cancelOkBasic.classIndex=60;
_40c.Basic.cancelOkBasic.synchronous=true;
_40c.Basic.cancelOkBasic.hasContent=false;
_40c.Basic.publishBasic={};
_40c.Basic.publishBasic.allParameters=[{"name":"reserved1","type":"Short"},{"name":"exchange","type":"ExchangeName"},{"name":"routingKey","type":"Shortstr"},{"name":"mandatory","type":"Bit"},{"name":"immediate","type":"Bit"}];
_40c.Basic.publishBasic.returnType="voidBasic";
_40c.Basic.publishBasic.index=40;
_40c.Basic.publishBasic.classIndex=60;
_40c.Basic.publishBasic.synchronous=false;
_40c.Basic.publishBasic.hasContent=true;
_40c.Basic.returnBasic={};
_40c.Basic.returnBasic.allParameters=[{"name":"replyCode","type":"ReplyCode"},{"name":"replyText","type":"ReplyText"},{"name":"exchange","type":"ExchangeName"},{"name":"routingKey","type":"Shortstr"}];
_40c.Basic.returnBasic.returnType="voidBasic";
_40c.Basic.returnBasic.index=50;
_40c.Basic.returnBasic.classIndex=60;
_40c.Basic.returnBasic.synchronous=false;
_40c.Basic.returnBasic.hasContent=true;
_40c.Basic.deliverBasic={};
_40c.Basic.deliverBasic.allParameters=[{"name":"consumerTag","type":"ConsumerTag"},{"name":"deliveryTag","type":"DeliveryTag"},{"name":"redelivered","type":"Redelivered"},{"name":"exchange","type":"ExchangeName"},{"name":"routingKey","type":"Shortstr"}];
_40c.Basic.deliverBasic.returnType="voidBasic";
_40c.Basic.deliverBasic.index=60;
_40c.Basic.deliverBasic.classIndex=60;
_40c.Basic.deliverBasic.synchronous=false;
_40c.Basic.deliverBasic.hasContent=true;
_40c.Basic.getBasic={};
_40c.Basic.getBasic.allParameters=[{"name":"reserved1","type":"Short"},{"name":"queue","type":"QueueName"},{"name":"noAck","type":"NoAck"}];
_40c.Basic.getBasic.returnType="GetOkBasic";
_40c.Basic.getBasic.index=70;
_40c.Basic.getBasic.classIndex=60;
_40c.Basic.getBasic.synchronous=true;
_40c.Basic.getBasic.hasContent=false;
_40c.Basic.getOkBasic={};
_40c.Basic.getOkBasic.allParameters=[{"name":"deliveryTag","type":"DeliveryTag"},{"name":"redelivered","type":"Redelivered"},{"name":"exchange","type":"ExchangeName"},{"name":"routingKey","type":"Shortstr"},{"name":"messageCount","type":"MessageCount"}];
_40c.Basic.getOkBasic.returnType="voidBasic";
_40c.Basic.getOkBasic.index=71;
_40c.Basic.getOkBasic.classIndex=60;
_40c.Basic.getOkBasic.synchronous=true;
_40c.Basic.getOkBasic.hasContent=true;
_40c.Basic.getEmptyBasic={};
_40c.Basic.getEmptyBasic.allParameters=[{"name":"reserved1","type":"Shortstr"}];
_40c.Basic.getEmptyBasic.returnType="voidBasic";
_40c.Basic.getEmptyBasic.index=72;
_40c.Basic.getEmptyBasic.classIndex=60;
_40c.Basic.getEmptyBasic.synchronous=true;
_40c.Basic.getEmptyBasic.hasContent=false;
_40c.Basic.ackBasic={};
_40c.Basic.ackBasic.allParameters=[{"name":"deliveryTag","type":"DeliveryTag"},{"name":"multiple","type":"Bit"}];
_40c.Basic.ackBasic.returnType="voidBasic";
_40c.Basic.ackBasic.index=80;
_40c.Basic.ackBasic.classIndex=60;
_40c.Basic.ackBasic.synchronous=false;
_40c.Basic.ackBasic.hasContent=false;
_40c.Basic.rejectBasic={};
_40c.Basic.rejectBasic.allParameters=[{"name":"deliveryTag","type":"DeliveryTag"},{"name":"requeue","type":"Bit"}];
_40c.Basic.rejectBasic.returnType="voidBasic";
_40c.Basic.rejectBasic.index=90;
_40c.Basic.rejectBasic.classIndex=60;
_40c.Basic.rejectBasic.synchronous=false;
_40c.Basic.rejectBasic.hasContent=false;
_40c.Basic.recoverAsyncBasic={};
_40c.Basic.recoverAsyncBasic.allParameters=[{"name":"requeue","type":"Bit"}];
_40c.Basic.recoverAsyncBasic.returnType="voidBasic";
_40c.Basic.recoverAsyncBasic.index=100;
_40c.Basic.recoverAsyncBasic.classIndex=60;
_40c.Basic.recoverAsyncBasic.synchronous=false;
_40c.Basic.recoverAsyncBasic.hasContent=false;
_40c.Basic.recoverBasic={};
_40c.Basic.recoverBasic.allParameters=[{"name":"requeue","type":"Bit"}];
_40c.Basic.recoverBasic.returnType="voidBasic";
_40c.Basic.recoverBasic.index=110;
_40c.Basic.recoverBasic.classIndex=60;
_40c.Basic.recoverBasic.synchronous=false;
_40c.Basic.recoverBasic.hasContent=false;
_40c.Basic.recoverOkBasic={};
_40c.Basic.recoverOkBasic.allParameters=[];
_40c.Basic.recoverOkBasic.returnType="voidBasic";
_40c.Basic.recoverOkBasic.index=111;
_40c.Basic.recoverOkBasic.classIndex=60;
_40c.Basic.recoverOkBasic.synchronous=true;
_40c.Basic.recoverOkBasic.hasContent=false;
_40c.Basic.methodLookup={10:"qosBasic",11:"qosOkBasic",20:"consumeBasic",21:"consumeOkBasic",30:"cancelBasic",31:"cancelOkBasic",40:"publishBasic",50:"returnBasic",60:"deliverBasic",70:"getBasic",71:"getOkBasic",72:"getEmptyBasic",80:"ackBasic",90:"rejectBasic",100:"recoverAsyncBasic",110:"recoverBasic",111:"recoverOkBasic"};
_40c.Basic.className="Basic";
_40c.Tx={};
_40c.Tx.selectTx={};
_40c.Tx.selectTx.allParameters=[];
_40c.Tx.selectTx.returnType="SelectOkTx";
_40c.Tx.selectTx.index=10;
_40c.Tx.selectTx.classIndex=90;
_40c.Tx.selectTx.synchronous=true;
_40c.Tx.selectTx.hasContent=false;
_40c.Tx.selectOkTx={};
_40c.Tx.selectOkTx.allParameters=[];
_40c.Tx.selectOkTx.returnType="voidTx";
_40c.Tx.selectOkTx.index=11;
_40c.Tx.selectOkTx.classIndex=90;
_40c.Tx.selectOkTx.synchronous=true;
_40c.Tx.selectOkTx.hasContent=false;
_40c.Tx.commitTx={};
_40c.Tx.commitTx.allParameters=[];
_40c.Tx.commitTx.returnType="CommitOkTx";
_40c.Tx.commitTx.index=20;
_40c.Tx.commitTx.classIndex=90;
_40c.Tx.commitTx.synchronous=true;
_40c.Tx.commitTx.hasContent=false;
_40c.Tx.commitOkTx={};
_40c.Tx.commitOkTx.allParameters=[];
_40c.Tx.commitOkTx.returnType="voidTx";
_40c.Tx.commitOkTx.index=21;
_40c.Tx.commitOkTx.classIndex=90;
_40c.Tx.commitOkTx.synchronous=true;
_40c.Tx.commitOkTx.hasContent=false;
_40c.Tx.rollbackTx={};
_40c.Tx.rollbackTx.allParameters=[];
_40c.Tx.rollbackTx.returnType="RollbackOkTx";
_40c.Tx.rollbackTx.index=30;
_40c.Tx.rollbackTx.classIndex=90;
_40c.Tx.rollbackTx.synchronous=true;
_40c.Tx.rollbackTx.hasContent=false;
_40c.Tx.rollbackOkTx={};
_40c.Tx.rollbackOkTx.allParameters=[];
_40c.Tx.rollbackOkTx.returnType="voidTx";
_40c.Tx.rollbackOkTx.index=31;
_40c.Tx.rollbackOkTx.classIndex=90;
_40c.Tx.rollbackOkTx.synchronous=true;
_40c.Tx.rollbackOkTx.hasContent=false;
_40c.Tx.methodLookup={10:"selectTx",11:"selectOkTx",20:"commitTx",21:"commitOkTx",30:"rollbackTx",31:"rollbackOkTx"};
_40c.Tx.className="Tx";
var _40d={10:_40c.Connection,20:_40c.Channel,40:_40c.Exchange,50:_40c.Queue,60:_40c.Basic,90:_40c.Tx};
var _40e={"startConnection":_40c.Connection.startConnection,"startOkConnection":_40c.Connection.startOkConnection,"secureConnection":_40c.Connection.secureConnection,"secureOkConnection":_40c.Connection.secureOkConnection,"tuneConnection":_40c.Connection.tuneConnection,"tuneOkConnection":_40c.Connection.tuneOkConnection,"openConnection":_40c.Connection.openConnection,"openOkConnection":_40c.Connection.openOkConnection,"closeConnection":_40c.Connection.closeConnection,"closeOkConnection":_40c.Connection.closeOkConnection,"openChannel":_40c.Channel.openChannel,"openOkChannel":_40c.Channel.openOkChannel,"flowChannel":_40c.Channel.flowChannel,"flowOkChannel":_40c.Channel.flowOkChannel,"closeChannel":_40c.Channel.closeChannel,"closeOkChannel":_40c.Channel.closeOkChannel,"declareExchange":_40c.Exchange.declareExchange,"declareOkExchange":_40c.Exchange.declareOkExchange,"deleteExchange":_40c.Exchange.deleteExchange,"deleteOkExchange":_40c.Exchange.deleteOkExchange,"declareQueue":_40c.Queue.declareQueue,"declareOkQueue":_40c.Queue.declareOkQueue,"bindQueue":_40c.Queue.bindQueue,"bindOkQueue":_40c.Queue.bindOkQueue,"unbindQueue":_40c.Queue.unbindQueue,"unbindOkQueue":_40c.Queue.unbindOkQueue,"purgeQueue":_40c.Queue.purgeQueue,"purgeOkQueue":_40c.Queue.purgeOkQueue,"deleteQueue":_40c.Queue.deleteQueue,"deleteOkQueue":_40c.Queue.deleteOkQueue,"qosBasic":_40c.Basic.qosBasic,"qosOkBasic":_40c.Basic.qosOkBasic,"consumeBasic":_40c.Basic.consumeBasic,"consumeOkBasic":_40c.Basic.consumeOkBasic,"cancelBasic":_40c.Basic.cancelBasic,"cancelOkBasic":_40c.Basic.cancelOkBasic,"publishBasic":_40c.Basic.publishBasic,"returnBasic":_40c.Basic.returnBasic,"deliverBasic":_40c.Basic.deliverBasic,"getBasic":_40c.Basic.getBasic,"getOkBasic":_40c.Basic.getOkBasic,"getEmptyBasic":_40c.Basic.getEmptyBasic,"ackBasic":_40c.Basic.ackBasic,"rejectBasic":_40c.Basic.rejectBasic,"recoverAsyncBasic":_40c.Basic.recoverAsyncBasic,"recoverBasic":_40c.Basic.recoverBasic,"recoverOkBasic":_40c.Basic.recoverOkBasic,"selectTx":_40c.Tx.selectTx,"selectOkTx":_40c.Tx.selectOkTx,"commitTx":_40c.Tx.commitTx,"commitOkTx":_40c.Tx.commitOkTx,"rollbackTx":_40c.Tx.rollbackTx,"rollbackOkTx":_40c.Tx.rollbackOkTx};
var _40f=function(_410){
this.array=_410||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=ByteOrder.BIG_ENDIAN;
this.bitCount=0;
};
_40f.prototype=new ByteBuffer();
var _411=function(_412,_413){
if(!_412){
throw (new Error(_413));
}
};
var _414={"octet":"Unsigned","short":"UnsignedShort","long":"UnsignedInt","longlong":"UnsignedLong","int":"Int","table":"Table","longstr":"LongString","shortstr":"ShortString","bit":"Bit","fieldtable":"FieldTable"};
var _415={"F":"fieldtable","S":"longstr","I":"int"};
var _416={"longstr":"S","int":"I"};
var _417=function(_418,_419){
var _41a=new _40f();
_41a.putShortString("LOGIN");
_41a.putTypeIdentifier("longstr");
_41a.putLongString(_418);
_41a.putShortString("PASSWORD");
_41a.putTypeIdentifier("longstr");
_41a.putLongString(_419);
_41a.rewind();
var len=_41a.remaining();
var _41c=[];
for(var i=0;i<len;i++){
_41c.push(String.fromCharCode(_41a.getUnsigned()));
}
return _41c.join("");
};
var _41e=function(_41f,_420){
throw (new Error("not implemented"));
};
_40f.prototype.getLongString=function(){
var len=this.getUnsignedInt();
var _422=[];
for(var i=0;i<len;i++){
_422.push(String.fromCharCode(this.getUnsigned()));
}
return _422.join("");
};
_40f.prototype.getShortString=function(){
var len=this.getUnsigned();
var _425=[];
for(var i=0;i<len;i++){
_425.push(String.fromCharCode(this.getUnsigned()));
}
return _425.join("");
};
_40f.prototype.getTypeIdentifier=function(){
var i=this.getUnsigned();
return _415[String.fromCharCode(i)];
};
_40f.prototype.putTypeIdentifier=function(type){
var ti=_416[type];
this.putUnsigned(ti.charCodeAt(0));
};
_40f.prototype.getFieldValue=function(){
var _42a=this.getUnsigned();
switch(String.fromCharCode(_42a)){
case "t":
return !!this.getUnsigned();
default:
throw new Error("Decoding Error in AmqpBuffer: cannot decode field value");
}
};
_40f.prototype.getFieldTable=function(){
var l=this.getUnsignedInt();
var ft={};
var _42d=this.position;
while(l>(this.position-_42d)){
var key=this.getShortString();
var _42f=this.getFieldValue();
ft[key]=_42f;
}
return ft;
};
_40f.prototype.getTable=function(){
var _430=[];
var len=this.getUnsignedInt();
var _432=new _40f(this.array.slice(this.position,this.position+len));
this.position+=len;
while(_432.remaining()){
var kv={};
kv.key=_432.getShortString();
var ti=_432.getTypeIdentifier();
kv.value=_432["get"+_414[ti]]();
_430.push(kv);
}
return _430;
};
_40f.prototype.getBit=function(_435){
return this.getUnsigned();
};
_40f.prototype.putBit=function(v){
if(this.bitCount>0){
var _437=this.array[this.position-1];
_437=v<<this.bitCount|_437;
this.array[this.position-1]=_437;
}else{
this.putUnsigned(v);
}
};
_40f.prototype.putUnsignedLong=function(v){
this.putInt(0);
return this.putUnsignedInt(v);
};
_40f.prototype.getUnsignedLong=function(v){
this.getInt();
return this.getUnsignedInt();
};
_40f.prototype.putLongString=function(s){
this.putUnsignedInt(s.length);
for(var i=0;i<s.length;i++){
this.putUnsigned(s.charCodeAt(i));
}
};
_40f.prototype.putShortString=function(s){
this.putUnsigned(s.length);
for(var i=0;i<s.length;i++){
this.putUnsigned(s.charCodeAt(i));
}
};
_40f.prototype.putTable=function(_43e){
if(!_43e){
this.putUnsignedInt(0);
return this;
}
var _43f=new _40f();
for(var i=0;i<_43e.length;i++){
var _441=_43e[i];
_43f.putShortString(_441.key);
_43f.putTypeIdentifier(_441.type);
_43f["put"+_414[_441.type]](_441.value);
}
_43f.rewind();
this.putUnsignedInt(_43f.remaining());
this.putBuffer(_43f);
return this;
};
_40f.prototype.getFrameHeader=function(){
var _442=this.getUnsigned();
var _443=this.getUnsignedShort();
var size=this.getUnsignedInt();
var _445={};
_445.type=_442;
_445.size=size;
_445.channel=_443;
return _445;
};
_40f.prototype.getFrame=function(){
var pos=this.position;
var _447={};
if(this.remaining()>7){
_447.header=this.getFrameHeader();
_447.channel=_447.header.channel;
_447.type=_447.header.type;
if(this.remaining()>=_447.header.size+1){
switch(_447.type){
case _40a.FRAME_BODY.value:
var body=new _40f(this.array.slice(this.position,this.position+_447.header.size));
this.position+=_447.header.size;
_447.body=body;
_447.methodName="body";
break;
case _40a.FRAME_HEADER.value:
var _449=this.getUnsignedShort();
var _44a=this.getUnsignedShort();
var _44b=this.getUnsignedLong();
_447.contentProperties=this.getContentProperties();
_447.methodName="header";
break;
case _40a.FRAME_METHOD.value:
var _449=this.getUnsignedShort();
var _44c=this.getUnsignedShort();
var _44d=_40d[_449].className;
var _44e=_40d[_449].methodLookup[_44c];
var _44f=_40d[_449][_44e];
var _450=_40d[_449][_44e].allParameters;
_447.methodName=_44e;
_447.args=this.getMethodArguments(_450);
break;
default:
throw (new Error("getFrame: This AMQP frame type is unknown or has not been implemented"));
}
_411((this.getUnsigned()===_40a.FRAME_END.value),"AMQP: Frame terminator missing");
}else{
this.position=pos;
return null;
}
return _447;
}
return null;
};
_40f.prototype.putFrame=function(type,_452,_453){
this.putUnsigned(type);
this.putUnsignedShort(_452);
var size=_453.remaining();
this.putUnsignedInt(size);
this.putBuffer(_453);
this.putUnsigned(_40a.FRAME_END.value);
return this;
};
_40f.prototype.putMethodFrame=function(_455,_456,args){
var _458=new _40f();
_458.putUnsignedShort(_455.classIndex);
_458.putUnsignedShort(_455.index);
_458.putMethodArguments(args,_455.allParameters);
_458.flip();
return this.putFrame(_40a.FRAME_METHOD.value,_456,_458);
};
_40f.prototype.putHeaderFrame=function(_459,_45a,_45b,_45c,_45d){
var _45e=new _40f();
_45e.putUnsignedShort(_45a);
_45e.putUnsignedShort(_45b);
_45e.putUnsignedLong(_45c);
_45e.putContentProperties(_45d);
_45e.flip();
return this.putFrame(_40a.FRAME_HEADER.value,_459,_45e);
};
_40f.prototype.putBodyFrame=function(_45f,_460){
return this.putFrame(_40a.FRAME_BODY.value,_45f,_460);
};
_40f.prototype.putHeartbeat=function(){
throw (new Error("not implemented"));
};
_40f.prototype.putMethodArguments=function(args,_462){
for(var i=0;i<_462.length;i++){
var p=_462[i];
var _465=p.type;
var _466=_40b[_465];
if(_466){
var type=_466.type;
}else{
throw (new Error("Unknown AMQP domain "+_465));
}
this["put"+_414[type]](args[i]);
this.bitCount=(type==="bit")?this.bitCount+1:0;
}
return this;
};
_40f.prototype.getMethodArguments=function(_468){
var _469=[];
for(var i=0;i<_468.length;i++){
var p=_468[i];
var _46c=p.type;
var type=_40b[_46c].type;
var arg={};
arg.type=type;
arg.name=p.name;
try{
var v=this["get"+_414[type]]();
}
catch(e){
throw (new Error("type codec failed for type "+type+" for domain "+_46c));
}
this.bitCount=(type==="bit")?this.bitCount+1:0;
arg.value=v;
_469.push(arg);
}
return _469;
};
_40f.prototype.putArgument=function(_470,arg){
var _472=_40b[_470];
if(_472){
var type=_472.type;
}else{
throw (new Error("Unknown AMQP domain "+dtype));
}
this["put"+_414[type]](arg);
};
_40f.prototype.getArgument=function(type){
try{
return this["get"+_414[type]]();
}
catch(e){
throw (new Error("type codec failed for type "+type+" for domain "+dtype));
}
};
_40f.prototype.getContentProperties=function(){
var _475={};
var _476=[];
var _477=this.getUnsignedShort();
for(var i=0;i<=16;i++){
var bit=(_477>>(i))&1;
if(bit){
_476.unshift(i+1);
}
}
for(var i=0;i<_476.length;i++){
var k=16-_476[i];
var _47b=_basicProperties[k].name;
var _47c=_basicProperties[k].domain;
var _47d=_40b[_47c];
_475[_47b]=this.getArgument(_47d.type);
}
return _475;
};
_40f.prototype.putContentProperties=function(_47e){
if(!_47e){
return this.putUnsignedShort(0);
}
var _47f=0;
var _480=[];
for(var i=0;i<_basicProperties.length;i++){
var _482=_basicProperties[i].name;
var _483=_basicProperties[i].domain;
var _484=_47e[_482];
if(typeof (_484)!=="undefined"){
_480.push({"propertyName":_482,"propertyValue":_484,"domain":_483});
_47f=_47f<<1|1;
}else{
_47f=_47f<<1;
}
}
_47f=_47f<<2;
this.putUnsignedShort(_47f);
for(var i=0;i<_480.length;i++){
var _485=_480[i];
var _486=_485.domain;
this.putArgument(_486,_485.propertyValue);
}
return this;
};
AmqpClient.prototype=new _3fa();
var _487=AmqpClient.prototype;
_487.CLOSED=0;
_487.OPEN=1;
_487.CONNECTING=2;
_487.getReadyState=function(){
return this._readyState;
};
_487.setReadyState=function(_488){
this._readyState=_488;
};
_487.onopen=function(e){
};
_487.onclose=function(e){
};
var _411=function(_48b,_48c){
if(!_48b){
throw (new Error(_48c));
}
};
_487._init=function(){
this._initAsyncClient();
this._buffer=new _40f();
this._channels={};
this._channelCount=0;
this._stateMachine.addState("handshaking",[{"inputs":["startConnectionFrame"],"targetState":"starting"},{"inputs":["closeConnectionFrame"],"targetState":"closing"}],_48d);
this._stateMachine.addState("starting",[{"inputs":["startOkConnectionAction"],"targetState":"started"}],_48e);
this._stateMachine.addState("started",[{"inputs":["tuneConnectionFrame"],"targetState":"tuning"}]);
this._stateMachine.addState("tuning",[{"inputs":["tuneOkConnectionAction"],"targetState":"tuned"}],_48f,_490);
this._stateMachine.addState("tuned",[{"inputs":["openConnectionAction"],"targetState":"opening"}]);
this._stateMachine.addState("opening",[{"inputs":["openOkConnectionFrame"],"targetState":"ready"}],_491,_492);
this._stateMachine.addState("ready",[{"inputs":["openOkChannelFrame","closeChannelFrame","closeOkChannelFrame","flowOkChannelFrame","flowChannelFrame","declareOkExchangeFrame","declareOkQueueFrame","bindOkQueueFrame","unbindOkQueueFrame","deleteOkQueueFrame","deleteOkExchangeFrame","commitOkTxFrame","rollbackOkTxFrame","selectOkTxFrame","purgeOkQueueFrame","cancelOkBasicFrame","getOkBasicFrame","getEmptyBasicFrame","consumeOkBasicFrame","recoverOkBasicFrame","rejectOkBasicFrame","deliverBasicFrame","bodyFrame","headerFrame"],"targetState":"ready"},{"inputs":["closeConnectionFrame","closeConnectionAction"],"targetState":"closing"}],_493);
this._stateMachine.addState("closing",[{"inputs":["closeOkConnectionFrame","closeOkConnectionAction"],"targetState":"closed"}],null,null);
this._stateMachine.addState("closed",[],_494,null);
};
var _495={"0-9-1":[65,77,81,80,0,0,9,1]};
_487.connect=function connect(url,_497,_498,_499,cb,_49b){
if(this._socket){
throw (new Error("AmqpClient already connected."));
}
var url0;
if(typeof (url)==="string"){
url0=[url];
}else{
url0=url;
}
this.setReadyState(this.CONNECTING);
var args={"url":url0[0],"virtualHost":_497,"credentials":_498};
this._openContinuation=cb;
this._openErrorCb=_49b;
this._version=_499||"0-9-1";
this._hasNegotiated=false;
if(typeof (_495[this._version])==="undefined"){
throw new Error("AMQP version "+_499+" not available. Available versions are '0-9-1'");
}
if(this._options.autoReconnect){
this._session={};
this._session.lastFailoverLocationIndex=1;
this._session.failoverLocations=url0;
this._session.url=url0;
this._session.virtualHost=_497;
this._session.credentials=_498;
this._session.replay=false;
this._session.reconnectMode=false;
this._session.replayActionList=new _49e();
this._session.replayActionsCount=0;
this._session.retryAttemptNumber=0;
}
_reconnect(this,url0[0],_497,_498);
};
_487.disconnect=function disconnect(){
if(this._options.autoReconnect){
this._session.terminated=true;
}
if(this.getReadyState()==this.OPEN){
_49f(this,0,"",0,0);
}
if(this.getReadyState()==this.CONNECTING){
var _4a0={};
_4a0.methodName="closeConnection";
_4a0.type="closeConnection";
_4a0.args="";
var e=new AmqpEvent(this,_4a0);
this.dispatchEvent(e);
}
this.setReadyState(this.CLOSED);
};
_487.openChannel=function _4a2(cb,_4a4){
var id=++this._channelCount;
var _4a6=new _4a7();
_4a8(_4a6,id,this,cb,_4a4);
this._channels[id]=_4a6;
return _4a6;
};
var _4a9=function(_4aa){
var _4ab=new ByteBuffer(_495[_4aa._version]);
_4aa._socket.send(_4ab);
};
var _4ac=function(_4ad){
_494(_4ad);
};
var _4ae=function(s,b){
if(b.remaining()<s.length){
return false;
}else{
var lim=b.limit;
b.limit=s.length;
var _4b2=b.getString(Charset.UTF8);
b.limit=lim;
return s===_4b2;
}
};
var _4b3=function(_4b4,e){
var buf=_4b4._buffer;
buf.mark();
buf.position=buf.limit;
buf.putBuffer(e.data);
buf.reset();
if(!_4b4._hasNegotiated&&buf.remaining()>7){
if(_4ae("AMQP",buf)){
var _4b7=[buf.get(),buf.get(),buf.get(),buf.get()];
var _4b8={"args":[{"name":"replyText","value":"Server does not support AMQP protocol versions after "+_4b7[2]+"-"+_4b7[3]}],"methodName":"closeOkConnection"};
_494(_4b4,"",_4b8);
}else{
buf.reset();
_4b4._hasNegotiated=true;
}
}
var _4b9=null;
while(_4b9=buf.getFrame()){
var f=_4b9;
_4b4._stateMachine.feedInput(f.methodName+"Frame",f);
}
buf.compact();
};
var _4bb=function(_4bc,_4bd){
_4bc._socket.send(_4bd);
};
var _4be=function write(_4bf,_4c0,_4c1,args){
var buf=new _40f();
var _4c4=_4c0.classIndex;
buf.putMethodFrame(_4c0,_4c1,args);
buf.flip();
_4bb(_4bf,buf);
};
var _48d=function _48d(_4c5,_4c6,args,_4c8){
var _4c9=new ByteSocket(args.url);
_4c9.onopen=function(){
_4a9(_4c5);
};
_4c9.onclose=function(){
_4ac(_4c5);
};
_4c9.onmessage=function(e){
_4b3(_4c5,e);
};
_4c5._socket=_4c9;
_4c5._virtualHost=args.virtualHost;
_4c5._credentialsOrKey=args.credentials;
};
var _4cb=null;
var _48e=function(_4cc,_4cd,_4ce){
_411((_4ce.channel===0),_40a.UNEXPECTED_FRAME.message);
var buf=new _40f();
var _4d0=new AmqpArguments();
_4d0.addLongString("library","KaazingAmqpClient");
_4d0.addLongString("library_version","9.06");
_4d0.addLongString("library_platform","JavaScript");
var _4d1=_4cc._locale||"en_US";
var _4d2="AMQPLAIN";
var _4d3=_4cc._credentialsOrKey;
if(typeof (_4d3.resolve)!="function"){
var _4d4=_417(_4d3.username,_4d3.password);
_4cb(_4cc,_4d0,_4d2,_4d4,_4d1);
}else{
_4d3.resolve(function(_4d5){
var _4d6=_417(_4d5.username,_4d5.password);
_4cb(_4cc,_4d0,_4d2,_4d6,_4d1);
});
}
};
var _48f=function(_4d7,_4d8,_4d9){
_411((_4d9.channel===0),_40a.UNEXPECTED_FRAME.message);
var _4da=_4d9.args[0].value;
var _4db=_4d9.args[1].value;
var _4dc=0;
_4dd(_4d7,_4da,_4db,_4dc);
_4de(_4d7,_4d7._virtualHost,_4d7._openContinuation,_4d7._openErrorCb);
};
var _492=function _492(_4df,_4e0,_4e1){
if(_4e0==="nowaitAction"){
_4df._waitingAction=null;
return;
}
var _4e2={};
if(_4e1.methodName=="openOkConnection"){
_4e2=_4df;
}else{
_4e2=_4df._connection;
}
var e=new AmqpEvent(_4df,_4e1);
if(_4df._waitingAction){
if(_4e0==="closeChannelFrame"){
_4df._waitingAction.error(e);
}else{
if(_4e1.methodName=="openOkConnection"){
_4e2.setReadyState(_4e2.OPEN);
if(_4e2._options.autoReconnect&&!_4e2._session.terminated&&_4e2._session.replay==true){
_4e2._session.reconnectMode=true;
for(var id in _4e2._channels){
_4a2(_4e2._channels[id],[null,null]);
}
_4e2._session.replayActionList._processAllActions();
for(var id in _4e2._channels){
if(_4e2._channels[id].flowFlag==="undefined"){
_4e2._channels[id].flowFlag=true;
}
_4e2._channels[id].flowChannel(_4e2._channels[id].flowFlag);
_4e2._session.replayActionsCount++;
}
}else{
for(var id in _4e2._channels){
_4a2(_4e2._channels[id],[_4e2._channels[id]._callbacks,null]);
}
}
}else{
_4df._waitingAction.continuation(e);
}
}
_4df._waitingAction=null;
}else{
throw (new Error("AmqpClient not in waiting state: protocol violation"));
}
if(_4e2._options.autoReconnect){
if(_4e1.methodName=="openOkConnection"||_4e1.methodName=="openOkChannel"){
_4e2._session.replayActionsCount++;
}
}
if(!_4e2._options.autoReconnect){
_4df.dispatchEvent(e);
}else{
if(!_4e2._session.reconnectMode){
_4df.dispatchEvent(e);
if(_4e1.methodName=="openOkConnection"){
_4e2._openContinuation();
}
}else{
_4e2._session.replayActionsCount--;
if(_4e2._session.replayActionsCount==0){
_4e2._openContinuation();
_4e2._session.reconnectMode=!_4e2._session.reconnectMode;
_4e2._session.replayActionList._processAllNewActions();
}
}
}
};
var _490=function _490(_4e5,_4e6,_4e7){
var _4e8=_4e5;
setTimeout(function(){
_4e8._processActions();
},0);
};
var _493=function openHandler(_4e9,_4ea,_4eb){
if(_4eb.channel===0){
}else{
if(_4e9._channels[_4eb.channel]){
var _4ec=_4e9._channels[_4eb.channel];
_4ed(_4ec,_4ea,_4eb);
}else{
}
}
};
var _4ee=function _4ee(_4ef,_4f0,_4f1){
};
var _494=function _494(_4f2,_4f3,_4f4){
if(!(_4f2.getReadyState()==_4f2.CONNECTING)){
var e;
if(typeof (_4f4)==="undefined"){
e=new AmqpEvent(_4f2,{"args":[],"methodName":"closeOkConnection"});
}else{
_4f4.methodName="closeOkConnection";
e=new AmqpEvent(_4f2,_4f4);
}
_4f2.dispatchEvent(e);
}
if(_4f2._options.autoReconnect&&!_4f2._session.terminated){
if(_4f2._readyState!=_4f2.CONNECTING){
_4f2._session.replayActionsCount=_4f2._session.replayActionList.getActionList().length;
_4f2._session.replayActionList.setReplayLength(_4f2._session.replayActionsCount);
}
_4f2.setReadyState(_4f2.CONNECTING);
_attemptReconnect(_4f2);
}else{
_4f2.setReadyState(_4f2.CLOSED);
if(typeof (_4f2._channels)!=="undefined"){
for(var i in _4f2._channels){
var _4f7=_4f2._channels[i];
_4f7.dispatchEvent(e);
}
_4f2._socket.onclose=function(){
};
_4f2._socket.close();
}
if(typeof (_4f2._openErrorCb)!=="undefined"){
_4f2._openErrorCb(e);
}
}
};
function _attemptReconnect(_4f8){
_4f8._session.replay=true;
var _4f9=_4f8._session;
var args={"url":_4f9.url[1],"virtualHost":_4f9.virtualHost,"credentials":_4f9.credentials};
var _4fb=getRetryDelay(_4f8._session.retryAttemptNumber++);
_4f8._session.lastFailoverLocationIndex++;
var i=_4f8._session.lastFailoverLocationIndex%_4f8._session.failoverLocations.length;
var url=_4f8._session.failoverLocations[i];
_4f8._session.location=location;
_4f8._session.retryTimer=setTimeout(function(){
_reconnect(_4f8,url,_4f9.virtualHost,_4f9.credentials);
},_4fb);
};
function _reconnect(_4fe,url,_500,_501){
var args={"url":url,"virtualHost":_500,"credentials":_501};
_4fe._stateMachine.enterState("handshaking","",args);
};
function getRetryDelay(n){
var maxN=6;
var _505;
if(n<maxN){
_505=n*n;
}else{
_505=maxN*maxN;
}
return _505*1000;
};
var _4a8=function _4a8(_506,id,_508,cb,_50a){
_506._id=id;
_506._callbacks=cb;
_506._connection=_508;
_506._transacted=false;
_506._waitingAction=null;
_506._initAsyncClient();
_506._stateMachine.addState("channelReady",[{"inputs":["openChannelAction","closeChannelAction","consumeBasicAction","flowChannelAction","declareExchangeAction","declareQueueAction","bindQueueAction","unbindQueueAction","deleteQueueAction","deleteExchangeAction","purgeQueueAction","cancelBasicAction","recoverBasicAction","rejectBasicAction","selectTxAction","commitTxAction","rollbackTxAction",],"targetState":"waiting"},{"inputs":["publishBasicAction","ackBasicAction"],"targetState":"channelReady"},{"inputs":["getBasicAction"],"targetState":"getting"},{"inputs":["deliverBasicFrame"],"targetState":"readingContentHeader"}],_490);
_506._stateMachine.addState("getting",[{"inputs":["getOkBasicFrame"],"targetState":"readingContentHeader"},{"inputs":["getEmptyBasicFrame"],"targetState":"channelReady"},{"inputs":["closeChannelFrame"],"targetState":"closing"}],_491,_50b);
_506._stateMachine.addState("waiting",[{"inputs":["openOkChannelFrame","closeOkChannelFrame","flowOkChannelFrame","declareOkExchangeFrame","declareOkQueueFrame","bindOkQueueFrame","unbindOkQueueFrame","deleteOkQueueFrame","deleteOkExchangeFrame","purgeOkQueueFrame","cancelOkBasicFrame","recoverOkBasicFrame","rejectOkBasicFrame","commitOkTxFrame","rollbackOkTxFrame","selectOkTxFrame","getOkBasicFrame","getEmptyBasicFrame","consumeOkBasicFrame","nowaitAction"],"targetState":"channelReady"},{"inputs":["closeChannelFrame"],"targetState":"closing"}],_491,_492);
_506._stateMachine.addState("readingContentHeader",[{"inputs":["headerFrame"],"targetState":"readingContentBody"}],_50c,_50d);
_506._stateMachine.addState("readingContentBody",[{"inputs":["bodyFrame"],"targetState":"channelReady"}],null,_50e);
_506._stateMachine.addState("closing",[{"inputs":["closeOkChannelAction"],"targetState":"closed"}],null);
_506._stateMachine.addState("closed",null,null);
if(_508.getReadyState()==_508.OPEN){
_4a2(_506,[cb,_50a]);
}
};
var _4a7=function(){
};
_4a7.prototype=new _3fa();
var _487=_4a7.prototype;
_487._init=function(_50f){
};
var _510=function _510(_511,_512,_513,args,body,_516){
var buf=new _40f();
var _518=_512.classIndex;
buf.putMethodFrame(_512,_513,args);
if(_512.hasContent){
var _519=0;
buf.putHeaderFrame(_513,_518,_519,body.remaining(),_516);
if(body.remaining()>0){
buf.putBodyFrame(_513,body);
}
}
buf.flip();
_4bb(_511._connection,buf);
};
var _4ed=function _4ed(_51a,_51b,_51c){
_51a._stateMachine.feedInput(_51b,_51c);
};
var _50e=function _50e(_51d,_51e,_51f){
_51f.args=_51d._headerFrame.args;
_51f.methodName=_51d._headerFrame.methodName;
var e=new AmqpEvent(_51d,_51f,_51d._headerFrame.contentProperties);
if(_51f.methodName==="getOkBasic"){
_51d._waitingAction.continuation(e);
}
_51d.dispatchEvent(e);
};
var _50c=function _50c(_521,_522,_523){
_521._headerFrame=_523;
};
var _50d=function _50d(_524,_525,_526){
_524._headerFrame.contentProperties=_526.contentProperties;
};
var _50b=function(_527,_528,_529){
var e=new AmqpEvent(_527,_529);
if(_527._waitingAction){
if(_528==="closeChannelFrame"){
_527._waitingAction.error(e);
_527.dispatchEvent(e);
_527._waitingAction=null;
}else{
if(_528==="getEmptyBasicFrame"){
_527._waitingAction.continuation(e);
_527.dispatchEvent(e);
_527._waitingAction=null;
}
}
}else{
throw new Error("AmqpClient not in waiting state: protocol violation");
}
};
var _491=function _491(_52b,_52c,_52d){
var _52e=_52d.args[1];
if(_52e.synchronous){
_52b._waitingAction=_52d;
}else{
throw (new Error("AMQP: trying to enter wait state for method that is not sychronous"));
}
};
_4a7.prototype.flowFlag=true;
_4a7.prototype.onmessage=function(e){
};
_4a7.prototype.onclose=function(e){
};
_4a7.prototype.onopen=function(e){
};
_4a7.prototype.ondeclarequeue=function(e){
};
_4a7.prototype.ondeclareexchange=function(e){
};
_4a7.prototype.onflow=function(e){
};
_4a7.prototype.onbindqueue=function(e){
};
_4a7.prototype.onunbindqueue=function(e){
};
_4a7.prototype.ondeletequeue=function(e){
};
_4a7.prototype.ondeleteexchange=function(e){
};
_4a7.prototype.onconsume=function(e){
};
_4a7.prototype.oncancel=function(e){
};
_4a7.prototype.oncommittransaction=function(e){
};
_4a7.prototype.onrollbacktransaction=function(e){
};
_4a7.prototype.onselecttransaction=function(e){
};
_4a7.prototype.onget=function(e){
};
_4a7.prototype.onpurgequeue=function(e){
};
_4a7.prototype.onrecover=function(e){
};
_4a7.prototype.onreject=function(e){
};
var _4cb=function(_542,_543,_544,_545,_546,_547,_548){
var args=[_543,_544,_545,_546];
var _54a="startOkConnection";
_542._enqueueAction(_54a,_4be,[_542,_40e[_54a],0,args],_547,_548);
return _542;
};
var _54b=function(_54c,_54d,_54e,_54f){
var args=[_54d];
var _551="secureOkConnection";
_54c._enqueueAction(_551,_4be,[_54c,_40e[_551],0,args],_54e,_54f);
return _54c;
};
var _4dd=function(_552,_553,_554,_555,_556,_557){
var args=[_553,_554,_555];
var _559="tuneOkConnection";
_552._enqueueAction(_559,_4be,[_552,_40e[_559],0,args],_556,_557);
return _552;
};
var _4de=function(_55a,_55b,_55c,_55d){
var args=[_55b,0,0];
var _55f="openConnection";
_55a._enqueueAction(_55f,_4be,[_55a,_40e[_55f],0,args],_55c,_55d);
return _55a;
};
var _49f=function(_560,_561,_562,_563,_564,_565,_566){
var args=[_561,_562,_563,_564];
var _568="closeConnection";
_560._enqueueAction(_568,_4be,[_560,_40e[_568],0,args],_565,_566);
return _560;
};
var _569=function(_56a,_56b,_56c){
var args=[];
var _56e="closeOkConnection";
_56a._enqueueAction(_56e,_4be,[_56a,_40e[_56e],0,args],_56b,_56c);
return _56a;
};
_4a7.prototype.openChannel=function(_56f,_570){
var args=[0];
var _572="openChannel";
var _573=_40e[_572];
var _574=false;
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_572,_510,[this,_573,this._id,args],_56f,_570);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_572,this,this._enqueueAction,[_572,_510,[this,_573,this._id,args],_56f,_570]);
}
if(_572=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_574){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.flowChannel=function(_575,_576,_577){
var args=[_575];
var _579="flowChannel";
var _57a=_40e[_579];
var _57b=false;
for(var i=0;i<_57a.allParameters.length;i++){
var _57d=_57a.allParameters[i].name;
if(_57d="noWait"){
_57b=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_579,_510,[this,_57a,this._id,args],_576,_577);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_579,this,this._enqueueAction,[_579,_510,[this,_57a,this._id,args],_576,_577]);
}
if(_579=="flowChannel"){
_4a7.prototype.flowFlag=_575;
}
if(_57b){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.flowOkChannel=function(_57e,_57f,_580){
var args=[_57e];
var _582="flowOkChannel";
var _583=_40e[_582];
var _584=false;
for(var i=0;i<_583.allParameters.length;i++){
var _586=_583.allParameters[i].name;
if(_586="noWait"){
_584=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_582,_510,[this,_583,this._id,args],_57f,_580);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_582,this,this._enqueueAction,[_582,_510,[this,_583,this._id,args],_57f,_580]);
}
if(_582=="flowChannel"){
_4a7.prototype.flowFlag=_57e;
}
if(_584){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.closeChannel=function(_587,_588,_589,_58a,_58b,_58c){
var args=[_587,_588,_589,_58a];
var _58e="closeChannel";
var _58f=_40e[_58e];
var _590=false;
for(var i=0;i<_58f.allParameters.length;i++){
var _592=_58f.allParameters[i].name;
if(_592="noWait"){
_590=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_58e,_510,[this,_58f,this._id,args],_58b,_58c);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_58e,this,this._enqueueAction,[_58e,_510,[this,_58f,this._id,args],_58b,_58c]);
}
if(_58e=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_590){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.closeOkChannel=function(_593,_594){
var args=[];
var _596="closeOkChannel";
var _597=_40e[_596];
var _598=false;
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_596,_510,[this,_597,this._id,args],_593,_594);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_596,this,this._enqueueAction,[_596,_510,[this,_597,this._id,args],_593,_594]);
}
if(_596=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_598){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.declareExchange=function(_599,type,_59b,_59c,_59d,_59e,_59f,_5a0){
var args=[0,_599,type,_59b,_59c,0,0,_59d,_59e];
var _5a2="declareExchange";
var _5a3=_40e[_5a2];
var _5a4=false;
for(var i=0;i<_5a3.allParameters.length;i++){
var _5a6=_5a3.allParameters[i].name;
if(_5a6="noWait"){
_5a4=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5a2,_510,[this,_5a3,this._id,args],_59f,_5a0);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5a2,this,this._enqueueAction,[_5a2,_510,[this,_5a3,this._id,args],_59f,_5a0]);
}
if(_5a2=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5a4){
if(typeof (_59d)!=="undefined"&&_59d){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.deleteExchange=function(_5a7,_5a8,_5a9,_5aa,_5ab){
var args=[0,_5a7,_5a8,_5a9];
var _5ad="deleteExchange";
var _5ae=_40e[_5ad];
var _5af=false;
for(var i=0;i<_5ae.allParameters.length;i++){
var _5b1=_5ae.allParameters[i].name;
if(_5b1="noWait"){
_5af=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5ad,_510,[this,_5ae,this._id,args],_5aa,_5ab);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5ad,this,this._enqueueAction,[_5ad,_510,[this,_5ae,this._id,args],_5aa,_5ab]);
}
if(_5ad=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5af){
if(typeof (_5a9)!=="undefined"&&_5a9){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.declareQueue=function(_5b2,_5b3,_5b4,_5b5,_5b6,_5b7,_5b8,_5b9,_5ba){
var args=[0,_5b2,_5b3,_5b4,_5b5,_5b6,_5b7,_5b8];
var _5bc="declareQueue";
var _5bd=_40e[_5bc];
var _5be=false;
for(var i=0;i<_5bd.allParameters.length;i++){
var _5c0=_5bd.allParameters[i].name;
if(_5c0="noWait"){
_5be=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5bc,_510,[this,_5bd,this._id,args],_5b9,_5ba);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5bc,this,this._enqueueAction,[_5bc,_510,[this,_5bd,this._id,args],_5b9,_5ba]);
}
if(_5bc=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5be){
if(typeof (_5b7)!=="undefined"&&_5b7){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.bindQueue=function(_5c1,_5c2,_5c3,_5c4,_5c5,_5c6,_5c7){
var args=[0,_5c1,_5c2,_5c3,_5c4,_5c5];
var _5c9="bindQueue";
var _5ca=_40e[_5c9];
var _5cb=false;
for(var i=0;i<_5ca.allParameters.length;i++){
var _5cd=_5ca.allParameters[i].name;
if(_5cd="noWait"){
_5cb=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5c9,_510,[this,_5ca,this._id,args],_5c6,_5c7);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5c9,this,this._enqueueAction,[_5c9,_510,[this,_5ca,this._id,args],_5c6,_5c7]);
}
if(_5c9=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5cb){
if(typeof (_5c4)!=="undefined"&&_5c4){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.unbindQueue=function(_5ce,_5cf,_5d0,_5d1,_5d2,_5d3){
var args=[0,_5ce,_5cf,_5d0,_5d1];
var _5d5="unbindQueue";
var _5d6=_40e[_5d5];
var _5d7=false;
for(var i=0;i<_5d6.allParameters.length;i++){
var _5d9=_5d6.allParameters[i].name;
if(_5d9="noWait"){
_5d7=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5d5,_510,[this,_5d6,this._id,args],_5d2,_5d3);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5d5,this,this._enqueueAction,[_5d5,_510,[this,_5d6,this._id,args],_5d2,_5d3]);
}
if(_5d5=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5d7){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.purgeQueue=function(_5da,_5db,_5dc,_5dd){
var args=[0,_5da,_5db];
var _5df="purgeQueue";
var _5e0=_40e[_5df];
var _5e1=false;
for(var i=0;i<_5e0.allParameters.length;i++){
var _5e3=_5e0.allParameters[i].name;
if(_5e3="noWait"){
_5e1=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5df,_510,[this,_5e0,this._id,args],_5dc,_5dd);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5df,this,this._enqueueAction,[_5df,_510,[this,_5e0,this._id,args],_5dc,_5dd]);
}
if(_5df=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5e1){
if(typeof (_5db)!=="undefined"&&_5db){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.deleteQueue=function(_5e4,_5e5,_5e6,_5e7,_5e8,_5e9){
var args=[0,_5e4,_5e5,_5e6,_5e7];
var _5eb="deleteQueue";
var _5ec=_40e[_5eb];
var _5ed=false;
for(var i=0;i<_5ec.allParameters.length;i++){
var _5ef=_5ec.allParameters[i].name;
if(_5ef="noWait"){
_5ed=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5eb,_510,[this,_5ec,this._id,args],_5e8,_5e9);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5eb,this,this._enqueueAction,[_5eb,_510,[this,_5ec,this._id,args],_5e8,_5e9]);
}
if(_5eb=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5ed){
if(typeof (_5e7)!=="undefined"&&_5e7){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.qosBasic=function(_5f0,_5f1,_5f2,_5f3,_5f4){
var args=[_5f0,_5f1,_5f2];
var _5f6="qosBasic";
var _5f7=_40e[_5f6];
var _5f8=false;
for(var i=0;i<_5f7.allParameters.length;i++){
var _5fa=_5f7.allParameters[i].name;
if(_5fa="noWait"){
_5f8=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_5f6,_510,[this,_5f7,this._id,args],_5f3,_5f4);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_5f6,this,this._enqueueAction,[_5f6,_510,[this,_5f7,this._id,args],_5f3,_5f4]);
}
if(_5f6=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_5f8){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.consumeBasic=function(_5fb,_5fc,_5fd,_5fe,_5ff,_600,_601,_602,_603){
var args=[0,_5fb,_5fc,_5fd,_5fe,_5ff,_600,_601];
var _605="consumeBasic";
var _606=_40e[_605];
var _607=false;
for(var i=0;i<_606.allParameters.length;i++){
var _609=_606.allParameters[i].name;
if(_609="noWait"){
_607=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_605,_510,[this,_606,this._id,args],_602,_603);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_605,this,this._enqueueAction,[_605,_510,[this,_606,this._id,args],_602,_603]);
}
if(_605=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_607){
if(typeof (_600)!=="undefined"&&_600){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.cancelBasic=function(_60a,_60b,_60c,_60d){
var args=[_60a,_60b];
var _60f="cancelBasic";
var _610=_40e[_60f];
var _611=false;
for(var i=0;i<_610.allParameters.length;i++){
var _613=_610.allParameters[i].name;
if(_613="noWait"){
_611=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_60f,_510,[this,_610,this._id,args],_60c,_60d);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_60f,this,this._enqueueAction,[_60f,_510,[this,_610,this._id,args],_60c,_60d]);
}
if(_60f=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_611){
if(typeof (_60b)!=="undefined"&&_60b){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.publishBasic=function(body,_615,_616,_617,_618,_619,_61a,_61b){
var args=[0,_616,_617,_618,_619];
var _61d="publishBasic";
var _61e=_40e[_61d];
var _61f=false;
for(var i=0;i<_61e.allParameters.length;i++){
var _621=_61e.allParameters[i].name;
if(_621="noWait"){
_61f=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_61d,_510,[this,_61e,this._id,args,body,_615],_61a,_61b);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_61d,this,this._enqueueAction,[_61d,_510,[this,_61e,this._id,args,body,_615],_61a,_61b]);
}
if(_61d=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_61f){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.getBasic=function(_622,_623,_624,_625){
var args=[0,_622,_623];
var _627="getBasic";
var _628=_40e[_627];
var _629=false;
for(var i=0;i<_628.allParameters.length;i++){
var _62b=_628.allParameters[i].name;
if(_62b="noWait"){
_629=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_627,_510,[this,_628,this._id,args],_624,_625);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_627,this,this._enqueueAction,[_627,_510,[this,_628,this._id,args],_624,_625]);
}
if(_627=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_629){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.ackBasic=function(_62c,_62d,_62e,_62f){
var args=[_62c,_62d];
var _631="ackBasic";
var _632=_40e[_631];
var _633=false;
for(var i=0;i<_632.allParameters.length;i++){
var _635=_632.allParameters[i].name;
if(_635="noWait"){
_633=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_631,_510,[this,_632,this._id,args],_62e,_62f);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_631,this,this._enqueueAction,[_631,_510,[this,_632,this._id,args],_62e,_62f]);
}
if(_631=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_633){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.rejectBasic=function(_636,_637,_638,_639){
var args=[_636,_637];
var _63b="rejectBasic";
var _63c=_40e[_63b];
var _63d=false;
for(var i=0;i<_63c.allParameters.length;i++){
var _63f=_63c.allParameters[i].name;
if(_63f="noWait"){
_63d=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_63b,_510,[this,_63c,this._id,args],_638,_639);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_63b,this,this._enqueueAction,[_63b,_510,[this,_63c,this._id,args],_638,_639]);
}
if(_63b=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_63d){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.recoverBasic=function(_640,_641,_642){
var args=[_640];
var _644="recoverBasic";
var _645=_40e[_644];
var _646=false;
for(var i=0;i<_645.allParameters.length;i++){
var _648=_645.allParameters[i].name;
if(_648="noWait"){
_646=true;
break;
}
}
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_644,_510,[this,_645,this._id,args],_641,_642);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_644,this,this._enqueueAction,[_644,_510,[this,_645,this._id,args],_641,_642]);
}
if(_644=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_646){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_basicProperties=[{"name":"contentType","domain":"Shortstr","label":"MIME content type"},{"name":"contentEncoding","domain":"Shortstr","label":"MIME content encoding"},{"name":"headers","domain":"Table","label":"message header field table"},{"name":"deliveryMode","domain":"Octet","label":"non-persistent (1) or persistent (2)"},{"name":"priority","domain":"Octet","label":"message priority, 0 to 9"},{"name":"correlationId","domain":"Shortstr","label":"application correlation identifier"},{"name":"replyTo","domain":"Shortstr","label":"address to reply to"},{"name":"expiration","domain":"Shortstr","label":"message expiration specification"},{"name":"messageId","domain":"Shortstr","label":"application message identifier"},{"name":"timestamp","domain":"Timestamp","label":"message timestamp"},{"name":"type","domain":"Shortstr","label":"message type name"},{"name":"userId","domain":"Shortstr","label":"creating user id"},{"name":"appId","domain":"Shortstr","label":"creating application id"},{"name":"reserved","domain":"Shortstr","label":"reserved, must be empty"}];
_4a7.prototype.selectTx=function(_649,_64a){
var args=[];
var _64c="selectTx";
var _64d=_40e[_64c];
var _64e=false;
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_64c,_510,[this,_64d,this._id,args],_649,_64a);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_64c,this,this._enqueueAction,[_64c,_510,[this,_64d,this._id,args],_649,_64a]);
}
if(_64c=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_64e){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.commitTx=function(_64f,_650){
var args=[];
var _652="commitTx";
var _653=_40e[_652];
var _654=false;
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_652,_510,[this,_653,this._id,args],_64f,_650);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_652,this,this._enqueueAction,[_652,_510,[this,_653,this._id,args],_64f,_650]);
}
if(_652=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_654){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
_4a7.prototype.rollbackTx=function(_655,_656){
var args=[];
var _658="rollbackTx";
var _659=_40e[_658];
var _65a=false;
if(this._connection._readyState==this._connection.OPEN){
this._enqueueAction(_658,_510,[this,_659,this._id,args],_655,_656);
}
if(this._connection._options.autoReconnect){
this._connection._session.replayActionList._addAction(_658,this,this._enqueueAction,[_658,_510,[this,_659,this._id,args],_655,_656]);
}
if(_658=="flowChannel"){
_4a7.prototype.flowFlag=active;
}
if(_65a){
if(typeof (noWait)!=="undefined"&&noWait){
this._enqueueAction("nowait");
}
}
return this;
};
var func=_4a7.prototype.openChannel;
var _4a2=function(_65c,args){
_65c._stateMachine.enterState("channelReady","",null);
func.apply(_65c,args);
};
delete _4a7.prototype.openChannel;
var _65e=_4a7.prototype.closeOkChannel;
var _65f=function(_660,args){
_65e.apply(_660,args);
};
delete _4a7.prototype.closeOkChannel;
var _49e=function(){
this._actionList=new Array();
this.currentAction=0;
this._replayLength=0;
};
_49e.prototype.getActionList=function(){
return this._actionList;
};
_49e.prototype.setReplayLength=function(l){
this._replayLength=l;
};
_49e.prototype._processActions=function _processActions(){
if(!this._actionList.length){
return;
}
if(this.currentAction==this._actionList.length){
this.currentAction=0;
}
var _663=this._actionList[this.currentAction];
this.currentAction++;
_663.func.apply(_663.object,_663.args);
};
_49e.prototype._processAllActions=function _processAllActions(){
for(i=0;i<this._replayLength;i++){
var _664=this._actionList[i];
_664.func.apply(_664.object,_664.args);
}
};
_49e.prototype._processAllNewActions=function _processAllNewActions(){
for(i=this._replayLength;i<this._actionList.length;i++){
var _665=this._actionList[i];
_665.func.apply(_665.object,_665.args);
}
};
_49e.prototype._addAction=function _addAction(_666,_667,func,args){
switch(_666){
case "declareExchange":
break;
case "declareQueue":
break;
case "bindQueue":
break;
case "consumeBasic":
break;
default:
return;
}
var _66a=function _66a(){
};
var _66b={};
_66b.object=_667;
_66b.func=func||_66a;
_66b.args=args||null;
this._actionList.push(_66b);
};
})();
var AmqpArguments=function(){
};
AmqpArguments.prototype=new Array();
(function(){
var _66c=AmqpArguments.prototype;
var _add=function(_66e,key,_670,type){
var _672={};
_672.key=key;
_672.value=_670;
_672.type=type;
_66e.push(_672);
};
_66c.addLongString=function(key,_674){
_add(this,key,_674,"longstr");
return this;
};
_66c.addInteger=function(key,_676){
_add(this,key,_676,"int");
return this;
};
})();
(function(){
var _677=function(type){
switch(type){
case "deliverBasic":
return "message";
case "closeOkChannel":
case "closeChannel":
case "closeOkConnection":
case "closeConnection":
return "close";
case "getOkBasic":
case "getEmptyBasic":
return "get";
case "consumeOkBasic":
return "consume";
case "cancelOkBasic":
return "cancel";
case "openOkConnection":
case "openOkChannel":
return "open";
case "declareOkQueue":
return "declarequeue";
case "declareOkExchange":
return "declareexchange";
case "flowOkChannel":
return "flow";
case "bindOkQueue":
return "bindqueue";
case "unbindOkQueue":
return "unbindqueue";
case "deleteOkQueue":
return "deletequeue";
case "deleteOkExchange":
return "deleteexchange";
case "commitOkTx":
return "committransaction";
case "rollbackOkTx":
return "rollbacktransaction";
case "selectOkTx":
return "selecttransaction";
case "purgeOkQueue":
return "purgequeue";
case "recoverOkBasic":
return "recover";
case "rejectOkBasic":
return "reject";
default:
throw (new Error("AMQP: unknown event name "+type));
}
};
AmqpEvent=function(_679,_67a,_67b){
this.type=_67a.methodName;
this.type=_677(this.type);
this.args={};
for(var i=0;i<_67a.args.length;i++){
this.args[_67a.args[i].name]=_67a.args[i].value;
}
this.headers=_67b;
this.body=_67a.body;
this.channel=_679;
};
var _67d=AmqpEvent.prototype;
_67d.type;
_67d.body;
_67d.headers;
_67d.channel;
})();
