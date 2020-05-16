/* eslint-disable */
import http from "axios";
import crypt from "crypto-js";
import Toast from "vant";
import store from "@/store";

const apps = {
    http: {
        post(url, params) {
            return new Promise((resolve, reject) => {
                http.post(url, params).then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            });
        },
        put(url, params) {
            return new Promise((resolve, reject) => {
                http.put(url, params).then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            });
        },
        get(url, params) {
            return new Promise((resolve, reject) => {
                http.get(url, {
                    params: params,
                }).then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            });
        },
        captcha() {
            return new Promise((resolve, reject) => {
                apps.http.sessionid().then((sessionid) => {
                    http.get("/captcha", {
                        params: {},
                        responseType: "arraybuffer",
                    }).then(
                        (res) => {
                            resolve(
                                "data:image/png;base64," + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ""))
                            );
                        },
                        (err) => {
                            reject(err);
                        }
                    );
                });
            });
        },
        sessionid() {
            return new Promise((resolve, reject) => {
                // let sessionid = apps.session.get('sessionid');
                let sessionid = localStorage.getItem("sessionid");
                if (!sessionid) {
                    http.get("/user/v1/session", {
                        params: {},
                    }).then(
                        (res) => {
                            sessionid = res.data.id;
                            apps.session.set("sessionid", sessionid);
                            localStorage.setItem("sessionid", sessionid);
                            resolve(sessionid);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
                } else {
                    resolve(sessionid);
                }
            });
        },
        upload(params) {
            return new Promise((resolve, reject) => {
                let files = new FormData();
                files.append("file", params.file);

                http.post("/Upload/image", files, {
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            });
        },
    },
    genrationSign(data) {
        let keys = Object.keys(data).sort();
        let tmp = [];

        for (let i in keys) {
            if (data[keys[i]] === "" || data[keys[i]] === undefined) continue;

            tmp.push(keys[i] + "=" + data[keys[i]]);
        }

        tmp.push("secret_key=" + process.env.VUE_APP_SECRET_KEY);

        let query = tmp.join("&");

        return crypt.MD5(query);
    },
    session: {
        set(name, val) {
            sessionStorage.setItem(name, val);
        },
        get(name) {
            return sessionStorage.getItem(name);
        },
        rm(name) {
            sessionStorage.removeItem(name);
        },
    },
    randStr() {
        let str = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "8",
                "9",
                "a",
                "b",
                "b",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
                "-",
                "_",
            ],
            len = 32,
            randStr = "";
        for (let i = 0; i < 32; i++) {
            let num = Math.round(Math.random() * (str.length - 1));
            randStr += str[num];
        }
        return randStr;
    },
    crypto: {
        en(data) {
            if (typeof data != "string") {
                data = JSON.stringify(data);
            }
            return crypt.AES.encrypt(data, crypt.enc.Utf8.parse(process.env.VUE_APP_CRYPT_KEY), {
                iv: crypt.enc.Utf8.parse(process.env.VUE_APP_CRYPT_IV),
                mode: crypt.mode.CBC,
                padding: crypt.pad.Pkcs7,
            }).toString();
        },
        de(data) {
            if (typeof data === "string") {
                return crypt.AES.decrypt(data, crypt.enc.Utf8.parse(process.env.VUE_APP_CRYPT_KEY), {
                    iv: crypt.enc.Utf8.parse(process.env.VUE_APP_CRYPT_IV),
                    mode: crypt.mode.CBC,
                    padding: crypt.pad.Pkcs7,
                }).toString();
            }
            return data;
        },
    },
    isLogin() {
        return apps.session.get("sessionid") || localStorage.getItem("sessionid") ? true : false;
    },
    isWeChat() {
        return navigator.userAgent.toLocaleLowerCase().indexOf("micromessenger") > -1 ? true : false;
    },
    isAndroidApp() {
        return navigator.userAgent.toLocaleLowerCase().indexOf("androidmason") > -1 ? true : false;
    },
    isAndroid() {
        return navigator.userAgent.toLocaleLowerCase().indexOf("android") > -1 ? true : false;
    },
    isQQAPPBrowser() {
        //  QBWebViewType QQ浏览器
        return navigator.userAgent.indexOf("QQ/") > -1;
        //  MQQBrowser QQ浏览器 Mobile 手机端
    },
};

// http.defaults.baseURL = window.location.host.indexOf("greendg.cn") > -1 ? process.env.VUE_APP_BASE_API1 : process.env.VUE_APP_BASE_API;
http.defaults.baseURL = process.env.VUE_APP_BASE_API;
http.interceptors.request.use((config) => {
    let sessionId = apps.session.get("sessionid") ? apps.session.get("sessionid") : localStorage.getItem("sessionid"),
        sign = "",
        params = {};
    params.request_time = new Date().valueOf();
    params.request_str = apps.randStr();
    params.lang = localStorage.getItem("lang");
    if (config.method === "get") {
        if (config.params !== null && config.params !== undefined) {
            config.params = Object.assign(config.params, params);
        } else {
            config.params = params;
        }
        sign = apps.genrationSign(config.params);
    } else if (config.method === "post" || config.method === "put") {
        if (config.data !== null && config.data !== undefined) {
            config.data = Object.assign(config.data, params);
        } else {
            config.data = params;
        }

        if (config.params !== null && config.params !== undefined) {
            config.params = Object.assign(config.params, params);
        } else {
            config.params = params;
        }

        sign = apps.genrationSign(config.data);
    }

    config.headers = {
        ssid: sessionId ? sessionId : apps.randStr(),
    };
    
    return config;
});

http.interceptors.response.use(
    (res) => {
        store.state.isLoading && store.commit("SET_LOADING", !1);
        if (typeof res.data === "string") {
            res.data = apps.crypto.de(res.data);
        }
        if (res.status === 200) {
            if (res.data.code === 1020) {
                let redirect = encodeURI(process.env.VUE_APP_BASE_URL + "auth");
                window.location.href = process.env.VUE_APP_ERP_BASE_URL + "login?url=" + redirect;
            } else if (res.data.code !== 1) {
                return res.data;
            } else {
                return res.data;
            }
        } else {
        }
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default apps;
