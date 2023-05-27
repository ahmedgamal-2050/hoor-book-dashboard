import Vue from 'vue'
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";

import { BASE_URL } from "../config/config";

const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Cache-Control": "no-cache",
        Accept: "application/json"
    },

    adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
        enabledByDefault: false,
        cacheFlag: "useCache"
    })
});

http.defaults.headers.common['Authorization'] = 'Bearer ' + Vue.ls.get('token', null);
Vue.prototype.$http = http;