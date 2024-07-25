let tag = '[login]: ';

$(function () {
  $('form').submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: 'get',
      url: '/json/user.json',
      dataType: 'json',
      success: function (data) {
        const userId = $('input[name="userId"]').val();
        const userPw = $('input[name="userPw"]').val();

        const user = data.find(
          (user) => user.userId === userId && user.userPw === userPw
        );

        if (user) {
          const { profileImg } = user;
          localStorage.setItem('profile', JSON.stringify(profileImg));
          $(location).attr('href', '/src/pages/home/home.html');
        } else {
          $('#error-message').text('비밀번호가 틀렸습니다.').show();
        }
      },
      error: function (xhr, status, error) {
        console.error(tag + error);
      },
    });
  });
});
