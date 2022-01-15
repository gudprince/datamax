import Vue from 'vue';
import VueRouter from 'vue-router';

import BookList from "../components/BookList";
import EditBook from "../components/EditBook";


Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    routes: [
        { path: "/",component: BookList},
        { path: "/book/edit/:id",component: EditBook},
  
    ],
    scrollBehavior () {
        return { x: 0, y: 0 }
    }
})