// composables/useTheme.js : thèmes Noir / Bleu / Blanc
import { ref } from 'vue'

export const THEMES = ['noir', 'bleu', 'blanc']
const theme = ref('noir')

function apply(t) {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  try { localStorage.setItem('horego-theme', t) } catch (e) {}
}

export function initTheme() {
  let saved = 'noir'
  try { saved = localStorage.getItem('horego-theme') || 'noir' } catch (e) {}
  apply(THEMES.includes(saved) ? saved : 'noir')
}

export function useTheme() {
  const nextTheme = () => apply(THEMES[(THEMES.indexOf(theme.value) + 1) % THEMES.length])
  return { theme, THEMES, setTheme: apply, nextTheme }
}
