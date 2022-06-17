<!-- 商品选择 -->
<template>
    <el-dialog
        title="推荐商品"
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
            <el-form-item
                label="商品名称"
                prop="productName">
                <el-input
                    placeholder="请输入"
                    style="width: 200px"
                    clearable
                    v-model="dataForm.productName"/>
            </el-form-item>
            <el-form-item
                label="商品类型"
                prop="productType">
                <el-select 
                    @visible-change="getProductType" 
                    style="width: 200px" 
                    v-model="dataForm.productType" 
                    placeholder="商品类型"
                    clearable>
                    <el-option v-for="item in productTypeOptions" :key="item.productType" :value="item.productType" :label="item.productType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="是否免费"
                prop="isFree">
                <el-select
                    placeholder="请选择"
                    style="width: 200px"
                    v-model="dataForm.isFree"
                    clearable>
                    <el-option :value="1" label="是"></el-option>
                    <el-option :value="0" label="否"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="关联商品编号"
                prop="linkedProductId">
                <el-input
                    placeholder="请输入"
                    style="width: 200px"
                    clearable
                    v-model="dataForm.linkedProductId"/>
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
                    <!-- <el-form-item>
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            :disabled="!dataListSelections.length"
                            @click="add()">批量添加</el-button>
                    </el-form-item> -->
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
                show-overflow-tooltip>
                <template slot-scope="{ row }">
                    <!-- 封面图 -->
                    <div v-if="item.prop == 'productImage'">
                        <img
                        class="frontCoverImg"
                        :src="
                            row.productImage || 'https://picsum.photos/400/300?random=1'
                        "
                        alt=""
                        />
                    </div>
                    <!-- 商品价格 -->
                    <span v-else-if="item.prop == 'oldPrice'">
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
                    <span v-else>
                        {{ row[item.prop] || "-" }}
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column
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
            </el-table-column> -->
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
            <el-button type="primary" @click="add()" size="small">确 认</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
            dataForm: { // 查询条件
                productName: "",
                productType: "",
                isFree: null,
                linkedProductId: ""
            },               
            dataList: [],               // 数据列表
            page: 1,                    // 当前页码
            limit: 10,                  // 每页数
            total: 0,                   // 总条数
            dataListLoading: false,     // 数据列表，loading状态
            dataListSelections: [],     // 数据列表，多选项
            defaultSelected: [], //默认选中的数据
            tableItem: [
                { prop: "productImage", label: "商品图片" },
                { prop: "productName", label: "商品名称" },
                { prop: "oldPrice", label: "商品价格" },
                { prop: "price", label: "销售价格" },
                { prop: "productType", label: "商品类型" },
                { prop: "isFree", label: "是否免费" },
                { prop: "linkedProductId", label: "关联产品编号" },
            ],
            productTypeOptions: [] //商品类型下拉选项
        }
    },
    computed: {
        userId() {
            return this.$store.state.user.id
        }
    },
    methods: {
        init(data) {
            this.defaultSelected = data || []
            this.dialogVisible = true
            this.query()
        },
        setCurPageSelected() {
            this.$nextTick(() => {
                if (this.defaultSelected.length) {
                    
                    let arr = []
                    this.dataList.map((row, i) => {
                        this.defaultSelected.map(item => {
                            if(row.id == item.id) {
                                arr.push(i)
                            }
                        })
                    });

                    if(arr.length) {
                        arr.map(item => {
                            this.$refs.table.toggleRowSelection(this.dataList[item], true);
                        })
                    }else {
                        this.$refs.table.clearSelection();
                    }

                } else {
                    this.$refs.table.clearSelection();
                }

            })
        },
        // 获取数据列表
        query () {
            this.dataListLoading = true
            this.$http.get("/sys/wxapp/anchorProduct/listWithAnchorIdPage", {
                params: {
                    page: this.page,
                    limit: this.limit,
                    anchorId: this.userId,
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

                this.setCurPageSelected()

            }).catch((err) => {
                this.dataListLoading = false
                this.$message.error(JSON.stringify(err.message))
            })
        },
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
    .frontCoverImg {
        max-width: 100px;
        height: 60px;
    }
</style>
