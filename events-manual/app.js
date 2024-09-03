

const AIRTABLE_ACCESS_TOKEN = ''; // <-- add the airtable access token
const BASE_ID = 'appdvXMtHepP6jUbx';
const TABLE_NAME = 'tblS6VqaruyLM6O2M'; // grofin
const VIEW_NAME = 'timeline'; // this view is set up to drop past events from the output

function buildTitleWithDate(){
    const currentDate = new Date().toISOString().slice(0, 10)
    const title = document.createElement("h1");
    title.innerHTML = "Grófin í dag" + " " + currentDate;
    const titleElement = document.getElementById('title');

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
        displayRecords(data.records);
    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

function displayRecords(records) {
    const recordList = document.getElementById('agenda');
    recordList.innerHTML = ''; // Clear previous records

    // Separate records based on the "always on top" category
    const alwaysOnTopRecords = records.filter(record => record.fields.Status === 'always on top');
    const otherRecords = records.filter(record => record.fields.Status !== 'always on top');

    // Display "always on top" records first
    alwaysOnTopRecords.forEach(record => createAndInsertRecord(record, recordList, true));

    // Display other records in their original order
    otherRecords.forEach(record => createAndInsertRecord(record, recordList, false));
}

function createAndInsertRecord(record, recordList, insertAtTop) {

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
            <div class="record time">${startTime ? new Date(startTime).toLocaleTimeString([], timeOptions) + ' - ' : ''}${endTime ? new Date(endTime).toLocaleTimeString([], timeOptions) : ''}</div>
            <div class="record location">${Location || ''}</div>
            <div class="record note">${Notes || ''}</div>
        `;
        
        // Insert the list item at the top or bottom based on the category
    if (insertAtTop) {
        recordList.prepend(listItem);
    } else {
        recordList.appendChild(listItem);
    }
}

// Add title
buildTitleWithDate();

// Initial fetch
fetchRecords();

// Fetch records every 5 minutes (300000 milliseconds)
setInterval(fetchRecords, 300000);