<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Video Essay</v-card-title>
          <v-card-subtitle>
            Record a short video using your webcam and microphone. Live recording only; file uploads
            are not accepted.
          </v-card-subtitle>
          <v-card-text>
            <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
            <v-alert v-if="successMessage" type="success" dense>{{ successMessage }}</v-alert>
            <v-row>
              <v-col cols="12" md="7">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="selectedVideoInput"
                      :items="videoInputs"
                      item-text="label"
                      item-value="deviceId"
                      label="Camera"
                      dense
                      outlined
                      :disabled="recording || uploading"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="selectedAudioInput"
                      :items="audioInputs"
                      item-text="label"
                      item-value="deviceId"
                      label="Microphone"
                      dense
                      outlined
                      :disabled="recording || uploading"
                    ></v-select>
                  </v-col>
                </v-row>
                <div class="audio-meter">
                  <div class="audio-meter__label">Audio Level</div>
                  <v-progress-linear
                    :value="audioLevel"
                    height="8"
                    color="green"
                  ></v-progress-linear>
                </div>
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
                <v-progress-linear
                  v-if="uploading"
                  class="mt-3"
                  :value="uploadProgress"
                  :indeterminate="recording"
                  height="6"
                  color="primary"
                ></v-progress-linear>
              </v-col>
              <v-col cols="12" md="5">
                <div class="video-instructions">
                  <div class="video-instructions__title">Video Essay Prompts</div>
                  <div class="video-instructions__intro">
                    Please record a short video responding to <strong>four prompts</strong> below. We are much more
                    interested in how you think than in polished production.
                  </div>
                  <div class="video-instructions__prompt">
                    <span class="video-instructions__prompt-title">Introduce yourself.</span>
                    <span class="video-instructions__prompt-body">
                      Tell us your name, pronouns, and the name and location of your high school.
                    </span>
                  </div>
                  <div class="video-instructions__prompt">
                    <span class="video-instructions__prompt-title">Your mathematical process.</span>
                    <span class="video-instructions__prompt-body">
                      Describe an open-ended mathematical problem or project you have worked on.
                      Focus on how you approached the problem.
                    </span>
                  </div>
                  <div class="video-instructions__prompt">
                    <span class="video-instructions__prompt-title">Why Ross?</span>
                    <span class="video-instructions__prompt-body">
                      What do you love about doing mathematics? What excites you about spending six
                      weeks immersed in math at Ross?
                    </span>
                  </div>
                  <div class="video-instructions__prompt">
                    <span class="video-instructions__prompt-title">Interestingness.</span>
                    <span class="video-instructions__prompt-body">
                      Share something interesting about yourself.
                    </span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="existingVideoUrl">
      <v-col>
        <v-card>
          <v-card-title>Previously Uploaded Video</v-card-title>
          <v-card-subtitle>
            This is the video currently on file. Record a new one above to replace it.
          </v-card-subtitle>
          <v-card-text>
            <div class="video-frame">
              <video :src="existingVideoUrl" controls playsinline></video>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import userService from '../services/user';

const PART_SIZE = 5 * 1024 * 1024;

function pickSupportedMimeType() {
  if (!window.MediaRecorder) return '';
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  for (let i = 0; i < candidates.length; i += 1) {
    if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i];
  }
  return '';
}

export default {
  data() {
    return {
      mediaStream: null,
      mediaRecorder: null,
      audioContext: null,
      audioAnalyser: null,
      audioDataArray: null,
      audioFloatDataArray: null,
      audioMeterRaf: null,
      audioMeterTimer: null,
      recordedChunks: [],
      recordedBlob: null,
      recordedUrl: '',
      existingVideoUrl: '',
      recording: false,
      uploading: false,
      uploadProgress: 0,
      uploadId: '',
      uploadKey: '',
      uploadParts: [],
      nextPartNumber: 1,
      uploadChain: Promise.resolve(),
      pendingChunks: [],
      pendingSize: 0,
      uploadFailed: false,
      uploadContentType: '',
      error: '',
      successMessage: '',
      recordingMimeType: '',
      audioInputs: [],
      videoInputs: [],
      selectedAudioInput: '',
      selectedVideoInput: '',
      audioLevel: 0,
      deviceChangeHandler: null,
    };
  },

  computed: {
    hasStream() {
      return !!this.mediaStream;
    },
  },

  watch: {
    selectedAudioInput(newValue, oldValue) {
      if (oldValue && newValue !== oldValue && this.hasStream && !this.recording) {
        this.enableCamera();
      }
    },
    selectedVideoInput(newValue, oldValue) {
      if (oldValue && newValue !== oldValue && this.hasStream && !this.recording) {
        this.enableCamera();
      }
    },
  },

  methods: {
    async enableCamera() {
      this.error = '';
      this.successMessage = '';
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.error = 'Your browser does not support webcam recording.';
        return;
      }
      try {
        this.stopStream();
        const constraints = {
          video: this.selectedVideoInput
            ? { deviceId: { exact: this.selectedVideoInput } }
            : true,
          audio: this.selectedAudioInput
            ? { deviceId: { exact: this.selectedAudioInput } }
            : true,
        };
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoEl = this.$refs.liveVideo;
        if (videoEl) videoEl.srcObject = this.mediaStream;
        await this.loadDevices();
        this.setupAudioMeter();
      } catch (err) {
        this.error = 'Unable to access your camera and microphone.';
      }
    },

    disableCamera() {
      if (this.mediaRecorder && this.recording) {
        this.stopRecording();
      }
      const videoEl = this.$refs.liveVideo;
      if (videoEl) videoEl.srcObject = null;
      this.stopStream();
    },

    stopStream() {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
      }
      this.mediaStream = null;
      this.teardownAudioMeter();
      this.audioLevel = 0;
    },

    async loadDevices() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        this.audioInputs = audioInputs.map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${index + 1}`,
        }));
        this.videoInputs = videoInputs.map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
        }));

        const audioTrack = this.mediaStream && this.mediaStream.getAudioTracks()[0];
        const videoTrack = this.mediaStream && this.mediaStream.getVideoTracks()[0];
        const audioSettings = audioTrack ? audioTrack.getSettings() : null;
        const videoSettings = videoTrack ? videoTrack.getSettings() : null;

        if (!this.selectedAudioInput) {
          this.selectedAudioInput = (audioSettings && audioSettings.deviceId)
            || (this.audioInputs[0] && this.audioInputs[0].deviceId)
            || '';
        }
        if (!this.selectedVideoInput) {
          this.selectedVideoInput = (videoSettings && videoSettings.deviceId)
            || (this.videoInputs[0] && this.videoInputs[0].deviceId)
            || '';
        }
      } catch (err) {
        // Ignore device enumeration errors.
      }
    },

    setupAudioMeter() {
      this.teardownAudioMeter();
      if (!this.mediaStream) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      try {
        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.audioAnalyser.fftSize = 512;
        this.audioAnalyser.smoothingTimeConstant = 0.1;
        source.connect(this.audioAnalyser);
        this.audioDataArray = new Uint8Array(this.audioAnalyser.fftSize);
        if (this.audioAnalyser.getFloatTimeDomainData) {
          this.audioFloatDataArray = new Float32Array(this.audioAnalyser.fftSize);
        }
        const updateMeter = () => {
          if (!this.audioAnalyser) return;
          let sumSquares = 0;
          if (this.audioFloatDataArray) {
            this.audioAnalyser.getFloatTimeDomainData(this.audioFloatDataArray);
            for (let i = 0; i < this.audioFloatDataArray.length; i += 1) {
              const sample = this.audioFloatDataArray[i];
              sumSquares += sample * sample;
            }
          } else {
            this.audioAnalyser.getByteTimeDomainData(this.audioDataArray);
            for (let i = 0; i < this.audioDataArray.length; i += 1) {
              const sample = (this.audioDataArray[i] - 128) / 128;
              sumSquares += sample * sample;
            }
          }
          const totalSamples = this.audioFloatDataArray
            ? this.audioFloatDataArray.length
            : this.audioDataArray.length;
          const rms = Math.sqrt(sumSquares / totalSamples);
          const db = 20 * Math.log10(rms || 0.00001);
          const level = Math.min(100, Math.max(0, Math.round((db + 60) * (100 / 60))));
          this.audioLevel = level;
        };
        updateMeter();
        this.audioMeterTimer = setInterval(updateMeter, 60);
      } catch (err) {
        this.audioLevel = 0;
      }
    },

    teardownAudioMeter() {
      if (this.audioMeterRaf) {
        cancelAnimationFrame(this.audioMeterRaf);
        this.audioMeterRaf = null;
      }
      if (this.audioMeterTimer) {
        clearInterval(this.audioMeterTimer);
        this.audioMeterTimer = null;
      }
      if (this.audioAnalyser) {
        this.audioAnalyser.disconnect();
        this.audioAnalyser = null;
      }
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
      this.audioFloatDataArray = null;
    },

    async startRecording() {
      if (this.recording) return;
      if (!this.mediaStream) {
        await this.enableCamera();
      }
      if (!this.mediaStream) return;
      this.error = '';
      this.successMessage = '';
      this.recordedChunks = [];
      this.recordedBlob = null;
      if (this.recordedUrl) {
        URL.revokeObjectURL(this.recordedUrl);
        this.recordedUrl = '';
      }
      const mimeType = pickSupportedMimeType();
      this.recordingMimeType = mimeType;
      const contentType = mimeType || 'video/webm';
      this.uploadContentType = contentType;
      try {
        this.mediaRecorder = new MediaRecorder(
          this.mediaStream,
          mimeType ? { mimeType } : undefined,
        );
      } catch (err) {
        this.error = 'Recording is not supported in this browser.';
        return;
      }
      try {
        await this.beginMultipartUpload();
      } catch (err) {
        this.error = 'Unable to start the upload. Please try again.';
        return;
      }
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
          this.pendingChunks.push(event.data);
          this.pendingSize += event.data.size;
          this.flushPendingChunks(false);
        }
      };
      this.mediaRecorder.onstop = async () => {
        this.recording = false;
        if (!this.recordedChunks.length) {
          this.error = 'Recording failed. Please try again.';
          await this.abortMultipartUpload();
          return;
        }
        const blob = new Blob(this.recordedChunks, {
          type: this.recordingMimeType || 'video/webm',
        });
        this.recordedBlob = blob;
        this.recordedUrl = URL.createObjectURL(blob);
        await this.finalizeMultipartUpload();
      };
      this.recording = true;
      this.mediaRecorder.start(1000);
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
      this.recordedUrl = '';
      this.successMessage = '';
    },

    async beginMultipartUpload() {
      this.uploading = true;
      this.uploadProgress = 0;
      this.uploadFailed = false;
      this.uploadChain = Promise.resolve();
      this.uploadParts = [];
      this.nextPartNumber = 1;
      this.pendingChunks = [];
      this.pendingSize = 0;

      const createResponse = await userService.createVideoMultipart(
        'me',
        this.uploadContentType || 'video/webm',
      );
      ({ uploadId: this.uploadId, key: this.uploadKey } = createResponse.data);
    },

    buildBlobPart(size) {
      let remaining = size;
      const parts = [];

      while (remaining > 0 && this.pendingChunks.length) {
        const chunk = this.pendingChunks[0];
        if (chunk.size <= remaining) {
          parts.push(chunk);
          this.pendingChunks.shift();
          remaining -= chunk.size;
        } else {
          parts.push(chunk.slice(0, remaining));
          this.pendingChunks[0] = chunk.slice(remaining);
          remaining = 0;
        }
      }

      const consumed = size - remaining;
      this.pendingSize = Math.max(0, this.pendingSize - consumed);
      return new Blob(parts, {
        type: this.recordingMimeType || 'video/webm',
      });
    },

    flushPendingChunks(isFinal) {
      if (this.uploadFailed) return;
      const blobs = [];

      while (this.pendingSize >= PART_SIZE) {
        blobs.push(this.buildBlobPart(PART_SIZE));
      }

      if (isFinal && this.pendingSize > 0) {
        blobs.push(this.buildBlobPart(this.pendingSize));
      }

      blobs.forEach((blob) => {
        this.uploadChain = this.uploadChain.then(() => this.uploadPart(blob));
      });
    },

    async uploadPart(blob) {
      if (this.uploadFailed) return;
      try {
        const partNumber = this.nextPartNumber;
        const partResponse = await userService.createVideoPartUrl('me', {
          uploadId: this.uploadId,
          key: this.uploadKey,
          partNumber,
        });

        const uploadResponse = await fetch(partResponse.data.url, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': this.uploadContentType || 'video/webm',
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed.');
        }

        const eTag = uploadResponse.headers.get('ETag') || uploadResponse.headers.get('etag');
        if (!eTag) {
          throw new Error('Upload failed to return an ETag.');
        }

        this.uploadParts.push({ PartNumber: partNumber, ETag: eTag });
        this.nextPartNumber += 1;
      } catch (err) {
        this.uploadFailed = true;
        this.error = 'Unable to upload your video. Please try again.';
        await this.abortMultipartUpload();
      }
    },

    async finalizeMultipartUpload() {
      this.flushPendingChunks(true);
      try {
        await this.uploadChain;
        if (this.uploadFailed) return;
        await userService.completeVideoMultipart('me', {
          uploadId: this.uploadId,
          key: this.uploadKey,
          parts: this.uploadParts,
        });
        this.uploadProgress = 100;
        this.successMessage = 'Video uploaded successfully.';
        await this.refreshExistingVideo();
      } catch (err) {
        this.error = 'Unable to upload your video. Please try again.';
        await this.abortMultipartUpload();
      } finally {
        this.uploading = false;
      }
    },

    async abortMultipartUpload() {
      if (!this.uploadId || !this.uploadKey) return;
      try {
        await userService.abortVideoMultipart('me', {
          uploadId: this.uploadId,
          key: this.uploadKey,
        });
      } catch (abortErr) {
        // Ignore abort errors.
      } finally {
        this.uploading = false;
      }
    },

    async refreshExistingVideo() {
      try {
        const response = await userService.getVideoUrl('me');
        if (response.status === 200 && response.data && response.data.url) {
          this.existingVideoUrl = response.data.url;
          this.$store.commit('setVideoExists', true);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.existingVideoUrl = '';
          this.$store.commit('setVideoExists', false);
        } else {
          this.error = 'Unable to load your existing video.';
          this.$store.commit('setVideoExists', false);
        }
      }
    },
  },

  mounted() {
    this.refreshExistingVideo();
    this.enableCamera();
    this.loadDevices();
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      this.deviceChangeHandler = () => this.loadDevices();
      navigator.mediaDevices.addEventListener('devicechange', this.deviceChangeHandler);
    }
  },

  beforeDestroy() {
    this.disableCamera();
    if (this.recordedUrl) {
      URL.revokeObjectURL(this.recordedUrl);
    }
    if (navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
      navigator.mediaDevices.removeEventListener('devicechange', this.deviceChangeHandler);
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

.audio-meter {
  margin-bottom: 16px;
}

.audio-meter__label {
  font-size: 0.85rem;
  color: #616161;
  margin-bottom: 4px;
}

.video-instructions {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
}

.video-instructions__title {
  font-weight: 600;
  margin-bottom: 6px;
}

.video-instructions__intro {
  color: #616161;
  margin-bottom: 10px;
}

.video-instructions__prompt {
  margin-bottom: 8px;
}

.video-instructions__prompt-title {
  font-weight: 600;
  margin-right: 6px;
}

.video-instructions__prompt-body {
  color: #424242;
}
</style>
