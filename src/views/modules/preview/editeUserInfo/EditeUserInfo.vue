// 编辑主播信息

<template>
  <el-card shadow="never" class="aui-card--fill">
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
        <!-- <el-upload
          :action="uploadUrl"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <ImgCutter @cutDown="cutDown" fileType="jpeg">
            <button slot="open">选择图片</button>
        </ImgCutter>
        <img :src="imgSrc" alt="">
        <!-- <upload :fileList="fileList" :limit="1" :multiple="false" @getImg="getImg"></upload> -->
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="resetForm('ruleForm')">取消</el-button> -->
        <el-button size="small" type="primary" @click="submitForm('ruleForm')"
          >修改</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import Cookies from 'js-cookie'
import Upload from "@/components/upload/index";
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
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入主播昵称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        introduce: [{ required: true, message: "请输入主播简介", trigger: "blur" }],
      },
      imgSrc:''
    };
  },
  watch: {},
  created() {},
  activated() {
    let info = this.$route.params.info
    console.log(info)
    if(info) {
      this.id = info.weixinUserId
      this.ruleForm.username = info.username
      this.ruleForm.introduce = info.introduce
      this.fileList = [
        {
          name: new Date().getTime(),
          url: info.avatarUrl || "https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png"
        }
      ]
    }
  },
  mounted() {
    
  },
  methods: {
    cutDown(event) {
      this.imgSrc = event.dataURL;
      console.log(event.file);//输出为base64数据
      var form = new FormData(); // FormData 对象
      form.append("file", event.file); // 文件对象
      this.$http.post(`/oss/file/upload?access_token=${Cookies.get('access_token')}`,form).then(res=>{
        console.log(res)
      })
    },
    // 头像上传
    getImg(imgList) {
      console.log(imgList)
      this.fileList = imgList;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if(!this.fileList.length) return this.$message.error("请上传主播头像")

          const loading = this.$loading({
            lock: true,
            text: '信息修改中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          let params = {
            id: this.id,
            ...this.ruleForm,
            avatarUrl: this.fileList[0].response ? this.fileList[0].response.data.url : this.fileList[0].url
          }
          this.$http.post("sys/anchor/applyInfo/updateBaseInfo", params).then(({ data: res }) => {
            if(res.code == 0) {
              this.$message.success("修改主播信息成功")
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
</style>