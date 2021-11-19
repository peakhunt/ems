<template>
  <v-form v-model="valid">
    <v-text-field v-if="requireOrgPass"
                  :disabled="disabled"
                  v-model="oldPassword"
                  prepend-icon="lock"
                  type="password"
                  :label="$t('userProfile.orgPass')"
                  :rules="[rules.requiredOrgPass]" />
    <v-text-field v-model="newPassword1"
                  :disabled="disabled"
                  prepend-icon="lock"
                  type="password"
                  :label="$t('userProfile.newPass1')"
                  :rules="[rules.requiredNewPass]"/>
    <v-text-field v-model="newPassword2"
                  :disabled="disabled"
                  prepend-icon="lock"
                  type="password"
                  :label="$t('userProfile.newPass2')"
                  :rules="[rules.requiredNewPass]"
                  :error-messages="passwordMatchError()"/>
  </v-form>
</template>

<script>
export default {
  name: 'PasswordEdit',
  props: {
    requireOrgPass: { type: Boolean },
    disabled: { type: Boolean },
  },
  data() {
    return {
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      valid: true,
      rules: {
        requiredOrgPass: (value) => !!value || this.$i18n.t('userProfile.err1'),
        requiredNewPass: (value) => !!value || this.$i18n.t('userProfile.err2'),
      },
    };
  },
  methods: {
    passwordMatchError() {
      return (this.newPassword1 === this.newPassword2) ? '' : this.$i18n.t('userProfile.err3');
    },
  },
  watch: {
    valid(newVal) {
      if (newVal) {
        this.$emit('passwordReady', {
          ready: true,
          requireOrgPass: this.requireOrgPass,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword1,
        });
      } else {
        this.$emit('passwordReady', {
          ready: false,
        });
      }
    },
  },
};
</script>
