<template>
  <div class="dashboard-container">
    <component :is="currentRole" />

    <el-tooltip placement="top" content="Scroll ke atas">
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import BackToTop from '@/components/BackToTop'
export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, BackToTop },
  data() {
    return {
      currentRole: 'adminDashboard',
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    if (!this.roles.includes('Super')) {
      // this.currentRole = 'editorDashboard'
    }
  }
}
</script>
