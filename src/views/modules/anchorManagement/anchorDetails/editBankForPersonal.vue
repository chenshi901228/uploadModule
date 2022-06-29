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
                <el-form-item label="开户银行" prop="depositBank">
                    <el-autocomplete
                        style="width:400px"
                        v-model="bankForm.depositBank"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="开户银行"
                        @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item label="支行名称">
                    <el-input
                        style="width:400px"
                        v-model="bankForm.branchName"
                        placeholder="支行名称"></el-input>
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
                        placeholder="账户名称"></el-input>
                </el-form-item>
                <el-form-item label="银行账户" prop="bankAccount">
                    <el-input
                        style="width:400px"
                        v-model="bankForm.bankAccount"
                        placeholder="银行账户"></el-input>
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
                    { required: true, message: "请填写开户银行", trigger: "blur" },
                ],
                accountName: [
                    { required: true, message: "请填写账户名称", trigger: "blur" },
                ],
                bankAccount: [
                    { required: true, message: "请填写银行账户", trigger: "blur" },
                ],
            },
            bankForm: {
                depositBank: ""
            }, //银行账户信息
            restaurants: [], //开户银行字典集合
            dataBankListLoading: false, //开户银行下拉选择loading
            regionData: [], //省市区options
            regionDataAll: []
        }
    },
    activated() {
        this.queryBankList()
        this.getAddressOptions()
    },
    methods: {
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
        }
    }
}
</script>