$(function () {
    let allEmployees = []; // 모든 직원 데이터를 저장할 배열
    // console.log(allEmployees)
    // 데이터 로드 및 초기 표시
    function fetchAndDisplayEmployees() {
        $.ajax({
            url: 'http://localhost:3000/employees',
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                allEmployees = data; // 받은 데이터 저장
                filterAndDisplayEmployees(); // 초기 필터링 및 표시
            },
            error: function (error) {
                console.log("Error fetching data: ", error);
            }
        });
    }

    // 선택된 '재직 상태'에 따라 데이터 필터링 및 표시
    function filterAndDisplayEmployees() {
        const selectedTenure = $('.form-select').val(); // 선택된 재직 상태 값
        const filteredEmployees = allEmployees.filter(employee => {
            return employee.tenure === selectedTenure; // 현재 선택된 값과 맞는 데이터만 필터링
        });

        updateEmployeeTable(filteredEmployees); // 필터링된 데이터로 테이블 업데이트
    }

    // 테이블 업데이트 함수
    function updateEmployeeTable(employees) {
        var $table = $('tbody');
        $table.empty(); // 테이블 내용 초기화

        // Intl 란? 국제화를 사용할때 사용하는 ES6의 내장객체중 하나
        // 객체를 생성한후 사용할 포멧을 호출한후 첫번재파라미터에 지역을 써준후 
        // 두번째 파타리터엔 스타일을 써주어 사용할수있다
        // 숫자를 통화 형식으로 포맷하기 위한 NumberFormat 인스턴스 생성
        const numberFormatter = new Intl.NumberFormat('ko-KR', {
            style: 'decimal',
            maximumFractionDigits: 0  // 소수점 이하 자릿수를 0으로 설정하여 정수만 표시
        });

        employees.forEach(function (employee) {
            console.log(typeof employee.id);
            $table.append(
                `<tr>
                    <td>${employee.tenure}</td>
                    <td><a href="#" data-bs-toggle="modal" data-bs-target="#employeeDetailsModal" data-id="${employee.id}">${employee.name}</a></td>
                    <td>${employee.departments}</td>
                    <td>${employee.position || '<span class="warning">!</span>'}</td>
                    <td>${employee.hrieDate || '<span class="warning">!</span>'}</td>
                    <td>${employee.endDate || '-'}</td>
                    <td>${employee.classification || '<span class="warning">!</span>'}</td>
                    <td>${employee.annualSalary ? new Intl.NumberFormat('ko-KR').format(employee.annualSalary) : '<span class="warning">!</span>'}</td>
                    <td>${employee.salary ? new Intl.NumberFormat('ko-KR').format(employee.salary) : '<span class="warning">!</span>'}</td>
                    <td>${employee.bank || '<span class="warning">!</span>'}</td>
                    <td>${employee.bankcount || '<span class="warning">!</span>'}</td>
                </tr>`
            );
        });
    }


    // '재직 상태' 선택 요소의 변경 이벤트 핸들러
    $('.form-select').on('change', function () {
        // 가데이터로 할려다가 그냥 한번에하기로함
        filterAndDisplayEmployees(); // 선택 값이 변경될 때마다 필터링 및 표시
    });

    // 초기 데이터 로드
    fetchAndDisplayEmployees();
    // 직원의 이름 클릭 시 모달 데이터 설정

    // 동적 생성이라 모달 상위객체로 접근해야하는데 방법이 안떠오르다.. 어차피 document가 항상최상위..!
    // 이렇게 접근하는것도 좋은방법..!
    $(document).on('click', 'a[data-bs-toggle="modal"]', function () {
        var employeeId = $(this).data('id');
        //console.log(typeof employeeId)
        //console.table(typeof allEmployees[0].id)
        var employee = allEmployees.find(emp => emp.id === employeeId.toString());

        if (employee) {
            console.table(employee); // 디버깅을 위해 콘솔에 직원 정보 출력
            $('#employeeDetailsModalLabel').text(employee.name + '의 상세 정보'); // 모달 타이틀 설정
            // 필드 설정
            $('#classification').val(employee.classification);
            $('#hrieDate').val(employee.hrieDate);
            $('#id').val(employee.id);
            $('#name').val(employee.name);
            $('#tenure').val(employee.tenure);
            $('#bankcount').val(employee.bankcount);
            $('#salary').val(employee.salary);
            $('#annualSalary').val(employee.annualSalary);
            $('#bankcount').val(employee.bankcount);
            $("#optSelect").val(employee.optSelect);
            $("#selectBox").val(employee.selectBox);
            $('#bank').val(employee.bank);
            $('#byeAccount').val(employee.byeAccount)
            $('#position').val(employee.position);
            $('#allFamily').val(employee.allFamily)
            $('#numberOfChildren').val(employee.numberOfChildren)



            // 이하 다른 필드도 동일하게 설정
            $('#employeeDetailsModal').modal('show');
        }
    });

    // 변경사항 저장하는 이벤트 핸들러
    $('#saveChanges').on('click', function () {
        var updatedData = {
            classification: $('#classification').val(),
            hrieDate: $('#hrieDate').val(),
            name: $('#name').val(),
            tenure: $('#tenure').val(),
            bankcount: $('#bankcount').val(),
            salary: parseInt($('#salary').val()),
            annualSalary: parseInt($('#annualSalary').val()),
            bank: $('#bank').val(),
            byeAccount: $('#byeAccount').val(),
            allFamily: parseInt($('#allFamily').val()),
            numberOfChildren: parseInt($('#numberOfChildren').val())
        };

        //console.log('Updated Data:', updatedData); 


        $.ajax({
            url: `http://localhost:3000/employees/${parseInt($('#id').val())}`,
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function (response) {
                //console.log('오셧나요? ', response);
                $('#employeeDetailsModal').modal('hide');
                fetchAndDisplayEmployees(); // 데이터를 다시 불러와서 테이블을 업데이트
            },
            error: function (err) {
                console.error('Error updating data: ', err);
                alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.'); // 사용자에게 오류 알림
            }
        });
    });

});
