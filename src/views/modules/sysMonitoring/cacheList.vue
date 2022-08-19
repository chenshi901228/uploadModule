<!-- 缓存数据 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-cacheList">
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 缓存列表 -->
                    <div class="cacheList module">
                        <div class="header">
                            <span>缓存列表</span>
                            <i class="el-icon-refresh-right" @click="refresh('cacheList')"></i>
                        </div>
                        <div class="content">
                            <el-table
                                v-loading="cacheListLoading"
                                :data="cacheList"
                                @cell-click="cacheListCellClick"
                                highlight-current-row
                                height="calc(100vh - 50px - 36px - 40px - 44px - 35px)"
                                style="width: 100%"
                                ref="cacheListTable">
                                <el-table-column
                                    header-align="center"
                                    align="center"
                                    v-for="item in cacheTableItem"
                                    :key="item.prop"
                                    :prop="item.prop"
                                    :label="item.label"
                                    show-overflow-tooltip>
                                    <template slot-scope="{ row, $index }">
                                        <span v-if="item.prop == 'index'">{{$index + 1}}</span>
                                        <span v-else>{{row[item.prop]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    :label="$t('handle')"
                                    header-align="center"
                                    align="center">
                                    <template slot-scope="{ row }">
                                        <i class="el-icon-delete" @click="deleteCache(row)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <!-- 键名列表 -->
                    <div class="keyList module">
                        <div class="header">
                            <span>键名列表</span>
                            <i class="el-icon-refresh-right" @click="refresh('keyList')"></i>
                        </div>
                        <div class="content">
                            <el-table
                                v-loading="keyListLoading"
                                :data="keyList"
                                @cell-click="keyListCellClick"
                                highlight-current-row
                                height="calc(100vh - 50px - 36px - 40px - 44px - 35px)"
                                style="width: 100%"
                                ref="keyListTable">
                                <el-table-column
                                    header-align="center"
                                    align="center"
                                    v-for="item in keyTableItem"
                                    :key="item.prop"
                                    :prop="item.prop"
                                    :label="item.label"
                                    show-overflow-tooltip>
                                    <template slot-scope="{ row, $index }">
                                        <span v-if="item.prop == 'index'">{{$index + 1}}</span>
                                        <span v-else>{{row}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    :label="$t('handle')"
                                    header-align="center"
                                    align="center">
                                    <template slot-scope="{ row }">
                                        <i class="el-icon-delete" @click="deleteKey(row)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <!-- 缓存内容 -->
                    <div class="cacheValue module">
                        <div class="header">
                            <span>缓存内容</span>
                            <!-- <span class="deleteAll" @click="deleteContent"><i class="el-icon-refresh-right"></i>清理全部</span> -->
                        </div>
                        <div class="content" v-loading="cacheValueLoading">
                            <el-form ref="form" :model="cacheValue" size="small">
                                <el-form-item label="缓存名称：" prop="cacheName">
                                    <el-input
                                        readonly
                                        v-model="cacheValue.cacheName"
                                        clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="缓存键名：" prop="cacheKey">
                                    <el-input
                                        readonly
                                        v-model="cacheValue.cacheKey"
                                        clearable
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="缓存内容：" prop="cacheValue">
                                    <el-input
                                        readonly
                                        type="textarea"
                                        :autosize="{ minRows: 4, maxRows: 8 }"
                                        v-model="cacheValue.cacheValue"
                                        clearable
                                        resize="none"
                                        placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </el-col>
            </el-row>            
        </div>
    </el-card>
</template>

<script>
import debounce from "lodash/debounce";
export default {
    data() {
        return {
            cacheListLoading: false,
            cacheList: [],
            cacheTableItem: [
                { prop: "index", label: "序号"},
                { prop: "cacheName", label: "缓存名称"},
                { prop: "remark", label: "备注"}
            ],
            keyListLoading: false,
            keyList: [],
            keyTableItem: [
                { prop: "index", label: "序号"},
                { prop: "keyName", label: "缓存键名"}
            ],
            cacheValueLoading: false,
            cacheValue: {
                cacheName: "",
                cacheKey: "",
                cacheValue: ""
            },
            curCacheName: "", //当前选中缓存
            curKeyName: "" //当前选中key
        };
    },
    activated() {
        this.keyList = []
        this.curCacheName = ""
        this.curKeyName = ""
        if(this.$refs.form) this.$refs.form.resetFields()
        this.getCacheList()
    },
    methods: {
        // 获取缓存列表
        getCacheList() {
            this.cacheListLoading = true
            this.$http.get("/sys/monitor/cache/getNames").then(({data: res}) => {
                this.cacheListLoading = false
                this.cacheList = []
                if(res.code != 0) return this.$message.error(res.msg)

                this.cacheList = res.data

            }).catch(err => {
                this.cacheListLoading = false
                this.cacheList = []
                this.$message.error(JSON.stringify(err))
            })
        },
        // 获取键名列表
        getKeyList() {
            this.keyListLoading = true
            this.$http.get(`/sys/monitor/cache/getKeys/${this.curCacheName}`).then(({data: res}) => {
                this.keyListLoading = false
                this.keyList = []
                if(res.code != 0) return this.$message.error(res.msg)

                this.keyList = res.data

            }).catch(err => {
                this.keyListLoading = false
                this.keyList = []
                this.$message.error(JSON.stringify(err))
            })
        },
        // 获取缓存内容
        getValue() {
            this.cacheValueLoading = true
            this.$http.get(`/sys/monitor/cache/getValue/${this.curCacheName}/${this.curKeyName}`).then(({data: res}) => {
                this.cacheValueLoading = false
                this.cacheValue = {}
                if(res.code != 0) return this.$message.error(res.msg)

                this.cacheValue = res.data

            }).catch(err => {
                this.cacheValueLoading = false
                this.cacheValue = {}
                this.$message.error(JSON.stringify(err))
            })
        },
        // 点击缓存列表-更新键名列表
        cacheListCellClick(row, column) {
            if(column.label == this.$t('handle')) return
            this.curCacheName = row.cacheName
            this.$nextTick(() => {
                this.getKeyList()
            })
        },
        // 点击键名列表-更新缓存内容
        keyListCellClick(row, column) {
            if(column.label == this.$t('handle')) return
            this.curKeyName = row
            this.$nextTick(() => {
                this.getValue()
            })
        },
        // 刷新列表
        refresh(name) {
            if(name == "cacheList") {
                this.getCacheList()
            }else if(name == "keyList") {
                if(!this.curCacheName) return
                this.getKeyList()
            }
        },

        // 删除缓存
        deleteCache({ cacheName }) {
            this.$confirm(`确认清除缓存[${cacheName}]`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false,
                showClose: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '清除中...';

                        this.$http.delete(`/sys/monitor/cache/clearCacheName/${cacheName}`).then(({data: res}) => {
                            instance.confirmButtonLoading = false;
                            done()
                            if(res.code != 0) return this.$message.error(res.msg)

                            this.curCacheName = ""
                            this.curKeyName = ""
                            this.keyList = []
                            this.$refs.form.resetFields()

                            this.getCacheList()
            
            
                        }).catch(err => {
                            instance.confirmButtonLoading = false;
                            done()
                            this.$message.error(JSON.stringify(err))
                        })
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                }
            }).then(() => {

            }).catch(() => this.$message.info("取消操作"))
        },
        // 删除键
        deleteKey(row) {
            this.$confirm(`确认清除键[${row}]`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false,
                showClose: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '清除中...';

                        this.$http.delete(`/sys/monitor/cache/clearCacheKey/${row}`).then(({data: res}) => {
                            instance.confirmButtonLoading = false;
                            done()
                            if(res.code != 0) return this.$message.error(res.msg)

                            this.curKeyName = ""
                            this.$refs.form.resetFields()

                            this.getKeyList()
            
            
                        }).catch(err => {
                            instance.confirmButtonLoading = false;
                            done()
                            this.$message.error(JSON.stringify(err))
                        })
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                }
            }).then(() => {

            }).catch(() => this.$message.info("取消操作"))
        },
        // 清除全部缓存内容
        deleteContent() {
            this.$confirm(`确认清除全部缓存内容`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false,
                showClose: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '清除中...';

                        this.$http.delete(`/sys/monitor/cache/clearCacheAll`).then(({data: res}) => {
                            instance.confirmButtonLoading = false;
                            done()
                            if(res.code != 0) return this.$message.error(res.msg)

                            this.curCacheName = ""
                            this.curKeyName = ""
                            this.keyList = []
                            this.$refs.form.resetFields()

                            this.getCacheList()
            
            
                        }).catch(err => {
                            instance.confirmButtonLoading = false;
                            done()
                            this.$message.error(JSON.stringify(err))
                        })
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                }
            }).then(() => {

            }).catch(() => this.$message.info("取消操作"))
        }
    },
};
</script>
<style lang="scss" scoped>
.module {
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        border-bottom: 1px solid #e6ebf5;
        line-height: 40px;
        i {
            cursor: pointer;
            color: #46a6ff;
        }
        .deleteAll {
            cursor: pointer;
            i {
                margin-right: 6px;
            }
            color: #46a6ff;
        }
    }
    .content {
        padding: 15px 20px 20px 20px;
        height: calc(100vh - 50px - 36px - 40px - 44px);

        .el-icon-delete {
            cursor: pointer;
            color: #46a6ff;
        }
    }
}
</style>