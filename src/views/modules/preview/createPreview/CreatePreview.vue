// 预告列表

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
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计时长" prop="estimateLiveTime">
          <el-input v-model="ruleForm.estimateLiveTime"></el-input>
        </el-form-item>
        <el-form-item label="直播宣传图" prop="frontCoverUrl" class="img-item">
          <div v-for="(item, index) in fileList" :key="index" class="img-box">
            <el-image
              style="width: 100px; height: 100px"
              :src="item.url"
              fit="cover"
              @click="choosePic(item)"
            ></el-image>
            <img
              v-if="item.chooseFlag"
              class="like-img"
              src="@/assets/img/like_red.png"
              alt=""
            />
          </div>
          <el-upload
            class="upload-demo"
            action="http://192.168.250.195:28080/oss/file/upload"
            :on-success="handleSuccess"
            :file-list="fileList"
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
        <el-form-item label="直播介绍" prop="liveIntroduce">
          <quill-editor
            v-model="ruleForm.liveIntroduce"
            ref="myQuillEditor"
            style="height: 380px"
            :options="editorOption"
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
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
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
      fileList: [
        {
          name: "pic1",
          url: "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        },
        {
          name: "pic2",
          url: "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
        },
      ],
      rules: {
        liveTheme: [
          { required: true, message: "请输入直播主题", trigger: "blur" },
        ],
        startDate: [
          {
            type: "date",
            required: true,
            message: "请选择预计开播时间",
            trigger: "change",
          },
        ],
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
    };
  },
  methods: {
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   this.fileList.forEach((v) => {
        //     if (v.chooseFlag === true) {
        //         if(v){

        //         }
        //         this.ruleForm.frontCoverUrl = 
        //     };
        //   });
          this.ruleForm.startDate = this.dateFormat(this.ruleForm.startDate);
          console.log(this.ruleForm);
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
      this.fileList.push(file);
      this.fileList.forEach((v, i) => {
        if (v.url === file.url) {
          v.chooseFlag = true;
        } else {
          v.chooseFlag = false;
        }
      });
    },
    //删除照片
    handleRemove(file) {
      this.fileList.forEach((v, i) => {
        if (v.url === file.url) {
          this.fileList.splice(i, 1);
        }
      });
    },
    //选择照片
    choosePic(file) {
        console.log(file)
      this.fileList.forEach((v, i) => {
        if (v.url === file.url) {
          v.chooseFlag = true;
        } else {
          v.chooseFlag = false;
        }
      });
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
    .img-box {
      position: relative;
      .el-image {
        margin-right: 10px;
      }
      .like-img {
        width: 25px;
        height: 20px;
        position: absolute;
        right: 10px;
        top: 0;
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
</style>