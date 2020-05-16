<template>
    <div class="uploader-container">
        <van-uploader
            v-model="form.imagesArr"
            preview-full-image
            :max-count="6"
            :max-size="104857600"
            :after-read="afterRead"
            :before-delete="beforeDelete"
            :before-read="beforeRead"
        >
            <div class="van-uploader__upload bg-secondray-light">
                <i class="van-icon van-icon-photograph van-uploader__upload-icon"></i><span class="van-uploader__upload-text">上传文件</span>
            </div>
        </van-uploader>
    </div>
</template>

<script>
import { Detect } from "../../utils/utils";
import Exif from "exif-js";
export default {
    components: {},
    props: {},
    data() {
        return {
            form: {
                imagesArr: [],
            },
        };
    },
    methods: {
        uploadImgFile(files) {
            this.$store.dispatch("SET_LOADING", 1);
            this.$apps.http
                .upload({ file: files })
                .then((res) => {
                    if (res.code == 1) {
                        this.$emit("upload", res.data.url);
                    } else {
                        this.$toast(res.msg);
                    }
                })
                .catch((err) => {});
        },
        async afterRead(files, detail) {
            let uploadImgFile = await this.canvasDataURL(files.file, files.file.name); // 压缩后的文件
            const payload = this.dataURLtoFile(uploadImgFile, files.file.name);
            this.uploadImgFile(payload);
        },
        beforeDelete(file, detail) {
            this.form.imagesArr.splice(detail.index, 1);
            this.$emit("delete", detail.index);
        },
        async beforeRead(file) {
            return new Promise((resolve, reject) => {
                if (file instanceof Array) {
                    this.$toast({
                        message: "由于你选择了多张图片，默认为你选择第一张，如果有误请重选",
                        position: "bottom",
                    });
                    // if (file[0].size > 1024 * 1024 * 3) {
                    //     this.$toast("上传图片不能大于3MB");
                    //     reject();
                    // } else {
                    //     let img = new File([file[0]], file[0].name, {
                    //         type: "image/jpeg",
                    //     });
                    // }
                    resolve(file[0]);
                } else {
                    // if (file.size > 1024 * 1024 * 3) {
                    //     this.$toast("上传图片不能大于3MB");
                    //     reject();
                    // } else {
                    //     let img = new File([file], file.name, {
                    //         type: "image/jpeg",
                    //     });
                    //     resolve(file);
                    // }
                    resolve(file);
                }
            });
        },
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },
        // 图片压缩
        canvasDataURL(file, fileName) {
            // let Orientation = '' // 存储图片旋转方向
            const _this = this;
            return new Promise((resolve, reject) => {
                const obj = {
                    quality: 3,
                };

                var img = new Image();
                img.src = window.URL.createObjectURL(file);
                img.onload = function() {
                    const that = this;
                    /* 获取图片方向 Exif */
                    Exif.getData(that, () => {
                        // 获取图像的数据
                        // Orientation = Exif.getTag(that, 'Orientation') // 获取图片旋转的方向
                        // 默认按比例压缩
                        let width = that.width;
                        let height = that.height;
                        // 控制上传图片宽高，用于图片压缩
                        var scale = width / height;
                        width = obj.width || width / 1.5;
                        height = obj.height || width / scale;
                        var quality = 3; // 默认图片质量为0.7
                        // 生成canvas
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        canvas.width = width;
                        canvas.height = height;

                        /* canvas清屏 */
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(that, 0, 0, width, height);
                        // switch (Orientation) {
                        //   case 6:
                        //     /* 顺时针旋转90度 */
                        //     _this.rotateImage(that, 'right', canvas, 1, ctx)
                        //     break
                        //   case 8:
                        //     /* 逆时针旋转90度 */
                        //     _this.rotateImage(that, 'left', canvas, 1, ctx)
                        //     break
                        //   case 3:
                        //     /* 顺时针旋转180度 */
                        //     _this.rotateImage(that, 'right', canvas, 2, ctx)
                        //     break
                        //   default:
                        //     break
                        // }
                        // 图像质量
                        if (obj.quality && obj.quality <= 4 && obj.quality > 0) {
                            quality = obj.quality;
                        }
                        let base64 = canvas.toDataURL("image/jpeg", quality);
                        // console.log(a);
                        resolve(base64);
                        // quality值越小，所绘制出的图像越模糊
                        // canvas.toBlob(
                        //     (file) => {
                        //         const margeFile = Object.assign(file, { name: fileName });
                        //         resolve(margeFile);
                        //     },
                        //     "image/jpeg",
                        //     quality
                        // );
                    });
                };
            });
        },
    },
};
</script>

<style lang="less" scoped></style>
