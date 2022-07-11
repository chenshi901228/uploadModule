
<template>
    <el-dialog
        top="20px"
        :visible.sync="show"
        :title="svgaData.name"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <div id="svgaCanvas" style=""></div>
    </el-dialog>    
</template>
<script>
import SVGA from "@/utils/svga.min.js"
export default {
    data() {
        return {
            show: false,
            svgaData: {}
        }
    },
    methods: {
        init(row) {
            this.show = true

            var player = new SVGA.Player('#svgaCanvas');
            var parser = new SVGA.Parser('#svgaCanvas'); 
            parser.load(row.dynamicIcon, (videoItem) => {
                player.setVideoItem(videoItem);
                player.startAnimation();
            })
        }
    }
}
</script>