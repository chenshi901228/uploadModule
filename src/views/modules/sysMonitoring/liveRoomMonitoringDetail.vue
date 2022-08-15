<template>
    <el-card shadow="never" class="aui-card--fill">
      <div class="data_details">
        <div class="title">数据概况</div>
        <div class="data_list">
          <div v-for="(item,index) in dataDetail" :key="index">
            <div>
              <span>{{item.data=='unionIncome'||item.data=='getReward'||item.data=='commerceIncome'?'￥':''}}{{liveDetail[item.data]}}</span>
              <span>{{item.type}}</span>
            </div>
            <img :src="item.img" alt="">
          </div>
        </div>
      </div>
      <div class="live_content">
        <div class="live_content_top">
          <div class="live_video">
            <div class="live_info">
              <div>
                直播间ID：{{liveDetail.liveStream&&liveDetail.liveStream.Data.RoomId}}
              </div>
              <div>

              </div>
            </div>
            <video-flv-component :url="videoUrl" class="live_video_flv"></video-flv-component>
          </div>
          <div class="charts_title_box">
            <div class="charts_title">
              <div class="title">直播趋势</div>
              <div>
                <div>直播间观看人数：{{cumulativeNum}}</div>
                <div>在线人数：{{liveTrendsY[liveTrendsY.length-1]}}</div>
              </div>
            </div>
            <div id="live_trends"></div>
          </div>
        </div>
        <div class="live_content_bottom">
          <div class="charts_title_box">
            <div class="charts_title">
              <div class="title">带货分析</div>
              <div>
                <div>带货数量</div>
                <div>带货收入</div>
              </div>
            </div>
            <div id="cargo_analysis">

            </div>
          </div>
          <div class="charts_title_box">
            <div class="charts_title">
              <div class="title">打赏分析</div>
              <div>
                <div>礼物数量</div>
                <div>打赏收入</div>
              </div>
            </div>
            <div id="reward_analysis">

            </div>
          </div>
        </div>
      </div>
    </el-card>
</template>

<script>
import VideoFlvComponent from "@/components/common/videoFlvComponent.vue"
// import echarts from "echarts"
import * as echarts from 'echarts';
export default {
  components:{
    VideoFlvComponent,
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
      videoUrl:"",
      isLive:true
    }
  },
  created(){
    this.userId = 'looker_admin'+this.$store.state.user.id
    this.userName = 'looker_userName'+this.$store.state.user.id
  },
  activated(){
    this.getliveDetail()
    this.getLiveTrends()
    this.getCommerceIncome()
    this.getGetReward()
  },
  methods:{
    getLiveTrends(){ //直播趋势
      this.$http.get(`/sys/liveListSupervisory/getLiveOnlineNumTrend/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        res.data.forEach(item=>{
          this.liveTrendsX.push(item.createDate)
          this.liveTrendsY.push(Number(item.onlineNum))
        })
        this.cumulativeNum = res.data[res.data.length-1].cumulativeNum
        console.log(this.liveTrendsX,this.liveTrendsY,'/直播趋势')
        this.initEcharts()
      })
    },
    getCommerceIncome(){ //带货分析
      this.$http.get(`/sys/liveListSupervisory/getCommerceIncome/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        console.log(res)
      })
    },
    getGetReward(){ //打赏分析
      this.$http.get(`/sys/liveListSupervisory/getGetReward/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        console.log(res)
      })
    },
    getliveDetail(){
      this.$http.get(`/sys/liveListSupervisory/getDetailed/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        this.liveDetail = res.data
        this.videoUrl = res.data.liveStream.Data.PlayInfo[0].FLV
      })
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
          trigger: 'axis',
          axisPointer:{
             axis:'y'
          }
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
            data: this.liveTrendsY,
            type: 'line'
          }
        ]
      };
      option && myChart.setOption(option);
    },
  },
  mounted(){
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
      }
    }
    .charts_title_box{
      height: 100%;
      .charts_title{
        height: 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        .title{
          font-size: 20px;
          font-weight: bold;
        }
        >div:last-child{
          display: flex;
        }
      }
      #live_trends{
        height: 90%;
      }
    }
  }
  .live_content_bottom{
    .charts_title_box{
      height: 100%;
      .charts_title{
        height: 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        .title{
          font-size: 20px;
          font-weight: bold;
        }
        >div:last-child{
          display: flex;
        }
      }
      #live_trends{
        height: 90%;
      }
    }
  }

  .live_video_flv {
    text-align: center;
    video {
      max-height: 395px;
    }
  }
  
}
</style>