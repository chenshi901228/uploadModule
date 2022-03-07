<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="主键" prop="id">
              <el-input v-model="dataForm.id" placeholder="主键"></el-input>
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
            <el-form-item label="删除标记（0:未删除,1:已删除）" prop="delFlg">
              <el-input v-model="dataForm.delFlg" placeholder="删除标记（0:未删除,1:已删除）"></el-input>
            </el-form-item>
            <el-form-item label="礼物名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="礼物名称"></el-input>
            </el-form-item>
            <el-form-item label="图标地址" prop="icon">
              <el-input v-model="dataForm.icon" placeholder="图标地址"></el-input>
            </el-form-item>
            <el-form-item label="动态图标" prop="dynamicIcon">
              <el-input v-model="dataForm.dynamicIcon" placeholder="动态图标"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model="dataForm.price" placeholder="价格"></el-input>
            </el-form-item>
            <el-form-item label="是否免费（0 否，1 是）" prop="isFree">
              <el-input v-model="dataForm.isFree" placeholder="是否免费（0 否，1 是）"></el-input>
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
      createDate: '',
      createBy: '',
      updateDate: '',
      updateBy: '',
      delFlg: '',
      name: '',
      icon: '',
      dynamicIcon: '',
      price: '',
      isFree: '',
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
        this.$http.get('/live/gift/record/' + this.dataForm.id).then(({ data: res }) => {
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
          this.$http[!this.dataForm.id ? 'post' : 'put']('/live/gift/record/', this.dataForm).then(({ data: res }) => {
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
