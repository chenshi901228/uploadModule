
<!-- 某会话消息列表 -->
<template>
    <div 
        class="message-content">
            <div class="message-content-header">
                <p>{{conversation && (conversation.userProfile.nick || conversation.userProfile.userID)}}</p>
            </div>
            <div class="message-content-body">
                <p class="handleTips" v-if="msgLoading">{{ msgLoadingText + (uploadProgress * 100)}}%</p>
                <message-content-item :messageList="messageList"></message-content-item>
            </div>
            <div class="message-content-footer">
                <div class="tool">
                    <el-popover
                        placement="top"
                        width="400"
                        trigger="click">
                            <div class="TUI-emoji-image">
                                <img
                                    v-for="(item, index) in emojiList" 
                                    :src="item.url"
                                    :key="index"  
                                    alt=""
                                    @click="handleEnterEmoji(item)">
                            </div>
                            <img 
                                style="width: 20px;height:auto;margin-right:10px;cursor: pointer;" 
                                slot="reference" 
                                src="~@/assets/icon/icon_pmsg_face-emoji.png" alt="">
                    </el-popover>
                    <el-upload
                        action=""
                        multiple
                        accept="image/png,image/jpeg,image/jpg,image/gif" 
                        :limit="1"
                        :show-file-list="false"
                        :file-list="fileList"
                        :http-request="uploadFile">
                            <img 
                                style="width: 20px;height:auto;cursor: pointer;" 
                                src="~@/assets/icon/icon_pmsg_send-img.png" alt="">
                    </el-upload>
                </div>
                <div class="inputArea">
                    <el-input
                        type="textarea"
                        :rows="2"
                        resize="none"
                        placeholder="请输入内容"
                        v-model.trim="textarea">
                    </el-input>
                </div>
                <div class="sendBtn">
                    <el-button type="text" @click="sendMessage">发送</el-button>
                </div>
            </div>
    </div>
</template>
<script>
import { emojiName, emojiUrl, emojiMap } from "./baseUtil/emojiMap"
import MessageContentItem from "./message-content-item.vue"
export default {
    components: {
        MessageContentItem
    },
    props: {
		conversation: {
			type: Object,
			default: () => {}
		},
        tim: {
            type: Object,
			default: () => {}
        }
	},
	watch: {
		conversation: {
			handler: function(newVal) {
				if (!newVal || !newVal.conversationID || !this.tim) return;

                this.nextReqMessageID = ""
                this.messageList = []
                this.isCompleted = false
                this.textarea = ""
                this.fileList = []
                this.$nextTick(() => {
                    // 将某会话下所有未读消息已读上报
                    this.tim.setMessageRead({conversationID: newVal.conversationID});
                    // 拉取消息列表
                    this.getMessageList(newVal);
                })
			},
			immediate: true,
			deep: true
		},
	},
    data() {
        return {
            elParams: null,
            timer: null,
            emojiList: [], //表情列表
            messageList: [], //消息列表
            nextReqMessageID: "", // 下一条消息标志
            isCompleted: false, // 当前会话消息是否已经请求完毕
            messageListLoading: false,
            textarea: "",
            fileList: [],
            msgLoading: false,
            msgLoadingText: "上传进度：",
            uploadProgress: 0, 
        }
    },
    mounted() {
        this.initEmoji()

        this.elParams = document.querySelector(".message-content-body")
        this.elParams.addEventListener("scroll", this.messageContentScroll)
    },
    destroyed() {
        this.elParams.removeEventListener("scroll", this.messageContentScroll)
    },
    methods: {
        // 获取某个会话的消息列表
        getMessageList(conversation) {
            if(this.isCompleted) return //已加载所有消息
            this.messageListLoading = true
            // 打开某个会话时，第一次拉取消息列表
            let params = { 
                conversationID: conversation.conversationID, 
                nextReqMessageID: this.nextReqMessageID,
                count: 15
            }

            // 第一次拉取 不需要分页字段
            if(!this.nextReqMessageID) delete params.nextReqMessageID

            let promise = this.tim.getMessageList(params);
            promise.then((imResponse) => {
                this.messageListLoading = false

                if(this.nextReqMessageID) { //加载更多
                    this.messageList = [...imResponse.data.messageList, ...this.messageList]; // 消息列表。
                }else { //首次刷新
                    this.messageList = imResponse.data.messageList; // 消息列表。
                }

                // 首次拉取滚动到底部
                if(!this.nextReqMessageID) this.scrollToButtom()

                this.nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
                this.isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。



                console.log(imResponse.data)
            });
        },
        // 初始化表情列表
        initEmoji() {
            for (let i = 0; i < emojiName.length; i++) {
			    this.emojiList.push({
                    emojiName: emojiName[i],
                    url: emojiUrl + emojiMap[emojiName[i]]
                });
            }
        },
        getToAccount() {
			if (!this.conversation || !this.conversation.conversationID) {
				return '';
			}

			switch (this.conversation.type) {
				case 'C2C':
					return this.conversation.conversationID.replace('C2C', '');

				case 'GROUP':
					return this.conversation.conversationID.replace('GROUP', '');

				default:
					return this.conversation.conversationID;
			}
		},
        // 发送表情
        handleEnterEmoji(item) {
            this.textarea+=item.emojiName
        },
        // 发送消息
        sendMessage() {
            if(!this.conversation) return this.$message.warning("请选择发送对象")
            if(!this.textarea) return this.$message.warning("请输入要发送的内容")
            const to = this.getToAccount();
			const message = this.tim.createTextMessage({
				to,
				conversationType: this.conversation.type,
				payload: {
					text: this.textarea
				}
			});
            

            let promise = this.tim.sendMessage(message);
            promise.then((imResponse) => {
                // 发送成功
                // console.log(imResponse);
                this.textarea = ""
            }).catch((imError) => {
                // 发送失败
                this.$message.error('sendMessage error:' + imError);
            });
        },


        // 发送图片
        $sendImgMessage(file) {
            const to = this.getToAccount();
            let message = this.tim.createImageMessage({
                to,
                conversationType: this.conversation.type,
                payload: {
                    file: file,
                },
                onProgress: (event) => { this.uploadProgress = event }
            });
            // 2. 发送消息
            let promise = this.tim.sendMessage(message);
            promise.then((imResponse) => {
                // 发送成功
                // console.log(imResponse);
                this.msgLoading = false
                this.fileList = []

            }).catch((imError) => {
                // 发送失败
                this.msgLoading = false
                this.fileList = []
                this.$message.error('sendMessage error:' + imError);

            });
        },


        // 选择图片发送
        uploadFile(param) {
            if(!this.conversation) return this.$message.warning("请选择发送对象")
            if(!this.beforeUpload(param.file)) return
            this.msgLoading = true
            this.$sendImgMessage(param.file)
        },

        // 图片上传之前的回调
        beforeUpload(file){
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                this.$message.error("发送的图片大小不能超过 20MB!");
            }
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif');
            if (!isJPG) {
                this.$message.error("发送的图片格式为 jpg,jpeg,png,gif");
            }
            return isJPG && isLt2M;
        },


        scrollToButtom() {
            this.$nextTick(() => {
                let el = document.querySelector(".message-content-body")
                // el.scrollTop = el.scrollHeight
                el.scrollTo({ top: el.scrollHeight })

                console.log(el)

            })
        },
        messageContentScroll(e) {
            if(!this.timer) {
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.timer = null
                    if(e.target.scrollTop == 0) { //滚到顶部
                        this.getMessageList(this.conversation)
                    }

                }, 500)
            }
        }

    }
}
</script>
<style lang="scss">
    .message-content {
        width: 70%;
        height: 100%;
        border: 1px solid #C0C4CC;
        border-radius: 5px;
        padding: 10px;
        .message-content-header {
            border-bottom: 1px solid #999;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            line-height: 40px;
            height: 40px;
            p {
                margin: 0;
                padding: 0;
            }
        }
        .message-content-body {
            height: calc(100% - 192px);
            overflow-y: auto;
            padding: 10px;
            position: relative;
            .handleTips {
                position: absolute;
                left: 0;
                top: 0;
                text-align: center;
                width: 100%;
                margin: 0;
                padding: 4px 0;
                background: #cacaca;
            }
        }
        .message-content-footer {
            height: 150px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .tool {
                display: flex;
            }
            .inputArea {
                margin: 10px 0;
            }
            .sendBtn {
                align-self: flex-end;
            }
        }
    }
    .TUI-emoji-image {
        max-height: 200px;
        overflow-y: auto;
        img {
            box-sizing: content-box;
            width: 20px;
            height: 20px;
            padding: 4px;
            border: 1px solid transparent;
            &:hover {
                border-color: #999;
            }
        }
    }
</style>