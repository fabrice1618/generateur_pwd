<template>
  <div class="generator">
    <section class="settings">
      <h2>Génération du mot de passe</h2>
      <form @submit.prevent="generate">
        <div class="length-control">
          <label class="length-label">
            Longueur (caractères): <span class="length-value">{{ length }}</span>
          </label>
          <div class="slider-container">
            <input
              type="range"
              min="8"
              max="128"
              step="1"
              v-model.number="length"
              class="length-slider"
            />
            <div class="slider-marks">
              <span>8</span>
              <span>32</span>
              <span>64</span>
              <span>96</span>
              <span>128</span>
            </div>
          </div>
        </div>

        <div class="entropy-section">
          <div class="entropy-info">
            <span class="entropy-label">Sécurité:</span>
            <span class="entropy-value" :style="{ backgroundColor: entropyColor }">
              {{ entropyLabel }}
            </span>
            <span class="entropy-bits">{{ entropy }} bits</span>
          </div>
          <div class="entropy-bar">
            <div
              class="entropy-progress"
              :style="{ width: entropyPercentage + '%', backgroundColor: entropyColor }"
            ></div>
          </div>
        </div>

        <div class="charsets">
          <ToggleSwitch v-model="useUpper">Majuscules (A-Z)</ToggleSwitch>
          <ToggleSwitch v-model="useLower">Minuscules (a-z)</ToggleSwitch>
          <ToggleSwitch v-model="useDigits">Chiffres (0-9)</ToggleSwitch>
          <ToggleSwitch v-model="useSymbols">Symboles (!@#$...)</ToggleSwitch>
        </div>
        <div class="controls">
          <button type="submit">Générer</button>
        </div>
      </form>
    </section>

    <section class="result">
      <label>Mot de passe généré :</label>
      <div class="password-container">
        <input readonly class="password" :value="password" ref="passwordInput" @click="selectAll" />
        <button type="button" @click="copy" :disabled="!password" class="copy-btn" :class="{ copied: isCopying }">
          {{ isCopying ? 'Copié !' : 'Copier' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ToggleSwitch from './inputs/ToggleSwitch.vue'

const length = ref<number>(16)
const password = ref<string>('')
const passwordInput = ref<HTMLInputElement>()
const isCopying = ref<boolean>(false)

const useUpper = ref<boolean>(true)
const useLower = ref<boolean>(true)
const useDigits = ref<boolean>(true)
const useSymbols = ref<boolean>(false)

// Calcul de l'entropie et de la sécurité
const charsetSize = computed(() => {
  let size = 0
  if (useUpper.value) size += 26 // A-Z
  if (useLower.value) size += 26 // a-z
  if (useDigits.value) size += 10 // 0-9
  if (useSymbols.value) size += 32 // symboles spéciaux
  return Math.max(size, 1) // Au minimum 1 pour éviter log(0)
})

const entropy = computed(() => {
  const bits = length.value * Math.log2(charsetSize.value)
  return Math.round(bits * 100) / 100 // Arrondi à 2 décimales
})

const entropyPercentage = computed(() => {
  // Considérons qu'une entropie de 128 bits est excellente (100%)
  const maxEntropy = 128
  return Math.min((entropy.value / maxEntropy) * 100, 100)
})

const entropyColor = computed(() => {
  const bits = entropy.value
  if (bits < 50) return '#ef4444' // Rouge - faible
  if (bits < 80) return '#f97316' // Orange - moyen
  if (bits < 100) return '#eab308' // Jaune - bon
  return '#10b981' // Vert - excellent
})

const entropyLabel = computed(() => {
  const bits = entropy.value
  if (bits < 50) return 'Faible'
  if (bits < 80) return 'Moyen'
  if (bits < 100) return 'Bon'
  return 'Excellent'
})

function buildCharset() {
  let parts: string[] = []
  if (useUpper.value) parts.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  if (useLower.value) parts.push('abcdefghijklmnopqrstuvwxyz')
  if (useDigits.value) parts.push('0123456789')
  if (useSymbols.value) parts.push("!@#$%^&*()-_=+[]{};:,.<>?/")
  const charset = parts.join('')
  return charset || 'abcdefghijklmnopqrstuvwxyz0123456789'
}

function randomString(len: number) {
  const charset = buildCharset()
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  let out = ''
  for (let i = 0; i < len; i++) {
    const idx = (arr[i] || 0) % charset.length
    out += charset.charAt(idx)
  }
  return out
}

function generate() {
  password.value = randomString(length.value ?? 16)
}

function selectAll() {
  if (passwordInput.value) {
    passwordInput.value.select()
  }
}

async function copy() {
  if (!password.value) return
  try {
    await navigator.clipboard.writeText(password.value)
    isCopying.value = true
    // Retirer l'animation après 1.5 secondes
    setTimeout(() => {
      isCopying.value = false
    }, 1500)
  } catch (e) {
    // Fallback pour les navigateurs qui ne supportent pas clipboard API
    if (passwordInput.value) {
      passwordInput.value.select()
      document.execCommand('copy')
      isCopying.value = true
      setTimeout(() => {
        isCopying.value = false
      }, 1500)
    }
  }
}
</script>

<style scoped>
.generator { display:block }
.charsets {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.length-control {
  margin-top: 16px;
}

.length-label {
  display: block;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
  font-size: 14px;
}

.length-value {
  font-weight: 600;
  color: var(--color-primary);
}

.slider-container {
  position: relative;
}

.length-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--input-border);
  outline: none;
  appearance: none;
  cursor: pointer;
}

.length-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.length-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.length-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

.entropy-section {
  margin-top: 20px;
  padding: 16px;
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--input-border);
}

.entropy-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.entropy-label {
  font-weight: 500;
  color: var(--text);
  font-size: 14px;
}

.entropy-value {
  font-weight: 600;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
  color: white;
}

.entropy-bits {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: auto;
}

.entropy-bar {
  width: 100%;
  height: 8px;
  background: var(--input-border);
  border-radius: 4px;
  overflow: hidden;
}

.entropy-progress {
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.entropy-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  animation: entropyShine 2s infinite;
}

@keyframes entropyShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.controls { margin-top:12px; display:flex; gap:8px }
.password-container { display: flex; gap: 8px; align-items: center; margin-top: 8px }
.password { 
  flex: 1; 
  padding: 10px; 
  font-family: monospace; 
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: text;
}
.password:focus { outline: 2px solid #007bff; }
.copy-btn {
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.copy-btn:hover { background: #0056b3; }
.copy-btn:disabled { background: #ccc; cursor: not-allowed; }

.copy-btn.copied {
  background: #28a745 !important;
  color: white !important;
  border-color: #28a745 !important;
  transform: scale(1.05);
  animation: copyPulse 1.5s ease-in-out;
}

@keyframes copyPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(40, 167, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
  }
}
</style>