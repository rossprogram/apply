<template>
<v-form :key="key">
  <v-container fluid>

    <p>Please respond to each of the prompts below.  There is no prescribed word count limit.</p>

  <v-row><v-col><v-card>
    <v-card-title>Passion</v-card-title>
    <v-card-subtitle><strong>Tell us about your mathematical journey!</strong> Some possible things you could talk about
are the following (you do not have to answer all of these, nor are you limited to these
questions):
<ul>
<li>How did you come to love math? What draws you to math?</li>
<li>What mathematical experiences have you enjoyed?</li>
<li>What is a mathematical idea you find exciting and would love to share?</li>
<li>Tell us about some mathematics that you’ve worked on and enjoyed.</li>
</ul>
All responses are welcome! This isn’t a test for coming up with something
&ldquo;impressive&rdquo; or for you to try and figure out what math we’re &ldquo;looking for&rdquo; &mdash; we really
want to hear about mathematics that you like and find interesting.)
Coming to Ross is a 6-week endeavor. What makes you want to come to Ross and do
math for 6 weeks? What do you hope to get out of Ross?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="passion"
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
    <v-card-title>Community</v-card-title>
    <v-card-subtitle>At Ross, you will have to live with many different people, some who you may have
    much in common with, and some who may have different life experiences from your
own. <strong>What should people know about you to share the same
space as you, and for you to feel valued in a community?</strong> (This can include, but is not
limited to: what should people know about the way you engage with and learn
mathematics?) What will you commit to doing to help make the community one that
welcomes your future community members?
    </v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="community"
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
    <v-card-title>Collaboration</v-card-title>
    <v-card-subtitle>
Collaborating and working together mathematically is an important aspect of Ross.
<strong>Describe a project or otherwise that you have collaborated with others on (mathematical
or otherwise).</strong> What norms, practices, and values made the collaboration effective? How
will you practice collaboration at Ross to make Ross a welcoming learning environment
for everyone?
    </v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="collaboration"
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
    <v-card-title>Background</v-card-title>
    <v-card-subtitle>
    Ross students often come from a myriad of personal backgrounds, with many rich and
varied life experiences. <strong>How have your personal background and experiences have
shaped your academic and/or mathematical journey?</strong>
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
    <v-card-title>Source</v-card-title>
    <v-card-subtitle><strong>How did you hear about Ross?</strong></v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="referral"
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
    <v-card-title>Activities</v-card-title>
    <v-card-subtitle><strong>What activities do you engage in outside of classes?</strong></v-card-subtitle>
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
    <v-card-title>Future goals</v-card-title>
    <v-card-subtitle>What do you plan to major in at college?</strong> What are your career goals? Do you feel &ldquo;driven&rdquo; toward one type of work? (Like an academic career in math, astronomy, or economics? Or a career in finance? etc.) Or will you take a variety of courses in college and see what areas seem most interesting?</v-card-subtitle>
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

  <v-row><v-col><v-card>
    <v-card-title>Other Information</v-card-title>
    <v-card-subtitle><strong>Is there anything else you’d like to tell us?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="otherInformation"
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
    ...mapState(['attachments']),

    essayAttachments: {
      get() {
	if (this.attachments) return Object.values(this.attachments).filter(a => a.label === 'essay');
	return [];
      },
    },

  introduction: {
      get() { return this.application.introduction; },
      set(v) { this.$set(this.updatedApplication, 'introduction', v); },
    },
  passion: {
      get() { return this.application.passion; },
      set(v) { this.$set(this.updatedApplication, 'passion', v); },
    },
  community: {
      get() { return this.application.community; },
      set(v) { this.$set(this.updatedApplication, 'community', v); },
    },
  collaboration: {
      get() { return this.application.collaboration; },
      set(v) { this.$set(this.updatedApplication, 'collaboration', v); },
    },
  previousExperience: {
      get() { return this.application.previousExperience; },
      set(v) { this.$set(this.updatedApplication, 'previousExperience', v); },
    },
  referral: {
      get() { return this.application.referral; },
      set(v) { this.$set(this.updatedApplication, 'referral', v); },
    },
  otherPrograms: {
      get() { return this.application.otherPrograms; },
      set(v) { this.$set(this.updatedApplication, 'otherPrograms', v); },
    },
  intendedMajor: {
      get() { return this.application.intendedMajor; },
      set(v) { this.$set(this.updatedApplication, 'intendedMajor', v); },
    },
  otherInformation: {
      get() { return this.application.otherInformation; },
      set(v) { this.$set(this.updatedApplication, 'otherInformation', v); },
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
      'getAttachments',
      'removeAttachment',
      'addAttachment',
    ]),

    upload() {
      this.addAttachment({ file: this.file, label: 'essay' });
    },

    remove(id) {
      this.removeAttachment(id);
    },

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
