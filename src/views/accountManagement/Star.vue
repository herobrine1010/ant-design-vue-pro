<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="4">
            <a-col :span="4">
              <a-button type="primary" style="margin-left: 8px;" @click="refresh">刷新</a-button>
            </a-col>
            <a-col :span="3">
              <a-form-item label="uid">
                <a-input placeholder="" v-model="queryParams.id"/>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="账号状态">
                <a-select
                  placeholder="请选择"
                  v-model="queryParams.blockType">
                  <a-select-option value="-1">所有账号</a-select-option>
                  <a-select-option value="0">正常账号</a-select-option>
                  <a-select-option value="1">已禁言账号</a-select-option>
                  <a-select-option value="2">已封禁账号</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" @change="onCreateTimeChange" v-model="queryParams.createTime"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" @change="onUpdateTimeChange" v-model="queryParams.updateTime"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" html-type="submit" @click="doQuery">筛选</a-button>
                <a-button type="primary" style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-modal v-model="detailsVisible" title="详细信息" ok-text="确认" cancel-text="取消" @ok="hideModal">
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            恒星号名称：{{detailsCurrentRow.organizationName}}
          </a-col>
          <a-col :md="12" :lg="12">
            恒星号属性：{{ detailsCurrentRow.property }}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            恒星号类型：{{ detailsCurrentRow.type }}
          </a-col>
          <a-col :md="12" :lg="12">
            人数规模：{{ detailsCurrentRow.memberCount }}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            负责人姓名：{{detailsCurrentRow.operatorName}}
          </a-col>
          <a-col :md="12" :lg="12">
            负责人学号：{{detailsCurrentRow.operatorStudentId}}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            负责人手机号：{{detailsCurrentRow.operatorPhone}}
          </a-col>
          <a-col :md="12" :lg="12">
            负责人微信号：{{detailsCurrentRow.operatorWxId}}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            负责人邮箱：{{detailsCurrentRow.operatorMail}}
          </a-col>
          <a-col :md="12" :lg="12">
            指导老师姓名：{{detailsCurrentRow.teacherName}}
          </a-col>
        </a-row>
        <a-row style="margin-bottom:15px;">
          <a-col :md="12" :lg="12">
            指导老师联系方式：{{detailsCurrentRow.teacherContact}}
          </a-col>
        </a-row>
      </a-modal>
      <a-table :columns="columns" :data-source="tableData">
        <span slot="historicalPosting" slot-scope="tedxt, record" >
          <router-link :to="{path:'HistoricalPosting',query: {id: record.id }}">查看</router-link>
        </span>
        <span slot="detail" slot-scope="tedxt, record">
          <a @click="lookDetails(record)">查看</a>
        </span>
        <span slot="operations" slot-scope="operations">
          <!-- <a v-for="operation in operations" :key="operation">{{ operation }} </a> -->
          <span slot="operations" slot-scope="record">
          <a-button :hidden="record.blockType===0" @click="recoverAccount(record.id, record.nickName);modalParam.show=true;">恢复</a-button>
          <a-button :hidden="record.blockType!==0" @click="muteAccount(record.id, record.nickName);modalParam.show=true;">禁言</a-button>
          <a-button :hidden="record.blockType===2" @click="blockAccount(record.id, record.nickName);modalParam.show=true;">封禁</a-button>
        </span>
        </span>
      </a-table>

      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
import { queryOrganizationWithPage,getLabel } from '@/api/planet' // 引入后台接口
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'

const columns = [
  {
    title: 'uid',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  }, {
    title: '负责人',
    dataIndex: 'operatorName',
    key: 'operatorName'
  }, {
    title: '历史发帖',
    dataIndex: 'historicalPosting',
    key: 'historicalPosting',
    scopedSlots: { customRender: 'historicalPosting' }
  }, {
    title: '详细信息',
    dataIndex: 'detail',
    key: 'detail',
    scopedSlots: { customRender: 'detail' }
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operations' }
  }
]

const data = [
  {
    key: '1',
    uid: '1',
    nickName: 'bilibili',
    head: '陈睿',
    // historicalPosting: '查看',
    // detail: '查看',
    operation: ['禁言', '操作记录']
  }, {
    key: '2',
    uid: '2',
    nickName: '华为',
    head: '任正非',
    // historicalPosting: '查看',
    // detail: '查看',
    operation: ['解除禁言', '操作记录']
  }, {
    key: '3',
    uid: '3',
    nickName: '字节跳动',
    head: '张一鸣',
    // historicalPosting: '查看',
    // detail: '查看',
    operation: ['操作记录']
  }
]

export default {
  name: 'Star',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      columns,
      detailsVisible: false, // 详情弹框
      queryParams: {
       pageNo: 1,
       pageSize: 10,
       createTime: '',
       updateTime: '',
       id: '',
       blockType: '-1'
      },
      detailsCurrentRow: {},
      tableData: [], // 存储列表数据
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   const requestParameters = Object.assign({}, parameter, this.queryParam)
      //   console.log('loadData request parameters:', requestParameters)
      //   return getServiceList(requestParameters)
      //     .then(res => {
      //       return res.result
      //     })
      // },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  // filters: {
  //   statusFilter (type) {
  //     return statusMap[type].text
  //   },
  //   statusTypeFilter (type) {
  //     return statusMap[type].status
  //   }
  // },
  created () {
    getRoleList({ t: new Date() })
    this.doQuery()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    doQuery () {
      this.getListData()
    },
    // 查看详细信息
    lookDetails (row) {
      getLabel({type: 'organization'}).then(res => {
        console.log(res.data, '号')
      })
      this.detailsVisible = true
      this.detailsCurrentRow = row
    },
    // 查看历史发帖
    goHistoricalPost (record) {
      alert('2')
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    getListData () {
      queryOrganizationWithPage(this.queryParams).then(res => {
        this.tableData = res.data.records // 把从接口拿到的数据赋给表格数据变量
      })
    },
    onCreateTimeChange (date, dateString) {
      this.queryParams.createTime = dateString
    },
    onUpdateTimeChange (date, dateString) {
      this.queryParams.updateTime = dateString
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    reset () {
      // this.queryParam = {
      //   date: moment(new Date())
      // }
      this.queryParams = {
       pageNo: 1,
       pageSize: 10,
       createTime: '',
       updateTime: '',
       userId: '',
       id: '',
       blockType: '-1'
      }
    },
    refresh () {
      this.getListData()
    }
  }
}
</script>
