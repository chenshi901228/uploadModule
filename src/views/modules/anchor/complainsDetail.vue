<template>
  <div class="detalilBox">
    <div class="detalilBox_top">
      <div style="display: flex">
        <div>用户昵称：{{ diaForm.username }}</div>
        <div style="margin: 0 80px">手机号码：{{ diaForm.phone }}</div>
      </div>
      <div style="display: flex; margin: 20px 0">
        <div class="tag" v-for="(i, k) in diaForm.tag" :key="k">{{ i }}</div>
      </div>
      <div style="display: flex; margin: 20px 0 10px">投诉内容：</div>
      <div style="display: flex; margin: 0 20px">{{ diaForm.content }}</div>
      <div style="display: flex; margin: 20px 0 10px">投诉图片：</div>
      <div style="display: flex; margin: 0 20px">
        <el-image 
          v-for="(url, k) in diaForm.fileUrl"
          :key="k"
          style="width: 140px; height: 80px; margin-right: 20px"
          :src="url" 
          fit="cover"
          :preview-src-list="diaForm.fileUrl">
        </el-image>
      </div>
      <div style="display: flex; margin: 20px 0 10px">
        联系方式：{{ diaForm.contactPhone }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">处理方案：</div>
      <div style="display: flex; margin: 0 20px">
        <el-input
          v-model="diaForm.solution"
          type="textarea"
          :rows="6"
          maxlength="200"
          show-word-limit
          :disabled="diaForm.handlingStatus == 1 ? true : false"
        ></el-input>
      </div>
    </div>

    <div class="detalilBox_bottom">
      <el-button size="small" type="primary" v-if="!diaForm.handlingStatus" @click="updateCheckStatus()"
        >处理</el-button
      >
      <el-button size="small" @click="closeCurrentTab()">取消</el-button>
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
      diaForm: {},
    };
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.userId = this.$route.query.complainsDetailID
      this.$http
        .get(`/sys/manage/complaint/${this.userId}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.diaForm = res.data;
          this.diaForm.tag = this.diaForm.tag ? this.diaForm.tag.split(",") : [];
          this.diaForm.fileUrl = this.diaForm.fileUrl
            ? this.diaForm.fileUrl.split(",")
            : [];
        })
        .catch(() => {});
    },
    // 审核
    updateCheckStatus() {
      this.$confirm(`是否处理该条投诉`, {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(() => {
          this.$http
            .get("/sys/manage/complaint/handling", {
              params: {
                id: this.diaForm.id,
                solution: this.diaForm.solution,
              },
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

<style lang="scss" scoped>
.detalilBox {
  height: 100%;
  background: #fff;
  min-height: calc(calc(100vh - 50px - 38px));
  padding: 40px 30px;

  .detalilBox_top {
    height: calc(calc(100vh - 240px));
    overflow: auto;
  }
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