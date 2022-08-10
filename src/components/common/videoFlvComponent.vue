<!--flv播放-->

<template>
    <div style="max-width:100%">
        <video style="max-width:100%" class="flvVideo" controls></video>
    </div>
</template>
<script>
import flvJs from "flv.js" 
import { downloadFileUrl } from "@/utils/index"
export default {
    props: {
        url: {
            type: String,
            required: true,
            default: ""
        }
    },
    data(){
        return {
            flvPlayer: null
        }
    },
    watch: {
        url(val) {
            if(val) this.flvVideoHandle(this.url)
        }
    },
    destroyed() {
        if(this.flvPlayer) this.flvPlayer.destroy()
    },
    methods: {
        flvVideoHandle(url) {
            let el = document.querySelector(".flvVideo")
            if(el && flvJs.isSupported()) {
                this.flvPlayer = flvJs.createPlayer({
                    type: "flv",
                    isLive: true, //是否直播
                    url: url, //地址
                    hasAudio: true,
                    hasVideo: true,
                }, {
                    enableWorker: false,
                    lazyLoadMaxDuration: 3 * 60,
                    seekType: 'range',
                });
                this.flvPlayer.attachMediaElement(el);
                this.flvPlayer.load();
                this.flvPlayer.play();
            }
        },
    }
}
</script>