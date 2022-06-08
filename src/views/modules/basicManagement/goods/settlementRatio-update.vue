<!-- 结算比例设置 -->
<template>
  <el-dialog
    top="20px"
    :visible.sync="visible"
    width="30%"
    :title="$t('update')"
    :close-on-click-modal="false"
    @close="cancel"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      label-width="110px"
    >
      <el-form-item label="结算比例：" prop="proportion">
        <el-input-number
          v-model="dataForm.proportion"
          :controls="false"
          :precision="0"
          :min="0"
          :max="99"
        >
        </el-input-number>
      </el-form-item>
      <div>结算比例范围：0%~99%</div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="submitLoading" size="small" @click="visible = false"
        >取 消</el-button
      >
      <el-button
        :disabled="submitLoading"
        :loading="submitLoading"
        size="small"
        type="primary"
        @click="submit"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {},
      submitLoading: false,
      dataRule: {
        proportion: [
          { required: true, message: "请输入结算比例", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    init(data) {
      if (data) this.dataForm = JSON.parse(JSON.stringify(data));
      this.visible = true;
    },
    // 取消添加
    cancel() {
      this.$refs.dataForm.resetFields();
      this.dataForm = {};
    },
    // 表单提交
    submit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let params = {};
          params = JSON.parse(JSON.stringify(this.dataForm));
          params.anchorIdList = []
          params.anchorIdList.push(params.anchorId)
          this.submitLoading = true;
          this.$http
            .post("/sys/productProportion/updateProportionWithAnchor", {
              anchorIdList: params.anchorIdList,
              productId: params.productId,
              proportion: params.proportion
            })
            .then(({ data: res }) => {
              if (res.code == 0) {
                this.$message.success("修改结算比例成功");
                this.submitLoading = false;
                this.cancel();
                this.visible = false;
                this.$emit("refreshDataList");
              } else {
                this.submitLoading = false;
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.submitLoading = false;
              throw err;
            });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-input {
  width: 200px;
}
</style>