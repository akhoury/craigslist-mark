(function() {
    var route;
    var multiple;
    var single;
    var body = document.body;
    var API_HOST = '<%= api %>';
    var MAX_INT = -1 >>> 1;
    var view;

    var top = document.createElement('div');
    body.appendChild(top);

    var replyLink = document.getElementById("replylink");

    if (/^\/search/.test(location.pathname)) {
        route = "multiple"
    } else if (replyLink) {
        route = "single";
    }
    switch (route) {
        case "multiple":
            multiple = true;
            onMultiple();
            break;
        case "single":
            single = true;
            onSingle();
            break;
    }

    function onSingle () {
        var id = replyLink.pathname.split('/').pop();
        getItem(id, function(data) {
            view = new Ractive({
                el: top,
                template: CLMARK.templates.main.template,
                data: {
                    uuid: generateUUID('single'),
                    mode: 'single',
                    MAX_INT: MAX_INT,
                    item: {
                        id: id,
                        remote: data.remote,
                        local: data.local
                    }
                },
                oncomplete: function () {
                    this.on({
                        onMarkAsSold: this.markAsSold.bind(this),
                        onUnmarkAsSold: this.unmarkAsSold.bind(this)
                    });
                },

                markAsSold: function () {
                    setItem(this.get('item.id'), {sold: true}, function(data) {
                        this.set({local: data.local, remote: data.remote});
                    }.bind(this));
                },

                unmarkAsSold: function () {
                    setItem(this.get('item.id'), {sold: false}, function(data) {
                        this.set({local: data.local, remote: data.remote});
                    }.bind(this));
                }
            });
        });
    }

    function onMultiple () {

    }

    function getItem (id, callback) {
        request(API_HOST + '/' + id, {type: 'GET'}, function(data) {
            callback && callback({remote: data, local: getLocalItem(id)});
        });
    }

    function setItem (id, data, callback) {
        request(API_HOST + '/' + id, {type: 'POST', data: data}, function() {
            setLocalItem(id, data);
            getItem(id, callback);
        });
    }

    function request (url, options, callback) {
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
                callback && callback(xhr.responseText);
            }
        };
        xhr.open(options.type, url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(options.data ? toParam(options.data) : undefined);

    }

    function toParam (hash) {
        var str = "";
        Object.keys(hash).forEach(function(k) {
            str += k + "=" + hash[k];
        });
        return str;
    }

    function getLocalItem (id) {
        var data = {};
        try {
            data = JSON.parse(localStorage.getItem(API_HOST + '_' + id));
        } catch (e) {}
        return data;
    }

    function setLocalItem (id, data) {
        localStorage.setItem(API_HOST + '_' + id, JSON.stringify(data));
        return getLocalItem(id);
    }

    function generateUUID (prefix) {
        /*! http://stackoverflow.com/a/2117523/369724 CC BY-SA 2.5 */
        return (prefix + '') + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
})();