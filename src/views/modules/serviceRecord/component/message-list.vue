
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
        background: #E9E9E9;
        margin-top: 10px;
    }
    .message-list-item{
        display: flex;
        padding: 10px;
        cursor: pointer;
        &.active {
            background: #c0c0c0;
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
            max-width: calc(100% - 80px);
            p {
                margin: 0;
                padding: 0;
                max-width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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