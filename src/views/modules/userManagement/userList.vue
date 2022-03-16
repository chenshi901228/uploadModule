<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item label="用户昵称">
          <el-input v-model="dataForm.orderId" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="dataForm.userId" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否认证">
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
        </el-form-item>
        <el-form-item label="邀请人">
          <el-input v-model="dataForm.userId" clearable></el-input>
        </el-form-item>
        <el-form-item label="邀请人号码">
          <el-input v-model="dataForm.userId" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dataForm.status">
            <el-option value="1" label="正常"></el-option>
            <el-option value="0" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="orderId"
          label="用户头像"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.status"
              alt=""
              style="width: 75px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="payAmount"
          label="用户昵称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="手机号码"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
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
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="邀请人"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createDate"
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
        ></el-table-column>
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
              size="small"
              @click="openDetail(scope.row.id)"
              >详情</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteHandle(scope.row.id)"
              >禁用</el-button
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
      <!-- 弹窗, 详情-->
      <el-dialog
        title="用户详情"
        :visible.sync="dialogVisible"
        width="90%"
        :before-close="handleClose"
      >
        <div class="diaBox">
          <div class="diaBoxLeft">
            <div class="diaBoxLeft_title">基本信息</div>
            <div class="diaBoxLeft_mes">
              <el-avatar
                :size="75"
                :src="diaForm.url"
                style="margin: 0px 85px 10px"
              ></el-avatar>
              <div>用户昵称：{{ diaForm.nickName }}</div>
              <div>是否认证：{{ diaForm.nickName }}</div>
              <div>是否指导师：{{ diaForm.nickName }}</div>
              <div>邀请注册：{{ diaForm.nickName }}</div>
              <div>TA邀请人：{{ diaForm.nickName }}</div>
              <div>注册时间：{{ diaForm.nickName }}</div>
            </div>

            <div class="diaBoxLeft_title">账户信息</div>
            <div class="diaBoxLeft_mes">
              <div>累计消费：{{ diaForm.nickName }}</div>
              <div>刷礼物消费：{{ diaForm.nickName }}</div>
              <div>粉丝团加入消费：{{ diaForm.nickName }}</div>
              <div>购买商品消费：{{ diaForm.nickName }}</div>
              <div>可用大豆余额：{{ diaForm.nickName }}</div>
            </div>
          </div>
          <div class="diaBoxRight">
            <div style="display: flex">
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(1)"
                :class="{ 'is-active': diaTbas === 1 }"
              >
                充值方式
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(2)"
                :class="{ 'is-active': diaTbas === 2 }"
              >
                礼物记录
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(3)"
                :class="{ 'is-active': diaTbas === 3 }"
              >
                商品记录
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(4)"
                :class="{ 'is-active': diaTbas === 4 }"
              >
                记入粉丝团
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(5)"
                :class="{ 'is-active': diaTbas === 5 }"
              >
                粉丝团消费
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(6)"
                :class="{ 'is-active': diaTbas === 6 }"
              >
                分享记录
              </div>
            </div>
            <el-form
              :inline="true"
              :style="{ margin: '20px', 'text-align': 'right' }"
              :model="diaSearchForm"
              @keyup.enter.native="getDataList()"
            >
              <el-form-item label="支付方式">
                <el-select v-model="dataForm.status">
                  <el-option value="1" label="微信"></el-option>
                  <el-option value="0" label="支付宝"></el-option>
                  <el-option value="2" label="API"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值来源">
                <el-select v-model="dataForm.status">
                  <el-option value="1" label="小程序端"></el-option>
                  <el-option value="0" label="大于众学"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="getDataList()">{{ $t("query") }}</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="diaDataList"
              border
              style="width: 100%"
              height="270px"
            >
              <el-table-column
                :prop="prop"
                v-for="(label, prop) in diaTableTitle"
                :key="prop"
                :label="label"
                header-align="center"
                align="center"
              >
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="page_dia"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="limit_dia"
              :total="total_dia"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="pageSizeChangeHandle_dia"
              @current-change="pageCurrentChangeHandle_dia"
            >
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import { addDynamicRoute } from "@/router";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "",
        getDataListIsPage: true,
        deleteURL: "/sys/pay/order",
        deleteIsBatch: true,
      },
      dataForm: {
        orderId: "",
        status: "",
        userId: "",
      },
      dataList: [{ createDate: 1 }],
      userId: "",

      // <!-- 弹窗, 详情-->
      dialogVisible: false,
      diaForm: {},
         diaTbas: 1,
      diaSearchForm: {},
      diaDataList: [
        {
          aaa1: "充值大豆",
          aaa2: "支付金额",
          aaa3: "支付方式",
          aaa4: "充值来源",
          aaa5: "充值时间",
        },
      ],
      diaTableTitle: {
        aaa1: "充值大豆",
        aaa2: "支付金额",
        aaa3: "支付方式",
        aaa4: "充值来源",
        aaa5: "充值时间",
      },
      page_dia: 1, // 当前页码
      limit_dia: 10, // 每页数
      total_dia: 0,
   
    };
  },
  components: {},
  methods: {
    // 打开用户详情弹窗
    openDetail(id) {
      this.dialogVisible = true;
      this.userId = id;
      this.queryPost_dia()
    },
    changeTbas(n) {
      this.diaTbas = n;
      switch (n) {
        case 1:
          this.diaTableTitle = {
            aaa1: "充值大豆",
            aaa2: "支付金额",
            aaa3: "支付方式",
            aaa4: "充值来源",
            aaa5: "充值时间",
          };
          break;
          case 2:
          this.diaTableTitle = {
            aaa1: "礼物名称",
            aaa2: "数量",
            aaa3: "礼物单价",
            aaa4: "消费合计",
            aaa5: "支付方式",
            aaa6: "消费来源",
            aaa7: "创建时间",
          };
          break;
          case 3:
          this.diaTableTitle = {
            aaa1: "商品图片",
            aaa2: "商品名称",
            aaa3: "商品类型",
            aaa4: "是否免费",
            aaa5: "销售价格",
            aaa6: "支付金额",
            aaa7: "支付方式",
            aaa8: "消费来源",
            aaa9: "关联产品编号",
            aaa10: "购买时间",
            aaa11: "使用状态",


          };
          break;
          case 4:
          this.diaTableTitle = {
            aaa1: "粉丝团名称",
            aaa2: "主播",
            aaa3: "手机号码",
            aaa4: "粉丝团身份",
            aaa5: "创建时间",
          };
          break;
          case 5:
          this.diaTableTitle = {
            aaa1: "粉丝团名称",
            aaa2: "主播",
            aaa3: "手机号码",
            aaa4: "消费类型",
            aaa5: "支付金额",
            aaa6: "支付方式",
            aaa7: "消费来源",
            aaa8: "创建时间",

          };
          break;
          case 6:
          this.diaTableTitle = {
            aaa1: "分享类型",
            aaa2: "页面路由",
            aaa3: "创建时间",
            aaa4: "分享状态",
            aaa5: "成功事件",
            aaa6: "被分享人",
            aaa7: "手机号码",

          };
          break;

        default:
          break;
      }
    },
     // 获取跟进记录列表数据
    queryPost_dia() {
      let data = {
        page: this.page_dia,
        limit: this.limit_dia,
        projectId: this.diaId,
      };
      this.$http
        .get(
          `record/page?page=${this.page_dia}&limit=${this.limit_dia}&projectId=${this.diaId}`
        )
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dataList_dia = [];
            this.total_dia = 0;
            return this.$message.error(res.msg);
          }
          this.dataList_dia = res.data.list;
          this.total_dia = res.data.total;
        })
        .catch(() => {});
    },
    // 分页, 每页条数
    pageSizeChangeHandle_dia(val) {
      this.page_dia = 1;
      this.limit_dia = val;
      this.queryPost_dia();
    },
    // 分页, 当前页
    pageCurrentChangeHandle_dia(val) {
      this.page_dia = val;
      this.queryPost_dia();
    },
  },
};
</script>
<style  scoped>
.diaBox {
  height: 500px;
  position: relative;
}
.diaBoxLeft {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  bottom: 0;
  overflow: auto;
  padding: 10px;
  border: 5px solid #cccccc69;
}
.diaBoxRight {
  position: absolute;
  top: 0;
  right: 0;
  left: 300px;
  bottom: 0;
  overflow: auto;
  padding: 10px;
  border: 5px solid #cccccc69;
}
.diaBoxLeft_title {
  margin-bottom: 20px;
  border-left: 5px solid #409eff;
  padding-left: 5px;
  line-height: 19px;
  height: 16px;
}
.diaBoxLeft_mes {
  padding: 0 10px 20px 10px;
}

.diaBoxRight_tabBtns {
  border-width: 0px;
  width: 100px;
  height: 45px;
  text-align: center;
  cursor: pointer;
  line-height: 45px;
  background: inherit;
  background-color: rgba(242, 242, 242, 1);
  border: none;
  border-radius: 0px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.is-active {
  background-color: rgba(107, 107, 107, 1);
  color: #fff;
}
</style>