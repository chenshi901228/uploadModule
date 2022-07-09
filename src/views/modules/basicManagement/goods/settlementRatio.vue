<!-- 主播结算比例 -->

<template>
  <div>
    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-live__settlementRatio">
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
          <el-form-item label="主播" prop="username">
            <el-input
              style="width: 200px"
              v-model.trim="dataForm.username"
              placeholder="主播"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              style="width: 200px"
              v-model.trim="dataForm.phone"
              placeholder="手机号码"
              clearable
            ></el-input>
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
            </el-form-item>
          </div>
          <!-- 操作按钮 -->
          <div class="headerTool-handle-btns">
            <div class="headerTool--handle-btns-left">
              <el-form-item>
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  icon="el-icon-edit"
                  @click="editHandle(1)"
                  >全部主播结算比例</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  :disabled="!dataListSelections.length"
                  size="mini"
                  type="primary"
                  plain
                  icon="el-icon-edit"
                  @click="editHandle(2)"
                  >批量设置结算比例</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
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
                    @click="query"
                  ></el-button>
                </el-tooltip>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="goodsInfo">
          商品名称：{{ goodsInfo.productName || "-" }}
        </div>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          @selection-change="dataListSelectionChangeHandle"
          :height="siteContentViewHeight - 40"
          style="width: 100%"
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
              <!-- 主播 -->
              <span v-if="item.prop == 'username'">
                {{ row.username }}
              </span>
              <!-- 主播手机号 -->
              <span v-else-if="item.prop == 'phone'"> {{ row.phone }} </span>
              <!-- 分成比例 -->
              <span v-else-if="item.prop == 'proportion'">
                {{ row.delFlg === 1 ? "--" : row.proportion + "%" }}
              </span>
              <!-- 更新时间 -->
              <span v-else-if="item.prop == 'updateDate	'">
                {{ row.updateDate }}%
              </span>
              <span v-else>
                {{ row[item.prop] || "-" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('handle')"
            fixed="right"
            header-align="center"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="edit(row)"
                >编辑</el-button
              >
              <el-button
                v-if="row.delFlg !== 1"
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deleteCount(row.anchorId, row.productId)"
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
    </el-card>
    <!-- 编辑 -->
    <settlementRatio-update
      ref="settlementRatioUpdate"
      @refreshDataList="getDataList"
    ></settlementRatio-update>

    <el-dialog
      top="20px"
      :visible.sync="visible"
      width="30%"
      :title="setText"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="editeForm"
        ref="editeForm"
        :rules="dataRule"
        label-width="110px"
      >
        <el-form-item label="结算比例：" prop="proportion">
          <el-input-number
            v-model="editeForm.proportion"
            :controls="false"
            :precision="0"
            :min="0"
            :max="99"
          >
          </el-input-number>
        </el-form-item>
        <div>结算比例范围：0%~99%</div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="submitLoading" size="small" @click="cancel"
          >取 消</el-button
        >
        <el-button
          :disabled="submitLoading"
          :loading="submitLoading"
          size="small"
          type="primary"
          @click="submit(setText)"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import settlementRatioUpdate from "./settlementRatio-update.vue";
export default {
  mixins: [mixinTableModule],
  components: {
    settlementRatioUpdate,
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/productProportion/pageAnchorWithProduct", // 数据列表接口，API地址
        exportURL: "/sys/productProportion/export", // 导出接口，API地址
      },
      dataForm: {
        username: "",
        phone: "",
        productId: this.$route.query.productId,
      },
      goodsInfo: {
        id: "",
        productName: "",
      },

      tableItem: [
        { prop: "username", label: "主播" },
        { prop: "phone", label: "手机号" },
        { prop: "proportion", label: "结算比例" },
        { prop: "updateDate", label: "更新时间", width: 180 },
      ],
      visible: false,
      editeForm: {},
      submitLoading: false,
      dataRule: {
        proportion: [
          {
            required: true,
            message:
              "不能输入字母，中文，特殊字符，空格，小数，负数，大于99得数等",
            trigger: "blur",
          },
        ],
      },
      setText: "",
    };
  },
  created() {},
  mounted() {
    this.goodsInfo = this.$route.query;
  },
  activated() {
    this.query();
  },
  methods: {
    // 批量or单独设置
    editHandle(num) {
      this.editeForm.proportion = 0;

      if (num === 1) {
        this.setText = "全部主播结算比例";
      } else {
        this.setText = "批量设置结算比例";
      }
      this.visible = true;
    },
    // 编辑
    edit(row) {
      this.$refs.settlementRatioUpdate.init(row);
    },
    // 删除
    deleteCount(id, productId) {
      this.$confirm(
        "确认删除该主播的结算比例，删除后该主播上架的此商品也会同步下架",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http
            .delete("/sys/productProportion/deleteProportionWithAnchor", {
              data: {
                anchorId: id,
                productId: productId,
              },
            })
            .then(({ data: res }) => {
              if (res.code == 0) {
                this.$message.success("删除成功");
                this.getDataList();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch(() => this.$message.info("取消删除"));
    },
    // 表单提交
    submit(setText) {
      this.$refs.editeForm.validate((valid) => {
        if (valid) {
          if (setText === "全部主播结算比例") {
            this.submitLoading = true;
            let parmas = {};
            parmas.productId = this.$route.query.productId;
            parmas.proportion = this.editeForm.proportion;
            this.$http
              .post("/sys/course/updateProportion", {
                id: parmas.productId,
                proportion: parmas.proportion,
              })
              .then(({ data: res }) => {
                if (res.code == 0) {
                  this.$message.success("批量修改结算比例成功");
                  this.submitLoading = false;
                  this.visible = false;
                  this.getDataList();
                } else {
                  this.submitLoading = false;
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.submitLoading = false;
                throw err;
              });
          } else {
            this.submitLoading = true;
            let parmas = {};
            parmas.anchorIdList = [];
            this.dataListSelections.forEach((v) => {
              parmas.anchorIdList.push(v.anchorId);
            });
            parmas.productId = this.$route.query.productId;
            parmas.proportion = this.editeForm.proportion;
            this.$http
              .post("/sys/productProportion/updateProportionWithAnchor", {
                ...parmas,
              })
              .then(({ data: res }) => {
                if (res.code == 0) {
                  this.$message.success("批量修改结算比例成功");
                  this.submitLoading = false;
                  this.visible = false;
                  this.getDataList();
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
        }
      });
    },
    // 取消
    cancel() {
      this.visible = false;
      this.$message.info("取消修改");
      this.$refs.editeForm.resetFields();
      this.editeForm = {};
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__settlementRatio {
  .goodsInfo {
    font-size: 16px;
    color: #606266;
    line-height: 40px;
  }
}
</style>