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
                        <!-- 富文本编辑器, 容器 -->
                        <div id="J_quillEditor" style="height:280px"></div>
                        <!-- 自定义上传图片功能 (使用element upload组件) -->
                        <el-upload
                            :action="uploadUrl"
                            :show-file-list="false"
                            :before-upload="uploadBeforeUploadHandle"
                            :on-success="uploadSuccessHandle"
                            :on-error="uploadError"
                            style="display: none;">
                            <el-button ref="uploadBtn" type="primary" size="small">{{ $t('upload.button') }}</el-button>
                        </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button style="float: right; margin-left: 10px">取消</el-button>
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
import Cookies from 'js-cookie'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { getImageWH } from "@/utils/index"
export default {
    mixins: [ComModule],
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
            quillEditor: null,
            quillEditorToolbarOptions: [
                ['bold', 'italic', 'underline', 'strike'],
                ['link', 'image', 'video'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ],
            uploadUrl: '',
            videoUploadSize: 50, //视频上传大小限制
            uploading: null, //上传状态
            uploadType: "", //编辑器选择上传图片or视频
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
    mounted() {
        this.quillEditorHandle()
    },
    methods: {
        onSubmit() {

            this.$refs.dataForm.validate((valid) => {
                if(valid) {
                    if(this.quillEditor.getLength() <= 1) return this.$message.error("请输入协议内容")
        
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
                        this.quillEditor.deleteText(0, this.quillEditor.getLength())
                        // 表单字段重置
                        this.$refs.dataForm.resetFields()
                        this.closeCurrentTab()
                    }).catch(err => {
                        this.submitLoading = false
                        this.$message.error(JSON.stringify(err))
                    })
                }
            })
        },
        // 富文本编辑器
        quillEditorHandle () {
            this.quillEditor = new Quill('#J_quillEditor', {
                modules: {
                    toolbar: this.quillEditorToolbarOptions
                },
                theme: 'snow'
            })
            // 自定义上传图片功能 (使用element upload组件)
            this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/oss/file/upload?token=${Cookies.get('access_token')}`
            // 图片
            this.quillEditor.getModule('toolbar').addHandler('image', () => {
                this.uploadType = "image"
                this.$refs.uploadBtn.$el.click()
            })
            // 视频
            this.quillEditor.getModule('toolbar').addHandler('video', () => {
                this.uploadType = "mp4"
                this.$refs.uploadBtn.$el.click()
            })
            // 监听内容变化，动态赋值
            this.quillEditor.on('text-change', () => {
                this.dataForm.introduce = this.quillEditor.root.innerHTML
            })
        },
        // 上传之前
        uploadBeforeUploadHandle (file) {
            return new Promise(async (resolve, reject) => {
                if(this.uploadType == "mp4" && file.type !== 'video/mp4') {
                    this.$message.error(this.$t('upload.tip', { 'format': 'mp4' }))
                    return reject()
                }
                if (this.uploadType == "image" && file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                    this.$message.error(this.$t('upload.tip', { 'format': 'jpg、png、gif' }))
                    return reject()
                }
    
                // 视频上传大小限制
                if(file.type == 'video/mp4' && file.size / 1024 / 1024 > this.videoUploadSize) {
                    this.$message.error(`上传视频不能超过${this.videoUploadSize}M`)
                    return reject()
                }
                // 获取图片宽高
                if(file.type != 'video/mp4') {
                    let d = await getImageWH(file)
                    console.log(d)
                    // return reject()
                }
                this.uploading = this.$loading({
                    lock: true,
                    text: '附件上传中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                resolve()
            })
        },
        // 上传成功
        uploadSuccessHandle (res, file, fileList) {
            if(this.uploading) {
                this.uploading.close()
                this.uploading = null
            }
            if (res.code !== 0) {
                return this.$message.error(res.msg)
            }
            // 光标位置
            let length = this.quillEditor.getSelection().index
            // 判断是mp4或图片
            let type = res.data.url.split(".")
            type = type[type.length - 1].toLocaleLowerCase()

            // 插入内容
            this.quillEditor.insertEmbed(length, type == "mp4" ? "video" : 'image', res.data.url)

            // 调整光标到最后
            setTimeout(() => {
                this.quillEditor.setSelection(length + 1)
            }, 500)
        },
        // 上传失败
        uploadError(err) {
            console.log(err)
            if(this.uploading) {
                this.uploading.close()
                this.uploading = null
            }
        }
    }
}
</script>
<style lang="scss">
.ql-snow {
    .ql-editor {
        img {
            max-width: 100px !important;
        }
    }
}
</style>