<template>
  <v-form :key="key" @submit="inviteRecommender(email)">
    <v-container fluid>
      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Recommendation Letter</v-card-title>
            <v-card-subtitle
              >Arrange for a mathematics teacher who knows you well to provide a recommendation
              letter. After you share your teacher's email with us, instructions will be sent to
              that address, asking your teacher to submit the letter directly to us. You may return
              to this page later to check the status of your letter. Applicants are allowed to
              submit more than one letter of recommendation, if different information will be
              provided in those additional letters. <strong>Instructions:.</strong> Enter the
              recommender's email address, then click the &ldquo;Plus Sign&rdquo; at the right. The
              Ross system will then send an automated message to that address.</v-card-subtitle
            >
            <v-list-item
              two-line
              v-for="recommendation in recommendations"
              :key="recommendation.email"
            >
              <v-list-item-icon>
                <v-icon v-if="recommendation.submittedAt">mdi-email-check</v-icon>
                <v-icon v-else-if="recommendation.loading">mdi-email-open</v-icon>
                <v-icon v-else>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ recommendation.email }}</v-list-item-title>
                <v-list-item-subtitle v-if="recommendation.submittedAt"
                  >Received
                  {{ recommendation.submittedAt | moment("from", "now") }}</v-list-item-subtitle
                >
                <v-list-item-subtitle v-if="recommendation.createdAt"
                  >Requested
                  {{ recommendation.createdAt | moment("from", "now") }}</v-list-item-subtitle
                >
                <v-list-item-subtitle v-else>Requesting&hellip;</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action v-if="recommendation.submittedAt === undefined">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="inviteRecommender(recommendation.email)">
                      <v-icon color="grey lighten-1">mdi-reminder</v-icon>
                    </v-btn>
                  </template>
                  <span>Send a reminder</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>
                  <v-text-field v-model="email" label="Recommender email address" />
                </v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action @click="inviteRecommender(email)">
                <v-btn icon>
                  <v-icon color="grey lighten-1">add</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-card></v-col
        ></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["recommendations"]),
  },

  data() {
    return {
      email: "",
      key: 1,
    };
  },
  methods: {
    ...mapActions(["getRecommendations", "addRecommendation", "alertError"]),

    inviteRecommender(address) {
      if (address === "") {
        this.alertError("You must provide an email address.");
        return false;
      }

      this.email = "";

      return this.addRecommendation(address);
    },
  },

  mounted() {
    return this.getRecommendations();
  },
};
</script>
