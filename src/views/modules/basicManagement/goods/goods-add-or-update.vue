<!--商品编辑-->
<template>
    <el-dialog 
        top="20px"
        :visible.sync="visible" 
        width="30%"
        :title="!dataForm.id ? $t('add') : $t('update')" 
        :close-on-click-modal="false" 
        @close="cancel"
        :close-on-press-escape="false">
            <el-form
                :model="dataForm"
                ref="dataForm"
                label-width="110px"
            >
                <el-form-item label="商品名称：">
                    <span>{{ dataForm.productName }}</span>
                </el-form-item>
                <el-form-item label="商品价格：">
                    <span>￥{{ dataForm.oldPrice }}</span>
                </el-form-item>
                <el-form-item label="销售价格：" prop="price">
                    ￥  <el-input-number 
                            v-model="dataForm.price" 
                            :controls="false" 
                            :precision="2"
                            :min="0">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="分成比例：" prop="proportion">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input-number 
                        v-model="dataForm.proportion" 
                        :controls="false"
                        :min="10" 
                        :max="20">
                    </el-input-number> %
                </el-form-item>
                <el-form-item label="已购买人数：" prop="buyers">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input-number 
                        v-model="dataForm.buyers" 
                        :controls="false" 
                        :min="0">
                    </el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :disabled="submitLoading" size="small" @click="visible = false">取 消</el-button>
                <el-button :disabled="submitLoading" :loading="submitLoading" size="small" type="primary" @click="submit">修 改</el-button>
            </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            visible: false,
            dataForm: {},
            submitLoading: false,
        }
    },
    methods: {
        init(data) {
            if(data) this.dataForm = data
            this.visible = true
        },
        // 取消添加
        cancel() {
            this.$refs.dataForm.resetFields()
            this.dataForm = {}
        },
        // 表单提交
        submit() {
            this.$refs.dataForm.validate((valid) => {
                if(valid){

                    let params = {}
                    params = JSON.parse(JSON.stringify(this.dataForm))

                    this.submitLoading = true
                    this.$http.put("/sys/course", {
                        id: params.id,
                        price: params.price,
                        proportion: params.proportion,
                        buyers: params.buyers
                    }).then(({ data: res }) => {
                        if(res.code == 0){
                            this.$message.success("修改商品成功")
                            this.submitLoading = false
                            this.cancel()
                            this.visible = false
                            this.$emit("refreshDataList")
                        }else{
                            this.submitLoading = false
                            this.$message.error(res.msg)
                        }
                    }).catch(err => {
                        this.submitLoading = false
                        throw err
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    
</style>