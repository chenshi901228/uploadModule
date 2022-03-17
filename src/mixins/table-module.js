
import Cookies from 'js-cookie'
import qs from 'qs'
export default {
    data() {
        return {
            // 设置属性
            mixinTableModuleOptions: {
                getDataListURL: '', // 数据列表接口，API地址
                exportURL: '' // 导出接口，API地址
            },
            dataListLoading: false, // 数据列表，loading状态
            page: 1, // 当前页码
            limit: 10, // 每页数
            total: 0, // 总条数
            dataList: [], // 数据列表
            dataListSelections: [], // 数据列表，多选项
            otherViewHeight: 0,
            isOpen: false
        }
    },
    computed: {
        documentClientHeight: {
            get() {
                return this.$store.state.documentClientHeight;
            },
        },
        siteContentViewHeight() {
            var height = this.documentClientHeight - this.otherViewHeight - ( 50 + 40 + 30 + 40 + 47 );
            return height;
        },
    },
    watch: {
        isOpen() {
            this.setOtherViewHeight()
        }
    },
    activated() {
        this.setOtherViewHeight()
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
        // 搜索栏收起/展开
        open() {
            this.isOpen = !this.isOpen
        },

        query() {
            this.dataListLoading = true;
            this.$http.get(this.mixinTableModuleOptions.getDataListURL, {
                params: {
                    page: this.page,
                    limit: this.limit,
                    ...this.$httpParams(this.dataForm),
                },
            }).then(({ data: res }) => {
                this.dataListLoading = false;
                if (res.code !== 0) {
                    this.dataList = [];
                    this.total = 0;
                    return this.$message.error(res.msg);
                }
                this.dataList = res.data.list;
                this.total = res.data.total;
            }).catch((err) => {
                this.dataListLoading = false;
                throw err
            });
        },

        getDataList() {
            this.page = 1
            this.query()
        },


        // 导出
        exportHandle () {
            var params = qs.stringify({
                'access_token': Cookies.get('access_token'),
                page: this.page,
                limit: this.limit,
                ...this.$httpParams(this.dataForm)
            })
            window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinTableModuleOptions.exportURL}?${params}`
        },

        // 重置搜索条件
        resetDataForm() {
            this.$refs.dataForm.resetFields()
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
    },
}