<template>
  <div>
    <div class="diaBox">
      <div class="diaBoxLeft">
        <div class="diaBoxLeft_title">基本信息</div>
        <div class="diaBoxLeft_mes">
          <el-avatar
            :size="75"
            :src="diaForm.avatarUrl"
            fit="cover"
            style="margin: 0px 85px 10px"
          ></el-avatar>
          <div>用户昵称：{{ diaForm.nickName }}</div>
          <!-- <div>是否认证：{{ diaForm.nickName }}</div>
              <div>是否指导师：{{ diaForm.nickName }}</div> -->
          <div>邀请注册：{{ diaForm.createBy }}</div>
          <div>TA邀请人：{{ diaForm.inviteUserName }}</div>
          <div>注册时间：{{ diaForm.createDate }}</div>
        </div>

        <div class="diaBoxLeft_title">账户信息</div>
        <div class="diaBoxLeft_mes">
          <div>
            累计消费：￥{{
              diaForm.priceConsumption ? diaForm.priceConsumption : 0
            }}元
          </div>
          <div>
            累计充值：￥{{
              diaForm.priceRecharge ? diaForm.priceRecharge : 0
            }}元
          </div>
          <div>购买商品消费：￥{{ diaForm.shoppingConsumption || 0 }}元</div>
          <div>
            可用大豆：{{ diaForm.priceBalance ? diaForm.priceBalance : 0 }}大豆
          </div>
          <div>刷礼物消费：{{ diaForm.giftConsumption || 0 }}大豆</div>
          <div>粉丝团加入消费：{{ diaForm.fansConsumption || 0 }}大豆</div>
        </div>
      </div>
      <div class="diaBoxRight">
        <div style="display: flex">
          <div
            class="diaBoxRight_tabBtns"
            @click="changeTbas(1)"
            :class="{ 'is-active': diaTbas === 1 }"
          >
            充值记录
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
            加入粉丝团
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
          :style="{ margin: '20px' }"
          :model="diaSearchForm"
          @keyup.enter.native="queryPost_dia()"
          size="small"
          ref="searchForm"
        >
          <el-form-item label="支付方式" v-if="diaTbas === 1" prop="payType">
            <el-select size="small" v-model="diaSearchForm.payType" clearable>
              <el-option :value="1" label="微信"></el-option>
              <el-option :value="2" label="支付宝"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充值来源" v-if="diaTbas === 1" prop="paySource">
            <el-select size="small" v-model="diaSearchForm.paySource" clearable>
              <el-option :value="1" label="小程序端"></el-option>
              <el-option :value="2" label="大于众学"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="礼物名称" v-if="diaTbas === 2" prop="name">
            <el-input
              size="small"
              v-model="diaSearchForm.name"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="消费来源" v-if="diaTbas === 2" prop="paySource">
            <el-select size="small" v-model="diaSearchForm.paySource" clearable>
              <el-option :value="1" label="小程序端"></el-option>
              <el-option :value="2" label="大于众学"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="粉丝团名称"
            v-if="diaTbas === 4 || diaTbas === 5"
            prop="title"
          >
            <el-input
              size="small"
              v-model="diaSearchForm.title"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="主播昵称" v-if="diaTbas === 4 || diaTbas === 5" prop="anchorName">
            <el-input
              size="small"
              v-model="diaSearchForm.anchorName"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" v-if="diaTbas === 4 || diaTbas === 5" prop="phone">
            <el-input
              size="small"
              v-model="diaSearchForm.phone"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品名称" v-if="diaTbas === 3" prop="productName">
            <el-input
              size="small"
              v-model="diaSearchForm.productName"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品类型" v-if="diaTbas === 3" prop="productType">
            <el-input
              size="small"
              v-model="diaSearchForm.productType"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="是否免费" v-if="diaTbas === 3" prop="isFree">
            <el-select size="small" v-model="diaSearchForm.isFree" clearable>
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联商品编号" v-if="diaTbas === 3" prop="productId">
            <el-input
              size="small"
              v-model="diaSearchForm.productId"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="使用状态" v-if="diaTbas === 3" prop="useStatus">
            <el-select size="small" v-model="diaSearchForm.useStatus" clearable>
              <el-option :value="0" label="未使用"></el-option>
              <el-option :value="1" label="已使用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="diaTbas !== 6">
            <el-button type="primary" size="small" @click="queryPost_dia()">{{
              $t("query")
            }}</el-button>
            <el-button @click="mainReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="diaDataList"
          border
          style="width: 100%"
          height="calc(calc(100vh - 340px) - 2px)"
        >
          <template v-for="(label, prop) in diaTableTitle">
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              show-overflow-tooltip
              v-if="prop === 'paySource'"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.paySource === 1 ? "小程序" : "大于众学" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              show-overflow-tooltip
              v-else-if="prop === 'payType'"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.paySource === 1 ? "微信" : "支付宝" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              show-overflow-tooltip
              v-else-if="prop === 'userTyoe'"
            >
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.userTyoe === 1
                      ? "会长"
                      : scope.row.userTyoe === 2
                      ? "副会长"
                      : "普通会员"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              show-overflow-tooltip
              v-else-if="prop === 'shareType'"
            >
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.shareType === 0
                      ? "预告分享"
                      : scope.row.shareType === 1
                      ? "直播邀请"
                      : scope.row.shareType === 2
                      ? "视频分享"
                      :'其他分享'
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              show-overflow-tooltip
              v-else-if="prop === 'isFree'"
            >
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.isFree === 0
                      ? "否"
                      : "是"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              show-overflow-tooltip
              v-else-if="prop === 'useStatus'"
            >
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.useStatus === 0
                      ? "未使用"
                      : "已使用"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              v-else-if="prop === 'productImage'"
            >
              <template slot-scope="scope">
                <img :src="scope.row.productImage" style="width: 75px; height: 50px;" alt="">
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              v-else-if="prop === 'shareState'"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.shareState === 0
                      ? "失败"
                      : '成功'
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              v-else-if="prop === 'successEvent'"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.successEvent === 0
                      ? "新人注册"
                      : scope.row.successEvent === 1
                      ? "进入直播"
                      : scope.row.successEvent === 2
                      ? "预约直播"
                      : '观看视频'
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="prop"
              :label="label"
              :key="prop"
              header-align="center"
              align="center"
              show-overflow-tooltip
              v-else
            >
            </el-table-column>
          </template>
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
  </div>
</template>

<script>
export default {
  name: "LiveWebmanageUserdetail",
  data() {
    return {
      userId: "",
      diaForm: {},
      diaTbas: 1,
      diaSearchForm: {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        phone: "",
      },
      diaDataList: [],
      diaTableTitle: {
        price: "充值大豆",
        amount: "支付金额",
        payType: "支付方式",
        paySource: "充值来源",
        createDate: "充值时间",
      },
      page_dia: 1, // 当前页码
      limit_dia: 10, // 每页数
      total_dia: 0,
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userId = JSON.parse(window.localStorage.getItem("userDetailData")).id;
      vm.$http
        .get(
          `/sys/manage/userDetail/${
            JSON.parse(window.localStorage.getItem("userDetailData")).id
          }`
        )
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return vm.$message.error(res.msg);
          }
          vm.diaForm = {
            ...res.data,
            ...JSON.parse(window.localStorage.getItem("userDetailData")),
            // priceConsumption:res.data.priceConsumption,
            // priceConsumption:res.data.priceConsumption,
          };
        })
        .catch(() => {});
      vm.changeTbas(1);
    });
  },
  methods: {
    changeTbas(n) {
      this.diaTbas = n;
      this.diaSearchForm = {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        phone: "",
        useStatus:"",
        productName:"",
        productId:"",
        productType:"",
        isFree:"",
      };
      this.diaDataList = [];
      this.total_dia = 0;
      this.page_dia = 1;
      switch (n) {
        case 1:
          this.diaTableTitle = {
            price: "充值大豆",
            amount: "支付金额",
            payType: "支付方式",
            paySource: "充值来源",
            createDate: "充值时间",
          };
          break;
        case 2:
          this.diaTableTitle = {
            name: "礼物名称",
            giftNum: "数量",
            price: "礼物单价",
            allPrice: "消费合计",
            payType: "支付方式",
            paySource: "消费来源",
            createDate: "创建时间",
          };
          break;
        case 3:
          this.diaTableTitle = {
            productImage: "商品图片",
            productName: "商品名称",
            productType: "商品类型",
            isFree: "是否免费",
            price: "销售价格",
            payPrice: "支付金额",
            payType: "支付方式",
            consumptionSource: "消费来源",
            productId: "关联产品编号",
            payDate: "购买时间",
            useStatus: "使用状态",
          };
          break;
        case 4:
          this.diaTableTitle = {
            title: "粉丝团名称",
            anchorName: "主播",
            phone: "手机号码",
            userTyoe: "粉丝团身份",
            createDate: "创建时间",
          };
          break;
        case 5:
          this.diaTableTitle = {
            title: "粉丝团名称",
            anchorName: "主播",
            phone: "手机号码",
            type: "消费类型",
            price: "支付金额",
            payType: "支付方式",
            paySource: "消费来源",
            createDate: "创建时间",
          };
          break;
        case 6:
          this.diaTableTitle = {
            shareType: "分享类型",
            shareUrl: "页面路由",
            createDate: "创建时间",
            shareState: "分享状态",
            successEvent: "成功事件",
            passiveShareUserName: "被分享人",
            passiveShareUserTel: "手机号码",
          };
          break;

        default:
          break;
      }
      this.queryPost_dia();
    },
    // 获取跟进记录列表数据
    queryPost_dia() {
      let data, url;

      switch (this.diaTbas) {
        case 1:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            paySource: this.diaSearchForm.paySource,
            payType: this.diaSearchForm.payType,
          };
          url = "/sys/user/consumption/selectUserAddPage";
          break;
        case 2:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            paySource: this.diaSearchForm.paySource,
            name: this.diaSearchForm.name,
          };
          url = "/sys/user/consumption/selectUserGiftPage";
          break;
        case 3:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            useStatus:this.diaSearchForm.useStatus,
            productName:this.diaSearchForm.productName,
            productId:this.diaSearchForm.productId,
            productType:this.diaSearchForm.productType,
            isFree:this.diaSearchForm.isFree,
          };
          url = "/sys/management/user/product/userOrderWithDetailPage";
          break;
        case 4:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            phone: this.diaSearchForm.phone,
            anchorName: this.diaSearchForm.anchorName,
            title: this.diaSearchForm.title,
          };
          url = "/sys/manage/weixinUser/anchor/fans/anchorFansInfoPage";
          break;
        case 5:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            weixinUserId: this.userId,
            phone: this.diaSearchForm.phone,
            anchorName: this.diaSearchForm.anchorName,
            title: this.diaSearchForm.title,
          };
          url = "/sys/user/consumption/selectUserJoinFansPage";
          break;
        case 6:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            shareUserId: this.userId,
          };
          url = "/sys/liveShare/page";
          break;

        default:
          break;
      }
      this.$http
        .get(url, {
          params: data,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.diaDataList = [];
            this.total_dia = 0;
            return this.$message.error(res.msg);
          }
          this.diaDataList = res.data.list;
          this.total_dia = res.data.total;
        })
        .catch(() => {});
    },

    // 主页搜索重置
    mainReset() {
      this.$refs.searchForm.resetFields()
      this.queryPost_dia()
    },

    // 重置搜索条件
    resetDataForm() {
      this.$refs.dataForm.resetFields();
      this.getDataList();
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

<style lang="scss" scoped>
.diaBox {
  height: calc(calc(100vh - 50px - 66px) - 2px);
  position: relative;
  background: #fff;
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