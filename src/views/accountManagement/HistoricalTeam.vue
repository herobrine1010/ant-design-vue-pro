<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-row :gutter="4">
            <a-col :span="6">
              <a-button type="primary" style="margin-left: 8px;" @click="getListData">刷新90</a-button>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" @change="onCreateTimeChange" v-model="queryParams.createTime"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker style="width: 100%" @change="onDueTimeChange" v-model="queryParams.dueTime"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" html-type="submit" @click="doQuery">筛选</a-button>
                <a-button type="primary" style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns="columns" :data-source="tableData">
        <span slot="status" slot-scope="star,record">
          <!-- <a @click="adminGetTeam(record.censored)">组队详情</a> -->
          <span v-if="record.status == 0 || record.status == 1">未处理</span>
          <span v-if="record.status == 2">待结束</span>
          <span v-if="record.status == 3 || record.status == 4">正常</span>
        </span>
        <span slot="censored" slot-scope="star,record">
          <!-- <a @click="adminGetTeam(record.censored)">组队详情</a> -->
          <span v-if="record.censored">被屏蔽</span>
          <span v-else>正常</span>
        </span>
        <span slot="operations" slot-scope="star,record">
          <a @click="adminGetTeam(record)">组队详情</a>
        </span>
      </a-table>
      <!--      <step-by-step-modal ref="modal" @ok="handleOk"/>-->
      <group-detail ref='groupDetail'></group-detail>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreateForm from '../list/modules/CreateForm'
import { adminGetTeamList ,getTeamByUserIdWithPage} from '@/api/planet' // 引入后台接口
import GroupDetail from '@/views/articleManagement/GroupDetail'

const columns = [
  {
    title: '组队id',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '组队标题',
    dataIndex: 'title',
    key: 'title'
  }, {
    title: '组队状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '帖子状态',
    dataIndex: 'censored',
    key: 'censored',
    scopedSlots: { customRender: 'censored' }
  },
  // 字段不明
  //  {
  //   title: '组队进度',
  //   dataIndex: 'teamProgress',
  //   key: 'teamProgress'
  // }, 
  // {
  //   title: '所属板块',
  //   dataIndex: 'plate',
  //   key: 'plate'
  // }, 
  {
    title: '操作人员',
    dataIndex: 'lastOperation',
    key: 'lastOperation'
  }, 
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operations' }
  }
]
export default {
  name: 'HistoricalTeam',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    GroupDetail, // 组队详情弹框
    StepByStepModal
  },
  data () {
    return {
      columns,
      queryParams: {
       pageNo: 1,
       pageSize: 10,
       createTime: '',
       dueTime: '',
       userId: ''
      },
      tableData: [] // 存储列表数据
    }
  },
  created () {
    // 获取表格数据，从后台接口拿到数据初始化数据
    this.getListData()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  methods: {
    onCreateTimeChange (date, dateString) {
      console.log(date, dateString, '日期')
      this.queryParams.createTime = dateString
    },
    onDueTimeChange (date, dateString) {
      console.log(date, dateString, '日期')
      this.queryParams.dueTime = dateString
    },
    doQuery () {
      this.getListData()
    },
    reset () {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        createTime: '',
        dueTime: ''
      }
      this.getListData()
    },
    adminGetTeam (row) {
      this.$refs.groupDetail.open(row)
     // this.$refs.groupDetail.dataItem = row
      // 获取组队详情
      // getTeamByUserId(row.id).then(res => {
      //   console.log(res, '结果')
      // })
    },
    // 方法：获取历史组队信息列表
    getListData () {
      // 获取从planet传来的用户id参数值
      this.queryParams.userId = this.$route.query.uid
      getTeamByUserIdWithPage(this.queryParams).then(res => {
        this.tableData = res.data.records // 把从接口拿到的数据赋给表格数据变量
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        console.log(err)
        console.log(value)
      })
    }
  }
}
</script>
