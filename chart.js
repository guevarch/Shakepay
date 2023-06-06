// Example using Chart.js library
const pieData = {
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [{
    data: [10, 20, 30],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  }]
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false
};

const pieChart = new Chart(document.getElementById('pie-chart'), {
  type: 'pie',
  data: pieData,
  options: pieOptions
});
