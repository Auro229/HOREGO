/** useTheme.js - Thèmes Noir / Bleu / Clair (blanc), mémorisé dans le navigateur. */
import { ref } from 'vue'

const CLE = 'horego-theme'
const THEMES = ['noir', 'bleu', 'clair']
const theme = ref('noir')
try { const m = localStorage.getItem(CLE); if (THEMES.includes(m)) theme.value = m } catch { /* stockage indisponible */ }

/** Applique le thème : le CSS réagit à l'attribut data-theme sur <html> */
function appliquer() {
  document.documentElement.dataset.theme = theme.value
  try { localStorage.setItem(CLE, theme.value) } catch { /* ignoré */ }
}
appliquer()

export function useTheme() {
  const basculer = () => {
    theme.value = THEMES[(THEMES.indexOf(theme.value) + 1) % THEMES.length]
    appliquer()
  }
  return { theme, basculer }
}