document.addEventListener('DOMContentLoaded', () => {
    fetch('films_data.json').
        then(response => response.json()).
        then(data => {
            //global variable foe sorting films
            window.filmsData = data;
            window.filmsData.sort((a, b) => a.id - b.id);
            showDataInTable(filmsData);
        })
        .catch(error => console.log('Error with JSON file:', error));

});

function showDataInTable(data) {
    const tableBody = document.getElementById('film-table-content');
            tableBody.innerHTML = '';

            data.forEach(film => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${film.id}</td>
                    <td>${film.title}</td>
                    <td>${film.release_year}</td>
                    <td>${film.director}</td>
                    <td>${film.box_office}</td>
                    <td>${film.country}</td>
                `;
                tableBody.appendChild(row);
            })
}

let sortAsc = true;
let curSortColumnName = '';

function sortTable(columnName) {
    const columnNamesElems = document.querySelectorAll('th span');
    // reset all spans before sorting
    columnNamesElems.forEach(span => span.textContent = "");
    if (curSortColumnName === columnName) {
        sortAsc = !sortAsc;
    } else  {
        sortAsc = true;
        curSortColumnName = columnName;

    }

    window.filmsData.sort((a, b) => {
        let aValue = a[columnName];
        let bValue = b[columnName];

        if (columnName == 'release_year') {
            aValue = parseInt(aValue, 10);
            b_Value = parseInt(aValue, 10);
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
    //add direction of sorting icons
    const activeHeader = document.querySelector(`th:nth-child(${getColumnIndex(columnName)}) span`);
    activeHeader.textContent = sortAsc ? " ⬆️" : " ⬇️";
}

function getColumnIndex(columnName) {
    const columns = ['id', 'title', 'release_year', 'director', 'box_office', 'country'];
    return columns.indexOf(columnName) + 1;
}

function filterTable() {
    const filterText = document.getElementById('filter').value.toLowerCase();

    // Фильтруем глобальный массив filmsData
    const filteredData = window.filmsData.filter(film =>
        film.title.toLowerCase().includes(filterText)
    );

    showDataInTable(filteredData);
}