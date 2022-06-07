<!-- 热门搜索配置-新增 -->

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
                    :label="item.label"
                    :prop="item.prop"
                    v-for="item in dataFormItemList"
                    :key="item.prop"
                >
                    <el-input
                        style="width: 200px"
                        v-model.trim="dataForm[item.prop]"
                        :placeholder="item.label"
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
                            :tableItem="tableItem"></custom-table>
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
            dataForm: {}, //搜索参数
            dataFormItemList: [], //搜索栏配置
            tableItem: [], //表格item
            activeName: "live", //当前选中tab
            tabList: [
                { label: "直播", name: "live" },
                { label: "预约", name: "preview" },
                { label: "视频", name: "video" },
                { label: "主播", name: "anchor" },
            ],
            type: 1, //分类(0-预告，1-直播，2-视频，3-主播)
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
                    this.mixinTableModuleOptions.getDataListURL = "/sys/hotSearchConfiguration/selectLiveListPageForHotSearchConfiguration"
                    this.tableItem = [
                        { prop: "frontCoverUrl", width: 140, label: "直播宣传图", type: "image", style: { width: "100px", height: "60px" } },
                        { prop: "liveTheme", label: "直播主题" },
                        { prop: "anchorUser", label: "主播" },
                        { prop: "anchorTel", label: "手机号码" },
                        { prop: "startDate", label: "开播时间", width: 180  },
                        { prop: "createDate", label: "创建时间", width: 180 },
                        { action: true, actionList: [
                            {
                                icon: "el-icon-plus",
                                name: "新增",
                                handle: data => this.add(data)
                            }
                        ] }
                    ]
                    this.dataForm = {
                        liveTheme: "",
                        anchorUser: "",
                        anchorTel: ""
                    }
                    this.dataFormItemList = [
                        { label: "直播主题", prop: "liveTheme"},
                        { label: "主播", prop: "anchorUser"},
                        { label: "手机号码", prop: "anchorTel"},
                    ]
                    this.type = 1
                    break;
                case "preview": 
                    this.mixinTableModuleOptions.getDataListURL = "/sys/hotSearchConfiguration/selectLivePreviewPageForHotSearchConfiguration"
                    this.tableItem = [
                        { prop: "frontCoverUrl", width: 140, label: "直播宣传图", type: "image", style: { width: "100px", height: "60px" } },
                        { prop: "liveTheme", label: "直播主题" },
                        { prop: "anchorUser", label: "主播" },
                        { prop: "anchorTel", label: "手机号码" },
                        { prop: "startDate", label: "预计开播时间", width: 180  },
                        { prop: "createDate", label: "创建时间", width: 180 },
                        { action: true, actionList: [
                            {
                                icon: "el-icon-plus",
                                name: "新增",
                                handle: data => this.add(data)
                            }
                        ] }
                    ]
                    this.dataForm = {
                        liveTheme: "",
                        anchorUser: "",
                        anchorTel: ""
                    }
                    this.dataFormItemList = [
                        { label: "直播主题", prop: "liveTheme"},
                        { label: "主播", prop: "anchorUser"},
                        { label: "手机号码", prop: "anchorTel"},
                    ]
                    this.type = 0
                    break;
                case "video": 
                    this.mixinTableModuleOptions.getDataListURL = "/sys/hotSearchConfiguration/selectLivePlaybackPageForHotSearchConfiguration"
                    this.tableItem = [
                        { prop: "frontCoverUrl", width: 140, label: "视频宣传图", type: "image", style: { width: "100px", height: "60px" } },
                        { prop: "liveTheme", label: "视频主题" },
                        { prop: "anchorUser", label: "主播" },
                        { prop: "anchorTel", label: "手机号码" },
                        { prop: "createDate", label: "创建时间", width: 180 },
                        { action: true, actionList: [
                            {
                                icon: "el-icon-plus",
                                name: "新增",
                                handle: data => this.add(data)
                            }
                        ] }
                    ]
                    this.dataForm = {
                        liveTheme: "",
                        anchorUser: "",
                        anchorTel: ""
                    }
                    this.dataFormItemList = [
                        { label: "视频主题", prop: "liveTheme"},
                        { label: "主播", prop: "anchorUser"},
                        { label: "手机号码", prop: "anchorTel"},
                    ]
                    this.type = 2
                    break;
                case "anchor": 
                    this.mixinTableModuleOptions.getDataListURL = "/sys/hotSearchConfiguration/selectAnchorInfoPageForHotSearchConfiguration"
                    this.tableItem = [
                        { prop: "avatarUrl", width: 120, label: "主播头像", type: "image", style: { width: "60px", height: "60px", borderRadius: "50%" } },
                        { prop: "username", label: "主播昵称" },
                        { prop: "realName", label: "真实姓名" },
                        { prop: "phone", label: "手机号码" },
                        { prop: "createDate", label: "创建时间", width: 180 },
                        { action: true, actionList: [
                            {
                                icon: "el-icon-plus",
                                name: "新增",
                                handle: data => this.add(data)
                            }
                        ] }
                    ]
                    this.dataForm = {
                        username: "",
                        phone: "",
                    }
                    this.dataFormItemList = [
                        { label: "主播", prop: "username"},
                        { label: "手机号码", prop: "phone"},
                    ]
                    this.type = 3
                    break;
            }
        },
        //   新增配置
        add(data) {
            this.$confirm(`确认新增配置?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    let o = {
                        businessId: data.id,
                        type: this.type
                    }
                    if(this.activeName == "anchor") {
                        o.value = data.username
                    }else {
                        o.value = data.liveTheme
                    }
                    this.$http.post("/sys/hotSearchConfiguration", o).then(({data:res}) => {
                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success("新增配置成功")
                        this.query()
                    }).catch(err => this.$message.error(JSON.stringify(err)))
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        // tab切换
        handleClick() {
            this.dataList = []
            this.calcCurrentTab()
            this.getDataList()
        }

    },
};
</script>
<style lang="scss" scoped>
</style>