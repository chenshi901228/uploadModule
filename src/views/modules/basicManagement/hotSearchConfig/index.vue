<!-- 热门搜索配置 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__hotSearchConfig">
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
                    label="配置内容"
                    prop="value"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.value"
                        placeholder="配置内容"
                        clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="分类"
                    prop="type"
                >
                    <el-select
                        style="width: 200px" 
                        v-model="dataForm.type" 
                        placeholder="分类"
                        clearable>
                            <el-option 
                                v-for="item in typeList" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"></el-option>
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
                                @click="add()"
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
                            icon="el-icon-delete"
                            @click="deleteCount(row)">移除</el-button>
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-sort-down"
                            @click="upOrDownHandle(row, -1)">下移</el-button>
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-sort-up"
                            @click="upOrDownHandle(row, 1)">上移</el-button>
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
                getDataListURL: "/sys/hotSearchConfiguration/page", // 数据列表接口，API地址
            },
            dataForm: {
                name: "",
                title: "",
            },

            tableItem: [
                { prop: "num", label: "序号" },
                { prop: "value", label: "配置内容" },
                { prop: "type", label: "分类" },
                { prop: "clickNum", label: "点击量" },
                { prop: "createBy", label: "创建人", width: 180 },
                { prop: "updateDate", label: "更新时间", width: 150 },
            ],
            // 分类选项
            typeList: [
                { value: 0, label: "预告" },
                { value: 1, label: "直播" },
                { value: 2, label: "视频" },
                { value: 3, label: "主播" },
            ]
        };
    },
    created() {
        // this.query()
    },
    activated() {
        this.query();
    },
    methods: {
        //   新增
        add() {
            this.$router.push({ name: "basicManagement-hotSearchConfig-hotAdd" })
        },
        // 移除
        deleteCount(data) {
            this.$confirm(`确认移除配置[${data.value}]?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    this.$http.delete("/sys/hotSearchConfiguration", { data: [data.id] }).then(({data: res}) => {
                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success("移除配置成功")
                        this.query()
                    }).catch(err => this.$message.error(JSON.stringify(err)))
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        // 上移或下移
        upOrDownHandle(data, type) {
            this.$confirm(`确认${type == -1 ? "下移" : "上移"}配置[${data.value}]?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    this.$http.put(`/sys/hotSearchConfiguration/${type == -1 ? "downUpdate" : "upUpdate"}/${data.id}`).then(({data: res}) => {
                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success("修改配置成功")
                        this.query()
                    }).catch(err => this.$message.error(JSON.stringify(err)))
                })
                .catch(() => {
                    this.$message.info("已取消修改");
                });
        },

    },
};
</script>
<style lang="scss" scoped>
</style>