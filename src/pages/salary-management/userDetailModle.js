$(function () {
    // 'change' 이벤트에 대해 .on() 메서드 사용
    $('#optSelect').on('change', function () {
        var selectedOption = $(this).find('option:selected').text();
        if (selectedOption === '예') {
            $('#selectBox').prop('disabled', false).show(); // 선택 가능하게 만듬
        } else {
            $('.SumoSelect > p').attr('title', '');
            $('.SumoSelect > p > span').text('선택해주세요.');
            $('.SumoSelect > p > span').css({
                'background-color': 'transparent',
            });

            $('#selectBox')
                .prop('disabled', true)
                .find('option')
                .prop('selected', false); // 비활성화하고 모든 옵션의 선택을 해제

            $('#selectBox').hide(); // 선택박스를 숨깁
        }
    });

    $('.CaptionCont .SelectBox .form-select .search').css({
        'border-radius': '4px',
        'height': '40.56px',
        'border': '1px solid #dee2e6',
    });

    // 페이지 로딩 시 초기 상태를 설정
    $('#optSelect').trigger('change');

    $('#selectBox').SumoSelect({
        placeholder: '선택해주세요.', // 옵션 설정
        search: true, // 검색 기능 활성화
        captionFormatAllSelected: '{0}', // 모든 옵션을 선택했을 때 각 옵션을 순서대로 나열
        okCancelInMulti: true, // 다중 선택 모드에서 OK/Cancel 버튼 활성화
        selectAll: true, // 전체 선택 기능 활성화
        locale: ['OK', 'Cancel', '전체 선택', 'Clear all'],
        csvDispCount: 4, // 선택된 항목의 수가 이 값보다 많을 경우, 순서대로 나열하여 보여줌
        captionFormat: '{0}', // 선택된 항목을 순서대로 나열하여 보여주는 형식
        noMatch: '{0}과 일치하는 내용이 없습니다.',
    });

    // 동적으로 CSS 추가
    $('.SumoSelect > .CaptionCont > label > i').css({
        'background-image': 'none', // 화살표 이미지 제거
        'background-color': 'transparent', // 배경색 투명 처리
    });

    $('.SumoSelect>.CaptionCont>span.placeholder').css({
        'background-color': 'transparent', // 배경색 투명 처리
    });

    $('.SumoSelect .select-all').css({
        height: '40px',
    });
});