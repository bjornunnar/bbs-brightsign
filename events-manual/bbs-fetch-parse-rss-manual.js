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
          <div class="item">
            <img src="${el.find("media\\:content").attr("url")}" alt="">
            <h2 class="title">${el.find("title").text()}</h2>
            <div class="starttime">${el.find("content-rss\\:arrangement-starttime").text()}</div>
            <div class="location">${el.find("content-rss\\:arrangement-location").text()}</div>
            <div class="description">${el.find("description").text()}</div>
          </div>
        `;

        slideShowDiv[0].insertAdjacentHTML("beforeend", template);
      });
  }
});
