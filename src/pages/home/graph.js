var ctxDoughnut1 = document.getElementById('doughnutChart').getContext('2d');
var ctxLine1 = document.getElementById('lineChart').getContext('2d');

async function renderDoughnutChart1(selectDoughnut) {
  // 급여인지 상여인지
  var doughnutLabelsList =
    selectDoughnut == 'salary' ? await getSalaryInfo() : getBierInfo();

  // console.log(getSalaryInfo());
  // const res = await getSalaryInfo();
  // console.log(res);

  // 리스트 크기에 맞는 랜덤 색상
  var randomColor = [];
  for (let i = 0; i < Object.keys(doughnutLabelsList).length; i++) {
    randomColor.push(dynamicColors());
  }
  console.log(randomColor);

  var chartDoughnut1 = new Chart(ctxDoughnut1, {
    // 만들기 원하는 차트의 유형
    type: 'doughnut',

    // 데이터 집합을 위한 데이터
    data: {
      labels: Object.getOwnPropertyNames(doughnutLabelsList), // key 값 가져오기
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: randomColor,
          // 'rgb(255, 99, 132)', // 급여 대상자 색상
          // 'rgb(54, 162, 235)', // 세전 총 지급합계 색상
          // 'rgb(255, 206, 86)', // 공제합계 색상
          // borderColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 255, 255, 1)',
          data: Object.values(doughnutLabelsList), // value 값 가져오기
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
      plugins: {
        datalabels: {
          formatter: (value, context) => {
            let sum = 0;
            let dataArr = context.chart.data.datasets[0].data;
            dataArr.map((data) => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(2) + '%';
            return percentage;
          },
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14,
          },
        },
      },
      plugins: [ChartDataLabels],
    },
  });
}

async function renderBarChart1(typeSalary) {
  var barList =
    typeSalary == 'year'
      ? await getYearInfo()
      : await getMonthInfo($('#select-year option:selected').val());

  let chartLine1 = new Chart(ctxLine1, {
    // 만들기 원하는 차트의 유형
    type: 'bar',

    // 데이터 집합을 위한 데이터
    data: {
      labels: Object.getOwnPropertyNames(barList),
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgb(26, 138, 54)',
          borderColor: 'rgb(255, 99, 132)',
          data: Object.values(barList),
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

renderDoughnutChart1('salary');
renderBarChart1('month');
// $('#select-year').hide();

document.querySelector('#home-tab').addEventListener('click', () => {
  renderDoughnutChart1('salary');
  renderBarChart1('month');
});

document.querySelector('#profile-tab').addEventListener('click', () => {
  renderChart2();
});

// 셀렉트 박스 선택 시 막대 차트 변경 (연도/월별)
$(function () {
  $('#select-salary-graph').on('change', function () {
    if ($('#select-salary-graph option:selected').val() == 'year') {
      renderBarChart1($('#select-salary-graph option:selected').val());
      $('#select-year').hide();
      // selectYear();
    } else {
      renderBarChart1($('#select-salary-graph option:selected').val());
      $('#select-year').show();
    }
  });
});

// 셀렉트 박스 선택 시 막대 차트 변경 (연도)
$(function () {
  $('#select-year').on('change', function () {
    renderBarChart1($('#select-salary-graph option:selected').val());
  });
});

// 급여대장 정보 가져오기
function getSalaryInfo() {
  return new Promise(function (resolve, reject) {
    let sumPayrollList = {};
    $.ajax({
      type: 'GET',
      url: '/json/payroll-register.json',
      success: function ({ payrollRegister }) {
        sumPayrollList = payrollRegister.reduce(
          (
            acc,
            {
              salary = 0,
              // annualSalary = 0,
              overtimePay = 0,
              nightWorkAllowance = 0,
              foodExpenses = 0,
              vehicleSupportExpenses = 0,
              childcareAllowance = 0,
              holidayBonus = 0,
              earnedIncomeTax = 0,
              earnedLocalIncomeTax = 0,
              nationalPension = 0,
              healthInsurance = 0,
              longTermCareInsurance = 0,
              employmentInsurance = 0,
              repaymentOfStudentLoans = 0,
            }
          ) => {
            acc.기본급 += salary;
            // acc.annualSalary += annualSalary;
            acc.연장근로수당 += overtimePay;
            acc.야간근로수당 += nightWorkAllowance;
            acc.식대 += foodExpenses;
            acc.차량지원금 += vehicleSupportExpenses;
            acc.육아수당 += vehicleSupportExpenses;
            acc.명절상여금 += holidayBonus;
            acc.근로소득세 += earnedIncomeTax;
            acc.근로지방소득세 += earnedLocalIncomeTax;
            acc.국민연금 += nationalPension;
            acc.건강보험 += healthInsurance;
            acc.장기요양보험 += longTermCareInsurance;
            acc.고용보험 += employmentInsurance;
            acc.학자금상환 = repaymentOfStudentLoans;
            return acc;
          },
          {
            기본급: 0,
            // annualSalary: 0,
            연장근로수당: 0,
            야간근로수당: 0,
            식대: 0,
            차량지원금: 0,
            육아수당: 0,
            명절상여금: 0,
            근로소득세: 0,
            근로지방소득세: 0,
            국민연금: 0,
            건강보험: 0,
            장기요양보험: 0,
            고용보험: 0,
            학자금상환: 0,
          }
        );
        resolve(sumPayrollList);
        console.log(sumPayrollList);
      },
      error: function () {
        reject('아몰랑');
      },
    });
  });
}

// 상여대장 정보 가져오기
function getBierInfo() {}

// 랜덤 색상
function dynamicColors() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return 'rgba(' + r + ',' + g + ',' + b + ',0.8)';
}

// 연도별 정보
function getYearInfo() {
  return new Promise(function (resolve, reject) {
    console.log(inputYear);
    let sumYearList = {};
    $.ajax({
      type: 'GET',
      url: '/json/payroll-register.json',
      success: function ({ payroll }) {
        $.each(payroll, function (index, item) {
          var totalpaymentAmount = item.employees.reduce(
            (acc, { paymentAmount = 0 }) => {
              acc += paymentAmount;
              return acc;
            },
            0
          );
          var yearP = `${inputYear}년`;
          // console.log(totalpaymentAmount);

          sumYearList[yearP] = totalpaymentAmount;
        });

        resolve(sumYearList);
        console.log(sumYearList);
      },
      error: function () {
        reject('아몰랑');
      },
    });
  });
}

// 월별 정보
function getMonthInfo(inputYear) {
  return new Promise(function (resolve, reject) {
    let sumMonthList = {};
    $.ajax({
      type: 'GET',
      url: '/json/payroll-register.json',
      success: function ({ payroll }) {
        $.each(payroll, function (index, item) {
          // 해당 년도만 더해주기
          if (parseInt(item.createdDate.substring(0, 4)) == inputYear) {
            var totalpaymentAmount = item.employees.reduce(
              (acc, { paymentAmount = 0 }) => {
                acc += paymentAmount;
                return acc;
              },
              0
            );
            var monthP = `${parseInt(item.createdDate.substring(5, 5 + 2))}월`;
            // console.log(totalpaymentAmount);

            sumMonthList[monthP] = totalpaymentAmount;
          }
        });

        resolve(sumMonthList);
        console.log(sumMonthList);
      },
      error: function () {
        reject('아몰랑');
      },
    });
  });
}

// 년도 선택 목록 출력
function selectYear() {
  $.ajax({
    type: 'GET',
    url: '/json/payroll-register.json',
    success: function ({ payroll }) {
      var html = '';

      $.each(payroll, function (index, item) {
        html += `<option value="${parseInt(
          item.createdDate.substring(0, 0 + 4)
        )}">
                    // ${item.name}
                </option>`;
      });

      $('#select-year').html(html);
      // $('#tax-free-limit').val(200000);
    },
  });
}
