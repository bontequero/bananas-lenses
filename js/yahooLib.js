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
      App.podcasts.push(item);
    });
  }
}
