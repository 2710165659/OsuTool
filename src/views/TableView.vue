<template>
  <div class="container">
    <HotTable class="handsontable" ref="hotTable" :settings="settings" width="100%" height="500" />
    <BeatmapInfoTable v-model="dialogVisible" :initialColHeaders="getFieldNames()" :hot="hot"
      @selected="handleSelected" />
  </div>
</template>

<script setup>
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
registerAllModules()// 注册模块
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-horizon.css'
import { ref, onMounted, createApp, render } from 'vue'
import { useFieldMapper } from '@/hook/useFieldMapper'
import BeatmapInfoTable from '@/components/BeatmapInfoTable.vue'

const { mapObject, getFieldNames, getFieldShows } = useFieldMapper()

const hotTable = ref(null)
let hot = null

const dialogVisible = ref(false)
let resolveSelected

const handleSelected = (items) => {
  dialogVisible.value = false
  if (resolveSelected) {
    resolveSelected(items) // 用户选完，返回选中的 items
    resolveSelected = null
  }
}

const openSelectDialog = async () => {
  dialogVisible.value = true

  return new Promise((resolve) => {
    resolveSelected = resolve
  })
}

const settings = {
  colHeaders: getFieldNames(),
  rowHeaders: true,
  stretchH: 'all',
  width: '100%',
  minCols: getFieldNames().length,
  manualColumnResize: true,
  manualColumnMove: true,
  manualRowMove: true,
  manualRowResize: true,
  autoWrapRow: true,
  themeName: 'ht-theme-horizon',
  licenseKey: 'non-commercial-and-evaluation',
  hiddenColumns: { copyPasteEnabled: false },
  contextMenu: {
    async callback(key, selection, clickEvent) {
      const selectedCols = getSelectedColumns()
      const selectedRows = getSelectedRows()

      switch (key) {
        case 'row:delete': {
          let row_count = 0
          selectedRows.forEach(row => {
            this.alter('remove_row', row - row_count)
            row_count++
          })
          break
        }

        case 'row:above': {
          this.alter('insert_row_above', selectedRows[0])
          break
        }

        case 'row:below': {
          this.alter('insert_row_below', selectedRows[0])
          break
        }

        case 'col:delete': {
          let col_count = 0
          selectedCols.forEach(col => {
            const phyCol = this.toPhysicalColumn(col)
            // 如果是自定义列，则删除，否则隐藏
            if (phyCol >= getFieldNames().length) {
              this.alter('remove_col', col - col_count)
              console.log(`删除列: ${col}`)
              col_count++
            } else {
              const hiddenPlugin = this.getPlugin('hiddenColumns')
              hiddenPlugin.hideColumn(col)
              console.log(`隐藏列: ${col}`)
            }
          })
          break
        }

        case 'col:left': {
          const movePlugin = this.getPlugin('manualColumnMove')
          this.alter('insert_col_end', this.countCols())
          movePlugin.moveColumn(this.countCols() - 1, selectedCols[0])
          break
        }

        case 'col:right': {
          const movePlugin = this.getPlugin('manualColumnMove')
          this.alter('insert_col_end', this.countCols())
          movePlugin.moveColumn(this.countCols() - 1, selectedCols[0] + 1)
          break
        }

        case 'data:get': {
          break
        }

        case 'data:get:row': {
          break
        }

        case 'data:add': {
          const showIndices = await openSelectDialog()
          if (!showIndices || showIndices.length === 0) return
          const hiddenPlugin = this.getPlugin('hiddenColumns')

          for (let i = 1; i < showIndices.length; i++) {
            const visualCol = this.toVisualColumn(i)
            if (showIndices[i] && hiddenPlugin.isHidden(visualCol)) {
              hiddenPlugin.showColumn(visualCol)
            }
            if (!showIndices[i] && !hiddenPlugin.isHidden(visualCol)) {
              hiddenPlugin.hideColumn(visualCol)
            }
          }
          break
        }

        case 'data:download': {
          break
        }
      }


      console.log(key)

      this.render()
    },
    items: {
      row: {
        name: '行操作',
        submenu: {
          items: [
            { key: 'row:delete', name: '删除选中行', disabled() { return isAllRowsSelected() } },
            { key: 'row:above', name: '在上方插入行', disabled() { return getSelectedRows().length !== 1 } },
            { key: 'row:below', name: '在下方插入行', disabled() { return getSelectedRows().length !== 1 } },
          ]
        },
      },
      col: {
        name: '列操作',
        submenu: {
          items: [
            { key: 'col:delete', name: '删除选中列', disabled() { return isAllColumnsSelected() } },
            { key: 'col:left', name: '在左侧插入列', disabled() { return getSelectedColumns().length !== 1 }, },
            { key: 'col:right', name: '在右侧插入列', disabled() { return getSelectedColumns().length !== 1 } },
          ]
        },
      },
      data: {
        name: '数据操作',
        submenu: {
          items: [
            { key: 'data:get', name: '获取所有未知数据' },
            { key: 'data:get:row', name: '强制刷新行数据' },
            { key: 'data:add', name: '添加谱面信息...' },
            { key: 'data:download', name: '保存表格为xlsx文件' },
          ]
        }
      },
      split: { name: '---------' },
      alignment: { name: '单元格对齐' },
    }
  },


  // 双击表头编辑
  afterGetColHeader(col, th) {
    th.removeEventListener('dblclick', th._dblclickHandler)

    const dblclickHandler = () => {
      const oldHeader = hot.getColHeader(col)
      const input = document.createElement('input')
      input.type = 'text'
      input.value = oldHeader
      input.style.position = 'absolute'

      // 定位到表头
      const rect = th.getBoundingClientRect()
      input.style.left = rect.left + 'px'
      input.style.top = rect.top + 'px'
      input.style.width = rect.width + 'px'
      input.style.height = rect.height + 'px'
      input.style.zIndex = 9999

      document.body.appendChild(input)
      hot.deselectCell()
      input.focus()

      input.addEventListener('blur', () => {
        const newHeader = input.value.trim() || oldHeader
        const headers = hot.getSettings().colHeaders
        const physicalIndex = hot.toPhysicalColumn(col)
        headers[physicalIndex] = newHeader
        hot.updateSettings({ colHeaders: headers })
        document.body.removeChild(input)
      })

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur()
      })
    }

    th._dblclickHandler = dblclickHandler
    th.addEventListener('dblclick', dblclickHandler)
  }
}

//#region 功能函数(需要hot实例)
function getSelectedColumns() {
  const selectedRange = hot.getSelectedRange()
  const colsSet = new Set()
  const hiddenPlugin = hot.getPlugin('hiddenColumns')
  if (!selectedRange) return []

  selectedRange.forEach(range => {
    const fromCol = Math.min(range.from.col, range.to.col)
    const toCol = Math.max(range.from.col, range.to.col)
    for (let col = fromCol; col <= toCol; col++) {
      if (col !== -1 && !hiddenPlugin.isHidden(col)) colsSet.add(col)
    }
  })

  return Array.from(colsSet).sort((a, b) => a - b)
}

function getSelectedRows() {
  const selectedRange = hot.getSelectedRange()
  const rowsSet = new Set()
  if (!selectedRange) return []

  selectedRange.forEach(range => {
    const fromRow = Math.min(range.from.row, range.to.row)
    const toRow = Math.max(range.from.row, range.to.row)
    for (let row = fromRow; row <= toRow; row++) {
      if (row !== -1) rowsSet.add(row)
    }
  })

  return Array.from(rowsSet).sort((a, b) => a - b)
}

function isAllColumnsSelected() {
  const totalCols = hot.countCols()
  const hiddenPlugin = hot.getPlugin('hiddenColumns')

  let visibleCols = 0
  for (let col = 0; col < totalCols; col++) {
    if (!hiddenPlugin.isHidden(col)) visibleCols++
  }

  const selectedCols = getSelectedColumns()
  return selectedCols.length === visibleCols
}

function isAllRowsSelected() {
  return hot.countRows() === getSelectedRows().length
}
//#endregion

onMounted(() => {
  if (hotTable.value) {
    hot = hotTable.value.hotInstance

    // 隐藏列
    const plugin = hot.getPlugin('hiddenColumns')
    const hiddenIndexes = getFieldShows().reduce((indices, show, index) =>
      !show ? [...indices, index] : indices, []
    )
    plugin.hideColumns(hiddenIndexes)

    // 初始渲染
    hot.render()
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
