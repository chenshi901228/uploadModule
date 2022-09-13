<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        label-position="right"
        @keyup.enter.native="getAssistantListDetail()"
      >
        <el-form-item
          label="主播昵称"
          prop="userName"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.userName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phone"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>

        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getAssistantListDetail"
              >{{ $t("query") }}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetDataForm()"
              >{{ $t("reset") }}</el-button
            >
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <!-- <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left" style="display:flex;alignItems:center;">
            <span>助手昵称：{{assistantInfo.userName}}</span>
            <span style="marginLeft:10px">手机号码：{{assistantInfo.phone}}</span>
          </div>
        </div> -->
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <!-- <el-button 
              type="warning"
              plain
              icon="el-icon-download" 
              size="mini"
              @click="exportHandle">{{ $t("export") }}</el-button> -->
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
        <!-- <div class="header-assistant">
          <span>助手昵称：{{assistantInfo.userName}}</span>
          <span style="marginLeft:60px">手机号码：{{assistantInfo.phone}}</span>
        </div> -->
        <div class="detalilBox_top" style="display:flex;">
          <div style="border:1px solid #E7EBF5;width: 100%">
            <el-descriptions class="margin-top" :column="2" size="small" border>

              <el-descriptions-item>
                <template slot="label">
                  <div style="font-weight:bold">用户昵称</div>
                </template>
                {{ assistantInfo.userName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <div style="font-weight:bold">手机号码</div>
                </template>
                {{ assistantInfo.phone }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-form>
      <el-table
        :data="dataList"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          show-overflow-tooltip
          prop="userName"
          label="主播昵称"
          width="400"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="phone"
          label="手机号码"
          
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createDate"
          label="创建时间"
          width="400"
          header-align="center"
          align="center"
        ></el-table-column>
        
      </el-table>
      <el-pagination
        background
        :current-page="dataForm.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="dataForm.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import Template from "../devtools/template.vue";
export default {
  data() {
    return {
      dataForm: {
        limit:10,
        page:1,
        userName: "",
        phone: "",
        weixinUserId:'',
      },
      dataList: [],
      total:0,
      assistantInfo:{}
    };
  },
  components: { Template },
  activated(){
    this.assistantInfo = JSON.parse(this.$route.query.info)
    this.dataForm.weixinUserId = this.assistantInfo.weixinUserId
    this.getAssistantListDetail()
  },
  created(){
  },
  methods: {
    getAssistantListDetail(){
      this.$http.get('/sys/manage/weixinUser/anchor/fans/assistantAnchorPage',{params:this.dataForm}).then(res=>{
        if(res.data.code===0){
          this.dataList = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    query(){
      this.getAssistantListDetail()
    },

    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.dataForm.page = 1
      this.dataForm.limit = val
      this.getAssistantListDetail()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getAssistantListDetail()
    },
    resetDataForm(){
      this.dataForm.userName = ''
      this.dataForm.phone = ''
      this.dataForm.limit = 10
      this.dataForm.page = 1
      this.getAssistantListDetail()
    }
  },
};
</script>

<style lang="scss" scoped>
  .detalilBox_top {
    background: #fff;
    padding: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1600);
    border-radius: 6px;
    margin-bottom: 20px;
  }
</style>