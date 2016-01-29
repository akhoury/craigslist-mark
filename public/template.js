(function(){
this["CLMARK"] = this["CLMARK"] || {};
this["CLMARK"]["templates"] = this["CLMARK"]["templates"] || {};
this["CLMARK"]["templates"]["main"] = this["CLMARK"]["templates"]["main"] || {};
var templates = {

		templates: {		
			'template': {"v":1,"t":[{"t":4,"n":50,"x":{"r":["mode"],"s":"_0==\"single\""},"f":[{"t":7,"e":"style","f":["#",{"t":2,"r":"uuid"}," {\n            position: fixed;\n            top: 0;\n            right: 0;\n            padding: 3px;\n            z-index: ",{"t":2,"r":"MAX_INT"},";\n        }"]}," ",{"t":7,"e":"div","a":{"id":[{"t":2,"r":"uuid"}]},"f":[{"t":4,"n":50,"r":"item.remote.sold","f":[{"t":7,"e":"div","f":[{"t":4,"n":50,"r":"item.local.sold","f":["You and ",{"t":2,"x":{"r":["item.remote.sold"],"s":"_0-1"}}," others marked this item as sold. ",{"t":7,"e":"button","v":{"click":"onUnmarkAsSold"},"f":["Undo"]}]},{"t":4,"n":51,"f":[{"t":2,"x":{"r":["item.remote.sold"],"s":"_0>1?_0+\" people\":\"1 person\""}}," marked this item as sold. ",{"t":7,"e":"button","v":{"click":"onMarkAsSold"},"f":["Mark as sold"]}],"r":"item.local.sold"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"button","v":{"click":"onMarkAsSold"},"f":["Mark as sold"]}],"r":"item.remote.sold"}]}]}]}
		}

	};
	this["CLMARK"]["templates"]["main"] = templates.templates;
})();