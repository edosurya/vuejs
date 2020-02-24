<template>
  <div class="mobile-table">
    <div class="hidden-md-and-up table-const">
      <el-row class="row-nopad-nomar" :gutter="20">
        <el-col class="col-nopad-nomar">
          <el-checkbox v-model="selectRow[number]" :label="item.id" class="transparent-text" />
        </el-col>
      </el-row>

      <el-row class="row-nopad-nomar" :gutter="20">
        <el-col class="col-nopad-nomar" :sm="6" :xs="8">No</el-col>
        <el-col class="col-nopad-nomar" :sm="18" :xs="16">{{ number + 1 }}</el-col>
      </el-row>
      <el-row class="row-nopad-nomar" :gutter="20">
        <el-col class="col-nopad-nomar" :sm="6" :xs="8">Nama</el-col>
        <el-col class="col-nopad-nomar" :sm="18" :xs="16">{{ item.name }} / {{ item.phone }}</el-col>
      </el-row>
      <el-row class="row-nopad-nomar" :gutter="20">
        <el-col class="col-nopad-nomar" :sm="6" :xs="8">Document</el-col>
        <el-col class="col-nopad-nomar" style="display:block;" :sm="18" :xs="16">
          <el-dropdown
            size="mini"
            split-button
            type="warning"
            trigger="click"
            @click="downloadAsZip"
            @command="showDocument"
          >
            Download All
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-user"
                :disabled="!item.Document.ktp ? true:false"
                :command="{url: item.Document.ktp, type: 'ktp'}"
              >KTP</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-camera"
                :disabled="!item.Document.selfie ?true:false"
                :command="{url: item.Document.selfie, type:'selfie'}"
              >Selfie</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-picture"
                :disabled="!item.Document.npwp ?true:false"
                :command="{url: item.Document.npwp, type: 'npwp'}"
              >NPWP</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-coin"
                :disabled="!item.Document.salarySlip ?true:false"
                :command="{url: item.Document.salarySlip, type: 'slip-gaji'}"
              >Slip Gaji</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-s-order"
                :disabled="!item.Document.document?true:false"
                :command="{url: item.Document.document, type:'ttd'}"
              >Tanda Tangan</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <el-row class="row-nopad-nomar" :gutter="20">
        <el-col class="col-nopad-nomar" :sm="6" :xs="8">Status</el-col>
        <el-col class="col-nopad-nomar" style="display:block;" :sm="18" :xs="16">
          <el-tag
            :type="`${item.status == 'failed'?'el-tag--danger':''}
                      ${item.status == 'in progress'? 'el-tag--primary':''}
                      ${item.status == 'pending'? 'el-tag--info':''}
                      ${item.status == 'complete'? 'el-tag--success':''}`"
            style="margin-left:0.2rem;text-transform:uppercase;"
          >{{ item.status }} - {{ item.Steps[0].step }}</el-tag>
        </el-col>
      </el-row>

      <el-row class="row-nopad-nomar" :gutter="20">
        <el-col class="col-nopad-nomar" :sm="6" :xs="8">Action</el-col>
        <el-col class="col-nopad-nomar" :sm="18" :xs="16">
          <el-button-group>
            <el-tooltip
              v-if="roles.includes('Process')"
              class="item"
              effect="dark"
              placement="bottom"
              :content="`Kirim sms kepada ${item.name}`"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-message"
                @click="handleSMS(item)"
              >SMS</el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom"
              :content="`Lihat detail data ${item.name}`"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-view"
                @click="handleUpdate(item)"
              />
            </el-tooltip>
            <el-tooltip
              v-if="roles.includes('Process')"
              class="item"
              effect="dark"
              content="Delete Data"
              placement="bottom"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(item,number-1)"
              />
            </el-tooltip>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
const cityOptions = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']
export default {
  name: 'MobileTable',
  props: [
    'item',
    'roles',
    'number',
    'selectRow',
    'showDocument',
    'downloadAsZip',
    'handleUpdate',
    'handleSMS',
    'handleDelete'
  ],
  data() {
    return {
      checkAll: false,
      checkedCities: ['Shanghai', 'Beijing'],
      cities: cityOptions,
      isIndeterminate: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .transparent-text {
    .el-checkbox__label {
      color: transparent;
    }
  }
  .table-const {
    border: 1px solid #dfe6ec;
    border-bottom: 0px;
    border-left: 0px;
    margin-top: 1rem;

    .row-nopad-nomar {
      padding: 0rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #dfe6ec;
      margin: 0 !important;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .col-nopad-nomar {
      padding: 0.5rem !important;
      border-left: 1px solid #dfe6ec;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
