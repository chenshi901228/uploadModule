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
      @keyup.enter.native="dataFormSubmitHandle()"
      :label-width="$i18n.locale === 'en-US' ? '120px' : '120px'"
    >
      <el-form-item label="等级" prop="level">
        <!-- <el-input-number
          style="width: 100%; text-align: left"
          v-model="dataForm.level"
          placeholder="等级"
          :controls="false"
          :min="1"
          :step="1"
          step-strictly
          :disabled="dataForm.id"
        ></el-input-number> -->

        <el-input
          maxlength="10"
          v-model="dataForm.level"
          placeholder="等级"
          :disabled="dataForm.id.length !== 0 ? true : false"
          :oninput="(dataForm.level = dataForm.level.toString().replace(/[^0-9.]/g, ''))"
        ></el-input>
      </el-form-item>
      <el-form-item label="等级名称" prop="levelName">
        <el-input
          maxlength="6"
          v-model="dataForm.levelName"
          placeholder="等级名称"
          :disabled="dataForm.id.length !== 0 ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="亲密值要求" prop="intimacyNum">
        <el-input
          maxlength="10"
          v-model="dataForm.intimacyNum"
          placeholder="亲密值要求"
          :disabled="dataForm.id.length !== 0 ? true : false"
          :oninput="(dataForm.intimacyNum = dataForm.intimacyNum.replace(/[^0-9.]/g, ''))"
        ></el-input>

        <!-- <el-input-number
          v-model="dataForm.intimacyNum"
          style="width: 100%; text-align: left"
          :controls="false"
          :min="0"
          :step="1"
          step-strictly
          placeholder="亲密值要求"
        ></el-input-number> -->
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmitHandle('dataForm')">{{
        $t("confirm")
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from "lodash/debounce";
import Upload from "@/components/upload/index";

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
        level: "",
        levelName: "",
        intimacyNum: "",
        status: "",
      },
      dataRule: {
        level: [
          { required: true, message: "请输入等级", trigger: "blur" },
        ],
        levelName: [
          { required: true, message: "请输入等级名称", trigger: "blur" },
        ],
        intimacyNum: [
          { required: true, message: "请输入亲密值要求", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Upload,
  },
  watch: {
    "dataForm.level"(v, o) {
      let str = v.toString();
      if (str.length > 10) {
        this.$message.warning("最大字数不能超过10");
      }
    },
    "dataForm.levelName"(v, o) {
      if (v.length > 6) {
        this.$message.warning("最大字数不能超过6");
      }
    },
    "dataForm.intimacyNum"(v, o) {
      let str = v.toString();
      if (str.length > 10) {
        this.$message.warning("最大字数不能超过10");
      }
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
        .get("/sys/sysfanslevel/" + this.dataForm.id)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data,
          };
        })
        .catch(() => {});
    },
    // 表单提交
    dataFormSubmitHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http[!this.dataForm.id ? "post" : "put"](
            "/sys/sysfanslevel",
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style  >
.el-input-number .el-input__inner {
  text-align: left;
}
</style>