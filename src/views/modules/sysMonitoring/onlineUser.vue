<!-- 在线用户 -->

<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-onlineUser">
            <el-form
                class="headerTool"
                :inline="true"
                :model="dataForm"
                ref="dataForm"
                size="small"
                label-width="100px"
                label-position="right"
                @keyup.enter.native="getDataList">
                <el-form-item
                    label="手机号码"
                    prop="phone"
                >
                    <el-input
                        maxlength="11"
                        style="width: 200px"
                        v-model.trim="dataForm.phone"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <el-form-item
                    label="手机型号"
                    prop="phoneModel"
                >
                    <el-input
                        style="width: 200px"
                        maxlength="20"
                        v-model.trim="dataForm.phoneModel"
                        placeholder="请输入"
                        clearable></el-input>
                </el-form-item>
                <div class="headerTool-search-btns">
                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            size="mini"
                            @click="getDataList"
                            >{{ $t("query") }}</el-button
                        >
                        <el-button
                            icon="el-icon-refresh"
                            size="mini"
                            @click="resetDataForm()"
                            >{{ $t("reset") }}</el-button
                        >
                        <!-- <el-button size="mini" plain @click="open">
                            <i
                                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                            ></i>
                            {{ isOpen ? "收起" : "展开" }}
                        </el-button> -->
                    </el-form-item>
                </div>

                <!-- 操作按钮 -->
                <div class="headerTool-handle-btns">
                    <div class="headerTool--handle-btns-left">
                        <!-- <el-form-item>
                            <el-button 
                            type="warning"
                            plain
                            icon="el-icon-download" 
                            size="mini"
                            @click="exportHandle">{{ $t("export") }}</el-button>
                        </el-form-item> -->
                    </div>
                    <div class="headerTool--handle-btns-right">
                        <el-form-item>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="刷新"
                            placement="top"
                        >
                            <el-button
                            size="small"
                            icon="el-icon-refresh"
                            circle
                            @click="query"
                            ></el-button>
                        </el-tooltip>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <el-table
                v-loading="dataListLoading"
                :data="dataList"
                :height="siteContentViewHeight"
                style="width: 100%"
                ref="table"
            >
                <el-table-column
                    header-align="center"
                    align="center"
                    v-for="item in tableItem"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    show-overflow-tooltip
                >
                    <template slot-scope="{ row, $index }">
                        <!-- 序号 -->
                        <span v-if="item.prop == 'index'">
                            {{($index + 1) + ((page - 1) * limit)}}
                        </span>
                        <span v-else>
                            {{row[item.prop]}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('handle')"
                    fixed="right"
                    header-align="center"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            type="text"
                            size="small"
                            icon="el-icon-delete"
                            @click="logoutUser(row)">强退</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
            >
            </el-pagination>

        </div>
    </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
    mixins: [mixinTableModule],
    data() {
        return {
            mixinTableModuleOptions: {
                getDataListURL: "/sys/monitor/loginUser", // 数据列表接口，API地址
            },
            dataForm: {
                phone: "",
                phoneModel: "",
            },

            tableItem: [
                { prop: "index", label: "序号" },
                { prop: "phone", label: "手机号码" },
                { prop: "token", label: "tokenid" },
                { prop: "phoneModel", label: "手机型号" },
                { prop: "version", label: "小程序版本号" },
                { prop: "createDate", label: "登录时间" },
            ],
        };
    },
    created() {
        // this.query()
    },
    activated() {
        this.query();
    },
    methods: {
        // 强退
        logoutUser({ phone, weixinUserId }) {
            this.$confirm(`确认强退[${phone}]`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false,
                showClose: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '强退中...';

                        this.$http.put("/sys/manage/weixinUser/forbiddenUsere", { userIds: [ weixinUserId ]}).then(({data: res}) => {
                            instance.confirmButtonLoading = false;
                            done()
                            if(res.code != 0) return this.$message.error(res.msg)

                            this.$message.success("强退成功")
                            this.$refs.dataForm.resetFields()
                            this.getDataList()
            
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

    },
};
</script>
<style lang="scss" scoped>
</style>