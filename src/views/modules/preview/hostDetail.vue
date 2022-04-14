<template>
  <div>
    <div class="diaBoxLeft_title">主播详情</div>
    <div class="diaBox">
      <div class="diaBoxLeft">
        <div class="diaBoxLeft_title">
          <span>主播信息</span
          ><el-button type="primary" size="mini" @click="editeUserInfo"
            >编辑</el-button
          >
        </div>
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

        <div class="diaBoxLeft_title">
          <span>银行信息</span
          ><el-button type="primary" size="mini" @click="editeUserBank"
            >编辑</el-button
          >
        </div>
        <div class="diaBoxLeft_mes">
          <div>开户银行：{{ diaForm.depositBank }}</div>
          <div>支行名称：{{ diaForm.branchName }}</div>
          <div>账号名称：{{ diaForm.accountName }}</div>
          <div>银行账号：{{ diaForm.bankAccount }}</div>
          <div>开户行所在地：{{ diaForm.address }}</div>
        </div>
        <div class="diaBoxLeft_title">
          <span>账户信息</span
          ><el-button type="primary" size="mini" @click="editeUserMoney"
            >编辑</el-button
          >
        </div>
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
          <el-form-item label="用户昵称" v-if="diaTbas === 3 || diaTbas === 4">
            <el-input v-model="diaSearchForm.userName" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品名称" v-if="diaTbas === 5">
            <el-input v-model="diaSearchForm.productName" clearable></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码"
            v-if="diaTbas === 3 || diaTbas === 4 || diaTbas === 6"
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
          <el-form-item label="主播昵称" v-if="diaTbas === 6">
            <el-input v-model="diaSearchForm.anchorName" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品类型" v-if="diaTbas === 5">
            <el-select v-model="diaSearchForm.productType" clearable>
              <el-option value="专业课" label="专业课"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否免费" v-if="diaTbas === 5">
            <el-select v-model="diaSearchForm.isFree" clearable>
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" v-if="diaTbas === 6">
            <el-select v-model="diaSearchForm.delFlg" clearable>
              <el-option :value="0" label="上架"></el-option>
              <el-option :value="1" label="下架"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="diaTbas === 5"
              @click="updateProduct"
              type="primary"
              >上架商品</el-button
            >
            <el-button
              v-if="diaTbas === 5 && dataListSelections.length !== 0"
              type="danger"
              @click="deleteSelect()"
              >批量下架</el-button
            >
            <el-button @click="queryPost_dia()">{{ $t("query") }}</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="diaDataList"
          border
          style="width: 100%"
          height="calc(calc(100vh - 380px) - 2px)"
          @selection-change="dataListSelectionChangeHandle"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
            fixed="left"
            v-if="diaTbas === 5"
          ></el-table-column>
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
              v-if="prop === 'productImage'"
            >
              <template slot-scope="{ row }">
                <div>
                  <img
                    style="width: 100%; height: 60px"
                    class="productImage"
                    :src="
                      row.productImage ||
                      'https://picsum.photos/400/300?random=1'
                    "
                    alt=""
                  />
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
              v-else-if="prop === 'isFree'"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.isFree === 1 ? "是" : "否" }}
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
                <div v-if="!scope.row.anchorName && diaTbas === (4 || 6)">
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
          <el-table-column
            width="120"
            label="操作"
            fixed="right"
            header-align="center"
            align="center"
            v-if="diaTbas === 5"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="downProduct(scope.$index, scope.row)"
                >下架</el-button
              >
            </template>
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="商品上架" :visible.sync="dialogUserFormVisible">
      <el-form
        :inline="true"
        :model="productForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item label="商品名称">
          <el-input
            v-model="productForm.productName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="productForm.productType" clearable>
            <el-option value="专业课" label="专业课"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-select v-model="productForm.isFree" clearable>
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联产品编号">
          <el-input v-model="productForm.id" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryUserList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dataListSelectionUsers.length !== 0"
            type="danger"
            @click="deleteUserSelect()"
            >批量上架</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataUserListLoading"
        :data="dataUserList"
        border
        fit
        @selection-change="userListSelectionChangeHandle"
        style="width: 100%"
        max-height="500"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column>
        <el-table-column
          width="150"
          label="商品图片"
          prop="productImage"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              <img
                style="width: 100%; height: 60px"
                class="productImage"
                :src="
                  row.productImage || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="商品名称"
          prop="productName"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.productName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="商品价格"
          prop="oldPrice"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.oldPrice || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="销售价格"
          prop="price"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.price || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="商品类型"
          prop="productType"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.productType || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="是否免费"
          prop="isFree"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isFree === 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="关联产品编号"
          prop="id"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="更新时间"
          prop="updateDate"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.updateDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="上架状态"
          prop="delFlg"
          align="center"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.delFlg === 1 ? "下架" : "上架" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleDeleteUser(scope.$index, scope.row)"
              >上架</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="userListPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="userListLimit"
        :total="dataUserListTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeUserHandle"
        @current-change="pageCurrentChangeUserHandle"
      >
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProduct">添加</el-button>
      </div>
    </el-dialog>

    <!-- 修改银行信息 -->
    <el-dialog
      title="编辑银行卡信息"
      :visible.sync="dialogVisible_editBank"
      width="600px"
    >
      <el-form
        :model="bankForm"
        :rules="dataRule_bank"
        ref="bankForm_host"
        label-width="120px"
      >
        <el-form-item label="开户银行" prop="depositBank">
          <el-input
            v-model="bankForm.depositBank"
            placeholder="开户银行"
          ></el-input>
        </el-form-item>
        <el-form-item label="支行名称">
          <el-input
            v-model="bankForm.branchName"
            placeholder="支行名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行所在地" prop="address">
          <el-cascader
            :options="regionData"
            filterable
            style="width:100%"
            v-model="bankForm.address"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            :clearable="true"
            :placeholder="'请选择省/市/区县'"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="账户名称" prop="accountName">
          <el-input
            v-model="bankForm.accountName"
            placeholder="账户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input
            v-model="bankForm.bankAccount"
            placeholder="银行账户"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_editBank = false">取 消</el-button>
        <el-button type="primary" @click="subimtEditBank">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
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
        userName: "",
        phone: "",
        userType: "",
        delFlg: "",
        productName: "",
        productType: "",
        isFree: "",
      },
      productForm: {
        productName: "",
        productType: "",
        isFree: "",
        id: "",
      },
      dataListSelections: [], // 数据列表，多选项
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
      ids: [],
      dialogVisible: false,
      dataUserListLoading: false,
      userListPage: 1, // 当前页码
      userListLimit: 10, // 每页数
      dataUserList: [],
      dataUserListTotal: 0,
      dataListSelectionUsers: [],
      dialogUserFormVisible: false,

      // 修改银行卡信息
      dialogVisible_editBank: false,
      dataRule_bank: {
        address: [
          { required: true, message: "请选择省/市/区县", trigger: "change" },
        ],
        depositBank: [
          { required: true, message: "请填写开户银行", trigger: "blur" },
        ],
        accountName: [
          { required: true, message: "请填写账户名称", trigger: "blur" },
        ],
        bankAccount: [
          { required: true, message: "请填写银行账户", trigger: "blur" },
        ],
      },
      regionDataAll: [],
      regionData: [],
      bankForm: {},
    };
  },

  mounted() {
    this.userId = this.$store.state.user.id;
    this.$http
      .get(`/sys/anchor/info/getInfo/${this.userId}`)
      .then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.diaForm = res.data;
      })
      .catch(() => {});
    this.$http
      .get("/sys/region/tree")
      .then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.regionData = treeDataTranslate(res.data);
        this.regionDataAll =res.data;
      })
      .catch(() => {});
    this.changeTbas(1);
  },

  methods: {
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    //确认下架
    confirmDel() {
      console.log(this.ids);
      this.$http
        .post("/sys/course/down", this.ids)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.dialogVisible = false;
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
              productName: "",
              productType: "",
              isFree: "",
            };
            this.page_dia = 1; // 当前页码
            this.diaDataList = [];
            this.queryPost_dia();
            this.ids = [];
          }
        })
        .catch((err) => {
          throw err;
        });
    },
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
        productName: "",
        productType: "",
        isFree: "",
      };
         this.diaDataList=[]
       this.total_dia = 0;
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
            productImage: "商品图片",
            productName: "商品名称",
            oldPrice: "商品价格",
            price: "销售价格",
            productType: "商品类型",
            isFree: "是否免费",
            id: "关联产品编号",
            updateDate: "更新时间",
            delFlg: "上架状态",
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
          data = {
            limit: this.limit_dia,
            page: this.page_dia,
            productName: this.diaSearchForm.productName,
            productType: this.diaSearchForm.productType,
            isFree: this.diaSearchForm.isFree,
          };
          url = "/sys/course/page";
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
    //下架商品
    downProduct(i, row) {
      this.ids = [];
      this.ids.push(row.id);
      this.dialogVisible = true;
    },
    //上架商品
    updateProduct() {
      this.dialogUserFormVisible = true;
      this.productForm = {
        productName: "",
        productType: "",
        isFree: "",
        id: "",
      };
      this.dataUserList = [];
      this.queryUserList();
    },
    //批量下架
    deleteSelect() {
      this.dialogVisible = true;
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
    },
    //批量选择
    userListSelectionChangeHandle(val) {
      this.dataListSelectionUsers = val;
    },
    //获取未上架商品
    queryUserList() {
      this.dataUserListLoading = true;
      this.$http
        .get("/sys/course/downPage", {
          params: {
            page: this.userListPage,
            limit: this.userListLimit,
            productName: this.productForm.productName,
            productType: this.productForm.productType,
            isFree: this.productForm.isFree,
            id: this.productForm.id,
          },
        })
        .then(({ data: res }) => {
          this.dataUserListLoading = false;
          if (res.code !== 0) {
            this.dataUserList = [];
            this.dataUserListTotal = 0;
            return this.$message.error(res.msg);
          }
          this.dataUserList = res.data.list;
          this.dataUserListTotal = res.data.total;
        })
        .catch((err) => {
          this.dataUserListLoading = false;
          throw err;
        });
    },
    //重置
    reset() {
      this.productForm = {
        productName: "",
        productType: "",
        isFree: "",
        id: "",
      };
      this.queryUserList();
    },
    //上架商品
    handleDeleteUser(index, row) {
      let ids = [];
      ids.push(row.id);
      this.$http
        .post("/sys/course/up", ids)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          if (this.total_dia >= 9) {
            this.$message.warning("最多可上架9个商品，请删除后再重新上架!");
            return;
          }
          this.$message.success("上架成功!");
          this.queryUserList();
          this.dialogUserFormVisible = false;
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
            productName: "",
            productType: "",
            isFree: "",
          };
          this.page_dia = 1; // 当前页码
          this.diaDataList = [];
          this.queryPost_dia();
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量上架
    deleteUserSelect() {
      let ids = [];
      this.dataListSelectionUsers.forEach((v) => {
        ids.push(v.id);
      });
      this.$http
        .post("/sys/course/up", ids)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          if (this.total_dia >= 9) {
            this.$message.warning("最多可上架9个商品，请删除后再重新上架!");
            return;
          }
          this.$message.success("上架成功!");
          this.queryUserList();
          this.dialogUserFormVisible = false;
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
            productName: "",
            productType: "",
            isFree: "",
          };
          this.page_dia = 1; // 当前页码
          this.diaDataList = [];
          this.queryPost_dia();
        })
        .catch((err) => {
          throw err;
        });
    },
    // 分页, 每页条数
    pageSizeChangeUserHandle(val) {
      this.userListPage = 1;
      this.userListLimit = val;
      this.queryUserList();
    },
    // 分页, 当前页
    pageCurrentChangeUserHandle(val) {
      this.userListPage = val;
      this.queryUserList();
    },
    //编辑主播信息
    editeUserInfo() {
      this.$router.push({
        name: "preview-editeUserInfo-EditeUserInfo",
      });
    },
    //编辑银行卡信息
    editeUserBank() {
      this.dialogVisible_editBank = true;
      this.bankForm = {
        depositBank: this.diaForm.depositBank ? this.diaForm.depositBank : "",
        branchName: this.diaForm.branchName ? this.diaForm.branchName : "",
        address: this.diaForm.province ? [this.diaForm.province,this.diaForm.city,this.diaForm.county] : [],
        accountName: this.diaForm.accountName ? this.diaForm.accountName : "",
        bankAccount: this.diaForm.bankAccount ? this.diaForm.bankAccount : "",
      };
    },
    subimtEditBank() {
      this.$refs.bankForm_host.validate((valid) => {
        if (valid) {
          let address='';
          this.bankForm.address.forEach(i=>{
            this.regionDataAll.forEach(v=>{
              if(v.id===i){
                address+=`${v.name}/`
              }
            })
          })
          this.$confirm("确认银行信息已填写无误", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$http
                .post(`sys/sysbankinfo/save`, {
                  depositBank: this.bankForm.depositBank
                    ? this.bankForm.depositBank
                    : "",
                  branchName: this.bankForm.branchName
                    ? this.bankForm.branchName
                    : "",
                  province: this.bankForm.address.length>0 ? this.bankForm.address[0] : '',
                  address:address,
                  city: this.bankForm.address.length>0 ? this.bankForm.address[1] : '',
                  county: this.bankForm.address.length>0 ? this.bankForm.address[2] : '',
                  accountName: this.bankForm.accountName
                    ? this.bankForm.accountName
                    : "",
                  bankAccount: this.bankForm.bankAccount
                    ? this.bankForm.bankAccount
                    : "",
                    anchorInfoId: this.$store.state.user.id
                })
                .then(({ data: res }) => {
                  if (res.code !== 0) {
                    return this.$message.error(res.msg);
                  }
                  this.$http
                    .get(`/sys/anchor/info/${ this.$store.state.user.id}`)
                    .then(({ data: res }) => {
                      if (res.code !== 0) {
                        return this.$message.error(res.msg);
                      }
                      this.diaForm = res.data;
                    });
                    this.dialogVisible_editBank=false
                  this.$message.success("修改成功!");
                }).catch(error=>{
                  this.$message.error(error.msg||error.error)
                });
            })
            .catch((err) => {
              console.log(err);
              this.$message.info("已取消修改");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑账户信息
    editeUserMoney() {},
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
/deep/.frontCoverImg {
  width: 100%;
  height: 80px;
}
</style>