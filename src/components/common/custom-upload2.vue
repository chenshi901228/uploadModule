<!--自定义附件上传-->

<template>
  <div class="upload-item">
    <div
      v-for="item in uploadList"
      :key="item.url"
      class="custom-upload-fileList"
    >
      <div v-if="item.uploading" class="uploadLoading">
        <el-progress
          type="circle"
          :width="90"
          :percentage="item.progress"
        ></el-progress>
      </div>
      <div v-if="item.url" class="fileHandle">
        <i @click="previewImg(item)" class="el-icon-view"></i>
        <i v-if="!disabled" @click="deleteCount(item)" class="el-icon-delete"></i>
      </div>
      <img
        v-if="item.url && imgTypes.includes(getFileType(item.url))"
        :src="item.url"
        alt=""
      />
      <div v-else class="other">
        <i style="font-size: 30px" class="el-icon-video-camera-solid"></i>
      </div>
    </div>
    <el-upload
      v-if="uploadList.length < limit"
      class="upload-demo"
      :action="uploadUrl"
      :multiple="multiple"
      :show-file-list="false"
      :file-list="uploadList"
      :limit="limit"
      :disabled="disabled || isCropImage"
      :on-success="uploadSuccess"
      :on-progress="uploadProgress"
      :on-error="uploadError"
      :on-exceed="uploadExceed"
      :before-upload="beforeUpload"
    >
      <div class="custom-style" @click="isCropImage ? cropShow = true : () => {}">
        <i class="el-icon-plus"></i>
      </div>
    </el-upload>

    <!-- 裁剪框 -->
    <crop-upload 
      ref="cropRef"
      field="file"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      @input="cropDialogHandle"
      v-model="cropShow"
		  :width="cropWidth"
		  :height="cropHeight"
		  :url="uploadUrl"
      :langExt="{preview: '图片预览'}"
      :maxSize="fileMaxSize * 1024"
		  :params="cropUploadParams"
		  :headers="cropUploadHeaders"></crop-upload>

    <!-- 预览弹框 -->
    <el-dialog
      width="60%"
      append-to-body
      :destroy-on-close="true"
      :visible.sync="previewVisible"
    >
      <div style="display: flex; justify-content: center; -items: center">
        <!-- 普通图片 -->
        <img
          v-if="previewInfo && imgTypes.includes(previewInfo.previewType)"
          style="max-width: 100%"
          :src="previewInfo && previewInfo.url"
          alt=""
        />
        <!-- mp4 -->
        <video
          style="max-width: 100%"
          v-else-if="previewInfo && previewInfo.previewType == 'mp4'"
          :src="previewInfo && previewInfo.url"
          controls
        ></video>
        <!-- flv格式 -->
        <!-- <video-flv-component
          v-else
          :url="previewInfo && previewInfo.url"
        ></video-flv-component> -->
      </div>
    </el-dialog>
    <!-- 查看svga弹框 -->
    <svga-dialog ref="svgaRef"></svga-dialog>

  </div>
</template>
<script>
import VideoFlvComponent from "@/components/common/videoFlvComponent";
import SvgaDialog from "@/components/common/svgaDialog.vue"
import CropUpload from "vue-image-crop-upload/upload-2.vue"
import { getImageWH, getUUID } from "@/utils"
import Cookies from "js-cookie";
export default {
  components: {
    VideoFlvComponent,
    SvgaDialog,
    CropUpload
  },
  data() {
    return {
      uploadList: [],
      deleteUid: null, //删除的附件uid
      // 预览
      previewVisible: false,
      previewInfo: null,
      imgTypes: ["png", "jpg", "jpeg", "webp", "gif"], //一般图片格式
      cropShow: false,

      videoWHInfo:{},
    };
  },
  computed: {
    uploadUrl() {
      return `${
        window.SITE_CONFIG["apiURL"]
      }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
    },
  },
  props: {
    // 默认附件列表
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否开启裁剪功能
    isCropImage: {
      type: Boolean,
      default: false,
    },
    // 裁剪宽度
    cropWidth: {
      type: Number,
      default: 124
    },
    // 裁剪高度
    cropHeight: {
      type: Number,
      default: 124
    },
    // 裁剪上传参数
    cropUploadParams: {
			type: Object,
			'default': null
		},
    // 裁剪上传请求头
    cropUploadHeaders: {
			type: Object,
			'default': null
		},
    // 数量限制
    limit: {
      type: Number,
      default: 1,
    },
    // 上传附件大小限制
    fileMaxSize: {
      type: Number,
      default: 200,
    },
    // 上传附件尺寸限制----- "eg:300/300"
    fileWH: {
      type: String,
      default: ""
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    //自定义可上传附件格式
    fileType: {
      type: Array,
      default: () => {
        return ["png", "jpg", "jpeg", "webp", "gif"];
      },
    },
  },
  watch: {
    fileList: {
      immediate: true,
      handler(val) {
        if (val.length) {
          if (this.deleteUid) {
            //删除附件
            this.uploadList = this.uploadList.filter(
              (item) => item.uid != this.deleteUid
            );
            this.deleteUid = null;
          } else {
            //更新上传附件信息
            if(!this.uploadList.length) { //
              this.uploadList = val
            }else {
              this.uploadList = this.uploadList.map((i) => {
                let t = null;
                val.map((j) => {
                  if (i.uid == j.uid) {
                    t = { ...i, ...j };
                  }
                });
                return t || i;
              });
            }
          }
        } else {
          this.uploadList = [];
          this.deleteUid = null;
        }
      }
    },
  },
  methods: {
    // 关闭裁剪框后返回上传成功的对象
    cropDialogHandle(type) {
      // 裁剪在第二步关闭之后跳到第一步
      if(this.$refs.cropRef && this.$refs.cropRef.step == 2) {
        this.$refs.cropRef.setStep(1)
      }
      // 裁剪上传成功之后关闭-返回上传的对象
      if(this.cropUploadSuccessObj && !type) {
        let res = JSON.parse(JSON.stringify(this.cropUploadSuccessObj))
        this.cropUploadSuccessObj = null

        this.uploadList.push(res);
        this.$emit("uploadSuccess", res);  //返回obj
      }
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field){
      console.log('-------- crop success --------');
      // console.log(imgDataUrl, field)
      // this.imgDataUrl = imgDataUrl;
    },
    /**
     * upload success
     *
     * [param] jsonData  server api return data, already json encode
     * [param] field
     */
    cropUploadSuccess(jsonData, field){
      console.log('-------- upload success --------');
      // console.log(jsonData);
      if(jsonData.code == 0) {
        let type = this.getFileType(jsonData.data.url)
        let uuid = getUUID()
        let t = {
          url: jsonData.data.url,
          size: jsonData.data.size,
          uid: uuid,
          type: type,
          name: uuid,
        }
        this.cropUploadSuccessObj = t
      }else {
        this.$message.error(jsonData.msg)
      }
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field){
      console.log('-------- upload fail --------');
      // console.log(status);
      this.$message.error(status)
    },
    // 返回附件type
    getFileType(url) {
      let type = url.split(".")
      type = type[type.length - 1].toLocaleLowerCase()
      return type
    },
    // 上传前
    async beforeUpload(file) {
      
      var videoUrl = URL.createObjectURL(file);
      var videoObj = document.createElement("video");
      videoObj.src = videoUrl;
      videoObj.onloadedmetadata = () => {
        URL.revokeObjectURL(videoUrl);
        console.log(videoObj.videoWidth,'-视频宽' ,videoObj.videoHeight,'-视频高');
        this.videoWHInfo=videoObj
      };
      

      let type = file.type ? file.type.split("/") : file.name.split(".");
      type = type[type.length - 1];
      let fileType = this.fileType.includes(type.toLocaleLowerCase());

      let fileSize = file.size / 1024 / 1024 < this.fileMaxSize;

      // 附件大小
      if (!fileSize) {
        this.$message.warning(`上传附件大小不能超过 ${this.fileMaxSize}M!`);
        return Promise.reject(false);
      }
      // 附件格式
      if (!fileType) {
        this.$message.error(`上传格式错误（允许${this.fileType.join(",")}）`);
        return Promise.reject(false);
      }
      // 附件尺寸-视频/图片
      if(this.fileWH) {
        let WH = this.fileWH.split("/")
        let res = await getImageWH(file)
        if(res && (Math.abs(res.width - WH[0]) || Math.abs(res.height - WH[1]))) {
          this.$message.warning(`附件尺寸大小限制为${WH[0]}px*${WH[1]}px`);
          return Promise.reject(false);
        }
      }

      this.uploadList.push({
        uid: file.uid,
        uploading: true,
        progress: 0,
        type: file.type,
        name: file.name,
      });
      return true;
    },
    // 上传中
    uploadProgress(event, file, fileList) {
      this.uploadList = this.uploadList.map((item) => {
        if (item.uid == file.uid) {
          item.progress = Math.floor((event.loaded / event.total) * 100);
        }
        return item;
      });
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      if (response.code == 0) {
        let t = {
          url: response.data.url,
          size: response.data.size,
          uid: file.uid,
          type: file.type,
          name: file.name,
          videoWHInfo:this.videoWHInfo
        };
        // 上传成功uploading = false
        this.uploadList = this.uploadList.map((item) => {
          if (item.uid == file.uid) {
            item.uploading = false;
          }
          return item;
        });

        this.$message.success("上传成功");
        this.$emit("uploadSuccess", t);  //返回obj
      } else {
        this.uploadList = this.uploadList.filter(
          (item) => item.uid != file.uid
        );
        this.$message.error(response.msg);
      }
    },
    // 上传失败
    uploadError(err, file, fileList) {
      console.log(err, file, fileList);
      this.uploadList = this.uploadList.filter((item) => item.uid != file.uid);
      this.$message.error(JSON.stringify(err));
    },
    // 超出上传数量
    uploadExceed() {
      this.$message.warning(`只能上传${this.limit}个附件`);
    },
    // 预览图片
    previewImg(data) {
      this.previewInfo = data;
      if (data.url) {
        let type = data.url.split(".");
        type = type[type.length - 1].toLocaleLowerCase();

        if(type == "svga") { //预览svga
          this.$refs.svgaRef.init({
            name: data.name || "预览",
            dynamicIcon: data.url
          })
        }else {
          this.previewInfo.previewType = type;
          this.previewVisible = true;
        }

      }
    },
    // 删除
    deleteCount(file) {
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUid = file.uid;
          this.$message.success("删除成功!");
          this.$emit("uploadRemove", file); //返回obj
        })
        .catch((err) => {
          console.log(err);
          this.$message.info("已取消删除");
        });
    },
    // 是否所有文件上传完成---true-已完成，false-未完成
    isUploadAll() {
      return this.uploadList.every((item) => !item.uploading);
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-item {
  display: flex;
  flex-wrap: wrap;
  .custom-upload-fileList {
    width: 100px;
    height: 100px;
    border: 1px solid #dcdfe6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    margin-right: 10px;
    overflow: hidden;
    position: relative;
    &:hover {
      .fileHandle {
        opacity: 0.5;
      }
    }
    .uploadLoading {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      // /deep/.el-progress-circle{
      //     width: 100% !important;
      //     height: 100% !important;
      // }
    }
    .fileHandle {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #000;
      opacity: 0;
      transition: all 0.2s;
      i {
        color: #fff;
        cursor: pointer;
        &:not(:first-child) {
          margin-left: 14px;
        }
      }
    }
    img {
      width: 100%;
      // height: 100%;
    }
    .other {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.upload-demo {
  .custom-style {
    width: 100px;
    height: 100px;
    border: 1px solid #dcdfe6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
  }
}

// /deep/.vicp-preview-item-circle{
//   display: none !important;
// }
</style>