<script setup lang="ts">
import { useTemplateRef } from 'vue'

const { value } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const input = useTemplateRef('input')

interface Props {
  value: string | undefined | null
}

function updateValue(e: any) {
  emit('update:value', e.target.value)
}

function clear() {
  emit('update:value', '')

  if (input.value) {
    input.value.value = ''
  }
}
</script>

<template>
  <div class="form-search" :class="{ 'has-input': value }">
    <span class="material-icons">&#xe8b6;</span>
    <input v-bind="$attrs" ref="input" tabindex="0" type="text" @input="updateValue">
    <button v-if="value" @click="clear">
      <span class="material-icons">&#xe5cd;</span>
    </button>
  </div>
</template>
