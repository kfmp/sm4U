var ctxDoughnut1 = document.getElementById('doughnutChart').getContext('2d');
var ctxLine1 = document.getElementById('lineChart').getContext('2d');

function renderChart1() {
  var chartDoughnut1 = new Chart(ctxDoughnut1, {
    // 만들기 원하는 차트의 유형
    type: 'doughnut',

    // 데이터 집합을 위한 데이터
    data: {
      labels: ['급여 대상자', '세전 총 지급합계', '공제합계'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: [
            'rgb(255, 99, 132)', // 급여 대상자 색상
            'rgb(54, 162, 235)', // 세전 총 지급합계 색상
            'rgb(255, 206, 86)', // 공제합계 색상
          ],
          // borderColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 255, 255, 1)',
          data: [10, 20, 30],
        },
      ],
    },

    // 설정은 여기서 하세요
    options: {
      responsive: true,
      maintainAspectRatio: false, // 비율 유지하지 않음
      layout: {
        padding: {
          top: 30,
        },
      },
    },
  });

  let chartLine1 = new Chart(ctxLine1, {
    // 만들기 원하는 차트의 유형
    type: 'bar',

    // 데이터 집합을 위한 데이터
    data: {
      labels: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgb(26, 138, 54)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45, 32, 22, 10, 23, 100],
        },
      ],
    },

    // 설정은 여기서 하세요
    options: {
      responsive: true,
      maintainAspectRatio: false, // 비율 유지하지 않음
      legend: { display: false },
      // layout: {
      //   padding: {
      //     top: 30,
      //   },
    },
  });
}

var ctxDoughnut2 = document.getElementById('doughnutChart2').getContext('2d');
var ctxLine2 = document.getElementById('lineChart2').getContext('2d');

function renderChart2() {
  var chartDoughnut2 = new Chart(ctxDoughnut2, {
    // 만들기 원하는 차트의 유형
    type: 'doughnut',

    // 데이터 집합을 위한 데이터
    data: {
      labels: ['급여 대상자', '세전 총 지급합계', '공제합계'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: [
            'rgb(255, 99, 132)', // 급여 대상자 색상
            'rgb(54, 162, 235)', // 세전 총 지급합계 색상
            'rgb(255, 206, 86)', // 공제합계 색상
          ],
          // borderColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 255, 255, 1)',
          data: [10, 20, 30],
        },
      ],
    },

    // 설정은 여기서 하세요
    options: {
      responsive: true,
      maintainAspectRatio: false, // 비율 유지하지 않음
      layout: {
        padding: {
          top: 30,
        },
      },
    },
  });

  var chartLine2 = new Chart(ctxLine2, {
    // 만들기 원하는 차트의 유형
    type: 'bar',

    // 데이터 집합을 위한 데이터
    data: {
      labels: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgb(26, 138, 54)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45, 32, 22, 10, 23, 100],
        },
      ],
    },

    // 설정은 여기서 하세요
    options: {
      responsive: true,
      maintainAspectRatio: false, // 비율 유지하지 않음
      legend: { display: false },
      // layout: {
      //   padding: {
      //     top: 30,
      //   },
    },
  });
}

renderChart1();

document.querySelector('#home-tab').addEventListener('click', () => {
  renderChart1();
});

document.querySelector('#profile-tab').addEventListener('click', () => {
  renderChart2();
});
