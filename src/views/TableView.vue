<template>
  <div>
    <div class="handsontable" ref="hotContainer"></div>
  </div>
</template>

<script setup>
import Handsontable from 'handsontable'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-horizon.css'
import { ref, onMounted } from 'vue'
import { useFieldMapper } from '@/hook/useFieldMapper'
import { ElMessage } from 'element-plus'



const { mapObject, getFieldNames, getFieldShows } = useFieldMapper()
const hotContainer = ref(null)
let hotInstance = null


function visualIndexWithoutHidden_to_visualIndexWithHidden(visualIndexWithoutHidden) {
  // visualIndex从1开始，不包含隐藏列
  // getColHeader传入的索引是视觉索引，从0开始，包含隐藏列
  const hiddenColumns = hotInstance.getPlugin('hiddenColumns')
  const totalCols = hotInstance.countCols()
  let visibleCount = 0
  for (let col = 0; col < totalCols; col++) {
    if (!hiddenColumns.isHidden(col)) {
      visibleCount++
      if (visibleCount === visualIndexWithoutHidden) {
        return col
      }
    }
  }
  ElMessage.error('未知错误')
  return -1
}



onMounted(() => {
  hotInstance = new Handsontable(hotContainer.value, {
    colHeaders: getFieldNames(),
    rowHeaders: true,
    stretchH: 'all',
    width: '100%',
    height: 400,
    minCols: getFieldNames().length,
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
    hiddenColumns: {
      copyPasteEnabled: false,
    },
  })

  // 允许编辑表头
  hotInstance.addHook('afterRender', () => {
    if (!hotContainer.value) return // 防止 hotContainer.value 为空报错

    const headerElems = hotContainer.value.querySelectorAll('.ht_clone_top th')

    if (!headerElems.length) return // 防止 th 没渲染好报错

    headerElems.forEach((th, visualIndex) => {
      // 解绑之前事件，避免重复绑定
      th.ondblclick = null;

      th.ondblclick = (e) => {
        const trueVisualIndex = visualIndexWithoutHidden_to_visualIndexWithHidden(visualIndex)
        const oldHeader = hotInstance.getColHeader(trueVisualIndex)

        const input = document.createElement('input')
        input.type = 'text'
        input.value = oldHeader

        input.style.position = 'absolute'
        input.style.left = th.getBoundingClientRect().left + 'px'
        input.style.top = th.getBoundingClientRect().top + 'px'
        input.style.width = th.offsetWidth + 'px'
        input.style.height = th.offsetHeight + 'px'
        input.style.zIndex = 9999

        document.body.appendChild(input)
        // 切换焦点
        hotInstance.deselectCell()
        input.focus()


        input.addEventListener('blur', () => {
          const newHeader = input.value.trim() || oldHeader
          const headers = hotInstance.getSettings().colHeaders
          const physicalIndex = hotInstance.toPhysicalColumn(trueVisualIndex)
          headers[physicalIndex] = newHeader
          hotInstance.updateSettings({ colHeaders: headers })
          document.body.removeChild(input)
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur()
        })
      }
    })
  })


  // 隐藏不显示的列
  const plugin = hotInstance.getPlugin('hiddenColumns')
  const hiddenIndexes = getFieldShows().reduce((indices, show, index) =>
    !show ? [...indices, index] : indices, []);
  plugin.hideColumns(hiddenIndexes)

  hotInstance.render() // 初始渲染
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
