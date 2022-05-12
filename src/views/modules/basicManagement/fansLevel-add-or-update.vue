<template>
  <el-dialog top="20px" :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '120px'">
            <el-form-item label="等级" prop="level">
              <el-input-number style="width:100%;text-align: left;" v-model="dataForm.level" placeholder="等级"  :controls='false' :min="1"  :step="1" step-strictly :disabled="dataForm.id"></el-input-number>
            </el-form-item>
            <el-form-item label="等级名称" prop="levelName">
              <el-input v-model="dataForm.levelName" placeholder="等级名称" :disabled="dataForm.id"></el-input>
            </el-form-item>
            <el-form-item label="亲密值要求" prop="intimacyNum">
              <el-input-number v-model="dataForm.intimacyNum" style="width:100%;text-align: left;" :controls='false' :min="0"  :step="1" step-strictly placeholder="亲密值要求" ></el-input-number>
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
  import Upload from "@/components/upload/index";

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
          level: '',
          levelName: '',
          intimacyNum: '',
          status: '',
        },
        dataRule: {
          level: [
            { required: true, message: '请输入等级', trigger: 'blur' }
          ],
          levelName: [
            { required: true, message: '请输入等级名称', trigger: 'blur' },
          ],
          intimacyNum: [
            { required: true, message: '请输入亲密值要求', trigger: 'blur' },
          ],
        }
      }
    },
    components: {
        Upload
    },
    watch:{
   
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
        this.$http.get('/sys/sysfanslevel/' + this.dataForm.id).then(({ data: res }) => {
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


          this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/sysfanslevel', this.dataForm).then(({ data: res }) => {
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
      }, 1000, { 'leading': true, 'trailing': false }),
      
 
    }
  }
</script>
<style  >
 .el-input-number .el-input__inner {
    text-align: left;
}
</style>