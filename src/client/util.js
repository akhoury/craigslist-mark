(function() {
    if (!window.CLMARK) {
        window.CLMARK = {};
    }
    var CLMARK = window.CLMARK;
    if (!CLMARK.util) {
        CLMARK.util = {};
    }
    CLMARK.util.generateUUID = function (prefix) {
        /*! http://stackoverflow.com/a/2117523/369724 CC BY-SA 2.5 */
        return (prefix + '') + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    };
    CLMARK.util.ondomready = function (callback) {
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
    }
})();