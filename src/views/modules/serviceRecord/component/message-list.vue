
<!-- 会话列表 -->
<template>
    <div 
        class="message-list-wrap" 
        v-loading="messageListLoading" 
        element-loading-text="会话列表加载中">
            <div 
                :class="['message-list-item', currentSelect == item.conversationID ? 'active' : '']" 
                v-for="item in conversationList" 
                :key="item.conversationID" 
                @click="handle(item)">
                <img :src="item.userProfile.avatar || require('@/assets/img/default_avatar.png')" alt="">
                <div class="info">
                    <p>{{item.userProfile.nick || item.userProfile.userID}}</p>
                    <p>{{item.lastMessage.messageForShow}}</p>
                </div>
            </div>
    </div>
</template>
<script>
export default {
    props: {
        conversationList: {
            type: Array,
            default: () => {
                return []
            }
        },
        messageListLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentSelect: ""
        }
    },
    methods: {
        handle(item) {
            this.currentSelect = item.conversationID
            this.$emit("conversationSelect", item)
        },
    }
}
</script>
<style lang="scss">
    .message-list-wrap {
        max-height: 100%;
        overflow-y: auto;
        background: #F6F7F9;
        margin-top: 10px;
    }
    .message-list-item{
        display: flex;
        padding: 10px;
        &.active {
            background: #fcfcfc;
        }
        img {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            margin-right: 10px;
        }
        .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            p {
                margin: 0;
                padding: 0;
                &:first-child {
                    font-weight: 600;
                }
                &:last-child {
                    color: #666;
                }
            }
        }
    }
</style>