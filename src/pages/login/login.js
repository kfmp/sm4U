$(function () {
  $('form').submit(function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    $.ajax({
      url: '/json/user.json',
      type: 'get',
      success: function (data) {
        const userId = $('input[name="userId"]').val();
        const userPw = $('input[name="userPw"]').val();

        const user = data.find(
          (user) => user.userId === userId && user.userPw === userPw
        );

        if (user) {
          $(location).attr('href', '/src/pages/home/home.html');
        } else {
          $('#error-message').text('비밀번호가 틀렸습니다.').show();
        }
      },
      error: function (xhr, status, error) {
        console.error('Error: ' + error);
      },
    });
  });
});
