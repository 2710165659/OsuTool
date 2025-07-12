<template>
  <el-dialog v-model="localVisible" title="请选择" width="60%" @close="onClose">
    <div class="grid-container">
      <el-card v-for="(item, index) in data" :key="index"
        :class="{ selected: selectedIndices.includes(index), disabled: disableSelectd.includes(index) }"
        class="grid-item" @click="toggleSelect(index)">
        <div class="content">{{ item }}</div>
        <div class="corner-icon" v-if="selectedIndices.includes(index)">
          <el-icon>
            <Check />
          </el-icon>
        </div>
      </el-card>
    </div>

    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="confirmSelect">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Check } from '@element-plus/icons-vue'

const props = defineProps(['modelValue', 'hot'])
const emit = defineEmits(['selected'])

const localVisible = ref(false)
const data = ref([])
const disableSelectd = ref([])

const selectedIndices = ref([])

// 监听弹窗显示，打开时刷新data
watch(() => props.modelValue, (val) => {
  localVisible.value = val
  if (val) {
    data.value = props.hot.getColHeader()
    selectedIndices.value = []
    disableSelectd.value = []

    data.value[0] = '自定义内容'
    // 获取所有隐藏列索引
    const hiddenPlugin = props.hot.getPlugin('hiddenColumns')
    if (hiddenPlugin) {
      const colCount = props.hot.countCols()
      for (let i = 1; i < colCount; i++) {
        if (!hiddenPlugin.isHidden(i)) disableSelectd.value.push(i)
      }
    }
  }
})

function toggleSelect(index) {
  if (disableSelectd.value.includes(index)) return

  const i = selectedIndices.value.indexOf(index)
  if (i >= 0) {
    selectedIndices.value.splice(i, 1)
  } else {
    selectedIndices.value.push(index)
  }
}

function confirmSelect() {
  emit('selected', selectedIndices.value)
  localVisible.value = false
}

function onClose() {
  emit('selected', []) // 关闭时也发空数组
  localVisible.value = false
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.grid-item {
  position: relative;
  height: 100px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  border: 2px solid transparent;
}

.grid-item.selected {
  border: 2px solid #409EFF;
  background-color: #ecf5ff;
}

.grid-item.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.corner-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 4px;
  background: white;
  border-radius: 4px;
  padding: 0 3px;
}
</style>
