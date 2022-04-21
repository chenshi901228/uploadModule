<template>
  <div class="live-room">
    <el-container>
      <el-aside width="350px">
        <div class="anchor_header">
          <img :src="userInfo.avatarUrl" alt="" />
          <div class="user-info">
            <div class="username">
              <span>{{ userInfo.username }}</span>
              <div class="anchor_detail_isLive">
                <div class="live_icon_custom">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                直播中
              </div>
            </div>
            <p class="room_num">房间号：{{ roomId }}</p>
          </div>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="互动" name="first" class="tab_first">
            <div id="barrage">
              <div
                class="item"
                v-for="(item, index) in barrageData"
                :key="index"
              >
                <!-- 进入直播间消息 type:10 -->
                <div
                  class="sysMessage"
                  v-if="
                    item.type &&
                    item.type === 'TIMCustomElem' &&
                    item.payload.data.message.type === 10
                  "
                >
                  {{ item.payload.data.message.text }}来了
                </div>
                <!-- 普通弹幕消息 type:1 -->
                <div
                  class="message_info"
                  v-if="
                    item.type &&
                    item.type === 'TIMCustomElem' &&
                    item.payload.data.userInfo.userId != userInfo.userId &&
                    (item.payload.data.message.type === 1 ||
                      item.payload.data.message.type === 3)
                  "
                >
                  <img :src="item.payload.data.userInfo.avatarUrl" alt="" />
                  <div class="message_content">
                    <div>
                      <span class="nickName"
                        >{{ item.payload.data.userInfo.nickName }}&nbsp;</span
                      >
                      <span
                        class="fansCard"
                        v-if="
                          item.payload.data.fansInfo &&
                          item.payload.data.fansInfo.isFans
                        "
                        >新粉&nbsp;{{ item.payload.data.fansInfo.grade }}</span
                      >
                    </div>
                    <p class="normalMsg">
                      {{
                        item.payload.data.message.text ||
                        item.payload.data.message.questionText
                      }}
                    </p>
                  </div>
                </div>
                <!--  -->
                <div class="message_info"
                  v-if="item.type && item.type === 'TIMCustomElem'&& item.payload.data.message.type===4">
                  <img :src="item.payload.data.userInfo.avatarUrl" alt="" />
                  <div class="message_content">
                    <div>
                      <span class="nickName"
                        >{{ item.payload.data.userInfo.nickName }}&nbsp;</span
                      >
                      <span
                        class="fansCard"
                        v-if="
                          item.payload.data.fansInfo &&
                          item.payload.data.fansInfo.isFans
                        "
                        >新粉&nbsp;{{ item.payload.data.fansInfo.grade }}</span
                      >
                    </div>
                    <p class="normalMsg">
                      <span class="giftMsg">&nbsp;送出了<span class="gift_name">{{item.payload.data.message.giftInfo.name}}</span></span>
                      <img class="giftMsgIcon" :src="item.payload.data.message.giftInfo.icon" mode="" />
                      <span class="giftMsgCount">&nbsp;x&nbsp;<span>{{item.payload.data.message.giftInfo.giftNum}}</span></span>
                    </p>
                  </div>
                </div>
                <!-- 主播自己的消息 -->
                <div
                  class="mine_message_info"
                  v-if="
                    item.type &&
                    item.type === 'TIMCustomElem' &&
                    item.payload.data.userInfo.userId === userInfo.userId &&
                    (item.payload.data.message.type === 1 ||
                      item.payload.data.message.type === 3)
                  "
                >
                  <div class="message_content">
                    <div>
                      <span class="nickName">我</span>
                    </div>
                    <p class="normalMsg">
                      {{
                        item.payload.data.message.text ||
                        item.payload.data.message.questionText
                      }}
                    </p>
                  </div>
                  <img :src="item.payload.data.userInfo.avatarUrl" alt="" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="提问" name="second">
            <div class="list_content">
              <div
                class="content"
                v-for="(item, index) in questionMessageInfo"
                :key="index"
              >
                <div class="question_list">
                  <div class="user-info">
                    <img :src="item.userInfo.avatarUrl" mode="" />
                    <span>{{ item.userInfo.nickName }}</span>
                  </div>
                  <div class="question_content_info">
                    <div class="tag">问</div>
                    <div class="text">
                      {{ item.message.questionText }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="学生" name="third">
            <div class="list_content" style="height:calc(100% - 50px)">
              <div
                class="student_content"
                v-for="(item, index) in studentList"
                :key="index"
              >
                <div class="left">
                  <span>{{index+1}}</span>
                  <img :src="item.avatarUrl" alt="">
                  <div class="anchorInfo">
                      <span>{{item.text}}</span>
                      <p>{{item.ownIntimacy}}<span>亲密度</span></p>
                  </div>
                </div>
                <div class="right" @click="muteMthod(item)">
                  <img src="../../assets/img/isMike_icon.png" alt="" v-if="!item.isTalkFlag">
                  <img src="../../assets/img/noMike_icon.png" alt="" v-else>
                </div>
              </div>
            </div>
            <div class="muteBtn">
              <div @click="allMute(1)">全员禁言</div>
              <div @click="allMute(2)">全员解禁</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品" name="fourth">
            <div class="list_content">
              <div
                class="content"
                v-for="(item, index) in goodsList"
                :key="index"
              >
                <div class="content_list">
                  <div class="goods_info">
                    <p class="good_name">{{ item.productName }}</p>
                    <div class="good_pro">
                      <span>{{ item.presenter }}</span>
                      <span>共30讲</span>
                      <span>￥{{ item.price }}</span>
                    </div>
                    <div class="good_tag">
                      <span
                        v-for="(data, index1) in item.productTag"
                        :key="index1"
                        >{{ data }}</span
                      >
                    </div>
                  </div>
                  <div class="push_btn">
                    <div @click="pushMethod('goods',item)">推送</div>
                    <p>
                      <span>{{ item.buyers }}</span
                      >人已购买
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="直播预告" name="fifth">
              <div class="list_content">
                  <div class="content" v-for="(item,index) in livePreviewList" :key="index">
                      <div class="preview_content">
                        <img :src="item.frontCoverUrl" alt="">
                        <p>{{item.liveIntroduce}}</p>
                      </div>
                      <div class="preview_time">
                        <div>
                            <p>开播时间：{{item.startDate}}</p>
                            <p>预计时常：{{item.estimateLiveTime}}分钟</p>
                        </div>
                        <p @click="pushMethod('preview',item)">推送</p>
                      </div>
                  </div>
              </div>
          </el-tab-pane>
          <el-tab-pane label="推荐主播" name="sixth">
              <div class="list_content">
                  <div class="content" v-for="(item,index) in recommendList" :key="index">
                      <div class="recommend_content">
                        <span>{{item.sort}}</span>
                        <img :src="item.avatarUrl" alt="">
                        <div class="anchorInfo">
                            <span>{{item.username}}</span>
                            <p>粉丝：<span>{{item.fansNum}}</span>人</p>
                        </div>
                      </div>
                  </div>
              </div>
          </el-tab-pane>
        </el-tabs>
        <div class="barrage_input" v-show="activeName === 'first'">
          <input
            type="text"
            placeholder="我也来参与一下互动"
            v-model="barrage"
            @keydown.enter="sendMessage({ type: 1 })"
          />
          <div class="sendBarrage_btn" @click="sendMessage({ type: 1 })">
            发送
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <div class="live_room_header">
            <div class="header_left">
              <div class="header_nav" v-for="(item,index) in headerNav" :class="[headerNavActive==item.type?'headerNavActive':'']" :key="index" @click="headerNavClick(item.type)">
                <img :src="item.img" alt="">
                <p>{{item.text}}</p>
              </div>
            </div>
            <div class="header_right">
              <div class="wacth_num">
                <img src="../../assets/img/liveUser.png" alt="">
                <p>当前观看人数：<span>{{liveRoomUserinfo.onlineNum || 0}}</span>人</p>
              </div>
              <div class="tool_nav" v-for="(item,index) in toolNav" :key="index">
                <img :src="item.status?item.activeImg:item.img" alt="" @click="toolClick(item)">
                <p>{{item.text}}</p>
              </div>
              <div class="start_live" @click="startPlayLive" v-if="!liveStatus">
                <img src="../../assets/img/startLive.png" alt="">
                <span>开始直播</span>
              </div>
              <div class="start_live" @click="closeLive" v-else>
                <img src="../../assets/img/closeLive.png" alt="">
                <span>结束直播</span>
              </div>
            </div>
          </div>
        </el-header>
        <el-main>
          <div class="live_content">
            <div class="live_menu">
              <div class="live_menu_header">
                <div class="live_theme">主题&nbsp;:&nbsp;{{liveTheme}}</div>
                <div class="online_info">
                  <p>
                    ·&nbsp;<span>{{liveRoomUserinfo.cumulativeNum || 0}}</span>人看过
                  </p>
                  <p>
                    ·&nbsp;<span>{{liveRoomUserinfo.onlineNum || 0}}</span>人在线
                  </p>
                  <p>
                    ·&nbsp;<span>55222000</span>热度
                  </p>
                </div>
              </div>
              <div class="screenShare">
                <component 
                  :is="headerNavActive" 
                  :userInfo="headerNavActive == 'superboard' ? 
                  {
                    token: this.token,
                    roomId: this.roomId,
                    userId: this.userID,
                    appID: this.appID
                  } : 
                  {} "></component>
              </div>
              <video
                autoplay
                id="videoEle"
                :src-object.prop="stream"
                class="push_video"
              ></video>
            </div>
            <div class="connect_list">
              <div
                class="connet_video"
                v-for="(item, index) in connectMessageInfo"
                :key="index"
              >
                <div class="video_div" v-loading="!item.connectStatus"
                  :element-loading-text="item.message.connectType==2?'申请视频连麦中':'申请语音连麦中'"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.5)">
                  <video
                    autoplay
                    :src-object.prop="item.stream"
                    :style="{width:item.message.connectType==1||!item.connectStatus?'0px':'230px',height:item.message.connectType==1||!item.connectStatus?'0px':'112px'}"
                  ></video>
                  <img class="connect_headerUrl" :src="item.userInfo.avatarUrl" alt="" v-if="item.message.connectType===1||!item.connectStatus">
                </div>
                <div class="cennect_userinfo">
                  <div>
                    <img src="../../assets/img/camera.png" alt="" v-if="item.message.connectType==2">
                    <img src="../../assets/img/mike.png" alt="" v-if="item.message.connectType==1">
                    <span>{{item.userInfo.nickName}}</span>
                  </div>
                  <div class="btn" @click="replyConnect(1,item.message.type,item.message.connectType,item.userInfo.userId)" v-if="!item.connectStatus">接通</div>
                  <div class="btn gua_btn" @click="hangup(item)" v-if="item.connectStatus">挂断</div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import TIM from "tim-js-sdk";
import Superboard from "./superboard/index.vue" //超级白板

export default {
  components: {
    Superboard
  },
  data() {
    return {
      activeName: "first",
      userName: "",
      userID: "",
      appID: 467572390,
      zg: {},
      tim: null, //IM实例
      token: "",
      stream: {},
      roomId: "",
      streamID: "",
      groupID: "", //群聊ID
      conversation: null, //直播插件
      connectMessageInfo: [], //申请连麦信息
      barrageData: [], // 弹幕内容
      liveRoomUserinfo: {}, //用户在线信息
      goodsList: [], //获取主播推荐商品
      livePreviewList:[],//直播预告列表
      recommendList:[],//主播推荐主播列表
      barrage: "",
      questionMessageInfo: [], //提问消息
      studentList: [],
      userInfo: {}, //用户信息
      goodsPushTimer:null,//商品推送定时
      livePredictionTimer:null,//直播预告推送定时
      headerNav:[
        {
          img:require('@/assets/img/desktopShare.png'),
          text:'桌面共享',
          type:'desktopShare'
        },
        {
          img:require('@/assets/img/superWhiteboard.png'),
          text:'超级白板',
          type:'superboard'
        },
        {
          img:require('@/assets/img/documentShare.png'),
          text:'文件共享',
          type:'documentShare'
        },
        {
          img:require('@/assets/img/beautify.png'),
          text:'美化',
          type:'beautify'
        },
      ],
      toolNav:[
        {
          img:require('@/assets/img/norecord.png'),
          activeImg:require('@/assets/img/record.png'),
          text:'录制',
          type:'record',
          status:false,
        },
        {
          img:require('@/assets/img/nomike.png'),
          activeImg:require('@/assets/img/mike.png'),
          text:'麦克风',
          type:'mike',
          status:false,
        },
        {
          img:require('@/assets/img/nocamera.png'),
          activeImg:require('@/assets/img/camera.png'),
          text:'摄像头',
          type:'camera',
          status:true,
        }
      ],
      headerNavActive:"superboard", //顶部导航选中,
      liveStatus:false,//直播状态
      liveTheme: "" //直播主题
    };
  },
  created() {
    let liveStatus = JSON.parse(localStorage.getItem('liveStatus')) //直播状态
    if(liveStatus){
      this.liveStatus = liveStatus
    }
    let connectMessageInfo = JSON.parse(localStorage.getItem('connectMessageInfo')) //连麦列表状态
    if(connectMessageInfo){
      this.connectMessageInfo = connectMessageInfo
    }
    let isRecord = localStorage.getItem('isRecord') //录制状态
    if(isRecord){
      this.toolNav[0].status = isRecord
    }
    let studentList = JSON.parse(localStorage.getItem('studentList')) //学生列表
    if(studentList){
      this.studentList = studentList
    }
    this.getTimUserSig()
  },
  computed: {},
  mounted() {
    this.liveTheme = this.$route.query.liveTheme
    // 初始化实例  Step1
    this.zg = new ZegoExpressEngine(
      this.appID,
      "wss://webliveroom467572390-api.imzego.com/ws"
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

    this.zg.on("roomUserUpdate", (roomID, updateType, userList) => {
      // 其他用户进出房间的通知
      console.log(userList);
    });

    // 监听推流状态
    this.zg.on("publisherStateUpdate", (result) => {
      // 推流状态变更通知
      console.log("推流成功", result);
      if(result){
      }
    });

    this.zg.on("publishQualityUpdate", (streamID, stats) => {
      // 推流质量
      // console.log("推流质量----", streamID, stats);
      this.streamID = streamID;
      this.videoPacketsLostRate = stats.video.videoTransferFPS.toFixed(2);
    });

    //获取流地址
    this.zg.on("roomStreamUpdate",async (roomID, updateType, streamList) => {
      if (updateType == "ADD") {
        // 流新增，开始拉流
        // console.log("流新增------------", streamList);
        streamList.forEach(streamItem=>{
          this.connectMessageInfo.forEach(async item=>{
            if(item.userInfo.userId === streamItem.user.userID){
              item.stream = await this.zg.startPlayingStream(streamItem.streamID)
            }
          })
          // console.log('111',this.connectMessageInfo)
          localStorage.setItem('connectMessageInfo',JSON.stringify(this.connectMessageInfo)) //将当前麦上列表存着
          this.$loading().close()
          if (this.roomId != streamItem.streamID) {
            let extraInfo = streamItem.extraInfo;
            let extraInfoObj = null;
            try {
              extraInfoObj = JSON.parse(extraInfo);
            } catch (e) {}
            this.$http
              .post("/sys/mixedflow/startEvenWheat", {
                UserId: streamItem.user.userID, //用户ID；
                RoomId: this.roomId, //房间ID；
                joinRoomId: streamItem.streamID,
                joinType:
                  extraInfoObj && extraInfoObj.connectType == 1
                    ? "voice"
                    : "watch",
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {});
          }
        })
      } else if (updateType == "DELETE") {
        // 流删除，停止拉流
        console.log("流减少------------", streamList);
        streamList.forEach((streamItem) => {
          this.$http
            .post("/sys/mixedflow/finishEvenWheat", {
              UserId: streamItem.user.userID, //用户ID；
              RoomId: this.roomId, //房间ID；
              joinRoomId: streamItem.streamID,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {});
        });
      }
    });
  },
  methods: {
    async toolClick(data){
      if(data.type === 'mike'){ //麦克风
        let result = await this.zg.muteMicrophone(data.status)
        if(result){
          let isMicrophoneMuted = await this.zg.isMicrophoneMuted()
          this.toolNav[1].status = !isMicrophoneMuted //麦克风状态
        }
      }else if(data.type === 'camera'){ //摄像头
        let result = await this.zg.enableVideoCaptureDevice(this.stream,!data.status)
        if(result){
          this.toolNav[2].status = !data.status
        }
      }else if(data.type === 'record'){ //录制
        if(this.liveStatus){
          if(!data.status){
            this.$http.post('/sys/mixedflow/startRecord',{}).then(res=>{
              if(res.data.success&&res.data.msg=='success'){
                this.$message({
                  message:'录制已开启',
                  type:'success'
                })
                this.toolNav[0].status = true
                localStorage.setItem('isRecord',true)
              }
            })
          }else{
            this.$message({
              message:'录制已开启',
              type:'warning'
            })
          }
        }else{
          this.$message({
            message:'直播暂未开启',
            type:'warning'
          })
        }
      }
    },
    headerNavClick(type){
      if(type == "superboard") {  //超级白板

      }
      this.headerNavActive = type
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    muteMthod(data){ //禁言
      this.studentList.forEach(item=>{
        if(item.userId===data.userId){
          if(!item.isTalkFlag){
            this.sendMessage({type:20,replyUserId:data.userId,isTalk:true})
            this.getMuteStatus({isAll:0,userId:data.userId,isTalk:1}).then(res=>{
              item.isTalkFlag = 1
              localStorage.setItem('studentList',JSON.stringify(this.studentList))
            })
          }else{
            this.sendMessage({type:20,replyUserId:data.userId,isTalk:false})
            this.getMuteStatus({isAll:0,userId:data.userId,isTalk:0}).then(res=>{
              item.isTalkFlag = 0
              localStorage.setItem('studentList',JSON.stringify(this.studentList))
            })
          }
        }
      })
    },
    allMute(type){
      switch(type){
        case 1:
          this.sendMessage({type:20,allMute:true}) //全员禁言
          this.getMuteStatus({isAll:1,isTalk:1}).then(res=>{
            this.studentList.forEach(item=>item.isTalkFlag=1)
            localStorage.setItem('studentList',JSON.stringify(this.studentList))
          })
          
          break;
        case 2:
          this.sendMessage({type:20,allMute:false}) //全员解禁
          this.getMuteStatus({isAll:1,isTalk:0}).then(res=>{
            this.studentList.forEach(item=>item.isTalkFlag=0)
            localStorage.setItem('studentList',JSON.stringify(this.studentList))
          })
          break;
          default:
          break;
      }
    },
    async getMuteStatus(obj){
      let res = await this.$http.post('/sys/mixedflow/userMute',obj)
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
      if(!this.liveStatus){
        this.$loading({background:'rgba(0,0,0,.5)',text:'直播预览开启中...'})
      }
      this.token = await this.getTokenFun(this.appID, this.userID);
      this.loginRoom();
    },
    // 登陆房间
    async loginRoom() {
      const result = await this.zg.loginRoom(this.roomId, this.token, {
        userID: this.userID,
        userName: this.userName,
      });
      let isMicrophoneMuted = await this.zg.isMicrophoneMuted()
      this.toolNav[1].status = !isMicrophoneMuted //麦克风状态
      this.createStr();
    },
    // 创建流和渲染
    async createStr() {
      this.stream = await this.zg.createStream({
        camera:{
          videoQuality:4,
          width:350,
          height:196,
          frameRate:15,
          bitrate:300,
        }
      });
      // console.error(this.stream);
      // Step4
      this.startPublishingStream();
    },
    // 开始推流、开始直播
    async startPublishingStream() {
      let res = await this.zg.startPublishingStream(this.roomId, this.stream);
      console.log(res);
      if (res) {
        this.$loading().close()
        if(!this.liveStatus){
          this.$message({message:'直播预开启成功，可以开启直播',type:'success'})
        }else{
          this.$message({message:'刷新成功',type:'success'})
        }
      }
    },
    async startPlayLive() {
      this.$loading({background:'rgba(0,0,0,.5)',text:'直播开启中...'})
      this.$http
        .post("/sys/mixedflow/anchorBroadcast", {
          UserId: this.userID,
          RoomId: this.roomId,
          liveTheme: this.liveTheme,
        })
        .then((res) => {
          if (res.data.data && res.data.data.Data) {
            this.liveStatus = true
            localStorage.setItem('liveStatus',JSON.stringify(this.liveStatus)) //将直播状态存起来
            this.joinGroup()
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              this.$loading().close()
            });
            this.$message({message:'直播开启成功',type:'success'})
          }else{
            this.$message({message:'直播开启失败,请重新开启',type:'error'})
            this.$nextTick(() => { 
              this.$loading().close()
            });
          }
        });
    },

    //停止推流、关闭直播
    stopPublishingStream() {
      //停止推流
      this.zg.stopPublishingStream(this.roomId);
      //销毁流
      this.zg.destroyStream(this.stream);
      //退出房间（退出登录）
      this.zg.logoutRoom(this.roomId);
    },

    //关闭直播
    async closeLive() {
      this.$http
        .post("/sys/mixedflow/stopMixedFlow", {
          UserId: this.userID,
          RoomId: this.roomId,
        })
        .then((res) => {
          this.$message({message:'直播已关闭',type:'success'})
          this.liveStatus = false
          localStorage.removeItem('liveStatus') //将直播状态移除
          localStorage.removeItem('connectMessageInfo') //将直播连麦列表移除
          localStorage.removeItem('isRecord') //将录制状态移除
          localStorage.removeItem('studentList') //将学生列表移除
          this.tim.logout() //退出IM
          this.tim.destroy();
        });
      this.stopPublishingStream();
    },
    // 开启美颜
    openEffect() {
      this.zg.setEffectsBeauty(this.stream, true, {
        sharpenIntensity: 100,
        whitenIntensity: 100,
        rosyIntensity: 100,
        smoothIntensity: 100,
      });
    },
    // 关闭美颜
    closeEffect() {
      this.zg.setEffectsBeauty(this.stream, false);
    },
    joinGroup() {
      //加入直播群聊
      let promise = this.tim.joinGroup({ groupID: this.groupID });
      promise
        .then((imResponse) => {
          switch (imResponse.data.status) {
            case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
              break;
            case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
              console.log("加群成功", imResponse); // 加入的群组资料
            case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
              console.log("已经在群中加群成功", imResponse); // 加入的群组资料
              const conversationID = `GROUP${this.groupID}`;
              try {
                this.tim
                  .setMessageRead({
                    conversationID,
                  })
                  .then(() => {});
              } catch (e) {
                //TODO handle the exception
              }
              try {
                this.tim.getConversationProfile(conversationID).then((res) => {
                  const { conversation } = res.data;
                  this.conversation = conversation;
                });
              } catch (e) {}
              this.setMessageReceived();
              break;
            default:
              break;
          }
        })
        .catch(function (imError) {
          console.warn("joinGroup error:", imError); // 申请加群失败的相关信息
        });
    },
    setMessageReceived() {
      this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.$onMessageReceived, this);
    },
    async getTimUserSig() {
      let res = await this.$http.get(
        "/sys/manage/tencentCloudIm/getTxCloudUserSig"
      );
      //获取腾讯IM签名
      let userId = res.data.data.liveUserId && res.data.data.liveUserId;
      let userSig = res.data.data.userSig && res.data.data.userSig;
      let userInfo = res.data.data.userInfo;
      this.groupID = "LIVE@" + userInfo.id;
      this.roomId = userInfo.id;
      this.userID = userInfo.id;
      this.userName = userInfo.username;
      this.userInfo = userInfo;
      this.userInfo.nickName = userInfo.username
      let options = {
        SDKAppID: 1400341701, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      };
      // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
      this.tim = TIM.create(options); // SDK 实例通常用 tim 表示
      if(!this.liveStatus){
        this.tim.login({ userID: userId, userSig: userSig })//登录腾讯IM
      }else{
        this.tim.login({ userID: userId, userSig: userSig }).then(imResponse=>{ //登录腾讯IM
          if(imResponse.data){
            this.waitSdkReady()
          }
        })
      }
      this.startLive()
      this.getAnchorProduct();
      this.getLivePreviewList();
      this.getRecommendList();
    },
    onSdkReady(event){ //监听IM sdk状态
      console.log('event-----------',event)
      if(event.name === "sdkStateReady"){
        this.joinGroup() //直播开启中，直接加入群聊
      }
    },
    waitSdkReady(){
      this.tim.on(TIM.EVENT.SDK_READY, this.onSdkReady,this);
    },
    $onMessageReceived(value) {
      //接收到消息
      const event = value;
      let list = [];
      console.log("收到消息", event);
      event.data.forEach((item) => {
        if (item.type === "TIMGroupSystemNoticeElem") {
          // 被PC端禁播
          if(item.payload.userDefinedField && item.payload.userDefinedField.match("你已被禁播")) {
          	console.log('被禁播')
          }
          if (item.payload.userDefinedField) {
            let tempObj = JSON.parse(item.payload.userDefinedField);
            for (var key in tempObj) {
              this.liveRoomUserinfo[key] = tempObj[key];
            }
          }
        }
        if(item.type==='TIMGroupTipElem'){
          console.log('item-------',item)
          switch(item.payload.operationType){
            case 2: //用户离开直播间
            let userIdArr = item.payload.operatorID.split('LIVE_FLAG_')
            const userId = userIdArr[1];
            const ind = this.studentList.findIndex(item=>item.userId ==userId)
            this.studentList.splice(ind,1)
            localStorage.setItem('studentList',JSON.stringify(this.studentList))
            break;
            default:
            break;
          }
        }
        if (
          this.conversation &&
          item.conversationID === this.conversation.conversationID
        ) {
          list.push(Object.assign(item));
          if (item.payload && item.payload.data) {
            let applyInfo = JSON.parse(item.payload.data);
            if (applyInfo.message.type === 3) {
              console.log("提问消息");
              this.questionMessageInfo.push(applyInfo);
            }
            if(applyInfo.message &&
              applyInfo.message.type &&
              applyInfo.message.type === 10){ //用户进入直播间消息
              let obj = applyInfo.message
              obj.userId = applyInfo.userInfo.userId
              obj.avatarUrl = applyInfo.userInfo.avatarUrl
              let arr = [];
              this.studentList.forEach((item) =>
                arr.push(item.userId)
              );
              if (arr.indexOf(applyInfo.userInfo.userId) === -1) {
                this.studentList.push(obj);
              }
              localStorage.setItem('studentList',JSON.stringify(this.studentList))
              console.log('用户进入直播间消息',this.studentList)
            }
            //连麦信息
            if (
              applyInfo.message &&
              applyInfo.message.type &&
              applyInfo.message.type === 5
            ) {
              if (
                applyInfo.message.replyType != null &&
                applyInfo.message.replyType === 0
              ) {
                applyInfo.connectStatus = false; //定义连麦状态
                applyInfo.stream = {} //连麦流
                let arr = [];
                this.connectMessageInfo.forEach((item) =>
                  arr.push(item.userInfo.userId)
                );
                if (arr.indexOf(applyInfo.userInfo.userId) === -1) {
                  this.connectMessageInfo.push(applyInfo);
                }
                console.log('连麦列表',this.connectMessageInfo)
              }
              if (
                applyInfo.message.replyType &&
                (applyInfo.message.replyType === -1 ||
                  applyInfo.message.replyType === 2)
              ) {
                //把取消的信息移除
                this.connectMessageInfo = this.connectMessageInfo.filter(
                  (item) => item.userInfo.userId != applyInfo.userInfo.userId
                );
                applyInfo.message.replyType === -1 ? this.$message("用户已取消连麦申请") : this.$message("用户已断开连麦")
                this.$loading().close()
                return;
              }
              localStorage.setItem('connectMessageInfo',JSON.stringify(this.connectMessageInfo)) //将当前麦上列表存着
            }
          }
        }
      });
      list.forEach((item) => {
        item.payload.data = JSON.parse(item.payload.data);
      });
      this.barrageData = this.barrageData.concat(list); //弹幕消息
      this.$nextTick(() => {
        let barragediv = document.getElementById("barrage");
        barragediv.scrollTop = barragediv.scrollHeight;
      });
      console.log("barrageData", this.barrageData);
    },
    // 获取发送类型
    getToAccount() {
      if (!this.conversation || !this.conversation.conversationID) {
        return "";
      }
      switch (this.conversation.type) {
        case "C2C":
          return this.conversation.conversationID.replace("C2C", "");

        case "GROUP":
          return this.conversation.conversationID.replace("GROUP", "");

        default:
          return this.conversation.conversationID;
      }
    },
    sendMessage(messageInfo,cb) {
      if(!this.liveStatus){
        this.$message({message:"直播暂未开启",type:'warning'})
        return
      }
      if(messageInfo.type===1&&this.barrage.trim().length==0){
        this.$message({message:"聊天内容不能为空",type:'warning'})
        return
      }
      // 将自己发送的消息写进消息列表里面
      const text = this.barrage;
      let data = {
        userInfo: this.userInfo, //用户信息
        // fansInfo,//用户是否为粉丝相关信息
        message: {
          /**
           * 消息类型:
           * 1:普通信息、
           * 2:关注信息、
           * 3:提问信息、
           * 4:礼物信息、
           * 5:语音连麦信息：{1、同意，2、拒绝}、
           * 6:视频连麦信息：{1、同意，2、拒绝}、)
           * 7:直播预告推送
           * 8:商品推送
           * **/
          type: messageInfo.type,
          text: text,
          pushData: messageInfo.pushData, //推送信息（商品，直播预告）
          connectType: messageInfo.connectType,
          replyType: messageInfo.replyType ? messageInfo.replyType : null,
          replyUserId: messageInfo.replyUserId,
          isTalk: messageInfo.isTalk, //禁言
          allMute: messageInfo.allMute, //全员禁言
        },
      };
      for (let k in data.message) {
        //将空信息移除
        if (data.message[k] === null || data.message[k] === "") {
          delete data.message[k];
        }
      }
      // 发送自定义消息
      const message = this.tim.createCustomMessage({
        to: this.getToAccount(),
        conversationType: this.conversation.type,
        payload: {
          data: JSON.stringify(data),
        },
      });
      const messageTwo = JSON.parse(JSON.stringify(message));
      messageTwo.payload.data = JSON.parse(messageTwo.payload.data);
      // 直播预告/商品推送消息
      if (message.payload) {
        let applyInfo = JSON.parse(message.payload.data);
        let messageInfo = applyInfo.message;
        if (
          messageInfo &&
          messageInfo.type &&
          ((messageInfo && messageInfo.type === 7) ||
            (messageInfo && messageInfo.type === 8))
        ) {
        } else {
          this.barrageData = [...this.barrageData, messageTwo];
          this.$nextTick(() => {
            let div = document.getElementById("barrage");
            div.scrollTop = div.scrollHeight;
          });
        }
      }
      this.tim.sendMessage(message);
      // 发送消息之后清空输入框内容
      this.barrage = "";
      if(cb)cb()
    },
    // 获取主播推荐商品
    getAnchorProduct() {
      this.$http
        .get(`/sys/wxapp/anchorProduct/listWithAnchorId/${this.userID}`)
        .then((res) => {
          console.log("主播推荐商品", res.data.data);
          let data = res.data.data;
          data.forEach((item) => {
            if(item.productTag){
                item.productTag = item.productTag.split("|");
            }
          });
          this.goodsList = data;
        });
    },
    // 获取直播预约列表
    getLivePreviewList() {
      this.$http.get(`/sys/livePreview/pageOwn`).then((res) => {
        console.log("获取直播预约列表", res);
        this.livePreviewList = res.data.data.list;
      });
    },
    //获取主播推荐主播
    getRecommendList() {
      this.$http.get(`/sys/manage/anchor/recommend/list`).then((res) => {
        console.log("获取主播推荐主播", res);
        this.recommendList = res.data.data;
      });
    },
    //推送商品、直播预告 
    pushMethod(type,data){
      if(type === 'goods'){//推送商品
        if(this.goodsPushTimer) return this.$message({message:"您已经推送过了，请稍后再试",type:'warning'});
        this.sendMessage({type: 8,pushData: data},() => this.$message({message:"商品推送成功",type:'success'}))
        this.goodsPushTimer = setTimeout(() => {
            clearTimeout(this.goodsPushTimer)
            this.goodsPushTimer = null
        }, 60 * 1000)
      }else{
          if(this.livePredictionTimer) return this.$message({message:"您已经推送过了，请稍后再试",type:'warning'});
          this.sendMessage({type: 7,pushData: data},() => this.$message({message:"预告推送成功",type:'success'}))
          this.livePredictionTimer = setTimeout(() => {
              clearTimeout(this.livePredictionTimer)
              this.livePredictionTimer = null
          }, 60 * 1000)
      }
    },
    replyConnect(status, type, connectType, userId) { //同意申请连麦
      let messageInfo = {
        type,
        connectType,
        replyType: 1,
        replyUserId: userId,
      }
      if (status === 1) { //同意
        this.$loading({background:'rgba(0,0,0,.5)',text:'连接中...'})
        this.sendMessage(messageInfo)
        this.connectMessageInfo.forEach(item => {
          if (item.userInfo.userId === userId) {
            item.connectStatus = true
          }
        })
        localStorage.setItem('connectMessageInfo',JSON.stringify(this.connectMessageInfo)) //将当前麦上列表存着
      } else { //拒绝
        if (this.connectMessageInfo.length == 1) {
          this.applyShow = false
        }
        messageInfo.replyType = -2
        this.sendMessage(messageInfo)
        const ind = this.connectMessageInfo.findIndex(item => item.userInfo.userId === userId)
        this.connectMessageInfo.splice(ind, 1)
        localStorage.setItem('connectMessageInfo',JSON.stringify(this.connectMessageInfo)) //将当前麦上列表存着
      }
    },
    hangup(info) { //挂断
      let messageInfo = {
        type: info.message
          .type, //消息类型(1:普通信息、2:关注信息、3:提问信息、4:礼物信息、5:语音连麦信息：{1、同意，2、拒绝}、6:视频连麦信息：{1、同意，2、拒绝}、)
        connectType: info.message.connectType,
        replyUserId: info.userInfo.userId,
        replyType: -3, // 连麦后挂断
      }
      this.sendMessage(messageInfo)
      const ind = this.connectMessageInfo.findIndex(item => item.userInfo.userId === info.userInfo.userId)
      this.connectMessageInfo.splice(ind, 1) //移除挂断的一条连麦信息
      localStorage.setItem('connectMessageInfo',JSON.stringify(this.connectMessageInfo)) //将当前麦上列表存着
    },
  },
  destroyed(){
    if (this.livePredictionTimer) {
        clearTimeout(this.livePredictionTimer)
        this.livePredictionTimer = null
    }
    if (this.goodsPushTimer) {
        clearTimeout(this.goodsPushTimer)
        this.goodsPushTimer = null
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.live-room {
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/img/liveRoom_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 0 20px 20px;
  box-sizing: border-box;
  >.el-container {
    width: 100%;
    height: 100%;
    /deep/ .el-aside {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .anchor_header {
        width: 100%;
        height: 158px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #fff;
        > img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .user-info {
          margin-left: 20px;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px 0px;
          .username {
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 600;
            .anchor_detail_isLive {
              width: 70px;
              height: 20px;
              margin-left: 20px;
              font-size: 12px;
              text-align: right;
              line-height: 20px;
              padding-right: 10px;
              background: linear-gradient(89deg, #fa3622 0%, #fe055b 100%);
              box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
              border-radius: 2px 2px 2px 2px;
              .live_icon_custom {
                width: 10px;
                height: 9px;
                position: relative;
                display: inline-block;
                margin-right: 6px;
              }

              .live_icon_custom div {
                width: 20%;
                background-color: #ffffff;
                position: absolute;
                top: 50%;
                border-radius: 4rpx;
              }

              .live_icon_custom div:first-child {
                left: 0;
                transform: translateY(-50%);
                height: 100%;
                animation: live-icon-one linear 0.6s infinite;
              }

              .live_icon_custom div:nth-child(2) {
                left: 50%;
                transform: translate(-50%, -50%);
                height: 50%;
                animation: live-icon-two linear 0.6s infinite;
              }

              .live_icon_custom div:last-child {
                right: 0;
                height: 100%;
                transform: translateY(-50%);
                animation: live-icon-three linear 0.6s infinite;
              }
            }
          }
          .room_num {
            font-size: 16px;
            font-weight: 400;
          }
        }
      }

      .el-tabs {
        color: #fff;
        flex: 1;
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        .el-tabs__header {
          background-color: #202122;
          height: 60px;
          border: none;
          margin: 0;
          .el-tabs__nav {
            width: 100%;
            border: none;
            display: flex;
            justify-content: space-around;
            .el-tabs__item {
              height: 60px;
              line-height: 60px;
              font-size: 13px;
              color: #999999;
              padding: 0 !important;
              border: none;
            }
            > .is-active {
              color: #fff;
              font-size: 14px;
              border-bottom: 5px solid #f92d1c;
            }
          }
        }

        .el-tabs__content {
          background-color: #37383c;
          padding: 20px;
          .tab_first {
            height: calc(100vh - 158px - 80px - 40px - 60px - 20px) !important;
          }
          .el-tab-pane {
            width: 100%;
            height: 100%;
            height: calc(100vh - 158px - 60px - 40px - 20px);
            #barrage {
              width: 100%;
              height: 100%;
              overflow: auto;
              .item {
                .sysMessage {
                  color: #999999;
                  font-size: 13px;
                  margin: 24px 0px;
                }
                .message_info {
                  display: flex;
                  margin: 24px 0px;
                  > img {
                    width: 40px;
                    height: 40px;
                  }
                  .message_content {
                    margin-left: 13px;
                    > div {
                      .nickName {
                        font-size: 13px;
                        color: #999999;
                      }
                      .fansCard {
                        display: inline-block;
                        width: 50px;
                        height: 16px;
                        text-align: center;
                        background-color: #51cada;
                        border-radius: 15px;
                        font-size: 8px;
                      }
                    }
                    .normalMsg {
                      margin-top: 7px;
                      max-width: 250px;
                      background-color: #44454a;
                      color: #eaeaea;
                      font-size: 16px;
                      padding: 13px;
                      border-radius: 4px;
                      word-break: break-all;
                      position: relative;
                      display: inline-block;
                      .giftMsgIcon{
                        width: 40px;
                        height: 40px;
                      }
                      .gift_name{
                        color: darkorange;
                      }
                    }
                    .normalMsg::before {
                      content: "";
                      position: absolute;
                      top: 6px;
                      left: -6px;
                      width: 0;
                      height: 0;
                      border-top: 6px solid transparent;
                      border-bottom: 6px solid transparent;
                      border-right: 6px solid #44454a;
                    }
                  }
                }
                .mine_message_info {
                  display: flex;
                  margin: 24px 0px;
                  justify-content: flex-end;
                  > img {
                    width: 40px;
                    height: 40px;
                  }
                  .message_content {
                    margin-right: 13px;
                    > div {
                      text-align: right;
                      .nickName {
                        font-size: 13px;
                        color: #999999;
                      }
                    }
                    .normalMsg {
                      margin-top: 7px;
                      max-width: 250px;
                      background-color: #44454a;
                      color: #eaeaea;
                      font-size: 16px;
                      padding: 13px;
                      border-radius: 4px;
                      word-break: break-all;
                      position: relative;
                      display: inline-block;
                    }
                    .normalMsg::before {
                      content: "";
                      position: absolute;
                      top: 6px;
                      right: -6px;
                      width: 0;
                      height: 0;
                      border-top: 6px solid transparent;
                      border-bottom: 6px solid transparent;
                      border-left: 6px solid #44454a;
                    }
                  }
                }
              }
            }
            #barrage::-webkit-scrollbar {
              display: none;
            }
            .list_content {
              width: 100%;
              height: 100%;
              overflow: auto;
              .content {
                width: 310px;
                padding: 14px;
                background-color: #44454a;
                border-radius: 10px;
                margin-bottom: 20px;
                .question_list {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  .user-info {
                    > img {
                      width: 30px;
                      height: 30px;
                    }
                    > span {
                      color: #999999;
                      font-size: 14px;
                      display: inline-block;
                      margin-left: 10px;
                    }
                  }
                }
                .question_content_info {
                  margin-top: 10px;
                  display: flex;
                  .tag {
                    width: 18px;
                    height: 18px;
                    background: linear-gradient(
                      114deg,
                      #fa3622 0%,
                      #ff055b 100%
                    );
                    border-radius: 3px;
                    color: #ffffff;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                  }
                  .text {
                    word-break: break-all;
                    color: #eaeaea;
                    font-size: 16px;
                    margin-left: 13px;
                  }
                }
                .content_list {
                  display: flex;
                  justify-content: space-between;
                  .goods_info {
                    display: flex;
                    flex-direction: column;
                    width: 178px;
                    .good_name {
                      color: #eaeaea;
                      font-size: 16px;
                    }
                    .good_pro {
                      margin-top: 10px;
                      font-size: 14px;
                      color: #898989;
                      > span {
                        margin-right: 10px;
                      }
                      > span:last-child {
                        color: #f92c1b;
                      }
                    }
                    .good_tag {
                      display: flex;
                      margin-top: 10px;
                      > span {
                        color: #acadaf;
                        font-size: 10px;
                        background-color: #5a5b62;
                        display: inline-block;
                        padding: 1px 8px;
                        border-radius: 15px;
                        margin-right: 5px;
                      }
                    }
                  }
                  .push_btn {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: center;
                    > div {
                      width: 60px;
                      height: 30px;
                      background: linear-gradient(
                        69deg,
                        #fa3622 0%,
                        #fa3622 1%,
                        #ff055b 100%
                      );
                      border-radius: 5px;
                      text-align: center;
                      line-height: 30px;
                      cursor: pointer;
                    }
                    > p {
                      margin-top: 8px;
                      color: #898989;
                      font-size: 12px;
                      > span {
                        color: #eaeaea;
                      }
                    }
                  }
                }
                .preview_content{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    >img{
                        width: 120px;
                        height: 66px;
                    }
                    >p{
                        margin-left: 10px;
                    }
                }
                .preview_time{
                    margin-top: 10px;
                    color: #898989;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    >p{
                        width: 60px;
                        height: 30px;
                        color: #ffffff;
                        background: linear-gradient(
                            69deg,
                            #fa3622 0%,
                            #fa3622 1%,
                            #ff055b 100%
                        );
                        border-radius: 5px;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;
                    }
                }
                .recommend_content{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 10px 0px;
                    border-bottom: 1px solid #4A4A4A;
                    >span{
                        font-size: 16px;
                        color: #898989;
                    }
                    >img{
                        width: 40px;
                        height: 40px;  
                        margin-left: 10px;
                    }
                    .anchorInfo{
                        display: flex;
                        flex-direction: column;
                        margin-left: 10px;
                        >span{
                            color: #EAEAEA;
                            font-size: 16px;
                        }
                        >p{
                            color: #898989;
                            font-size: 14px;
                            >span{
                                color: #EAEAEA;
                            }
                        }
                    }
                }
              }
              .student_content{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 0px;
                border-bottom: 1px solid #4A4A4A;
                >.left{
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  >span{
                      font-size: 16px;
                      color: #898989;
                  }
                  >img{
                      width: 40px;
                      height: 40px;  
                      margin-left: 10px;
                  }
                  .anchorInfo{
                      display: flex;
                      flex-direction: column;
                      margin-left: 10px;
                      >span{
                          color: #EAEAEA;
                          font-size: 16px;
                      }
                      >p{
                          color: #898989;
                          font-size: 14px;
                          >span{
                            margin-left: 8px;
                            color: #EAEAEA;
                          }
                      }
                  }
                }
                .right{
                  >img{
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                  }
                }
              }
            }
            .muteBtn{
              width: 100%;
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-top: 5px;
              >div{
                width: 145px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
              }
              >div:first-child{
                background: linear-gradient(89deg, #FA3622 0%, #FE055A 100%);
                box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
              }
              >div:last-child{
                border: 1px solid #B7B7B7;
                color: #B7B7B7;
              }
            }
            .list_content::-webkit-scrollbar {
              display: none;
            }
          }
        }
      }
      .barrage_input {
        width: 100%;
        height: 60px;
        background-color: #37383c;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        margin: 20px 0px 0px;
        > input {
          background: none;
          border: none;
          color: #eaeaea;
        }
        .sendBarrage_btn {
          width: 90px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: linear-gradient(91deg, #fa3622 0%, #fe055b 100%);
          border-radius: 5px;
          color: #fff;
          font-size: 18px;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
    .el-container{
      .el-header{
        height: 158px !important;
        padding: 0 0 0 20px;
        .live_room_header{
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .header_left{
            display: flex;
            align-items: center;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 400;
            .header_nav{
              width: 85px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              position: relative;
              >img{
                width: 31px;
                height: 28px;
              }
              >p{
                margin-top: 5px;
              }
            }
            .headerNavActive::after{
              position: absolute;
              content: '';
              display: block;
              width: 24px;
              height: 4px;
              background-color: #F92D1C;
              border-radius: 30px;
              bottom: -6px;
            }
          }
          .header_right{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .wacth_num{
              display: flex;
              align-items: center;
              color: #fff;
              font-size: 16px;
              >img{
                width: 16px;
                height: 16px;
              }
              >p{
                margin-left: 4px;
                >span{
                  font-size: 18px;
                }
              }
            }
            .tool_nav{
              display: flex;
              align-items: center;
              color: #fff;
              font-size: 14px;
              margin: 0 10px;
              >img{
                width: 40px;
                height: 40px;
                cursor: pointer;
              }
              >p{
                margin-left: 15px;
              }
            }
            .start_live{
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              color: #ffffff;
              width: 230px;
              height: 40px;
              background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
              box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
              border-radius: 5px;
              cursor: pointer;
              >img{
                width: 20px;
                height: 20px;
              }
              >span{
                margin-left: 10px;
              }
            }
          }
        }
      }
      .el-main{
        padding: 0 0 0 20px;
        .live_content {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          .live_menu {
            width: calc(100% - 230px - 20px);
            height: 100%;
            position: relative;
            .live_menu_header{
              width: 100%;
              height: 60px;
              background-color: #37383C;
              padding: 16px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .live_theme{
                color: #fff;
                font-size: 20px;
              }
              .online_info{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: #FFFFFF;
                font-size: 16px;
                >p{
                  margin-right: 10px;
                }
              }
            }

            // 屏幕共享区域
            .screenShare {
              position: absolute;
              left: 0;
              top: 60px;
              width: 100%;
              height: calc(100% - 60PX);
              // background: pink;
            }

            .push_video{
              position: absolute;
              bottom: 0;
              right: 0;
              width: 350px;
              height: 196px;
            }
          }
          .connect_list {
            width: 230px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background-color: #37383C;
            padding: 10px;
            .connet_video {
              width: 100%;
              height: 142px;
              margin-bottom: 10px;
              .video_div{
                width: 100%;
                height: 112px;
                background-color: #32373A;
                display: flex;
                justify-content: center;
                align-items: center;
                /deep/ .el-icon-loading{
                  color: #FFFFFF;
                  font-size: 30px;
                }
                /deep/ .el-loading-text{
                  color: #FFFFFF;
                  font-size: 12px;
                }
                >video{
                  width: 100%;
                  height: 100%;
                }
                .connect_headerUrl{
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                }
              }
              .cennect_userinfo{
                height: 30px;
                width: 100%;
                background: #000000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                font-weight: 400;
                color: #fff;
                padding: 0 10px;
                >div{
                  >img{
                    width: 20px;
                    height: 20px;
                  }
                  >span{
                    margin-left: 10px;
                  }
                }
                >.btn{
                  background: #54C717;
                  width: 35px;
                  height: 20px;
                  text-align: center;
                  line-height: 20px;
                  border-radius: 3px;
                  cursor: pointer;
                }
                >.gua_btn{
                  background: #F92C1B;
                }
              }
            }
          }
        }
      }
    }
    
  }
}
@keyframes live-icon-one {
  0% {
    height: 100%;
  }

  50% {
    height: 50%;
  }

  100% {
    height: 100%;
  }
}

@keyframes live-icon-two {
  0% {
    height: 50%;
  }

  50% {
    height: 100%;
  }

  100% {
    height: 50%;
  }
}

@keyframes live-icon-three {
  0% {
    height: 100%;
  }

  50% {
    height: 50%;
  }

  100% {
    height: 100%;
  }
}
</style>