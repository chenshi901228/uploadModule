// 添加列表

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        size="small"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="直播主题" prop="liveTheme">
          <el-input
            style="width: 400px"
            placeholder="直播主题"
            v-model.trim="ruleForm.liveTheme"
            maxlength="60"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="主播" prop="anchorId">
          <el-select
            style="width: 400px"
            v-model="ruleForm.anchorId"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="请输入选择"
            :remote-method="getAnchorInfo"
            :loading="loading"
            @change="changeAnchorId"
          >
            <el-option
              v-for="item in anchorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计开播时间" prop="startDate">
          <el-date-picker
            style="width: 400px"
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
          <el-input
            style="width: 400px"
            placeholder="预计时长"
            v-model="ruleForm.estimateLiveTime"
          ></el-input>
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
            style="width: 400px"
            v-model="ruleForm.assistantIds"
            filterable
            multiple
            placeholder="请选择"
            :clearable="true"
            @visible-change="changeAssistantIds($event)"
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
        <el-form-item label="投放人群" prop="dynamicGroupIds">
          <el-select
            style="width: 400px"
            v-model="ruleForm.dynamicGroupIds"
            filterable
            multiple
            placeholder="请选择"
            :clearable="true"
            @visible-change="changeDynamicGroupList($event)"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.id"
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
            style="width: 800px; height: 380px"
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
          <!-- <span
            class="wordNumber"
            style="position: absolute; left: 730px; bottom: 40px"
            >{{ TiLength }}/2000</span
          > -->
        </el-form-item>
        <el-form-item label="添加商品" prop="goods">
          <el-input
            style="width: 400px"
            placeholder="请选择"
            @click.native="chooseProduct"
            v-model="ruleForm.goods"
            readonly
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="添加主播" prop="anchors">
          <el-input
            style="width: 400px"
            placeholder="请选择"
            @click.native="chooseAnchor"
            v-model="ruleForm.anchors"
            readonly
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="直播背景">
          <custom-upload
            ref="frontCoverUpload"
            @uploadSuccess="frontCoverUploadSuccess"
            @uploadRemove="frontCoverUploadRemove"
            :fileList="frontCoverList"
            :fileType="['png', 'jpg', 'jpeg']"
            :fileMaxSize="2"
          ></custom-upload>
          <div>
            格式限制：jpg/jpeg/png,建议图片尺寸不小于630px×347px，大小不得超过2M
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="small"
            :icon="submitLoading ? 'el-icon-loading' : ''"
            :disabled="submitLoading"
            @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 主播弹框 -->
      <choose-anchor
        ref="chooseAnchor"
        @add="addAnchorConfirm"
      ></choose-anchor>
      <!-- 商品弹框 -->
      <choose-product
        ref="chooseProduct"
        @add="addProductConfirm"
      ></choose-product>
    </div>
  </el-card>
</template>

<script>
import CustomUpload from "@/components/common/custom-upload";
import Cookies from "js-cookie";
import { Quill, quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../../../../assets/font.css";
import ChooseAnchor from "@/components/chooseDialog/chooseAnchor";
import ChooseProduct from "@/components/chooseDialog/chooseProduct";
import ComModule from "@/mixins/common-module";
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
  mixins: [ComModule],
  components: {
    quillEditor,
    ChooseAnchor,
    ChooseProduct,
    CustomUpload,
  },
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
        dynamicGroupIds: [],
        liveIntroduce: "",
        anchorId: "",
      },
      dialogImageUrl: "",
      // dialogVisible: false,
      disabled: false,
      // chooseFlag: false,
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
        anchorId: [
          { required: true, message: "请选择主播", trigger: "blur" },
        ],
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
      goods: [],
      productIds: [],
      assistantOptions: [],
      submitLoading: false,
      frontCoverList: [],
      anchorId: "",
      anchorOptions: [], //主播选项
      loading: false, //输入主播选择loading
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
  created() {},
  activated() {
    this.uploadUrl = `${
      window.SITE_CONFIG["apiURL"]
    }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
    this.ruleForm = {
      liveTheme: "",
      startDate: "",
      estimateLiveTime: "",
      frontCoverUrl: "",
      dynamicGroupIds: [],
      liveIntroduce: "",
      productIds: [],
      goods: "",
      recommendedAnchorList: [],
      anchors: "",
      assistantIds: [],
    };
    this.anchorId = this.$route.query.anchorId;
    this.getCoverPictureList();
  },
  methods: {
    // 封面图上传
    frontCoverUploadSuccess(file) {
      this.frontCoverList.push(file);
      console.log(this.frontCoverList);
    },
    frontCoverUploadRemove(file) {
      this.frontCoverList = this.frontCoverList.filter(
        (item) => item.uid != file.uid
      );
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

    // 推荐主播弹框
    chooseAnchor() {
      if(!this.ruleForm.anchorId) return this.$message.warning("请选择主播")
      this.$refs.chooseAnchor.init(this.ruleForm.recommendedAnchorList, this.ruleForm.anchorId);
    },

    // 确认添加推荐主播
    addAnchorConfirm(data) {
      this.$refs.chooseAnchor.close();

      this.ruleForm.recommendedAnchorList = data;
      this.ruleForm.anchors = data.length ? `已选择${data.length}个主播` : "";
    },

    // 输入选择主播
    getAnchorInfo(s) {
      if (s != "") {
        this.loading = true;
        this.$http
          .get("/sys/anchor/info/getSysAnchorInfos/" + s)
          .then(({ data: res }) => {
            this.loading = false;
            if (res.code == 0) {
              let arr = [];
              res.data.map((item) => {
                arr.push({
                  value: item.weixinUserId,
                  label: `主播：${item.username}  手机号：${item.phone}`,
                });
              });
              this.anchorOptions = arr;
            } else {
              this.anchorOptions = [];
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.anchorOptions = [];
            throw err;
          });
      } else {
        this.anchorOptions = [];
      }
    },
    // 推荐商品弹框
    chooseProduct() {
      if(!this.ruleForm.anchorId) return this.$message.warning("请选择主播")
      this.$refs.chooseProduct.init(this.ruleForm.productIds, this.ruleForm.anchorId);
    },

    // 确认添加推荐商品
    addProductConfirm(data) {
      this.$refs.chooseProduct.close();

      this.ruleForm.productIds = data;
      this.ruleForm.goods = data.length ? `已选择${data.length}个商品` : "";
    },

    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let dataForm = {};
          this.ruleForm.startDate = this.dateFormat(this.ruleForm.startDate);

          // 商品、主播返回ids[]
          dataForm.productIds = this.ruleForm.productIds.map((item) => item.id);
          dataForm.recommendedAnchorList =
            this.ruleForm.recommendedAnchorList.map((item) => item.anchorId);

          dataForm = {
            ...dataForm,
            liveTheme: this.ruleForm.liveTheme,
            anchorId: this.ruleForm.anchorId,
            startDate: this.ruleForm.startDate,
            estimateLiveTime: this.ruleForm.estimateLiveTime,
            frontCoverUrl: this.ruleForm.frontCoverUrl,
            liveIntroduce: this.ruleForm.liveIntroduce,
            assistantIds: this.ruleForm.assistantIds,
            dynamicGroupIds: this.ruleForm.dynamicGroupIds,
            frontCover: this.frontCoverList.length
              ? this.frontCoverList[0].url
              : "",
          };

          this.submitLoading = true;

          this.$http
            .post("/sys/livePreview/createLivePreview", dataForm)
            .then(({ data: res }) => {
              this.submitLoading = false;
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success("创建预告成功！");
              this.ruleForm = {
                liveTheme: "",
                startDate: "",
                estimateLiveTime: "",
                frontCoverUrl: "",
                dynamicGroupIds: [],
                liveIntroduce: "",
                productIds: [],
                anchorId: "",
                goods: "",
                recommendedAnchorList: [],
                anchors: "",
                assistantIds: [],
              };
              this.ruleForm.frontCoverUrl = this.defaultImg[0];
              this.frontCoverList = [];

              this.closeCurrentTab();
            })
            .catch((err) => {
              this.submitLoading = false;
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    //改变主播ID
    changeAnchorId(val) {
      if (val) {
        this.getDynamicAssistantList();
        this.getDynamicGroupList();
      }
    },
    //获取助手
    getDynamicAssistantList() {
      if (this.ruleForm.anchorId && this.ruleForm.anchorId.length !== 0) {
        this.$http
          .get(
            `/sys/anchorAssistant/live/getAnchorAssistantWithLiveByAnchorId?anchorId=${this.ruleForm.anchorId}`
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
      }
    },
    //获取投放人群
    getDynamicGroupList() {
      if (this.ruleForm.anchorId && this.ruleForm.anchorId.length !== 0) {
        this.$http
          .get(
            `/sys/dynamicGroup/getAllDynamicGroupList?anchorId=${this.ruleForm.anchorId}`
          )
          .then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            this.options = res.data;
          })
          .catch((err) => {
            throw err;
          });
      }
    },
    //助手下拉框出现
    changeAssistantIds(e) {
      if (e && !this.ruleForm.anchorId) {
        this.$message.warning("请先选择主播");
      }
    },
    //投放人群下拉框出现
    changeDynamicGroupList(e) {
      if (e && !this.ruleForm.anchorId) {
        this.$message.warning("请先选择主播");
      }
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
  // /deep/.el-input {
  //   width: 300px;
  //   padding-right: 50px;
  // }
  .count {
    display: inline-block;
    margin-left: 10px;
    color: #909399;
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