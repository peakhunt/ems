<template>
  <div>
    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="6">
          <v-card class="elevation-12">
            <v-card-title class="text-h5">
              {{userName}}
            </v-card-title>
            <v-card-subtitle>
              {{ $t('userProfile.changePassDesc') }}
            </v-card-subtitle>
            <v-card-text>
              <password-edit :requireOrgPass="true" @passwordReady="onPasswordReady"/>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!passwordValid" color="primary" @click="changePassword">{{ $t('userProfile.changePass') }}</v-btn>
            </v-card-actions>

          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="6">
          <v-card class="elevation-12">
            <v-card-title class="text-h5">
              {{ userName }}&nbsp;{{ $t('caps.name') }}
            </v-card-title>

            <v-card-text>
              <capabilities-view :capFlags="userCaps" :capEditable="false"/>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PasswordEdit from '../components/PasswordEdit.vue';
import CapabilitiesView from '../components/CapabilitiesView.vue';

export default {
  name: 'UserProfile',
  components: {
    PasswordEdit,
    CapabilitiesView,
  },
  computed: {
    ...mapGetters([
      'userName',
      'userCaps',
    ]),
  },
  data() {
    return {
      passwordValid: false,
      passwordData: null,
    };
  },
  methods: {
    changePassword() {
      const self = this;

      const req = {
        username: this.userName,
        orgPassword: this.passwordData.oldPassword,
        newPassword: this.passwordData.newPassword,
      };

      self.$store.dispatch('showProgress', 'Updating password');
      self.$store.dispatch('update_password', req)
        .then(() => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'success',
            message: self.$i18n.t('userProfile.changePassSuccess'),
          });
        })
        .catch((errorCode) => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'error',
            message: self.$i18n.t(`errors[${errorCode}]`),
          });
        });
    },
    onPasswordReady(e) {
      if (e.ready === true) {
        this.passwordValid = true;
        this.passwordData = {
          oldPassword: e.oldPassword,
          newPassword: e.newPassword,
        };
      } else {
        this.passwordValid = false;
      }
    },
  },
};
</script>

<style></style>
