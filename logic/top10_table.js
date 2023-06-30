document.addEventListener("DOMContentLoaded", function() {
    var generateChartBtn = document.getElementById("generate-chart-btn");
  
    function generateChart() {
      var startDate = document.getElementById("start-date").value;
      var endDate = document.getElementById("end-date").value;
  
      Papa.parse("resources/combined_summary.csv", {
        download: true,
        header: true,
        complete: function(results) {
          var data = results.data;
  
          // Filter data based on date range
          var filteredData = data.filter(function(item) {
            var rowDate = new Date(item.Date);
            return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
          });
  
          // Sort data by date in ascending order
          filteredData.sort(function(a, b) {
            var dateA = new Date(a.Date);
            var dateB = new Date(b.Date);
            return dateA - dateB;
          });
  
          // Prepare data for the table
          var groupedData = {};
          for (var i = 0; i < filteredData.length; i++) {
            var item = filteredData[i];
            var key = item["Source / Destination"];
            var amount = parseFloat(item["Amount Debited"]);
  
            if (groupedData[key]) {
              groupedData[key] += amount;
            } else {
              groupedData[key] = amount;
            }
          }
  
          // Convert grouped data to an array of objects
          var topExpenses = Object.entries(groupedData).sort(function(a, b) {
            return b[1] - a[1];
          }).slice(0, 10).map(function(entry) {
            return {
              sourceDestination: entry[0],
              amountDebited: entry[1]
            };
          });
  
          // Generate the table for top 10 expenses
          var table = document.getElementById("topExpensesTable");
          table.innerHTML = ""; // Clear previous data
  
          // Create table headers
          var headerRow = table.insertRow(0);
          var sourceDestinationHeader = document.createElement("th");
          sourceDestinationHeader.textContent = "Source / Destination";
          headerRow.appendChild(sourceDestinationHeader);
          var amountDebitedHeader = document.createElement("th");
          amountDebitedHeader.textContent = "Amount Debited";
          headerRow.appendChild(amountDebitedHeader);
  
          // Create table rows
          for (var i = 0; i < topExpenses.length; i++) {
            var rowData = topExpenses[i];
            var row = table.insertRow(i + 1);
  
            var sourceDestinationCell = row.insertCell(0);
            sourceDestinationCell.textContent = rowData.sourceDestination;
  
            var amountDebitedCell = row.insertCell(1);
            amountDebitedCell.textContent = rowData.amountDebited;
          }
  
          generateChartBtn.removeEventListener("click", generateChart);
        }
      });
    }
  
    generateChartBtn.addEventListener("click", generateChart);
  });
  
  