import{r as t,h as s,H as e}from"./p-584c1979.js";let l=class{constructor(s){t(this,s);this.toggleSort=false;this.currentPage=1;this.dataPerPage=10}componentWillLoad(){let t=this.doc.every((t=>typeof t==="object"));if(t){this.body=this.doc;this.currentBody=this.body}else{this.body=this.doc.map(((t,s)=>({index:s+1,item:t})));this.currentBody=this.body}this.header=Object.keys(this.body[0]).map((t=>({title:t,sortIcon:s("span",{class:"pl-1 text-gray-500"},"⇅"),sortDirection:"none"})))}handleChange(t){this.value=t.target.value;const s=this.currentBody.filter((t=>Object.values(t).some((t=>t.toString().toLowerCase().indexOf(this.value.toLowerCase())>-1))));this.body=s;this.currentPage=1}nextPage(){++this.currentPage}previousPage(){--this.currentPage}sortData(t,e){let l;let a;let i;let r=this.header.findIndex((s=>s.title==t));if(e==="none"||e==="desc"){l=this.body.sort(((s,e)=>s[t]>e[t]?-1:s[t]===e[t]?0:1));a="asc";i=s("span",{class:"pl-1 text-gray-500"},"↓")}if(e==="asc"){l=this.body.sort(((s,e)=>e[t]>s[t]?-1:e[t]===s[t]?0:1));a="desc";i=s("span",{class:"pl-1 text-gray-500"},"↑")}this.body=[...l];this.header[r].sortDirection=a;this.header[r].sortIcon=i}render(){const t=this.currentPage*this.dataPerPage;const l=t-this.dataPerPage;const a=this.body.slice(l,t);const i=this.body.length/this.dataPerPage;return s(e,null,s("div",{class:"relative overflow-x-auto shadow-md sm:rounded-lg"},s("div",{class:"p-4"},s("label",{htmlFor:"table-search",class:"sr-only"},"Search"),s("div",{class:"relative mt-1"},s("div",{class:"absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"},s("svg",{class:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},s("path",{"fill-rule":"evenodd",d:"M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z","clip-rule":"evenodd"}))),s("input",{type:"text",id:"table-search",class:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  ",placeholder:"Search for items",value:this.value,onInput:t=>this.handleChange(t)}))),s("table",{class:"w-full text-sm text-left text-gray-500 "},s("thead",{class:"text-xs text-gray-700 uppercase bg-gray-50"},s("tr",null,this.header.map((t=>s("th",{scope:"col",onClick:()=>this.sortData(t.title,t.sortDirection),class:"px-6 py-3 cursor-pointer",title:"click to sort data"},t.title,t.sortIcon))))),s("tbody",null,a.map((t=>s("tr",{class:"bg-white border-b hover:bg-gray-50"},this.header.map((e=>{var l;return s("td",{class:"px-6 py-4"},(l=t[e.title])!==null&&l!==void 0?l:s("span",null,"—"))})))))),s("tfoot",null,s("tr",null,s("td",{colSpan:5,class:"py-4"},s("div",{class:"flex gap-2 items-center"},s("plain-button",{color:"gray-500",disabledHandler:this.currentPage===1,clickHandler:()=>this.previousPage(),type:"text",addClass:"bg-gray-200 hover:text-gray-700 disabled:opacity-50 "},s("span",null,"Previous")),s("plain-button",{color:"gray-500",disabledHandler:i===this.currentPage||a.length<this.dataPerPage,type:"text",clickHandler:()=>this.nextPage(),addClass:"bg-gray-200 hover:text-gray-700 disabled:opacity-50"},"Next"),s("p",{class:"pl-5"},"Showing ",s("strong",null,l+1)," to ",s("strong",null,t)," of ",s("strong",null,this.body.length)," results"))))))))}};export{l as data_table_updated};
//# sourceMappingURL=p-da3f48ef.entry.js.map