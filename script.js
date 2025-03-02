let initialData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('films_data.json').
        then(response => response.json()).
        then(data => {
            //global variable foe sorting films
            window.filmsData = data;
            // save copy of initial data to restore it
            initialData = [...data];
            window.filmsData.sort((a, b) => a.id - b.id);
            showDataInTable(window.filmsData);
        })
        .catch(error => console.log('Error with JSON file:', error));

});

function showDataInTable(data) {
    const tableBody = document.getElementById('film-table-content');
            tableBody.innerHTML = '';

            data.forEach(film => {
                const row = document.createElement('tr');
                // get the flag of the country 
                const countryFlagEmoji = findCounryFlag(film.country);
                // show directors using commas because it is array
                row.innerHTML = `
                    <td><img src="${film.image_url}" alt="${film.title}" width="100"></td>
                    <td>${film.rank}</td>
                    <td>${film.title}</td>
                    <td>${film.release_year}</td>
                    <td>${film.director.join(', ')}</td>
                    <td>${film.box_office}</td>
                    <td>${countryFlagEmoji} ${film.country}</td>
                `;
                tableBody.appendChild(row);
            })
}


let curSortColumnName = '';
let sortAsc = true;

function sortTable() {
    let columnName = document.getElementById('sort-field').value;
    sortAsc = !document.getElementById('sort-direction').checked; 

    window.filmsData.sort((a, b) => {
        let aValue = a[columnName];
        let bValue = b[columnName];

        if (columnName == 'release_year') {
            aValue = parseInt(aValue, 10);
            bValue = parseInt(bValue, 10);
        }

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

function getColumnIndex(columnName) {
    const columns = ['id', 'title', 'release_year', 'director', 'box_office', 'country'];
    return columns.indexOf(columnName) + 1;
}

function filterTable() {
    const filterText = document.getElementById('filter').value.toLowerCase();

    // filter films by name
    const filteredData = window.filmsData.filter(film =>
        film.title.toLowerCase().includes(filterText)
    );

    showDataInTable(filteredData);
}

function resetSorting() {
    // return to original order
    window.filmsData = [...initialData];
    document.getElementById('sort-field').value = 'id';
    document.getElementById('sort-direction').checked = false;
    showDataInTable(window.filmsData);
}

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
        "South Korea": "🇰🇷",
        "China": "🇨🇳",
        "India": "🇮🇳",
        "Canada": "🇨🇦",
        "Australia": "🇦🇺",
    }
    return countryFlagsDict[country] || '🌍';
}