<!--基础管理-上架商品-->

<template>
  <div>
    <el-card shadow="never" class="aui-card--fill">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称" prop="productName">
              <el-select
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
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品类型" prop="productType">
              <!-- <el-input
                                size="small"
                                v-model.trim="dataForm.productType"
                                placeholder="请输入"
                                clearable
                            >
                            </el-input> -->
              <el-select
                clearable
                size="small"
                v-model="dataForm.productType"
                placeholder="请选择"
              >
                <el-option label="专业课" value="专业课"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否免费" prop="isFree">
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
          </el-col>
          <div v-if="isOpen">
            <el-col :span="8">
              <el-form-item label="关联产品编号" prop="id">
                <el-input
                  size="small"
                  v-model.trim="dataForm.id"
                  placeholder="请输入"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button
                :disabled="!dataListSelections.length"
                size="small"
                type="primary"
                @click="upGoods()"
                >批量上架</el-button
              >
              <el-button size="small" type="primary" @click="getDataList">{{
                $t("query")
              }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{
                $t("reset")
              }}</el-button>
              <el-button size="small" type="primary" @click="open">
                {{ isOpen ? "收起" : "展开"
                }}<i
                  style="margin-left: 10px"
                  :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                ></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
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
                style="width: 100%; height: 60px"
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
            <!-- 分成比例 -->
            <span v-else-if="item.prop == 'proportion'">
              {{ row.proportion }}%
            </span>
            <!-- 状态 -->
            <span v-else-if="item.prop == 'status'">
              <el-tag size="small" type="danger">下架</el-tag>
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
          width="100"
        >
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="upGoods(row.id)"
              >上架</el-button
            >
            <el-button
              style="margin-left: 10px"
              type="text"
              size="small"
              @click="emdit(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
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
        getDataListURL: "/sys/course/downPage", // 数据列表接口，API地址
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
        { prop: "proportion", label: "分成比例" },
        { prop: "buyers", label: "已购买人数" },
        { prop: "id", label: "关联产品编号" },
        // { prop: "updateDate", label: "更新时间", width: 180 },
        { prop: "status", label: "状态" },
      ],
      loading: false, //搜索loading
      goodsNameOptions: [], //商品名称下拉选项
    };
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
          .get("/sys/course/searchByNameWithDel", {
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
    emdit(row) {
      this.$refs.goodsAddOrUpdate.init(row);
    },
  },
};
</script>