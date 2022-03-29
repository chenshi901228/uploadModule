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
    mounted() {
        this.$nextTick(() => {
            this.flvVideoHandle(this.url)
        })
    },
    methods: {
        flvVideoHandle(url) {
            this.$nextTick(() => {
                let el = document.querySelector(".flvVideo")
                if(el && flvJs.isSupported()) {
                    this.flvPlayer = flvJs.createPlayer({
                        type: 'flv',
                        url: downloadFileUrl(url)
                    });
                    this.flvPlayer.attachMediaElement(el);
                    this.flvPlayer.load();
                    // this.flvPlayer.play();
                }
            })
        },
    }
}
</script>