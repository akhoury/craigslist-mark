# Craigslist Mark

A browser-extension that lets you mark items as sold because craigslisters are assholes and they don't remove their posts after the sale.

## Installation

### on Chrome

it's not published in the chrome extensions store yet, so ..

1. Download [craigslist-mark-chrome.zip](https://github.com/akhoury/craigslist-mark/raw/master/build/browser-extensions/craigslist-mark-chrome.zip)
2. Extract it somewhere.
2. in Chrome, click on the meny button, ![chrome-menu-button](https://cloud.githubusercontent.com/assets/1398375/12699998/64676ae4-c79f-11e5-9dea-7bcd192f06d4.png), then Settings > Extensions
3. Check __"Developer mode"__ box on the top right
4. Then __"Load Unpacked extension"__ then browse to `~/Downloads/craigslist-mark-chrome`

### Other browsers?

.. well, not yet. it's should be pretty easy to write extensions for the other browsers, since they all can use the same client-side code.


## Development

### setup mysql db

```

# create the database first
echo "create database craigslist_mark" | mysql -uuser -ppassword

# then create the schema using node
NODE_CLM_DB_URL=mysql://user:password@localhost/craigslist_mark node src/server/create-schema.js

# or you can just do this
mysql -uuser -ppassword craigslist_mark < server/schema.sql

```

### build via grunt

```
NODE_CLM_CAPTCHA_SITE_KEY=your_captcha_public_key NODE_CLM_HOST=http://localhost:3000 grunt
```

#### grunt build-time env vars

* `NODE_CLM_CAPTCHA_SITE_KEY`, that's the public key (aka site key), get it from here: https://www.google.com/recaptcha/
* `NODE_CLM_HOST`, server domain name with port, so the API urls would point at.


### run the server

```
NODE_CLM_CAPTCHA_SECRET_KEY=your_captcha_secret_key NODE_CLM_DB_URL=mysql://user:password@localhost/craigslist_mark NODE_CLM_PORT=5000 node src/server/app.js
```

#### server run-time env vars

* `NODE_CLM_CAPTCHA_SECRET_KEY`, that's the secret key, get it from here: https://www.google.com/recaptcha/
* `NODE_CLM_DB_URL`, something like `mysql://user:password@localhost/craigslist_mark`
* `NODE_CLM_PORT`, node port, default is `3000`

