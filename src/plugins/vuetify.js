import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify, {
    // rtl: true,
    // theme: {
    //     themes: {
    //         light: {
    //             primary: '#3f51b5',
    //             secondary: '#b0bec5',
    //             accent: '#8c9eff',
    //             error: '#b71c1c',
    //         },
    //     },
    //     // primary: '#ab3bba',
    //     // secondary: '#FFCDD2',
    //     // accent: '#3F51B5',
    // },
    // icons: {
    //     iconfont: 'mdiSvg'
    // }
})

const vutifyOptins = {
    rtl: true,
    theme: {
        themes: {
            light: {
                primary: '#ab3bba',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                error: '#b71c1c',
            },
        },
        // primary: '#EF6C00',
        // primary: '#ab3bba',
        // secondary: '#FFCDD2',
        // accent: '#3F51B5',
    },
    icons: {
        iconfont: 'mdiSvg'
    }
}

export default new Vuetify(vutifyOptins)