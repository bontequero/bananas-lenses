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

function downloadURI(uri) {
  var link = document.createElement("a");
  link.download = '';
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

(function () {
  let down = document.getElementById('down');

  down.addEventListener('click', () => {
    App.podcasts.forEach((item) => {
      downloadURI(item.enclosure.url);
    });
  });
})();