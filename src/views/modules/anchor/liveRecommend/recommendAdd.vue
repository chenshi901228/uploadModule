<!-- 直播推荐-新增 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__hotSearchConfigAdd">
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
                    label="直播主题"
                    prop="liveTheme">
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.liveTheme"
                        placeholder="直播主题"
                        clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="主播"
                    prop="anchorUser">
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm.anchorUser"
                        placeholder="主播"
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
            </el-form>
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane 
                    v-for="item in tabList" 
                    :key="item.name" 
                    :label="item.label" 
                    :name="item.name">
                        <custom-table 
                            :dataListLoading="dataListLoading"
                            :height="siteContentViewHeight - 70"
                            :page="page"
                            :limit="limit"
                            :total="total"
                            :dataList="dataList"
                            :tableItem="tableItem"
                            @pageSizeChangeHandle="pageSizeChangeHandle"
                            @pageCurrentChangeHandle="pageCurrentChangeHandle"
                            @dataListSelectionChangeHandle="dataListSelectionChangeHandle"></custom-table>
                </el-tab-pane>
            </el-tabs>
            
        </div>
    </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import CustomTable from "@/components/table/index"
export default {
    mixins: [mixinTableModule],
    components: {
        CustomTable
    },
    data() {
        return {
            dataForm: {
                liveTheme: "",
                anchorUser: ""
            }, //搜索参数
            tableItem: [], //表格item
            activeName: "live", //当前选中tab
            tabList: [
                { label: "直播列表", name: "live" },
                { label: "直播预告", name: "preview" },
            ],
            liveType: 1, //分类(0-预告，1-直播)
        };
    },
    created() {
        // this.query()
    },
    activated() {
        this.calcCurrentTab()
        this.query();
    },
    methods: {
        // 获取当前选中tab的搜索栏和表格配置
        calcCurrentTab() {
            switch(this.activeName) {
                case "live": 
                    // 请求地址
                    this.mixinTableModuleOptions.getDataListURL = "/sys/liveList/selectPageForLiveRecommend"
                    // table选项
                    this.tableItem = [
                        { prop: "frontCoverUrl", width: 140, label: "直播宣传图", type: "image", style: { width: "100px", height: "60px" } },
                        { prop: "liveTheme", label: "直播主题" },
                        { prop: "anchorUser", label: "主播" },
                        { prop: "anchorTel", label: "手机号码" },
                        { prop: "startDate", label: "开播时间", width: 180  },
                        { prop: "liveState", label: "直播状态", type:"string", render: () => "直播中" },
                        { prop: "createDate", label: "创建时间", width: 180 },
                        { action: true, actionList: [
                            {
                                icon: "el-icon-plus",
                                name: "推荐",
                                handle: data => this.add(data)
                            }
                        ] }
                    ]
                    // 分类
                    this.liveType = 1
                    break;
                case "preview": 
                    this.mixinTableModuleOptions.getDataListURL = "/sys/livePreview/selectLiveListPageForLiveRecommend"
                    this.tableItem = [
                        { prop: "frontCoverUrl", width: 140, label: "直播宣传图", type: "image", style: { width: "100px", height: "60px" } },
                        { prop: "liveTheme", label: "直播主题" },
                        { prop: "anchorUser", label: "主播" },
                        { prop: "anchorTel", label: "手机号码" },
                        { prop: "startDateOther", label: "预计开播时间", width: 180  },
                        { prop: "liveState", label: "直播状态", type:"string", render: () => "未开播" },
                        { prop: "createDate", label: "创建时间", width: 180 },
                        { action: true, actionList: [
                            {
                                icon: "el-icon-plus",
                                name: "推荐",
                                handle: data => this.add(data)
                            }
                        ] }
                    ]
                    this.liveType = 0
                    break;
            }
        },
        // 推荐
        add(data) {
            this.$confirm(`确认推荐?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    let o = {
                        id: data.id,
                        anchorTel: data.anchorTel,
                        anchorUser: data.anchorUser,
                        createDate: data.createDate,
                        frontCoverUrl: data.frontCoverUrl,
                        liveTheme: data.liveTheme,
                        startDate: this.liveType == 1 ? data.startDate : data.startDateOther, //直播预告字段区分
                        liveType: this.liveType
                    }
                    this.$http.post("/sys/liveList/saveLiveRecommend", o).then(({data:res}) => {
                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success("推荐成功")
                        this.query()
                    }).catch(err => this.$message.error(JSON.stringify(err.message)))
                })
                .catch(() => {
                    this.$message.info("已取消推荐");
                });
        },
        // tab切换
        handleClick() {
            this.dataList = []
            this.page = 1
            this.limit = 10
            this.total = 0
            this.dataListSelections = []
            this.$refs.dataForm.resetFields()
            this.calcCurrentTab()
            this.getDataList()
        }

    },
};
</script>
<style lang="scss" scoped>
</style>