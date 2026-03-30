<template>
  <div class="app-bg">
    <Checkout />
  </div>
</template>

<script setup lang="ts">
import Checkout from './components/Checkout.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #667eea;
  --primary-hover: #5568d3;
  --success-color: #27ae60;
  --error-color: #e74c3c;
  --text-dark: #333;
  --text-light: #666;
  --border-light: #ddd;
  --bg-light: #f8f9fa;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}
</style>