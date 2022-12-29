<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-weixin__sysanchorinfo">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item v-show="isOpen || formItemCount >= 1" label="真实姓名" prop="realName">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.realName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 2" label="手机号码" prop="phone">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 3" label="身份证号" prop="idCard">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.idCard"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 4" label="性别" prop="gender">
          <el-select 
            style="width: 200px"
            placeholder="请选择" 
            v-model="dataForm.gender" 
            clearable>
            <el-option :value="0" label="男"></el-option>
            <el-option :value="1" label="女"></el-option>
            <el-option :value="2" label="保密"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 5" label="主播昵称" prop="username">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 6" label="审批状态" prop="status">
          <el-select 
            style="width: 200px"
            placeholder="请选择" 
            v-model="dataForm.status" 
            clearable>
            <el-option :value="0" label="待审批"></el-option>
            <el-option :value="1" label="已通过"></el-option>
            <el-option :value="-1" label="已驳回"></el-option>
            <el-option :value="-2" label="已撤回"></el-option>
          </el-select>
        </el-form-item>
        <!-- 搜索重置展开按钮 -->
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button 
              type="primary" 
              icon="el-icon-search" 
              size="mini"
              @click="getDataList">{{ $t("query") }}</el-button>
            <el-button 
              icon="el-icon-refresh" 
              size="mini" 
              @click="resetDataForm()">{{ $t("reset") }}</el-button>
            <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportHandle">{{ $t("export") }}</el-button>
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
          prop="avatarUrl"
          label="主播头像"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img
              :src="
                scope.row.avatarUrl || require('@/assets/img/default_avatar.png')"
              style="width: 60px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="realName"
          label="真实姓名"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="idCard"
          label="身份证号"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="gender"
          label="性别"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.gender === 0" type="info">男</el-tag>
            <el-tag v-if="scope.row.gender === 1" type="info">女</el-tag>
            <el-tag v-if="scope.row.gender === 2" type="info">保密</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="legalizeFlg"
          label="是否认证"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.legalizeFlg === 1 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="tutorFlg"
          label="是否是指导师"
          header-align="center"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.tutorFlg === 1 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="linkAddress"
          label="通讯地址"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createDate"
          label="申请时间"
          header-align="center"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updateDate"
          label="审批时间"
          header-align="center"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? "-" : scope.row.updateDate }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="authStatusStr"
          label="合约状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ getSignStatus(row.authStatusStr) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="status"
          label="审批状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">待审批</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">已通过</el-tag>
            <el-tag v-if="scope.row.status === -1" type="danger">已驳回</el-tag>
            <el-tag v-if="scope.row.status === -2" type="warning">已撤回</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
           <el-button
              type="text"
              size="mini"
              icon="el-icon-document"
              @click="openDetail(scope.row.id)"
              >查看</el-button
            >
           <el-button
              type="text"
              size="mini"
              icon="el-icon-view"
              @click="signDetails(scope.row.contractId)"
              >查看合约</el-button
            >
           <el-button
              type="text"
              size="mini"
              icon="el-icon-view"
              v-if="scope.row.authStatusStr=='FILLING'"
              @click="againDetails(scope.row.id)"
              >重新签约</el-button
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
    </div>

    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%"
      top="200px"
      center
      >
      <div class="copyDialog">复制签约链接在浏览器打开即可签约：{{detailsUrl}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" style="margin-left:80px" type="primary" @click="copy">复制链接</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/anchor/applyInfo/addPage",
        getDataListIsPage: true,
        exportURL: "/sys/anchor/applyInfo/export?type=1",
      },
      dataForm: {
        realName: "",
        phone: "",
        idCard: "",
        gender: "",
        username: "",
        status: "",
      },
      dialogVisible:false,
      detailsUrl:'',//重新签约链接
    };
  },
  methods: {
    // 合约状态
    getSignStatus(str) {
      let res = ""
      switch(str) {
        case "DRAFT":
            res = "草稿"
            break;
        case "FILLING":
            res = "拟定中"
            break;
        case "SIGNING":
            res = "签署中"
            break;
        case "COMPLETE":
            res = "已完成"
            break;
        case "REJECTED":
            res = "已拒签"
            break;
        case "RECALLED":
            res = "已撤回"
            break;
        case "EXPIRED":
            res = "已过期"
            break;
        case "TERMINATING":
            res = "作废中"
            break;
        case "TERMINATED":
            res = "已作废"
            break;
        case "DELETE":
            res = "已删除"
            break;
        case "FINISHED":
            res = "强制完成"
            break;
        default:
            res = "-"
      }
      return res
    },
    // 查看合约
    signDetails(contractId) {
      if(!contractId) return this.$message.warning("未查询到合约ID")
      this.$http.get(`/sys/anchor/applyInfo/getSignUrlWithView?contractId=${contractId}`).then(({data: res}) => {
        if(res.code == 0) {
          if(res.data && res.data.signUrl) {
            window.open(res.data.signUrl)
          }else {
            this.$message.warning("未查询到合约，联系管理员")
          }
        }else {
          return this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(JSON.stringify(err))
      })
    },
    //重新签约
    againDetails(id){
      this.dialogVisible=true
       this.$http.get(`/sys/anchor/applyInfo/getSignUrlWithUser?id=${id}`).then(({data: res}) => {
        if(res.code == 0) {
          if(res.data && res.data.signUrl) {
            this.detailsUrl=res.data.signUrl
          }else {
            this.$message.warning("未查询到合约，联系管理员")
          }
        }else {
          return this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(JSON.stringify(err))
      })
    },
    //复制签约地址
    copy(){
     // 模拟 输入框
      let cInput = document.createElement("input");
      cInput.value = this.detailsUrl;
      document.body.appendChild(cInput);
      // 选取文本框内容
      cInput.select();
 
      // 执行浏览器复制命令
      // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
      // Input要在正常的编辑状态下原生复制方法才会生效
      document.execCommand("copy");
 
      this.$message({type: "success", message: "复制成功"});
      // 复制成功后再将构造的标签 移除
      document.body.removeChild(cInput);
      this.dialogVisible=false
    },
    // 打开信息审批详情
    openDetail(id) {
      this.$router.push({
        path: "/anchor-sysanchorinfoDetail",
        query:{id}
      });
      // window.localStorage.setItem("sysanchorinfoDetailData", JSON.stringify(data));
    },
  },
   mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
 
};
</script>
<style lang="scss" scoped>
.copyDialog{
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
