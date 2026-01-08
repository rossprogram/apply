<template>
  <v-form :key="key">
    <v-container fluid>
      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Previous experience</v-card-title>
            <v-card-subtitle
              ><strong>Tell us about your experience at Ross!</strong> In particular, what makes you
              want to return to Ross?
            </v-card-subtitle>
            <v-card-text class="py-0">
              <v-textarea outlined label="Your response" v-model="previousExperience"> </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                @click="saveApplication"
                color="primary"
                :disabled="Object.keys(this.updatedApplication).length == 0"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card></v-col
        ></v-row
      >

      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Most interesting parts of Ross</v-card-title>
            <v-card-subtitle
              ><strong>Tell us about what you learned from Ross.</strong> What were the most
              meaningful mathematical experiences you had at Ross?
            </v-card-subtitle>
            <v-card-text class="py-0">
              <v-textarea outlined label="Your response" v-model="mostInterestingRoss">
              </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                @click="saveApplication"
                color="primary"
                :disabled="Object.keys(this.updatedApplication).length == 0"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card></v-col
        ></v-row
      >

      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Community</v-card-title>
            <v-card-subtitle
              >As a returning student, you will play an important role in creating a welcoming and
              inclusive community at Ross.
              <strong
                >How did you help make Ross a welcoming community during your time at Ross?</strong
              >
              What will you commit to doing to help make Ross a welcoming community for everyone?
            </v-card-subtitle>
            <v-card-text class="py-0">
              <v-textarea outlined label="Your response" v-model="community"> </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                @click="saveApplication"
                color="primary"
                :disabled="Object.keys(this.updatedApplication).length == 0"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card></v-col
        ></v-row
      >

      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Collaboration</v-card-title>
            <v-card-subtitle>
              Collaborating and working together mathematically is an important aspect of Ross.
              <strong>Describe a time at Ross when you collaborated with others.</strong> What
              norms, practices, and values made the collaboration effective? How will you practice
              collaboration at Ross to make Ross a welcoming learning environment for everyone?
            </v-card-subtitle>
            <v-card-text class="py-0">
              <v-textarea outlined label="Your response" v-model="collaboration"> </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                @click="saveApplication"
                color="primary"
                :disabled="Object.keys(this.updatedApplication).length == 0"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card></v-col
        ></v-row
      >

      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Future goals</v-card-title>
            <v-card-subtitle
              ><strong>What do you plan to major in during college?</strong> What are your career goals?
              Do you feel &ldquo;driven&rdquo; toward one type of work? (Like an academic career in
              math, astronomy, or economics? Or a career in finance? etc.) Or will you take a
              variety of courses in college and see what areas seem most
              interesting?</v-card-subtitle
            >
            <v-card-text class="py-0">
              <v-textarea outlined label="Your response" v-model="intendedMajor"> </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                @click="saveApplication"
                color="primary"
                :disabled="Object.keys(this.updatedApplication).length == 0"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card></v-col
        ></v-row
      >

      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Other Information</v-card-title>
            <v-card-subtitle
              ><strong>Is there anything else you’d like to tell us?</strong></v-card-subtitle
            >
            <v-card-text class="py-0">
              <v-textarea outlined label="Your response" v-model="otherInformation"> </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                @click="saveApplication"
                color="primary"
                :disabled="Object.keys(this.updatedApplication).length == 0"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card></v-col
        ></v-row
      >
    </v-container>

    <v-flex xs12 text-xs-right>
      <v-btn
        @click="saveApplication"
        color="primary"
        class="mr-4 my-4"
        :disabled="Object.keys(this.updatedApplication).length == 0"
      >
        Save Application
      </v-btn>
    </v-flex>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['application']),

    previousExperience: {
      get() {
        return this.application.previousExperience;
      },
      set(v) {
        this.$set(this.updatedApplication, 'previousExperience', v);
      },
    },
    mostInterestingRoss: {
      get() {
        return this.application.mostInterestingRoss;
      },
      set(v) {
        this.$set(this.updatedApplication, 'mostInterestingRoss', v);
      },
    },
    community: {
      get() {
        return this.application.community;
      },
      set(v) {
        this.$set(this.updatedApplication, 'community', v);
      },
    },
    collaboration: {
      get() {
        return this.application.collaboration;
      },
      set(v) {
        this.$set(this.updatedApplication, 'collaboration', v);
      },
    },
    intendedMajor: {
      get() {
        return this.application.intendedMajor;
      },
      set(v) {
        this.$set(this.updatedApplication, 'intendedMajor', v);
      },
    },
    otherInformation: {
      get() {
        return this.application.otherInformation;
      },
      set(v) {
        this.$set(this.updatedApplication, 'otherInformation', v);
      },
    },
  },

  data() {
    return {
      saved: false,
      updatedApplication: {},
      key: 1,
    };
  },
  methods: {
    ...mapActions(['getApplication', 'updateApplication']),

    saveApplication() {
      this.saved = true;
      return this.updateApplication(this.updatedApplication);
    },
  },

  beforeRouteLeave(to, from, next) {
    if (Object.keys(this.updatedApplication).length > 0 && !this.saved) {
      const answer = window.confirm('Do you really want to leave? You have unsaved changes.');
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },

  mounted() {
    return this.getApplication();
  },
};
</script>
