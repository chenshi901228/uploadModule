<!-- 编辑银行账户信息-企业 -->
<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__edit">
            <div class="step">
                <el-steps :active="active">
                    <el-step title="账户信息"></el-step>
                    <el-step title="账户核验"></el-step>
                </el-steps>
            </div>
            <el-form
                v-if="active===1"
                :model="bankForm"
                :rules="dataRule_bank"
                ref="bankForm_host"
                label-width="130px"
                size="small">
                <el-form-item label="账户类型">
                    <span>公司</span>
                </el-form-item>
                <el-form-item label="企业名称">
                    <span>{{userInfo.companyName || '-'}}</span>
                </el-form-item>
                <el-form-item label="统一社会信用代码">
                    <span>{{userInfo.companyCreditCode || '-'}}</span>
                </el-form-item>
                <el-form-item label="开户银行" prop="depositBank">
                    <el-autocomplete
                        style="width:400px"
                        v-model="bankForm.depositBank"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="开户银行"
                        @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item label="账户名称" prop="accountName">
                    <el-input
                        style="width:400px"
                        v-model="bankForm.accountName"
                        placeholder="账户名称"></el-input>
                </el-form-item>
                <el-form-item label="银行账户" prop="bankAccount">
                    <el-input
                        style="width:400px"
                        v-model="bankForm.bankAccount"
                        placeholder="银行账户"></el-input>
                </el-form-item>
                <el-form-item style="textAlign:right;width:60%;marginTop:30px;">
                    <el-button size="small" @click="resetForm('bankForm_host')">取消</el-button>
                    <el-button size="small" type="primary" @click="submitForm('bankForm_host')">下一步</el-button>
                </el-form-item>
            </el-form>
            <el-form
                v-if="active===2"
                label-width="90px"
                label-position="left"
                class="step2"
                size="small">
                <p>使用以下银行卡打款</p>
                <div class="bank_info">
                    <p>账户名称：{{bankInfo.accountName}}</p>
                    <p>银行账号：{{bankInfo.bankAccount}}</p>
                </div>
                <p>向收款账号打款验证</p>
                <p>在{{bankInfo.endDay||'-'}}前汇款到指定账户，汇款后等待审核通过，审核结束后，汇款将全部退还至汇款账户。</p>
                <el-form-item label="打款金额：">
                    <span style="color:red;">￥{{bankInfo.attestAmount || '-'}}</span>
                    <p>随机金额，请按照指定金额汇款以作验证</p>
                </el-form-item>
                <el-form-item v-for="(item,index) in collectionInfo" :label="item.remark+':'" :key="index">
                    <span>{{item.dictValue || '-'}}</span>
                </el-form-item>
            </el-form>
            <div v-if="active === 2" style="textAlign:center;color:orange">等待核验中，7~15个工作日内给予回复</div>
        </div>
    </el-card>

</template>

<script>
import { treeDataTranslate, getUUID } from "@/utils";
export default {
    data() {
        return {
            dataRule_bank: {
                depositBank: [
                    { required: true, message: "请填写开户银行", trigger: "change" },
                ],
                accountName: [
                    { required: true, message: "请填写账户名称", trigger: "blur" },
                    { max: 20, message: '最大输入20位', trigger: 'blur' }
                ],
                bankAccount: [
                    { required: true, message: "请填写银行账户", trigger: "blur" },
                    { max: 20, message: '最大输入20位', trigger: 'blur' }
                ],
            },
            bankForm: {}, //银行账户信息
            restaurants: [], //开户银行字典集合
            dataBankListLoading: false, //开户银行下拉选择loading
            regionData: [], //省市区options
            regionDataAll: [],
            userInfo:{},
            userId:"",
            active:1,//步骤条
            collectionInfo:[],
            bankInfo:{}
        }
    },
    activated() {
        this.userId = this.$store.state.user.id;
        this.getAnchorInfo()
        this.queryBankList()
        this.getCollectionInfo()
    },
    methods: {
        getBankInfo(){
            this.$http.get('/sys/sysbankinfo/getUserNewestApply',{params:{
                        anchorId: this.userId,
                    }}).then(({ data: res }) => {
                        if (res.code !== 0) {
                            this.bankInfo = {};
                            return this.$message.error(res.msg)
                        } 
                        this.bankInfo = res.data
                    }).catch((err) => {
                        this.$message.error(JSON.stringify(err.message))
                    });
            
        },
        getCollectionInfo(){
            this.$http.get('/sys/dict/data/page',{params:{
                        page: 1,
                        limit: 100,
                        dictTypeId: "1542430649835130881",
                    }}).then(({ data: res }) => {
                        if (res.code !== 0) {
                            this.collectionInfo = [];
                            return this.$message.error(res.msg)
                        } 
                        this.collectionInfo = res.data.list
                    }).catch((err) => {
                        this.$message.error(JSON.stringify(err.message))
                    });
        },
        // 获取用户详细信息
        getAnchorInfo() {
            this.$http.get(`/sys/anchor/info/getInfo/${this.userId}`).then(({ data: res }) => {
                if (res.code !== 0) return this.$message.error(res.msg);
                this.userInfo = res.data;
                if(this.userInfo.haveApplyInfo){
                    this.active = 2
                    this.getBankInfo()
                }else{
                    this.active = 1
                    this.bankForm = {
                        depositBank: this.userInfo.depositBank ? this.userInfo.depositBank : "",
                        depositBankValue: this.userInfo.depositBankValue
                        ? this.userInfo.depositBankValue
                        : "",
                        // branchName: this.userInfo.branchName ? this.userInfo.branchName : "",
                        accountName: this.userInfo.accountName ? this.userInfo.accountName : "",
                        bankAccount: this.userInfo.bankAccount ? this.userInfo.bankAccount : "",
                    };

                    this.restaurants.forEach((v) => {
                        if (
                        this.userInfo.depositBank &&
                        this.userInfo.depositBank.length !== 0 &&
                        this.userInfo.depositBank === v.dictValue
                        ) {
                            this.bankForm.depositBank = v.value;
                            this.bankForm.depositBankValue = v.dictValue;
                        }
                    });
                }
            }).catch((err) => this.$message.error(JSON.stringify(err.message)));
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
                            this.restaurants = [];
                            return this.$message.error(res.msg)
                        } 
                        res.data.list.forEach((v) => {
                            this.restaurants.push({
                                value: v.dictLabel,
                                dictValue: v.dictValue,
                            });
                        });
                    }).catch((err) => {
                        this.dataBankListLoading = false;
                        this.$message.error(JSON.stringify(err.message))
                    });
        },
        // 开户银行输入返回结果
        querySearchAsync(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString
                ? restaurants.filter(this.createStateFilter(queryString))
                : restaurants;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 3000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        },

        // 选择开户银行
        handleSelect(item) {
            this.bankForm.depositBank = item.value;
            this.bankForm.depositBankValue = item.dictValue;
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // let address = "";
                    // this.bankForm.address.forEach((i) => {
                    //     this.regionDataAll.forEach((v) => {
                    //         if (v.id === i) {
                    //             address += `${v.name}/`;
                    //         }
                    //     });
                    // });
                    this.restaurants.forEach((v) => {
                        if (
                            this.userInfo.depositBank &&
                            this.userInfo.depositBank.length !== 0 &&
                            this.userInfo.depositBank === v.value
                        ) {
                            this.bankForm.depositBankValue = v.dictValue;
                        }
                    });
                    this.$confirm("确认银行信息已填写无误", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                        this.$http.post(`sys/sysbankinfo/updateWithApply`, {
                            depositBank:this.bankForm&&this.bankForm.depositBank,
                            depositBankValue: this.bankForm&&this.bankForm.depositBankValue,
                            // branchName: this.bankForm&&this.bankForm.branchName,
                            accountName: this.bankForm&&this.bankForm.accountName,
                            bankAccount: this.bankForm&&this.bankForm.bankAccount,
                            //   address: address.slice(0,address.length-1),
                            anchorInfoId: this.userId,
                            // province:
                            //     this.bankForm.address.length > 0
                            //     ? this.bankForm.address[0]
                            //     : "",
                            // city:
                            //     this.bankForm.address.length > 0
                            //     ? this.bankForm.address[1]
                            //     : "",
                            // county:
                            //     this.bankForm.address.length > 0
                            //     ? this.bankForm.address[2]
                            //     : "",
                            }).then(({ data: res }) => {
                                if (res.code !== 0) {
                                    return this.$message.error(res.msg);
                                }
                                // this.$message.success("修改成功!");
                                // let tabName = this.$store.state.contentTabsActiveName
                                // this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
                                // this.$router.push({path:'/anchorManagement-anchorDetails-index'})
                                this.getBankInfo()
                                this.active = 2
                            }).catch((error) => {
                                this.$message.error(error.msg || error.error);
                            });
                        }).catch((err) => {
                            console.log(err);
                            this.$message.info("已取消修改");
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
            let tabName = this.$store.state.contentTabsActiveName
            this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
            this.$router.push({path:'/anchorManagement-anchorDetails-index'})
        }
    }
}
</script>
<style lang="scss" scoped>
.step{
    width: 300px;
    height: 100px;
    margin: 0 auto;
}
.step2{
    margin-left: 100px;
}
.bank_info{
    width: 400px;
    padding: 10px 20px;
    border-radius:15px;
    background: #ccc;
}
</style>