<!-- 商品邮寄 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__goodsMail">
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
                    label="收件人"
                    prop="recipient"
                    v-show="isOpen || formItemCount >= 1"
                >
                    <el-input
                        maxlength="10"
                        style="width: 200px"
                        v-model.trim="dataForm.recipient"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="收件人手机"
                    prop="recipientNumber"
                    v-show="isOpen || formItemCount >= 2"
                >
                    <el-input
                        style="width: 200px"
                        maxlength="11"
                        v-model.trim="dataForm.recipientNumber"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="物流状态"
                    prop="logisticsStatus"
                    v-show="isOpen || formItemCount >= 3"
                >
                    <el-select
                        clearable
                        v-model="dataForm.logisticsStatus"
                        placeholder="请选择"
                        style="width: 200px"
                    >
                        <el-option label="待发货" :value="0"></el-option>
                        <el-option label="待收货" :value="1"></el-option>
                        <el-option label="已收货" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="快递单号"
                    prop="courierNumber"
                    v-show="isOpen || formItemCount >= 4"
                >
                    <el-input
                        maxlength="30"
                        style="width: 200px"
                        v-model.trim="dataForm.courierNumber"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="关联订单编号"
                    prop="userProductId"
                    v-show="isOpen || formItemCount >= 5"
                >
                    <el-input
                        maxlength="30"
                        style="width: 200px"
                        v-model.trim="dataForm.userProductId"
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
                            <!-- <el-button 
                            type="warning"
                            plain
                            icon="el-icon-download" 
                            size="mini"
                            @click="exportHandle">{{ $t("export") }}</el-button> -->
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
                    :width="item.width || 120"
                    :show-overflow-tooltip="item.prop == 'productName' ? false : true"
                >
                    <template slot-scope="{ row }">
                        <span v-if="item.prop == 'address'">
                            {{row["provinceName"]}}/{{row["cityName"]}}/{{row["countyName"]}}
                        </span>
                        <span v-else-if="item.prop == 'logisticsStatus'">
                            <el-tag :type="row.logisticsStatus == 0 ? 'success' : row.logisticsStatus == 1 ? 'warning' : ''">
                                {{row.logisticsStatus == 0 ? "待发货" : row.logisticsStatus == 1 ? "待收货" : "已收货"}}
                            </el-tag>
                        </span>
                        <span v-else>
                            {{row[item.prop]}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('handle')"
                    fixed="right"
                    header-align="center"
                    align="center"
                    width="180"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            v-if="row.logisticsStatus == 0"
                            type="text"
                            size="small"
                            icon="el-icon-edit"
                            @click="edit(row)">编辑</el-button>
                        <el-button
                            v-if="row.logisticsStatus == 0"
                            type="text"
                            size="small"
                            icon="el-icon-position"
                            @click="mailGoods(row)">邮寄</el-button>
                        <el-button
                            v-if="row.logisticsStatus != 0"
                            type="text"
                            size="small"
                            icon="el-icon-shopping-cart-full"
                            @click="mailInfo(row, 1)">物流信息</el-button>
                        <el-button
                            v-if="row.logisticsStatus != 0"
                            type="text"
                            size="small"
                            icon="el-icon-document"
                            @click="mailInfo(row, 2)">电子面单</el-button>
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


            <!-- 邮寄 -->
            <logistics-company-select ref="mailGoods" @refreshDataList="getDataList"></logistics-company-select>

            <!-- 编辑信息 -->
            <update ref="update" @refreshDataList="getDataList"></update>

            <!-- 物流/电子面单 -->
            <mail-info ref="mailInfo"></mail-info>

        </div>
    </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import LogisticsCompanySelect from "./logisticsCompanySelect.vue"
import MailInfo from "./goodsMailInfo.vue"
import Update from "./update.vue"
export default {
    mixins: [mixinTableModule],
    components: {
        LogisticsCompanySelect,
        Update,
        MailInfo
    },
    data() {
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/weixinuserproductlogistics/page", // 数据列表接口，API地址
                exportURL: "/sys/weixinuserproductlogistics/export", // 导出接口，API地址
            },
            dataForm: {
                recipient: "",
                recipientNumber: "",
                logisticsStatus: null,
                courierNumber: "",
                userProductId: ""
            },

            tableItem: [
                { prop: "productName", label: "商品名称" },
                { prop: "num", label: "商品数量" },
                { prop: "recipient", label: "收件人" },
                { prop: "recipientNumber", label: "收件人手机号码", width: 150 },
                { prop: "address", label: "省市区", width: 180 },
                { prop: "detailInfo", label: "详细地址", width: 180 },
                { prop: "logisticsStatus", label: "物流状态"},
                { prop: "courierNumber", label: "快递单号", width: 180 },
                { prop: "userProductId", label: "订单编号", width: 180 },
                { prop: "payDate", label: "支付完成时间", width: 180 },
            ],
        };
    },
    created() {
        // this.query()
    },
    activated() {
        this.query();
    },
    methods: {
        // 编辑
        edit(row) {
            this.$refs.update.init(row)
        },
        // 邮寄
        mailGoods(row) {
            this.$refs.mailGoods.init(row)
        },
        // 1-物流信息/2-电子面单
        mailInfo(row, type) {
            this.$refs.mailInfo.init(row, type)
        },

    },
};
</script>
<style lang="scss" scoped>
</style>