/* https://borgarbokasafn.is/bbs-simple-event-rss displays all upcoming events by default */
/* this is set up using drupal views */
/* adding "-east" will filter for Árbær, Spöngin and Úlfarsárdalur branches /*
/* we can filter by specific locations by setting the 'location' search param to the drupal node id, e.g. /80 for Spöng, /93 for Grófin etc. */

// Get the current URL's search parameters
const urlParams = new URLSearchParams(window.location.search);

// set the location value if the param exists, otherwise an empty string
const locationValue = urlParams.get('location') ?? "";
const RSS_URL = `https://borgarbokasafn.is/bbs-simple-event-rss/${locationValue}`;

const slideShowDiv = $("#slideshow");

$.ajax(RSS_URL, {
  accepts: {
    xml: "application/rss+xml"
  },

  dataType: "xml",

  success: function(data) {
    let itemsHTML = [];

    $(data)
      .find("item")
      .each(function() {
        const el = $(this);

        /* The title image, for both hero and background */
        let titleImageObject = el.find("media\\:content");
        let titleImageURL = titleImageObject.attr("url");
        let titleImageWidth = parseInt(titleImageObject.attr("width"));
        let titleImageHeight = parseInt(titleImageObject.attr("height"));
        let titleImageClasses = titleImageHeight > titleImageWidth ? "title-image portrait" : "title-image";

        /* checks for an empty timestamp and removes it, leaving only the date */
        let startTime = el.find("content-rss\\:arrangement-starttime").text();
        if (startTime.includes(" kl. 00:00")) {
          // Replace the timestamp with an empty string
          startTime = startTime.replace(" kl. 00:00", "").trim();
        }

        const template = `
          <div class="item">
            <div class="content event-title">${el.find("title").text()}</div>
            <div class="content image-container" style="--bg-image-url: url('${titleImageURL}');">
  <img class="${titleImageClasses}" src='${titleImageURL}' alt="">
</div>
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

        itemsHTML.push(template);

      });

      slideShowDiv[0].insertAdjacentHTML("beforeend", itemsHTML.join(""));

      /* now initializing slick slider, only after the document has been loaded with event data */
      initializeSlickSlider();
  }
});
