<!-- 协议管理 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__protocol">
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
                    label="协议名称"
                    prop="name"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.name"
                        placeholder="协议名称"
                        clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="协议标题"
                    prop="title"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.title"
                        placeholder="协议标题"
                        clearable
                    >
                    </el-input>
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
                        <!-- <el-button size="mini" plain @click="open">
                        <i
                            :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                        ></i>
                        {{ isOpen ? "收起" : "展开" }}
                        </el-button> -->
                    </el-form-item>
                </div>

                <!-- 操作按钮 -->
                <div class="headerTool-handle-btns">
                    <div class="headerTool--handle-btns-left">
                        <el-form-item>
                            <el-button
                                size="mini"
                                icon="el-icon-plus"
                                type="primary"
                                plain
                                @click="addOrEdit()"
                                >新增</el-button
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
            >
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
                    <!-- <template slot-scope="{ row }">
                    </template> -->
                </el-table-column>
                <el-table-column
                    :label="$t('handle')"
                    fixed="right"
                    header-align="center"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-edit"
                            @click="addOrEdit(row.id)">编辑</el-button>
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-delete"
                            @click="deleteCount(row)">删除</el-button>
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
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
    mixins: [mixinTableModule],
    data() {
        return {
        mixinTableModuleOptions: {
            getDataListURL: "/sys/sysConsultativeManagement/page", // 数据列表接口，API地址
            exportURL: "/sys/sysConsultativeManagement/export", // 导出接口，API地址
        },
        dataForm: {
            name: "",
            title: "",
        },

        tableItem: [
            { prop: "name", label: "协议名称" },
            { prop: "title", label: "协议标题" },
            { prop: "consultativeKey", label: "协议key" },
            { prop: "startDate", label: "有效开始日", width: 150 },
            { prop: "endDate", label: "有效截止日", width: 150 },
            { prop: "updateByName", label: "更新人", width: 150 },
            { prop: "updateDate", label: "更新时间", width: 150 },
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
        //   新增/编辑协议
        addOrEdit(id) {
            // 新增
            if(!id) return this.$router.push({ name: "basicManagement-protocol-protocolAdd" });
            // 编辑
            this.$router.push({ name: "basicManagement-protocol-protocolUpdate", query: { id } });
        },
        // 删除协议
        deleteCount(data) {
            this.$confirm(`确认删除[${data.title}]?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    this.$http.delete("/sys/sysConsultativeManagement", {data: [data.id]}).then(({data: res}) => {
                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success("删除协议成功")
                        this.query()
                    }).catch(err => this.$message.error(JSON.stringify(err)))
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        }

    },
};
</script>
<style lang="scss" scoped>
</style>