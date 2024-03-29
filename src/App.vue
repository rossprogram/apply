<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-img
          alt="Ross Program Z Logo"
          class="shrink mr-4"
          contain
          :src="`${publicPath}logo.png`"
          transition="scale-transition"
          width="30"
        />
      </div>
      <v-toolbar-title>The Ross Mathematics Program</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!profile" to="/signup" class="mr-2" text>Create an account</v-btn>
      <v-btn v-if="!profile" class="mr-2" to="/login" text>Log In</v-btn>
      <v-menu v-if="profile" offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" v-text="profile.email">
            <v-icon left>account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/apply">
            <v-list-item-title>Application</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-if="$route.path.match(/^\/apply/)" permanent app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Your Application </v-list-item-title>
          <v-list-item-subtitle> for Ross {{ new Date().getFullYear() }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in application.juniorCounselor ? jcItems : items"
          :key="item.title"
          :to="item.to"
          :exact="true"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid class="pa-6">
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </v-container>
    </v-content>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import Snackbar from "./components/Snackbar.vue";

export default {
  name: "App",
  computed: {
    ...mapState(["profile"]),
    ...mapState(["application"]),
  },

  components: {
    Snackbar,
  },
  data() {
    return {
      drawer: true,
      jcItems: [
        {
          title: "Instructions",
          icon: "grading",
          to: "/apply/",
        },
        {
          title: "Background",
          icon: "person",
          to: "/apply/background",
        },
        {
          title: "Parent Information",
          icon: "supervisor_account",
          to: "/apply/parent",
        },
        {
          title: "Transcript",
          icon: "school",
          to: "/apply/transcript",
        },
        {
          title: "JC Essays",
          icon: "message",
          to: "/apply/jc-essays",
        },
        {
          title: "Attachments",
          icon: "attachment",
          to: "/apply/attachments",
        },
        {
          title: "Submit",
          icon: "done",
          to: "/apply/submit",
        },
      ],
      items: [
        {
          title: "Instructions",
          icon: "grading",
          to: "/apply/",
        },
        {
          title: "Background",
          icon: "person",
          to: "/apply/background",
        },
        {
          title: "Parent Information",
          icon: "supervisor_account",
          to: "/apply/parent",
        },
        {
          title: "Personal Statement",
          icon: "face",
          to: "/apply/statement",
        },
        {
          title: "Short Essays",
          icon: "message",
          to: "/apply/essays",
        },
        {
          title: "Solutions",
          icon: "assignment",
          to: "/apply/solutions",
        },
        {
          title: "Transcript",
          icon: "school",
          to: "/apply/transcript",
        },
        {
          title: "Recommendation",
          icon: "mail",
          to: "/apply/recommendation",
        },
        {
          title: "Attachments",
          icon: "attachment",
          to: "/apply/attachments",
        },
        {
          title: "Submit",
          icon: "done",
          to: "/apply/submit",
        },
      ],
      publicPath: process.env.BASE_URL,
    };
  },

  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
