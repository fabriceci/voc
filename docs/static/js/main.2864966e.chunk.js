(this["webpackJsonpilm-vocabulary-es"]=this["webpackJsonpilm-vocabulary-es"]||[]).push([[0],{211:function(e,t,n){},262:function(e,t){},264:function(e,t){},273:function(e,t){},275:function(e,t){},301:function(e,t){},302:function(e,t){},307:function(e,t){},309:function(e,t){},333:function(e,t){},397:function(e,t,n){"use strict";n.r(t);var r=n(1),c=n(13),s=n.n(c),a=n(204),i=n.n(a),o=(n(211),n(7)),u=n.n(o),l=n(24),d=n(26),j=n(68),f=n(205),b=[],h=[],p=function(e,t){return 0===t?0:Math.round(t/e*100*100)/100};function m(){return O.apply(this,arguments)}function O(){return(O=Object(j.a)(u.a.mark((function e(){var t,n,r,c,s,a,i,o=arguments;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=o.length>0&&void 0!==o[0]&&o[0],(n=JSON.parse(localStorage.getItem("words")))&&!t){e.next=17;break}return(r=new f.GoogleSpreadsheet("1lA849BH1mhhAlnmhamfNnkXQVGJmEz_XpD5Fqbco5m0")).useApiKey("AIzaSyB3fhuMVnaW77F8ZiDu_mo_xJKdKzQo6tU"),e.next=7,r.loadInfo();case 7:return c=r.sheetsByIndex[0],e.next=10,c.getRows();case 10:s=e.sent,a=s.map((function(e){return{fr:e.fr?e.fr.trim():void 0,es:e.es?[e.es.trim()]:[],type:e.type?e.type.trim():void 0,module:e.module?e.module.trim():void 0}})),n=[],i=[],a.forEach((function(e){if(e.fr){var t,r=n.findIndex((function(t){return t.fr===e.fr}));if(-1===r)n.push(e);else(t=n[r].es).push.apply(t,Object(d.a)(e.es));e.module&&!i.includes(e.module)&&i.push(e.module)}})),localStorage.setItem("words",JSON.stringify(n)),localStorage.setItem("modules",JSON.stringify(i));case 17:h=Object(d.a)(n),b=Object(d.a)(JSON.parse(localStorage.getItem("modules")));case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var v=function(){var e=JSON.parse(localStorage.getItem("status"));return e?new Map(e):new Map},x=function(e,t){var n=v();if(n.has(e)){var r=n.get(e);r.attemps+=1,1===t?r.success+=1:r.error+=1,n.set(e,r)}else n.set(e,{attemps:1,success:1===t?1:0,error:-1===t?1:0});localStorage.setItem("status",JSON.stringify(Object(d.a)(n)))};var g=function(){var e=Object(c.useState)([]),t=Object(l.a)(e,2),n=t[0],s=t[1],a=Object(c.useState)(0),i=Object(l.a)(a,2),o=i[0],f=i[1],O=Object(c.useState)(""),g=Object(l.a)(O,2),y=g[0],S=g[1],w=Object(c.useState)(!1),k=Object(l.a)(w,2),N=k[0],C=k[1],I=Object(c.useState)(!1),E=Object(l.a)(I,2),J=E[0],M=E[1],A=Object(c.useState)("all"),L=Object(l.a)(A,2),V=L[0],z=L[1],B=Object(c.useState)("all"),D=Object(l.a)(B,2),F=D[0],G=D[1],K=Object(c.useState)(!1),_=Object(l.a)(K,2),Q=_[0],U=_[1],W=function(){var e=Object(j.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s([]),localStorage.removeItem("words"),localStorage.removeItem("modules"),e.next=5,m(!0);case 5:s(Object(d.a)(h).sort((function(){return Math.random()-.5})));case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),X=function(e){C(!0);var t=window.speechSynthesis;if(t){"string"!==typeof e&&(e=n[o].es.join(","));var r=new SpeechSynthesisUtterance(e);r.pitch=1.1,r.rate=1,r.lang="es-ES";var c=speechSynthesis.getVoices().find((function(e){return"es-ES"===e.lang}));r.voice=c,t.speak(r)}else console.error("No speech syntesis API")},q=Object(c.useCallback)((function(){var e=y.toLowerCase().trim(),t=n[o].es;""!==e.trim()&&(t.map((function(e){return e.toLowerCase()})).includes(e)?(f((function(e){return e+1===n.length?0:e+1})),S(""),C(!1),M(!1),U(!1),x(n[o].fr,N||J?-1:1)):C(!0))}),[o,n,y]);Object(c.useEffect)((function(){(function(){var e=Object(j.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m();case 2:s(Object(d.a)(h).sort((function(){return Math.random()-.5})));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(c.useEffect)((function(){var e=function(e){"@"===e.key&&M((function(e){return!0})),"Control"===e.key&&X(),"Enter"===e.key&&q()};return document.addEventListener("keydown",e),function(){document.removeEventListener("keydown",e)}}),[q]),Object(c.useEffect)((function(){!0===Q&&X("\xbfD\xf3nde est\xe1 la tilde?")}),[Q]);var H,P=function(e,t){var n=[];n="all"===e?Object(d.a)(h):h.filter((function(t){return t.module===e}));var r=v();"error"===t?n=n.filter((function(e){return!r.has(e.fr)||p(r.get(e.fr).attemps,r.get(e.fr).success)<80})):"error-only"===t&&(n=n.filter((function(e){return r.has(e.fr)&&p(r.get(e.fr).attemps,r.get(e.fr).success)<80}))),s(n)},R=function(e,t){"module"===e?(P(t,e),z(t)):(P(V,t),G(t))};if(0===n.length)return Object(r.jsxs)("div",{className:"loader",children:[Object(r.jsx)("div",{children:"chargement..."}),Object(r.jsxs)("div",{className:"lds-ripple",children:[Object(r.jsx)("div",{}),Object(r.jsx)("div",{})]})]});var T=n[o].es.map((function(e){return e.toLowerCase()})),Z=y.toLowerCase().trim();N&&(H="error"),N&&T.includes(Z)?H="success":N&&T.map((function(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"")})).includes(Z)&&(H="warning",Q||U(!0));var Y=v().get(n[o].fr);return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsxs)("div",{className:"status",children:[Object(r.jsxs)("div",{children:[o+1,"/",n.length+1]}),Object(r.jsx)("div",{children:Object(r.jsx)("div",{className:"btn btn-info btn-refresh",onClick:W,children:"mettre \xe0 jour les donn\xe9es"})}),Object(r.jsxs)("div",{children:[Object(r.jsx)("div",{children:Object(r.jsxs)("select",{value:V,onChange:function(e){return R("module",e.target.value)},children:[Object(r.jsx)("option",{value:"all",children:"Tous les modules"},"all"),b.map((function(e){return Object(r.jsx)("option",{children:e},e)}))]})}),Object(r.jsx)("div",{children:Object(r.jsxs)("select",{value:F,onChange:function(e){return R("type",e.target.value)},children:[Object(r.jsx)("option",{value:"all",children:"pas de filtre"},"all"),Object(r.jsx)("option",{value:"error",children:"nouveau et taux d'erreur > 80%"},"error"),Object(r.jsx)("option",{value:"error-only",children:"juste les erreurs"},"error-only")]})})]})]}),Object(r.jsxs)("ul",{className:"helper",children:[Object(r.jsx)("li",{children:Object(r.jsx)("kbd",{onClick:function(){return S((function(e){return e+"\xf1"}))},children:"\xf1"})}),Object(r.jsx)("li",{children:Object(r.jsx)("kbd",{onClick:function(){return S((function(e){return e+"\xe1"}))},children:"\xe1"})}),Object(r.jsx)("li",{children:Object(r.jsx)("kbd",{onClick:function(){return S((function(e){return e+"\xf3"}))},children:"\xf3"})}),Object(r.jsx)("li",{children:Object(r.jsx)("kbd",{onClick:function(){return S((function(e){return e+"\xed"}))},children:"\xed"})})]}),Object(r.jsxs)("div",{className:"statistics",children:[Y?p(Y.attemps,Y.success)+" % de r\xe9ussite":"nouveau"," | ",n[o].module," "]}),Object(r.jsx)("div",{className:"currentWord alert alert-info",children:n[o].fr}),Object(r.jsxs)("div",{className:"input-group mb-3",style:{width:"100%"},children:[Object(r.jsx)("input",{style:{flexGrow:1,padding:"0 15px"},className:H,type:"text",value:y,onChange:function(e){return S(e.target.value)}}),Object(r.jsx)("div",{className:"input-group-append",children:Object(r.jsx)("button",{onClick:q,className:"btn btn-primary",children:"Valider"})})]}),J&&Object(r.jsx)("p",{className:"answer",children:n[o].es.join(",")}),Object(r.jsxs)("div",{className:"solutions",children:[!J&&Object(r.jsx)("button",{className:"btn btn-danger",onClick:function(){return M(!0)},children:"\ud83d\udd76 Voir la r\xe9ponse"},"show"),J&&Object(r.jsx)("button",{className:"btn btn-danger",onClick:function(){f((function(e){return e+1===n.length?0:e+1})),S(""),M(!1),C(!1),U(!1),x(n[o].fr,-1)},children:"Next"},"next"),Object(r.jsx)("button",{className:"btn btn-warning",onClick:X,children:"\xc9couter la r\xe9ponse \ud83d\udd0a"},"read")]})]})};i.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(g,{})}),document.getElementById("root"))},99:function(e,t){}},[[397,1,2]]]);
//# sourceMappingURL=main.2864966e.chunk.js.map