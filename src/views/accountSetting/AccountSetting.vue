<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-input type="file" ref="changeAvatarInput" style="position: fixed;top: -1000px;" @change="updateAvatar"/>
      <a-form>
        <a-row>
          <a-col :span='18'>
            <a-row>
              <a-col :span='4' :offset='5'>
                <div style="position: relative">
                  <a-avatar
                    :src="avatarUrl"
                    style='width: 128px;height: 128px'
                    @mouseenter="() => this.changeAvatarButtonShow = true"/>
                  <div v-if="changeAvatarButtonShow"  @mouseleave="() => this.changeAvatarButtonShow = false">
                    <a-avatar style="width: 128px;height: 128px;background-color: #90939977;position: absolute;top: 0;left:0;"></a-avatar>
                    <div style="width: 128px;height:128px;position: absolute;top: 0;left: 0;">
                      <div style="margin: auto">
                        <div style="width: 128px;text-align: center;line-height: 128px;">
                          <a @click="() => this.$refs.changeAvatarInput.$el.click()" >更换头像</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span='2' :offset='1'>
                <div style='height: 128px;position: relative'>
                  <a style='position: absolute;bottom: 0;text-decoration: underline' @click="showEditPasswordModal">修改密码</a>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter='24'>
              <a-col :span='17'>
                <a-form-item label='恒星号名称' :colon='false'>
                  <a-input v-model="nickName" :disabled="!canEditName"/>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <br><br>
                <a style='text-decoration: underline' @click="showEditNameModal" v-if="changeNameCount==0">修改名称</a><br>
                <span style='color: #90939999'><a-icon type="exclamation-circle" theme='filled'/> 恒星号名称每年仅支持修改一次</span>
              </a-col>
            </a-row>
            <br>
            <a-row :gutter='24'>
              <a-col :span='17'>
                <a-form-item>
                  <a-textarea placeholder='这个人很懒，什么都没留下' :autoSize='{minRows: 5, maxRows:5}' style='position: relative' @change="descriptionLimitNumber" v-model="description"/>
                  <span style='position: absolute;bottom: 0;right:3px;height: 25px'>{{ number }}/140</span>
                  <span v-if="descriptionLimit" slot="help" style="color: red">字数已达上限！</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter='24'>
              <a-col :span='4'>
                <span>联系人</span>
              </a-col>
              <a-col :span='13'>
                <span>手机号&#12288;&#12288;</span>
                <span style='color: #90939999'><a-icon type="exclamation-circle" theme='filled'/> 不对外展示，仅用于破壁工作室对接</span>
              </a-col>
              <a-col :span="1" v-if="noOperator">
                <a-icon type='plus-circle' style='font-size: 30px' @click="addNewOperator"/>
              </a-col>
            </a-row>
            <div v-for="(operator, index) in operatorList" :key="index" v-if="operator.status != 'delete' && operator.status != 'ignore'">
              <a-row :gutter='24' >
                <a-col :span='4'>
                  <a-form-item >
                    <span slot="help" style="color: red;">{{operator.nameValidateMessage}}</span>
                    <a-input v-model="operator.operatorName" @change="updateOperatorName(operator)" />
                  </a-form-item>
                </a-col>
                <a-col :span='13'>
                  <a-form-item>
                    <span slot="help" style="color: red;">{{operator.contactValidateMessage}}</span>
                    <a-input v-model="operator.phone" @change="updateOperatorPhone(operator)" />
                  </a-form-item>
                </a-col>
                <a-col :span="1" v-if="index==operatorListAddIndex">
                  <a-icon type='plus-circle' style='font-size: 30px' @click="addNewOperator"/>
                </a-col>
                <a-col :span="1">
                  <a-icon type="minus-circle" style='font-size: 30px' @click="deleteOperator(operator)"/>
                </a-col>
              </a-row>
<!--              <a-col :span='4' v-if="operator.nameValidateMessage" >-->
<!--                <span style="color: red;">{{operator.nameValidateMessage}}</span>-->
<!--              </a-col>-->
<!--              <a-col :span='13' v-if="operator.contactValidateMessage" >-->
<!--                <span style="color: red;">{{operator.contactValidateMessage}}</span>-->
<!--              </a-col>-->
            </div>
            <a-row>
              <a-col :span='2' :offset='15'>
                <a-button type='primary' @click="updateMessage" :disabled="submitLock">更新信息</a-button>
              </a-col>
            </a-row>
            <a-row>
              <span style='color: #90939999'>若有疑问请与破壁工作室取得联系，联系方式：</span>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-modal
      v-model="editPasswordModal.visible"
      title="修改密码"
      ok-text="确认"
      cancel-text="取消"
      @ok="tapOkForEditPassword"
      width="30%">
      <a-form-item>
        <span>密码应不小于8位，且包含数字和字母的组合</span>
        <a-input-password v-model="editPasswordModal.first" @change="() => this.editPasswordModal.message = ''" placeholder="请输入新名称"/>
        <a-input-password v-model="editPasswordModal.second" @change="() => this.editPasswordModal.message = ''" placeholder="请再次输入新密码"/>
        <span v-if="this.editPasswordModal.message" slot="help" style="color: red" >{{editPasswordModal.message}}</span>
      </a-form-item>
    </a-modal>
    <a-modal
      v-model="editNameModal.visible"
      ok-text="确认"
      cancel-text="取消"
      @ok="tapOkForEditName"
      width="30%">
      <a-form-item>
        <span>请输入新名称(限15字)</span>
        <a-input v-model="editNameModal.newName" @change="changeMessageOfNameModal" placeholder="请输入新名称"/>
        <span v-if="editNameModal.message" slot="help" style="color: red" >{{editNameModal.message}}</span>
      </a-form-item>
    </a-modal>
    <a-modal
      v-model="confirmModal.visible"
      title="确认修改"
      ok-text="确认"
      cancel-text="取消"
      @ok="tapOkForConfirmEditName"
      width="30%">
      <p>新名称:“{{editNameModal.newName}}”</p>
      <p>每年仅可修改一次恒星号名称，确定修改？</p>
    </a-modal>
    <AvatarModal/>
  </page-header-wrapper>
</template>

<script>
import md5 from 'md5'
import storage from 'store'
import { DETAIL, SHOW_AVATAR, SHOW_NAME } from '@/store/mutation-types'
import request from '@/utils/request'
import AvatarModal from '@/viewsOfOld/account/settings/AvatarModal'
import WangEditor from '@/components/Editor/WangEditor'

export default {
  name: 'AccountSetting',
  components: {
    WangEditor,
    AvatarModal
  },
  data () {
    const detail = storage.get(DETAIL)
    let description = detail.description
      delete detail.description
    console.log(detail)
    return {
      changeAvatarButtonShow: false,
      description: description || '',
      ...detail,
      canEditName: false,
      descriptionLimit: false,
      editNameModal: { visible: false, newName: '', message: '' },
      editPasswordModal: { visible: false, first: '', second: '', message: '' },
      confirmModal: { visible: false },
      operatorList: [],
      // operatorListAddIndex: 0,
      loading: false,
      submitLock: false,
    }
  },
  beforeCreate () {
    // console.log(storage.get(DETAIL))
    this.form = this.$form.createForm(this, { name: 'search' })
  },
  created() {
    this.getOperatorList()
  },
  computed: {
    noOperator: function(){
      if(this.operatorList.length==0)return true
      for(let operator of this.operatorList)
        if(operator.status!='ignore'&&operator!='deleted')return false
      return true
    },
    number: function () {
      return this.description.length
    },
    operatorListAddIndex: function() {
      for (let i = this.operatorList.length-1; i >=0 ; i--) {
        let operator = this.operatorList[i]
        if (operator.status != 'delete' && operator.status != 'ignore') {
          return i
        }
      }
    }
  },
  methods: {
    updateAvatar (e) {
      console.log(e.target.files)
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      request({
        url: '/organization/organizationUploadAvatar',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
      })
        .then(res => {
          console.log(res)
          this.avatarUrl = res.data
          const detail = storage.get(DETAIL)
          detail.avatarUrl = res.data
          storage.set(DETAIL, detail)
          storage.set(SHOW_AVATAR, res.data)
          this.loading = false
          this.$message.success('更换头像成功！')
        })
    },
   descriptionLimitNumber (e) {
     if (this.description.length >= 140) {
       this.description = this.description.slice(0, 140)
       this.descriptionLimit = true
     } else {
       this.descriptionLimit = false
     }
   },
    changeMessageOfNameModal () {
     if (this.editNameModal.newName.length >= 15) {
       this.editNameModal.newName = this.editNameModal.newName.slice(0, 15)
       this.editNameModal.message = '字数已达上限！'
     } else {
       this.editNameModal.message = ''
     }
    },
    showEditNameModal () {
     this.editNameModal.visible = true
    },
    showEditPasswordModal () {
     this.editPasswordModal = {
       visible: true,
       first: '',
       second: '',
       message: ''
     }
    },
    tapOkForEditPassword () {
     if (!this.editPasswordModal.first && !this.editPasswordModal.second) {
       this.editPasswordModal.message = '密码不能为空！'
       return
     }
     if (this.editPasswordModal.first != this.editPasswordModal.second) {
       this.editPasswordModal.message = '两次输入密码不一致！'
       return
     }
    const password = this.editPasswordModal.first
    if (password.length <=8) {
      this.editPasswordModal.message = '请设置不小于8位的密码！'
      return
    }
    if (password.search(/\d/g) == -1  && password.search(/\w/g) == -1) {
      this.editPasswordModal.message = '密码中缺少数字或字母！'
      return
    }
    let that = this
    this.$confirm({
      content: '确定修改密码？',
        onOk() {
        request({
          url: '/organization/editPersonalInfo',
          method: 'patch',
          data: {
            password: md5(password)
          }
        })
          .then(res => {
            that.editPasswordModal.visible = false
            that.$message.success('密码修改成功！')
          })
      }
    })
    },
    tapOkForEditName () {
     if (!this.editNameModal.newName) {
       this.editNameModal.message = '名字不能为空！'
       return
     }
      this.editNameModal.visible = false
      this.confirmModal.visible = true
    },
    tapOkForConfirmEditName () {
      request({
        url: '/organization/editPersonalInfo',
        method: 'patch',
        data: {
          nickName: this.editNameModal.newName
        }
      })
        .then(res => {
          console.log(res)
          this.nickName = this.editNameModal.newName
          const detail = storage.get(DETAIL)
          detail.nickName = this.editNameModal.newName
          detail.changeNameCount++
          storage.set(DETAIL, detail)
          const originalName = storage.get(SHOW_NAME)
          storage.set(SHOW_NAME, this.editNameModal.newName + originalName.substring(originalName.indexOf('(')))
          this.changeNameCount++
          this.confirmModal.visible = false
          this.$message.success('修改名称成功！')
        })
    },
    updateMessage () {
      if (this.submitLock) return
      // if (this.validateOperatorList()) return
      var that = this
      this.$confirm({
        content: '确定更新恒星号信息？',
        onOk() {
          that.submitLock = true
          that.updateOperatorList()
          request({
            url: '/organization/editPersonalInfo',
            method: 'patch',
            data: {
              description: that.description
            }
          })
            .then(res => {
              const detail = storage.get(DETAIL)
              detail.description = that.description
              storage.set(DETAIL, detail)
              that.$message.success('修改个人信息成功！')
            })
          .finally(() => {that.submitLock = false})
        },
      })
      // this.form.validateFields((err, value) => {
      //   if (err) {
      //     console.log(err)
      //   }
      //   console.log(value)
      // })
    },
    getOperatorList () {
      request({
        url: '/organizationOperator/getOperatorList',
        method: 'get'
      })
        .then(res => {
          console.log(res)
          this.operatorList = res.data.map(item => {
            return {
              ...item,
              status: 'original',
              nameValidateMessage: '',
              contactValidateMessage: ''
            }
          })
          // this.operatorListAddIndex = res.data.length - 1
        })
    },
    updateOperatorList () {
      for (const operator of this.operatorList) {
        let status = operator.status
        delete operator.status
        delete operator.nameValidateMessage
        delete operator.contactValidateMessage
        switch (status) {
          case 'new':
            console.log('new')
            request({
              url: '/organizationOperator/addOperator',
              method: 'post',
              data: operator
            })
            .then(res => {
              console.log(res)
            })
            break
          case 'update':
            console.log('update')
            request({
              url: '/organizationOperator/editOperator',
              method: 'patch',
              data: operator
            })
            .then(res => {
              console.log(res)
            })
            break
          case 'delete':
            console.log('delete')
            request({
              url: '/organizationOperator/deleteOperator/' + operator.id,
              method: 'delete',
            })
              .then(res => {
                console.log(res)
              })
            break
        }
      }
      setTimeout(this.getOperatorList,500)
      // this.getOperatorList()
    },
    validateOperatorList () {
      let change = false
      const phonePattern = /^1\d{10}$/g
      for (const operator of this.operatorList) {
        if (operator.operatorName.trim() == '') {
          change = true
          operator.nameValidateMessage = '请输入名字'
        }
        if (operator.phone.trim() == '') {
          change = true
          operator.contactValidateMessage = '请输入联系方式'
        } else if (operator.phone.search(phonePattern) == -1) {
          change = true
          operator.contactValidateMessage = '手机号码格式不符合要求！'
        }
      }
      return change
    },
    updateOperatorName (operator) {
      operator.nameValidateMessage = ''
      if (operator.status == 'new') return
      operator.status = 'update'
    },
    updateOperatorPhone (operator) {
      operator.contactValidateMessage = ''
      if (operator.status == 'new') return
      operator.status = 'update'
    },
    addNewOperator () {
      this.operatorList.push({
        operatorName: '',
        phone: '',
        status: 'new',
        nameValidateMessage: '',
        contactValidateMessage: ''
      })
      // this.operatorListAddIndex++
    },
    deleteOperator (operator) {
      operator.status = operator.status == 'new' ? 'ignore' : 'delete'
    },
    testOfGetImage (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>

</style>
