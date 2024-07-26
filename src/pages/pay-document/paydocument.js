$(function () {
  $('#allcheck-input').click(function () {
    let isChecked = $('#allcheck-input').is(':checked');

    if (isChecked) {
      $('.form-check-input').prop('checked', true);
    } else {
      $('.form-check-input').prop('checked', false);
    }
  });
});
