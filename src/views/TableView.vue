<template>
  <div class="handsontable" ref="hotContainer"></div>
</template>

<script setup>
import Handsontable from 'handsontable'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-horizon.css'
import { reactive, ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'

const hotContainer = ref(null)
let hotInstance = null

// 响应式数据
const tableData = reactive([
  [1, 'Alice', 25, 'Berlin'],
  [2, 'Bob', 30, 'Paris'],
  [3, 'Charlie', 28, 'New York']
])
const colHeaders = reactive(['BID', '说明', '歌曲名称', '难度'])
const unuseColHeaders = reactive(['BID', '说明', '歌曲名称', '难度'])

onMounted(() => {
  hotInstance = new Handsontable(hotContainer.value, {
    data: tableData,
    colHeaders: colHeaders,
    rowHeaders: true,
    stretchH: 'all',
    width: '100%',
    height: 400,
    manualColumnResize: true, // 允许列宽调整
    manualColumnMove: true, // 允许列拖动
    manualRowMove: true,    // 允许行拖动
    manualRowResize: true, // 允许行高调整
    autoWrapRow: true, // 自动换行
    themeName: 'ht-theme-horizon',
    licenseKey: 'non-commercial-and-evaluation',
    contextMenu: {
      items: {
        'row_above': { name: '在上方插入行' },
        'row_below': { name: '在下方插入行' },
        'col_left': { name: '在左侧插入列' },
        'col_right': { name: '在右侧插入列' },
        'remove_row': { name: '删除行' },
        'remove_col': { name: '删除列' },
        'undo': { name: '撤销' },
        'redo': { name: '重做' },
        'alignment': { name: '对齐' }
      }
    },


    // 👇 表格列顺序变动时更新 colHeaders
    afterColumnMove(movedColumns, finalIndex, dropIndex, movePossible, orderChanged) {
      if (orderChanged) {
        const newHeaders = hotInstance.getColHeader()
        colHeaders.splice(0, colHeaders.length, ...newHeaders)
      }
    }
  })
})


// watchEffect 监听数据和表头变化，刷新表格
watchEffect(() => {
  if (hotInstance) {
    hotInstance.updateSettings({
      data: tableData,
      colHeaders: colHeaders
    })
  }
})

onBeforeUnmount(() => {
  if (hotInstance) {
    hotInstance.destroy()
  }
})
</script>

<style>
.handsontable .ht_clone_top th {
  font-weight: bold;
}

.handsontable .ht_clone_left th {
  font-weight: bold;
}
</style>
