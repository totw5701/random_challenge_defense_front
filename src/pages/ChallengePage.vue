<template>
  <div class="challenge-page">
    <!-- 상단 헤더 (네이비 영역) -->
    <header class="header-area">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <div><i class="fas fa-chevron-left icon-color"></i></div>
        </button>
        <div class="title-area">
          <div><i class="fas fa-dice fa-2x icon-color"></i></div>
          <div><h2 class="title-text">챌린지 도전</h2></div>
        </div>
        <div></div>
      </div>
    </header>

    <!-- 메인 컨테이너 -->
    <div class="challenge-content">
      <!-- 난이도 선택 (1개만 선택 가능) -->
      <section class="difficulty-section">
        <h3 class="section-title">난이도 선택하기</h3>
        <div class="dice-list">
          <div
            v-for="(tag, idx) in difficultyTags"
            :key="tag.id"
            class="dice-item"
            :class="{ active: selectedDifficultyId === tag.id }"
            @click="selectDifficulty(tag.id)"
          >
            <!-- 아이콘은 idx(0~4)에 따라 fa-dice-one ~ fa-dice-five -->
            <i :class="['fas', diceIconClass(idx)]"></i>
          </div>
        </div>
      </section>

      <hr class="cross-line">

      <!-- 일반 태그 선택 (다중) -->
      <section class="tag-section">
        <h3 class="section-title">일반 태그 선택</h3>
        <div class="tag-list">
          <div
            v-for="tag in normalTags"
            :key="tag.id"
            class="tag-chip"
            :class="{ selected: selectedTagIds.includes(tag.id) }"
            @click="toggleNormalTag(tag.id)"
          >
            #{{ tag.name }}
          </div>
        </div>
      </section>

      <!-- 선택된 미션 정보 표시 -->
      <section v-if="selectedChallenge" class="challenge-detail">
        <h4>{{ selectedChallenge.title }}</h4>
        <p>{{ selectedChallenge.description }}</p>
        <div class="challenge-tags">
          <span 
            v-for="t in selectedChallenge.tags" 
            :key="t.id" 
            class="challenge-tag"
          >
            #{{ t.name }}
          </span>
        </div>

        <div class="action-buttons">
          <button class="challenge-btn" @click="challengeNow">도전하기</button>
          <button class="cancel-btn" @click="cancelChallenge">취소</button>
        </div>
      </section>

      <!-- 무작위 챌린지 받기 버튼 -->
      <button class="pick-btn" @click="pickRandomChallenge">
        무작위 챌린지 받기
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios'

export default {
  name: 'ChallengePage',
  data() {
    return {
      selectedTagIds: [],
      selectedChallenge: null,
      // (NEW) 현재 선택된 난이도 태그 id
      selectedDifficultyId: null,
      tags: [],
    }
  },
  created() {
    this.fetchTags(); 
  },
  computed: {
    // 난이도 태그(1~5)
    difficultyTags() {
      return this.tags.filter(t => t.id <= 9)
    },
    // 일반 태그
    normalTags() {
      return this.tags.filter(t => t.id >= 10)
    }
  },
  methods: {
    async fetchTags() {
      if (this.tags.length === 0) {
        const res = await api.get('/tag/all');
        this.tags = res.data.data;
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    // 난이도 아이콘 class
    diceIconClass(idx) {
      // idx=0 => fa-dice-one
      // idx=1 => fa-dice-two
      // ...
      switch (idx) {
        case 0: return 'fa-dice-one'
        case 1: return 'fa-dice-two'
        case 2: return 'fa-dice-three'
        case 3: return 'fa-dice-four'
        case 4: return 'fa-dice-five'
        default: return 'fa-dice-one'
      }
    },

    // 난이도 선택 (오직 하나만)
    selectDifficulty(difficultyTagId) {
      // 만약 이미 해당 난이도를 선택 중이면 해제(토글)할지도?
      // => "하나만 선택" 요구사항에 따라, 보통은 다시 클릭해도 그대로 유지하는 편
      // 여기서는 "재클릭시 해제" 가능하도록 예시
      if (this.selectedDifficultyId === difficultyTagId) {
        // 해제
        this.selectedDifficultyId = null
        // selectedTagIds에서도 제거
        this.selectedTagIds = this.selectedTagIds.filter(id => id !== difficultyTagId)
      } else {
        // 기존 난이도 태그(1~5) 제거
        const diffTagIds = this.difficultyTags.map(t => t.id)
        this.selectedTagIds = this.selectedTagIds.filter(id => !diffTagIds.includes(id))

        // 새 난이도 태그 선택
        this.selectedDifficultyId = difficultyTagId
        this.selectedTagIds.push(difficultyTagId)
      }
    },

    // 일반 태그를 클릭하면 토글
    toggleNormalTag(tagId) {
      if (this.selectedTagIds.includes(tagId)) {
        this.selectedTagIds = this.selectedTagIds.filter(t => t !== tagId)
      } else {
        this.selectedTagIds.push(tagId)
      }
    },

    // 무작위 챌린지
    async pickRandomChallenge() {
      try{
        const param = {
          tagIds : this.selectedTagIds,
        }
        const res = await api.post('/challenge-card/recommend', param);
        const challenge = res.data.data;
        if(res.data.code !== '0000') {
          alert(res.data.code + ': ' + res.data.msg)
          return;
        }
        this.selectedChallenge = challenge
      } catch (err) {
        console.log(err);
        alert("오류가 발생하였습니다.");
      }
    },

    // 도전하기
    async challengeNow() {
      if (!this.selectedChallenge) return
      try{
        const param = {
          challengeCardId : this.selectedChallenge.id,
        }
        const res = await api.post('/challenge-log/do', param);
        if(res.data.code !== '0000') {
          alert(res.data.code + ': ' + res.data.msg)
          return;
        }
        this.selectedChallenge = null
        this.$router.push('/ongoing')
      } catch (err) {
        console.log(err);
        alert("오류가 발생하였습니다.");
      }

      
    },

    // 취소
    cancelChallenge() {
      this.selectedChallenge = null
    }
  }
}
</script>

<style scoped>
/* 전체 레이아웃 */
.challenge-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #E5F0F8; 
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

/* 메인 컨테이너 */
.challenge-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 모바일에서 부드러운 스크롤 */
}

.cross-line {
  border: none;
  height: 2px;
  background-color: #003049;
  margin: 30px 0;
  width: 100%;
}

/* 난이도 섹션 */
.difficulty-section {
  margin-bottom: 1.5rem;
}
.section-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: bolder;
  color: #003049;
}

.dice-list {
  display: flex;
  gap: 0.6rem;
}
.dice-item {
  width: 48px;
  height: 48px;
  background-color: #003049;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.dice-item i {
  font-size: 3.5rem;
  color: white;
}
.dice-item.active i {
  color: #FFC600;
}

/* 일반 태그 섹션 */
.tag-section {
  margin-bottom: 1.5rem;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag-chip {
  background-color: #fff;
  color: #003049;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: bolder;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.tag-chip.selected {
  background-color: #FFC600;
}

/* 무작위 챌린지 버튼 */
.pick-btn {
  display: block;
  margin: 0 auto 1rem auto;
  margin-top: 15px;
  padding: 0.8rem 1.2rem;
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

/* 선택된 챌린지 상세 */
.challenge-detail {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 1rem;
}
.challenge-tags {
  margin-top: 0.5rem;
}
.challenge-tag {
  display: inline-block;
  margin-right: 0.5rem;
  background: #eee;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #555;
}

/* 도전/취소 버튼 */
.action-buttons {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}
.challenge-btn {
  flex: 1;
  padding: 0.8rem;
  background-color: #0099ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cancel-btn {
  flex: 1;
  padding: 0.8rem;
  background-color: #ff4b4b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
