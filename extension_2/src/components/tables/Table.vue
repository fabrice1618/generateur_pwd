<template>
  <div class="table-container">
    <div class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <FilterClearButton @clear="clearFilters" :has-filters="hasActiveFilters" />
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="column in columnsWithWidths"
              :key="column.key"
              :class="{ sortable: column.sortable, sorting: sortKey === column.key }"
              :style="{ width: column.width }"
              @click="column.sortable && sortBy(column.key)"
            >
              <div class="header-content">
                {{ column.label }}
                <span v-if="column.sortable" class="sort-icon">
                  <i :class="getSortIcon(column.key)"></i>
                </span>
              </div>
            </th>
          </tr>
          <tr class="filter-row">
            <th v-for="column in columnsWithWidths" :key="`filter-${column.key}`">
              <TableFilter
                v-if="column.filterable !== false"
                :column="column"
                :value="filters[column.key]"
                @update:value="updateFilter(column.key, $event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="getItemKey(item)">
            <td v-for="column in columnsWithWidths" :key="`${getItemKey(item)}-${column.key}`">
              {{ formatValue(item[column.key], column) }}
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0" class="empty-row">
            <td :colspan="columnsWithWidths.length" class="empty-message">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      v-if="showPagination"
      :total-items="filteredData.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @update:current-page="currentPage = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TableFilter from './TableFilter.vue'
import Pagination from './Pagination.vue'
import FilterClearButton from './FilterClearButton.vue'

export interface TableColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'boolean'
  sortable?: boolean
  filterable?: boolean
  formatter?: (value: any) => string
  width?: string
}

type TableColumnWithWidth = TableColumn & { width: string }

export interface TableProps {
  columns: TableColumn[]
  data: any[]
  title?: string
  pageSize?: number
  showPagination?: boolean
  emptyMessage?: string
  itemKey?: string | ((item: any) => string)
  defaultColumnWidths?: Record<string, string>
}

const props = withDefaults(defineProps<TableProps>(), {
  title: 'Tableau',
  pageSize: 10,
  showPagination: true,
  emptyMessage: 'Aucune donnée trouvée',
  itemKey: 'id',
  defaultColumnWidths: () => ({})
})

const currentPage = ref(1)
const pageSize = ref(props.pageSize)
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const filters = ref<Record<string, any>>({})

// Computed
const filteredData = computed(() => {
  let result = [...props.data]

  // Apply filters
  Object.entries(filters.value).forEach(([key, value]) => {
    console.log('Applying filter:', key, '=', value)
    if (value !== '' && value !== null && value !== undefined) {
      const column = props.columns.find(col => col.key === key)
      result = result.filter(item => {
        const itemValue = item[key]
        if (column?.type === 'number') {
          return itemValue == value // loose equality for numbers
        }
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
      })
    }
  })

  console.log('Filtered data length:', result.length, 'from original:', props.data.length)
  // Apply sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      let comparison = 0

      if (aVal < bVal) comparison = -1
      if (aVal > bVal) comparison = 1

      return sortOrder.value === 'desc' ? -comparison : comparison
    })
  }

  return result
})

const paginatedData = computed(() => {
  if (!props.showPagination) return filteredData.value

  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const columnsWithWidths = computed((): TableColumnWithWidth[] =>
  props.columns.map(col => ({
    ...col,
    width: col.width || props.defaultColumnWidths[col.key] || 'auto'
  }))
)

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value =>
    value !== '' && value !== null && value !== undefined
  ) || sortKey.value !== ''
})

// Methods
const sortBy = (key: string) => {
  if (sortKey.value === key) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else {
      // Reset sort if already desc
      sortKey.value = ''
      sortOrder.value = 'asc'
    }
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (key: string) => {
  if (sortKey.value !== key) return 'ri-arrow-up-down-line'
  return sortOrder.value === 'asc' ? 'ri-arrow-up-s-fill' : 'ri-arrow-down-s-fill'
}

const updateFilter = (key: string, value: any) => {
  console.log('Updating filter for key:', key, 'with value:', value)
  filters.value[key] = value
  currentPage.value = 1 // Reset to first page when filtering
}

const clearFilters = () => {
  filters.value = {}
  sortKey.value = ''
  sortOrder.value = 'asc'
  currentPage.value = 1
}

const formatValue = (value: any, column: TableColumn) => {
  if (column.formatter) {
    return column.formatter(value)
  }

  if (value === null || value === undefined) return ''

  switch (column.type) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'boolean':
      return value ? 'Oui' : 'Non'
    default:
      return String(value)
  }
}

const getItemKey = (item: any) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  return item[props.itemKey] || item.id || Math.random()
}

// Watchers
watch(() => props.pageSize, (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
})

watch(filteredData, () => {
  // Reset to first page if current page is out of bounds
  const maxPages = Math.ceil(filteredData.value.length / pageSize.value)
  if (currentPage.value > maxPages && maxPages > 0) {
    currentPage.value = maxPages
  }
})
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

.table-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.total-count {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
  font-weight: 500;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  max-width: 100%;
}

.data-table {
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
  background: var(--surface);
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--input-border);
  max-width: 300px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.data-table th {
  background: var(--bg);
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: var(--input-bg);
}

.data-table th.sorting {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.data-table tbody tr:nth-child(even) {
  background: var(--bg-alt, rgba(0, 0, 0, 0.02));
}

.data-table tbody tr:hover {
  background: rgba(59, 130, 246, 0.6) !important;
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-icon {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sortable:hover .sort-icon {
  opacity: 1;
}

.filter-row th {
  padding: 8px 12px;
  border-top: none;
}

.data-table tbody tr:hover {
  background: var(--input-bg);
}

.empty-row {
  text-align: center;
}

.empty-message {
  padding: 2rem;
  color: var(--text-secondary);
  font-style: italic;
}

@media (max-width: 768px) {
  .table-wrapper {
    font-size: 0.9rem;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
  }
}
</style>