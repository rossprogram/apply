<template>
<v-form :key="key">
  <v-container fluid>

    <p>Please respond to each of the prompts below.  There is no prescribed word count limit.</p>

      <v-row><v-col><v-card>
    <v-card-title>Optional PDF</v-card-title>
    <v-card-subtitle>For your response below, if you wish to use mathematical formatting not available here, you may include your response to all prompts below as a single PDF file.</v-card-subtitle>
    <v-card-text class="py-0">
	      <v-list-item two-line v-for="attachment in essayAttachments"
			   :href="attachment.url"
			   :key="attachment.id">
		<v-list-item-icon>
		  <v-icon>mdi-file</v-icon>
		</v-list-item-icon>
		<v-list-item-content>
		  <v-list-item-title>{{ attachment.name }}</v-list-item-title>
		  <v-list-item-subtitle v-if="attachment.createdAt">Uploaded {{ attachment.createdAt | moment("from", "now") }}</v-list-item-subtitle>
		</v-list-item-content>
		<v-list-item-action @click.prevent="remove(attachment.id)">
		  <v-btn icon>
		    <v-icon color="grey lighten-1">mdi-delete</v-icon>
		  </v-btn>
		</v-list-item-action>
	      </v-list-item>

	      <v-list-item two-line>
		<v-list-item-content>
		  <v-list-item-title>
		    <v-file-input v-model="file" label="Upload your essay responses" hint="Optionally, instead of entering your responses below, you may upload your responses as a PDF." persistent-hint/>
		  </v-list-item-title>
		  <v-list-item-subtitle></v-list-item-subtitle>
		</v-list-item-content>
		<v-list-item-action @click="upload">
		  <v-btn color="primary">
		    Upload
		    <v-icon right>mdi-upload</v-icon>
		  </v-btn>
		</v-list-item-action>
	      </v-list-item>
	      </v-card-text>
      </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Projects</v-card-title>
    <v-card-subtitle><strong>Have you worked on some interesting mathematical projects?</strong> If so, what were the topics? For the project you enjoyed the most: How much time did you spend on it? Were you working alone, guided by a mentor, or as part of a team? What benefits do you feel you gained from doing that work?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="interestingProjects"
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
    <v-card-title>Competitions</v-card-title>
    <v-card-subtitle><strong>Have you recently participated in some math competitions?</strong> Which ones? Did you do well on them? Do you feel that the process of preparing for math competitions to be more interesting and worthwhile than the math courses you have taken in high school or in other venues?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="competitions"
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
    <v-card-subtitle><strong>Have you participated in academic programs outside of school?</strong> This might include another summer math camp, a local Math Club, or a Math Circle at some nearby college.  What sorts of activities were involved? Did you enjoy those experiences?  Were the programs online or were they in-person?</v-card-subtitle>
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
    <v-card-title>Books and websites</v-card-title>
    <v-card-subtitle><strong>What have you read recently about mathematics?</strong> Which math books are your favorites? What parts of them were most enjoyable or interesting to you? What interesting mathematical websites have you visited in the past year? What aspects of math have you learned by reading the material on those sites?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="books"
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

  <v-row><v-col><v-card>
    <v-card-title>Collaboration</v-card-title>
    <v-card-subtitle><strong>When you work on hard math problems do you usually work alone? Or with a group of friends?</strong>  Reminder: when you work on the Ross Application Problems, please be sure to work by yourself.</v-card-subtitle>
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
    <v-card-title>Other coursework</v-card-title>
    <v-card-subtitle><strong>Have you taken math courses outside of the standard high school curriculum?</strong> Those courses could have been at a local college, in a residential math program, from an educational website, etc.</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="otherCourses"
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
    <v-card-title>Being away from home</v-card-title>
    <v-card-subtitle><strong>Are you eager to spend many weeks away from home, with with no distractions from non-mathematical activities, focusing all of your energies on one narrow area of mathematics?</strong> Ross students live in a college dormitory, with no access to televisions or electronic games. Most of their waking hours are spent working on challenging math problems. Does this intensity and focus appeal to you?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="eager"
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

  interestingProblem: {
      get() { return this.application.interestingProblem; },
      set(v) { this.$set(this.updatedApplication, 'interestingProblem', v); },
    },
  interestingProjects: {
      get() { return this.application.interestingProjects; },
      set(v) { this.$set(this.updatedApplication, 'interestingProjects', v); },
    },
  competitions: {
      get() { return this.application.competitions; },
      set(v) { this.$set(this.updatedApplication, 'competitions', v); },
    },
  otherPrograms: {
      get() { return this.application.otherPrograms; },
      set(v) { this.$set(this.updatedApplication, 'otherPrograms', v); },
    },
  books: {
      get() { return this.application.books; },
      set(v) { this.$set(this.updatedApplication, 'books', v); },
    },
  eager: {
      get() { return this.application.eager; },
      set(v) { this.$set(this.updatedApplication, 'eager', v); },
    },
  intendedMajor: {
      get() { return this.application.intendedMajor; },
      set(v) { this.$set(this.updatedApplication, 'intendedMajor', v); },
    },
  collaboration: {
      get() { return this.application.collaboration; },
      set(v) { this.$set(this.updatedApplication, 'collaboration', v); },
    },
  otherCourses: {
      get() { return this.application.otherCourses; },
      set(v) { this.$set(this.updatedApplication, 'otherCourses', v); },
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
