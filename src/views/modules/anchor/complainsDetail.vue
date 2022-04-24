<template>
  <div class="detalilBox">
    <div class="detalilBox_top">
      <div style="display: flex">
        <div>直播昵称：{{ diaForm.username }}</div>
        <div style="margin: 0 80px">手机号码：{{ diaForm.phone }}</div>
      </div>
      <div style="display: flex; margin: 20px 0">
        <div class="tag" v-for="(i, k) in diaForm.tag" :key="k">{{ i }}</div>
      </div>
      <div style="display: flex; margin: 20px 0 10px">投诉内容：</div>
      <div style="display: flex; margin: 0 20px">{{ diaForm.content }}</div>
      <div style="display: flex; margin: 20px 0 10px">投诉图片：</div>
      <div style="display: flex; margin: 0 20px">
        <img
          v-for="(i, k) in diaForm.fileUrl"
          :key="k"
          :src="i"
          alt=""
          style="width: 140px; height: 80px; margin-right: 20px"
        />
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
        ></el-input>
      </div>
    </div>

    <div class="detalilBox_bottom">
      <el-button size="small" type="primary" @click="updateCheckStatus()"
        >处理</el-button
      >
      <el-button size="small" @click="closeCurrentTab()">取消</el-button>
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
      diaForm: {},
      mixinViewModuleOptions: {
        createdIsNeed: false, // 此页面是否在创建时，调用查询数据列表接口？
      },
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userId = window.localStorage.getItem("complainsDetailID");
      vm.$http
        .get(`/sys/manage/complaint/${vm.userId}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return vm.$message.error(res.msg);
          }
          vm.diaForm = res.data;
          vm.diaForm.tag = vm.diaForm.tag ? vm.diaForm.tag.split(",") : [];
          vm.diaForm.fileUrl = vm.diaForm.fileUrl
            ? vm.diaForm.fileUrl.split(",")
            : [];
        })
        .catch(() => {});
    });
  },
  methods: {
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