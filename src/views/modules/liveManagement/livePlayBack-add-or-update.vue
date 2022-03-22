<template>
    <el-dialog 
        top="20px"
        :visible.sync="visible" 
        :title="!dataForm.id ? $t('add') : $t('update')" 
        :close-on-click-modal="false" 
        @close="cancel"
        :close-on-press-escape="false">
            <el-form
            :model="dataForm"
            :rules="rules"
            ref="dataForm"
            label-width="110px"
            >
                <el-form-item label="回放主题" prop="liveTheme" required>
                    <el-input v-model="dataForm.liveTheme"></el-input>
                </el-form-item>
                <el-form-item label="封面图" required>
                    <custom-upload 
                        ref="frontCoverUpload"
                        @uploadSuccess="frontCoverUploadSuccess" 
                        @uploadRemove="frontCoverUploadRemove"
                        :fileList="frontCoverList"></custom-upload>
                </el-form-item>
                <el-form-item label="主播" prop="anchor" required>
                    <el-select
                        style="width:100%"
                        v-model="dataForm.anchor"
                        filterable
                        remote
                        reserve-keyword
                        clearable
                        placeholder="请输入选择"
                        :remote-method="getAnchorInfo"
                        :loading="loading">
                            <el-option
                                v-for="item in anchorOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视频显示" prop="showMode" required>
                    <el-select
                        style="width:100%"
                        v-model="dataForm.showMode"
                        clearable
                        placeholder="请选择">
                            <el-option label="竖屏" :value="0"></el-option>
                            <el-option label="横屏" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="投放人群" prop="showMode" required>
                    <el-select
                        style="width:100%"
                        v-model="dataForm.showMode"
                        clearable
                        placeholder="请选择">
                            <el-option label="竖屏" :value="0"></el-option>
                            <el-option label="横屏" :value="1"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="回放视频" required>
                    <custom-upload 
                        ref="relationLiveUpload"
                        @uploadSuccess="relationLiveUploadSuccess" 
                        @uploadRemove="relationLiveUploadRemove"
                        :fileType="['mp4','flv']"
                        :fileList="relationLiveList"></custom-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :disabled="submitLoading" size="small" @click="visible = false">取 消</el-button>
                <el-button :disabled="submitLoading" :loading="submitLoading" size="small" type="primary" @click="submit">添 加</el-button>
            </span>
    </el-dialog>
</template>
<script>
import CustomUpload from "@/components/common/custom-upload"
export default {
    components: {
        CustomUpload
    },
    data() {
        return {
            visible: false,
            dataForm: {
                id: null,
                liveTheme: "",
                frontCoverUrl: "",
                anchor: "",
                showMode: null,
                relationLiveUrl: ""
            },
            frontCoverList: [], //封面列表
            loading: false, //输入主播选择loading
            anchorOptions: [], //主播选项
            relationLiveList: [], //视频列表
            rules: {
                liveTheme: [
                    { required: true, message: "请输入直播主题", trigger: "blur"}
                ],
                anchor: [
                    { required: true, message: "请输入主播选择", trigger: "blur"}
                ],
                showMode: [
                    { required: true, message: "请选择视频显示", trigger: "blur"}
                ],
            },
            submitLoading: false,
        }
    },
    methods: {
        init(id) {
            if(id) this.dataForm.id = id
            this.visible = true
        },
        // 封面图上传
        frontCoverUploadSuccess(file) {
            this.frontCoverList.push(file)
        },
        frontCoverUploadRemove(file) {
            this.frontCoverList = this.frontCoverList.filter(item => item.uid != file.uid)
        },
        // 回放视频上传
        relationLiveUploadSuccess(file) {
            this.relationLiveList.push(file)
        },
        relationLiveUploadRemove(file) {
            this.relationLiveList = this.relationLiveList.filter(item => item.uid != file.uid)
        },
        // 输入选择主播
        getAnchorInfo(s) {
            if(s != ""){
                this.loading = true
                this.$http.get("/sys/anchor/info/getSysAnchorInfos/" + s).then(({ data: res }) => {
                    this.loading = false
                    if(res.code == 0) {
                        let arr = []
                        res.data.map(item => {
                            arr.push({
                                value: JSON.stringify({
                                    anchorUser: item.username,
                                    anchorTel: item.phone,
                                    anchorUserId: item.weixinUserId
                                }),
                                label: `主播：${item.username}  手机号：${item.phone}`
                            })
                        })
                        this.anchorOptions = arr
                    }else {
                        this.anchorOptions = []
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.loading = false
                    this.anchorOptions = []
                    throw err
                })
            }else {
                this.anchorOptions = []
            }
        },
        // 取消添加
        cancel() {
            this.$refs.dataForm.resetFields()
            this.dataForm.frontCoverUrl = ""
            this.dataForm.relationLiveUrl = ""
            this.frontCoverList = []
            this.relationLiveList = []
        },
        // 表单提交
        submit() {
            this.$refs.dataForm.validate((valid) => {
                if(valid){

                    if(!this.$refs.frontCoverUpload.isUploadAll() || !this.$refs.relationLiveUpload.isUploadAll()){
                        return this.$message.error("有附件正在上传中")
                    }

                    if(!this.frontCoverList.length){
                        return this.$message.error("请上传封面图")
                    }
                    if(!this.relationLiveList.length){
                        return this.$message.error("请上传视频")
                    }

                    let params = {}
                    params = JSON.parse(JSON.stringify(this.dataForm))
                    
                    delete params.id
                    delete params.anchor

                    let o = JSON.parse(this.dataForm.anchor)

                    params.frontCoverUrl = this.frontCoverList[0].url
                    params.relationLiveUrl = this.relationLiveList[0].url
                    params.videoSize = this.relationLiveList[0].size

                    this.submitLoading = true
                    this.$http.post("/sys/livePlayback/save", {...params, ...o}).then(({ data: res }) => {
                        if(res.code == 0){
                            this.$message.success("添加视频成功")
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