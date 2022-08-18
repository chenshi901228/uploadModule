<template>
  <el-dialog
    top="20px"
    :visible.sync="visible"
    :title="!dataForm.id ? $t('add') : $t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      size="small"
      @keyup.enter.native="dataFormSubmitHandle()"
      :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'"
    >
      <el-form-item label="礼物名称" prop="name">
        <el-input
          v-model="dataForm.name"
          placeholder="请输入"
          required
        ></el-input>
      </el-form-item>
      <el-form-item label="礼物图标" prop="icon">
        <!-- <el-input v-model="dataForm.icon" placeholder="图标地址"></el-input> -->
        <upload
          :fileList="fileList"
          :limit="1"
          :fileMaxSize="2"
          :fileType="['png', 'jpg']"
          ref="uploadFile"
          @uploadSuccess="uploadSuccess"
          @uploadRemove="uploadRemove"
        ></upload>
      </el-form-item>
      <el-form-item label="礼物动画" prop="dynamicIcon">
        <!-- <el-input v-model="dataForm.dynamicIcon" placeholder="动态图标"></el-input> -->
        <upload
          :fileList="filePicList"
          :limit="1"
          :fileType="['svga']"
          ref="uploadFilePic"
          :fileMaxSize="10"
          @uploadSuccess="uploadPicSuccess"
          @uploadRemove="uploadPicRemove"
        ></upload>
      </el-form-item>
      <!-- <el-form-item label="是否免费" prop="isFree">
        <el-radio-group v-model="dataForm.isFree">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="礼物价格" prop="price">
        <el-input-number
          v-model="dataForm.price"
          placeholder="请输入"
          :precision="0"
          :min="0"
          :max="999999"
          :controls="false"
        ></el-input-number>
        <span style="margin-left: 10px">种子</span>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{
        $t("cancel")
      }}</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmitHandle()">{{
        $t("confirm")
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from "lodash/debounce";
import Upload from "@/components/common/custom-upload";


export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: "",
        createDate: "",
        createBy: "",
        updateDate: "",
        updateBy: "",
        delFlg: "",
        name: "",
        icon: "",
        dynamicIcon: "",
        price: "",
        // isFree: 0,
        status: "",
      },
      filePicList: [],
      fileList: [],
      dataRule: {
        name: [
          { required: true, message: "请输入礼物名称", trigger: "blur" },
          { min: 1, max: 4, message: "长度在 1 到 4 个字符", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Upload,
  },
  watch: {
    visible(n, o) {
      this.fileList = [];
      this.filePicList = [];
    },
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$http
        .get("/sys/sys/gift/" + this.dataForm.id)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data,
          };

          this.fileList = [
            {
              name: "",
              url: res.data.icon,
              response: { data: { url: res.data.icon } },
            },
          ];
          this.filePicList = [
            {
              name: "",
              url: res.data.dynamicIcon,
              response: { data: { url: res.data.dynamicIcon } },
            },
          ];
        })
        .catch(() => {});
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs["dataForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          if(!this.$refs.uploadFile.isUploadAll() || !this.$refs.uploadFilePic.isUploadAll()) 
            return this.$message.warning("还有附件正在上传，请稍后")

          if (!this.fileList.length)
            return this.$message.error("请上传礼物图标");
          if (!this.filePicList.length)
            return this.$message.error("请上传礼物动画");

          this.dataForm.icon = this.fileList[0].url;
          this.dataForm.dynamicIcon = this.filePicList[0].url;

          this.$http[!this.dataForm.id ? "post" : "put"](
            "/sys/sys/gift/",
            this.dataForm
          )
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message({
                message: this.$t("prompt.success"),
                type: "success",
                duration: 500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            })
            .catch(() => {});
        });
      },
      1000,
      { leading: true, trailing: false }
    ),
    //礼物图标上传、删除
    uploadSuccess(file) {
      this.fileList.push(file);
    },
    uploadRemove(file) {
      this.fileList = []
    },
      //礼物动画上传、删除
    uploadPicSuccess(file) {
      this.filePicList.push(file);
    },
    uploadPicRemove(file) {
      this.filePicList = []
    },
  },
};
</script>
