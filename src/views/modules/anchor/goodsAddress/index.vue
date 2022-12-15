<!-- 商品收货地址收集 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__goodsAddress">
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
                    label="商品类型"
                    prop="productType"
                    v-show="isOpen || formItemCount >= 1"
                >
                    <el-select 
                    @visible-change="getProductType" 
                    style="width: 200px" 
                    v-model="dataForm.productType" 
                    placeholder="请选择"
                    clearable>
                        <el-option v-for="item in productTypeOptions" :key="item.productType" :value="item.productType" :label="item.productType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="商品名称"
                    prop="productName"
                    v-show="isOpen || formItemCount >= 2"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.productName"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="收件人"
                    prop="userName"
                    v-show="isOpen || formItemCount >= 3"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.userName"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="收件人手机号"
                    prop="telNumber"
                    v-show="isOpen || formItemCount >= 4"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.telNumber"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="关联订单编号"
                    prop="id"
                    v-show="isOpen || formItemCount >= 5"
                >
                    <el-input
                        maxlength="30"
                        style="width: 200px"
                        v-model.trim="dataForm.id"
                        placeholder="请输入"
                        clearable></el-input>
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
                            type="warning"
                            plain
                            icon="el-icon-download" 
                            size="mini"
                            @click="exportHandle">{{ $t("export") }}</el-button>
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
                    :width="item.width || ''"
                    :show-overflow-tooltip="item.prop == 'productName' ? false : true"
                >
                    <template slot-scope="{ row }">
                        <span v-if="item.prop == 'address'">
                            {{row["provinceName"]}}/{{row["cityName"]}}/{{row["countyName"]}}
                        </span>
                        <span v-else>
                            {{row[item.prop] || "-"}}
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
                            @click="edit(row)">编辑</el-button>
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

            <!-- 编辑信息 -->
            <update ref="update" @refreshDataList="getDataList"></update>

        </div>
    </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import Update from "./update.vue"
export default {
    mixins: [mixinTableModule],
    components: {
        Update,
    },
    data() {
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/management/user/product/collectReceivingAddressPage", // 数据列表接口，API地址
                exportURL: "/sys/management/user/product/collectReceivingAddressExport", // 导出接口，API地址
            },
            dataForm: {
                productType: "",
                productName: "",
                userName: "",
                telNumber: "",
                id: ""
            },

            tableItem: [
                { prop: "productName", label: "商品名称" },
                { prop: "productType", label: "商品类型" },
                { prop: "userName", label: "收件人" },
                { prop: "telNumber", label: "收件人手机号码", width: 150 },
                { prop: "address", label: "省市区", width: 180 },
                { prop: "detailInfo", label: "详细地址", width: 180 },
                { prop: "id", label: "订单编号", width: 180 },
            ],
            productTypeOptions: [] //商品类型下拉选项
        };
    },
    activated() {
        this.query();
    },
    methods: {
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

        // 编辑
        edit(row) {
            this.$refs.update.init(row)
        },

    },
};
</script>
<style lang="scss" scoped>
</style>