<template>
  <div class="my-message">
    <div class="message-box flex">
      <div class="left">
        <div class="left-search">
          <el-input
            placeholder="搜索"
            suffix-icon="el-icon-search"
            v-model="searchValue"
            @keyup.enter.native="searchMessage"
            @blur="searchMessage">
          </el-input>
        </div>

        <div class="left-btn">
          <el-radio-group v-model="messageStatus" @change="getDiffStatusList(messageStatus)">
            <el-radio-button :label="-1">
              全部消息<span>（{{ +messageCount.readNum +  +messageCount.unReadNum}}）</span>
            </el-radio-button>
            <el-radio-button :label="0">
              未读<span>（{{ messageCount.unReadNum || 0 }}）</span>
            </el-radio-button>
            <el-radio-button :label="1">
              已读<span>（{{ messageCount.readNum || 0 }}）</span>
            </el-radio-button>
          </el-radio-group>
        </div>

        <div class="left-list" v-if="!!messageList.length">
          <div
            class="msg-box"
            v-for="(item, index) in messageList"
            :key="index"
            @click="readMessage(item, index)"
          >
            <div class="message-icon">
              <i class="el-icon-s-check"></i>
            </div>
            <div class="message-content">
              <div class="top">
                <span class="title">{{ item.title }}</span>
                <span class="date">{{ item.senderDate }}</span>
              </div>
              <div class="bottom">
                <span class="msg">{{ item.content }}</span>
                <el-tag
                  :type="item.readStatus == 1 ? 'info' : 'danger'">
                  {{item.readStatus == 1 ? '已读' : '未读'}}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="more-btn" v-if="messageList.length < total && total > 0">
            <el-button type="text" @click="moreMessage">更多消息</el-button>
          </div>
        </div>
        <div v-else>
          <el-empty :description="tip"></el-empty>
        </div>
      </div>
      
      <div class="right">
        <div class="right-top">
          <span class="title">{{ messageInfo.title }}</span>
          <span class="date">{{ messageInfo.senderDate }}</span>
        </div>

        <div class="right-content">
          <div class="msg">{{ messageInfo.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  
  data() {
    return {
      searchValue: '',//搜索关键词
      messageStatus: 0,//消息状态
      messageList: [],
      messageInfo: {},
      limit: 10,
      page: 1,
      total: 0,
      unReadCount: 0,//未读数量
      messageCount: {},//消息数量
      tip: '获取中...',
    }
  },

  created() {
    const params = this.messageStatus == -1 ?
        {} : {
          readStatus: this.messageStatus,
        }
    this.getUnReadCount()
    this.getMessageList(params)
  },

  methods: {
    getUnReadCount() {
      this.$http.get(`/sys/personalNotice/getNoticeCount`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }

          const { data } = res
          this.messageCount = data || {}
        })
        .catch(err => {
          return this.$message.error(err.msg)
        })
    },
    init() {
      this.tip = '获取中...'
      this.total = 0
      this.searchValue = ''
      this.page = 1
      this.messageList = []
      this.messageInfo = {}
    },
    getDiffStatusList(status) {
      this.init()
      const params = status == -1 ?
        {} : {
          readStatus: status,
        }
      this.getMessageList(params)
    },
    getMessageList(params) {
      const obj = {
        page: this.page,
        limit: this.limit,
        ...params
      }
      this.$http.get(`/sys/personalNotice/page`, { params: obj })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          const { data } = res
          if(!data) return
          const { list, total } = data
          this.total = total
          this.messageList.push(...list)
          if(total === 0) this.tip = '暂无消息'
          if(this.messageList.length < total) {
            this.page ++
          }
        })
        .catch(err => {
          return this.$message.error(err.msg)
        })
    },
    searchMessage() {
      this.total = 0
      this.page = 1
      this.messageList = []
      this.messageInfo = {}
      const params = this.messageStatus == -1 ?
        {
          title: this.searchValue,
        } : {
          readStatus: this.messageStatus,
          title: this.searchValue,
        }
      this.getMessageList(params)
    },
    moreMessage() {
      const params = this.messageStatus == -1 ?
        {} : {
          readStatus: this.messageStatus,
        }
      this.getMessageList(params)
    },
    readMessage(item, index) {
      const params = {
        noticeId: item.id
      }
      this.$http.get(`/sys/personalNotice/updateReadStatus`, { params: params })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          const { data } = res
          this.messageInfo = data || item
          this.messageList[index].readStatus = '1'
          this.getUnReadCount()
        })
        .catch(err => {
          return this.$message.error(err.msg)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-message {
  padding: 20px;
  width: 100%;
  height: 800px;
  background: #fff;

  .flex {
    display: flex;
    align-items: flex-start;
  }

  .message-box {
    border: 2px solid #E6E6E6;
    height: 100%;

    .left {
      width: 500px;
      height: 100%;
      padding: 30px 20px 0;

      &-search {
        width: 100%;
      }

      &-btn {
        margin: 20px 0;
        
        /deep/.el-radio-group {
            font-size: initial;
            line-height: normal;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /deep/.el-radio-button__inner {
            width: 150px;
            height: 40px;
            border: 1px solid #D7DAE2;
            border-radius: 5px;
            background: #fff;
            font-size: 16px;
            font-weight: 300;
            color: #333;
        }

        /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner {
            color: #fff;
            background: #3558CC;
            border: 1px solid #3558CC;
        }
      }

      &-list {
        height: calc(100% - 120px);
        overflow-y: auto;

        .msg-box:last-child {
          border-bottom: none;
        }
        
        .msg-box {
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E5E5E5;
          cursor: pointer;

          .message-icon {
            width: 40px;
            height: 40px;
            background: #E69A27;
            border-radius: 50%;
            text-align: center;
            color: #fff;

            .el-icon-s-check {
              font-size: 18px;
              line-height: 40px;
            }
          }

          .message-content {
            width: calc(100% - 50px);

            .top {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .title {
                color: #303133;
                font-size: 14px;
                font-weight: 400;
              }

              .date {
                color: #A9ABB3;
                font-size: 12px;
                font-weight: 400;
              }
            }

            .bottom {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .msg {
                color: #A9ABB3;
                font-size: 12px;
                font-weight: 400;
                width: calc(100% - 100px);
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow:ellipsis;
                word-break: break-all;
              }
            }
          }
        }

        .more-btn {
          width: 100%;
          text-align: center;
        }
      }
    }

    .right {
      width: calc(100% - 500px);
      height: 100%;
      border-left: 2px solid #E6E6E6;
      background: #F7F7F7;

      &-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 130px;
        border-bottom: 2px solid #E6E6E6;;
        background: #fff;

        .title {
          color: #707070;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .date {
          color: #A9ABB3;
          font-size: 12px;
          font-weight: 400;
        }
      }

      &-content {
        margin: 30px 20px;
        height: calc(100% - 190px);
        background: #fff;

        .msg {
          border: 1px solid #EBEEF5;
          padding: 50px 24px;
          height: 100%;
          overflow-y: auto;
          color: #3C3938;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
    
}
</style>