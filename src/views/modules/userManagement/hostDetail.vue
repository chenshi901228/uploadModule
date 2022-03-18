<template>
    <div>
        <div class="diaBoxLeft_title">主播详情</div>
              <div class="diaBox">
          <div class="diaBoxLeft">
            <div class="diaBoxLeft_title">主播信息</div>
            <div class="diaBoxLeft_mes">
              <el-avatar
                :size="75"
                :src="diaForm.avatarUrl"
                style="margin: 0px 85px 10px"
              ></el-avatar>
              <div>主播昵称：{{ diaForm.username }}</div>
              <!-- <div>是否认证：{{ diaForm.nickName }}</div>
              <div>是否指导师：{{ diaForm.nickName }}</div> -->
              <div>真实姓名：{{ diaForm.realName }}</div>
              <div>身份证号：{{ diaForm.idCard }}</div>
              <div>主播简介：{{ diaForm.introduce }}</div>
            </div>

            <div class="diaBoxLeft_title">银行信息</div>
            <div class="diaBoxLeft_mes">
              <div>开户银行：{{diaForm.priceConsumption}} </div>
              <div>支行名称：{{ diaForm.aaa5 }}</div>
              <div>账号名称：{{ diaForm.aaa3 }}</div>
              <div>银行账号：{{ diaForm.aaa4 }}</div>
              <div>
                开户行所在地：{{
                  diaForm.priceBalance ? diaForm.priceBalance : 0
                }}
              </div>
            </div>
            <div class="diaBoxLeft_title">账户信息</div>
            <div class="diaBoxLeft_mes">
              <div>
                累计收益：￥{{
                  diaForm.priceConsumption ? diaForm.priceConsumption : 0
                }}元
              </div>
              <div>已提现金额：￥{{ diaForm.aaa5 }}元</div>
              <div>可提现金额：￥{{ diaForm.aaa3 }}元</div>
            </div>
          </div>
          <div class="diaBoxRight">
            <div style="display: flex">
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(1)"
                :class="{ 'is-active': diaTbas === 1 }"
              >
                收益记录
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(2)"
                :class="{ 'is-active': diaTbas === 2 }"
              >
                提现记录
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(3)"
                :class="{ 'is-active': diaTbas === 3 }"
              >
                关注记录
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(4)"
                :class="{ 'is-active': diaTbas === 4 }"
              >
                粉丝团成员
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(5)"
                :class="{ 'is-active': diaTbas === 5 }"
              >
                推荐商品
              </div>
              <div
                class="diaBoxRight_tabBtns"
                @click="changeTbas(6)"
                :class="{ 'is-active': diaTbas === 6 }"
              >
                推荐主播
              </div>
            </div>
            <el-form
              :inline="true"
              :style="{ margin: '20px', 'text-align': 'right' }"
              :model="diaSearchForm"
              @keyup.enter.native="queryPost_dia()"
            >
              <el-form-item label="支付方式" v-if="diaTbas === 1">
                <el-select v-model="diaSearchForm.payType" clearable>
                  <el-option :value="1" label="微信"></el-option>
                  <el-option :value="2" label="支付宝"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值来源" v-if="diaTbas === 1">
                <el-select v-model="diaSearchForm.paySource" clearable>
                  <el-option :value="1" label="小程序端"></el-option>
                  <el-option :value="2" label="大于众学"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="礼物名称" v-if="diaTbas === 2">
                <el-input v-model="diaSearchForm.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="消费来源" v-if="diaTbas === 2">
                <el-select v-model="diaSearchForm.paySource" clearable>
                  <el-option :value="1" label="小程序端"></el-option>
                  <el-option :value="2" label="大于众学"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="用户昵称"
                v-if="diaTbas === 3 || diaTbas === 4"
              >
                <el-input v-model="diaSearchForm.userName" clearable></el-input>
              </el-form-item>
              <el-form-item
                label="手机号码"
                v-if="diaTbas === 3 || diaTbas === 4||diaTbas === 6"
              >
                <el-input v-model="diaSearchForm.phone" clearable></el-input>
              </el-form-item>
              <el-form-item label="粉丝团身份" v-if="diaTbas === 4">
                <el-select v-model="diaSearchForm.userType" clearable>
                  <el-option :value="0" label="普通会员"></el-option>
                  <el-option :value="1" label="会长"></el-option>
                  <el-option :value="2" label="副会长"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态" v-if="diaTbas === 4">
                <el-select v-model="diaSearchForm.delFlg" clearable>
                  <el-option :value="0" label="正常"></el-option>
                  <el-option :value="1" label="取消关注"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="主播昵称"
                v-if="diaTbas === 6"
              >
                <el-input v-model="diaSearchForm.anchorName" clearable></el-input>
              </el-form-item>
              <el-form-item label="状态" v-if="diaTbas === 6">
                <el-select v-model="diaSearchForm.delFlg" clearable>
                  <el-option :value="0" label="上架"></el-option>
                  <el-option :value="1" label="下架"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="queryPost_dia()">{{
                  $t("query")
                }}</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="diaDataList"
              border
              style="width: 100%"
              height="calc(calc(100vh - 380px) - 2px)"
            >
              <template v-for="(label, prop) in diaTableTitle">
                <el-table-column
                  :prop="prop"
                  :label="label"
                  :key="prop"
                  header-align="center"
                  align="center"
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
                  v-else-if="prop === 'avatarUrl'"
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
                  :prop="prop"
                  :label="label"
                  :key="prop"
                  header-align="center"
                  align="center"
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
                  v-else-if="prop === 'delFlg'"
                >
                  <template slot-scope="scope">
                    <div v-if="!scope.row.anchorName">
                      {{ scope.row.delFlg === 1 ? "取消关注" : "正常" }}
                    </div>
                     <div v-else>
                      {{ scope.row.delFlg === 1 ? "下架" : "上架" }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  :prop="prop"
                  :label="label"
                  :key="prop"
                  header-align="center"
                  align="center"
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
    name: 'LiveWebmanageUserdetail',

    data() {
        return {
            userId:'',
        diaForm: {},
      diaTbas: 1,
      diaSearchForm: {
        payType: "",
        paySource: "",
        name: "",
        title: "",
        anchorName: "",
        userName: "",
        phone: "",
        userType: "",
        delFlg: "",
      },
      diaDataList: [],
      diaTableTitle: {
        price: "收益金额",
        amount: "收益类型",
        payType: "收益描述",
        createDate: "结算时间",
      },
      page_dia: 1, // 当前页码
      limit_dia: 10, // 每页数
      total_dia: 0,
        };
    },

    mounted() {
      this.userId =this.$route.params.data.id;
      this.$http
        .get(`/sys/manage/userDetail/${this.userId}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.diaForm = {
            priceConsumption: res.data.priceConsumption,
            priceBalance: res.data.priceBalance,
            ...this.$route.params.data,
            // priceConsumption:res.data.priceConsumption,
            // priceConsumption:res.data.priceConsumption,
          };
        })
        .catch(() => {});
        this.changeTbas(1);
    },
  watch: {
       '$route.params.data' (val) {
         console.log(val)
      this.userId =this.$route.params.data.id;
      this.$http
        .get(`/sys/manage/userDetail/${this.$route.params.data.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.diaForm = {
            priceConsumption: res.data.priceConsumption,
            priceBalance: res.data.priceBalance,
            ...this.$route.params.data,
            // priceConsumption:res.data.priceConsumption,
            // priceConsumption:res.data.priceConsumption,
          };
        })
        .catch(() => {});
        this.changeTbas(1);
    }
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
        userName: "",
        phone: "",
        userType: "",
        delFlg: "",
      };
      switch (n) {
        case 1:
          this.diaTableTitle = {
            price: "收益金额",
            amount: "收益类型",
            payType: "收益描述",
            createDate: "结算时间",
          };
          break;
        case 2:
          this.diaTableTitle = {
            name: "提现金额",
            giftNum: "账户姓名",
            price: "银行账户",
            allPrice: "开户银行",
            payType: "支行名称",
            paySource: "开户行所在地",
            createDate: "提现时间",
            createDate: "审批状态",
            createDate: "提现状态",
          };
          break;
        case 3:
          this.diaTableTitle = {
            avatarUrl: "用户头像",
            userName: "用户昵称",
            phone: "手机号码",
            createDate: "关注时间",
          };
          break;
        case 4:
          this.diaTableTitle = {
            avatarUrl: "用户头像",
            userName: "用户昵称",
            phone: "手机号码",
            level: "用户等级",
            userType: "粉丝团身份",
            groupName: "所在群组",
            createDate: "入团时间",
            delFlg: "状态",
          };
          break;
        case 5:
          this.diaTableTitle = {
            title: "商品图片",
            anchorName: "商品名称",
            phone: "商品价格",
            aaa4: "销售价格",
            price: "商品类型",
            payType: "是否免费",
            paySource: "更新时间",
            createDate: "上架状态",
          };
          break;
        case 6:
          this.diaTableTitle = {
            avatarUrl: "主播头像",
            anchorName: "主播昵称",
            phone: "手机号码",
            createDate: "更新时间",
            delFlg: "上架状态",
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
      this.diaDataList = [];
      this.total_dia = 0;
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
          };
          url = "/sys/user/consumption/selectUserGiftPage";
          break;
        case 3:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            phone: this.diaSearchForm.phone,
            userName: this.diaSearchForm.userName,
          };
          url =
            "/sys/manage/weixinUser/anchor/attention/anchorAttentionWeixinUserInfoPage";
          break;
        case 4:
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            phone: this.diaSearchForm.phone,
            userName: this.diaSearchForm.userName,
            userType: this.diaSearchForm.userType,
            delFlg: this.diaSearchForm.delFlg,
          };
          url =
            "/sys/manage/weixinUser/anchor/fans/achorFansWeixinUserInfoPage";
          break;
        case 5:
          // data = {
          //   limit: this.limit_dia,
          //   page: this.page_dia,
          //   anchorId: this.userId,
          //   phone: this.diaSearchForm.phone,
          //   anchorName: this.diaSearchForm.anchorName,
          //   delFlg: this.diaSearchForm.delFlg,
          // };
          // url = "/sys/manage/anchor/recommend/listWithAnchorId";
          break;
        case 6:
              data = {
            limit: this.limit_dia,
            page: this.page_dia,
            anchorId: this.userId,
            phone: this.diaSearchForm.phone,
            anchorName: this.diaSearchForm.anchorName,
            delFlg: this.diaSearchForm.delFlg,
          };
          url = "/sys/manage/anchor/recommend/listWithAnchorId";
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
  height: calc(calc(100vh - 50px - 38px - 66px) - 2px);
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