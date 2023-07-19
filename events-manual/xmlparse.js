let xmlString = `agenda.xml`;
let xmlDoc = $.parseXML(xmlString);
console.log(xmlDoc);

$(xmlDoc).find("item").each(function() {
    let descriptionElement = $(this).find("description");
    descriptionElement.find("div").each(function() {
        console.log($(this).text());
    });
});