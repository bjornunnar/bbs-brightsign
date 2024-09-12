

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

    // Separate records based on the "always on top" category
    const alwaysOnTopRecords = records.filter(record => record.fields.Status === 'always on top');
    const otherRecords = records.filter(record => record.fields.Status !== 'always on top');

    // Display "always on top" records first
    alwaysOnTopRecords.forEach(record => createAndInsertRecord(record, recordSpace, true));

    // Display other records in their original order
    otherRecords.forEach(record => createAndInsertRecord(record, recordSpace, false));
}

function createAndInsertRecord(record, recordSpace, insertAtTop) {

        const recordID = record.id;
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
            <button class="delete-button">Delete</button>
        `;


        
        // Insert the list item at the top or bottom based on the category
    if (insertAtTop) {
        recordSpace.prepend(listItem);
    } else {
        recordSpace.appendChild(listItem);
    }

        // Add event listener for delete button
        const deleteButton = listItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => handleDelete(recordID, listItem));
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

    // Function to get and format current time and current time plus one hour, for time inputs
    function getCurrentDateTimeForInput() {
        const now = new Date();
        const roundedNow = roundMinutes(now);
        const oneHourLater = new Date(roundedNow.getTime() + 3600000);
        const formattedNow = now.toISOString().slice(0, 16);
        const formattedLater = oneHourLater.toISOString().slice(0,16);
        return [formattedNow , formattedLater];
    }

    // function to round date value to nearest full hour
    function roundMinutes(date) {
        if (date.getMinutes() === 0){
            return date;
        }
        date.setHours(date.getHours() + 1);
        date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
    
        return date;
    }

    function setDateInputDefaults(){
        const startTimeInput = document.getElementById('start-time');
        const endTimeInput = document.getElementById('end-time');
        const dateStrings = getCurrentDateTimeForInput();
        startTimeInput.value = dateStrings[0]; // Set the current date and time
        endTimeInput.value = dateStrings[1]; // Set that value plus one hour
    }

    // Set the default value of the start-time and end-time inputs when the form is ready
    document.addEventListener('DOMContentLoaded', () => {
        setDateInputDefaults();
    });

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form values
    const recordTitle = document.getElementById('recordTitle').value;
    const location = document.getElementById('location').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value;

    // Validate required fields
     if (!recordTitle) {
         alert('Title is required.');
         return;
     }

    // Create the record object to be sent to Airtable
    const newRecord = {
        fields: {
            Title: recordTitle,
            "Start time": startTime ? new Date(startTime).toISOString() : null, // Convert to ISO string format
            "End time": endTime ? new Date(endTime).toISOString() : null,
            Location: location || null,
            Status: status,
            Notes: notes || null
        }
    };

    try {
        // Send POST request to Airtable to add the new record
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ records: [newRecord] }) // Airtable expects an array of records
        });

        if (!response.ok) {
            throw new Error('Failed to add record');
        }

        const data = await response.json();
        const addedRecord = data.records[0];

        // Clear the form fields
        resetRecordForm();

        // set the default date values again
        setDateInputDefaults();

        // Display the newly added record without refreshing
        createAndInsertRecord(addedRecord, document.getElementById('agenda'), status === 'always on top');

    } catch (error) {
        console.error('Error adding record:', error);
        alert('An error occurred while adding the record.');
    }
}

// Function to handle record deletion
async function handleDelete(recordId, listItem) {
    // Confirm the deletion with the user
    if (!confirm('Are you sure you want to delete this record?')) {
        return;
    }

    try {
        // Send DELETE request to Airtable
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${recordId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete record');
        }

        // Remove the list item from the UI
        listItem.remove();
        console.log(`Record with ID ${recordId} deleted successfully`);

    } catch (error) {
        console.error('Error deleting record:', error);
        alert('An error occurred while deleting the record.');
    }
}

function handleFormReset(event){
    event.preventDefault();
    resetRecordForm();
}

// clear the form fields
function resetRecordForm(){
    document.getElementById('record-form').reset();
}


// Add title
buildTitleWithDate(PAGE_TITLE);

// build content
buildContent();

// Add an event listener to the form submit button
document.getElementById('record-form').addEventListener('submit', handleFormSubmit);

// Add an event listener to the clear form fields button
document.getElementById('reset-form').addEventListener('submit', handleFormReset);

// rebuild title every hour
setInterval(buildTitleWithDate(PAGE_TITLE), 6000000);

// Rebuild content every 5 minutes (300000 milliseconds)
setInterval(buildContent, 300000);