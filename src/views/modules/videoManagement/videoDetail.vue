<template>
  <el-card shadow="never" class="aui-card--fill">
    <div style="margin-bottom:30px;">视频主题：{{ info.liveTheme }}</div>
    <div style="margin-bottom:30px;">主    播：{{ info.anchorUser }}</div>
    <div style="margin-bottom:30px;">视频显示：{{ info.showMode === 0 ? "竖屏" : "横屏" }}</div>
    <div style="margin-bottom:30px;">
      <div>封面图：</div>
      <el-image :src="info.frontCoverUrl"></el-image>
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
        style="width: 100%; height: 100%"
      ></video>
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
    };
  },
  created() {
    this.info = this.$route.query.videoDetail;
  },
  mounted() {
    this.querylist();
  },
  methods: {
    querylist() {
      this.$nextTick(() => {
        this.initVideoplayer();
        this.fileTimelengthRecord();
      });
    },
    initVideoplayer() {
      if (!this.videoPlayer && this.$refs.video) {
        this.videoPlayer = this.$refs.video;

        // 视频进度改变 -- 播放即触发
        this.videoPlayer.addEventListener("timeupdate", (e) => {
          // console.log(this.videoPlayer.currentTime,'currentTime') //当前播放进度
          // console.log(this.videoPlayer.duration,'duration') //当前播放进度
          sessionStorage.setItem("currentTime", this.videoPlayer.currentTime);
          sessionStorage.setItem("duration", this.videoPlayer.duration);
        });

        //视频暂停 --  点击暂停（退出也会触发并记录时间）
        this.videoPlayer.addEventListener("pause", (e) => {
          // this.fileTimelengthRecord(this.videoPlayer.currentTime,this.videoPlayer.duration)
        });

        // // 进度拖动
        // this.videoPlayer.addEventListener('seeking',(e) => {
        //   console.log(this.videoPlayer.currentTime,'seeking进行拖动')
        // })

        // // 进度拖动（进度条拖动会先 pause --> seeked--->play）
        // this.videoPlayer.addEventListener('seeked',(e) => {
        //   console.log(this.videoPlayer.currentTime,'seeked进行拖动')
        // })

        // 视频播放 -- 点击播放
        this.videoPlayer.addEventListener("play", (e) => {});

        // 视频播放 -- 播放结束
        this.videoPlayer.addEventListener("ended", (e) => {
          console.log(this.videoPlayer.currentTime, "ended 播放完成");
        });

        //   // 禁止快进
        // let sym
        // setInterval(() => {
        //     let time = this.videoPlayer.currentTime
        //     if(time-sym>1){
        //         this.videoPlayer.currentTime=sym
        //     }
        //     sym=this.videoPlayer.currentTime
        // },500)
      }
    },
    // 进度记录更新 - 记录当前播放附件的时长
    fileTimelengthRecord() {
      let stat = sessionStorage.getItem("currentTime");
      let end = sessionStorage.getItem("duration");
      if (stat > 0) {
        this.ifopen();
      } else {
        this.videoPlayer.currentTime = 0;
      }
    },
    ifopen() {
      this.$confirm("是否从上次的记录开始播放?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let stat = sessionStorage.getItem("currentTime");
          this.videoPlayer.currentTime = stat;
          this.videoPlayer.play();
        })
        .catch(() => {
          this.videoPlayer.currentTime = 0;
          this.videoPlayer.pause();
        });
    },
  },
};
</script>

<style scoped>
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
  background-color: rgb(6, 6, 6, 0.3);
  z-index: 2;
}
.resource-container:hover .video-title {
  display: block;
}
.video_right > p {
  background-color: rgb(6, 6, 6, 0.3);
  color: #fff;
}
.video-active {
  background-color: rgb(6, 6, 6, 0.3);
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
</style>


