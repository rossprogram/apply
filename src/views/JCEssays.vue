<template>
<v-form :key="key">
  <v-container fluid>

    <p>For your resposes below, if you wish to use mathematical formatting not available here, you may include your response as a PDF file and upload it using the Attachments option in the menu on the left. If you do this, please type &ldquo;See Attachments&rdquo; in the text boxes below.</p>

    <v-row><v-col><v-card>
	  <v-card-title>Previous experience</v-card-title>
	  <v-card-subtitle><strong>Think back to your previous experience in the Ross Program.</strong> When did you attend the Ross Program, and at which location? Who was your counselor? How far did you progress through the Ross Number Theory problem sets?
Have you done any work on those problems since then?
	  </v-card-subtitle>
	  <v-card-text class="py-0">
	    <v-textarea
	      outlined
	      label="Your response"
	      v-model="previousExperience"
	      >
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
    </v-card></v-col></v-row>

    <v-row><v-col><v-card>
	  <v-card-title>Most interesting parts of Ross</v-card-title>
	  <v-card-subtitle><strong>What parts of the Ross Program did you find most interesting or useful?</strong>
	    Number Theory lecture? Problem seminar? Working on the sets? Discussing math with counselor or JC?
	    Talking about math with your friends? Etc.
	  </v-card-subtitle>
	  <v-card-text class="py-0">
	    <v-textarea
	      outlined
	      label="Your response"
	      v-model="mostInterestingRoss"
	      >
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
    </v-card></v-col></v-row>


    <v-row><v-col><v-card>
	  <v-card-title>Other programs</v-card-title>
	  <v-card-subtitle><strong>What math or science activities have you been involved with since you left Ross?</strong> In a math club? Studied an interesting math book?
	  </v-card-subtitle>
	  <v-card-text class="py-0">
	    <v-textarea
	      outlined
	      label="Your response"
	      v-model="otherPrograms"
	      >
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
    </v-card></v-col></v-row>

    <v-row><v-col><v-card>
	  <v-card-title>Mathematical interests</v-card-title>
	  <v-card-subtitle><strong>What mathematical areas do you find most interesting?</strong>
	  </v-card-subtitle>
	  <v-card-text class="py-0">
	    <v-textarea
	      outlined
	      label="Your response"
	      v-model="mostInterestingMath"
	      >
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
    </v-card></v-col></v-row>


    <v-row><v-col><v-card>
    <v-card-title>Problem</v-card-title>
    <v-card-subtitle><strong>What is an interesting mathematical problem you have worked on during the past several months?</strong>  Carefully state the problem. Describe the work you have done on it.</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="interestingProblem"
	>
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
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Future goals</v-card-title>
    <v-card-subtitle><strong>What do you plan to major in at college?</strong> What are your career goals? Do you feel &ldquo;driven&rdquo; toward one type of work? (Like an academic career in math, astronomy, or economics? Or a career in finance? etc.) Or will you take a variety of courses in college and see what areas seem most interesting?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="intendedMajor"
	>
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
  </v-card></v-col></v-row>


  </v-container>

  <v-flex
    xs12
    text-xs-right
    >

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

    intendedMajor: {
      get() { return this.application.intendedMajor; },
      set(v) { this.$set(this.updatedApplication, 'intendedMajor', v); },
    },
    interestingProblem: {
      get() { return this.application.interestingProblem; },
      set(v) { this.$set(this.updatedApplication, 'interestingProblem', v); },
    },
    otherPrograms: {
      get() { return this.application.otherPrograms; },
      set(v) { this.$set(this.updatedApplication, 'otherPrograms', v); },
    },

    previousExperience: {
      get() { return this.application.previousExperience; },
      set(v) { this.$set(this.updatedApplication, 'previousExperience', v); },
    },
    mostInterestingRoss: {
      get() { return this.application.mostInterestingRoss; },
      set(v) { this.$set(this.updatedApplication, 'mostInterestingRoss', v); },
    },
    mostInterestingMath: {
      get() { return this.application.mostInterestingMath; },
      set(v) { this.$set(this.updatedApplication, 'mostInterestingMath', v); },
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
