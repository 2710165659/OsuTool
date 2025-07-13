<template>
  <div class="container">
    <div class="content">
      <h1 class="title">推图助手</h1>
      <p class="subtitle">根据BID批量获取谱面信息</p>

      <div class="action-area">
        <el-button type="primary" size="large" @click="$router.push('table')" class="action-button">
          立即使用
        </el-button>
      </div>

      <div class="section">
        <div class="tips-grid">
          <div class="tip-item">
            <span>本地xlsx文件和网页表格之间可以自由复制粘贴<br>行不够会自动添加新行</span>
            <el-image :src="tip1Img" class="tip-image" :preview-src-list="[tip1Img]"></el-image>
          </div>
          <div class="tip-item">
            <span>双击可编辑表头。表格可拖拽排序、调整列宽。<br>右键菜单可以插入、删除、对齐</span>
            <el-image :src="tip2Img" class="tip-image" :preview-src-list="[tip2Img]"></el-image>
          </div>
          <div class="tip-item">
            <span>右键菜单-数据操作-获取选中行数据<br>根据bid获取谱面信息</span>
            <el-image :src="tip3Img" class="tip-image" :preview-src-list="[tip3Img]"></el-image>
          </div>
          <div class="tip-item">
            <span>右键菜单-数据操作-添加谱面信息<br>可获取的谱面信息，一次获取自由添加</span>
            <el-image :src="tip4Img" class="tip-image" :preview-src-list="[tip4Img]"></el-image>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">其他待优化问题</h2>
        <ul class="unimplemented-list">
          <li class="unimplemented-item">列表里图片查看</li>
          <li class="unimplemented-item">下载表格</li>
          <li class="unimplemented-item">ctrl+z的部分bug</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import tip1Img from '@/assets/tip1.png'
import tip2Img from '@/assets/tip2.png'
import tip3Img from '@/assets/tip3.png'
import tip4Img from '@/assets/tip4.png'
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.content {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title {
  color: #303133;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 600;
}

.subtitle {
  color: #606266;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.action-area {
  text-align: center;
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  color: #303133;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ebeef5;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.tip-item {
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 100%;
}

.tip-item:hover {
  background-color: #ebedf0;
  transform: translateY(-2px);
}

.tip-image {
  margin-top: 0.8rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  max-height: 300px;
  display: block;
}

.unimplemented-list {
  list-style-type: none;
  padding-left: 1rem;
}

.unimplemented-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
  color: #909399;
}

.unimplemented-item::before {
  content: "•";
  color: #f56c6c;
  font-size: 1.5rem;
  position: absolute;
  left: 0;
  top: -0.2rem;
}

.action-button {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

@media (max-width: 768px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>