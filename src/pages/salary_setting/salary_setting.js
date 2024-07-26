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
    printPaymentItems();
  });
});

// 비과세 체크 시 비과세 선택 화면 보여주기
$(function(){
  $('#tax-free').on('click', function () {
    if($(this).is(':checked')){
      console.log("dssdds");
      $('#tax-free-content').show();
    } else {
      $('#tax-free-content').hide();
    }
  });
})

// 비과세 선택 목록 출력
$(function () {
  $('#btn-add-payment-item').on('click', function () {
    $.ajax({
      type: 'GET',
      url: '/json/tax_free_items.json',
      success: function ({taxFreeItems}) {
        var html = '';

        $.each(taxFreeItems, function (index, item) {
          html += `<option value="${item.name}">
                      ${item.name}
                  </option>`;
        });

        $('#tax-free-select').html(html);
        $('#tax-free-limit').val(200000);
      },
    });
  });
});

// 비과세 선택 시 한도 출력
$(function(){
  $('#tax-free-select').on('change', function(){
    $.ajax({
      type: 'GET',
      url: '/json/tax_free_items.json',
      success: function ({taxFreeItems}) {
        let result = taxFreeItems.find((item) => $('#tax-free-select option:selected').val() == item.name);

        $('#tax-free-limit').val(result.price);
      },
    })
  })
})

// 지급항목 추가
$(function(){
  $('#save-add-payment-item').on('click', function(){
    let form = $('#add-payment-item-form').serializeArray();
    let name = form[0].value;
    let fixedAllowance = form[1].value;
    let amount = form[2].value;
    let taxFree = form[3].value;
    let taxFreeLimit = taxFree ? form[4].value : null;
    let isUsed = true;
    let addItem = {
      "name": "기본급",
      "fixedAllowance": false,
      "amount": 0,
      "taxFree": false,
      "taxFreeLimit": null,
      "isUsed": true
    };
    // console.log(name);
    console.log(name);
  })
})

function printPaymentItems() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/paymentItems',
    success: function (response) {
      $('#payment-item-body>tr').empty();

      var html = '';

      $.each(response, function (index, item) {
        console.log(this.amount);

        html += `<tr>`;
        html += `<th scope="row">`;
        html += `<input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="select-payment-item"
                />`;
        // 항목명
        html += `</th>
                  <td>
                    <a href="#" class="link-primary">${item.name}</a>
                  </td>`;
        html += `<td>${
          item.fixedAllowance ? '<i class="bi bi-check-lg"></i>' : ''
        }</td>`;
        html += `<td class="text-end">${item.amount}</td>`;
        html += `<td>${
          item.taxFree ? '<i class="bi bi-check-lg"></i>' : ''
        }</td>`;
        html += `<td class="text-end">${
          item.taxFreeLimit == null ? '' : item.taxFreeLimit
        }</td>`;
        html += `<td>
                  <div
                    class="form-check form-switch d-flex justify-content-center"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="use-status"
                      ${item.isUsed ? 'checked' : ''}
                    />
                  </div>
                </td>
              </tr>`;
      });

      $('#payment-item-body').html(html);
    },
  });
}
