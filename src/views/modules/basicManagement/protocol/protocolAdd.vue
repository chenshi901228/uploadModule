<!-- 协议-新增 -->
<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__protocolHandle">
            <el-form 
                :model="dataForm"
                :rules="dataFormRule"
                ref="dataForm"
                size="small"
                label-width="100px"
                label-position="right">
                <el-form-item
                    label="协议名称"
                    prop="name">
                        <el-input
                            style="width: 400px"
                            v-model.trim="dataForm.name"
                            placeholder="协议名称"
                            show-word-limit
                            :maxlength="20"
                            clearable
                        >
                        </el-input>
                </el-form-item>
                <el-form-item
                    label="协议标题"
                    prop="title">
                        <el-input
                            style="width: 400px"
                            v-model.trim="dataForm.title"
                            placeholder="协议标题"
                            show-word-limit
                            :maxlength="20"
                            clearable
                        >
                        </el-input>
                </el-form-item>
                <el-form-item
                    label="协议key"
                    prop="consultativeKey">
                        <el-input
                            style="width: 400px"
                            v-model.trim="dataForm.consultativeKey"
                            placeholder="协议key"
                            :maxlength="50"
                            show-word-limit
                            clearable
                        >
                        </el-input>
                </el-form-item>
                <el-form-item
                    label="有效开始日"
                    prop="startDate">
                        <el-date-picker
                            style="width: 400px"
                            v-model="dataForm.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="有效截止日"
                    prop="endDate">
                        <el-date-picker
                            style="width: 400px"
                            v-model="dataForm.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="协议内容"
                    prop="introduce">
                        <custom-edit 
                            ref="customEdit" 
                            @editChange="editChange"></custom-edit>
                </el-form-item>
                <el-form-item>
                    <el-button @click="closeCurrentTab" style="float: right; margin-left: 10px">取消</el-button>
                    <el-button 
                        style="float: right" 
                        type="primary" 
                        :icon="submitLoading ? 'el-icon-loading' : ''"
                        :disabled="submitLoading" 
                        @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>
<script>
import ComModule from "@/mixins/common-module"
import CustomEdit from "@/components/common/customEdit"
export default {
    mixins: [ComModule],
    components: {
        CustomEdit
    },
    data() {
        return {
            dataFormRule: {
                name: [
                    { required: true, message: "请输入协议名称", trigger: 'blur' }
                ],
                title: [
                    { required: true, message: "请输入协议标题", trigger: 'blur' }
                ],
                consultativeKey: [
                    { required: true, message: "请输入协议key", trigger: 'blur' }
                ],
                startDate: [
                    { required: true, message: "请选择协议有效开始日", trigger: 'blur' }
                ],
                endDate: [
                    { required: true, message: "请选择协议有效截止日", trigger: 'blur' }
                ],
                introduce: [
                    { required: true, message: "请输入协议内容", trigger: 'blur' }
                ],
            },
            dataForm: {
                name: "",
                title: "",
                consultativeKey: "",
                startDate: "",
                endDate: "",
                introduce: ""
            },
            submitLoading: false, //提交状态
        }
    },
    methods: {
        // 编辑器内容变化
        editChange(html) {
            this.dataForm.introduce = html
        },
        // 提交
        onSubmit() {
            this.$refs.dataForm.validate((valid) => {
                if(valid) {
                    if(!this.$refs.customEdit.getHTML()) return this.$message.error("请输入协议内容")
        
                    if(new Date(this.dataForm.startDate).getTime() > new Date(this.dataForm.endDate).getTime()) {
                        return this.$message.error("开始时间不能大于结束时间")
                    }
                    // 时间格式处理
                    let obj = {}
                    obj.startDate = this.dataForm.startDate + " 00:00:00"
                    obj.endDate = this.dataForm.endDate + " 00:00:00"


                    this.submitLoading = true
                    this.$http.post("/sys/sysConsultativeManagement", {...this.dataForm, ...obj}).then(({data: res}) => {
                        this.submitLoading = false
                        if(res.code != 0) return this.$message.error(res.msg)

                        this.$message.success("新增协议成功")
                        // 编辑器清空
                        this.$refs.customEdit.resetHtml()
                        // 表单字段重置
                        this.$refs.dataForm.resetFields()
                        this.closeCurrentTab()
                    }).catch(err => {
                        this.submitLoading = false
                        this.$message.error(JSON.stringify(err.message))
                    })
                }
            })
        },
    }
}
</script>
<style lang="scss">
</style>