# WORK IN PROGRESS - not ready yet

# Craigslist Mark

A site and a browser-extension that lets you mark and check items as/if sold, because craigslisters are assholes and they don't remove their posts after the sale.

## Site

Want to quickly check if an item as marked as sold? visit: TBD

## Browser extension installation

### Chrome

it's not published in the chrome extensions store yet, so ..

1. Download [craigslist-mark-chrome.zip](https://github.com/akhoury/craigslist-mark/raw/master/build/browser-extensions/craigslist-mark-chrome.zip)
2. Extract it somewhere.
2. in Chrome, click on the meny button, ![chrome-menu-button](https://cloud.githubusercontent.com/assets/1398375/12699998/64676ae4-c79f-11e5-9dea-7bcd192f06d4.png), then Settings > Extensions
3. Check __"Developer mode"__ box on the top right
4. Then __"Load Unpacked extension"__ then browse to `~/Downloads/craigslist-mark-chrome`

### Other browsers?

.. well, not yet. it's should be pretty easy to write extensions for the other browsers, since they all can use the same client-side code.


## Screenshots

![screen shot 2016-01-31 at 1 40 37 am](https://cloud.githubusercontent.com/assets/1398375/12700708/c5de5820-c7bb-11e5-8f2d-ae7a07a9198a.png)
![screen shot 2016-01-31 at 1 40 51 am](https://cloud.githubusercontent.com/assets/1398375/12700709/c5dee8ee-c7bb-11e5-8e32-f5855656b523.png)
![screen shot 2016-01-31 at 1 40 09 am](https://cloud.githubusercontent.com/assets/1398375/12700707/c5db328a-c7bb-11e5-8518-dae8dc35190d.png)
![screen shot 2016-01-31 at 1 39 45 am](https://cloud.githubusercontent.com/assets/1398375/12700706/c5d26646-c7bb-11e5-815f-e51df965281f.png)


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
* `NODE_CLM_GA_TRACKING_ID`, GA tracking id, get one from https://analytics.google.com


### run the server

```
NODE_CLM_CAPTCHA_SECRET_KEY=your_captcha_secret_key NODE_CLM_DB_URL=mysql://user:password@localhost/craigslist_mark NODE_CLM_PORT=5000 node src/server/app.js
```

#### server run-time env vars

* `NODE_CLM_CAPTCHA_SECRET_KEY`, that's the secret key, get it from here: https://www.google.com/recaptcha/
* `NODE_CLM_DB_URL`, something like `mysql://user:password@localhost/craigslist_mark`
* `NODE_CLM_PORT`, node port, default is `3000`

