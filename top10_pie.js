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
          var key = item["Source / Destination"];
          var amount = parseFloat(item["Amount Debited"]);

          if (groupedData[key]) {
            groupedData[key] += amount;
          } else {
            groupedData[key] = amount;
          }
        }

        // Prepare data for the pie chart
        var sortedData = Object.entries(groupedData).sort(function(a, b) {
          return b[1] - a[1];
        });

        var top10Data = sortedData.slice(0, 10);

        var labels = top10Data.map(function(entry) {
          return entry[0];
        });

        var amounts = top10Data.map(function(entry) {
          return entry[1];
        });

        // Generate pie chart for top 10 expenses
        var ctx = document.getElementById("secondPieChart").getContext("2d");
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              label: "Top 10 Expenses",
              data: amounts,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                // Add more colors as needed
              ],
            }],
          },
        });

        

        generateChartBtn.removeEventListener("click", generateChart);
      }
    });
  }

  generateChartBtn.addEventListener("click", generateChart);
});








  
  