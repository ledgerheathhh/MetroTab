<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'primary'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    type: 'button'
  }
)
</script>

<template>
  <button :type="type" :class="variant === 'primary' ? 'metro-btn-primary' : 'metro-btn'">
    <slot></slot>
  </button>
</template>
