// 替换数组前60的数据
export function ArrayReplace(o, n) {
    if (o.length == 0) {
        return n;
    } else {
        let arr = o.splice(0, 60),
            tar = n.splice(0, 60).reverse();
        tar.forEach((e) => {
            o.splice(0, 0, e);
        });
        return o;
    }
}

/*  字符替换(时间格式)
 *   str 表示将要替换的字符串
 *   l 表示你将要替换的字符
 *   r 表示你想要替换的字符
 *   console.log(transFormat('2019-12-13', '-', '/')); // 2019/12/13
 */
export function transFormat(str, l, r) {
    let reg = new RegExp(l, "g"); // g表示全部替换，默认替换第一个
    str = str.replace(reg, r);
    return str;
}

// 格式化小数点后几位
export function ToFixed(num, bit) {
    // var index = num.toFixed(3).indexOf(".");
    if (bit == 2) {
        var result = Math.floor(num.toFixed(2) * 100) / 100;
    } else {
        var result = Math.floor(num.toFixed(3) * 1000) / 1000;
    }
    return result;
}

/**
 * @param { number } val 输入的数字
 * @param { number } maxNum 数字规定界限
 */
export const outOfNum = (val, maxNum) => {
    val = val ? val - 0 : 0;
    if (val > maxNum) {
        return `${maxNum}+`;
    } else {
        return val;
    }
};

// 判断机型
export const Detect = () => {
    let equipmentType = "";
    let agent = navigator.userAgent.toLowerCase();
    let android = agent.indexOf("android");
    let iphone = agent.indexOf("iphone");
    let ipad = agent.indexOf("ipad");
    if (android != -1) {
        equipmentType = "android";
    }
    if (iphone != -1 || ipad != -1) {
        equipmentType = "ios";
    }
    return equipmentType;
};

// 判断机型
export const DetectAgent = () => {
    var browser = {
        versions: (function() {
            var u = navigator.userAgent;
            return {
                trident: u.indexOf("Trident") > -1, //IE内核
                presto: u.indexOf("Presto") > -1, //opera内核
                webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
                iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf("iPad") > -1, //是否iPad
                webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
            };
        })(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    };

    if (browser.versions.ios) {
        return true;
    } else if (browser.versions.android) {
        return true;
    }
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return false;
    } else {
        return false;
    }
};
