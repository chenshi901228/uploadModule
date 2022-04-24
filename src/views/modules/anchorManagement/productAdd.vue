
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称" prop="productName">
              <el-input
                size="small"
                v-model.trim="dataForm.productName"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品类型" prop="productType">
              <el-input
                size="small"
                v-model.trim="dataForm.productType"
                placeholder="请输入"
                clearable
              >
              </el-input>
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
            <el-row>
              <el-col :span="8">
                <el-form-item label="关联产品编号" prop="searchProductId">
                    <el-input
                        size="small"
                        v-model.trim="dataForm.searchProductId"
                        placeholder="请输入"
                        clearable
                    >
                    </el-input>
                </el-form-item>
            </el-col>
              <el-col :span="8">
                <el-form-item label="添加状态" prop="isAdd">
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
              </el-col>
              <el-col :span="8">
                <el-form-item label="主推状态" prop="isFeatured">
                  <el-select
                    clearable
                    size="small"
                    v-model="dataForm.isFeatured"
                    placeholder="请选择"
                  >
                    <el-option label="未主推" :value="0"></el-option>
                    <el-option label="已主推" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <!-- <el-button size="small" type="info" @click="exportHandle">{{
                $t("export")
              }}</el-button> -->
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
            <span v-else-if="item.prop == 'price'">
              ￥{{ row.price }}
            </span>
            <!-- 是否添加 -->
            <span v-else-if="item.prop == 'isAdd'">
              {{ row.isAdd ? "已添加" : "未添加" }}
            </span>
            <!-- 是否主推 -->
            <span v-else-if="item.prop == 'isFeatured'">
              {{ row.isFeatured ? "已主推" : "未主推" }}
            </span>
            <!-- 是否免费 -->
            <span v-else-if="item.prop == 'isFree'">
                <el-tag size="small" :type="row.isFree ? 'success' : 'danger'">{{row.isFree ? "是" : "否"}}</el-tag>
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
            <el-button
              type="text"
              @click="addOrDelete(row)"
              >{{row.isAdd ? "删除" : "添加"}}</el-button
            >
            <el-button
              type="text"
              v-if="row.isAdd"
              @click="setMain(row)"
              >{{row.isFeatured ? "取消主推" : "设置为主推"}}</el-button
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
    </div>
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
        { prop: "price", label: "销售价格" },
        { prop: "productType", label: "商品类型" },
        { prop: "isFree", label: "是否免费" },
        { prop: "productId", label: "关联产品编号" },
        { prop: "updateDate", label: "更新时间", width: 180 },
        { prop: "isAdd", label: "添加状态" },
        { prop: "isFeatured", label: "主推状态" },
      ],
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
    addOrDelete(row) {
        if(row.isAdd) { //删除
            this.$confirm('确定删除改商品', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/sys/playbackProduct", { data: [row.id] }).then(({data:res}) => {
                        if(res.code == 0) {
                            this.$message.success("删除商品成功")
                            this.query()
                        }else {
                            this.$message.error(res.msg)
                        }
                    }).catch(err => {
                        this.$message.error(JSON.stringify(err))
                    })
                }).catch(() => {
                    this.$message.info("已取消操作");          
                });
        }else { //添加
            this.$http.post("/sys/playbackProduct", {
                playbackId: this.params.playbackId,
                anchorProductId: row.anchorProductId, 
                productId: row.productId, 
                anchorId: this.params.anchorId
            }).then(({data:res}) => {
                if(res.code == 0) {
                    this.$message.success("添加商品成功")
                    this.query()
                }else {
                    this.$message.error(res.msg)
                }
            }).catch(err => {
                this.$message.error(JSON.stringify(err))
            })
        }
    },
    // 主推设置
    setMain(row) {
        if(row.isFeatured) { //取消主推
            this.$confirm('确定取消主推', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.put("/sys/playbackProduct", {
                        id: row.id,
                        playbackId: this.params.playbackId,
                        isFeatured: 0
                    }).then(({data:res}) => {
                        if(res.code == 0) {
                            this.$message.success("取消主推成功")
                            this.query()
                        }else {
                            this.$message.error(res.msg)
                        }
                    }).catch(err => {
                        this.$message.error(JSON.stringify(err))
                    })
                }).catch(() => {
                    this.$message.info("已取消操作");          
                });
        }else { //设为主推
            this.$http.put("/sys/playbackProduct", {
                id: row.id,
                playbackId: this.params.playbackId,
                isFeatured: 1
            }).then(({data:res}) => {
                if(res.code == 0) {
                    this.$message.success("添主推成功")
                    this.query()
                }else {
                    this.$message.error(res.msg)
                }
            }).catch(err => {
                this.$message.error(JSON.stringify(err))
            })
        }
    }
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