<template>
    <div>
        <div v-for="(item, index) in renderDom" :key="index" class="message-body-span">
            <span class="message-body-time">{{renderTime}}</span>
            <span class="message-body-span-text" v-if="item.name === 'span'">{{item.text}}</span>
            <img v-if="item.name === 'img'" class="emoji-icon" :src="item.src" alt="">
        </div>
    </div>
</template>
<script>
import { parseText } from "../baseUtil/message-facade"
import { caculateTimeago } from "../baseUtil/common"
export default {
    props: {
        message: {
			type: Object
		},
    },
    computed: {
        renderDom() {
            return parseText(this.message)
        },
        renderTime() {
            return caculateTimeago(this.message.time * 1000)
        }
    }
}
</script>
<style lang="scss" scoped>
    .message-body-span {
        padding: 10px;
        border-radius: 5px;
        background: #F6F7F9;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
    }
    .message-body-time {
        font-size: 10px;
        color: #999;
        display: inline-block;
        // margin-bottom: 4px;
    }
    .message-body-span-text {
        font-size: 16px;
    }
    .emoji-icon {
        width: 30px;
        height: 30px;
    }
</style>