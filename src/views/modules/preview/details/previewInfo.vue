<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__liveList">
            <el-form :model="ruleForm" ref="ruleForm" size="small" label-width="110px" class="demo-ruleForm">
                <el-form-item label="直播主题：" prop="liveTheme">
                    <span>{{ruleForm.liveTheme}}</span>
                </el-form-item>
                <el-form-item label="主播：" prop="anchorUser">
                    <span>{{ruleForm.anchorUser}}</span>
                </el-form-item>
                <el-form-item label="预计开播时间：" prop="startDate">
                    <span>{{ruleForm.startDate}}</span>
                </el-form-item>
                <el-form-item label="预计时长(分)：" prop="estimateLiveTime">
                    <span>{{ruleForm.estimateLiveTime}}</span>
                </el-form-item>
                <el-form-item label="直播宣传图：" prop="frontCoverUrl">
                    <!-- <el-image 
                        :preview-src-list="[ruleForm.frontCoverUrl]"
                        style="width: 100px; height:100px"
                        :src="ruleForm.frontCoverUrl "
                        alt="">
                    </el-image> -->
                    <img
                    v-if="ruleForm.frontCoverUrl && ruleForm.frontCoverUrl!=''"
                    style="width: 100px; height:100px"
                    :src="ruleForm.frontCoverUrl"
                    alt=""
                    />
                </el-form-item>
                <el-form-item label="直播推广图：" prop="spreadUrl">
                    <!-- <el-image 
                        :preview-src-list="[ruleForm.spreadUrl]"
                        style="width: 100px; height:100px"
                        :src="ruleForm.spreadUrl "
                        alt="">
                    </el-image> -->
                    <img
                    v-if="ruleForm.spreadUrl && ruleForm.spreadUrl!=''"
                    style="width: 100px; height:100px"
                    :src="ruleForm.spreadUrl "
                    alt="" 
                    />
                </el-form-item>
                <el-form-item label="助手：" prop="assistant">
                    <div class="product-box">
                        <el-tag
                            v-for="(item, index) in assistantList"
                            :key="index"
                            type="info">
                            {{item}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="投放形式：" prop="launchType">
                    <el-radio disabled v-model="launchType" label="1">全员开放</el-radio>
                    <el-radio disabled v-model="launchType" label="2">动态组投放</el-radio>
                </el-form-item>
                <el-form-item label="投放人群：" prop="dynamicGroupName" v-if="launchType=='2'">
                    <div class="product-box">
                        <el-tag
                            v-for="(item, index) in GroupNameList"
                            :key="index"
                            type="info">
                            {{item}}
                        </el-tag>
                    </div>
                </el-form-item>
                 <el-form-item
                class="quill-editor"
                label="直播介绍："
                prop="liveIntroduce"
                >
                <quill-editor
                    disabled
                    v-model="ruleForm.liveIntroduce"
                    ref="myQuillEditor"
                    style="height: 380px"
                    :options="editorOption"
                    @focus="focus($event)"
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
                    <!-- <select class="ql-font" title="字体">
                        <option value="SimSun">宋体</option>
                        <option value="SimHei">黑体</option>
                        <option value="Microsoft-YaHei">微软雅黑</option>
                        <option value="KaiTi">楷体</option>
                        <option value="FangSong">仿宋</option>
                        <option value="Arial">Arial</option>
                    </select> -->
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
                <el-form-item label="直播背景图：" prop="frontCover">
                    <!-- <el-image 
                        :preview-src-list="[ruleForm.frontCover]"
                        style="width: 100px; height:100px"
                        :src="ruleForm.frontCover "
                        alt="">
                    </el-image> -->
                    <img 
                    v-if="ruleForm.frontCover && ruleForm.frontCover!=''"
                    style="width: 100px; height:100px"
                    :src="ruleForm.frontCover "
                    alt="" 
                    />
                </el-form-item>
            </el-form>
            <div style="width:100%;text-align: right;">
                <el-button size="small" type="primary" @click="closeCurrentTab()">关闭</el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
import CustomUpload from "@/components/common/custom-upload";
import ComModule from "@/mixins/common-module";
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
    mixins: [ComModule],
    components: {
        quillEditor,
        CustomUpload,
    },
   data() {
       return{
            ruleForm: {

            },
            launchType:"",
            GroupNameList:[],
            assistantList:[],
            editorOption: {
                placeholder: "请输入",
                theme: "snow", // or 'bubble'
                modules: {
                    toolbar: {
                        container: "#toolbar",
                    },
                },
            },
            TiLength: 0,
       }
   },
   activated(){
       this.GroupNameList=[]
       this.assistantList=[]
       this.ruleForm = JSON.parse(window.localStorage.getItem("previewPreviewInfo"))
       console.log(this.ruleForm);
       if(this.ruleForm.assistant && this.ruleForm.assistant!=""){
           this.assistantList=this.ruleForm.assistant.split(",")
       }else{
           this.assistantList=[]
       }
       if(this.ruleForm.dynamicGroupName && this.ruleForm.dynamicGroupName!=""){
           this.launchType="2"
           this.GroupNameList=this.ruleForm.dynamicGroupName.split(",")
       }else{
           this.launchType="1"
           this.GroupNameList=[]
       }
   },
   methods:{
        onEditorChange(e) {
            e.quill.deleteText(2000, 4);
            if (this.ruleForm.liveIntroduce == "") {
                this.TiLength = 0;
            } else {
                this.TiLength = e.quill.getLength() - 1;
                this.$refs.ruleForm.clearValidate("liveIntroduce");
            }
        },
        //获取焦点事件
        focus(event){
            event.enable(false);  //设置富文本编辑器不可编辑
        }
   },
}

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

  /deep/.frontCover-img-box {
    .frontCover-box {
      position: relative;
      display: inline-block;
    }
    .el-image {
      margin: 0 !important;
    }
    .close-img {
      position: absolute;
      width: 24px;
      height: 24px;
      top: 0;
      right: 0;
    }
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
/deep/.product-box {
    width: 500px;
    border-radius: 5px;
    border: 1px solid #D7DAE2;
    padding: 12px;
    // margin-top: 10px;

    .el-tag {
        margin-right: 10px;
        margin-bottom: 5px;
    }

    .el-tag:last-child {
        margin-right: 0
    }
}
</style>