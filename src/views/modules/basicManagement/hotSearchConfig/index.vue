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
                @cell-dblclick="cellDblclick"
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
                    <template slot-scope="{ row }">
                        <el-input 
                            ref="editRef"
                            size="small"
                            style="width:100px"
                            @blur="editHandle"
                            v-if="editId == row.id && item.prop == 'clickNum'" 
                            v-model="editData.clickNum"
                            clearable>
                        </el-input>
                        <!-- <span v-else-if="item.prop == 'clickNum'">
                            {{row[item.prop]}}<i style="margin-left: 10px" class="el-icon-edit"></i>
                        </span> -->
                        <span v-else-if="item.prop == 'type'">
                            {{row[item.prop] == 0 ? "预告" : row[item.prop] == 1 ? "直播" : row[item.prop] == 2 ? "视频" : "主播"}}
                        </span>
                        <span v-else>{{row[item.prop]}}</span>
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
                            type="text"
                            size="small"
                            icon="el-icon-delete"
                            @click="deleteCount(row)">移除</el-button>
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-sort-down"
                            v-if="row.num != dataList.length"
                            @click="upOrDownHandle(row, -1)">下移</el-button>
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-sort-up"
                            v-if="row.num != '1'"
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
            editId: "",
            editData: null,

            tableItem: [
                { prop: "num", label: "序号" },
                { prop: "value", label: "配置内容" },
                { prop: "type", label: "分类" },
                { prop: "clickNum", label: "热度" },
                { prop: "factClickNum", label: "点击量" },
                { prop: "updateByName", label: "创建人", width: 180 },
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
    destroyed() {
        this.clearEdit()
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
                    }).catch(err => this.$message.error(JSON.stringify(err.message)))
                })
                .catch(() => {
                    this.$message.info("已取消操作");
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
                    }).catch(err => this.$message.error(JSON.stringify(err.message)))
                })
                .catch(() => {
                    this.$message.info("已取消修改");
                });
        },
        // 单元格双击
        cellDblclick(row, column, cell, event) {
            if(column.property == "clickNum") { //双击点击量
                //if有编辑中的保存 
                if(this.editId) return this.editHandle()

                this.editId = row.id 
                this.editData = JSON.parse(JSON.stringify(row))
                this.$nextTick(() => { //获取输入框焦点
                    this.$refs.editRef[0].focus()
                })
            }
        },
        // 保存修改
        editHandle() {
            let t = this.editData.clickNum
            if(!/^[0-9]\d*$/.test(t)) { //如果输入的格式不正确
                this.clearEdit()
                return this.$message.error("点击量为正整数，请重新输入")
            }
            this.editData.clickNum = parseInt(t) //去掉前面的0
            this.$confirm("是否保存修改", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false,

            }).then(() => {
                let o = {
                    id: this.editData.id,
                    clickNum: this.editData.clickNum
                }
                this.$http.put("/sys/hotSearchConfiguration/clickNumUpdate", o).then(({data:res}) => {
                    if(res.code != 0) {
                        this.$refs.editRef[0].focus()
                        return this.$message.error(res.msg)
                    }
                    this.$message.success("修改成功")
                    this.query()
                    setTimeout(() => this.clearEdit(), 500)
                    
                }).catch(err => {
                    this.$refs.editRef[0].focus()
                    this.$message.error(JSON.stringify(err.message))
                })
            }).catch(() => this.clearEdit())
        },
        // 清空编辑
        clearEdit() {
            this.editId = null
            this.editData = null
        }

    },
};
</script>
<style lang="scss" scoped>
</style>