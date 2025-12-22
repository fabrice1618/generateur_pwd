<template>
  <div class="file-upload" :class="{ 'drag-over': isDragOver, 'disabled': disabled }">
    <div
      class="upload-zone"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileSelect"
    >
      <input
        ref="fileInput"
        type="file"
        class="file-input"
        :accept="accept"
        :multiple="multiple"
        @change="onFileSelect"
        :disabled="disabled"
      />

      <div class="upload-content">
        <div class="upload-icon">
          <i class="ri-upload-cloud-line" />
        </div>

        <div class="upload-text">
          <p class="primary-text">
            {{ isDragOver ? t('dropFilesHere') : t('dragDropOrClick') }}
          </p>
          <p class="secondary-text">
            {{ acceptText }} • {{ maxSizeText }}
          </p>
        </div>

        <Button
          v-if="!hideButton"
          type="button"
          variant="outline"
          size="sm"
          :disabled="disabled"
        >
          {{ t('browseFiles') }}
        </Button>
      </div>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="file-list">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="file-item"
        :class="{ 'error': file.error }"
      >
        <div class="file-info">
          <div class="file-icon">
            <i :class="getFileIcon(file)" />
          </div>
          <div class="file-details">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-size">{{ formatFileSize(file.size) }}</p>
            <div v-if="file.error" class="file-error">
              {{ file.error }}
            </div>
          </div>
        </div>

        <div class="file-actions">
          <Button
            v-if="showPreview && isImage(file)"
            type="button"
            variant="ghost"
            size="sm"
            @click="previewFile(file)"
          >
            <i class="ri-eye-line" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="removeFile(index)"
            :disabled="uploading"
          >
            <i class="ri-close-line" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Progress -->
    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }" />
      </div>
      <p class="progress-text">{{ t('uploading') }} {{ progress }}%</p>
    </div>

    <!-- Preview Modal -->
    <Modal
      :is-open="!!previewFileData"
      @close="previewFileData = null"
      :title="t('filePreview')"
    >
      <div class="file-preview">
        <img
          v-if="isImage(previewFileData)"
          :src="previewFileData.preview"
          :alt="previewFileData.name"
          class="preview-image"
        />
        <pre v-else class="preview-text">{{ previewFileData.content }}</pre>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../buttons/Button.vue'
import Modal from '../modals/Modal.vue'

export interface FileUploadFile {
  file: File
  name: string
  size: number
  type: string
  preview?: string
  content?: string
  error?: string
}

interface Props {
  modelValue?: FileUploadFile[]
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  hideButton?: boolean
  showPreview?: boolean
  autoUpload?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: FileUploadFile[]): void
  (e: 'files-selected', files: FileUploadFile[]): void
  (e: 'file-removed', index: number): void
  (e: 'upload-start'): void
  (e: 'upload-progress', progress: number): void
  (e: 'upload-complete', files: FileUploadFile[]): void
  (e: 'upload-error', error: Error): void
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  maxSize: 10,
  maxFiles: 5,
  multiple: false,
  disabled: false,
  hideButton: false,
  showPreview: true,
  autoUpload: false
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

// Refs
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploading = ref(false)
const progress = ref(0)
const previewFileData = ref<FileUploadFile | null>(null)

// Computed
const files = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})

const acceptText = computed(() => {
  if (props.accept === '*/*') return t('allFiles')
  return props.accept.split(',').map(ext => ext.trim()).join(', ')
})

const maxSizeText = computed(() => {
  return t('maxSize', { size: props.maxSize })
})

// Methods
function triggerFileSelect() {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

function onDragOver() {
  if (!props.disabled) {
    isDragOver.value = true
  }
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  if (props.disabled) return

  const droppedFiles = Array.from(event.dataTransfer?.files || [])
  processFiles(droppedFiles)
}

function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFiles = Array.from(target.files || [])
  processFiles(selectedFiles)
  // Reset input
  target.value = ''
}

async function processFiles(newFiles: File[]) {
  const processedFiles: FileUploadFile[] = []

  for (const file of newFiles) {
    const fileData: FileUploadFile = {
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }

    // Validation
    const validation = validateFile(file)
    if (validation.valid) {
      // Generate preview for images
      if (props.showPreview && isImage(file)) {
        fileData.preview = await generatePreview(file)
      }
      // Read content for text files
      else if (props.showPreview && isTextFile(file)) {
        fileData.content = await readFileContent(file)
      }

      processedFiles.push(fileData)
    } else {
      fileData.error = validation.error
      processedFiles.push(fileData)
    }
  }

  // Check max files limit
  const totalFiles = [...files.value, ...processedFiles]
  if (totalFiles.length > props.maxFiles) {
    processedFiles.forEach(f => f.error = t('tooManyFiles', { max: props.maxFiles }))
  }

  // Update files
  const updatedFiles = [...files.value, ...processedFiles.filter(f => !f.error)]
  const errorFiles = processedFiles.filter(f => f.error)

  files.value = updatedFiles

  // Emit events
  emit('files-selected', processedFiles)

  // Auto upload if enabled
  if (props.autoUpload && updatedFiles.length > 0) {
    await uploadFiles(updatedFiles)
  }

  // Show errors for invalid files
  if (errorFiles.length > 0) {
    errorFiles.forEach(file => {
      console.error(`File ${file.name}: ${file.error}`)
    })
  }
}

function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (props.accept !== '*/*') {
    const acceptedTypes = props.accept.split(',').map(type => type.trim())
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type.match(type.replace('*', '.*'))
    })

    if (!isAccepted) {
      return { valid: false, error: t('invalidFileType') }
    }
  }

  // Check file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return { valid: false, error: t('fileTooLarge', { max: props.maxSize }) }
  }

  return { valid: true }
}

function removeFile(index: number) {
  const removedFile = files.value[index]
  files.value.splice(index, 1)
  emit('file-removed', index)
}

async function uploadFiles(filesToUpload: FileUploadFile[]) {
  if (uploading.value) return

  uploading.value = true
  progress.value = 0
  emit('upload-start')

  try {
    // Simulate upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      progress.value = i
      emit('upload-progress', i)
    }

    emit('upload-complete', filesToUpload)
  } catch (error) {
    emit('upload-error', error as Error)
  } finally {
    uploading.value = false
    progress.value = 0
  }
}

function isImage(file: File | FileUploadFile): boolean {
  let fileType: string
  if ('type' in file && typeof file.type === 'string') {
    fileType = file.type
  } else if ('file' in file && file.file && typeof file.file.type === 'string') {
    fileType = file.file.type
  } else {
    return false
  }
  return fileType.startsWith('image/')
}

function isTextFile(file: File | FileUploadFile): boolean {
  let fileType: string
  if ('type' in file && typeof file.type === 'string') {
    fileType = file.type
  } else if ('file' in file && file.file && typeof file.file.type === 'string') {
    fileType = file.file.type
  } else {
    return false
  }
  return fileType.startsWith('text/') || fileType === 'application/json'
}

async function generatePreview(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function getFileIcon(file: FileUploadFile): string {
  if (isImage(file)) return 'ri-image-line'
  if (file.type.includes('pdf')) return 'ri-file-pdf-line'
  if (file.type.includes('zip') || file.type.includes('rar')) return 'ri-file-zip-line'
  if (file.type.includes('text')) return 'ri-file-text-line'
  return 'ri-file-line'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function previewFile(file: FileUploadFile) {
  previewFileData.value = file
}

// Watch for external changes
watch(() => props.modelValue, (newFiles) => {
  if (newFiles) {
    files.value = newFiles
  }
})
</script>

<style scoped>
.file-upload {
  border: 2px dashed var(--input-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.file-upload:hover:not(.disabled) {
  border-color: var(--color-primary);
}

.file-upload.drag-over {
  border-color: var(--color-primary);
  background-color: rgba(23, 93, 220, 0.05);
}

.file-upload.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.upload-zone {
  padding: 2rem;
  text-align: center;
  cursor: pointer;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 3rem;
  color: var(--text-secondary);
}

.upload-text {
  color: var(--text);
}

.primary-text {
  font-weight: 500;
  margin: 0;
}

.secondary-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.5rem 0 0 0;
}

.file-list {
  border-top: 1px solid var(--input-border);
  padding: 1rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: var(--surface);
}

.file-item.error {
  border-color: var(--color-accent);
  background: rgba(255, 107, 107, 0.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.file-icon {
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  margin: 0;
}

.file-size {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
}

.file-error {
  color: var(--color-accent);
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.upload-progress {
  padding: 1rem;
  border-top: 1px solid var(--input-border);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--input-bg);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.file-preview {
  max-width: 100%;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.preview-text {
  background: var(--surface);
  padding: 1rem;
  border-radius: 6px;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.875rem;
}
</style>