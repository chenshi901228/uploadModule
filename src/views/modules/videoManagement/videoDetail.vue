<template>
  <el-card shadow="never" class="aui-card--fill" style="background-color: transparent;">
    <div style="background-color: #fff;padding: 30px 20px;box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1600);
border-radius: 5px 5px 5px 5px;position: relative;">
      <el-row>
        <el-col :span="12" style="display:flex;align-items: center;">视频主题：<el-input disabled type="textarea"
            :value="info.liveTheme" size="small" style="width:calc(100% - 120px)"></el-input>
        </el-col>
        <el-col :span="12" style="display:flex;align-items: center;">主 播：<el-input disabled :value="info.anchorUser"
            size="small" style="width:calc(100% - 120px)"></el-input>
        </el-col>
        <el-col :span="24" style="display:flex;align-items: center;">视频显示：<el-input disabled
            :value="info.showMode === 0 ? '竖屏' : '横屏'" size="small" style="width:calc(50% - 120px)"></el-input>
        </el-col>
        <el-col :span="10">封面图：
          <el-image :preview-src-list="srcList" v-if="info && info.frontCoverUrl" :src="info && info.frontCoverUrl"
            style="width: 200px; height: 180px" fit="cover">
          </el-image>
        </el-col>
        <el-col :span="10">视频推广图：
          <el-image :preview-src-list="spreadUrlList" v-if="info && info.spreadUrl" :src="info && info.spreadUrl"
            style="width: 200px; height: 180px" fit="cover">
          </el-image>
        </el-col>
        <el-col :span="2">
          <!-- 审核状态图片 -->
          <img v-if="statusImg" class="statusImg" :src="statusImg" alt="">
        </el-col>
        <el-col :span="24">视频：
          <video ref="video" id="video" :src="info.relationLiveUrl" :autoplay="videolist.autoplay"
            :controls="videolist.controls" :controlslist="videolist.controlslist"
            :webkit-playsinline="webkitplaysinline" style="width: 200px; height: 180px"></video>
        </el-col>
         
        
        <el-col v-if="!(checkFlag && info.approveStatus === 0)" :span="24">备注：{{ info.remark }}</el-col>
      </el-row>
    </div>


    <div style="background-color: #fff;padding: 30px 20px;box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1600);
border-radius: 5px 5px 5px 5px;margin: 20px 0;">
      <div
        style="height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;">
        带货商品
      </div>
      <el-table v-loading="dataListLoading" :data="dataList" max-height="400" fit style="width: 100%">
        <el-table-column header-align="center" align="center" v-for="item in tableItem" :key="item.prop"
          :prop="item.prop" :label="item.label" :show-overflow-tooltip="item.prop == 'productName' ? false : true">
          <template slot-scope="{ row, $index }">
            <!-- 序号 -->
            <span v-if="item.prop == 'index'">{{ $index + 1 }}</span>
            <!-- 封面图 -->
            <div v-else-if="item.prop == 'productImage'">
              <img class="frontCoverImg" :src="
                row.productImage || require('@/assets/img/default_cover.jpg')
              " alt="" />
            </div>
            <!-- 商品价格 -->
            <span v-else-if="item.prop == 'oldPrice'">
              ￥{{ row.oldPrice }}
            </span>
            <!-- 销售价格 -->
            <span v-else-if="item.prop == 'price'"> ￥{{ row.price }} </span>
            <!-- 是否添加 -->
            <span v-else-if="item.prop == 'isAdd'">
              {{ row.isAdd ? "已添加" : "未添加" }}
            </span>
            <!-- 是否主推 -->
            <!-- <span v-else-if="item.prop == 'isFeatured'">
            {{ row.isFeatured ? "已主推" : "未主推" }}
          </span> -->
            <!-- 是否免费 -->
            <span v-else-if="item.prop == 'isFree'">
              <el-tag size="small" :type="row.isFree ? 'success' : 'danger'">{{
                  row.isFree ? "是" : "否"
              }}</el-tag>
            </span>
            <span v-else>
              {{ row[item.prop] || "-" }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
        layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>


    <div v-if="checkFlag && info.approveStatus === 0" style="margin-top: 20px">
      <el-form :model="ruleForm" ref="ruleForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="备注：" prop="desc">
          <el-input size="small" type="textarea" maxlength="100" show-word-limit v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div style="display: flex; " class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm">通过</el-button>
        <el-button size="small" @click="resolve">驳回</el-button>

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
      dataListLoading: false,
      info: {},
      srcList: [],
      spreadUrlList:[],
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
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataList: [], //商品列表
      tableItem: [
        { prop: "index", label: "序号" },
        { prop: "productImage", label: "商品图片" },
        { prop: "productName", label: "商品名称" },
        { prop: "oldPrice", label: "商品价格" },
        { prop: "price", label: "销售价格" },
        { prop: "productType", label: "商品类型" },
        { prop: "isFree", label: "是否免费" },
        { prop: "linkedProductId", label: "关联产品编号" },
        // { prop: "updateDate", label: "上架时间", width: 180 },
        // { prop: "isAdd", label: "添加状态" },
        // { prop: "isFeatured", label: "主推状态" },
      ],
      params: {
        isAdd: 1,
        anchorId: "",
        playbackId: ""
      }
    };
  },
  activated() {
    this.id = this.$route.query.videoDetail.id
    this.params.playbackId = this.$route.query.videoDetail.id
    this.params.anchorId = this.$route.query.videoDetail.anchorUserId
    this.checkFlag = this.$route.query.checkFlag
    this.$nextTick(() => {
      if (this.checkFlag) {
        this.query()
      }else {
        this.info = this.$route.query.videoDetail;
        this.checkFlag = false;
        if (this.info && this.info.frontCoverUrl) {
          this.srcList = [this.info.frontCoverUrl]
        }
        if (this.info && this.info.spreadUrl) {
          this.spreadUrlList = [this.info.spreadUrl]
        }
      }
      this.querylist();
      this.getVideoProductList()
    })
  },
  computed: {
    // 审核状态图片
    statusImg() {
      if (this.info && this.info.approveStatus == 0) return require("@/assets/icon/icon_applying.png")
      if (this.info && this.info.approveStatus == 1) return require("@/assets/icon/icon_agree.png")
      if (this.info && this.info.approveStatus == 2) return require("@/assets/icon/icon_reject.png")
      return ""
    }
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
            if (this.info && this.info.frontCoverUrl) {
              this.srcList = [this.info.frontCoverUrl]
            }
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
    // 获取短视频商品列表
    getVideoProductList() {
      this.dataListLoading = true
      this.$http.get("/sys/playbackProduct/getProductPage", { params: { page: this.page, limit: this.limit, ...this.params } }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code != 0) {
          this.dataList = [];
          this.total = 0;
          return this.$message.error(res.msg)
        }
        this.dataList = res.data.list
        this.total = res.data.total
      })
        .catch((err) => {
          this.dataListLoading = false
          console.log(err);
        });
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1
      this.limit = val
      this.getVideoProductList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val
      this.getVideoProductList()
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
        this.videoPlayer.addEventListener("play", (e) => { });

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
.statusImg {
  width: 100px;
}

.frontCoverImg {
  width: 100px;
  height: 60px;
  object-fit: cover;
}

.el-col {
  margin-bottom: 30px;
}

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

.video_right>p {
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


