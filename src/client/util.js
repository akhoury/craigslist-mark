(function() {
    var CLMARK = window.CLMARK = window.CLMARK || {};
    var util = CLMARK.util = window.CLMARK.util = window.CLMARK.util || {};

    util.generateUUID = function generateUUID (prefix) {
        /*! http://stackoverflow.com/a/2117523/369724 CC BY-SA 2.5 */
        return (prefix + '') + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    };

    util.toParam = function toParam (hash) {
        var str = "";
        Object.keys(hash).forEach(function(k, i) {
            str += (i ? '&' : '') + k + "=" + hash[k];
        });
        return str;
    };


    util.request = function request (url, options) {
        var xhr;
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                throw e;
            }
        } else {
            xhr = new XMLHttpRequest();
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    options.success && options.success(xhr.responseText);
                } else {
                    options.error && options.error(xhr.responseText);
                }
            }
        };
        xhr.open(options.type, url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(options.data ? toParam(options.data) : undefined);
    };

    util.getLocalItem = function getLocalItem (id) {
        var data = {};
        try {
            data = JSON.parse(localStorage.getItem(CLMARK.API_HOST + '_' + id));
        } catch (e) {}
        return data;
    };

    util.setLocalItem = function setLocalItem (id, data) {
        localStorage.setItem(CLMARK.API_HOST + '_' + id, JSON.stringify(data));
        return getLocalItem(id);
    };

    util.ondomready = function ondomready (callback) {
        callback = callback || function(){};

        var complete = function() {
            if (document.removeEventListener) {
                document.removeEventListener("DOMContentLoaded", complete, false);
                callback();
            } else if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", complete);
                callback();
            }
        };
        if (document.addEventListener) {
            document.addEventListener( "DOMContentLoaded", complete, false );
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", complete);
        }
    };

    var addEventListenerFn;
    var removeEventListenerFn;
    var addPrefix = '';
    // some people just polyfil addEventListener only, so..
    var removePrefix = '';

    if (window.addEventListener) {
        addEventListenerFn = 'addEventListener';

    } else {
        addEventListenerFn = 'attachEvent';
        addPrefix = 'on';
    }
    if (window.removeEventListener) {
        removeEventListenerFn = 'removeEventListener';
    } else {
        removeEventListenerFn = 'attachEvent';
        removePrefix = 'on';
    }
    util.addEventListener = function addEventListener (el, event, callback) {
        return el[addEventListenerFn](addPrefix + event, callback, false);
    };
    util.removeEventListener = function removeEventListener (el, event, callback) {
        return el[removeEventListenerFn](removePrefix + event, callback, false);
    };
})();