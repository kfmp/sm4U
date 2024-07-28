// 기능 1. pdf로 변환
$(document).ready(function () {
  $('#download').on('click', function () {
    var element = document.getElementById('container');
    var opt = {
      filename: 'example.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,

        scrollY: 0,
        windowHeight: element.scrollHeight,
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
  });
});

//기능 2. 트리구조에서 이름 클릭하면 오른쪽 결재선상에 올라가는 이벤트
document.addEventListener('DOMContentLoaded', function () {
  var teamMap = {
    '김상학 이사': '임원실',
    '이재형 부장': '기술연구소',
    '김지은 부장': '기술연구소',
    '박현수 대리': '개발팀',
    '이성민 사원': '개발팀',
    '김민수 사원': '법무관리팀',
    '박소연 사원': '법무관리팀',
    '이수진 과장': '법무관리팀',
    '정현우 부장': '경리회계팀',
    '최윤정 대리': '경리회계팀',
    '한지수 과장': '경리회계팀',
    '박찬욱 부장': '운영팀',
    '김현식 차장': '운영팀',
    '마정운 대리': '운영팀',
    '서하윤 대리': '운영팀',
  };

  var labels = document.querySelectorAll('.lastTree');
  var approverContainer = document.querySelector('.approver-image-wrap');
  var signatureTableNameCell = document.querySelector('#add-signature-table');

  labels.forEach((label) => {
    label.addEventListener('click', function () {
      var name = label.textContent.trim(); //라벨을 클릭하면 그 라벨의 name값 가져오기
      console.log(name);
      var team = teamMap[name]; //그 name값에 해당하는 팀 value값 가져오기
      console.log(team);
      var newDiv = document.createElement('div');
      newDiv.classList.add('image-name-wrap');
      newDiv.innerHTML = `
                <i class="bi bi-file-person"></i>
                <p><span class="team">${team}</span> <span class="name">${name}</span></p>
                `;

      var news = document.createElement('tr');
      news.classList.add('signature-table');
      news.innerHTML = `
                <th rowspan="3" class="side-cell">승인</th> 
                <td class="main-cell">${name}</td>
                `;

      approverContainer.appendChild(newDiv);
      signatureTableNameCell.appendChild(news);
    });
  });
});

//기능 3.취소 클릭시 데이터 리셋
$('#delete-approver-list').on('click', function () {
  location.reload();
});

//기능 5. 미리보기 preview

var container = document.querySelector('.container');
var previewButton = document.querySelector('#preview');
var modal = document.getElementById('modal-see-already');
var modalBody = document.getElementById('modal-body');
var closeBtn = modal.querySelector('.close');

previewButton.addEventListener('click', function () {
  // 현재 페이지의 내용을 가져와서 모달에 삽입합니다.
  modalBody.innerHTML = container.innerHTML;
  modal.style.display = 'block'; // 현재 페이지 위로 쌓이게 스타일 삽입
  document.body.style.overflow = 'hidden';
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  document.body.appendChild(overlay);
  console.log(
    getSalaryInfo().then((re) => {
      console.log(re);
    })
  );
});

// 모달 닫기 버튼 클릭 시 모달 닫기
closeBtn.addEventListener('click', function () {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  const overlay = document.getElementById('modal-overlay');
  document.body.removeChild(overlay);
});

// 결재 요청 완료 알림
var btnPrimary = document.querySelector('#btn-access');
btnPrimary.addEventListener('click', function () {
  localStorage.setItem('activeNav', '/src/pages/home/home.html')
});

//결재 요청 버튼 클릭 후 메인 페이지로 이동
var btnAgree = document.querySelector('#btn-access');
btnAgree.addEventListener('click', function () {
  console.log('button hi');
  window.location.href = '/src/pages/home/home.html';

  //상태 값 변경
});

// 급여대장 정보 가져오기
$(function () {
  const createDate = document.querySelector('#createDate');
  const createDocument = document.querySelector('#createDocument');
  const createTotalPeople = document.querySelector('#createTotalPeople');
  const scheduledDate = document.querySelector('#scheduledDate');
  const salaryTaxableAmount = document.querySelector('#salaryTaxableAmount');
  const overtimePayTaxableAmount = document.querySelector(
    '#overtimePayTaxableAmount'
  );
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/approvalWaiting?id=1',
    success: function (res) {
      createDate.innerHTML = res[0].createDate;
      createDocument.innerHTML = res[0].id;
      createTotalPeople.innerHTML = res[0].data.length;
      scheduledDate.innerHTML = res[0].scheduledDate;

      const calculatedData = calculateAll(res[0].data);
      // 적재적소 요소 삽입
      insertTemplate(calculatedData);
    },
  });

  /**
   * 급여 데이터를 계산합니다.
   * @param {Array<Object>} data - 급여 데이터 배열
   * @returns {Object} 계산된 급여 데이터 객체
   */
  const calculateAll = (data) => {
    return data.reduce(
      (
        arr,
        {
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
        }
      ) => {
        arr.cSalary += salary;
        arr.cOvertimePay += overtimePay;
        arr.cNightWorkAllowance += nightWorkAllowance;
        arr.cFoodExpenses += foodExpenses;
        arr.cVehicleSupportExpenses += vehicleSupportExpenses;
        arr.cChildcareAllowance += childcareAllowance;
        arr.cHolidayBonus += holidayBonus;
        arr.cEarnedIncomeTax += earnedIncomeTax;
        arr.cEarnedLocalIncomeTax += earnedLocalIncomeTax;
        arr.cNationalPension += nationalPension;
        arr.cHealthInsurance += healthInsurance;
        arr.cLongTermCareInsurance += longTermCareInsurance;
        arr.cEmploymentInsurance += employmentInsurance;
        arr.cRepaymentOfStudentLoans += repaymentOfStudentLoans;
        return arr;
      },
      {
        cSalary: 0,
        cOvertimePay: 0,
        cNightWorkAllowance: 0,
        cFoodExpenses: 0,
        cVehicleSupportExpenses: 0,
        cChildcareAllowance: 0,
        cHolidayBonus: 0,
        cEarnedIncomeTax: 0,
        cEarnedLocalIncomeTax: 0,
        cNationalPension: 0,
        cHealthInsurance: 0,
        cLongTermCareInsurance: 0,
        cEmploymentInsurance: 0,
        cRepaymentOfStudentLoans: 0,
      }
    );
  };

  /**
   * 급여 데이터를 페이지에 삽입합니다.
   * @param {Object} calculatedData - 계산된 급여 데이터 객체
   */
  const insertTemplate = ({
    cSalary,
    cOvertimePay,
    cNightWorkAllowance,
    cFoodExpenses,
    cVehicleSupportExpenses,
    cChildcareAllowance,
    cHolidayBonus,
    cEarnedIncomeTax,
    cEarnedLocalIncomeTax,
    cNationalPension,
    cHealthInsurance,
    cLongTermCareInsurance,
    cEmploymentInsurance,
    cRepaymentOfStudentLoans,
  }) => {
    // 지급 상세
    document.querySelector('#salary').innerHTML = cSalary.toLocaleString();
    document.querySelector('#overtimePay').innerHTML =
      cOvertimePay.toLocaleString();
    document.querySelector('#nightWorkAllowance').innerHTML =
      cNightWorkAllowance.toLocaleString();
    document.querySelector('#foodExpenses').innerHTML =
      cFoodExpenses.toLocaleString();
    document.querySelector('#vehicleSupportExpenses').innerHTML =
      cVehicleSupportExpenses.toLocaleString();
    document.querySelector('#childcareAllowance').innerHTML =
      cChildcareAllowance.toLocaleString();
    document.querySelector('#holidayBonus').innerHTML =
      cHolidayBonus.toLocaleString();

    const totalTax = cSalary + cOvertimePay + cNightWorkAllowance;
    const totalNonTax =
      cFoodExpenses +
      cVehicleSupportExpenses +
      cChildcareAllowance +
      cHolidayBonus;

    document.querySelector('#total-tax').innerHTML = totalTax.toLocaleString();
    document.querySelector('#total-non-tax').innerHTML =
      totalNonTax.toLocaleString();
    document.querySelector('#total-all').innerHTML = (
      totalTax + totalNonTax
    ).toLocaleString();

    // 공제상세
    document.querySelector('#earnedIncomeTax').innerHTML =
      cEarnedIncomeTax.toLocaleString();
    document.querySelector('#earnedLocalIncomeTax').innerHTML =
      cEarnedLocalIncomeTax.toLocaleString();
    document.querySelector('#nationalPension').innerHTML =
      cNationalPension.toLocaleString();
    document.querySelector('#healthInsurance').innerHTML =
      cHealthInsurance.toLocaleString();
    document.querySelector('#longTermCareInsurance').innerHTML =
      cLongTermCareInsurance.toLocaleString();
    document.querySelector('#employmentInsurance').innerHTML =
      cEmploymentInsurance.toLocaleString();
    document.querySelector('#repaymentOfStudentLoans').innerHTML =
      cRepaymentOfStudentLoans.toLocaleString();

    const totalDeduction =
      cEarnedIncomeTax +
      cEarnedLocalIncomeTax +
      cNationalPension +
      cHealthInsurance +
      cLongTermCareInsurance +
      cEmploymentInsurance +
      cRepaymentOfStudentLoans;

    document.querySelector('#total-deduction').innerHTML =
      totalDeduction.toLocaleString();

    // 총 지급 금액
    document.querySelector('#total-payment-amount').innerHTML = (
      totalTax +
      totalNonTax -
      totalDeduction
    ).toLocaleString();
  };
});
