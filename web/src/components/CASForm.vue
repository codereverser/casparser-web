<template lang="pug">
.p-grid.p-mt-3
  .p-col-12.p-md-6.p-md-offset-3
    Card
      template(#title) CASParser
      template(#content)
        FileUpload(name="cas[]" accept="application/pdf" ref="fileUploader")
          template(#empty)
            p Drag and drop CAS PDF file here or click the "Choose" button above.
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
import { FileUploader } from "../defs";
import { useVuelidate, ValidationRuleWithoutParams } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";

export default defineComponent({
  name: "CASForm",
  emits: ["cas-parsed"],
  setup(props, { emit }) {
    const fileUploader = ref<FileUploader | null>(null);
    const password = ref("");
    const serverErrorText = ref("");

    // Validations
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

    const formErrorText = computed(() => {
      return v$.value.$errors.length > 0 ? v$.value.$errors[0].$message : "";
    });

    // Submit data
    const loading = ref(false);
    const submit = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) return;
      if (fileUploader.value === null) return;
      try {
        loading.value = true;
        serverErrorText.value = "";
        const data = new FormData();
        data.append("cas", (fileUploader.value.files as FileList)[0]);
        data.append("password", password.value);
        const response = await fetch("/api/process/", {
          method: "POST",
          body: data,
        });
        const casData = await response.json();
        const { status, message, cas } = casData;
        if (status === "OK") {
          emit("cas-parsed", cas);
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
      fileUploader,
      password,
      loading,
      submit,
      serverErrorText,
      formErrorText,
      v$,
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
