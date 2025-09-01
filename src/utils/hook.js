import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

export function useOnLoad(callback) {
  const route = useRoute()
  
  onMounted(() => {
    callback(route.query)
  })
}