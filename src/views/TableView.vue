<template>
  <div>
    <div class="handsontable" ref="hotContainer"></div>
    <el-button @click="test">测试</el-button>
  </div>
</template>

<script setup>
import Handsontable from 'handsontable'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-horizon.css'
import { reactive, ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'

const hotContainer = ref(null)
let hotInstance = null

const test = () => {
  // console.log(colHeaders)
  // console.log(tableData)
  colHeaders.push('aaa')
}

// 响应式数据
const alllHeaders = reactive([
  "难度星级",
  "谱面ID",
  "模式",
  "状态",
  "音频总时长(秒)",
  "难度名称",
  "OD",
  "AR",
  "BPM",
  "圆圈数",
  "滑条数",
  "转盘数",
  "CS",
  "HP",
  "游玩长度(秒)",
  "过关次数",
  "游玩次数",
  "谱面链接",
  "最大连击数",
  "谱面制作者",
  "作者ID",
  "作者用户名",
  "谱面集信息",
  "歌曲艺术家",
  "艺术家(原语言)",
  "封面图",
  "谱面集制作者",
  "收藏数",
  "谱面集ID",
  "试听链接",
  "歌曲标题",
  "歌曲标题(原语言)",
  "谱面集作者ID",
  "是否含视频",
  "谱面集BPM",
  "最后更新日期",
  "Ranked 日期",
  "谱面评分",
  "是否含故事板",
  "提交日期",
  "标签"
])

const initlHeaders = reactive(['谱面ID', '说明', '歌曲标题(原语言)', '艺术家(原语言)', '难度星级'])

onMounted(() => {
  hotInstance = new Handsontable(hotContainer.value, {
    colHeaders: initlHeaders, // 不是双向绑定
    rowHeaders: true,
    stretchH: 'all',
    width: '100%',
    height: 400,
    minCols: initlHeaders.length,
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


    // 表格列顺序变动时更新 colHeaders
    afterColumnMove(movedColumns, finalIndex, dropIndex, movePossible, orderChanged) {
      if (orderChanged && movePossible) {
        const newHeaders = this.getColHeader()
        console.log('newHeaders', newHeaders)
      }
    },
  })

  hotInstance.addHook('afterRender', () => {
    if (!hotContainer.value) return; // 防止 hotContainer.value 为空报错

    const headerElems = hotContainer.value.querySelectorAll('.ht_clone_top th');
    if (!headerElems.length) return; // 防止 th 没渲染好报错

    headerElems.forEach((th, index) => {
      // 解绑之前事件，避免重复绑定
      th.ondblclick = null;

      th.ondblclick = (e) => {
        const oldHeader = hotInstance.getColHeader(index - 1);
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
          const physicalIndex = hotInstance.toPhysicalColumn(index - 1) // 列索引
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




})

</script>

<style scoped>
.handsontable .ht_clone_top th {
  font-weight: bold;
}

.handsontable .ht_clone_left th {
  font-weight: bold;
}
</style>
