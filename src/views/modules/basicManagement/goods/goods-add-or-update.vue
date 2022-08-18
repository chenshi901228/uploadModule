<!--商品编辑-->
<template>
  <el-dialog
    top="20px"
    :visible.sync="visible"
    width="30%"
    :title="!dataForm.id ? $t('add') : $t('update')"
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
      <el-form-item label="商品名称：">
        <span>{{ dataForm.productName }}</span>
      </el-form-item>
      <el-form-item label="商品价格：">
        <span>￥{{ dataForm.oldPrice }}</span>
      </el-form-item>
      <el-form-item label="销售价格：" prop="price">
        ￥&nbsp;
        <el-input-number
          v-model="dataForm.price"
          :controls="false"
          :precision="2"
          :min="0"
          placeholder="请输入"
          :max="9999999999"
        >
        </el-input-number>

  
      </el-form-item>
      <el-form-item label="库存数量：" prop="stock">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input-number
          v-model="dataForm.stock"
          :controls="false"
          :precision="0"
          :min="0"
          placeholder="请输入"
          :max="9999999999"
        >
        </el-input-number>
        <!-- <el-input-number
          v-model="dataForm.stock"
          placeholder="库存数量"
        ></el-input-number> -->
      </el-form-item>
      <el-form-item label="已购买人数：" prop="buyers">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input-number
          v-model="dataForm.buyers"
          :controls="false"
          :precision="0"
          :min="0"
          placeholder="请输入"

          :max="9999999999"
        >
        </el-input-number>

        <!-- <el-input v-model="dataForm.buyers" placeholder="已购买人数"></el-input> -->
      </el-form-item>
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
        >修 改</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    const blurText1 = async (rule, value, callback) => {
      if (Number(value) != 0 && (!Number(value) || Number(value) < 0)) {
        callback(new Error("请输入0或正数"));
      }
    };
    const blurText2 = async (rule, value, callback) => {
      const boolean = new RegExp("^\\d+$").test(value);
      if (!boolean) {
        callback(new Error("请输入0或正整数"));
      }
    };
    const blurText3 = async (rule, value, callback) => {
      const boolean = new RegExp("^\\d+$").test(value);
      if (!boolean) {
        callback(new Error("请输入0或正整数"));
      }
    };
    return {
      visible: false,
      dataForm: {},
      submitLoading: false,
      dataRule: {
        price: [
          { required: true, message: "请输入销售价格", trigger: "change" },
          { validator: blurText1, trigger: "change" },
        ],
        stock: [
          { required: true, message: "请输入库存数量", trigger: "change" },
          { validator: blurText2, trigger: "change" },
        ],
        buyers: [
          { required: true, message: "请输入已购买人数", trigger: "change" },
          { validator: blurText3, trigger: "change" },
        ],
      },
    };
  },
  watch: {
    "dataForm.price"(v, o) {
      if (v && v.length > 8) {
        this.$message.warning("最大字数不能超过8");
      }
    },
  },
  methods: {
    init(data) {
      if (data) this.dataForm = JSON.parse(JSON.stringify(data));
      this.dataForm.stock = this.dataForm.stock == null ? 0 : this.dataForm.stock
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
          this.submitLoading = true;
          this.$http
            .put("/sys/course", {
              id: params.id,
              price: params.price,
              stock: params.stock,
              buyers: params.buyers,
            })
            .then(({ data: res }) => {
              if (res.code == 0) {
                this.$message.success("修改商品成功");
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