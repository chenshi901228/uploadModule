<!--消息主题内容-->

<template>
    <div>
        <div 
            :class="['messageItem', item.flow === 'out' ? 't-self-message' : 't-recieve-message']" 
            v-for="item in messageList" 
            :key="item.ID">
                <div 
                    v-if="item.type !== 'TIMGroupTipElem'" 
                    :class="['t-message']">
                        <img 
                            class="avatar" 
                            style="margin-right: 10px"
                            :src="item.avatar || require('@/assets/img/default_avatar.png')"
                            v-if="item.flow == 'in'"
                            alt="">
                        <div>
                            <text-message v-if="item.type === 'TIMTextElem'" :message="item"></text-message>
                            <img-message v-if="item.type === 'TIMImageElem'" :message="item"></img-message>
                        </div>
                        <img 
                            style="margin-left: 10px"
                            class="avatar" 
                            :src="item.avatar || require('@/assets/img/default_avatar.png')"
                            v-if="item.flow == 'out'"
                            alt="">
                </div>
        </div>
    </div>
</template>
<script>
import TextMessage from "./messageItem/text-message.vue"
import ImgMessage from "./messageItem/img-message.vue"
export default {
    components: {
        TextMessage,
        ImgMessage
    },
    props: {
        messageList: {
            type: Array,
            default: () => []
        }
    }
}
</script>
<style lang="scss">
    .messageItem {
        display: flex;
        margin-bottom: 10px;
        &.t-self-message {
            justify-content: flex-end;
        }
        &.t-recieve-message {
            justify-content: flex-start;
        }
        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 5px;
        }
        .t-message {
            display: flex;
        }
    }
</style>