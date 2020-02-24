<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="No" min-width="77">
      <template slot-scope="scope">{{ scope.row.no }}</template>
    </el-table-column>
    <el-table-column label="Date" min-width="200">
      <template slot-scope="scope">{{ scope.row.createdAt | moment("D/MM/YYYY") }}</template>
    </el-table-column>
    <el-table-column label="Nama" width="195" align="left">
      <template slot-scope="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <el-table-column label="Phone" width="300" align="left">
      <template slot-scope="scope">{{ scope.row.phone }}</template>
    </el-table-column>
    <el-table-column label="Status" width="200" align="center">
      <template slot-scope="scope">
        <el-tag
          :type="`${scope.row.status == 'failed'?'el-tag--danger':''}
                      ${scope.row.status == 'in progress'? 'el-tag--primary':''}
                      ${scope.row.status == 'pending'? 'el-tag--info':''}
                      ${scope.row.status == 'complete'? 'el-tag--success':''}`"
          style="margin-left:0.2rem;text-transform:uppercase; overflow:hidden;width:90%;"
        >{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { transactionList } from "@/api/remote-search";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: ['list'],
  data() {
    return {
      // list: null
    }
  },
  created() {
    // this.fetchData();
  },
  methods: {
    // fetchData() {
    //   transactionList().then(response => {
    //     this.list = response.data.items.slice(0, 8);
    //   });
    // }
  }
}
</script>
