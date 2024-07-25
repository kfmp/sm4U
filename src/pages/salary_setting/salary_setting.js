// const lastDayInput = document.querySelector('#last-day-select');

// 급여대장 - 말일 checkbox 선택 시 input 비활성화
$(function () {
  $('#last-day-select').on('click', function () {
    if ($(this).is(':checked')) {
      $('#day-input').prop('disabled', true);
      $('#day-input').prop('value', '');
    } else {
      $('#day-input').prop('disabled', false);
      $('#day-input').prop('value', '10');
    }
  });
});

// 지급항목 - 지급항목 페이지 클릭 시 지급항목 리스트 출력
$(function () {
  $('#payment-item-tab').on('click', function () {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/paymentItems',
      success: function (response) {
        $.each(response, function (index, item) {
          console.log(item.name);
        });
      },
    });
  });
});
