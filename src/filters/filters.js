// 格式化金钱
export function NumberFormat(v) {
    if (isNaN(v)) {
        return v;
    }
    v = Math.round((v - 0) * 100) / 100;
    v = v == Math.floor(v) ? v + ".00" : v * 10 == Math.floor(v * 10) ? v + "0" : v;
    v = String(v);
    var ps = v.split(".");
    var whole = ps[0];
    var sub = ps[1] ? "." + ps[1] : ".00";
    var r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
        whole = whole.replace(r, "$1" + "," + "$2");
    }
    v = whole + sub;
    return v;
}

// 图片链接处理
export function imageViews(value, w, h) {
    h = h ? h : w;
    return value + "?imageView2/1/w/" + w + "/h/" + h + "/interlace/1";
}
