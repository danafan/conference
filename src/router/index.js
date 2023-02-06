import Vue from "vue";
import Router from "vue-router";

const index = (resolve) => require(["@/pages/Index/index"], resolve);
const appointment = (resolve) => require(["@/pages/Appointment/index"], resolve);
const management = (resolve) => require(["@/pages/Management/index"], resolve);
const list = (resolve) => require(["@/pages/Management/pages/list"], resolve);
const add = (resolve) => require(["@/pages/Management/pages/add"], resolve);
const record = (resolve) => require(["@/pages/Record/index"], resolve);
const statistics = (resolve) => require(["@/pages/Statistics/index"], resolve);

Vue.use(Router);

const router = new Router({
  routes: [
  {
    path: "/index",
    component: index,
    name: "智能会议室",
    children: [
    {
      path: "/appointment",
      name: "预约会议",
      component: appointment
    },
    {
      path: "/management",
      name: "会议室管理",
      component: management,
      children:[{
        path: "/list",
        name: "会议室管理",
        component: list
      },{
        path: "/add",
        name: "添加会议室",
        component: add
      }]
    },
    {
      path: "/record",
      name: "会议记录",
      component: record
    },
    {
      path: "/statistics",
      name: "会议统计",
      component: statistics
    },
    ],
  }
  ]
});

router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(from)
  next();
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
