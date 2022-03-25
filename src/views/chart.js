// Init
import Chart from "chart.js";
import * as moment from "moment";

// Function
const chart = (data) => {
  console.log("data in chart");
  // Line Chart
  let ctx = document.getElementById("lineChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((i) => {
        return moment(i._id).format("dd");
      }),
      datasets: [
        {
          label: ["Last  Week"],
          data: data.map((i) => {
            return i.client_price;
          }),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          pointRadius: 0,
          hitRadius: 10,
          hoverRadius: 10,
        },
      ],
    },

    // Line Chart options
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value, index, array) {
                return value < 1000 ? value : value / 1000 + "K";
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
        ],
      },
    },
  });
};

// Export
export default chart;
