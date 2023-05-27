import Vue from 'vue'
// import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
// import { required, email, min, max } from "vee-validate/dist/rules";

import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import ar from 'vee-validate/dist/locale/ar.json';
import * as rules from 'vee-validate/dist/rules';

// install rules and localization
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

localize('ar', ar);

// extend("required", {
//     ...required,
//     message: "This field is required"
// });

// extend("min", {
//     ...min,
//     message: "This field must be {length} characters or less"
// });

// extend("max", {
//     ...max,
//     message: "This field must be {length} characters or less"
// });

// extend("email", {
//     ...email,
//     message: "This field must be a valid email"
// });

extend('password', {
    params: ['target'],
    validate(value, { target }) {
        return value === target;
    },
    message: 'هذا الحقل يجب أن يطابق كلمة السر'
});

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

