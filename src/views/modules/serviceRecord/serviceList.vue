<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        size="small"
        @keyup.enter.native="getDataList()"
      >
        <el-descriptions column="4">
          <el-descriptions-item label="主播昵称">{{info.sendUserName}}</el-descriptions-item>
          <el-descriptions-item label="主播手机号码">{{info.sendUserPhone}}</el-descriptions-item>
          <el-descriptions-item label="用户昵称">{{info.toUserName}}</el-descriptions-item>
          <el-descriptions-item label="用户手机号码">{{info.toUserPhone}}</el-descriptions-item>
        </el-descriptions>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <!-- <el-button 
                type="warning"
                plain
                icon="el-icon-download" 
                size="mini"
                @click="exportHandle">{{ $t("export") }}</el-button> -->
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="query"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          prop="sendUserName"
          label="昵称"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sendUserPhone"
          label="手机号码"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="msgContent"
            label="聊天内容"
            min-width="200px"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <img v-if="row.msgType=='TIMImageElem'" style="width:70px;height:70px;" :src="row.msgContent" alt="">
            <span v-else>{{row.msgContent}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="200"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              icon="el-icon-view"
              @click="lookHandle(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
      <el-dialog
        title="查看"
        :visible.sync="dialogVisible"
        width="30%"
      >
       <el-descriptions column="1" content-class-name="my-content">
          <el-descriptions-item label="昵称">{{content.sendUserName}}</el-descriptions-item>
          <el-descriptions-item label="手机号码">{{content.sendUserPhone}}</el-descriptions-item>
          <el-descriptions-item label="聊天内容">
            <img v-if="content.msgType=='TIMImageElem'" style="max-width:300px;max-height:300px;" :src="content.msgContent" alt="">
            <span v-else>{{content.msgContent}}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import { addDynamicRoute } from "@/router";
import Template from "../devtools/template.vue";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/imCallback/getInfoDetailPage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/imCallback/exportDetailList",
      },
      dataForm: {
        sendUserId:JSON.parse(this.$route.query.info).sendUserId,
        toUserId:JSON.parse(this.$route.query.info).toUserId,
      },
      dataList: [],
      userId: "",
      info:{},
      dialogVisible:false,
      content:{},
    };
  },
  components: { Template },
  created(){
    let info = JSON.parse(this.$route.query.info)
    this.info = info
    console.log(this.info)
  },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    lookHandle(row){
      this.content = row
      this.dialogVisible = true
    }
  },
};
</script>
<style lang="scss" scoped>
.forbiddenAllBtn {
  width: 120px;
  height: 35px;
  background: #409eff;
  border-radius: 5px;
  color: #fff;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  margin: 10px 0;
}
/deep/ .my-content{
  width: 80%;
}
</style>