// 编辑主播信息

<template>
  <el-card shadow="never" class="aui-card--fill">
      <div style="height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;">
                主播信息
            </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="主播昵称" prop="username">
        <el-input v-model="ruleForm.username" style="width:600px"></el-input>
      </el-form-item>
      <el-form-item label="主播简介" prop="introduce">
        <el-input
          type="textarea"
          :rows="5"
          v-model="ruleForm.introduce"
          maxlength="500"
          :show-word-limit="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="主播头像" required>
        <upload
          :fileList="fileList"
          :limit="1"
          :fileMaxSize="2"
          :fileType="['png', 'jpg', 'jpeg']"
          ref="uploadFile"
          @uploadSuccess="uploadSuccess"
          @uploadRemove="uploadRemove"
        ></upload>
        <p class="tips">头像大小限制300px  *  300px</p>
      </el-form-item>
      <el-form-item label="主播二维码" required>
        <upload
          :fileList="fileListQRcode"
          :limit="1"
          :fileMaxSize="2"
          :fileType="['png', 'jpg', 'jpeg']"
          ref="uploadQRcodeFile"
          @uploadSuccess="uploadQRcodeSuccess"
          @uploadRemove="uploadQRcodeRemove"
        ></upload>
        <p class="tips">二维码大小限制300px  *  300px</p>
      </el-form-item>
    
    </el-form>
      <el-button size="small" type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button  size="small" @click="resetForm('ruleForm')">取消</el-button>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import Upload from "@/components/common/custom-upload";
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  components: {
    Upload
  },
  data() {
    return {
      ruleForm: {
        username: "",
        introduce: "",
      },
      id: null, //主播id
      fileList: [],//主播头像
      fileListQRcode:[],//主播二维码
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入主播昵称", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" },
        ],
        introduce: [{ required: true, message: "请输入主播简介", trigger: "blur" }],
      },
    };
  },
  activated() {
    this.id = this.$route.query.id
    this.$nextTick(() => {
      this.getAnchorInfo()
    })
  },
  methods: {
    // 获取用户详细信息
    getAnchorInfo() {
      this.$http.get(`/sys/anchor/info/getInfoWithAnchor`, { params: { anchorId: this.id } }).then(({ data: res }) => {
        if (res.code !== 0) return this.$message.error(res.msg);
        if(res.data) {
          this.ruleForm.username = res.data.username
          this.ruleForm.introduce = res.data.introduce
          this.fileList = [
            {
              name: new Date().getTime(),
              url: res.data.avatarUrl || "https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png"
            }
          ]
          if(res.data.qrCode){
            this.fileListQRcode = [
              {
                name: new Date().getTime(),
                url: res.data.qrCode
              }
            ]
          }
        }
      }).catch((err) => this.$message.error(JSON.stringify(err.message)));
    },
    // 头像上传、删除
    uploadSuccess(file) {
      this.fileList.push(file);
    },
    uploadRemove(file) {
      this.fileList = []
    },
    // 二维码上传、删除
    uploadQRcodeSuccess(file) {
      this.fileListQRcode.push(file);
    },
    uploadQRcodeRemove(file) {
      this.fileListQRcode = []
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if (!this.$refs.uploadFile.isUploadAll() || !this.$refs.uploadQRcodeFile.isUploadAll()) {
            return this.$message.error("有附件正在上传中")
          }
          if(!this.fileList.length) return this.$message.error("请上传主播头像")
          if(!this.fileListQRcode.length) return this.$message.error("请上传主播二维码")

          this.$confirm('确认信息已填写无误，提交审批','提示',{
            confirmButtonText:'确认',
            cancelButtonText:'取消',
          }).then(()=>{
            const loading = this.$loading({
              lock: true,
              text: '信息修改中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            let params = {
              id: this.id,
              ...this.ruleForm,
              avatarUrl: this.fileList[0].response ? this.fileList[0].response.data.url : this.fileList[0].url,
              qrCode: this.fileListQRcode[0].response ? this.fileListQRcode[0].response.data.url : this.fileListQRcode[0].url
            }
            this.$http.post("sys/anchor/applyInfo/updateBaseInfo", params).then(({ data: res }) => {
              if(res.code == 0) {
                this.$message.success("修改主播信息成功,请等待后台审核")
                this.resetForm(formName)
                this.fileList = []
                this.id = null
                this.closeCurrentTab()
              }else {
                this.$message.error(res.msg)
              }
              loading.close();
            }).catch(err => {
              loading.close();
              console.log(err)
            })
          }).catch(()=>{
            this.$message.info('取消操作')
          })
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      let tabName = this.$store.state.contentTabsActiveName
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName = this.$store.state.contentTabsActiveName = 'home'
        return false
      }
      if (tabName === this.$store.state.contentTabsActiveName) {
        this.$router.push({ name: this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1].name })
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
}
/deep/.el-input {
  width: 300px;
}
/deep/.el-textarea {
  width: 600px;
}
/deep/.el-textarea__inner {
  padding-bottom: 50px;
  padding-right: 60px;
}
/deep/.el-input__count {
  right: 30px;
}
/deep/ .el-card__body {
    padding: 0 20px 20px;
}

</style>