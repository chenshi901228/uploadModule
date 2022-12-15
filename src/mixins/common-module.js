// 通用方法
export default {
    methods: {
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