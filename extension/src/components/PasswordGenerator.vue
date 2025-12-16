<template>
  <div class="generator">
    <section class="settings">
      <h2>Génération du mot de passe</h2>
      <form @submit.prevent="generate">
        <label>
          Longueur (caractères):
          <input type="range" min="8" max="128" step="1" v-model.number="length" />
          <span class="entropy-value">{{ length }} caractères</span>
        </label>

        <div class="charsets">
          <label><input type="checkbox" v-model="useUpper" /> Majuscules (A-Z)</label>
          <label><input type="checkbox" v-model="useLower" /> Minuscules (a-z)</label>
          <label><input type="checkbox" v-model="useDigits" /> Chiffres (0-9)</label>
          <label><input type="checkbox" v-model="useSymbols" /> Symboles (!@#$...)</label>
        </div>
        <div class="controls">
          <button type="submit">Générer</button>
          <button type="button" @click="copy" :disabled="!password">Copier</button>
        </div>
      </form>
    </section>

    <section class="result">
      <label>Mot de passe généré :</label>
      <input disabled readonly class="password" :value="password" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const length = ref<number>(16)
const password = ref<string>('')

const useUpper = ref<boolean>(true)
const useLower = ref<boolean>(true)
const useDigits = ref<boolean>(true)
const useSymbols = ref<boolean>(false)

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

async function copy() {
  if (!password.value) return
  try {
    await navigator.clipboard.writeText(password.value)
  } catch (e) {
    const el = document.createElement('textarea')
    el.value = password.value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}
</script>

<style scoped>
.generator { display:block }
.charsets { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px }
.controls { margin-top:12px; display:flex; gap:8px }
.password { width:100%; padding:10px; font-family: monospace; font-size:14px }
</style>
