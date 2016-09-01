YahooLib = {
  fetchJSON (url) {
    let root = 'https://query.yahooapis.com/v1/public/yql?q=';
    let yql = 'select * from xml where url="' + url + '"';
    let proxy_url = root + encodeURIComponent(yql) + '&format=json&diagnostics=false&callback=YahooLib.setFeed';
    document.getElementsByTagName('body')[0].appendChild(this.jsTag(proxy_url));
  },

  jsTag (url) {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    return script;
  },

  setFeed (results) {
    let items = results.query.results.rss.channel.item;

    items.forEach((item, i, arr) => {
      let rssFeed = document.getElementById('main');
      let fragment = this.create(`<div class="links" id="link-${i}">${item.title}</div>`);
      rssFeed.appendChild(fragment);

      let testLink = document.getElementById(`link-${i}`);
      testLink.addEventListener('click', () => {
        fragment = this.create(`<audio controls id="audio-${i}" class="hidEl" src="${item.enclosure.url}"></audio>`);
        let el = document.getElementById(`link-${i+1}`);
        rssFeed.insertBefore(fragment, el);
      });
    });
  },

  create (htmlStr) {
    let frag = document.createDocumentFragment();
    let temp = document.createElement('div');
    temp.innerHTML = htmlStr;

    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }

    return frag;
  }
}
