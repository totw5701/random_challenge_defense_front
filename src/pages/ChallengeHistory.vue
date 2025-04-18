<template>
  <div class="challenge-history-page">
    <!-- 상단 헤더(네이비) -->
    <header class="header-area">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <div><i class="fas fa-chevron-left icon-color"></i></div>
        </button>
        <div class="title-area">
          <div><i class="fas fa-medal fa-lg icon-color"></i></div>
          <div><h2 class="title-text">챌린지 이력</h2></div>
        </div>
        <div></div>
      </div>
    </header>

    <!-- 아직 이력이 없을 때 -->
    <section v-if="challengeHistory.length === 0" class="empty">
      아직 성공한 챌린지가 없습니다.
    </section>

    <!-- 이력 목록 -->
    <section class="history-list">
      <div
        v-for="(item, index) in displayHistory"
        :key="index"
        class="history-card"
      >
        <!-- 카드 헤더 (네이비 영역) -->
        <div class="card-header">
          <div class="title-and-arrow" @click="toggleExpand(index)"> 
            <h4 class="card-title">{{ item.challengeCard.title }}</h4>
            <div class="arrow-icon">
              <!-- 위/아래 화살표 -->
              <i v-if="expandedIndex === index" class="fas fa-chevron-up"></i>
              <i v-else class="fas fa-chevron-down"></i>
            </div>
          </div>
          <!-- (펼친 상태에서만 desc를 네이비 영역에 표시) -->
          <transition name="slide-fade">
            <p 
              v-if="expandedIndex === index && item.challengeCard.description"
              class="card-desc"
            >
              {{ item.challengeCard.description }}
            </p>
          </transition>

          <div class="card-body" @click="openMemoModal(item.memo)"> 
            <p class="success-date">
              성공일: {{ formatDateTime(item.endDtm) }}
            </p>
            <div class="tags-row" v-if="item.tags && item.tags.length">
              <span 
                v-for="tag in item.tags" 
                :key="tag.id" 
                class="tag-item"
              >
                #{{ tag.name }}
              </span>
            </div>
          </div>
        </div>

        
      </div>
    </section>

    <!-- 더보기 버튼 (무한 스크롤 대용) -->
    <button 
      v-if="canLoadMore" 
      class="load-more" 
      @click="loadMore"
    >
      더 보기
    </button>

    <!-- 메모 보기 모달 -->
    <div v-if="showMemoModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-title-box">
          <span class="modal-title">도전 메모</span>
          <span @click="closeMemoModal"><i class="fas fa-times"></i></span>
        </div>
        <div>
          <p class="memo-content">{{ currentMemoText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'ChallengeHistory',
  data() {
    return {
      page: 1,
      pageSize: 5,
      // (NEW) 펼쳐진 카드 index
      expandedIndex: null,
      challengeHistory: [],
      showMemoModal: false,
      currentMemoText: '',
    }
  },
  computed: {
    // 페이지네이션: page * pageSize 만큼만 표시
    displayHistory() {
      return this.challengeHistory;
    },
    canLoadMore() {
      return (this.page * this.pageSize) < this.challengeHistory.length
    }
  },
  created() {
    this.fetchChallengeHistorys(); 
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    openMemoModal(memo) {
      this.currentMemoText = memo || '(작성된 메모가 없습니다)';
      this.showMemoModal = true;
    },
    closeMemoModal() {
      this.showMemoModal = false;
      this.currentMemoText = '';
    },
    async fetchChallengeHistorys() {
      try{
        const res = await axios.get('http://localhost:9090/challenge-log/history/' + (this.page - 1));
        if(res.data.code !== '0000') {
          alert(res.data.code + ': ' + res.data.msg)
          return;
        }
        console.log(res.data.data);
        this.challengeHistory = this.challengeHistory.concat(res.data.data.contents);
      } catch (err) {
        console.log(err);
        alert("오류가 발생하였습니다.");
      }
    },
    formatDateTime(str) {
      if (!str || str.length !== 14) return str; // 예외 처리

      const year = str.substr(0, 4);
      const month = str.substr(4, 2);
      const day = str.substr(6, 2);
      const hour = str.substr(8, 2);
      const minute = str.substr(10, 2);
      const second = str.substr(12, 2);

      return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    },
    loadMore() {
      this.page++;
      this.fetchChallengeHistorys();
    },
    // (NEW) 접힘/펼침 토글
    toggleExpand(index) {
      if (this.expandedIndex === index) {
        this.expandedIndex = null
      } else {
        this.expandedIndex = index
      }
    }
  }
}
</script>

<style scoped>
/* 전체 페이지 배경: 연한 하늘색 */
.challenge-history-page {
  height: 100vh;
  background-color: #E5F0F8;
  display: flex;
  flex-direction: column;
}

/* 상단 헤더(네이비) */
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

/* 이력이 없을 때 */
.empty {
  margin-top: 2rem;
  text-align: center;
  color: #999;
}

/* 이력 리스트 */
.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* (CHANGED) 각 카드: 상단 네이비 영역 + 하단 흰 영역 */
.history-card {
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden; /* 둥근 모서리 효과 */
  background-color: #003049; /* 카드 상단(헤더) 네이비 */
}

/* 카드 헤더 클릭 영역 */
.card-header {
  padding: 0.25rem;
  color: #fff;
  cursor: pointer;
}
.title-and-arrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 15px;
}
.card-title {
  padding: 10px;
  padding-left: 15px;
  font-size: 1.3rem;
  margin: 0;
  font-weight: bold;
}
.card-desc {
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 0.5rem;
  line-height: 1.4;
  font-weight: bolder;
}
.card-body {
  background-color: #fff;
  padding: 10px;
  color: #333;
  background-color: white;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-top: 8px;
}
.success-date {
  padding-left: 10px;
  font-weight: bolder;
}
.tags-row {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  padding: 0px 10px;
}
.tag-item {
  background-color: #FFB703;
  color: #003049;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: bolder;
}

/* 더보기 버튼 */
.load-more {
  margin: 1rem auto;
  display: block;
  padding: 0.5rem 1rem;
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 펼침/접힘 트랜지션 */
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

/* 메모 */
.memo-content {
  white-space: pre-line;
  color: #003049;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-top: 10px;
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
</style>
