<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__liveList">
            <el-form :model="ruleForm" ref="ruleForm" size="small" label-width="110px" class="demo-ruleForm">
                <el-form-item label="直播主题：" prop="liveTheme">
                    <span>{{ruleForm.liveTheme || '--'}}</span>
                </el-form-item>
                <el-form-item label="主播：" prop="anchorUser">
                    <span>{{ruleForm.anchorUser}}</span>
                </el-form-item>
                <el-form-item label="开播时间：" prop="startDate">
                    <span>{{ruleForm.startDate || '--'}}</span>
                </el-form-item>
                <el-form-item label="结束时间：" prop="endDate">
                    <span>{{ruleForm.endDate || '--'}}</span>
                </el-form-item>
                <el-form-item label="直播时长(分)：" prop="liveTime">
                    <span>{{ruleForm.liveTime || '--'}}</span>
                </el-form-item>
                <el-form-item label="直播宣传图：" prop="frontCoverUrl">
                    <el-image 
                        v-if="ruleForm.frontCoverUrl"
                        :preview-src-list="[ruleForm.frontCoverUrl]"
                        style="width: 100px; height:100px"
                        :src="ruleForm.frontCoverUrl "
                        alt="">
                    </el-image>
                    <!-- <img
                    v-if="ruleForm.frontCoverUrl && ruleForm.frontCoverUrl!=''"
                    style="width: 100px; height:100px"
                    :src="ruleForm.frontCoverUrl"
                    alt=""
                    /> -->
                </el-form-item>
                <el-form-item label="直播推广图：" prop="spreadUrl">
                    <el-image 
                        v-if="ruleForm.spreadUrl"
                        :preview-src-list="[ruleForm.spreadUrl]"
                        style="width: 100px; height:100px"
                        :src="ruleForm.spreadUrl "
                        alt="">
                    </el-image>
                    <!-- <img
                    v-if="ruleForm.spreadUrl && ruleForm.spreadUrl!=''"
                    style="width: 100px; height:100px"
                    :src="ruleForm.spreadUrl "
                    alt="" 
                    /> -->
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
                <el-form-item label="直播背景图：" prop="frontCover">
                    <el-image 
                        v-if="ruleForm.frontCover"
                        :preview-src-list="[ruleForm.frontCover]"
                        style="width: 100px; height:100px"
                        :src="ruleForm.frontCover "
                        alt="">
                    </el-image>
                    <!-- <img 
                    v-if="ruleForm.frontCover && ruleForm.frontCover!=''"
                    style="width: 100px; height:100px"
                    :src="ruleForm.frontCover "
                    alt="" 
                    /> -->
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
import "../../../../assets/font.css";

export default {
    mixins: [ComModule],
    components: {
        CustomUpload,
    },
   data() {
       return{
            ruleForm: {

            },
            launchType:"",
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
       this.assistantList=[]
       this.ruleForm = JSON.parse(window.localStorage.getItem("liveManagementAnchorInfo"))
       console.log(this.ruleForm);
       if(this.ruleForm.assistant && this.ruleForm.assistant!=""){
           this.assistantList=this.ruleForm.assistant.split(",")
       }else{
           this.assistantList=[]
       }
   },
   methods:{

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