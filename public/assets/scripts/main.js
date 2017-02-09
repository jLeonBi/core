angular.module("biigle.api",["ngResource"]),angular.module("biigle.api").config(["$httpProvider","$compileProvider",function(e,t){"use strict";e.defaults.headers.common["X-Requested-With"]="XMLHttpRequest",t.debugInfoEnabled(!1)}]),angular.module("biigle.ui.messages",["ui.bootstrap"]),angular.module("biigle.ui.messages").config(["$compileProvider",function(e){e.debugInfoEnabled(!1)}]),angular.element(document).ready(function(){"use strict";angular.bootstrap(document.querySelector('[data-ng-controller="MessagesController"]'),["biigle.ui.messages"])}),angular.module("biigle.ui.users",["ui.bootstrap","biigle.api"]),angular.module("biigle.ui.users").config(["$compileProvider",function(e){"use strict";e.debugInfoEnabled(!1)}]),angular.module("biigle.ui.utils",[]),angular.module("biigle.ui.utils").config(["$compileProvider","$locationProvider",function(e,t){"use strict";e.debugInfoEnabled(!1),t.html5Mode({enabled:!0,requireBase:!1,rewriteLinks:!1})}]),angular.module("biigle.ui",["ui.bootstrap","biigle.ui.messages","biigle.ui.users","biigle.ui.utils","ngAnimate"]),angular.module("biigle.ui").config(["$compileProvider","$animateProvider",function(e,t){"use strict";e.debugInfoEnabled(!1),t.classNameFilter(/\banimated\b/)}]),biigle={},biigle.$viewModel=function(e,t){window.addEventListener("load",function(){var i=document.getElementById(e);i&&t(i)})},biigle.$require=function(e){e=Array.isArray(e)?e:e.split(".");for(var t=biigle,i=0,r=e.length;i<r;i++)t[e[i]]=t[e[i]]||{},t=t[e[i]];return t},biigle.$declare=function(e,t){e=e.split(".");var i=e.pop(),r=biigle.$require(e);return r[i]="function"==typeof t?t():t,t},biigle.$component=function(e,t){var i=biigle.$require(e);"function"==typeof t&&(t=t());for(var r in t)t.hasOwnProperty(r)&&(i[r]=t[r]);return i},angular.module("biigle.api").factory("Annotation",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/annotations/:id",{id:"@id"},{save:{method:"PUT"},query:{method:"GET",url:t+"/api/v1/images/:id/annotations",isArray:!0},add:{method:"POST",url:t+"/api/v1/images/:id/annotations"}})}]),angular.module("biigle.api").factory("AnnotationLabel",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/annotation-labels/:id",{id:"@id",annotation_id:"@annotation_id"},{query:{method:"GET",url:t+"/api/v1/annotations/:annotation_id/labels",isArray:!0},attach:{method:"POST",url:t+"/api/v1/annotations/:annotation_id/labels"},save:{method:"PUT",params:{annotation_id:null}},delete:{method:"DELETE",params:{annotation_id:null}}})}]),angular.module("biigle.api").factory("AnnotationSession",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/annotation-sessions/:id",{id:"@id"},{save:{method:"PUT"},query:{method:"GET",url:t+"/api/v1/volumes/:volume_id/annotation-sessions",isArray:!0},create:{method:"POST",url:t+"/api/v1/volumes/:volume_id/annotation-sessions"}})}]),angular.module("biigle.api").factory("Image",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/images/:id",{id:"@id"})}]),angular.module("biigle.api").factory("ImageLabel",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/image-labels/:id",{id:"@id",image_id:"@image_id"},{query:{method:"GET",url:t+"/api/v1/images/:image_id/labels",isArray:!0},attach:{method:"POST",url:t+"/api/v1/images/:image_id/labels"},delete:{method:"DELETE",params:{image_id:null}}})}]),angular.module("biigle.api").factory("Label",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/labels/:id",{id:"@id"},{create:{method:"POST",url:t+"/api/v1/label-trees/:label_tree_id/labels",params:{label_tree_id:"@label_tree_id"},isArray:!0}})}]),angular.module("biigle.api").factory("LabelSource",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/label-sources/:id/find")}]),angular.module("biigle.api").factory("LabelTree",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/label-trees/:id",{id:"@id"},{query:{method:"GET",isArray:!0},create:{method:"POST"},update:{method:"PUT"}})}]),angular.module("biigle.api").factory("LabelTreeAuthorizedProject",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/label-trees/:id/authorized-projects",{},{addAuthorized:{method:"POST"},removeAuthorized:{method:"DELETE",url:t+"/api/v1/label-trees/:id/authorized-projects/:pid",params:{pid:"@id"}}})}]),angular.module("biigle.api").factory("LabelTreeUser",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/label-trees/:label_tree_id/users/:id",{id:"@id"},{update:{method:"PUT"},attach:{method:"POST",url:t+"/api/v1/label-trees/:label_tree_id/users",params:{id:null}},detach:{method:"DELETE"}})}]),angular.module("biigle.api").factory("MediaType",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/media-types/:id",{id:"@id"})}]),angular.module("biigle.api").factory("OwnUser",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/users/my",{},{save:{method:"PUT"}})}]),angular.module("biigle.api").factory("Project",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:id",{id:"@id"},{query:{method:"GET",params:{id:"my"},isArray:!0},add:{method:"POST"},save:{method:"PUT"}})}]),angular.module("biigle.api").factory("ProjectLabelTree",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:project_id/label-trees",{project_id:"@project_id"},{available:{method:"GET",isArray:!0,url:t+"/api/v1/projects/:project_id/label-trees/available"},attach:{method:"POST",url:t+"/api/v1/projects/:project_id/label-trees"},detach:{method:"DELETE",url:t+"/api/v1/projects/:project_id/label-trees/:id",params:{id:"@id"}}})}]),angular.module("biigle.api").factory("ProjectUser",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:project_id/users/:id",{id:"@id"},{save:{method:"PUT"},attach:{method:"POST"},detach:{method:"DELETE"}})}]),angular.module("biigle.api").factory("ProjectVolume",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:project_id/volumes/:id",{id:"@id"},{add:{method:"POST"},attach:{method:"POST"},detach:{method:"DELETE"}})}]),angular.module("biigle.api").factory("Role",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/roles/:id",{id:"@id"})}]),angular.module("biigle.api").factory("Shape",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/shapes/:id",{id:"@id"})}]),angular.module("biigle.api").factory("User",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/users/:id/:query",{id:"@id"},{save:{method:"PUT"},add:{method:"POST"},find:{method:"GET",params:{id:"find"},isArray:!0}})}]),angular.module("biigle.api").factory("Volume",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/volumes/:id",{id:"@id"},{save:{method:"PUT"}})}]),angular.module("biigle.api").factory("VolumeImage",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/volumes/:volume_id/images",{},{save:{method:"POST",isArray:!0}})}]),angular.module("biigle.api").service("roles",["Role",function(e){"use strict";var t={},i={};e.query(function(e){e.forEach(function(e){t[e.id]=e.name,i[e.name]=e.id})}),this.getName=function(e){return t[e]},this.getId=function(e){return i[e]}}]),angular.module("biigle.api").service("shapes",["Shape",function(e){"use strict";var t={},i={},r=e.query(function(e){e.forEach(function(e){t[e.id]=e.name,i[e.name]=e.id})});this.getName=function(e){return t[e]},this.getId=function(e){return i[e]},this.getAll=function(){return r}}]),biigle.$declare("api.labelSource",Vue.resource("api/v1/label-sources{/id}/find")),biigle.$declare("api.labelTree",Vue.resource("api/v1/label-trees{/id}",{},{addAuthorizedProject:{method:"POST",url:"api/v1/label-trees{/id}/authorized-projects"},removeAuthorizedProject:{method:"DELETE",url:"api/v1/label-trees{/id}/authorized-projects{/project_id}"},addUser:{method:"POST",url:"api/v1/label-trees{/id}/users"},updateUser:{method:"PUT",url:"api/v1/label-trees{/id}/users{/user_id}"},removeUser:{method:"DELETE",url:"api/v1/label-trees{/id}/users{/user_id}"}})),biigle.$declare("api.labels",Vue.resource("api/v1/labels{/id}",{},{save:{method:"POST",url:"api/v1/label-trees{/label_tree_id}/labels"}})),biigle.$declare("api.notifications",Vue.resource("api/v1/notifications{/id}",{},{markRead:{method:"PUT"}})),biigle.$declare("api.projects",Vue.resource("api/v1/projects{/id}",{},{query:{url:"api/v1/projects/my"},queryVolumes:{method:"GET",url:"api/v1/projects{/id}/volumes"},saveVolume:{method:"POST",url:"api/v1/projects{/id}/volumes"},attachVolume:{method:"POST",url:"api/v1/projects{/id}/volumes{/volume_id}"},detachVolume:{method:"DELETE",url:"api/v1/projects{/id}/volumes{/volume_id}"},addUser:{method:"POST",url:"api/v1/projects{/id}/users{/user_id}"},updateUser:{method:"PUT",url:"api/v1/projects{/id}/users{/user_id}"},removeUser:{method:"DELETE",url:"api/v1/projects{/id}/users{/user_id}"},queryAvailableLabelTrees:{method:"GET",url:"api/v1/projects{/id}/label-trees/available"},attachLabelTree:{method:"POST",url:"api/v1/projects{/id}/label-trees"},detachLabelTree:{method:"DELETE",url:"api/v1/projects{/id}/label-trees{/label_tree_id}"}})),biigle.$declare("api.users",Vue.resource("api/v1/users{/id}",{},{find:{method:"GET",url:"api/v1/users/find{/query}"}})),biigle.$component("core.components.loader",{template:"<span class=\"loader\" :class=\"{'loader--active': active, 'loader--fancy': fancy}\"></span>",props:{active:{type:Boolean,required:!0},fancy:{type:Boolean,default:!1}}}),biigle.$component("core.components.loaderBlock",{template:'<div class="loader-block" :class="{\'loader-block--active\': active}"><loader :active="active" :fancy="true"></loader></div>',components:{loader:biigle.$require("core.components.loader")},props:{active:{type:Boolean,required:!0}}}),biigle.$component("core.components.memberListItem",{template:'<li class="list-group-item clearfix"><span class="pull-right"><span v-if="editing && !isOwnUser"><form class="form-inline"><select class="form-control input-sm" :title="\'Change the role of \' + name" v-model="roleId" @change="changeRole"><option v-for="role in roles" :value="role.id" v-text="role.name"></option></select> <button type="button" class="btn btn-default btn-sm" :title="\'Remove \' + name" @click="removeMember">Remove</button></form></span><span v-else><span class="text-muted" v-text="role.name"></span></span></span><span v-text="name"></span> <span class="text-muted" v-if="isOwnUser">(you)</span></li>',props:{member:{type:Object,required:!0},ownId:{type:Number,required:!0},editing:{type:Boolean,required:!0},roles:{type:Array,required:!0}},data:function(){return{roleId:null}},computed:{isOwnUser:function(){return this.member.id===this.ownId},name:function(){return this.member.firstname+" "+this.member.lastname},role:function(){var e=this;return this.roles.find(function(t){return e.member.role_id===t.id})}},methods:{removeMember:function(){this.$emit("remove",this.member)},changeRole:function(){this.$emit("update",this.member,{role_id:this.roleId})}},created:function(){this.roleId=this.member.role_id}}),biigle.$component("core.components.membersPanel",function(){var e=biigle.$require("messages.store"),t=biigle.$require("api.users");return{template:'<div class="panel panel-default" :class="classObject"><div class="panel-heading">Members<span class="pull-right"><loader :active="loading"></loader> <button class="btn btn-default btn-xs" title="Edit members" @click="toggleEditing" :class="{active: editing}"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></span></div><div class="panel-body" v-if="editing"><form class="form-inline" @submit.prevent="attachMember"><div class="form-group"><typeahead :items="availableUsers" placeholder="User name" @select="selectMember" :value="selectedMemberName"></typeahead> <select class="form-control" title="Role of the new user" v-model="selectedRole"><option v-for="role in roles" :value="role.id" v-text="role.name"></option></select> <button class="btn btn-default" type="submit" :disabled="!canAttachMember">Add</button></div></form></div><ul class="list-group list-group-restricted"><member-list-item v-for="member in members" :key="member.id" :member="member" :own-id="ownId" :editing="editing" :roles="roles" @update="updateMember" @remove="removeMember"></member-list-item><li class="list-group-item list-group-item-info" v-if="!hasMembers"><slot></slot></li></ul></div>',mixins:[biigle.$require("core.mixins.editor")],components:{typeahead:biigle.$require("core.components.typeahead"),memberListItem:biigle.$require("core.components.memberListItem"),loader:biigle.$require("core.components.loader")},data:function(){return{selectedMember:null,selectedRole:null,users:[]}},props:{members:{type:Array,required:!0},roles:{type:Array,required:!0},ownId:{type:Number,required:!0},defaultRole:{type:Number},loading:{type:Boolean,default:!1}},computed:{classObject:function(){return{"panel-warning":this.editing}},availableUsers:function(){return this.users.filter(this.isntMember)},canAttachMember:function(){return!this.loading&&this.selectedMember&&this.selectedRole},hasMembers:function(){return this.members.length>0},selectedMemberName:function(){return this.selectedMember?this.selectedMember.name:""},memberIds:function(){return this.members.map(function(e){return e.id})}},methods:{selectMember:function(e){this.selectedMember=e},attachMember:function(){var e={id:this.selectedMember.id,role_id:this.selectedRole,firstname:this.selectedMember.firstname,lastname:this.selectedMember.lastname};this.$emit("attach",e),this.selectedMember=null},updateMember:function(e,t){this.$emit("update",e,t)},removeMember:function(e){this.$emit("remove",e)},loadUsers:function(){t.query().then(this.usersLoaded,e.handleResponseError)},usersLoaded:function(e){e.data.forEach(function(e){e.name=e.firstname+" "+e.lastname}),Vue.set(this,"users",e.data)},isntMember:function(e){return this.memberIds.indexOf(e.id)===-1}},created:function(){this.defaultRole?this.selectedRole=this.defaultRole:this.selectedRole=this.roles[0].id,this.$once("editing.start",this.loadUsers)}}}),biigle.$component("core.components.sidebar",{template:'<aside class="sidebar" :class="classObject"><div class="sidebar__buttons" v-if="showButtons"><sidebar-button v-for="tab in tabs" :tab="tab" :direction="direction"></sidebar-button></div><div class="sidebar__tabs"><slot name="tabs"></slot></div></aside>',components:{sidebarButton:biigle.$require("core.components.sidebarButton")},data:function(){return{open:!1}},props:{openTab:{type:String},showButtons:{type:Boolean,default:!0},direction:{type:String,default:"right",validator:function(e){return"left"===e||"right"===e}}},computed:{classObject:function(){return{"sidebar--open":this.open,"sidebar--left":this.isLeft,"sidebar--right":!this.isLeft}},tabs:function(){for(var e=[],t=this.$slots.tabs.length-1;t>=0;t--)e.unshift(this.$slots.tabs[t].componentOptions.propsData);return e},isLeft:function(){return"left"===this.direction}},created:function(){this.$on("open",function(){this.open=!0,this.$emit("toggle")}),this.$on("close",function(){this.open=!1,this.$emit("toggle")})},mounted:function(){this.openTab&&this.$emit("open",this.openTab)}}),biigle.$component("core.components.sidebarButton",{template:'<a :href="href" :disabled="disabled" class="sidebar__button btn btn-default btn-lg" :class="classObject" @click="toggle" :title="tab.title"><span v-if="open" class="glyphicon" :class="chevronClass" aria-hidden="true"></span><span v-else class="glyphicon" :class="iconClass" aria-hidden="true"></span></a>',data:function(){return{open:!1}},props:{tab:{type:Object,required:!0},direction:{type:String,default:"right",validator:function(e){return"left"===e||"right"===e}}},computed:{iconClass:function(){return"glyphicon-"+this.tab.icon},chevronClass:function(){return"glyphicon-chevron-"+this.direction},classObject:function(){return{active:this.open}},disabled:function(){return this.tab.disabled},href:function(){return this.disabled?null:this.tab.href}},methods:{toggle:function(e){this.disabled||this.href||(e.preventDefault(),this.open?this.$parent.$emit("close"):this.$parent.$emit("open",this.tab.name))}},mounted:function(){var e=this;this.$parent.$on("open",function(t){e.open=t===e.tab.name}),this.$parent.$on("close",function(){e.open=!1})}}),biigle.$component("core.components.sidebarTab",{template:'<div class="sidebar__tab" :class="classObject"><slot></slot></div>',data:function(){return{open:!1}},props:{name:{type:String,required:!0},icon:{type:String,required:!0},title:{type:String},href:{type:String},disabled:{type:Boolean,default:!1}},computed:{classObject:function(){return{"sidebar__tab--open":this.open}}},created:function(){var e=this;this.$parent.$on("open",function(t){e.open=t===e.name}),this.$parent.$on("close",function(){e.open=!1})}}),biigle.$component("core.components.typeahead",{template:'<typeahead class="typeahead clearfix" :data="items" :placeholder="placeholder" :on-hit="selectItem" :template="template" :disabled="disabled" :value="value" match-property="name" @clear="clear"></typeahead>',data:function(){return{template:"{{item.name}}"}},components:{typeahead:VueStrap.typeahead},props:{items:{type:Array,required:!0},placeholder:{type:String,default:"Item name"},disabled:{type:Boolean,default:!1},value:{type:String,default:""}},methods:{selectItem:function(e,t){e&&(this.$emit("select",e),t.reset(),this.$nextTick(function(){t.val=t.value}))},clear:function(){this.$emit("select",void 0)}}}),biigle.$viewModel("messages-display",function(e){var t=biigle.$require("messages.store"),i={props:["message"],computed:{typeClass:function(){return this.message.type?"alert-"+this.message.type:"alert-info"}},methods:{close:function(){this.message?t.close(this.message.id):this.$el.remove()}}};new Vue({el:e,components:{message:i},data:{messages:t.all}})}),biigle.$declare("messages.store",new Vue({data:{max:1,all:[]},methods:{post:function(e,t){biigle.$require("utils.cb").exitFullscreen(),this.all.unshift({id:Date.now(),type:e,text:t}),this.all.length>this.max&&this.all.pop()},danger:function(e){this.post("danger",e)},warning:function(e){this.post("warning",e)},success:function(e){this.post("success",e)},info:function(e){this.post("info",e)},close:function(e){for(var t=this.all.length-1;t>=0;t--)this.all[t].id===e&&this.all.splice(t,1)},handleErrorResponse:function(e){var t=e.body;if(t){if(t.message)return void this.danger(t.message);if("string"==typeof t)return void this.danger(t)}if(422===e.status)for(var i in t)this.danger(t[i][0]);else 403===e.status?this.danger("You have no permission to do that."):401===e.status?this.danger("Please log in (again)."):this.danger("The server didn't respond, sorry.")}}})),$biiglePostMessage=biigle.$require("messages.store.post"),biigle.$component("core.mixins.editor",{data:function(){return{editing:!1}},methods:{startEditing:function(){this.editing=!0,this.$emit("editing.start")},finishEditing:function(){this.editing=!1,this.$emit("editing.stop")},toggleEditing:function(){this.editing?this.finishEditing():this.startEditing()}}}),biigle.$component("core.mixins.loader",{components:{loader:biigle.$require("core.components.loader")},data:function(){return{loading:!1}},methods:{startLoading:function(){this.loading=!0,this.$emit("loading",!0)},finishLoading:function(){this.loading=!1,this.$emit("loading",!1)}}}),biigle.$viewModel("notifications-list",function(e){var t=biigle.$require("api.notifications"),i=biigle.$require("notifications.store"),r=biigle.$require("messages.store"),n={props:["item","removeItem"],data:function(){return{isLoading:!1}},computed:{classObject:function(){return this.item.data.type?"panel-"+this.item.data.type:"panel-default"},isUnread:function(){return null===this.item.read_at}},methods:{markRead:function(e){var n=this;this.isLoading=!0,t.markRead({id:this.item.id},{}).then(function(e){n.item.read_at=new Date,n.removeItem&&i.remove(n.item.id)},function(t){e||r.handleErrorResponse(t)}).finally(function(){n.isLoading=!1})}}};new Vue({el:e,components:{notification:n},data:{notifications:i.all},methods:{hasNotifications:function(){return i.count()>0}}})}),biigle.$viewModel("notifications-navbar-indicator",function(e){var t=biigle.$require("notifications.store");new Vue({el:e,computed:{unread:function(){return t.isInitialized()?t.hasUnread():"true"===this.$el.attributes.unread.value}}})}),biigle.$declare("notifications.store",new Vue({data:{_all:null,initialized:!1},computed:{all:{get:function(){return this._all||[]},set:function(e){this.initialized=!0,this._all=e}},unread:function(){return this.all.filter(function(e){return null===e.read_at})}},methods:{isInitialized:function(){return this.initialized},count:function(){return this.all.length},countUnread:function(){return this.unread.length},hasUnread:function(){for(var e=this.all.length-1;e>=0;e--)if(null===this.all[e].read_at)return!0;return!1},remove:function(e){for(var t=this.all.length-1;t>=0;t--)this.all[t].id===e&&this.all.splice(t,1)}}})),biigle.$viewModel("notifications-unread-count",function(e){var t=biigle.$require("notifications.store");new Vue({el:e,computed:{count:t.countUnread}})}),biigle.$viewModel("system-messages-edit-form",function(e){var t=e.querySelector('textarea[name="body"]'),i="";t&&(i=t.value,t.innerHTML=""),new Vue({el:e,data:{body:i}})}),biigle.$declare("utils.cb",{exitFullscreen:function(){document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()}}),angular.module("biigle.ui.users").directive("userChooser",function(){"use strict";return{restrict:"A",scope:{select:"=userChooser"},replace:!0,template:'<input type="text" data-ng-model="selected" data-uib-typeahead="name(user) for user in find($viewValue)" data-typeahead-wait-ms="250" data-typeahead-on-select="select($item)"/>',controller:["$scope","User",function(e,t){e.name=function(e){return e&&e.firstname&&e.lastname?e.firstname+" "+e.lastname:""},e.find=function(e){return t.find({query:encodeURIComponent(e)}).$promise}}]}}),angular.module("biigle.ui.messages").service("msg",function(){"use strict";var e=this;this.post=function(e,t){t=t||e,window.$biiglePostMessage(e,t)},this.danger=function(t){e.post("danger",t)},this.warning=function(t){e.post("warning",t)},this.success=function(t){e.post("success",t)},this.info=function(t){e.post("info",t)},this.responseError=function(t){var i=t.data;if(i)if(i.message)e.danger(i.message);else if("string"==typeof i)e.danger(i);else for(var r in i)e.danger(i[r][0]);else 403===t.status?e.danger("You have no permission to do that."):401===t.status?e.danger("Please log in (again)."):e.danger("The server didn't respond, sorry.")}}),angular.module("biigle.ui.utils").factory("debounce",["$timeout","$q",function(e,t){"use strict";var i={};return function(r,n,a){var s=t.defer();return function(){var o=this,l=arguments,u=function(){i[a]=void 0,s.resolve(r.apply(o,l)),s=t.defer()};return i[a]&&e.cancel(i[a]),i[a]=e(u,n),s.promise}()}}]),angular.module("biigle.ui.utils").factory("filterExclude",function(){"use strict";var e=function(e,t){return e-t},t=function(t,i,r){r||(i=i.slice(0).sort(e));for(var n=t.slice(0).sort(e),a=0,s=0;a<i.length&&s<n.length;)i[a]<n[s]?a++:i[a]===n[s]?(t.splice(t.indexOf(n[s]),1),a++,s++):s++};return t}),angular.module("biigle.ui.utils").factory("filterSubset",function(){"use strict";var e=function(e,t){return e-t},t=function(t,i,r){r||(i=i.slice(0).sort(e));for(var n=t.slice(0).sort(e),a=[],s=0,o=0;s<i.length&&o<n.length;)i[s]<n[o]?s++:i[s]===n[o]?(s++,o++):a.push(n[o++]);for(;o<n.length;)a.push(n[o++]);for(s=0;s<a.length;s++)t.splice(t.indexOf(a[s]),1)};return t}),angular.module("biigle.ui.utils").service("keyboard",["$document",function(e){"use strict";var t={},i=e[0].body,r=function(e,t){for(var i=e.length-1;i>=0;i--)if(e[i].callback(t)===!1)return},n=function(e){if(e.target===i){var n=e.keyCode,a=String.fromCharCode(e.which||n).toLowerCase();t[n]&&r(t[n],e),t[a]&&r(t[a],e)}};e.bind("keydown",n),this.on=function(e,i,r){("string"==typeof e||e instanceof String)&&(e=e.toLowerCase()),r=r||0;var n={callback:i,priority:r};if(t[e]){var a,s=t[e];for(a=0;a<s.length&&!(s[a].priority>=r);a++);a===s.length-1?s.push(n):s.splice(a,0,n)}else t[e]=[n]},this.off=function(e,i){if(("string"==typeof e||e instanceof String)&&(e=e.toLowerCase()),t[e])for(var r=t[e],n=0;n<r.length;n++)if(r[n].callback===i){r.splice(n,1);break}}}]),angular.module("biigle.ui.utils").service("urlParams",["$location",function(e){"use strict";this.setSlug=function(t){var i=e.path();i=i.substring(0,i.lastIndexOf("/")),e.path(i+"/"+t),e.replace()},this.set=function(t){e.search(t),e.replace()},this.unset=function(t){e.search(t,null),e.replace()},this.get=function(t){return e.search()[t]}}]);