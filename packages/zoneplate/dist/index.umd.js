!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).zoneplateJs={})}(this,function(e){e.Equation=function(e){var t=e.params,n=t.cy2,a=t.cxt,c=t.cyt,l=t.ct,m=[{c:t.cx2,monomial:React.createElement(Fragment,null,"x",React.createElement("sup",null,"2"))},{c:n,monomial:React.createElement(Fragment,null,"y",React.createElement("sup",null,"2"))},{c:a,monomial:React.createElement(Fragment,null,"xt")},{c:c,monomial:React.createElement(Fragment,null,"yt")},{c:l,monomial:React.createElement(Fragment,null,"t")}].reduce(function(e,t){var n=t.c,a=t.monomial;if(0===n)return e;var c=1===Math.abs(n)?"":Math.abs(n);return""===e?React.createElement(Fragment,null,n>0?"":"-",c,a):React.createElement(Fragment,null,e," ",n>0?"+":"-"," ",c,a)},"");return React.createElement("code",{style:{fontSize:"2em"}},"z = ",m)}});
//# sourceMappingURL=index.umd.js.map
