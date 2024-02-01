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
            <h2 class="event-title">${el.find("title").text()}</h1>
            <div class="image-container" style="background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${titleImageURL}'); background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${titleImageURL}'); background-size: cover;"><img class="title-image" src='${titleImageURL}' alt=""></div>
            <div class="description">${el.find("description").text()}</div>
            
            <div class="time-and-place">
              <div class="starttime"><img class="calendar icon" src="calendar_large.png">${startTime}</div>
              <div class="location"><img class="location icon" src="location_large.png">${el.find("content-rss\\:arrangement-location").text()}</div>
            </div>
            <div class="category"><img class="category icon" src="category.png">${el.find("content-rss\\:organizers").text()}</div>
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
