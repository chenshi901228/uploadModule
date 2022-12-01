// 带货商品
<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-fansLevel">
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
          v-show="isOpen || formItemCount >= 1"
        >
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="dataForm.productName"
          />
        </el-form-item>
        <el-form-item
          label="商品类型"
          prop="productType"
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
            placeholder="请选择"
            style="width: 200px"
            v-model="dataForm.isFree"
            clearable
          >
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="关联产品编号"
          prop="linkedProductId"
          v-show="isOpen || formItemCount >= 4"
        >
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="dataForm.linkedProductId"
          />
        </el-form-item> -->
        <el-form-item
          label="添加状态"
          prop="isAdd"
          v-if="(isOpen || formItemCount >= 5) && authEdit == 1"
        >
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="dataForm.isAdd"
            clearable
          >
            <el-option :value="0" label="未添加"></el-option>
            <el-option :value="1" label="已添加"></el-option>
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
            <el-button icon="el-icon-refresh" size="mini" @click="resetDataForm"
              >重置</el-button
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
            <el-form-item v-if="authEdit == 1">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                :disabled="dataListSelections.length === 0"
                @click="addProduct"
                >批量添加</el-button
              >
            </el-form-item>
            <!-- <el-form-item>
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportHandle"
                >{{ $t("export") }}</el-button
              >
            </el-form-item> -->
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
        ref="table"
        class="stock"
        @cell-dblclick="dblclick"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="productImage"
          label="商品图片"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              <img
                class="frontCoverImg"
                :src="
                  row.productImage || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="oldPrice"
          label="商品价格"
          header-align="center"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="price"
          label="销售价格"
          header-align="center"
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="productType"
          label="商品类型"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isFree"
          label="是否免费"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.isFree === 1 ? "是" : "否" }}
          </template></el-table-column
        >
        <!-- <el-table-column
          prop="linkedProductId"
          label="关联产品编号"
          header-align="center"
          align="center"
        ></el-table-column> -->
        <el-table-column
          header-align="center"
          align="center"
          prop="stock"
          width="140"
          label="带货库存">
          <template slot-scope="{ row }">
            <div v-if="authEdit == 1">
              <el-input-number 
                v-if="sortId === row.productLiveId && sortId !== ''"
                size="mini"
                v-model="sortVal"
                placeholder="请输入"
                @blur="sortId = ''"
                :min="1"
                :precision="0"
                 :controls="false"
                :max="9999"
                :id="'input' + row.productLiveId"
                @keyup.enter.native="userSelect"
              ></el-input-number>
              <span v-else>
                {{ row.stock || "--" }}
              </span>
            </div>
            <div v-else>{{ row.stock || "--" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isAdd"
          label="添加状态"
          header-align="center"
          align="center"
          v-if="authEdit == 1"
        >
          <template slot-scope="scope">
            {{ scope.row.isAdd === 1 ? "已添加" : "未添加" }}
          </template></el-table-column
        >
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          v-if="authEdit == 1"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isAdd === 1"
              icon="el-icon-delete"
              type="text"
              size="small"
              @click="deleteSelect(scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.isAdd === 1"
              icon="el-icon-upload2"
              type="text"
              size="small"
              @click="toTop(scope.row)"
              >置顶</el-button
            >
            <el-button
              v-if="scope.row.isAdd === 0"
              icon="el-icon-plus"
              type="text"
              size="small"
              @click="add(scope.row)"
              >添加</el-button
            >
            <el-button
              icon="el-icon-tickets"
              type="text"
              size="small"
              @click="depotShow(scope.row)"
              >出入库记录</el-button
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></add-or-update>
    </div>
    <el-dialog title="批量添加" :visible.sync="dialogAddVisible" width="30%">
      <span class="title"> 确定批量添加店铺中的商品</span>
      <div class="totalNum">
        <span class="title">带货库存</span>
        <el-input-number 
          size="small"
          v-model="totalNum"
          placeholder="请输入"
          :min="1"
          :precision="0"
          :controls="false"
          :max="9999"
        ></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAddVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmAddSelect"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="提醒" :visible.sync="dialogDeleteVisible" width="30%">
      <span>确定删除该商品</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeleteVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmDelete"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="置顶" :visible.sync="dialogVisible" width="30%">
      <span>置顶该商品后，将展示在第一个，确认置顶</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmCargo"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="出入库记录" :visible.sync="dialogVisible_depot" width="80%" top="50px">
      <el-descriptions style="margin:0 0 20px 0" class="margin-top" :column="3" size="small" border>
        <el-descriptions-item>
            <template slot="label">
                商品名称
            </template>
            <span>{{ depotInfo.productName || "-" }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-table v-loading="loading_depot" :data="depotList" style="width: 100%" height="400px">
        <el-table-column prop="stock" label="数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="stockType" label="类型" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.stockType== -1 ? '出库' : '入库'}}
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="关联订单号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      </el-table>
      <el-pagination background :current-page="page_depot" :page-sizes="[10, 20, 50, 100]" :page-size="limit_depot"
          :total="total_depot" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle_depot"
          @current-change="pageCurrentChangeHandle_depot">
        </el-pagination>
        <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import debounce from "lodash/debounce";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/anchorProduct/live/pageWithLive",
        getDataListIsPage: true,
        deleteIsBatch: true,
        createdIsNeed: false,
        activatedIsNeed: false,
      },
      dataForm: {},
      params: {
        liveId: "",
        type: 2,
        anchorId: "",
        isAdd: "",
      },
      dialogVisible: false,
      dialogDeleteVisible: false,
      dialogVisible_depot:false,//出入库记录弹窗
      loading_depot:false,//出入库存加载
      id: "",
      ids: [],
      dialogAddVisible: false,
      selectAddList: [],
      authEdit: 1, //从直播列表进来是否有编辑权限：1-有，0-没有
      productTypeOptions: [], //商品类型下拉选项

      sortVal: "",//排序
      sortId: "",//排序

      totalNum:1,//批量库存

      depotList:[],//出入库存列表
      depotInfo:{},
      limit_depot:10,
      total_depot:0,
      page_depot:1
    };
  },
  activated() {
    if(this.$route.query.authEdit != undefined) { //有标识来自直播列表-设置操作按钮显示
      this.authEdit = this.$route.query.authEdit
    }
    if(this.$route.query.isAdd != undefined) this.params.isAdd = this.$route.query.isAdd  //直播列表已下播或已禁播增加查询参数isAdd
    this.params.liveId = this.$route.query.liveId;
    this.params.type = parseInt(this.$route.query.type)
    this.params.anchorId = this.$route.query.anchorId
    this.query();
  },
  methods: {
    //排序
    dblclick(row, column, cell, event) {
      if(row.stock){
        this.sortId = row.productLiveId;
        this.sortVal = row.stock;
        this.$nextTick(() => {
          let id = "#" + "input" + this.sortId;
          document.querySelector(id).focus();
        });
      }
    },
    //回车确认
    userSelect() {
      // let data=[{id:this.sortId,stock: this.sortVal}]
       this.$http
        .put("/sys/anchorProduct/live/updateStock", {
          id:this.sortId,
          stock: this.sortVal
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
    //确认批量添加
    confirmAddSelect() {
      this.dataListSelections.forEach((v) => {
        let data={
          productId:v.id,
          stock:this.totalNum
        }
        this.selectAddList.push(data);
      });
      this.$http
        .post("/sys/anchorProduct/live", {
          liveId: this.params.liveId,
          anchorId: this.params.anchorId,
          productIdList: this.selectAddList,
          type: this.params.type,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dialogAddVisible = false;
            this.selectAddList = [];
            return this.$message.error(res.msg);
          } else {
            this.selectAddList = [];
            this.dialogAddVisible = false;
            this.$message.success("添加成功！");
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量添加
    addProduct() {
      let flag = this.dataListSelections.some((val) => {
        return val.isAdd === 1;
      });
      if (flag) {
        this.$message.warning("请选择未添加商品！");
      } else {
        this.dialogAddVisible = true;
        // this.dataListSelections.forEach((v) => {
        //   this.selectAddList.push(v.id);
        // });
      }
    },
    //删除
    deleteSelect(row) {
      this.ids.push(row.productLiveId);
      this.dialogDeleteVisible = true;
    },
    //置顶
    toTop(row) {
      this.id = row.productLiveId;
      this.dialogVisible = true;
    },
    //添加
    add(row) {
      let list = [];
      list.push(row.id);
      this.$http
        .post("/sys/anchorProduct/live", {
          liveId: this.params.liveId,
          anchorId: this.params.anchorId,
          productIdList: list,
          type: this.params.type,
          productIdList:[{"productId":row.id,"stock":100}]
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("添加成功！");
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //确认删除
    confirmDelete() {
      this.$http
        .delete(`/sys/anchorProduct/live/deleteWithLive`, {
          data: {
            ids: this.ids,
            liveId: this.params.liveId,
            type: this.params.type,
          },
        })
        .then(({ data: res }) => {
          this.ids = [];
          this.dialogDeleteVisible = false;
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("删除成功！");
            this.query();
          }
        })
        .catch((err) => {
          this.ids = [];
          this.dialogDeleteVisible = false;
          throw err;
        });
    },
    //确认置顶
    confirmCargo() {
      this.$http
        .put("/sys/anchorProduct/live/setTop", {
          id: this.id,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("置顶成功！");
            this.dialogVisible = false;
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //重置
    resetDataForm() {
      this.dataForm = {
        productName: "",
        productType: "",
        isFree: "",
        linkedProductId: "",
      };

      this.query();
    },

    //出入库记录弹窗
    depotShow(row){
      this.depotInfo=row
      this.dialogVisible_depot=true
      this.diaDataList = [];
      this.queryDepot()
    },
    //获取出入库列表数据
    queryDepot(){
      let data={
        liveId:this.dataForm.liveId,
        productId:this.depotInfo.id,
        limit: this.limit_depot,
        page: this.page_depot,
      }
      this.$http.get("/sys/productLiveStock/page", { 
        params: data,
      }).then(({ data: res }) => {
          if (res.code == 0) {
              this.depotList=res.data.list
              this.total_depot=res.data.total
          } else {
              this.$message.error(res.msg);
          }
      }).catch(err => {
          throw err
      })
    },
    // 分页, 每页条数
    pageSizeChangeHandle_depot(val) {
      this.page_depot = 1;
      this.limit_depot = val;
      this.queryDepot();
    },
    // 分页, 当前页
    pageCurrentChangeHandle_depot(val) {
      this.page_depot = val;
      this.queryDepot();
    },
  },
};
</script>
<style scoped lang="scss">
.mod-fansLevel {
  .frontCoverImg {
    max-width: 100%;
    height: 60px;
    object-fit: cover;
  }
}
/deep/.el-tooltip {
  .el-input {
    width: 80px !important;
  }
}
.stock{
  /deep/.el-input-number.is-without-controls .el-input__inner{
    width: 80px !important;
  }
}
/deep/.el-descriptions--small.is-bordered .el-descriptions-item__cell{
  width: 120px !important;
}
</style>
