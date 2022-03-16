export default {
    computed: {
        documentClientHeight: {
            get() {
                return this.$store.state.documentClientHeight;
            },
        },
        siteContentViewHeight() {
            var height = this.documentClientHeight - this.otherViewHeight - ( 50 + 38 + 30 + 40 + 47 );
            return height;
        },
    }
}