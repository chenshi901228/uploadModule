<!-- 收货地址编辑 -->


<template>
    <el-dialog 
        top="20px"
        title="编辑" 
        :visible.sync="show" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="40%">
        <div>
            <el-form
                :model="formData"
                ref="form"
                size="small"
                label-width="120px"
            > 
                <el-form-item label="商品名称" prop="productName">
                    <el-input
                        :disabled="true"
                        style="width: 400px"
                        v-model="formData.productName"
                        placeholder="请输入">
                    </el-input>
                </el-form-item>
                <el-form-item label="商品类型" prop="productType">
                    <el-input
                        :disabled="true"
                        style="width: 400px"
                        v-model="formData.productType"
                        placeholder="请输入">
                    </el-input>
                </el-form-item>
                <el-form-item label="收件人" prop="userName">
                    <el-input
                        maxlength="10"
                        style="width: 400px"
                        v-model.trim="formData.userName"
                        placeholder="请输入"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="收件人手机号" prop="telNumber">
                    <el-input
                        maxlength="11"
                        style="width: 400px"
                        v-model.trim="formData.telNumber"
                        placeholder="请输入"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="省市区" prop="address">
                    <span v-if="!isUpdateAddress">{{addressShow}}</span>
                    <el-cascader
                        v-else
                        :options="regionData"
                        filterable
                        style="width:400px"
                        v-model="formData.address"
                        :props="{ label: 'name', value: 'id', children: 'children' }"
                        clearable
                        :placeholder="'请选择省/市/区县'">
                    </el-cascader>
                    <span @click="changeAddress" class="addressBtn">{{isUpdateAddress ? "确定" : "修改"}}</span>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailInfo">
                    <el-input
                        maxlength="50"
                        style="width: 400px"
                        v-model.trim="formData.detailInfo"
                        placeholder="请输入"
                        clearable>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>

        <template slot="footer">
            <el-button size="small" @click="show = false">{{ $t('cancel') }}</el-button>
            <el-button size="small" :disabled="submitLoading" :loading="submitLoading" type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
        </template>

    </el-dialog>
</template>
<script>
import debounce from "lodash/debounce"
import { treeDataTranslate } from "@/utils";
export default {
    data() {
        var checkPhone = (rule, value, callback) => {
            if(value && !value.match(/^1[0-9]{10}$/)) {
                return callback(new Error("请输入正确的手机号码"))
            }
            callback()
        }   
        return {
            info: {},
            formData: {
                productName: "",
                productType: "",
                userName: "",
                telNumber: "",
                address: [],
                detailInfo: ""
            },
            formRule: {
                userName: [{ required: true, message: "请输入收件人", trigger: "blur"}],
                telNumber: [
                    { required: true, message: "请输入收件人手机号码", trigger: "blur"},
                    { validator: checkPhone, trigger: "change"}
                ],
                detailInfo: [{ required: true, message: "请输入详细地址", trigger: "blur"}],
            },
            addressShow: "", //展示的省市区地址
            isUpdateAddress: 0, //是否下拉选择省市区
            regionData: [], //省市区options
            regionDataAll: [],
            show: false,
            submitLoading: false,
        }
    },
    methods: {
        init(data) {
            this.info = data
            this.formData = {...this.formData, ...data}
            this.addressShow = `${data["provinceName"]}/${data["cityName"]}/${data["countyName"]}`
            this.getAddressOptions()
            this.show = true
        },
        // 获取省市区options
        getAddressOptions() {
            this.$http.get("/sys/region/tree").then(({ data: res }) => {
                if (res.code !== 0) return this.$message.error(res.msg);
                this.regionData = treeDataTranslate(res.data);
                this.regionDataAll = res.data;
            }).catch(err => this.$message.error(JSON.stringify(err.message)));
        },
        changeAddress() {
            if(!this.isUpdateAddress) return this.isUpdateAddress = 1

            if(this.isUpdateAddress) {
                if(this.formData.address.length) {
                    let address = []
                    this.formData.address.forEach((i) => {
                        this.regionDataAll.forEach((v) => {
                            if (v.id === i) {
                                address.push(v.name);
                            }
                        });
                    })
                    address = address.join("/")

                    this.addressShow = address
                }
                this.isUpdateAddress = 0
            }
        },
        submit: debounce(function() {
            this.$refs['form'].validate((valid) => { 
                if(valid) {

                    if(this.isUpdateAddress) return this.$message.warning("请确认省市区选择")

                    this.submitLoading = true

                    let params = {}

                    let address = []
                    // 选择了省市区
                    if(this.formData.address.length) {
                        this.formData.address.forEach((i) => {
                            this.regionDataAll.forEach((v) => {
                                if (v.id === i) {
                                    address.push(v.name);
                                }
                            });
                        })

                        params = {
                            provinceName: address[0],
                            cityName: address[1],
                            countyName: address[2],
                        }
                    }

                    params = {
                        id: this.formData.id,
                        userName: this.formData.userName,
                        telNumber: this.formData.telNumber,
                        detailInfo: this.formData.detailInfo,
                        ...params
                    }

                    this.$http.put("/sys/management/user/product/updateAddress", params).then(({data: res}) => {
                        this.submitLoading = false

                        if(res.code != 0) return this.$message.error(res.msg)

                        this.$message.success("修改信息成功")

                        this.show = false
                        this.$emit("refreshDataList")

                    }).catch(err => {
                        this.submitLoading = false
                        this.$message.error(JSON.stringify(err))
                    })

                }
            })
        }, 1500, { 'leading': true, 'trailing': false }),
        close() {
            this.$refs.form.resetFields()
            this.info = {}
            this.isUpdateAddress = 0
            this.addressShow = ""
        }
    }
}
</script>
<style lang="scss" scoped>
    .addressBtn {
        display: inline-block;
        margin-left: 20px;
        color: #409EFF;
        cursor: pointer;
    }

    /deep/.el-dialog .el-dialog__body {
  padding: 20px; /*这个不重要*/
  max-height: 75vh;
  flex: 1;
  -ms-flex: 1 1 auto; /* 兼容IE */
  overflow-y: auto;
  overflow-x: hidden;
}
</style>