<template>
  <div>
    <el-button @click="test">Test</el-button>
  </div>
</template>

<script setup>
import useGetBeatmapInfo from '@/hooks/useGetBeatmapInfo';

const getBeatmapInfo = useGetBeatmapInfo()
const test = async () => {
  const resp = await getBeatmapInfo(4962250)
  console.log(resp)
  if (resp) {
    console.log('Beatmap Info:', resp);
  } else {
    console.error('Failed to fetch beatmap info');
  }
}
</script>

<style scoped></style>
