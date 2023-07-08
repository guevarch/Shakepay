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

        // Prepare data for the chart
        var amounts = filteredData.map(function(item) {
          return item["Amount Debited"];
        });

        var sourcesDestinations = filteredData.map(function(item) {
          return item["Source / Destination"];
        });

        // Group data by Source / Destination and calculate the sum
        var groupedData = {};
        for (var i = 0; i < filteredData.length; i++) {
          var item = filteredData[i];
          var key = item["Type"];
          var amount = parseFloat(item["Amount Debited"]);

          if (groupedData[key]) {
            groupedData[key] += amount;
          } else {
            groupedData[key] = amount;
          }
        }
        
        // Prepare data for the chart
        var labels = Object.keys(groupedData);
        var amounts = Object.values(groupedData);

        // Generate pie chart
        var ctx = document.getElementById("pieChart").getContext("2d");
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              label: "Total Amount Debited",
              data: amounts,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)"
                // Add more colors as needed
              ],
            }],
          },
        });

        // Populate table with filtered and sorted data
        var table = document.getElementById("data-table");
        table.innerHTML = ""; // Clear previous data

        // Create table headers
        var headers = Object.keys(filteredData[0]).filter(function(header) {
          return header !== "Date"; // Exclude the "Date" column
        });
        var headerRow = table.insertRow(0);
        for (var i = 0; i < headers.length; i++) {
          var headerCell = document.createElement("th");
          headerCell.textContent = headers[i];
          headerRow.appendChild(headerCell);
        }

        // Create table rows
        for (var i = 0; i < filteredData.length; i++) {
          var rowData = filteredData[i];
          var row = table.insertRow(i + 1);
          for (var j = 0; j < headers.length; j++) {
            var cell = row.insertCell(j);
            cell.textContent = rowData[headers[j]];
          }
        }

        generateChartBtn.removeEventListener("click", generateChart);
      }
    });
  }

  generateChartBtn.addEventListener("click", generateChart);
});
