// useFieldMapper.js

const beatmapInfoMap = {
  difficulty_rating: "难度星级",
  id: "谱面ID",
  mode: "模式",
  status: "状态",
  total_length: "音频总时长(秒)",
  version: "难度名称",
  accuracy: "OD",
  ar: "AR",
  bpm: "BPM",
  count_circles: "圆圈数",
  count_sliders: "滑条数",
  count_spinners: "转盘数",
  cs: "CS",
  drain: "HP",
  hit_length: "游玩长度(秒)",
  passcount: "过关次数",
  playcount: "游玩次数",
  url: "谱面链接",
  max_combo: "最大连击数",

  owners: "谱面制作者",
  "owners[].id": "作者ID",
  "owners[].username": "作者用户名",

  beatmapset: "谱面集信息",
  "beatmapset.artist": "歌曲艺术家",
  "beatmapset.artist_unicode": "艺术家(原语言)",
  "beatmapset.covers.list@2x": "封面图", // 直接拿 list@2x，不要嵌套
  "beatmapset.creator": "谱面集制作者",
  "beatmapset.favourite_count": "收藏数",
  "beatmapset.id": "谱面集ID",
  "beatmapset.preview_url": "试听链接",
  "beatmapset.title": "歌曲标题",
  "beatmapset.title_unicode": "歌曲标题(原语言)",
  "beatmapset.user_id": "谱面集作者ID",
  "beatmapset.video": "是否含视频",
  "beatmapset.bpm": "谱面集BPM",
  "beatmapset.last_updated": "最后更新日期",
  "beatmapset.ranked_date": "Ranked 日期",
  "beatmapset.rating": "谱面评分",
  "beatmapset.storyboard": "是否含故事板",
  "beatmapset.submitted_date": "提交日期",
  "beatmapset.tags": "标签"
}

// 工具函数：根据路径获取嵌套值
function getNestedValue(obj, path) {
  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (part.endsWith('[]')) {
      const key = part.replace('[]', '')
      if (!Array.isArray(current[key])) return undefined
      // 递归处理数组里的对象
      return current[key].map(item =>
        getNestedValue(item, parts.slice(parts.indexOf(part) + 1).join('.'))
      )
    } else {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        return undefined
      }
    }
  }
  return current
}

// Hook：返回映射函数
export function useFieldMapper() {
  function mapObject(obj) {
    const result = {}

    for (const englishKey in beatmapInfoMap) {
      const chineseKey = beatmapInfoMap[englishKey]
      const value = getNestedValue(obj, englishKey)

      if (value !== undefined) {
        result[chineseKey] = value
      } else {
        result[chineseKey] = '' // 缺失字段补''
      }
    }

    return result
  }

  return {
    mapObject
  }
}
