# cookieclicker

<img src="img/perfectCookie.png" width="128">

The original game can be found at http://orteil.dashnet.org/cookieclicker/

This mirror for, errrr, like, educational purpose, either to download for your own offline education or to be played online from http://ozh.github.io/cookieclicker/ if you cannot "educate" yourself on the original URL

### How to update

If the original game updates, here is how you can update the mirror:

#### 1. Fetch all new images :

From the root,

Set up user agent:
* `USER="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"`

* `cd img/`
* `wget --user-agent="$USER" --convert-links -O index.html http://orteil.dashnet.org/cookieclicker/img/`
* `grep -v PARENTDIR index.html | grep '\[IMG' | grep -Po 'a href="\K.*?(?=")' | sed 's/\?.*//' > _imglist.txt`
* `wget --user-agent="$USER" -N -i _imglist.txt -B http://orteil.dashnet.org/cookieclicker/img/`

#### 2. Fetch all new sounds :

Similarly, from the root :

* `cd snd/`
* `wget --user-agent="$USER" --convert-links -O index.html http://orteil.dashnet.org/cookieclicker/snd/`
* `grep -v PARENTDIR index.html | grep '\[SND' | grep -Po 'a href="\K.*?(?=")' | sed 's/\?.*//' > _sndlist.txt`
* `wget --user-agent="$USER" -N -i _sndlist.txt -B http://orteil.dashnet.org/cookieclicker/snd/`

#### 3. Fetch all new translations :

Similarly, from the root :

* `cd loc/`
* `wget --user-agent="$USER" --convert-links -O index.html http://orteil.dashnet.org/cookieclicker/loc/`
* `grep -v PARENTDIR index.html | grep '\[TXT' | grep -Po 'a href="\K.*?(?=")' | sed 's/\?.*//' > _loclist.txt`
* `wget --user-agent="$USER" -i _loclist.txt http://orteil.dashnet.org/cookieclicker/loc/`

#### 4. Fetch `js`, `html`, `css` and fonts :

From the root directory :

* Fetch the updated `index.html` file: `wget --user-agent="$USER" -O index.html http://orteil.dashnet.org/cookieclicker/` 
* Fetch the updated `style.css` file: `wget --user-agent="$USER" -O style.css http://orteil.dashnet.org/cookieclicker/style.css`
* Fetch updated `js` files : `wget --user-agent="$USER" -i _jslist.txt -B http://orteil.dashnet.org/cookieclicker/`
* Extract font URLs from `index.html`: `grep -Po 'url\(\K/cf-fonts/[^)]+' index.html > _fontlist.txt`
* Download the fonts: `wget --user-agent="$USER" -x -nH -N -i _fontlist.txt -B http://orteil.dashnet.org`

#### 5. Update `js` and `html` files :

* Scan `index.html` for any new `<script src` and also `main.js` for any new local javascript (eg `Game.last.minigameUrl`). If there are new scripts, update the `_jslist.txt` accordingly.
* In `main.js` there is a nonfunctional URL we need to change: 
  * Find `DataDir=window.location.origin+'/data/';`, and change to `DataDir='https://orteil.dashnet.org/data/';`
* Fix font URLs in `index.html` to be local: `sed -i 's|url(/cf-fonts/|url(cf-fonts/|g' index.html`

#### 6. Report update here :)

If you happen to update, please make a pull request for others to benefit, thanks!
