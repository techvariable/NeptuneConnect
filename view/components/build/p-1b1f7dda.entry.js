import{r as t,h as s}from"./p-584c1979.js";const i=".sc-icon-label-submit-button-h{display:block}";let e=class{constructor(s){t(this,s);this.customClass="";this.width="auto";this.disabled=false;this.varient="contained";this.color="primary";this.size="sm";this.loading=false;this.title=null;this.type="button";this.colorClasses={primary:"gray",secondary:"sky",tertiary:"indigo"};this.sizeClasses={sm:"py-2 px-4 text-sm font-medium rounded-md",md:"py-5 px-5 text-base font-medium rounded-md",lg:"py-6 px-6 text-xl font-semibold rounded-lg"};this.containedClass=`flex border border-transparent ${this.sizeClasses[this.size]}  text-white bg-${this.colorClasses[this.color]}-600 hover:bg-${this.colorClasses[this.color]}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${this.colorClasses[this.color]}-500 justify-center  capitalize w-${this.width} ${this.customClass} cursor-pointer disabled:cursor-default disabled:text-white disabled:bg-gray-300 `;this.textClass=`flex justify-center border border-transparent ${this.sizeClasses[this.size]}  text-${this.colorClasses[this.color]}-600 focus:outline-none  capitalize w-${this.width} ${this.customClass} hover:text-${this.colorClasses[this.color]}-900 cursor-pointer disabled:cursor-default disabled:text-gray-400`;this.outlinedClass=`flex justify-center  ${this.sizeClasses[this.size]} border border-${this.colorClasses[this.color]}-500 shadow-sm bg-white text-${this.colorClasses[this.color]}-700 hover:bg-${this.colorClasses[this.color]}-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${this.colorClasses[this.color]}-500 w-${this.width} cursor-pointer disabled:cursor-default disabled:text-gray-400 disabled:border-gray-400 ${this.customClass}`;this.btnClassType={contained:this.containedClass,outlined:this.outlinedClass,text:this.textClass};this.svgSize={sm:"h-5 w-5",md:"h-6 w-6",lg:"h-7 w-7"}}render(){return s("button",{title:this.title,class:this.btnClassType[this.varient],onClick:this.clickHandler,disabled:this.disabled||this.loading,type:this.type},!this.loading&&s("span",{class:"mr-2"},this.startIcon),s("slot",null),!this.loading&&s("span",{class:"mr-2"},this.endIcon),this.loading&&s("span",{class:"animate-spin ml-2"},s("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:this.svgSize[this.size]},s("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"}))))}};e.style=i;export{e as icon_label_submit_button};
//# sourceMappingURL=p-1b1f7dda.entry.js.map