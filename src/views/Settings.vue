<template>
  <div class="salmon-result-uploader">
    <require-sign-in message="to open settings page">
      <template v-if="appTokenMode">
        <p>Returning to app. Wait a second...</p>
      </template>
      <template v-else>
        <div>
          <h1>API token</h1>
          <b-field>
            <b-button
              class="is-primary"
              @click="onClickGenerateApiToken"
              :disabled="isRequesting || (!regenerateToken && apiToken !== '')"
            >
              {{ regenerateToken ? 'Regenerate' : 'Get' }} API token
            </b-button>
          </b-field>
          <b-field>
            <b-input custom-class="is-small" type="text" :value="apiToken" disabled />
            <button class="button is-success is-small" ref="copyToClipboard" :disabled="apiToken === ''">
              Copy to clipboard
            </button>
          </b-field>
          <div>
            <b-checkbox v-model="regenerateToken" :value="true">
              Regenerate API token
            </b-checkbox>
          </div>
          <p v-if="regenerateToken">
            Note: Existing API token will be invalidated.
          </p>
        </div>

        <div>
          <h1>Privacy</h1>
          <b-field
            horizontal
            label="Display Name"
            message="If you leave this field blank, your Twitter screen name will be used."
          >
            <b-input type="text" custom-class="is-small" maxlength="10" style="width: 10em;" v-model="displayName" />
          </b-field>
          <b-field label="Avatar" horizontal>
            <b-checkbox v-model="useTwitterAvatar">
              Use Twitter avatar
            </b-checkbox>
          </b-field>
          <b-field horizontal>
            <b-button class="is-primary" @click="onClickUpdatePrivacySettings" :disabled="isRequesting">
              Update privacy settings
            </b-button>
          </b-field>
          <p>
            Your Twitter profile is
            <strong>{{ isTwitterProfilePublic ? 'Public' : 'Private' }}</strong>
            .
          </p>
        </div>

        <template v-if="false && isBrowserUploadEnabled">
          <hr />

          <h1>Upload results</h1>
          <form @submit.prevent>
            <label for="file-selector">
              <a>Select result file(s)</a> or drag and drop result files (each file must be 20KB&lt;).<br />
              You can upload up to 10 results at once.<br />
              <input id="file-selector" @change="onSelectFiles" type="file" accept="application/json" multiple />
            </label>
            <button :disabled="isUploading" @click="onClickUpload">
              Upload
            </button>
            <button :disabled="isUploading" @click="onClickClearFiles">
              Clear files
            </button>

            <h2>Selected Files</h2>
            <div v-for="file in selectedFiles">
              {{ file.name }}
            </div>

            <h2>Upload log</h2>
            <div>
              <div v-for="item in uploadLog" :key="item.job_id">
                <p class="error" v-if="item.error">
                  {{ item.error.summary }}<br />
                  {{ item.error.message }}
                </p>
                <p v-else>
                  <strong>{{ item.job_id ? item.job_id : '?' }}</strong>
                  <span v-if="!item.created"> already exists.</span>
                  <span v-else> was uploaded successfully.</span>
                  See: <router-link :to="`/results/${item.salmon_id}`"> /result/{{ item.salmon_id }} </router-link>
                </p>
              </div>
            </div>
          </form>
        </template>

        <hr />

        <div class="buttons is-centered">
          <button class="button is-danger" @click="onClickSignOut">Sign Out</button>
        </div>
      </template>
    </require-sign-in>
  </div>
</template>

<style scoped>
h1 {
  font-size: 120%;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

#file-selector {
  display: none;
}

.salmon-result-uploader {
  min-height: 50em;
}

.error {
  color: red;
}
</style>

<script>
import Clipboard from 'clipboard';
import { Component, Vue } from 'vue-property-decorator';
import dragDrop from 'drag-drop';

import { statefulApiClient } from '@/api-client';
import { metadataModule as metadata } from '@/store/modules/metadata';
import RequireSignIn from '@/components/RequireSignIn.vue';
import { signOut as signOutUrl } from '@/urls';

@Component({
  name: 'Settings',
  extends: RequireSignIn,
})
export default class Settings extends Vue {
  apiToken = '';
  appTokenMode = false;
  clipboard = null;
  displayName = '';
  isUploading = false;
  isRequesting = false;
  removeListner = null;
  selectedFiles = [];
  uploadLog = [];
  useTwitterAvatar = true;
  regenerateToken = false;

  get isBrowserUploadEnabled() {
    return IS_BROWSER_UPLOAD_ENABLED;
  }
  get isTwitterProfilePublic() {
    return this.displayName === '' && this.useTwitterAvatar;
  }

  onAuthenticated() {
    if (this.$router.currentRoute.hash === '#app-request-api-token') {
      this.appTokenMode = true;

      statefulApiClient.get('/api-token').then((res) => this.$router.push(`#token=${res.data.api_token}`));
      return;
    }

    if (metadata.user.is_custom_name) {
      this.displayName = metadata.user.name;
    }

    if (!metadata.user.twitter_avatar) {
      this.useTwitterAvatar = false;
    }

    if (this.clipboard === null && this.$refs.copyToClipboard !== undefined) {
      this.clipboard = new Clipboard(this.$refs.copyToClipboard, {
        text: () => this.apiToken,
      });
      this.clipboard.on('success', () => {
        alert('Successfully copied API token to clipboard.');
      });
    }

    if (this.removeListner === null) {
      this.removeListner = dragDrop('body', (files) => {
        if (this.isSignedIn) {
          this.addToSelectedFiles(files);
        }
      });
    }
  }
  addToSelectedFiles(files) {
    Array.from(files) // Convert FileList to Array
      .forEach((file) => {
        if (file.type === 'application/json') {
          if (file.size > 20 * 1024) {
            return;
          } else if (this.selectedFiles.length >= 10) {
            return;
          }

          const isAlreadySelected = this.selectedFiles.some(
            (selectedFile) =>
              // Note: Technically this assumption is not always correct.
              file.name === selectedFile.name && file.size === selectedFile.size,
          );

          if (isAlreadySelected) {
            return;
          }

          this.selectedFiles.push(file);
        }
      });
  }
  onSelectFiles(event) {
    this.addToSelectedFiles(event.target.files);
    event.target.form.reset(); // clear selected files
    event.preventDefault();
  }
  onClickUpload() {
    this.uploadResults();
  }
  onClickClearFiles() {
    this.selectedFiles = [];
  }
  onClickGenerateApiToken() {
    this.isRequesting = true;

    statefulApiClient
      .get('/api-token', {
        params: { regenerate: this.regenerateToken },
      })
      .then((res) => {
        this.apiToken = res.data.api_token;
      })
      .finally(() => {
        this.isRequesting = false;
      });
  }
  onClickUpdatePrivacySettings() {
    this.isRequesting = true;

    statefulApiClient
      .post('/settings/privacy', {
        display_name: this.displayName,
        show_twitter_avatar: this.useTwitterAvatar,
      })
      .then((res) => {
        metadata.SET_USER_METADATA(res.data);
      })
      .finally(() => {
        this.isRequesting = false;
      });
  }
  onClickSignOut() {
    if (confirm('Are you sure you want to sign out of Salmon Stats account?')) {
      location.href = signOutUrl;
    }
  }

  uploadResults() {
    let filesProcessed = 0;
    const payload = { results: [] };
    const files = this.selectedFiles;
    const getFilereader = () => {
      const filereader = new FileReader();
      filereader.addEventListener('load', (event) => {
        payload.results.push(JSON.parse(event.target.result));

        filesProcessed += 1;

        if (filesProcessed === files.length) {
          this.isUploading = true;
          this.uploadLog = [];

          statefulApiClient
            .post('/upload-results', payload)
            .then((res) => {
              this.uploadLog = res.data;
            })
            .catch((error) => {
              this.uploadLog = [{ error: { summary: error.toString(), message: error.response.data.message } }];
            })
            .finally(() => {
              this.selectedFiles = [];
              this.isUploading = false;
            });
        }
      });
      return filereader;
    };

    files.forEach((file) => {
      const filereader = getFilereader();
      filereader.readAsText(file);
    });
  }
  beforeDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }

    if (this.removeListner) {
      this.removeListner();
    }
  }
}
</script>
