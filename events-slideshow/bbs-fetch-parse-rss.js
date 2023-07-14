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
            <h2 class="event-title">${el.find("title").text()}</h1>
            <div class="image-container" style="background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${el.find("media\\:content").attr("url")}'); background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${el.find("media\\:content").attr("url")}'); background-size: cover;"><img class="title-image" src='${el.find("media\\:content").attr("url")}' alt=""></div>
            <div class="description">${el.find("description").text()}</div>
            <div class="starttime"><img class="calendar icon" src="calendar.png">${el.find("content-rss\\:arrangement-starttime").text()}</div>
            <div class="location"><img class="location icon" src="location.png">${el.find("content-rss\\:arrangement-location").text()}</div>
          </div>
        `;

        slideShowDiv[0].insertAdjacentHTML("beforeend", template);

        /* add portrait class to portrait-oriented images */
        $('img').each(function() {
          if ($(this).width() <= $(this).height()) {
            $(this).addClass('portrait');
          }
        })
      });
  }
});
