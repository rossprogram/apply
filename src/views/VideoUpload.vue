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
            <v-alert v-if="error" type="error" dense class="mb-3">
              {{ error }}
              <template v-slot:append>
                <v-btn text small @click="retryInitialization">Retry</v-btn>
              </template>
            </v-alert>
            <v-alert v-if="!hasStream && !error && videoInputs.length === 0" type="warning" dense class="mb-3">
              No camera detected. Please ensure your camera is connected and browser permissions are granted.
              <template v-slot:append>
                <v-btn text small @click="retryInitialization">Retry</v-btn>
              </template>
            </v-alert>
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
                  <v-btn color="primary" @click="startRecording" :disabled="recording || uploading || isStartingRecording">
                    Start recording
                  </v-btn>
                  <v-btn color="error" @click="stopRecording" :disabled="!recording || isRecordingTooShort">
                    Stop recording
                  </v-btn>
                  <span v-if="recording" class="recording-timer ml-3" :class="{ 'recording-timer--warning': recordingTimeRemaining <= 60 }">
                    {{ formattedRecordingTime }} / {{ formattedMaxTime }}
                  </span>
                </div>
                <div v-if="recording && isRecordingTooShort" class="mt-2 text-caption grey--text">
                  Minimum recording length: {{ MIN_RECORDING_SECONDS }} seconds
                </div>
                <div v-if="recording && recordingTimeRemaining <= 60" class="mt-2 text-caption error--text">
                  Recording will automatically stop in {{ recordingTimeRemaining }} seconds
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
                    Please record <strong>one</strong> video responding to <strong>all four prompts</strong> below. We are much more
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
const MAX_RECORDING_SECONDS = 30 * 60; // 30 minutes
const MIN_RECORDING_SECONDS = 10; // 10 seconds

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
      recordingStartTime: null,
      recordingElapsed: 0,
      recordingTimer: null,
      totalBytesUploaded: 0,
      totalBytesToUpload: 0,
      videoUrlRefreshTimer: null,
      isStartingRecording: false,
      beforeUnloadHandler: null,
    };
  },

  computed: {
    hasStream() {
      return !!this.mediaStream;
    },
    formattedRecordingTime() {
      const minutes = Math.floor(this.recordingElapsed / 60);
      const seconds = this.recordingElapsed % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    formattedMaxTime() {
      const minutes = Math.floor(MAX_RECORDING_SECONDS / 60);
      return `${minutes}:00`;
    },
    recordingTimeRemaining() {
      return MAX_RECORDING_SECONDS - this.recordingElapsed;
    },
    isRecordingTooShort() {
      return this.recordingElapsed < MIN_RECORDING_SECONDS;
    },
    MIN_RECORDING_SECONDS() {
      return MIN_RECORDING_SECONDS;
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
        console.error('[VideoUpload] Browser does not support getUserMedia');
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
        console.log('[VideoUpload] Requesting media with constraints:', constraints);
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

        // Validate that we have active tracks
        const videoTracks = this.mediaStream.getVideoTracks();
        const audioTracks = this.mediaStream.getAudioTracks();
        console.log('[VideoUpload] Got stream with video tracks:', videoTracks.length, 'audio tracks:', audioTracks.length);

        if (videoTracks.length === 0 || videoTracks[0].readyState !== 'live') {
          console.error('[VideoUpload] No active video track');
          this.error = 'Camera not available. Please check your camera connection.';
          this.stopStream();
          return;
        }
        if (audioTracks.length === 0 || audioTracks[0].readyState !== 'live') {
          console.error('[VideoUpload] No active audio track');
          this.error = 'Microphone not available. Please check your microphone connection.';
          this.stopStream();
          return;
        }

        // Use $nextTick to ensure the video element ref is available
        await this.$nextTick();
        const videoEl = this.$refs.liveVideo;
        if (videoEl) {
          videoEl.srcObject = this.mediaStream;
          console.log('[VideoUpload] Attached stream to video element');
        } else {
          console.error('[VideoUpload] Video element ref not available');
          this.error = 'Unable to display camera preview. Please refresh the page.';
          this.stopStream();
          return;
        }

        await this.loadDevices();
        await this.setupAudioMeter();
      } catch (err) {
        console.error('[VideoUpload] Error enabling camera:', err.name, err.message);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          this.error = 'Camera/microphone access denied. Please allow access in your browser settings and refresh.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          this.error = 'No camera or microphone found. Please connect a device and try again.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          this.error = 'Camera or microphone is in use by another application. Please close other apps and try again.';
        } else if (err.name === 'OverconstrainedError') {
          // Selected device no longer available, try again with defaults
          console.warn('[VideoUpload] Device constraint failed, retrying with defaults');
          this.selectedVideoInput = '';
          this.selectedAudioInput = '';
          try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            await this.$nextTick();
            const videoEl = this.$refs.liveVideo;
            if (videoEl) videoEl.srcObject = this.mediaStream;
            await this.loadDevices();
            await this.setupAudioMeter();
            return;
          } catch (retryErr) {
            console.error('[VideoUpload] Retry also failed:', retryErr.name, retryErr.message);
            this.error = 'Unable to access your camera and microphone.';
          }
        } else {
          this.error = 'Unable to access your camera and microphone.';
        }
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
      if (!navigator.mediaDevices) {
        console.error('[VideoUpload] navigator.mediaDevices is not available');
        this.error = 'Camera access is blocked. This may be caused by a browser extension. Try disabling extensions or use Incognito mode.';
        return;
      }
      if (!navigator.mediaDevices.enumerateDevices) {
        console.warn('[VideoUpload] enumerateDevices not supported');
        this.error = 'Your browser does not support device enumeration.';
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('[VideoUpload] Raw devices from enumerateDevices:', devices);

        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        console.log('[VideoUpload] Found devices - cameras:', videoInputs.length, 'microphones:', audioInputs.length);

        if (videoInputs.length === 0 && audioInputs.length === 0) {
          console.warn('[VideoUpload] No camera or microphone devices found');
          // Don't set error here as enableCamera will provide a better message
        }

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
        console.error('[VideoUpload] Error enumerating devices:', err);
        this.error = `Unable to list camera/microphone devices: ${err.message}. A browser extension may be blocking access.`;
      }
    },

    async setupAudioMeter() {
      this.teardownAudioMeter();
      if (!this.mediaStream) {
        console.warn('[VideoUpload] Cannot setup audio meter: no media stream');
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.warn('[VideoUpload] AudioContext not supported');
        return;
      }
      try {
        this.audioContext = new AudioContext();

        // Handle suspended AudioContext (common when created without user interaction)
        if (this.audioContext.state === 'suspended') {
          console.log('[VideoUpload] AudioContext suspended, attempting to resume');
          try {
            await this.audioContext.resume();
            console.log('[VideoUpload] AudioContext resumed successfully');
          } catch (resumeErr) {
            console.warn('[VideoUpload] Could not resume AudioContext:', resumeErr.message);
            // Continue anyway - it may resume on user interaction later
          }
        }

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

          // Try to resume AudioContext if still suspended (will work after user interaction)
          if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(() => {});
          }

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
        console.log('[VideoUpload] Audio meter setup complete');
      } catch (err) {
        console.error('[VideoUpload] Error setting up audio meter:', err.message);
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
      if (this.recording || this.isStartingRecording) return;
      this.isStartingRecording = true;

      try {
        if (!this.mediaStream) {
          await this.enableCamera();
        }
        if (!this.mediaStream) {
          this.isStartingRecording = false;
          return;
        }
        this.error = '';
        this.successMessage = '';
        this.recordedChunks = [];
        this.recordedBlob = null;
        this.cleanupRecordedUrl();

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
          this.isStartingRecording = false;
          return;
        }
        try {
          await this.beginMultipartUpload();
        } catch (err) {
          this.error = 'Unable to start the upload. Please try again.';
          this.isStartingRecording = false;
          return;
        }

        // Handle recorder errors
        this.mediaRecorder.onerror = (event) => {
          console.error('[VideoUpload] MediaRecorder error:', event.error);
          this.error = 'Recording error occurred. Please try again.';
          this.stopRecordingTimer();
          this.recording = false;
          this.abortMultipartUpload();
        };

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
            this.pendingChunks.push(event.data);
            this.pendingSize += event.data.size;
            this.totalBytesToUpload += event.data.size;
            this.flushPendingChunks(false);
          }
        };

        this.mediaRecorder.onstop = async () => {
          this.stopRecordingTimer();
          this.recording = false;
          this.removeTrackEndedListeners();

          if (this.recordingElapsed < MIN_RECORDING_SECONDS) {
            this.error = `Recording too short. Minimum length is ${MIN_RECORDING_SECONDS} seconds.`;
            await this.abortMultipartUpload();
            return;
          }

          if (!this.recordedChunks.length) {
            this.error = 'Recording failed. Please try again.';
            await this.abortMultipartUpload();
            return;
          }
          const blob = new Blob(this.recordedChunks, {
            type: this.recordingMimeType || 'video/webm',
          });
          this.recordedBlob = blob;
          await this.finalizeMultipartUpload();
        };

        // Listen for track ended events (camera/mic disconnected)
        this.setupTrackEndedListeners();

        // Setup beforeunload protection
        this.setupBeforeUnloadProtection();

        // Start recording timer
        this.startRecordingTimer();

        this.recording = true;
        this.mediaRecorder.start(1000);
        console.log('[VideoUpload] Recording started');
      } finally {
        this.isStartingRecording = false;
      }
    },

    stopRecording() {
      if (!this.mediaRecorder || !this.recording) return;
      this.mediaRecorder.stop();
    },

    startRecordingTimer() {
      this.recordingStartTime = Date.now();
      this.recordingElapsed = 0;
      this.recordingTimer = setInterval(() => {
        this.recordingElapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        // Auto-stop at max length
        if (this.recordingElapsed >= MAX_RECORDING_SECONDS) {
          console.log('[VideoUpload] Max recording length reached, stopping');
          this.stopRecording();
        }
      }, 1000);
    },

    stopRecordingTimer() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
    },

    setupTrackEndedListeners() {
      if (!this.mediaStream) return;
      const tracks = this.mediaStream.getTracks();
      tracks.forEach((track) => {
        track.onended = () => {
          console.error('[VideoUpload] Track ended unexpectedly:', track.kind);
          if (this.recording) {
            this.error = `${track.kind === 'video' ? 'Camera' : 'Microphone'} was disconnected. Recording stopped.`;
            this.stopRecording();
          }
        };
      });
    },

    removeTrackEndedListeners() {
      if (!this.mediaStream) return;
      const tracks = this.mediaStream.getTracks();
      tracks.forEach((track) => {
        track.onended = null;
      });
    },

    setupBeforeUnloadProtection() {
      this.beforeUnloadHandler = (event) => {
        if (this.recording || this.uploading) {
          event.preventDefault();
          event.returnValue = 'You have a recording in progress. Are you sure you want to leave?';
          return event.returnValue;
        }
        return undefined;
      };
      window.addEventListener('beforeunload', this.beforeUnloadHandler);
    },

    removeBeforeUnloadProtection() {
      if (this.beforeUnloadHandler) {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
        this.beforeUnloadHandler = null;
      }
    },

    cleanupRecordedUrl() {
      if (this.recordedUrl) {
        URL.revokeObjectURL(this.recordedUrl);
        this.recordedUrl = '';
      }
      this.recordedBlob = null;
    },

    async retryInitialization() {
      this.error = '';
      this.successMessage = '';
      console.log('[VideoUpload] Retrying initialization...');

      // Check mediaDevices availability again
      if (!navigator.mediaDevices) {
        this.error = 'Camera access is still blocked. Please disable browser extensions that may be blocking camera access, then refresh the page.';
        return;
      }

      await this.loadDevices();
      await this.enableCamera();
    },

    discardRecording() {
      this.cleanupRecordedUrl();
      this.recordedChunks = [];
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
      this.totalBytesUploaded = 0;
      this.totalBytesToUpload = 0;

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
      const blobSize = blob.size;
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

        // Update progress
        this.totalBytesUploaded += blobSize;
        if (this.totalBytesToUpload > 0) {
          this.uploadProgress = Math.min(
            99,
            Math.round((this.totalBytesUploaded / this.totalBytesToUpload) * 100),
          );
        }
        console.log(`[VideoUpload] Uploaded part ${partNumber}, progress: ${this.uploadProgress}%`);
      } catch (err) {
        console.error('[VideoUpload] Failed to upload part:', err.message);
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

        // Sort parts by PartNumber to ensure correct order for S3
        const sortedParts = [...this.uploadParts].sort((a, b) => a.PartNumber - b.PartNumber);

        await userService.completeVideoMultipart('me', {
          uploadId: this.uploadId,
          key: this.uploadKey,
          parts: sortedParts,
        });
        this.uploadProgress = 100;
        this.successMessage = 'Video uploaded successfully.';
        this.removeBeforeUnloadProtection();
        await this.refreshExistingVideo();
      } catch (err) {
        console.error('[VideoUpload] Failed to finalize upload:', err.message);
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
        this.removeBeforeUnloadProtection();
      }
    },

    async refreshExistingVideo() {
      try {
        const response = await userService.getVideoUrl('me');
        if (response.status === 200 && response.data && response.data.url) {
          this.existingVideoUrl = response.data.url;
          this.$store.commit('setVideoExists', true);
          // Set up periodic refresh to prevent URL expiration (every 10 minutes)
          this.scheduleVideoUrlRefresh();
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

    scheduleVideoUrlRefresh() {
      // Clear any existing timer
      if (this.videoUrlRefreshTimer) {
        clearTimeout(this.videoUrlRefreshTimer);
      }
      // Refresh URL every 10 minutes to prevent expiration
      this.videoUrlRefreshTimer = setTimeout(() => {
        if (this.existingVideoUrl) {
          console.log('[VideoUpload] Refreshing video URL to prevent expiration');
          this.refreshExistingVideo();
        }
      }, 10 * 60 * 1000);
    },
  },

  async mounted() {
    // Check for mediaDevices support first and show clear error if blocked
    if (!navigator.mediaDevices) {
      console.error('[VideoUpload] navigator.mediaDevices is not available');
      this.error = 'Camera access is blocked. This may be caused by a browser extension (e.g., privacy/security extensions). Try disabling extensions or use Incognito mode.';
      return;
    }

    try {
      this.refreshExistingVideo();
      // Load devices first (will have limited info without stream)
      await this.loadDevices();
      // Then enable camera - this will call loadDevices again with full info
      await this.enableCamera();
      if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
        this.deviceChangeHandler = () => this.loadDevices();
        navigator.mediaDevices.addEventListener('devicechange', this.deviceChangeHandler);
      }
    } catch (err) {
      console.error('[VideoUpload] Error during initialization:', err);
      this.error = `Failed to initialize camera: ${err.message}. Try disabling browser extensions or use Incognito mode.`;
    }
  },

  beforeDestroy() {
    this.disableCamera();
    this.cleanupRecordedUrl();
    this.stopRecordingTimer();
    this.removeBeforeUnloadProtection();
    this.removeTrackEndedListeners();
    if (this.videoUrlRefreshTimer) {
      clearTimeout(this.videoUrlRefreshTimer);
      this.videoUrlRefreshTimer = null;
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

.recording-timer {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 600;
  color: #d32f2f;
  vertical-align: middle;
}

.recording-timer--warning {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
