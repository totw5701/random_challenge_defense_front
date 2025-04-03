// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 예시용 더미 미션 데이터 (난이도별)
    challenges: [
      {
        id: 'c1',
        title: '5분간 산책하기',
        desc: '가볍게 걷고 오기',
        tags: ['outdoor', 'diff1']
      },
      {
        id: 'c2',
        title: '20분 이하 런닝',
        desc: '가볍게 뛰어보기',
        tags: ['outdoor', 'diff1']
      },
      {
        id: 'c3',
        title: '하루 물 2L 마시기',
        desc: '건강을 위해 충분한 수분 섭취',
        tags: ['health', 'diff1']
      },
      {
        id: 'c4',
        title: '명상하기',
        desc: '건강을 위해 잠시 쉬어가세요요',
        tags: ['short-time', 'diff1']
      },
      {
        id: 'c5',
        title: '최신 유행 틱톡 댄스 배워 춤추기',
        desc: '최신 유행하는 틱톡 댄스를 배워 신나게 춤춰보세요.',
        tags: ['health', 'diff1']
      },
      // ... 필요하면 더 추가
    ],
    tags: [
      // (난이도 태그) 1 ~ 5
      {
        id: 'diff1',
        name: '난이도1',
        category: '난이도', // (CHANGED)
        level: 1           // (CHANGED)
      },
      {
        id: 'diff2',
        name: '난이도2',
        category: '난이도',
        level: 2
      },
      {
        id: 'diff3',
        name: '난이도3',
        category: '난이도',
        level: 3
      },
      {
        id: 'diff4',
        name: '난이도4',
        category: '난이도',
        level: 4
      },
      {
        id: 'diff5',
        name: '난이도5',
        category: '난이도',
        level: 5
      },

      // (일반 태그) category: "일반"
      {
        id: 'outdoor',
        name: '야외활동',
        category: '일반' // (CHANGED)
      },
      {
        id: 'health',
        name: '건강',
        category: '일반'
      },
      {
        id: 'short-time',
        name: '짧은 시간',
        category: '일반'
      }
      // ... 필요하면 더 추가
    ],
    ongoingChallenges: [
      {
        id: 'c4',
        title: '명상하기',
        desc: '건강을 위해 잠시 쉬어가세요요',
        tags: ['mind', 'water-intake']
      },
      {
        id: 'c2',
        title: '20분 이하 런닝',
        desc: '가볍게 뛰어보기',
        tags: ['outdoor', 'running']
      },
  ],
    challengeHistory: [
      {
        id: 'c4',
        title: '명상하기',
        desc: '건강을 위해 잠시 쉬어가세요요',
        tags: ['mind', 'water-intake']
      },
      {
        id: 'c2',
        title: '20분 이하 런닝',
        desc: '가볍게 뛰어보기',
        tags: ['outdoor', 'running']
      },
    ]
  },
  mutations: {
    ADD_ONGOING_CHALLENGE(state, challenge) {
      state.ongoingChallenges.push(challenge)
    },
    REMOVE_ONGOING_CHALLENGE(state, challengeIndex) {
      state.ongoingChallenges.splice(challengeIndex, 1)
    },
    ADD_HISTORY(state, payload) {
      // payload = {challenge, memo, date}
      state.challengeHistory.unshift({
        ...payload.challenge,
        memo: payload.memo,
        successDate: payload.date
      })
    }
  },
  actions: {
    addOngoingChallenge({ state, commit }, challenge) {
      console.log("addOngoingChallenge", challenge)
      // 최대 5개 제한 체크
      if (state.ongoingChallenges.length >= 5) {
        // 실제로는 에러 처리나 모달 표시 로직(프론트)에서 처리
        alert("5개 이상 도전할 수 없습니다.")
        return
      }
      commit('ADD_ONGOING_CHALLENGE', challenge)
    },
    removeOngoingChallenge({ commit }, challengeIndex) {
      commit('REMOVE_ONGOING_CHALLENGE', challengeIndex)
    },
    addHistory({ commit }, payload) {
      commit('ADD_HISTORY', payload)
    }
  },
  getters: {
    /*
      (EXAMPLE) getRandomChallengeByTags:
      유저가 선택한 태그들(selectedTagIds)에 해당되는 챌린지 중 랜덤으로 1개
      - "난이도" 태그가 섞여 있어도 동일하게 필터링
    */
    getRandomChallengeByTags: (state) => (selectedTags) => {
      // 태그 미선택시 전체
      if (!selectedTags || selectedTags.length === 0) {
        if (state.challenges.length === 0) return null
        const randIndex = Math.floor(Math.random() * state.challenges.length)
        return state.challenges[randIndex]
      }
      const filtered = state.challenges.filter(ch => {
        return selectedTags.every(t => ch.tags.includes(t))
      })
      if (filtered.length === 0) return null
      const randIndex = Math.floor(Math.random() * filtered.length)
      return filtered[randIndex]
    }
  }
})
