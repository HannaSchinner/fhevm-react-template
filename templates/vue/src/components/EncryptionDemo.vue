<template>
  <div class="demo-card">
    <h2>Encryption Demo</h2>
    <p>Encrypt sensitive data using FHEVM</p>

    <div class="input-group">
      <label>Value to Encrypt:</label>
      <input
        v-model="value"
        type="number"
        placeholder="Enter a number"
        :disabled="!isInitialized"
      />
    </div>

    <button @click="handleEncrypt" :disabled="!isInitialized || loading">
      {{ loading ? 'Encrypting...' : 'Encrypt Value' }}
    </button>

    <div v-if="encrypted" class="result">
      <strong>Encrypted Value:</strong>
      <code>{{ encrypted }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFhevm } from '../composables/useFhevm';

const { client, isInitialized, initClient } = useFhevm();
const value = ref('');
const encrypted = ref('');
const loading = ref(false);

onMounted(async () => {
  await initClient();
});

async function handleEncrypt() {
  if (!client.value || !value.value) return;

  loading.value = true;
  try {
    const result = await client.value.encrypt(parseInt(value.value));
    encrypted.value = result.toString();
  } catch (error) {
    console.error('Encryption error:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.demo-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin: 1rem 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 4px;
}

code {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  word-break: break-all;
}
</style>
