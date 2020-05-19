function formatShareData() {
    let share_datas = sessionStorage.getItem("share_data");
    if (share_datas) {
        share_datas = JSON.parse(share_datas);
    } else {
        share_datas = {
            title: "美生严选 - MASON",
            url: window.location.href,
            content: "MASON是一款以惠你、惠我、惠大家为宗旨，运用区块链先进技术，集美食、娱乐、理财、商城等海量商品及服务为一体的综合性服务平台。",
            image: "https://api.cupsy.cn/images/work/logo.png",
            save_img: "",
            sku: "",
            goods: "",
        };
    }
    return share_datas;
}

function onShareByAndroid() {
    return formatShareData();
}

function onShareByIos() {
    return formatShareData();
}

function onShare(goods, sku) {
    let share_data = formatShareData();

    if (goods) {
        share_data = {
            title: goods.name + " - MASON",
            url: goods.share_url,
            content: goods.sub_name,
            image: goods.master_image,
            goods: goods,
            sku: sku,
            // save_img: goods.save_img,
        };
        console.log(share_data);
    }
    let data = JSON.stringify(share_data);
    try {
        if (navigator.userAgent.toLocaleLowerCase().indexOf("android") > -1) {
            window.android.onShareGoods(data);
        } else {
            window.ios.onShareGoods(share_data);
        }
    } catch (e) {}
}

function closeShare(txt) {
    try {
        _vueCloseShare();
    } catch (e) {}

    if (navigator.userAgent.toLocaleLowerCase().indexOf("android") == -1) {
        try {
            window.ios.closeShare();
        } catch (e) {}
    } else {
        try {
            windows.android.closeShare();
        } catch (e) {}
    }
}
