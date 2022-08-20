<template>
  <div class="detalilBox">
    <div class="detalilBox_top" style="display:flex;">
      <div style="border:1px solid #E7EBF5;width: calc(100% - 120px);">
        <el-descriptions class="margin-top" :column="2" size="small" border>

          <el-descriptions-item>
            <template slot="label">
              用户昵称
            </template>
            {{ diaForm.nickName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              手机号码
            </template>
            {{ diaForm.phone }}
          </el-descriptions-item>


        </el-descriptions>
        <div style="display: flex; margin: 10px">
          <div class="tag" v-for="(i, k) in details" :key="k">
            {{ i }}
          </div>
        </div>
      </div>

    <!-- 审核状态图片 -->
    <img v-if="statusImg" class="statusImg" :src="statusImg" alt="">
    </div>
    <div class="detalilBox_top" style="margin:20px 0">
      <div
        style="height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;">
        审核内容
      </div>
      <div style="display: flex ;font-size: 14px;color: #000;">{{ diaForm.content }}</div>
    </div>
    <div class="detalilBox_top" style="display:flex;">
      <div style="display: flex; margin: 0px 0 10px">备注</div>
      <div style="display: flex; margin: 0 20px;    width: calc(100% - 70px );" >
        <el-input v-model="diaForm.remark" type="textarea" :rows="2"  :disabled="!(diaForm.checkStatus === 2)"
        style="border:1px solid #D7DAE2"
          maxlength="100"  show-word-limit></el-input>
      </div>
    </div>

    <div class="detalilBox_bottom" v-if="diaForm.checkStatus === 2">
      <el-button size="small" type="primary" @click="updateCheckStatus(1)">通过</el-button>
      <el-button size="small" type="" @click="updateCheckStatus(4)">驳回</el-button>

    </div>
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
      diaForm: {
        content: "",
      },
      details: [],
    };
  },
  activated() {
    this.userId = window.localStorage.getItem("sensitiveWordDetailID");
      this.$http
        .get(`/sys/sensitiveWordCheck/getInfo?id=${this.userId}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.diaForm = res.data;
          this.details = this.diaForm.details ? this.diaForm.details.split(",") : [];
          for (let index = 0; index < this.details.length; index++) {
            if (this.details[index] == "") {
              this.details.splice(1, index);
            }
          }
        })
        .catch(() => { });
  },
  computed: {
    // 审核状态图片
    statusImg() {
      if (this.diaForm && this.diaForm.checkStatus == 2) return require("@/assets/icon/icon_applying.png")
      if (this.diaForm && this.diaForm.checkStatus == 1) return require("@/assets/icon/icon_agree.png")
      if (this.diaForm && this.diaForm.checkStatus == 4) return require("@/assets/icon/icon_reject.png")
      return ""
    }
  },
  methods: {
    // 审核
    updateCheckStatus(type) {
      this.$confirm(`是否${type === 1 ? "通过" : "驳回"}该审批`, {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/sys/sensitiveWordCheck/updateCheckStatus", {
              id: this.diaForm.id,
              status: type,
              remark: this.diaForm.remark,
            })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success("操作成功");
              this.closeCurrentTab();
              this.$bus.$emit("change");
            })
            .catch(() => { });
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scoped>
.detalilBox {
  height: 100%;
  min-height: calc(calc(100vh - 50px - 38px - 30px));
  padding: 10px;

  .detalilBox_top {
    background: #fff;
    padding: 10px;
    box-shadow: 0px 0px 4px 3px rgba(0,0,0,0.1600);
  }

  .detalilBox_bottom {
    height: 40px;
    padding: 20px 0;
  }
}
.statusImg {
  width: 100px;
  margin-left: 10px;
}

.tag {
  text-align: center;
  margin: 0 15px 0 0;
  line-height: 30px;
  border-radius: 20px;
    padding: 0 10px;
  color: #3095FA;
  height: 30px;
  background: #E9F4FE;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  font-size: 12px;
  border: 1px solid #A9D3FD;
}

/deep/ th.el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label {
  width: 120px;
  text-align: right;
}
</style>