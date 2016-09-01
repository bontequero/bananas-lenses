var App = new Vue({
    el: '#main',
    data: {
      podcasts: []
    }
  });

(function () {
  const FEED_URL = 'http://bananasandlenses.net/feed.xml';

  YahooLib.fetchJSON(FEED_URL);
}());