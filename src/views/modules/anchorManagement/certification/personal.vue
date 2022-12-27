<template>
    <el-card shadow="never" class="aui-card--fill card-container">
        <el-form
            class="headerTool"
            :inline="true"
            :model="formData"
            ref="certificationForm"
            label-width="150px"
            v-if="certificationStep === -1"
        >
            <div class="part-info">
                <div class="part-title">主体信息</div>
                <el-row type="flex" justify="space-around">
                    <el-col :span="10">
                        <el-form-item label="姓名" prop="name">
                            {{ anchorInfo.realName || '--' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证号" prop="id">
                            {{ enCodeIdCard(anchorInfo.idCard) || '--' }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <div class="part-info">
                <div class="part-title">银行账号</div>
                <el-row type="flex" justify="space-around">
                    <el-col :span="10">
                        <el-form-item label="开户银行" prop="depositBank" required :rules="{ required: true, message: '请选择开户银行' }">
                            <el-autocomplete
                                style="width:300px"
                                v-model="formData.depositBank"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="请选择开户银行"
                                @select="handleSelect"
                            >
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="支行名称" prop="branchName" required :rules="{ required: true, message: '请输入支行名称' }">
                            <el-input
                                v-model.trim="formData.branchName"
                                style="width:300px"
                                placeholder="请输入支行名称"
                                clearable
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="space-around">
                    <el-col :span="10">
                        <el-form-item label="账户名称" prop="accountName" required :rules="{ required: true, message: '请输入账户名称' }">
                            <el-input
                                v-model.trim="formData.accountName"
                                style="width:300px"
                                placeholder="请输入账户名称"
                                clearable
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="银行账号" prop="bankAccount" required :rules="{ required: true, message: '请输入银行账号' }">
                            <el-input
                                v-model.trim="formData.bankAccount"
                                style="width:300px"
                                placeholder="请输入银行账号"
                                clearable
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10" :offset="1">
                        <el-form-item label="开户行所在地" prop="address" required :rules="{ required: true, message: '请选择开户行所在地' }">
                            <el-cascader
                                :options="regionData"
                                filterable
                                style="width: 300px"
                                v-model="formData.address"
                                :props="{ label: 'name', value: 'id', children: 'children' }"
                                :clearable="true"
                                :placeholder="'请选择省/市/区县'"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <el-row>
                <el-col :span="24" :offset="21">
                    <el-button size="small" type="primary" @click="handleSubmitForm()">确定</el-button>
                </el-col>
            </el-row>
        </el-form>

        <div v-if="certificationStep === 0" class="check-container">
            <div>使用以下银行卡打款</div>
            <div class="bank-info mt-15">
                <div>账户名称：{{ applyInfo.accountName }}</div>
                <div class="mt-15">银行账号：{{ applyInfo.bankAccount }}</div>
            </div>
            <div class="mt-15">向收款账号打款验证</div>
            <div class="desc">在{{ applyInfo.endDay }}前汇款到指定账户，汇款后等待审核通过，审核结束后，汇款将全部退还至汇款账户。</div>
            <div class="money mt-15">
                <div>打款金额：</div>
                <div>
                    <div class="money-num">￥{{ applyInfo.attestAmount }}</div>
                    <div class="desc">随机金额，请按照指定金额汇款以作验证</div>
                </div>
            </div>
            <div class="mt-15">收款账号：121926682010505</div>
            <div class="mt-15">收款公司：甘肃艺博教育文化传播股份有限公司</div>
            <div class="mt-15">开户银行：招商银行兰州渭源路支行</div>
            <div class="tips">等待核验中，7~15个工作日内给予回复</div>
        </div>

        <div v-if="certificationStep === 1" class="info-container">
            <div class="part-info">
                <div class="part-title">主体信息</div>
                <el-row type="flex" justify="space-around">
                    <el-col :span="10">
                        <div class="info-item">
                            <div class="label">姓名</div>
                            <div>{{ anchorInfo.realName || '--' }}</div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="info-item">
                            <div class="label">身份证号</div>
                            <div>{{ enCodeIdCard(anchorInfo.idCard) || '--' }}</div>
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
                            <div>{{ applyInfo.depositBank || '--' }}</div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="info-item">
                            <div class="label">支行名称</div>
                            <div>{{ applyInfo.branchName || '--' }}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="space-around">
                    <el-col :span="10">
                        <div class="info-item">
                            <div class="label">账户名称</div>
                            <div>{{ applyInfo.accountName || '--' }}</div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="info-item">
                            <div class="label">银行账号</div>
                            <div>{{ applyInfo.bankAccount || '--' }}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10" :offset="1">
                        <div class="info-item">
                            <div class="label">开户行所在地</div>
                            <div>{{ applyInfo.address ? applyInfo.address.replaceAll('/', '') : '' }}</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        
    </el-card>
</template>

<script>
import { treeDataTranslate, enCodeIdCard } from "@/utils";
import ComModule from "@/mixins/common-module"
export default {
    mixins: [ComModule],
    
    data() {
        return {
            userId: "",
            certificationStep: -1,
            formData: {
                depositBank: "",
                depositBankValue: "",
                branchName: "",
                accountName: "",
                bankAccount: "",
                address: "",
                province: "",
                city: "",
                county: "",
            },
            dataBankListLoading: false, //开户银行下拉选择loading
            restaurants:[],
            regionDataAll: [],
            regionData: [],
            anchorInfo: {},
            applyInfo: {},
            invoiceInfo: {}
        }
    },

    created() {
        this.userId = this.$store.state.user.id
        this.getAnchorInfo()
        this.queryBankList()
        this.handleGetAddress()
        if ( !this.$route.query.reCertificat ) {
            this.handleGetApplyInfo()
        } else {
            this.handleGetBankInfo()
        }
    },

    methods:{
        //处理数据
        getInvoiceInfo(data) {
            let arr = {}
            data.map((item) => {
                arr[item.dictValue] = item.dictLabel
            })
            return arr
        },

        handleGetInvoiceInfo() {
            this.$http
                .get(
                "/sys/dict/data/pageWithName?page=1&limit=20&dictTypeId=1548961326764187650"
                )
                .then(({ data: res }) => {
                    if ( res && res.code === 0 ) {
                        this.invoiceInfo = this.getInvoiceInfo(res.data)
                    }
                })
                .catch((err) => {})
        },

        // 获取用户详细信息
        getAnchorInfo() {
            this.$http.get(`/sys/anchor/info/getInfoWithAnchor`, { params: { anchorId: this.userId } }).then(({ data: res }) => {
                if (res.code !== 0) return this.$message.error(res.msg)
                this.anchorInfo = res.data
            }).catch((err) => this.$message.error(JSON.stringify(err.message)))
        },

        // 身份证号码加密
        enCodeIdCard(val) {
            return enCodeIdCard(val)
        },

        //获取银行列表
        queryBankList() {
            this.$http.get("/sys/dict/data/page", {
                params: {
                    page: 1,
                    limit: 100,
                    dictTypeId: "1518837406719619074",
                },
            }).then(({ data: res }) => {
                    if (res.code !== 0) {
                        this.restaurants = []
                        return this.$message.error(res.msg)
                    } 
                    res.data.list.forEach((v) => {
                        this.restaurants.push({
                            value: v.dictLabel,
                            dictValue: v.dictValue,
                        })
                    })
                }).catch((err) => {
                    this.dataBankListLoading = false
                    this.$message.error(JSON.stringify(err.message))
                })
        },

        // 开户银行输入返回结果
        querySearchAsync(queryString, cb) {
            let restaurants = this.restaurants
            let results = queryString
                ? restaurants.filter(this.createStateFilter(queryString))
                : restaurants

            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                cb(results)
            }, 3000 * Math.random())
        },

        createStateFilter(queryString) {
            return (state) => state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        },

        // 选择开户银行
        handleSelect(item) {
            this.formData.depositBank = item.value
            this.formData.depositBankValue = item.dictValue
        },

        //获取认证信息
        handleGetBankInfo() {
            this.$http.get(`sys/anchor/info/getBankInfo/${this.userId}`, { params: { userType: 1 } }).then(({ data:res }) => {
                if ( res && +res.code === 0 ) {
                    const { province, city, county, depositBank, branchName, accountName, bankAccount } = res.data
                    this.formData = {
                        depositBank,
                        branchName,
                        accountName,
                        bankAccount,
                        address: [ province, city, county ]
                    }
                }
            })
        },

        // 获取地址
        handleGetAddress() {
            this.$http
            .get("/sys/region/tree")
            .then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg)
                }
                this.regionData = treeDataTranslate(res.data)
                this.regionDataAll = res.data
            })
            .catch(() => {})
        },

        //获取申请信息
        handleGetApplyInfo() {
            this.$http.get("/sys/sysbankinfo/getUserNewestApply", {
                params: {
                    anchorId: this.userId,
                    userType: 1,
                },
            }).then(({ data: res }) => {
                    if ( res && +res.code === 0 ) {
                        this.applyInfo = res.data
                        this.certificationStep = res.data ? res.data.applyStatus : -1
                        if ( this.certificationStep === 0 ) {
                            this.$message.info("您提交的企业认证信息正在审批中，请等待")
                            // this.handleGetInvoiceInfo()
                        }
                    }
                }).catch((err) => {
                    this.$message.error(JSON.stringify(err.message))
                })
        },

        //提交
        handleSubmitForm() {
            this.$refs['certificationForm'].validate(valid => {
                if ( valid ) {
                    this.$confirm("确认信息已填写无误，提交审批", "提示", {
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                        let address = ""
                        this.formData.province = this.formData.address[0]
                        this.formData.city = this.formData.address[1]
                        this.formData.county = this.formData.address[2]
                        this.formData.address.forEach((i,index) => {
                            this.regionDataAll.forEach((v) => {
                                if (v.id === i) {
                                    address += `${v.name}/`
                                }
                            })
                        })
                        this.formData.address = address.slice(0, address.length - 1)
                        const params = {
                            ...this.formData,
                            userType: 1
                        }
                        this.$http.post('/sys/sysbankinfo/updateWithApply',params).then(({ data:res }) => {
                            if ( res && +res.code === 0 ) {
                                // this.$message.success("提交成功")
                                this.handleGetApplyInfo()
                            } else {
                                this.$message.warning(res.msg)
                                this.closeCurrentTab()
                            }
                        }).catch((err) => {
                            this.$message.error(JSON.stringify(err.message))
                        })
                    }).catch(() => {})
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.card-container{
    /deep/.el-row{
        margin-bottom: 20px;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
        padding: 0 110px;
    }
}
.check-container{
    padding: 20px 340px;
    line-height: 2em;
    .bank-info{
        background: #f2f2f2;
        padding: 10px;
        border-radius: 5px;
    }
    .money{
        display: flex;
    }
    .money-num{
        color: #f00;
    }
    .tips{
        text-align: center;
        color: #f59a23;
        margin-top: 20px;
        font-size: 12px;
    }
    .desc{
        font-size:12px;
        color: #7f7f7f;
    }
    .mt-15{
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
    }
}
.info-container{
    padding: 20px 0;
}
</style>