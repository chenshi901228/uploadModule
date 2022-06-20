
<!-- 新增视频 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataForm"
      label-width="110px"
    >
      <el-form-item label="视频主题" prop="liveTheme">
        <el-input v-model="dataForm.liveTheme"></el-input>
      </el-form-item>
      <el-form-item label="视频显示" prop="showMode">
        <el-select
          style="width: 100%"
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
        ></custom-upload>
      </el-form-item>
      <el-form-item label="上传视频" required>
        <custom-upload
          ref="relationLiveUpload"
          @uploadSuccess="relationLiveUploadSuccess"
          @uploadRemove="relationLiveUploadRemove"
          :fileType="['mp4']"
          :fileList="relationLiveList"
        ></custom-upload>
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
          <span class="count">{{dataForm.productIds.length}}条</span>
        </el-form-item>
    </el-form>
    <div class="footer">
      <el-button :disabled="submitLoading" size="small" @click="visible = false"
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
      <choose-product ref="chooseProduct" @add="addProductConfirm"></choose-product>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import CustomUpload from "@/components/common/custom-upload";
import { getVideoDuration } from "@/utils/index";
import ChooseProduct from "@/components/chooseDialog/chooseProduct"
export default {
  mixins: [mixinTableModule],
  components: {
    CustomUpload,
    ChooseProduct
  },
  data() {
    return {
      visible: false,
      dataForm: {
        anchorUserId: "",
        liveTheme: "",
        frontCoverUrl: "",
        anchorUser: "",
        showMode: null,
        relationLiveUrl: "",
        goods:"",
        productIds:[]
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
      productIds: [],
    };
  },
  created() {
    this.dataForm.anchorUserId = this.userInfo.id
    this.dataForm.anchorUser = this.userInfo.realName
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
        this.$refs.chooseProduct.init(this.dataForm.productIds)
    },

    // 确认添加推荐商品
    addProductConfirm(data) {
        this.$refs.chooseProduct.close()

        this.dataForm.productIds = data
        this.dataForm.goods = data.map(item => item.productName).join(",")
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
    cancel() {
      this.$refs.dataForm.resetFields();
      this.dataForm.frontCoverUrl = "";
      this.dataForm.relationLiveUrl = "";
      this.frontCoverList = [];
      this.relationLiveList = [];

      this.dynamicGroupOptions = [];
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
          params.videoSize = this.relationLiveList[0].size;
          let liveDuration = await getVideoDuration(
            this.relationLiveList[0].url
          );
          params.liveDuration = (liveDuration / 60).toFixed(2);

          this.submitLoading = true;
          this.$http
            .post("/sys/livePlayback/save", { ...params })
            .then(({ data: res }) => {
              if (res.code == 0) {
                this.$message.success("添加视频成功");
                this.submitLoading = false;
                this.cancel();
                this.visible = false;
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