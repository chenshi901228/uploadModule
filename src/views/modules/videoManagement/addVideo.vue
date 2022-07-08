
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
          style="width: 400px"
          v-model="dataForm.liveTheme"
        ></el-input>
      </el-form-item>
      <el-form-item label="视频显示" prop="showMode">
        <el-select
          style="width: 400px"
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
          格式限制：jpg/jpeg/png,建议图片尺寸不小于630px×347px，大小不得超过2M
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
          格式限制：MP4,竖屏尺寸为720px×1280px，横屏尺寸为：1280px*720px;大小不得超过50M
        </div>
      </el-form-item>
      <el-form-item label="添加商品" prop="goods">
        <el-input
          style="width: 400px"
          placeholder="推荐商品"
          @click.native="chooseProduct"
          v-model="dataForm.goods"
          readonly
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button :disabled="submitLoading" size="small" @click="cancelAdd"
        >取 消</el-button
      >
      <el-button
        :disabled="submitLoading"
        :loading="submitLoading"
        size="small"
        type="primary"
        @click="submit"
        >添 加</el-button
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
import mixinTableModule from "@/mixins/table-module";
import CustomUpload from "@/components/common/custom-upload";
import { getVideoDuration } from "@/utils/index";
import ChooseProduct from "./chooseDialog/chooseProduct";
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
      },
      frontCoverList: [], //封面列表
      loading: false, //输入主播选择loading
      anchorOptions: [], //主播选项
      relationLiveList: [], //视频列表
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
    };
  },
  created() {
    this.dataForm.anchorUserId = this.userInfo.id;
    this.dataForm.anchorUser = this.userInfo.realName;
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
      console.log(data);
      this.$refs.chooseProduct.close();

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
    submit() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          if (
            !this.$refs.frontCoverUpload.isUploadAll() ||
            !this.$refs.relationLiveUpload.isUploadAll()
          ) {
            return this.$message.error("有附件正在上传中");
          }

          if (!this.frontCoverList.length) {
            return this.$message.error("请上传封面图");
          }
          if (!this.relationLiveList.length) {
            return this.$message.error("请上传视频");
          }

          let params = {};
          params = JSON.parse(JSON.stringify(this.dataForm));

          // 附件处理
          params.frontCoverUrl = this.frontCoverList[0].url;
          params.relationLiveUrl = this.relationLiveList[0].url;
          params.videoSize = this.relationLiveList[0].size; //视频大小
          // 视频时长
          let liveDuration = await getVideoDuration(
            this.relationLiveList[0].url
          );
          params.longTime = Math.ceil(liveDuration);

          this.submitLoading = true;

          this.$http
            .post("/sys/livePlayback/save", { ...params })
            .then(({ data: res }) => {
              if (res.code == 0) {
                this.$message.success("添加视频成功");
                this.submitLoading = false;
                this.closeCurrentTab();
                this.$router.push({
                  path:"/videoManagement-VideoManagement"
                })
              } else {
                this.submitLoading = false;
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.submitLoading = false;
              throw err;
            });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>