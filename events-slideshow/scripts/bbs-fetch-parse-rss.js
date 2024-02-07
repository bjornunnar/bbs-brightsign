/* https://borgarbokasafn.is/bbs-simple-event-rss displays all upcoming events by default */
/* this is set up using drupal views */
/* adding "-east" will filter for Árbær, Spöngin and Úlfarsárdalur branches /*
/* this can be further modified for specific locations using the drupal node id, e.g. /80 for Spöng, /93 for Grófin etc. */

const RSS_URL = `https://borgarbokasafn.is/bbs-simple-event-rss-east`;

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

        /* The title image, for both hero and background */
        let titleImageURL = el.find("media\\:content").attr("url");

        /* checks for an empty timestamp and removes it, leaving only the date */
        let startTime = el.find("content-rss\\:arrangement-starttime").text();
        if (startTime.includes(" kl. 00:00")) {
          // Replace the timestamp with an empty string
          startTime = startTime.replace(" kl. 00:00", "").trim();
        }

        const template = `
          <div class="item">
            <div class="content event-title">${el.find("title").text()}</div>
            <div class="content image-container" style="background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${titleImageURL}'); background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${titleImageURL}'); background-size: cover;"><img class="title-image" src='${titleImageURL}' alt=""></div>
            <div class="content description-and-category">
              <div class="description">${el.find("description").text()}</div>
              <div class="category container"><img class="category icon" src="assets/icons/category.png"><div class="category text">${el.find("content-rss\\:organizers").text()}</div></div>
            </div>
            
            <div class="content time-and-place">
              <div class="starttime container"><img class="calendar icon" src="assets/icons/calendar_large.png"><div class="starttime text">${startTime}</div></div>
              <div class="location container"><img class="location icon" src="assets/icons/location_large.png"><div class="location text">${el.find("content-rss\\:arrangement-location").text()}</div></div>
            </div>
            
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

      /* now initializing slick slider, only after the document has been loaded with event data */
      initializeSlickSlider();
  }
});
