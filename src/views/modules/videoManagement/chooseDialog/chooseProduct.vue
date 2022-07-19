<!-- 商品选择 -->
<template>
  <el-dialog
    title="推荐商品"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
    :close-on-press-escape="false"
    width="80%"
    top="20px"
  >
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList"
      size="small"
      ref="dataForm"
      label-width="100px"
    >
      <el-form-item label="商品名称" prop="productName">
        <el-input
          placeholder="请输入"
          style="width: 200px"
          clearable
          v-model="dataForm.productName"
        />
      </el-form-item>
      <el-form-item label="商品类型" prop="productType">
        <el-select
          @visible-change="getProductType"
          style="width: 200px"
          v-model="dataForm.productType"
          placeholder="商品类型"
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
      <el-form-item label="是否免费" prop="isFree">
        <el-select
          placeholder="请选择"
          style="width: 200px"
          v-model="dataForm.isFree"
          clearable
        >
          <el-option :value="1" label="是"></el-option>
          <el-option :value="0" label="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联商品编号" prop="linkedProductId">
        <el-input
          placeholder="请输入"
          style="width: 200px"
          clearable
          v-model="dataForm.linkedProductId"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getDataList"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reset"
          >重置</el-button
        >
      </el-form-item>

      <!-- 操作按钮 -->
      <div class="headerTool-handle-btns">
        <div class="headerTool--handle-btns-left">
          <!-- <el-form-item>
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            :disabled="!dataListSelections.length"
                            @click="add()">批量添加</el-button>
                    </el-form-item> -->
        </div>
      </div>
    </el-form>
    <!-- 选中的内容 -->
    <div class="selectedData">
      <el-tooltip
        v-for="item in defaultSelected"
        :key="item.id"
        :content="item.productName"
        placement="top"
      >
        <span class="showTitle"
          >{{ item.productName
          }}<i @click="deleteSelect(item)" class="el-icon-close"></i
        ></span>
      </el-tooltip>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      ref="table"
      @select="selectRow"
      @select-all="selectAll"
      height="360px"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
        fixed="left"
      >
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        v-for="item in tableItem"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
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
      >
        <template slot-scope="{ row }">
          <el-button
            icon="el-icon-upload2"
            type="text"
            size="small"
            v-if="row._isSelected"
            @click="setTop(row)"
            >置顶</el-button
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="add()" size="small">确 认</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dataForm: {
        // 查询条件
        productName: "",
        productType: "",
        isFree: null,
        linkedProductId: "",
      },
      allDataList: [], //所有数据集合
      dataList: [], // 数据列表
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      defaultSelected: [], //默认选中的数据
      tableItem: [
        { prop: "productImage", label: "商品图片" },
        { prop: "productName", label: "商品名称" },
        { prop: "oldPrice", label: "商品价格" },
        { prop: "price", label: "销售价格" },
        { prop: "productType", label: "商品类型" },
        { prop: "isFree", label: "是否免费" },
        { prop: "linkedProductId", label: "关联产品编号" },
      ],
      productTypeOptions: [], //商品类型下拉选项
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
  },
  methods: {
    init(data) {
      this.page = 1;
      this.limit = 10;
      this.dialogVisible = true;
      this.getAllData(data);
    },

    //置顶
    setTop(row) {
      if(this.defaultSelected.length > 1) {  //如果有1条以上数据，才将默认选中列表中数据置顶
        // 默认选中列表中数据置顶
        this.defaultSelected.map((item, index) => {
          if(item.productId == row.productId) {
            this.defaultSelected.splice(index, 1)
          }
        })
        this.defaultSelected.unshift(row)
      } 

      // 所有数据列表中数据置顶
      this.allDataList.map((item, index) => {
        if(item.productId == row.productId) {
          this.allDataList.splice(index, 1)
        }
      })
      this.allDataList.unshift(row)



      this.query()

    },
    // 设置默认选中的行
    setCurPageSelected() {
      this.$nextTick(() => {
        if (this.defaultSelected.length) {
          this.dataList.forEach((row, i) => {
            this.defaultSelected.forEach((item) => {
              if (row.productId == item.productId) {
                this.$refs.table.toggleRowSelection(row, true);
                // 数据列表是否选中设为true
                row["_isSelected"] = true
              }
            });
          });
        } else {
          this.$refs.table.clearSelection();
        }
      });

      // 防止table刷新错位
      if (this.$refs.table) {
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
      }
    },
    // 获取所有数据在本地操作置顶
    getAllData(sourceData) {
      this.dataListLoading = true;
      this.$http
        .get("/sys/playbackProduct/getProductPage", {
          params: {
            page: 1,
            limit: 999,
            anchorId: this.userId,
            ...this.$httpParams(this.dataForm),
          },
        })
        .then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.allDataList = []
            this.dataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.allDataList = res.data.list;
          this.total = res.data.total;

          // 给默认选中的数据赋值
          if(sourceData) {
            this.defaultSelected = sourceData.length ? JSON.parse(JSON.stringify(sourceData)) : [];
          }

          this.initDataSort()

          this.query()
        })
        .catch((err) => {
          this.dataListLoading = false;
          this.$message.error(JSON.stringify(err.message));
        });
    },

    // 获取数据列表
    query() {
      this.dataListLoading = true;

      setTimeout(() => {
        this.dataList = this.allDataList.slice((this.page - 1) * this.limit, this.page * this.limit);
        this.dataListLoading = false;
        this.setCurPageSelected();
      }, 200)
    },

    // 初始所有数据重排序
    initDataSort() {
      let data = JSON.parse(JSON.stringify(this.defaultSelected))
      if(data.length && this.allDataList.length) {
        data.map(j => {
          this.allDataList.map((item, index) => {
            if(item.productId == j.productId) {
              this.allDataList.splice(index, 1)
            }
          })
        })
        this.allDataList.unshift(...data)
      }
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
    // 选择添加
    add(row) {
      this.$emit("add", this.defaultSelected);
    },
    // 点击删除
    deleteSelect(data) {
      this.$confirm("确认取消推荐商品", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 取消选中行
          this.dataList.forEach((row) => {
            if (row.productId == data.productId) {
              this.$refs.table.toggleRowSelection(row, false);
              // 数据列表是否选中设为false
              row["_isSelected"] = false
            }
          });
          // 默认选中数据中去掉这条数据
          this.defaultSelected = this.defaultSelected.filter(
            (item) => item.productId != data.productId
          );
        })
        .catch(() => this.$message.info("取消操作"));
    },
    // 手动选中行变化
    selectRow(selection, row) {
      // 判断是选中还是取消选中
      let isSelected =
        selection.filter((item) => item.productId == row.productId).length == 1;
      if (isSelected) {
        //选中-添加数据
        this.defaultSelected.push(row);

        // 数据列表是否选中设为true
        this.dataList.forEach(item => {
          if(item.productId == row.productId) {
            item["_isSelected"] = true
          }
        })
      } else {
        //删除数据
        this.defaultSelected = this.defaultSelected.filter(
          (item) => item.productId != row.productId
        );

        // 数据列表是否选中设为false
        this.dataList.forEach(item => {
          if(item.productId == row.productId) {
            item["_isSelected"] = false
          }
        })
      }
    },
    // 手动勾选全选
    selectAll(selection) {
      if (selection.length) {
        //全部选中
        if (!this.defaultSelected.length) {
          this.defaultSelected = selection;
        } else {
          // 创建临时变量
          let arr = JSON.parse(JSON.stringify([...this.defaultSelected, ...selection]));

          // 全选时，合并数据去重
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[i].productId == arr[j].productId) {
                arr.splice(i, 1);
                j--;
              }
            }
          }

          this.defaultSelected = arr;
        }


        // 数据列表是否选中设为true
        this.dataList.forEach(item => {
          item["_isSelected"] = true
        })
      } else {
        //全部取消
        // 创建临时变量
        let data = JSON.parse(JSON.stringify(this.defaultSelected));

        this.dataList.map((item) => {
          data.map((val, index) => {
            if (item.productId == val.productId) {
              data.splice(index, 1);
            }
          });
        });
        this.defaultSelected = data;

        // 数据列表是否选中设为false
        this.dataList.forEach(item => {
          item["_isSelected"] = false
        })
      }
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
    getDataList: function () {
      this.page = 1;
      this.getAllData();
    },
    // 重置搜索条件
    reset() {
      this.$refs.dataForm.resetFields();
      this.getDataList();
    },

    // 关闭
    close() {
      this.$refs.dataForm.resetFields();
      this.$refs.table.clearSelection();
      this.defaultSelected = []
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.selectedData {
  display: flex;
  flex-wrap: wrap;
  max-height: 60px;
  overflow-y: auto;
  .showTitle {
    display: inline-block;
    max-width: 150px;
    padding: 0 20px 0 10px;
    line-height: 30px;
    background: #eaf4fc;
    color: #909399;
    border-radius: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    i {
      position: absolute;
      right: 4px;
      top: 4px;
    }
  }
}
.el-dialog__body {
  padding: 10px 20px !important;
}
.frontCoverImg {
  max-width: 100%;
  height: 60px;
  object-fit: cover;
}
</style>
