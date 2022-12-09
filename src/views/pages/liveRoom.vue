<template>
  <div class="live-room">
    <el-container>
      <el-aside width="350px">
        <div class="anchor_header">
          <img :src="userInfo.avatarUrl" alt="" />
          <div class="user-info">
            <div class="username">
              <span>{{ userInfo.username }}</span>
              <div class="anchor_detail_isLive" v-if="liveStatus">
                <div class="live_icon_custom">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                直播中
              </div>
              <div class="no_live_status" v-else>
                <img src="../../assets/img/black_circle.png" alt="">
                <span>未开播</span>
              </div>
              <!-- <div class="record_btn" @click="recordMethod" v-if="liveStatus">
                <img :src="isRecord ? require('../../assets/img/record.png') : require('../../assets/img/start_record.png')" alt="">
                <span>{{isRecord&&!pauseRecord?'暂停录制':isRecord&&pauseRecord?'恢复录制':'开始录制'}}</span>
              </div> -->
            </div>
            <div class="online_info">
              <p>
                ·&nbsp;<span>{{ numberChange(liveRoomUserinfo.cumulativeNum || 0)}}</span
                >人看过
              </p>
              <p>
                ·&nbsp;<span>{{ numberChange(liveRoomUserinfo.onlineNum || 0)}}</span
                >人在线
              </p>
              <p>·&nbsp;<span>{{ numberChange(liveRoomUserinfo.liveHot || 0)}}</span>热度</p>
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
                  {{ item.payload.userDefinedField.userName }}下单了<span style="color:#FA3622;">{{item.payload.userDefinedField.productName}}</span>
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
                      <div class="fansCard" v-if="item.payload.data.fansInfo && item.payload.data.fansInfo.isFans">
                        <i class="el-icon-star-on" style="color:#c2f8ff;"></i>
                        粉丝&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div class="fansCard" style="background:#E58D26;" v-else-if="item.payload.data.fansInfo && item.payload.data.fansInfo.isAttention && !item.payload.data.fansInfo.isFans">
                        <i class="el-icon-star-on" style="color:#fde7c8;"></i>
                        用户&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div class="fansCard" style="background:#FA321F;" v-else-if="item.payload.data.fansInfo && !item.payload.data.fansInfo.isFans && !item.payload.data.fansInfo.isAttention && item.payload.data.userInfo.type!='assistant'">
                        <i class="el-icon-star-on" style="color:#fde7c8;"></i>
                        游客&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div class="fansCard" style="background:#1F6BFA;" v-else-if="item.payload.data.userInfo&&item.payload.data.userInfo.type=='assistant'">
                        <i class="el-icon-star-on" style="color:#fde7c8;"></i>
                        助手&nbsp;
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
                      <div class="fansCard" v-if="item.payload.data.fansInfo && item.payload.data.fansInfo.isFans">
                        <i class="el-icon-star-on" style="color:#c2f8ff;"></i>
                        粉丝&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div class="fansCard" style="background:#E58D26;" v-else-if="item.payload.data.fansInfo && item.payload.data.fansInfo.isAttention && !item.payload.data.fansInfo.isFans">
                        <i class="el-icon-star-on" style="color:#fde7c8;"></i>
                        用户&nbsp;{{ item.payload.data.fansInfo.grade }}
                      </div>
                      <div class="fansCard" style="background:#FA321F;" v-else-if="item.payload.data.fansInfo && !item.payload.data.fansInfo.isFans && !item.payload.data.fansInfo.isAttention">
                        <i class="el-icon-star-on" style="color:#fde7c8;"></i>
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
                    <img :src="item.avatarUrl || item.userInfo.avatarUrl" mode="" />
                    <span>{{item.nickName || item.userInfo.nickName}}</span>
                  </div>
                  <div class="question_content_info">
                    <div class="tag">问</div>
                    <div class="text">
                      {{item.content || item.message.questionText}}
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
                v-model="searchUser">
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
            <div class="start_live" @click="startPlayLive" v-if="!liveStatus">
              <img src="../../assets/img/startLive.png" alt="" />
              <span>上课</span>
            </div>
            <div class="start_live" @click="closeLive" v-else>
              <img src="../../assets/img/closeLive.png" alt="" />
              <span>下课</span>
            </div>
            <div class="tool_nav" @click="trends==1?trends=0:trends=1" v-if="!liveStatus">
              <img :src="trends==1?require('@/assets/img/open_dynamic.png'):require('@/assets/img/close_dynamic.png')" alt="" @click="toolClick(item)"/>
              <span>{{trends==1?'关闭动态':'开启动态'}}</span>
            </div>
            <div
              v-for="(item, index) in toolNav"
              :key="index"
              :class="['tool_nav_' + item.type, 'tool_nav']"
              @click="toolClick(item.type)"
            >
              <img :src="item.img" alt=""/>
              <span>{{item.text}}</span>
              <div class="tool_nav_son" v-show="toolNavSelected == 'setUp' && item.type == toolNavSelected">
                <p @click.stop="beautifyDialog = true">美化</p>
                <p @click.stop="openOrCloseGift">{{ giftStatus ? "关闭礼物" : "开启礼物" }}</p>
                <p @click.stop="openOrCloseLike">{{ likeStatus ? "关闭互动" : "开启互动" }}</p>
                <p @click.stop="streamAddress">拉流地址</p>
              </div>
              <div class="tool_nav_son" v-show="toolNavSelected == 'superboard' && item.type == toolNavSelected">
                <p @click.stop="createSuperBoard(1)">超级白板</p>
                <p @click.stop="createSuperBoard(2)">文件白板</p>
              </div>
            </div>
          </div>
        </el-header>
        <el-main>
          <div class="live_content">
            <div class="live_menu" id="screenWidth">
              <div class="live_menu_header">
                <div class="live_theme">主题&nbsp;:&nbsp;{{ liveTheme }}</div>
                <div class="online_info">
                  <p>FPS：{{videoFPS}}</p>
                  <p>丢包率：{{videoPacketsLostRate}}</p>
                  <div class="online_info_status">
                    <p>网络状态：
                      <span :style="videoQualityStyle">{{videoQualityText}}</span>
                    </p>
                    <div>
                      <span :style="videoQualityNumStyle" v-for="i in videoQualityNum" :key="i"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="screenShare" v-if="superboardShow">
                <Superboard 
                  :userInfo="{
                    token,
                    roomId,
                    userId: userID,
                  }"
                  ref="superboardRef"
                  @initSuperboardSuccess="initSuperboardSuccess"
                />
                <div class="quit_board" @click="quitBoard">退出白板</div>
              </div>
             
              <video
                autoplay
                muted
                v-if="screenStream.active"
                id="videoEle"
                :src-object.prop="screenStream"
                class="push_video 1"
                :style="{width:'100%',height:'calc(100% - 60px)'}"
              >
              </video>
              <video
                autoplay
                v-else
                muted
                id="videoEle"
                :src-object.prop="stream"
                class="push_video"
                :style="{width:'100%',height:'calc(100% - 60px)'}"
              >
              </video>
              
              <div class="device_set">
                <div v-for="(item,index) in deviceNav" :key="index">
                    <img :src="item.status?item.activeImg:item.img" alt=""  @click="changeDevice(item)"/>
                </div>
              </div>
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
                    item.getReplyConnectLoading ? '连接中' : item.connectStatus ? '' : item.message.connectType == 2
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
                      replyConnect(2,item.message.type,item.message.connectType,item.userInfo.userId,item.userInfo.nickName)
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
              <div @click="openOrCloseConnect" :style="connectMessageInfo.length?'marginTop:22px;':'marginTop:100%;'" class="openConnect_btn">
                <img src="../../assets/img/open_connect_icon.png" alt="">
                <span>{{connectOpenStatus?'关闭连麦':'开启连麦'}}</span>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="设备检测"
      :visible.sync="deviceDialogVisible"
      top="50px"
      width="440px">
        <div class="dialog_content">
          <div class="device_step">
            <div>
              <img src="../../assets/img/check_camera_yes.png" alt="">
              <img v-if="cameraError" class="camera_error" src="../../assets/img/check_error.png" alt="">
              <span>摄像头检测</span>
            </div>
            <img class="step_line" src="../../assets/img/check_step_line.png" alt="">
            <div>
              <img v-if="checkStep>=2" src="../../assets/img/check_mike_active.png" alt="">
              <img v-else src="../../assets/img/check_mike.png" alt="">
              <img v-if="micError&&checkStep>=2" class="camera_error" src="../../assets/img/check_error.png" alt="">
              <span>麦克风检测</span>
            </div>
            <img class="step_line" src="../../assets/img/check_step_line.png" alt="">
            <div>
              <img v-if="checkStep===3" src="../../assets/img/check_over_active.png" alt="">
              <img v-else src="../../assets/img/check_over.png" alt="">
              <img v-if="checkStep===3&&cameraError || checkStep===3&&micError" class="camera_error" src="../../assets/img/check_error.png" alt="">
              <span>检测结果</span>
            </div>
          </div>
          <div class="check_camera" v-show="checkStep===1">
            <div class="camera_device">
              <span>摄像头</span>
              <el-select size="mini" v-model="cameraId" @change="selectCamera" placeholder="请选择摄像头">
                <el-option
                  v-for="item in camerasList"
                  :key="item.deviceID"
                  :label="item.deviceName"
                  :value="item.deviceID">
                </el-option>
              </el-select>
            </div>
            <div class="preview">
              <span>预览</span>
              <video
                autoplay
                muted
                class="check_camera_video"
                :src-object.prop="checkStream"
              ></video>
            </div>
            <div class="tip">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用摄像头<br/>
                  2.在系统“允许”使用摄像头<br/>
                  3.请确认摄像头已正确连接并开启<br/>
                  4.请确认摄像头没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
            <p class="question">您是否可以看到摄像头的画面</p>
          </div>
          <div class="check_mike" v-show="checkStep===2">
            <div class="mic_device">
              <span>麦克风</span>
               <el-select size="mini" v-model="microphoneId" @change="selectMic" placeholder="请选择麦克风">
                <el-option
                  v-for="item in microphonesList"
                  :key="item.deviceID"
                  :label="item.deviceName"
                  :value="item.deviceID">
                </el-option>
              </el-select>
            </div>
            <div class="soundWaves_num">
              <div class="under_div">
                <span v-for="i in 26" :key="i"></span>
              </div>
              <div class="top_div">
                <span v-for="k in soundWaves" :key="k"></span>
              </div>
            </div>
            <div class="soundWaves_line">
              <span>音量</span>
              <el-slider disabled v-model="soundWaves"></el-slider>
              <span>{{soundWaves}}</span>
            </div>
            <div class="tip">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用麦克风<br/>
                  2.在系统“允许”使用麦克风<br/>
                  3.请确认麦克风已正确连接并开启<br/>
                  4.请确认麦克风没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
            <p class="question">从1数到5，您是否可以看到音量条的波动？</p>
          </div>
          <div class="check_result" v-show="checkStep===3">
            <div class="device_result">
              <span>摄像头检测</span>
              <p v-if="!cameraError" class="success">
                正常
                <i class="el-icon-success"></i>
              </p>
              <p v-else class="error">
                异常
                <i class="el-icon-error"></i>
              </p>
            </div>
            <div class="tip" v-if="cameraError">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用摄像头<br/>
                  2.在系统“允许”使用摄像头<br/>
                  3.请确认摄像头已正确连接并开启<br/>
                  4.请确认摄像头没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
            <div class="device_result">
              <span>麦克风检测</span>
              <p v-if="!micError" class="success">
                正常
                <i class="el-icon-success"></i>
              </p>
              <p v-else class="error">
                异常
                <i class="el-icon-error"></i>
              </p>
            </div>
            <div class="tip" v-if="micError">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用麦克风<br/>
                  2.在系统“允许”使用麦克风<br/>
                  3.请确认麦克风已正确连接并开启<br/>
                  4.请确认麦克风没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="check_btn">
              <div @click="checkError">
                {{checkStep===3?'重新检测':checkStep===2?'无法听到':'无法看到'}}
              </div>
              <div @click="addStep">
                {{checkStep===3?'加入直播间':checkStep===2?'可以听到':'可以看到'}}
              </div>  
            </div>
        </div>
    </el-dialog>
    <el-dialog
      title="设备检测"
      :visible.sync="deviceDialogVisible_first"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      top="50px"
      width="440px">
        <div class="dialog_content">
          <div class="device_step">
            <div>
              <img src="../../assets/img/check_camera_yes.png" alt="">
              <img v-if="cameraError" class="camera_error" src="../../assets/img/check_error.png" alt="">
              <span>摄像头检测</span>
            </div>
            <img class="step_line" src="../../assets/img/check_step_line.png" alt="">
            <div>
              <img v-if="checkStep>=2" src="../../assets/img/check_mike_active.png" alt="">
              <img v-else src="../../assets/img/check_mike.png" alt="">
              <img v-if="micError&&checkStep>=2" class="camera_error" src="../../assets/img/check_error.png" alt="">
              <span>麦克风检测</span>
            </div>
            <img class="step_line" src="../../assets/img/check_step_line.png" alt="">
            <div>
              <img v-if="checkStep===3" src="../../assets/img/check_over_active.png" alt="">
              <img v-else src="../../assets/img/check_over.png" alt="">
              <img v-if="checkStep===3&&cameraError || checkStep===3&&micError" class="camera_error" src="../../assets/img/check_error.png" alt="">
              <span>检测结果</span>
            </div>
          </div>
          <div class="check_camera" v-show="checkStep===1">
            <div class="camera_device">
              <span>摄像头</span>
              <el-select size="mini" v-model="cameraId" @change="selectCamera" placeholder="请选择摄像头">
                <el-option
                  v-for="item in camerasList"
                  :key="item.deviceID"
                  :label="item.deviceName"
                  :value="item.deviceID">
                </el-option>
              </el-select>
            </div>
            <div class="preview">
              <span>预览</span>
              <video
                autoplay
                muted
                class="check_camera_video"
                :src-object.prop="checkStream"
              ></video>
            </div>
            <div class="tip">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用摄像头<br/>
                  2.在系统“允许”使用摄像头<br/>
                  3.请确认摄像头已正确连接并开启<br/>
                  4.请确认摄像头没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
            <p class="question">您是否可以看到摄像头的画面</p>
          </div>
          <div class="check_mike" v-show="checkStep===2">
            <div class="mic_device">
              <span>麦克风</span>
               <el-select size="mini" v-model="microphoneId" @change="selectMic" placeholder="请选择麦克风">
                <el-option
                  v-for="item in microphonesList"
                  :key="item.deviceID"
                  :label="item.deviceName"
                  :value="item.deviceID">
                </el-option>
              </el-select>
            </div>
            <div class="soundWaves_num">
              <div class="under_div">
                <span v-for="i in 26" :key="i"></span>
              </div>
              <div class="top_div">
                <span v-for="k in soundWaves" :key="k"></span>
              </div>
            </div>
            <div class="soundWaves_line">
              <span>音量</span>
              <el-slider disabled v-model="soundWaves"></el-slider>
              <span>{{soundWaves}}</span>
            </div>
            <div class="tip">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用麦克风<br/>
                  2.在系统“允许”使用麦克风<br/>
                  3.请确认麦克风已正确连接并开启<br/>
                  4.请确认麦克风没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
            <p class="question">从1数到5，您是否可以看到音量条的波动？</p>
          </div>
          <div class="check_result" v-show="checkStep===3">
            <div class="device_result">
              <span>摄像头检测</span>
              <p v-if="!cameraError" class="success">
                正常
                <i class="el-icon-success"></i>
              </p>
              <p v-else class="error">
                异常
                <i class="el-icon-error"></i>
              </p>
            </div>
            <div class="tip" v-if="cameraError">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用摄像头<br/>
                  2.在系统“允许”使用摄像头<br/>
                  3.请确认摄像头已正确连接并开启<br/>
                  4.请确认摄像头没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
            <div class="device_result">
              <span>麦克风检测</span>
              <p v-if="!micError" class="success">
                正常
                <i class="el-icon-success"></i>
              </p>
              <p v-else class="error">
                异常
                <i class="el-icon-error"></i>
              </p>
            </div>
            <div class="tip" v-if="micError">
              <span></span>
              <el-tooltip placement="top-end">
                <div slot="content">
                  1.在浏览器“允许”使用麦克风<br/>
                  2.在系统“允许”使用麦克风<br/>
                  3.请确认麦克风已正确连接并开启<br/>
                  4.请确认麦克风没有被其他软件占用多行信息<br/>
                </div>
                <div class="tip_title">
                  <img src="../../assets/img/check_question_icon.png" alt="">
                  <span>问题排查</span>
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="check_btn">
              <div @click="checkError">
                {{checkStep===3?'重新检测':checkStep===2?'无法听到':'无法看到'}}
              </div>
              <div @click="addStepFirst">
                {{checkStep===3?'加入直播间':checkStep===2?'可以听到':'可以看到'}}
              </div>  
            </div>
        </div>
    </el-dialog>
    <el-dialog
      :title="endLiveTitle"
      :visible.sync="endLiveDialogVisible"
      :close-on-click-modal="false"
      @close="confirmQuit"
      width="40%"
      center
    
    >   
        <div class="recoredInfo">
          <div class="recoredInfo-title">{{liveInfo.liveTheme}}</div>
          <div class="recoredInfo-time">{{liveInfo.subStarDate +' ~ ' + liveInfo.subEndDate}} 共<span style="color:#DF3623">{{liveInfo.liveTime || 0}}</span>分钟</div>
          <div class="recoredInfo-item">
            <div class="recoredInfo-item-box itemBox1">
              <span class="recoredInfo-item-num">{{liveInfo.audienceNum || 0}}</span>
              <span class="recoredInfo-item-text">观看人数</span>
            </div>
            <div class="recoredInfo-item-box itemBox2">
              <span class="recoredInfo-item-num">{{liveInfo.maxOnlineNum || 0}}</span>
              <span class="recoredInfo-item-text">最高在线人数</span>
            </div>
            <div class="recoredInfo-item-box itemBox3">
              <span class="recoredInfo-item-num">{{liveInfo.addFansNum || 0}}</span>
              <span class="recoredInfo-item-text">增加粉丝</span>
            </div>
            <div class="recoredInfo-item-box itemBox4">
              <span class="recoredInfo-item-num">{{liveInfo.addUserNum || 0}}</span>
              <span class="recoredInfo-item-text">新增用户</span>
            </div>
          </div>
          <div class="recoredInfo-item">
            <div class="recoredInfo-item-box itemBox5">
              <span class="recoredInfo-item-num">{{liveInfo.giveLikeNum || 0}}</span>
              <span class="recoredInfo-item-text">累计点赞</span>
            </div>
            <div class="recoredInfo-item-box itemBox6">
              <span class="recoredInfo-item-num">{{liveInfo.shareNum ||0}}</span>
              <span class="recoredInfo-item-text">累计分享</span>
            </div>
            <div class="recoredInfo-item-box itemBox7">
              <span class="recoredInfo-item-num">{{liveInfo.appointmentNum || 0}}</span>
              <span class="recoredInfo-item-text">预约人数</span>
            </div>
            <div class="recoredInfo-item-box itemBox8">
              <span class="recoredInfo-item-num">{{liveInfo.commerceSaleNum || 0}}</span>
              <span class="recoredInfo-item-text">带货数量</span>
            </div>
          </div>
          <el-divider style="margin:20px 0"></el-divider>

          <div class="recoredInfo-click" v-if="$hasPermission('sys:anchorManagement:record')">
            <img src="../../assets/img/record_info.png" alt="" style="margin-right:5px">
            <span>直播带货详情可在<span style="color:#DF3623;cursor:pointer;" @click="recordInfoBtn()">直播记录</span>中查看~</span>
          </div>

          <div class="recoredInfo-profit">
            <div class="recoredInfo-profit-title">直播业绩</div>
            <div class="recoredInfo-profit-item">
              <div class="recoredInfo-profit-box">
                <span class="profit-box-num">￥{{liveInfo.getReward&&liveInfo.getReward.toFixed(2) || 0}} <img v-if="liveInfo.getReward && liveInfo.getReward.toFixed(2)>0" src="../../assets/img/record_top.png" alt=""></span>
                <span class="profit-box-text">礼物业绩</span>
              </div>
              <div class="recoredInfo-profit-box">
                <span class="profit-box-num">￥{{liveInfo.unionIncome&&liveInfo.unionIncome.toFixed(2) || 0}} <img v-if="liveInfo.unionIncome && liveInfo.unionIncome.toFixed(2)>0" src="../../assets/img/record_top.png" alt=""></span>
                <span class="profit-box-text">粉丝团业绩</span>
              </div>
              <div class="recoredInfo-profit-box">
                <span class="profit-box-num">￥{{liveInfo.commerceSale&&liveInfo.commerceSale.toFixed(2) || 0}} <img v-if="liveInfo.commerceSale && liveInfo.commerceSale.toFixed(2)>0" src="../../assets/img/record_top.png" alt=""></span>
                <span class="profit-box-text">带货业绩</span>
              </div>
            </div>
          </div>
          <div class="recoredInfo-profit recoredInfo-profit-bottom">
            <div class="recoredInfo-profit-title">主播收益</div>
            <div class="recoredInfo-profit-item">
              <div class="recoredInfo-profit-box">
                <span class="profit-box-num">￥{{liveInfo.rewardMoney&&liveInfo.rewardMoney.toFixed(2) || 0}} <img v-if="liveInfo.rewardMoney && liveInfo.rewardMoney.toFixed(2)>0" src="../../assets/img/record_top.png" alt=""></span>
                <span class="profit-box-text">礼物收益</span>
              </div>
              <div class="recoredInfo-profit-box">
                <span class="profit-box-num">￥{{liveInfo.unionProfit&&liveInfo.unionProfit.toFixed(2) || 0}} <img v-if="liveInfo.unionProfit && liveInfo.unionProfit.toFixed(2)" src="../../assets/img/record_top.png" alt=""></span>
                <span class="profit-box-text">粉丝团收益</span>
              </div>
              <div class="recoredInfo-profit-box">
                <span class="profit-box-num">待结算</span>
                <span class="profit-box-text">带货收益</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- <el-descriptions title="直播" :column="2" >
          <el-descriptions-item label="直播主题">{{liveInfo.liveTheme}}</el-descriptions-item>
          <el-descriptions-item label="开播时间">{{liveInfo.startDate}}</el-descriptions-item>
          <el-descriptions-item label="下播时间">{{liveInfo.endDate}}</el-descriptions-item>
          <el-descriptions-item label="直播时长">{{liveInfo.liveTime || 0}}分钟</el-descriptions-item>
          <el-descriptions-item label="观看人数">{{liveInfo.audienceNum || 0}}</el-descriptions-item>
          <el-descriptions-item label="最高在线人数">{{liveInfo.maxOnlineNum || 0}}</el-descriptions-item>
          <el-descriptions-item label="累计点赞">{{liveInfo.giveLikeNum || 0}}</el-descriptions-item>
          <el-descriptions-item label="累计分享">{{liveInfo.shareNum ||0}}次</el-descriptions-item>
          <el-descriptions-item label="礼物收益">￥{{liveInfo.getReward&&liveInfo.getReward.toFixed(2) || 0}}</el-descriptions-item>
          <el-descriptions-item label="粉丝团收益">￥{{liveInfo.unionIncome&&liveInfo.unionIncome.toFixed(2) || 0}}</el-descriptions-item>
          <el-descriptions-item label="带货销售">￥{{liveInfo.commerceSale&&liveInfo.commerceSale.toFixed(2) || 0}}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="主播" :column="2">
          <el-descriptions-item label="新增用户">{{liveInfo.addUserNum || 0}}人</el-descriptions-item>
          <el-descriptions-item label="增加粉丝">{{liveInfo.addFansNum || 0}}人</el-descriptions-item>
          <el-descriptions-item label="礼物收入" v-if="!isMuteLive">￥{{liveInfo.rewardMoney&&liveInfo.rewardMoney.toFixed(2) || 0}}</el-descriptions-item>
          <el-descriptions-item label="礼物收入" v-else>不结算</el-descriptions-item>
          <el-descriptions-item label="带货收入">待结算</el-descriptions-item>
          <el-descriptions-item label="粉丝团收入">￥{{liveInfo.unionProfit&&liveInfo.unionProfit.toFixed(2) || 0}}</el-descriptions-item>
          <el-descriptions-item label="带货数量">{{liveInfo.commerceSaleNum || 0}}</el-descriptions-item>
          <el-descriptions-item label="直播预约人数">{{liveInfo.appointmentNum || 0}}</el-descriptions-item>
        </el-descriptions>
        <span slot="footer" class="dialog-footer">
          <span>直播带货详情可在<span style="color:#409EFF;cursor:pointer;" @click="recordInfoBtn()">直播记录</span>中查看~</span>
        </span> -->
          <!-- <el-button type="primary" size="small" @click="confirmQuit">确 定</el-button> -->
    </el-dialog>
    <el-dialog
      :title="livePactInfo.title || '直播功能使用协议'"
      :visible.sync="livePactDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      width="60%"
    >
      <div style="height: 50vh;overflow-y: auto;" v-html="livePactInfo.introduce"></div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" :type="btnDisabled?'info':'primary'" :disabled="btnDisabled" @click="confirmLivePact">{{btnText}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="liveActionInfo.title || '直播行为规范'"
      :visible.sync="liveActionDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      width="60%"
    >
      <div style="height: 50vh;overflow-y: auto;" v-html="liveActionInfo.introduce"></div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" :type="btnDisabled?'info':'primary'" :disabled="btnDisabled" @click="initLiveRoom">{{btnText}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="美颜设置"
      :visible.sync="beautifyDialog"
      top="50px"
      width="440px">
        <div class="dialog_content">
          <div class="beautify_set">
            <video
              autoplay
              muted
              :src-object.prop="stream"
              class="beautify_video"
              v-if="beautifyDialog"
            ></video>
            <div class="checkd_btn">
              <el-checkbox v-model="checked" @change="changeEffect">开启美颜</el-checkbox>
              <div class="checkd_reset" @click="resetEffect">
                <i class="el-icon-refresh-left"></i>
                <span>恢复</span>
              </div>
            </div>
            <div class="block">
              <span>美白</span>
              <el-slider @input="changeWhitenIntensity" v-model="beautifyParams.whitenIntensity" :show-tooltip="false"></el-slider>
              <span class="showTips">{{beautifyParams.whitenIntensity}}</span>
            </div>
            <div class="block">
              <span>磨皮</span>
              <el-slider @input="changeSmoothIntensity" v-model="beautifyParams.smoothIntensity" :show-tooltip="false"></el-slider>
              <span class="showTips">{{beautifyParams.smoothIntensity}}</span>
            </div>
            <div class="block">
              <span>锐化</span>
              <el-slider @input="changeSharpenIntensity" v-model="beautifyParams.sharpenIntensity" :show-tooltip="false"></el-slider>
              <span class="showTips">{{beautifyParams.sharpenIntensity}}</span>
            </div>
            <div class="block">
              <span>红润</span>
              <el-slider @input="changeRosyIntensity" v-model="beautifyParams.rosyIntensity" :show-tooltip="false"></el-slider>
              <span class="showTips">{{beautifyParams.rosyIntensity}}</span>
            </div>
          </div>
        </div>
    </el-dialog>
    <el-dialog
      title="拉流地址"
      :visible.sync="streamAddressDialog"
      top="200px"
      width="440px">
        <div class="dialog_content">
          <el-tooltip :content="streamUrl" placement="top">
            <div class="streamAddress_content">{{streamUrl}}</div>
          </el-tooltip>
          <div class="copy_btn" :data-clipboard-text="streamUrl" @click="copyFun">复制</div>
        </div>
    </el-dialog>
    <el-dialog
      title="商品"
      :visible.sync="goodsDialogVisible"
      top="50px"
      width="440px"
      >
        <div class="dialog_content" 
            v-loading="goodsListLoading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)">
          <div class="content_list" v-for="(item, index) in goodsList" :key="index">
            <div class="list_top">
              <span>{{index + 1}}</span>
              <p>{{item.productName}}</p>
            </div>
            <div class="list_bottom">
              <div class="info">
                <span>{{item.productType}}&nbsp;|</span>
                <p>&nbsp;本场带货销售:{{Number(item.liveSalesNum)}}&nbsp;&nbsp; 剩余库存:{{item.stock}}</p>
              </div>
              <div class="push_btn" @click="pushMethod('goods', item)">
                推送
              </div>
            </div>
          </div>
        </div>
    </el-dialog>
    <el-dialog
      title="直播预告"
      :visible.sync="livePreviewDialogVisible"
      top="50px"
      width="440px">
        <div class="dialog_content">
          <div class="content_list_preview" v-for="(item, index) in livePreviewList" :key="index">
            <div class="list_top">
              <img :src="item.frontCoverUrl" alt="">
              <p>{{item.liveTheme}}</p>
            </div>
            <div class="list_bottom">
              <div class="info">
                <span>开播时间：{{item.startDate}}</span>
                <p>预计时长：{{item.estimateLiveTime}}分钟</p>
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
      width="440px">
        <div class="dialog_content">
          <div class="content_list_recommend" v-for="(item, index) in recommendList" :key="index">
            <div class="list_left"> 
              <span>{{index+1}}</span>
              <div class="userInfo">
                <img :src="item.avatarUrl" alt="">
                <span>{{item.username}}</span>
              </div>
            </div>
            <div class="list_right">{{item.fansNum}}&nbsp;粉丝</div>
          </div>
        </div>
    </el-dialog>
    <el-dialog
      title="销售记录"
      :visible.sync="commodityDialogVisible"
      top="50px"
      class="commodityClss"
      width="1200px">
        <el-table max-height="500" v-loading="dataListLoading" element-loading-text="列表数据加载中" :data="commodityList" style="width: 100%" ref="filterTable">
          <el-table-column width="160" prop="userName" align="center" label="购买人" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" prop="productType" align="center" label="商品类型" show-overflow-tooltip></el-table-column>
          <el-table-column width="220" prop="productName" align="center" label="购买内容" show-overflow-tooltip></el-table-column>
          <el-table-column width="120" prop="price" align="center" label="应付金额" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>￥{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" prop="payPrice" align="center" label="实付金额" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span v-if="scope.row.payStatus && scope.row.payStatus == 2">-</span>
                  <span v-else>￥{{scope.row.payPrice}}</span>
              </template>
          </el-table-column>
          <el-table-column width="120" prop="realPrice" align="center" label="实收金额" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span v-if="scope.row.payStatus && scope.row.payStatus == 2">-</span>
                  <span v-else>￥{{scope.row.realPrice}}</span>
              </template>
          </el-table-column>
          <el-table-column 
              width="120"
              align="center" 
              label="支付状态" 
              column-key="payStatus"
              show-overflow-tooltip
          >
              <template slot-scope="scope">
                  <span style="color:#FF7F00" v-if="scope.row.payStatus == 2">待支付</span>
                  <span v-if="scope.row.payStatus == 1 && scope.row.useStatus==0 && scope.row.activeStatus==0 && (scope.row.refundStatus==0 || scope.row.refundStatus==-1)">已支付</span>
                  <span style="color:#00C106" v-if="scope.row.payStatus == 1 && (scope.row.useStatus!=0 || scope.row.activeStatus!=0) && (scope.row.refundStatus==0 || scope.row.refundStatus==-1)">已完成</span>
                  <span style="color:#FF0000" v-if="scope.row.payStatus == 1 && scope.row.refundStatus==2">退款中</span>
                  <span v-if="scope.row.payStatus == 1 && scope.row.refundStatus==1">已退款</span>
              </template>
          </el-table-column>
          <el-table-column width="180" prop="payDate" align="center" label="支付完成时间" show-overflow-tooltip></el-table-column>
          <el-table-column width="180" prop="createDate" align="center" label="下单时间" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
            background
            :current-page="commodityPage"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="commodityLimit"
            :total="commodityTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
          >
        </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import debounce from "lodash/debounce"
import Clipboard from 'clipboard'
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import TIM from "tim-js-sdk";
import Superboard from "./superboard/index.vue"; //超级白板
import { numberChange } from "@/utils";

export default {
  components: {
    Superboard,
  },
  data() {
    return {
      livePactDialogVisible:false,//直播协议弹窗
      liveActionDialogVisible:false,//直播行为规范弹窗
      goodsDialogVisible:false,//商品弹窗
      livePreviewDialogVisible:false,//直播预告弹窗
      recommendedAnchorDialogVisible:false,//推荐主播弹窗
      commodityDialogVisible:false,//销售记录弹窗
      dataListLoading:false,//销售记录列表加载
      beautifyDialog:false,//美化弹窗
      streamAddressDialog:false,//拉流地址弹窗
      livePactInfo: {}, //直播协议内容
      liveActionInfo: {}, //直播行为规范内容
      btnDisabled:true,
      btnText:'已确认知晓（5s）',
      videoFPS:0,//推流帧率
      videoPacketsLostRate:0,//推流丢包率
      videoQuality:0,//推流质量 -1 表示未知，0 表示 极好,1 表示好，2 表示中等，3 表示 差，4 表示极差
      activeName: "first",
      userName: "",
      userID: "",
      appID: null,
      server: "",
      SDKAppID: null,
      zg: {},
      tim: null, //IM实例
      token: "",
      checkStream:{},//选择设备时摄像头的流
      stream: {},//摄像头流
      screenStream:{},//屏幕共享流
      roomId: "",
      streamID: "",
      groupID: "", //群聊ID
      conversation: null, //直播插件
      connectMessageInfo: [], //申请连麦信息
      barrageData: [], // 弹幕内容
      liveRoomUserinfo: {}, //用户在线信息
      goodsList: [], //获取主播推荐商品
      goodsListLoading: false, //推荐商品刷新loading
      livePreviewList: [], //直播预告列表
      recommendList: [], //主播推荐主播列表
      commodityList: [], //销售列表
      //销售记录分页
      commodityTotal:0,
      commodityPage:1,
      commodityLimit:5,

      barrage: "",
      questionMessageInfo: [], //提问消息
      studentList: [],//在线用户列表
      searchUser:"",
      userInfo: {}, //用户信息
      deviceNav:[
        {
          img: require("@/assets/img/nomike.png"),
          activeImg: require("@/assets/img/mike.png"),
          text: "麦克风",
          type: "mike",
          status: true,
        },
        {
          img: require("@/assets/img/nocamera.png"),
          activeImg: require("@/assets/img/camera.png"),
          text: "摄像头",
          type: "camera",
          status: true,
        },
      ],
      toolNavSelected: "", //选中的工具选项
      toolNav: [
        
        {
          img: require("@/assets/img/device_icon.png"),
          text: "切换设备",
          type: "device",
        },
        {
          img: require("@/assets/img/desktopShare_icon.png"),
          text: "桌面共享",
          type: "desktopShare",
        },
        // {
        //   img: require("@/assets/img/superboard_icon.png"),
        //   text: "白板",
        //   type: "superboard",
        // },
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
        {
          img: require("@/assets/img/commodity_icon.png"),
          text: "销售记录",
          type: "commodity",
        },
      ],
      headerNavActive: "desktopShare", //顶部导航选中,
      superboardShow:false,//超级白板
      liveStatus: false, //直播状态
      liveTheme: "", //直播主题
      beautifyParams:{ //美颜参数
        smoothIntensity:50,
        whitenIntensity:50,
        rosyIntensity:50,
        sharpenIntensity:50
      },
      videoWith:'',
      videoHeight:'',
      camerasList:[],//摄像头列表
      microphonesList:[],//麦克风列表
      deviceDialogVisible:false,//切换设备弹窗
      deviceDialogVisible_first:false,//首次进入页面选择设备
      cameraId:'',//摄像头设备
      microphoneId:'',//麦克风设备
      fileList:[],
      params:{
        limit:10,
        page:1
      },
      total:0,
      trends: 1,//直播动态开启或关闭 1：开启 0：关闭
      endLiveDialogVisible:false,//结束直播详情弹窗
      // endLiveTitle:'直播结束',
      endLiveTitle:'',
      isRecord:false,//录制状态
      pauseRecord:false,//录制暂停状态
      streamUrl:'',
      checkStep:1,
      cameraError:false,
      micError:false,
      soundWaves:0,//音浪大小
      checked:false,//是否开启美颜
      cameraStatus:true,
      microphoneStatus:true,
      liveInfo:{},//结束直播详情
      isMuteLive:false,
      livePlayerList:[],//流列表
      connectTimer:{},//超时定时器
      connectStatusTimer: null, //连麦之后定时监听连麦用户连接状态
      isOpenDesktopSharing:false,//是否开启屏幕共享
      superBoardType: null, //白板类型：1-普通白板，2-文件白板
      giftStatus:1, //是否关闭送礼物 1:开启 0:关闭
      likeStatus:1, //是否开启互动
      connectOpenStatus:1,//是否开启连麦
      isPush:false,//是否推流
    };
  },
  created() {
   
  },
  computed: {
    videoQualityNum(){
      switch(this.videoQuality){
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
    videoQualityText(){
      switch(this.videoQuality){
        case 0:
        return '极好';
        case 1:
        return '好';
        case 2:
        return '中等';
        case 3:
        return '差';
        case 4:
        return '极差';
      }
    },
    videoQualityStyle(){
      let style = ''
      switch(this.videoQuality){
        case 0:
        return style+='color:#00FF31;';
        case 1:
        return style+='color:#00FF31;';
        case 2:
        return style+='color:#FF8924;';
        case 3:
        return style+='color:#FE0013;';
        case 4:
        return style+='color:#FE0013;';
      }
    },
    videoQualityNumStyle(){
      let style = ''
      switch(this.videoQuality){
        case 0:
        return style+='backgroudColor:#00FF31;';
        case 1:
        return style+='backgroudColor:#00FF31;';
        case 2:
        return style+='backgroudColor:#FF8924;';
        case 3:
        return style+='backgroudColor:#FE0013;';
        case 4:
        return style+='backgroudColor:#FE0013;';
      }
    }
  },
  async mounted() {
    window.addEventListener('beforeunload',this.beforeunloadHandler)
    document.addEventListener("click",(e)=>{
      if(e.target.className && (e.target.className.indexOf('tool_nav_setUp') == -1 || e.target.className.indexOf('tool_nav_superboard') == -1)){
        this.toolNavSelected = ""
      }
    })
    this.liveTheme = this.$route.query.liveTheme;
    if(this.$route.query.trendsOpente != undefined) this.trends = this.$route.query.trendsOpente
    this.appID = parseInt(window.SITE_CONFIG['appID'])
    // 初始化实例  Step1
    this.zg = new ZegoExpressEngine(
      parseInt(window.SITE_CONFIG['appID']),
      window.SITE_CONFIG['server']
    );
    this.zg.setLogConfig({ logLevel: 'disable' })
    //检测设备能力
    let checkSystemRes = await this.zg.checkSystemRequirements()
    console.log("checkSystemRes", checkSystemRes)
    if(!checkSystemRes.camera){
      this.cameraStatus = checkSystemRes.camera
      this.$confirm("请先打开摄像头权限后刷新重试", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      }).catch(()=>{
      })
      return
    }
    if(!checkSystemRes.microphone){
      this.microphoneStatus = checkSystemRes.microphone
      this.$confirm("请先打开麦克风权限后刷新重试", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      }).catch(()=>{
      })
      return
    }

    window.addEventListener('online', this.updateOnline);
    window.addEventListener('offline', this.updateOnline);
    // this.init()

    //获取摄像头列表
    this.zg.getCameras().then(res=>{
      this.camerasList = res
    })
   
    //获取麦克风列表
    this.zg.getMicrophones().then(res=>{
      this.microphonesList = res
    })
    //开启麦克风音浪检测
    this.zg.setSoundLevelDelegate(true,1000)
    
    this.deviceDialogVisible_first = true
    
    //屏幕共享中断
    this.zg.on("screenSharingEnded",(stream)=>{
      if(!stream.active){
        this.$http.post('/sys/mixedflow/closeDesktopSharing',{RoomId:this.roomId}).then(res=>{
          if(res.data.code==0){
            this.$message({
              message:'屏幕共享已关闭',
              type:'success'
            })
            this.zg.stopPublishingStream('shareDesk'+this.roomId)
            this.zg.destroyStream(this.screenStream);
            this.isOpenDesktopSharing = false
            localStorage.setItem('isOpenDesktopSharing',false)
          }
        })
      }
    })
    
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
      this.streamID = streamID;
      this.videoFPS = stats.video.videoFPS.toFixed(2); //视频FPS
      this.videoPacketsLostRate = stats.video.videoPacketsLostRate.toFixed(2); //视频丢包率
      this.videoQuality = stats.video.videoQuality;//视频推流质量
    });

    //获取流地址
    this.zg.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
      if (updateType == "ADD") {
        // 流新增，开始拉流
        console.log("流新增------------", streamList);
        streamList.forEach((streamItem) => {
          this.livePlayerList.push(streamItem)
          this.connectMessageInfo.forEach(async (item) => {
            if (item.userInfo.userId === streamItem.user.userID) {
              item.stream = await this.zg.startPlayingStream(
                streamItem.streamID
              );
              item.getReplyConnectLoading = false
            }
          });

          // 连麦列表排序
          this.connectMessageInfo = this.connectMessageInfo.sort((a, b) => b.connectStatus - a.connectStatus)

          if (this.roomId != streamItem.streamID) {
            let extraInfo = streamItem.extraInfo;
            let extraInfoObj = null;
            try {
              extraInfoObj = JSON.parse(extraInfo);
            } catch (e) {}
            this.$http.post("/sys/mixedflow/startEvenWheat", {
              UserId: streamItem.user.userID, //用户ID；
              RoomId: this.roomId, //房间ID；
              joinRoomId: streamItem.streamID,
              joinType:
              extraInfoObj && extraInfoObj.connectType == 1
              ? "voice"
              : "watch",
            }).then((res) => {
                console.log(res);
              }).catch((err) => {
                //混流失败挂断用户
                let messageInfo = {
                  type: 5, //消息类型(1:普通信息、2:关注信息、3:提问信息、4:礼物信息、5:语音连麦信息：{1、同意，2、拒绝}、6:视频连麦信息：{1、同意，2、拒绝}、)
                  connectType: extraInfoObj.connectType,
                  replyUserId: streamItem.user.userID,
                  replyType: -3, // 连麦后挂断
                  isHigh:true,
                };
                this.sendMessage(messageInfo);
              });
          }
        });
      } else if (updateType == "DELETE") {
        // 流删除，停止拉流
        console.log("流减少------------", streamList);
        streamList.forEach((streamItem) => {
          let index = this.livePlayerList.findIndex(item => item.streamID === streamItem.streamID)
					if(index>-1){
						this.livePlayerList.splice(index, 1)
          }
          let arr = JSON.stringify(this.connectMessageInfo)
          arr = JSON.parse(arr)
          arr.forEach(item => {
            if (item.userInfo.userId === streamItem.user.userID) {
             let ind = this.connectMessageInfo.findIndex(item => item.userInfo.userId === streamItem.user.userID)
              if(ind>-1){
                this.connectMessageInfo.splice(ind, 1)
              }
            }
          });
          this.$http.post("/sys/mixedflow/finishEvenWheat", {
              UserId: streamItem.user.userID, //用户ID；
              RoomId: this.roomId, //房间ID；
              joinRoomId: streamItem.streamID,
            }).then((res) => {
              console.log(res);
            }).catch((err) => {});
        });
      }
    });
    //监听本地预览流麦克风音浪大小
    this.zg.on('capturedSoundLevelUpdate',(res)=>{
      this.soundWaves = Math.round(res)
    })
  },  
  watch:{
    livePlayerList(n) {
      // 拉流变化定时监听连麦用户实时状态
				if(n.length > 0) {
					this.onGetConnectStatus()
				}
				if(n.length == 0) {
					this.offGetConnectStatus()
				}
    },
    //   let deleteArr = []
    //   this.connectMessageInfo.forEach((item,index)=>{
    //     var arr = this.livePlayerList.filter(info=>info.streamID.includes(item.userInfo.userId) && item.connectStatus && item.getReplyConnectLoading != null)
    //     if(!arr.length && item.getReplyConnectLoading != null){
    //       deleteArr.push(index)
    //     }
    //     console.error("arr", arr)
    //   })
    //   deleteArr.map(item => this.connectMessageInfo.splice(item, 1))
    //   console.error("connectMessageInfo", this.connectMessageInfo)
  },
  methods: {
    // 过万转换
    numberChange(num) {
      return numberChange(num)
    },
    recordInfoBtn(){
      let TaskId={
          id:this.$route.query.TaskId
      }
      let routeUrl = this.$router.resolve({
          path: 'anchorManagement-record-recordInfo',
          query: TaskId
      });
      window.open(
          routeUrl.href , "_blank"
      );
  },
    beforeunloadHandler(e) { //关闭页面提示
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },
    // 开启或关闭礼物
    openOrCloseGift(){
      this.$http.post('/sys/mixedflow/openOrClose',{type:0,openOrClose:this.giftStatus?0:1}).then(res=>{
        if(!res.code==0) return this.$message.error(res.msg)
        this.giftStatus = this.giftStatus?0:1
        if(this.liveStatus){
          if(this.giftStatus){
            this.sendMessage({ type: 9, isGift: true, isHigh:true, }); //开启送礼物
          }else{
            this.sendMessage({ type: 9, isGift: false, isHigh:true, }); //关闭送礼物
          }
        }
        this.$message.success( this.giftStatus ? "您已开启礼物" : "您已关闭礼物" );
      }).catch(err=>{
        console.error(err)
      })
    },
    // 开启或关闭互动
    openOrCloseLike(){
      this.$http.post('/sys/mixedflow/openOrClose',{type:2,openOrClose:this.likeStatus?0:1}).then(res=>{
        if(!res.code==0) return this.$message.error(res.msg)
        this.likeStatus = this.likeStatus?0:1
        if(this.liveStatus){
          if(this.likeStatus){
            this.sendMessage({ type: 12, isLike: true, isHigh:true, }); //开启互动
          }else{
            this.sendMessage({ type: 12, isLike: false, isHigh:true, }); //关闭互动
          }
        }
        this.$message.success( this.likeStatus ? "您已开启互动" : "您已关闭互动" );
      }).catch(err=>{
        console.error(err)
      })
    },
    // 拉流地址
    streamAddress(){
      if(this.liveStatus){
        this.streamAddressDialog = true
      }else{
        this.$message.warning("直播暂未开启，请先开启直播")
      }
    },
    copyFun(){
      var clipboard = new Clipboard('.copy_btn')
      clipboard.on('success', e => {
        this.streamAddressDialog = false
        this.$message.success("复制成功")
        clipboard.destroy()// 释放内存
      })
      clipboard.on('error', e => {
        this.$message.warning('该浏览器不支持自动复制')
        clipboard.destroy()// 释放内存
      })
    },
    async init(){
      try {
        let res = await this.$http.get('/sys/mixedflow/getLiving')
        if(!res.data.code==0) return this.$message.error(res.data.msg)
        if(res.data.data.liveId){
          this.$confirm("上次直播异常退出，重新进入", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "info"
          }).then(() => {
            this.liveStatus = true
            this.isRecord = res.data.data.startRecord==1
            this.pauseRecord = res.data.data.pauseRecord==1
            this.connectOpenStatus = Number(res.data.data.openEvenWheat)
            this.giftStatus = Number(res.data.data.openLiveReward)
            this.likeStatus = Number(res.data.data.openGiveLike)
            this.deviceNav[0].status = Number(res.data.data.openLoudspeakerMute) ? false : true
            this.isOpenDesktopSharing = JSON.parse(localStorage.getItem('isOpenDesktopSharing'))
            this.getTimUserSig()
          }).catch(()=>{
            window.close()
          })
        }else {
          let res_pro = await this.$http.get('/sys/mixedflow/isFirstOpenLive')
          if(res_pro.data.code != 0) return this.$message.error(res_pro.data.msg)
          if(res_pro.data.data) { // 第一次
            this.$http.get("/sys/sysConsultativeManagement/getKey/use_live_agreement").then(({data: res}) => {
              this.liveStatus = false
              this.livePactDialogVisible = true //未开播进入直播间阅读协议
              this.doLoop(5)
              if(res.code != 0) return this.$message.error(res.msg)
              this.livePactInfo = res.data
            }).catch(err => {
              this.liveStatus = false
              this.livePactDialogVisible = true //未开播进入直播间阅读协议
              this.doLoop(5)
              this.$message.error(JSON.stringify(err.message))
            })
          }else {
            this.initLiveRoom()
          }
        }
      } catch (error) {
        console.error(error)
        this.$message.error(JSON.stringify(error))
      }
    },
    updateOnline() {//网络状态
      if(!navigator.onLine){
        // return this.$message.error('当前无网络连接，请检查网络')
        return this.$confirm("当前无网络连接，请检查网络", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "error"
        }).then(() => {

        }).catch(()=>{})
      }else{
        this.init()
      }
    },
    // 协议确认倒计时
    doLoop: function (seconds) {
      seconds = seconds ? seconds : 5;
      this.btnText = `已确认知晓（${seconds}s）`;
      let countdown = setInterval(() => {
        if (seconds > 0) {
          this.btnText = `已确认知晓（${seconds}s）`;
          --seconds;
        } else {
          this.btnText = this.livePactDialogVisible?"已确认知晓":'已确认知晓，去直播';
          this.btnDisabled = false;
          clearInterval(countdown);
        }
      }, 1000);
    },
    confirmLivePact(){//确认知晓直播协议
      this.$http.get("/sys/sysConsultativeManagement/getKey/code_of_conduct_live_agreement").then(({data: res}) => {
        this.livePactDialogVisible = false
        this.liveActionDialogVisible = true
        this.btnDisabled = true
        this.doLoop(5)
        if(res.code != 0) return this.$message.error(res.msg)
        this.liveActionInfo = res.data
      }).catch(err => {
        this.livePactDialogVisible = false
        this.liveActionDialogVisible = true
        this.btnDisabled = true
        this.doLoop(5)
        this.$message.error(JSON.stringify(err.message))
      })
    },
    initLiveRoom(){ //初始化直播间
      if(this.liveActionDialogVisible) this.liveActionDialogVisible = false
      this.getTimUserSig();
    },
    load () {//在线用户列表加载
      this.params.page++
      if(this.activeName==='third'){
        if(this.studentList.length>=this.total){
          return
        }else{
          this.getOnlineUsers()
        }
      }
    },
    async shareDesk(){
      if(this.isOpenDesktopSharing){
        return this.$message.warning('请先关闭当前屏幕共享')
      }
      const custom = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: { sampleSize: 96, echoCancellation: false, channelCount: 2 } });
      this.screenStream = await this.zg.createStream({custom: {source: custom}});
      this.screenStream.getVideoTracks()[0].onended = ()=> {
        this.$http.post('/sys/mixedflow/closeDesktopSharing',{RoomId:this.roomId}).then(res=>{
          if(res.data.code==0){
            this.$message({
              message:'屏幕共享已关闭',
              type:'success'
            })
            this.zg.stopPublishingStream('shareDesk'+this.roomId)
            this.zg.destroyStream(this.screenStream);
            this.isOpenDesktopSharing = false
            localStorage.setItem('isOpenDesktopSharing',false)
          }
        })
      }
      // this.screenStream = await this.zg.createStream({ //屏幕共享流
      //   screen: {
      //     videoQuality: 4,
      //     width:1280,
      //     height:720,
      //     frameRate: 20,
      //     bitrate: 2250,
      //     audio: true
      //   },
      // });
      let res = await this.zg.startPublishingStream('shareDesk'+this.roomId, this.screenStream); //共享桌面流
      if(res){
        this.$http.post('/sys/mixedflow/openDesktopSharing',{RoomId:this.roomId,StreamId:'shareDesk'+this.roomId}).then(res=>{
          console.log(res)
          if(res.data.code!= 0) return this.$message.error(res.data.msg)
          this.isOpenDesktopSharing = true
          localStorage.setItem('isOpenDesktopSharing',JSON.stringify(true))
          this.$message({
            message:'共享开启成功',
            type:'success'
          })
        })
      }
    },
    selectCamera(value){ //选择摄像头
      this.cameraId = value
      this.checkCamera()
    },
    async selectMic(value){//选择麦克风
      this.microphoneId = value
    },
    changeTrends(){
      this.trends==1?this.trends=0:this.trends=1
    },
    quitBoard(){
      this.superboardShow = false
      document.querySelector('#videoEle').style.width = '100%'
      document.querySelector('#videoEle').style.height = 'calc(100% - 60px)'
    },
    changeDevice: debounce(async function(data){
      if (data.type === "mike") {
        //麦克风
        let result = await this.zg.muteMicrophone(data.status);
        if (result) {
          let res = await this.$http.post('/sys/mixedflow/openOrClose', { type: 3, openOrClose: this.deviceNav[0].status ? 1 : 0 })
          if(!res.code == 0) return this.$message.error(res.msg)
          let isMicrophoneMuted = await this.zg.isMicrophoneMuted();
          this.deviceNav[0].status = !isMicrophoneMuted; //麦克风状态
          this.$message.success(this.deviceNav[0].status ? '您已解除静音':'您已静音')
        }
      } else if (data.type === "camera") {
        //摄像头
        // let result = await this.zg.enableVideoCaptureDevice(
        //   this.stream,
        //   !data.status
        // );

        let result = await this.zg.mutePublishStreamVideo(this.stream,this.deviceNav[1].status,!this.deviceNav[1].status)
        console.log(result,'摄像头')
        if (result) {
          this.deviceNav[1].status = !data.status;
        }
      }
    }, 1000, { 'leading': true, 'trailing': false }),
    async toolClick(type) {
      let needOpenLiveArr = ["desktopShare"]
      if(needOpenLiveArr.includes(type) && !this.liveStatus) {
        return this.$message.warning("直播暂未开启，请先开启直播")
      }
      this.toolNavSelected = type
      switch(type){
        case "goods":
          this.getAnchorProduct().then(res=>{
            if(!res.length) return this.$message.info('暂无商品')
            this.goodsDialogVisible = true
          })
          break
        case "livePreview":
          this.params.page=1
          this.goodsList = []
          this.getLivePreviewList().then(res=>{
            if(!res.length) return this.$message.info('暂无预告')
            this.livePreviewDialogVisible = true
          })
          break
        case "recommendedAnchor":
          this.params.page=1
          this.goodsList = []
          this.getRecommendList().then(res=>{
            if(!res.length) return this.$message.info('暂无推荐主播')
            this.recommendedAnchorDialogVisible = true
          })
          break
        case "commodity":
          this.params.page=1
          this.commodityPage=1
          this.commodityLimit=5
          this.commodityList = []
          this.getCommodityList().then(res=>{
            if(!res.length) return this.$message.info('暂无销售记录')
            this.commodityDialogVisible = true
          })
          break
        case "setUp":
          break
        case "device":
          this.deviceDialogVisible = true
          break
        case "desktopShare":
          this.shareDesk()
          break
        case "superboard":
          break

      }
    },
    //创建白板： 1-普通白板，2-文件白板
    createSuperBoard(type) {
      this.superBoardType = type
      this.toolNavSelected = "" 
      if(type == 1) { //普通白板直接创建
        if(this.superboardShow) { //已打开白板-创建新的普通白板
          if(this.$refs.superboardRef) this.$refs.superboardRef.createWhiteboardView()
        }else { //未打开白板-打开白板-创建新的普通白板
          this.superboardShow = true
          document.querySelector('#videoEle').style.width = '350px'
          document.querySelector('#videoEle').style.height = '196px'
        }
      }else { //文件白板选择文件
        if(this.superboardShow) { //已打开白板-创建新的文件白板
          if(this.$refs.superboardRef) this.$refs.superboardRef.confirmSelectFileSuperBoard()
        }else { //未打开白板-打开白板-创建新的文件白板
          this.superboardShow = true
          document.querySelector('#videoEle').style.width = '350px'
          document.querySelector('#videoEle').style.height = '196px'
        }
      }
    },
    // 白板初始化成功-创建白板
    initSuperboardSuccess() {
      try {
        if(this.superBoardType == 1) { //创建普通白板
          if(this.$refs.superboardRef) this.$refs.superboardRef.createWhiteboardView()
        }
  
        if(this.superBoardType == 2) { //创建文件白板
          if(this.$refs.superboardRef) this.$refs.superboardRef.confirmSelectFileSuperBoard()
        }
        this.superBoardType = null
      }catch(err) {
        console.warn(err)
        this.superBoardType = null
      }
    },
    recordMethod(){
      //录制
      if (this.liveStatus) {
        if(!this.isRecord&&!this.pauseRecord){
          this.$http.post("/sys/mixedflow/startRecord", {}).then(res=>{
            if(res.data.code===0){
              this.isRecord = true //开启录制状态
              this.$message({
                message: "录制已开启",
                type: "success",
              });
              this.sendMessage({type:14,isRecord:true,isHigh:true})
            }else{
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          })
        }else if(this.isRecord&&!this.pauseRecord){ //暂停录制
          this.$http.post("/sys/mixedflow/pauseRecord", {}).then(res=>{
            if(res.data.code===0){
              this.pauseRecord = true //暂停录制状态
              this.$message({
                message: "录制已暂停",
                type: "success",
              });
              this.sendMessage({type:14,pauseRecord:true,isHigh:true})
            }else{
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          })
        }else if(this.isRecord&&this.pauseRecord){ //恢复录制
          this.$http.post("/sys/mixedflow/resumeRecord", {}).then(res=>{
            if(res.data.code===0){
              this.pauseRecord = false //恢复录制状态
              this.$message({
                message: "已重新开启录制",
                type: "success",
              });
              this.sendMessage({type:14,pauseRecord:false,isHigh:true})
            }else{
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          })
        }

      } else {
        this.$message({
          message: "直播暂未开启",
          type: "warning",
        });
      }
    },
    headerNavClick(type) {
      if (type != "beautify") {
        this.headerNavActive = type;
        if(type == "superboard"){
          document.querySelector('#videoEle').style.width = '350px'
          document.querySelector('#videoEle').style.height = '196px'
        }else{
          document.querySelector('#videoEle').style.width = '100%'
          document.querySelector('#videoEle').style.height = 'calc(100% - 60px)'
        }
      }
    },
    handleClick: debounce(function(tab, event) {
      this.params.page=1
      switch(this.activeName){
        case 'second':
          this.questionMessageInfo = []
          this.getliveQuestionList()
        case 'third' :
          this.studentList = []
          this.getOnlineUsers()
          break
        default:
          break
      }
    }, 1000, { 'leading': true, 'trailing': false }),
    muteMthod(data) {
      //禁言
      this.studentList.forEach((item) => {
        if (item.userId === data.userId) {
          if (!item.isTalk) {
            this.sendMessage({
              type: 20,
              replyUserId: data.userId,
              isTalk: true,
              isHigh:true,
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
              isHigh:true,
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
          this.sendMessage({ type: 20, allMute: true,isHigh:true }); //全员禁言
          this.getMuteStatus({ isAll: 1, isTalk: 1 }).then((res) => {
            this.studentList.forEach((item) => (item.isTalk = 1));
          });

          break;
        case 2:
          this.sendMessage({ type: 20, allMute: false,isHigh:true }); //全员解禁
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
    async checkCamera(){
      // 创建流和渲染
      this.checkStream = await this.zg.createStream({ //摄像头
        camera: {
          videoQuality: 4,
          width:1280,
          height:720,
          frameRate: 20,
          bitrate: 2250,
          videoInput:this.cameraId,
        },
      });
    },
    checkError(){
      if(this.checkStep<3){
        if(this.checkStep===1){
          this.cameraError = true
        }else if(this.checkStep===2){
          this.micError = true
        }
        this.checkStep++
      }else{
        this.checkStep=1
        this.cameraError = false
        this.micError = false
      }
    },
    async addStepFirst(){
      if(this.checkStep<3){
        this.checkStep++
      }else{
        if(!this.cameraError&&!this.micError){
          this.deviceDialogVisible_first = false
          this.checkStep = 1
          this.init()
        }else{
          this.$message.warning('所选设备存在异常请重新检测')
        }
      }
    },
    async addStep(){
      if(this.checkStep<3){
        this.checkStep++
      }else{
        if(!this.cameraError&&!this.micError){
          let res = await this.zg.useVideoDevice(this.stream,this.cameraId) //切换摄像头
          let resTwo = await this.zg.useAudioDevice(this.stream,this.microphoneId) //切换麦克风
          if(res&&resTwo){
            this.deviceDialogVisible = false
            this.checkStep = 1
            this.$message.success('设备切换成功')
          }
        }else{
          this.$message.warning('所选设备存在异常请重新检测')
        }
      }
    },
    // 获取token的方法
    getTokenFun(userID) {
      let apiUrl = window.SITE_CONFIG['apiURL']
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
        if (!this.liveStatus) {
          this.$loading({
            background: "rgba(0,0,0,.5)",
            text: "直播预览开启中...",
          });
        }
        let res = await this.getTokenFun(this.userID);
        if(res) {
          res = JSON.parse(res)
        }
        if(res && res.code == 0 && res.data && res.data.token) {
          this.token = res.data.token
          this.loginRoom();
        }else {
          this.$message.error("登录即构失败")
          this.$loading().close()
        }
      }catch(err) {
        this.$message.error("登录即构失败")
        this.$loading().close()
      }
    },
    // 登陆房间
    async loginRoom() {
      const result = await this.zg.loginRoom(this.roomId, this.token, {
        userID: this.userID,
        userName: this.userName,
      });
      let isMicrophoneMuted = await this.zg.isMicrophoneMuted();
      this.toolNav[1].status = !isMicrophoneMuted; //麦克风状态
      this.createStr();
    },
    // 创建流和渲染
    async createStr() {
      try{
        this.stream = await this.zg.createStream({ //摄像头
          camera: {
            videoQuality: 4,
            width:1280,
            height:720,
            frameRate: 20,
            bitrate: 2250,
            videoInput:this.cameraId,
          },
          // custom: {
          //   source:document.getElementById('video_custom'),
          //   bitrate: 2000,
          // },
        });
      }catch(error){
        console.error(error,3333333333)
      }
      //设置关闭视频流时静态图片
      let res = await this.zg.setDummyCaptureImagePath(require('@/assets/img/web_live_wait.png'),this.stream)
      console.log(res,'设置关闭视频流时静态图片')
      // Step4
      this.startPublishingStream();
    },
    // 开始推流、开始直播
    async startPublishingStream() {
      try {
        console.log('本地预览流',this.stream)
        var res = await this.zg.startPublishingStream(this.roomId, this.stream);
        this.isPush = true
      } catch (error) {
        console.error(error)
      }
      if (res) {
        this.$loading().close();
        if (!this.liveStatus) {
          this.$message({
            message: "直播预开启成功，可以开始上课",
            type: "success",
          });
        } else {
          let timer = setTimeout(()=>{
            this.$http.post("/sys/mixedflow/startEvenWheat", { //重新进入直播间发起混流任务
                  RoomId: this.roomId, //房间ID；
                }).then(async (res) => {
                  this.streamUrl = res.data.data.Data.PlayInfo[0].HLS
                  this.$message({ message: "刷新成功", type: "success" });
                  // 设置是否静音
                  await this.zg.muteMicrophone(!this.deviceNav[0].status)
                  if(this.livePlayerList.length){
                    let arr = JSON.stringify(this.livePlayerList)
                    arr = JSON.parse(arr)
                    arr.forEach(item=>{
                      item.extraInfo = JSON.parse(item.extraInfo)
                      //挂断
                      let messageInfo = {
                        type: 5, //消息类型(1:普通信息、2:关注信息、3:提问信息、4:礼物信息、5:语音连麦信息：{1、同意，2、拒绝}、6:视频连麦信息：{1、同意，2、拒绝}、)
                        connectType: item.extraInfo.connectType,
                        replyUserId: item.user.userID,
                        replyType: -3, // 连麦后挂断
                        isHigh:true,
                      };
                      this.sendMessage(messageInfo);
                    })
                  }
                  clearTimeout(timer)
                }).catch((err) => {
                  clearTimeout(timer)
                  if(this.livePlayerList.length){
                    let arr = JSON.stringify(this.livePlayerList)
                    arr = JSON.parse(arr)
                    arr.forEach(item=>{
                      item.extraInfo = JSON.parse(item.extraInfo)
                      //挂断
                      let messageInfo = {
                        type: 5, //消息类型(1:普通信息、2:关注信息、3:提问信息、4:礼物信息、5:语音连麦信息：{1、同意，2、拒绝}、6:视频连麦信息：{1、同意，2、拒绝}、)
                        connectType: item.extraInfo.connectType,
                        replyUserId: item.user.userID,
                        replyType: -3, // 连麦后挂断
                        isHigh:true,
                      };
                      this.sendMessage(messageInfo);
                    })
                  }
                  this.$message({ message: "刷新失败,请刷新重试", type: "error" });
                });
          },500)
        }
      }
    },
    async startPlayLive() {
      if(!this.microphoneStatus){
        return this.$message.warning('请先打开麦克风权限后刷新重试')
      }else if(!this.cameraStatus){
        return this.$message.warning('请先打开摄像头权限后刷新重试')
      }
      if(!this.isPush){
        return this.$message.warning('请先推流')
      }
      let obj = {
        UserId: this.userID,
        RoomId: this.roomId,
        liveTheme: this.liveTheme,
        TaskId: this.$route.query.TaskId,
        trends: this.trends,
        openEvenWheat: this.connectOpenStatus, // 开启/关闭连麦
        openLiveReward: this.giftStatus, // 开启/关闭礼物
        openGiveLike: this.likeStatus, // 开启/关闭互动
        openLoudspeakerMute: this.deviceNav[0].status ? 0 : 1 //静音状态
      };
      if (
        this.$route.query.liveTheme &&
        this.$route.query.livePreviewId &&
        this.$route.query.liveTheme.length !== 0 &&
        this.$route.query.livePreviewId.length !== 0
      ) {
        obj.livePreviewId = this.$route.query.livePreviewId
      }
      this.$loading({ background: "rgba(0,0,0,.5)", text: "直播开启中..." });
      this.$http
        .post("/sys/mixedflow/anchorBroadcast", {...obj})
        .then((res) => {
          if (res.data.data && res.data.data.Data) {
            this.streamUrl = res.data.data.Data.PlayInfo[0].HLS
            this.liveStatus = true;
            this.joinGroup();
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.$loading().close();
            });
            this.$message({ message: "直播开启成功", type: "success" });
          } else {
            this.$message({
              message: "直播开启失败,请重新开启",
              type: "error",
            });
            this.$nextTick(() => {
              this.$loading().close();
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
    closeLive() {
      this.$confirm("确认结束直播", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$loading({background: "rgba(0,0,0,.5)",text: "下课结算中..."})
        this.$http
          .post("/sys/mixedflow/stopMixedFlow", {
            UserId: this.userID,
            RoomId: this.roomId,
          })
          .then((res) => {
            if (res.data.success && res.data.msg == "success") {
              this.sendMessage({ type: 13, isHigh:true }) //下播
              this.$message({ message: "直播已关闭", type: "success" });
              this.liveStatus = false;
              window.removeEventListener('beforeunload',this.beforeunloadHandler)
              // 取消监听并清空连麦列表
              this.offGetConnectStatus()
              this.connectMessageInfo = []
              this.tim.logout(); //退出IM
              this.tim.destroy();
              setTimeout(() => {
                // 停止推流
                this.stopPublishingStream();
              }, 1000)
              this.getPermissions()
              this.getEndLiveInfo()
            } else {
              this.$nextTick(() => {

                // 以服务的方式调用的 Loading 需要异步关闭
                this.$loading().close();
              });
              this.$message({ message: res.data.msg, type: "error" });
            }
          });
      }).catch(() => {
        this.$message.info("取消操作")
      })
    },
    async getEndLiveInfo(){ //结束获取直播详情
      let {data:res} = await this.$http.get("/sys/liveList/getNearLive")
      if(res.code == -10099){
        setTimeout(()=>{
          this.getEndLiveInfo()
        },1000)
        return
      }
      if(res.code==0){
        res.data.subStarDate=res.data.startDate.substring(0,16)
        res.data.subEndDate=res.data.endDate.substring(11,16)
        this.liveInfo = res.data
        this.endLiveDialogVisible = true
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.$loading().close();
        });
      }else{
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.$loading().close();
        });
      }
    },
    // 开启美颜
    async openEffect() {
      if(this.stream.active){
        let res = await this.zg.setEffectsBeauty(this.stream, true, this.beautifyParams);
      }
    },
    changeEffect(value){
      if(value){
        this.openEffect() //开启美颜
      }else{
        this.closeEffect()//关闭美颜
      }
    },
    resetEffect(){
      this.beautifyParams.smoothIntensity = 50
      this.beautifyParams.whitenIntensity = 50
      this.beautifyParams.rosyIntensity = 50
      this.beautifyParams.sharpenIntensity = 50
    },
    // 关闭美颜
    closeEffect() {
      this.zg.setEffectsBeauty(this.stream, false);
    },
    changeSmoothIntensity(value){//磨皮
      if(this.checked){
        this.openEffect()
      }
    },
    changeWhitenIntensity(value){//美白
      if(this.checked){
        this.openEffect()
      }
    },
    changeRosyIntensity(value){//红润
      if(this.checked){
        this.openEffect()
      }
    },
    changeSharpenIntensity(value){//锐化
      if(this.checked){
        this.openEffect()
      }
    },
    //开启、关闭连麦
    openOrCloseConnect(){
      this.$confirm(`确认${this.connectOpenStatus?'关闭':'开启'}连麦`, "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/sys/mixedflow/openOrClose',{type:1,openOrClose:this.connectOpenStatus?0:1}).then(res=>{
          if(!res.code==0) return this.$message.error(res.msg)
          this.connectOpenStatus = this.connectOpenStatus?0:1
          if(this.liveStatus){
            if(this.connectOpenStatus){
              this.sendMessage({ type: 11, isConnect: true, isHigh:true, }); //开启连麦
            }else{
              this.sendMessage({ type: 11, isConnect: false, isHigh:true, }); //关闭连麦
              this.allHangUp(()=>{
                this.replyConnectAll()
              })
            }
          }
          this.$message.success(this.connectOpenStatus?'您已开启连麦':'您已关闭连麦')
        }).catch(err=>{
          console.error(err)
        })
      }).catch(() => {
      })
    },
    joinGroup() {
      //加入直播群聊
      let promise = this.tim.joinGroup({ groupID: this.groupID });
      promise.then((imResponse) => {
          switch (imResponse.data.status) {
            case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
              break;
            case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
              console.log("加群成功", imResponse); // 加入的群组资料
            case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
              console.log("已经在群中加群成功", imResponse); // 加入的群组资料
              const conversationID = `GROUP${this.groupID}`;
              try {
                this.tim.setMessageRead({
                    conversationID,
                  }).then(() => {});
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
        }).catch(function (imError) {
          console.warn("joinGroup error:", imError); // 申请加群失败的相关信息
        });
    },
    setMessageReceived() {
      this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.$onMessageReceived, this);
    },
    async getTimUserSig() {
      try{
        this.$loading({ background: "rgba(0,0,0,.5)", text: "获取消息配置" })
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
        this.userInfo.nickName = userInfo.username;
        if(this.isOpenDesktopSharing){ //关闭屏幕共享
          this.$http.post('/sys/mixedflow/closeDesktopSharing',{RoomId:this.roomId}).then(res=>{
            if(res.data.code==0){
              this.zg.stopPublishingStream('shareDesk'+this.roomId)
              this.zg.destroyStream(this.screenStream);
              this.isOpenDesktopSharing = false
              localStorage.setItem('isOpenDesktopSharing',JSON.stringify(false))
            }
          })
        }
        let options = {
          SDKAppID: parseInt(window.SITE_CONFIG['SDKAppID']), // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
        };
        // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
        this.tim = TIM.create(options); // SDK 实例通常用 tim 表示
        if (!this.liveStatus) {
          this.tim.login({ userID: userId, userSig: userSig }); //登录腾讯IM
        } else {
          this.tim.login({ userID: userId, userSig: userSig }).then((imResponse) => {
              //登录腾讯IM
              if (imResponse.data) {
                this.waitSdkReady();
              }
            });
        }
        this.$loading().close()
        this.startLive();
      }catch(err) {
        this.$message.error(JSON.stringify(err))
        this.$loading().close()
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
    getPermissions () {
      return this.$http.get('/sys/menu/permissions').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        window.SITE_CONFIG['permissions'] = res.data
      }).catch(() => {})
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
            this.$alert(item.payload.userDefinedField, '系统提示', {
              confirmButtonText: '确定',
              callback: action => {
                // this.endLiveTitle = '您因违反规定已被禁播'
                this.isMuteLive = true
                this.getEndLiveInfo()
              }
            });
          }
          if (item.payload.userDefinedField) {
            item.payload.userDefinedField = JSON.parse(item.payload.userDefinedField);
            let tempObj = item.payload.userDefinedField
            for (var key in tempObj) {
              this.liveRoomUserinfo[key] = tempObj[key];
            }
            if(tempObj.type=='purchaseInformation'){ //订单系统消息
							list.push(Object.assign(item));
						}
            if(tempObj.haveTouristJoin) { //未登录用户进入直播间的消息
              list.push(Object.assign({
                type: "TIMCustomElem",
                payload: {
                  data: {
                    userInfo: {},
                    message: {
                      type: 10,
                      text: "游客"
                    }
                  }
                }
              }))
						}
          }
        }
        if (
          this.conversation &&
          item.conversationID === this.conversation.conversationID
        ) {
          if (item.payload && item.payload.data) {
            item.payload.data = JSON.parse(item.payload.data)
            let applyInfo = item.payload.data;
            if( applyInfo.message.type === 1 || applyInfo.message.type === 4 || applyInfo.message.type === 10){
              list.push(Object.assign(item));
            }
            if (applyInfo.message.type === 3) {
              this.questionMessageInfo.unshift(applyInfo);
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 9 ){ //助手控制赠送礼物
              this.giftStatus = applyInfo.message.isGift
              this.$http.post('/sys/mixedflow/openOrClose',{type:0,openOrClose:this.giftStatus?1:0}).then(res=>{
                if(!res.code==0) return this.$message.error(res.msg)
                this.$message.success(this.giftStatus?'助手已开启礼物':'助手已关闭礼物')
              }).catch(err=>{
                console.error(err)
              })
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 11 ){ //助手控制连麦
              this.connectOpenStatus = applyInfo.message.isConnect
              this.$http.post('/sys/mixedflow/openOrClose',{type:1,openOrClose:this.connectOpenStatus?1:0}).then(res=>{
                if(!res.code==0) return this.$message.error(res.msg)
                if(this.connectOpenStatus){
                  this.$message.success('助手已开启连麦')
                }else{
                  this.allHangUp(()=>{
                    this.replyConnectAll()
                  })
                  this.$message.success('助手已关闭连麦')
                }
              }).catch(err=>{
                console.error(err)
              })
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 12 ){ //助手控制互动
              this.likeStatus = applyInfo.message.isLike
              this.$http.post('/sys/mixedflow/openOrClose',{type:2,openOrClose:this.likeStatus?1:0}).then(res=>{
                if(!res.code==0) return this.$message.error(res.msg)
                this.$message.success(this.likeStatus?'助手已开启互动':'助手已关闭互动')
              }).catch(err=>{
                console.error(err)
              })
            }
            if( applyInfo.message &&applyInfo.message.type && applyInfo.message.type === 14 ){ //助手控制录制
              if(applyInfo.message.isRecord){ //开启录制
                this.isRecord = applyInfo.message.isRecord
                this.$http.post("/sys/mixedflow/startRecord", {}).then(res=>{
                  if(res.data.code===0){
                    this.isRecord = true //开启录制状态
                    this.$message({
                      message: "助手已开启录制",
                      type: "success",
                    });
                  }else{
                    this.$message({
                      message: res.data.msg,
                      type: "error",
                    });
                  }
                })
              }
              if(applyInfo.message.pauseRecord){ //暂停、恢复录制
                this.pauseRecord = applyInfo.message.pauseRecord
                this.$http.post("/sys/mixedflow/pauseRecord", {}).then(res=>{
                  if(res.data.code===0){
                    this.$message({
                      message: "助手已暂停录制",
                      type: "success",
                    });
                  }else{
                    this.$message({
                      message: res.data.msg,
                      type: "error",
                    });
                  }
                })
              }else if(!applyInfo.message.pauseRecord){
                this.pauseRecord = applyInfo.message.pauseRecord
                this.$http.post("/sys/mixedflow/resumeRecord", {}).then(res=>{
                  if(res.data.code===0){
                    this.$message({
                      message: "助手已恢复录制",
                      type: "success",
                    });
                  }else{
                    this.$message({
                      message: res.data.msg,
                      type: "error",
                    });
                  }
                })
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
                if(this.connectTimer[applyInfo.userInfo.userId]){
                  clearTimeout(this.connectTimer[applyInfo.userInfo.userId])
                  delete this.connectTimer[applyInfo.userInfo.userId]
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
            if(applyInfo.message && applyInfo.message.type && applyInfo.message.type === 6) {
              // console.error(applyInfo)
              this.connectMessageInfo.forEach(connect => {
                if(connect.connectStatus && connect.userInfo && applyInfo.userInfo && connect.userInfo.id == applyInfo.userInfo.id) {
                  connect['lastGetConnectIng'] = new Date().getTime()
                }
              })
            }
          }
        }
      });
      this.barrageData = this.barrageData.concat(list); //弹幕消息
      // 如果大于50，则需要删除多余数据
      if(this.barrageData.length > 50) {
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
          fansInfo:{},//用户是否为粉丝相关信息
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
          priority: messageInfo && messageInfo.isHigh ? TIM.TYPES.MSG_PRIORITY_HIGH : TIM.TYPES.MSG_PRIORITY_NORMAL,
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
        window.removeEventListener('beforeunload',this.beforeunloadHandler)
        this.$confirm("腾讯IM登录失败，请检查当前页面无重复打开后刷新重试", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "error"
        }).then(() => {
          window.close()
        }).catch(()=>{
          window.close()
        })
      }
    },
    searchUserFun(){
      this.params.page=1
      this.studentList = []
      this.getOnlineUsers()
    },
    //获取提问列表
    getliveQuestionList(){
      this.$http.get('/sys/liveAsk/getLiveAskInRoom').then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        this.questionMessageInfo = res.data
      }).catch(err=>{
        console.error(err)
      })
    },
    // 获取在线学生
    getOnlineUsers() {
      let obj = {
        nickName:this.searchUser
      }
      let params = {...this.params,...obj}
      this.$http
        .get(`/sys/mixedflow/getOnlineUsers`,{params})
        .then(({data:res}) => {
          if(!res.code==0) return this.$message.error(res.msg)
          let data = res.data.list;
          this.studentList = this.studentList.concat(data)
          this.total = res.data.total
        }).catch(err=>{
          console.error(err)
        })
    },
    // 获取主播推荐商品
    getAnchorProduct() {
      let params = {
        liveId:this.$route.query.TaskId,
        anchorId:this.roomId,
        isAdd:1,
        type:1,
        limit:999,
        page:1,
      }
      return new Promise((resolve,reject)=>{
        this.goodsListLoading = true
        this.$http
        .get(`/sys/anchorProduct/live/pageWithLiveAnchor`,{params})
        .then((res) => {
          this.goodsListLoading = false
          if(!res.data.code==0) return this.$message.error(res.data.msg)
          let data = res.data.data.list;
          data.forEach((item) => {
            if (item.productTag) {
              item.productTag = item.productTag.split("|");
            }
          });
          this.goodsList = data
          resolve(this.goodsList)
        }).catch((err)=>{
          this.goodsListLoading = false
          console.error(err)
        })
      })
    },
    // 获取直播预约列表
    getLivePreviewList() {
      let params = {
        liveState:3,
        appointmentState:1,
        anchorUserId: this.roomId,
        limit:999,
        page:1,
        showState:1,
      }
      return new Promise((resolve,reject)=>{
        this.$http.get(`/sys/livePreview/pageOwn`,{params}).then((res) => {
          if(!res.data.code==0) return this.$message.error(res.data.msg)
          this.livePreviewList = res.data.data.list
          resolve(this.livePreviewList)
        }).catch((err)=>{
          console.error(err)
        })
      })
    },
    //获取主播推荐主播
    getRecommendList() {
      let params = {
        liveId:this.$route.query.TaskId,
        state:1,
        userId: this.userID,
        limit:999,
        page:1,
      }
      return new Promise((resolve,reject)=>{
        this.$http.get(`/sys/sysRecommendedAnchor/page`,{params}).then((res) => {
          if(!res.data.code==0) return this.$message.error(res.data.msg)
          this.recommendList = res.data.data.list
          resolve(this.recommendList)
        }).catch((err)=>{
          console.error(err)
        })
      })
    },
    //获取销售记录
    getCommodityList() {
      let params = {
        liveId:this.$route.query.TaskId,
        // state:1,
        // userId: this.userID,
        limit:this.commodityLimit,
        page:this.commodityPage,
      }
      this.dataListLoading=true
      return new Promise((resolve,reject)=>{
        this.$http.get(`/sys/management/user/product/livePage`,{params}).then((res) => {
          if(!res.data.code==0) return this.$message.error(res.data.msg)
          this.commodityList = res.data.data.list
          this.commodityTotal=res.data.data.total
          this.dataListLoading=false
          resolve(this.commodityList)
        }).catch((err)=>{
          console.error(err)
        })
      })
    },
    //销售记录切换
    pageSizeChangeHandle(val){
        this.commodityPage = 1;
        this.commodityLimit = val;
        this.getCommodityList();
    },
    pageCurrentChangeHandle(val){
        this.commodityPage = val;
        this.getCommodityList();
    },
    //推送商品、直播预告
    pushMethod(type, data) {
      if (type === "goods") {
        //推送商品
        this.sendMessage({ type: 8, pushData: data,isHigh:true }, () => {
          this.$message({ message: "商品推送成功", type: "success" })
          // 推送成功同时置顶该商品
          if(data.productLiveId) {
            this.$http.put("/sys/anchorProduct/live/setTop", { id: data.productLiveId }).then(({ data: res }) => {
              if (res.code !== 0) {
                console.warn(res.msg);
              }else { //置顶成功刷新列表
                this.getAnchorProduct()
              }
            }).catch((err) => {
              console.warn(err)
              // throw err;
            })
          }
        });
      } else {
        this.sendMessage({ type: 7, pushData: data,isHigh:true }, () =>
          this.$message({ message: "预告推送成功", type: "success" })
        );
      }
    },
    replyConnect: debounce(function(status, type, connectType, userId,nickName) {
      //同意申请连麦
      let messageInfo = {
        type,
        connectType,
        replyType: 1,
        replyUserId: userId,
        isHigh:true,
      };
      if (status === 1) {
        let arr = this.connectMessageInfo.filter(item=>item.connectStatus)
        if(arr.length==3) return this.$message.warning("当前连麦人数已达上限")
        //同意
        // this.$loading({ background: "rgba(0,0,0,.5)", text: "连接中..." });
        //连接超时
        var timer = setTimeout(()=>{
          let arr = JSON.stringify(this.connectMessageInfo)
          arr = JSON.parse(arr)
          arr.forEach(item=>{
            if(item.getReplyConnectLoading){
              this.$message.error(nickName+"连接失败")
              messageInfo.replyType = -3
              this.sendMessage(messageInfo)
              const ind = this.connectMessageInfo.findIndex(item => item.userInfo.userId === userId)
              if(ind>-1){
                this.connectMessageInfo.splice(ind, 1)
              }
            }
          })
          clearTimeout(timer)
        },10000)
        this.connectTimer[userId] = timer
        this.sendMessage(messageInfo);
        this.connectMessageInfo.forEach((item) => {
          if (item.userInfo.userId === userId) {
            item.connectStatus = true;
            item.getReplyConnectLoading = true
          }
        });

      } else {
        //拒绝
        messageInfo.replyType = -2;
        this.sendMessage(messageInfo);
        const ind = this.connectMessageInfo.findIndex(
          (item) => item.userInfo.userId === userId
        );
        if(ind>-1){
          this.connectMessageInfo.splice(ind, 1);
        }
      }
    }, 1000, { 'leading': true, 'trailing': false }),
    hangupHandle(item) {
      this.$confirm(`确认挂断用户[${item.userInfo.nickName || ""}]`, "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.hangup(item)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消挂断'
        });
      })
    },
    // 挂断方法
    hangup(info) {
      if(this.connectTimer[info.userInfo.userId]){
        clearTimeout(this.connectTimer[info.userInfo.userId])
        delete this.connectTimer[info.userInfo.userId]
      }
      //挂断
      let messageInfo = {
        type: info.message.type, //消息类型(1:普通信息、2:关注信息、3:提问信息、4:礼物信息、5:语音连麦信息：{1、同意，2、拒绝}、6:视频连麦信息：{1、同意，2、拒绝}、)
        connectType: info.message.connectType,
        replyUserId: info.userInfo.userId,
        replyType: -3, // 连麦后挂断
        isHigh:true,
      };
      this.sendMessage(messageInfo);
      const ind = this.connectMessageInfo.findIndex(
        (item) => item.userInfo.userId === info.userInfo.userId
      );
      if(ind>-1){
        this.connectMessageInfo.splice(ind, 1); //移除挂断的一条连麦信息
      }
    },
    // 定时监听连麦用户实时状态
    onGetConnectStatus() {
      if(!this.connectStatusTimer) {
        console.log("开始监听连麦用户定时发送的消息")
        this.connectStatusTimer = setInterval(() => {
          this.connectMessageInfo.map(item => {
            // console.error(item)
            if(item.connectStatus && item.getReplyConnectLoading == false && item.lastGetConnectIng) {
              let time = new Date().getTime() - item.lastGetConnectIng
              // 超过8s未发送正在连麦消息挂断
              if(time > 8 * 1000) {
                this.livePlayerList.forEach((data)=>{ 
                  if(data.streamID.includes(item.userInfo.userId)){
                    this.$http.post(`/sys/mixedflow/deleteStream`, {
                      RoomId: this.roomId, //房间ID；
                      joinRoomId: data.streamID
                    }).then(({data: res}) => {
                      if(res.code != 0) return this.$message.error(res.msg)
                      // 挂断
                      this.hangup(item)
                    }).catch(err => {
                      console.warn(err)
                      this.$message.error(JSON.stringify(err))
                    })
                  }
                })
              }
            }
          })
        }, 3 * 1000)
      }
    },
    // 取消监听连麦用户实时状态
    offGetConnectStatus() {
      if(this.connectStatusTimer) {
        console.log("取消监听连麦用户定时发送的消息")
        clearInterval(this.connectStatusTimer)
        this.connectStatusTimer = null
      }
    },
    confirmQuit(){//退出直播间，关闭页面
      window.close()
    },
    allHangUp(cb){
      let arr = JSON.stringify(this.connectMessageInfo)
      arr = JSON.parse(arr)
      let connectArr = arr.filter(item=>item.connectStatus)
      connectArr.forEach(item=>{
        this.hangup(item)
      })
      if(cb)cb()
    },
    //拒绝所有申请连麦的人
    replyConnectAll(){
      let arr = JSON.stringify(this.connectMessageInfo)
      arr = JSON.parse(arr)
      let noConnectArr = arr.filter(item=>!item.connectStatus)
      console.log(noConnectArr,1111111111)
      noConnectArr.forEach(item=>{
        let messageInfo = {
          type:item.message.type,
          connectType:item.message.connectType,
          replyType: -2,
          replyUserId: item.userInfo.userId,
          isHigh:true,
        }
        console.log(2222222222)
        this.sendMessage(messageInfo)
      })
      this.connectMessageInfo = []
    },
  },
  destroyed() {
    this.offGetConnectStatus()
    // this.stopPublishingStream
    this.allHangUp(()=>{
      this.replyConnectAll()
    })
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
            >span{
              font-weight: 600;
            }
            .anchor_detail_isLive {
              width: 70px;
              height: 20px;
              background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
              box-shadow: 0px 4px 10px 1px rgba(249,46,29,0.4000);
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
            .no_live_status{
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
              >img{
                width: 6px;
                height: 6px;
                margin-right: 5px;
              }
            }
            .record_btn{
              margin-left: 20px;
              cursor: pointer;
              line-height: 20px;
              >img{
                width: 20px;
                height: 20px;
                margin-right: 5px;
              }
              >span{
                font-size: 14px;
                color: #ffffff;
                font-weight: 400;
              }
            }
          }
          >.online_info {
            display: flex;
            > p {
              margin-right: 15px;
              font-size:14px;
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
              .search_btn{
                cursor: pointer;
                width: 40px;
                height: 40px;
                position: absolute;
                right: 0;
                top: 0;
              }
              .el-input__inner{
                background-color: #44454A;
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
          .start_live{
            width: 230px;
            height: 40px;
            background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
            box-shadow: 0px 4px 10px 1px rgba(249,46,29,0.4000);
            border-radius: 20px;
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 400;
            line-height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 45px;
            cursor: pointer;
            >img{
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
            color: #FFFFFF;
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
            .tool_nav_son{
              position: absolute;
              // bottom: -90px;
              top: 100%;
              background-color: #000000;
              width: 90px;
              font-size: 14px;
              color: #A2A2A2;
              z-index: 99;
              >p{
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
                .online_info_status{
                  display: flex;
                  >div{
                    display: flex;
                    align-items: flex-end;
                    justify-content: flex-start;
                    margin-bottom: 6px;
                    margin-left: 4px;
                    width: 26px;
                    >span{
                      display: inline-block;
                      width:4px;
                      background: #00FF31;
                    }
                    >span:nth-child(1){
                      height:8px;
                      margin-right: 2px;
                    }
                    >span:nth-child(2){
                      height:10px;
                      margin-right: 2px;
                    }
                    >span:nth-child(3){
                      height:12px;
                      margin-right: 2px;
                    }
                    >span:nth-child(4){
                      height:14px;
                      margin-right: 2px;
                    }
                    >span:nth-child(5){
                      height:16px;
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
              .quit_board{
                position: absolute;
                right: 10px;
                top: 20px;
                cursor: pointer;
                background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
                box-shadow: 0px 4px 10px 1px rgba(249,46,29,0.4000);
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
              // width: 100%;
              // height: calc(100% - 60px);
            }
            .device_set{
              position: absolute;
              bottom: 20px;
              right: 10px;
              z-index: 2;
              display: flex;
              width: 90px;
              height: 40px;
              align-items: center;
              justify-content: space-between;
              >div{
                cursor: pointer;
                >img{
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
            .openConnect_btn{
              width: 210px;
              height: 40px;
              background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
              box-shadow: 0px 4px 10px 1px rgba(249,46,29,0.4);
              border-radius: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #FFFFFF;
              cursor: pointer;
              >img{
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
        background: #F7F7F7;
        font-size: 14px;
        color: #151515;
        cursor: pointer;
        position: relative;
        .actived{
            position: absolute;
            right: 10px;
            top: 10px;
            width: 16px;
            height: 16px;
            opacity: 0;
        } 
        &:hover{
            .actived {
                opacity: 1;
            }
        }
        .icon{
            width: 56px;
            height: 50px;
            margin-bottom: 20px;
        }      
    }
  }

  .recoredDialog{
    background: #00f;
  }
  /deep/.el-dialog__body{
    padding: 0 20px!important;
  }
  /deep/ .dialog_content{
    width: 400px;
    max-height: 550px;
    box-sizing: border-box;
    border-top: 1px solid #E5E5E5;
    padding: 20px 0;
    overflow: auto;
    .device_step{
      width: 100%;
      height: 90px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .step_line{
        width: 28px;
        height: 6px;
      }
      >div{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: relative;
        >img{
          width: 50px;
          height: 50px;
        }
        >span{
          color:#000000;
          font-size: 14px;
        }
        .camera_error{
          width: 18px;
          height: 18px;
          position: absolute;
          bottom: 25px;
          right: 15px;
        }
      }
    }
    .check_camera{
      margin-top: 30px;
      .camera_device{
        >span{
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .el-select{
          margin-left: 20px;
          width: 234px;
        }
      }
      .preview{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20px;
        >span{
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .check_camera_video{
          margin-left: 20px;
          width: 234px;
          height: 132px;
          background: #000000;
        }
      }
      .tip{
        font-size: 12px;
        color: #ABABAB;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        width: 234px;
        margin: 10px auto 0px;
        padding-right: 16px;
        .tip_title{
          display: flex;
          align-items: center;
          >span{
            margin-left: 2px;
          }
        }
      }
      .question{
        color: #000000;
        font-size: 14px;
        text-align: center;
        margin-top: 20px;
      }
    }
    .check_mike{
      margin-top: 30px;
      .mic_device{
        >span{
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .el-select{
          margin-left: 20px;
          width: 234px;
        }
      }
      .soundWaves_num{
        display: flex;
        width: 234px;
        position: relative;
        margin: 20px 0px 0px 65px;
        .under_div{
          width: 100%;
          >span{
            display: inline-block;
            width: 4px;
            height: 20px;
            background-color: #F8F8F8;
            border-radius: 2px;
            margin-right: 5px;
          }
        }
        .top_div{
          width: 100%;
          position: absolute;
          left: 0;
          overflow: hidden;
          height: 20px;
          >span{
            display: inline-block;
            width: 4px;
            height: 20px;
            background: #FA3523;
            border-radius: 2px;
            margin-right: 5px;
          }
        }
      }
      .soundWaves_line{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 234px;
        margin-left:65px;
        .el-slider{
          width: 75%;
        }
        .el-slider__bar{
          background: linear-gradient(90deg, #FA3623 0%, #FE055A 100%)!important;
        }
        .el-slider__button{
          border:none !important;
          box-shadow: 0px 0px 3px 1px rgba(250,54,35,0.4000);
        }
      }
      .preview{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20px;
        >span{
          color: #000;
          width: 45px;
          text-align: right;
          font-size: 14px;
        }
        .check_camera_video{
          margin-left: 20px;
          width: 234px;
          height: 132px;
          background: #000000;
        }
      }
      .tip{
        font-size: 12px;
        color: #ABABAB;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        width: 234px;
        margin: 10px auto 0px;
        padding-right: 16px;
        .tip_title{
          display: flex;
          align-items: center;
          >span{
            margin-left: 2px;
          }
        }
      }
      .question{
        color: #000000;
        font-size: 14px;
        text-align: center;
        margin-top: 20px;
      }
    }
    .check_result{
      margin-top: 30px;
      .device_result{
        width: 300px;
        height: 45px;
        background: #F8F8F8;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        align-items: center;
        color: #000000;
        font-size: 14px;
        margin-bottom: 10px;
        .success{
          color: #02C100;
        }
        .error{
          color: #FA3523;
        }
      }
      .tip{
        width: 300px;
        margin:0 auto 10px;
        font-size: 12px;
        color: #ABABAB;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        .tip_title{
          display: flex;
          align-items: center;
          >span{
            margin-left: 2px;
          }
        }
      }
    }
    
    .check_btn{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      >div{
        width: 140px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        border-radius: 20px;
        cursor: pointer;
      }
      >div:first-child{
        background: #F8F8F8;
        color: #ABABAB;
        margin-right: 20px;
      }
      >div:nth-child(2){
        color: #FFFFFF;
        background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
        box-shadow: 0px 4px 10px 1px rgba(249,46,29,0.4000);
      }
    }
    .beautify_set{
      width: 324px;
      margin: 0 auto;
      .beautify_video{
        width: 100%;
        height: 182px;
      }
      .checkd_btn{
        margin: 0px 0px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #000000;
        font-size: 14px;
        .el-checkbox{
          color: #000000;
        }
        .checkd_reset{
          font-size: 12px;
          cursor: pointer;
          >span{
            margin-left: 2px;
          }
        }
      }
      .block{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #000000;
      }
      .el-slider{
        flex: 1;
        margin: 0 10px 0 6px;
      }
      .el-slider__bar{
        background: linear-gradient(90deg, #FA3623 0%, #FE055A 100%)!important;
      }
      .el-slider__button{
        border:2px solid #FA3623 !important;
        box-shadow: 0px 0px 3px 1px rgba(250,54,35,0.4000);
      }
    }
    .streamAddress_content{
      width: 100%;
      line-height: 45px;
      background: #F8F8F8;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .copy_btn{
      width: 140px;
      line-height: 40px;
      background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
      box-shadow: 0px 4px 10px 1px rgba(249,46,29,0.4000);
      border-radius: 20px;
      text-align: center;
      margin: 30px auto 0;
      color: #ffffff;
      cursor: pointer;
    }
    .content_list{
      width: 100%;
      background: #F8F8F8;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 20px;
      .list_top{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-left: 30px;
        position: relative;
        >span{
          line-height: 18px;
          text-align: center;
          color: #ffffff;
          font-size: 12px;
          background: linear-gradient(118deg, #FA3622 0%, #FF055B 100%);
          border-radius: 2px;
          padding: 1px 5px;
          white-space: nowrap;
          position: absolute;
          left: 0;
          top:0;
        }
      }
      .list_bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 30px;
        .info{
          display: flex;
          font-size: 12px;
          color: #B9B9B9;
        }
        .push_btn{
          width: 60px;
          background: linear-gradient(69deg, #FA3622 0%, #FA3622 1%, #FF055B 100%);
          border-radius: 15px;
          color: #ffffff;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .content_list_preview{
      width: 100%;
      background: #F8F8F8;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 20px;
      .list_top{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        >img{
          width: 100px;
          height: 56px;
          border-radius: 5px;
          margin-right: 20px;
        }
        >p{
          font-size: 16px;
          color: #202020;
          font-weight: 400;
        }
      }
      .list_bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        .info{
          font-size: 12px;
          color: #B9B9B9;
        }
        .push_btn{
          width: 60px;
          background: linear-gradient(69deg, #FA3622 0%, #FA3622 1%, #FF055B 100%);
          border-radius: 15px;
          color: #ffffff;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .content_list_recommend{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 20px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #F3F3F3;
      .list_left{
        display: flex;
        align-items:center;
        padding-left:30px;
        position: relative;
        >span{
          line-height: 18px;
          text-align: center;
          color: #ffffff;
          font-size: 12px;
          background: linear-gradient(118deg, #FA3622 0%, #FF055B 100%);
          border-radius: 2px;
          padding: 1px 5px;
          white-space: nowrap;
          position: absolute;
          left: 0;
          top: calc(50% - 9px);
        }
        .userInfo{
          color: #000000;
          >img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
      }
      .list_right{
        color: #B9B9B9;
        font-size: 12px;
      }
    }
  }
  .dialog_content::-webkit-scrollbar {
    display: none;
  }

  .recoredInfo{
    padding: 10px;
    .recoredInfo-title{
      color:#030303;
      font-size: 24px;
      font-weight: bold;
     
    }
    .recoredInfo-time{
      color: #9F9F9F;
      font-size: 14px;
      margin-top: 10px;
    }
    .recoredInfo-item{
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .recoredInfo-item-box{
        width: 24%;
        height: 77px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        background: #eee;
        .recoredInfo-item-num{
          font-size: 24px;
          font-weight: 400;
        }
        .recoredInfo-item-text{
          font-size: 14px;
        }
      }

      .itemBox1{
        background: #F4F5FE;
        color:#656CAA
      }
      .itemBox2{
        background: #FEF4FD;
        color:#985892
      }
      .itemBox3{
        background: #FEF4FA;
        color:#915366
      }
      .itemBox4{
        background: #F4FBFE;
        color:#2C6177
      }
      .itemBox5{
        background: #F4FEFE;
        color:#498787
      }
      .itemBox6{
        background: #F4FEF8;
        color:#2A7548
      }
      .itemBox7{
        background: #FCFEF4;
        color:#919B6B
      }
      .itemBox8{
        background: #FEFAF4;
        color:#976F4B
      }
    }
    .recoredInfo-click{
      width: 100%;
      display: flex;
      margin: 20px 0;
      justify-content: center;
      align-items: center;
    }
    .recoredInfo-profit{
      width: 100%;
      background: #FFFAF5;
      border-radius: 10px;
      .recoredInfo-profit-title{
        background: #DF3623;
        color: #fff;
        width: 90px;
        text-align: center;
        font-size: 16px;
        border-top-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      .recoredInfo-profit-item{
        display: flex;
        justify-content: space-between;
        .recoredInfo-profit-box{
          width: 33%;
          height: 77px;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          .profit-box-num{
            font-size: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;

            img{
              margin-left: 5px;
            }
          }
          .profit-box-text{
            color:#C1A992;
            font-size:14px
          }
        }
      }
    }
    .recoredInfo-profit-bottom{
      margin-bottom: 20px;
      margin-top: 10px;
    }
  }

  .commodityClss{
    /deep/.el-dialog__body{
      padding-bottom: 20px !important;
    }
    /deep/.el-pagination{
      text-align: right !important;
      margin-top: 20px !important;
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