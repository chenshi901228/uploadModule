<template>
  <el-container>
    <el-aside width="350px">
      <div class="header">
        欢迎您，张三
      </div>
      <div class="record">正在录制直播内容</div>
      <div class="onlineInfo">
        <p>1425人已看过</p>
        <p>1425人在线</p>
        <p>545462222亲密度</p>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="互动" name="first">互动</el-tab-pane>
        <el-tab-pane label="提问" name="second">提问</el-tab-pane>
        <el-tab-pane label="学生" name="third">学生</el-tab-pane>
        <el-tab-pane label="商品" name="fourth">商品</el-tab-pane>
        <el-tab-pane label="直播预告" name="fifth">直播预告</el-tab-pane>
        <el-tab-pane label="推荐主播" name="sixth">推荐主播</el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-container>
      <el-header>
        <div @click="closeLive">关闭直播</div>
      </el-header>
      <el-main>
        <div class="live_content">
          <div class="live_menu">
            <video
              autoplay
              controls
              muted
              id="videoEle"
              :src-object.prop="stream"
              width="100%"
              height="100%"
            ></video>
          </div>
          <div class="connect_list">
            连麦列表
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {ZegoExpressEngine} from 'zego-express-engine-webrtc'
export default {
  data(){
    return {
      activeName:'first',
      userName: this.$store.state.user.realName,
      userID: this.$store.state.user.id,
      appID: 1913835202,
      zg: {},
      token: "",
      stream: {},
      roomId: this.$store.state.user.id,
      streamID:"",
      streamList:[],//连麦者的流
    }
  },
  created(){
    console.log(this.roomId)
    this.startLive()
  },
  mounted(){
    // 初始化实例  Step1
    this.zg = new ZegoExpressEngine(
      this.appID,
      "wss://webliveroom1913835202-api.imzego.com/ws"
    );

    // 监听zg连接状态
    this.zg.on("roomStateUpdate", (roomID, state, errorCode, extendedData) => {
      if (state == "DISCONNECTED") {
        // 与房间断开了连接
        console.log("与房间断开了连接");
      }
      if (state == "CONNECTING") {
        // 与房间尝试连接中
        console.log("与房间尝试连接中");
      }
      if (state == "CONNECTED") {
        // 与房间连接成功
        console.log("登陆成功");
      }
    });

    this.zg.on('roomUserUpdate', (roomID, updateType, userList) => {
        // 其他用户进出房间的通知
        console.log(userList)
    });

    // 监听推流状态
    this.zg.on("publisherStateUpdate", (result) => {
      // 推流状态变更通知
      console.log("推流成功",result);
    });

    this.zg.on("publishQualityUpdate", (streamID, stats) => {
      // 推流质量
      console.log("推流质量----", streamID, stats);
      this.streamID = streamID
      this.videoPacketsLostRate = stats.video.videoTransferFPS.toFixed(2);
    });

    //获取流地址
    this.zg.on("roomStreamUpdate",async (roomID, updateType, streamList) => {
      console.error("roomStreamUpdate roomID ", roomID, streamList);
      if (updateType == 'ADD') {
        // 流新增，开始拉流
        console.error(streamList[0].streamID)
        this.streamOther = await this.zg.startPlayingStream(streamList[0].streamID)
        // streamList.map(((item,index)=>{
          // item.remoteStream  = this.zg.startPlayingStream(item.streamID);
          axios.post('http://192.168.1.108:8080/sys/mixedflow/startEvenWheat',{
              UserId: this.userID, // # Y,string用户ID；
              RoomId: this.roomId, //# N,string,房间ID；
              joinRoomId:streamList[0].streamID
          }).then(res=>{
            console.log(res)
          })
        // }))
      } else if (updateType == 'DELETE') {
        // 流删除，停止拉流
      }
    });
  },
  methods:{
    handleClick(tab, event) {
        console.log(tab, event);
    },
    // 获取token的方法
    getTokenFun(appID, userID) {
      return new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = (e) => {
          if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
              resolve(xmlhttp.response);
            } else {
              reject(e);
            }
          }
        };
        xmlhttp.open(
          "GET",
          `https://wsliveroom-alpha.zego.im:8282/token?app_id=${appID}&id_name=${userID}`,
          true
        );
        xmlhttp.send(null);
      });
    },
    // 获取token开启直播预览
    async startLive() {
      this.token = await this.getTokenFun(this.appID, this.userID);
      this.loginRoom();
    },
    // 登陆房间
    async loginRoom() {
      const result = await this.zg.loginRoom(this.roomId, this.token, {
        userID: this.userID,
        userName: this.userName,
      });
      this.createStr();
    },
    // 创建流和渲染
    async createStr() {
      this.stream = await this.zg.createStream(
        // {
          // screen: {
          //     audio: true  ,
          //     videoQuality: 1,
          //     // bitRate: 1500,
          //     // frameRate: 15,
          //     // width: 800,
          //     // height: 500
          // },
      // }
      );
      // Step4
      this.startPublishingStream();
    },
    // 开始推流、开始直播
    async startPublishingStream() {
      let res = await this.zg.startPublishingStream(this.roomId, this.stream)
      console.log(res)
      if(res){
        this.startPlayLive();
      }
    },
    async startPlayLive() {
      this.$http.post('/sys/mixedflow/anchorBroadcast',{UserId: this.userID,RoomId: this.roomId,liveTheme:'测试直播主题'}).then(res=>{
        console.log(res.data);
      })
    },

    //停止推流、关闭直播
    stopPublishingStream(){
      //停止推流
      this.zg.stopPublishingStream(this.roomId);
      //销毁流
      this.zg.destroyStream(this.stream)
      //退出房间（退出登录）
      this.zg.logoutRoom(this.roomId)
    },

    //关闭直播
    async closeLive() {
      this.$http.post('/sys/mixedflow/stopMixedFlow',{UserId: this.userID,RoomId: this.roomId}).then(res=>{
        console.log(res)
      })
      this.stopPublishingStream()
    },
    // 开启美颜
    openEffect(){
      this.zg.setEffectsBeauty(
        this.stream,
        true,
        {
            sharpenIntensity: 100, 
            whitenIntensity: 100, 
            rosyIntensity: 100,
            smoothIntensity: 100
        }
      );
    },
    // 关闭美颜
    closeEffect(){
      this.zg.setEffectsBeauty(this.stream, false);
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container{
  width: 100%;
  min-height: calc(calc(100vh - 50px - 38px - 30px) - 2px);
  /deep/ .el-aside{
    min-height: calc(calc(100vh - 50px - 38px - 30px) - 2px);
    background-color: #ccc;
    .header{
      width: 100%;
      height: 50px;
      color: #fff;
      line-height: 50px;
      background: #000;
      padding: 0 10px;
      font-size: 24px;
    }
    .record{
      background: #000;
      color: #fff;
      padding: 0 10px;
    }
    .onlineInfo{
      display: flex;
      height: 30px;
      background: #000;
      color: #fff;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
    }
    .el-tabs__nav{
      border: none;
    }
    .el-tabs{
      color: #fff;
      background-color: #ccc;
       .el-tabs__item{
        padding: 0 10px!important;
        border: none;
      }
    }
  }
  .live_content{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      .live_menu{
        flex: 1;
      }
      .connect_list{
        width: 200px;
      }
  }
}
</style>