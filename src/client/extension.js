(function() {

    var route;
    var multiple;
    var single;
    var body = document.body;
    var API_HOST = '<%= api %>';
    var MAX_INT = -1 >>> 1;
    var view;

    var top = document.createElement('div');
    var header = document.querySelectorAll('.global-header')[0];
    header.appendChild(top);

    var replyLink = document.getElementById("replylink");
    var uuid;

    var postMessageRegExp = /^CLMARKUuid:/;
    var attachEventFn = window.addEventListener ? 'addEventListener' : 'attachEvent';
    window[attachEventFn](attachEventFn === 'attachEvent' ? 'onmessage' : 'message', function(e) {
        if (e && e.data && postMessageRegExp.test(e.data)) {
            var uuid = (e.data || '').split(':')[1];
            onUuid(uuid)
        }
    },false);

    function onUuid (_uuid) {
        uuid = _uuid;

        console.log("uuid", uuid);

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
    }

    function onSingle () {
        var id = replyLink.pathname.split('/').pop();
        getItem(id, function(data) {
            view = new Ractive({
                el: top,
                template: CLMARK.templates.main.extension,
                data: {
                    MAX_INT: MAX_INT,
                    API_HOST: API_HOST,
                    uuid: uuid,
                    mode: 'single',
                    item: {
                        id: id,
                        remote: data.remote,
                        local: data.local
                    }
                },
                oncomplete: function () {
                    window['__clm__' + this.get('uuid')] = this.onCaptchaLoad.bind(this);
                    this.on({
                        onMarkAsSold: this.markAsSold.bind(this),
                        onUnmarkAsSold: this.unmarkAsSold.bind(this)
                    });
                },

                onCaptchaLoad: function () {},

                isHuman: function (callback) {
                    if (!window.grecaptcha) {
                        return;
                    }
                    this.set('checkingHuman', true);
                    var newCallback = function (captchaResponse) {
                        callback && callback(captchaResponse);
                        this.set('checkingHuman', false);
                    }.bind(this);

                    var response;
                    if (this._captchaWidgetId != null) {
                        try {
                            response = grecaptcha.getResponse(this._captchaWidgetId);
                        } catch (e) {}
                        if (response) {
                            return newCallback(response);
                        }
                    }
                    var catpchaEl = this.find('.captcha');
                    catpchaEl.innerHTML = '';
                    this._captchaWidgetId = grecaptcha.render(catpchaEl, {
                        sitekey : '<%= captchaSiteKey %>',
                        callback : newCallback
                    });
                },

                markAsSold: function () {
                    this.isHuman(function(captchaResponse) {
                        setItem(this.get('item.id'), {sold: true, captchaResponse: captchaResponse}, function(data) {
                            this.set({'item.local': data.local, 'item.remote': data.remote});
                        }.bind(this));
                    }.bind(this));
                },

                unmarkAsSold: function () {
                    this.isHuman(function(captchaResponse) {
                        setItem(this.get('item.id'), {sold: false, captchaResponse: captchaResponse}, function(data) {
                            this.set({'item.local': data.local, 'item.remote': data.remote});
                        }.bind(this));
                    }.bind(this));
                }
            });
        });
    }

    function onMultiple () {}

    function getItem (id, callback) {
        request(API_HOST + '/' + id, {type: 'GET'}, function(data) {
            data = JSON.parse(data || "{}");
            callback && callback({remote: data, local: getLocalItem(id)});
        });
    }

    function setItem (id, data, callback) {
        request(API_HOST + '/' + id, {type: 'POST', data: data}, function(rdata) {
            rdata = JSON.parse(rdata);
            setLocalItem(id, {sold: data.sold});
            callback && callback({remote: rdata, local: getLocalItem(id)});
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
        Object.keys(hash).forEach(function(k, i) {
            str += (i ? '&' : '') + k + "=" + hash[k];
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