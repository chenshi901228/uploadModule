<!-- 主播选择 -->
<template>
  <el-dialog
    title="推荐主播"
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
      <el-form-item label="主播昵称" prop="username">
        <el-input
          style="width: 200px"
          v-model="dataForm.username"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          style="width: 200px"
          v-model="dataForm.phone"
          placeholder="请输入"
        ></el-input>
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
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      ref="table"
      :row-key="getRowKey"
      @selection-change="dataListSelectionChangeHandle"
      height="360px"
      style="width: 100%"
    >
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
          <div v-if="item.prop == 'avatarUrl'">
            <img
              class="avatarImg"
              :src="row.avatarUrl || require('@/assets/img/default_cover.jpg')"
              alt=""
            />
          </div>
          <span v-else-if="item.prop == 'delFlg'">{{
            row.delFlg === 0 ? "上架" : "下架"
          }}</span>
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
          <!-- <el-button
            icon="el-icon-plus"
            type="text"
            size="small"
            v-if="!row._isSelected"
            @click="add(row)"
            >添加</el-button
          > -->
          <el-button
            icon="el-icon-delete"
            type="text"
            size="small"
            v-if="row._isSelected"
            @click="deleteSelect(row)"
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
        username: "",
        phone: "",
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
        { prop: "avatarUrl", label: "主播头像" },
        { prop: "username", label: "主播昵称" },
        { prop: "phone", label: "手机号码" },
        { prop: "updateDate", label: "更新时间" },
      ],
      params: { 
        anchorId: "", //替换请求参数anchorId
      }
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
    //置顶
    setTop(row) {
      if(this.defaultSelected.length > 1) {  //如果有1条以上数据，才将默认选中列表中数据置顶
        // 默认选中列表中数据置顶
        this.defaultSelected.map((item, index) => {
          if(item.anchorId == row.anchorId) {
            this.defaultSelected.splice(index, 1)
          }
        })
        this.defaultSelected.unshift(row)
      } 

      // 所有数据列表中数据置顶
      this.allDataList.map((item, index) => {
        if(item.anchorId == row.anchorId) {
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
            if (row.anchorId == item.anchorId) {
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
      this.dataListLoading = true;
      this.$http
        .get("/sys/sysRecommendedAnchor/pageForAddLivePreview", {
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

        // 找出所有数据中包含默认选中的数据
        data = allData.filter(item => {
          return data.some(j => j.anchorId == item.anchorId)
        })

        // 去掉所有数据中相同的并添加到数组头部
        allData = allData.filter(item => {
          return !data.some(j => j.anchorId == item.anchorId)
        })

        // 由于新返回的默认选中的数据未设置选中-重新设置选中
        data.map(item => item["_isSelected"] = true)

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

    // 选择添加
    add(row) {
      this.$confirm("确认添加推荐主播", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if(row) { //单个添加
        this.allDataList.forEach(item => {
          if(item.anchorId == row.anchorId) {
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
            if (arr[i].anchorId == arr[j].anchorId) {
              arr.splice(i, 1);
              j--;
            }
          }
        }

        this.defaultSelected = arr
        
      }
      this.$message.success("添加成功")
      
      this.query()
      }).catch(() => this.$message.info("取消操作"));

    },
    // 点击删除
    deleteSelect(data) {
      this.$confirm("确认取消推荐主播", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 取消选中行
          this.allDataList.forEach((row) => {
            if (row.anchorId == data.anchorId) {
              // 数据列表是否选中设为false
              row["_isSelected"] = false
            }
          });
          // 默认选中数据中去掉这条数据
          this.defaultSelected = this.defaultSelected.filter(
            (item) => item.anchorId != data.anchorId
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
      return row.anchorId
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
.avatarImg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
