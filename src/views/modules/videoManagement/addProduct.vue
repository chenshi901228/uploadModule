
<!-- 主播管理-直播回放 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__livePlayBack">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item
          label="商品名称"
          prop="productName"
          v-show="isOpen || formItemCount >= 1"
        >
          <el-input
            size="small"
            v-model.trim="dataForm.productName"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="商品类型"
          prop="productType"
          size="small"
          v-show="isOpen || formItemCount >= 2"
        >
          <el-select
            @visible-change="getProductType"
            style="width: 200px"
            v-model="dataForm.productType"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in productTypeOptions"
              :key="item.productType"
              :value="item.productType"
              :label="item.productType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="是否免费"
          prop="isFree"
          v-show="isOpen || formItemCount >= 3"
        >
          <el-select
            clearable
            size="small"
            v-model="dataForm.isFree"
            placeholder="请选择"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="关联产品编号"
          prop="searchProductId"
          v-show="isOpen || formItemCount >= 4"
        >
          <el-input
            size="small"
            v-model.trim="dataForm.searchProductId"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="添加状态"
          prop="isAdd"
          v-show="isOpen || formItemCount >= 5"
        >
          <el-select
            clearable
            size="small"
            v-model="dataForm.isAdd"
            placeholder="请选择"
          >
            <el-option label="未添加" :value="0"></el-option>
            <el-option label="已添加" :value="1"></el-option>
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
            <el-button size="mini" plain @click="open">
              <i
                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                plain
                size="mini"
                icon="el-icon-plus"
                :disabled="dataListSelections.length !== 0 ? false : true"
                type="primary"
                @click="addSelect"
                >批量添加</el-button
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
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
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
          :width="item.width || 120"
          :show-overflow-tooltip="item.prop == 'productName' ? false : true"
        >
          <template slot-scope="{ row }">
            <!-- 封面图 -->
            <div v-if="item.prop == 'productImage'">
              <img
                class="frontCoverImg"
                :src="
                  row.productImage || require('@/assets/img/default_cover.jpg')
                "
                alt=""
              />
            </div>
            <!-- 商品价格 -->
            <span v-else-if="item.prop == 'oldPrice'">
              ￥{{ row.oldPrice }}
            </span>
            <!-- 销售价格 -->
            <span v-else-if="item.prop == 'price'"> ￥{{ row.price }} </span>
            <!-- 是否添加 -->
            <span v-else-if="item.prop == 'isAdd'">
              {{ row.isAdd ? "已添加" : "未添加" }}
            </span>
            <!-- 是否主推 -->
            <!-- <span v-else-if="item.prop == 'isFeatured'">
              {{ row.isFeatured ? "已主推" : "未主推" }}
            </span> -->
            <!-- 是否免费 -->
            <span v-else-if="item.prop == 'isFree'">
              <el-tag size="small" :type="row.isFree ? 'success' : 'danger'">{{
                row.isFree ? "是" : "否"
              }}</el-tag>
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
          min-width="160"
        >
          <template slot-scope="{ row }">
            <el-button size="small" :icon="row.isAdd ? 'el-icon-delete' : 'el-icon-plus'" type="text" @click="addOrDelete(row)">{{
              row.isAdd ? "删除" : "添加"
            }}</el-button>
            <el-button size="small" :icon="row.isFeatured ? 'el-icon-refresh-right' : 'el-icon-upload2'" type="text" v-if="row.isAdd" @click="setMain(row)">{{
              row.isFeatured ? "取消置顶" : "置顶"
            }}</el-button>
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认批量添加所选商品吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAdd"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/playbackProduct/getProductPage", // 数据列表接口，API地址
      },
      dataForm: {
        productName: "",
        productType: "",
        isFree: null,
        searchProductId: "",
        isAdd: null,
        isFeatured: null,
      },
      params: {
        playbackId: null,
        anchorId: null,
      },

      tableItem: [
        { prop: "productImage", label: "商品图片" },
        { prop: "productName", label: "商品名称", width: 180 },
        { prop: "oldPrice", label: "商品价格" },
        // { prop: "price", label: "销售价格" },
        { prop: "productType", label: "商品类型" },
        { prop: "isFree", label: "是否免费" },
        // { prop: "linkedProductId", label: "关联产品编号" },
        { prop: "updateDate", label: "上架时间", width: 180 },
        { prop: "isAdd", label: "添加状态" },
        // { prop: "isFeatured", label: "主推状态" },
      ],
      productTypeOptions: [], //商品类型下拉选项
      dialogVisible: false,
      productList: [],
    };
  },
  created() {
    // this.query()
  },
  activated() {
    this.params = this.$route.query;
    this.query();
  },
  methods: {
    //批量添加
    addSelect() {
      let flg = this.dataListSelections.some((v) => {
        return v.isAdd === 1;
      });

      if (flg) {
        this.$message.warning("所选商品已添加");
      } else {
        this.dialogVisible = true;
        this.dataListSelections.forEach((v) => {
          this.productList.push({
            playbackId: this.params.playbackId,
            anchorProductId: v.anchorProductId,
            productId: v.productId,
            anchorId: this.params.anchorId,
          });
        });
      }
    },
    //确认批量添加
    confirmAdd() {
      this.$http
        .post("/sys/playbackProduct", this.productList)
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.$message.success("批量添加商品成功");
            this.query();
            this.productList = [];
            this.dialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    // 下拉获取商品类型
    getProductType(type) {
      if (!type) return;
      this.$http
        .get("/sys/course/searchProductType")
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.productTypeOptions = res.data;
          } else {
            this.productTypeOptions = [];
            return this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.productTypeOptions = [];
          this.$message.error(JSON.stringify(err.message));
        });
    },
    addOrDelete(row) {
      if (row.isAdd) {
        //删除
        this.$confirm("确定删除改商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$http
              .delete("/sys/playbackProduct", { data: [row.id] })
              .then(({ data: res }) => {
                if (res.code == 0) {
                  this.$message.success("删除商品成功");
                  this.query();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err));
              });
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      } else {
        let data = [];
        data.push({
          playbackId: this.params.playbackId,
          anchorProductId: row.anchorProductId,
          productId: row.productId,
          anchorId: this.params.anchorId,
        });
        //添加
        this.$http
          .post("/sys/playbackProduct", data)
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.$message.success("添加商品成功");
              this.query();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err));
          });
      }
    },
    // 主推设置
    setMain(row) {
      if (row.isFeatured) {
        //取消主推
        this.$confirm("确定取消置顶", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$http
              .put("/sys/playbackProduct", {
                id: row.id,
                playbackId: this.params.playbackId,
                isFeatured: 0,
              })
              .then(({ data: res }) => {
                if (res.code == 0) {
                  this.$message.success("取消置顶成功");
                  this.query();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err));
              });
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      } else {
        //设为主推
        this.$http
          .put("/sys/playbackProduct", {
            id: row.id,
            playbackId: this.params.playbackId,
            isFeatured: 1,
          })
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.$message.success("置顶成功");
              this.query();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err));
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__livePlayBack {
  .frontCoverImg {
    width: 100%;
    height: 60px;
    object-fit: cover;
  }
}
</style>