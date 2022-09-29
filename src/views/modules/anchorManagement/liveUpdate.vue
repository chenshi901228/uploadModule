<!-- 直播列表（主播）-编辑直播 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-live__liveAdd">
            <div style="height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;">
                编辑直播
            </div>
            <el-form :model="dataForm" ref="dataForm" size="small" label-width="110px">
                <div style="display:flex">
                    <el-form-item label="直播主题" prop="liveTheme">
                        <el-input style="width: 400px" disabled v-model.trim="dataForm.liveTheme" maxlength="60" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="助手" prop="assistantIds">
                        <el-select style="width: 400px" multiple v-model="dataForm.assistantIds" placeholder="请选择" clearable>
                            <el-option v-for="item in assistantOptions" :key="item.weixinUserId" :label="item.label"
                                :value="item.weixinUserId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <el-form-item label="直播宣传图" required>
                    <custom-upload ref="frontCoverUpload" :fileMaxSize="2" :fileType="['png', 'jpg', 'jpeg']"
                        @uploadSuccess="frontCoverUploadSuccess" @uploadRemove="frontCoverUploadRemove"
                        :fileList="frontCoverList"></custom-upload>
                    <p class="tips">格式限制：jpg/jpeg/png,建议图片尺寸不小于630px×347px，大小不得超过2M</p>
                </el-form-item>
                <el-form-item label="添加商品" prop="product">
                    <!-- <el-input style="width: 400px" placeholder="请选择" v-model="dataForm.product"
                        @click.native="chooseProduct"></el-input> -->
                    <el-button @click.native="chooseProduct" type="primary">添加</el-button>
                    <div class="product-box" v-if="!!productIds.length">
                        <el-tag
                            v-for="(item, index) in productIds"
                            :key="index"
                            closable
                            @close="closeProductId(index)"
                            type="info">
                            {{item.productName}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="添加主播" prop="anchor">
                    <!-- <el-input style="width: 400px" placeholder="请选择" v-model="dataForm.anchor"
                        @click.native="chooseAnchor"></el-input> -->
                    <el-button @click.native="chooseAnchor" type="primary">添加</el-button>
                    <div class="product-box" v-if="!!recommendedAnchorList.length">
                        <el-tag
                            v-for="(item, index) in recommendedAnchorList"
                            :key="index"
                            closable
                            @close="closeAnchor(index)"
                            type="info">
                            {{item.username}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="直播背景">
                    <custom-upload ref="bgLiveUpload" :fileMaxSize="2" :fileType="['png', 'jpg', 'jpeg']"
                        @uploadSuccess="bgLiveUploadSuccess" @uploadRemove="bgLiveUploadRemove" :fileList="bgLiveList">
                    </custom-upload>
                    <p class="tips">格式限制：jpg/jpeg/png,建议图片尺寸不小于630px×347px，大小不得超过2M</p>
                </el-form-item>
         
                
            </el-form>
<el-button style="background-color: #3558CC;" type="primary" size="small" :icon="submitLoading ? 'el-icon-loading' : ''"
                        :disabled="submitLoading" @click="onSubmit">修改</el-button>
                    <el-button @click="cancel" size="small" style=" margin-left: 10px">取消</el-button>
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
                id: "",
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
            submitLoading: false,
        }
    },
    computed: {
        userId() {
            return this.$store.state.user.id
        }
    },
    activated() {
        let id = this.$route.query.id
        if(id) { //编辑
            this.dataForm.id = id
            this.getAssistant()
            this.getLiveInfo()
        }
    },
    methods: {
        // 编辑直播获取直播信息
        getLiveInfo() {
            this.$http.get(`/sys/liveList/getDetailed/${this.dataForm.id}`).then(({data: res}) => {
                if(res.code != 0) return this.$message.error(res.msg)

                this.dataForm.liveTheme = res.data.liveTheme || ""
                this.dataForm.frontCoverUrl = res.data.frontCoverUrl || ""
                this.dataForm.product = res.data.productIds && res.data.productIds.length ? `已选择${res.data.productIds.length}个商品` : ""
                this.dataForm.anchor = res.data.recommendedAnchorList && res.data.recommendedAnchorList.length ? `已选择${res.data.recommendedAnchorList.length}个主播` : ""
                this.dataForm.frontCover = res.data.frontCover || ""
                this.dataForm.assistantIds = res.data.assistantIds || []

                if(res.data.frontCoverUrl) {
                    this.frontCoverList = [{
                        name: "frontCoverList",
                        url: res.data.frontCoverUrl
                    }]
                }

                if(res.data.frontCover) {
                    this.bgLiveList = [{
                        name: "bgLiveList",
                        url: res.data.frontCover
                    }]
                }

                // this.recommendedAnchorList = res.data.recommendedAnchorList && res.data.recommendedAnchorList.map(item => { return { anchorId: item } })
                // this.productIds = res.data.productIds && res.data.productIds.map(item => { return { id: item } })
                let productNames = res.data.products && res.data.products.split(',') || []
                if(!!productNames.length && res.data.productIds && !!res.data.productIds.length) {
                    for(let i = 0; i < productNames.length - 1; i++) {
                        this.productIds[i] = {
                            id: res.data.productIds[i],
                            productName: productNames[i],
                        }
                    }
                }

                let anchorNames = res.data.recommendedAnchors && res.data.recommendedAnchors.split(',') || []
                if(!!anchorNames.length && res.data.recommendedAnchorList && !!res.data.recommendedAnchorList.length) {
                    for(let i = 0; i < anchorNames.length - 1; i++) {
                        this.recommendedAnchorList[i] = {
                            id: res.data.recommendedAnchorList[i],
                            username: anchorNames[i],
                        }
                    }
                }

            }).catch(err => this.$message.error(JSON.stringify(err.message)))
        },
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
            this.$http.get(`/sys/anchorAssistant/live/getAnchorAssistantWithLiveByAnchorId?anchorId=${this.userId}`)
                .then(({ data: res }) => {
                    this.assistantOptions = []
                    if (res.code !== 0) return this.$message.error(res.msg);
                    res.data.map(item => {
                        let obj = {
                            weixinUserId: item.weixinUserId,
                            label: `助手昵称：${item.userName} 手机号：${item.phone || "-"}`
                        }
                        this.assistantOptions.push(obj);
                    })
                })
                .catch((err) => {
                    this.assistantOptions = []
                    this.$message.error(JSON.stringify(err.message))
                });
        },
        // 推荐主播弹框
        chooseAnchor() {
            this.$refs.chooseAnchor.init(this.recommendedAnchorList)
        },
        closeAnchor(index) {
            this.recommendedAnchorList.splice(index, 1)
        },

        // 确认添加推荐主播
        addAnchorConfirm(data) {

            this.recommendedAnchorList = data
            this.dataForm.anchor = data.length ? `已选择${data.length}个主播` : ""
        },


        // 推荐商品弹框
        chooseProduct() {
            console.log(this.productIds)
            this.$refs.chooseProduct.init(this.productIds)
        },

        closeProductId(index) {
            this.productIds.splice(index, 1)
        },

        // 确认添加推荐商品
        addProductConfirm(data) {

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
                if (valid) {

                    try {
                        if (!this.$refs.frontCoverUpload.isUploadAll() || !this.$refs.bgLiveUpload.isUploadAll()) {
                            return this.$message.error("有附件正在上传中")
                        }

                        if (!this.frontCoverList.length) {
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
                        if(this.productIds){
                            params.productIds = this.productIds.map(item => item.id)
                        }else{
                            params.productIds=[]
                        }
                        // 主播ids
                        if(this.recommendedAnchorList){
                            params.recommendedAnchorList = this.recommendedAnchorList.map(item => item.anchorId)
                        }else{
                            params.recommendedAnchorList=[]
                        }
                        //  params.productIds = this.productIds.map(item => item.id)
                        //  params.recommendedAnchorList = this.recommendedAnchorList.map(item => item.anchorId)

                        // 当前主播id
                        params.anchorUserId = this.userId

                        this.submitLoading = true


                        let { data: creatLive } = await this.$http.put("/sys/liveList/editLive", params)

                        this.submitLoading = false
                        if (creatLive.code == 0) {
                            this.$message.success("修改直播成功")
                            this.cancel()
                        } else {
                            this.$message.error(creatLive.msg)
                        }
                    } catch (err) {
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
/deep/ .upload-demo .custom-style {
    width: 380px;
    height: 180px;
    border: 1px solid #dcdfe6;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 2px;
}
/deep/ .el-card__body {
    padding: 0 20px 20px;
}
/deep/.product-box {
    width: 400px;
    border-radius: 5px;
    border: 1px solid #D7DAE2;
    padding: 12px;
    margin-top: 10px;

    .el-tag {
        margin-right: 10px;
    }

    .el-tag:last-child {
        margin-right: 0
    }
}
</style>