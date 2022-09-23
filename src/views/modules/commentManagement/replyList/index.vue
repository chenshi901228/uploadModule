<!-- 评论管理-回复列表 -->
<template>
    <div>
        <el-card shadow="never" class="aui-card--fill">
            <div class="mod-comment">
                <el-form class="headerTool" :inline="true" :model="dataForm" ref="dataForm" size="small" label-width="100px" @keyup.enter.native="getDataList">
                    <el-form-item v-show="isOpen || formItemCount >= 1" label="回复人" prop="childCommentName">
                        <el-input style="width: 200px" v-model.trim="dataForm.childCommentName" placeholder="请输入昵称或手机号"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="isOpen || formItemCount >= 1" label="回复内容" prop="commentValue">
                        <el-input style="width: 200px" v-model.trim="dataForm.commentValue" placeholder="请输入内容关键字"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="视频主题" prop="liveTheme" v-show="isOpen || formItemCount >= 4">
                        <el-input style="width: 200px" v-model.trim="dataForm.liveTheme" placeholder="请输入内容关键字"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="主播" prop="anchorName" v-show="isOpen || formItemCount >= 6">
                        <el-input style="width: 200px" v-model.trim="dataForm.anchorName" placeholder="请输入昵称或手机号"
                            clearable>
                        </el-input>
                    </el-form-item>
                     <el-form-item label="评论人" prop="commentName" v-show="isOpen || formItemCount >= 7">
                        <el-input style="width: 200px" v-model.trim="dataForm.commentName" placeholder="请输入昵称或手机号"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="删除状态" prop="delFlg" v-show="isOpen || formItemCount >= 7">
                        <el-select clearable style="width: 200px" v-model="dataForm.delFlg" placeholder="请选择">
                            <el-option label="已删除" :value="1"></el-option>
                            <el-option label="未删除" :value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 搜索重置展开按钮 -->
                    <div class="headerTool-search-btns">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="getDataList">{{
                                    $t("query")
                            }}</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetDataForm()">{{ $t("reset") }}
                            </el-button>
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
                                <!-- <el-button type="warning" plain icon="el-icon-download" size="mini"
                                    @click="exportHandle">{{ $t("export") }}</el-button> -->
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

                <el-table v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" :height="siteContentViewHeight" style="width: 100%">
                    <el-table-column type="selection" header-align="center" align="center" width="50" fixed="left"></el-table-column>
                    <el-table-column  prop="childCommentName" label="回复人" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="childCommentPhone" label="手机号码" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="commentValue" label="回复内容" header-align="center" align="center" min-width="120px" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            <!-- 回复内容 -->
                            <span v-if="row.prop != ''">
                                <el-tooltip class="item" effect="dark" :content="row.commentValue" placement="top"
                                    :disabled="row.commentValue.length < 5">
                                    <div> {{ row.commentValue.length > 4 ? row.commentValue.substring(0, 5) + '...' :
                                            row.commentValue
                                    }}</div>
                                </el-tooltip>
                            </span>
                            <span v-else>
                                {{"-"}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="liveTheme" label="视频主题" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="anchorName" label="主播昵称" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="anchorPhone" label="主播手机号码" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="commentName" label="评论人" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="commentPhone" label="手机号码" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="delFlg" label="删除状态" header-align="center" align="center" min-width="120px" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            <!-- 删除状态 -->
                            <span>
                                <el-tag :type="row.delFlg ? 'danger' : 'success'">{{ row.delFlg ? "已删除" : "未删除" }}
                                </el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="createDate" label="创建时间" header-align="center" align="center" min-width="120px" show-overflow-tooltip></el-table-column>

                    <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center"
                        width="250">
                        <template slot-scope="{ row }">
                            <el-button icon="el-icon-document" type="text" size="small" @click="detail(row)">查看详情
                            </el-button>
                            <el-button v-if="row.delFlg === 1" type="text" icon="el-icon-view" size="small" @click="checkRemark(row)">查看备注
                            </el-button>
                            <el-button icon="el-icon-delete" v-if="!row.delFlg" type="text" size="small"
                                @click="deleteComment(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination background :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit"
                    :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
                    @current-change="pageCurrentChangeHandle">
                </el-pagination>

            </div>
        </el-card>

        <!-- 备注弹框 -->
        <remark-modal ref="remarkModal" @confirm="confirmHandle" title="删除"></remark-modal>

        <!-- 回复详情弹框 -->
        <el-dialog top="0" custom-class="custom-dialog-top" title="回复详情" :visible.sync="commentDetailsVisible"
            width="30%">
            <el-descriptions title="" :column="1" :labelStyle="{ width: '100px' }" :contentStyle="{ width: '80%' }">
                <el-descriptions-item label="回复人">{{ commentDetailsInfo && commentDetailsInfo.childCommentName || "-" }}
                </el-descriptions-item>
                <el-descriptions-item label="手机号码">{{ commentDetailsInfo && commentDetailsInfo.childCommentPhone || "-" }}
                </el-descriptions-item>
                <el-descriptions-item label="回复详情">{{ commentDetailsInfo && commentDetailsInfo.commentValue || "-" }}
                </el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="commentDetailsVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import mixinTableModule from '@/mixins/table-module'
import RemarkModal from "@/components/common/remarkDialog"
export default {
    mixins: [mixinTableModule],
    components: {
        RemarkModal,
    },
    data() {
        
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/liveComment/getAllChildComment", // 数据列表接口，API地址
                exportURL: "/sys/liveComment/exportCommentListForManage", // 导出接口，API地址
            },
            dataForm: {
                childCommentName: "",
                commentValue: "",
                liveTheme: "",
                anchorName: "",
                commentName:"",
                delFlg: null,
            },
            limit: 10,
            page: 1,

            // 回复详情弹框
            commentDetailsVisible: false,
            commentDetailsInfo: null,
            commentInfo: null, //被回复的评论详情
            
        }
    },
    activated() {
        this.query()
    },

    methods:{
        // 删除回复
        deleteComment(id) {
            if (!id) return
            this.$refs.remarkModal.init(id)
        },
        // 确认删除回复
        confirmHandle(remark, id, cb) {
            this.$http.put("/sys/liveComment/deleteComment", { id, remark }).then(({ data: res }) => {
                cb()
                if (res.code == 0) {
                    this.$message.success("删除回复成功");
                    this.$refs.remarkModal.close()
                    this.query()
                } else {
                    this.$message.error(res.msg);
                }
            }).catch(err => {
                cb()
                this.$refs.remarkModal.close()
                throw err
            })
        },

        // 查看回复详情
        detail(data) {
            if (data.id) this.commentDetailsInfo = data
            this.commentDetailsVisible = true
        },

        // 查看备注
        checkRemark({ remark }) {
            this.$alert(remark || '暂无备注', '查看备注', {
                confirmButtonText: '关闭',
                callback: action => { }
            });
        },
    }
}
</script>