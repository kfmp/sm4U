// const lastDayInput = document.querySelector('#last-day-select');
var searchPaymentItem;
var searchDeductionItem;

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
//          & 로컬스토리지에 탭 정보 저장
$(function () {
  $('#payment-item-tab').on('click', function () {
    printPaymentItems();
  });
});

// 비과세 체크 시 비과세 선택 화면 보여주기
$(function () {
  $('#tax-free').on('click', function () {
    if ($(this).is(':checked')) {
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
      success: function ({ taxFreeItems }) {
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
$(function () {
  $('#tax-free-select').on('change', function () {
    $.ajax({
      type: 'GET',
      url: '/json/tax_free_items.json',
      success: function ({ taxFreeItems }) {
        let result = taxFreeItems.find((item) => $('#tax-free-select option:selected').val() == item.name);

        $('#tax-free-limit').val(result.price);
      },
    })
  })
})

// 지급항목 추가
$(function () {
  $('#save-add-payment-item').on('click', function (e) {
    e.preventDefault();
    let form = $('#add-payment-item-form').serializeArray();
    console.log(form);
    let name = form[0].value;
    let fixedAllowance = form[1].value == 'true' ? true : false;
    let amount = form[2].value;
    let taxFree = form[3].value == "on" ? true : false;
    let taxFreeSelect = taxFree ? form[4].value : null;
    let taxFreeLimit = taxFree ? form[5].value : null;
    // $('input[name="add-fixed-allowance"]:checked').val()
    let isUsed = true;
    let addItem = {
      "name": name,
      "fixedAllowance": fixedAllowance,
      "amount": parseInt(amount),
      "taxFree": taxFree,
      "taxFreeLimit": taxFreeLimit,
      "isUsed": isUsed
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/paymentItems',
      contentType: 'application/json',
      data: JSON.stringify(addItem),
      dataType: 'json',
      success: function (data) {
        //   console.log(data);
        //   //   // $('#payment-item-tab').prop('aria-selected', true);
        //   //   // $('#payment-item-tab').tab('show');
        //   //   // $('#employee-salary-tab').removeClass('active');
        //   //   // $('#payment-item-tab').addClass('active');
        //   //   $("#payment-item-tab").trigger("click");
        printPaymentItems();
      }
    })

  })
})

// 지급항목 - 자동완성 기능
$(function () {
  $('#search-payment-item').autocomplete({  //자동완성 시작
    source: function (request, response) {
      var r = []; //자동완성의 응답값
      var q = request.term; //사용자의 input값을 받는다
      //배열의 형태가 복잡한 경우, 임의로 필터를 지정해줘야함
      //내가 받아온 배열이 위의 예제배열과 같은 형태이기때문에 데이터형태를 그대로 구현
      $.each(searchPaymentItem, function (k, v) {
        if (v.name.indexOf(q) != -1) {
          r.push({
            label: v.name, //자동완성창에 표시되는 데이터
            value: v.name, //선택했을때 input박스에 입력되는 데이터
            "name": v.name, //추가정보를 핸들링하고 싶을때 추가
          })
        }
      });
      response(r.slice(0, 10)); //자동완성 최대갯수 제한
    },
    select: function (event, ui) {    //아이템 선택시
      console.log(ui.item);
      console.log(ui.item.value);
    },
    focus: function (event, ui) {
      return false;
    },
    minLength: 1,// 최소 글자수
    autoFocus: true, //첫번째 항목으로 자동 포커스
    delay: 0,    //검색창에 글자 써지고 나서 autocomplete 창 뜰 때 까지 딜레이 시간(ms)
    close: function (event) {    //자동완성창 닫아질때 호출
      //console.log(event);
    }
  })
})

// 지급항목 - 조회 기능
$(function () {
  $('#btn-search-payment-item').on('click', function (e) {
    e.preventDefault();
    console.log($('#search-payment-item').val());

    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/paymentItems?name=${$('#search-payment-item').val()}`,
      success: function (response) {

        var html = '';
        console.log(response);
        $('#payment-item-body>tr').empty();
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
                    <a href="#" class="link-primary">${response[0].name}</a>
                  </td>`;
        html += `<td>${response[0].fixedAllowance ? '<i class="bi bi-check-lg"></i>' : ''
          }</td>`;
        html += `<td class="text-center">${response[0].amount}</td>`;
        html += `<td>${response[0].taxFree ? '<i class="bi bi-check-lg"></i>' : ''
          }</td>`;
        html += `<td class="text-center">${response[0].taxFreeLimit == null ? '' : response[0].taxFreeLimit
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
                      ${response[0].isUsed ? 'checked' : ''}
                    />
                  </div>
                </td>
              </tr>`;

        $('#payment-item-body').html(html);
        console.log(html);
      }

    });

  })
})

// 공제항목 - 공제항목 페이지 클릭 시 지급항목 리스트 출력
$(function () {
  $('#deduction-items-tab').on('click', function () {
    printDeductionItems();
  });
});

// 공제항목 - 추가
$(function () {
  // $('#save-add-deduction-item').on('submit', function(e){
  $('#add-deduction-item-form').submit(function (e) {
    e.preventDefault();

    let form = $('#add-deduction-item-form').serializeArray();
    console.log(form);
    let name = form[0].value;
    let price = form[1].value;
    let isUsed = true;
    let addItem = {
      "name": name,
      "price": price,
      "isUsed": isUsed
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/deductibleItems',
      contentType: 'application/json',
      data: JSON.stringify(addItem),
      dataType: 'json',
      success: function (data) {
        //   console.log(data);
        // printdeductionItems();
      }
    });
    // this.submit();
    // })
  })
})

// 공제항목 - 자동완성 기능
$(function () {
  $('#search-deduction-item').autocomplete({  //자동완성 시작
    source: function (request, response) {
      var r = []; //자동완성의 응답값
      var q = request.term; //사용자의 input값을 받는다
      //배열의 형태가 복잡한 경우, 임의로 필터를 지정해줘야함
      //내가 받아온 배열이 위의 예제배열과 같은 형태이기때문에 데이터형태를 그대로 구현
      $.each(searchDeductionItem, function (k, v) {
        if (v.name.indexOf(q) != -1) {
          r.push({
            label: v.name, //자동완성창에 표시되는 데이터
            value: v.name, //선택했을때 input박스에 입력되는 데이터
            "name": v.name, //추가정보를 핸들링하고 싶을때 추가
          })
        }
      });
      response(r.slice(0, 10)); //자동완성 최대갯수 제한
    },
    select: function (event, ui) {    //아이템 선택시
      console.log(ui.item);
      console.log(ui.item.value);
    },
    focus: function (event, ui) {
      return false;
    },
    minLength: 1,// 최소 글자수
    autoFocus: true, //첫번째 항목으로 자동 포커스
    delay: 0,    //검색창에 글자 써지고 나서 autocomplete 창 뜰 때 까지 딜레이 시간(ms)
    close: function (event) {    //자동완성창 닫아질때 호출
      //console.log(event);
    }
  })
})

// 공제항목 - 조회 기능
$(function () {
  $('#btn-search-deduction-item').on('click', function (e) {
    e.preventDefault();
    console.log($('#search-deduction-item').val());

    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/deductibleItems?name=${$('#search-deduction-item').val()}`,
      success: function (response) {

        var html = '';
        console.log(response);
        $('#deduction-item-body>tr').empty();
        html += `<tr>`;
        html += `<th scope="row">`;
        html += `<input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="select-deduction-item"
                />`;
        html += `</th>
                  <td>
                    <a href="#" class="link-primary">${response[0].name}</a>
                  </td>`;
        html += `<td class="text-center">${response[0].price}</td>
                      <td>
                        <div
                          class="form-check form-switch d-flex justify-content-center"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="use-status"
                            ${response[0].isUsed ? 'checked' : ''}
                          />
                        </div>
                      </td>
                    </tr>`


        $('#deduction-item-body').html(html);
      }

    });

  })
})

function printPaymentItems() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/paymentItems',
    success: function (response) {
      $('#payment-item-body>tr').empty();

      var html = '';

      searchPaymentItem = response;

      $.each(response, function (index, item) {
        // console.log(this.amount);

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
        html += `<td>${item.fixedAllowance ? '<i class="bi bi-check-lg"></i>' : ''
          }</td>`;
        html += `<td class="text-center">${item.amount.toLocaleString()}</td>`;
        html += `<td>${item.taxFree ? '<i class="bi bi-check-lg"></i>' : ''
          }</td>`;
        html += `<td class="text-center">${item.taxFreeLimit == null ? '' : item.taxFreeLimit.toLocaleString()
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

function printDeductionItems() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/deductibleItems',
    success: function (response) {
      $('#deduction-item-body>tr').empty();

      var html = '';

      searchDeductionItem = response;

      $.each(response, function (index, item) {
        html += `<tr>`;
        html += `<th scope="row">`;
        html += `<input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="select-deduction-item"
                />`;
        html += `</th>
                  <td>
                    <a href="#" class="link-primary">${item.name}</a>
                  </td>`;
        html += `<td class="text-center">${item.price}</td>
                      <td>
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
                    </tr>`
      });

      $('#deduction-item-body').html(html);
    },
  });
}