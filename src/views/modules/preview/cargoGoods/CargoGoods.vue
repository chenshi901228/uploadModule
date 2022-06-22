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
          v-if="isOpen || formItemCount >= 1"
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
          v-if="isOpen || formItemCount >= 2"
        >
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="dataForm.productType"
            clearable
          >
            <el-option value="专业课" label="专业课"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否免费"
          prop="isFree"
          v-if="isOpen || formItemCount >= 3"
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
        <el-form-item
          label="关联商品编号"
          prop="linkedProductId"
          v-if="isOpen || formItemCount >= 4"
        >
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="dataForm.linkedProductId"
          />
        </el-form-item>
        <el-form-item
          label="添加状态"
          prop="isAdd"
          v-if="isOpen || formItemCount >= 5"
        >
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="dataForm.isAdd"
            clearable
          >
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
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
            <el-form-item>
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
        ref="table"
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
                style="width: 80px; height: '80px'"
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
        <el-table-column
          prop="price"
          label="销售价格"
          header-align="center"
          align="center"
        >
        </el-table-column>
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
        <el-table-column
          prop="id"
          label="关联商品编号"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isAdd"
          label="添加状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.isAdd === 1 ? "是" : "否" }}
          </template></el-table-column
        >
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
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
      <span>确定批量添加店铺中的商品</span>
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
      dataForm: {
        liveId: "",
        type: 2,
        anchorId: "",
      },
      dialogVisible: false,
      dialogDeleteVisible: false,
      id: "",
      ids: [],
      dialogAddVisible: false,
      selectAddList: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === "preview-Preview") {
        vm.dataForm.type = 2;
      } else if (from.name === "anchorManagement-liveList") {
        vm.dataForm.type = 1;
      }
      vm.dataForm.liveId = vm.$route.query.liveId;
      vm.dataForm.anchorId = vm.$route.query.anchorId;
      vm.query();
    });
  },
  methods: {
    //确认批量添加
    confirmAddSelect() {
      this.$http
        .post("/sys/anchorProduct/live", {
          liveId: this.dataForm.liveId,
          anchorId: this.dataForm.anchorId,
          productIdList: this.selectAddList,
          type: 2,
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
        this.dataListSelections.forEach((v) => {
          this.selectAddList.push(v.id);
        });
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
          liveId: this.dataForm.liveId,
          anchorId: this.dataForm.anchorId,
          productIdList: list,
          type: 2,
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
            liveId: this.dataForm.liveId,
            type: 2,
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
        isAdd: "",
        liveId: this.$route.query.liveId,
        type: 2,
        anchorId: this.$route.query.anchorId,
      };

      this.query();
    },
  },
};
</script>
<style scoped lang="scss">
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
}
</style>
