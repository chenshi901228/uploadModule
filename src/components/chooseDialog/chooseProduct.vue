<!-- 商品选择 -->
<template>
  <el-dialog
    title="推荐商品"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
    :close-on-press-escape="false"
    width="90%"
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
      <!-- <el-form-item label="添加状态" prop="isAdd">
        <el-select
          placeholder="请选择"
          style="width: 200px"
          v-model="dataForm.isAdd"
          clearable
        >
          <el-option :value="1" label="已添加"></el-option>
          <el-option :value="0" label="未添加"></el-option>
        </el-select>
      </el-form-item> -->
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
      <!-- <div class="headerTool-handle-btns">
        <div class="headerTool--handle-btns-left">
          <el-form-item>
            <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                :disabled="!dataListSelections.length"
                @click="add()">批量添加</el-button>
          </el-form-item>
        </div>
      </div> -->
    </el-form>
    <!-- :row-key="getRowKey"-->
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      ref="table"
      :row-key="getRowKey"
      @selection-change="dataListSelectionChangeHandle"
      height="360px"
      style="width: 100%"
      @cell-dblclick="dblclick"
    >
      <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
        fixed="left"
      >
      </el-table-column> -->
      <el-table-column
        type="selection"
        header-align="center"
        :reserve-selection="true"
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
          <div v-else-if="item.prop == 'stock'">
              <el-input-number 
                v-if="sortId === row.id && sortId !== ''"
                size="mini"
                v-model="sortVal"
                placeholder="请输入"
                @blur="sortId = ''"
                :min="1"
                :precision="0"
                 :controls="false"
                :id="'input' + row.id"
                @keyup.enter.native="userSelect"
                style="width:80px"
              ></el-input-number>
              <span v-else>
                {{row.stock ||  "-" }}
              </span>
            </div>
          <!-- 是否添加 -->
          <!-- <span v-else-if="item.prop == 'isAdd'">
            {{row.isAdd ? "已添加" : "未添加"}}
          </span> -->
          <span v-else>
            {{ row[item.prop] || "-" }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column 
        width="140"  
        header-align="center"
        align="center" 
        prop="stock" 
        label="带货库存" 
        show-overflow-tooltip>
         
      </el-table-column> -->
      <el-table-column
        :label="$t('handle')"
        fixed="right"
        header-align="center"
        align="center"
        width="150"
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
          <el-button
            icon="el-icon-delete"
            type="text"
            size="small"
            v-if="row._isSelected"
            @click="deleteSelect(row)"
            >移除</el-button
          >
          <!-- <el-button
            icon="el-icon-plus"
            type="text"
            size="small"
            v-if="!row._isSelected"
            @click="add(row)"
            >添加</el-button
          > -->
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
        <el-button size="small"  @click="dialogVisible = false;">取 消</el-button>
        <el-button size="small" plain :disabled="!dataListSelections.length" type="primary" @click="add()">确 认</el-button>
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
        isAdd: "",
      },
      allDataList: [], //所有数据集合
      dataList: [], // 数据列表
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      defaultSelected: [], //默认选中的数据
      dataListSelections: [], //表格选中数据
      tableItem: [
        { prop: "productImage", label: "商品图片" },
        { prop: "productName", label: "商品名称" },
        { prop: "oldPrice", label: "商品价格" },
        { prop: "price", label: "销售价格" },
        { prop: "productType", label: "商品类型" },
        { prop: "isFree", label: "是否免费" },
        { prop: "stock", label: "带货库存", width:120},
        // { prop: "isAdd", label: "添加状态" },
      ],
      productTypeOptions: [], //商品类型下拉选项
      params: { 
        anchorId: "", //替换请求参数anchorId
      },

      sortVal: 0,
      sortId: "",
      stockList:[],
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
  },
  methods: {
    init(data, anchorId) {
      if(anchorId) this.params.anchorId = anchorId
      this.page = 1;
      this.limit = 10;
      this.dialogVisible = true;
      this.getAllData(data);
    },
    //排序
    dblclick(row, column, cell, event) {
      if (column.property === "stock" && row.stock) {
        this.sortId = row.id;
        this.sortVal = row.stock;
        this.$nextTick(() => {
          let id = "#" + "input" + this.sortId;
          document.querySelector(id).focus();
        });
      }
    },
    //回车确认
    userSelect() {
      for(let item of this.dataList){
        if(item.id==this.sortId ){
          item.stock=this.sortVal
        }
      }
      for (let i = 0; i < this.defaultSelected.length; i++) {
        for (let j = 0; j < this.dataList.length; j++) {
          if (this.defaultSelected[i].id == this.dataList[j].id) {
              this.defaultSelected[j].stock=this.dataList[i].stock
          }
        }
      }
      this.stockList=this.dataList
      this.sortId = "";
      this.sortVal = "";
      this.query()
    },
    //置顶
    setTop(row) {
      if(this.defaultSelected.length > 1) {  //如果有1条以上数据，才将默认选中列表中数据置顶
        // 默认选中列表中数据置顶
        this.defaultSelected.map((item, index) => {
          if(item.id == row.id) {
            this.defaultSelected.splice(index, 1)
          }
        })
        this.defaultSelected.unshift(row)
      } 

      // 所有数据列表中数据置顶
      this.allDataList.map((item, index) => {
        if(item.id == row.id) {
          this.allDataList.splice(index, 1)
        }
      })
      this.allDataList.unshift(row)

      this.$message.success("置顶成功")

      this.query()

    },
    // 设置默认选中数据
    setHadSelected() {
      if (this.defaultSelected.length) {
        this.allDataList.forEach((row, i) => {
          this.defaultSelected.forEach((item, index) => {
            if (row.id == item.id) {
              // 数据列表是否选中设为true
              row["_isSelected"] = true
              row["_sort"] = index + 1
            }
          });
        });
        // 排序被选中的
        this.allDataList = this.allDataList.sort((a, b) => a._sort - b._sort)
        // 所有的重新赋值_sort
        this.allDataList.map((item, index) => item._sort = index)
      } 
    },

    // 获取所有数据在本地操作置顶
    getAllData(sourceData) {
      console.log(sourceData,222);
      this.dataListLoading = true;
      this.$http
        .get("/sys/wxapp/anchorProduct/listWithAnchorIdPage", {
          params: {
            page: 1,
            limit: 999,
            anchorId: this.params.anchorId ? this.params.anchorId : this.userId, //管理员操作参数为选择的主播ID
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
          this.allDataList = res.data.list
          this.total = res.data.total;
          // 给默认选中的数据赋值
          if(sourceData) {
            this.defaultSelected = sourceData.length ? JSON.parse(JSON.stringify(sourceData)) : [];
          }
          // console.log(this.defaultSelected,888);

          this.setHadSelected()

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
      
      this.initDataSort()

      setTimeout(() => {
        this.dataList = this.allDataList.slice((this.page - 1) * this.limit, this.page * this.limit);
        this.dataListLoading = false;

        // 防止table刷新错位
        if (this.$refs.table) {
          this.$nextTick(() => {
            this.$refs.table.doLayout();
          });
        }
      }, 200)
    },

    // 初始所有数据重排序
    initDataSort() {
      this.$nextTick(() => {
     
        let data = JSON.parse(JSON.stringify(this.defaultSelected))
        let allData = JSON.parse(JSON.stringify(this.allDataList))

         for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < allData.length; j++) {
            if (data[i].id == allData[j].id) {
                allData[j].stock=data[i].stock
            }
          }
        }
       
        // 找出所有数据中包含默认选中的数据
        data = allData.filter(item => {
          return data.some(j => j.id == item.id)
        })

        // 去掉所有数据中相同的并添加到数组头部
        allData = allData.filter(item => {
          return !data.some(j => j.id == item.id)
        })
        // 由于新返回的默认选中的数据未设置选中-重新设置选中
        data.map(item => item["_isSelected"] = true)
        allData.map(item => item["stock"] = item.stock)
        data.map(item => item["stock"] = item.stock)
        
        // for(let obj of allData){
        //   if(obj.stock="" || !obj.stock ){
        //       // obj.stock=100
        //     allData.map(item => item["stock"] = 100)
        //   }
        // }
        
        allData.unshift(...data)

        this.allDataList = allData

        if(this.defaultSelected){
          this.$refs.table.clearSelection();

          this.$nextTick(()=>{
            // console.log(this.$refs,33);
            // this.$refs.table.clearSelection()
            this.defaultSelected.forEach(item => {
              this.$refs.table.toggleRowSelection(item);
            });
          })
        }
      })
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
      this.$confirm("确认添加推荐商品", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if(row) { //单个添加
          this.allDataList.forEach(item => {
            if(item.id == row.id) {
              item["_isSelected"] = true
              this.defaultSelected.push(item)
            }
          })

        }else { //批量添加

          // 多选如果有已经选中的给出提示
          // let haveSelected = this.dataListSelections.some(item => item._isSelected)
          // if(haveSelected) return this.$message.warning("选项中包含有已被添加的选项")

          // 创建临时变量
          let arr = JSON.parse(JSON.stringify([...this.defaultSelected, ...this.dataListSelections]));
  
          // 全选时，合并数据去重
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[i].id == arr[j].id) {
                arr.splice(i, 1);
                j--;
              }
            }
          }

          this.defaultSelected = arr

          for(let obj of this.defaultSelected){
            if(obj.stock=="" || !obj.stock){
              obj.stock=100
            }
          }

          console.log(this.defaultSelected,'保存的商品');

        }
        this.$message.success("添加成功")
        
        
        this.query()
        
      }).catch(() => this.$message.info("取消操作"));
      
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
          this.allDataList.forEach((row) => {
            if (row.id == data.id) {
              // 数据列表是否选中设为false
              row["_isSelected"] = false
              row["stock"]=""
            }
          });
          // 默认选中数据中去掉这条数据
          this.defaultSelected = this.defaultSelected.filter(
            (item) => item.id != data.id
          );
          this.$refs.table.clearSelection();

          this.$nextTick(()=>{
            // console.log(this.$refs,33);
            // this.$refs.table.clearSelection()
            this.defaultSelected.forEach(item => {
              this.$refs.table.toggleRowSelection(item);
            });
          })

          this.$message.success("删除成功")

          this.query()
        })
        .catch(() => this.$message.info("取消操作"));
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    //多选触发
    getRowKey(row) {
      return row.id
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
      this.$emit("add", this.defaultSelected);
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
  max-width: 100px;
  height: 60px;
  object-fit: cover;
}
// /deep/.el-table__header{
//   .el-checkbox__inner{
//     display: none;
//   }
// }

// /deep/.el-tooltip {
//   .el-input {
//     width: 110px;
//   }
// }
// /deep/.el-input-number .el-input-number--mini{
//   width: 110px !important;
// }
</style>
