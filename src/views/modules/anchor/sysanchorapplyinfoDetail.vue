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
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">真实姓名：</span> {{ diaForm.realName || '-' }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">手机号码：</span> {{ diaForm.phone || '-'  }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">身份证号：</span> {{ diaForm.idCard || '-' }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">性别：</span> {{
          diaForm.gender === 0 ? "男" : diaForm.gender === 1 ? "女" : "保密"
        }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">更改：</span> {{ diaForm.updateType==1?'全部':diaForm.updateType==2?'修改名称':diaForm.updateType==3?'修改简介':diaForm.updateType==4?'修改头像':diaForm.updateType==5?'主播二维码':'-'}}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">主播昵称：</span> {{ diaForm.username || '-'  }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
        <span style="width:120px;text-align:right;margin:0 10px">主播简介：</span> <span style="word-break: break-all;max-width:800px;">{{ diaForm.introduce  || '-' }}</span>
      </div>
      <div style="display: flex; margin: 20px 0 10px; align-items: center;">
       <span style="width:120px;text-align:right;margin:0 10px">主播头像：</span> 
       <el-image 
          style="width: 60px; height: 60px"
          :src="diaForm.avatarUrl" 
          :preview-src-list="[diaForm.avatarUrl]">
          <div slot="error" class="image-slot">
            <span v-if="diaForm.avatarUrl">加载失败</span>
            <span v-else>暂无图片</span>
          </div>
        </el-image>
      </div>
      <div style="display: flex; margin: 20px 0 10px; align-items: center;">
        <span style="width:120px;text-align:right;margin:0 10px">主播私信二维码：</span> 
        <el-image 
          style="width: 60px; height: 60px"
          :src="diaForm.qrCode" 
          :preview-src-list="[diaForm.qrCode]">
          <div slot="error" class="image-slot">
            <span v-if="diaForm.qrCode">加载失败</span>
            <span v-else>暂无图片</span>
          </div>
        </el-image>
      </div>
      <div style="display: flex; margin: 20px 0 10px; align-items: center;">
        <span style="width:120px;text-align:right;margin:0 10px">主播服务二维码：</span> 
        <el-image 
          style="width: 60px; height: 60px"
          :src="diaForm.serviceUrl" 
          :preview-src-list="[diaForm.serviceUrl]">
          <div slot="error" class="image-slot">
            <span v-if="diaForm.serviceUrl">加载失败</span>
            <span v-else>暂无图片</span>
          </div>
        </el-image>
      </div>
      <!-- <div style="display: flex; margin: 20px 0 10px">主播介绍：</div>
      <div style="display: flex; margin: 0 20px">{{ diaForm.introduce }}</div> -->
      <!-- <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">是否认证：</span> {{ diaForm.legalizeFlg === 1 ? "认证" : "未认证" }}
      </div>
      <div style="display: flex; margin: 20px 0 10px">
       <span style="width:100px;text-align:right;margin:0 10px">是否是指导师：</span> {{ diaForm.tutorFlg === 1 ? "认证" : "未认证" }}
      </div> -->
      <div v-if="diaForm.status != 0" style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">备注：{{diaForm.remark}}</span>
      </div>
      <div v-if="diaForm.status == 0" style="display: flex; margin: 20px 0 10px">
       <span style="width:120px;text-align:right;margin:0 10px">备注：</span>
       <el-input show-word-limit type="textarea" maxlength="100" placeholder="请输入，可不填" v-model="diaForm.remark"/>
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
    <img v-if="statusImg" class="statusImg" :src="statusImg" alt="">
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
  activated () {
    this.diaForm = JSON.parse(window.localStorage.getItem("sysanchorapplyinfoDetailData"))
  },
  computed: {
  
    // 审核状态图片
    statusImg() {
      if(this.diaForm && this.diaForm.status == 0) return require("@/assets/icon/icon_applying.png")
      if(this.diaForm && this.diaForm.status == 1) return require("@/assets/icon/icon_agree.png")
      if(this.diaForm && this.diaForm.status == -1) return require("@/assets/icon/icon_reject.png")
      return ""
    }
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
              if (res.code !== 0) {
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