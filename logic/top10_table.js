document.addEventListener("DOMContentLoaded", function() {
    var generateChartBtn = document.getElementById("generate-chart-btn");
  
    function generateChart() {
      var startDate = document.getElementById("start-date").value;
      var endDate = document.getElementById("end-date").value;

      // Quick sanity check: Don't run if dates are empty
      if (!startDate || !endDate) {
        alert("Please select both a Start and End date.");
        return;
      }
  
      Papa.parse("resources/combined_summary.csv", {
        download: true,
        header: true,
        complete: function(results) {
          var data = results.data;
  
          // Filter data based on date range
          var filteredData = data.filter(function(item) {
            if (!item.Date) return false; // Skip empty rows
            var rowDate = new Date(item.Date);
            return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
          });
  
          // Prepare and accumulate data for the table
          var groupedData = {};
          for (var i = 0; i < filteredData.length; i++) {
            var item = filteredData[i];
            var key = item["Source / Destination"];
            var amount = parseFloat(item["Amount Debited"]);
  
            // Ignore rows that aren't numeric or lack a destination
            if (!key || isNaN(amount)) continue; 
  
            if (groupedData[key]) {
              groupedData[key] += amount;
            } else {
              groupedData[key] = amount;
            }
          }
  
          // Convert grouped data to an array, sort highest to lowest, and take top 10
          var topExpenses = Object.entries(groupedData).sort(function(a, b) {
            return b[1] - a[1];
          }).slice(0, 10).map(function(entry) {
            return {
              sourceDestination: entry[0],
              amountDebited: entry[1]
            };
          });
  
          // Select and clear out the old table data entirely
          var table = document.getElementById("topExpensesTable");
          table.innerHTML = ""; 
  
          // 1. Create a clean <thead> structure so the sticky header styling works
          var thead = document.createElement("thead");
          var headerRow = document.createElement("tr");
          
          var sourceDestinationHeader = document.createElement("th");
          sourceDestinationHeader.textContent = "Source / Destination";
          headerRow.appendChild(sourceDestinationHeader);
          
          var amountDebitedHeader = document.createElement("th");
          amountDebitedHeader.textContent = "Amount Debited";
          headerRow.appendChild(amountDebitedHeader);
          
          thead.appendChild(headerRow);
          table.appendChild(thead);
  
          // 2. Create a clean <tbody> structure for data rows
          var tbody = document.createElement("tbody");
  
          for (var i = 0; i < topExpenses.length; i++) {
            var rowData = topExpenses[i];
            var row = document.createElement("tr");
  
            var sourceDestinationCell = document.createElement("td");
            sourceDestinationCell.textContent = rowData.sourceDestination;
            row.appendChild(sourceDestinationCell);
  
            var amountDebitedCell = document.createElement("td");
            // Formats to a clean currency layout (e.g., $1,250.50)
            amountDebitedCell.textContent = "$" + rowData.amountDebited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            row.appendChild(amountDebitedCell);
  
            tbody.appendChild(row);
          }
          
          table.appendChild(tbody);

          // REMOVED: removeEventListener line so the button remains clickable!
        }
      });
    }
  
    generateChartBtn.addEventListener("click", generateChart);
});