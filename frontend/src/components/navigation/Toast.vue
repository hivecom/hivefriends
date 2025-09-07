<script setup lang="ts">
import type { Toast } from '../../store/toast'
import { onMounted } from 'vue'
import { useToast } from '../../store/toast'

const { data, index } = defineProps<{
  data: Toast
  index: number
}>()

const { del } = useToast()

onMounted(() => {
  // Auto clear
  setTimeout(() => {
    del(index)
  }, data.timeout)
})
</script>

<template>
  <div class="hi-toast-item" :class="[data.type]">
    <p>{{ data.text }}</p>
    <button @click="del(index)">
      <span class="material-icons">&#xe5cd;</span>
    </button>
  </div>
</template>
