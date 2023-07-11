const RSS_URL = `https://borgarbokasafn.is/bbs-simple-event-rss/`;

const slideShowDiv = $("#slideshow");

$.ajax(RSS_URL, {
  accepts: {
    xml: "application/rss+xml"
  },

  dataType: "xml",

  success: function(data) {
    $(data)
      .find("item")
      .each(function() {
        const el = $(this);

        const template = `
          <div>
            <img src="${el.find("media\\:content").attr("url")}" alt="">
            <h2>
              <a href="${el
                .find("link")
                .text()}" target="_blank" rel="noopener">
                ${el.find("title").text()}
              </a>
            </h2>
          </div>
        `;

        slideShowDiv[0].insertAdjacentHTML("beforeend", template);
      });
  }
});
