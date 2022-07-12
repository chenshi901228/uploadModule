<!-- 编辑银行账户信息-个人-->
<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__edit">
            <el-form
                :model="bankForm"
                :rules="dataRule_bank"
                ref="bankForm_host"
                label-width="120px"
                size="small">
                <el-form-item label="账户类型">
                    <span>个人</span>
                </el-form-item>
                <el-form-item label="姓名" required>
                    <span>{{userInfo.realName || '-'}}</span>
                </el-form-item>
                <el-form-item label="身份证号" required>
                    <span>{{userInfo.idCard || '-'}}</span>
                </el-form-item>
                <el-form-item label="开户银行" prop="depositBank">
                    <el-autocomplete
                        style="width:400px"
                        v-model="bankForm.depositBank"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入"
                        @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item label="支行名称" prop="branchName">
                    <el-input
                        style="width:400px"
                        v-model="bankForm.branchName"
                        placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="开户行所在地" prop="address">
                    <el-cascader
                        :options="regionData"
                        filterable
                        style="width:400px"
                        v-model="bankForm.address"
                        :props="{ label: 'name', value: 'id', children: 'children' }"
                        :clearable="true"
                        :placeholder="'请选择省/市/区县'">
                    </el-cascader>
                </el-form-item>

                <el-form-item label="账户名称" prop="accountName">
                    <el-input
                        style="width:400px"
                        v-model="bankForm.accountName"
                        placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="银行账户" prop="bankAccount">
                    <el-input
                        style="width:400px"
                        v-model="bankForm.bankAccount"
                        placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item style="textAlign:right;width:60%;marginTop:30px;">
                    <el-button size="small" @click="resetForm('bankForm_host')">取消</el-button>
                    <el-button size="small" type="primary" @click="submitForm('bankForm_host')">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>

</template>

<script>
import { treeDataTranslate, getUUID } from "@/utils";
export default {
    data() {
        return {
            dataRule_bank: {
                address: [
                    { required: true, message: "请选择省/市/区县", trigger: "change" },
                ],
                depositBank: [
                    { required: true, message: "请填写开户银行", trigger: "change" },
                ],
                accountName: [
                    { required: true, message: "请填写账户名称", trigger: "blur" },
                ],
                bankAccount: [
                    { required: true, message: "请填写银行账户", trigger: "blur" },
                ],
                branchName:[
                    { required: true, message: "请填写支行名称", trigger: "blur" },
                ]
            },
            bankForm: {
                // accountName:"",
                // depositBank: "",
                // bankAccount:"",
                // address:"",
                // branchName:"",
            }, //银行账户信息
            restaurants: [], //开户银行字典集合
            dataBankListLoading: false, //开户银行下拉选择loading
            regionData: [], //省市区options
            regionDataAll: [],
            userId:"",//用户ID
            userInfo:{},//用户信息
        }
    },
    activated() {
        this.userId = this.$store.state.user.id;
        this.getAnchorInfo()
        this.queryBankList()
        this.getAddressOptions()
    },
    methods: {
        // 获取用户详细信息
        getAnchorInfo() {
            this.$http.get(`/sys/anchor/info/getInfo/${this.userId}`).then(({ data: res }) => {
                if (res.code !== 0) return this.$message.error(res.msg);
                this.userInfo = res.data;
                this.bankForm = {
                    depositBank: this.userInfo.depositBank ? this.userInfo.depositBank : "",
                    depositBankValue: this.userInfo.depositBankValue
                    ? this.userInfo.depositBankValue
                    : "",
                    branchName: this.userInfo.branchName ? this.userInfo.branchName : "",
                    address: this.userInfo.province
                    ? [this.userInfo.province, this.userInfo.city, this.userInfo.county]
                    : [],
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
        // 获取省市区options
        getAddressOptions() {
            this.$http.get("/sys/region/tree").then(({ data: res }) => {
                if (res.code !== 0) return this.$message.error(res.msg);
                this.regionData = treeDataTranslate(res.data);
                this.regionDataAll = res.data;
            }).catch(err => this.$message.error(JSON.stringify(err.message)));
        },
        submitForm(formName){//确认修改
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let address = "";
                    this.bankForm.address.forEach((i) => {
                        this.regionDataAll.forEach((v) => {
                            if (v.id === i) {
                                address += `${v.name}/`;
                            }
                        });
                    });
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
                            // depositBank: this.bankForm.depositBank
                            //   ? this.bankForm.depositBank
                            //   : "",
                            depositBank:this.bankForm&&this.bankForm.depositBank,
                            depositBankValue: this.bankForm&&this.bankForm.depositBankValue,
                            branchName: this.bankForm&&this.bankForm.branchName,
                            accountName: this.bankForm&&this.bankForm.accountName,
                            bankAccount: this.bankForm&&this.bankForm.bankAccount,
                            address: address.slice(0,address.length-1),
                            anchorInfoId: this.userId,
                            province:
                                this.bankForm.address.length > 0
                                ? this.bankForm.address[0]
                                : "",
                            city:
                                this.bankForm.address.length > 0
                                ? this.bankForm.address[1]
                                : "",
                            county:
                                this.bankForm.address.length > 0
                                ? this.bankForm.address[2]
                                : "",
                            }).then(({ data: res }) => {
                                if (res.code !== 0) {
                                    return this.$message.error(res.msg);
                                }
                                this.$message.success("修改成功!");
                                let tabName = this.$store.state.contentTabsActiveName
                                this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
                                this.$router.push({path:'/anchorManagement-anchorDetails-index'})
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
        resetForm(formName) {//取消修改
            this.$refs[formName].resetFields();
            let tabName = this.$store.state.contentTabsActiveName
            this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
            this.$router.push({path:'/anchorManagement-anchorDetails-index'})
        }
    }
}
</script>