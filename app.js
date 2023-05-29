Papa.parse("combined_summary.csv", {
  download: true,
  header: true,
  complete: function(results) {
    var data = results.data;
    var table = document.getElementById("csv-data");
    var headers = Object.keys(data[0]);
    var headerRow = table.insertRow(0);

    // headers.splice(headers.indexOf("Date"), 1);

    for (var i = 0; i < headers.length; i++) {
      var headerCell = headerRow.insertCell(i);
      headerCell.innerHTML = headers[i];
      
    }

    // Sort table by date in descending order
    sortTableByDate("csv-data", headers.indexOf("Date"));

    // Store data as a variable so we can re-render it later
    var allRows = [];
    for (var i = 0; i < data.length; i++) {
      var tableRow = table.insertRow(i + 1);
      allRows.push(tableRow); // Store reference to row so we can re-render it later
      for (var j = 0; j < headers.length; j++) {
        var tableCell = tableRow.insertCell(j);
        tableCell.innerHTML = data[i][headers[j]];
      }
    }

    // Listen for changes to date filter input field
    var dateFilterInput = document.getElementById("date-filter");
    dateFilterInput.addEventListener("change", function() {
      var dateRange = dateFilterInput.value.split(" - ");
      var startDate = new Date(dateRange[0]);
      var endDate = new Date(dateRange[1]);
      // Loop through all rows and hide/show based on date range
      for (var i = 0; i < allRows.length; i++) {
        var rowData = data[i];
        var rowDate = new Date(rowData.Date);
        if (rowDate >= startDate && rowDate <= endDate) {
          allRows[i].style.display = ""; // Show row
        } else {
          allRows[i].style.display = "none"; // Hide row
        }
      }

      // Sort table by date in descending order after applying the filter
      sortTableByDate("csv-data", headers.indexOf("Date"));
    });

    // Listen for click on filter button
    var filterButton = document.getElementById("filter-button");
    filterButton.addEventListener("click", function() {
      var startDate = new Date(document.getElementById("start-date").value);
      var endDate = new Date(document.getElementById("end-date").value);
      // Loop through all rows and hide/show based on date range
      for (var i = 0; i < allRows.length; i++) {
        var rowData = data[i];
        var rowDate = new Date(rowData.Date);
        if (rowDate >= startDate && rowDate <= endDate) {
          allRows[i].style.display = ""; // Show row
        } else {
          allRows[i].style.display = "none"; // Hide row
        }
      }

      // Sort table by date in descending order after applying the filter
      sortTableByDate("csv-data", headers.indexOf("Date"));
    });
  }
});

function sortTableByDate(tableId, columnIndex) {
  var table = document.getElementById(tableId);
  var rows = Array.from(table.rows);

  // Sort rows by date in descending order
  rows.sort(function(a, b) {
    var aDate = new Date(a.cells[columnIndex].innerText);
    var bDate = new Date(b.cells[columnIndex].innerText);
    return aDate - bDate;
  });

  // Re-insert sorted rows back into table
  for (var i = 0; i < rows.length; i++) {
    table.appendChild(rows[i]);
  }
}



