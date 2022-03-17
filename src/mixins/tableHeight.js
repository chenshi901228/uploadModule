

export default {
    data() {
        return {
            otherViewHeight: 0,
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
    activated() {
        setTimeout(() => {
            if(document.querySelector(".headerTool")) {
                let h = document.querySelector(".headerTool").getBoundingClientRect().height
                this.otherViewHeight = Math.ceil(h)
            }
        },150)
    },
}