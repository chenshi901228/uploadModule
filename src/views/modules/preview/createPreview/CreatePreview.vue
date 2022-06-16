// 添加列表

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="直播主题" prop="liveTheme" required>
          <el-input
            v-model="ruleForm.liveTheme"
            maxlength="60"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="预计开播时间" prop="startDate">
          <el-date-picker
            v-model="ruleForm.startDate"
            type="datetime"
            placeholder="预计开播时间"
            :picker-options="pickerOptions"
            :formatter="dateFormat"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计时长" prop="estimateLiveTime">
          <el-input v-model="ruleForm.estimateLiveTime"></el-input>
        </el-form-item>
        <el-form-item label="直播宣传图" prop="frontCoverUrl" class="img-item">
          <div v-for="item in defaultImg" :key="item" class="img-box">
            <el-image
              style="width: 100px; height: 100px"
              :src="item"
              fit="cover"
              @click="choosePic(item)"
            ></el-image>
            <img
              v-if="item === ruleForm.frontCoverUrl"
              class="like-img"
              src="@/assets/img/like_red.png"
              alt=""
            />
          </div>
          <div v-for="item in fileList" :key="item" class="img-box">
            <el-image
              style="width: 100px; height: 100px"
              :src="item"
              fit="cover"
              @click="choosePic(item)"
            ></el-image>
            <img
              v-if="item === ruleForm.frontCoverUrl"
              class="like-img"
              src="@/assets/img/like_red.png"
              alt=""
            />
            <img
              @click="handleRemove(item)"
              class="close-img"
              src="@/assets/img/close.png"
              alt=""
            />
          </div>
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-success="handleSuccess"
            list-type="picture-card"
            :multiple="false"
            :show-file-list="false"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="助手" prop="assistantIds">
          <el-select
            v-model="ruleForm.assistantIds"
            filterable
            multiple
            placeholder="请选择"
            :clearable="true"
          >
            <el-option
              v-for="(item, index) in assistantOptions"
              :key="index"
              :label="item.userName"
              :value="item.weixinUserId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="quill-editor"
          label="直播介绍"
          prop="liveIntroduce"
        >
          <quill-editor
            v-model="ruleForm.liveIntroduce"
            ref="myQuillEditor"
            style="height: 380px"
            :options="editorOption"
            @change="onEditorChange($event)"
          >
            <!-- 自定义toolar -->
            <div id="toolbar" slot="toolbar">
              <!-- Add a bold button -->
              <button class="ql-bold" title="加粗">Bold</button>
              <button class="ql-italic" title="斜体">Italic</button>
              <button class="ql-underline" title="下划线">underline</button>
              <button class="ql-strike" title="删除线">strike</button>
              <button class="ql-blockquote" title="引用"></button>
              <button class="ql-code-block" title="代码"></button>
              <button class="ql-header" value="1" title="标题1"></button>
              <button class="ql-header" value="2" title="标题2"></button>
              <!--Add list -->
              <button class="ql-list" value="ordered" title="有序列表"></button>
              <button class="ql-list" value="bullet" title="无序列表"></button>
              <!-- Add font size dropdown -->
              <select class="ql-header" title="段落格式">
                <option selected>段落</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="4">标题4</option>
                <option value="5">标题5</option>
                <option value="6">标题6</option>
              </select>
              <select class="ql-size" title="字体大小">
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px" selected>16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
              <select class="ql-font" title="字体">
                <option value="SimSun">宋体</option>
                <option value="SimHei">黑体</option>
                <option value="Microsoft-YaHei">微软雅黑</option>
                <option value="KaiTi">楷体</option>
                <option value="FangSong">仿宋</option>
                <option value="Arial">Arial</option>
              </select>
              <!-- Add subscript and superscript buttons -->
              <select class="ql-color" value="color" title="字体颜色"></select>
              <select
                class="ql-background"
                value="background"
                title="背景颜色"
              ></select>
              <select class="ql-align" value="align" title="对齐"></select>
              <button class="ql-clean" title="还原"></button>
              <!-- You can also add your own -->
            </div>
          </quill-editor>
          <span
            class="wordNumber"
            style="position: absolute; right: 40px; bottom: 30px"
            >{{ TiLength }}/2000</span
          >
        </el-form-item>
        <el-form-item label="添加商品" prop="goods">
          <el-input
            @click.native="goToAddGoods"
            v-model="ruleForm.goods"
            readonly
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="添加主播" prop="anchors">
          <el-input
            @click.native="goToAddAnchor"
            v-model="ruleForm.anchors"
            readonly
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加推荐主播弹窗 -->
    <el-dialog
      title="推荐主播"
      :visible.sync="dialogAnchorFormVisible"
      width="70%"
      top="20px"
    >
      <el-form
        :inline="true"
        :model="addAnchorForm"
        @keyup.enter.native="queryAnchorList()"
        size="small"
        label-width="100px"
      >
        <el-form-item label="商品名称">
          <el-input
            style="width: 200px"
            v-model="addAnchorForm.username"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-input
            style="width: 200px"
            v-model="addAnchorForm.phone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="queryAnchorList"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="reset"
            >重置</el-button
          >
        </el-form-item>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left"></div>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        style="width: 100%"
        ref="table"
        fit
        max-height="500"
      >
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="主播头像"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              <img
                style="width: 80px; height: '80px'"
                class="frontCoverImg"
                :src="row.avatarUrl || 'https://picsum.photos/400/300?random=1'"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updateDate"
          label="推荐时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="state"
          label="添加状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.state === "1" ? "已添加" : "未添加" }}
          </template></el-table-column
        >
        <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-plus"
              type="text"
              size="small"
              @click="addAnchor(scope.row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="anchorPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="anchorLimit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
    </el-dialog>
    <!-- 添加推荐商品弹窗 -->
    <el-dialog
      title="带货商品"
      :visible.sync="dialogGoodsFormVisible"
      width="70%"
      top="20px"
    >
      <el-form
        :inline="true"
        :model="goodsForm"
        @keyup.enter.native="queryGoodsList()"
        size="small"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="productName">
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="goodsForm.productName"
          />
        </el-form-item>
        <el-form-item label="商品类型" prop="productType">
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="goodsForm.productType"
            clearable
          >
            <el-option value="专业课" label="专业课"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否免费" prop="isFree">
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="goodsForm.isFree"
            clearable
          >
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联商品编号" prop="linkedProductId">
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="goodsForm.linkedProductId"
          />
        </el-form-item>
        <el-form-item label="添加状态" prop="isAdd">
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="goodsForm.isAdd"
            clearable
          >
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="queryGoodsList"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="reset1"
            >重置</el-button
          >
        </el-form-item>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left"></div>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="goodsList"
        style="width: 100%"
        ref="table"
        fit
        max-height="500"
      >
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="productImage"
          label="商品图片"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              <img
                style="width: 80px; height: '80px'"
                class="frontCoverImg"
                :src="
                  row.productImage || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="oldPrice"
          label="商品价格"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="销售价格"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="productType"
          label="商品类型"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isFree"
          label="是否免费"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.isFree === 1 ? "是" : "否" }}
          </template></el-table-column
        >
        <el-table-column
          prop="id"
          label="关联商品编号"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isAdd"
          label="添加状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.isAdd === 1 ? "是" : "否" }}
          </template></el-table-column
        >
        <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-plus"
              type="text"
              size="small"
              @click="addGoods(scope.row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="goodsPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="goodsLimit"
        :total="goodsTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle1"
        @current-change="pageCurrentChangeHandle1"
      >
      </el-pagination>
    </el-dialog>
  </el-card>
</template>

<script>
import Cookies from "js-cookie";
import { Quill, quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../../../../assets/font.css";
// 自定义字体大小
let Size = Quill.import("attributors/style/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"];
Quill.register(Size, true);

// 自定义字体类型
var fonts = [
  "SimSun",
  "SimHei",
  "Microsoft-YaHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif",
  "宋体",
  "黑体",
];
var Font = Quill.import("formats/font");
Font.whitelist = fonts;
Quill.register(Font, true);
export default {
  components: { quillEditor },
  data() {
    const blurText = async (rule, value, callback) => {
      // const reg = /^\-\d\.?\d*$/
      // const boolean = reg.test(value)
      const boolean = new RegExp("^[1-9][0-9]*$").test(value); // console.log(boolean)
      if (!boolean) {
        this.$message.warning("请输入正整数");
        this.ruleForm.estimateLiveTime = "";
      }
    };
    return {
      ruleForm: {
        liveTheme: "",
        startDate: "",
        estimateLiveTime: "",
        frontCoverUrl: "",
        // dynamicGroupIds: [],
        liveIntroduce: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      chooseFlag: false,
      defaultImg: [],
      fileList: [],
      uploadUrl: "",
      rules: {
        liveTheme: [
          { required: true, message: "请输入直播主题", trigger: "blur" },
        ],
        startDate: [
          {
            required: true,
            message: "请选择预计开播时间",
            trigger: "blur",
          },
        ],
        estimateLiveTime: [
          { required: true, message: "请输入预计时长", trigger: "blur" },
          { validator: blurText, trigger: "blur" }, //表单验证的时候会调用的方法
        ],
        // frontCoverUrl: [
        //   { required: true, message: "请选择直播宣传图", trigger: "change" },
        // ],
        // userGroup: [
        //   { required: true, message: "请选择投放人群", trigger: "blur" },
        // ],
        liveIntroduce: [
          { required: true, message: "请填写直播介绍", trigger: "blur" },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          const oneday = date.getTime();
          return time.getTime() < new Date().getTime() - 86400000;
        },
      },
      editorOption: {
        placeholder: "请输入",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: "#toolbar",
          },
        },
      },
      options: [],
      TiLength: 0,
      dataListLoading: false,
      dialogAnchorFormVisible: false,
      anchorPage: 1,
      anchorLimit: 10,
      dataList: [],
      addAnchorForm: {},
      total: 0,
      anchors: [],
      recommendedAnchorList: [],
      dialogGoodsFormVisible: false,
      goodsTotal: 0,
      goodsPage: 1,
      goodsLimit: 10,
      goodsForm: {},
      goodsList: [],
      goods: [],
      productIds: [],
      userId: "",
      goodsDataListLoading: false,
      assistantOptions: [],
    };
  },
  watch: {
    "ruleForm.liveTheme"(nv, ov) {
      if (nv.length > 60) {
        this.$message.warning("直播主题字数不得超过60字！");
      }
    },
    "ruleForm.liveIntroduce"(nv, ov) {
      if (nv.length > 2007) {
        this.$message.warning("直播介绍字数不得超过2000字！");
      }
    },
  },
  computed: {},
  created() {
    this.uploadUrl = `${
      window.SITE_CONFIG["apiURL"]
    }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
    this.getDynamicGroupList();
    this.ruleForm = {
      liveTheme: "",
      startDate: "",
      estimateLiveTime: "",
      frontCoverUrl: "",
      // dynamicGroupIds: [],
      liveIntroduce: "",
      productIds: [],
      goods: "",
      recommendedAnchorList: [],
      anchors: "",
      assistantIds: [],
    };
    this.userId = this.$store.state.user.id;
    this.getDynamicAssistantList();
    this.getCoverPictureList();
  },
  methods: {
    //重置
    reset() {
      this.addAnchorForm = {
        username: "",
        phone: "",
      };
      this.queryAnchorList();
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.anchorPage = 1;
      this.anchorLimit = val;
      this.queryAnchorList();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.anchorPage = val;
      this.queryAnchorList();
    },
    //添加主播
    addAnchor(row) {
      let flag = true;
      this.anchors.forEach((v) => {
        if (v === row.username) {
          flag = false;
          this.$message.warning("重复添加");
        }
      });
      if (flag) {
        this.$set(this.ruleForm, "recommendedAnchorList", []);
        this.$set(this.ruleForm, "anchors", "");
        this.anchors.push(row.username);
        this.recommendedAnchorList.push(row.anchorId);
        this.ruleForm.recommendedAnchorList.push(...this.recommendedAnchorList);
        let result = Array.from(new Set(this.anchors));
        let str = result.join(",");
        this.ruleForm.anchors = str;
        this.$message.success("添加成功！");
      }
      this.dialogAnchorFormVisible = false;
    },
    //重置
    reset1() {
      this.goodsForm = {
        productName: "",
        productType: "",
        isFree: "",
        linkedProductId: "",
        isAdd: "",
      };
      this.queryGoodsList();
    },
    // 分页, 每页条数
    pageSizeChangeHandle1(val) {
      this.goodsPage = 1;
      this.goodsLimit = val;
      this.queryGoodsList();
    },
    // 分页, 当前页
    pageCurrentChangeHandle1(val) {
      this.goodsPage = val;
      this.queryGoodsList();
    },
    //添加商品
    addGoods(row) {
      let flag = true;
      this.goods.forEach((v) => {
        if (v === row.productName) {
          flag = false;
          this.$message.warning("重复添加");
        }
      });
      if (flag) {
        this.$set(this.ruleForm, "productIds", []);
        this.$set(this.ruleForm, "goods", "");
        this.goods.push(row.productName);
        this.productIds.push(row.id);
        this.ruleForm.productIds.push(...this.productIds);
        let result = Array.from(new Set(this.goods));
        let str = result.join(",");
        this.ruleForm.goods = str;
        this.$message.success("添加成功！");
      }
      this.dialogGoodsFormVisible = false;
    },
    //获取推荐商品列表
    queryGoodsList() {
      this.goodsDataListLoading = true;
      this.$http
        .get("/sys/wxapp/anchorProduct/listWithAnchorIdPage", {
          params: {
            page: this.goodsPage,
            limit: this.goodsLimit,
            anchorId: this.userId,
            ...this.goodsForm,
          },
        })
        .then(({ data: res }) => {
          this.goodsDataListLoading = false;
          if (res.code !== 0) {
            this.goodsList = [];
            return this.$message.error(res.msg);
          }
          this.goodsTotal = res.data.total;
          this.goodsList = res.data.list;
        })
        .catch((err) => {
          this.goodsDataListLoading = false;
          throw err;
        });
    },
    //添加商品
    goToAddGoods() {
      this.queryGoodsList();
      this.dialogGoodsFormVisible = true;
    },
    //获取添加主播列表
    queryAnchorList() {
      this.dataListLoading = true;
      this.$http
        .get("/sys/sysRecommendedAnchor/pageForAddLivePreview", {
          params: {
            page: this.anchorPage,
            limit: this.anchorLimit,
            ...this.addAnchorForm,
          },
        })
        .then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.dataList = [];
            return this.$message.error(res.msg);
          }
          this.total = res.data.total;
          this.dataList = res.data.list;
        })
        .catch((err) => {
          this.dataListLoading = false;
          throw err;
        });
    },
    //添加推荐主播
    goToAddAnchor() {
      this.queryAnchorList();
      this.dialogAnchorFormVisible = true;
    },
    //获取直播封面图
    getCoverPictureList() {
      this.$http
        .get("/sys/livecoverpicture/getCoverPictureList")
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          let list = [];

          if (res.data && res.data.length !== 0) {
            res.data.forEach((v) => {
              list.push(v.coverUrl);
            });
          }
          this.defaultImg = list;
          this.ruleForm.frontCoverUrl = this.defaultImg[0];
        })
        .catch((err) => {
          throw err;
        });
    },
    onEditorChange(e) {
      e.quill.deleteText(2000, 4);
      if (this.ruleForm.liveIntroduce == "") {
        this.TiLength = 0;
      } else {
        this.TiLength = e.quill.getLength() - 1;
      }
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.startDate = this.dateFormat(this.ruleForm.startDate);
          let dataForm = {
            liveTheme: this.ruleForm.liveTheme,
            startDate: this.ruleForm.startDate,
            estimateLiveTime: this.ruleForm.estimateLiveTime,
            frontCoverUrl: this.ruleForm.frontCoverUrl,
            liveIntroduce: this.ruleForm.liveIntroduce,
            productIds: this.ruleForm.productIds,
            recommendedAnchorList: this.ruleForm.recommendedAnchorList,
            assistantIds: this.ruleForm.assistantIds,
          };
          this.$http
            .post("/sys/livePreview/createLivePreview", dataForm)
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success("创建预告成功！");
              this.$router.push({
                path: "preview-Preview",
              });
              this.ruleForm = {
                liveTheme: "",
                startDate: "",
                estimateLiveTime: "",
                frontCoverUrl: "",
                // dynamicGroupIds: [],
                liveIntroduce: "",
                productIds: [],
                goods: "",
                recommendedAnchorList: [],
                anchors: "",
                assistantIds: [],
              };
              this.ruleForm.frontCoverUrl = this.defaultImg[0];
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //上传后
    handleSuccess(response, file, fileList) {
      this.fileList.push(response.data.url);
      this.ruleForm.frontCoverUrl = response.data.url;
    },
    //删除照片
    handleRemove(url) {
      this.fileList.forEach((v, i) => {
        if (url === v) {
          this.fileList.splice(i, 1);
        }
      });
      if (this.fileList.length === 0) {
        this.ruleForm.frontCoverUrl = this.defaultImg[0];
      } else {
        this.ruleForm.frontCoverUrl = this.fileList[0];
      }
    },
    //选择照片
    choosePic(url) {
      if (url && this.ruleForm.frontCoverUrl !== url) {
        this.ruleForm.frontCoverUrl = url;
      }
    },
    // 时间格式化
    dateFormat(time) {
      var t = new Date(time);
      if (!t) {
        return "";
      }
      let year = t.getFullYear();
      let month = this.dateIfAddZero(t.getMonth() + 1);
      let day = this.dateIfAddZero(t.getDate());
      let hours = this.dateIfAddZero(t.getHours());
      let minutes = this.dateIfAddZero(t.getMinutes());
      let seconds = this.dateIfAddZero(t.getSeconds());
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    //补零
    dateIfAddZero: function (time) {
      return time < 10 ? "0" + time : time;
    },
    //获取投放人群
    getDynamicGroupList() {
      this.$http
        .get("/sys/dynamicGroup/getDynamicGroupList")
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.options = res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    //获取助手
    getDynamicAssistantList() {
      this.$http
        .get(
          `/sys/anchorAssistant/live/getAnchorAssistantWithLiveByAnchorId?anchorId=${this.userId}`
        )
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.assistantOptions = res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
  /deep/.el-input {
    width: 300px;
    padding-right: 50px;
  }
  /deep/.img-item {
    .el-form-item__content {
      display: flex;
    }
    .img-box {
      position: relative;
      .el-image {
        margin-right: 10px;
      }
      .like-img {
        position: absolute;
        width: 24px;
        height: 20px;
        left: 0;
        top: 0;
      }
      .close-img {
        position: absolute;
        width: 24px;
        height: 24px;
        top: 0;
        right: 10px;
      }
    }
    .el-upload {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
    }
  }
  /deep/.ql-container {
    height: 300px;
    overflow-y: scroll;
  }
}
/deep/.quill-editor {
  position: relative;
}
</style>