<template>
  <div class="passwords-page">
    <div class="page-header">
      <h1>{{ $t('myPasswords') }} ({{ identities.length }})</h1>
      <button @click="openAddModal" class="add-button">
        <i class="ri-add-line"></i>
        {{ $t('addPassword') }}
      </button>
    </div>

    <!-- Modal d'ajout -->
    <AddPasswordModal
      v-if="showAddModal"
      :model-value="showAddModal"
      @close="showAddModal = false"
      @added="onPasswordAdded"
    />

    <div class="identities-section">

      <div v-if="identities.length === 0" class="empty-state">
        <p>Aucune identité enregistrée pour le moment.</p>
        <p>Cliquez sur "Ajouter une identité" pour commencer !</p>
      </div>
      
      <div v-else class="identities-grid">
        <div 
          v-for="identity in identities" 
          :key="identity.id"
          class="identity-card"
          :class="{ expanded: expandedCards[identity.id] }"
        >
          <div class="card-header" @click="toggleCardExpansion(identity.id)">
            <div class="card-info">
              <h3>{{ identity.name }}</h3>
              <p class="created-date">{{ formatDate(identity.createdAt) }}</p>
            </div>
            <div class="card-actions">
              <button 
                @click.stop="removeIdentity(identity.id)"
                class="action-btn delete-btn"
                aria-label="Supprimer cette identité"
              >
                <i class="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
          
          <div v-if="expandedCards[identity.id]" class="card-expanded">
            <div v-if="!editingCards[identity.id]" class="view-mode">
              <div class="field">
                <label>Nom d'utilisateur :</label>
                <div class="input-with-copy">
                  <TextInput
                    :model-value="identity.username"
                    readonly
                    class="readonly-input"
                  />
                  <button 
                    @click.stop="copyToClipboard(identity.username)"
                    class="copy-field-btn"
                    aria-label="Copier le nom d'utilisateur"
                  >
                    <i class="ri-file-copy-line"></i>
                  </button>
                </div>
              </div>
              
              <div class="field">
                <label>Mot de passe :</label>
                <div class="input-with-copy">
                  <PasswordInput
                    :model-value="identity.password"
                    readonly
                    allow-toggle-in-readonly
                    class="readonly-input"
                  />
                  <button 
                    @click.stop="copyToClipboard(identity.password)"
                    class="copy-field-btn"
                    aria-label="Copier le mot de passe"
                  >
                    <i class="ri-file-copy-line"></i>
                  </button>
                </div>
              </div>
              
              <div class="card-actions-expanded">
                <button 
                  @click.stop="startEditing(identity.id)"
                  class="action-btn edit-btn"
                >
                  <i class="ri-edit-line"></i>
                  Modifier
                </button>
              </div>
            </div>
            
            <div v-else class="edit-mode">
              <div class="field">
                <label>Nom de l'identité :</label>
                <input
                  v-model="editForm[identity.id].name"
                  class="edit-input"
                />
              </div>

              <div class="field">
                <label>Nom d'utilisateur :</label>
                <input
                  v-model="editForm[identity.id].username"
                  class="edit-input"
                />
              </div>

              <div class="field">
                <label>Mot de passe :</label>
                <div class="password-field">
                  <input
                    v-model="editForm[identity.id].password"
                    :type="visiblePasswords.includes(identity.id) ? 'text' : 'password'"
                    class="edit-input password-input"
                  />
                  <button
                    @click.stop="togglePasswordVisibility(identity.id)"
                    class="visibility-btn"
                    :aria-label="visiblePasswords.includes(identity.id) ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                  >
                    <i :class="visiblePasswords.includes(identity.id) ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
                  </button>
                  <button
                    @click.stop="generatePasswordForEdit(identity.id)"
                    class="generate-btn"
                    aria-label="Générer un nouveau mot de passe"
                  >
                    <i class="ri-refresh-line"></i>
                  </button>
                </div>
              </div>

              <div class="card-actions-expanded">
                <button
                  @click.stop="cancelEditing(identity.id)"
                  class="action-btn cancel-btn"
                >
                  Annuler
                </button>
                <button
                  @click.stop="saveEditing(identity.id)"
                  class="action-btn save-btn"
                >
                  <i class="ri-save-line"></i>
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePasswordsStore, type PasswordIdentity } from '../stores/passwords'
import { useToast } from '../utils/useToast'
import AddPasswordModal from '../components/modals/AddPasswordModal.vue'
import TextInput from '../components/inputs/TextInput.vue'
import PasswordInput from '../components/inputs/PasswordInput.vue'

const passwordsStore = usePasswordsStore()
const toast = useToast()

const showAddModal = ref(false)
const visiblePasswords = ref<string[]>([])
const passwordInputs = ref<HTMLInputElement[]>([])
const copiedButtons = ref<Record<string, boolean>>({})
const expandedCards = ref<Record<string, boolean>>({})
const editingCards = ref<Record<string, boolean>>({})
const editForm = ref<Record<string, { name: string; username: string; password: string }>>({})

const identities = computed(() => passwordsStore.identities)

onMounted(() => {
  // Suppression du chargement automatique depuis localStorage
  // Nettoyer les données corrompues au démarrage
  cleanCorruptedData()
})

function cleanCorruptedData() {
  // Nettoyer les données corrompues dans le store
  passwordsStore.identities = passwordsStore.identities.map(identity => ({
    ...identity,
    name: String(identity.name || ''),
    username: String(identity.username || ''),
    password: String(identity.password || '')
  }))
  // Sauvegarder les données nettoyées
  passwordsStore.saveToLocalStorage()
}

function openAddModal() {
  showAddModal.value = true
}

function onPasswordAdded() {
  showAddModal.value = false
  toast.success('Identité ajoutée avec succès !')
}

function removeIdentity(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette identité ?')) {
    passwordsStore.removeIdentity(id)
    toast.success('Identité supprimée')
  }
}

function togglePasswordVisibility(id: string) {
  const index = visiblePasswords.value.indexOf(id)
  if (index > -1) {
    visiblePasswords.value.splice(index, 1)
  } else {
    visiblePasswords.value.push(id)
  }
}

async function copyPassword(password: string, identityId: string) {
  try {
    await navigator.clipboard.writeText(password)
    copiedButtons.value[identityId] = true
    toast.success('Mot de passe copié !')
    
    // Retirer l'animation après 1.5 secondes
    setTimeout(() => {
      copiedButtons.value[identityId] = false
    }, 1500)
  } catch (error) {
    toast.error('Erreur lors de la copie')
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copié !')
  } catch (error) {
    toast.error('Erreur lors de la copie')
  }
}

function startEditing(id: string) {
  const identity = passwordsStore.identities.find(i => i.id === id)
  if (identity) {
    editingCards.value[id] = true
    editForm.value[id] = {
      name: identity.name,
      username: identity.username,
      password: identity.password
    }
  }
}

function cancelEditing(id: string) {
  editingCards.value[id] = false
  delete editForm.value[id]
}

function saveEditing(id: string) {
  const form = editForm.value[id]
  if (form && form.name && form.username && form.password) {
    passwordsStore.updateIdentity(id, form.name, form.username, form.password)
    editingCards.value[id] = false
    delete editForm.value[id]
    toast.success('Identité mise à jour')
  } else {
    toast.error('Veuillez remplir tous les champs')
  }
}

function generatePasswordForEdit(id: string) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>?/'
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  let password = ''
  for (let i = 0; i < 16; i++) {
    const idx = (arr[i] || 0) % charset.length
    password += charset.charAt(idx)
  }
  if (editForm.value[id]) {
    editForm.value[id].password = password
  }
}

function toggleCardExpansion(id: string) {
  expandedCards.value[id] = !expandedCards.value[id]
}

function getServiceIcon(serviceName: string): string {
  if (!serviceName || typeof serviceName !== 'string') return 'ri-global-line'
  const name = serviceName.toLowerCase()
  if (name.includes('gmail') || name.includes('google')) return 'ri-google-fill'
  if (name.includes('github')) return 'ri-github-fill'
  if (name.includes('facebook')) return 'ri-facebook-fill'
  if (name.includes('twitter') || name.includes('x.com')) return 'ri-twitter-fill'
  if (name.includes('instagram')) return 'ri-instagram-fill'
  if (name.includes('linkedin')) return 'ri-linkedin-fill'
  if (name.includes('amazon')) return 'ri-amazon-fill'
  if (name.includes('microsoft') || name.includes('outlook')) return 'ri-microsoft-fill'
  if (name.includes('apple')) return 'ri-apple-fill'
  if (name.includes('slack')) return 'ri-slack-fill'
  if (name.includes('discord')) return 'ri-discord-fill'
  if (name.includes('spotify')) return 'ri-spotify-fill'
  if (name.includes('netflix')) return 'ri-netflix-fill'
  if (name.includes('paypal')) return 'ri-paypal-fill'
  if (name.includes('bank') || name.includes('banque')) return 'ri-bank-card-fill'
  return 'ri-global-line' // icône par défaut
}
</script>

<style scoped>
.passwords-page { 
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-button:hover {
  background: var(--color-primary);
  filter: brightness(0.9);
}

.identities-section {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.identities-section h2 { margin-bottom: 16px }
.empty-state { text-align: center; color: #666; padding: 40px 20px }
.identities-grid { display: flex; flex-direction: column; gap: 12px }

.identity-card {
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
}

.identity-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
  cursor: pointer;
}

.card-info {
  flex: 1;
}

.card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.card-info .username {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.created-date {
  margin: 0;
  font-size: 12px;
  color: #888;
  font-weight: 400;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;
}

.action-btn.copy-btn {
  background: #007bff;
  color: white;
}

.action-btn.copy-btn:hover {
  background: #0056b3;
}

.action-btn.delete-btn {
  background: #dc3545;
  color: white;
}

.action-btn.delete-btn:hover {
  background: #c82333;
}

.card-expanded {
  border-top: 1px solid #e1e5e9;
  padding: 16px;
  background: #f8f9fa;
}

.view-mode, .edit-mode {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  margin-bottom: 12px;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  display: block;
  font-weight: 600;
  color: #495057;
  font-size: 13px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-with-copy {
  display: flex;
  gap: 8px;
  align-items: center;
}

.readonly-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #212529;
}

.readonly-input.password-input {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.copy-field-btn, .visibility-btn, .generate-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;
}

.copy-field-btn {
  background: #007bff;
  color: white;
}

.copy-field-btn:hover {
  background: #0056b3;
}

.visibility-btn {
  background: #6c757d;
  color: white;
}

.visibility-btn:hover {
  background: #5a6268;
}

.generate-btn {
  background: #28a745;
  color: white;
}

.generate-btn:hover {
  background: #218838;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  color: #212529;
  background: white;
}

.edit-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.edit-input.password-input {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.card-actions-expanded {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e1e5e9;
}

.action-btn.edit-btn {
  background: #ffc107;
  color: #212529;
  padding: 6px 12px;
  width: auto;
  height: auto;
  font-size: 14px;
  font-weight: 500;
}

.action-btn.edit-btn:hover {
  background: #e0a800;
}

.action-btn.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 6px 12px;
  width: auto;
  height: auto;
  font-size: 14px;
  font-weight: 500;
}

.action-btn.cancel-btn:hover {
  background: #5a6268;
}

.action-btn.save-btn {
  background: #28a745;
  color: white;
  padding: 6px 12px;
  width: auto;
  height: auto;
  font-size: 14px;
  font-weight: 500;
}

.action-btn.save-btn:hover {
  background: #218838;
}

.password-field {
  display: flex;
  gap: 8px;
  align-items: center;
}

.password-field .edit-input {
  flex: 1;
}

.password-display {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  background: white;
  font-size: 14px;
}

.visibility-btn {
  padding: 8px;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  color: #6c757d;
}

.visibility-btn:hover {
  background: #e9ecef;
}

.copy-btn.copied {
  background: #28a745 !important;
  color: white !important;
  border-color: #28a745 !important;
  transform: scale(1.05);
  animation: copyPulse 1.5s ease-in-out;
}

.copy-btn.copied .ri-file-copy-line {
  display: none;
}

.copied-text {
  font-size: 12px;
  font-weight: bold;
}

@keyframes copyPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px rgba(40, 167, 69, 0);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
  }
}
</style>