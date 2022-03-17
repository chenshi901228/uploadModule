
<!-- 直播管理-直播列表 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__liveList">
            <el-form
                class="headerTool"
                :inline="true"
                :model="dataForm"
                ref="dataForm"
                @keyup.enter.native="getDataList"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="直播主题"
                            prop="liveTheme"
                        >
                            <el-input
                                size="small"
                                v-model.trim="dataForm.liveTheme"
                                placeholder="请输入选择"
                                clearable
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            label="主播"
                            prop="anchorUser"
                        >
                            <el-input
                                size="small"
                                v-model.trim="dataForm.anchorUser"
                                placeholder="请输入姓名或手机号码"
                                clearable
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float:right; padding-right:10px">
                            <el-button size="small" type="info">{{ $t("export") }}</el-button>
                            <el-button size="small" type="primary" @click="getDataList">{{ $t("query") }}</el-button>
                            <el-button size="small" @click="resetDataForm">{{ $t("reset") }}</el-button>
                            <el-button 
                                size="small" 
                                type="primary"
                                @click="open"
                            >
                                {{ isOpen ? "收起" : "展开"}}<i style="margin-left:10px" :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-if="isOpen">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item
                                label="开播时间"
                                prop="startDate"
                            >
                                <el-date-picker
                                    size="small"
                                    v-model="dataForm.startDate"
                                    type="datetime"
                                    format="yyyy-MM-dd hh:mm"
                                    value-format="yyyy-MM-dd hh:mm"
                                    placeholder="请选择开播时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                label="结束时间"
                                prop="endDate"
                            >
                                <el-date-picker
                                    size="small"
                                    v-model="dataForm.endDate"
                                    type="datetime"
                                    format="yyyy-MM-dd hh:mm"
                                    value-format="yyyy-MM-dd hh:mm"
                                    placeholder="请选择结束时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <!-- <el-form-item
                            label="投放人群"
                            prop="endDate"
                        >
                            <el-select v-model="value" placeholder="请选择投放人群">
                                <el-option
                                    label="群组1"
                                    value="群组1">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-col :span="6">
                            <el-form-item
                                label="是否录制"
                                prop="transcribeFlg"
                            >
                                <el-select size="small" v-model="dataForm.transcribeFlg" placeholder="请选择">
                                    <el-option label="是" :value="1"></el-option>
                                    <el-option label="否" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-form-item
                            label="关联直播"
                            prop="transcribeFlg"
                        >
                            <el-input
                                size="small"
                                v-model.trim="dataForm.liveTheme"
                                placeholder="请输入关联直播"
                                clearable
                            >
                            </el-input>
                        </el-form-item> -->
                        <el-col :span="6">
                            <el-form-item
                                label="直播状态"
                                prop="liveState"
                            >
                                <el-select size="small" v-model="dataForm.liveState" placeholder="请选择">
                                    <el-option label="直播中" :value="1"></el-option>
                                    <el-option label="已下播" :value="0"></el-option>
                                    <el-option label="已禁播" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                label="显示状态"
                                prop="showState"
                            >
                                <el-select size="small" v-model="dataForm.showState" placeholder="请选择">
                                    <el-option label="显示" :value="1"></el-option>
                                    <el-option label="隐藏" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
            <el-table
                v-loading="dataListLoading"
                :data="dataList"
                border
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
                    show-overflow-tooltip
                    :sortable="['transcribeFlg', 'liveState', 'showState'].includes(item.prop)"
                >
                    <template slot-scope="{ row }">
                        <div v-if="item.prop == 'frontCoverUrl'">
                            <img class="frontCoverImg" :src="row.frontCoverUrl || 'https://picsum.photos/400/300?random=1'" alt="">
                        </div>
                        <span v-else-if="item.prop == 'showMode'">
                            {{row.showMode ? "横屏" : "竖屏"}}
                        </span>
                        <span v-else-if="item.prop == 'transcribeFlg'">
                            {{row.transcribeFlg ? "是" : "否"}}
                        </span>
                        <span v-else-if="item.prop == 'liveState'">
                            {{row.liveState == 1 ? "直播中" : row.liveState == 0 ? "已下播" : "已禁播"}}
                        </span>
                        <span v-else-if="item.prop == 'showState'">
                            {{row.liveState ? "显示" : "隐藏"}}
                        </span>
                        <span v-else-if="item.prop == 'livingRoomId'" style="color: #409EFF; text-decoration: underline;">
                            {{row[item.prop]}}
                        </span>
                        <span v-else>
                            {{ row[item.prop] || "-" }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
                    <template slot-scope="{ row }">
                        <el-button v-if="row.liveState == 1" type="text" size="small" @click="banLiveHandle(row.id)">禁播</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
            >
            </el-pagination>

            <!-- 禁播备注弹框 -->
            <el-dialog title="禁播" :visible.sync="banLiveVisible" width="30%">
                <div class="banLiveDialog" style="display:flex;">
                    <p style="width:50px; margin:0">备注<span style="color:red">*</span></p>
                    <el-input
                        type="textarea"
                        :rows="6"
                        placeholder="请输入禁播原因"
                        v-model="banLiveRemark">
                    </el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="banLiveVisible = false">取 消</el-button>
                    <el-button size="small" :disabled="confirmLoading" :loading="confirmLoading" type="primary" @click="banLiveConfirm">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </el-card>
</template>

<script>
import mixinTableHeight from '@/mixins/tableHeight'
export default {
    mixins: [ mixinTableHeight ],
    components: {},     
    data() {
        return {
            dataListLoading: false, // 数据列表，loading状态
            dataForm: {
                liveTheme: "",
                anchorUser: "",
                beginDate: "",
                endDate: "",
                transcribeFlg: null,
                liveState: null,
                showState: null
            },
            page: 1, // 当前页码
            limit: 10, // 每页数
            total: 0, // 总条数
            dataList: [], // 数据列表
            dataListSelections: [], // 数据列表，多选项

            tableItem: [
                { prop: "frontCoverUrl", label: "封面图" },
                { prop: "liveBroadcastWay", label: "推流端" },
                { prop: "showMode", label: "显示方式" },
                { prop: "liveTheme", label: "直播主题" },
                { prop: "anchorUser", label: "主播" },
                { prop: "anchorTel", label: "手机号码" },
                { prop: "startDate", label: "开播时间", width: 180 },
                { prop: "endDate", label: "结束时间", width: 180 },
                { prop: "liveTime", label: "直播时长（分）" },
                // { prop: "cumulativeNum", label: "投放人群" },
                { prop: "audienceNum", label: "观众总数" },
                { prop: "maxOnlineNum", label: "最高同时在线" },
                { prop: "giveLikeNum", label: "点赞次数" },
                { prop: "interactionNum", label: "互动次数" },
                { prop: "shareNum", label: "分享次数" },
                { prop: "addUserNum", label: "新增用户" },
                { prop: "transcribeFlg", label: "是否录制" },
                { prop: "liveState", label: "直播状态" },
                { prop: "showState", label: "显示状态" },
                { prop: "livingRoomId", label: "直播间ID", width: 180 },
                { prop: "remark", label: "备注" },
                { prop: "createDate", label: "创建时间", width: 180 },
            ],
            banLiveVisible: false, //禁播备注弹框
            banLiveRemark: "", //禁播备注
            banLiveId: null, //禁播ID
            confirmLoading: false, //弹框确认loading
        };
    },
    created () {
        // this.query()
    },
    activated () {
        this.query()
    },
    methods: {
        query() {
            this.dataListLoading = true;
            this.$http.get("/sys/liveList/page", {
                params: {
                    page: this.page,
                    limit: this.limit,
                    ...this.$httpParams(this.dataForm),
                },
            }).then(({ data: res }) => {
                this.dataListLoading = false;
                if (res.code !== 0) {
                    this.dataList = [];
                    this.total = 0;
                    return this.$message.error(res.msg);
                }
                this.dataList = res.data.list;
                this.total = res.data.total;
            }).catch((err) => {
                this.dataListLoading = false;
                throw err
            });
        },

        getDataList() {
            this.page = 1
            this.query()
        },

        // 禁播
        banLiveHandle(id) {
            if(!id) return
            this.banLiveRemark = ""
            this.banLiveId = id
            this.banLiveVisible = true
        },
        // 确认禁播
        banLiveConfirm() {
            if(!this.banLiveRemark) return this.$message.error("请输入禁播原因");
            this.confirmLoading = true
            this.$http.put("/sys/liveList/stopLive", { 
                id: this.banLiveId, 
                remark: this.banLiveRemark 
            }).then(({ data: res }) => {
                this.confirmLoading = false
                if(res.code == 0){
                    this.$message.success("禁播成功");
                    this.banLiveVisible = false
                    this.query()
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err => {
                this.confirmLoading = false
                throw err
            })
        },

        
        resetDataForm() {
            this.$refs.dataForm.resetFields()
            this.getDataList()
        },
        // 分页, 每页条数
        pageSizeChangeHandle(val) {
            this.page = 1
            this.limit = val
            this.query()
        },
        // 分页, 当前页
        pageCurrentChangeHandle(val) {
            this.page = val
            this.query()
        },
        // 多选
        dataListSelectionChangeHandle (val) {
            console.log(val)
            this.dataListSelections = val
        },

    },
};
</script>
<style lang="scss" scoped>
    .mod-live__liveList{
        .frontCoverImg{
            width: 100%;
            height: 60px;
        }
    }
</style>