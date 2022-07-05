<template>
  <el-card shadow="never" class="aui-card--fill">
    <div style="margin-bottom: 30px">视频主题：{{ info.liveTheme }}</div>
    <div style="margin-bottom: 30px">主 播：{{ info.anchorUser }}</div>
    <div style="margin-bottom: 30px">
      视频显示：{{ info.showMode === 0 ? "竖屏" : "横屏" }}
    </div>
    <div style="margin-bottom: 30px">
      <div>封面图：</div>
      <el-image v-if="info && info.frontCoverUrl" fit="contain" :src="info && info.frontCoverUrl"></el-image>
    </div>
    <div>
      <div>视频：</div>
      <video
        ref="video"
        id="video"
        :src="info.relationLiveUrl"
        :autoplay="videolist.autoplay"
        :controls="videolist.controls"
        :controlslist="videolist.controlslist"
        :webkit-playsinline="webkitplaysinline"
        style="width: 800px; height: 500px"
      ></video>
    </div>
    <div v-if="checkFlag && info.approveStatus === 0">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="备注" prop="desc">
          <el-input
            size="small"
            type="textarea"
            maxlength="100"
            show-word-limit
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        style="display: flex; justify-content: flex-end"
        class="dialog-footer"
      >
        <el-button size="small" @click="resolve">驳回</el-button>
        <el-button type="primary" size="small" @click="confirm">通过</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      info: {},
      videolist: {
        autoplay: false, // 自动播放
        controls: "controls", //操作
        controlslist: "nodownload   noplaybackrate",
        /*
        1、nodownload: 不要下载按钮
        2、nofullscreen: 不要全屏按钮
        3、noremoteplayback: 不要远程回放
        4、disablePictureInPicture 不要画中画按钮
        5、noplaybackrate 不要播放速度按钮
        */
      }, //video配置
      webkitplaysinline: "true",
      playHistory: {
        resourceIndex: -1,
        currentFileIndex: -1,
        currenTime: 0,
      }, //初始化时定位到的历史播放记录
      videoPlayer: null,
      currentResource: {}, //当前的资源
      ruleForm: {
        desc: "",
      },
      checkFlag: false,
      id: "",
    };
  },
  created() {
    this.id = this.$route.query.videoDetail.id;
    this.$nextTick(() =>{
      if(this.checkFlag){
      this.query()
    }
    })
  },
  mounted() {
    this.querylist();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === "videoManagement-videoApproval") {
        // vm.query();
        vm.checkFlag = true;
        console.log(vm.info)

      } else if (from.name === "videoManagement-VideoManagement") {
        vm.info = vm.$route.query.videoDetail;
        vm.checkFlag = false;
        console.log(vm.info)
      }
    });
  },
  beforeDestroy() {
    if (this.checkFlag) {
      this.getOut();
      this.checkFlag = false;
    }
  },
  methods: {
    //获取详情
    query() {
      this.$http
        .get(`/sys/livePlayback/check/${this.id}`)
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.info = res.data;
          } else {
            this.$message.error(res.msg);
            this.$router.push({
              name: "videoManagement-videoApproval",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //审批离开
    getOut() {
      this.$http
        .get(`/sys/livePlayback/checkOut/${this.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    querylist() {
      this.$nextTick(() => {
        this.initVideoplayer();
      });
    },
    initVideoplayer() {
      if (!this.videoPlayer && this.$refs.video) {
        this.videoPlayer = this.$refs.video;

        //视频暂停 --  点击暂停（退出也会触发并记录时间）
        this.videoPlayer.addEventListener("pause", (e) => {
        });

        // 视频播放 -- 点击播放
        this.videoPlayer.addEventListener("play", (e) => {});

        // 视频播放 -- 播放结束
        this.videoPlayer.addEventListener("ended", (e) => {
          console.log(this.videoPlayer.currentTime, "ended 播放完成");
        });
      }
    },
    //驳回
    resolve() {
      this.$http
        .put("/sys/livePlayback/approve", {
          id: this.id,
          approveStatus: 2,
          remark: this.ruleForm.desc,
        })
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.closeCurrentTab()
            this.$message.success("已驳回");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //通过
    confirm() {
      this.$http
        .put("/sys/livePlayback/approve", {
          id: this.id,
          approveStatus: 1,
          remark: this.ruleForm.desc,
        })
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.closeCurrentTab()
            this.$message.success("已通过");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.video_box {
  margin: 0 auto;
  margin-top: 50px;
  width: 1450px;
  height: 640px;
  border: 1px solid #ccc;
  background: #000;
}
.video_center {
  width: 1400px;
  height: 600px;
  background: #3f3f3f;
  display: flex;
  justify-content: space-between;
}
.video-title {
  width: 100%;
  display: none;
  padding: 1rem;
  position: absolute;
  top: 0;
  color: #fff;
  background-color: #000;
  z-index: 2;
}
.resource-container:hover .video-title {
  display: block;
}
.video_right > p {
  background-color: #000;
  color: #fff;
}
.video-active {
  background-color: #000;
  color: aqua;
}

/* 全屏按钮 */
/* video::-webkit-media-controls-fullscreen-button {
        display: none;
    } */
/* 播放按钮 */
/* video::-webkit-media-controls-play-button {
        display: none;
    } */
/* 进度条 */
video::-webkit-media-controls-timeline {
  display: none;
}
/* 观看的当前时间 */
/* video::-webkit-media-controls-current-time-display{
        display: none;            
    } */
/* 剩余时间 */
/* video::-webkit-media-controls-time-remaining-display {
        display: none;            
    } */
/* 音量按钮 */
/* video::-webkit-media-controls-mute-button {
        display: none;            
    } */
/* video::-webkit-media-controls-toggle-closed-captions-button {
        display: none;            
    } */
/* 音量的控制条 */
/* video::-webkit-media-controls-volume-slider {
        display: none;            
    } */
/* 所有控件 */
/* video::-webkit-media-controls-enclosure{ 
        display: none;
    } */

/deep/.el-image {
  width: 500px;
  height: 300px;
}
</style>


