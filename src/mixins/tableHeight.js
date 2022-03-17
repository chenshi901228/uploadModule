

export default {
    data() {
        return {
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
        setOtherViewHeight() {
            setTimeout(() => {
                if(document.querySelector(".headerTool")) {
                    let h = document.querySelector(".headerTool").getBoundingClientRect().height
                    this.otherViewHeight = Math.ceil(h)
                }
            },150)
        },
        open() {
            this.isOpen = !this.isOpen
        },
    },
}