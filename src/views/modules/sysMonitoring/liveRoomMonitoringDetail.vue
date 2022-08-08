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
            <!-- <videoFlvComponent :url="liveDetail.liveStream&&liveDetail.liveStream.Data.PlayInfo[0].FLV"></videoFlvComponent> -->
            <!-- <video autoplay muted id="videoEle"></video> -->
            <aliplayer v-if="videoUrl" class="aliplayer_box" ref="player" :autoplay="true" :isLive="isLive" :rePlay="false" showBuffer="false" showBarTime="5000" format="flv" 
            :source="videoUrl"></aliplayer>
            {{liveDetail.liveStream&&liveDetail.liveStream.Data.PlayInfo[0].FLV}}
          </div>
          <div id="live_trends" ref="liveTrends"></div>
        </div>
        <div class="live_content_bottom">
          <div id="cargo_analysis">

          </div>
          <div id="reward_analysis">

          </div>
        </div>
      </div>
    </el-card>
</template>

<script>
import videoFlvComponent from "@/components/common/videoFlvComponent.vue"
import Aliplayer from "@/components/common/Aliplayer.vue"
import echarts from "echarts"
export default {
  components:{
    videoFlvComponent,
    Aliplayer
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
      liveTrends:null,
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
  },
  methods:{
    getliveDetail(){
      this.$http.get(`/sys/liveListSupervisory/getDetailed/${this.$route.query.id}`).then(({data:res})=>{
        if(!res.code==0) return this.$message.error(res.msg)
        this.liveDetail = res.data
        this.videoUrl = res.data.liveStream.Data.PlayInfo[0].FLV
      })
    },
    // initEcharts(){
    //   this.liveTrends = echarts.init(this.$refs.liveTrends, "liveTrends");
    //   console.log(this.liveTrends)
      // this.liveTrends.setOption({
      //   tooltip: {
      //       trigger: "item",
      //       formatter: "{a} <br/>{b} : {c} ({d}%)",
      //   },
      //   series: [
      //       {
      //           name: "命令",
      //           type: "pie",
      //           roseType: "radius",
      //           colorBy: "data",
      //           radius: [15, 95],
      //           center: ["50%", "38%"],
      //           // data: res.data.commandStats,
      //           animationEasing: "cubicInOut",
      //           animationDuration: 1000,
      //       }
      //   ]
      // });
    // },
   
  },
  mounted(){
  },
}
</script>

<style lang="scss" scoped>
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
    
  }
  
}
</style>