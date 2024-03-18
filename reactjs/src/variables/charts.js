export const barChartData = [
  {
    name: "Sales",
    group: "sale",
    data: [800, 250, 110, 300, 490, 350, 270, 130, 425, 0, 0, 0],
  },
  {
    name: "Costs",
    group: "Cost",
    data: [330, 250, 110, 300, 490, 350, 270, 130, 425],
  },
  {
    name: "Cost2",
    group: "Cost",
    data: [130, 250, 110, 300, 490, 350, 270, 130, 0],
  },
];

export const barChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    stacked: true,
    offsetX: -10,
  },
  tooltip: {
    style: {
      fontSize: "14px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
    theme: "light",
  },
  xaxis: {
    categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    //show: false,
    labels: {
      show: true,
      style: {
        //colors: "#fff",
        fontSize: "14px",
      },

    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  yaxis: {
    //show: true,
    labels: {
      show: true,
      style: {
        fontSize: "14px",
      },
      formatter: function (val) {
        val = parseInt(val);
        if (val >= 1000) val = val / 1000;
        return val + "K"
      }
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  grid: {
    show: false,
  },
  fill: {
    //opacity: 1,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 0,
      columnWidth: "60px",
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "60px",
            horizontal: true,
          },
        },
        xaxis: {
          categories: ["Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "Th 8", "Th 9", "Th 10", "Th 11", "Th 12"],

          labels: {
            show: true,
            style: {
              fontSize: "14px",
            },

            formatter: function (val) {
              val = parseInt(val);
              if (val >= 1000) val = val / 1000;
              return val + "K"
            }
          },

        },
        yaxis: {
          //show: true,
          labels: {
            show: true,
            style: {
              fontSize: "14px",
            },

          },
        }
      },
    },
  ],
};

export const lineChartData = [
  {
    name: "Mobile apps",
    data: [50, 40, 300, 220, 500, 250, 400],
  },
  {
    name: "Websites",
    data: [30, 90, 40, 140, 290, 290, 340],
  },
  {
    name: "Websites1",
    data: [3, 9, 4, 14, 29, 29, 34],
  },
];

export const lineChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    categories: [
      "7 ngày trước",
      "",
      "",
      "",
      "",
      "",
      "Hôm nay",
    ],
    labels: {
      style: {
        colors: "#0ccccc",
        fontSize: "14px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        //colors: "#c8cfca",
        fontSize: "14px",
      },
    },
  },
  legend: {
    show: false,
  },
  grid: {
    strokeDashArray: 5,
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
      inverseColors: true,
      opacityFrom: 0.8,
      opacityTo: 0,
      stops: [],
    },
    //colors: ["#4FD1C5", "#CC00FF", "#3366FF"],
  },
  //colors: ["#4FD1C5", "#CC00FF", "#3366FF"],
};
