<template>
  <b-modal :active.sync="isOpen" :on-cancel="onClickCancel">
    <div class="inner-modal-content">
      <p>{{ question }}</p>

      <div class="buttons is-right">
        <button class="button" @click="onClickCancel">{{ cancelMessage }}</button>

        <button class="button is-success" @click="onClickOk">{{ okMessage }}</button>
      </div>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

.inner-modal-content {
  margin: 2em;
  border-radius: 1em;
  padding: 1.5em;
  background-color: $background;
}

.buttons {
  margin-top: 1em;

  .button {
    min-width: 5em;
  }

  :not(:last-child) {
    margin-right: 1.5em !important;
  }
}
</style>

<script lang="ts">
// This code is based on https://gist.github.com/eolant/ba0f8a5c9135d1a146e1db575276177d

import Vue from 'vue';

import { Nullable } from '@/types/util';

const defaultVoidFunction = (): void => {};

type Data = {
  isOpen: boolean;
  question: string;
  resolve: Nullable<Function>;
  reject: Nullable<Function>;

  cancelMessage: Nullable<string>;
  okMessage: Nullable<string>;
  onAccept: VoidFunction;
  onDecline: VoidFunction;
};

type ConfirmationDialogOptions = Omit<Data, 'question' | 'isOpen' | 'resolve' | 'reject'>;

const defaultData = (): Data => ({
  isOpen: false,
  question: '',
  resolve: null,
  reject: null,

  cancelMessage: null,
  okMessage: null,
  onAccept: defaultVoidFunction,
  onDecline: defaultVoidFunction,
});

const ConfirmationDialog = Vue.extend({
  data(): Data {
    return defaultData();
  },
  methods: {
    open(
      question = '',
      { cancelMessage, okMessage, onAccept, onDecline }: ConfirmationDialogOptions = {
        cancelMessage: 'Cancel',
        okMessage: 'OK',
        onAccept: defaultVoidFunction,
        onDecline: defaultVoidFunction,
      },
    ): Promise<boolean> {
      this.isOpen = true;
      this.question = question;

      this.cancelMessage = cancelMessage;
      this.okMessage = okMessage;
      this.onAccept = onAccept;
      this.onDecline = onDecline;

      return new Promise<boolean>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    onClickCancel() {
      this.isOpen = false;
      this.resolve?.(false);
      this.resolve = null;
    },
    onClickOk() {
      this.isOpen = false;
      this.resolve?.(true);
      this.resolve = null;
    },
  },
});

export default ConfirmationDialog;
</script>
