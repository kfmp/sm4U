let tag = '[payroll]: ';

$(function () {
  getCurrnetDate();
  initEventListeners();
  // 사원 리스트 전체 조회

  // 모달 상세 조회 기능
});

// 이벤트 초기화 함수
const initEventListeners = () => {
  $('#allcheck-input').on('click', handleAllCheck);
  $('#today-date').on('change', handleDateChange);
};

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
  }

  $.ajax({
    type: 'get',
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

  let allTotalPayments = 0;
  let allTotalDeduction = 0;
  let allPaymentAmount = 0;
  let allUnPaymentAmount = 0;

  employees.forEach(
    ({ totalPayment, totalDeduction, paymentAmount, unPaymentAmount }) => {
      allTotalPayments += totalPayment;
      allTotalDeduction += totalDeduction;
      allPaymentAmount += paymentAmount;
      allUnPaymentAmount += unPaymentAmount;
    }
  );

  $('#display-emp-count').text(employees.length);
  $('#display-total-payment').text(allTotalPayments.toLocaleString());
  $('#display-total-deduction').text(allTotalDeduction.toLocaleString());
  $('#display-payment-amount').text(allPaymentAmount.toLocaleString());
  $('#display-no-payment-amount').text(allUnPaymentAmount.toLocaleString());
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
        let statusClass;
        switch (status) {
          case '이체완료':
            statusClass = 'text-bg-success';
            break;
          case '이체대기중':
            statusClass = 'text-bg-warning';
            break;
          case '결재반려':
            statusClass = 'text-bg-danger';
            break;
          case '작성중':
            statusClass = 'text-bg-primary';
            break;
        }
        console.log(statusClass);
        return `<tr>
                <th scope="row" class="w-10">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="check-input-${id}"
                  />
                </th>
                <td><span class="badge ${statusClass}">${status}</span></td>
                <td data-bs-toggle="modal" data-bs-target="#exampleModal" data-emp-id=${id}>
                  ${name || '정보없음'}
                </td>
                <td>${departments || '정보없음'}</td>
                <td>${position || '정보없음'}</td>
                <td>${hrieDate || '정보없음'}</td>
                <td>${scheduledPaymentDate || '정보없음'}</td>
                <td>${totalPayment || '정보없음'}</td>
                <td>${totalDeduction || '정보없음'}</td>
                <td>${paymentAmount || '정보없음'}</td>
                <td>${unPaymentAmount || '정보없음'}</td>
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

/**
 * 날짜 유효성 검사 함수
 * @param {string} date - 검사할 날짜 문자열
 * @returns {boolean} - 유효성 검사 결과
 */
const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
};
