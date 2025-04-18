<template>
  <div class="main-container">
    <!-- 상단 헤더(네이비), 둥근 하단 -->
    <div class="main-header">

      <div class="hamburger-wrapper">                       <!-- NEW -->
        <button class="hamburger-btn" @click="toggleMenu">  <!-- NEW -->
          <i class="fas fa-bars"></i>
        </button>

        <!-- 드롭다운: 로그아웃 ------------------------------------------>
        <transition name="fade">                            <!-- NEW -->
          <div
            v-if="showMenu"
            class="logout-dropdown"
            @click="logout"
          >
            로그아웃
          </div>
        </transition>
      </div>                                                <!-- NEW -->

      <!-- 로고 원 -->
      <div class="header-logo-circle">
        <img src="@/assets/rcd-logo.png" alt="R 로고" class="header-logo-img" />
      </div>
    </div>

    <!-- 가운데 영역(노란색) -->
    <div class="main-content">
      <!-- 버튼 3개 -->
      <div class="menu-button" @click="goToChallenge">
        <div class="icon-box">
          <span><i class="fas fa-dice-three fa-2x icon-color"></i></span>
        </div>
        <span class="button-label">챌린지 도전</span>
      </div>

      <div class="menu-button" @click="goToOngoing">
        <div class="icon-box">
          <span><i class="fas fa-dumbbell fa-2x icon-color"></i></span>
        </div>
        <span class="button-label">도전중인 챌린지</span>
      </div>

      <div class="menu-button" @click="goToHistory">
        <div class="icon-box">
          <span><i class="fas fa-medal fa-2x icon-color"></i></span>
        </div>
        <span class="button-label">챌린지 이력 조회</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      showMenu: false        /* NEW: 햄버거 메뉴 열림/닫힘 상태 */
    }
  },
  methods: {
    goToChallenge() {
      this.$router.push('/challenge')
    },
    goToOngoing() {
      this.$router.push('/ongoing')
    },
    goToHistory() {
      this.$router.push('/history')
    },
    toggleMenu() {              /* NEW */
      this.showMenu = !this.showMenu
    },
    logout() {                  /* NEW */
      // 실제 로그아웃 로직(API, auth 등)을 연결하세요
      alert('로그아웃 되었습니다.')
      this.showMenu = false
      localStorage.removeItem('jwt-ack')
      localStorage.removeItem('jwt-rfk')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

/* 메인 화면 컨테이너 */
.main-container {
  width: 100%;
  height: 100vh;
  background-color: #ddeff7;
  display: flex;
  flex-direction: column;
}

/* 상단 헤더 (네이비) 영역 */
.main-header {
  width: 100%;
  height: 100px;
  background-color: #003049; 
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 1rem;
  padding-top: 1rem;
}

/* (NEW) 햄버거 & 드롭다운 ---------------------------------------- */
.hamburger-wrapper {
  position: absolute;
  top: 12px;
  left: 12px;
}
.hamburger-btn {
  background: #003049;
  width: 46px;
  height: 46px;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logout-dropdown {
  margin-top: 6px;
  background: #ffffff;
  border: 2px solid #006d8f;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  color: #006d8f;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

/* fade 트랜지션 (간단) */
.fade-enter-active,
.fade-leave-active { transition: opacity .2s }
.fade-enter,
.fade-leave-to { opacity: 0 }

/* 헤더 로고 원형 영역 */
.header-logo-circle {
  width: 100px;
  height: 100px;
  background-color: #fff;
  border-radius: 50%;
  border: 5px solid transparent;
  border-top-color: #ddeff7;
  border-left-color: #ddeff7;
  border-bottom-color: #003049;
  border-right-color: #003049;;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
  
  position: relative;
  top: 70px;
}

/* 로고 이미지 */
.header-logo-img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  transform: rotate(-45deg);
}

/* 아래쪽 메인 컨텐츠 */
.main-content {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-top: 2rem;
}

/* 메뉴 버튼 스타일 */
.menu-button {
  margin-bottom: 15px;
  width: 80%;
  max-width: 300px;
  height: 75px;
  background-color: #ffffff;
  border-radius: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 4px solid #023047; 
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
}

/* 왼쪽 아이콘 박스 (네이비 배경) */
.icon-box {
  width: 85px;
  height: 105%;
  background-color: #023047; 
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

/* 아이콘 이미지 */
.icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* 버튼 레이블 (오른쪽) */
.button-label {
  flex: 1;
  margin-left: 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.icon-color {
  color: white;
}
</style>