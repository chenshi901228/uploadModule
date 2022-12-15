<!--商品查看-->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      :model="dataForm"
      ref="dataForm"
      label-width="150px"
      size="small"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称：">
            <el-tooltip class="item" effect="dark" :content="dataForm.productName" placement="top">
              <span class="productName">{{ dataForm.productName }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品类型：">
            <span>{{ dataForm.productType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品价格：">
            <span>{{ dataForm.oldPrice }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售价格：">
            <span>{{ dataForm.price }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP结算价格：">
            <span>{{ dataForm.settlementPrice }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已购人数：">
            <span>{{ dataForm.buyers }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否收集收货地址：">
            <el-radio-group v-model="dataForm.collectReceivingAddress" disabled>
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button :disabled="submitLoading" size="small" @click="cancelUpdate"
        >关 闭</el-button
      >
    </div>
  </el-card>
</template>
<script>
import commonModule from "@/mixins/common-module";
export default {
  mixins: [commonModule],
  data() {
    return {
      visible: false,
      dataForm: {},
      submitLoading: false,
    };
  },
  activated() {
    this.dataForm.id = this.$route.query.id;
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.$http.get(`/sys/course/${this.dataForm.id}`).then(({ data: res }) => {
          if (res.code == 0) {
            this.dataForm = {
              ...this.dataForm,
              ...res.data
            }
            if(this.dataForm.collectReceivingAddress == null) this.dataForm.collectReceivingAddress = 0
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 取消编辑
    cancelUpdate() {
      this.closeCurrentTab()
    },
  },
};
</script>
<style lang="scss" scoped>
.productName {
  display: block;
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>