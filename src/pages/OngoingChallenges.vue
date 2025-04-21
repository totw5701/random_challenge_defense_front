<template>
  <div class="ongoing-challenges-page">
    <!-- 상단 헤더 -->
    <header class="header-area">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <div><i class="fas fa-chevron-left icon-color"></i></div>
        </button>
        <div class="title-area">
          <div><i class="fas fa-dumbbell fa-2x icon-color"></i></div>
          <div><h2 class="title-text">도전중인 챌린지</h2></div>
        </div>
        <div></div>
      </div>
    </header>

    <!-- 진행 중인 개수 안내 -->
    <div class="ongoing-info-box">
      현재 {{ ongoingChallenges.length }}/5개 챌린지 도전 중
    </div>

    <!-- 챌린지 리스트 -->
    <section class="challenge-list">
      <div 
        v-for="(challenge, index) in ongoingChallenges" 
        :key="challenge.id"
        class="challenge-card"
      >
        <!-- 상단 영역(네이비) 전체가 하나의 카드 -->
        <div class="card-header">
          <!-- 제목 + 펼침버튼 -->
          <div class="header-top" @click="toggleExpand(index)">
            <span class="card-title">{{ challenge.challengeCard.title }}</span>
            <div class="toggle-icon">
              <i v-if="expandedIndex === index" class="fas fa-chevron-up"></i>
              <i v-else class="fas fa-chevron-down"></i>
            </div>
          </div>

          <!-- (NEW) 펼침/접힘 되는 '설명' 영역 -->
          <transition name="slide-fade">
            <div 
              v-if="expandedIndex === index"
              class="desc-area"
            >
              {{ challenge.challengeCard.description }}
            </div>
          </transition>
          
          <div class="card-body">
            <!-- 태그(항상 표시) -->
            <div class="tags-row">
              <span 
                v-for="tag in challenge.tags" 
                :key="tag.id" 
                class="tag-item"
              >
                #{{ tag.name }}
              </span>
            </div>

            <!-- 성공/포기 버튼 -->
            <div class="card-buttons">
              <button class="success-btn" @click="successChallenge(index)">성공</button>
              <button class="giveup-btn" @click="giveUpChallenge(index)">포기</button>
            </div>

          </div>
        </div>
      </div>

      <!-- 챌린지가 없을 때 안내 -->
      <div v-if="ongoingChallenges.length === 0" class="empty">
        아직 도전중인 챌린지가 없습니다. <br/>
        지금 바로 챌린지 도전해보세요!
      </div>
    </section>

    <!-- 성공 모달 -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-title-box">
          <span class="modal-title">축하합니다! 챌린지 성공!</span>
          <span @click="closeSuvvessModal"><i class="fas fa-times"></i></span>
        </div>
        <div>
          <span class="modal-subtitle">간단 메모를 남겨주세요 (선택)</span>
        </div>
        <hr class="modal-cross-line">
        <textarea class="modal-textarea" v-model="memoText" rows="3"></textarea>
        <div class="modal-actions">
          <button @click="saveMemo">메모 저장</button>
        </div>
      </div>
    </div>

    <!-- 포기 확인 모달 -->
    <div v-if="showGiveUpModal" class="modal-overlay">
      <div class="modal-content giveup-modal">
        <h3 class="confirm-text">정말 포기하시겠습니까?</h3>
        <div class="modal-icons">
          <div class="modal-ox-box" @click="confirmGiveUp"><i class="fas fa-check"></i></div>
          <div class="modal-ox-box" @click="cancelGiveUp"><i class="fas fa-times"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import api from '@/api/axios'

export default {
  name: 'OngoingChallenges',
  data() {
    return {
      showSuccessModal: false,
      showGiveUpModal: false,
      currentChallengeIndex: null,
      memoText: '',
      expandedIndex: null, // (NEW) 현재 펼쳐진 카드 인덱스
      ongoingChallenges: [],
    }
  },
  created() {
    this.fetchOngoingChallengeLogs(); 
  },
  methods: {
    ...mapActions(['removeOngoingChallenge']),

    goBack() {
      this.$router.go(-1)
    },
    async fetchOngoingChallengeLogs() {
      try{
        const res = await api.get('/challenge-log/on-going');
        if(res.data.code !== '0000') {
          alert(res.data.code + ': ' + res.data.msg)
          return;
        }
        console.log(res.data.data);
        this.ongoingChallenges = res.data.data;
      } catch (err) {
        console.log(err);
        alert("오류가 발생하였습니다.");
      }
    },
    toggleExpand(index) {
      if (this.expandedIndex === index) {
        this.expandedIndex = null
      } else {
        this.expandedIndex = index
      }
    },
    closeSuvvessModal() {
      this.showSuccessModal = false;
    },
    successChallenge(index) {
      this.currentChallengeIndex = index
      this.showSuccessModal = true
    },
    giveUpChallenge(index) {
      this.currentChallengeIndex = index
      this.showGiveUpModal = true
    },
    async saveMemo() {
      const challenge = this.ongoingChallenges[this.currentChallengeIndex]
      try{
        const param = {
          challengeLogId: challenge.id,
          memo: this.memoText,
        }
        const res = await api.post('/challenge-log/success', param);
        if(res.data.code !== '0000') {
          alert(res.data.code + ': ' + res.data.msg)
          return;
        }
        this.ongoingChallenges.splice(this.currentChallengeIndex, 1)
        this.showSuccessModal = false
        this.currentChallengeIndex = null
        this.memoText = ''
      } catch (err) {
        console.log(err);
        alert("오류가 발생하였습니다.");
      }
    },
    async confirmGiveUp() {
      const challenge = this.ongoingChallenges[this.currentChallengeIndex]
      try{
        const param = {
          challengeLogId: challenge.id,
        }
        const res = await api.post('/challenge-log/skip', param);
        if(res.data.code !== '0000') {
          alert(res.data.code + ': ' + res.data.msg)
          return;
        }
        this.ongoingChallenges.splice(this.currentChallengeIndex, 1)
        this.showGiveUpModal = false
        this.currentChallengeIndex = null
      } catch (err) {
        console.log(err);
        alert("오류가 발생하였습니다.");
      }
    },
    cancelGiveUp() {
      this.showGiveUpModal = false
      this.currentChallengeIndex = null
    }
  }
}
</script>

<style scoped>
.ongoing-challenges-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ddeff7; 
}

/* 헤더 영역 */
.header-area {
  background-color: #003049;
  padding: 1rem;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
}
.header-content {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.back-btn {
  background: none;
  border: none;
  cursor: pointer;
}
.title-area {
  margin-top: 20px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.title-text {
  color: #fff;
  font-size: 1.6rem;
  font-weight: bolder;
  margin: 0;
}
.icon-color {
  color: white;
  font-size: 2.5rem;
}

/* 진행 중인 개수 안내 */
.ongoing-info-box {
  width: 80%;
  margin: 1rem auto 0 auto;
  padding: 0.5rem 1rem;
  background-color: white;
  color: #003049;
  border-radius: 10px;
  border: 3px solid #003049;
  font-size: 1.1rem;
  font-weight: bolder;
  display: flex;
  justify-content: center;
}

/* 챌린지 리스트 */
.challenge-list {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 모바일에서 부드러운 스크롤 */
}

/* 챌린지 카드(네이비 배경 유지) */
.challenge-card {
  background-color: #003049;
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
}

/* card-header: 상단 부분(펼침 포함) */
.card-header {
  padding: 0.25rem;
  color: #fff;
}
.header-top {
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.card-title {
  font-size: 1.3rem;
  font-weight: bold;
}
.toggle-icon {
  width: 24px;
  text-align: center;
}
.card-body {
  background-color: white;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 13px;
  margin-top: 8px;
}

/* 태그/버튼은 항상 표시(펼침 여부 상관 X) */
.tags-row {
  padding-right: 15px;
}
.tag-item {
  display: inline-block;
  margin-right: 0.5rem;
  background-color: #FFB703;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bolder;
  color: #555;
}

.card-buttons {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.success-btn,
.giveup-btn {
  min-width: 70px;
  padding: 0.2rem 0.4rem;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}
.success-btn {
  background-color: #FB8500;
}
.giveup-btn {
  background-color: #FB8500;
}

/* 펼쳐질 설명 영역(네이비 배경 아래쪽) */
.desc-area {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-top: 0.5rem;
  white-space: pre-line; /* 여러 줄 표시 등 고려시 */
}

/* 슬라이드/페이드 트랜지션 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-fade-enter,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  padding: 0;
  margin: 0;
}

/* 챌린지가 없을 때 안내 */
.empty {
  text-align: center;
  color: #555;
  margin-top: 2rem;
}

/* 모달(성공/포기) */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background-color: #fff;
  border-right: 5px solid #ddeff7;
  border-bottom: 5px solid #8ECAE6;
  border-radius: 12px;
  padding: 1.5rem;
  width: 80%;
  max-width: 300px;
}
.modal-title-box {
  display: flex;
  justify-content: space-between;
}
.modal-title {
  font-size: 20px;
  font-weight: bolder;
  color: #003049;
}
.modal-subtitle {
  font-size: 13px;
  font-weight: bolder;
  color: #003049;
}
.modal-cross-line {
  border: none;
  height: 2px;
  background-color: #8ECAE6;
  margin: 10px 0;
  width: 100%;
}
.modal-textarea {
  width: 295px;
  height: 100px;
  border-radius: 10px;
}
.modal-actions {
  margin-top: 1rem;
  text-align: right;
}
.modal-actions button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background-color: #FB8500;
  color: white;
  font-weight: bolder;
  border: none;

}
.modal-ox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 30px;
  background-color: #FB8500;
  border-radius: 5px;
}

/* 포기 모달 예시 */
.giveup-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.confirm-text {
  margin: 0;
  font-size: 1rem;
  text-align: center;
}
.modal-icons {
  display: flex;
  gap: 2rem;
  color: white;
}
</style>
