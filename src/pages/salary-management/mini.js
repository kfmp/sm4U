$(function () {
    // 검색 입력 필드 이벤트 핸들러
    $('.form-control').on('input', function () {
        var searchValue = $(this).val().toLowerCase(); // 입력 값 가져오기

        // 모든 트리 항목을 숨기고, 검색어와 일치하는 항목만 표시
        $('.tree li').each(function () {
            var labelText = $(this).text().toLowerCase(); // 레이블 텍스트
            if (labelText.includes(searchValue)) {
                $(this).show(); // 일치하는 항목 표시
                $(this).parents('li').show(); // 모든 상위 항목 표시
                $(this).children('ul').show(); // 해당 항목의 자식도 표시 (하위 구조를 완전히 보여줌)
                $(this).parents('ul').show(); // 모든 상위 ul 표시
                $(this).parents('li').children('input').prop('checked', true); // 상위 체크박스 체크
            } else {
                $(this).hide(); // 일치하지 않는 항목 숨김
            }
        });
    });
})