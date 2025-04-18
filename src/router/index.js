import Vue from 'vue'
import Router from 'vue-router'

// 페이지 컴포넌트 import
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import ChallengePage from '@/pages/ChallengePage.vue'
import OngoingChallenges from '@/pages/OngoingChallenges.vue'
import ChallengeHistory from '@/pages/ChallengeHistory.vue'
import MyPage from '@/pages/MyPage.vue'
import KakaoCallBack from '@/pages/KakaoCallBack'

Vue.use(Router)

const router = new Router({
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
    },
    {
      path: '/kakao-callback',
      name: 'KakaoCallback',
      component: KakaoCallBack
    }
  ]
})

const authRequiredPaths = [
  '/main',
  '/challenge',
  '/ongoing',
  '/history',
  '/mypage'
]

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('jwt-atk')

  if (authRequiredPaths.includes(to.path) && !isLoggedIn) {
    alert('로그인이 필요합니다.')
    next('/login')
  } else {
    next()
  }
})

export default router