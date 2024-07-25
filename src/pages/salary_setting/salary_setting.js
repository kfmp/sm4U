// const lastDayInput = document.querySelector('#last-day-select');

// 말일 checkbox 선택 시 input 비활성화
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
