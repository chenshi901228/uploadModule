
<!-- 新增视频 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataForm"
      label-width="110px"
      size="small"
    >
      <el-form-item label="视频主题" prop="liveTheme">
        <el-input
          placeholder="请输入视频主题"
          style="width: 640px"
          maxlength="60"
          show-word-limit
          v-model="dataForm.liveTheme"
        ></el-input>
      </el-form-item>
      <el-form-item label="视频显示" prop="showMode">
        <el-select
          style="width: 640px"
          v-model="dataForm.showMode"
          clearable
          placeholder="请选择"
        >
          <el-option label="竖屏" :value="0"></el-option>
          <el-option label="横屏" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频宣传图" required>
        <custom-upload
          ref="frontCoverUpload"
          @uploadSuccess="frontCoverUploadSuccess"
          @uploadRemove="frontCoverUploadRemove"
          :fileList="frontCoverList"
          :fileType="['png', 'jpg', 'jpeg']"
          :fileMaxSize="2"
        ></custom-upload>
        <div>
          格式限制：jpg/jpeg/png，建议图片尺寸不小于630px*347px；大小不得超过2M
        </div>
      </el-form-item>
      <!-- <el-form-item label="视频推广图">
        <custom-upload
          ref="extensionUpload"
          @uploadSuccess="extensionUploadSuccess"
          @uploadRemove="extensionUploadRemove"
          :fileList="extensionList"
          :fileType="['png', 'jpg', 'jpeg']"
          fileWH="460/368"
          :fileMaxSize="2"
        ></custom-upload>
        <div>
          格式限制：jpg/jpeg/png，图片尺寸为460px*368px；大小不得超过2M
        </div>
      </el-form-item> -->
      <el-form-item label="视频推广图" prop="spreadUrl" class="img-item is-required">
          <div v-for="item in extensionImg" :key="item" class="img-box">
            <el-image style="width: 100px; height: 100px" :src="item" fit="cover" @click="extensionImgPic(item)"></el-image>
            <img v-if="item === dataForm.spreadUrl" class="like-img" src="@/assets/img/like_red.png" alt="" />
          </div>
          <div v-for="item in extensionList" :key="item" class="img-box">
            <el-image style="width: 100px; height: 100px" :src="item" fit="cover" @click="extensionImgPic(item)"></el-image>
            <img v-if="item === dataForm.spreadUrl" class="like-img" src="@/assets/img/like_red.png" alt="" />
            <img @click="extensionRemove(item)" class="close-img" src="@/assets/img/close.png" alt="" />
          </div>
          <el-upload class="upload-demo" :action="uploadUrl" :on-success="extensionSuccess" list-type="picture-card"
            :multiple="false" :show-file-list="false" :before-upload="beforeAvatarUpload">
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
      </el-form-item>
      <el-form-item>
          <div>
            格式限制：jpg/jpeg/png，图片尺寸为460px×368px，大小不得超过2M
          </div>
      </el-form-item>
      <el-form-item label="上传视频" required>
        <custom-upload
          ref="relationLiveUpload"
          @uploadSuccess="relationLiveUploadSuccess"
          @uploadRemove="relationLiveUploadRemove"
          :fileType="['mp4']"
          :fileList="relationLiveList"
          :fileMaxSize="50"
        ></custom-upload>
        <div>
          格式限制：MP4，竖屏尺寸为：720px*1280px；横屏尺寸为：1280px*720px；大小不得超过50M
        </div>
      </el-form-item>
      <el-form-item label="添加商品" prop="goods">
        <!-- <el-input
          style="width: 640px"
          placeholder="请输入"
          @click.native="chooseProduct"
          v-model="dataForm.goods"
          readonly
          clearable
        ></el-input> -->
        <el-button @click.native="chooseProduct" type="primary">添加</el-button>
        <div class="product-box" v-if="!!productIds.length">
            <el-tag
                v-for="(item, index) in productIds"
                :key="index"
                closable
                @close="closeProductId(index)"
                type="info">
                {{item.productName}}
            </el-tag>
        </div>
      </el-form-item>
    </el-form>
    <div class="footer">
    
      <el-button
        :disabled="submitLoading"
        :loading="submitLoading"
        size="small"
        type="primary"
        @click="submit"
        >确定</el-button
      >
        <el-button :disabled="submitLoading" size="small" @click="cancelAdd"
        >取 消</el-button
      >
    </div>
    <!-- 商品弹框 -->
    <choose-product
      ref="chooseProduct"
      @add="addProductConfirm"
    ></choose-product>
  </el-card>
</template>

<script>
import debounce from "lodash/debounce"
import mixinTableModule from "@/mixins/table-module";
import CustomUpload from "@/components/common/custom-upload";
import { getVideoDuration } from "@/utils/index";
import ChooseProduct from "./chooseDialog/chooseProduct";
import Cookies from "js-cookie";
import { getImageWH } from "@/utils"
export default {
  mixins: [mixinTableModule],
  components: {
    CustomUpload,
    ChooseProduct,
  },
  data() {
    return {
      dataForm: {
        anchorUserId: "",
        liveTheme: "",
        frontCoverUrl: "",
        anchorUser: "",
        showMode: null,
        goods: "",
        livePlaybackProductList: [],
        relationLiveUrl: "",
        spreadUrl:""
      },
      frontCoverList: [], //封面列表
      loading: false, //输入主播选择loading
      anchorOptions: [], //主播选项
      relationLiveList: [], //视频列表
      extensionList:[],//直播推广图
      uploadUrl: "",
      rules: {
        liveTheme: [
          { required: true, message: "请输入视频主题", trigger: "blur" },
        ],
        showMode: [
          { required: true, message: "请选择视频显示", trigger: "blur" },
        ],
      },
      submitLoading: false,
      dynamicGroupOptions: [], //投放人群
      getDynamicGroupLoading: false, //下拉框加载数据loading
      goods: [],
      productIds: [], //推荐商品ids

      extensionImg:[],//直播推广图
    };
  },
  created() {
    this.uploadUrl = `${window.SITE_CONFIG["apiURL"]
      }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
    this.dataForm.anchorUserId = this.userInfo.id;
    this.dataForm.anchorUser = this.userInfo.realName;
    this.extensionImg=[]
    this.extensionList=[]
    this.getExtensionList()
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  activated() {},
  methods: {
    // 推荐商品弹框
    chooseProduct() {
      this.$refs.chooseProduct.init(this.productIds);
    },

    // 确认添加推荐商品
    addProductConfirm(data) {

      this.dataForm.livePlaybackProductList = data.map((v) => {
        return {
          anchorProductId: v.anchorProductId,
          anchorId: this.dataForm.anchorUserId,
          productId: v.productId,
        };
      });
      this.productIds = data;
      // this.dataForm.livePlaybackProductList = data;
      this.dataForm.goods = data.length ? `已选择${data.length}个商品` : "";
    },

    closeProductId(index) {
      this.productIds.splice(index, 1)
    },
    // 封面图上传
    frontCoverUploadSuccess(file) {
      this.frontCoverList.push(file);
    },
    frontCoverUploadRemove(file) {
      this.frontCoverList = this.frontCoverList.filter(
        (item) => item.uid != file.uid
      );
    },
    // 回放视频上传
    relationLiveUploadSuccess(file) {
      this.relationLiveList.push(file);
    },
    relationLiveUploadRemove(file) {
      this.relationLiveList = this.relationLiveList.filter(
        (item) => item.uid != file.uid
      );
    },
    //选择照片-视频推广图
    extensionImgPic(url) {
      if (url && this.dataForm.spreadUrl !== url) {
        this.dataForm.spreadUrl = url;
      }
    },
    // 视频推广图上传
    extensionUploadSuccess(file) {
      this.extensionList.push(file);
    },
    extensionUploadRemove(file) {
      this.extensionList = this.extensionList.filter(
        (item) => item.uid != file.uid
      );
    },
    //视频推广图上传前
    async beforeAvatarUpload(file) {
      let type = file.type ? file.type.split("/") : file.name.split(".");
      type = type[type.length - 1];
      let fileSize = file.size / 1024 / 1024 < 2;
      if (type != "jpg" && type != "jpeg" && type != "png") {
        this.$message.warning('视频推广图只能是 jpg/jpeg/png 格式!');
        return Promise.reject(false);
      }
      let res = await getImageWH(file)
      if(res && (Math.abs(res.width - 460) > 6 || Math.abs(res.height - 368) > 6) ) {
        this.$message.warning(`图片尺寸大小为460px*368px`);
        return Promise.reject(false);
      }
      if (!fileSize) {
        this.$message.warning('视频推广图大小不能超过 2MB!');
        return Promise.reject(false);
      }
    },
    //删除照片-背景图
    extensionRemove(url) {
      this.extensionList.forEach((v, i) => {
        if (url === v) {
          this.extensionList.splice(i, 1);
        }
      });
      if (this.extensionList.length === 0) {
        this.dataForm.spreadUrl = this.extensionImg[0];
      } else {
        this.dataForm.spreadUrl = this.extensionList[0];
      }
    },
    //上传后-视频推广图
    extensionSuccess(response, file, fileList) {
      this.extensionList.push(response.data.url);
      this.dataForm.spreadUrl = response.data.url;
    },
    //获取视频推广图
    getExtensionList() {
      this.$http
        .get(`/sys/livecoverpicture/getCoverPictureList?style=1&classification=7`)
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
          this.extensionImg = list;
          this.dataForm.spreadUrl = this.extensionImg[0];
        })
        .catch((err) => {
          throw err;
        });
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
                  value: JSON.stringify({
                    anchorUser: item.username,
                    anchorTel: item.phone,
                    anchorUserId: item.weixinUserId,
                  }),
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
    // 投放人群下拉请求数据
    getDynamicGroup(value) {
      if (value) {
        if (!this.dataForm.anchorUser)
          return this.$message.warning("请先输入搜索选择主播");
        let t = JSON.parse(this.dataForm.anchorUser);
        this.getDynamicGroupLoading = true;
        this.$http
          .get("/sys/dynamicGroup/getDynamicGroupList", {
            params: { id: t.anchorUserId },
          })
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.dynamicGroupOptions = res.data;
            } else {
              this.$message.error(res.msg);
              this.dynamicGroupOptions = [];
            }
            this.getDynamicGroupLoading = false;
          })
          .catch((err) => {
            this.getDynamicGroupLoading = false;
            this.dynamicGroupOptions = [];
          });
      }
    },
    // 取消添加
    cancelAdd() {
      // this.$refs.dataForm.resetFields();
      // this.dataForm.frontCoverUrl = "";
      // this.frontCoverList = [];
      // this.relationLiveList = [];
      // this.dataForm.relationLiveUrl = "";

      // this.dynamicGroupOptions = [];
      // this.closeCurrentTab();
      this.closeCurrentTab();
    },
    // 表单提交
    submit: debounce(function() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          if (
            !this.$refs.frontCoverUpload.isUploadAll() ||
            !this.$refs.relationLiveUpload.isUploadAll()
          ) {
            return this.$message.error("有附件正在上传中");
          }

          if (!this.frontCoverList.length) {
            return this.$message.error("请先上传视频宣传图");
          }
          if(!this.dataForm.spreadUrl){
            return this.$message.error("请先上传视频推广图");
          }
          if (!this.relationLiveList.length) {
            return this.$message.error("请上传视频");
          }
          

          if(this.dataForm.showMode==0){
            if(this.relationLiveList[0].videoWHInfo.videoWidth>720 || this.relationLiveList[0].videoWHInfo.videoHeight>1280){
              return this.$message.warning("竖屏上传视频尺寸最高为720px*1280px");
            }
          }else if(this.dataForm.showMode==1){
            if(this.relationLiveList[0].videoWHInfo.videoWidth>1280 || this.relationLiveList[0].videoWHInfo.videoHeight>720){
              return this.$message.warning("横屏上传视频尺寸最高为1280px*720px");
            }
          }else{
            return this.$message.error("请选择视频显示");
          }
          

          this.submitLoading = true;
          
          let params = {};
          params = JSON.parse(JSON.stringify(this.dataForm));

          // 附件处理
          params.frontCoverUrl = this.frontCoverList[0].url;
          params.relationLiveUrl = this.relationLiveList[0].url;
          // params.spreadUrl = this.extensionList[0].url;
          params.spreadUrl = this.dataForm.spreadUrl;
          params.videoSize = this.relationLiveList[0].size; //视频大小

          //视频原始长宽
          params.width=this.relationLiveList[0].videoWHInfo.videoWidth
          params.height=this.relationLiveList[0].videoWHInfo.videoHeight
          // 视频时长
          let liveDuration = await getVideoDuration(
            this.relationLiveList[0].url
          );
          params.longTime = Math.ceil(liveDuration);


          this.$http
            .post("/sys/livePlayback/save", { ...params })
            .then(({ data: res }) => {
              this.submitLoading = false;
              if (res.code == 0) {
                this.$message.success("添加视频成功");
                this.closeCurrentTab();
                this.$router.push({
                  path:"/videoManagement-VideoManagement"
                })
                // this.ruleForm.frontCoverUrl = this.defaultImg[0]; 
                this.dataForm.spreadUrl = this.extensionImg[0]; 
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.submitLoading = false;
              throw err;
            });
        }
      });
    }, 1500, { 'leading': true, 'trailing': false }),
  },
};
</script>
<style lang="scss" scoped>
/deep/ .upload-demo .custom-style {
    width: 380px;
    height: 180px;
    border: 1px solid #dcdfe6;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 2px;
}
/deep/.product-box {
    width: 640px;
    border-radius: 5px;
    border: 1px solid #D7DAE2;
    padding: 12px;
    margin-top: 10px;

    .el-tag {
        margin-right: 10px;
    }

    .el-tag:last-child {
        margin-right: 0
    }
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
</style>