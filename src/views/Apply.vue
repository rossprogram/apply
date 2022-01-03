<template>
<v-form :key="key">
<p>We invite you to submit your application to be a student at the
  Ross Mathematics Program.</p>

<v-layout  wrap>
  <v-flex xs12 md12>
    <v-checkbox
      v-model="juniorCounselor"
      label="I have attended the Ross Program in a previous summer"
      ></v-checkbox>
  </v-flex>
</v-layout>

<p>There are two locations for the Ross Program, and this single application is used for both.</p>

<p>To enter or upload your application information, click on the menu items to the left.  Files are saved according to the email address you entered when setting up the account.  Please use an email that will remain valid at least through August {{ (new Date()).getFullYear() }}.  </p>

<p>As you finish each section, please click "Save" or "Save Application."  Later when you  log in again, the information will remain and you may continue working on your application.   After you submit a completed application you may withdraw it, edit your entries, and then submit again.</p>

<p class="my-4">The Admissions Committee will begin reading applications on April 1, {{ (new Date()).getFullYear() }}. <b>Complete and submit your application before the end of March.</b>The Admissions Committee might not read applications received after April 1.  Admission decisions will be made later in April, and will be emailed to applicants who submitted complete applications.</p>
<p>If you have questions about the admissions process, please contact
  <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a>.</p>

  <v-flex
    xs12
    text-xs-right
    >

    <v-btn
	   @click="saveApplication"
	   color="primary"
	   class="mr-4"
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

    juniorCounselor: {
      get() { return this.application.juniorCounselor; },
      set(v) { this.$set(this.updatedApplication, 'juniorCounselor', v); },
    },
  },

  data() {
    return {
      saved: false,
      file: null,
      birthdayMenu: null,
      updatedApplication: {},
      key: 1,
    };
  },

  methods: {
    ...mapActions([
      'getApplication',
      'updateApplication',
    ]),

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
