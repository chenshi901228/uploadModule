<!-- 缓存数据 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        label-position="right"
        @keyup.enter.native="getLiveList"
      >
        <el-form-item
          v-if="isOpen || formItemCount >= 1"
          label="主播昵称"
          prop="liveTheme"
        >
          <el-input
            size="small"
            style="width: 200px"
            v-model.trim="dataForm.anchorUser"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 2"
          label="手机号码"
          prop="assistant"
        >
          <el-input
            size="small"
            style="width: 200px"
            v-model.trim="dataForm.anchorTel"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 3"
          label="直播名称"
          prop="startDate"
        >
          <el-input
            size="small"
            style="width: 200px"
            v-model.trim="dataForm.liveTheme"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 4"
          label="直播状态"
          prop="dynamicGroupName"
        >
          <el-select
            size="small"
            style="width: 200px"
            v-model="dataForm.liveStatus"
            placeholder="请选择"
            clearable
          >
            <el-option label="已下播" :value="0"></el-option>
            <el-option label="直播中" :value="1"></el-option>
            <el-option label="已禁播" :value="2"></el-option>
            <el-option label="未直播" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 5"
          label="直播间ID"
          prop="livingRoomId"
        >
          <el-input
            style="width: 200px"
            size="small"
            v-model.trim="dataForm.livingRoomId"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getLiveList"
              >{{ $t("query") }}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetDataForm()"
              >{{ $t("reset") }}</el-button
            >
            <el-button size="mini" plain @click="open">
              <i
                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="top"
              >
                <el-button
                  size="small"
                  icon="el-icon-refresh"
                  circle
                  @click="resetDataForm"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="content">
        <div class="live_list" v-for="(item,index) in liveList" :key="index">
          <div class="header">
            <div class="anchor_info">
              <img :src="item.avatarUrl" alt="">
              <div>
                <span>{{item.anchorUser}}</span>
                <span>{{item.fansNum}}粉丝</span>
              </div>
            </div>
            <div class="net_status">
              {{52}}分钟
            </div>
          </div>
          <div class="live_detail">
            <div class="live_theme">{{item.liveTheme}}</div>
            <div class="live_detail_bottom">
              <span>直播间ID：{{item.livingRoomId}}</span>
              <div @click="toDetail(item)">
                <i class="el-icon-edit"></i>
                <span>详情</span>
              </div>
            </div>
          </div>
          <div class="live_bottom">
            <div class="online_user">
              <span>{{item.maxOnlineNum}}</span>
              <p>在线人数</p>
            </div>
            <div class="sale_num">
              <span>{{item.commerceSale}}</span>
              <p>销售额</p>
            </div>
          </div>
          <div :class="item.liveState==0?'end_live':item.liveState==1?'live_conduct':item.liveState==2?'live_prohibit':'no_live'">{{item.liveState==0?'已下播':item.liveState==1?'直播中':item.liveState==2?'已禁播':'未直播'}}</div>
        </div>
      </div>
      <el-pagination
          background
          :current-page="page"
          :page-sizes="[8, 16, 32, 64]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
        >
        </el-pagination>
    </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
    data() {
        return {
           dataForm:{
            livingRoomId:"",
            liveTheme:"",
            liveStatus:"",
            anchorTel:"",
            anchorUser:""
           },
           page:1,
           limit:8,
           total:0,
           liveList:[]
        };
    },
    activated() {
      this.getLiveList()
    },
    methods: {
      getLiveList(){
        this.$http.get('/sys/liveListSupervisory/page',{
          params:{
            page:this.page,limit:this.limit,...this.dataForm
          }
        }).then(({data:res})=>{
          if(!res.code==0) return this.$message.error(res.msg)
          this.liveList = res.data.list
          this.total = res.data.total
        })
      },
      toDetail(data){
        this.$router.push({
          path: "/sysMonitoring-liveRoomMonitoringDetail",
          query:{id:data.id}
        });
      },
      pageSizeChangeHandle(val){
        this.limit = val
        this.getLiveList()
      },
      pageCurrentChangeHandle(val){
        this.page = val
        this.getLiveList()
      },
      resetDataForm(){
        this.dataForm = {
          livingRoomId:"",
          liveTheme:"",
          liveStatus:"",
          anchorTel:"",
          anchorUser:""
        }
        this.page = 1
        this.getLiveList()
      }
    },
};
</script>
<style lang="scss" scoped>
.content{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  p{
    padding: 0;
    margin: 0;
  }
  .live_list{
    width: 23%;
    height: 257px;
    background: #FFFFFF;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1600);
    border-radius: 5px;
    margin-right:2%;
    margin-bottom: 20px;
    padding: 20px 10px;
    position: relative;
    .header{
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .anchor_info{
        display: flex;
        >img{
          width: 60px;
          height: 60px;
          margin-right: 10px;
        }
        >div{
          height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          >span:first-child{
            color: #475062;
            font-size: 15px;
          }
          >span:nth-child(2){
            color: #B9BDC6;
            font-size: 13px;
          }
        }
        .net_status{
          font-size: 14px;
        }
      }
    }
    .live_detail{
      width: 100%;
      background: #F4F5FE;
      border-radius: 5px; 
      display: flex;
      flex-direction: column;
      padding: 14px 10px;
      justify-content: space-between;
      margin-top: 20px;
      .live_theme{
        color: #475062;
        font-size: 14px;
      }
      .live_detail_bottom{
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        >span{
          color: #B9BDC6;
          font-size: 12px;
        }
        >div{
          color: #3558CC;
          font-size: 12px;
        }
      }
    }
    .live_bottom{
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      >div{
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        >span{
          color: #475062;
          font-size: 20px;
        }
        >p{
          color: #000000;
          font-size: 12px;
        }
      }
      .online_user{
        border-right: 1px solid #F8F8F9;
      }
    }
    >div:last-child{
      position: absolute;
      top: 0;
      right: 0;
      height: 20px;
      font-size: 12px;
      color: #FFFFFF;
      padding: 2px 7px;
      border-bottom-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    .end_live{
      background-color: #EE2B2D;
    }
    .live_conduct{
      background-color: #00C106;
    }
    .live_prohibit{
      background-color: #00C106;
    }
    .no_live{
      background-color: #00C106;
    }
  }
}
</style>