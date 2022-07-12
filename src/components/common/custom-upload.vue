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
        <i @click="deleteCount(item)" class="el-icon-delete"></i>
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
      class="upload-demo"
      :action="uploadUrl"
      :multiple="multiple"
      :show-file-list="false"
      :file-list="uploadList"
      :limit="limit"
      :on-success="uploadSuccess"
      :on-progress="uploadProgress"
      :on-error="uploadError"
      :on-exceed="uploadExceed"
      :before-upload="beforeUpload"
    >
      <div class="custom-style">
        <i class="el-icon-plus"></i>
      </div>
    </el-upload>
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
import Cookies from "js-cookie";
export default {
  components: {
    VideoFlvComponent,
    SvgaDialog
  },
  data() {
    return {
      uploadList: [],
      deleteUid: null, //删除的附件uid
      // 预览
      previewVisible: false,
      previewInfo: null,
      imgTypes: ["png", "jpg", "jpeg", "webp", "gif"], //一般图片格式
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
    fileList(val) {
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
    },
  },
  methods: {
    // 返回附件type
    getFileType(url) {
      let type = url.split(".")
      type = type[type.length - 1].toLocaleLowerCase()
      return type
    },
    //限制图片尺寸
    limitFileWH(E_width, E_height, file) {
      let _this = this;
      let imgWidth = "";
      let imgHight = "";
      const isSize = new Promise(function (resolve, reject) {
        let width = E_width;
        let height = E_height;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          imgWidth = img.width;
          imgHight = img.height;
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return true;
        },
        () => {
          _this.$message.warning({
            message:
              "上传文件的图片大小不合符标准,宽需要为" +
              E_width +
              "px，高需要为" +
              E_height +
              "px。当前上传图片的宽高分别为：" +
              imgWidth +
              "px和" +
              imgHight +
              "px",
            btn: false,
          });
          return false;
        }
      );
      return isSize;
    },
    // 上传前
    beforeUpload(file) {
      let type = file.type ? file.type.split("/") : file.name.split(".");
      type = type[type.length - 1];
      let fileType = this.fileType.includes(type.toLocaleLowerCase());

      let fileSize = file.size / 1024 / 1024 < this.fileMaxSize;

      if (!fileSize) {
        this.$message.error(`上传附件大小不能超过 ${this.fileMaxSize}M!`);
        return false;
      }

      if (!fileType) {
        this.$message.error(`上传格式错误（允许${this.fileType.join(",")}）`);
        return false;
      }

      // if (file.type.indexOf("image") !== -1) {
      //   //调用[限制图片尺寸]函数
      //   this.limitFileWH(630, 347, file).then((res) => {
      //     if (res) {
            this.uploadList.push({
              uid: file.uid,
              uploading: true,
              progress: 0,
              type: file.type,
              name: file.name,
            });
            return true;
      //     }
      //   });
      // } else if (file.type.indexOf("video") !== -1) {
      //   this.uploadList.push({
      //     uid: file.uid,
      //     uploading: true,
      //     progress: 0,
      //     type: file.type,
      //     name: file.name,
      //   });
      //   return true;
      // }
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
      this.$message.error(err.type);
    },
    // 超出上传数量
    uploadExceed() {
      this.$message.error(`只能上传${this.limit}只附件`);
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
</style>