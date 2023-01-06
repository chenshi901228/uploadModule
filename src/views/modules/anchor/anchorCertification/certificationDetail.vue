<template>
    <el-card shadow="never" class="aui-card--fill card-container">
        <div class="part-info">
            <div class="part-title">基本信息</div>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">真实姓名</div>
                        <div>{{ detailData.realName || '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">主播昵称</div>
                        <div>{{ detailData.username || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">手机号码</div>
                        <div>{{ detailData.phone || '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">身份证号</div>
                        <div>{{ detailData.idCard || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="part-info">
            <div class="part-title">身份认证</div>
            <el-row>
                <el-col :span="10" :offset="1">
                    <div class="info-item">
                        <div class="label">认证类型</div>
                        <div>{{ detailData.userType == 1 ? '个人' : '企业' }}</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="part-info" v-show="detailData.userType == 2">
            <div class="part-title">主体信息</div>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">公司名称</div>
                        <div>{{ detailData.companyName || '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">统一社会信用代码</div>
                        <div>{{ detailData.companyCreditCode || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">经营所在地</div>
                        <div>{{ detailData.companyAddress ? detailData.companyAddress.replaceAll('/', '')  : '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">营业执照</div>
                        <el-image
                            :src="detailData.companyBusinessLicense"
                            style="width: 120px; height: 120px"
                            fit="cover"
                            :preview-src-list="[detailData.companyBusinessLicense]"
                        ></el-image>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="part-info" v-show="detailData.userType == 2">
            <div class="part-title">联系人</div>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">姓名</div>
                        <div>{{ detailData.connectName || '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">邮箱</div>
                        <div>{{ detailData.connectEmail || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="1">
                    <div class="info-item">
                        <div class="label">手机号码</div>
                        <div>{{ detailData.connectPhone || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="part-info">
            <div class="part-title">银行账号</div>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">开户银行</div>
                        <div>{{ (detailData.bankInfo && detailData.bankInfo.depositBank) || '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">支行名称</div>
                        <div>{{ (detailData.bankInfo && detailData.bankInfo.branchName) || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">账户名称</div>
                        <div>{{ (detailData.bankInfo && detailData.bankInfo.accountName) || '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">银行账号</div>
                        <div>{{ (detailData.bankInfo && detailData.bankInfo.bankAccount) || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-around">
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">开户行所在地</div>
                        <div>{{ (detailData.bankInfo && detailData.bankInfo.address.replaceAll('/', '')) || '--' }}</div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="info-item">
                        <div class="label">验证金额</div>
                        <div>{{ detailData.attestAmount || '--' }}</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="remark" v-if="detailData.status === 0">
            <div>备注</div>
            <el-input
                style="width:600px"
                type="textarea"
                :rows="2"
                placeholder="请输入，可不填"
                v-model="remark"
                maxlength="100"
                show-word-limit
            >
            </el-input>
        </div>

        <div class="remark" v-if="detailData.status !== 0">
            <div>备注</div>
            {{ detailData.remark || '--' }}
        </div>

        <div class="btns" v-if="detailData.status === 0">
            <el-button size="small" @click="updateApplyInfoStatus(-1)">驳回</el-button>
            <el-button size="small" type="primary" @click="updateApplyInfoStatus(1)">通过</el-button>
        </div>

        <!-- 审核状态图片 -->
        <img v-if="statusImg" class="status-img" :src="statusImg" />
    </el-card>
</template>

<script>
import commonModule from "@/mixins/common-module";
export default {
    mixins: [commonModule],

    data() {
        return {
            remark: '', //备注
            detailData: {}
        }
    },

    activated() {
        this.handleGetDetailData()
    },

    computed: {
        // 审核状态图片
        statusImg() {
            if (this.detailData && this.detailData.status == 0)
                return require("@/assets/icon/icon_applying.png");
            if (this.detailData && this.detailData.status == 1)
                return require("@/assets/icon/icon_agree.png");
            if (this.detailData && this.detailData.status == -1)
                return require("@/assets/icon/icon_reject.png");
            return "";
        }
    },

    methods: {
        //获取详情
        handleGetDetailData() {
            this.$http.get(`/sys/anchor/applyInfo/${this.$route.query.id}`).then(({ data }) => {
                if ( data && +data.code === 0 ) this.detailData = data.data
            })
        },

        // 审核
        updateApplyInfoStatus(status) {
        this.$confirm(
            `是否执行 [${status == -1 ? "拒绝" : "同意"}] 操作`,
            this.$t("prompt.title"),
            {
                confirmButtonText: this.$t("confirm"),
                cancelButtonText: this.$t("cancel"),
                type: "warning",
            }
        )
            .then(() => {
            this.$http["put"]("/sys/anchor/applyInfo/", {
                id: this.detailData.id,
                status,
                remark:this.remark
            })
                .then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.$message.success('操作成功');
                this.closeCurrentTab();
                this.$bus.$emit("change");
                })
                .catch(() => {});
            })
            .catch(() => {});
        },
    },
}
</script>

<style lang="scss" scoped>
.card-container{
    .status-img {
        width: 100px;
        position: absolute;
        top: 10px;
        right: 100px;
    }
    /deep/.el-row{
        margin-bottom: 20px;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
        padding: 0 12%;
        margin-top: 15px;
    }
}
.part-info{
    margin-top: 20px;
    .part-title{
        border-left: 4px solid #199ed8;
        padding-left: 10px;
        margin-bottom: 15px;
        font-weight: 700;
        color: #606266;
    }
    .info-item{
        display: flex;
        .label{
            font-weight: 700;
            color: #606266;
            margin-right: 6px;
            width: 120px;
            text-align: right;
        }
        div{
            &:last-child{
                width: 500px;
            }
        }
    }
}
.remark{
    display: flex;
    >div{
        font-weight: 700;
        color: #606266;
        margin-right: 50px;
        width: 60px;
    }
}
</style>