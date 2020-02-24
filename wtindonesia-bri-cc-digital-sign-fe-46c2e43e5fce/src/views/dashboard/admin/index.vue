<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group
      v-if="summary"
      :summary="summary"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart v-if="summary" :data="summary" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 24}"
        :xl="{span: 24}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <transaction-table :list="list" />
      </el-col>
      <!-- <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      >
        <todo-list />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      >
        <box-card />
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import { getCustomer } from '@/api/customer'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165, 10, 20, 30, 40, 50],
    actualData: [120, 82, 91, 154, 162, 140, 145, 10, 20, 30, 40, 50],
    horizontalVariabels: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140, 10, 20, 30, 40, 50],
    actualData: [180, 160, 151, 106, 145, 150, 130, 10, 20, 30, 40, 50],
    horizontalVariabels: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100, 10, 20, 30, 40, 50],
    actualData: [120, 90, 100, 138, 142, 130, 130, 10, 20, 30, 40, 50],
    horizontalVariabels: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160, 10, 20, 30, 40, 50],
    actualData: [120, 82, 91, 154, 162, 140, 130, 10, 20, 30, 40, 50],
    horizontalVariabels: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart,
    // RaddarChart,
    PieChart,
    BarChart,
    TransactionTable
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      summary: null,
      pieChartData: [
        { value: 100, name: 'In Progress' },
        { value: 150, name: 'Pending' },
        { value: 200, name: 'Complete' },
        { value: 50, name: 'Failed' }
      ],
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 9999,
        search: null,
        orderBy: null,
        sort: 'desc',
        filter: null
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getCustomer(this.$store.state.user.token, this.listQuery).then(
        response => {
          this.list = response.content
          let countPending = 0
          let countCompleted = 0
          let countInProgress = 0
          let countFailed = 0
          this.list.forEach((item, i) => {
            item.no =
              this.listQuery.page * this.listQuery.limit -
              (this.listQuery.limit - 1) +
              i

            item.title === 'pending'
              ? countPending++
              : item.status === 'completed'
                ? countCompleted++
                : item.status === 'failed'
                  ? countFailed++
                  : item.status === 'in progress'
                    ? countInProgress++
                    : ''
          })

          this.summary = [
            {
              name: 'Pending',
              title: 'Pending',
              icon: 'example',
              value: 0,
              type: 'newVisitis',
              class: 'icon-pending'
            },
            {
              name: 'In Progress',
              title: 'In Progress',
              icon: 'star',
              value: 0,
              type: 'messages',
              class: 'icon-in-progress'
            },
            {
              name: 'Completed',
              title: 'Completed',
              icon: 'skill',
              value: 0,
              type: 'purchases',
              class: 'icon-complete'
            },
            {
              name: 'Failed',
              title: 'Failed',
              icon: 'bug',
              value: 0,
              type: 'shoppings',
              class: 'icon-failed'
            }
          ]

          this.summary.forEach(item => {
            item.title === 'Pending'
              ? (item.value = countPending)
              : item.title === 'Completed'
                ? (item.value = countCompleted)
                : item.title === 'Failed'
                  ? (item.value = countFailed)
                  : item.title === 'In Progress'
                    ? (item.value = countInProgress)
                    : ''
          })

          this.total = response.totalElements
        }
      )
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
