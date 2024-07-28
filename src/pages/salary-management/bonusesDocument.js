$(function () {
    let allEmployees = []; // 모든 직원 데이터를 저장할 배열

    // 데이터 로드 및 초기 표시
    function fetchAndDisplayEmployees() {
        $.ajax({
            url: 'http://localhost:3000/bonuses',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                //console.log("Fetched data:", data);
                allEmployees = data; // 받은 데이터 저장
                updateEmployeeTable(allEmployees); // 데이터로 테이블 업데이트
            },
            error: function (error) {
                console.error("Error fetching data:", error);
            }
        });
    }

    // 테이블 업데이트 함수
    // 테이블 업데이트 함수
    function updateEmployeeTable(employees) {
        var $table = $('tbody');
        $table.empty(); // 테이블 내용 초기화

        let totalMoneyGood = 0;
        let totalMoneyBye = 0;
        let totalRealMoney = 0;

        const numberFormatter = new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            minimumFractionDigits: 0
        });

        employees.forEach(function (employee, index) {
            totalMoneyGood += employee.moneyGood || 0;
            totalMoneyBye += employee.moneyBye || 0;
            totalRealMoney += employee.realMoney || 0;

            $table.append(
                `<tr>
                <th scope="row" class="w-10"><input class="form-check-input" type="checkbox" value="${employee.id}" id="check-input-${employee.id}"></th>
                <td><span class="badge text-bg-primary">${employee.tenure}</span></td>
                <td data-bs-toggle="modal" data-bs-target="#employeeDetailsModal" data-id="${employee.id}"><a href="#">${employee.name}</a></td>
                <td>${employee.departments}</td>
                <td>${employee.position || '<span class="text-warning">!</span>'}</td>
                <td>${employee.hrieDate || '<span class="text-warning">!</span>'}</td>
                <td>${employee.moneyMaybe || '-'}</td>
                <td>${employee.moneyGood ? numberFormatter.format(employee.moneyGood) : '<span class="text-warning" style="margin-left: 35px;">!</span>'}</td>
                    <td>${employee.moneyBye ? numberFormatter.format(employee.moneyBye) : '<span class="text-warning" style="margin-left: 35px;">!</span>'}</td>
                    <td>${employee.realMoney ? numberFormatter.format(employee.realMoney) : '<span class="text-warning" style="margin-left: 59px;">!</span>'}</td>
                    <td>${employee.realMoney ? numberFormatter.format(employee.realMoney) : '<span class="text-warning" style="margin-left: 45px;">!</span>'}</td>
            </tr>`
            );
        });

        // 결과 업데이트
        $('#empLength').text(employees.length)
        $('#allMoneyGood').text(numberFormatter.format(totalMoneyGood));
        $('#allMoneyBye').text(numberFormatter.format(totalMoneyBye));
        $('.allRealMoney').each(function () {
            $(this).text(numberFormatter.format(totalRealMoney));
        });
    }


    fetchAndDisplayEmployees();



    // .on() 메소드를 사용하여 클릭 이벤트 처리
    $('#allcheck-input').on('click', function () {
        // .is(':checked')로 체크 상태를 확인하고 모든 .form-check-input 체크박스의 상태를 설정
        var isChecked = $(this).is(':checked');
        $('.form-check-input').prop('checked', isChecked);
    });




    // 직원의 이름 클릭 시 모달 데이터 설정
    $(document).on('click', 'a[data-bs-toggle="modal"]', function () {
        const employeeId = $(this).data('id').toString();
        const employee = allEmployees.find(emp => emp.id === employeeId);

        if (employee) {
            Object.keys(employee).forEach(key => {
                $(`#${key}`).val(employee[key]);
            });

            $('#employeeDetailsModalLabel').text(`${employee.name}의 상세 정보`);
            $('#employeeDetailsModal').modal('show');
        }
    });

    // 모든 체크박스를 체크하거나 체크를 해제하는 이벤트 처리
    $('#allcheck-input').on('click', function () {
        var isChecked = $(this).is(':checked');
        $('.form-check-input').prop('checked', isChecked);
    });

    var globalWorkbook;
    var headerStyles = {};

    $('#input-excel').on('change', function (event) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            globalWorkbook = XLSX.read(data, { type: 'array', cellStyles: true });
            var sheet = globalWorkbook.Sheets[globalWorkbook.SheetNames[0]];

            // 헤더 정보 로딩 및 스타일 저장
            var headerRange = XLSX.utils.decode_range('A1:K1'); // A1부터 K1까지 헤더
            for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
                let cell_ref = XLSX.utils.encode_cell({ r: headerRange.s.r, c: C });
                let cell = sheet[cell_ref];
                if (cell && cell.s) {
                    headerStyles[cell_ref] = cell.s; // 스타일 저장
                }
            }

            // 전체 데이터 로딩 및 표시
            handleExcelDataHtml(sheet);
        };
        reader.readAsArrayBuffer(event.target.files[0]);
    });

    // HTML 테이블에 데이터 로드 및 표시 함수
    function handleExcelDataHtml(sheet) {
        var range = XLSX.utils.decode_range(sheet['!ref']); // 전체 시트 범위
        var employees = [];

        for (let R = range.s.r; R <= range.e.r; R++) {
            let employee = {
                id: R,
                tenure: "",
                name: "",
                departments: "",
                position: "",
                hrieDate: "",
                moneyMaybe: "",
                moneyGood: 0,
                moneyBye: 0,
                realMoney: 0
            };

            for (let C = range.s.c; C <= range.e.c; C++) {
                let cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
                let cellValue = cell ? (cell.w || cell.v) : "";


                //console.log(cell);
                // 날짜 처리 'n' 타입이면서 'w' 로 올때가 있음 세상 어지럽다
                if (cell && cell.t === 'n' && (cell.w && /(\d{1,2}\/\d{1,2}\/\d{2,4})/.test(cell.w))) {
                    let dateValue = XLSX.SSF.parse_date_code(cell.v);
                    cellValue = `${dateValue.y}-${String(dateValue.m).padStart(2, '0')}-${String(dateValue.d).padStart(2, '0')}`;
                } else if ([6, 7, 8].includes(C) && typeof cellValue === 'string') { // 금액 필드
                    cellValue = parseFloat(cellValue.replace(/[^\d.-]/g, '')) || 0;
                }

                // 금액 처리
                if ([6, 7, 8].includes(C) && typeof cellValue === 'string') {
                    // 정규표현식을 사용하여 모든 비숫자 문자 제거
                    cellValue = parseFloat(cellValue.replace(/[^\d.-]/g, '')) || 0;
                }

                switch (C) {
                    case 0: employee.tenure = cellValue; break;
                    case 1: employee.name = cellValue; break;
                    case 2: employee.departments = cellValue; break;
                    case 3: employee.position = cellValue; break;
                    case 4: employee.hrieDate = cellValue; break;
                    case 5: employee.moneyMaybe = cellValue; break;
                    case 6: employee.moneyGood = cellValue; break;
                    case 7: employee.moneyBye = cellValue; break;
                    case 8: employee.realMoney = cellValue; break;
                }
            }
            employees.push(employee);
        }
        updateEmployeeTable(employees);
    }




    $('#export-to-excel').on('click', function () {
        var tableElement = document.getElementById('tableBody');
        console.log('tableElement : ' + tableElement);
        shiftTableDataLeft(tableElement);

        var workbook = XLSX.utils.book_new();
        var worksheet = XLSX.utils.table_to_sheet(tableElement);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        var today = new Date();
        var dateString = today.toISOString().slice(0, 10);
        var fileName = `${dateString}_상여대장.xlsx`;

        XLSX.writeFile(workbook, fileName);
        // 즉시 페이지 새로고침
        window.location.reload();
    });

    // 테이블 데이터를 왼쪽으로 한 칸씩 이동시키는 함수
    function shiftTableDataLeft(table) {
        for (let row of table.rows) {
            let cells = Array.from(row.cells);
            let firstCell = cells.shift(); // 첫 번째 셀을 제거
            row.appendChild(firstCell); // 첫 번째 셀을 맨 끝으로 이동
        }
    }


    // 자동완성 기능
    $('#departments').on('input', function () {

        const input = $(this).val().toLowerCase();
        const resultsContainer = $('#autocomplete-results');
        resultsContainer.empty();

        if (input) {
            // 이름 필드에서 입력값을 포함하는 사원을 필터링
            const filteredData = allEmployees.filter(employee => employee.name.toLowerCase().includes(input));
            if (filteredData.length) {
                filteredData.forEach(employee => {
                    resultsContainer.append(`<div class="autocomplete-item">${employee.name}</div>`);
                });
                resultsContainer.show();
            } else {
                resultsContainer.hide();
            }
        } else {
            resultsContainer.hide();
        }
    });

    // 자동완성 항목 선택 이벤트 처리
    $('#autocomplete-results').on('click', '.autocomplete-item', function () {
        $('#departments').val($(this).text());
        $('#autocomplete-results').empty().hide();
    });

    // 조회 버튼 클릭 이벤트
    $('.btn-search').on('click', function () {
        var searchQuery = $('#departments').val().toLowerCase();
        var filteredEmployees = allEmployees.filter(employee => employee.name.toLowerCase().includes(searchQuery));
        updateEmployeeTable(filteredEmployees);
    });



});
