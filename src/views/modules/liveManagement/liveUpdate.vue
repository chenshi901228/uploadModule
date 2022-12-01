<!-- 直播列表（平台）-编辑直播 -->

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

                <!-- <el-form-item label="直播宣传图" required>
                    <custom-upload ref="frontCoverUpload" :fileMaxSize="2" :fileType="['png', 'jpg', 'jpeg']"
                        @uploadSuccess="frontCoverUploadSuccess" @uploadRemove="frontCoverUploadRemove"
                        :fileList="frontCoverList"></custom-upload>
                    <p class="tips">格式限制：jpg/jpeg/png,建议图片尺寸不小于630px×347px，大小不得超过2M</p>
                </el-form-item> -->

                <el-form-item label="直播宣传图" prop="frontCoverUrl" class="img-item">
                    <div v-if="showDefaultImg" class="img-box-content">
                        <div v-for="item in defaultImg" :key="item" class="img-box">
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="item"
                            fit="cover"
                            @click="choosePic(item)"
                        ></el-image>
                        <img
                            v-if="item === dataForm.frontCoverUrl"
                            class="like-img"
                            src="@/assets/img/like_red.png"
                            alt=""
                        />
                        </div>
                    </div>
                    <div v-for="item in fileList" :key="item" class="img-box">
                        <el-image
                        style="width: 100px; height: 100px"
                        :src="item"
                        fit="cover"
                        @click="choosePic(item)"
                        ></el-image>
                        <img
                        v-if="item === dataForm.frontCoverUrl"
                        class="like-img"
                        src="@/assets/img/like_red.png"
                        alt=""
                        />
                        <img
                        @click="handleRemove(item)"
                        class="close-img"
                        src="@/assets/img/close.png"
                        alt=""
                        />
                    </div>
                    <el-upload
                        ref="frontCoverUpload"
                        class="upload-demo"
                        v-if="showDefaultImg"
                        :action="uploadUrl"
                        :on-success="handleSuccess"
                        list-type="picture-card"
                        :multiple="false"
                        :show-file-list="false"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="直播推广图" prop="spreadUrl" class="img-item">
                    <div v-if="showExtensionImg" class="img-box-content">
                        <div v-for="item in extensionImg" :key="item" class="img-box">
                        <el-image style="width: 100px; height: 100px" :src="item" fit="cover" @click="extensionImgPic(item)"></el-image>
                        <img v-if="item === dataForm.spreadUrl" class="like-img" src="@/assets/img/like_red.png" alt="" />
                        </div>
                    </div>
                    <div v-for="item in extensionList" :key="item" class="img-box">
                        <el-image style="width: 100px; height: 100px" :src="item" fit="cover" @click="extensionImgPic(item)"></el-image>
                        <img v-if="item === dataForm.spreadUrl" class="like-img" src="@/assets/img/like_red.png" alt="" />
                        <img @click="extensionRemove(item)" class="close-img" src="@/assets/img/close.png" alt="" />
                    </div>
                    <el-upload v-if="showExtensionImg" class="upload-demo" :action="uploadUrl" :on-success="extensionSuccess" list-type="picture-card"
                        :multiple="false" :show-file-list="false" :before-upload="beforeAvatarUpload">
                        <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                    </el-form-item>
                    <el-form-item>
                    <div>
                        格式限制：jpg/jpeg/png，图片尺寸为460px × 368px；大小不得超过2M
                    </div>
                </el-form-item>

                <el-form-item label="添加商品" prop="product">
                    <!-- <el-input style="width: 400px" placeholder="请选择" v-model="dataForm.product"
                        @click.native="chooseProduct"></el-input> -->
                    <el-button @click.native="chooseProduct" type="primary">添加</el-button>
                    <div class="product-box" v-if="productIds && !!productIds.length">
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
                    <div class="product-box" v-if="recommendedAnchorList && !!recommendedAnchorList.length">
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
import debounce from "lodash/debounce"
import CustomUpload from "@/components/common/custom-upload"
import ComModule from "@/mixins/common-module"
import ChooseAnchor from "@/components/chooseDialog/chooseAnchor"
import ChooseProduct from "@/components/chooseDialog/chooseProduct"

import Cookies from "js-cookie";
import { getImageWH } from "@/utils"

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
                assistantIds: "", //助手
                spreadUrl:"",//直播推广图
            },
            frontCoverList: [], //直播宣传图
            bgLiveList: [], //直播背景图
            recommendedAnchorList: [], //推荐主播ids
            productIds: [], //推荐商品ids
            assistantOptions: [], //助手下拉选项
            submitLoading: false,

            extensionList:[],//直播推广图
            uploadUrl:"",
            defaultImg:"",//直播宣传图
            showDefaultImg: false,
            showExtensionImg: false,
        }
    },
    computed: {
        userId() {
            return this.$route.query.anchorUserId
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
    created(){
        this.uploadUrl = `${
        window.SITE_CONFIG["apiURL"]
        }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
        this.fileList = [];
        this.extensionList=[]
        this.defaultImg = [];
        this.extensionImg = [];
        this.getCoverPictureList();
        this.getExtensionList()
    },
    methods: {
        // 编辑直播获取直播信息
        getLiveInfo() {
           
            this.$http.get(`/sys/liveList/getDetailed/${this.dataForm.id}`).then(({data: res}) => {
                if(res.code != 0) return this.$message.error(res.msg)

                this.dataForm.liveTheme = res.data.liveTheme || ""
                this.dataForm.frontCoverUrl = res.data.frontCoverUrl || ""
                this.dataForm.spreadUrl = res.data.spreadUrl || ""
                // this.dataForm.product = res.data.productIds && res.data.productIds.length ? `已选择${res.data.productIds.length}个商品` : ""
                // this.dataForm.anchor = res.data.recommendedAnchorList && res.data.recommendedAnchorList.length ? `已选择${res.data.recommendedAnchorList.length}个主播` : ""
                this.dataForm.frontCover = res.data.frontCover || []
                this.dataForm.assistantIds = res.data.assistantIds || []

                // if(res.data.frontCoverUrl) {
                //     this.frontCoverList = [{
                //         name: "frontCoverList",
                //         url: res.data.frontCoverUrl
                //     }]
                // }

                if(res.data.frontCover) {
                    this.bgLiveList = [{
                        name: "bgLiveList",
                        url: res.data.frontCover
                    }]
                }

                // if(res.data.spreadUrl) {
                //     this.extensionList = [{
                //         name: "extensionList",
                //         url: res.data.spreadUrl
                //     }]
                // }
                this.fileList=[]
                this.extensionList=[]
                this.fileList.push(res.data.frontCoverUrl);
                this.extensionList.push(res.data.spreadUrl);

                console.log(this.fileList);

                // this.recommendedAnchorList = res.data.recommendedAnchorList && res.data.recommendedAnchorList.map(item => { return { anchorId: item } })
                // this.productIds = res.data.productIds && res.data.productIds.map(item => { return { id: item } })
                this.recommendedAnchorList  = res.data.recommendedAnchorList && res.data.recommendedAnchorList.map((id, i) => ({ anchorId: id, username: res.data.recommendedAnchors.split(',')[i] }))
                this.productIds  = res.data.productIds && res.data.productIds.map((id, i) => ({ id: id, productName: res.data.products.split(',')[i] }))
                
                if(res.data.productList || res.data.productIds){
                    let productArr=[]
                    for(let obj of res.data.productList){
                        productArr.push({
                            id: obj.productId,
                            stock: obj.stock,
                            productName:obj.productName
                        })
                    }
                    this.productIds = productArr
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
        // 直播推广图上传
        extensionUploadSuccess(file) {
            this.extensionList.push(file);
        },
        extensionUploadRemove(file) {
            this.extensionList = this.extensionList.filter(item => item.uid != file.uid);
        },
         //获取直播封面图
        getCoverPictureList() {
            this.defaultImg=[]
            this.$http
            .get("/sys/livecoverpicture/getCoverPictureList?style=0&classification=0")
            .then(({ data: res }) => {
            if (res.code !== 0) {
                return this.$message.error(res.msg);
            }
            let list = [];

            if (res.data && res.data.length !== 0) {
                res.data.forEach((v) => {
                list.push(v.coverUrl);
                });
            }
            this.defaultImg = list;
            })
            .catch((err) => {
            throw err;
            });
        },
        //获取直播推广图
        getExtensionList() {
            this.$http
            .get(`/sys/livecoverpicture/getCoverPictureList?style=1&classification=3`)
            .then(({ data: res }) => {
            if (res.code !== 0) {
                return this.$message.error(res.msg);
            }
            let list = [];

            if (res.data && res.data.length !== 0) {
                res.data.forEach((v) => {
                list.push(v.coverUrl);
                });
            }
            this.extensionImg = list;
            // this.dataForm.spreadUrl = this.extensionImg[0];
            })
            .catch((err) => {
            throw err;
            });
        },
        //直播推广图上传前
        async beforeAvatarUpload(file) {
            let type = file.type ? file.type.split("/") : file.name.split(".");
            type = type[type.length - 1];
            let fileSize = file.size / 1024 / 1024 < 2;
            if (type != "jpg" && type != "jpeg" && type != "png") {
                this.$message.warning('直播推广图只能是 jpg/jpeg/png 格式!');
                return Promise.reject(false);
            }
            let res = await getImageWH(file)
            if(res && (Math.abs(res.width - 460) > 6 || Math.abs(res.height - 368) > 6) ) {
                this.$message.warning(`图片尺寸大小为460px*368px`);
                return Promise.reject(false);
            }
            if (!fileSize) {
                this.$message.warning('直播推广图大小不能超过 2MB!');
                return Promise.reject(false);
            }
        },
         //删除照片
        handleRemove(url) {
            this.fileList.forEach((v, i) => {
                if (url === v) {
                this.fileList.splice(i, 1);
                }
            });
            this.showDefaultImg = true;
            if (this.fileList.length === 0) {
                this.dataForm.frontCoverUrl = this.defaultImg[0];
            } else {
                this.dataForm.frontCoverUrl = this.fileList[0];
            }
            },
            //选择照片
            choosePic(url) {
            if (url && this.dataForm.frontCoverUrl !== url) {
                this.dataForm.frontCoverUrl = url;
            }
        },
        //上传后
        handleSuccess(response, file, fileList) {
            this.fileList.push(response.data.url);
            this.dataForm.frontCoverUrl = response.data.url;
        },
        //上传后-直播推广图
        extensionSuccess(response, file, fileList) {
            this.extensionList.push(response.data.url);
            this.dataForm.spreadUrl = response.data.url;
        },
        //删除照片-直播推广图
        extensionRemove(url) {
            this.extensionList.forEach((v, i) => {
                if (url === v) {
                this.extensionList.splice(i, 1);
                }
            });
            this.showExtensionImg = true;
            if (this.extensionList.length === 0) {
                this.dataForm.spreadUrl = this.extensionImg[0];
            } else {
                this.dataForm.spreadUrl = this.extensionList[0];
            }
        },
        //选择照片-直播推广图
        extensionImgPic(url) {
            if (url && this.dataForm.spreadUrl !== url) {
                this.dataForm.spreadUrl = url;
            }
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
            this.$refs.chooseAnchor.init(this.recommendedAnchorList, this.userId)
        },

        closeProductId(index) {
            this.productIds.splice(index, 1)
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
            this.$refs.chooseProduct.init(this.productIds, this.userId)
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
            this.extensionList=[]

            this.closeCurrentTab()
            // 关闭当前页面跳回到直播列表
            this.$router.push({ name: "liveManagement-liveList" })

        },
        // 表单提交
        onSubmit: debounce(function() {
            this.$refs.dataForm.validate(async (valid) => {
                if (valid) {

                    try {
                        // if (!this.$refs.frontCoverUpload.isUploadAll() || !this.$refs.bgLiveUpload.isUploadAll() || !this.$refs.frontCoverUpload.isUploadAll()) {
                        //     return this.$message.error("有附件正在上传中")
                        // }

                        // if (!this.extensionList.length) {
                        //     return this.$message.error("请上传直播推广图")
                        // }

                        // if (!this.frontCoverList.length) {
                        //     return this.$message.error("请上传直播宣传图")
                        // }

                        let params = {}
                        params = JSON.parse(JSON.stringify(this.dataForm))
                        // 删除显示的主播、商品
                        delete params.anchor
                        delete params.product


                        // 附件处理
                        params.frontCoverUrl = this.dataForm.frontCoverUrl
                        params.frontCover = this.bgLiveList[0] ? this.bgLiveList[0].url : ""
                        params.spreadUrl=this.dataForm.spreadUrl
                        


                        // 商品ids
                        if(this.productIds){
                            let productArr=[]
                            for(let obj of this.productIds){
                                productArr.push({
                                    productId: obj.id,
                                    stock: obj.stock,
                                })
                            }
                            params.productList = productArr
                        }
                        if(this.productIds)(
                            params.productIds = this.productIds.map(item => item.id)
                        )
                        // 主播ids
                        if(this.recommendedAnchorList){
                            params.recommendedAnchorList = this.recommendedAnchorList.map(item => item.anchorId)
                        }

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
        }, 1500, { 'leading': true, 'trailing': false })
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
        margin-bottom: 5px;
    }

    .el-tag:last-child {
        margin-right: 0
    }
}

/deep/.img-item {
    .el-form-item__content {
      display: flex;
    }
    .img-box-content {
      display: flex;
    }
    .img-box {
      position: relative;
      .el-image {
        margin-right: 10px;
      }
      .like-img {
        position: absolute;
        width: 24px;
        height: 20px;
        left: 0;
        top: 0;
      }
      .close-img {
        position: absolute;
        width: 24px;
        height: 24px;
        top: 0;
        right: 10px;
      }
    }
    .el-upload {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
    }
  }
  /deep/.ql-container {
    height: 300px;
    overflow-y: scroll;
  }
</style>