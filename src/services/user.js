import axios from 'axios';
// import store from '../store';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

const configuredApplicationYear = (process.env.VUE_APP_APPLICATION_YEAR || '').trim();
const resolvedApplicationYear = !configuredApplicationYear || configuredApplicationYear.toLowerCase() === 'current'
    ? `${new Date().getFullYear()}`
    : configuredApplicationYear;

const applicationBasePath = (id) => {
  if (configuredApplicationYear.toLowerCase() === 'none') {
    return `/users/${id}/application`;
  }

  return `/users/${id}/application/${resolvedApplicationYear}`;
};

export default {
  async requestPassword(email) {
    return axios.post(`/users/${email}`);
  },

  async login(email, password) {
    return axios.get(`/users/${email}/authorize`, {
      auth: {
        username: email,
        password,
      },
    });
  },

  async getPayments() {
    return axios.get('/users/me/payments');
  },

  async postPayment(data) {
    return axios.post(`/users/me/payments/${data.amount}`);
  },

  async getOffer() {
    return axios.get(`${applicationBasePath('me')}/offer`);
  },

  async putOffer(data) {
    return axios.put(`${applicationBasePath('me')}/offer`, data);
  },

  async putApplication(id, data) {
    return axios.put(applicationBasePath(id), data);
  },

  async getApplication(id) {
    return axios.get(applicationBasePath(id));
  },

  async getRecommendations(id) {
    return axios.get(`${applicationBasePath(id)}/recommendations`);
  },

  async getAttachments(id) {
    return axios.get(`${applicationBasePath(id)}/attachments`);
  },

  async deleteAttachment(id, attachmentId) {
    return axios.delete(`${applicationBasePath(id)}/attachments/${attachmentId}`);
  },

  async postAttachment(id, file, label) {
    const formData = new FormData();

    formData.append('file', file);

    let url = `${applicationBasePath(id)}/attachments`;
    if (label) url = `${url}/${label}`;

    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async addRecommendation(id, email) {
    return axios.post(`${applicationBasePath(id)}/recommendations/${email}`);
  },

  async createVideoMultipart(id, contentType) {
    const data = {};
    if (contentType) data.contentType = contentType;
    return axios.post(
      `${applicationBasePath(id)}/video/multipart/create`,
      data,
    );
  },

  async createVideoPartUrl(id, { uploadId, key, partNumber }) {
    return axios.post(
      `${applicationBasePath(id)}/video/multipart/part-url`,
      {
        uploadId,
        key,
        partNumber,
      },
    );
  },

  async completeVideoMultipart(id, { uploadId, key, parts }) {
    return axios.post(
      `${applicationBasePath(id)}/video/multipart/complete`,
      {
        uploadId,
        key,
        parts,
      },
    );
  },

  async abortVideoMultipart(id, { uploadId, key }) {
    return axios.post(
      `${applicationBasePath(id)}/video/multipart/abort`,
      {
        uploadId,
        key,
      },
    );
  },

  async getVideoUrl(id) {
    return axios.get(`${applicationBasePath(id)}/video`);
  },
};
