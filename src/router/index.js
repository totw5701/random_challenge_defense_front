import Vue from 'vue'
import Router from 'vue-router'

// 페이지 컴포넌트 import
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import ChallengePage from '@/pages/ChallengePage.vue'
import OngoingChallenges from '@/pages/OngoingChallenges.vue'
import ChallengeHistory from '@/pages/ChallengeHistory.vue'
import MyPage from '@/pages/MyPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history', // 혹은 'hash'
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/main',
      name: 'Main',
      component: MainPage
    },
    {
      path: '/challenge',
      name: 'Challenge',
      component: ChallengePage
    },
    {
      path: '/ongoing',
      name: 'OngoingChallenges',
      component: OngoingChallenges
    },
    {
      path: '/history',
      name: 'ChallengeHistory',
      component: ChallengeHistory
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage
    }
  ]
})