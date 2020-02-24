<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse-transition>
        <div v-if="isFilter" class="filter-component transition-box">
          <div class="header-filter" />
          <div class="body-filter">
            <el-row :gutter="20" style="margin-bottom:1rem;">
              <el-col :xs="12" :sm="8">
                <el-radio-group v-model="filterRadio">
                  <el-radio-button label="Date" />
                  <el-radio-button label="Customer" />
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <template v-if="filterRadio === 'Customer'">
                <el-col :xs="12" :sm="8">
                  <p>Name</p>
                  <el-input
                    v-model="listQuery.searchName"
                    placeholder="Name"
                    style="width: 100%;"
                    class="filter-item"
                  />
                </el-col>

                <el-col :xs="12" :sm="8">
                  <p>NIK</p>
                  <el-input
                    v-model="listQuery.searchNik"
                    placeholder="NIK"
                    style="width: 100%;"
                    class="filter-item"
                  />
                </el-col>

                <el-col :xs="12" :sm="8">
                  <p>Phone Number</p>
                  <el-input
                    v-model="listQuery.searchPhone"
                    placeholder="Phone Number"
                    style="width: 100%;"
                    class="filter-item"
                  />
                </el-col>
              </template>

              <template v-else>
                <el-col :xs="12" :sm="8">
                  <p>Date</p>
                  <el-date-picker
                    v-model="filterDate"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="-"
                    start-placeholder="Awal Tanggal"
                    end-placeholder="Akhir Tanggal"
                    align="right"
                    class="filter-item"
                    style="width:100%;"
                  />
                </el-col>

                <el-col :xs="12" :sm="8">
                  <p>Status</p>
                  <el-select
                    v-model="listQuery.filter"
                    placeholder="Status"
                    clearable
                    multiple
                    class="filter-item"
                    style="width:100%;"
                  >
                    <el-option
                      v-for="item in listStatus"
                      :key="item.key"
                      style="text-transform: capitalize;"
                      :label="item.status"
                      :value="item.status"
                    />
                  </el-select>
                </el-col>

                <el-col :xs="12" :sm="8">
                  <p>Step</p>
                  <el-select
                    v-model="listQuery.step"
                    placeholder="Step"
                    clearable
                    multiple
                    class="filter-item"
                    style="width:100%;"
                  >
                    <el-option
                      v-for="item in listStep"
                      :key="item.key"
                      style="text-transform: capitalize;"
                      :label="item.step"
                      :value="item.step"
                    />
                  </el-select>
                </el-col>
              </template>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <p>Kelengkapan Dokumen</p>
                <el-checkbox-group v-model="checkList" class="filter-item">
                  <el-checkbox label="KTP" />
                  <el-checkbox label="Selfie" />
                  <el-checkbox label="NPWP" />
                  <el-checkbox label="Slip Gaji" />
                  <el-checkbox label="Tanda Tangan" />
                </el-checkbox-group>
              </el-col>
            </el-row>
          </div>
          <el-divider />
          <div class="footer-filter">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button
                  v-waves
                  class="filter-item"
                  icon="el-icon-refresh"
                  style="float:right"
                  @click="resetFilter"
                >Reset Filter</el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  v-waves
                  class="filter-item"
                  type="primary"
                  icon="el-icon-cold-drink"
                  @click="handleFilter"
                >Set Filter</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-collapse-transition>

      <el-row :gutter="20">
        <el-col :xs="24" :lg="10">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-button-group v-if="roles.includes('Process')" class="filter-item">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Buat customer baru"
                  placement="bottom"
                >
                  <el-button type="warning" icon="el-icon-document-add" @click="handleCreate">New</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Export Excel" placement="bottom">
                  <el-button type="success" icon="el-icon-download" @click="handleDownload">Export</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Import Excel" placement="bottom">
                  <el-button type="success" icon="el-icon-upload" @click="handleUpload">Import</el-button>
                </el-tooltip>
              </el-button-group>

              <el-tooltip
                class="item filter-item"
                effect="dark"
                content="Filter"
                placement="bottom"
              >
                <el-button v-if="!isFilter" @click="showFilter">
                  <font-awesome-icon icon="filter" />&nbsp;Filter
                </el-button>
                <el-button v-else @click="showFilter">
                  <font-awesome-icon icon="filter" />&nbsp;Tutup Filter
                </el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="24" class="action-auto">
              <!-- <el-tooltip
                effect="dark"
                :content="checkedAll?'Uncheck All': 'Select All'"
                placement="bottom"
              >
                <el-button
                  size="mini"
                  :icon=" !checkedAll?'el-icon-check':'el-icon-remove-outline'"
                  @click="selectAllRow"
                >{{ labelCheck }}</el-button>
              </el-tooltip> -->
              <el-select
                v-model="bulkBlast"
                size="mini"
                placeholder="Bulk List"
                class="filter-item"
              >
                <el-option
                  v-for="item in bulkList"
                  :key="item.key"
                  style="text-transform: capitalize;"
                  :label="item.created"
                  :value="item.key"
                />
              </el-select>
              <el-tooltip effect="dark" content="Blast All SMS" placement="bottom">
                <el-button
                  v-show="bulkBlast != ''"
                  size="mini"
                  :type="`${multipleSelection.length > 1?'primary':''}`"
                  icon="el-icon-message"
                  style="vertical-align:top"
                  @click="blastSms"
                >Blast SMS</el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-col>

        <el-col :xs="24" :lg="14">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="6">
              <el-input
                v-model="listQuery.searchName"
                suffix-icon="el-icon-search"
                placeholder="Cari Nama"
                style="width: 100%;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
            </el-col>
            <el-col :xs="24" :sm="6">
              <el-input
                v-model="listQuery.searchPhone"
                suffix-icon="el-icon-search"
                placeholder="Cari No. HP"
                style="width: 100%;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
            </el-col>
            <el-col :xs="24" :sm="6">
              <el-input
                v-model="listQuery.searchNik"
                suffix-icon="el-icon-search"
                placeholder="Cari No. KTP"
                style="width: 100%;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
            </el-col>
            <el-col :xs="24" :sm="6">
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                style="width:100%;"
                @click="handleFilter"
              >Search</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <MobileTable
      v-for="(item, index) in list"
      :key="`list-table-${index}`"
      :item="item"
      :number="index"
      :roles="roles"
      :select-row="selectRow"
      :show-document="showDocument"
      :download-as-zip="downloadAsZip"
      :handle-update="handleUpdate"
      :handle-s-m-s="handleSMS"
    />

    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      class="hidden-sm-and-down"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" align="center" />

      <el-table-column
        label="Tanggal"
        width="100px"
        align="center"
        sortable="custom"
        prop="createdAt"
        :class-name="getSortClass('createdAt')"
      >
        <template slot-scope="{row}">
          <span>{{ row.createdAt | moment("D/MM/YYYY") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Nama / No Hp"
        min-width="120px"
        prop="name"
        sortable="custom"
        :class-name="getSortClass('name')"
      >
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}<br>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Dokumen" min-width="140" align="center">
        <template slot-scope="{row}">
          <el-dropdown
            v-show="row.hasDocument"
            size="mini"
            split-button
            type="warning"
            trigger="click"
            @click="downloadAsZip(row.id, row.name)"
            @command="showDocument"
          >
            Download All
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-user"
                :disabled="!row.Document.ktp ? true:false"
                :command="{url: row.Document.ktp, type: 'ktp'}"
              >KTP</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-camera"
                :disabled="!row.Document.selfie ?true:false"
                :command="{url: row.Document.selfie, type:'selfie'}"
              >Selfie</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-picture"
                :disabled="!row.Document.npwp ?true:false"
                :command="{url: row.Document.npwp, type: 'npwp'}"
              >NPWP</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-coin"
                :disabled="!row.Document.salarySlip ?true:false"
                :command="{url: row.Document.salarySlip, type: 'slip-gaji'}"
              >Slip Gaji</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-s-order"
                :disabled="!row.Document.document?true:false"
                :command="{url: row.Document.document, type:'ttd'}"
              >Tanda Tangan</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button-group v-show="!row.hasDocument">
            <el-button size="mini" type="warning" disabled>
              Download All
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-arrow-down" style="padding-left:8px;padding-right:8px" disabled />
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        min-width="230"
        align="center"
        prop="status"
        sortable="custom"
        :class-name="getSortClass('status')"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.Steps.length > 0">
            <el-tag
              :type="`${scope.row.status == 'failed'?'el-tag--danger':''}
                      ${scope.row.status == 'in progress'? 'el-tag--primary':''}
                      ${scope.row.status == 'pending'? 'el-tag--info':''}
                      ${scope.row.status == 'complete'? 'el-tag--success':''}`"
              style="margin-left:0.2rem;text-transform:uppercase; width:90%;overflow:hidden"
            >
              {{ scope.row.status }} -
              <span
                style="text-transform:uppercase;"
              >{{ scope.row.Steps[0].step }}</span>
            </el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button-group>
            <el-tooltip
              v-if="roles.includes('Process')"
              class="item"
              effect="dark"
              :content="`Kirim sms kepada ${row.name}`"
              placement="bottom"
            >
              <el-button
                :disabled="multipleSelection.length > 1 ? true:false"
                type="success"
                size="mini"
                icon="el-icon-message"
                @click="handleSMS(row)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="`Lihat detail data ${row.name}`"
              placement="bottom"
            >
              <el-button
                :disabled="multipleSelection.length > 1 ? true:false"
                type="primary"
                size="mini"
                icon="el-icon-view"
                @click="handleUpdate(row)"
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
                v-if="row.status!='deleted'"
                :disabled="multipleSelection.length > 1 ? true:false"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(row,$index)"
              />
            </el-tooltip>
          </el-button-group>
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      style="margin-top:-3rem; width:100%;"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin:10px 50px;"
        status-icon
      >
        <el-form-item label="Nama" prop="name">
          <el-input
            v-model="temp.name"
            minlength="4"
            show-word-limit
            autocomplete="off"
            maxlength="30"
          />
        </el-form-item>

        <el-form-item label="Nomor HP" prop="phone">
          <el-input v-model="temp.phone" autocomplete="off" maxlength="13" minlength="9" @keypress.native="isNumber" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" autocomplete="off" />
        </el-form-item>

        <el-form-item label="Nomor KTP" prop="nik">
          <el-input
            v-model="temp.nik"
            maxlength="16"
            minlength="15"
            show-word-limit
            autocomplete="off"
            @keypress.native="isNumber"
          />
        </el-form-item>

        <el-form-item label="Tempat Lahir" prop="pob">
          <el-input v-model="temp.pob" autocomplete="off" minlength="2" maxlength="20" />
        </el-form-item>

        <el-form-item label="Tanggal Lahir" prop="dob">
          <el-date-picker
            v-model="temp.dob"
            style="width:100%;"
            type="date"
            placeholder="Tanggal Lahir"
          />
        </el-form-item>

        <el-form-item label="Jenis Kelamin" prop="gender">
          <el-radio v-model="temp.gender" label="M">Laki - Laki</el-radio>
          <el-radio v-model="temp.gender" label="F">Perempuan</el-radio>
        </el-form-item>

        <el-divider />

        <div
          v-if="dialogStatus !== 'create'"
          style="font-weight:600; font-size:18px; text-align:center; margin-bottom:2rem;"
        >
          Tracking Step
          <el-tag
            :type="`${temp.status == 'failed'?'el-tag--danger':''}
                      ${temp.status == 'in progress'? 'el-tag--primary':''}
                      ${temp.status == 'pending'? 'el-tag--info':''}
                      ${temp.status == 'complete'? 'el-tag--success':''}`"
            style="margin-left:0.2rem;text-transform:uppercase;"
          >{{ temp.status }}</el-tag>
        </div>

        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(item, i) in step_temp"
              :key="`stepper-${i}`"
              :timestamp="item.createdAt != '' ? $moment(item.createdAt).format('dddd, MMMM Do YYYY') : null"
              placement="top"
            >
              <el-card>
                <p>
                  <b style="text-transform:uppercase;">{{ item.step }}</b> : {{ $moment(item.time).format('HH:mm:ss') }}
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >Konfirmasi</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogUploadFile" title="Import File" width="40%">
      <el-row :gutter="20">
        <el-col :span="24" style="display:flex;align-items:center;justify-content:center;">
          <el-upload
            ref="import"
            class="upload-demo"
            :headers="{'Authorization': `Bearer ${userToken}`}"
            :on-success="successImportExcel"
            drag
            :multiple="false"
            :auto-upload="false"
            :file-list="fileList"
            accept=".xls, .xlsx, .csv"
            name="bulk"
            :action="base_url + '/bulk/customer'"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              Drop file here or
              <em>click to upload</em>
            </div>
            <div slot="tip" class="el-upload__tip">File hanya bisa berupa .xlsx .xls atau .csv</div>
          </el-upload>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="actionImportExcel">Import</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogSendSMS" title="Kirim SMS">
      <p>Anda yakin akan mengirim SMS Link ke customer ini ?</p>

      <el-row :gutter="20">
        <el-col :span="10">
          <p>Nama</p>
        </el-col>
        <el-col :span="14">
          <p style="text-transform:uppercase;">: {{ temp.name }}</p>
        </el-col>

        <el-col :span="10">
          <p>Nomor Handphone</p>
        </el-col>
        <el-col :span="14">
          <p style="text-transform:uppercase;font-weight:600;">: {{ temp.phone }}</p>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="actionSendSMS">Konfirmasi</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogDeleteData" title="Warning !" width="30%">
      <p>Apa kamu yakin akan menghapus data ini ?</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="actionDelete">Ya</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogDocumentVisible" style="padding:1rem;" title="Document">
      <img style="width:100%;" :src="path_document" alt>
      <el-button style="margin-top:0.5rem; margin-right:1.5rem; float:right;" type="danger">
        <el-link :href="path_document" style="color:#fff;" target="_blank">Download</el-link>
      </el-button>
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
import BackToTop from '@/components/BackToTop'
import MobileTable from '@/components/MobileTable/MobileTable'
import 'element-ui/lib/theme-chalk/display.css'
import {
  getCustomer,
  createCustomer,
  updateCustomer,
  sendSMSLink,
  deleteCustomer,
  getBulkList,
  blastBulk,
  downloadAll
} from '@/api/customer'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import orderBy from 'lodash/orderBy'
var moment = require('moment')
moment.locale()

export default {
  name: 'CustomerList',
  components: { Pagination, BackToTop, MobileTable },
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
      base_url: `${process.env.VUE_APP_BASE_API}`,
      userToken: this.$store.state.user.token,
      path_document: '',
      dialogDocumentVisible: false,
      multipleSelection: [],
      checkList: [],
      bulkList: [],
      filterBulk: '',
      bulkBlast: '',
      fileList: [],
      selectRow: [],
      checkedAll: false,
      labelCheck: 'Select All',
      filterRadio: 'Date',
      pickerOptions: {
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      filterDate: '',
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
        limit: 20,
        search: null,
        searchName: null,
        searchPhone: null,
        searchNik: null,
        orderBy: null,
        sort: 'desc',
        filter: null,
        step: null
      },
      listStatus: [
        { key: '1', status: 'pending' },
        { key: '2', status: 'in progress' },
        { key: '3', status: 'completed' },
        { key: '4', status: 'failed' }
      ],
      listStep: [
        { key: '1', step: 'create' },
        { key: '2', step: 'create bulk' },
        { key: '3', step: 'send email' },
        { key: '4', step: 'send sms' },
        { key: '5', step: 'send sms bulk' },
        { key: '6', step: 'open link upload' },
        { key: '7', step: 'upload' }
      ],
      temp: {
        name: null,
        phone: null,
        email: null,
        password: null,
        gender: null,
        pob: null,
        dob: null
      },
      step_temp: [],
      dialogFormVisible: false,
      dialogDeleteData: false,
      dialogSendSMS: false,
      dialogUploadFile: false,
      dialogStatus: '',
      textMap: {
        update: 'Ubah',
        create: 'Buat',
        show: 'View'
      },
      rules: {
        nik: [
          {
            required: true,
            message: 'Nomor KTP tidak boleh kosong',
            trigger: 'blur'
          },
          // {
          //   type: "number",
          //   message: "Nomor KTP harus berupa angka",
          //   trigger: "blur"
          // },
          {
            min: 15,
            max: 16,
            message: 'Nomor KTP tidak valid',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: 'Nama tidak boleh kosong',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: 'Nama minimal 2 - 30 karakter',
            trigger: 'blur'
          }
        ],
        pob: [
          {
            required: true,
            message: 'Tempat lahir tidak boleh kosong',
            trigger: 'blur'
          }
        ],
        dob: [
          {
            required: true,
            message: 'Tanggal lahir tidak boleh kosong',
            trigger: 'blur'
          }
        ],
        gender: [
          {
            required: true,
            message: 'Jenis kelamin tidak boleh kosong',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'Email tidak boleh kosong',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Format Email tidak valid',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: 'Nomor handphone tidak boleh kosong',
            trigger: 'blur'
          },
          // {
          //   type: "number",
          //   message: "Nomor handphone harus berupa angka",
          //   trigger: "blur"
          // },
          {
            min: 9,
            max: 13,
            message: 'Nomor Handphone tidak valid',
            trigger: 'blur'
          }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    roles() {
      return this.$store.state.user.roles
    },
    isFilter: {
      get() {
        return this.$store.state.settings.showFilter
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showFilter',
          value: val
        })
      }
    }
  },
  watch: {
    filterDate: function(val) {
      this.listQuery.startDate = val[0]
      this.listQuery.endDate = val[1]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    isNumber: function(evt) {
      evt = evt || window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    downloadAsZip(id, name) {
      downloadAll(this.$store.state.user.token, id).then(
        response => {
          var blob = new Blob([response], { type: 'application' })
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = name + ' Dokumen.zip'
          link.click()
        }
      )
    },
    downloadTTD(path) {
      window.open(path, '_blank')
    },
    showDocument(data) {
      if (data.type === 'ttd') {
        this.downloadTTD(data.url)
      } else {
        this.dialogDocumentVisible = true
        if (this.path_document !== data.url) {
          this.path_document = data.url
        } else {
          this.path_document = ''
          this.path_document = data.url
        }
      }
    },
    selectAllRow() {
      this.checkedAll = !this.checkedAll
      if (this.checkedAll) {
        this.labelCheck = 'Unchek All'
        this.list.forEach(item => {
          this.selectRow.push(true)
          this.$refs.multipleTable.toggleRowSelection(item)
        })
      } else {
        this.labelCheck = 'Select All'
        this.selectRow = []
        this.$refs.multipleTable.clearSelection()
      }
    },
    handlePreview() {},
    handleRemove() {},
    showFilter() {
      this.$store.dispatch('settings/changeSetting', {
        key: 'showFilter',
        value: !this.isFilter
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length === this.list.length) {
        this.checkedAll = true
        this.labelCheck = 'Unchek All'
      } else {
        this.checkedAll = true
        this.labelCheck = 'Select All'
      }
    },
    handleSMS(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogSendSMS = true
    },
    getList() {
      this.listLoading = true
      this.getBulk()
      getCustomer(this.$store.state.user.token, this.listQuery).then(
        response => {
          this.list = response.content
          this.list.forEach((item, i) => {
            item.no =
              this.listQuery.page * this.listQuery.limit -
              (this.listQuery.limit - 1) +
              i

            if (!item.Document) {
              item.hasDocument = false
              item.Document = {
                ktp: null,
                selfie: null,
                npwp: null,
                salarySlip: null,
                document: null
              }
            } else {
              item.hasDocument = true
              item.Document = {
                ktp: `${process.env.VUE_APP_BASE_API}${item.Document.ktp}`,
                selfie: `${process.env.VUE_APP_BASE_API}${item.Document.selfie}`,
                npwp: `${process.env.VUE_APP_BASE_API}${item.Document.npwp}`,
                salarySlip: `${process.env.VUE_APP_BASE_API}${item.Document.salarySlip}`,
                document: `${process.env.VUE_APP_BASE_API}${item.Document.document}`
              }
            }
            console.log(item)
          })
          this.total = response.totalElements
          this.listLoading = false
        }
      )
    },
    resetFilter() {
      this.filterDate = ''
      this.checkList = []
      this.listQuery = {
        page: 1,
        limit: 20,
        search: null,
        orderBy: null,
        sort: 'desc',
        filter: null,
        step: null,
        searchName: null,
        searchNik: null,
        searchPhone: null
      }
    },
    getBulk() {
      var _vm = this
      getBulkList(this.$store.state.user.token).then(
        response => {
          var data = response
          if (data.length === 0) {
            _vm.bulkList = []
          }
          data.forEach((item, i) => {
            var date = moment(item.createdAt).format('MMMM Do YYYY, HH:mm:ss')
            _vm.bulkList[i] = { key: item.id, created: date }
          })
        }
      )
    },
    blastSms() {
      var _vm = this
      if (_vm.bulkBlast === '') {
        return false
      }
      blastBulk(this.$store.state.user.token, _vm.bulkBlast).then(
        response => {
          if (response.success) {
            _vm.$notify({
              title: 'Berhasil',
              message: `SMS Berhasil Dikirimkan`,
              type: 'success',
              duration: 2000
            })

            _vm.getList()
          } else {
            _vm.$notify({
              title: 'Gagal',
              message: response.msg,
              type: 'error',
              duration: 2000
            })
          }
        }
      )
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
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
        name: null,
        email: null,
        phone: null
      }
      this.step_temp = []
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
          createCustomer(this.$store.state.user.token, this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
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
      this.step_temp = this.temp.Steps
      var date_tmp = ''
      for (let i = 0; i < this.step_temp.length; i++) {
        if (!this.step_temp[i].hasOwnProperty('time')) {
          this.step_temp[i].time = this.step_temp[i].createdAt
        }
        if (date_tmp === '') {
          date_tmp = moment(this.step_temp[i].createdAt).format('dddd, MMMM Do YYYY')
        } else {
          if (moment(this.step_temp[i].createdAt).format('dddd, MMMM Do YYYY') === date_tmp) {
            this.step_temp[i].createdAt = ''
          } else {
            date_tmp = this.step_temp[i].createdAt
          }
        }
      }
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
          updateCustomer(this.$store.state.user.token, tempData).then(
            response => {
              this.dialogFormVisible = false
              this.listLoading = false
              this.getList()
              this.$notify({
                title: 'Success',
                message: 'Data berhasil diubah',
                type: 'success',
                duration: 2000
              })
            }
          )
          // const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          //   updateArticle(tempData).then(() => {
          //     const index = this.list.findIndex(v => v.id === this.temp.id)
          //     this.list.splice(index, 1, this.temp)
          //     this.dialogFormVisible = false
          //     this.$notify({
          //       title: 'Success',
          //       message: 'Update Successfully',
          //       type: 'success',
          //       duration: 2000
          //     })
          //   })
        }
      })
    },
    handleDelete(row, index) {
      this.dialogDeleteData = true
      this.temp = Object.assign({}, row)
      this.temp.index = index
    },
    actionImportExcel() {
      this.listLoading = false
      this.$refs.import.submit()
      // setTimeout(() => {
      //   this.dialogUploadFile = false
      //   this.listLoading = false
      //   this.$notify({
      //     title: 'Berhasil',
      //     message: `File berhasil di upload !`,
      //     type: 'success',
      //     duration: 2000
      //   })
      // }, 2000)
    },
    successImportExcel() {
      setTimeout(() => {
        this.dialogUploadFile = false
        this.listLoading = false
        this.$notify({
          title: 'Berhasil',
          message: `File berhasil di upload !`,
          type: 'success',
          duration: 2000
        })
        this.getList()
      }, 2000)
    },
    actionSendSMS() {
      this.listLoading = true
      sendSMSLink(this.$store.state.user.token, this.temp.id).then(() => {
        this.listLoading = false
        this.dialogSendSMS = false
        this.getList()
        this.$notify({
          title: 'Berhasil',
          message: `SMS Link telah dikirimkan kepada ${this.temp.name}`,
          type: 'success',
          duration: 2000
        })
      })
    },
    actionDelete() {
      this.listLoading = true
      deleteCustomer(this.$store.state.user.token, this.temp.id).then(
        response => {
          this.listLoading = false
          this.dialogDeleteData = false
          this.getList()
          this.$notify({
            title: 'Berhasil',
            message: `${this.temp.name} telah di hapus`,
            type: 'success',
            duration: 2000
          })
        }
      )
    },
    handleUpload() {
      this.dialogUploadFile = true
    },
    handleDownload() {
      this.downloadLoading = true

      import('@/vendor/Export2Excel').then(excel => {
        const date = moment().format('L')
        const tHeader = [
          'No',
          'Tanggal Dibuat',
          'Nama',
          'No. Hp',
          'Status',
          'Current Step',
          'KTP',
          'Selfie',
          'NPWP',
          'Slip Gaji',
          'Document'
        ]
        const filterVal = [
          'no',
          'createdAt',
          'name',
          'phone',
          'status',
          'Steps',
          'Document',
          'Document',
          'Document',
          'Document',
          'Document'
        ]
        const data = this.formatJson(filterVal)
        console.log(data)

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `Export List Customer ${date}`
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map((j, i) => {
          if (j === 'createdAt') {
            return parseTime(v[j])
          } else if (j === 'status') {
            return v[j].toUpperCase()
          } else if (j === 'Steps') {
            return v[j][0].step.toUpperCase()
          } else if (i === 6) {
            if (v[j].ktp) return 'TERISI'
            return 'KOSONG'
          } else if (i === 7) {
            if (v[j].selfie) return 'TERISI'
            return 'KOSONG'
          } else if (i === 8) {
            if (v[j].npwp) return 'TERISI'
            return 'KOSONG'
          } else if (i === 9) {
            if (v[j].salarySlip) return 'TERISI'
            return 'KOSONG'
          } else if (i === 10) {
            if (v[j].document) return 'TERISI'
            return 'KOSONG'
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
.body-filter {
  padding-top: 0.7rem;
}
.action-auto {
  margin-bottom: 0.8rem;
  button {
    margin-left: 0;
  }
}
.filter-component {
  background-color: rgb(246, 246, 246);
  border-radius: 5px;
  margin-bottom: 2.5rem;
  padding: 0.3rem 1rem;
  box-shadow: 9px 9px 11px -2px rgba(0, 0, 0, 0.1);

  .footer-filter {
    margin-top: 1rem;
  }
}
</style>
