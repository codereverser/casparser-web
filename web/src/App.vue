<template lang="pug">
Card
  template(#title) CASParser
  template(#content)
    FileUpload(name="cas[]" accept="application/pdf" ref="fileUploader")
      template(#empty)
            p Drag and drop CAS pdf file here or click the "Choose" button above
  template(#footer)
    .p-d-flex.p-jc-end.p-ai-start
        .p-d-flex.p-flex-column
          Password.p-mr-4(v-model="password" :toggleMask="true"
                          :feedback="false" placeholder="Enter CAS Password"
                          :class="{'p-invalid': v$.$errors.length > 0}")
          small(:class="{'p-invisible': v$.$errors.length === 0}").p-error {{ formErrorText }}
        Button.p-mr-4(label="Submit" @click="submit"
                      :disabled="password.length <= 5" :loading="loading")
ProgressBar(mode="indeterminate" :class="{'p-invisible': !loading}" style="height: 3px;")

</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";

import { useVuelidate, ValidationRuleWithoutParams } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";

interface FileUploader {
  hasFiles: boolean;
  files: FileList;
}

export default defineComponent({
  name: "App",
  setup() {
    const fileUploader = ref<FileUploader | null>(null);
    const password = ref("");
    const errorText = ref("");

    const fileRequired: ValidationRuleWithoutParams = {
      $validator: (el: FileUploader | null) => {
        return el && el.hasFiles;
      },
      $message: "File missing!",
    };
    const rules = {
      password: { required, minLength: minLength(5) },
      fileUploader: { fileRequired },
    };
    const v$ = useVuelidate(rules, { fileUploader, password });

    const formHasError = computed(() => {
      return (
        v$.value.$invalid ||
        !(fileUploader.value && fileUploader.value!.hasFiles)
      );
    });
    const formErrorText = computed(() => {
      return v$.value.$errors.length > 0 ? v$.value.$errors[0].$message : "";
    });

    const loading = ref(false);
    const submit = async () => {
      v$.value.$touch();
    };

    return {
      fileUploader,
      password,
      loading,
      submit,
      errorText,
      formHasError,
      formErrorText,
      v$,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //margin-top: 60px;

  .p-card {
    .p-card-footer {
      padding: 0;
    }
  }

  .p-fileupload {
    .p-fileupload-content {
      padding: 0 1rem;
    }
    .p-fileupload-buttonbar {
      text-align: right;
    }
  }

  .p-fileupload-choose {
    & + button {
      display: none;
    }
    & ~ button:nth-of-type(2) {
      display: none;
    }
  }

  .p-fileupload-row {
    & > div:nth-of-type(1) {
      width: 0;
    }
    & > div:nth-of-type(2) {
      width: 60%;
    }
    & > div:nth-of-type(3),
    div:nth-of-type(4) {
      width: 20%;
    }
  }
  .p-invisible {
    visibility: hidden;
  }
}
</style>
