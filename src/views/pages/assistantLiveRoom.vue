<template>
  <div class="live-room">
    <el-container>
      <el-aside width="350px">
        <div class="anchor_header">
          <img :src="anchorUserInfo.avatarUrl" alt="" />
          <div class="user-info">
            <div class="username">
              <span>{{ anchorUserInfo.userName }}</span>
              <div class="anchor_detail_isLive" v-if="liveStatus">
                <div class="live_icon_custom">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                直播中
              </div>
              <div class="no_live_status" v-else>
                <img src="../../assets/img/black_circle.png" alt="" />
                <span>未开播</span>
              </div>
              <div class="record_btn" @click="recordMethod" v-if="liveStatus">
                <img
                  :src="
                    isRecord
                      ? require('../../assets/img/record.png')
                      : require('../../assets/img/start_record.png')
                  "
                  alt=""
                />
                <span>{{
                  isRecord && !pauseRecord
                    ? "暂停录制"
                    : isRecord && pauseRecord
                    ? "恢复录制"
                    : "开始录制"
                }}</span>
              </div>
            </div>
            <div class="online_info">
              <p>
                ·&nbsp;<span>{{
                  numberChange(liveRoomUserinfo.cumulativeNum || 0)
                }}</span
                >人看过
              </p>
              <!-- <p>
                ·&nbsp;<span>{{
                  numberChange(liveRoomUserinfo.onlineNum || 0)
                }}</span
                >人在线
              </p> -->
              <p>
                ·&nbsp;<span>{{
                  numberChange(liveRoomUserinfo.liveHot || 0)
                }}</span
                >热度
              </p>
            </div>
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
                <!-- 订单系统消息 -->
                <div
                  class="sysMessage"
                  v-if="
                    item.type &&
                    item.type === 'TIMGroupSystemNoticeElem' &&
                    item.payload.userDefinedField &&
                    item.payload.userDefinedField.type == 'purchaseInformation'
                  "
                >
                  {{ item.payload.userDefinedField.userName }}下单了<span
                    style="color: #fa3622"
                    >{{ item.payload.userDefinedField.productName }}</span
                  >
                </div>
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
                      <div
                        class="fansCard"
                        v-if="
                          item.payload.data.fansInfo &&
                          item.payload.data.fansInfo.isFans
                        "
                      >
                        <i class="el-icon-star-on" style="color: #c2f8ff"></i>
                        粉丝&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div
                        class="fansCard"
                        style="background: #e58d26"
                        v-else-if="
                          item.payload.data.fansInfo &&
                          item.payload.data.fansInfo.isAttention &&
                          !item.payload.data.fansInfo.isFans
                        "
                      >
                        <i class="el-icon-star-on" style="color: #fde7c8"></i>
                        用户&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div
                        class="fansCard"
                        style="background: #fa321f"
                        v-else-if="
                          item.payload.data.fansInfo &&
                          !item.payload.data.fansInfo.isFans &&
                          !item.payload.data.fansInfo.isAttention
                        "
                      >
                        <i class="el-icon-star-on" style="color: #fde7c8"></i>
                        游客&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
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
                <div
                  class="message_info"
                  v-if="
                    item.type &&
                    item.type === 'TIMCustomElem' &&
                    item.payload.data.message.type === 4
                  "
                >
                  <img :src="item.payload.data.userInfo.avatarUrl" alt="" />
                  <div class="message_content">
                    <div>
                      <span class="nickName"
                        >{{ item.payload.data.userInfo.nickName }}&nbsp;</span
                      >
                      <div
                        class="fansCard"
                        v-if="
                          item.payload.data.fansInfo &&
                          item.payload.data.fansInfo.isFans
                        "
                      >
                        <i class="el-icon-star-on" style="color: #c2f8ff"></i>
                        粉丝&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div
                        class="fansCard"
                        style="background: #e58d26"
                        v-else-if="
                          item.payload.data.fansInfo &&
                          item.payload.data.fansInfo.isAttention &&
                          !item.payload.data.fansInfo.isFans
                        "
                      >
                        <i class="el-icon-star-on" style="color: #fde7c8"></i>
                        用户&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div
                        class="fansCard"
                        style="background: #fa321f"
                        v-else-if="
                          item.payload.data.fansInfo &&
                          !item.payload.data.fansInfo.isFans &&
                          !item.payload.data.fansInfo.isAttention
                        "
                      >
                        <i class="el-icon-star-on" style="color: #fde7c8"></i>
                        游客&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                    </div>
                    <p class="normalMsg">
                      <span class="giftMsg"
                        >&nbsp;送出了<span class="gift_name">{{
                          item.payload.data.message.giftInfo.name
                        }}</span></span
                      >
                      <img
                        class="giftMsgIcon"
                        :src="item.payload.data.message.giftInfo.icon"
                        mode=""
                      />
                      <span class="giftMsgCount"
                        >&nbsp;x&nbsp;<span>{{
                          item.payload.data.message.giftInfo.giftNum
                        }}</span></span
                      >
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
                    <img
                      :src="item.avatarUrl || item.userInfo.avatarUrl"
                      mode=""
                    />
                    <span>{{ item.nickName || item.userInfo.nickName }}</span>
                  </div>
                  <div class="question_content_info">
                    <div class="tag">问</div>
                    <div class="text">
                      {{ item.content || item.message.questionText }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户" name="third">
            <div class="list_content" style="height: calc(100% - 50px)">
              <el-input
                placeholder="输入搜索内容"
                suffix-icon="el-icon-search"
                v-model="searchUser"
              >
              </el-input>
              <div class="search_btn" @click="searchUserFun"></div>
              <div
                class="student_content"
                v-for="(item, index) in studentList"
                :key="index"
              >
                <div class="left">
                  <span>{{ index + 1 }}</span>
                  <img :src="item.avatarUrl" alt="" />
                  <div class="anchorInfo">
                    <span>{{ item.nickName }}</span>
                    <p>{{ item.intimacy }}<span>亲密度</span></p>
                  </div>
                </div>
                <div class="right" @click="muteMthod(item)">
                  <img
                    src="../../assets/img/isMike_icon.png"
                    alt=""
                    v-if="!item.isTalk"
                  />
                  <img src="../../assets/img/noMike_icon.png" alt="" v-else />
                </div>
              </div>
            </div>
            <div class="muteBtn">
              <div @click="allMute(1)">全员禁言</div>
              <div @click="allMute(2)">全员解禁</div>
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
            <div
              v-for="(item, index) in toolNav"
              :key="index"
              :class="['tool_nav_' + item.type, 'tool_nav']"
              @click="toolClick(item.type)"
            >
              <img :src="item.img" alt="" />
              <span>{{ item.text }}</span>
              <div
                class="tool_nav_son"
                v-show="
                  toolNavSelected == 'setUp' && item.type == toolNavSelected
                "
              >
                <p @click.stop="openOrCloseGift">{{ giftStatus ? "关闭礼物" : "开启礼物" }}</p>
                <p @click.stop="openOrCloseLike">{{ likeStatus ? "关闭互动" : "开启互动" }}</p>
                <p @click.stop="streamAddress">拉流地址</p>
              </div>
            </div>
          </div>
        </el-header>
        <el-main>
          <div class="live_content" v-loading="loadingLive"
            element-loading-text="直播加载中"
            element-loading-spinner="el-icon-loading">
            <div class="live_menu" id="screenWidth">
              <div class="live_menu_header">
                <div class="live_theme">主题&nbsp;:&nbsp;{{ liveTheme }}</div>
                <div class="online_info">
                  <p>FPS：{{ videoFPS }}</p>
                  <p>丢包率：{{ videoPacketsLostRate }}</p>
                  <div class="online_info_status">
                    <p>
                      网络状态：
                      <span :style="videoQualityStyle">{{
                        videoQualityText
                      }}</span>
                    </p>
                    <div>
                      <span
                        :style="videoQualityNumStyle"
                        v-for="i in videoQualityNum"
                        :key="i"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
              <video autoplay muted id="myVideo" class="push_video"></video>
            </div>
            <div class="connect_list">
              <div
                class="connet_video"
                v-for="(item, index) in connectMessageInfo"
                :key="index"
              >
                <div
                  class="video_div"
                  v-loading="!item.connectStatus || item.getReplyConnectLoading"
                  :element-loading-text="
                    item.getReplyConnectLoading
                      ? '连接中'
                      : item.connectStatus
                      ? ''
                      : item.message.connectType == 2
                      ? '申请视频连麦中'
                      : '申请语音连麦中'
                  "
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.5)"
                >
                  <video
                    autoplay
                    :src-object.prop="item.stream"
                    :style="{
                      width:
                        item.message.connectType == 1 || !item.connectStatus
                          ? '0px'
                          : '230px',
                      height:
                        item.message.connectType == 1 || !item.connectStatus
                          ? '0px'
                          : '112px',
                    }"
                  ></video>
                  <img
                    class="connect_headerUrl"
                    :src="item.userInfo.avatarUrl"
                    alt=""
                    v-if="item.message.connectType === 1 || !item.connectStatus"
                  />
                </div>
                <div class="cennect_userinfo">
                  <div>
                    <img
                      src="../../assets/img/camera.png"
                      alt=""
                      v-if="item.message.connectType == 2"
                    />
                    <img
                      src="../../assets/img/mike.png"
                      alt=""
                      v-if="item.message.connectType == 1"
                    />
                    <span>{{ item.userInfo.nickName }}</span>
                  </div>
                  <div
                    class="btn gua_btn"
                    @click="
                      replyConnect(
                        2,
                        item.message.type,
                        item.message.connectType,
                        item.userInfo.userId,
                        item.userInfo.nickName
                      )
                    "
                    v-if="!item.connectStatus"
                  >
                    拒绝
                  </div>
                  <div
                    class="btn"
                    @click="
                      replyConnect(
                        1,
                        item.message.type,
                        item.message.connectType,
                        item.userInfo.userId,
                        item.userInfo.nickName
                      )
                    "
                    v-if="!item.connectStatus"
                  >
                    接通
                  </div>
                  <div
                    class="btn gua_btn"
                    @click="hangupHandle(item)"
                    v-if="item.connectStatus"
                  >
                    挂断
                  </div>
                </div>
              </div>
              <!-- <div
                @click="openOrCloseConnect"
                :style="
                  connectMessageInfo.length
                    ? 'marginTop:22px;'
                    : 'marginTop:100%;'
                "
                class="openConnect_btn"
              >
                <img src="../../assets/img/open_connect_icon.png" alt="" />
                <span>{{ connectOpenStatus ? "关闭连麦" : "开启连麦" }}</span>
              </div> -->
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="拉流地址"
      :visible.sync="streamAddressDialog"
      top="200px"
      width="440px"
    >
      <div class="dialog_content">
        <el-tooltip :content="streamUrl" placement="top">
          <div class="streamAddress_content">{{ streamUrl }}</div>
        </el-tooltip>
        <div class="copy_btn" :data-clipboard-text="streamUrl" @click="copyFun">
          复制
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="商品"
      :visible.sync="goodsDialogVisible"
      top="50px"
      width="440px"
    >
      <div
        class="dialog_content"
        v-loading="goodsListLoading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <div
          class="content_list"
          v-for="(item, index) in goodsList"
          :key="index"
        >
          <div class="list_top">
            <span>{{ item.sort }}</span>
            <p>{{ item.productName }}</p>
          </div>
          <div class="list_bottom">
            <div class="info">
              <span>{{ item.productType }}&nbsp;|</span>
              <p>&nbsp;本场带货销售{{ Number(item.liveSalesNum) }}</p>
            </div>
            <div class="push_btn" @click="pushMethod('goods', item)">推送</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="直播预告"
      :visible.sync="livePreviewDialogVisible"
      top="50px"
      width="440px"
    >
      <div class="dialog_content">
        <div
          class="content_list_preview"
          v-for="(item, index) in livePreviewList"
          :key="index"
        >
          <div class="list_top">
            <img :src="item.frontCoverUrl" alt="" />
            <p>{{ item.liveTheme }}</p>
          </div>
          <div class="list_bottom">
            <div class="info">
              <span>开播时间：{{ item.startDate }}</span>
              <p>预计时长：{{ item.estimateLiveTime }}分钟</p>
            </div>
            <div class="push_btn" @click="pushMethod('preview', item)">
              推送
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="推荐主播"
      :visible.sync="recommendedAnchorDialogVisible"
      top="50px"
      width="440px"
    >
      <div class="dialog_content">
        <div
          class="content_list_recommend"
          v-for="(item, index) in recommendList"
          :key="index"
        >
          <div class="list_left">
            <span>{{ index + 1 }}</span>
            <div class="userInfo">
              <img :src="item.avatarUrl" alt="" />
              <span>{{ item.username }}</span>
            </div>
          </div>
          <div class="list_right">{{ item.fansNum }}&nbsp;粉丝</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import Clipboard from "clipboard";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import TIM from "tim-js-sdk";
import { numberChange } from "@/utils";
import videojs from 'video.js'
import 'videojs-contrib-hls'

export default {
  data() {
    return {
      goodsDialogVisible: false, //商品弹窗
      livePreviewDialogVisible: false, //直播预告弹窗
      recommendedAnchorDialogVisible: false, //推荐主播弹窗
      streamAddressDialog: false, //拉流地址弹窗
      videoFPS: 0, //推流帧率
      videoPacketsLostRate: 0, //推流丢包率
      videoQuality: 0, //推流质量 -1 表示未知，0 表示 极好,1 表示好，2 表示中等，3 表示 差，4 表示极差
      activeName: "first",
      anchorUserId:'',
      userName: "",
      userID: "",
      userInfo:{
        type:"assistant",//助手身份标识
      },
      appID: null,
      server: "",
      SDKAppID: null,
      zg: {},
      tim: null, //IM实例
      token: "",
      roomId: "",
      streamID: "",
      stream:{},
      groupID: "", //群聊ID
      conversation: null, //直播插件
      connectMessageInfo: [], //申请连麦信息
      barrageData: [], // 弹幕内容
      liveRoomUserinfo: {}, //用户在线信息
      goodsList: [], //获取主播推荐商品
      goodsListLoading: false, //推荐商品刷新loading
      livePreviewList: [], //直播预告列表
      recommendList: [], //主播推荐主播列表
      barrage: "",
      questionMessageInfo: [], //提问消息
      studentList: [], //在线用户列表
      searchUser: "",
      anchorUserInfo: {}, //用户信息
      toolNavSelected: "", //选中的工具选项
      toolNav: [
        {
          img: require("@/assets/img/setUp_icon.png"),
          text: "设置",
          type: "setUp",
        },
        {
          img: require("@/assets/img/goods_icon.png"),
          text: "商品",
          type: "goods",
        },
        {
          img: require("@/assets/img/livePreview_icon.png"),
          text: "直播预告",
          type: "livePreview",
        },
        {
          img: require("@/assets/img/recommendedAnchor_icon.png"),
          text: "推荐主播",
          type: "recommendedAnchor",
        },
      ],
      liveStatus: false, //直播状态
      liveTheme: "", //直播主题
      params: {
        limit: 10,
        page: 1,
      },
      total: 0,
      isRecord: false, //录制状态
      pauseRecord: false, //录制暂停状态
      streamUrl: "",
      isMuteLive: false,
      livePlayerList: [], //流列表
      connectTimer: {}, //超时定时器
      connectStatusTimer: null, //连麦之后定时监听连麦用户连接状态
      giftStatus:1, //是否关闭送礼物 1:开启 0:关闭
      likeStatus:1, //是否开启互动
      connectOpenStatus:1,//是否开启连麦
      player:null,
      loadingLive:false,
    };
  },
  created() {
    this.anchorUserId = this.$route.query.anchorUserId
    this.roomId = this.$route.query.anchorUserId
    this.getStream()
    this.getRoomMsg()
  },
  computed: {
    videoQualityNum() {
      switch (this.videoQuality) {
        case 0:
          return 5;
        case 1:
          return 4;
        case 2:
          return 3;
        case 3:
          return 2;
        case 4:
          return 1;
      }
    },
    videoQualityText() {
      switch (this.videoQuality) {
        case 0:
          return "极好";
        case 1:
          return "好";
        case 2:
          return "中等";
        case 3:
          return "差";
        case 4:
          return "极差";
      }
    },
    videoQualityStyle() {
      let style = "";
      switch (this.videoQuality) {
        case 0:
          return (style += "color:#00FF31;");
        case 1:
          return (style += "color:#00FF31;");
        case 2:
          return (style += "color:#FF8924;");
        case 3:
          return (style += "color:#FE0013;");
        case 4:
          return (style += "color:#FE0013;");
      }
    },
    videoQualityNumStyle() {
      let style = "";
      switch (this.videoQuality) {
        case 0:
          return (style += "backgroudColor:#00FF31;");
        case 1:
          return (style += "backgroudColor:#00FF31;");
        case 2:
          return (style += "backgroudColor:#FF8924;");
        case 3:
          return (style += "backgroudColor:#FE0013;");
        case 4:
          return (style += "backgroudColor:#FE0013;");
      }
    },
  },
  async mounted() {
    document.addEventListener("click", (e) => {
      if (
        e.target.className &&
        (e.target.className.indexOf("tool_nav_setUp") == -1 ||
          e.target.className.indexOf("tool_nav_superboard") == -1)
      ) {
        this.toolNavSelected = "";
      }
    });
    this.liveTheme = this.$route.query.liveTheme;
    this.appID = parseInt(window.SITE_CONFIG["appID"]);
    // 初始化实例  Step1
    this.zg = new ZegoExpressEngine(
      parseInt(window.SITE_CONFIG["appID"]),
      window.SITE_CONFIG["server"]
    );
    this.zg.setLogConfig({ logLevel: "disable" });

    window.addEventListener("online", this.updateOnline);
    window.addEventListener("offline", this.updateOnline);

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
      // console.log(userList);
    });

    // 监听推流状态
    this.zg.on("publisherStateUpdate", (result) => {
      // 推流状态变更通知
      console.log("推流成功", result);
      if (result) {
      }
    });

    this.zg.on("publishQualityUpdate", (streamID, stats) => {
      // 推流质量
      // console.log("推流质量----", streamID, stats);
      // this.streamID = streamID;
      // this.videoFPS = stats.video.videoFPS.toFixed(2); //视频FPS
      // this.videoPacketsLostRate = stats.video.videoPacketsLostRate.toFixed(2); //视频丢包率
      // this.videoQuality = stats.video.videoQuality; //视频推流质量
    });

    //获取流地址
    this.zg.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
      if (updateType == "ADD") {
        // 流新增，开始拉流
        console.log("流新增------------", streamList);
        streamList.forEach((streamItem) => {
          this.livePlayerList.push(streamItem);
          this.connectMessageInfo.forEach(async (item) => {
            if (item.userInfo.userId === streamItem.user.userID) {
              item.stream = await this.zg.startPlayingStream(
                streamItem.streamID
              );
              item.getReplyConnectLoading = false;
            }
          });

          // 连麦列表排序
          this.connectMessageInfo = this.connectMessageInfo.sort(
            (a, b) => b.connectStatus - a.connectStatus
          );

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
              .catch((err) => {
                //混流失败挂断用户
                let messageInfo = {
                  type: 5, //消息类型(1:普通信息、2:关注信息、3:提问信息、4:礼物信息、5:语音连麦信息：{1、同意，2、拒绝}、6:视频连麦信息：{1、同意，2、拒绝}、)
                  connectType: extraInfoObj.connectType,
                  replyUserId: streamItem.user.userID,
                  replyType: -3, // 连麦后挂断
                  isHigh: true,
                };
                this.sendMessage(messageInfo);
              });
          }
        });
      } else if (updateType == "DELETE") {
        // 流删除，停止拉流
        console.log("流减少------------", streamList);
        streamList.forEach((streamItem) => {
          let index = this.livePlayerList.findIndex(
            (item) => item.streamID === streamItem.streamID
          );
          if (index > -1) {
            this.livePlayerList.splice(index, 1);
          }
          let arr = JSON.stringify(this.connectMessageInfo);
          arr = JSON.parse(arr);
          arr.forEach((item) => {
            if (item.userInfo.userId === streamItem.user.userID) {
              let ind = this.connectMessageInfo.findIndex(
                (item) => item.userInfo.userId === streamItem.user.userID
              );
              if (ind > -1) {
                this.connectMessageInfo.splice(ind, 1);
              }
            }
          });
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
  watch: {
    livePlayerList(n) {
      // 拉流变化定时监听连麦用户实时状态
      if (n.length > 0) {
        this.onGetConnectStatus();
      }
      if (n.length == 0) {
        this.offGetConnectStatus();
      }
    },
  },
  methods: {
    // 更新直播地址
    getVideo(url) {
      if(!this.player) {
        this.player = videojs("myVideo", {
          restoreEl: true,
          children: []
        })
      }
      this.player.src({
        src: url,
        type: 'application/x-mpegURL'
      })
      this.player.play()
      this.loadingLive = false
    },
    //获取房间流信息
    getStream(){
      this.$http.post('/sys/mixedflow/getStreamByRoomId',{RoomId: this.anchorUserId}).then(({data:res})=>{
        if(res && res.code == 100020) {
						return this.$message.warning('直播已结束')
        }
        if(res.code!=0) return this.$message.error(res.msg);
        this.streamUrl = res.data.Data.PlayInfo[0].HLS.replace("http", "https")
        if(this.streamUrl){
          this.liveStatus = true
          this.getVideo(this.streamUrl)
        }
      }).catch(err=>{

      })
    },
    //获取房间基础信息
    getRoomMsg(){
      this.$http.post('/sys/mixedflow/getRoomMsgByRoomId',{RoomId: this.anchorUserId}).then(({data:res})=>{
        if(res.code!=0) return this.$message.error(res.msg);
        this.userID = res.data.weixinUserDetailDTO.id
        this.userName = res.data.weixinUserDetailDTO.nickName
        this.liveRoomUserinfo.cumulativeNum = res.data.countGiveLikeNum
        this.liveRoomUserinfo.liveHot = res.data.liveHot
        this.anchorUserInfo.avatarUrl = res.data.avatarUrl
        this.anchorUserInfo.userName = res.data.username
        this.userInfo.userId = res.data.weixinUserDetailDTO.id
        this.userInfo.nickName = res.data.weixinUserDetailDTO.nickName
        this.userInfo.avatarUrl = res.data.weixinUserDetailDTO.avatarUrl
        this.isRecord = res.data.startRecord==1
        this.pauseRecord = res.data.pauseRecord==1
        this.connectOpenStatus = Number(res.data.openEvenWheat)
        this.giftStatus = Number(res.data.openLiveReward)
        this.likeStatus = Number(res.data.openGiveLike)
        this.getTimUserSig();
      }).catch(err=>{
        
      })
    },
    // 过万转换
    numberChange(num) {
      return numberChange(num);
    },
    // 开启或关闭礼物
    openOrCloseGift(){
      this.giftStatus = this.giftStatus?0:1
      if(this.giftStatus){
        this.sendMessage({ type: 9, isGift: true, isHigh:true, }); //开启送礼物
      }else{
        this.sendMessage({ type: 9, isGift: false, isHigh:true, }); //关闭送礼物
      }
      this.$message.success( this.giftStatus ? "您已开启礼物" : "您已关闭礼物" );
    },
    // 开启或关闭互动
    openOrCloseLike(){
      this.likeStatus = this.likeStatus?0:1
      if(this.likeStatus){
        this.sendMessage({ type: 12, isLike: true, isHigh:true, }); //开启互动
      }else{
        this.sendMessage({ type: 12, isLike: false, isHigh:true, }); //关闭互动
      }
      this.$message.success( this.likeStatus ? "您已开启互动" : "您已关闭互动" );
    },
    // 拉流地址
    streamAddress() {
      if (this.liveStatus) {
        this.streamAddressDialog = true;
      } else {
        this.$message.warning("直播暂未开启，请先开启直播");
      }
    },
    copyFun() {
      var clipboard = new Clipboard(".copy_btn");
      clipboard.on("success", (e) => {
        this.streamAddressDialog = false;
        this.$message.success("复制成功");
        clipboard.destroy(); // 释放内存
      });
      clipboard.on("error", (e) => {
        this.$message.warning("该浏览器不支持自动复制");
        clipboard.destroy(); // 释放内存
      });
    },
    updateOnline() {
      //网络状态
      if (!navigator.onLine) {
        // return this.$message.error('当前无网络连接，请检查网络')
        return this.$confirm("当前无网络连接，请检查网络", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "error",
        })
          .then(() => {})
          .catch(() => {});
      } else {
        this.init();
      }
    },
    load() {
      //在线用户列表加载
      this.params.page++;
      if (this.activeName === "third") {
        if (this.studentList.length >= this.total) {
          return;
        } else {
          this.getOnlineUsers();
        }
      }
    },
   
    async toolClick(type) {
      let needOpenLiveArr = ["desktopShare"];
      if (needOpenLiveArr.includes(type) && !this.liveStatus) {
        return this.$message.warning("直播暂未开启，请先开启直播");
      }
      this.toolNavSelected = type;
      switch (type) {
        case "goods":
          this.getAnchorProduct().then((res) => {
            if (!res.length) return this.$message.info("暂无商品");
            this.goodsDialogVisible = true;
          });
          break;
        case "livePreview":
          this.params.page = 1;
          this.goodsList = [];
          this.getLivePreviewList().then((res) => {
            if (!res.length) return this.$message.info("暂无预告");
            this.livePreviewDialogVisible = true;
          });
          break;
        case "recommendedAnchor":
          this.params.page = 1;
          this.goodsList = [];
          this.getRecommendList().then((res) => {
            if (!res.length) return this.$message.info("暂无推荐主播");
            this.recommendedAnchorDialogVisible = true;
          });
          break;
        case "setUp":
          break;
        case "device":
          this.deviceDialogVisible = true;
          break;
        case "desktopShare":
          this.shareDesk();
          break;
        case "superboard":
          break;
      }
    },
    recordMethod() {
      //录制
      if (this.liveStatus) {
        if (!this.isRecord && !this.pauseRecord) {
          this.isRecord = true; //开启录制状态
          this.sendMessage({type:14,isRecord:true,isHigh:true})
        } else if (this.isRecord && !this.pauseRecord) {
          this.pauseRecord = true; //暂停录制状态
          this.sendMessage({type:14,pauseRecord:true,isHigh:true})
        } else if (this.isRecord && this.pauseRecord) {
          this.pauseRecord = false; //恢复录制状态
          console.log(111111111)
          this.sendMessage({type:14,pauseRecord:false,isHigh:true})
        }
      } else {
        this.$message({
          message: "直播暂未开启",
          type: "warning",
        });
      }
    },
    handleClick: debounce(
      function (tab, event) {
        this.params.page = 1;
        switch (this.activeName) {
          case "second":
            this.questionMessageInfo = [];
            this.getliveQuestionList();
          case "third":
            this.studentList = [];
            this.getOnlineUsers();
            break;
          default:
            break;
        }
      },
      1000,
      { leading: true, trailing: false }
    ),
    muteMthod(data) {
      //禁言
      this.studentList.forEach((item) => {
        if (item.userId === data.userId) {
          if (!item.isTalk) {
            this.sendMessage({
              type: 20,
              replyUserId: data.userId,
              isTalk: true,
              isHigh: true,
            });
            this.getMuteStatus({
              isAll: 0,
              userId: data.userId,
              isTalk: 1,
            }).then((res) => {
              item.isTalk = 1;
            });
          } else {
            this.sendMessage({
              type: 20,
              replyUserId: data.userId,
              isTalk: false,
              isHigh: true,
            });
            this.getMuteStatus({
              isAll: 0,
              userId: data.userId,
              isTalk: 0,
            }).then((res) => {
              item.isTalk = 0;
            });
          }
        }
      });
    },
    allMute(type) {
      switch (type) {
        case 1:
          this.sendMessage({ type: 20, allMute: true, isHigh: true }); //全员禁言
          this.getMuteStatus({ isAll: 1, isTalk: 1 }).then((res) => {
            this.studentList.forEach((item) => (item.isTalk = 1));
          });

          break;
        case 2:
          this.sendMessage({ type: 20, allMute: false, isHigh: true }); //全员解禁
          this.getMuteStatus({ isAll: 1, isTalk: 0 }).then((res) => {
            this.studentList.forEach((item) => (item.isTalk = 0));
          });
          break;
        default:
          break;
      }
    },
    async getMuteStatus(obj) {
      let res = await this.$http.post("/sys/mixedflow/userMute", obj);
    },
    // 获取token的方法
    getTokenFun(userID) {
      let apiUrl = window.SITE_CONFIG["apiURL"];
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
          `${apiUrl}/sys/mixedflow/getZegoToken?userId=${userID}`,
          true
        );
        xmlhttp.send(null);
      });
    },
    // 获取token开启直播预览
    async startLive() {
      try {
        console.log(this.userID,66666666)
        let res = await this.getTokenFun(this.userID);
        if (res) {
          res = JSON.parse(res);
        }
        if (res && res.code == 0 && res.data && res.data.token) {
          this.token = res.data.token;
          this.loginRoom();
        } else {
          this.$message.error("登录即构失败");
          this.$loading().close();
        }
      } catch (err) {
        this.$message.error("登录即构失败");
        this.$loading().close();
      }
    },
    // 登陆房间
    async loginRoom() {
      const result = await this.zg.loginRoom(this.roomId, this.token, {
        userID: this.userID,
        userName: this.userName,
      });
    },
    //开启、关闭连麦
    openOrCloseConnect() {
      this.$confirm(
        `确认${this.connectOpenStatus ? "关闭" : "开启"}连麦`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.connectOpenStatus = this.connectOpenStatus ? 0 : 1;
          if (this.liveStatus) {
            if (this.connectOpenStatus) {
              this.sendMessage({ type: 11, isConnect: true, isHigh: true }); //开启连麦
            } else {
              this.sendMessage({
                type: 11,
                isConnect: false,
                isHigh: true,
              }); //关闭连麦
              this.connectMessageInfo = [];
            }
          }
          this.$message.success(
            this.connectOpenStatus ? "您已开启连麦" : "您已关闭连麦"
          );
        })
        .catch(() => {});
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
      try {
        let res = await this.$http.get(
          "/sys/manage/tencentCloudIm/getTxCloudUserSig"
        );
        //获取腾讯IM签名
        let userId = res.data.data.liveUserId && res.data.data.liveUserId;
        let userSig = res.data.data.userSig && res.data.data.userSig;
        this.groupID = "LIVE@" + this.anchorUserId;
        let options = {
          SDKAppID: parseInt(window.SITE_CONFIG["SDKAppID"]), // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
        };
        // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
        this.tim = TIM.create(options); // SDK 实例通常用 tim 表示
        if (!this.liveStatus) {
          this.tim.login({ userID: userId, userSig: userSig }); //登录腾讯IM
        } else {
          this.tim
            .login({ userID: userId, userSig: userSig })
            .then((imResponse) => {
              //登录腾讯IM
              if (imResponse.data) {
                this.waitSdkReady();
              }
            });
        }
        this.startLive();
      } catch (err) {
        this.$message.error(JSON.stringify(err));
        this.$loading().close();
      }
    },
    onSdkReady(event) {
      //监听IM sdk状态
      console.log("event-----------", event);
      if (event.name === "sdkStateReady") {
        this.joinGroup(); //直播开启中，直接加入群聊
      }
    },
    waitSdkReady() {
      this.tim.on(TIM.EVENT.SDK_READY, this.onSdkReady, this);
    },
    // 获取权限
    getPermissions() {
      return this.$http
        .get("/sys/menu/permissions")
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          window.SITE_CONFIG["permissions"] = res.data;
        })
        .catch(() => {});
    },
    $onMessageReceived(value) {
      //接收到消息
      const event = value;
      let list = [];
      event.data.forEach((item) => {
        if (item.type === "TIMGroupSystemNoticeElem") {
          // 被PC端禁播
          if (
            item.payload.userDefinedField &&
            item.payload.userDefinedField.match("你已被禁播")
          ) {
            // console.log("被禁播");
            this.$alert(item.payload.userDefinedField, "系统提示", {
              confirmButtonText: "确定",
              callback: (action) => {
                // this.endLiveTitle = '您因违反规定已被禁播'
                this.isMuteLive = true;
                this.getEndLiveInfo();
              },
            });
          }
          if (item.payload.userDefinedField) {
            item.payload.userDefinedField = JSON.parse(
              item.payload.userDefinedField
            );
            let tempObj = item.payload.userDefinedField;
            for (var key in tempObj) {
              this.liveRoomUserinfo[key] = tempObj[key];
            }
            if (tempObj.type == "purchaseInformation") {
              //订单系统消息
              list.push(Object.assign(item));
            }
          }
        }
        if (
          this.conversation &&
          item.conversationID === this.conversation.conversationID
        ) {
          if (item.payload && item.payload.data) {
            item.payload.data = JSON.parse(item.payload.data);
            let applyInfo = item.payload.data;
            if( applyInfo.message.type === 1 || applyInfo.message.type === 4 || applyInfo.message.type === 10){
              list.push(Object.assign(item));
            }
            if (applyInfo.message.type === 3) {
              this.questionMessageInfo.unshift(applyInfo);
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 9 ){ //主播控制赠送礼物
              this.giftStatus = applyInfo.message.isGift
              this.$message.success(this.giftStatus?'主播已开启礼物':'主播已关闭礼物')
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 11 ){ //主播控制连麦
              this.connectOpenStatus = applyInfo.message.isConnect
              if(this.connectOpenStatus){
                this.$message.success('主播已开启连麦')
              }else{
                this.connectMessageInfo = []
                this.$message.success('主播已关闭连麦')
              }
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 12 ){ //主播控制互动
              this.likeStatus = applyInfo.message.isLike
              this.$message.success(this.likeStatus?'主播已开启互动':'主播已关闭互动')
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 14 ){ //助手控制录制
              if(applyInfo.message.isRecord){ //开启录制
                this.isRecord = applyInfo.message.isRecord
                this.$message({
                  message: "主播已开启录制",
                  type: "success",
                });
              }
              if(applyInfo.message.pauseRecord){ //暂停、恢复录制
                this.pauseRecord = applyInfo.message.pauseRecord
                if(this.pauseRecord){
                  this.$message({
                    message: "主播已暂停录制",
                    type: "success",
                  });
                }else{
                  this.$message({
                    message: "主播已恢复录制",
                    type: "success",
                  });
                }
              }
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
                applyInfo.getReplyConnectLoading = null; //定义连接中状态
                applyInfo.stream = {}; //连麦流
                let arr = [];
                this.connectMessageInfo.forEach((item) =>
                  arr.push(item.userInfo.userId)
                );
                if (arr.indexOf(applyInfo.userInfo.userId) === -1) {
                  this.connectMessageInfo.push(applyInfo);
                }
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
                applyInfo.message.replyType === -1
                  ? this.$message("用户已取消连麦申请")
                  : this.$message("用户已断开连麦");
                if (this.connectTimer[applyInfo.userInfo.userId]) {
                  clearTimeout(this.connectTimer[applyInfo.userInfo.userId]);
                  delete this.connectTimer[applyInfo.userInfo.userId];
                }
                this.$loading().close();
              }
            }
            if (
              applyInfo.message &&
              applyInfo.message.type &&
              applyInfo.message.type === 30
            ) {
              //用户端切换连麦
              this.connectMessageInfo.forEach((item) => {
                if (item.userInfo.userId == applyInfo.userInfo.userId) {
                  item.message.connectType = applyInfo.message.connectType;
                }
              });
            }
            // 连麦之后接收连麦用户定时发送的正在连麦中消息
            if (
              applyInfo.message &&
              applyInfo.message.type &&
              applyInfo.message.type === 6
            ) {
              // console.error(applyInfo)
              this.connectMessageInfo.forEach((connect) => {
                if (
                  connect.connectStatus &&
                  connect.userInfo &&
                  applyInfo.userInfo &&
                  connect.userInfo.id == applyInfo.userInfo.id
                ) {
                  connect["lastGetConnectIng"] = new Date().getTime();
                }
              });
            }
          }
        }
      });
      this.barrageData = this.barrageData.concat(list); //弹幕消息
      // 如果大于50，则需要删除多余数据
      if (this.barrageData.length > 50) {
        this.barrageData.splice(0, this.barrageData.length - 50);
      }
      this.$nextTick(() => {
        let barragediv = document.getElementById("barrage");
        barragediv.scrollTop = barragediv.scrollHeight;
      });
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
    sendMessage(messageInfo, cb) {
      try {
        if (!this.liveStatus) {
          this.$message({ message: "直播暂未开启", type: "warning" });
          return;
        }
        if (messageInfo.type === 1 && this.barrage.trim().length == 0) {
          this.$message({ message: "聊天内容不能为空", type: "warning" });
          return;
        }
        // 将自己发送的消息写进消息列表里面
        const text = this.barrage;
        let data = {
          userInfo: this.userInfo, //用户信息
          fansInfo: {}, //用户是否为粉丝相关信息
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
            isConnect: messageInfo.isConnect, //是否开启连麦
            isGift: messageInfo.isGift, //是否开启礼物
            isLike: messageInfo.isLike, //是否开启互动
            pauseRecord: messageInfo.pauseRecord, //暂停录制
            isRecord: messageInfo.isRecord, //是否开启录制
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
          priority:
            messageInfo && messageInfo.isHigh
              ? TIM.TYPES.MSG_PRIORITY_HIGH
              : TIM.TYPES.MSG_PRIORITY_NORMAL,
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
        if (cb) cb();
      } catch (error) {
        this.$confirm(
          "腾讯IM登录失败，请检查当前页面无重复打开后刷新重试",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "error",
          }
        )
          .then(() => {
            window.close();
          })
          .catch(() => {
            window.close();
          });
      }
    },
    searchUserFun() {
      this.params.page = 1;
      this.studentList = [];
      this.getOnlineUsers();
    },
    //获取提问列表
    getliveQuestionList() {
      this.$http
        .get("/sys/liveAsk/getLiveAskInRoom")
        .then(({ data: res }) => {
          if (!res.code == 0) return this.$message.error(res.msg);
          this.questionMessageInfo = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 获取在线学生
    getOnlineUsers() {
      let obj = {
        nickName: this.searchUser,
      };
      let params = { ...this.params, ...obj };
      this.$http
        .get(`/sys/mixedflow/getOnlineUsers`, { params })
        .then(({ data: res }) => {
          if (!res.code == 0) return this.$message.error(res.msg);
          let data = res.data.list;
          this.studentList = this.studentList.concat(data);
          this.total = res.data.total;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 获取主播推荐商品
    getAnchorProduct() {
      let params = {
        liveId: this.$route.query.TaskId,
        anchorId: this.roomId,
        isAdd: 1,
        type: 1,
        limit: 999,
        page: 1,
      };
      return new Promise((resolve, reject) => {
        this.goodsListLoading = true;
        this.$http
          .get(`/sys/anchorProduct/live/pageWithLiveAnchor`, { params })
          .then((res) => {
            this.goodsListLoading = false;
            if (!res.data.code == 0) return this.$message.error(res.data.msg);
            let data = res.data.data.list;
            data.forEach((item) => {
              if (item.productTag) {
                item.productTag = item.productTag.split("|");
              }
            });
            this.goodsList = data;
            resolve(this.goodsList);
          })
          .catch((err) => {
            this.goodsListLoading = false;
            console.error(err);
          });
      });
    },
    // 获取直播预约列表
    getLivePreviewList() {
      let params = {
        liveState: 3,
        appointmentState: 1,
        anchorUserId: this.roomId,
        limit: 999,
        page: 1,
      };
      return new Promise((resolve, reject) => {
        this.$http
          .get(`/sys/livePreview/pageOwn`, { params })
          .then((res) => {
            if (!res.data.code == 0) return this.$message.error(res.data.msg);
            this.livePreviewList = res.data.data.list;
            resolve(this.livePreviewList);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
    //获取主播推荐主播
    getRecommendList() {
      let params = {
        liveId: this.$route.query.TaskId,
        state: 1,
        userId: this.userID,
        limit: 999,
        page: 1,
      };
      return new Promise((resolve, reject) => {
        this.$http
          .get(`/sys/sysRecommendedAnchor/page`, { params })
          .then((res) => {
            if (!res.data.code == 0) return this.$message.error(res.data.msg);
            this.recommendList = res.data.data.list;
            resolve(this.recommendList);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
    //推送商品、直播预告
    pushMethod(type, data) {
      if (type === "goods") {
        //推送商品
        this.sendMessage({ type: 8, pushData: data, isHigh: true }, () => {
          this.$message({ message: "商品推送成功", type: "success" });
          // 推送成功同时置顶该商品
          if (data.productLiveId) {
            this.$http
              .put("/sys/anchorProduct/live/setTop", { id: data.productLiveId })
              .then(({ data: res }) => {
                if (res.code !== 0) {
                  console.warn(res.msg);
                } else {
                  //置顶成功刷新列表
                  this.getAnchorProduct();
                }
              })
              .catch((err) => {
                console.warn(err);
                // throw err;
              });
          }
        });
      } else {
        this.sendMessage({ type: 7, pushData: data, isHigh: true }, () =>
          this.$message({ message: "预告推送成功", type: "success" })
        );
      }
    },
    replyConnect: debounce(
      function (status, type, connectType, userId, nickName) {
        //同意申请连麦
        let messageInfo = {
          type,
          connectType,
          replyType: 1,
          replyUserId: userId,
          isHigh: true,
        };
        if (status === 1) {
          let arr = this.connectMessageInfo.filter(
            (item) => item.connectStatus
          );
          if (arr.length == 3)
            return this.$message.warning("当前连麦人数已达上限");
          //同意
          // this.$loading({ background: "rgba(0,0,0,.5)", text: "连接中..." });
          //连接超时
          var timer = setTimeout(() => {
            let arr = JSON.stringify(this.connectMessageInfo);
            arr = JSON.parse(arr);
            arr.forEach((item) => {
              if (item.getReplyConnectLoading) {
                this.$message.error(nickName + "连接失败");
                messageInfo.replyType = -3;
                this.sendMessage(messageInfo);
                const ind = this.connectMessageInfo.findIndex(
                  (item) => item.userInfo.userId === userId
                );
                if (ind > -1) {
                  this.connectMessageInfo.splice(ind, 1);
                }
              }
            });
            clearTimeout(timer);
          }, 10000);
          this.connectTimer[userId] = timer;
          this.sendMessage(messageInfo);
          this.connectMessageInfo.forEach((item) => {
            if (item.userInfo.userId === userId) {
              item.connectStatus = true;
              item.getReplyConnectLoading = true;
            }
          });
        } else {
          //拒绝
          messageInfo.replyType = -2;
          this.sendMessage(messageInfo);
          const ind = this.connectMessageInfo.findIndex(
            (item) => item.userInfo.userId === userId
          );
          if (ind > -1) {
            this.connectMessageInfo.splice(ind, 1);
          }
        }
      },
      1000,
      { leading: true, trailing: false }
    ),
    hangupHandle(item) {
      this.$confirm(`确认挂断用户[${item.userInfo.nickName || ""}]`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.hangup(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消挂断",
          });
        });
    },
    // 挂断方法
    hangup(info) {
      if (this.connectTimer[info.userInfo.userId]) {
        clearTimeout(this.connectTimer[info.userInfo.userId]);
        delete this.connectTimer[info.userInfo.userId];
      }
      //挂断
      const ind = this.connectMessageInfo.findIndex(
        (item) => item.userInfo.userId === info.userInfo.userId
      );
      if (ind > -1) {
        this.connectMessageInfo.splice(ind, 1); //移除挂断的一条连麦信息
      }
    },
    // 定时监听连麦用户实时状态
    onGetConnectStatus() {
      if (!this.connectStatusTimer) {
        console.log("开始监听连麦用户定时发送的消息");
        this.connectStatusTimer = setInterval(() => {
          this.connectMessageInfo.map((item) => {
            // console.error(item)
            if (
              item.connectStatus &&
              item.getReplyConnectLoading == false &&
              item.lastGetConnectIng
            ) {
              let time = new Date().getTime() - item.lastGetConnectIng;
              // 超过8s未发送正在连麦消息挂断
              if (time > 8 * 1000) {
                this.livePlayerList.forEach((data) => {
                  if (data.streamID.includes(item.userInfo.userId)) {
                    this.$http
                      .post(`/sys/mixedflow/deleteStream`, {
                        RoomId: this.roomId, //房间ID；
                        joinRoomId: data.streamID,
                      })
                      .then(({ data: res }) => {
                        if (res.code != 0) return this.$message.error(res.msg);
                        // 挂断
                        this.hangup(item);
                      })
                      .catch((err) => {
                        console.warn(err);
                        this.$message.error(JSON.stringify(err));
                      });
                  }
                });
              }
            }
          });
        }, 3 * 1000);
      }
    },
    // 取消监听连麦用户实时状态
    offGetConnectStatus() {
      if (this.connectStatusTimer) {
        console.log("取消监听连麦用户定时发送的消息");
        clearInterval(this.connectStatusTimer);
        this.connectStatusTimer = null;
      }
    },
  },
  destroyed() {
  },
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
  background-size: cover;
  padding: 0 20px 20px;
  box-sizing: border-box;
  background-color: #000;
  > .el-container {
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
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px 0px;
          position: absolute;
          left: 120px;
          .username {
            display: flex;
            align-items: center;
            font-size: 18px;
            > span {
              font-weight: 600;
            }
            .anchor_detail_isLive {
              width: 70px;
              height: 20px;
              background: linear-gradient(89deg, #fa3622 0%, #fe055b 100%);
              box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
              border-radius: 10px;
              margin-left: 20px;
              font-size: 12px;
              line-height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
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
            .no_live_status {
              width: 70px;
              line-height: 20px;
              background: #ffffff;
              color: #110914;
              font-size: 12px;
              border-radius: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 20px;
              > img {
                width: 6px;
                height: 6px;
                margin-right: 5px;
              }
            }
            .record_btn {
              margin-left: 20px;
              cursor: pointer;
              line-height: 20px;
              > img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
              }
              > span {
                font-size: 14px;
                color: #ffffff;
                font-weight: 400;
              }
            }
          }
          > .online_info {
            display: flex;
            > p {
              margin-right: 15px;
              font-size: 14px;
              font-weight: 400;
            }
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
                        width: 65px;
                        height: 16px;
                        text-align: center;
                        background-color: #51cada;
                        border-radius: 15px;
                        font-size: 8px;
                        line-height: 16px;
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
                      .giftMsgIcon {
                        width: 40px;
                        height: 40px;
                      }
                      .gift_name {
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
              position: relative;
              .search_btn {
                cursor: pointer;
                width: 40px;
                height: 40px;
                position: absolute;
                right: 0;
                top: 0;
              }
              .el-input__inner {
                background-color: #44454a;
                border-radius: 23px;
                border: none;
                color: #b7b7b7;
              }
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
                .preview_content {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  > img {
                    width: 120px;
                    height: 66px;
                  }
                  > p {
                    margin-left: 10px;
                    word-break: break-all;
                  }
                }
                .preview_time {
                  margin-top: 10px;
                  color: #898989;
                  font-size: 14px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  > p {
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
                .recommend_content {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  padding: 10px 0px;
                  border-bottom: 1px solid #4a4a4a;
                  > span {
                    font-size: 16px;
                    color: #898989;
                  }
                  > img {
                    width: 40px;
                    height: 40px;
                    margin-left: 10px;
                  }
                  .anchorInfo {
                    display: flex;
                    flex-direction: column;
                    margin-left: 10px;
                    > span {
                      color: #eaeaea;
                      font-size: 16px;
                    }
                    > p {
                      color: #898989;
                      font-size: 14px;
                      > span {
                        color: #eaeaea;
                      }
                    }
                  }
                }
              }
              .student_content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 0px;
                border-bottom: 1px solid #4a4a4a;
                > .left {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  > span {
                    font-size: 16px;
                    color: #898989;
                  }
                  > img {
                    width: 40px;
                    height: 40px;
                    margin-left: 10px;
                  }
                  .anchorInfo {
                    display: flex;
                    flex-direction: column;
                    margin-left: 10px;
                    > span {
                      color: #eaeaea;
                      font-size: 16px;
                    }
                    > p {
                      color: #898989;
                      font-size: 14px;
                      > span {
                        margin-left: 8px;
                        color: #eaeaea;
                      }
                    }
                  }
                }
                .right {
                  > img {
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                  }
                }
              }
            }
            .muteBtn {
              width: 100%;
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-top: 5px;
              > div {
                width: 145px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
              }
              > div:first-child {
                background: linear-gradient(89deg, #fa3622 0%, #fe055a 100%);
                box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
              }
              > div:last-child {
                border: 1px solid #b7b7b7;
                color: #b7b7b7;
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
    .el-container {
      .el-header {
        height: 158px !important;
        padding: 0 0 0 20px;
        .live_room_header {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .start_live {
            width: 230px;
            height: 40px;
            background: linear-gradient(89deg, #fa3622 0%, #fe055b 100%);
            box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
            border-radius: 20px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 400;
            line-height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 45px;
            cursor: pointer;
            > img {
              width: 13px;
              height: 14px;
              margin-right: 13px;
            }
          }
          .tool_nav {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            color: #ffffff;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            margin: 0 15px;
            position: relative;
            cursor: pointer;
            > img {
              width: 28px;
              height: 28px;
              cursor: pointer;
            }
            > span {
              margin-top: 10px;
              font-size: 16px;
              font-weight: 400;
            }
            .tool_nav_son {
              position: absolute;
              bottom: -60px;
              background-color: #000000;
              width: 90px;
              font-size: 14px;
              color: #a2a2a2;
              z-index: 99;
              > p {
                text-align: center;
                line-height: 30px;
                width: 100%;
              }
            }
          }
        }
      }

      .el-main {
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
            .live_menu_header {
              width: 100%;
              height: 60px;
              background-color: #000000;
              padding: 16px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .live_theme {
                color: #fff;
                font-size: 20px;
                height: 100%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                width: 35%;
                word-break: break-all;
              }
              .online_info {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: #ffffff;
                font-size: 16px;
                > p {
                  margin-right: 10px;
                }
                .online_info_status {
                  display: flex;
                  > div {
                    display: flex;
                    align-items: flex-end;
                    justify-content: flex-start;
                    margin-bottom: 6px;
                    margin-left: 4px;
                    width: 26px;
                    > span {
                      display: inline-block;
                      width: 4px;
                      background: #00ff31;
                    }
                    > span:nth-child(1) {
                      height: 8px;
                      margin-right: 2px;
                    }
                    > span:nth-child(2) {
                      height: 10px;
                      margin-right: 2px;
                    }
                    > span:nth-child(3) {
                      height: 12px;
                      margin-right: 2px;
                    }
                    > span:nth-child(4) {
                      height: 14px;
                      margin-right: 2px;
                    }
                    > span:nth-child(5) {
                      height: 16px;
                    }
                  }
                }
              }
            }

            // 屏幕共享区域
            .screenShare {
              position: absolute;
              left: 0;
              top: 60px;
              width: 100%;
              height: calc(100% - 60px);
              .quit_board {
                position: absolute;
                right: 10px;
                top: 20px;
                cursor: pointer;
                background: linear-gradient(89deg, #fa3622 0%, #fe055b 100%);
                box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
                width: 100px;
                line-height: 25px;
                border-radius: 10px;
                color: #ffffff;
                text-align: center;
              }
            }

            .push_video {
              position: absolute;
              bottom: 0;
              right: 0;
              z-index: 1;
              width: 100%;
              height: calc(100% - 60px);
              .vjs-tech{
                width: 100%;
                height: 98%!important;
              }
            }
            .device_set {
              position: absolute;
              bottom: 20px;
              right: 10px;
              z-index: 2;
              display: flex;
              width: 90px;
              height: 40px;
              align-items: center;
              justify-content: space-between;
              > div {
                cursor: pointer;
                > img {
                  width: 40px;
                  height: 40px;
                }
              }
            }
          }
          .connect_list {
            width: 230px;
            height: 100%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background-color: #37383c;
            padding: 10px;
            .connet_video {
              width: 100%;
              height: 142px;
              &:not(:first-child) {
                margin-top: 10px;
              }
              .video_div {
                width: 100%;
                height: 112px;
                background-color: #32373a;
                display: flex;
                justify-content: center;
                align-items: center;
                /deep/ .el-icon-loading {
                  color: #ffffff;
                  font-size: 30px;
                }
                /deep/ .el-loading-text {
                  color: #ffffff;
                  font-size: 12px;
                }
                > video {
                  width: 100%;
                  height: 100%;
                }
                .connect_headerUrl {
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                }
              }
              .cennect_userinfo {
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
                > div {
                  > img {
                    width: 20px;
                    height: 20px;
                  }
                  > span {
                    margin-left: 10px;
                  }
                }
                > .btn {
                  background: #54c717;
                  width: 35px;
                  height: 20px;
                  text-align: center;
                  line-height: 20px;
                  border-radius: 3px;
                  cursor: pointer;
                }
                > .gua_btn {
                  background: #f92c1b;
                }
              }
            }
            .openConnect_btn {
              width: 210px;
              height: 40px;
              background: linear-gradient(89deg, #fa3622 0%, #fe055b 100%);
              box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
              border-radius: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ffffff;
              cursor: pointer;
              > img {
                width: 12px;
                height: 16px;
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
  .createWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    .createWrap-btn {
      width: 130px;
      padding: 36px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      background: #f7f7f7;
      font-size: 14px;
      color: #151515;
      cursor: pointer;
      position: relative;
      .actived {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 16px;
        height: 16px;
        opacity: 0;
      }
      &:hover {
        .actived {
          opacity: 1;
        }
      }
      .icon {
        width: 56px;
        height: 50px;
        margin-bottom: 20px;
      }
    }
  }

  .recoredDialog {
    background: #00f;
  }
  /deep/.el-dialog__body {
    padding: 0 20px !important;
  }
  /deep/ .dialog_content {
    width: 400px;
    max-height: 550px;
    box-sizing: border-box;
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    overflow: auto;
    .device_step {
      width: 100%;
      height: 90px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .step_line {
        width: 28px;
        height: 6px;
      }
      > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: relative;
        > img {
          width: 50px;
          height: 50px;
        }
        > span {
          color: #000000;
          font-size: 14px;
        }
        .camera_error {
          width: 18px;
          height: 18px;
          position: absolute;
          bottom: 25px;
          right: 15px;
        }
      }
    }
    .check_camera {
      margin-top: 30px;
      .camera_device {
        > span {
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .el-select {
          margin-left: 20px;
          width: 234px;
        }
      }
      .preview {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20px;
        > span {
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .check_camera_video {
          margin-left: 20px;
          width: 234px;
          height: 132px;
          background: #000000;
        }
      }
      .tip {
        font-size: 12px;
        color: #ababab;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        width: 234px;
        margin: 10px auto 0px;
        padding-right: 16px;
        .tip_title {
          display: flex;
          align-items: center;
          > span {
            margin-left: 2px;
          }
        }
      }
      .question {
        color: #000000;
        font-size: 14px;
        text-align: center;
        margin-top: 20px;
      }
    }
    .check_mike {
      margin-top: 30px;
      .mic_device {
        > span {
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .el-select {
          margin-left: 20px;
          width: 234px;
        }
      }
      .soundWaves_num {
        display: flex;
        width: 234px;
        position: relative;
        margin: 20px 0px 0px 65px;
        .under_div {
          width: 100%;
          > span {
            display: inline-block;
            width: 4px;
            height: 20px;
            background-color: #f8f8f8;
            border-radius: 2px;
            margin-right: 5px;
          }
        }
        .top_div {
          width: 100%;
          position: absolute;
          left: 0;
          overflow: hidden;
          height: 20px;
          > span {
            display: inline-block;
            width: 4px;
            height: 20px;
            background: #fa3523;
            border-radius: 2px;
            margin-right: 5px;
          }
        }
      }
      .soundWaves_line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 234px;
        margin-left: 65px;
        .el-slider {
          width: 75%;
        }
        .el-slider__bar {
          background: linear-gradient(
            90deg,
            #fa3623 0%,
            #fe055a 100%
          ) !important;
        }
        .el-slider__button {
          border: none !important;
          box-shadow: 0px 0px 3px 1px rgba(250, 54, 35, 0.4);
        }
      }
      .preview {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20px;
        > span {
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .check_camera_video {
          margin-left: 20px;
          width: 234px;
          height: 132px;
          background: #000000;
        }
      }
      .tip {
        font-size: 12px;
        color: #ababab;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        width: 234px;
        margin: 10px auto 0px;
        padding-right: 16px;
        .tip_title {
          display: flex;
          align-items: center;
          > span {
            margin-left: 2px;
          }
        }
      }
      .question {
        color: #000000;
        font-size: 14px;
        text-align: center;
        margin-top: 20px;
      }
    }
    .check_result {
      margin-top: 30px;
      .device_result {
        width: 300px;
        height: 45px;
        background: #f8f8f8;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        align-items: center;
        color: #000000;
        font-size: 14px;
        margin-bottom: 10px;
        .success {
          color: #02c100;
        }
        .error {
          color: #fa3523;
        }
      }
      .tip {
        width: 300px;
        margin: 0 auto 10px;
        font-size: 12px;
        color: #ababab;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        .tip_title {
          display: flex;
          align-items: center;
          > span {
            margin-left: 2px;
          }
        }
      }
    }

    .check_btn {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      > div {
        width: 140px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        border-radius: 20px;
        cursor: pointer;
      }
      > div:first-child {
        background: #f8f8f8;
        color: #ababab;
        margin-right: 20px;
      }
      > div:nth-child(2) {
        color: #ffffff;
        background: linear-gradient(89deg, #fa3622 0%, #fe055b 100%);
        box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
      }
    }
    .beautify_set {
      width: 324px;
      margin: 0 auto;
      .beautify_video {
        width: 100%;
        height: 182px;
      }
      .checkd_btn {
        margin: 0px 0px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #000000;
        font-size: 14px;
        .el-checkbox {
          color: #000000;
        }
        .checkd_reset {
          font-size: 12px;
          > span {
            margin-left: 2px;
          }
        }
      }
      .block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #000000;
      }
      .el-slider {
        width: 85%;
      }
      .el-slider__bar {
        background: linear-gradient(90deg, #fa3623 0%, #fe055a 100%) !important;
      }
      .el-slider__button {
        border: 2px solid #fa3623 !important;
        box-shadow: 0px 0px 3px 1px rgba(250, 54, 35, 0.4);
      }
    }
    .streamAddress_content {
      width: 100%;
      line-height: 45px;
      background: #f8f8f8;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .copy_btn {
      width: 140px;
      line-height: 40px;
      background: linear-gradient(89deg, #fa3622 0%, #fe055b 100%);
      box-shadow: 0px 4px 10px 1px rgba(249, 46, 29, 0.4);
      border-radius: 20px;
      text-align: center;
      margin: 30px auto 0;
      color: #ffffff;
      cursor: pointer;
    }
    .content_list {
      width: 100%;
      background: #f8f8f8;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 20px;
      .list_top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-left: 30px;
        position: relative;
        > span {
          line-height: 18px;
          text-align: center;
          color: #ffffff;
          font-size: 12px;
          background: linear-gradient(118deg, #fa3622 0%, #ff055b 100%);
          border-radius: 2px;
          padding: 1px 5px;
          white-space: nowrap;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      .list_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 30px;
        .info {
          display: flex;
          font-size: 12px;
          color: #b9b9b9;
        }
        .push_btn {
          width: 60px;
          background: linear-gradient(
            69deg,
            #fa3622 0%,
            #fa3622 1%,
            #ff055b 100%
          );
          border-radius: 15px;
          color: #ffffff;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .content_list_preview {
      width: 100%;
      background: #f8f8f8;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 20px;
      .list_top {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        > img {
          width: 100px;
          height: 56px;
          border-radius: 5px;
          margin-right: 20px;
        }
        > p {
          font-size: 16px;
          color: #202020;
          font-weight: 400;
        }
      }
      .list_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        .info {
          font-size: 12px;
          color: #b9b9b9;
        }
        .push_btn {
          width: 60px;
          background: linear-gradient(
            69deg,
            #fa3622 0%,
            #fa3622 1%,
            #ff055b 100%
          );
          border-radius: 15px;
          color: #ffffff;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .content_list_recommend {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 20px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #f3f3f3;
      .list_left {
        display: flex;
        align-items: center;
        padding-left: 30px;
        position: relative;
        > span {
          line-height: 18px;
          text-align: center;
          color: #ffffff;
          font-size: 12px;
          background: linear-gradient(118deg, #fa3622 0%, #ff055b 100%);
          border-radius: 2px;
          padding: 1px 5px;
          white-space: nowrap;
          position: absolute;
          left: 0;
          top: calc(50% - 9px);
        }
        .userInfo {
          color: #000000;
          > img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
      }
      .list_right {
        color: #b9b9b9;
        font-size: 12px;
      }
    }
  }
  .dialog_content::-webkit-scrollbar {
    display: none;
  }

  .recoredInfo {
    padding: 10px;
    .recoredInfo-title {
      color: #030303;
      font-size: 24px;
      font-weight: bold;
    }
    .recoredInfo-time {
      color: #9f9f9f;
      font-size: 14px;
      margin-top: 10px;
    }
    .recoredInfo-item {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .recoredInfo-item-box {
        width: 24%;
        height: 77px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        background: #eee;
        .recoredInfo-item-num {
          font-size: 24px;
          font-weight: 400;
        }
        .recoredInfo-item-text {
          font-size: 14px;
        }
      }

      .itemBox1 {
        background: #f4f5fe;
        color: #656caa;
      }
      .itemBox2 {
        background: #fef4fd;
        color: #985892;
      }
      .itemBox3 {
        background: #fef4fa;
        color: #915366;
      }
      .itemBox4 {
        background: #f4fbfe;
        color: #2c6177;
      }
      .itemBox5 {
        background: #f4fefe;
        color: #498787;
      }
      .itemBox6 {
        background: #f4fef8;
        color: #2a7548;
      }
      .itemBox7 {
        background: #fcfef4;
        color: #919b6b;
      }
      .itemBox8 {
        background: #fefaf4;
        color: #976f4b;
      }
    }
    .recoredInfo-click {
      width: 100%;
      display: flex;
      margin: 20px 0;
      justify-content: center;
      align-items: center;
    }
    .recoredInfo-profit {
      width: 100%;
      background: #fffaf5;
      border-radius: 10px;
      .recoredInfo-profit-title {
        background: #df3623;
        color: #fff;
        width: 90px;
        text-align: center;
        font-size: 16px;
        border-top-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      .recoredInfo-profit-item {
        display: flex;
        justify-content: space-between;
        .recoredInfo-profit-box {
          width: 33%;
          height: 77px;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          .profit-box-num {
            font-size: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              margin-left: 5px;
            }
          }
          .profit-box-text {
            color: #c1a992;
            font-size: 14px;
          }
        }
      }
    }
    .recoredInfo-profit-bottom {
      margin-bottom: 20px;
      margin-top: 10px;
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

/deep/.el-dialog.el-dialog--center {
  border-radius: 20px;
}
</style>