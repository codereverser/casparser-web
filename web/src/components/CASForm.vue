<template lang="pug">
.p-grid.p-mt-3
  .p-col-12.p-md-6.p-md-offset-3
    Card
      template(#title) CASParser Demo
      template(#content)
        // TODO: move this to a separate component.
        .p-d-flex.p-flex-row.p-jc-end.file-select
          InputText.p-mr-4.p-col-8(placeholder="Select a file" :disabled="true" v-model="filename")
          Button.p-mr-4.file-select(label="Select" @click="selectFile")
          input(ref="file" type="file" @change="fileSelected" :disabled="false" accept="application/pdf")
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
.p-text-center.p-error.p-mt-2(:class="{'p-invisible': serverErrorText.length === 0}") {{ serverErrorText }}
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import { useVuelidate, ValidationRuleWithoutParams } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";

export default defineComponent({
  name: "CASForm",
  emits: ["cas-parsed"],
  setup(props, { emit }) {
    const password = ref("");
    const serverErrorText = ref("");

    const file = ref<HTMLElement | null>(null);
    const filename = ref("");
    const selectedFile = ref<File | null>(null);
    const selectFile = () => {
      if (file.value instanceof HTMLElement) file.value.click();
    };
    const fileSelected = (ev) => {
      filename.value = "";
      const files = ev.target.files;
      if (files.length == 1) {
        selectedFile.value = files[0];
        filename.value = files[0].name;
      }
    };

    // Validations
    const fileRequired: ValidationRuleWithoutParams = {
      $validator: (el): boolean => {
        return el instanceof File;
      },
      $message: "File missing!",
    };
    const fileMaxSize: ValidationRuleWithoutParams = {
      $validator: (el): boolean => {
        return el instanceof File && el.size <= 1048576;
      },
      $message: "File should be less than 1MB.",
    };

    const rules = {
      password: { required, minLength: minLength(5) },
      selectedFile: { fileMaxSize, fileRequired },
    };
    const v$ = useVuelidate(rules, { selectedFile, password });

    const formErrorText = computed(() => {
      return v$.value.$errors.length > 0 ? v$.value.$errors[0].$message : "";
    });

    // Submit data
    const loading = ref(false);
    const submit = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) return;
      if (selectedFile.value === null) return;
      try {
        loading.value = true;
        serverErrorText.value = "";
        const data = new FormData();
        data.append("cas", selectedFile.value);
        data.append("password", password.value);
        const response = await fetch("/api/process/", {
          method: "POST",
          body: data,
        });
        const casData = await response.json();
        const { status, message, cas, gains } = casData;
        if (status === "OK") {
          emit("cas-parsed", { cas, gains });
        } else {
          serverErrorText.value = message;
        }
      } catch (error) {
        if (Object.prototype.hasOwnProperty.call(error, "message")) {
          serverErrorText.value = error.message;
        } else {
          serverErrorText.value = "Unknown Error. Please try again!";
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      password,
      loading,
      submit,
      serverErrorText,
      formErrorText,
      v$,
      file,
      selectFile,
      fileSelected,
      filename,
    };
  },
});
</script>

<style lang="scss">
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
.p-card {
  .p-card-footer {
    padding: 0;
  }

  .file-select {
    input[type="file"] {
      display: none;
    }
  }
  .p-fileupload {
    .p-fileupload-content {
      padding: 0 1rem;
    }

    .p-fileupload-buttonbar {
      text-align: right;
      padding: 0.5rem 1rem;
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
      text-overflow: ellipsis;
      overflow: hidden;
    }

    & > div:nth-of-type(3),
    div:nth-of-type(4) {
      width: 20%;
    }
  }
}
</style>
