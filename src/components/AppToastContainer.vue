<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
</script>

<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast">
      <div v-for="toast in uiStore.toasts" :key="toast.id" class="app-toast" :class="`is-${toast.tone}`">
        <span class="toast-status-icon">
          <i
            class="bi"
            :class="toast.tone === 'danger' ? 'bi-exclamation-lg' : toast.tone === 'info' ? 'bi-info-lg' : 'bi-check-lg'"
          />
        </span>
        <span>{{ toast.message }}</span>
        <button type="button" aria-label="Đóng thông báo" @click="uiStore.removeToast(toast.id)">
          <i class="bi bi-x-lg" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
