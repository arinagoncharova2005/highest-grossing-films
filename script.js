// variable to store the initial data to reset the order of films in the table 
// by clicking the button "Reset"
let initialData = [];

// show the table with films data from the json file when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('films_data.json').
        then(response => response.json()).
        then(data => {
            // global variable used in sorting films function
            window.filmsData = data;
            // save copy of initial data to restore it
            initialData = [...data];
            window.filmsData.sort((a, b) => a.id - b.id);
            showDataInTable(window.filmsData);
        })
        .catch(error => console.log('Error with JSON file:', error));

});

// function to show the data in the table
function showDataInTable(data) {
    const tableBody = document.getElementById('film-table-content');
            tableBody.innerHTML = '';

            data.forEach(film => {
                const row = document.createElement('tr');
                // get the flag of the country 
                const countryFlagEmoji = findCounryFlag(film.country);
                // add the row to the table 
                // (I show just the first director according to the instructions in the course chat)
                row.innerHTML = `
                    <td><img src="${film.image_url}" alt="${film.title}" width="100"></td>
                    <td>${film.rank}</td>
                    <td>${film.title}</td>
                    <td>${film.release_year}</td>
                    <td>${film.director[0]}</td>
                    <td>${film.box_office}</td>
                    <td>${countryFlagEmoji} ${film.country}</td>
                `;
                tableBody.appendChild(row);
            })
}

// variable for sorting direction
let sortAsc = true;

// function to sort the table by the selected column
function sortTable() {
    let columnName = document.getElementById('sort-field').value;
    // if the slider is not on, then the direction is ascending
    sortAsc = !document.getElementById('sort-direction').checked; 

    window.filmsData.sort((a, b) => {
        let aValue = a[columnName];
        let bValue = b[columnName];

        // convert release year to integer
        if (columnName == 'release_year') {
            aValue = parseInt(aValue, 10);
            bValue = parseInt(bValue, 10);
        }
        // compare the values
        if (aValue < bValue) {
            return sortAsc ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortAsc ? 1 : -1;
        }
        return 0;
    });
    showDataInTable(window.filmsData);
}

// function to filter table by the given input
function filterTable() {
    // convert input text to lower case
    const filterText = document.getElementById('filter').value.toLowerCase();

    // filter films by name
    const filteredData = window.filmsData.filter(film =>
        film.title.toLowerCase().includes(filterText)
    );

    showDataInTable(filteredData);
}

// function to return the order of films to the initial one
function resetSorting() {
    // return to original order
    window.filmsData = [...initialData];
    document.getElementById('sort-field').value = 'rank';
    document.getElementById('sort-direction').checked = false;
    showDataInTable(window.filmsData);
}

// function to find the flag corresponding to the country
// to add it to the text in country column in the table
function findCounryFlag(country) {
    const countryFlagsDict = {
        "Russia": "🇷🇺",
        "United States": "🇺🇸",
        "United Kingdom": "🇬🇧",
        "France": "🇫🇷",
        "Germany": "🇩🇪",
        "Italy": "🇮🇹",
        "Spain": "🇪🇸",
        "Japan": "🇯🇵",
        "China": "🇨🇳",
        "Canada": "🇨🇦",
    }
    // if there is no given country, return the Earth smile
    return countryFlagsDict[country] || '🌍';
}