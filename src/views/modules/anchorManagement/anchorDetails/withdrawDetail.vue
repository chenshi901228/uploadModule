// 申请提现详情

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-descriptions :title="'提现单号:' + id"></el-descriptions>
      <div class="tag">
        <!-- <el-tag
          :type="$route.query.withdrawStatus === '4' ? 'success' : 'info'"
          >{{
            $route.query.withdrawStatus === '1'
              ? "审核中"
              : $route.query.withdrawStatus === '2'
              ? "核算中"
              : $route.query.withdrawStatus === '3'
              ? "到帐中"
              : $route.query.withdrawStatus === '4'
              ? "已到账"
              : $route.query.withdrawStatus === '5'
              ? "未到账"
              : "--"
          }}</el-tag
        > -->
        <img :src="getStatusPic($route.query.withdrawStatus)" alt="">
      </div>
      <el-descriptions title="用户信息">
        <el-descriptions-item label="提现金额:">{{
          info.amount || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="到账金额:">{{
          info.receivedAmount || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="税费:">{{
          info.sumTax
        }}</el-descriptions-item>
        <el-descriptions-item label="本次代征增值税:">{{
          info.addedValueTax || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="本次代征附加税:">{{
          info.additionalTax || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="本次代征个税:">{{
          info.personalIncomeTax || "--"
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="提现账户">
        <el-descriptions-item
          :label="
            info.userType === 1 ? '个人' : info.userType === 2 ? '企业' : '--'
          "
          >{{ info.username || "--" }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="
            info.userType === 1
              ? '身份证号'
              : info.userType === 2
              ? '统一社会信用代码'
              : '--'
          "
          >{{ info.companyCreditCode || "--" }}</el-descriptions-item
        >
        <el-descriptions-item label="账户类型:">{{
          info.userType === 1 ? "个人" : info.userType === 2 ? "企业" : "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="开户银行:">{{
          info.depositBank || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="支行名称:">{{
          info.branchName || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="账户名称:">{{
          info.accountName || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="银行账号:">{{
          info.bankAccount || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="开户行所在地:">{{
          info.address || "--"
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="开票金额">
        <el-descriptions-item label="开票金额:">{{
          info.amount ? "￥" + info.amount : "--"
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="开票信息">
        <el-descriptions-item label="名称:">{{
          invoiceInfo.name || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="纳税人识别号:">{{
          invoiceInfo.taxpayer_identification_number || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="地址电话:">{{
          invoiceInfo.address || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="开户行及账号:">{{
          invoiceInfo.open_account || "--"
        }}</el-descriptions-item>
      </el-descriptions>
      <div style="color: red; margin-bottom: 10px">
        注：可增值税专用发票或增值税普通发票；
      </div>
      <el-descriptions title="发票邮寄">
        <el-descriptions-item label="收件人:">{{
          invoiceAddress.recipient || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="电话:">{{
          invoiceAddress.phone || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="邮寄地址:">{{
          invoiceAddress.mailing_address || "--"
        }}</el-descriptions-item>
        <el-descriptions-item label="邮箱地址:">{{
          invoiceAddress.email || "--"
        }}</el-descriptions-item>
      </el-descriptions>
      <div style="color: red; margin-bottom: 10px">
        注：纸质发票需邮寄至以上地址，电子发票发送邮寄即可
      </div>
      <div class="btn">
        <el-button @click="close" size="small" type="primary">关闭</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import ComModule from "@/mixins/common-module";
export default {
  mixins: [ComModule],
  components: {},
  data() {
    return {
      id: "",
      info: {},
      invoiceAddress: {},
      invoiceInfo: {},
    };
  },
  watch: {},
  activated() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.getDetail(this.id);
      this.getPaper();
      this.getAddress();
    }
  },
  computed: {},
  created() {},
  methods: {
    //获取详情
    getDetail(id) {
      this.$http
        .get(`/sys/anchorWithdraw/${id}`)
        .then(({ data: res }) => {
          if (res.code != 0) return this.$message.error(res.msg);
          this.info = res.data;
        })
        .catch((err) => {});
    },
    //关闭
    close() {
      this.closeCurrentTab();
    },
    //处理数据
    getInvoiceInfo(data) {
      //数据字典返回数据生成对象
      let arr = {};
      data.map((item) => {
        arr[item.dictValue] = item.dictLabel;
      });
      return arr;
    },
    //获取开票信息
    getPaper() {
      this.$http
        .get(
          "/sys/dict/data/pageWithName?page=1&limit=20&dictTypeId=1548963270769565698"
        )
        .then(({ data: res }) => {
          if (res.code != 0) return this.$message.error(res.msg);
          const data = res.data;
          if (!data) return this.$message.error("无开票信息");
          this.invoiceAddress = this.getInvoiceInfo(data);
        })
        .catch((err) => {});
    },
    //获取地址
    getAddress() {
      this.$http
        .get(
          "/sys/dict/data/pageWithName?page=1&limit=20&dictTypeId=1548961326764187650"
        )
        .then(({ data: res }) => {
          if (res.code != 0) return this.$message.error(res.msg);
          const data = res.data;
          if (!data) return this.$message.error("无开票信息");
          this.invoiceInfo = this.getInvoiceInfo(data);
        })
        .catch((err) => {});
    },
    //获取图片地址
    getStatusPic(status) {
      let src = ''
      switch(status) {
        case '1':
          src = require('@/assets/img/in_review_yl.png')
          break
        case '2':
          src = require('@/assets/img/accounting_yl.png')
          break
        case '3':
          src = require('@/assets/img/in_account_yl.png')
          break
        case '4':
          src = require('@/assets/img/is_received_yl.png')
          break
        case '5':
          src = require('@/assets/img/not_received_yl.png')
          break
        default:
          src = require('@/assets/img/not_received_yl.png')
      }
      return src
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  position: relative;
  /deep/.el-descriptions__header {
    border-left: 5px solid #409eff;
    padding-left: 5px;
  }
  .tag {
    // display: flex;
    // justify-content: flex-end;
    // width: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
  /deep/.btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>