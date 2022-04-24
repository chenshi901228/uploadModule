// 编辑列表

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
          <el-input v-model="ruleForm.liveTheme"></el-input>
        </el-form-item>
        <el-form-item label="预计开播时间" required prop="startDate">
          <el-date-picker
            v-model="ruleForm.startDate"
            type="datetime"
            placeholder="预计开播时间"
            :formatter="dateFormat"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计时长" prop="estimateLiveTime">
          <el-input v-model="ruleForm.estimateLiveTime"></el-input>
        </el-form-item>
        <el-form-item label="直播宣传图" prop="frontCoverUrl" class="img-item">
          <div v-if="showDefaultImg" class="img-box-content">
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
            v-if="showDefaultImg"
            :action="uploadUrl"
            :on-success="handleSuccess"
            list-type="picture-card"
            :multiple="false"
            :show-file-list="false"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="选择投放人群" prop="userGroup">
          <el-select v-model="ruleForm.userGroup" placeholder="选择投放人群">
            <el-option label="一" value="0"></el-option>
            <el-option label="二" value="1"></el-option>
          </el-select>
        </el-form-item> -->
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
            style="position: absolute; right: 30px; bottom: 30px"
            >{{ TiLength }}/300</span
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
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
    return {
      ruleForm: {
        id: "",
        liveTheme: "",
        startDate: "",
        estimateLiveTime: "",
        frontCoverUrl: "",
        // userGroup: "",
        liveIntroduce: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      chooseFlag: false,
      showDefaultImg: false,
      defaultImg: [],
      fileList: [],
      uploadUrl: "",
      rules: {
        liveTheme: [
          { required: true, message: "请输入直播主题", trigger: "blur" },
        ],
        // startDate: [
        //   {
        //     type: "string",
        //     required: true,
        //     message: "请选择预计开播时间",
        //     trigger: "change",
        //   },
        // ],
        estimateLiveTime: [
          { required: true, message: "请输入预计时长", trigger: "blur" },
        ],
        // frontCoverUrl: [
        //   { required: true, message: "请选择直播宣传图", trigger: "change" },
        // ],
        // userGroup: [
        //   { required: true, message: "请选择投放人群", trigger: "blur" },
        // ],
        liveIntroduce: [
          { required: true, message: "请填写活动形式", trigger: "blur" },
        ],
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
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          const oneday = date.getTime();
          return time.getTime() < new Date().getTime() - 86400000;
        },
      },
      TiLength: 0,
    };
  },
  watch: {
    "ruleForm.liveTheme"(nv, ov) {
      if (nv.length >= 60) {
        this.$message.warning("直播主题字数不得超过60字！");
      }
    },
    "ruleForm.liveIntroduce"(nv, ov) {
      if (nv.length >= 307) {
        this.$message.warning("直播介绍字数不得超过300字！");
      }
    },
  },
  created() {
    this.uploadUrl = `${
      window.SITE_CONFIG["apiURL"]
    }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getCoverPictureList()
      vm.ruleForm.id = "";
      vm.ruleForm.liveTheme = "";
      vm.ruleForm.startDate = "";
      vm.ruleForm.estimateLiveTime = "";
      vm.ruleForm.frontCoverUrl = "";
      vm.fileList = [];
      vm.ruleForm.liveIntroduce = "";
      let dataForm = JSON.parse(window.sessionStorage.getItem("dataForm"));
      if (dataForm) {
        vm.ruleForm.id = dataForm.id;
        vm.ruleForm.liveTheme = dataForm.liveTheme;
        vm.ruleForm.startDate = dataForm.startDate;
        vm.ruleForm.estimateLiveTime = dataForm.estimateLiveTime;
        vm.ruleForm.frontCoverUrl = dataForm.frontCoverUrl;
        vm.fileList.push(dataForm.frontCoverUrl);
        vm.ruleForm.liveIntroduce = dataForm.liveIntroduce;
      } else {
        vm.$router.push({
          path: "/preview-Preview",
        });
        vm.$message({
          message: "请选择编辑的预告！",
          type: "warning",
          duration: 1500,
          onClose: () => {},
        });
      }
    });
  },
  methods: {
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
        })
        .catch((err) => {
          throw err;
        });
    },
    onEditorChange(e) {
      e.quill.deleteText(300, 4);
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
          if (this.ruleForm.frontCoverUrl.length === 0) {
            this.$message({
              message: "请选择背景图！",
              type: "warning",
              duration: 500,
              onClose: () => {},
            });
            returny;
          }
          this.$http
            .put("/sys/livePreview/update", this.ruleForm)
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              window.sessionStorage.removeItem("dataForm");
              this.$router.push({
                path: "/preview-Preview",
              });
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
    //取消
    cancel() {
      window.sessionStorage.removeItem("dataForm");
      this.$router.push({
        path: "/preview-Preview",
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
      this.showDefaultImg = true;
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
  }
  /deep/.img-item {
    .el-form-item__content {
      display: flex;
    }
    .img-box-content {
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