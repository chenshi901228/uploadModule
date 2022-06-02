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
                <el-form-item label="回放主题" prop="liveTheme">
                    <el-input v-model="dataForm.liveTheme"></el-input>
                </el-form-item>
                <el-form-item label="封面图" required>
                    <custom-upload 
                        ref="frontCoverUpload"
                        @uploadSuccess="frontCoverUploadSuccess" 
                        @uploadRemove="frontCoverUploadRemove"
                        :fileList="frontCoverList"></custom-upload>
                </el-form-item>
                <el-form-item label="主播" prop="anchor">
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
                <el-form-item label="视频显示" prop="showMode">
                    <el-select
                        style="width:100%"
                        v-model="dataForm.showMode"
                        clearable
                        placeholder="请选择">
                            <el-option label="竖屏" :value="0"></el-option>
                            <el-option label="横屏" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="投放人群" prop="dynamicGroupIds">
                    <el-select 
                        style="width:100%"
                        v-model="dataForm.dynamicGroupIds" 
                        placeholder="请选择投放人群"
                        :loading="getDynamicGroupLoading"
                        @visible-change="getDynamicGroup"
                        clearable>
                            <el-option 
                                v-for="item in dynamicGroupOptions" 
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="回放视频" required>
                    <custom-upload 
                        ref="relationLiveUpload"
                        @uploadSuccess="relationLiveUploadSuccess" 
                        @uploadRemove="relationLiveUploadRemove"
                        :fileType="['mp4']"
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
import { getVideoDuration } from "@/utils/index"
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
                relationLiveUrl: "",
                dynamicGroupIds: ""
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
            dynamicGroupOptions: [], //投放人群
            getDynamicGroupLoading: false, //下拉框加载数据loading
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
        // 投放人群下拉请求数据
        getDynamicGroup(value) {
            if(value) { //展开下拉框 请求数据
                if(!this.dataForm.anchor) return this.$message.warning("请先输入搜索选择主播")
                let t = JSON.parse(this.dataForm.anchor)
                this.getDynamicGroupLoading = true
                this.$http.get("/sys/dynamicGroup/getDynamicGroupList", {
                    params: { id: t.anchorUserId}
                }).then(({ data: res }) => {
                    if(res.code == 0) {
                        this.dynamicGroupOptions = res.data
                    }else {
                        this.$message.error(res.msg)
                        this.dynamicGroupOptions = []
                    }
                    this.getDynamicGroupLoading = false
                }).catch(err => {
                    this.getDynamicGroupLoading = false
                    this.dynamicGroupOptions = []
                })
            }
        },
        // 取消添加
        cancel() {
            this.$refs.dataForm.resetFields()
            this.dataForm.frontCoverUrl = ""
            this.dataForm.relationLiveUrl = ""
            this.frontCoverList = []
            this.relationLiveList = []

            this.dynamicGroupOptions = []
        },
        // 表单提交
        submit() {
            this.$refs.dataForm.validate(async (valid) => {
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

                    // 主播信息处理
                    let o = JSON.parse(this.dataForm.anchor)

                    // 附件处理
                    params.frontCoverUrl = this.frontCoverList[0].url
                    params.relationLiveUrl = this.relationLiveList[0].url
                    params.videoSize = this.relationLiveList[0].size
                    let liveDuration = await getVideoDuration(this.relationLiveList[0].url)
                    params.liveDuration = (liveDuration / 60).toFixed(2)

                    // 投放人群处理
                    if(this.dataForm.dynamicGroupIds) {
                        params.dynamicGroupIds = [ params.dynamicGroupIds ]
                    }else{
                        delete params.dynamicGroupIds
                    }
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