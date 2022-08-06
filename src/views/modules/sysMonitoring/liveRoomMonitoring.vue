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
        @keyup.enter.native="getDataList"
      >
        <el-form-item
          v-if="isOpen || formItemCount >= 1"
          label="主播昵称"
          prop="liveTheme"
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
          v-if="isOpen || formItemCount >= 2"
          label="手机号码"
          prop="assistant"
        >
          <el-input
            size="small"
            style="width: 200px"
            v-model.trim="dataForm.assistant"
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
            v-model.trim="dataForm.assistant"
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
            v-model="dataForm.dynamicGroupName"
            placeholder="请选择"
            :loading="getDynamicGroupLoading"
            @visible-change="getDynamicGroup"
            clearable
          >
            <el-option
              v-for="item in dynamicGroupOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
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
              @click="getDataList"
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
                  @click="query"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="content">
        <div class="live_list" v-for="i in 6" :key="i">
          <div class="header">
            <div class="anchor_info">
              <img src="" alt="">
              <div>
                <span>戴东</span>
                <span>{{458}}粉丝</span>
              </div>
            </div>
            <div class="net_status">
              信号一般
            </div>
          </div>
          <div class="live_detail">
            <div class="live_theme">萨达萨达萨达萨达萨达</div>
            <div class="live_detail_bottom">
              <span>直播间ID：</span>
              <div>
                <i class="el-icon-edit"></i>
                <span>详情</span>
              </div>
            </div>
          </div>
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
           dataForm:{
            
           }
        };
    },
    activated() {
      
    },
    methods: {
     

        
    },
};
</script>
<style lang="scss" scoped>
.content{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .live_list{
    width: 23%;
    height: 257px;
    background: #FFFFFF;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1600);
    border-radius: 5px 5px 5px 5px;
    margin-right:2%;
    margin-bottom: 20px;
    padding: 20px 10px;
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
  }
}
</style>