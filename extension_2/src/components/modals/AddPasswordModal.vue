<template>
  <Modal
    :model-value="modelValue"
    title="Ajouter une identité"
    size="sm"
    @close="$emit('close')"
  >
    <form @submit.prevent="addIdentity" class="add-form">
      <TextInput
        v-model="newIdentityName"
        :label="'Nom de l\'identité <span class=\'required-asterisk\'>*</span>'"
        placeholder="ex: Gmail, GitHub..."
      />
      <TextInput
        v-model="newIdentityUsername"
        :label="'Nom d\'utilisateur <span class=\'required-asterisk\'>*</span>'"
        placeholder="votre@email.com"
      />
      <div class="password-field">
        <PasswordInput
          v-model="newIdentityPassword"
          :label="'Mot de passe <span class=\'required-asterisk\'>*</span>'"
          placeholder="Mot de passe à enregistrer"
        />
        <div class="password-actions">
          <button 
            @click="generatePassword"
            class="generate-btn"
            type="button"
            title="Générer un mot de passe"
          >
            <i class="ri-refresh-line"></i>
          </button>
          <button 
            @click="copyGeneratedPassword"
            class="copy-btn"
            type="button"
            title="Copier le mot de passe"
            :disabled="!newIdentityPassword"
          >
            <i class="ri-file-copy-line"></i>
          </button>
        </div>
      </div>

      <div class="advanced-settings-toggle">
        <button 
          @click="showAdvancedSettings = !showAdvancedSettings"
          class="toggle-advanced-btn"
          type="button"
        >
          <i :class="showAdvancedSettings ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
          Paramètres avancés
        </button>
      </div>

      <div v-if="showAdvancedSettings" class="generator-settings">
        <h4>Paramètres de génération</h4>
        <div class="length-control">
          <label class="length-label">
            Longueur (caractères): <span class="length-value">{{ passwordLength }}</span>
          </label>
          <div class="slider-container">
            <input
              type="range"
              min="8"
              max="128"
              step="1"
              v-model.number="passwordLength"
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
          <ToggleSwitch v-model="useUppercase">Majuscules (A-Z)</ToggleSwitch>
          <ToggleSwitch v-model="useLowercase">Minuscules (a-z)</ToggleSwitch>
          <ToggleSwitch v-model="useNumbers">Chiffres (0-9)</ToggleSwitch>
          <ToggleSwitch v-model="useSymbols">Symboles (!@#$...)</ToggleSwitch>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="modal-actions">
        <Button variant="secondary" @click="$emit('close')">
          Annuler
        </Button>
        <Button type="submit" :loading="loading" :disabled="!isFormValid">
          Ajouter
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import Modal from './Modal.vue'
import TextInput from '../inputs/TextInput.vue'
import PasswordInput from '../inputs/PasswordInput.vue'
import Button from '../buttons/Button.vue'
import ToggleSwitch from '../inputs/ToggleSwitch.vue'
import { usePasswordsStore } from '@/stores/passwords'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  close: []
  added: []
}>()

const toast = useToast()
const passwordsStore = usePasswordsStore()
const loading = ref(false)

const newIdentityName = ref('')
const newIdentityUsername = ref('')
const newIdentityPassword = ref('')

// Paramètres de génération de mot de passe (paramètres minimaux par défaut)
const passwordLength = ref(12)
const useLowercase = ref(true)
const useUppercase = ref(false)
const useNumbers = ref(true)
const useSymbols = ref(false)

// État de l'accordéon pour les paramètres avancés
const showAdvancedSettings = ref(false)

// Calcul de l'entropie et de la sécurité
const charsetSize = computed(() => {
  let size = 0
  if (useLowercase.value) size += 26 // a-z
  if (useUppercase.value) size += 26 // A-Z
  if (useNumbers.value) size += 10 // 0-9
  if (useSymbols.value) size += 32 // symboles spéciaux
  return Math.max(size, 1) // Au minimum 1 pour éviter log(0)
})

const entropy = computed(() => {
  const bits = passwordLength.value * Math.log2(charsetSize.value)
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

// Vérifier si le formulaire est valide (tous les champs obligatoires remplis)
const isFormValid = computed(() => {
  return newIdentityName.value.trim() !== '' && 
         newIdentityUsername.value.trim() !== '' && 
         newIdentityPassword.value.trim() !== ''
})

// Fonction de génération de mot de passe
function generatePassword() {
  const charset = buildCharset()
  const arr = new Uint8Array(passwordLength.value)
  crypto.getRandomValues(arr)
  let password = ''
  for (let i = 0; i < passwordLength.value; i++) {
    const idx = (arr[i] || 0) % charset.length
    password += charset.charAt(idx)
  }
  newIdentityPassword.value = password
}

// Fonction pour construire le charset selon les options
function buildCharset() {
  let charset = ''
  if (useLowercase.value) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (useUppercase.value) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (useNumbers.value) charset += '0123456789'
  if (useSymbols.value) charset += '!@#$%^&*()-_=+[]{};:,.<>?/'
  return charset || 'abcdefghijklmnopqrstuvwxyz0123456789'
}

// Fonction pour copier le mot de passe généré
async function copyGeneratedPassword() {
  if (!newIdentityPassword.value) return
  
  try {
    await navigator.clipboard.writeText(newIdentityPassword.value)
    toast.success('Mot de passe copié !')
  } catch (error) {
    toast.error('Erreur lors de la copie')
  }
}

const addIdentity = async () => {
  if (!newIdentityName.value.trim() || !newIdentityUsername.value.trim() || !newIdentityPassword.value.trim()) {
    toast.error('Veuillez remplir tous les champs')
    return
  }

  loading.value = true
  try {
    await passwordsStore.addIdentity(
      newIdentityName.value,
      newIdentityUsername.value,
      newIdentityPassword.value
    )

    // Reset form
    newIdentityName.value = ''
    newIdentityUsername.value = ''
    newIdentityPassword.value = ''

    toast.success('Identité ajoutée avec succès')
    emit('added')
    emit('close')
  } catch (error) {
    toast.error('Erreur lors de l\'ajout de l\'identité')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.password-field {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.password-field .text-input {
  flex: 1;
}

.password-actions {
  display: flex;
  gap: 4px;
}

.generate-btn, .copy-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #6c757d;
}

.generate-btn:hover {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.copy-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.required-asterisk {
  color: #dc3545;
  font-weight: bold;
  margin-left: 2px;
}

.advanced-settings-toggle {
  margin-top: 8px;
  text-align: center;
}

.toggle-advanced-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 auto;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.toggle-advanced-btn:hover {
  background: var(--surface);
  color: var(--color-primary-hover);
}

.toggle-advanced-btn i {
  font-size: 16px;
  transition: transform 0.2s ease;
}

.generator-settings {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background: #f8f9fa;
  margin-top: 8px;
}

.generator-settings h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.length-control {
  margin-bottom: 16px;
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
  margin-bottom: 16px;
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

.charsets {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>