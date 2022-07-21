
<!-- 评论管理-评论列表 -->

<template>
    <div>
        <el-card shadow="never" class="aui-card--fill">
            <div class="mod-livePlayBackComment">
                <el-form
                    class="headerTool"
                    :inline="true"
                    :model="dataForm"
                    ref="dataForm"
                    size="small"
                    label-width="100px"
                    @keyup.enter.native="getDataList"
                >
                    <el-form-item
                        label="评论人"
                        prop="commentUserName"
                        v-if="isOpen || formItemCount >= 1"
                    >
                        <el-input
                            style="width: 200px"
                            v-model.trim="dataForm.commentUserName"
                            placeholder="请输入昵称或手机号"
                            clearable
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="评论内容"
                        prop="commentValue"
                        v-if="isOpen || formItemCount >= 2"
                    >
                        <el-input
                            style="width: 200px"
                            v-model.trim="dataForm.commentValue"
                            placeholder="请输入内容关键字"
                            clearable
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="视频主题"
                        prop="liveTheme"
                        v-if="isOpen || formItemCount >= 3"
                    >
                        <el-input
                            style="width: 200px"
                            v-model.trim="dataForm.liveTheme"
                            placeholder="请输入内容关键字"
                            clearable
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="主播"
                        prop="anchorUser"
                        v-if="isOpen || formItemCount >= 4"
                    >
                        <el-input
                            style="width: 200px"
                            v-model.trim="dataForm.anchorUser"
                            placeholder="请输入昵称或手机号"
                            clearable
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="删除状态"
                        prop="delFlg"
                        v-if="isOpen || formItemCount >= 5"
                    >
                        <el-select clearable style="width: 200px" v-model="dataForm.delFlg" placeholder="请选择">
                            <el-option label="已删除" :value="1"></el-option>
                            <el-option label="未删除" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 搜索重置展开按钮 -->
                    <div class="headerTool-search-btns">
                        <el-form-item>
                            <el-button 
                                type="primary" 
                                icon="el-icon-search" 
                                size="mini"
                                @click="getDataList">{{ $t("query") }}</el-button>
                            <el-button 
                                icon="el-icon-refresh" 
                                size="mini" 
                                @click="resetDataForm()">{{ $t("reset") }}</el-button>
                            <el-button size="mini" plain @click="open">
                                <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                {{ isOpen ? "收起" : "展开" }}
                            </el-button>
                        </el-form-item>
                    </div>
                    <!-- 操作按钮 -->
                    <div class="headerTool-handle-btns">
                        <div class="headerTool--handle-btns-left">
                            <el-form-item>
                                <el-button 
                                    type="warning"
                                    plain
                                    icon="el-icon-download" 
                                    size="mini"
                                    @click="exportHandle">{{ $t("export") }}</el-button>
                            </el-form-item>
                        </div>
                        <div class="headerTool--handle-btns-right">
                            <el-form-item>
                                <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                                    <el-button size="small" icon="el-icon-refresh" circle @click="query"></el-button>
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
                                <el-tag :type="row.delFlg ? 'danger' : 'success'">{{row.delFlg ? "已删除" : "未删除"}}</el-tag>
                            </span>
                            <span v-else>
                                {{ row[item.prop] || "-" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        :label="$t('handle')" 
                        fixed="right" 
                        header-align="center" 
                        align="center"
                        width="150">
                        <template slot-scope="{ row }">
                            <el-button icon="el-icon-document" type="text" size="small" @click="checkComment(row)">查看回复</el-button>
                            <el-button icon="el-icon-delete" v-if="!row.delFlg" type="text" size="small" @click="deleteComment(row.id)">删除</el-button>
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
    mixins: [ mixinTableModule ],
    data() {
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/liveComment/getChildCommentForManage", // 数据列表接口，API地址
                exportURL: "/sys/liveComment/exportCommentListForManage", // 导出接口，API地址
            },
            dataForm: {
                commentUserName: "",
                commentValue: "",
                liveTheme: "",
                anchorUser: "",
                delFlg: null,
            },
            limit: 10,
            page: 1,
            params: {
                fatherId: 1,
            },

            tableItem: [
                { prop: "commentUserName", label: "评论人" },
                { prop: "commentUserPhone", label: "手机号码", width: 150 },
                { prop: "commentValue", label: "评论内容" },
                { prop: "liveTheme", label: "视频主题" },
                { prop: "anchorUser", label: "主播昵称" },
                { prop: "anchorTel", label: "主播手机号码", width: 150 },
                { prop: "giveLikeNum", label: "点赞次数" },
                { prop: "delFlg", label: "删除状态" },
                { prop: "remark", label: "备注" },
                { prop: "createDate", label: "创建时间", width: 180 },
            ],
        };
    },
    activated() {
        this.query()
    },
    methods: {
        // 查看回复
        checkComment(row) {
            if(row) {
                this.$router.push({ name: "commentManagement-commentList-childComment", query: { id: row.id }})
                localStorage.setItem("comment", JSON.stringify(row))
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