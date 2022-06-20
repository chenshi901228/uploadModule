
<!-- 基础管理-商品列表 -->

<template>
  <div>
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
            label="商品名称"
            prop="productName"
            v-if="isOpen || formItemCount >= 1"
          >
            <!-- <el-select
                  size="small"
                  v-model="dataForm.productName"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请输入选择"
                  :remote-method="getGoodsName"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in goodsNameOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select> -->
            <el-input
              style="width: 200px"
              v-model.trim="dataForm.productName"
              placeholder="请输入商品名称"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="商品类型"
            prop="productType"
            v-if="isOpen || formItemCount >= 2"
          >
            <el-select 
              @visible-change="getProductType" 
              style="width: 200px" 
              v-model="dataForm.productType" 
              placeholder="商品类型"
              clearable>
                <el-option v-for="item in productTypeOptions" :key="item.productType" :value="item.productType" :label="item.productType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否免费"
            prop="isFree"
            v-if="isOpen || formItemCount >= 3"
          >
            <el-select
              style="width: 200px"
              clearable
              v-model="dataForm.isFree"
              placeholder="请选择"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="关联产品编号"
            prop="id"
            v-if="isOpen || formItemCount >= 4"
          >
            <el-input
              style="width: 200px"
              v-model.trim="dataForm.id"
              placeholder="请输入"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="状态"
            prop="delFlg"
            v-if="isOpen || formItemCount >= 5"
          >
            <el-select 
              style="width: 200px" 
              v-model="dataForm.delFlg" 
              placeholder="商品类型"
              clearable>
                <el-option :value="0" label="上架"></el-option>
                <el-option :value="1" label="下架"></el-option>
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
                  :disabled="!dataListSelections.length"
                  size="mini"
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  @click="upGoods()"
                  >商品上架</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  :disabled="!dataListSelections.length"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="downGoods()"
                  >下架</el-button
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
            show-overflow-tooltip
            :sortable="
              ['transcribeFlg', 'liveState', 'showState'].includes(item.prop)
            "
          >
            <template slot-scope="{ row }">
              <!-- 封面图 -->
              <div v-if="item.prop == 'productImage'">
                <img
                  class="frontCoverImg"
                  :src="
                    row.productImage || 'https://picsum.photos/400/300?random=1'
                  "
                  alt=""
                />
              </div>
              <!-- 商品价格 -->
              <span v-else-if="item.prop == 'oldPrice'">
                ￥{{ row.oldPrice }}
              </span>
              <!-- 商品价格 -->
              <span v-else-if="item.prop == 'price'"> ￥{{ row.price }} </span>
              <!-- 是否免费 -->
              <span v-else-if="item.prop == 'isFree'">
                <el-tag size="small" :type="row.isFree ? 'success' : 'danger'">{{
                  row.isFree ? "是" : "否"
                }}</el-tag>
              </span>
              <!-- 库存数量 -->
              <span v-else-if="item.prop == 'stock'">
                {{ row.stock || 0 }}
              </span>
              <!-- 状态 -->
              <span v-else-if="item.prop == 'delFlg'">
                <el-tag size="small" :type="row.delFlg === 0 ? 'success' : 'danger'">{{row.delFlg === 0 ? '上架' : '下架'}}</el-tag>
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
                icon="el-icon-delete"
                v-if="row.delFlg === 0"
                @click="downGoods(row.id)"
                >下架</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-plus"
                v-if="row.delFlg != 0"
                @click="upGoods(row.id)"
                >上架</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="edit(row)"
                v-if="row.delFlg != 0"
                >编辑</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-coin"
                @click="settlementRatio(row)"
                >主播结算比例</el-button>
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
    <goods-add-or-update
      ref="goodsAddOrUpdate"
      @refreshDataList="getDataList"
    ></goods-add-or-update>
  </div>  
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import GoodsAddOrUpdate from "./goods-add-or-update.vue";
export default {
  mixins: [mixinTableModule],
  components: {
    GoodsAddOrUpdate,
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/course/page", // 数据列表接口，API地址
        exportURL: "/sys/course/export", // 导出接口，API地址
      },
      dataForm: {
        productName: "",
        productType: "",
        isFree: null,
        id: "",
      },

      tableItem: [
        { prop: "productImage", label: "商品图片" },
        { prop: "productName", label: "商品名称" },
        { prop: "oldPrice", label: "商品价格" },
        { prop: "price", label: "销售价格" },
        { prop: "productType", label: "商品类型" },
        { prop: "isFree", label: "是否免费" },
        { prop: "stock", label: "库存数量" },
        { prop: "buyers", label: "已购买人数" },
        { prop: "id", label: "关联产品编号" },
        // { prop: "proportion", label: "分成比例" },
        { prop: "updateDate", label: "更新时间", width: 180 },
        { prop: "delFlg", label: "状态" },
      ],
      loading: false, //搜索loading
      goodsNameOptions: [], //商品名称下拉选项
      productTypeOptions: [] //商品类型下拉选项
    };
  },
  created() {
    // this.query()
  },
  activated() {
    this.query();
  },
  methods: {
    // 输入选择商品名称
    getGoodsName(s) {
      if (s != "") {
        this.loading = true;
        this.$http
          .get("/sys/course/searchByName", {
            params: {
              productName: s,
            },
          })
          .then(({ data: res }) => {
            this.loading = false;
            if (res.code == 0) {
              let arr = [];
              res.data.map((item) => {
                arr.push({
                  id: item.id,
                  value: item.id,
                  label: item.productName,
                });
              });
              this.goodsNameOptions = arr;
            } else {
              this.goodsNameOptions = [];
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.goodsNameOptions = [];
            throw err;
          });
      } else {
        this.goodsNameOptions = [];
      }
    },
    // 下拉获取商品类型
    getProductType(type) {
      if(!type) return
      this.$http.get("/sys/course/searchProductType").then(({data: res}) => {
        if(res.code == 0) {
          this.productTypeOptions = res.data
        }else {
          this.productTypeOptions = []
          return this.$message.error(res.msg)
        }
      }).catch(err => {
        this.productTypeOptions = []
        this.$message.error(JSON.stringify(err))
      })
    },
    downGoodsHandle(data) {
      this.$http
        .post("/sys/course/down", data)
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.$message.success("商品下架成功");
            this.query();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    // 下架
    downGoods(id) {
      if (!id) {
        //批量下架
        if (!this.dataListSelections.length) {
          //未勾选任何选项
          return this.$message.warning("请先选择商品");
        } else {
          this.$confirm("此操作将下架选中商品, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              let arr = this.dataListSelections.map((item) => item.id);
              this.downGoodsHandle(arr);
            })
            .catch(() => {
              this.$message.info("已取消下架");
            });
        }
      } else {
        //单个操作
        this.$confirm("确认下架?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.downGoodsHandle([id]);
          })
          .catch(() => {
            this.$message.info("已取消下架");
          });
      }
    },
    upGoodsHandle(data) {
      this.$http
        .post("/sys/course/up", data)
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.$message.success("商品上架成功");
            this.query();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    // 上架
    upGoods(id) {
      if (!id) {
        //批量上架
        if (!this.dataListSelections.length) {
          //未勾选任何选项
          return this.$message.warning("请先选择商品");
        } else {
          this.$confirm("此操作将上架选中商品, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              let arr = this.dataListSelections.map((item) => item.id);
              this.upGoodsHandle(arr);
            })
            .catch(() => {
              this.$message.info("已取消上架");
            });
        }
      } else {
        //单个操作
        this.$confirm("确认上架?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.upGoodsHandle([id]);
          })
          .catch(() => {
            this.$message.info("已取消上架");
          });
      }
    },
    // 编辑
    edit(row) {
      this.$refs.goodsAddOrUpdate.init(row);
    },
    // 主播结算比例
    settlementRatio(row) {
      this.$router.push({ name: "basicManagement-goods-settlementRatio", query: {
        productId: row.id,
        productName: row.productName
      } })
    }
  },
};
</script>
<style lang="scss" scoped>
.mod-live__goodsList {
  .frontCoverImg {
    width: 100%;
    height: 60px;
  }
}
</style>