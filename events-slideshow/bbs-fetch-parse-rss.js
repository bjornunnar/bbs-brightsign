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
            <h1 class="title">${el.find("title").text()}</h1>
            <div class="image-container"><img class="title-image" src="${el.find("media\\:content").attr("url")}" alt=""></div>
            <div class="description">${el.find("description").text()}</div>
            <div class="starttime"><img class="calendar icon" src="calendar.png">${el.find("content-rss\\:arrangement-starttime").text()}</div>
            <div class="location"><img class="location icon" src="location.png">${el.find("content-rss\\:arrangement-location").text()}</div>
          </div>
        `;

        slideShowDiv[0].insertAdjacentHTML("beforeend", template);
      });
  }
});
