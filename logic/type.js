document.addEventListener("DOMContentLoaded", function() {
  var generateChartBtn = document.getElementById("generate-chart-btn");

  function generateChart() {
    var startDate = document.getElementById("start-date").value;
    var endDate = document.getElementById("end-date").value;

    if (!startDate || !endDate) {
      return; // Safety exit if dates are empty
    }

    Papa.parse("resources/combined_summary.csv", {
      download: true,
      header: true,
      complete: function(results) {
        var data = results.data;

        // Filter data based on date range
        var filteredData = data.filter(function(item) {
          if (!item.Date) return false;
          var rowDate = new Date(item.Date);
          return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
        });

        // Sort data by date in ascending order
        filteredData.sort(function(a, b) {
          var dateA = new Date(a.Date);
          var dateB = new Date(b.Date);
          return dateA - dateB;
        });

        // Prepare data for the table - Grouped by "Type"
        var groupedData = {};
        for (var i = 0; i < filteredData.length; i++) {
          var item = filteredData[i];
          var key = item["Type"]; 
          var amount = parseFloat(item["Amount Debited"]);

          if (!key || isNaN(amount)) continue; 

          if (groupedData[key]) {
            groupedData[key] += amount;
          } else {
            groupedData[key] = amount;
          }
        }

        // Convert grouped data to an array of objects
        var typeExpenses = Object.entries(groupedData).sort(function(a, b) {
          return b[1] - a[1];
        }).slice(0, 10).map(function(entry) {
          return {
            expenseType: entry[0], 
            amountDebited: entry[1]
          };
        });

        // FIXED: Target your third column element instead of fighting over topExpensesTable
        var table = document.getElementById("expenseTypeTable");
        table.innerHTML = ""; 

        // Build clean <thead> structure for the sticky headers
        var thead = document.createElement("thead");
        var headerRow = document.createElement("tr");
        
        var typeHeader = document.createElement("th");
        typeHeader.textContent = "Type"; 
        headerRow.appendChild(typeHeader);
        
        var amountDebitedHeader = document.createElement("th");
        amountDebitedHeader.textContent = "Amount Debited";
        headerRow.appendChild(amountDebitedHeader);
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Build clean <tbody> structure for data rows
        var tbody = document.createElement("tbody");

        for (var i = 0; i < typeExpenses.length; i++) {
          var rowData = typeExpenses[i];
          var row = document.createElement("tr");

          var typeCell = document.createElement("td");
          typeCell.textContent = rowData.expenseType; 
          row.appendChild(typeCell);

          var amountDebitedCell = document.createElement("td");
          amountDebitedCell.textContent = "$" + rowData.amountDebited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); 
          row.appendChild(amountDebitedCell);

          tbody.appendChild(row);
        }
        
        table.appendChild(tbody);
      } // FIXED: Properly balanced Papa Parse callback structural brace closure
    });
  }

  generateChartBtn.addEventListener("click", generateChart);
});