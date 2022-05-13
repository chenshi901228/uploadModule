<template>
    <div>
        <div class="img-message" >
            <span class="message-body-time">{{renderTime}}</span>
            <img :src="renderDom[0].src" alt="" @click="priviewImg()">
        </div>
        <el-dialog
            title="预览"
            :visible.sync="dialogVisible"
            width="70%"
            top="20px">
                <div class="priviewImg">
                    <img :src="renderDom[0].src" alt="">
                </div>
        </el-dialog>
    </div>
</template>
<script>
import { parseImage } from "../baseUtil/message-facade"
import { caculateTimeago } from "../baseUtil/common"
export default {
    props: {
        message: {
			type: Object
		},
    },
    computed: {
        renderDom() {
            return parseImage(this.message)
        },
        renderTime() {
            return caculateTimeago(this.message.time * 1000)
        }
    },
    data() {
        return {
            dialogVisible: false,
            priviewUrl: ""
        }
    },
    methods: {
        priviewImg() {
            if(this.renderDom.length) {
                this.priviewUrl = this.renderDom[0].src
                this.$nextTick(() => {
                    this.dialogVisible = true
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .priviewImg {
        width: 100%;
        text-align: center;
        img {
            max-width: 100%;
        }
    }
    .img-message {
        padding: 10px;
        border-radius: 5px;
        background: #F6F7F9;
        display: flex;
        flex-direction: column;
        .message-body-time {
            font-size: 10px;
            color: #999;
            display: inline-block;
            // margin-bottom: 4px;
        }
        img {
            width: 250px;
            cursor: pointer;
        }
    }
</style>