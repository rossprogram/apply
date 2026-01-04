import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Apply from "../views/Apply.vue";
import Status from "../views/Status.vue";
import Fees from "../views/Fees.vue";
import Background from "../views/Background.vue";
import Essays from "../views/Essays.vue";
import JCEssays from "../views/JCEssays.vue";
import Login from "../views/Login.vue";
import ParentInformation from "../views/ParentInformation.vue";
import PersonalStatement from "../views/PersonalStatement.vue";
import VideoUpload from "../views/VideoUpload.vue";
import Recommendation from "../views/Recommendation.vue";
import Attachments from "../views/Attachments.vue";
import Solutions from "../views/Solutions.vue";
import Transcript from "../views/Transcript.vue";
import SubmitApplication from "../views/SubmitApplication.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/apply",
    name: "apply",
    component: Apply,
  },
  {
    path: "/status",
    name: "status",
    component: Status,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/fees",
    name: "fees",
    component: Fees,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/apply/essays",
    name: "essays",
    component: Essays,
  },
  {
    path: "/apply/jc-essays",
    name: "jc-essays",
    component: JCEssays,
  },
  {
    path: "/apply/video",
    name: "video",
    component: VideoUpload,
  },
  {
    path: "/apply/background",
    name: "background",
    component: Background,
  },
  {
    path: "/apply/statement",
    name: "statement",
    component: PersonalStatement,
  },
  {
    path: "/apply/recommendation",
    name: "recommendation",
    component: Recommendation,
  },
  {
    path: "/apply/solutions",
    name: "solutions",
    component: Solutions,
  },
  {
    path: "/apply/transcript",
    name: "transcript",
    component: Transcript,
  },
  {
    path: "/apply/attachments",
    name: "attachments",
    component: Attachments,
  },
  {
    path: "/apply/parent",
    name: "parent",
    component: ParentInformation,
  },
  {
    path: "/apply/submit",
    name: "submit",
    component: SubmitApplication,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.state.profile) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
