angular.module("dias.annotations",["dias.api","dias.ui"]),angular.module("dias.annotations").config(["$compileProvider",function(t){"use strict";t.debugInfoEnabled(!1)}]),angular.module("dias.annotations").controller("AnnotationsController",["$scope","mapAnnotations","labels","annotations","shapes",function(t,e,n,o,i){"use strict";var r=e.getSelectedFeatures();t.selectedFeatures=r.getArray();var a=function(){t.annotations=o.current()};t.annotations=[],t.clearSelection=e.clearSelection,t.selectAnnotation=function(n,o){n.shiftKey||t.clearSelection(),e.select(o)},t.fitAnnotation=e.fit,t.isSelected=function(t){var e=!1;return r.forEach(function(n){n.annotation&&n.annotation.id==t&&(e=!0)}),e},t.$on("image.shown",a)}]),angular.module("dias.annotations").controller("AnnotatorController",["$scope","images","urlParams","msg","IMAGE_ID","keyboard","viewport",function(t,e,n,o,i,r,a){"use strict";var s=document.querySelector(".navbar-annotations-filename");t.imageLoading=!0;var l=function(t){return s.innerHTML=t._filename,t},c=function(e){return t.imageLoading=!1,t.$broadcast("image.shown",e),e},u=function(t){return n.setSlug(t._id),t},f=function(){t.imageLoading=!0},d=function(t){return f(),e.show(t).then(c)["catch"](o.responseError)};t.nextImage=function(){return f(),e.next().then(l).then(c).then(u)["catch"](o.responseError)},t.prevImage=function(){return f(),e.prev().then(l).then(c).then(u)["catch"](o.responseError)},t.$on("canvas.moveend",function(t,e){a.set(e)}),r.on(37,function(){t.prevImage(),t.$apply()}),r.on(39,function(){t.nextImage(),t.$apply()}),r.on(32,function(){t.nextImage(),t.$apply()}),e.init(),d(parseInt(i)).then(u)}]),angular.module("dias.annotations").controller("CanvasController",["$scope","mapImage","mapAnnotations","map","$timeout","debounce",function(t,e,n,o,i,r){"use strict";var a=o.getView();o.on("moveend",function(e){var n=function(){t.$emit("canvas.moveend",{center:a.getCenter(),zoom:a.getZoom()})};r(n,100,"annotator.canvas.moveend")}),o.on("change:view",function(){a=o.getView()}),e.init(t),n.init(t);var s=function(){i(function(){o.updateSize()},50,!1)};t.$on("sidebar.foldout.open",s),t.$on("sidebar.foldout.close",s)}]),angular.module("dias.annotations").controller("CategoriesController",["$scope","labels","keyboard",function(t,e,n){"use strict";var o=9,i="dias.annotations.label-favourites",r=function(){var e=t.favourites.map(function(t){return t.id});window.localStorage[i]=JSON.stringify(e)},a=function(){if(window.localStorage[i]){var e=JSON.parse(window.localStorage[i]);t.favourites=t.categories.filter(function(t){return-1!==e.indexOf(t.id)})}},s=function(e){e>=0&&e<t.favourites.length&&t.selectItem(t.favourites[e])};t.hotkeysMap=["𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵"],t.categories=[],t.favourites=[],t.categories=e.getList(),t.categoriesTree=e.getTree(),a(),t.selectItem=function(n){e.setSelected(n),t.searchCategory="",t.$broadcast("categories.selected")},t.isFavourite=function(e){return-1!==t.favourites.indexOf(e)},t.toggleFavourite=function(e,n){e.stopPropagation();var i=t.favourites.indexOf(n);-1===i&&t.favourites.length<o?t.favourites.push(n):t.favourites.splice(i,1),r()},t.favouritesLeft=function(){return t.favourites.length<o},n.on("1",function(){s(0),t.$apply()}),n.on("2",function(){s(1),t.$apply()}),n.on("3",function(){s(2),t.$apply()}),n.on("4",function(){s(3),t.$apply()}),n.on("5",function(){s(4),t.$apply()}),n.on("6",function(){s(5),t.$apply()}),n.on("7",function(){s(6),t.$apply()}),n.on("8",function(){s(7),t.$apply()}),n.on("9",function(){s(8),t.$apply()})}]),angular.module("dias.annotations").controller("ConfidenceController",["$scope","labels",function(t,e){"use strict";t.confidence=1,t.$watch("confidence",function(n){e.setCurrentConfidence(parseFloat(n)),.25>=n?t.confidenceClass="label-danger":.5>=n?t.confidenceClass="label-warning":.75>=n?t.confidenceClass="label-success":t.confidenceClass="label-primary"})}]),angular.module("dias.annotations").controller("DrawingControlsController",["$scope","mapAnnotations","labels","msg","$attrs","keyboard",function(t,e,n,o,i,r){"use strict";t.selectShape=function(r){if(null!==r&&t.selectedShape()!==r){if(!n.hasSelected())return t.$emit("sidebar.foldout.do-open","categories"),void o.info(i.selectCategory);e.startDrawing(r)}else e.finishDrawing()},t.selectedShape=e.getSelectedDrawingType,r.on(27,function(){t.selectShape(null),t.$apply()}),r.on("a",function(){t.selectShape("Point"),t.$apply()}),r.on("s",function(){t.selectShape("Rectangle"),t.$apply()}),r.on("d",function(){t.selectShape("Circle"),t.$apply()}),r.on("f",function(){t.selectShape("LineString"),t.$apply()}),r.on("g",function(){t.selectShape("Polygon"),t.$apply()})}]),angular.module("dias.annotations").controller("EditControlsController",["$scope","mapAnnotations","keyboard","$timeout",function(t,e,n,o){"use strict";var i,r=!1,a=1e4;t.deleteSelectedAnnotations=function(){e.hasSelectedFeatures()&&confirm("Are you sure you want to delete all selected annotations?")&&e.deleteSelected()},t.hasSelectedAnnotations=e.hasSelectedFeatures;var s=function(){e.startMoving()},l=function(){e.finishMoving()};t.moveSelectedAnnotations=function(){t.isMoving()?l():s()},t.canDeleteLastAnnotation=function(){return r&&e.hasDrawnAnnotation()},t.deleteLastDrawnAnnotation=function(){e.deleteLastDrawnAnnotation()},t.isMoving=e.isMoving,t.$on("annotations.drawn",function(t,e){r=!0,o.cancel(i),i=o(function(){r=!1},a)}),n.on(46,function(e){t.deleteSelectedAnnotations(),t.$apply()}),n.on(27,function(){t.isMoving()&&t.$apply(l)}),n.on(8,function(e){t.canDeleteLastAnnotation()&&(e.preventDefault(),t.deleteLastDrawnAnnotation(),t.$apply())}),n.on("m",function(){t.$apply(t.moveSelectedAnnotations)})}]),angular.module("dias.annotations").controller("FiltersControlController",["$scope","mapImage",function(t,e){"use strict";t.supportsFilters=e.supportsFilters}]),angular.module("dias.annotations").controller("FiltersController",["$scope","debounce","mapImage",function(t,e,n){"use strict";var o="dias.annotations.filter",i=!1,r={brightnessContrast:[0,0],brightnessRGB:[0,0,0],hueSaturation:[0,0],vibrance:[0]};t.filters={brightnessContrast:[0,0],brightnessRGB:[0,0,0],hueSaturation:[0,0],vibrance:[0]};var a=function(){n.filter(t.filters)};t.reset=function(e,n){void 0===e?(t.filters=angular.copy(r),a()):r.hasOwnProperty(e)&&(t.filters[e][n]=r[e][n],a())},t.toggleBrightnessRGB=function(){i?t.filters.brightnessRGB=angular.copy(r.brightnessRGB):t.filters.brightnessContrast[0]=r.brightnessContrast[0],i=!i,a()},t.isBrightnessRgbActive=function(){return i},t.$watch("filters",function(t){e(a,100,o)},!0)}]),angular.module("dias.annotations").controller("MinimapController",["$scope","map","mapImage","$element","styles",function(t,e,n,o,i){"use strict";var r=o[0],a=new ol.source.Vector,s=new ol.Map({target:r,controls:[],interactions:[]}),l=e.getSize(),c=e.getView();s.addLayer(n.getLayer()),s.addLayer(new ol.layer.Vector({source:a,style:i.viewport}));var u=new ol.Feature;a.addFeature(u),t.$on("image.shown",function(){var t=n.getExtent();s.setView(new ol.View({projection:n.getProjection(),center:ol.extent.getCenter(t),resolution:Math.max(t[2]/r.clientWidth,t[3]/r.clientHeight)}))});var f=function(){u.setGeometry(ol.geom.Polygon.fromExtent(c.calculateExtent(l)))};e.on("change:size",function(){l=e.getSize()}),e.on("change:view",function(){c=e.getView()}),e.on("postcompose",f);var d=function(t){c.setCenter(t.coordinate)};s.on("pointerdrag",d),o.on("mouseleave",function(){s.un("pointerdrag",d)}),o.on("mouseenter",function(){s.on("pointerdrag",d)})}]),angular.module("dias.annotations").controller("SelectedLabelController",["$scope","labels",function(t,e){"use strict";t.getSelectedLabel=e.getSelected,t.hasSelectedLabel=e.hasSelected}]),angular.module("dias.annotations").controller("SettingsAnnotationOpacityController",["$scope","mapAnnotations",function(t,e){"use strict";t.setDefaultSettings("annotation_opacity","1"),t.$watch("settings.annotation_opacity",function(t){e.setOpacity(t)})}]),angular.module("dias.annotations").controller("SettingsAnnotationsCyclingController",["$scope","mapAnnotations","labels","keyboard",function(t,e,n,o){"use strict";var i=!1,r="annotations",a=function(n){return!i&&t.cycling()?(e.hasNext()?e.cycleNext():(t.nextImage().then(e.jumpToFirst),i=!0),n&&t.$apply(),!1):void 0},s=function(n){return!i&&t.cycling()?(e.hasPrevious()?e.cyclePrevious():(t.prevImage().then(e.jumpToLast),i=!0),n&&t.$apply(),!1):void 0},l=function(o){i||(o&&o.preventDefault(),t.cycling()&&n.hasSelected()?n.attachToAnnotation(e.getCurrent()).$promise.then(function(){e.flicker(1)}):e.flicker())},c=function(e){return e.preventDefault(),t.stopCycling(),t.$apply(),!1};t.attributes={restrict:!1},t.cycling=function(){return t.getVolatileSettings("cycle")===r},t.startCycling=function(){t.setVolatileSettings("cycle",r)},t.stopCycling=function(){t.setVolatileSettings("cycle","")},t.$watch("volatileSettings.cycle",function(t,n){t===r?(o.on(37,s,10),o.on(39,a,10),o.on(32,a,10),o.on(13,l,10),o.on(27,c,10),e.jumpToCurrent()):n===r&&(o.off(37,s),o.off(39,a),o.off(32,a),o.off(13,l),o.off(27,c),e.clearSelection())});var u,f=function(){u&&u(),u=t.$watch(n.getSelected,function(){t.cycling()&&e.jumpToFirst()})};t.$watch("attributes.restrict",function(n){e.setRestrictLabelCategory(n),t.cycling()&&e.jumpToFirst(),n?f():u&&u()}),t.$on("image.shown",function(){i=!1}),t.prevAnnotation=s,t.nextAnnotation=a,t.attachLabel=l}]),angular.module("dias.annotations").controller("SettingsController",["$scope","debounce",function(t,e){"use strict";var n="dias.annotations.settings",o={};t.settings={},t.volatileSettings={};var i=function(){var e=angular.copy(t.settings);for(var i in e)e[i]===o[i]&&delete e[i];window.localStorage[n]=JSON.stringify(e)},r=function(){e(i,250,n)},a=function(){var t={};return window.localStorage[n]&&(t=JSON.parse(window.localStorage[n])),angular.extend(t,o)};t.setSettings=function(e,n){t.settings[e]=n},t.getSettings=function(e){return t.settings[e]},t.setDefaultSettings=function(e,n){o[e]=n,t.settings.hasOwnProperty(e)||t.setSettings(e,n)},t.setVolatileSettings=function(e,n){t.volatileSettings[e]=n},t.getVolatileSettings=function(e){return t.volatileSettings[e]},t.$watch("settings",r,!0),angular.extend(t.settings,a())}]),angular.module("dias.annotations").controller("SettingsSectionCyclingController",["$scope","map","mapImage","keyboard",function(t,e,n,o){"use strict";var i,r=!1,a="sections",s=[0,0],l=[0,0],c=[0,0],u=[0,0],f=function(t,e){return Math.sqrt(Math.pow(t[0]-e[0],2)+Math.pow(t[1]-e[1],2))},d=function(t){for(var e=1/0,n=0,o=[0,0],i=0;i<=c[1];i++)for(var r=0;r<=c[0];r++)n=f(t,y([r,i])),e>n&&(o[0]=r,o[1]=i,e=n);return o},g=function(){i=e.getView(),i.on("change:resolution",h);var t=n.getExtent(),o=i.calculateExtent(e.getSize());l[0]=o[2]-o[0],l[1]=o[3]-o[1],s[0]=l[0]/2,s[1]=l[1]/2,c[0]=Math.ceil(t[2]/l[0])-1,c[1]=Math.ceil(t[3]/l[1])-1;var r;c[0]>0?(r=l[0]*(c[0]+1)-t[2],l[0]-=r/c[0]):(l[0]=o[2],s[0]=t[2]/2),c[1]>0?(r=l[1]*(c[1]+1)-t[3],l[1]-=r/c[1]):(l[1]=o[3],s[1]=t[3]/2)},h=function(){g();var t=d(y(u));u[0]=t[0],u[1]=t[1]},p=function(){g(),w(d(i.getCenter()))},m=function(){w([0,0])},v=function(){w(c)},y=function(t){return[t[0]*l[0]+s[0],t[1]*l[1]+s[1]]},w=function(t){u[0]=t[0],u[1]=t[1],i.setCenter(y(u))},S=function(){return u[0]<c[0]?[u[0]+1,u[1]]:[0,u[1]+1]},b=function(){return u[0]>0?[u[0]-1,u[1]]:[c[0],u[1]-1]},C=function(e){return!r&&t.cycling()?(u[0]<c[0]||u[1]<c[1]?w(S()):(t.nextImage().then(g).then(m),r=!0),e&&t.$apply(),!1):void 0},$=function(e){return!r&&t.cycling()?(u[0]>0||u[1]>0?w(b()):(t.prevImage().then(g).then(v),r=!0),e&&t.$apply(),!1):void 0},A=function(e){return e.preventDefault(),t.stopCycling(),t.$apply(),!1};t.cycling=function(){return t.getVolatileSettings("cycle")===a},t.startCycling=function(){t.setVolatileSettings("cycle",a)},t.stopCycling=function(){t.setVolatileSettings("cycle","")},t.$watch("volatileSettings.cycle",function(t,n){t===a?(e.on("change:size",p),g(),m(),o.on(37,$,10),o.on(39,C,10),o.on(32,C,10),o.on(27,A,10)):n===a&&(e.un("change:size",p),i.un("change:resolution",h),o.off(37,$),o.off(39,C),o.off(32,C),o.off(27,A))}),t.$on("image.shown",function(){r=!1}),t.prevSection=$,t.nextSection=C}]),angular.module("dias.annotations").controller("SidebarCategoryFoldoutController",["$scope","keyboard",function(t,e){"use strict";e.on(9,function(e){e.preventDefault(),t.toggleFoldout("categories"),t.$apply()})}]),angular.module("dias.annotations").controller("SidebarController",["$scope","$rootScope",function(t,e){"use strict";var n="dias.annotations.sidebar-foldout";t.foldout="",t.openFoldout=function(o){window.localStorage[n]=o,t.foldout=o,e.$broadcast("sidebar.foldout.open",o)},t.closeFoldout=function(){window.localStorage.removeItem(n),t.foldout="",e.$broadcast("sidebar.foldout.close")},t.toggleFoldout=function(e){t.foldout===e?t.closeFoldout():t.openFoldout(e)},e.$on("sidebar.foldout.do-open",function(e,n){t.openFoldout(n)}),window.localStorage[n]&&t.openFoldout(window.localStorage[n])}]),angular.module("dias.annotations").directive("annotationListItem",["labels",function(t){"use strict";return{scope:!0,controller:["$scope",function(e){e.shapeClass="icon-"+e.annotation.shape.toLowerCase(),e.selected=function(){return e.isSelected(e.annotation.id)},e.attachLabel=function(){t.attachToAnnotation(e.annotation)},e.removeLabel=function(n){t.removeFromAnnotation(e.annotation,n)},e.canAttachLabel=function(){return e.selected()&&t.hasSelected()},e.currentLabel=t.getSelected,e.currentConfidence=t.getCurrentConfidence}]}}]),angular.module("dias.annotations").directive("labelCategoryItem",["$compile","$timeout","$templateCache",function(t,e,n){"use strict";return{restrict:"C",templateUrl:"label-item.html",scope:!0,link:function(o,i,r){var a=angular.element(n.get("label-subtree.html"));e(function(){i.append(t(a)(o))})},controller:["$scope","labels",function(t,e){var n=!1,o=!1,i=!1,r=function(){e.isOpen(t.item)?(n=!0,i=!1):e.isSelected(t.item)?(n=!0,i=!0):(n=!1,i=!1)},a=function(){o=t.tree&&!!t.tree[t.item.id]};t.getSubtree=function(){return n&&t.tree?t.tree[t.item.id]:[]},t.getClass=function(){return{open:n,expandable:o,selected:i}},t.$on("categories.selected",r),r(),a()}]}}]),angular.module("dias.annotations").directive("labelItem",function(){"use strict";return{controller:["$scope",function(t){var e=t.annotationLabel.confidence;.25>=e?t["class"]="label-danger":.5>=e?t["class"]="label-warning":.75>=e?t["class"]="label-success":t["class"]="label-primary"}]}}),angular.module("dias.annotations").factory("ZoomToNativeControl",function(){"use strict";function t(t){var e=t||{},n=e.label?e.label:"1",o=document.createElement("button"),i=this;o.innerHTML=n,o.title="Zoom to original resolution",o.addEventListener("click",function(){i.zoomToNative.call(i)});var r=document.createElement("div");r.className="zoom-to-native ol-unselectable ol-control",r.appendChild(o),ol.control.Control.call(this,{element:r,target:e.target}),this.duration_=void 0!==e.duration?e.duration:250}return ol.inherits(t,ol.control.Control),t.prototype.zoomToNative=function(){var t=this.getMap(),e=t.getView();if(e){var n=e.getResolution();n&&(this.duration_>0&&t.beforeRender(ol.animation.zoom({resolution:n,duration:this.duration_,easing:ol.easing.easeOut})),e.setResolution(e.constrainResolution(1)))}},t}),angular.module("dias.annotations").factory("map",["ZoomToNativeControl",function(t){"use strict";var e=new ol.Map({target:"canvas",renderer:"canvas",controls:[new ol.control.Zoom,new ol.control.ZoomToExtent({tipLabel:"Zoom to show whole image",label:""}),new ol.control.FullScreen({label:""}),new t({label:""})],interactions:ol.interaction.defaults({keyboard:!1})});return e}]),angular.module("dias.annotations").service("annotations",["Annotation","shapes","msg",function(t,e,n){"use strict";var o,i,r={},a=function(t){return t.shape=e.getName(t.shape_id),t},s=function(t){return o.push(t),t};this.query=function(e){return r.hasOwnProperty(e.id)?o=r[e.id]:(o=t.query(e),r[e.id]=o,o.$promise.then(function(t){t.forEach(a)})),i=o.$promise,o},this.add=function(o){!o.shape_id&&o.shape&&(o.shape_id=e.getId(o.shape));var i=t.add(o);return i.$promise.then(a).then(s)["catch"](n.responseError),i},this["delete"]=function(t){var e=o.indexOf(t);return e>-1?t.$delete(function(){e=o.indexOf(t),o.splice(e,1)},n.responseError):void 0},this.forEach=function(t){return o.forEach(t)},this.current=function(){return o},this.getPromise=function(){return i}}]),angular.module("dias.annotations").service("images",["$rootScope","URL","$q","filterSubset","TRANSECT_ID","IMAGES_IDS","IMAGES_FILENAMES",function(t,e,n,o,i,r,a){"use strict";var s=this,l=[],c=5,u=[];this.currentImage=void 0;var f=function(t){var e=r.indexOf(t);return a[e]},d=function(t){t=t||s.currentImage._id;var e=l.indexOf(t);return l[(e+1)%l.length]},g=function(t){t=t||s.currentImage._id;var e=l.indexOf(t),n=l.length;return l[(e-1+n)%n]},h=function(t){t=t||s.currentImage._id;for(var e=u.length-1;e>=0;e--)if(u[e]._id==t)return u[e]},p=function(t){return s.currentImage=t,t},m=function(o){var i=n.defer(),r=h(o);return r?i.resolve(r):(r=document.createElement("img"),r._id=o,r._filename=f(o),r.onload=function(){u.push(r),u.length>c&&u.shift(),i.resolve(r)},r.onerror=function(t){i.reject(t)},r.src=e+"/api/v1/images/"+o+"/file"),t.$broadcast("image.fetching",r),i.promise},v=function(t){return m(d(t._id)),m(g(t._id)),t};this.init=function(){l=r;var t=window.localStorage["dias.transects."+i+".images"];t&&(t=JSON.parse(t),o(t,l),l=t)},this.show=function(t){return m(t).then(p).then(v)},this.next=function(){return s.show(d())},this.prev=function(){return s.show(g())},this.getCurrentId=function(){return s.currentImage._id}}]),angular.module("dias.annotations").service("labels",["AnnotationLabel","msg","LABEL_TREES",function(t,e,n){"use strict";var o,i=1,r=n,a={},s=[],l=[],c=function(){for(var t=null,e=function(e){var n=e.parent_id;a[t][n]?a[t][n].push(e):a[t][n]=[e]},n=r.length-1;n>=0;n--)t=r[n].name,a[t]={},r[n].labels.forEach(e),s=s.concat(r[n].labels)},u=function(t){for(var e=s.length-1;e>=0;e--)if(s[e].id===t)return s[e];return null},f=function(t){var e=t;if(l.length=0,e)for(;null!==e.parent_id;)l.unshift(e.parent_id),e=u(e.parent_id)};this.fetchForAnnotation=function(e){return e?(e.labels||(e.labels=t.query({annotation_id:e.id})),e.labels):void 0},this.attachToAnnotation=function(n){var r=t.attach({annotation_id:n.id,label_id:o.id,confidence:i});return r.$promise.then(function(){n.labels.push(r)}),r.$promise["catch"](e.responseError),r},this.removeFromAnnotation=function(n,o){var i=n.labels.indexOf(o);return i>-1?t["delete"]({id:o.id},function(){i=n.labels.indexOf(o),n.labels.splice(i,1)},e.responseError):void 0},this.getTree=function(){return a},this.getList=function(){return s},this.setSelected=function(t){o=t,f(t)},this.getSelected=function(){return o},this.hasSelected=function(){return!!o},this.getSelectedId=function(){return o?o.id:null},this.setCurrentConfidence=function(t){i=t},this.getCurrentConfidence=function(){return i},this.isOpen=function(t){return-1!==l.indexOf(t.id)},this.isSelected=function(t){return o&&o.id===t.id},c()}]),angular.module("dias.annotations").service("mapAnnotations",["map","images","annotations","debounce","styles","$interval","labels",function(t,e,n,o,i,r,a){"use strict";var s=new ol.Collection,l=new ol.source.Vector({features:s}),c=new ol.layer.Vector({source:l,style:i.features,zIndex:100}),u=new ol.interaction.Select({style:i.highlight,layers:[c],multi:!0}),f=u.getFeatures(),d=new ol.interaction.Modify({features:s,deleteCondition:function(t){return ol.events.condition.shiftKeyOnly(t)&&ol.events.condition.singleClick(t)}});d.setActive(!1);var g=new ol.interaction.Translate({features:f});g.setActive(!1);var h,p,m,v,y=0,w=!1,S=this,b=function(e){S.clearSelection(),e&&(f.push(e),t.getView().fit(e.getGeometry(),t.getSize(),{padding:[50,50,50,50]}))},C=function(t,n){return n%2===1?e.currentImage.height-t:t},$=function(t){var e;switch(t.getType()){case"Circle":e=[t.getCenter(),[t.getRadius()]];break;case"Polygon":case"Rectangle":e=t.getCoordinates()[0];break;case"Point":e=[t.getCoordinates()];break;default:e=t.getCoordinates()}return[].concat.apply([],e).map(Math.round).map(C)},A=function(t){var e=t.target,n=function(){e.annotation.points=$(e.getGeometry()),e.annotation.$save()};o(n,500,e.annotation.id)},I=function(t){for(var n,o=t.points,i=[],r=e.currentImage.height,a=0;a<o.length;a+=2)i.push([o[a],r-(o[a+1]||0)]);switch(t.shape){case"Point":n=new ol.geom.Point(i[0]);break;case"Rectangle":n=new ol.geom.Rectangle([i]);break;case"Polygon":n=new ol.geom.Polygon([i]);break;case"LineString":n=new ol.geom.LineString(i);break;case"Circle":n=new ol.geom.Circle(i[0],i[1][0]);break;default:return void console.error("Unknown annotation shape: "+t.shape)}var s=new ol.Feature({geometry:n});s.annotation=t,t.labels&&t.labels.length>0&&(s.color=t.labels[0].label.color),s.on("change",A),l.addFeature(s)},x=function(t,e){l.clear(),S.clearSelection(),m=null,n.query({id:e._id}).$promise.then(function(){n.forEach(I)})},F=function(t){var o=t.feature.getGeometry(),i=a.getSelected();return t.feature.color=i.color,t.feature.annotation=n.add({id:e.getCurrentId(),shape:o.getType(),points:$(o),label_id:i.id,confidence:a.getCurrentConfidence()}),t.feature.annotation.$promise["catch"](function(){l.removeFeature(t.feature)}),t.feature.on("change",A),m=t.feature,t.feature.annotation.$promise},L=function(t){t&&t.annotation&&(t===m&&(m=null),n["delete"](t.annotation).then(function(){l.removeFeature(t),f.remove(t)}))},k=function(t){if(!t.labels)return!1;for(var e=a.getSelectedId(),n=0;n<t.labels.length;n++)if(t.labels[n].label&&t.labels[n].label.id===e)return!0;return!1},E=function(t){return!w||k(t.annotation)},_=function(){return s.getArray().filter(E)};this.init=function(e){v=e,t.addLayer(c),t.addInteraction(u),t.addInteraction(g),t.addInteraction(d),e.$on("image.shown",x);var n=function(){e.$$phase||e.$apply()};f.on("change:length",n)},this.startDrawing=function(e){u.setActive(!1),d.setActive(!0),S.finishMoving(),t.removeInteraction(h),p=e||"Point",h=new ol.interaction.Draw({source:l,type:p,style:i.editing}),t.addInteraction(h),h.on("drawend",F),h.on("drawend",function(t){v.$broadcast("annotations.drawn",t.feature)})},this.finishDrawing=function(){t.removeInteraction(h),h.setActive(!1),p=void 0,u.setActive(!0),d.setActive(!1),S.clearSelection()},this.isDrawing=function(){return h&&h.getActive()},this.startMoving=function(){S.isDrawing()&&S.finishDrawing(),g.setActive(!0)},this.finishMoving=function(){g.setActive(!1)},this.isMoving=function(){return g.getActive()},this.hasDrawnAnnotation=function(){return m&&m.annotation&&m.annotation.$resolved},this.deleteLastDrawnAnnotation=function(){L(m)},this.deleteSelected=function(){f.forEach(L)},this.select=function(t){var e;l.forEachFeature(function(n){n.annotation.id===t&&(e=n)}),f.remove(e)||f.push(e)},this.hasSelectedFeatures=function(){return f.getLength()>0},this.fit=function(e){l.forEachFeature(function(n){if(n.annotation.id===e){var o=t.getView(),i=ol.animation.pan({source:o.getCenter()}),r=ol.animation.zoom({resolution:o.getResolution()});t.beforeRender(i,r),o.fit(n.getGeometry(),t.getSize())}})},this.clearSelection=function(){f.clear()},this.getSelectedFeatures=function(){return f},this.getSelectedDrawingType=function(){return p},this.addFeature=function(t){return l.addFeature(t),F({feature:t})},this.setOpacity=function(t){c.setOpacity(t)},this.cycleNext=function(){y=(y+1)%_().length,S.jumpToCurrent()},this.hasNext=function(){return y+1<_().length},this.cyclePrevious=function(){var t=_().length;y=(y+t-1)%t,S.jumpToCurrent()},this.hasPrevious=function(){return y>0},this.jumpToCurrent=function(){n.getPromise().then(function(){b(_()[y])})},this.jumpToFirst=function(){y=0,S.jumpToCurrent()},this.jumpToLast=function(){n.getPromise().then(function(){var t=_().length;0!==t&&(y=t-1),S.jumpToCurrent()})},this.flicker=function(t){var e=f.item(0);if(e){t=t||3;var n=function(){f.getLength()>0?f.clear():f.push(e)};r(n,100,2*t)}},this.getCurrent=function(){return _()[y].annotation},this.setRestrictLabelCategory=function(t){w=t}}]),angular.module("dias.annotations").service("mapImage",["map","viewport",function(t,e){"use strict";var n=[0,0,0,0],o=null,i=document.createElement("canvas"),r=i.getContext("2d"),a=!0,s=!0;try{var l=fx.canvas(),c=null,u=null}catch(f){a=!1,console.log(f)}window.onbeforeunload=function(){c&&(c.destroy(),l.width=1,l.height=1)};var d=new ol.proj.Projection({code:"dias-image",units:"pixels",extent:n}),g=new ol.layer.Image,h={brightnessContrast:[0,0],brightnessRGB:[0,0,0],hueSaturation:[0,0],vibrance:[0]},p={brightnessContrast:[0,0],brightnessRGB:[0,0,0],hueSaturation:[0,0],vibrance:[0]},m=function(t,e){var n=l._.gl.getParameter(l._.gl.MAX_TEXTURE_SIZE);a=n>=e&&n>=t,a||console.log("Insufficient WebGL texture size. Required: "+t+"x"+e+", available: "+n+"x"+n+".")},v=function(){return!angular.equals(p,h)},y=function(e){if(o){u!==o.src&&(c?c.loadContentsOf(o):c=l.texture(o),u=o.src),l.draw(c);for(var n in p)p.hasOwnProperty(n)&&(angular.equals(p[n],h[n])||l[n].apply(l,p[n]));l.update(),r.drawImage(l,0,0),e&&t.render()}},w=function(l,c){o=c,n[2]=o.width,n[3]=o.height,i.width=o.width,i.height=o.height,a&&s&&(s=!1,m(o.width,o.height)),a&&v()?y():r.drawImage(o,0,0),g.setSource(new ol.source.Canvas({canvas:i,projection:d,canvasExtent:n,canvasSize:[i.width,i.height]}));var u=e.getCenter();void 0!==u[0]&&void 0!==u[1]||(u=ol.extent.getCenter(n));var f=e.getZoom();t.setView(new ol.View({projection:d,center:u,zoom:f,zoomFactor:1.5,minResolution:.25,extent:n})),void 0===f&&t.getView().fit(n,t.getSize())};this.init=function(e){t.addLayer(g),e.$on("image.shown",w)},this.getExtent=function(){return n},this.getProjection=function(){return d},this.getLayer=function(){return g},this.filter=function(t){if(a){for(var e in p)t.hasOwnProperty(e)&&p.hasOwnProperty(e)&&(p[e]=t[e].map(parseFloat));y(!0)}},this.supportsFilters=function(){return a}}]),angular.module("dias.annotations").service("styles",function(){"use strict";var t=this;this.colors={white:[255,255,255,1],blue:[0,153,255,1],orange:"#ff5e00"};var e=6,n=3,o=new ol.style.Stroke({color:this.colors.white,width:5}),i=new ol.style.Stroke({color:this.colors.white,width:6}),r=new ol.style.Stroke({color:this.colors.blue,width:n}),a=new ol.style.Stroke({color:this.colors.orange,width:n}),s=new ol.style.Fill({color:this.colors.blue}),l=new ol.style.Fill({color:this.colors.orange}),c=new ol.style.Stroke({color:this.colors.white,width:2}),u=new ol.style.Stroke({color:this.colors.white,width:n}),f=new ol.style.Stroke({color:this.colors.white,width:2,lineDash:[3]}),d=new ol.style.Stroke({color:this.colors.blue,width:n,lineDash:[5]});new ol.style.Fill({color:this.colors.blue}),new ol.style.Fill({color:this.colors.orange});this.features=function(n){var i=n.color?"#"+n.color:t.colors.blue;return[new ol.style.Style({stroke:o,image:new ol.style.Circle({radius:e,fill:new ol.style.Fill({color:i}),stroke:c})}),new ol.style.Style({stroke:new ol.style.Stroke({color:i,width:3})})]},this.highlight=[new ol.style.Style({stroke:i,image:new ol.style.Circle({radius:e,fill:l,stroke:u}),zIndex:200}),new ol.style.Style({stroke:a,zIndex:200})],this.editing=[new ol.style.Style({stroke:o,image:new ol.style.Circle({radius:e,fill:s,stroke:f})}),new ol.style.Style({stroke:d})],this.viewport=[new ol.style.Style({stroke:r}),new ol.style.Style({stroke:new ol.style.Stroke({color:this.colors.white,width:1})})]}),angular.module("dias.annotations").service("viewport",["urlParams",function(t){"use strict";var e={zoom:t.get("z"),center:[t.get("x"),t.get("y")]};this.set=function(n){e.zoom=n.zoom,e.center[0]=Math.round(n.center[0]),e.center[1]=Math.round(n.center[1]),t.set({z:e.zoom,x:e.center[0],y:e.center[1]})},this.get=function(){return e},this.getZoom=function(){return e.zoom},this.getCenter=function(){return e.center}}]);