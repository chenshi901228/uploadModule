<template>
  <div class="detalilBox">
    <div class="detalilBox_top" style="display:flex;">
      <div style="border:1px solid #E7EBF5;width: calc(100% - 120px);">
        <el-descriptions class="margin-top" :column="2" size="small" border>

          <el-descriptions-item>
            <template slot="label">
              用户昵称
            </template>
            {{ diaForm.username }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              手机号码
            </template>
            {{ diaForm.phone }}
          </el-descriptions-item>


        </el-descriptions>
        <div style="display: flex; margin: 10px">
          <div class="tag" v-for="(i, k) in diaForm.tag" :key="k">
            {{ i }}
          </div>
        </div>
      </div>

      <!-- 审核状态图片 -->
      <img v-if="statusImg" class="statusImg" :src="statusImg" alt="">
    </div>
    <div class="detalilBox_top" style="margin:20px 0;display: flex;justify-content: space-between;flex-wrap: wrap;    padding: 10px 130px 10px 10px;">
      <div
        style="height: 50px;width:100%;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;">
        投诉主播
      </div>
      <div style="display:flex;width: 48%;align-items: center;">
        <div style="text-align: right;">主播昵称</div>
        <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
          <el-input v-model="diaForm.anchorUserName" disabled style="border:1px solid #D7DAE2" size="small"></el-input>
        </div>
      </div>
      <div style="display:flex;width: 48%;align-items: center;">
        <div style="text-align: right;">手机号码</div>
        <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
          <el-input v-model="diaForm.anchorPhone" disabled style="border:1px solid #D7DAE2" size="small"></el-input>
        </div>
      </div>
      <div style="display:flex;width: 100%;align-items: center;margin: 20px 0;">
        <div style="text-align: right;">投诉内容</div>
        <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
          <el-input v-model="diaForm.content" disabled style="border:1px solid #D7DAE2" size="small"></el-input>
        </div>
      </div>
      <div style="display:flex;width: 48%;align-items: center;">
        <div style="text-align: right;">投诉图片</div>
        <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
          <el-image v-for="(url, k) in diaForm.fileUrl" :key="k" style="width: 80px; height: 80px; margin-right: 20px"
          :src="url" fit="cover" :preview-src-list="diaForm.fileUrl">
        </el-image>
        </div>
      </div>
      <div style="display:flex;width: 48%;align-items: center;">
        <div style="text-align: right;">联系方式</div>
        <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
          <el-input v-model="diaForm.contactPhone" disabled style="border:1px solid #D7DAE2" size="small"></el-input>
        </div>
      </div>
    </div>
    <div class="detalilBox_top" style="display:flex;">
      <div style="display: flex; margin: 0px 0 10px">处理方案</div>
      <div style="display: flex; margin: 0 20px ;   width: calc(100% - 100px );">
        <el-input v-model="diaForm.solution" type="textarea" :rows="2"
          :disabled="diaForm.handlingStatus == 1 ? true : false" style="border:1px solid #D7DAE2" maxlength="200"
          show-word-limit></el-input>
      </div>
    </div>
    

    <div class="detalilBox_bottom" v-if="!diaForm.handlingStatus">
      <el-button size="small" type="primary" @click="updateCheckStatus()">处理</el-button>
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
  computed: {
    // 审核状态图片
    statusImg() {
      if (this.diaForm && this.diaForm.handlingStatus == 0) return require("@/assets/icon/untreated.png")
      if (this.diaForm && this.diaForm.handlingStatus == 1) return require("@/assets/icon/Processed.png")

      return ""
    }
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
        .catch(() => { });
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
    box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.1600);
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