<template>
  <div>
    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="6">
          <material-card color="primary" icon="password">
            <template #title>
              {{userName}}
            </template>
            <template #subtitle>
              {{ $t('userProfile.changePassDesc') }}
            </template>
            <v-card-text>
              <password-edit :requireOrgPass="true" @passwordReady="onPasswordReady"/>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!passwordValid" color="primary" @click="changePassword">{{ $t('userProfile.changePass') }}</v-btn>
            </v-card-actions>
          </material-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row justify="center" no-gutters>
        <v-col cols="6">
          <material-card color="primary" icon="person">
            <template #title>
              {{ userName }}&nbsp;{{ $t('caps.name') }}
            </template>

            <v-card-text>
              <capabilities-view :capFlags="userCaps" :capEditable="false"/>
            </v-card-text>
          </material-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PasswordEdit from '../components/PasswordEdit.vue';
import CapabilitiesView from '../components/CapabilitiesView.vue';
import MaterialCard from '../components/MaterialCard.vue';

export default {
  name: 'UserProfile',
  components: {
    PasswordEdit,
    CapabilitiesView,
    MaterialCard,
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

      self.$store.dispatch('showProgress', self.$i18n.t('userProfile.updatingPassword'));
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
