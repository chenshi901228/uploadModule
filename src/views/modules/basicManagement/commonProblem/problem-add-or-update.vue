<!-- 新增/编辑常见问题 -->
<template>
    <el-dialog 
        top="20px"
        :title="formData.id ? '编辑' : '新增'" 
        :visible.sync="show" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="50%">
      <el-form
        :model="formData"
        :rules="formRule"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="问题标题" prop="title">
          <el-input style="width: 400px" maxlength="50" v-model="formData.title" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="value">
          <el-input style="width: 400px" type="textarea" maxlength="1000" v-model="formData.value" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="picUrl">
            <upload
                :fileList="picFileList"
                :limit="9"
                :multiple="true"
                :fileMaxSize="1"
                :fileType="['bmp', 'png', 'jpg', 'jpeg']"
                ref="pic"
                @uploadSuccess="picUploadSuccess"
                @uploadRemove="picUploadRemove"
            ></upload>
            <span>最多9张</span>
        </el-form-item>
        <el-form-item label="视频" prop="videoUrl">
            <upload
                :fileList="videoFileList"
                :limit="1"
                :fileMaxSize="50"
                :fileType="['mp4']"
                ref="video"
                @uploadSuccess="videoUploadSuccess"
                @uploadRemove="videoUploadRemove"
            ></upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="show = false">取 消</el-button>
        <el-button :disabled="submitLoading" :loading="submitLoading" size="small" type="primary" @click="submit('form')">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
import debounce from "lodash/debounce"
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
                title: "",
                value: "",
                picUrl: "",
                videoUrl: ""
            },
            questionsId: "",
            picFileList: [],
            videoFileList: [],
            formRule: {
                title: [{ required: true, message: "请输入问题标题", trigger: "blur"}],
                value: [{ required: true, message: "请输入问题内容", trigger: "blur"}],
            },
            submitLoading: false,
        }
    },
    methods: {
        init(data, questionsId) {
            data = JSON.parse(JSON.stringify(data || ""))
            this.questionsId = questionsId
            this.formData = data ? data : {}
            if(data) { //图片、视频地址处理
                if(data.picUrl) {
                    let arr = data.picUrl.split(",")
                    arr.map((item, index) => {
                        let obj = {}
                        obj.name = data.title + index
                        obj.url = item

                        this.picFileList.push(obj)
                    })
                }
                if(data.videoUrl) this.videoFileList.push({ name: data.title, url: data.videoUrl })
            }
            this.show = true
        },
        //图片上传、删除
        picUploadSuccess(file) {
            this.picFileList.push(file)
        },
        picUploadRemove(file) {
            this.picFileList = this.picFileList.filter(item => item.url != file.url)
        },
        //视频上传、删除
        videoUploadSuccess(file) {
            this.videoFileList.push(file);
        },
        videoUploadRemove(file) {
            this.videoFileList = []
        },
        close() {
            this.$refs.form.resetFields()
            this.picFileList = []
            this.videoFileList = []
        },
        submit: debounce(function(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    if(!this.$refs.pic.isUploadAll() || !this.$refs.video.isUploadAll()) return this.$message.warning("还有附件正在上传，请稍后")
                    this.submitLoading = true

                    let params = {...this.formData, questionsId: this.questionsId}
                    params.picUrl = this.picFileList.map(item => item.url).join(",")
                    if(this.videoFileList.length) params.videoUrl = this.videoFileList[0].url
                    if(!params.id) delete params.id


                    this.$http[this.formData.id ? 'put' : 'post']("/sys/sysFrequentlyQuestionsDetails", params).then(({data: res}) => {

                        this.submitLoading = false

                        if(res.code != 0) return this.$message.error(res.msg)
                        this.$message.success(`${this.formData.id ? "修改" : "新增"}问题成功`)

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
        }, 1500, { 'leading': true, 'trailing': false })
    }
}
</script>