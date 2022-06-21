
<!-- 基础管理-问题列表 -->

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
          label="问题标题"
          prop="title"
        >
          <el-input
            :clearable="true"
            style="width: 200px"
            v-model="dataForm.title"
            placeholder="请输入关键字"
          />
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
                @click="addProblem"
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
            <!-- 标题 -->
            <span v-if="item.prop == 'title'">
              {{ row.title }}
            </span>
            <!-- 更新人 -->
            <span v-else-if="item.prop == 'updateByName'">
              {{ row.updateByName }}
            </span>
            <!-- 创建时间 -->
            <span v-else-if="item.prop == 'createDate'"
              >{{ row.createDate }}
            </span>
            <!-- 更新时间 -->
            <span v-else-if="item.prop == 'updateDate'"
              >{{ row.updateDate }}
            </span>
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
    <el-dialog
      title="新增"
      :visible.sync="upImgDialog"
      width="80%"
      :destroy-on-close="true"
    >
      <el-form
        :model="problem"
        ref="problem"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问题标题" prop="name" required>
          <el-input maxlength="50" v-model="problem.name" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="desc" required>
          <!-- 富文本编辑器, 容器 -->
          <div id="J_quillEditor1" style="height: 280px"></div>
          <!-- 自定义上传图片功能 (使用element upload组件) -->
          <el-upload
            :action="uploadUrl"
            :show-file-list="false"
            :before-upload="uploadBeforeUploadHandle"
            :on-success="uploadSuccessHandle1"
            :on-error="uploadError"
            style="display: none"
          >
            <el-button ref="uploadBtn" type="primary" size="small">{{
              $t("upload.button")
            }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="upImgDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="upMethod"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="编辑"
      :visible.sync="editeImgDialog"
      width="80%"
      :destroy-on-close="true"
    >
      <el-form
        :model="editeImgForm"
        ref="editeImgForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问题标题" prop="name" required>
          <el-input maxlength="50" v-model="editeImgForm.name" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="desc" required>
          <!-- 富文本编辑器, 容器 -->
          <div id="J_quillEditor" style="height: 280px"></div>
          <!-- 自定义上传图片功能 (使用element upload组件) -->
          <el-upload
            :action="uploadUrl"
            :show-file-list="false"
            :before-upload="uploadBeforeUploadHandle"
            :on-success="uploadSuccessHandle"
            :on-error="uploadError"
            style="display: none"
          >
            <el-button ref="uploadBtn" type="primary" size="small">{{
              $t("upload.button")
            }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="editeImgDialog = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="upDateMethod"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认删除？</span>
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
import ComModule from "@/mixins/common-module";
import Cookies from "js-cookie";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { getImageWH } from "@/utils/index";
export default {
  mixins: [mixinTableModule, ComModule],
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/sysFrequentlyQuestionsDetails/page", // 数据列表接口，API地址
        exportURL: "/sys/sysFrequentlyQuestionsDetails/export", // 导出接口，API地址
      },
      dataForm: {
        title: "",
      },
      params: {
        questionsId: this.$route.query.questionsId,
      },
      tableItem: [
        { prop: "num", label: "序号" },
        { prop: "title", label: "问题标题" },
        { prop: "updateByName", label: "更新人" },
        { prop: "updateDate", label: "更新时间" },
        { prop: "createDate", label: "创建时间" },
      ],
      upImgDialog: false,
      uploadUrl: "",
      editeImgDialog: false,
      problem: {
        name: "",
        desc: "",
      },
      editeImgForm: {
        name: "",
        desc: "",
      },
      editeUrl: "",
      editeSrcList: [],
      editeId: "",
      ids: [],
      dialogVisible: false,
      dataListSelections: [],
      quillEditor: null,
      quillEditor1: null,
      quillEditorToolbarOptions: [
        ["bold", "italic", "underline", "strike"],
        ["link", "image", "video"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
      uploadUrl: "",
      videoUploadSize: 50, //视频上传大小限制
      uploading: null, //上传状态
      uploadType: "", //编辑器选择上传图片or视频
      sortVal: "",
      sortId: "",
    };
  },
  mounted() {},
  activated() {
    this.query();
  },
  watch: {},
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
        .put("/sys/sysFrequentlyQuestionsDetails", {
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
    // 编辑富文本编辑器
    quillEditorHandle() {
      if (document.querySelector("#J_quillEditor")) {
        this.quillEditor = new Quill("#J_quillEditor", {
          modules: {
            toolbar: this.quillEditorToolbarOptions,
          },
          theme: "snow",
        });
        // 自定义上传图片功能 (使用element upload组件)
        this.uploadUrl = `${
          window.SITE_CONFIG["apiURL"]
        }/oss/file/upload?token=${Cookies.get("access_token")}`;
        // 图片
        this.quillEditor.getModule("toolbar").addHandler("image", () => {
          this.uploadType = "image";
          this.$refs.uploadBtn.$el.click();
        });
        // 视频
        this.quillEditor.getModule("toolbar").addHandler("video", () => {
          this.uploadType = "mp4";
          this.$refs.uploadBtn.$el.click();
        });
        // 监听内容变化，动态赋值
        this.quillEditor.on("text-change", () => {
          this.editeImgForm.desc = this.quillEditor.root.innerHTML;
        });
      }
    },
    // 新增富文本编辑器
    quillEditorHandle1() {
      if (document.querySelector("#J_quillEditor1")) {
        this.quillEditor1 = new Quill("#J_quillEditor1", {
          modules: {
            toolbar: this.quillEditorToolbarOptions,
          },
          theme: "snow",
        });
        // 自定义上传图片功能 (使用element upload组件)
        this.uploadUrl = `${
          window.SITE_CONFIG["apiURL"]
        }/oss/file/upload?token=${Cookies.get("access_token")}`;
        // 图片
        this.quillEditor1.getModule("toolbar").addHandler("image", () => {
          this.uploadType = "image";
          this.$refs.uploadBtn.$el.click();
        });
        // 视频
        this.quillEditor1.getModule("toolbar").addHandler("video", () => {
          this.uploadType = "mp4";
          this.$refs.uploadBtn.$el.click();
        });
        // 监听内容变化，动态赋值
        this.quillEditor1.on("text-change", () => {
          this.problem.desc = this.quillEditor1.root.innerHTML;
        });
      }
    },
    // 上传之前
    uploadBeforeUploadHandle(file) {
      return new Promise(async (resolve, reject) => {
        if (this.uploadType == "mp4" && file.type !== "video/mp4") {
          this.$message.error(this.$t("upload.tip", { format: "mp4" }));
          return reject();
        }
        if (
          this.uploadType == "image" &&
          file.type !== "image/jpg" &&
          file.type !== "image/jpeg" &&
          file.type !== "image/png" &&
          file.type !== "image/gif"
        ) {
          this.$message.error(
            this.$t("upload.tip", { format: "jpg、png、gif" })
          );
          return reject();
        }

        // 视频上传大小限制
        if (
          file.type == "video/mp4" &&
          file.size / 1024 / 1024 > this.videoUploadSize
        ) {
          this.$message.error(`上传视频不能超过${this.videoUploadSize}M`);
          return reject();
        }
        // 获取图片宽高
        if (file.type != "video/mp4") {
          let d = await getImageWH(file);
          console.log(d);
          // return reject()
        }
        this.uploading = this.$loading({
          lock: true,
          text: "附件上传中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        resolve();
      });
    },
    // 上传成功
    uploadSuccessHandle(res, file, fileList) {
      if (this.uploading) {
        this.uploading.close();
        this.uploading = null;
      }
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      // 光标位置
      let length = this.quillEditor.getSelection().index;
      // 判断是mp4或图片
      let type = res.data.url.split(".");
      type = type[type.length - 1].toLocaleLowerCase();

      // 插入内容
      this.quillEditor.insertEmbed(
        length,
        type == "mp4" ? "video" : "image",
        res.data.url
      );

      // 调整光标到最后
      setTimeout(() => {
        this.quillEditor.setSelection(length + 1);
      }, 500);
    },
    // 上传失败
    uploadError(err) {
      console.log(err);
      if (this.uploading) {
        this.uploading.close();
        this.uploading = null;
      }
    },
    // 上传成功
    uploadSuccessHandle1(res, file, fileList) {
      if (this.uploading) {
        this.uploading.close();
        this.uploading = null;
      }
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      // 光标位置
      let length = this.quillEditor1.getSelection().index;
      // 判断是mp4或图片
      let type = res.data.url.split(".");
      type = type[type.length - 1].toLocaleLowerCase();

      // 插入内容
      this.quillEditor1.insertEmbed(
        length,
        type == "mp4" ? "video" : "image",
        res.data.url
      );

      // 调整光标到最后
      setTimeout(() => {
        this.quillEditor1.setSelection(length + 1);
      }, 500);
    },
    //批量删除
    deleteProblem() {
      this.dialogVisible = true;
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
    },
    //编辑
    handle(row) {
      this.editeImgDialog = true;
      this.$nextTick(() => {
        this.quillEditorHandle();
      });
      this.editeId = row.id;

      this.$http
        .get(`/sys/sysFrequentlyQuestionsDetails/${row.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.editeImgForm.name = res.data.title;
          this.quillEditor.pasteHTML(res.data.value);
        })
        .catch((err) => {
          throw err;
        });
    },
    //新增
    addProblem() {
      this.upImgDialog = true;
      this.$nextTick(() => {
        this.quillEditorHandle1();
      });
    },
    //上传
    upMethod() {
      if (this.problem.name.length === 0) {
        this.$message.warning("问题标题不能为空!");
        return;
      } else if (this.quillEditor1.getLength() <= 1) {
        this.$message.warning("问题内容不能为空!");
        return;
      }
      this.$http
        .post("/sys/sysFrequentlyQuestionsDetails", {
          title: this.problem.name,
          value: this.problem.desc,
          questionsId: this.$route.query.questionsId,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.upImgDialog = false;
            this.problem.name = "";
            this.problem.desc = "";
            // 编辑器清空
            this.quillEditor1.deleteText(0, this.quillEditor1.getLength());
            this.$message.success("新增成功!");
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //上传编辑
    upDateMethod() {
      if (this.editeImgForm.name.length === 0) {
        this.$message.warning("问题标题不能为空!");
        return;
      } else if (this.quillEditor.getLength() <= 1) {
        this.$message.warning("问题内容不能为空!");
        return;
      }
      this.$http
        .put("/sys/sysFrequentlyQuestionsDetails", {
          title: this.editeImgForm.name,
          value: this.editeImgForm.desc,
          id: this.editeId,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.editeImgDialog = false;
            this.editeImgForm.name = "";
            this.editeImgForm.desc = "";
            // 编辑器清空
            this.quillEditor.deleteText(0, this.quillEditor.getLength());
            this.editeId = "";
            this.$message.success("编辑成功!");
            this.query();
          }
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
        .delete(`/sys/sysFrequentlyQuestionsDetails`, {
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
.ql-snow {
  .ql-editor {
    img {
      max-width: 100px !important;
    }
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
</style>