<template>
  <div class="salmon-result-uploader">
    <require-sign-in message="to upload results">
      <div v-if="isBrowserUploadEnabled">
        <h1>Upload results</h1>
        <form @submit.prevent>
          <label for="file-selector">
            <a>Select result file(s)</a> or drag and drop result files (each file must be 20KB&lt;).<br>
            You can upload up to 10 results at once.<br>
            <input id="file-selector" @change="onSelectFiles" type="file" accept="application/json" multiple>
          </label>
          <button :disabled="isUploading" @click="onClickUpload">Upload</button>
          <button :disabled="isUploading" @click="onClickClearFiles">Clear files</button>

          <h2>Selected Files</h2>
          <div v-for="file in selectedFiles">
            {{ file.name }}
          </div>

          <h2>Upload log</h2>
          <div>
            <div v-for="item in uploadLog" :key="item.job_id">
              <p class="error" v-if="item.error">
                {{ item.error.summary }}<br>
                {{ item.error.message }}
              </p>
              <p v-else>
                <strong>{{ item.job_id ? item.job_id : '?' }}</strong>
                <span v-if="!item.created"> already exists.</span>
                <span v-else> was uploaded successfully.</span>
                See: <router-link :to="`/results/${item.salmon_id}`">/result/{{ item.salmon_id }}</router-link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </require-sign-in>
  </div>
</template>

<style scoped>
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
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import dragDrop from 'drag-drop';

import { metadataModule as metadata } from '../store/modules/metadata';
import RequireSignIn from '../components/RequireSignIn.vue';

@Component({
  name: 'SalmonResultUploader',
  extends: RequireSignIn,
})
export default class SalmonResultUploader extends Vue {
  isUploading = false;
  removeListner = null;
  selectedFiles = [];
  uploadLog = [];

  mounted() {
    this.removeListner = dragDrop('.salmon-result-uploader', (files) => {
      if (this.isSignedIn) this.addToSelectedFiles(files);
    });
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

          const isAlreadySelected = this.selectedFiles.some((selectedFile) => {
            // Note: Technically this assumption is not always correct.
            return file.name === selectedFile.name && file.size === selectedFile.size;
          });

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
  onClickUpload(event) {
    this.uploadResults();
  }
  onClickClearFiles(event) {
    this.selectedFiles = [];
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

          const options = {
            withCredentials: true,
          };

          axios.post(VUE_APP_API_URL + '/upload-results', payload, options)
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
    if (this.removeListner) {
      this.removeListner();
    }
  }
}
</script>
