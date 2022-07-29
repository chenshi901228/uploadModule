<!-- 邮寄 -->


<template>
    <el-dialog 
        title="邮寄" 
        :visible.sync="show" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="30%">
        <el-form
            :model="formData"
            :rules="formDataRule"
            ref="form"
            size="small"
            label-width="100px"
        >
            <el-form-item label="快递公司" prop="company">
                <el-select 
                    clearable
                    v-model="formData.company"
                    placeholder="请选择"
                    style="width: 200px">
                    <el-option v-for="item in companyList" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>


        <template slot="footer">
            <el-button size="small" @click="show = false">{{ $t('cancel') }}</el-button>
            <el-button size="small" :disabled="submitLoading" :loading="submitLoading" type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            info: {},
            formData: {
                company: null
            },
            formDataRule: {
                company: [{ required: true, message: "请选择快递公司", trigger: "blur" }]
            },
            companyList: [],
            show: false,
            submitLoading: false
        }
    },
    methods: {
        init(data) {
            this.info = data
            this.show = true
            this.getCompany()
        },
        // 获取物流公司信息
        getCompany() {
            this.$http.get("/sys/dict/data/page", {
                    params: {
                        page: 1,
                        limit: 100,
                        dictTypeId: "1552850486842703873",
                    },
                }).then(({ data: res }) => {
                        if (res.code !== 0) {
                            this.companyList = [];
                            return this.$message.error(res.msg)
                        } 
                        res.data.list.forEach((v) => {
                            this.companyList.push({
                                id: v.id,
                                label: v.dictLabel,
                                value: v.dictLabel + "," + v.dictValue,
                            });
                        });
                    }).catch((err) => {
                        this.companyList = []
                        this.$message.error(JSON.stringify(err.message))
                    });
        },
        submit() {
            this.$refs['form'].validate((valid) => {
                if(valid) {
                    this.submitLoading = true


                    let companyArr = this.formData.company.split(",")

                    this.$http.put("/sys/weixinuserproductlogistics/shipments", {
                        id: this.info.id,
                        expressCompany: companyArr[0],
                        expressCompanyCode: companyArr[1]
                    }).then(({data: res}) => {
                        this.submitLoading = false

                        if(res.code != 0) return this.$message.error(res.msg)

                        this.$message.success("邮寄操作成功")
                        this.show = false
                        this.$emit("refreshDataList")


                    }).catch(err => {
                        this.submitLoading = false
                        this.$message.error(JSON.stringify(err))
                    })
                }
            })
        },
        close() {
            this.$refs.form.resetFields()
            this.info = {}
            this.companyList = []
        }
    }
}
</script>