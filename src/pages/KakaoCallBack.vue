<template>
  <div>로그인 처리중입니다...</div>
</template>

<script>
import axios from '@/api/axios'

export default {
  mounted() {
    this.kakaoCallback();
  },
  methods: {
    async kakaoCallback() {
      try {
        const code = this.$route.query.code;
        if (!code) {
          alert("카카오 로그인 인가 코드가 없습니다.");
          return;
        }

        const res = await axios.get(`http://localhost:9090/member/kakao/callback?code=${code}`);
        console.log('res', res)
        if (res.data.data.accessToken) {
          localStorage.setItem('jwt-atk', res.data.data.accessToken);
          localStorage.setItem('jwt-rfk', res.data.data.refreshToken);
          this.$router.push('/main');
        } else {
          alert('로그인 실패: 토큰이 없습니다.');
        }
      } catch (err) {
        console.error(err);
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  }
}
</script>

<style>

</style>