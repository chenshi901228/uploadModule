<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input size="small" v-model="dataForm.nickName" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input size="small" v-model="dataForm.phone" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="float:right; padding-right:10px">
              <el-button size="small" type="danger" @click="forbiddenAll()">禁用</el-button>
              <el-button size="small" type="primary" @click="getDataList()">{{ $t("query") }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{ $t("reset") }}</el-button>
              <el-button 
                  size="small" 
                  type="primary"
                  @click="open"
              >
                  {{ isOpen ? "收起" : "展开"}}<i style="margin-left:10px" :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="是否认证">
          <el-select v-model="dataForm.status">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否是指导师">
          <el-select v-model="dataForm.status">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </el-form-item> -->
        <div v-if="isOpen">
          <el-row>
            <el-col :span="6">
              <el-form-item label="邀请人" prop="userId">
                <el-input size="small" v-model="dataForm.userId" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邀请人号码" prop="userId">
                <el-input size="small" v-model="dataForm.userId" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="delFlg">
                <el-select size="small" v-model="dataForm.delFlg" clearable>
                  <el-option value="1" label="禁用"></el-option>
                  <el-option value="0" label="正常"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="avatarUrl"
          label="用户头像"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.avatarUrl"
              alt=""
              style="width: 75px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="用户昵称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="payAt"
          label="是否认证"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="是否是指导师"
          header-align="center"
          align="center"
        ></el-table-column> -->
        <el-table-column
          prop="aaa1"
          label="邀请人"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="aaa2"
          label="邀请人号码"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="注册时间"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.delFlg ? "禁用" : "正常" }}</div>
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
            <el-button type="text" size="small" @click="openDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="!scope.row.delFlg"
              @click="forbidden(scope.row.id)"
              >禁用</el-button
            >
            <el-button
              type="text"
              size="small"
              v-else
              @click="forbidden(scope.row.id)"
              >解除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
        getDataListURL: "/sys/manage/weixinUser/page",
        getDataListIsPage: true,
        deleteURL: "/sys/pay/order",
        deleteIsBatch: true,
      },
      dataForm: {
        nickName: "",
        phone: "",
        delFlg: "",
      },
      dataList: [{ createDate: 1 }],
      userId: "",

     
      otherViewHeight: 0, //搜索栏高度
      isOpen: false //搜索栏展开/收起
    };
  },
  components: { Template },
  computed: {
    documentClientHeight: {
      get() {
          return this.$store.state.documentClientHeight;
      },
    },
    siteContentViewHeight() {
      var height = this.documentClientHeight - this.otherViewHeight - ( 50 + 40 + 30 + 40 + 47 );
      return height;
    },
  },
  watch: {
    isOpen() {
        this.setOtherViewHeight()
    }
  },
  activated() {
    this.setOtherViewHeight()
    this.$nextTick(()=>{
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 搜索栏高度设置
    setOtherViewHeight() {
      setTimeout(() => {
          if(document.querySelector(".headerTool")) {
              let h = document.querySelector(".headerTool").getBoundingClientRect().height
              this.otherViewHeight = Math.ceil(h)
          }
      },150)
    },
    // 搜索栏收起/展开
    open() {
      this.isOpen = !this.isOpen
    },
    // 打开用户详情弹窗
    openDetail(data) {
        this.$router.push({
        name: "userManagement-userDetail",
        params:{data:data}
      })

    },


    forbiddenAll() {
      console.log(this.dataListSelections);
    },
    // 禁用，解除用户
    forbidden(id) {},
  },
};
</script>
<style  scoped>
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

</style>