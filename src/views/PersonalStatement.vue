<template>
  <v-form :key="key">
    <v-container fluid>
      <v-row
        ><v-col
          ><v-card>
            <v-card-title>Personal Statement</v-card-title>

            <v-card-subtitle
              >This is free space for you to tell us about yourself!
              <strong>Introduce yourself to us: who are you?</strong> This essay serves as your
              introduction to the Admissions Committee, and provides an opportunity for you to
              discuss your interest in mathematics and your goals for your participation in the Ross
              Program.</v-card-subtitle
            >
            <v-card-text class="py-0">
              <v-textarea
                class="my-4"
                outlined
                rows="12"
                label="Your personal statement"
                v-model="personalStatement"
              ></v-textarea>

              <v-list-item
                two-line
                v-for="attachment in statementAttachments"
                :href="attachment.url"
                :key="attachment.id"
              >
                <v-list-item-icon>
                  <v-icon>mdi-file</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ attachment.name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="attachment.createdAt"
                    >Uploaded
                    {{ attachment.createdAt | moment("from", "now") }}</v-list-item-subtitle
                  >
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
                    <v-file-input
                      v-model="file"
                      label="Upload your personal statement"
                      hint="Optionally, instead of entering your statement above, you may upload your personal statement as a PDF."
                      persistent-hint
                    />
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
          </v-card></v-col
        ></v-row
      >
    </v-container>

    <v-flex xs12 text-xs-right>
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
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["application"]),
    ...mapState(["attachments"]),

    statementAttachments: {
      get() {
        if (this.attachments)
          return Object.values(this.attachments).filter((a) => a.label === "statement");
        return [];
      },
    },

    personalStatement: {
      get() {
        return this.application.personalStatement;
      },
      set(v) {
        this.$set(this.updatedApplication, "personalStatement", v);
      },
    },
  },

  data() {
    return {
      updatedApplication: {},
      saved: false,
      key: 1,
    };
  },

  methods: {
    ...mapActions([
      "getApplication",
      "updateApplication",
      "getAttachments",
      "removeAttachment",
      "addAttachment",
    ]),

    upload() {
      this.addAttachment({ file: this.file, label: "statement" });
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
      const answer = window.confirm("Do you really want to leave? You have unsaved changes.");
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
    this.getAttachments();
    return this.getApplication();
  },
};
</script>
