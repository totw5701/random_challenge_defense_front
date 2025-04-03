<template>
  <div class="challenge-history-page">
    <header>
      <button class="back-btn" @click="goBack">&lt;</button>
      <h2>챌린지 이력</h2>
    </header>

    <section v-if="challengeHistory.length === 0" class="empty">
      아직 성공한 챌린지가 없습니다.
    </section>

    <section class="history-list">
      <div
        v-for="(item, index) in displayHistory"
        :key="index"
        class="history-item"
        @click="showMemo(item)"
      >
        <h4>{{ item.title }}</h4>
        <p>성공일: {{ item.successDate }}</p>
      </div>
    </section>

    <button 
      v-if="canLoadMore" 
      class="load-more" 
      @click="loadMore"
    >
      더 보기
    </button>

    <!-- 메모 팝업 -->
    <div v-if="selectedMemo" class="modal-overlay" @click.self="closeMemo">
      <div class="modal-content">
        <h3>메모 내용</h3>
        <p>{{ selectedMemo }}</p>
        <button @click="closeMemo">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ChallengeHistory',
  data() {
    return {
      page: 1,
      pageSize: 5,
      selectedMemo: null
    }
  },
  computed: {
    ...mapState(['challengeHistory']),
    displayHistory() {
      // 무한 스크롤/페이지네이션 예시: page * pageSize 만큼만 표시
      return this.challengeHistory.slice(0, this.page * this.pageSize)
    },
    canLoadMore() {
      return (this.page * this.pageSize) < this.challengeHistory.length
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    loadMore() {
      this.page++
    },
    showMemo(item) {
      if (item.memo) {
        this.selectedMemo = item.memo
      } else {
        this.selectedMemo = "메모가 없습니다."
      }
    },
    closeMemo() {
      this.selectedMemo = null
    }
  }
}
</script>

<style scoped>
.challenge-history-page {
  min-height: 100vh;
  background: #ffffff;
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

.empty {
  margin-top: 2rem;
  text-align: center;
  color: #999;
}

.history-list {
  flex: 1;
  padding: 0 1rem;
  overflow-y: auto;
}

.history-item {
  background-color: #f9f9f9;
  margin: 0.5rem 0;
  padding: 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.history-item:hover {
  background-color: #eee;
}

.load-more {
  margin: 1rem auto;
  display: block;
  padding: 0.5rem 1rem;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  width: 80%;
  max-width: 300px;
}
</style>