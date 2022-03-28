
<!-- 直播管理-直播回放 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__livePlayBack">
            <el-form
                class="headerTool"
                :inline="true"
                :model="dataForm"
                ref="dataForm"
                @keyup.enter.native="getDataList"
            >
                <el-row>
                    <el-col :span="6">
                        <el-form-item
                            label="回放主题"
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
                    </el-col>
                    <el-col :span="6">
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
                            <el-button size="small" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
                            <el-button size="small" type="primary" @click="exportHandle">{{ $t("export") }}</el-button>
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
                                label="视频显示"
                                prop="showMode"
                            >
                                <el-select clearable size="small" v-model="dataForm.showMode" placeholder="请选择">
                                    <el-option label="横屏" :value="1"></el-option>
                                    <el-option label="竖屏" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                label="回放状态"
                                prop="liveState"
                            >
                                <el-select clearable size="small" v-model="dataForm.liveState" placeholder="请选择">
                                    <el-option label="可回放" :value="1"></el-option>
                                    <el-option label="已删除" :value="0"></el-option>
                                    <el-option label="生成中" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                label="显示状态"
                                prop="showState"
                            >
                                <el-select clearable size="small" v-model="dataForm.showState" placeholder="请选择">
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
                >
                    <template slot-scope="{ row }">
                        <!-- 封面图 -->
                        <div v-if="item.prop == 'frontCoverUrl'">
                            <img class="frontCoverImg" :src="row.frontCoverUrl || 'https://picsum.photos/400/300?random=1'" alt="">
                        </div>
                        <!-- 视频显示 -->
                        <span v-else-if="item.prop == 'showMode'">
                            {{row.showMode ? "横屏" : "竖屏"}}
                        </span>
                        <!-- 回放状态 -->
                        <span v-else-if="item.prop == 'liveState'">
                            {{row.liveState == 1 ? "可回放" : row.liveState == 0 ? "已删除" : "生成中"}}
                        </span>
                        <!-- 显示状态 -->
                        <span v-else-if="item.prop == 'showState'">
                            {{row.showState ? "显示" : "隐藏"}}
                        </span>
                        <!-- 直播间ID -->
                        <span v-else-if="item.prop == 'livingRoomId'" style="color: #409EFF; text-decoration: underline;">
                            {{row[item.prop]}}
                        </span>
                        <!-- 视频大小 -->
                        <span v-else-if="item.prop == 'videoSize'">
                            {{ sizeTostr(row[item.prop]) }}
                        </span>
                        <!-- 投放人群 -->
                        <span v-else-if="item.prop == 'dynamicGroupName'">
                            {{ row.dynamicGroupName || '-' }}  
                        </span>
                        <span v-else-if="item.prop == 'liveDuration'">
                            {{ getLiveDuration(row.relationLiveUrl) }}  
                        </span>
                        <span v-else>
                            {{ row[item.prop] || "-" }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
                    <template slot-scope="{ row }">
                        <el-dropdown v-if="row.liveState != 0" trigger="click" @command="actionHandle" size="small">
                            <span style="cursor: pointer;color: #409EFF;">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{action: '1', data: row}" v-if="row.liveState == 1" icon="el-icon-download">下载视频</el-dropdown-item>
                                <el-dropdown-item :command="{action: '2', data: row}" v-if="row.liveState == 1" icon="el-icon-document">评论详情</el-dropdown-item>
                                <el-dropdown-item :command="{action: '3', data: row}" v-if="row.liveState != 0" icon="el-icon-delete">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-popconfirm
                            :title="'确定' + (row.showState ? '隐藏' : '显示') + '？'"
                            @confirm="showOrHide(row)"
                        >
                            <el-button slot="reference" style="margin-left:10px" type="text" v-if="row.liveState == 1">{{ row.showState ? "隐藏" : "显示" }}</el-button>
                        </el-popconfirm>
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
            
            <!-- 备注弹框 -->
            <remark-modal ref="remarkModal" @confirm="confirmHandle" title="删除"></remark-modal>


            <!-- 新增 -->
            <add-or-update ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
    </el-card>
</template>

<script>
import mixinTableModule from '@/mixins/table-module'
import { sizeTostr, downloadFile } from "@/utils/index"
import RemarkModal from "@/components/common/remarkDialog"
import AddOrUpdate from "./livePlayBack-add-or-update.vue"
export default {
    mixins: [ mixinTableModule ],
    components: {
        RemarkModal,
        AddOrUpdate
    },
    data() {
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/livePlayback/page", // 数据列表接口，API地址
                exportURL: "/sys/livePlayback/export", // 导出接口，API地址
            },
            dataForm: {
                liveTheme: "",
                anchorUser: "",
                showMode: null,
                showState: null,
                liveState: null,
            },


            tableItem: [
                { prop: "frontCoverUrl", label: "封面图" },
                { prop: "liveTheme", label: "回放主题" },
                { prop: "anchorUser", label: "主播" },
                { prop: "anchorTel", label: "手机号码" },
                { prop: "showMode", label: "视频显示" },
                { prop: "liveDuration", label: "视频时长" },
                { prop: "videoSize", label: "视频大小" },
                { prop: "dynamicGroupName", label: "投放人群" },
                { prop: "playbackNum", label: "回放次数" },
                { prop: "commentNum", label: "评论次数" },
                { prop: "giveLikeNum", label: "点赞次数" },
                { prop: "shareNum", label: "分享次数" },
                { prop: "addUserNum", label: "新增用户" },
                { prop: "liveState", label: "回放状态" },
                { prop: "showState", label: "显示状态" },
                { prop: "livingRoomId", label: "直播间ID", width: 180 },
                { prop: "remark", label: "备注" },
                { prop: "createDate", label: "创建时间", width: 180 },
            ],
        };
    },
    created () {
        // this.query()
    },
    activated () {
        this.query()
    },
    methods: {
        // 视频大小转换
        sizeTostr(size) {
            return sizeTostr(size)
        },
        // 视频时长设置
        getLiveDuration(url) {
            return "-"
        },
        actionHandle({action, data}) {
            switch(action) {
                case "1": // 下载视频
                    if(data.relationLiveUrl) downloadFile(data.relationLiveUrl,data.livingRoomId);
                    break;
                case "2": // 查看评论详情
                    if(data.id) this.$router.push({ name: "liveManagement-livePlayBackComment", query: { id: data.id }})
                    break;
                case "3": // 删除
                    if(!data.id) return
                    this.$refs.remarkModal.init(data.id)
                    break;

            }
        },
        // 视频显示/隐藏
        showOrHide(data) {
            if(!data.id) return
            this.$http.put("/sys/livePlayback/showOrHide", { id: data.id, showState: data.showState ? 0 : 1}).then(({data:res}) => {
                if(res.code == 0){
                    this.$message.success("操作成功")
                    this.query()
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(err => console.log(err))
        },
        // 确认删除
        confirmHandle(remark, id, cb) {
            this.$http.delete("/sys/livePlayback/delete", { data: { id, remark } }).then(({ data: res }) => {
                cb()
                if(res.code == 0){
                    this.$message.success("删除视频成功");
                    this.$refs.remarkModal.close()
                    this.query()
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err => {
                cb()
                this.$refs.remarkModal.close()
                throw err
            })
        },
    },
};
</script>
<style lang="scss" scoped>
    .mod-live__livePlayBack{
        .frontCoverImg{
            width: 100%;
            height: 60px;
        }
    }
</style>