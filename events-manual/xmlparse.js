// Load the XML file
const xmlFile = "agenda.xml";
console.log(xmlFile);

// Create a new XMLHttpRequest object
const xhr = new XMLHttpRequest();

// Open the XML file
xhr.open("GET", xmlFile, true);

// Set the response type to "document" to parse the XML
xhr.responseType = "document";

// Send the request
xhr.send();

// Handle the response
xhr.onload = function () {
  // Check if the request was successful
  if (xhr.status === 200) {
    // Get the XML document
    const xmlDoc = xhr.responseXML;

    // Fetch all <description> elements
    const descriptions = xmlDoc.getElementsByTagName("description");
    console.log(descriptions);

    // Loop through each <description> element
    for (let i = 0; i < descriptions.length; i++) {
      // Get the current <description> element
      const description = descriptions[i];

      // Fetch the <div> elements within the current <description> element
      const divs = description.getElementsByTagName("div");

      // Loop through each <div> element
      for (let j = 0; j < divs.length; j++) {
        // Get the text content of the current <div> element
        const divText = divs[j].textContent;

        // Do something with the fetched value
        console.log(divText);
      }
    }
  }
};