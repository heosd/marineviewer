// https://d3js.org/d3-array/ v3.2.4 Copyright 2010-2023 Mike Bostock
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((t="undefined"!=typeof globalThis?globalThis:t||self).d3=t.d3||{})}(this,(function(t){"use strict";function n(t,n){return null==t||null==n?NaN:t<n?-1:t>n?1:t>=n?0:NaN}function r(t,n){return null==t||null==n?NaN:n<t?-1:n>t?1:n>=t?0:NaN}function e(t){let e,f,i;function u(t,n,r=0,o=t.length){if(r<o){if(0!==e(n,n))return o;do{const e=r+o>>>1;f(t[e],n)<0?r=e+1:o=e}while(r<o)}return r}return 2!==t.length?(e=n,f=(r,e)=>n(t(r),e),i=(n,r)=>t(n)-r):(e=t===n||t===r?t:o,f=t,i=t),{left:u,center:function(t,n,r=0,e=t.length){const o=u(t,n,r,e-1);return o>r&&i(t[o-1],n)>-i(t[o],n)?o-1:o},right:function(t,n,r=0,o=t.length){if(r<o){if(0!==e(n,n))return o;do{const e=r+o>>>1;f(t[e],n)<=0?r=e+1:o=e}while(r<o)}return r}}}function o(){return 0}function f(t){return null===t?NaN:+t}const i=e(n),u=i.right,l=i.left,c=e(f).center;var s=u;const a=d(m),h=d((function(t){const n=m(t);return(t,r,e,o,f)=>{n(t,r,(e<<=2)+0,(o<<=2)+0,f<<=2),n(t,r,e+1,o+1,f),n(t,r,e+2,o+2,f),n(t,r,e+3,o+3,f)}}));function d(t){return function(n,r,e=r){if(!((r=+r)>=0))throw new RangeError("invalid rx");if(!((e=+e)>=0))throw new RangeError("invalid ry");let{data:o,width:f,height:i}=n;if(!((f=Math.floor(f))>=0))throw new RangeError("invalid width");if(!((i=Math.floor(void 0!==i?i:o.length/f))>=0))throw new RangeError("invalid height");if(!f||!i||!r&&!e)return n;const u=r&&t(r),l=e&&t(e),c=o.slice();return u&&l?(p(u,c,o,f,i),p(u,o,c,f,i),p(u,c,o,f,i),y(l,o,c,f,i),y(l,c,o,f,i),y(l,o,c,f,i)):u?(p(u,o,c,f,i),p(u,c,o,f,i),p(u,o,c,f,i)):l&&(y(l,o,c,f,i),y(l,c,o,f,i),y(l,o,c,f,i)),n}}function p(t,n,r,e,o){for(let f=0,i=e*o;f<i;)t(n,r,f,f+=e,1)}function y(t,n,r,e,o){for(let f=0,i=e*o;f<e;++f)t(n,r,f,f+i,e)}function m(t){const n=Math.floor(t);if(n===t)return function(t){const n=2*t+1;return(r,e,o,f,i)=>{if(!((f-=i)>=o))return;let u=t*e[o];const l=i*t;for(let t=o,n=o+l;t<n;t+=i)u+=e[Math.min(f,t)];for(let t=o,c=f;t<=c;t+=i)u+=e[Math.min(f,t+l)],r[t]=u/n,u-=e[Math.max(o,t-l)]}}(t);const r=t-n,e=2*t+1;return(t,o,f,i,u)=>{if(!((i-=u)>=f))return;let l=n*o[f];const c=u*n,s=c+u;for(let t=f,n=f+c;t<n;t+=u)l+=o[Math.min(i,t)];for(let n=f,a=i;n<=a;n+=u)l+=o[Math.min(i,n+c)],t[n]=(l+r*(o[Math.max(f,n-s)]+o[Math.min(i,n+s)]))/e,l-=o[Math.max(f,n-c)]}}function g(t,n){let r=0;if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&++r;else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&(o=+o)>=o&&++r}return r}function v(t){return 0|t.length}function M(t){return!(t>0)}function w(t){return"object"!=typeof t||"length"in t?t:Array.from(t)}function b(t,n){let r,e=0,o=0,f=0;if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&(r=n-o,o+=r/++e,f+=r*(n-o));else{let i=-1;for(let u of t)null!=(u=n(u,++i,t))&&(u=+u)>=u&&(r=u-o,o+=r/++e,f+=r*(u-o))}if(e>1)return f/(e-1)}function A(t,n){const r=b(t,n);return r?Math.sqrt(r):r}function x(t,n){let r,e;if(void 0===n)for(const n of t)null!=n&&(void 0===r?n>=n&&(r=e=n):(r>n&&(r=n),e<n&&(e=n)));else{let o=-1;for(let f of t)null!=(f=n(f,++o,t))&&(void 0===r?f>=f&&(r=e=f):(r>f&&(r=f),e<f&&(e=f)))}return[r,e]}class N{constructor(){this._partials=new Float64Array(32),this._n=0}add(t){const n=this._partials;let r=0;for(let e=0;e<this._n&&e<32;e++){const o=n[e],f=t+o,i=Math.abs(t)<Math.abs(o)?t-(f-o):o-(f-t);i&&(n[r++]=i),t=f}return n[r]=t,this._n=r+1,this}valueOf(){const t=this._partials;let n,r,e,o=this._n,f=0;if(o>0){for(f=t[--o];o>0&&(n=f,r=t[--o],f=n+r,e=r-(f-n),!e););o>0&&(e<0&&t[o-1]<0||e>0&&t[o-1]>0)&&(r=2*e,n=f+r,r==n-f&&(f=n))}return f}}class InternMap extends Map{constructor(t,n=k){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:n}}),null!=t)for(const[n,r]of t)this.set(n,r)}get(t){return super.get(E(this,t))}has(t){return super.has(E(this,t))}set(t,n){return super.set(_(this,t),n)}delete(t){return super.delete(S(this,t))}}class InternSet extends Set{constructor(t,n=k){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:n}}),null!=t)for(const n of t)this.add(n)}has(t){return super.has(E(this,t))}add(t){return super.add(_(this,t))}delete(t){return super.delete(S(this,t))}}function E({_intern:t,_key:n},r){const e=n(r);return t.has(e)?t.get(e):r}function _({_intern:t,_key:n},r){const e=n(r);return t.has(e)?t.get(e):(t.set(e,r),r)}function S({_intern:t,_key:n},r){const e=n(r);return t.has(e)&&(r=t.get(e),t.delete(e)),r}function k(t){return null!==t&&"object"==typeof t?t.valueOf():t}function T(t){return t}function F(t,...n){return U(t,T,T,n)}function I(t,...n){return U(t,Array.from,T,n)}function j(t,n){for(let r=1,e=n.length;r<e;++r)t=t.flatMap((t=>t.pop().map((([n,r])=>[...t,n,r]))));return t}function q(t,n,...r){return U(t,T,n,r)}function R(t,n,...r){return U(t,Array.from,n,r)}function O(t){if(1!==t.length)throw new Error("duplicate key");return t[0]}function U(t,n,r,e){return function t(o,f){if(f>=e.length)return r(o);const i=new InternMap,u=e[f++];let l=-1;for(const t of o){const n=u(t,++l,o),r=i.get(n);r?r.push(t):i.set(n,[t])}for(const[n,r]of i)i.set(n,t(r,f));return n(i)}(t,0)}function L(t,n){return Array.from(n,(n=>t[n]))}function P(t,...n){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");t=Array.from(t);let[r]=n;if(r&&2!==r.length||n.length>1){const e=Uint32Array.from(t,((t,n)=>n));return n.length>1?(n=n.map((n=>t.map(n))),e.sort(((t,r)=>{for(const e of n){const n=C(e[t],e[r]);if(n)return n}}))):(r=t.map(r),e.sort(((t,n)=>C(r[t],r[n])))),L(t,e)}return t.sort(z(r))}function z(t=n){if(t===n)return C;if("function"!=typeof t)throw new TypeError("compare is not a function");return(n,r)=>{const e=t(n,r);return e||0===e?e:(0===t(r,r))-(0===t(n,n))}}function C(t,n){return(null==t||!(t>=t))-(null==n||!(n>=n))||(t<n?-1:t>n?1:0)}var D=Array.prototype.slice;function G(t){return()=>t}const B=Math.sqrt(50),H=Math.sqrt(10),J=Math.sqrt(2);function K(t,n,r){const e=(n-t)/Math.max(0,r),o=Math.floor(Math.log10(e)),f=e/Math.pow(10,o),i=f>=B?10:f>=H?5:f>=J?2:1;let u,l,c;return o<0?(c=Math.pow(10,-o)/i,u=Math.round(t*c),l=Math.round(n*c),u/c<t&&++u,l/c>n&&--l,c=-c):(c=Math.pow(10,o)*i,u=Math.round(t/c),l=Math.round(n/c),u*c<t&&++u,l*c>n&&--l),l<u&&.5<=r&&r<2?K(t,n,2*r):[u,l,c]}function Q(t,n,r){if(!((r=+r)>0))return[];if((t=+t)===(n=+n))return[t];const e=n<t,[o,f,i]=e?K(n,t,r):K(t,n,r);if(!(f>=o))return[];const u=f-o+1,l=new Array(u);if(e)if(i<0)for(let t=0;t<u;++t)l[t]=(f-t)/-i;else for(let t=0;t<u;++t)l[t]=(f-t)*i;else if(i<0)for(let t=0;t<u;++t)l[t]=(o+t)/-i;else for(let t=0;t<u;++t)l[t]=(o+t)*i;return l}function V(t,n,r){return K(t=+t,n=+n,r=+r)[2]}function W(t,n,r){let e;for(;;){const o=V(t,n,r);if(o===e||0===o||!isFinite(o))return[t,n];o>0?(t=Math.floor(t/o)*o,n=Math.ceil(n/o)*o):o<0&&(t=Math.ceil(t*o)/o,n=Math.floor(n*o)/o),e=o}}function X(t){return Math.max(1,Math.ceil(Math.log(g(t))/Math.LN2)+1)}function Y(){var t=T,n=x,r=X;function e(e){Array.isArray(e)||(e=Array.from(e));var o,f,i,u=e.length,l=new Array(u);for(o=0;o<u;++o)l[o]=t(e[o],o,e);var c=n(l),a=c[0],h=c[1],d=r(l,a,h);if(!Array.isArray(d)){const t=h,r=+d;if(n===x&&([a,h]=W(a,h,r)),(d=Q(a,h,r))[0]<=a&&(i=V(a,h,r)),d[d.length-1]>=h)if(t>=h&&n===x){const t=V(a,h,r);isFinite(t)&&(t>0?h=(Math.floor(h/t)+1)*t:t<0&&(h=(Math.ceil(h*-t)+1)/-t))}else d.pop()}for(var p=d.length,y=0,m=p;d[y]<=a;)++y;for(;d[m-1]>h;)--m;(y||m<p)&&(d=d.slice(y,m),p=m-y);var g,v=new Array(p+1);for(o=0;o<=p;++o)(g=v[o]=[]).x0=o>0?d[o-1]:a,g.x1=o<p?d[o]:h;if(isFinite(i)){if(i>0)for(o=0;o<u;++o)null!=(f=l[o])&&a<=f&&f<=h&&v[Math.min(p,Math.floor((f-a)/i))].push(e[o]);else if(i<0)for(o=0;o<u;++o)if(null!=(f=l[o])&&a<=f&&f<=h){const t=Math.floor((a-f)*i);v[Math.min(p,t+(d[t]<=f))].push(e[o])}}else for(o=0;o<u;++o)null!=(f=l[o])&&a<=f&&f<=h&&v[s(d,f,0,p)].push(e[o]);return v}return e.value=function(n){return arguments.length?(t="function"==typeof n?n:G(n),e):t},e.domain=function(t){return arguments.length?(n="function"==typeof t?t:G([t[0],t[1]]),e):n},e.thresholds=function(t){return arguments.length?(r="function"==typeof t?t:G(Array.isArray(t)?D.call(t):t),e):r},e}function Z(t,n){let r;if(void 0===n)for(const n of t)null!=n&&(r<n||void 0===r&&n>=n)&&(r=n);else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&(r<o||void 0===r&&o>=o)&&(r=o)}return r}function $(t,n){let r,e=-1,o=-1;if(void 0===n)for(const n of t)++o,null!=n&&(r<n||void 0===r&&n>=n)&&(r=n,e=o);else for(let f of t)null!=(f=n(f,++o,t))&&(r<f||void 0===r&&f>=f)&&(r=f,e=o);return e}function tt(t,n){let r;if(void 0===n)for(const n of t)null!=n&&(r>n||void 0===r&&n>=n)&&(r=n);else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&(r>o||void 0===r&&o>=o)&&(r=o)}return r}function nt(t,n){let r,e=-1,o=-1;if(void 0===n)for(const n of t)++o,null!=n&&(r>n||void 0===r&&n>=n)&&(r=n,e=o);else for(let f of t)null!=(f=n(f,++o,t))&&(r>f||void 0===r&&f>=f)&&(r=f,e=o);return e}function rt(t,n,r=0,e=1/0,o){if(n=Math.floor(n),r=Math.floor(Math.max(0,r)),e=Math.floor(Math.min(t.length-1,e)),!(r<=n&&n<=e))return t;for(o=void 0===o?C:z(o);e>r;){if(e-r>600){const f=e-r+1,i=n-r+1,u=Math.log(f),l=.5*Math.exp(2*u/3),c=.5*Math.sqrt(u*l*(f-l)/f)*(i-f/2<0?-1:1);rt(t,n,Math.max(r,Math.floor(n-i*l/f+c)),Math.min(e,Math.floor(n+(f-i)*l/f+c)),o)}const f=t[n];let i=r,u=e;for(et(t,r,n),o(t[e],f)>0&&et(t,r,e);i<u;){for(et(t,i,u),++i,--u;o(t[i],f)<0;)++i;for(;o(t[u],f)>0;)--u}0===o(t[r],f)?et(t,r,u):(++u,et(t,u,e)),u<=n&&(r=u+1),n<=u&&(e=u-1)}return t}function et(t,n,r){const e=t[n];t[n]=t[r],t[r]=e}function ot(t,r=n){let e,o=!1;if(1===r.length){let f;for(const i of t){const t=r(i);(o?n(t,f)>0:0===n(t,t))&&(e=i,f=t,o=!0)}}else for(const n of t)(o?r(n,e)>0:0===r(n,n))&&(e=n,o=!0);return e}function ft(t,n,r){if(t=Float64Array.from(function*(t,n){if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&(yield n);else{let r=-1;for(let e of t)null!=(e=n(e,++r,t))&&(e=+e)>=e&&(yield e)}}(t,r)),(e=t.length)&&!isNaN(n=+n)){if(n<=0||e<2)return tt(t);if(n>=1)return Z(t);var e,o=(e-1)*n,f=Math.floor(o),i=Z(rt(t,f).subarray(0,f+1));return i+(tt(t.subarray(f+1))-i)*(o-f)}}function it(t,n,r=f){if(!isNaN(n=+n)){if(e=Float64Array.from(t,((n,e)=>f(r(t[e],e,t)))),n<=0)return nt(e);if(n>=1)return $(e);var e,o=Uint32Array.from(t,((t,n)=>n)),i=e.length-1,u=Math.floor(i*n);return rt(o,u,0,i,((t,n)=>C(e[t],e[n]))),(u=ot(o.subarray(0,u+1),(t=>e[t])))>=0?u:-1}}function ut(t,n){return[t,n]}function lt(t,r=n){if(1===r.length)return nt(t,r);let e,o=-1,f=-1;for(const n of t)++f,(o<0?0===r(n,n):r(n,e)<0)&&(e=n,o=f);return o}var ct=st(Math.random);function st(t){return function(n,r=0,e=n.length){let o=e-(r=+r);for(;o;){const e=t()*o--|0,f=n[o+r];n[o+r]=n[e+r],n[e+r]=f}return n}}function at(t){if(!(o=t.length))return[];for(var n=-1,r=tt(t,ht),e=new Array(r);++n<r;)for(var o,f=-1,i=e[n]=new Array(o);++f<o;)i[f]=t[f][n];return e}function ht(t){return t.length}function dt(t){return t instanceof InternSet?t:new InternSet(t)}function pt(t,n){const r=t[Symbol.iterator](),e=new Set;for(const t of n){const n=yt(t);if(e.has(n))continue;let o,f;for(;({value:o,done:f}=r.next());){if(f)return!1;const t=yt(o);if(e.add(t),Object.is(n,t))break}}return!0}function yt(t){return null!==t&&"object"==typeof t?t.valueOf():t}t.Adder=N,t.InternMap=InternMap,t.InternSet=InternSet,t.ascending=n,t.bin=Y,t.bisect=s,t.bisectCenter=c,t.bisectLeft=l,t.bisectRight=u,t.bisector=e,t.blur=function(t,n){if(!((n=+n)>=0))throw new RangeError("invalid r");let r=t.length;if(!((r=Math.floor(r))>=0))throw new RangeError("invalid length");if(!r||!n)return t;const e=m(n),o=t.slice();return e(t,o,0,r,1),e(o,t,0,r,1),e(t,o,0,r,1),t},t.blur2=a,t.blurImage=h,t.count=g,t.cross=function(...t){const n="function"==typeof t[t.length-1]&&function(t){return n=>t(...n)}(t.pop()),r=(t=t.map(w)).map(v),e=t.length-1,o=new Array(e+1).fill(0),f=[];if(e<0||r.some(M))return f;for(;;){f.push(o.map(((n,r)=>t[r][n])));let i=e;for(;++o[i]===r[i];){if(0===i)return n?f.map(n):f;o[i--]=0}}},t.cumsum=function(t,n){var r=0,e=0;return Float64Array.from(t,void 0===n?t=>r+=+t||0:o=>r+=+n(o,e++,t)||0)},t.descending=r,t.deviation=A,t.difference=function(t,...n){t=new InternSet(t);for(const r of n)for(const n of r)t.delete(n);return t},t.disjoint=function(t,n){const r=n[Symbol.iterator](),e=new InternSet;for(const n of t){if(e.has(n))return!1;let t,o;for(;({value:t,done:o}=r.next())&&!o;){if(Object.is(n,t))return!1;e.add(t)}}return!0},t.every=function(t,n){if("function"!=typeof n)throw new TypeError("test is not a function");let r=-1;for(const e of t)if(!n(e,++r,t))return!1;return!0},t.extent=x,t.fcumsum=function(t,n){const r=new N;let e=-1;return Float64Array.from(t,void 0===n?t=>r.add(+t||0):o=>r.add(+n(o,++e,t)||0))},t.filter=function(t,n){if("function"!=typeof n)throw new TypeError("test is not a function");const r=[];let e=-1;for(const o of t)n(o,++e,t)&&r.push(o);return r},t.flatGroup=function(t,...n){return j(I(t,...n),n)},t.flatRollup=function(t,n,...r){return j(R(t,n,...r),r)},t.fsum=function(t,n){const r=new N;if(void 0===n)for(let n of t)(n=+n)&&r.add(n);else{let e=-1;for(let o of t)(o=+n(o,++e,t))&&r.add(o)}return+r},t.greatest=ot,t.greatestIndex=function(t,r=n){if(1===r.length)return $(t,r);let e,o=-1,f=-1;for(const n of t)++f,(o<0?0===r(n,n):r(n,e)>0)&&(e=n,o=f);return o},t.group=F,t.groupSort=function(t,r,e){return(2!==r.length?P(q(t,r,e),(([t,r],[e,o])=>n(r,o)||n(t,e))):P(F(t,e),(([t,e],[o,f])=>r(e,f)||n(t,o)))).map((([t])=>t))},t.groups=I,t.histogram=Y,t.index=function(t,...n){return U(t,T,O,n)},t.indexes=function(t,...n){return U(t,Array.from,O,n)},t.intersection=function(t,...n){t=new InternSet(t),n=n.map(dt);t:for(const r of t)for(const e of n)if(!e.has(r)){t.delete(r);continue t}return t},t.least=function(t,r=n){let e,o=!1;if(1===r.length){let f;for(const i of t){const t=r(i);(o?n(t,f)<0:0===n(t,t))&&(e=i,f=t,o=!0)}}else for(const n of t)(o?r(n,e)<0:0===r(n,n))&&(e=n,o=!0);return e},t.leastIndex=lt,t.map=function(t,n){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");if("function"!=typeof n)throw new TypeError("mapper is not a function");return Array.from(t,((r,e)=>n(r,e,t)))},t.max=Z,t.maxIndex=$,t.mean=function(t,n){let r=0,e=0;if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&(++r,e+=n);else{let o=-1;for(let f of t)null!=(f=n(f,++o,t))&&(f=+f)>=f&&(++r,e+=f)}if(r)return e/r},t.median=function(t,n){return ft(t,.5,n)},t.medianIndex=function(t,n){return it(t,.5,n)},t.merge=function(t){return Array.from(function*(t){for(const n of t)yield*n}(t))},t.min=tt,t.minIndex=nt,t.mode=function(t,n){const r=new InternMap;if(void 0===n)for(let n of t)null!=n&&n>=n&&r.set(n,(r.get(n)||0)+1);else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&o>=o&&r.set(o,(r.get(o)||0)+1)}let e,o=0;for(const[t,n]of r)n>o&&(o=n,e=t);return e},t.nice=W,t.pairs=function(t,n=ut){const r=[];let e,o=!1;for(const f of t)o&&r.push(n(e,f)),e=f,o=!0;return r},t.permute=L,t.quantile=ft,t.quantileIndex=it,t.quantileSorted=function(t,n,r=f){if((e=t.length)&&!isNaN(n=+n)){if(n<=0||e<2)return+r(t[0],0,t);if(n>=1)return+r(t[e-1],e-1,t);var e,o=(e-1)*n,i=Math.floor(o),u=+r(t[i],i,t);return u+(+r(t[i+1],i+1,t)-u)*(o-i)}},t.quickselect=rt,t.range=function(t,n,r){t=+t,n=+n,r=(o=arguments.length)<2?(n=t,t=0,1):o<3?1:+r;for(var e=-1,o=0|Math.max(0,Math.ceil((n-t)/r)),f=new Array(o);++e<o;)f[e]=t+e*r;return f},t.rank=function(t,r=n){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");let e=Array.from(t);const o=new Float64Array(e.length);2!==r.length&&(e=e.map(r),r=n);const f=(t,n)=>r(e[t],e[n]);let i,u;return(t=Uint32Array.from(e,((t,n)=>n))).sort(r===n?(t,n)=>C(e[t],e[n]):z(f)),t.forEach(((t,n)=>{const r=f(t,void 0===i?t:i);r>=0?((void 0===i||r>0)&&(i=t,u=n),o[t]=u):o[t]=NaN})),o},t.reduce=function(t,n,r){if("function"!=typeof n)throw new TypeError("reducer is not a function");const e=t[Symbol.iterator]();let o,f,i=-1;if(arguments.length<3){if(({done:o,value:r}=e.next()),o)return;++i}for(;({done:o,value:f}=e.next()),!o;)r=n(r,f,++i,t);return r},t.reverse=function(t){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");return Array.from(t).reverse()},t.rollup=q,t.rollups=R,t.scan=function(t,n){const r=lt(t,n);return r<0?void 0:r},t.shuffle=ct,t.shuffler=st,t.some=function(t,n){if("function"!=typeof n)throw new TypeError("test is not a function");let r=-1;for(const e of t)if(n(e,++r,t))return!0;return!1},t.sort=P,t.subset=function(t,n){return pt(n,t)},t.sum=function(t,n){let r=0;if(void 0===n)for(let n of t)(n=+n)&&(r+=n);else{let e=-1;for(let o of t)(o=+n(o,++e,t))&&(r+=o)}return r},t.superset=pt,t.thresholdFreedmanDiaconis=function(t,n,r){const e=g(t),o=ft(t,.75)-ft(t,.25);return e&&o?Math.ceil((r-n)/(2*o*Math.pow(e,-1/3))):1},t.thresholdScott=function(t,n,r){const e=g(t),o=A(t);return e&&o?Math.ceil((r-n)*Math.cbrt(e)/(3.49*o)):1},t.thresholdSturges=X,t.tickIncrement=V,t.tickStep=function(t,n,r){r=+r;const e=(n=+n)<(t=+t),o=e?V(n,t,r):V(t,n,r);return(e?-1:1)*(o<0?1/-o:o)},t.ticks=Q,t.transpose=at,t.union=function(...t){const n=new InternSet;for(const r of t)for(const t of r)n.add(t);return n},t.variance=b,t.zip=function(){return at(arguments)}}));
