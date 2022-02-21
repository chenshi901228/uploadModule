<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="id" prop="id">
              <el-input v-model="dataForm.id" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="主播ID" prop="weixinUserId">
              <el-input v-model="dataForm.weixinUserId" placeholder="主播ID"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatarUrl">
              <el-input v-model="dataForm.avatarUrl" placeholder="头像"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="introduce">
              <el-input v-model="dataForm.introduce" placeholder="介绍"></el-input>
            </el-form-item>
            <el-form-item label="认证用户（0:未认证,1:认证）" prop="legalizeFlg">
              <el-input v-model="dataForm.legalizeFlg" placeholder="认证用户（0:未认证,1:认证）"></el-input>
            </el-form-item>
            <el-form-item label="是否导师（0:未认证,1:认证）" prop="tutorFlg">
              <el-input v-model="dataForm.tutorFlg" placeholder="是否导师（0:未认证,1:认证）"></el-input>
            </el-form-item>
            <el-form-item label="状态（-1:拒绝,0:申请中,1:同意）" prop="status">
              <el-input v-model="dataForm.status" placeholder="状态（-1:拒绝,0:申请中,1:同意）"></el-input>
            </el-form-item>
            <el-form-item label="删除标记（0:未删除,1:已删除）" prop="delFlg">
              <el-input v-model="dataForm.delFlg" placeholder="删除标记（0:未删除,1:已删除）"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createDate">
              <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
            </el-form-item>
            <el-form-item label="创建人" prop="createBy">
              <el-input v-model="dataForm.createBy" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item label="更新时间" prop="updateDate">
              <el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
            </el-form-item>
            <el-form-item label="更新人" prop="updateBy">
              <el-input v-model="dataForm.updateBy" placeholder="更新人"></el-input>
            </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import debounce from 'lodash/debounce'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
      id: '',
      weixinUserId: '',
      username: '',
      avatarUrl: '',
      introduce: '',
      legalizeFlg: '',
      tutorFlg: '',
      status: '',
      delFlg: '',
      createDate: '',
      createBy: '',
      updateDate: '',
      updateBy: '',
    }
    }
    },
    computed: {
      dataRule () {
        return {
      }
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      },
      // 获取信息
      getInfo () {
        this.$http.get('/sys/anchor/applyInfo/' + this.dataForm.id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          }
        }).catch(() => {})
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function () {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/anchor/applyInfo/', this.dataForm).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {})
        })
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
</script>
