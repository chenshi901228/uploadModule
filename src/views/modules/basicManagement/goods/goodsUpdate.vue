<!--商品编辑-->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      :model="dataForm"
      :rules="dataRule"
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
          <el-form-item label="销售价格：" prop="price">
            <el-input-number
              v-model="dataForm.price"
              :controls="false"
              :precision="2"
              :min="0"
              style="width: 200px"
              placeholder="请输入"
              :max="9999999999"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP结算价格：" prop="settlementPrice">
            <el-input-number
              v-model="dataForm.settlementPrice"
              :controls="false"
              :precision="2"
              :min="0"
              style="width: 200px"
              placeholder="请输入"
              :max="9999999999"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已购人数：" prop="salesNum">
            <el-input-number
              v-model="dataForm.salesNum"
              :controls="false"
              :precision="0"
              :min="0"
              style="width: 200px"
              placeholder="请输入"
              :max="9999999999"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否收集收货地址：" prop="collectReceivingAddress">
            <el-radio-group v-model="dataForm.collectReceivingAddress" :disabled="bookType">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button :disabled="submitLoading" size="small" @click="cancelUpdate"
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
    </div>
  </el-card>
</template>
<script>
import debounce from "lodash/debounce";
import commonModule from "@/mixins/common-module";
export default {
  mixins: [commonModule],
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
    const blurText4 = async (rule, value, callback) => {
      if (Number(value) != 0 && (!Number(value) || Number(value) < 0)) {
        callback(new Error("请输入0或正数"));
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
        collectReceivingAddress: [
          { required: true, message: "请选择是否收集收货地址", trigger: "change" },
        ],
        salesNum: [
          { required: true, message: "请输入已购买人数", trigger: "change" },
          { validator: blurText3, trigger: "change" },
        ],
        settlementPrice: [
          { required: true, message: "请输入APP结算价格", trigger: "change" },
          { validator: blurText4, trigger: "change" },
        ],
      },
      bookType:false,//是否禁用
    };
  },
  watch: {
    "dataForm.price"(v, o) {
      if (v && v.length > 8) {
        this.$message.warning("最大字数不能超过8");
      }
    },
  },
  activated() {
    this.dataForm.id = this.$route.query.id;
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.bookType=false
      this.$http.get(`/sys/course/${this.dataForm.id}`).then(({ data: res }) => {
          if (res.code == 0) {
            this.dataForm = {
              ...this.dataForm,
              ...res.data
            }
            if(this.dataForm.collectReceivingAddress == null) this.dataForm.collectReceivingAddress = 0
            if(this.dataForm.productType=='书籍'){
              this.dataForm.collectReceivingAddress = 1
              this.bookType=true
            }
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
    // 表单提交
    submit: debounce(
      function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            let params = {};
            params = JSON.parse(JSON.stringify(this.dataForm));
            this.submitLoading = true;
            this.$http
              .put("/sys/course/updateCollectReceivingAddress", {
                id: params.id,
                price: params.price,
                collectReceivingAddress: params.collectReceivingAddress,
                salesNum: params.salesNum,
                settlementPrice: params.settlementPrice,
              })
              .then(({ data: res }) => {
                if (res.code == 0) {
                  this.$message.success("编辑商品信息成功");
                  this.submitLoading = false;
                  this.cancelUpdate();
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
      1500,
      { leading: true, trailing: false }
    ),
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