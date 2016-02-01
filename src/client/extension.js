(function() {
    var CLMARK = window.CLMARK;
    var util = window.CLMARK.util;
    var API_HOST = CLMARK.API_HOST = '<%= api %>';
    var MAX_INT = CLMARK.MAX_INT = -1 >>> 1;

    var route;
    var multiple;
    var single;
    var body = document.body;
    var view;

    var top = document.createElement('div');
    var header = document.querySelectorAll('.global-header')[0];
    header.appendChild(top);

    var replyLink = document.getElementById("replylink");

    var auidPrefix = '__clmarkauid__';
    var auid = CLMARK.util.generateUUID(auidPrefix);
    var postMessagePrefix = 'clmark:';
    var postMessageRegExp = new RegExp('^' + postMessagePrefix);

    var onMessage = function(e) {
        if (!uuid && e && e.data && postMessageRegExp.test(e.data)) {
            var parts = (e.data || '').split(':');
            onUuid(parts[1]);
        }
    };
    util.addEventListener(window, 'message', onMessage);

    var iframe = document.createElement('iframe');
    iframe.id = 'CLMIframe';
    iframe.frameBorder = 0;
    iframe.scrolling = "no";
    iframe.style.height = "0";
    iframe.style.width = "0";
    iframe.src = API_HOST + '/public/cookie.html';
    body.appendChild(iframe);
    var iframeWindow = iframe.contentWindow;

    var uuid;
    function onUuid (_uuid) {
        uuid = _uuid;
        view.set('uuid', uuid);
    }

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
                template: CLMARK.templates.main.extension,
                data: {
                    MAX_INT: MAX_INT,
                    API_HOST: API_HOST,
                    uuid: uuid,
                    auid: auid,
                    mode: 'single',
                    item: {
                        id: id,
                        remote: data.remote,
                        local: data.local
                    }
                },
                oncomplete: function () {
                    window[this.get('auid')] = this.onCaptchaLoad.bind(this);
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
                        grecaptcha.reset(this._captchaWidgetId);

                        // can't verify twice: https://developers.google.com/recaptcha/docs/verify?hl=en
                        //try {
                        //    // response = grecaptcha.getResponse(this._captchaWidgetId);
                        //} catch (e) {}
                        //if (response) {
                        //    return newCallback(response);
                        //}
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

                            iframeWindow.postMessage('clmark:' + this.get('uuid') + ':markedSold:' + this.get('item.id'), '*');
                        }.bind(this));
                    }.bind(this));
                },

                unmarkAsSold: function () {
                    this.isHuman(function(captchaResponse) {
                        setItem(this.get('item.id'), {sold: false, captchaResponse: captchaResponse}, function(data) {
                            this.set({'item.local': data.local, 'item.remote': data.remote});

                            iframeWindow.postMessage('clmark:' + this.get('uuid') + ':unmarkedSold:' + this.get('item.id'), '*');
                        }.bind(this));
                    }.bind(this));
                }
            });
        });
    }

    function onMultiple () {}

    function getItem (id, callback) {
        util.request(API_HOST + '/' + id, {
            type: 'GET',
            success: function(data) {
                data = JSON.parse(data || "{}");
                callback && callback({remote: data, local: util.getLocalItem(id)});
            },
            error: function(err) {
                console.error("[craigslist-mark] Something went wrong", err);
            }
        });
    }

    function setItem (id, data, callback) {
        util.request(API_HOST + '/' + id, {
            type: 'POST',
            data: data,
            success: function(rdata) {
                rdata = JSON.parse(rdata);
                util.setLocalItem(id, {sold: data.sold});
                callback && callback({remote: rdata, local: util.getLocalItem(id)});
            },
            error: function(err) {
                console.error("[craigslist-mark] Something went wrong", err);
            }
        });
    }

})();