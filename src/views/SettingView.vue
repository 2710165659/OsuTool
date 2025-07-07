<template>
  <div class="setting-container">
    <el-card shadow="hover" class="setting-card">
      <div class="header">
        <el-button type="text" @click="goHome" class="back-btn">
          <el-icon>
            <ArrowLeft />
          </el-icon>
          返回主页
        </el-button>
        <h2>请输入 osu! API 信息</h2>
      </div>
      <el-form label-width="100px" class="setting-form">
        <el-form-item label="client_id:">
          <el-input type="password" v-model="clientId" placeholder="输入 client_id" />
        </el-form-item>

        <el-form-item label="client_secret:">
          <el-input type="password" v-model="clientSecret" placeholder="输入 client_secret" />
        </el-form-item>
      </el-form>
      <div class="button-group">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const clientId = ref(localStorage.getItem('client_id') || '')
const clientSecret = ref(localStorage.getItem('client_secret') || '')

function save() {
  localStorage.setItem('client_id', clientId.value)
  localStorage.setItem('client_secret', clientSecret.value)
  ElMessage.success('已保存！')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.setting-container {
  max-width: 600px;
  margin: 80px auto;
  transition: all 0.3s ease;
}

.setting-card {
  padding: 20px;
  border-radius: 8px;
}

.header {
  margin-bottom: 24px;
  position: relative;
}

h2 {
  text-align: center;
  color: var(--el-color-primary);
  margin: 16px 0 32px;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 0;
  color: var(--el-color-primary);
}

.setting-form {
  margin: 0 auto;
}

.button-group {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.el-button {
  width: 120px;
}
</style>
