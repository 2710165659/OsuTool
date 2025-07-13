const integratedMap = {
  // 内部保留
  isDone: { name: "是否已完成", show: false },
  // 谱面信息
  id: { name: "谱面ID", show: true },
  mode: { name: "模式", show: false },
  status: { name: "状态", show: false },
  bpm: { name: "BPM", show: true },
  total_length: { name: "音频总时长(秒)", show: false },
  hit_length: { name: "游玩长度(秒)", show: false },
  url: { name: "谱面链接", show: false },
  // 谱面难度相关
  version: { name: "难度名称", show: false },
  difficulty_rating: { name: "难度星级", show: true },
  cs: { name: "CS", show: false },
  ar: { name: "AR", show: false },
  accuracy: { name: "OD", show: false },
  drain: { name: "HP", show: false },
  max_combo: { name: "最大连击数", show: false },
  count_circles: { name: "圆圈数", show: false },
  count_sliders: { name: "滑条数", show: false },
  count_spinners: { name: "转盘数", show: false },
  passcount: { name: "过关次数", show: false },
  playcount: { name: "游玩次数", show: false },

  // 谱面集信息
  "beatmapset.covers.list@2x": { name: "封面图", show: false },
  "beatmapset.id": { name: "谱面集ID", show: false },
  "beatmapset.title": { name: "歌曲标题", show: false },
  "beatmapset.title_unicode": { name: "歌曲标题(原语言)", show: true },
  "beatmapset.artist": { name: "歌曲艺术家", show: false },
  "beatmapset.artist_unicode": { name: "艺术家(原语言)", show: true },
  "beatmapset.bpm": { name: "谱面集BPM", show: false },
  "beatmapset.preview_url": { name: "试听链接", show: false },
  "beatmapset.creator": { name: "谱面集作者", show: true },
  "beatmapset.user_id": { name: "谱面集作者ID", show: false },
  "beatmapset.source": { name: "谱面集来源", show: false },
  "beatmapset.video": { name: "是否含视频", show: false },
  "beatmapset.storyboard": { name: "是否含故事板", show: false },
  "beatmapset.favourite_count": { name: "收藏数", show: false },
  "beatmapset.rating": { name: "谱面评分", show: false },
  "beatmapset.tags": { name: "标签", show: false },
  "beatmapset.submitted_date": { name: "提交日期", show: false },
  "beatmapset.last_updated": { name: "最后更新日期", show: false },
  "beatmapset.ranked_date": { name: "Ranked 日期", show: false }
}

// 功能函数：获取嵌套对象中的值
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key]
    }
    return undefined
  }, obj)
}



export function useFieldMapper() {

  /**
   * 将对象映射为按顺序的数组
   */
  function mapObject(obj) {
    const result = []
    for (const key of Object.keys(integratedMap)) {
      const value = getNestedValue(obj, key)
      if (typeof value !== "undefined") {
        result.push(value)
      } else {
        // 填充默认值
        result.push(key === "isDone" ? 1 : "")
      }
    }
    return result
  }

  /**
  * 按顺序返回所有字段的中文名称列表
  */
  function getFieldNames() {
    return Object.values(integratedMap).map(field => field.name)
  }

  /**
   * 按顺序返回所有字段的 show 状态列表
   */
  function getFieldShows() {
    return Object.values(integratedMap).map(field => field.show)
  }

  return {
    mapObject, getFieldNames, getFieldShows
  }
}

