<template>
    <div class="enterprise">
        <div>
            <p>企业微信二维码：</p>
            <div >
                <el-form :model="dataForm" ref="imgForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="" prop="img" required>
                       <upload
                        :fileList="fileList"
                        :limit="1"
                        :fileMaxSize="2"
                        fileWH="124/124"
                        :isCropImage="true"
                        :fileType="['png', 'jpg', 'jpeg']"
                        ref="uploadFile"
                        @uploadSuccess="uploadSuccess"
                        @uploadRemove="uploadRemove"
                        ></upload>
                        <p class="tips">图片大小限制124px  *  124px</p>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div>
            <p>描述文字：</p>
            <el-input class="enterprise-text" show-word-limit type="textarea" maxlength="20" placeholder="请输入" v-model="dataForm.description"/>
        </div>

        <div class="detalilBox_bottom">
            <!-- <el-button
                size="small"
                type=""
                @click="updateApplyInfoStatus(-1)"
                v-if="diaForm.status === 0"
                >取消</el-button
            > -->
            <el-button
                size="small"
                type="primary"
                @click="addHandle()"
                >确定</el-button
            >
        </div>
    </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import Upload from "@/components/common/custom-upload2";
export default {
    mixins: [mixinViewModule],
    components: {
        Upload
    },
    data() {
        return {
            dataForm: {
                description:'',
            },
            fileList: [],//主播头像
            uploadUrl: "",
        };
    },
   
    created() {
    //    this.query()
    },

    methods:{
        query() {
            this.$http
            .get("sys/sysTwoDimensionCode/getOnly", {

            })
            .then(({ data: res }) => {
            this.dataListLoading = false;
            if (res.code !== 0) {
                return this.$message.error(res.msg);
            }else{
                this.dataForm=res.data
                this.fileList = [
                    {
                    name: new Date().getTime(),
                    url: res.data.twoDimensionCodeUrl || "https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png"
                    }
                ]
            }
            })
            .catch((err) => {
            this.dataListLoading = false;
            throw err;
            });
        },
        addHandle(){
            if(!this.fileList[0]){
                return this.$message.warning("请上传企业微信二维码");
            }
            this.$confirm("确认修改企业微信二维码信息?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
            .then(() => {
            let info={
                id:this.dataForm.id,
                twoDimensionCodeUrl:this.fileList[0].url,
                description:this.dataForm.description,

            }
            this.$http
                .post("sys/sysTwoDimensionCode", info)
                .then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.$message.success("修改企业微信二维码信息成功");
                this.query();
                })
                .catch((err) => {
                throw err;
                });
            })
            .catch(() => {
            this.$message.info("已取消操作");
            });
        },

        // 二维码附件上传，删除
        uploadSuccess(file) {
            this.fileList.push(file);
        },
        uploadRemove(file) {
            this.fileList = []
        },
    }
}
</script>

<style lang="scss">
.enterprise {
    height: 100%;
    background: #fff;
    min-height: calc(100vh - 50px - 38px);
    padding: 20px 30px;
    .enterprise-code{
        margin-left: 0px;
    }
    .enterprise-text{
        margin-left: 90px;
        width: 60%;
    }

    .detalilBox_bottom {
        height: 40px;
        text-align: right;
        padding: 0 20px;
        margin-top: 100px;
    }
}
</style>