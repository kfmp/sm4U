class CommonNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css"
      integrity="sha512-dPXYcDub/aeb08c63jRq/k6GaKccl256JQy/AnOq7CAnEZ9FzSL9wSbcZkMp4R26vBsMLFYH4kQ67/bbV8XaCQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
      <link rel="stylesheet" href="/src/components/common/common.css">
      <div class="common-container">
        <!-- 공통 네비게이션 -->
        <div class="common-nav">
          <!-- 로고 -->
          <div class="common-nav-logo">
            <div class="common-logo"></div>
          </div>
          <!-- 시스템 시간 -->
          <div class="common-nav-clock">
            <h1 id="clock"></h1>
            <span id="custom-date">2024-07-23(화)</span>
          </div>
          <!-- 네비게이션 바 -->
          <ul class="nav flex-column" id="nav-event">
            <li class="nav-item common-nav-item common-nav__active" data-path="/src/pages/home/home.html">
              <span><i class="bi bi-house"></i></span>
              <a class="common-nav-link" aria-current="page" href="#">홈</a>
            </li>
            <li class="nav-item common-nav-item" data-path="/src/pages/salary-management/salary-management-foreach.html">
              <span><i class="bi bi-coin"></i></span>
              <a class="common-nav-link" href="#">사원별 급여 관리</a>
            </li>
            <li class="nav-item common-nav-item" data-path="/src/pages/salary-management/working-time-management.html">
              <span><i class="bi bi-alarm-fill"></i></span>
              <a class="common-nav-link" href="#">근무 시간 관리</a>
            </li>
            <li class="nav-item common-nav-item" data-path="/src/pages/pay-document/paydocument.html">
              <span><i class="bi bi-pencil-square"></i></span>
              <a class="common-nav-link" aria-current="page" href="#">급여 대장</a>
            </li>
            <li class="nav-item common-nav-item">
              <span><i class="bi bi-pencil-square"></i></span> <a class="common-nav-link" aria-current="page" href="/src/pages/salary-management/bonusesDocument.html">상여 대장</a>
            </li>
            <li class="nav-item common-nav-item" data-path="/src/pages/salary_setting/salary_setting.html">
              <span><i class="bi bi-wrench-adjustable"></i></span>
              <a class="common-nav-link" aria-current="page" href="#">급여 관리 설정</a>
            </li>
            <!-- 추가적인 네비게이션 항목 -->
          </ul>
          <!-- 로그아웃 -->
          <div class="common-logout">
            <div class="btn btn-warning">로그아웃</div>
          </div>
        </div>
        <!-- 공통 헤더 -->
        <div class="common-header">
          <div class="common-header__wrap">
            <span><i class="bi bi-gear"></i></span>
            <span><i class="bi bi-bell"></i></span>
            <div class="common-profile"></div>
          </div>
        </div>
      </div>
    `;
    this.setAttribute('rel', '');
  }

  connectedCallback() {
    const profileImg = JSON.parse(localStorage.getItem('profile'));
    $(this.shadowRoot.querySelector('.common-profile')).css(
      'background-image',
      `url(${profileImg})`
    );

    this.timer = setInterval(() => this.updateClock(), 1);
    this.updateDate(); // 날짜 초기화

    $(this.shadowRoot.querySelector('.common-logout')).on('click', function () {
      localStorage.clear();
      $(location).attr('href', '/src/pages/login/login.html');
    });

    // 네비게이션
    $(this.shadowRoot.querySelector('#nav-event')).on(
      'click',
      'li',
      function () {
        const path = $(this).attr('data-path');

        localStorage.setItem('activeNav', path);

        $(location).attr('href', path);
      }
    );

    const activeNav = localStorage.getItem('activeNav');
    if (activeNav) {
      this.shadowRoot.querySelectorAll('#nav-event li').forEach((li) => {
        if ($(li).attr('data-path') === activeNav) {
          $(li).addClass('common-nav__active');
        } else {
          $(li).removeClass('common-nav__active');
        }
      });
    }
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    this.shadowRoot.querySelector('#clock').innerText = `${h}:${m}:${s}`;
  }

  updateDate() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
    };
    const formattedDate = now.toLocaleDateString('ko-KR', options);
    this.shadowRoot.querySelector('#custom-date').innerText = formattedDate;
  }
}

class CommonHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/src/components/common/common.css">
      <div class="common-header">
        <div class="common-header__wrap">
          <span><i class="bi bi-gear"></i></span>
          <span><i class="bi bi-bell"></i></span>
          <div class="profile"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('common-nav', CommonNav);
customElements.define('common-header', CommonHeader);
