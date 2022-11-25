<template>
  <div class="detalilBox">
    <div class="detalilBox_top">
      <div style="display: flex; margin: 20px 0 10px">
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >真实姓名：</span
        >
        {{ diaForm.realName || "-" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >手机号码：</span
        >
        {{ diaForm.phone || "-" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >身份证号：</span
        >
        {{ diaForm.idCard || "-" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >主播昵称：</span
        >
        {{ diaForm.anchorName || "-" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >群组名称：</span
        >
        {{ diaForm.groupName || "-" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px; align-items: center">
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >群组二维码</span
        >
        <el-image
          style="width: 60px; height: 60px"
          :src="diaForm.groupImage"
          :preview-src-list="[diaForm.groupImage]"
        >
          <div slot="error" class="image-slot">
            <span v-if="diaForm.groupImage">加载失败</span>
            <span v-else>暂无图片</span>
          </div>
        </el-image>
      </div>
      <div
        v-if="diaForm.status != 0"
        style="display: flex; margin: 20px 0 10px"
      >
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >备注：</span
        >
        {{ diaForm.auditRemark }}
      </div>
      <div
        v-if="diaForm.status == 0"
        style="display: flex; margin: 20px 0 10px"
      >
        <span style="width: 120px; text-align: right; margin: 0 10px"
          >备注：</span
        >
        <el-input
          show-word-limit
          type="textarea"
          maxlength="100"
          placeholder="请输入，可不填"
          v-model="diaForm.auditRemark"
        />
      </div>
    </div>

    <div class="detalilBox_bottom">
      <el-button
        size="small"
        type=""
        @click="updateApplyInfoStatus(-1)"
        v-if="diaForm.status === 0"
        >驳回</el-button
      >
      <el-button
        size="small"
        type="primary"
        @click="updateApplyInfoStatus(1)"
        v-if="diaForm.status === 0"
        >通过</el-button
      >
    </div>

    <!-- 审核状态图片 -->
    <img v-if="statusImg" class="statusImg" :src="statusImg" alt="" />
  </div>
</template>
<script>
import commonModule from "@/mixins/common-module";
export default {
  mixins: [commonModule],
  name: "complainsRecords_detail",
  data() {
    return {
      userId: "",
      diaForm: null,
    };
  },
  activated() {
    this.diaForm = JSON.parse(
      window.localStorage.getItem("anchor-approvalDetail")
    );
    if (this.diaForm.status === 0) {
      this.diaForm.auditRemark = ''
    }
  },
  computed: {
    // 审核状态图片
    statusImg() {
      if (this.diaForm && this.diaForm.status == 0)
        return require("@/assets/icon/icon_applying.png");
      if (this.diaForm && this.diaForm.status == 1)
        return require("@/assets/icon/icon_agree.png");
      if (this.diaForm && this.diaForm.status == -1)
        return require("@/assets/icon/icon_reject.png");
      return "";
    },
  },
  methods: {
    // 审核
    updateApplyInfoStatus(status) {
      this.$confirm(
        `是否执行 [${status == -1 ? "拒绝" : "同意"}] 操作`,
        this.$t("prompt.title"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.$http.put('/sys/weixinfansgroup/updateStatus', {
            id: this.diaForm.id,
            status,
            auditRemark: this.diaForm.auditRemark
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success("操作成功");
              this.closeCurrentTab();
              this.$bus.$emit("change");
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
  },
};
</script>
  
  <style lang="scss">
.detalilBox {
  height: 100%;
  background: #fff;
  min-height: calc(100vh - 50px - 38px);
  padding: 20px 30px;

  .statusImg {
    width: 100px;
    position: absolute;
    top: 10px;
    right: 100px;
  }

  .image-slot {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    font-size: 12px;
  }

  // .detalilBox_top {
  //   height: calc(100vh - 190px);
  //   overflow: auto;
  // }
  .detalilBox_bottom {
    height: 40px;
    text-align: right;
    padding: 0 20px;
    margin-top: 20px;
  }
}
.tag {
  width: 150px;
  text-align: center;
  background: #ccc;
  margin-right: 20px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
}
</style>
