<template>
  <el-dialog v-model="localVisible" title="请选择" width="60%" @close="onClose">
    <div class="grid-container">
      <el-card v-for="(item, index) in data.slice(1)" :key="index + 1"
        :class="{ selected: selectedIndices[index + 1] == 1 }" class="grid-item" @click="toggleSelect(index + 1)">
        <div class="content">{{ item }}</div>
        <div class="corner-icon" v-if="selectedIndices[index + 1] == 1">
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

const props = defineProps(['modelValue', 'hot', 'initialColHeaders'])
const emit = defineEmits(['selected'])

const localVisible = ref(false)

const data = ref([]) // 数据
const selectedIndices = ref([]) // 0为不选，1为选择

// 监听弹窗显示，打开时刷新data
watch(() => props.modelValue, (val) => {
  localVisible.value = val
  if (val) {
    data.value = props.initialColHeaders
    selectedIndices.value = new Array(props.initialColHeaders.length).fill(1)

    // 判断隐藏
    const hiddenPlugin = props.hot.getPlugin('hiddenColumns')
    if (hiddenPlugin) {
      for (let i = 0; i < data.value.length; i++) {
        const visibleCol = props.hot.toVisualColumn(i)
        if (hiddenPlugin.isHidden(visibleCol)) selectedIndices.value[i] = 0
      }
    }
  }
})

function toggleSelect(index) {
  selectedIndices.value[index] = selectedIndices.value[index] ? 0 : 1
}

function confirmSelect() {
  emit('selected', selectedIndices.value)
  localVisible.value = false
}

function onClose() {
  emit('selected', [])
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
