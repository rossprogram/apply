<template>
<v-container fluid>
  <v-row v-if="errorsAndWarnings.length > 0"><v-col><v-card>
	<v-card-title>Errors and Warnings</v-card-title>
	<v-list-item two-line v-for="item in errorsAndWarnings"
		     :key="item.error"
		     :to="item.to">
	  <v-list-item-icon>
            <v-icon v-if="item.severity == 'warning'">mdi-alert</v-icon>
            <v-icon color="red" v-else>mdi-alert-octagon</v-icon>
	  </v-list-item-icon>
	  <v-list-item-content>
            <v-list-item-title>{{ item.error }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.severity == 'warning'">Warning</v-list-item-subtitle>
	    <v-list-item-subtitle v-if="item.severity !== 'warning'">Error</v-list-item-subtitle>
	  </v-list-item-content>
	</v-list-item>
	<v-card-text v-if="errorsAndWarnings.filter( r => (r.severity !== 'warning') ).length > 0">
	  <p>Before you can submit your application, you must fix the errors listed above.</p>
	  <p>These errors have prevented you from being able to submit your application. A comment will state what required information is missing. Warnings are suggestions for improving your application, but will not block the submission.</p>
	  <p>You do <strong>not</strong> have to wait for your recommendation letter to be received before you submit your application.</p>
	  </v-card-text>
  </v-card></v-col></v-row>
  <v-row v-if="errorsAndWarnings.filter( r => (r.severity !== 'warning') ).length == 0"><v-col><v-card>
	<v-card-title>Submit your application</v-card-title>
	<v-card-subtitle><p>When you have submitted all the material you would like the Admissions Committee to evaluate, you may submit your application below.</p>
	  <p>You do <strong>not</strong> have to wait for your recommendation letter to be received before you submit your application.</p>
	  <p>After you click the blue &ldquo;Submit your Application&rdquo; button, the system might respond with a list of Errors and Warnings. Errors will stop your submission. A comment will state what required information is missing. Warnings are suggestions for improving your application, but will not block the submission.</p>
	  <p>After your application has been submitted successfully, you may view (but not change) your submitted materials using the menu on the left.</p>
	  <p>The red &ldquo;Withdraw your Application&rdquo; button allows you to undo your submission.  All materials you typed and uploaded will remain, allowing you to edit those materials as you choose. Then you may click &ldquo;Submit your Application&rdquo; as before.</p>
	  <p><strong>Note:</strong>  Applications that are submitted in late March (close to the deadline) may not be reviewed as carefully as those submitted earlier.  So it is better to avoid the Withdraw and Re-submit process at that time, unless you are making significant changes.  If you do make late changes in your file, please alert the Committee with an email to <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a>.</p>
</v-card-subtitle>
	<v-card-text v-if="!application.submitted">
	  <v-btn @click="submitApplication" color="primary">Submit your application</v-btn>
	</v-card-text>
	<v-card-text v-if="application.submitted">
	  <v-btn disabled="true" color="primary">Submit your application</v-btn>
	  Your application was submitted {{application.submittedAt | moment("from", "now") }}.
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="application.submitted"><v-col><v-card>
	<v-card-title>Withdraw your application</v-card-title>
	<v-card-subtitle>If you wish to change your application, you must first withdraw it from consideration.  <strong>This will not erase any part of your application.</strong> Once you have made any desired changes, you may re-submit your application.</v-card-subtitle>
	<v-card-text>
	  <v-btn color="error" @click="withdrawApplication">Withdraw your application</v-btn>
	</v-card-text>
  </v-card></v-col></v-row>

</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

function ageInYears(born) {
  const ageDifMs = Date.now() - (new Date(born));
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default {
  computed: {
    ...mapState(['application', 'recommendations', 'attachments']),

    errorsAndWarnings() {
      const someErrors = this.commonRules.map(r => r()).filter(r => (r.error));

      if (this.application.juniorCounselor) return someErrors;

      return someErrors.concat(this.rules.map(r => r()).filter(r => (r.error)));
    },
  },

  data() {
    return {
      commonRules: [
	() => !!this.application.firstName || { error: 'A first name is required.', to: '/apply/background' },
	() => (this.application.firstName && this.application.firstName.match(/[A-z]/)) || { error: 'Your first name must include letters.', to: '/apply/background' },
	() => !!this.application.lastName || { error: 'A last name is required.', to: '/apply/background' },
	() => (this.application.lastName && this.application.lastName.match(/[A-z]/)) || { error: 'Your last name must include letters.', to: '/apply/background' },
	() => (this.application.citizenship && this.application.citizenship.length > 0) || { error: 'You must be a citizen of at least one country', to: '/apply/background' },
	() => !!this.application.gender || { error: 'You may want to describe your gender.', severity: 'warning', to: '/apply/background' },
	() => !!this.application.birthday || { error: 'You must include your birthday.', to: '/apply/background' },
	() => !!this.application.phone || { error: 'You are missing a phone number.', severity: 'warning', to: '/apply/background' },
	() => !!this.application.schoolName || { error: 'You are missing the name of your current school.', severity: 'warning', to: '/apply/background' },
	() => (this.application.birthday && (ageInYears(this.application.birthday) >= 10)) || { error: 'You are too young.', to: '/apply/background' },
	() => (this.application.applyingToUSA || this.application.applyingToAsia) || { error: 'You must apply to one or both of the Ross sites.', to: '/apply/background' },
	() => !!this.application.address || { error: 'You have not included a home address.', to: '/apply/background', severity: 'warning' },

	() => (!this.application.applyingToUSA || this.application.arriveAtStartUSA) || { error: 'If accepted to Ross/Ohio, you must arrive at the beginning of the Program.', to: '/apply/background', severity: 'warning' },
	() => (!this.application.applyingToAsia || this.application.arriveAtStartAsia) || { error: 'If accepted to Ross/Indiana, you must arrive at the beginning of the Program.', to: '/apply/background', severity: 'warning' },

	() => (this.application.nativeEnglish || (Object.values(this.attachments).filter(x => x.label === 'toefl').length > 0)) || { error: 'If your native language is not English, you should submit TOEFL documentation.', severity: 'warning', to: '/apply/background' },

	() => !!this.application.parentName || { error: 'The name of a parent or guardian is required.', to: '/apply/parent' },
	() => !!this.application.parentPhone || { error: 'A phone number for a parent or guardian is required.', to: '/apply/parent' },
	() => !!this.application.parentEmail || { error: 'An email address for a parent or guardian is required.', to: '/apply/parent' },
	() => !!this.application.parentAddress || { error: 'You have not included a residential address for a parent or guardian.', to: '/apply/parent', severity: 'warning' },

	() => (Object.values(this.attachments).filter(x => x.label === 'transcript').length > 0) || { error: 'You did not submit a high school transcript.', to: '/apply/transcript' },
      ],

      rules: [
	() => !!this.application.personalStatement || (Object.values(this.attachments).filter(x => x.label === 'statement').length > 0) || { error: 'You have not included a personal statement.', to: '/apply/statement' },

	() => !!this.application.interestingProjects || (Object.values(this.attachments).filter(x => x.label === 'essay').length > 0) || { error: 'You did not describe an interesting project you have worked on.', severity: 'warning', to: '/apply/essays' },
	() => !!this.application.otherPrograms || (Object.values(this.attachments).filter(x => x.label === 'essay').length > 0) || { error: 'You did not describe your participation in any other programs.', severity: 'warning', to: '/apply/essays' },
	() => !!this.application.books || (Object.values(this.attachments).filter(x => x.label === 'essay').length > 0) || { error: 'You did not describe your favorite books and websites.', severity: 'warning', to: '/apply/essays' },
	() => !!this.application.intendedMajor || (Object.values(this.attachments).filter(x => x.label === 'essay').length > 0) || { error: 'You did not describe your intended major and career.', severity: 'warning', to: '/apply/essays' },
	() => !!this.application.collaboration || (Object.values(this.attachments).filter(x => x.label === 'essay').length > 0) || { error: 'You did not describe your experiences with collaboration.', severity: 'warning', to: '/apply/essays' },
	() => !!this.application.otherCourses || (Object.values(this.attachments).filter(x => x.label === 'essay').length > 0) || { error: 'You did not describe your prior coursework in mathematics.', severity: 'warning', to: '/apply/essays' },
	() => !!this.application.eager || (Object.values(this.attachments).filter(x => x.label === 'essay').length > 0) || { error: 'You did not share your thoughts about being away from home.', severity: 'warning', to: '/apply/essays' },

	() => (Object.values(this.attachments).filter(x => x.label === 'statement').length > 0) || (this.application.personalStatement && this.application.personalStatement.length > 250) || { error: 'Your personal statement is short.', to: '/apply/statement', severity: 'warning' },

	() => (this.recommendations && (Object.values(this.recommendations).some(r => (r.submittedAt)))) || { error: 'A recommendation letter has not yet been received.', severity: 'warning', to: '/apply/recommendation' },
	() => (this.recommendations && (Object.keys(this.recommendations).length > 0)) || { error: 'You have not requested a recommendation.', to: '/apply/recommendation' },

	() => (Object.values(this.attachments).filter(x => x.label === 'solution1').length > 0) || { error: 'You did not submit a solution to Problem 1.', severity: 'warning', to: '/apply/solutions' },
	() => (Object.values(this.attachments).filter(x => x.label === 'solution2').length > 0) || { error: 'You did not submit a solution to Problem 2.', severity: 'warning', to: '/apply/solutions' },
	() => (Object.values(this.attachments).filter(x => x.label === 'solution3').length > 0) || { error: 'You did not submit a solution to Problem 3.', severity: 'warning', to: '/apply/solutions' },


      ],
    };
  },
  methods: {
    ...mapActions([
      'getApplication',
      'getAttachments',
      'getRecommendations',
      'updateApplication',
    ]),

    submitApplication() {
      return this.updateApplication({ submitted: true });
    },
    withdrawApplication() {
      return this.updateApplication({ submitted: false });
    },

  },

  mounted() {
    this.getAttachments();
    this.getRecommendations();
    this.getApplication();
  },
};
</script>
