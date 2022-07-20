<!-- 直播列表-创建直播 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__liveAdd">
            <el-form
            :model="dataForm"
            :rules="rules"
            ref="dataForm"
            size="small"
            label-width="110px"
            >
                <el-form-item label="直播主题" prop="liveTheme">
                    <el-input 
                        style="width: 400px" 
                        v-model.trim="dataForm.liveTheme"
                        maxlength="60"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="直播宣传图" required>
                    <custom-upload 
                        ref="frontCoverUpload"
                        :fileMaxSize="2"
                        :fileType="['png', 'jpg', 'jpeg']"
                        @uploadSuccess="frontCoverUploadSuccess" 
                        @uploadRemove="frontCoverUploadRemove"
                        :fileList="frontCoverList"></custom-upload>
                    <p class="tips">格式限制：jpg/jpeg/png,建议图片尺寸不小于630px×347px，大小不得超过2M</p>
                </el-form-item>
                <el-form-item label="添加商品" prop="product">
                    <el-input 
                        style="width: 400px" 
                        placeholder="请选择" 
                        v-model="dataForm.product"
                        @click.native="chooseProduct"></el-input>
                </el-form-item>
                <el-form-item label="添加主播" prop="anchor">
                    <el-input 
                        style="width: 400px" 
                        placeholder="请选择" 
                        v-model="dataForm.anchor"
                        @click.native="chooseAnchor"></el-input>
                </el-form-item>
                <el-form-item label="直播背景">
                    <custom-upload 
                        ref="bgLiveUpload"
                        :fileMaxSize="2"
                        :fileType="['png', 'jpg', 'jpeg']"
                        @uploadSuccess="bgLiveUploadSuccess" 
                        @uploadRemove="bgLiveUploadRemove"
                        :fileList="bgLiveList"></custom-upload>
                    <p class="tips">格式限制：jpg/jpeg/png,建议图片尺寸不小于630px×347px，大小不得超过2M</p>
                </el-form-item>
                <el-form-item label="助手" prop="assistantIds">
                    <el-select 
                        style="width: 400px"
                        multiple
                        v-model="dataForm.assistantIds" 
                        placeholder="请选择"
                        :loading="getAssistantLoading"
                        @visible-change="getAssistant"
                        clearable>
                            <el-option 
                                v-for="item in assistantOptions" 
                                :key="item.weixinUserId"
                                :label="item.userName"
                                :value="item.weixinUserId">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel" style="float: right; margin-left: 10px">取消</el-button>
                    <el-button 
                        style="float: right" 
                        type="primary" 
                        :icon="submitLoading ? 'el-icon-loading' : ''"
                        :disabled="submitLoading" 
                        @click="onSubmit">创建直播</el-button>
                </el-form-item>
            </el-form>

            <!-- 主播弹框 -->
            <choose-anchor ref="chooseAnchor" @add="addAnchorConfirm"></choose-anchor>
            <!-- 商品弹框 -->
            <choose-product ref="chooseProduct" @add="addProductConfirm"></choose-product>
        </div>
    </el-card>
</template>
<script>
import CustomUpload from "@/components/common/custom-upload"
import ComModule from "@/mixins/common-module"
import ChooseAnchor from "@/components/chooseDialog/chooseAnchor"
import ChooseProduct from "@/components/chooseDialog/chooseProduct"
export default {
    mixins: [ComModule],
    components: {
        CustomUpload,
        ChooseAnchor,
        ChooseProduct
    },
    data() {
        return {
            dataForm: {
                liveTheme: "", //直播主题
                frontCoverUrl: "", //直播宣传图
                product: "", //推荐商品
                anchor: "", //推荐主播
                frontCover: "", //直播背景
                assistantIds: "" //助手
            },
            frontCoverList: [], //直播宣传图
            bgLiveList: [], //直播背景图
            recommendedAnchorList: [], //推荐主播ids
            productIds: [], //推荐商品ids
            assistantOptions: [], //助手下拉选项
            getAssistantLoading: false, //助手下拉加载动画
            rules: {
                liveTheme: [
                    { required: true, message: "请输入直播主题", trigger: "blur"}
                ]
            },
            submitLoading: false,
        }
    },
    computed: {
        userId() {
            return this.$store.state.user.id
        }
    },
    methods: {
        // 直播宣传图上传
        frontCoverUploadSuccess(file) {
            this.frontCoverList.push(file)
        },
        frontCoverUploadRemove(file) {
            this.frontCoverList = this.frontCoverList.filter(item => item.uid != file.uid)
        },
        // 直播背景图上传
        bgLiveUploadSuccess(file) {
            this.bgLiveList.push(file)
        },
        bgLiveUploadRemove(file) {
            this.bgLiveList = this.bgLiveList.filter(item => item.uid != file.uid)
        },
        // 点击助手下拉选择请求数据
        getAssistant() {
            this.getAssistantLoading = true
             this.$http.get(`/sys/anchorAssistant/live/getAnchorAssistantWithLiveByAnchorId?anchorId=${this.userId}`)
                .then(({ data: res }) => {
                    this.getAssistantLoading = false
                    if (res.code !== 0) return this.$message.error(res.msg);
                    this.assistantOptions = res.data;
                })
                .catch((err) => {
                    this.getAssistantLoading = false
                    this.$message.error(JSON.stringify(err.message))
                });
        },
        // 推荐主播弹框
        chooseAnchor() {
            this.$refs.chooseAnchor.init(this.recommendedAnchorList)
        },

        // 确认添加推荐主播
        addAnchorConfirm(data) {
            this.$refs.chooseAnchor.close()

            this.recommendedAnchorList = data
            this.dataForm.anchor = data.length ? `已选择${data.length}个主播` : ""
        },


        // 推荐商品弹框
        chooseProduct() {
            this.$refs.chooseProduct.init(this.productIds)
        },

        // 确认添加推荐商品
        addProductConfirm(data) {
            this.$refs.chooseProduct.close()

            this.productIds = data
            this.dataForm.product = data.length ? `已选择${data.length}个商品` : ""
        },

        // 取消创建直播
        cancel() {
            this.$refs.dataForm.resetFields()
            this.dataForm.frontCoverUrl = ""
            this.dataForm.frontCover = ""
            this.frontCoverList = []
            this.bgLiveList = []

            this.closeCurrentTab()
            // 关闭当前页面跳回到直播列表
            this.$router.push({ name: "anchorManagement-liveList" })

        },
        // 表单提交
        onSubmit() {
            this.$refs.dataForm.validate(async (valid) => {
                if(valid){
                    
                    try {
                        if(!this.$refs.frontCoverUpload.isUploadAll() || !this.$refs.bgLiveUpload.isUploadAll()){
                            return this.$message.error("有附件正在上传中")
                        }
    
                        if(!this.frontCoverList.length){
                            return this.$message.error("请上传直播宣传图")
                        }
    
                        let params = {}
                        params = JSON.parse(JSON.stringify(this.dataForm))
                        // 删除显示的主播、商品
                        delete params.anchor
                        delete params.product
                        
    
                        // 附件处理
                        params.frontCoverUrl = this.frontCoverList[0].url
                        params.frontCover = this.bgLiveList[0] ? this.bgLiveList[0].url : ""
    
    
                        // 商品ids
                        params.productIds = this.productIds.map(item => item.id)
                        // 主播ids
                        params.recommendedAnchorList = this.recommendedAnchorList.map(item => item.anchorId)
    
                        // 当前主播id
                        params.anchorUserId = this.userId
    
                        console.log(params)
                        this.submitLoading = true
    
                        // 是否有正在直播
                        let { data: living } = await this.$http.get('/sys/mixedflow/getLiving')
    
                        if(living.data){
                            this.$message.warning("当前正在直播中！")
                            this.submitLoading = false
                            return       
                        }
    
                        let { data: creatLive } = await this.$http.post("/sys/liveList/createLiveInLiveList", params)
    
                        this.submitLoading = false
                        if(creatLive.code == 0){
                            this.$message.success("创建直播成功")
                            this.cancel()
                        }else{
                            this.$message.error(creatLive.msg)
                        }
    
                        // this.$http.post("/sys/liveList/createLiveInLiveList", params).then(({ data: res }) => {
                        //     this.submitLoading = false
                        //     if(res.code == 0){
                        //         this.$message.success("创建直播成功")
                        //         this.cancel()
                        //     }else{
                        //         this.$message.error(res.msg)
                        //     }
                        // }).catch(err => {
                        //     this.submitLoading = false
                        //     this.$message.error(JSON.stringify(err.message))
                        // })
                    }catch(err) {
                        this.submitLoading = false
                        this.$message.error(JSON.stringify(err.message))
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .tips {
        color: #666;
    }
    .count {
        display: inline-block;
        margin-left: 10px;
        color: #909399;
    }
</style>