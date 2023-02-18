<template lang="pug">
.grid.mt-3
    .col-12(class="md:col-offset-3 md:col-6")
        Card
            template(#title) CASParser Demo
            template(#content)
                .flex.flex-row.justify-content-end.file-select
                    InputText.mr-4.col-8(placeholder="Select a file" :disabled="true" v-model="filename")
                    Button.mr-4.file-select(label="Select" @click="selectFile")
                    input(ref="file" type="file" @change="fileSelected" :disabled="false" accept="application/pdf")
            template(#footer)
                .flex.justify-content-end.align-items-start
                    .flex.flex-column
                        Password.mr-4(v-model="password" :toggleMask="true"
                                        :feedback="false" placeholder="Enter CAS Password"
                                        :class="{'p-invalid': v$.$errors.length > 0}")
                        small(:class="{'p-invisible': v$.$errors.length === 0}").text-red-400 {{ formErrorText }}
                    Button.mr-4(label="Submit" @click="submit"
                                    :disabled="password.length <= 5" :loading="loading")

</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core"
import type { ValidationRuleWithoutParams } from "@vuelidate/core"
import { minLength, required } from "@vuelidate/validators"

const emit = defineEmits(['cas-parsed'])

const password = ref("");
const serverErrorText = ref("");

const file = ref<HTMLElement | null>(null);
const filename = ref("");
const selectedFile = ref<File | null>(null);
const selectFile = () => {
    if (file.value instanceof HTMLElement) file.value.click();
};
const fileSelected = (ev: Event) => {
    filename.value = "";
    const files = (ev.target as HTMLInputElement).files;
    if (files?.length == 1) {
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
        const { status, message, cas, gains, stats } = casData;
        if (status !== "error") {
            emit("cas-parsed", { cas, gains, stats, status, message });
        } else {
            serverErrorText.value = message;
            emit("cas-parsed", {
            cas: null,
            gains: null,
            stats: null,
            status: status,
            message: message,
            });
        }
    } catch (error: any) {
        if (Object.prototype.hasOwnProperty.call(error, "message")) {
            serverErrorText.value = error.message;
        } else {
            serverErrorText.value = "Unknown Error. Please try again!";
        }
    } finally {
        loading.value = false;
    }
};

</script>

<style lang="scss">
.file-select {
    input[type="file"] {
        display: none;
    }
}
</style>