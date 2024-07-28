let employees = [];

$(function () {
  getCurrnetDate();
  // getEmployeeList();
  initEventListeners();
});

// 이벤트 초기화 함수
const initEventListeners = () => {
  $(window).on('load', handleInitLoad);
  $('#allcheck-input').on('click', handleAllCheck);
  $('#today-date').on('change', handleDateChange);
  $('#change-date-submit').on('click', handleScheduledDateClick);
  $('#payroll-table tbody').on('click', '.name', handleDetailClick);
};

/**.
 * 상세 지급 조회 함수(모달창)
 */
function handleDetailClick() {
  const empId = $(this).data('emp-id');
  const {
    name,
    departments,
    salary,
    overtimePay,
    nightWorkAllowance,
    foodExpenses,
    vehicleSupportExpenses,
    childcareAllowance,
    holidayBonus,
    earnedIncomeTax,
    earnedLocalIncomeTax,
    nationalPension,
    healthInsurance,
    longTermCareInsurance,
    employmentInsurance,
    repaymentOfStudentLoans,
    totalPayment,
    totalDeduction,
  } = employees.find((emp) => emp.id === parseInt(empId));

  $('#modal-name').val(name); // 사원명
  $('#modal-departments').val(departments); // 부서
  $('#modal-total-payment').val(totalPayment.toLocaleString()); // 지급항목 합계
  $('#modal-salary').val(salary.toLocaleString()); // 기본급
  $('#modal-overtime-pay').val(overtimePay.toLocaleString()); // 연장근로수당
  $('#modal-nightwork-allowance').val(nightWorkAllowance.toLocaleString()); // 야간근로수당
  $('#modal-food-expenses').val(foodExpenses.toLocaleString()); // 식대
  $('#modal-vehicle-support-expenses').val(
    vehicleSupportExpenses.toLocaleString()
  ); // 차량지원금
  $('#modal-children-allowance').val(childcareAllowance.toLocaleString()); // 육아수당
  $('#modal-holiday-bonus').val(holidayBonus.toLocaleString()); // 명절상여금
  $('#modal-total-deduction').val(totalDeduction.toLocaleString()); // 공제항목합계
  $('#modal-earned-income-tax').val(earnedIncomeTax.toLocaleString()); // 근로소득세
  $('#modal-earned-local-income-tax').val(
    earnedLocalIncomeTax.toLocaleString()
  ); // 근로지방소득세
  $('#modal-national-pension').val(nationalPension.toLocaleString()); // 국민연금
  $('#modal-health-insurance').val(healthInsurance.toLocaleString()); // 건강보험
  $('#modal-longterm-care-insurance').val(
    longTermCareInsurance.toLocaleString()
  ); // 장기요양보험
  $('#modal-employment-insurance').val(employmentInsurance.toLocaleString()); // 고용보험
  $('#modal-repayment-of-student-loans').val(
    repaymentOfStudentLoans.toLocaleString()
  ); // 학자금상환
}

/**
 * 체크박스 전체 선택 처리 함수
 */
function handleAllCheck() {
  let isChecked = $('#allcheck-input').is(':checked');

  if (isChecked) {
    $('.form-check-input').prop('checked', true);
  } else {
    $('.form-check-input').prop('checked', false);
  }
}

/**
 * 날짜 변경 이벤트 처리 함수
 */
function handleDateChange() {
  const selectedDate = $(this).val();

  // 유효성 검사
  if (!isValidDate(selectedDate)) {
    console.error('유효하지 않은 날짜 형식입니다.');
    return;
  }

  // ⭐ if(오늘 날짜랑 같다면, 초기화하는 그거 호출하고 return하기)
  if (selectedDate === '2024-07-28') {
    handleInitLoad();
    return;
  }

  $.ajax({
    type: 'GET',
    url: `http://localhost:3000/payroll?createdDate=${encodeURIComponent(
      selectedDate
    )}`,
    dataType: 'json',
    success: function (res) {
      // 데이터 검증
      if (!Array.isArray(res) || res.length === 0) {
        console.log('데이터가 존재하지 않음');
        return;
      }

      const payroll = { ...res[0] };
      employees = [];
      employees.push(payroll.employees);

      printPayrollDisplay(payroll);
      printPayrollList(payroll);
    },
    error: function (xhr, status, err) {
      console.error('[AJAX_getPayrollList] 에러발생' + status + err);
    },
  });
}

/**
 * 급여 대장 카드 정보 렌더링 함수
 * @param {Object} payroll
 */
const printPayrollDisplay = ({ employees }) => {
  // 데이터 검증
  if (!Array.isArray(employees) || employees.length === 0) {
    return;
  }

  const totals = employees.reduce(
    (
      acc,
      {
        totalPayment = 0,
        totalDeduction = 0,
        paymentAmount = 0,
        unPaymentAmount = 0,
      }
    ) => {
      acc.totalPayments += totalPayment;
      acc.totalDeductions += totalDeduction;
      acc.paymentAmount += paymentAmount;
      acc.unPaymentAmount += unPaymentAmount;
      return acc;
    },
    {
      totalPayments: 0,
      totalDeductions: 0,
      paymentAmount: 0,
      unPaymentAmount: 0,
    }
  );

  $('#display-emp-count').text(employees.length);
  $('#display-total-payment').text(totals.totalPayments.toLocaleString());
  $('#display-total-deduction').text(totals.totalDeductions.toLocaleString());
  $('#display-payment-amount').text(totals.paymentAmount.toLocaleString());
  $('#display-no-payment-amount').text(totals.unPaymentAmount.toLocaleString());
};

/**
 * 사원 리스트 목록 렌더링 함수
 * @param {Object} payroll - 급여 데이터
 */
const printPayrollList = ({ employees }) => {
  const tbody = $('#payroll-table tbody').empty();

  const listEls = employees
    .map(
      ({
        id,
        status,
        name,
        departments,
        position,
        hrieDate,
        scheduledPaymentDate,
        totalPayment,
        totalDeduction,
        paymentAmount,
        unPaymentAmount,
      }) => {
        const statusClass = getStatusClass(status || '작성중');

        return `<tr>
                <th scope="row" class="w-10">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="check-input-${id}"
                  />
                </th>
                <td><span class="badge ${statusClass}">${
          status || '작성중'
        }</span></td>
                <td data-bs-toggle="modal" data-bs-target="#exampleModal" data-emp-id=${id} class="name">
                  ${name || '정보없음'}
                </td>
                <td>${departments || '정보없음'}</td>
                <td>${position || '정보없음'}</td>
                <td>${hrieDate || '정보없음'}</td>
                <td id="scheduled-payment-date">${
                  scheduledPaymentDate || '정보없음'
                }</td>
                <td>${totalPayment.toLocaleString() || '정보없음'}</td>
                <td>${totalDeduction.toLocaleString() || '정보없음'}</td>
                <td>${paymentAmount.toLocaleString() || '정보없음'}</td>
                <td>${unPaymentAmount.toLocaleString() || '정보없음'}</td>
              </tr>`;
      }
    )
    .join('');

  tbody.append(listEls);
};

/**
 * 급여 대장 생성일 설정 함수
 */
const getCurrnetDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD
  $('#today-date').val(formattedDate);
};

// 세금 계산
const calculateTax = (emp) => {
  const basicPay = emp.salary; // 기본급
  const overtimePay = 100000; // 연장 근로 수당
  const nightWorkAllowance = 100000; // 야간 근로 수당

  // 식대, 차량지원금, 육아수당, 명절 상여금
  const foodExpenses = 100000;
  const vehicleSupportExpenses = 100000;
  const childcareAllowance = 100000; // 육아수당은 numberOfChildren에 따라 달라짐
  const holidayBonus = 100000;

  // TODO: 24년 사회보험 요율표 불러오기 API
  const earnedIncomeTax = 100000; // 근로소득세
  const earnedLocalIncomeTax = 100000; // 근로지방소득세
  const nationalPension = 100000; // 국민연금
  const healthInsurance = 100000; // 건강보험
  const longTermCareInsurance = 100000; // 장기요양보험
  const employmentInsurance = 100000; // 고용보험
  const repaymentOfStudentLoans = 100000; // 학자금 상환

  const scheduledPaymentDate = '2024-08-20';
  const totalPayment =
    basicPay +
    overtimePay +
    nightWorkAllowance +
    foodExpenses +
    vehicleSupportExpenses +
    holidayBonus;
  const totalDeduction =
    earnedIncomeTax +
    earnedLocalIncomeTax +
    nationalPension +
    healthInsurance +
    longTermCareInsurance +
    employmentInsurance +
    repaymentOfStudentLoans;
  const paymentAmount = totalPayment - totalDeduction;
  const unPaymentAmount = paymentAmount;

  return {
    ...emp,
    overtimePay,
    nightWorkAllowance,
    foodExpenses,
    vehicleSupportExpenses,
    childcareAllowance,
    holidayBonus,
    earnedIncomeTax,
    earnedLocalIncomeTax,
    nationalPension,
    healthInsurance,
    longTermCareInsurance,
    employmentInsurance,
    repaymentOfStudentLoans,
    scheduledPaymentDate,
    totalPayment,
    totalDeduction,
    paymentAmount,
    unPaymentAmount,
  };
};

const handleInitLoad = async () => {
  // emps 순회하면서 리스트 형식 만들기 + 계산 자동화까지 미리 끝내두기
  // (모달) 계산된 세금들 어떻게 관리(?)
  // payroll db처럼 employees 배열을 만들어서 거기서 관리를 해두면 되겠네
  employees = [];
  const emps = await getEmployeeList();
  // 계산하기(일단 생략)
  emps
    .filter((emp) => emp.tenure === '재직')
    .forEach((activedEmp) => {
      const calculatedEmployee = calculateTax(activedEmp);
      employees.push(calculatedEmployee);
    });

  printPayrollDisplay({ employees });
  printPayrollList({ employees });
};

// 사원 정보 초기화 함수
const getEmployeeList = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/employees',
      dataType: 'json',
      success: function (res) {
        // 데이터 검증
        if (!Array.isArray(res) || res.length === 0) {
          console.log('데이터가 존재하지 않음');
          resolve([]);
        }

        resolve([...res]);
      },
      error: function (xhr, status, err) {
        console.error('[AJAX_getEmployeeList] ' + status + err);
        reject(err);
      },
    });
  });
};

// 지급 예정일 수정하기
const handleScheduledDateClick = () => {
  const selectedDate = $('#change-date').val();
  const checkedCheckboxes = $('tr input[type=checkbox]:checked');

  if (!isValidDate(selectedDate)) {
    console.error('유효하지 않은 날짜 형식입니다.');
    return;
  }

  checkedCheckboxes.each(function (index, item) {
    const trEl = $(item).closest('tr');
    trEl.find('#scheduled-payment-date').text(selectedDate);
  });

  // 체크된 요소들 체크 해제 시키기
  checkedCheckboxes.prop('checked', false);
};

/**
 * 날짜 유효성 검사 함수
 * @param {string} date - 검사할 날짜 문자열
 * @returns {boolean} - 유효성 검사 결과
 */
const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
};

/**
 * 상태에 따른 CSS 클래스 반환 함수
 * @param {string} status - 사원 상태
 * @returns {string} - CSS 클래스
 */
const getStatusClass = (status) => {
  switch (status) {
    case '이체완료':
      return 'text-bg-success';
    case '이체대기중':
      return 'text-bg-warning';
    case '결재반려':
      return 'text-bg-danger';
    case '작성중':
      return 'text-bg-primary';
    default:
      return 'text-bg-secondary';
  }
};
