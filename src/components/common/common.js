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
          <div class="nav-logo">
            <div class="logo"></div>
          </div>
          <!-- 시스템 시간 -->
          <div class="nav-clock">
            <h1 id="clock">16:28:30</h1>
            <span>2024-07-23(화)</span>
          </div>
          <!-- 네비게이션 바 -->
          <ul class="nav flex-column">
            <li class="nav-item nav-item__active">
              <span><i class="bi bi-house"></i></span>
              <a class="nav-link" aria-current="page" href="#">홈</a>
            </li>
            <li class="nav-item">
              <span><i class="bi bi-coin"></i></span>
              <a class="nav-link" href="#">사원별 급여 관리</a>
            </li>
            <li class="nav-item">
              <span><i class="bi bi-alarm-fill"></i></span>
              <a class="nav-link" href="#">근무 시간 관리</a>
            </li>
            <li class="nav-item">
              <span><i class="bi bi-pencil-square"></i></span>
              <a class="nav-link" aria-current="page" href="#">급여 대장</a>
            </li>
            <li class="nav-item">
              <span><i class="bi bi-pencil-square"></i></span>
              <a class="nav-link" aria-current="page" href="#">상여 대장</a>
            </li>
            <li class="nav-item">
              <span><i class="bi bi-wrench-adjustable"></i></span>
              <a class="nav-link" aria-current="page" href="#">급여 관리 설정</a>
            </li>
            <!-- 추가적인 네비게이션 항목 -->
          </ul>
          <!-- 로그아웃 -->
          <div class="logout">
            <div class="btn btn-warning">로그아웃</div>
          </div>
        </div>
        <!-- 공통 헤더 -->
        <div class="common-header">
          <div class="common-header__wrap">
            <span><i class="bi bi-gear"></i></span>
            <span><i class="bi bi-bell"></i></span>
            <div class="profile"></div>
          </div>
        </div>
      </div>
    `;
    this.setAttribute('rel', '');
  }

  connectedCallback() {
    this.timer = setInterval(() => this.updateClock(), 1000);
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
