<template>
    <el-card shadow="never" class="aui-card--fill">
      <div class="data_details">
        <div class="title">数据概况</div>
        <div class="data_list">
          <div v-for="(item,index) in dataDetail" :key="index">
            <div>
              <span>{{item.data=='unionIncome'||item.data=='getReward'||item.data=='commerceIncome'?'￥':''}}{{numberChange(liveDetail[item.data])}}</span>
              <span>{{item.type}}</span>
            </div>
            <img :src="item.img" alt="">
          </div>
        </div>
      </div>
      <div class="live_content">
        <div class="live_content_top">
          <div class="live_video" 
            v-loading="loadingLive"
            element-loading-text="直播加载中"
            element-loading-spinner="el-icon-loading">
            <div class="live_info">
              直播间ID：{{liveDetail.liveStream&&liveDetail.liveStream.Data.RoomId}}
            </div>
            <!-- <video-flv-component :url="videoUrl" class="live_video_flv"></video-flv-component> -->
            <video controls id="myVideo" autoplay class="live_video_flv"></video>
            <video src=""></video>
            <div class="banned" @click="bannedFun" v-if="liveDetail.liveState && bannedDisble=='1'">
              <img src="../../../assets/img/banned.png" alt="">
              <span>禁播</span>
            </div>
            <div class="banned-disable" v-if="liveDetail.liveState && bannedDisble=='0'">
              <img src="../../../assets/img/banned.png" alt="">
              <span>禁播</span>
            </div>
          </div>
          <div class="charts_title_box">
            <div class="charts_title">
              <div class="title">直播趋势</div>
              <div>
                <div>直播间观看人数：{{numberChange(cumulativeNum)}} 
                  <span></span>
                </div>
                <div>在线人数：{{numberChange(liveTrendsY[liveTrendsY.length-1])}}</div>
              </div>
            </div>
            <div id="live_trends"></div>
          </div>
        </div>
        <div class="live_content_bottom">
          <div class="">
            <div id="cargo_analysis"></div>
          </div>
          <div>
            <div id="reward_analysis"></div>
          </div>
        </div>
      </div>
      <!-- 禁播备注弹框 -->
      <remark-modal
        ref="remarkModal"
        @confirm="confirmHandle"
        title="禁播"
      ></remark-modal>
    </el-card>
</template>

<script>
import videojs from 'video.js'
import 'videojs-contrib-hls'
// import VideoFlvComponent from "@/components/common/videoFlvComponent.vue"
import RemarkModal from "@/components/common/remarkDialog";

// import echarts from "echarts"
import * as echarts from 'echarts';
export default {
  components:{
    // VideoFlvComponent,
    RemarkModal
  },
  data(){
    return{
      appId: 467572390,
      userName:"",
      userId: "",
      dataDetail:[
        {
          type:"新增粉丝",
          img:require('@/assets/img/add_fans_icon.png'),
          data:"addFansNum",
        },
        {
          type:"粉丝收入",
          img:require('@/assets/img/unionIncome_icon.png'),
          data:"unionIncome",
        },
        {
          type:"打赏人数",
          img:require('@/assets/img/getReward_user_icon.png'),
          data:"getRewardUserNum",
        },
        {
          type:"打赏收入",
          img:require('@/assets/img/getReward_icon.png'),
          data:"getReward",
        },
        {
          type:"购物人数",
          img:require('@/assets/img/good_user_icon.png'),
          data:"buyNum",
        },
        {
          type:"带货收入",
          img:require('@/assets/img/commerceSale_icon.png'),
          data:"commerceIncome",
        },
        {
          type:"点赞人数",
          img:require('@/assets/img/dianzan_user_icon.png'),
          data:"giveLikeUserNum",
        },
      ],
      liveDetail:{},
      liveTrendsX:[],
      liveTrendsY:[],
      cumulativeNum:0,
      player: null,
      videoUrl: "",
      isLive:true,
      rewardGiftName:[],//打赏礼物
      giftNum:[],//礼物数量
      giftPrice:[],//礼物价格
      commerceName:[],//课名称
      commerceNum:[],//礼物数量
      commercePrice:[],//礼物价格

      bannedDisble:'1',//禁播按钮自定义状态显示，1为启用，0为禁止
      loadingLive: false, //直播加载loading
    }
  },
  created(){
    this.userId = 'looker_admin'+this.$store.state.user.id
    this.userName = 'looker_userName'+this.$store.state.user.id
    this.bannedDisble='1'
  },
  activated(){
    this.getliveDetail()
    this.getLiveTrends()
    this.getCommerceIncome()
    this.getGetReward()
    this.bannedDisble='1'
  },
  beforeDestroy() {
    if(this.player) this.player.dispose()
  },
  methods:{
    // 更新直播地址
    getVideo(url) {
      if(!this.player) {
        this.player = videojs("myVideo", {
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
    numberChange(num, unit = "W") {
      if(num == null) num = 0
      num = Number(num)
      return (num / 10000) > 1 ? parseFloat((num / 10000)).toFixed(1) + unit :  num;
    },
    // 弹框确认操作
    confirmHandle(remark, id) {
      console.log(remark,id)
      this.$http.put("/sys/liveList/stopLive", { id,remark })
      .then(({ data: res }) => {
        if (res.code == 0) {
          this.$message.success("禁播成功");
          this.getliveDetail()
          this.bannedDisble='0'
          this.$refs.remarkModal.close();
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((err) => {
        throw err;
      });
    },
    // confirmHandle(){
  
    // },
    bannedFun(){ //禁播
      this.$refs.remarkModal.init(this.liveDetail.id);
    },
    getLiveTrends(){ //直播趋势
      this.$http.get(`/sys/liveListSupervisory/getLiveOnlineNumTrend/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        if(!res.data || (res.data && !res.data.length)) {
          this.liveTrendsX = []
          this.liveTrendsY = []
          this.cumulativeNum = 0
        }else {
          res.data.forEach(item=>{
            this.liveTrendsX.push(item.createDate)
            this.liveTrendsY.push(Number(item.onlineNum))
          })
          this.cumulativeNum = res.data[res.data.length-1].cumulativeNum
        }
        // console.log(this.liveTrendsX,this.liveTrendsY,'/直播趋势')
        this.initEcharts()
      })
    },
    getCommerceIncome(){ //带货分析
      this.$http.get(`/sys/liveListSupervisory/getCommerceIncome/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        if(!res.data || (res.data && !res.data.length)) {
          this.commerceName = []
          this.commerceNum = []
          this.commercePrice = []
        }else {
          res.data.forEach(item=>{
            this.commerceName.push(item.productName)
            this.commerceNum.push(item.totalNum)
            this.commercePrice.push(item.totalPrice)
          })
        }
        this.initEchartsTwo()
      })
    },
    getGetReward(){ //打赏分析
      this.$http.get(`/sys/liveListSupervisory/getGetReward/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        if(!res.data || (res.data && !res.data.length)) {
          this.rewardGiftName = []
          this.giftNum = []
          this.giftPrice = []
        }else {
          res.data.forEach(item=>{
            this.rewardGiftName.push(item.name)
            this.giftNum.push(item.totalGiftNum)
            this.giftPrice.push(item.totalPrice)
          })
        }
        this.initEchartsThree()
      })
    },
    getliveDetail(){
      this.loadingLive = true
      this.$http.get(`/sys/liveListSupervisory/getDetailed/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) {
          this.loadingLive = false
          return this.$message.error(res.msg)
        }
        if(!res.data.liveStream) {
          this.loadingLive = false
          return this.$message.warning("暂时未获取到正在直播的信息")
        }
        this.liveDetail = res.data
        this.videoUrl = res.data.liveStream.Data.PlayInfo[0].HLS.replace("http", "https")
        this.getVideo(this.videoUrl)
      }).catch(err => {
        this.loadingLive = false
        this.$message.error(JSON.stringify(err))
      })
    },
    initEchartsThree(){
      var chartDom = document.getElementById('reward_analysis');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 20,
            show:false,
          },
          {
            start: 0,
            end: 20,
          }
        ],
        title: {
          left: 'left',
          text: '打赏分析'
        },
        legend: {
          left: 'right',
          data: ['礼物数量', '打赏收入']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.rewardGiftName,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis:[
          {
            name:'礼物数量',
            type: 'value',
            minInterval:1,
          },
          {
            name:'打赏收入',
            type: 'value',
            minInterval:0,
            max:'dataMax',
          }
        ],
        series: [
          {
            name: '礼物数量',
            type: 'line',
            data: this.giftNum,
            itemStyle:{
              color:"#EE2B2D"
            },
          },
          {
            name: '打赏收入',
            type: 'line',
            data: this.giftPrice,
            yAxisIndex:1,
            type: 'bar',
            itemStyle:{
              color:"#3558CC"
            },
            barWidth : 30,//柱图宽度
          },
        ]
      };
      option && myChart.setOption(option);
    },
    initEchartsTwo(){
      var chartDom = document.getElementById('cargo_analysis');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: 'axis'
        },
        title: {
          left: 'left',
          text: '带货分析'
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 20,
            show:false,
          },
          {
            start: 0,
            end: 20,
          }
        ],
        legend: {
          left: 'right',
          data: ['带货数量', '带货收入']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.commerceName,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: [
          {
            name:'带货数量',
            type: 'value',
            minInterval:1
          },
          {
            name:'带货收入',
            type: 'value',
            minInterval:0,
          }
        ],
        series: [
          {
            name: '带货数量',
            type: 'line',
            data: this.commerceNum,
            itemStyle:{
              color:"#EE2B2D"
            },
          },
          {
            name: '带货收入',
            type: 'line',
            data: this.commercePrice,
            yAxisIndex:1,
            type: 'bar',
            itemStyle:{
              color:"#3558CC"
            },
            barWidth : 30,//柱图宽度
          },
        ]
      };
      option && myChart.setOption(option);
    },
    initEcharts(){
      var chartDom = document.getElementById('live_trends');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        xAxis: {
          type: 'category',
          data: this.liveTrendsX,
        },
        yAxis: {
          type: 'value',
          min:0,
          minInterval:1,
          maxInterval:5000
        },
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 20,
            show:false,
          },
          {
            start: 0,
            end: 20,
          }
        ],
        series: [
          {
            name: '在线人数',
            stack: 'Total',
            data: this.liveTrendsY,
            type: 'line'
          }
        ]
      };
      option && myChart.setOption(option);
    },
  },
}
</script>

<style lang="scss">
.data_details{
  width: 100%;
  height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #FFFFFF;
  box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1600);
  border-radius: 5px;
  padding: 20px;
  p{
    padding: 0;
    margin: 0;
  }
  .title{
    color: #000000;
    font-size: 20px;
  }
  .data_list{
    display: flex;
    justify-content: space-between;
    >div{
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #F4F5FE;
      padding: 20px 10px;
      width: 13%;
      height: 80px;
      >div{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        >span:first-child{
          color: #475062;
          font-size: 20px;
        }
        >span:last-child{
          font-size: 14px;
        }
      }
    }
  }
}
.live_content{
  width: 100%;
  margin-top: 20px;
  >div{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 395px;
    margin-bottom: 20px;
    >div{
      box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1600);
      border-radius: 5px;
      height: 100%;
    }
    >div:first-child{
      width: 39%;
      height: 100%;
      >video{
        width: 100%;
        height: 100%;
      }
      
    }
    >div:last-child{
      width: 59%;
      height: 100%;
    }
  }
  .live_content_top{
    .live_video{
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      .live_info{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background: #000000;
        opacity: 0.6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #FFFFFF;
        padding: 0 10px;
        font-size: 14px;
        z-index: 1;
      }
      .banned{
        position: absolute;
        bottom: 20px;
        width: 230px;
        height: 40px;
        background: linear-gradient(89deg, #FA3622 0%, #FE055B 100%);
        box-shadow: 0px 4px 10px 1px rgba(249,46,29,0.4);
        border-radius: 20px;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFFFFF;
        font-size: 16px;
        cursor: pointer;
        >span{
          margin-left: 10px;
        }
      }
      .banned-disable{
        position: absolute;
        bottom: 20px;
        width: 230px;
        height: 40px;
        background: rgb(171, 167, 167);
        border-radius: 20px;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFFFFF;
        font-size: 16px;
        cursor: pointer;
        >span{
          margin-left: 10px;
        }
      }
    }
    .charts_title_box{
      height: 100%;
      .charts_title{
        height: 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        .title{
          font-size: 20px;
          font-weight: bold;
        }
        >div:last-child{
          display: flex;
          >div{
            >span{
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #3558CC;
              margin:0px 10px;
            }
          }
        }
      }
      #live_trends{
        height: 90%;
      }
    }
  }
  .live_content_bottom{
    >div{
      padding: 10px;
    }
    #cargo_analysis{
      height: 100%;
    }
    #reward_analysis{
      height: 100%;
    }
  }

  .live_video_flv {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    video {
      max-width: 100%;
      max-height: 100%;
    }
  }
  
}
</style>