// script is not working. the data object returns all info but everything except the title is wrapped in a description element, which contains CDATA clause. splitting the contained div elements (and erasing the b-wrapped titles) is a pain.

const RSS_URL = `agenda.xml`;

const agendaDiv = $("#agenda");

$.ajax(RSS_URL, {
  accepts: {
    xml: "application/rss+xml"
  },

  dataType: "xml",

  success: function(data) {
    $(data)
      .find("item")
      .each(function() {
        const el = $(this)
        // Get the CDATA content of the <description> element
        var cdataContent = $(el).find('description').text();
        console.log("cdatacontent: " + cdataContent);

        // Create a temporary <div> element to parse the CDATA content as HTML
        var tempDiv = $("div").html(cdataContent);
        console.log("cdatacontent html: " + $(cdataContent).html());
        console.log("tempdiv htlm: " + $(tempDiv).html());
        var eventTitle = $(el).find('title').text();
        console.log("event title: " + eventTitle);
        var eventStartTime = $(tempDiv).eq(0).clone().find('b').remove().end().text();
        console.log("event start: " + eventStartTime);
        var eventEndTime = $(tempDiv).eq(1).clone().find('b').remove().end().text();
        console.log("event end: " + eventEndTime);
        var eventDescription = $(tempDiv).eq(2).clone().find('b').remove().end().text();
        console.log("event descr: " + eventDescription);

        const template = `
          <div class="item">
            <h2 class="title">Title: ${eventTitle}</h2>
            <div class="starttime">Start time: ${eventStartTime}</div>
            <div class="location">End Time: ${eventEndTime}</div>
            <div class="description">Description: ${eventDescription}</div>
          </div>
        `;

        agendaDiv[0].insertAdjacentHTML("beforeend", template);
      });
  }
});
