// 直播封面图

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form class="headerTool" :inline="true" :model="dataForm" ref="dataForm" size="small" label-width="100px"
        label-position="right" @keyup.enter.native="getDataList()">
        <el-form-item label="封面图名称" prop="coverName" v-show="isOpen || formItemCount >= 1">
          <el-input size="small" :clearable="true" style="width: 200px" v-model="dataForm.coverName" placeholder="请输入">
          </el-input>
        </el-form-item>

        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getDataList">{{ $t("query") }}
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDataForm()">{{ $t("reset") }}</el-button>
            <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button plain size="mini" icon="el-icon-delete" v-if="dataListSelections.length !== 0" type="danger"
                @click="deleteSelect()">批量删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button plain size="mini" icon="el-icon-delete" v-if="dataListSelections.length !== 0" type="danger"
                @click="deleteSelect()">批量删除</el-button>
              <el-button size="mini" icon="el-icon-plus" plain type="primary" @click="upImg">上传</el-button>
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="query"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" :height="siteContentViewHeight" style="width: 100%"
        ref="table">
        <!-- @selection-change="dataListSelectionChangeHandle" -->
        <!-- <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column> -->
        <el-table-column width="150" label="直播封面图" prop="coverUrl" align="center">
          <template slot-scope="{ row }">
            <div>
              <img style="width: 80px; height: '80px'" class="frontCoverImg"
                :src="row.coverUrl || 'https://picsum.photos/400/300?random=1'" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="封面图名称" prop="coverName" align="center">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
        </el-table-column>
        <el-table-column label="显示状态" prop="showStatus" align="center">
          <template slot-scope="scope" align="center">
            <span>{{ scope.row.showStatus === 0 ? "隐藏" : "显示" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-sort" v-if="scope.row.appointmentState !== 0" type="text" size="small"
              @click="showThis(scope.$index, scope.row)">{{ scope.row.showStatus === 0 ? "显示" : "隐藏" }}</el-button>
            <el-button v-if="scope.row.appointmentState !== 0" type="text" size="small" icon="el-icon-edit"
              @click="handle(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="scope.row.appointmentState !== 0" type="text" size="small" icon="el-icon-view"
              @click="showImg(scope.$index, scope.row)">查看</el-button>
            <!-- <el-button
              v-if="scope.row.appointmentState !== 0"
              type="text"
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
        layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
    <el-dialog title="删除" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认{{ showStatus === 0 ? "显示" : "隐藏" }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmShowState">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog title="上传封面图" :visible.sync="upImgDialog" width="30%">
      <el-form :model="imgForm" :rules="imgFormRules" ref="imgForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上传" prop="img" required>
          <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove" :on-success="handleSuccess" :on-exceed="handleExceed1" :before-upload="beforeUpload" :limit="1" ref="upload"
            :class="imgForm.img.length !== 0 ? 'hide_box' : ''">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div>图片尺寸大小为630px*347px，不得超过2M</div>
        </el-form-item>
        <el-form-item label="封面图名称" prop="name">
          <el-input maxlength="15" v-model="imgForm.name" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="upImgDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="upImgMethod">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <el-dialog title="查看封面图" :visible.sync="showImgDialog" width="30%">
      <el-form :model="bigImgForm" ref="imgForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上传" prop="img">
          <el-image style="width: 146px; height: 146px" :src="bigUrl" :preview-src-list="srcList">
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


    <!-- 编辑 -->
    <el-dialog title="编辑封面图" :visible.sync="editeImgDialog" width="30%">
      <el-form :model="editeImgForm" :rules="imgFormRules" ref="imgForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上传" prop="img">
          <div v-if="editeUrl.length !== 0" style="position: relative; display: inline-block">
            <el-image style="width: 146px; height: 146px; margin-right: 0" :src="editeUrl"
              :preview-src-list="editeSrcList">
            </el-image>
            <el-tooltip effect="dark" content="删除" placement="top">
              <i class="el-icon-close" @click="remove" style="
                  position: absolute;
                  right: 5px;
                  top: 5px;
                  font-size: 12px;
                  color: #fff;
                  cursor: pointer;
                "></i>
            </el-tooltip>
          </div>
          <div v-if="editeUrl.length === 0">
            <el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview2"
              :on-remove="handleRemove2" :on-success="handleSuccess2" :on-exceed="handleExceed2" :limit="1"
              ref="upload2" :class="editeImgForm.img.length !== 0 ? 'hide_box' : ''">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <span>点击可看大图</span>
        </el-form-item>
        <el-form-item>
          <div>图片尺寸大小为630px*347px，不得超过2M</div>
        </el-form-item>
        <el-form-item label="封面图名称" prop="name">
          <el-input maxlength="15" v-model="editeImgForm.name" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="editeImgDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editeImgMethod">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditeImageVisible">
      <img width="100%" :src="dialogEditeImageUrl" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import { getImageWH } from "@/utils"
import Cookies from "js-cookie";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      dataListLoading: false, // 数据列表，loading状态
      dataForm: {
        coverName: "",
      },
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataList: [], // 数据列表
      dataListSelections: [], // 数据列表，多选项
      options: [],
      dialogFormVisible: false,
      ruleForm: {
        desc: "",
      },
      rules: {
        desc: [{ required: true, message: "请填写备注内容", trigger: "blur" }],
      },
      ids: [],
      dialogVisible: false,
      showStatus: 0,
      id: "",
      upImgDialog: false,
      dialogImageUrl: "",
      dialogImageVisible: false,
      uploadUrl: "",
      imgForm: {
        img: "",
        name: "",
      },
      imgFormRules: {
        name: [{ required: true, message: "请输入封面图名称", trigger: "blur" }]
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
    };
  },
  watch: {
    showImgDialog(n, o) {
      if (!n) {
        this.bigUrl = "";
        this.srcList = [];
      }
    },
    upImgDialog(n, o) {
      if (!n) {
        this.imgForm = {
          img: "",
          name: "",
        };
        // 移除表单验证
        if(this.$refs.imgForm) this.$refs.imgForm.clearValidate() 
      }
    },
    editeImgDialog(n, o) {
      if (!n) {
        this.editeImgForm.img = "";
        this.editeImgForm.name = "";
        // 移除表单验证
        if(this.$refs.editeImgForm) this.$refs.editeImgForm.clearValidate() 
      }
    },
  },
  created() {
    this.uploadUrl = `${window.SITE_CONFIG["apiURL"]
      }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
  },
  activated() {
    this.query();
  },
  methods: {
    // 上传前
    async beforeUpload(file) {
      let type = file.type ? file.type.split("/") : file.name.split(".");
      type = type[type.length - 1];
      let fileSize = file.size / 1024 / 1024 < 2;
      let res = await getImageWH(file)
      if(res && (Math.abs(res.width - 630) > 6 || Math.abs(res.height - 347) > 6) ) {
        this.$message.error(`图片尺寸大小为630px*347px`);
        return Promise.reject(false);
      }
      if (!fileSize) {
        this.$message.error(`上传附件大小不能超过2M!`);
        return Promise.reject(false);
      }
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
          .put("/sys/livecoverpicture", {
            coverName: this.editeImgForm.name,
            coverUrl: this.editeImgForm.img,
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
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editeUrl = "";
        this.editeImgForm.img = "";
        this.editeSrcList = [];
        this.$message.success("删除成功")
      }).catch(() => {
        this.$message.info("取消删除")
      })
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
    query() {
      this.dataListLoading = true;
      let dataObj = {};

      for (const key in this.dataForm) {
        if (this.dataForm[key] && this.dataForm[key].length !== 0) {
          dataObj[key] = this.dataForm[key];
        }
      }

      this.$http
        .get("/sys/livecoverpicture/page", {
          params: {
            page: this.page,
            limit: this.limit,
            ...dataObj,
          },
        })
        .then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.dataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.dataList = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.dataListLoading = false;
          throw err;
        });
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
          .post("/sys/livecoverpicture", {
            coverName: this.imgForm.name,
            coverUrl: this.imgForm.img,
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
    //显示与隐藏
    showThis(index, row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.showStatus = row.showStatus;
    },
    //确认隐藏显示
    confirmShowState() {
      this.$http
        .post(
          `/sys/livecoverpicture/updateShowStatus`, {
          id: this.id,
          showStatus:
            this.showStatus === 1 ? "0" : "1"

        }
        )
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.dialogVisible = false;
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //编辑
    handle(index, row) {
      this.editeImgDialog = true;
      this.editeId = row.id;
      this.$http
        .get(`/sys/livecoverpicture/${row.id}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.editeUrl = res.data.coverUrl;
          this.editeImgForm.img = this.editeUrl;
          this.editeImgForm.name = res.data.coverName;
          this.editeSrcList.push(res.data.coverUrl);
        })
        .catch((err) => {
          throw err;
        });
    },
    //删除
    handleDelete(index, row) {
      this.dialogFormVisible = true;
      this.ids.push(row.id);
    },
    //批量删除
    deleteSelect() {
      this.dialogFormVisible = true;
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
    },

    getDataList() {
      this.page = 1;
      this.query();
    },

    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.query();
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      console.log(val);
      this.dataListSelections = val;
    },
    //删除
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .delete("/sys/livecoverpicture", {
              data: { ids: this.ids, remark: this.ruleForm.desc },
            })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                this.ids = [];
                this.ruleForm.desc = "";
                return this.$message.error(res.msg);
              }
              this.ids = [];
              this.ruleForm.desc = "";
              this.query();
              this.$message.success("删除成功!");
              this.dialogFormVisible = false;
            })
            .catch((err) => {
              throw err;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
}

/deep/.el-dialog {
  display: flex;
  display: -ms-flex;
  /* 兼容IE */
  flex-direction: column;
  -ms-flex-direction: column;
  /* 兼容IE */
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

/deep/.el-dialog .el-dialog__body {
  padding: 20px;
  /*这个不重要*/
  max-height: 75vh;
  flex: 1;
  -ms-flex: 1 1 auto;
  /* 兼容IE */
  overflow-y: auto;
  overflow-x: hidden;
}

/deep/.el-dialog__wrapper {
  overflow: hidden;
  /*隐藏ie和edge中遮罩的滚动条*/
}

/deep/.hide_box .el-upload--picture-card {
  display: none;
}
</style>