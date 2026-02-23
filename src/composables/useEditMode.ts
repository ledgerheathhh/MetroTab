import { ref } from 'vue'

export function useEditMode(defaultValue = false) {
  const editing = ref(defaultValue)

  function toggleEditing() {
    editing.value = !editing.value
  }

  return {
    editing,
    toggleEditing
  }
}
