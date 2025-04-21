<template>
  <div class="login-container">

      <div class="login-top">
        <h1 class="app-title">랜덤챌린지디펜스</h1>
        <!-- 로고 원형 영역 -->
        <div class="logo-wrapper">
          <!-- 예: /assets/logo-r.png -->
          <img src="@/assets/rcd-logo.png" alt="R 로고" class="logo-image" />
        </div>
      </div>

      <div class="login-btn-container">
        <!-- 카카오 로그인 버튼 -->
        <div @click="loginWithKakao">
          <img src="@/assets/kakao_login_medium_narrow.png" alt="kakao-icon" class="kakao-btn"/> 
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'LoginPage',
  methods: {
    loginWithKakao() {
      // 실제 구현 시 소셜 로그인 API 연동
      const REST_API_KEY = '4be8f5a564408e4980f8039baf049fb7';
      const REDIRECT_URI = 'http://175.45.200.75:8080/kakao-callback';
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
      window.location.href = KAKAO_AUTH_URL;
    }
  }
}
</script>

<style scoped>

.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ddeff7;
}

/* 상단 (네이비 배경) */
.login-top {
  background-color: #023047;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  height: 75%;
}

/* 로고 원형 영역 */
.logo-wrapper {
  width: 200px;
  height: 200px;
  background-color: #fff;
  border-radius: 100%;
  border: 7px solid #ddeff7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

/* R 로고 이미지 크기 */
.logo-image {
  width: 130px;
  height: 130px;
  object-fit: contain;
}

/* 앱 타이틀 텍스트 */
.app-title {
  color: #fff;
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 30px;
}

.login-btn-container {
  margin-top: 40px;
  display: flex;
  align-content: center;
  justify-content: center;
}

/* 카카오 로그인 버튼 예시 */
.kakao-btn {
  width: 300px;
  height: 75px;
  border: 5px solid #023047;
  border-radius: 25px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
}

</style>