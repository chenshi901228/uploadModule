<!-- 主播选择 -->
<template>
    <el-dialog
        title="推荐主播"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false" 
        @close="close"
        :close-on-press-escape="false"
        width="80%"
        top="20px">
        <el-form
            :inline="true"
            :model="dataForm"
            @keyup.enter.native="getDataList"
            size="small"
            ref="dataForm"
            label-width="100px">
            <el-form-item label="主播昵称" prop="username">
                <el-input
                    style="width: 200px"
                    v-model="dataForm.username"
                    placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input
                    style="width: 200px"
                    v-model="dataForm.phone"
                    placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="getDataList"
                    >查询</el-button>
                <el-button 
                    icon="el-icon-refresh" 
                    size="mini" 
                    @click="reset">重置</el-button>
            </el-form-item>

            <!-- 操作按钮 -->
            <div class="headerTool-handle-btns">
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
            </div>
        </el-form>
        <el-table
            v-loading="dataListLoading"
            :data="dataList"
            ref="table"
            @selection-change="dataListSelectionChangeHandle"
            style="width: 100%">
            <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
                fixed="left">
            </el-table-column>

            <el-table-column
                header-align="center"
                align="center"
                v-for="item in tableItem"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width || 120"
                show-overflow-tooltip>
                <template slot-scope="{ row }">
                    <!-- 封面图 -->
                    <div v-if="item.prop == 'avatarUrl'">
                        <img class="avatarImg"
                            :src="row.avatarUrl || require('@/assets/img/default_cover.jpg')"
                            alt=""/>
                    </div>
                    <span v-else-if="item.prop == 'delFlg'">{{ row.delFlg === 0 ? "上架" : "下架" }}</span>
                    <span v-else>
                        {{ row[item.prop] || "-" }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('handle')"
                fixed="right"
                header-align="center"
                align="center">
                <template slot-scope="{ row }">
                    <el-button
                        type="text"
                        size="small"
                        icon="el-icon-plus"
                        @click="add(row)">添加</el-button>
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
            @current-change="pageCurrentChangeHandle">
        </el-pagination>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close" size="small">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
            dataForm: { // 查询条件
                username: "",
                phone: ""
            },               
            dataList: [],               // 数据列表
            page: 1,                    // 当前页码
            limit: 10,                  // 每页数
            total: 0,                   // 总条数
            dataListLoading: false,     // 数据列表，loading状态
            dataListSelections: [],     // 数据列表，多选项
            tableItem: [
                { prop: "avatarUrl", label: "主播头像" },
                { prop: "username", label: "主播昵称" },
                { prop: "phone", label: "手机号码" },
                { prop: "updateDate", label: "更新时间", width: 150 },
                { prop: "delFlg", label: "上架状态" },
            ],
        }
    },
    methods: {
        init() {
            this.dialogVisible = true
            this.query()
        },
        // 获取数据列表
        query () {
            this.dataListLoading = true
            this.$http.get("/sys/sysRecommendedAnchor/pageForAddLivePreview", {
                params: {
                    page: this.page,
                    limit: this.limit,
                    ...this.$httpParams(this.dataForm)
                }
            }).then(({ data: res }) => {
                this.dataListLoading = false
                if (res.code !== 0) {
                    this.dataList = []
                    this.total = 0
                    return this.$message.error(res.msg)
                }
                this.dataList = res.data.list
                this.total = res.data.total
            }).catch((err) => {
                this.dataListLoading = false
                this.$message.error(JSON.stringify(err.message))
            })
        },
        // 选择添加
        add(row) {
            if(row) {
                this.$emit("add", [row])
            }else {
                this.$emit("add", this.dataListSelections)
            }
        },
        // 多选
        dataListSelectionChangeHandle (val) {
            this.dataListSelections = val
        },
        // 分页, 每页条数
        pageSizeChangeHandle (val) {
            this.page = 1
            this.limit = val
            this.query()
        },
        // 分页, 当前页
        pageCurrentChangeHandle (val) {
            this.page = val
            this.query()
        },
        getDataList: function () {
            this.page = 1
            this.query()
        },
        // 重置搜索条件
        reset() {
            this.$refs.dataForm.resetFields()
            this.getDataList()
        },

        // 关闭
        close() {
            this.$refs.dataForm.resetFields()
            this.$refs.table.clearSelection()
            this.dataListSelections = []
            this.dialogVisible = false
        },
    }
}
</script>
<style lang="scss" scoped>
    .avatarImg {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
</style>
