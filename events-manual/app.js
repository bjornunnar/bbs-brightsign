

const AIRTABLE_ACCESS_TOKEN = ''; // <-- add the airtable access token
const BASE_ID = 'appdvXMtHepP6jUbx';
const TABLE_NAME = 'tblS6VqaruyLM6O2M'; // grofin
const VIEW_NAME = 'timeline'; // this view is set up to drop past events from the output

async function fetchRecords() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}`, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`
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

    records.forEach(record => {
        const { fldBiU46eFyXB58vF , fld6VgqrIB7MkC8NC , fld8jw8VKru89lIZP, fldZvTOOmyZRscGUZ, fldk9R3e8lIyUYsYS, fldsiPMMNX8t22TvA } = record.fields;
        
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="record-title">${fldBiU46eFyXB58vF || 'No Title'}</div>
            <div class="record-details">
                Location: ${fld6VgqrIB7MkC8NC  || 'N/A'} <br>
                Start: ${new Date(fld8jw8VKru89lIZP).toLocaleString()} <br>
                End: ${new Date(fldZvTOOmyZRscGUZ).toLocaleString()} <br>
                Category: ${fldk9R3e8lIyUYsYS || 'N/A'} <br>
                Note: ${fldsiPMMNX8t22TvA || 'N/A'}
            </div>
        `;
        
        recordList.appendChild(listItem);
    });
}

// Initial fetch
fetchRecords();

// Fetch records every 5 minutes (300000 milliseconds)
setInterval(fetchRecords, 300000);