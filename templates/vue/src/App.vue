<template>
  <div id="app">
    <header>
      <h1>FHEVM Vue Template</h1>
      <p>Privacy-Preserving Applications with Fully Homomorphic Encryption</p>
    </header>

    <main>
      <EncryptionDemo />
    </main>

    <footer>
      <p>Built with @fhevm/sdk and Vue 3</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import EncryptionDemo from './components/EncryptionDemo.vue';
</script>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
}
</style>
