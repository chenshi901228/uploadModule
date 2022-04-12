<template>
  <el-container>
    <el-aside width="350px">
      <div class="anchor_header">
        <img :src="$store.state.user.headUrl" alt="">
        <div class="user-info">
          <div class="username">
            <span>{{$store.state.user.realName}}</span>
            <div class="anchor_detail_isLive">
              <div class="live_icon_custom">
                <div></div>
                <div></div>
                <div></div>
              </div>直播中
            </div>
          </div>
          <p class="room_num">房间号：{{roomId}}</p>
        </div>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="互动" name="first">
          <div class="barrage">
            <div class="item" v-for="(item, index) in barrageData" :key="index">
									<!-- 进入直播间消息 type:10 -->
									<div class="sysMessage"
										v-if="item.type && item.type === 'TIMCustomElem'&& item.payload.data.message.type===10">
										{{ item.payload.data.message.text }}
									</div>
									<!-- 普通弹幕消息 type:1 -->
									<div class="htmlText"
										v-if="item.type && item.type === 'TIMCustomElem'&& item.payload.data.message.type===1 || item.type && item.type === 'TIMCustomElem'&&item.payload.data.message.type===3">
										<span class="fansCard"
											v-if="item.payload.data.fansInfo&&item.payload.data.fansInfo.isFans">新粉&nbsp;{{item.payload.data.fansInfo.grade}}</span>
										<span
											class="nickName">{{item.payload.data.userInfo.nickName}}&nbsp;:</span>
										<span
											class="normalMsg">{{item.payload.data.message.text || item.payload.data.message.questionText}}</span>
									</div>
								</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="提问" name="second">
          <div class="content" v-for="(item,index) in barrageData" :key='index'>
					<div class="question_list" v-if="item.type && item.type === 'TIMCustomElem'&& item.payload.data.message.type===3">
						<div class="user-info">
							<div class="username">
								<image :src="item.payload.data.userInfo.avatarUrl" mode=""></image>
								<span>{{item.payload.data.userInfo.nickName}}</span>
							</div>
							<div class="clearDensity" v-if="item.payload.data.fansInfo.isFans">
								<span class="text">亲密度：</span>
								<span class="num">{{item.payload.data.fansInfo.intimacy}}</span>
							</div>
						</div>
						<div class="question_content"
							v-if="item.type && item.type === 'TIMCustomElem'&& item.payload.data.message.type===3">
							<div class="tag">问</div>
							<div class="text">
								{{item.payload.data.message.questionText}}
							</div>
						</div>
					</div>
				</div>
        </el-tab-pane>
        <el-tab-pane label="学生" name="third">学生</el-tab-pane>
        <el-tab-pane label="商品" name="fourth">商品</el-tab-pane>
        <el-tab-pane label="直播预告" name="fifth">直播预告</el-tab-pane>
        <el-tab-pane label="推荐主播" name="sixth">推荐主播</el-tab-pane>
      </el-tabs>
      <div class="barrage_input">
        <input type="text" placeholder="我也来参与一下互动" v-model="barrage">
        <div class="sendBarrage_btn">发送</div>
      </div>
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
            <div class="conne_video" v-for="(item,index) in connectStreamList" :key="index">
                <video
                autoplay
                controls
                muted
                :src-object.prop="stream"
                width="100%"
                height="100%"
              ></video>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {ZegoExpressEngine} from 'zego-express-engine-webrtc'
import TIM from 'tim-js-sdk';

export default {
  data(){
    return {
      activeName:'first',
      userName: this.$store.state.user.realName,
      userID: this.$store.state.user.id,
      appID: 467572390,
      zg: {},
      tim:null,//IM实例
      token: "",
      stream: {},
      roomId: this.$store.state.user.id,
      streamID:"",
      connectStreamList:[],//连麦者的流
      groupID: "LIVE@" + this.$store.state.user.id, //群聊ID
      conversation:null,//直播插件
      connectMessageInfo: [], //申请连麦信息
      barrageData: [],// 弹幕内容
      liveRoomUserinfo:{},//用户在线信息
      goodsList:[],//获取主播推荐商品
      barrage:'',
    }
  },
  created(){
    
    this.getTimUserSig()
    this.startLive()
  },
  mounted(){
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
        console.log('流新增------------',streamList)
        this.getPlayStream(streamList)
        if(this.roomId!=streamItem.streamID){
						let extraInfo = streamItem.extraInfo;
						let extraInfoObj = null;
						try{
							extraInfoObj = JSON.parse(extraInfo)
						}catch(e){
							
						}
            this.$http.post('/sys/mixedflow/startEvenWheat',{
              UserId: streamItem.user.userID, //用户ID；
							RoomId: this.roomId, //房间ID；
							joinRoomId:streamItem.streamID,
							joinType: extraInfoObj && extraInfoObj.connectType == 1 ? 'voice' : 'watch'
            }).then(res=>{
							console.log(res)
            }).catch(err=>{})
        }
      } else if (updateType == 'DELETE') {
        // 流删除，停止拉流
        console.log('流减少------------',streamList)
				streamList.forEach(streamItem => {
					const ind = this.connectStreamList.findIndex(item => item.streamID === streamItem.streamID)
					this.connectStreamList.splice(ind, 1)
          this.$http.post('/sys/mixedflow/finishEvenWheat',{
            UserId: streamItem.user.userID, //用户ID；
						RoomId: this.roomID, //房间ID；
						joinRoomId:streamItem.streamID
          }).then(res=>{
						console.log(res)
					}).catch(err=>{})
				})
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
      console.error(this.stream)
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
        if(res.data.data&&res.data.data.Data){
          this.joinGroup()
          this.getAnchorProduct()
          this.getLivePreviewList()
          this.getRecommendList()
        }
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
    },
    //新增连麦流
    async getPlayStream(streamItem) {
      console.log('新增流streamItem------------------',streamItem)
      let playRes = await this.zg.startPlayingStream(streamItem.streamID);
      playRes['extraInfo'] = streamItem['extraInfo']
      this.connectStreamList.push(playRes)
      console.log('新增流playRes------------------',playRes)
      console.log('this.connectStreamList',this.connectStreamList)
    },
    joinGroup(){ //加入直播群聊
      let promise = this.tim.joinGroup({ groupID: this.groupID});
      promise.then((imResponse)=>{
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
            break
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            console.log('加群成功',imResponse) // 加入的群组资料
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            console.log('已经在群中加群成功',imResponse) // 加入的群组资料
            const conversationID = `GROUP${this.groupID}`;
            try {
              this.tim.setMessageRead({
                conversationID
              }).then(() => {
              });
            } catch (e) {
              //TODO handle the exception
            }
            try {
              this.tim.getConversationProfile(conversationID).then(res => {
                const {
                  conversation
                } = res.data;
                this.conversation = conversation;
              });
            } catch (e) {
            }
            this.setMessageReceived();
            break;
          default:
            break
        }
      }).catch(function(imError){
        console.warn('joinGroup error:', imError) // 申请加群失败的相关信息
      });
    },
    setMessageReceived(){
      this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.$onMessageReceived,this)
    },
    getTimUserSig(){
      let options = {
        SDKAppID: 1400341701 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      };
      // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
      this.tim = TIM.create(options); // SDK 实例通常用 tim 表示
      this.$http.get('/sys/manage/tencentCloudIm/getTxCloudUserSig').then(res=>{ //获取腾讯IM签名
        let userId = res.data.data.liveUserId&&res.data.data.liveUserId
        let userSig = res.data.data.userSig&&res.data.data.userSig
        this.tim.login({userID: userId, userSig: userSig});//登录腾讯IM
      }).catch(() => {})
    },
    $onMessageReceived(value){//接收到消息
      const event = value
      let list = [];
      console.log('收到消息',event)
      event.data.forEach(item=>{
        if (this.conversation && item.conversationID === this.conversation.conversationID) {
          list.push(Object.assign(item));
          if (item.type === 'TIMGroupSystemNoticeElem') {
						// 被PC端禁播
						// if(item.payload.userDefinedField && item.payload.userDefinedField.match("你已被禁播")) {
						// 	console.log('被禁播')
						// }
            if(item.payload.userDefinedField){
              let tempObj = JSON.parse(item.payload.userDefinedField)
              for (var key in tempObj) {
                this.liveRoomUserinfo[key] = tempObj[key]
              }
              console.log(this.liveRoomUserinfo)
            }
					}
          if (item.payload && item.payload.data) {
            let applyInfo = JSON.parse(item.payload.data)
            if (applyInfo.message.type === 3) {
              console.log("提问消息")
            }
            if(applyInfo.message.type === 4) { //礼物弹幕消息
              console.log("礼物弹幕消息")
            }
            //连麦信息
            if (applyInfo.message && applyInfo.message.type && applyInfo.message.type === 5) {
              if (applyInfo.message.replyType != null && applyInfo.message.replyType === 0) {
                applyInfo.connectStatus = false //定义连麦状态
                let arr = []
                this.connectMessageInfo.forEach(item => arr.push(item.userInfo.userId))
                if (arr.indexOf(applyInfo.userInfo.userId) === -1) {
                  this.connectMessageInfo.push(applyInfo)
                }
              }
              if (applyInfo.message.replyType && (applyInfo.message.replyType === -1 || applyInfo
                  .message.replyType === 2)) {
                //把取消的信息移除
                this.connectMessageInfo = this.connectMessageInfo.filter(item => item.userInfo
                  .userId != applyInfo.userInfo.userId)
                uni.showToast({
                  title: applyInfo.message.replyType === -1 ? "用户已取消连麦申请" :
                    "用户已断开连麦",
                  icon: "none"
                })
                return
              }
              console.log('connectMessageInfo', this.connectMessageInfo)
            }
          }
        }
      })
      list.forEach(item=>{
        item.payload.data = JSON.parse(item.payload.data)
      })
      list = list.filter(item=>item.type==='TIMCustomElem')
      this.barrageData = this.barrageData.concat(list);//弹幕消息
      console.log('barrageData', this.barrageData)
    },
    // 获取主播推荐商品
    getAnchorProduct() {
      this.$http.get(`/sys/wxapp/anchorProduct/listWithAnchorId/${this.$store.state.user.id}`).then(res=>{
        console.log('主播推荐商品',res)
      })
    },
    // 获取直播预约列表
    getLivePreviewList(){
      this.$http.get(`/sys/livePreview/pageOwn`).then(res=>{
        console.log('获取直播预约列表',res)
      })
    },
    //获取主播推荐主播
    getRecommendList(){
      this.$http.get(`/sys/manage/anchor/recommend/list`).then(res=>{
        console.log('获取主播推荐主播',res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p{
  margin: 0;
  padding: 0;
}
.el-container{
  width: 100%;
  min-height: calc(calc(100vh - 50px - 38px - 30px) - 2px);
  background-image: url("../../../assets/img/liveRoom_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 0 20px;
  /deep/ .el-aside{
    min-height: calc(calc(100vh - 50px - 38px - 30px) - 2px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .anchor_header{
      width: 100%;
      height: 158px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #fff;
      >img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      .user-info{
        margin-left: 20px;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 14px 0px;
        .username{
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
          .anchor_detail_isLive{
            width: 70px;
            height: 20px;
            margin-left: 20px;
            font-size: 12px;
            text-align: right;
            line-height:20px ;
            padding-right: 10px;
            background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
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
              background-color: #FFFFFF;
              position: absolute;
              top: 50%;
              border-radius: 4rpx;
            }

            .live_icon_custom div:first-child {
              left: 0;
              transform: translateY(-50%);
              height: 100%;
              animation: live-icon-one linear .6s infinite;
            }

            .live_icon_custom div:nth-child(2) {
              left: 50%;
              transform: translate(-50%, -50%);
              height: 50%;
              animation: live-icon-two linear .6s infinite;
            }

            .live_icon_custom div:last-child {
              right: 0;
              height: 100%;
              transform: translateY(-50%);
              animation: live-icon-three linear .6s infinite;
            }
          }
        }
        .room_num{
          font-size: 16px;
          font-weight: 400;
        }
      }
    }
    
    .el-tabs{
      color: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      .el-tabs__header{
        background-color: #202122;
        height: 60px;
        border: none;
        margin: 0;
       .el-tabs__nav{
          width: 100%;
          border: none;
          display: flex;
          justify-content: space-around;
          .el-tabs__item{
            height: 60px;
            line-height: 60px;
            font-size: 13px;
            color: #999999;
            padding: 0!important;
            border: none;
          }
          >.is-active{
            color: #fff;
            font-size: 14px;
            border-bottom: 5px solid #F92D1C;
          }
        }
      }
      .el-tabs__content{
        background-color: #37383C;
        padding: 20px;
        flex: 1;
      }
    }
    .barrage_input{
      width: 100%;
      height: 60px;
      background-color: #37383C;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      margin: 20px 0px;
      >input{
        background:none ;
        border: none;
        color: #EAEAEA;
      }
      .sendBarrage_btn{
        width: 90px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: linear-gradient(91deg, #FA3622 0%, #FE055B 100%);
        border-radius: 5px;
        color: #fff;
        font-size: 18px;
        font-weight: 400;
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
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .conne_video{
          width: 200px;
          height: 150px;
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