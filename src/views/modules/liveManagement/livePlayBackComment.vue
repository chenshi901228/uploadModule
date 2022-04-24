
<!-- 直播管理-评论详情 -->

<template>
    <div>
        <el-card shadow="never" class="aui-card--fill">
            <div class="mod-livePlayBackComment">
                <el-form
                    class="headerTool"
                    :inline="true"
                    :model="dataForm"
                    ref="dataForm"
                    @keyup.enter.native="getDataList"
                >
                    <el-row>
                        <el-col :span="8">
                            <el-form-item
                                label="评论人"
                                prop="commentUserName"
                            >
                                <el-input
                                    size="small"
                                    v-model.trim="dataForm.commentUserName"
                                    placeholder="请输入昵称或手机号"
                                    clearable
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="评论内容"
                                prop="commentValue"
                            >
                                <el-input
                                    size="small"
                                    v-model.trim="dataForm.commentValue"
                                    placeholder="请输入内容关键字"
                                    clearable
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="删除状态"
                                prop="delFlg"
                            >
                                <el-select clearable size="small" v-model="dataForm.delFlg" placeholder="请选择">
                                    <el-option label="已删除" :value="1"></el-option>
                                    <el-option label="未删除" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <div v-if="isOpen">
                        </div> -->
                        <el-col :span="24">
                            <el-form-item style="float:right; padding-right:10px">
                                <el-button size="small" type="primary" @click="exportHandle">{{ $t("export") }}</el-button>
                                <el-button size="small" type="primary" @click="getDataList">{{ $t("query") }}</el-button>
                                <el-button size="small" @click="resetDataForm()">{{ $t("reset") }}</el-button>
                                <!-- <el-button 
                                    size="small" 
                                    type="primary"
                                    @click="open"
                                >
                                    {{ isOpen ? "收起" : "展开"}}<i style="margin-left:10px" :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                </el-button> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
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
                            <!-- 删除状态 -->
                            <span v-if="item.prop == 'delFlg'">
                                {{row.delFlg ? "已删除" : "未删除"}}
                            </span>
                            <span v-else>
                                {{ row[item.prop] || "-" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
                        <template slot-scope="{ row }">
                            <el-button type="text" size="small" @click="checkComment(row)">查看回复</el-button>
                            <el-button v-if="!row.delFlg" type="text" size="small" @click="deleteComment(row.id)">删除</el-button>
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


            </div>
        </el-card>
        <!-- 备注弹框 -->
        <remark-modal ref="remarkModal" @confirm="confirmHandle" title="删除"></remark-modal>
    </div>
</template>

<script>
import mixinTableModule from '@/mixins/table-module'
import RemarkModal from "@/components/common/remarkDialog"
export default {
    mixins: [ mixinTableModule ],
    components: {
        RemarkModal
    },
    data() {
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/liveComment/getCommentByLivePlaybackId", // 数据列表接口，API地址
                exportURL: "/sys/liveComment/exportCommentList", // 导出接口，API地址
            },
            dataForm: {
                commentUserName: "",
                commentValue: "",
                delFlg: null,
            },
            limit: 10,
            page: 1,
            params: {
                commentLiveListId: null,
            },

            tableItem: [
                { prop: "commentUserName", label: "评论人" },
                { prop: "phone", label: "手机号码" },
                { prop: "commentValue", label: "评论内容" },
                { prop: "giveLikeNum", label: "点赞次数" },
                { prop: "delFlg", label: "删除状态" },
                { prop: "remark", label: "备注" },
                { prop: "createDate", label: "创建时间", width: 180 },
            ],
        };
    },
    activated() {
        this.params.commentLiveListId = this.$route.query.id;
        this.query()
    },
    methods: {
        // 查看回复
        checkComment(row) {
            if(row) {
                this.$router.push({ name: "liveManagement-livePlayBackChildComment", query: { id: row.id }})
                localStorage.setItem("livePlayBackComment", JSON.stringify(row))
            }
        },
        // 删除评论
        deleteComment(id) {
            if(!id) return
            this.$refs.remarkModal.init(id)
        },
        // 确认删除评论
        confirmHandle(remark, id, cb) {
            this.$http.put("/sys/liveComment/deleteComment", { id, remark }).then(({ data: res }) => {
                cb()
                if(res.code == 0){
                    this.$message.success("删除评论成功");
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
</style>