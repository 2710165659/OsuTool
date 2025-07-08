<template>
  <div>
    <el-input v-model="bid" placeholder="请输入bid"></el-input>
    <el-button @click="getBeatmapInfoById(bid)">getBeatmap</el-button>

  </div>
</template>

<script setup>
import useGetBeatmapInfo from '@/hooks/useGetBeatmapInfo'
import useGetToken from '@/hooks/useGetToken'
import { ref } from 'vue'


const bid = ref(4962250)
const getBeatmapInfo = useGetBeatmapInfo()
const getToken = useGetToken()


const getBeatmapInfoById = async (bid) => {
  try {
    const resp = await getBeatmapInfo(bid)
    console.log(resp)
  }
  catch (error) {
    if (error.response.status === 401) {
      try {
        await getToken()
        getBeatmapInfoById(bid)
      }
      catch (error) {
        ElMessage.error('client_id或client_secret错误')
      }
    } else {
      ElMessage.error('获取谱面信息失败,请检查bid')
    }
  }
}

</script>

<style scoped></style>
