
<!-- svga动画弹框 -->
<template>
    <el-dialog
        :visible.sync="show"
        :title="svgaData.name"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :append-to-body="true"
    >
        <div id="svgaCanvas" style="width:300px; height:300px; margin: 0 auto;"></div>
    </el-dialog>    
</template>
<script>
import { downloadFileUrl } from "@/utils/index"
import SVGA from "svgaplayerweb"
export default {
    data() {
        return {
            show: false,
            svgaData: {}
        }
    },
    methods: {
        init(row) {
            this.svgaData = row
            this.show = true

            let url  = downloadFileUrl(row.dynamicIcon)

            let xhr = new XMLHttpRequest()

            xhr.open("GET", url)
            xhr.responseType = 'blob';

            xhr.onload = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                let blob = this.response;
                // 转换一个blob链接
                let u = window.URL.createObjectURL(new Blob([blob]));

                var player = new SVGA.Player('#svgaCanvas');
                var parser = new SVGA.Parser('#svgaCanvas'); 
                parser.load(u, (videoItem) => {
                    player.setVideoItem(videoItem);
                    player.startAnimation();
                })

              }
            };
            xhr.onerror = function(){
              console.log('失败');
            }
            xhr.send()



        }
    }
}
</script>