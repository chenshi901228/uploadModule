<!--基础管理-上架商品-->

<template>
  <div>
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
          label="姓名"
          prop="username"
          v-if="isOpen || formItemCount >= 1"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.username"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phone"
          v-if="isOpen || formItemCount >= 2"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.phone"
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
            <el-form-item>
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="dialogVisible = true"
                >生成验证码</el-button
              >
            </el-form-item>
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
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        :height="siteContentViewHeight"
        style="width: 100%"
      >
        <el-table-column
          header-align="center"
          align="center"
          v-for="item in tableItem"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <!-- 封面图 -->
            <div v-if="item.prop == 'frontCoverUrl'">
              
            </div>
            <!-- 是否创建预告 -->
            <span v-else-if="item.prop == 'frompreview'">
              <el-tag size="small" :type="row.frompreview ? 'success' : 'danger'">{{
                row.frompreview ? "是" : "否"
              }}</el-tag>
            </span>
            <span v-else>
              {{ row[item.prop] || "-" }}
            </span>
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
    </el-card>
    <el-dialog
      title="生成验证码"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :rules="rules" ref="ruleForm" size="mini" label-width="80px" :model="formLabelAlign">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formLabelAlign.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formLabelAlign.region" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="formLabelAlign.type" disabled>
            <el-button type="primary" slot="append">生成验证码</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="generateCode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  components: {
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/liveDeleteRecord/page", // 数据列表接口，API地址
        exportURL: "/sys/liveDeleteRecord/export", // 导出接口，API地址
      },
      dataForm: {
        username:"",
        phone:"",
      },

      tableItem: [
        { prop: "frontCoverUrl", label: "姓名" },
        { prop: "liveTheme", label: "手机号码" },
        { prop: "username", label: "验证码" },
        { prop: "phone", label: "使用状态" },
        { prop: "assistant", label: "失效状态" },
        { prop: "liveTime", label: "生成时间" },
      ],
      dialogVisible: false,
      formLabelAlign:{

      },
      rules:{
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
      }
    };
  },
  activated() {
    this.query();
  },
  methods: {
    generateCode(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-input-group__append{
  background-color:#3558cc;
  color: #fff;
}
</style>