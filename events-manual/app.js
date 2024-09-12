

const AIRTABLE_ACCESS_TOKEN = ''; // <-- add the airtable access token
const BASE_ID = 'appdvXMtHepP6jUbx';
const TABLE_NAME = 'tblS6VqaruyLM6O2M'; // grofin
const VIEW_NAME = 'timeline'; // this view is set up to drop past events from the output
const PAGE_TITLE = 'Grófin í dag';
let singleMessage = 'Ekkert á döfinni í dag.';

function buildTitleWithDate(pageTitle){
    const currentDate = new Date();
    const dateOptions = { month: 'long', day: 'numeric' };
    const dateString = currentDate.toLocaleDateString("is-IS", dateOptions);
    const title = document.createElement("h1");
    title.innerHTML = pageTitle + " " + dateString;
    const titleElement = document.getElementById('title');
    titleElement.innerHTML = '';

    titleElement.appendChild(title);
}

async function fetchRecords() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}`, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            
            throw new Error('Failed to fetch data from Airtable');
        }

        const data = await response.json();

        return data.records || [];
        
    } catch (error) {
        singleMessage = 'Næ ekki sambandi við dagskrá';
        return [];
    }
}

function displayMessage(messageSpace, message) {
    messageSpace.innerHTML = '<div class="message">' + message + '</div>';

}

function displayRecords(records, recordSpace) {
    console.log(records);

    // Separate records based on the "always on top" category
    const alwaysOnTopRecords = records.filter(record => record.fields.Status === 'always on top');
    const otherRecords = records.filter(record => record.fields.Status !== 'always on top');

    // Display "always on top" records first
    alwaysOnTopRecords.forEach(record => createAndInsertRecord(record, recordSpace, true));

    // Display other records in their original order
    otherRecords.forEach(record => createAndInsertRecord(record, recordSpace, false));
}

function createAndInsertRecord(record, recordSpace, insertAtTop) {

        const { Title, Location, "Start time": startTime, "End time": endTime, Status, Notes } = record.fields;
        const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

        const listItem = document.createElement('li');

        // Apply classes based on the category
    if (Status === 'highlight') {
        listItem.classList.add('highlight');
    } else if (Status === 'always on top') {
        listItem.classList.add('always-on-top');
    }

        listItem.innerHTML = `
            <div class="record title">${Title || 'Ekkert heiti'}</div>
            <div class="record location">${Location || ''}</div>
            <div class="record time">${startTime ? new Date(startTime).toLocaleTimeString([], timeOptions) + ' - ' : ''}${endTime ? new Date(endTime).toLocaleTimeString([], timeOptions) : ''}</div>
            <div class="record note">${Notes || ''}</div>
        `;
        
        // Insert the list item at the top or bottom based on the category
    if (insertAtTop) {
        recordSpace.prepend(listItem);
    } else {
        recordSpace.appendChild(listItem);
    }
}

async function buildContent() {
    const recordSpace = document.getElementById('agenda');
    recordSpace.innerHTML = ''; // Clear previous records
    const messageSpace = document.getElementById('single-message');
    messageSpace.innerHTML = ''; // Clear previous message


        // Initial fetch
    const records = await fetchRecords();

    if (records.length === 0){
        displayMessage(messageSpace, singleMessage);
    } else {
        // display records
    displayRecords(records, recordSpace);
    }

    
}
// Add title
buildTitleWithDate(PAGE_TITLE);

// build content
buildContent();

// rebuild title every hour
setInterval(buildTitleWithDate(PAGE_TITLE), 6000000);

// Rebuild content every 5 minutes (300000 milliseconds)
setInterval(buildContent, 300000);