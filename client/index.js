(function() {
    var route;
    var multiple;
    var single;
    var body = document.body;
    var API_HOST = '<%= api %>';

    var top = document.createElement('div');
    top.setAttribute('style', 'color:red;position:fixed;top:3em;right:0;padding:3px;text-align:right;z-index:' + (-1 >>> 1));
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
            if (data && data.sold) {
                labelAsSold(id, data.sold);
            }
            addSoldButton(id);
        });
    }

    function onMultiple () {

    }

    function addSoldButton (id) {
        var btn = document.createElement('button');
        btn.onclick = function () {
            markAsSold(id);
            labelAsSold(id);
        };
        btn.innerText = 'Mark as sold';
        top.appendChild(btn);
    }


    function labelAsSold (id, count) {
        if (single) {
            var text = document.createElement('div');
            text.innerHTML = 'this item was marked sold ' + count + ' times.';
            var btn = document.createElement('button');
            btn.innerText = 'Undo';
            btn.onclick = function () {
                markAsUnsold(id);
                labelAsUnsold(id);
            };
            top.appendChild(text);
            top.appendChild(btn);
        } else if (multiple) {

        }
    }

    function labelAsUnsold (id) {
        if (single) {
            addSoldButton(id);
        } else if (multiple) {

        }
    }
    function markAsSold (id) {
        data[id] = data[id] || {};
        data[id].sold = true;
        return setItem(id, data[id], callback);
    }
    function markAsUnsold (id, callback) {
        data[id] = data[id] || {};
        data[id].sold = false;
        return setItem(id, data[id], callback);
    }

    function getItem (id, callback) {
        request(API_HOST + '/' + id, {type: 'GET'}, callback);
    }
    function setItem (id, data, callback) {
        request(API_HOST + '/' + id, {type: 'GET', data: data}, callback);
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
        xhr.send(toParam(options.data));
    }

    function toParam (hash) {
        var str = "";
        Object.keys(hash).forEach(function(k) {
            str += k + "=" + hash[k];
        });
        return str;
    }
})();