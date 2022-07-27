<!-- 新增/编辑常见问题分类 -->
<template>
    <el-dialog 
        :title="formData.id ? '编辑' : '新增'" 
        :visible.sync="show" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="30%">
      <el-form
        :model="formData"
        :rules="formRule"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="问题分类" prop="classify">
          <el-input maxlength="10" v-model="formData.classify" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="pictureUrl">
            <upload
                :fileList="fileList"
                :limit="1"
                :fileMaxSize="2"
                :fileType="['bmp', 'png', 'jpg', 'jpeg']"
                ref="uploadFile"
                @uploadSuccess="uploadSuccess"
                @uploadRemove="uploadRemove"
            ></upload>
            <span>图片大小必须小于2M,支持bmp、png、jpg、jpeg格式,尺寸为80px*80px</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="show = false">取 消</el-button>
        <el-button :disabled="submitLoading" :loading="submitLoading" size="small" type="primary" @click="submit('form')">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
import Upload from "@/components/common/custom-upload";
export default {
    components: {
        Upload,
    },
    data() {
        return {
            show: false,
            formData: {
                id: "",
                classify: "",
                pictureUrl: ""
            },
            fileList: [],
            formRule: {
                classify: [{ required: true, message: "请输入问题分类", trigger: "blur"}],
                pictureUrl: [{ required: true, message: "请上传分类图标" }],
            },
            submitLoading: false,
        }
    },
    methods: {
        init(data) {
            console.log(this.fileList)
            data = JSON.parse(JSON.stringify(data || ""))
            this.formData = data ? data : {}
            if(data) this.fileList.push({name: data.classify, url: data.pictureUrl})
            this.show = true
        },
        //分类图标上传、删除
        uploadSuccess(file) {
            this.fileList.push(file);
            this.formData.pictureUrl = file.url
        },
        uploadRemove(file) {
            this.fileList = []
            this.formData.pictureUrl = ""
        },
        close() {
            this.$refs.form.resetFields()
            this.fileList = []
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.fileList.length) return this.$message.error("请上传分类图标");

                    if(!this.$refs.uploadFile.isUploadAll()) return this.$message.warning("还有附件正在上传，请稍后")
                    this.submitLoading = true

                    let params = {
                        classify: this.formData.classify,
                        pictureUrl: this.formData.pictureUrl
                    }
                    if(this.formData.id) params.id = this.formData.id
                    this.$http[this.formData.id ? 'put' : 'post']("/sys/sysFrequentlyQuestions", params).then(({data: res}) => {

                        this.submitLoading = false

                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success(`${this.formData.id ? "修改" : "新增"}问题分类成功`)

                        this.$refs[formName].resetFields()
                        this.fileList = []
                        this.show = false
                        this.$emit("refreshData")
                    }).catch(err => {
                        this.submitLoading = false
                        this.$message.error(JSON.stringify(err))
                    })

                }else {
                    console.log("error submit")    
                    return false;
                }
            })
        }
    }
}
</script>