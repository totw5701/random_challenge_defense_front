<template>
  <div class="my-page">
    <header>
      <button class="back-btn" @click="goBack">&lt;</button>
      <h2>마이페이지</h2>
    </header>

    <section class="menu-list">
      <div class="menu-item" @click="logout">로그아웃</div>
      <div class="menu-item" @click="withdrawUser">회원탈퇴</div>
      <div class="menu-item" @click="showTos">이용 약관</div>
      <div class="menu-item" @click="showPrivacy">개인정보처리방침</div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MyPage',
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    logout() {
      // 실제 로그아웃 로직
      alert('로그아웃 되었습니다. (예시)')
      this.$router.push('/login')
    },
    withdrawUser() {
      // 실제 회원탈퇴 로직
      const ok = confirm('정말 회원탈퇴 하시겠습니까?')
      if (ok) {
        alert('회원탈퇴가 완료되었습니다. (예시)')
        this.$router.push('/login')
      }
    },
    showTos() {
      // 이용약관 페이지 이동 또는 모달 표시
      alert('이용 약관 (예시)')
    },
    showPrivacy() {
      // 개인정보처리방침 페이지 이동 또는 모달 표시
      alert('개인정보처리방침 (예시)')
    }
  }
}
</script>

<style scoped>
.my-page {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.back-btn {
  margin-right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.menu-list {
  margin-top: 1rem;
}

.menu-item {
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.menu-item:hover {
  background-color: #f9f9f9;
}
</style>