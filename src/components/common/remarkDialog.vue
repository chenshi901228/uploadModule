<template>
    <!-- 备注弹框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" top="0" custom-class="custom-dialog-top" width="30%">
        <div class="dialog" style="display:flex;">
            <p style="width:50px; margin:0">备注<span style="color:red">*</span></p>
            <el-input
                type="textarea"
                maxlength="100"
                show-word-limit
                :rows="6"
                placeholder="请输入备注"
                v-model="remark">
            </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" :disabled="confirmLoading" :loading="confirmLoading" type="primary" @click="confirmHandle">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false, //备注弹框
            remark: "", //备注
            confirmLoading: false, //弹框确认loading
            formData: null, //数据保存
        }
    },
    props: {
        title: {
            type: String,
            default: "提示"
        }
    },
    methods: {
        init(data) {
            if(data) this.formData = data
            this.remark = ""
            this.dialogVisible = true
        },
        close() {
            this.dialogVisible = false
        },
        /**
         * @description: 返回remark, init传的参数, cb(必须)关闭loading icon
         */
        confirmHandle() {
            if(!this.remark) return this.$message.error("请输入备注");
            this.confirmLoading = true
            this.$emit("confirm", this.remark, this.formData, ()=>{
                this.confirmLoading = false
            })
        }
    }

}
</script>
<style lang="scss">
    .custom-dialog-top{
        transform: translateY(50%);
    }
</style>