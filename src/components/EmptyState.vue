<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    title: string
    message: string
    actionLabel?: string
  }>(),
  { actionLabel: '' },
)

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-icon"><i class="bi" :class="icon" /></div>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button v-if="actionLabel" class="btn btn-primary" type="button" @click="emit('action')">
      <i class="bi bi-plus-lg" /> {{ actionLabel }}
    </button>
  </div>
</template>
