import{r as s,h as t,H as i}from"./p-62aab1e1.js";import{a as h}from"./p-18b27c92.js";const e=".sc-all-users-h{display:block}";let l=class{constructor(t){s(this,t);this.limitbackend=1;this.offsetbackend=0;this.parsedPermissions=[];this.limit=50;this.offset=0;this.loading=false;this.refresh=()=>{window.location.assign(`/users?offset=${this.offset}&limit=${this.limit}`)};this.nextHandler=()=>{this.loading=true;if(this.offset+this.limit<this.count)this.offset=this.offset+this.limit;this.refresh();this.loading=false};this.prevHandler=()=>{this.loading=true;if(this.offset-this.limit>=0)this.offset=this.offset-this.limit;this.refresh();this.loading=false};this.jumpPageHandler=s=>{this.loading=true;this.offset=s*this.limit-this.limit;this.refresh();this.loading=false}}componentWillLoad(){this.limit=this.limitbackend;this.offset=this.offsetbackend;this.updatedUsers=JSON.parse(this.users);this.parsedPermissions=JSON.parse(this.permissions);h.get(`${this.url}/api/permissions/all`).then((s=>{this.allPermissions=s.data})).catch((s=>console.log(s)))}render(){return t(i,null,t("div",{class:"text-gray-600 body-font pt-8"},t("div",null,t("div",{class:"mx-auto"},t("div",{class:"flex flex-wrap"},t("users-component",{refresh:this.refresh,url:this.url,updatedUsers:this.updatedUsers,parsedPermissions:this.parsedPermissions,allPermissions:this.allPermissions}))))),t("div",{class:"flex justify-center my-4"},t("pagination-component",{url:this.url,limit:this.limit,offset:this.offset,totalData:this.count,nextHandler:this.nextHandler,prevHandler:this.prevHandler,jumpPageHandler:this.jumpPageHandler,class:"mt-2",loading:this.loading})))}};l.style=e;export{l as all_users};
//# sourceMappingURL=p-ea8ccbb8.entry.js.map