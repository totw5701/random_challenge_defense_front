<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 전역 스타일 예시 */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

#app {
  width: 390px;      /* 📌 진짜 고정폭 */
  height: 100vh;
  background-color: white;
  overflow-x: hidden;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>
