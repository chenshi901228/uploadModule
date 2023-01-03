
import Cookies from 'js-cookie'
import qs from 'qs'
export default {
    data() {
        return {
            // 设置属性
            mixinTableModuleOptions: {
                getDataListURL: '', // 数据列表接口，API地址
                getDataListIsPage: true, // 数据列表接口，是否需要分页？
                exportURL: '' // 导出接口，API地址
            },
            dataListLoading: false, // 数据列表，loading状态
            params: {}, //get请求额外参数
            page: 1, // 当前页码
            limit: 10, // 每页数
            total: 0, // 总条数
            dataList: [], // 数据列表
            dataListSelections: [], // 数据列表，多选项
            otherViewHeight: 0,
            isOpen: false,
            formItemCount: 3, //搜索栏宽度能放的formItem个数
        }
    },
    computed: {
        documentClientHeight: {
            get() {
                return this.$store.state.documentClientHeight;
            },
        },
        documentClientWidth: {
            get() {
                return this.$store.state.documentClientWidth;
            },
        },
        siteContentViewHeight() {
            var height = this.documentClientHeight - this.otherViewHeight - ( 50 + 36 + 40 + 47 + 2 );
            return height;
        },
        sidebarFold: {
            get() {
                return this.$store.state.sidebarFold;
            },
        }
    },
    watch: {
        isOpen() {
            this.setOtherViewHeight()
        },
        sidebarFold(val) {
            this.setHeaderSearchWidth(val)
        }
    },
    activated() {
        this.setOtherViewHeight()
        this.setHeaderSearchWidth()

        // 防止table刷新错位
        if(this.$refs.table) {
            this.$nextTick(()=>{
            this.$refs.table.doLayout()
            })
        }
    },
    methods: {
        // 搜索栏高度设置
        setOtherViewHeight() {
            setTimeout(() => {
                if(document.querySelector(".headerTool")) {
                    let h = document.querySelector(".headerTool").getBoundingClientRect().height
                    this.otherViewHeight = Math.ceil(h)
                }
            },150)
        },
        // 计算搜索栏宽度能放的formItem个数
        setHeaderSearchWidth(val = false) {
            setTimeout(() => {
                let elFormWidth = this.documentClientWidth - (val ? 64 : 230) - 40
                this.formItemCount = Math.floor(elFormWidth / 300) - 1
            },150)
        },
        // 搜索栏收起/展开
        open() {
            this.isOpen = !this.isOpen
            // this.resetDataForm()
        },

        query() {
            this.dataListLoading = true;
            this.$http.get(this.mixinTableModuleOptions.getDataListURL, {
                params: {
                    page: this.mixinTableModuleOptions.getDataListIsPage ? this.page : null,
                    limit: this.mixinTableModuleOptions.getDataListIsPage ? this.limit : null,
                    ...this.$httpParams(this.dataForm),
                    ...this.$httpParams(this.params)
                },
            }).then(({ data: res }) => {
                this.dataListLoading = false;
                if (res.code !== 0) {
                    this.dataList = [];
                    this.total = 0;
                    return this.$message.error(res.msg);
                }
                this.dataList = this.mixinTableModuleOptions.getDataListIsPage ? res.data.list : res.data
                this.total = this.mixinTableModuleOptions.getDataListIsPage ? res.data.total : 0
            }).catch((err) => {
                this.dataListLoading = false;
                this.$message.error(JSON.stringify(err.message))
                throw err
            });
        },

        getDataList() {
            this.page = 1
            this.query()
        },

        // 新增 / 修改
        addOrUpdateHandle (id) {
            this.$refs.addOrUpdate.init(id)
        },

        // 导出
        exportHandle () {
            var params = qs.stringify({
                'access_token': Cookies.get('access_token'),
                ...this.$httpParams(this.dataForm),
                ...this.$httpParams(this.params)
            })
            window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinTableModuleOptions.exportURL}?${params}`
        },

        // 重置搜索条件
        resetDataForm(formName = "dataForm") {
            this.$refs[formName].resetFields()
            this.getDataList()
        },
        // 分页, 每页条数
        pageSizeChangeHandle(val) {
            this.page = 1
            this.limit = val
            this.query()
        },
        // 分页, 当前页
        pageCurrentChangeHandle(val) {
            this.page = val
            this.query()
        },
        // 多选
        dataListSelectionChangeHandle (val) {
            this.dataListSelections = val
        },

        // 自定义消息提示框
        customConfirm(text = "", cb) {
            this.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose:(action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = "确定";
                        cb(()=>{
                            done()
                            setTimeout(() => {
                                instance.confirmButtonLoading = false;
                            }, 300);
                        })
                    } else {
                        done();
                    }
                }
            })
        },
        // 关闭当前窗口
        closeCurrentTab (data) {
            var tabName = this.$store.state.contentTabsActiveName
            this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
            if (this.$store.state.contentTabs.length <= 0) {
                this.$store.state.sidebarMenuActiveName = this.$store.state.contentTabsActiveName = 'home'
                return false
            }
            if (tabName === this.$store.state.contentTabsActiveName) {
                let cur = this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1]
                let query = {}
                if(Object.keys(cur.query).length) {
                    query = cur.query
                }
                this.$router.push({ name: this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1].name, query: {...query} })
            }
        },
    },
}