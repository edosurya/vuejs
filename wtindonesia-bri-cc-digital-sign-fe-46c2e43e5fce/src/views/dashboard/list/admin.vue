<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="Pencarian"
        suffix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.filter"
        placeholder="Role"
        clearable
        multiple
        class="filter-item"
        style="min-width: 300px"
      >
        <el-option v-for="item in listRoles" :key="item.key" :label="item.role" :value="item.role" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="info"
        icon="el-icon-search"
        @click="handleFilter"
      >Cari Data</el-button>

      <el-button-group class="filter-item">
        <el-button
          style="margin-left: 10px;"
          type="warning"
          icon="el-icon-document-add"
          @click="handleCreate"
        >Baru</el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          type="success"
          icon="el-icon-download"
          @click="handleDownload"
        >Export</el-button>
      </el-button-group>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="No"
        width="70px"
        align="center"
        sortable="custom"
        prop="no"
        :class-name="getSortClass('no')"
        class="hidden-sm-and-down"
      >
        <template slot-scope="{row}">
          <span>{{ row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Date"
        width="150px"
        align="center"
        sortable="custom"
        prop="createdAt"
        :class-name="getSortClass('createdAt')"
      >
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Name"
        min-width="150px"
        prop="name"
        sortable="custom"
        :class-name="getSortClass('name')"
      >
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="E-mail"
        width="200"
        align="left"
        prop="email"
        sortable="custom"
        :class-name="getSortClass('email')"
      >
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column
        label="Role"
        width="210"
        align="left"
        prop="roles"
        sortable="custom"
        :class-name="getSortClass('roles')"
      >
        <template slot-scope="scope">
          <template v-for="(role, i) in scope.row.roles">
            <el-tag
              v-if="role == 'Super'"
              :key="`role${i}`"
              type="danger"
              style="margin-left:0.2rem;"
            >{{ role }}</el-tag>
            <el-tag
              v-else-if="role == 'Inquiry'"
              :key="`role${i}`"
              type="primary"
              style="margin-left:0.2rem;"
            >{{ role }}</el-tag>
            <el-tag
              v-else-if="role == 'Process'"
              :key="`role${i}`"
              type="info"
              style="margin-left:0.2rem;"
            >{{ role }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-view" @click="handleUpdate(row)">Edit</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row,$index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Nama" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item v-if="dialogStatus === 'create'" label="Password" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item label="Role" prop="roles">
          <el-select
            v-model="temp.roles"
            style="width:100%;"
            class="filter-item"
            placeholder="Please select"
            multiple
          >
            <el-option
              v-for="item in listRoles"
              :key="item.key"
              :label="item.role"
              :value="item.role"
              clearable
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogDeleteData" title="Warning !" width="30%">
      <p>Apa kamu yakin akan menghapus data ini ?</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="actionDelete">Ya</el-button>
      </span>
    </el-dialog>

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
import { getAdmin, deleteAdmin, createAdmin, updateAdmin } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import orderBy from 'lodash/orderBy'
var moment = require('moment')
moment.locale()

export default {
  name: 'AdminList',
  components: { Pagination, BackToTop },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 25,
        search: null,
        orderBy: null,
        sort: 'asc',
        filter: null
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: 'Ascending', key: 'asc' },
        { label: 'Descending', key: 'desc' }
      ],
      listRoles: [
        // { key: '1', role: 'Super' },
        { key: '2', role: 'Inquiry' },
        { key: '3', role: 'Process' }
      ],
      statusAdmin: [
        { key: '1', role: 'Active' },
        { key: '0', role: 'Deactive' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        name: null,
        email: null,
        password: null,
        roles: []
      },
      dialogFormVisible: false,
      dialogDeleteData: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    roles() {
      return this.$store.state.user.roles
    }
  },
  mounted() {
    if (!this.roles.includes('Process')) {
      this.$router.push('/customer/list')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAdmin(this.$store.state.user.token, this.listQuery).then(response => {
        this.list = response.content
        this.list.forEach((item, i) => {
          item.no =
            this.listQuery.page * this.listQuery.limit -
            (this.listQuery.limit - 1) +
            i
        })
        this.total = response.totalElements
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.sortByProperties(prop, 'asc')
      } else if (order === 'descending') {
        this.sortByProperties(prop, 'desc')
      }
    },
    sortByProperties(prop, order) {
      if (prop === 'no') {
        this.list = orderBy(this.list, [prop], [order])
      } else {
        this.listQuery.orderBy = prop
        this.listQuery.sort = order
        this.handleFilter()
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAdmin(this.$store.state.user.token, this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Berhasil',
              message: 'Admin baru telah ditambahkan',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.listLoading = true
          updateAdmin(this.$store.state.user.token, tempData).then(response => {
            this.dialogFormVisible = false
            this.listLoading = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Data berhasil diubah',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.dialogDeleteData = true
      this.temp = Object.assign({}, row)
      this.temp.index = index
    },
    actionDelete() {
      deleteAdmin(this.$store.state.user.token, this.temp.id).then(response => {
        this.listLoading = false
        this.dialogDeleteData = false
        this.getList()
        this.$notify({
          title: 'Berhasil',
          message: `${this.temp.name} telah di hapus`,
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true

      import('@/vendor/Export2Excel').then(excel => {
        const date = moment().format('L')

        const tHeader = ['Tanggal Dibuat', 'Nama', 'Email', 'Roles']
        const filterVal = ['createdAt', 'name', 'email', 'roles']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `Export List Admin ${date}`
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'asc' : 'desc'
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  @media only screen and (max-width: 768px) {
    .el-dialog {
      width: 100%;
    }
  }
}
</style>
