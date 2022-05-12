<!-- 主播客服 -->
<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="anchor-service" :style="{ 'height': siteContentViewHeight + 'px' }">
            <div class="message-list">
                <div class="message-list-search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="searchParams">
                    </el-input>
                </div>
                <!-- 会话列表 -->
                <message-list 
                    :messageListLoading="messageListLoading"
                    :conversationList="conversationList" 
                    @conversationSelect="conversationSelect"></message-list>
            </div>
            <!-- 消息列表 -->
            <message-content 
                :conversation="conversation" 
                :tim="tim"></message-content>
        </div>
    </el-card>
</template>
<script>
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import MessageList from "./component/message-list.vue"
import MessageContent from "./component/message-content.vue"
export default {
    components: {
        MessageList,
        MessageContent
    },
    computed: {
        documentClientHeight: {
            get() {
                return this.$store.state.documentClientHeight;
            },
        },
        siteContentViewHeight() {
            var height = this.documentClientHeight - ( 50 + 38 + 30 + 40 + 2 );
            return height;
        },
    },
    mounted() {
        this.loginIM()
    },
    destroyed() {
        if(this.tim) {
            this.tim.logout()
            this.tim.destroy().then(() => {
                console.log('sdk destroyed');
            })
        }
    },
    data() {
        return {
            searchParams: "", //搜索内容
            tim: null,
            conversationList: [], //会话列表
            messageListLoading: false, //会话列表加载loading
            conversation: null, //当前消息
        }
    },
    methods: {
        // 登录im
        async loginIM() {
            let res = await this.$http.get("/sys/manage/tencentCloudIm/getTxCloudUserSig");

            let userId = res.data.data.liveUserId && res.data.data.liveUserId;
            let userSig = res.data.data.userSig && res.data.data.userSig;


            let options = {
                SDKAppID: 1400341701 
            };
            this.tim = TIM.create(options); // SDK 实例通常用 tim 表示
            this.tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
            // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
            this.tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

            // 登录IM
            let promise = this.tim.login({userID: userId, userSig: userSig});

            promise.then((imResponse) => {
                console.log("login success:", imResponse.data); // 登录成功
                if (imResponse.data.repeatLogin === true) {
                    // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
                    console.log(imResponse.data.errorInfo);
                    this.getConversationList()
                }
                
            }).catch((imError) => {
                this.$message.error( 'login error:' + imError ); // 登录失败的相关信息
            });

            // sdk ready 拉取会话列表
            this.tim.on(TIM.EVENT.SDK_READY, (event) => {
                if (event.name === "sdkStateReady") {
                    this.getConversationList()
                }
            });
            // 会话列表更新
            this.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, (event) => {
                console.log('TUI-conversation | onConversationListUpdated  |ok')
                this.conversationList = event.data
            });
        },
        getConversationList() {
            // 拉取会话列表
            this.messageListLoading = true
            let promise = this.tim.getConversationList();
            promise.then((imResponse) => {
                this.messageListLoading = false
                console.log(`TUI-conversation | getConversationList | getConversationList-length: ${imResponse.data.conversationList.length}`)
                this.conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
                console.log(imResponse.data.conversationList)
            }).catch((imError) => {
                console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
                this.messageListLoading = false
            });
        },
        // 选中某个会话拉取消息列表
        conversationSelect(conversation) {
            this.conversation = conversation
        },
    }

}
</script>
<style lang="scss">
    .anchor-service {
        display: flex;
        .message-list {
            width: 30%;
            height: 100%;
            // background: pink;
            padding-right: 10px;
            display: flex;
            flex-direction: column;
            ul {
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                li {
                    list-style: none;
                }
            }
        }

    }
</style>