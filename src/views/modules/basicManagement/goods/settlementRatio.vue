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
                    @keyup.enter.native="getDataList">
                    <el-form-item
                        label="主播"
                        prop="productName">
                        <el-input
                            style="width: 200px"
                            v-model.trim="dataForm.productName"
                            placeholder="主播"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        label="手机号码"
                        prop="productType">
                        <el-input
                            style="width: 200px"
                            v-model.trim="dataForm.productType"
                            placeholder="手机号码"
                            clearable></el-input>
                    </el-form-item>

                    <div class="headerTool-search-btns">
                        <el-form-item>
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                size="mini"
                                @click="getDataList"
                                >{{ $t("query") }}</el-button>
                            <el-button
                                icon="el-icon-refresh"
                                size="mini"
                                @click="resetDataForm()"
                                >{{ $t("reset") }}</el-button>
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
                                    @click="setAll"
                                    >全部主播结算比例</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    :disabled="!dataListSelections.length"
                                    size="mini"
                                    type="primary"
                                    plain
                                    icon="el-icon-edit"
                                    @click="edit()"
                                    >批量设置结算比例</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    type="warning"
                                    plain
                                    icon="el-icon-download"
                                    size="mini"
                                    @click="exportHandle"
                                    >{{ $t("export") }}</el-button>
                            </el-form-item>
                        </div>
                        <div class="headerTool--handle-btns-right">
                            <el-form-item>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="刷新"
                                    placement="top">
                                    <el-button
                                        size="small"
                                        icon="el-icon-refresh"
                                        circle
                                        @click="getDataList"></el-button>
                                </el-tooltip>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div class="goodsInfo">
                    商品名称：{{goodsInfo.productName || "-"}}
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
                        :width="item.width || 120"
                        show-overflow-tooltip
                        :sortable="
                        ['transcribeFlg', 'liveState', 'showState'].includes(item.prop)
                        "
                    >
                        <template slot-scope="{ row }">
                            <!-- 商品价格 -->
                            <span v-if="item.prop == 'oldPrice'">
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
                                <el-tag size="small" type="success">上架</el-tag>
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
                                >编辑</el-button>
                            <el-button
                                type="text"
                                size="small"
                                icon="el-icon-delete"
                                @click="deleteCount(row.id)"
                                >删除</el-button>
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
                getDataListURL: "/sys/course/page", // 数据列表接口，API地址
                exportURL: "/sys/course/export", // 导出接口，API地址
            },
            dataForm: {
                productName: "",
                productType: "",
                isFree: null,
                id: "",
            },
            goodsInfo: {
                id: "",
                productName: ""
            },

            tableItem: [
                { prop: "productName", label: "商品名称" },
                { prop: "oldPrice", label: "商品价格" },
                { prop: "price", label: "销售价格" },
                { prop: "productType", label: "商品类型" },
                { prop: "isFree", label: "是否免费" },
                { prop: "num", label: "库存数量" },
                { prop: "buyers", label: "已购买人数" },
                { prop: "id", label: "关联产品编号" },
                // { prop: "proportion", label: "分成比例" },
                { prop: "updateDate", label: "更新时间", width: 180 },
                { prop: "status", label: "状态" },
            ],
        };
    },
    created() {
        // this.query()
    },
    mounted() {
        this.goodsInfo = this.$route.query
    },
    activated() {
        this.query();
    },
    methods: {
        // 设置全部
        setAll() {

        },
        // 批量or单独设置
        editHandle() {

        },
        // 编辑
        edit(row) {
            if(row) { //单独设置

            }else { //批量设置

            }
            this.$refs.settlementRatioUpdate.init(row);
        },
        // 删除
        deleteCount(id) {
            this.$confirm("确认删除该主播的结算比例，删除后该主播上架的此商品也会同步下架", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                console.log(id)
            }).catch(() => this.$message.info("取消删除"))
        }
    }
};
</script>
<style lang="scss" scoped>
.mod-live__settlementRatio{
    .goodsInfo {
        font-size: 16px;
        color: #606266;
        line-height: 40px;
    }
}
</style>