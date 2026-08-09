<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    message: string
    confirmLabel?: string
    dangerous?: boolean
    busy?: boolean
  }>(),
  {
    confirmLabel: 'Xác nhận',
    dangerous: false,
    busy: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && !props.busy) emit('cancel')
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div class="modal-layer" role="presentation" @mousedown.self="!busy && emit('cancel')">
      <section class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div class="confirm-icon" :class="{ danger: dangerous }">
          <i class="bi" :class="dangerous ? 'bi-trash3' : 'bi-question-lg'" />
        </div>
        <h2 id="confirm-title">{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="confirm-actions">
          <button class="btn btn-light" type="button" :disabled="busy" @click="emit('cancel')">Hủy</button>
          <button
            class="btn"
            :class="dangerous ? 'btn-danger' : 'btn-primary'"
            type="button"
            :disabled="busy"
            @click="emit('confirm')"
          >
            <span v-if="busy" class="spinner-border spinner-border-sm" aria-hidden="true" />
            {{ confirmLabel }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
