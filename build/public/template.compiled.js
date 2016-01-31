(function(){
this["CLMARK"] = this["CLMARK"] || {};
this["CLMARK"]["templates"] = this["CLMARK"]["templates"] || {};
this["CLMARK"]["templates"]["main"] = this["CLMARK"]["templates"]["main"] || {};
var templates = {

		templates: {		
			'template': {"v":1,"t":[{"t":4,"n":50,"x":{"r":["mode"],"s":"_0==\"single\""},"f":[{"t":7,"e":"style","f":["#",{"t":2,"r":"uuid"}," {\n            display: block;\n            clear: both;\n            padding: 0;\n            margin: 0;\n            font-size: 10px;\n            text-align: center;\n            z-index: ",{"t":2,"r":"MAX_INT"},";\n            color: red;\n        }\n        #",{"t":2,"r":"uuid"}," button.undo-btn {\n            color: black;\n        }\n        #",{"t":2,"r":"uuid"}," button.mark-sold-btn {\n            color: black;\n        }\n        #",{"t":2,"r":"uuid"}," .captcha,\n        #",{"t":2,"r":"uuid"}," .captcha div {\n            margin: 0 auto;\n        }"]}," ",{"t":7,"e":"script","a":{"src":["https://www.google.com/recaptcha/api.js?onload=__clm__",{"t":2,"r":"uuid"},"&render=explicit"],"async":0,"defer":0}}," ",{"t":7,"e":"div","a":{"id":[{"t":2,"r":"uuid"}]},"f":[{"t":4,"n":50,"x":{"r":["item.local.sold","item.remote.sold"],"s":"_0||_1>0"},"f":[{"t":7,"e":"div","f":[{"t":4,"n":50,"r":"item.local.sold","f":["You ",{"t":2,"x":{"r":["item.remote.sold"],"s":"_0>1?\"and \"+((_0-1)>1?(_0-1)+\" others \":\" 1 other person \"):\"\""}},"marked this item as sold. ",{"t":7,"e":"button","a":{"class":"undo-btn"},"v":{"click":"onUnmarkAsSold"},"f":["Undo"]}]},{"t":4,"n":51,"f":[{"t":2,"x":{"r":["item.remote.sold"],"s":"_0>1?_0+\" people\":\"1 person\""}}," marked this item as sold. ",{"t":7,"e":"button","a":{"class":"mark-sold-btn"},"v":{"click":"onMarkAsSold"},"f":["Mark as sold"]}],"r":"item.local.sold"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"button","a":{"class":"mark-sold-btn"},"v":{"click":"onMarkAsSold"},"f":["Mark as sold"]}],"x":{"r":["item.local.sold","item.remote.sold"],"s":"_0||_1>0"}}," ",{"t":7,"e":"div","a":{"class":"captcha","style":[{"t":4,"n":51,"r":"checkingHuman","f":["display: none;"]}]}}]}]}]}
		}

	};
	this["CLMARK"]["templates"]["main"] = templates.templates;
})();