
<!-- 基础管理-常见问题 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__goodsList">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        label-position="right"
        @keyup.enter.native="getDataList"
      >
        <el-form-item
          label="问题分类"
          prop="classify"
        >
          <el-select
            style="width: 200px"
            clearable
            v-model="dataForm.classify"
            placeholder="请选择"
          >
            <el-option
              v-for="item in allProblem"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getDataList"
              >{{ $t("query") }}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetDataForm()"
              >{{ $t("reset") }}</el-button
            >
            <!-- <el-button size="mini" plain @click="open">
              <i
                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button> -->
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                :disabled="!dataListSelections.length"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteProblem"
                >批量删除</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                plain
                @click="upImgDialog = true"
                >新增</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="warning"
                plain
                icon="el-icon-download"
                @click="exportHandle"
                >{{ $t("export") }}</el-button
              >
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="top"
              >
                <el-button
                  size="small"
                  icon="el-icon-refresh"
                  circle
                  @click="getDataList"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        @cell-dblclick="dblclick"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          v-for="item in tableItem"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          :sortable="
            ['transcribeFlg', 'liveState', 'showState'].includes(item.prop)
          "
        >
          <template slot-scope="{ row }">
            <!-- 序号 -->
            <div v-if="item.prop == 'num'">
              <el-input
                v-if="sortId === row.id && sortId !== ''"
                size="mini"
                v-model="sortVal"
                placeholder="请输入"
                @blur="sortId = ''"
                :id="'input' + row.id"
                @keyup.enter.native="userSelect"
                type="number"
              ></el-input>
              <span v-else>
                {{ row.num || "--" }}
              </span>
            </div>
            <!-- 分类图标 -->
            <div v-else-if="item.prop == 'pictureUrl'">
              <img
                class="frontCoverImg"
                :src="
                  row.pictureUrl || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
            <!-- 问题分类 -->
            <span v-else-if="item.prop == 'classify'">
              {{ row.classify }}
            </span>
            <!-- 创建时间 -->
            <span v-else-if="item.prop == 'createDate'"
              >{{ row.createDate }}
            </span>
            <!-- 标签 -->
            <!-- <span v-else-if="item.prop == 'isFree'">
              <el-tag size="small" :type="row.isFree ? 'success' : 'danger'">{{
                row.isFree ? "是" : "否"
              }}</el-tag>
            </span> -->
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              @click="handle(row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-c-scale-to-original"
              @click="toProblemList(row)"
              >问题列表</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
    </div>
    <el-dialog title="新增" :visible.sync="upImgDialog" width="30%">
      <el-form
        :model="imgForm"
        ref="imgForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问题分类" prop="name" required>
          <el-input maxlength="10" v-model="imgForm.name" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="上传" prop="img" required>
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-exceed="handleExceed1"
            :limit="1"
            ref="upload"
            :class="imgForm.img.length !== 0 ? 'hide_box' : ''"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div>
            图片大小必须小于2M,支持bmp、png、jpg、jpeg格式,尺寸为80px*80px
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="upImgDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="upImgMethod"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <el-dialog title="查看封面图" :visible.sync="showImgDialog" width="30%">
      <el-form
        :model="bigImgForm"
        ref="imgForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="上传" prop="img">
          <el-image
            style="width: 146px; height: 146px"
            :src="bigUrl"
            :preview-src-list="srcList"
          >
          </el-image>
          <span>点击可看大图</span>
        </el-form-item>
        <el-form-item label="封面图名称" prop="name">
          <el-input disabled v-model="bigImgForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showImgDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑封面图" :visible.sync="editeImgDialog" width="30%">
      <el-form
        :model="editeImgForm"
        ref="imgForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问题分类" prop="name">
          <el-input maxlength="10" v-model="editeImgForm.name" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="上传" prop="img">
          <div
            v-if="editeUrl.length !== 0"
            style="position: relative; display: inline-block"
          >
            <el-image
              style="width: 146px; height: 146px; margin-right: 0"
              :src="editeUrl"
              :preview-src-list="editeSrcList"
            >
            </el-image>
            <el-tooltip effect="dark" content="删除" placement="top">
              <!-- <i
                class="el-icon-close"
                @click="remove"
                style="
                  position: absolute;
                  right: 5px;
                  top: 5px;
                  font-size: 12px;
                  color: #fff;
                  cursor: pointer;
                "
              ></i> -->
              <img
                @click="remove"
                src="@/assets/img/close.png"
                style="
                  position: absolute;
                  right: 5px;
                  top: 5px;
                  font-size: 12px;
                  color: #fff;
                  cursor: pointer;
                "
                alt=""
              />
            </el-tooltip>
          </div>
          <div v-if="editeUrl.length === 0">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview2"
              :on-remove="handleRemove2"
              :on-success="handleSuccess2"
              :on-exceed="handleExceed2"
              :limit="1"
              ref="upload2"
              :class="editeImgForm.img.length !== 0 ? 'hide_box' : ''"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <span>点击可看大图</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="editeImgDialog = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="editeImgMethod"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditeImageVisible">
      <img width="100%" :src="dialogEditeImageUrl" alt="" />
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>该分类的问题列表也会删除，确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmShowState"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import Cookies from "js-cookie";

export default {
  mixins: [mixinTableModule],
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/sysFrequentlyQuestions/page", // 数据列表接口，API地址
        exportURL: "/sys/sysFrequentlyQuestions/export", // 导出接口，API地址
      },
      dataForm: {
        classify: "",
      },
      tableItem: [
        { prop: "num", label: "序号" },
        { prop: "pictureUrl", label: "分类图标" },
        { prop: "classify", label: "问题分类" },
        { prop: "createDate", label: "创建时间" },
      ],
      upImgDialog: false,
      dialogImageUrl: "",
      dialogImageVisible: false,
      uploadUrl: "",
      imgForm: {
        img: "",
        name: "",
      },
      showImgDialog: false,
      bigUrl: "",
      srcList: [],
      bigImgForm: {
        img: "",
        name: "",
      },
      editeImgDialog: false,
      editeImgForm: {
        img: "",
        name: "",
      },
      editeUrl: "",
      editeSrcList: [],
      dialogEditeImageVisible: false,
      dialogEditeImageUrl: "",
      editeId: "",
      allProblem: [],
      ids: [],
      dialogVisible: false,
      dataListSelections: [],
      sortVal: "",
      sortId: "",
    };
  },
  created() {
    this.uploadUrl = `${
      window.SITE_CONFIG["apiURL"]
    }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
  },
  activated() {
    this.query();
    this.getAllProblem();
  },
  watch: {
    upImgDialog(n, o) {
      if (!n) {
        this.imgForm = {
          img: "",
          name: "",
        };
      }
    },
  },
  methods: {
    //排序
    dblclick(row, column, cell, event) {
      if (column.property === "num") {
        this.sortId = row.id;
        this.sortVal = row.num;
        this.$nextTick(() => {
          let id = "#" + "input" + this.sortId;
          document.querySelector(id).focus();
        });
      }
    },
    //回车确认
    userSelect() {
      this.$http
        .put("/sys/sysFrequentlyQuestions", {
          num: this.sortVal,
          id: this.sortId,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.sortId = "";
            this.sortVal = "";
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //问题列表
    toProblemList(row) {
      this.$router.push({
        name: "basicManagement-commonProblem-problemList",
        query: {
          questionsId: row.id,
          classify:row.classify
        },
      });
    },
    //获取所有问题分类
    getAllProblem() {
      this.$http
        .get("/sys/sysFrequentlyQuestions/getClassify")
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.allProblem = res.data;
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量删除
    deleteProblem() {
      this.dialogVisible = true;
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
    },
    handleExceed1(file, fileList) {
      if (fileList.length >= 1) {
        this.$message.warning("只能上传一张！");
      }
    },
    handleExceed2(file, fileList) {
      if (fileList.length >= 1) {
        this.$message.warning("只能上传一张！");
      }
    },
    //编辑图片
    editeImgMethod() {
      if (this.editeImgForm.img === "") {
        this.$message.warning("上传图片不能为空！");
      } else if (this.editeImgForm.name === "") {
        this.$message.warning("名字不能为空！");
      } else {
        this.$http
          .put("/sys/sysFrequentlyQuestions", {
            classify: this.editeImgForm.name,
            pictureUrl: this.editeImgForm.img,
            id: this.editeId,
          })
          .then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            } else {
              this.editeImgDialog = false;
              this.editeImgForm.img = "";
              this.editeImgForm.name = "";
              this.editeUrl = "";
              this.query();
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    },
    remove() {
      this.$confirm("确认删除图片", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.editeUrl = "";
          this.editeImgForm.img = "";
          this.editeSrcList = [];
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    handleRemove2(file, fileList) {
      this.editeImgForm.img = "";
    },
    handlePictureCardPreview2(file) {
      this.dialogEditeImageUrl = file.url;
      this.dialogEditeImageVisible = true;
    },
    handleSuccess2(response, file, fileList) {
      this.editeImgForm.img = response.data.url;
    },
    handleRemove(file, fileList) {
      this.imgForm.img = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.imgForm.img = response.data.url;
    },
    //查看封面图
    showImg(index, row) {
      this.showImgDialog = true;
      this.$http
        .get(`/sys/livecoverpicture/${row.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.bigUrl = res.data.coverUrl;
          this.bigImgForm.name = res.data.coverName;
          this.srcList.push(res.data.coverUrl);
        })
        .catch((err) => {
          throw err;
        });
    },
    //上传封面图
    upImg() {
      this.upImgDialog = true;
    },
    //上传图片
    upImgMethod() {
      if (this.imgForm.img === "") {
        this.$message.warning("上传图片不能为空！");
      } else if (this.imgForm.name === "") {
        this.$message.warning("名字不能为空！");
      } else {
        this.$http
          .post("/sys/sysFrequentlyQuestions", {
            classify: this.imgForm.name,
            pictureUrl: this.imgForm.img,
          })
          .then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            } else {
              this.upImgDialog = false;
              this.imgForm.name = "";
              this.$refs["upload"].clearFiles();
              this.query();
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    },
    //编辑
    handle(row) {
      this.editeImgDialog = true;
      this.editeId = row.id;

      this.$http
        .get(`/sys/sysFrequentlyQuestions/${row.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.editeUrl = res.data.pictureUrl;
          this.editeImgForm.img = this.editeUrl;
          this.editeImgForm.name = res.data.classify;
          this.editeSrcList.push(res.data.coverUrl);
        })
        .catch((err) => {
          throw err;
        });
    },
    //删除
    handleDelete(row) {
      this.dialogVisible = true;
      this.ids.push(row.id);
    },
    //确认删除
    confirmShowState() {
      this.$http
        .delete(`/sys/sysFrequentlyQuestions`, {
          data: this.ids,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.ids = [];
            this.dialogVisible = false;
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__goodsList {
  .frontCoverImg {
    width: 60px;
    height: 60px;
  }
}
/deep/.el-tooltip {
  .el-input {
    width: 100px;
  }
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/deep/input[type="number"] {
  -moz-appearance: textfield !important;
}
/deep/.hide_box .el-upload--picture-card {
  display: none;
}
</style>