import e from"react";function t({coefs:t}){const{cx2:n,cy2:l,cxt:m,cyt:a,ct:c}=t,r=[{c:n,monomial:e.createElement(e.Fragment,null,"x",e.createElement("sup",null,"2"))},{c:l,monomial:e.createElement(e.Fragment,null,"y",e.createElement("sup",null,"2"))},{c:m,monomial:e.createElement(e.Fragment,null,"xt")},{c:a,monomial:e.createElement(e.Fragment,null,"yt")},{c,monomial:e.createElement(e.Fragment,null,"t")}].reduce((t,{c:n,monomial:l})=>{if(0===n)return t;const m=1===Math.abs(n)?"":Math.abs(n);return""===t?e.createElement(e.Fragment,null,n>0?"":"-",m,l):e.createElement(e.Fragment,null,t," ",n>0?"+":"-"," ",m,l)},"");return e.createElement("code",{style:{fontSize:"2em"}},"z = ",r)}export{t as Equation};
//# sourceMappingURL=index.modern.js.map