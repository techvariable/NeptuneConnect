import{r as s,h as t,H as e,g as r}from"./p-62aab1e1.js";import{b as i}from"./p-2b80ef13.js";import{g as o,E as a,j as n}from"./p-7d997c4f.js";let l=class{constructor(t){s(this,t);this.labelTitle={result:{tag:"Success 200",class:"text-green-700 text-sm font-semibold pb-2"},error:{tag:"Error",class:"text-red-700 text-sm font-semibold pb-2"}}}componentDidLoad(){this.state=o.create({doc:this.doc,extensions:[i,a.editable.of(false),n()]});this.view=new a({state:this.state,parent:this.element.querySelector("#res-editor")})}render(){return t(e,null,t("div",{class:"bg-gray-100"},t("p",{class:this.labelTitle[this.responseLabel].class},this.labelTitle[this.responseLabel].tag)),t("div",{style:{overflowY:"auto",display:"inline-block",height:"450px",width:"100%"},id:"res-editor"}))}get element(){return r(this)}};export{l as json_response_viewer};
//# sourceMappingURL=p-67ef7f07.entry.js.map