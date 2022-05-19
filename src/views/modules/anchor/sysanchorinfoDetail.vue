<template>
  <div class="detalilBox">
      <div class="detalilBox_top">
            <!-- <div style="display: flex; margin: 20px 0 10px">主播头像：</div>
      <div style="display: flex; margin: 0 20px">
        <img :src="
                diaForm.avatarUrl ||
                'https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png'
              " style="width:60px;height:60px" alt="">
        </div> -->
      <div style="display: flex; margin: 20px 0 10px; align-items: center;">
       <span style="width:100px;text-align:right;margin:0 10px">主播头像：</span> <img :src="
                diaForm.avatarUrl ||
                'https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png'
              " style="width:60px;height:60px" alt="">
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">主播昵称：</span> {{ diaForm.username }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">真实姓名：</span> {{ diaForm.realName || '--' }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">手机号码：</span> {{ diaForm.phone }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">身份证号：</span> {{ diaForm.idCard || '--' }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">性别：</span> {{
          diaForm.gender === 0 ? "男" : diaForm.gender === 1 ? "女" : "保密"
        }}
      </div>
        <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">主播介绍：</span> <span style="word-break: break-all;max-width:800px;">{{ diaForm.introduce }}</span>
      </div>
      <!-- <div style="display: flex; margin: 20px 0 10px">主播介绍：</div>
      <div style="display: flex; margin: 0 20px">{{ diaForm.introduce }}</div> -->
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">是否认证：</span> {{ diaForm.legalizeFlg === 1 ? "认证" : "未认证" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">是否是指导师：</span> {{ diaForm.tutorFlg === 1 ? "认证" : "未认证" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">备注：</span>
        <el-input show-word-limit type="textarea" maxlength="100" placeholder="请输入，可不填" v-model="diaForm.remark" :disabled="diaForm.status != 0"/>
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
      vm.diaForm = JSON.parse(
        window.localStorage.getItem("sysanchorinfoDetailData")
      );
    });
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
          this.$http["put"]("/sys/anchor/applyInfo/", {
            id: this.diaForm.id,
            status,
            remark:this.diaForm.remark
          })
            .then(({ data: res }) => {
              if (res.code != 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success('操作成功');
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
  padding: 20px 30px;

  .detalilBox_top {
    height: calc(calc(100vh - 240px));
    overflow: auto;
    word-break: break-all;
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