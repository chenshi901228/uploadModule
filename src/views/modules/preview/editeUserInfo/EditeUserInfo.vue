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
      <el-form-item label="主播昵称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="主播简介" prop="desc">
        <el-input
          type="textarea"
          :rows="5"
          v-model="ruleForm.desc"
          maxlength="500"
          :show-word-limit="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="主播头像" prop="imgUrl" required>
        <el-upload
          action="http://192.168.250.195:28080/oss/file/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      ruleForm: {
        name: "",
        desc: "",
        imgUrl: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
    };
  },
  watch: {},
  created() {},
  activated() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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