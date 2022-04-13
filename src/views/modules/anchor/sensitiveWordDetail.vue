<template>
  <div class="detalilBox">
    <div class="detalilBox_top">
      <div
        style="margin: 0 0 20px"
        
      >
        审核状态：
        <span :style="{
          color:
            diaForm.checkStatus === 1
              ? '#67c23a'
              : diaForm.checkStatus === 2
              ? '#000'
              : '#f43030'
        }">
        {{
          diaForm.checkStatus === 1
            ? "通过"
            : diaForm.checkStatus === 2
            ? "待审核"
            : "驳回"
        }}
        </span>
        
      </div>
      <div style="display: flex">
        <div>直播昵称：{{ diaForm.nickName }}</div>
        <div style="margin: 0 80px">手机号码：{{ diaForm.phone }}</div>
      </div>
      <div style="display: flex; margin: 20px 0">
        <div class="tag" v-for="(i, k) in details" :key="k">
          {{ i }}
        </div>
      </div>
      <div style="display: flex; margin: 20px 0 10px">审核内容：</div>
      <div style="display: flex; margin: 0 20px">{{ diaForm.content }}</div>

      <div style="display: flex; margin: 20px 0 10px">审核备注：</div>
      <div style="display: flex; margin: 0 20px">
        <el-input
          v-model="diaForm.remark"
          type="textarea"
          :rows="6"
          :readonly="!(diaForm.checkStatus === 2)"
          maxlength="200"
          show-word-limit
        ></el-input>
      </div>
    </div>

    <div class="detalilBox_bottom">
      <el-button
        size="small"
        type=""
        @click="updateCheckStatus(3)"
        v-if="diaForm.checkStatus === 2"
        >驳回</el-button
      >
      <el-button
        size="small"
        type="primary"
        @click="updateCheckStatus(1)"
        v-if="diaForm.checkStatus === 2"
        >通过</el-button
      >
    </div>
  </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],

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

  mounted() {
    this.userId = this.$route.params.data.id;
    this.$http
      .get(`sys/sensitiveWordCheck/getInfo?id=${this.$route.params.data.id}`)
      .then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.diaForm = res.data;
        this.details = this.diaForm.details
          ? this.diaForm.details.split(",")
          : [];
      })
      .catch(() => {});
  },
  watch: {
    "$route.params.data"(val) {
      if (val) {
        this.userId = val.id;
        this.$http
          .get(
            `sys/sensitiveWordCheck/getInfo?id=${this.$route.params.data.id}`
          )
          .then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            this.diaForm = res.data;
            this.details = this.diaForm.details
              ? this.diaForm.details.split(",")
              : [];
          })
          .catch(() => {});
      }
    },
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
            .get("sys/sensitiveWordCheck/updateCheckStatus", {
              params: {
                id: this.diaForm.id,
                status: type,
                remark: this.diaForm.remark,
              },
            })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success(res.data);
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

<style lang="scss" scoped>
.detalilBox {
  height: 100%;
  background: #fff;
  min-height: calc(calc(100vh - 50px - 38px - 30px));
  padding: 40px 30px;

  .detalilBox_top {
    height: calc(calc(100vh - 240px));
    overflow: auto;
  }
  .detalilBox_bottom {
    height: 40px;
    text-align: right;
    padding: 0 20px;
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