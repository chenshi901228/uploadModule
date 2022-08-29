<template>
    <div>
        <el-upload
            ref="upload"
            class="upload-demo" 
            list-type="picture-card"
            name="file"
            :action="uploadUrl"
            :multiple="multiple" 
            :limit="limit" 
            :before-upload="beforeUpload" 
            :on-preview="handlePictureCardPreview"
            :on-remove="onRemove" 
            :file-list="fileList"
            :disabled="disabled"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :on-exceed="onExceed">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">图片格式为jpg、jpeg、png、gif，大小不能超过20M</div>
        </el-upload>
        <el-dialog :modal="false" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>


<script>
    import Cookies from 'js-cookie'
    // import SVGA from "@/utils/svga.min.js"
    export default {
        data(){
            return {
                uploadUrl:'',
                dialogImageUrl:'',
                dialogVisible:false
            }
        },
        props:{
            fileList:{
                type:Array,
                default:[]
            },
            multiple:{
                type:Boolean,
                default:true
            },
            limit:{
                type:Number,
                default:null
            },
            disabled:{
              type:Boolean,
              default:false
            }
        },
        created() {
            this.uploadUrl = `${window.SITE_CONFIG['apiURL']}/oss/file/upload?access_token=${Cookies.get('access_token')}`
        },
        methods:{
            // 图片上传成功的回调
            uploadSuccess(res, file, fileList){    
                if(res.code===0){
                    this.$emit('getImg', fileList)
                }else{
                    this.$message.error(res.msg);
                }
            },
            // 图片上传出错的回调
            uploadError(err,file){
                this.$message.error('上传失败！');
            },
            //放大预览
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 图片上传之前的回调
            beforeUpload(file){
                // 增加svga
                let isSvga = file.name.split(".")
                isSvga = isSvga[isSvga.length - 1].toLocaleLowerCase()
                const isLt2M = file.size / 1024 / 1024 < 20;
                if (!isLt2M) {
                    this.$message.error("上传图片大小不能超过 20MB!");
                }
                const isJPG = (file.type === 'image/jpeg' 
                    || file.type === 'image/jpg'
                    || file.type === 'image/png' 
                    || file.type === 'image/gif'
                    || isSvga === "svga");
                if (!isJPG) {
                    this.$message.error("上传头像图片格式为 jpg,jpeg,png,gif,svga");
                }
                return isJPG && isLt2M;
            },
            // 移除文件
            onRemove(file, fileList) {
                this.$emit('getImg', fileList)
            },
            // 文件超出数量限制
            onExceed(file, fileList) {
                this.$message.error(`只能上传${this.limit}张图片！`);
            },
        }
    }
</script>