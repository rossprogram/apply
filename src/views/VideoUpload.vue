<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Application Video</v-card-title>
          <v-card-subtitle>
            Record a short video using your webcam and microphone. Live recording only; file uploads
            are not accepted. After you record, review the video and upload it to your application.
          </v-card-subtitle>
          <v-card-text>
            <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
            <v-alert v-if="successMessage" type="success" dense>{{ successMessage }}</v-alert>
            <v-row>
              <v-col cols="12" md="6">
                <div class="video-frame">
                  <video ref="liveVideo" v-show="hasStream" autoplay muted playsinline></video>
                  <div v-if="!hasStream" class="video-placeholder">
                    Camera preview will appear here after you enable access.
                  </div>
                </div>
                <div class="mt-4">
                  <v-btn color="primary" @click="enableCamera" :disabled="hasStream || recording">
                    Enable camera and microphone
                  </v-btn>
                  <v-btn text @click="disableCamera" :disabled="!hasStream || recording">
                    Turn off camera
                  </v-btn>
                </div>
                <div class="mt-3">
                  <v-btn color="primary" @click="startRecording" :disabled="recording || uploading">
                    Start recording
                  </v-btn>
                  <v-btn color="error" @click="stopRecording" :disabled="!recording">
                    Stop recording
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="video-frame">
                  <video v-if="playbackUrl" :src="playbackUrl" controls playsinline></video>
                  <div v-else class="video-placeholder">Your recorded video will appear here.</div>
                </div>
                <div class="mt-4">
                  <v-btn
                    color="primary"
                    @click="uploadRecording"
                    :disabled="!recordedBlob || uploading"
                  >
                    Upload recording
                  </v-btn>
                  <v-btn text @click="discardRecording" :disabled="!recordedBlob || uploading">
                    Record again
                  </v-btn>
                </div>
                <v-progress-linear
                  v-if="uploading"
                  class="mt-3"
                  :value="uploadProgress"
                  height="6"
                  color="primary"
                ></v-progress-linear>
                <div v-if="existingVideoUrl && !recordedBlob" class="mt-3">
                  Existing video on file. You can record a new one to replace it.
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import userService from "../services/user";

const PART_SIZE = 5 * 1024 * 1024;

function pickSupportedMimeType() {
  if (!window.MediaRecorder) return "";
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  for (let i = 0; i < candidates.length; i += 1) {
    if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i];
  }
  return "";
}

export default {
  data() {
    return {
      mediaStream: null,
      mediaRecorder: null,
      recordedChunks: [],
      recordedBlob: null,
      recordedUrl: "",
      existingVideoUrl: "",
      recording: false,
      uploading: false,
      uploadProgress: 0,
      error: "",
      successMessage: "",
      recordingMimeType: "",
    };
  },

  computed: {
    hasStream() {
      return !!this.mediaStream;
    },
    playbackUrl() {
      return this.recordedUrl || this.existingVideoUrl;
    },
  },

  methods: {
    async enableCamera() {
      this.error = "";
      this.successMessage = "";
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.error = "Your browser does not support webcam recording.";
        return;
      }
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        const videoEl = this.$refs.liveVideo;
        if (videoEl) videoEl.srcObject = this.mediaStream;
      } catch (err) {
        this.error = "Unable to access your camera and microphone.";
      }
    },

    disableCamera() {
      if (this.mediaRecorder && this.recording) {
        this.stopRecording();
      }
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      }
      const videoEl = this.$refs.liveVideo;
      if (videoEl) videoEl.srcObject = null;
      this.mediaStream = null;
    },

    async startRecording() {
      if (this.recording) return;
      if (!this.mediaStream) {
        await this.enableCamera();
      }
      if (!this.mediaStream) return;
      this.error = "";
      this.successMessage = "";
      this.recordedChunks = [];
      this.recordedBlob = null;
      if (this.recordedUrl) {
        URL.revokeObjectURL(this.recordedUrl);
        this.recordedUrl = "";
      }
      const mimeType = pickSupportedMimeType();
      this.recordingMimeType = mimeType;
      try {
        this.mediaRecorder = new MediaRecorder(
          this.mediaStream,
          mimeType ? { mimeType } : undefined
        );
      } catch (err) {
        this.error = "Recording is not supported in this browser.";
        return;
      }
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        this.recording = false;
        if (!this.recordedChunks.length) {
          this.error = "Recording failed. Please try again.";
          return;
        }
        const blob = new Blob(this.recordedChunks, {
          type: this.recordingMimeType || "video/webm",
        });
        this.recordedBlob = blob;
        this.recordedUrl = URL.createObjectURL(blob);
      };
      this.recording = true;
      this.mediaRecorder.start();
    },

    stopRecording() {
      if (!this.mediaRecorder || !this.recording) return;
      this.mediaRecorder.stop();
    },

    discardRecording() {
      if (this.recordedUrl) {
        URL.revokeObjectURL(this.recordedUrl);
      }
      this.recordedChunks = [];
      this.recordedBlob = null;
      this.recordedUrl = "";
      this.successMessage = "";
    },

    async uploadRecording() {
      if (!this.recordedBlob || this.uploading) return;
      this.error = "";
      this.successMessage = "";
      this.uploading = true;
      this.uploadProgress = 0;

      let uploadId = "";
      let key = "";

      try {
        const contentType =
          this.recordingMimeType || this.recordedBlob.type || "video/webm";
        const createResponse = await userService.createVideoMultipart("me", contentType);
        uploadId = createResponse.data.uploadId;
        key = createResponse.data.key;

        const parts = [];
        const totalParts = Math.ceil(this.recordedBlob.size / PART_SIZE);

        for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
          const start = (partNumber - 1) * PART_SIZE;
          const end = Math.min(start + PART_SIZE, this.recordedBlob.size);
          const blobPart = this.recordedBlob.slice(start, end);

          const partResponse = await userService.createVideoPartUrl("me", {
            uploadId,
            key,
            partNumber,
          });

          const uploadResponse = await fetch(partResponse.data.url, {
            method: "PUT",
            body: blobPart,
            headers: {
              "Content-Type": contentType,
            },
          });

          if (!uploadResponse.ok) {
            throw new Error("Upload failed.");
          }

          const eTag = uploadResponse.headers.get("ETag") || uploadResponse.headers.get("etag");
          if (!eTag) {
            throw new Error("Upload failed to return an ETag.");
          }

          parts.push({ PartNumber: partNumber, ETag: eTag });
          this.uploadProgress = Math.round((parts.length / totalParts) * 100);
        }

        await userService.completeVideoMultipart("me", {
          uploadId,
          key,
          parts,
        });

        this.successMessage = "Video uploaded successfully.";
        await this.refreshExistingVideo();
      } catch (err) {
        this.error = "Unable to upload your video. Please try again.";
        if (uploadId && key) {
          try {
            await userService.abortVideoMultipart("me", { uploadId, key });
          } catch (abortErr) {
            // Ignore abort errors.
          }
        }
      } finally {
        this.uploading = false;
      }
    },

    async refreshExistingVideo() {
      try {
        const response = await userService.getVideoUrl("me");
        if (response.status === 200 && response.data && response.data.url) {
          this.existingVideoUrl = response.data.url;
          this.$store.commit("setVideoExists", true);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.existingVideoUrl = "";
          this.$store.commit("setVideoExists", false);
        } else {
          this.error = "Unable to load your existing video.";
          this.$store.commit("setVideoExists", false);
        }
      }
    },
  },

  mounted() {
    this.refreshExistingVideo();
  },

  beforeDestroy() {
    this.disableCamera();
    if (this.recordedUrl) {
      URL.revokeObjectURL(this.recordedUrl);
    }
  },
};
</script>

<style scoped>
.video-frame {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-frame video {
  width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.video-placeholder {
  color: #616161;
  font-size: 0.95rem;
  text-align: center;
}
</style>
