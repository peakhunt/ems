<template>
  <v-dialog
   :value="value"
   @input="$emit('input', $event)"
   transition="dialog-bottom-transition"
   max-width="600"
  >
    <v-card v-if="mode === 'New'">
      <v-toolbar color="primary" dark>
        {{ $t('UserManagementDialog.title') }}
      </v-toolbar>

      <v-card-text>
        <v-card-title>
          {{ $t('UserManagementDialog.userInfo') }}
        </v-card-title>

        <v-form v-model="usernameValid">
          <v-text-field
           v-model="username"
           prepend-icon="account_circle"
           :label="$t('UserManagementDialog.usernameLabel')"
          />
        </v-form>
        <password-edit :requireOrgPass="false" @passwordReady="onPasswordReady"/>

        <v-divider/>
        <v-card-title>
          {{ $t('caps.name') }}
        </v-card-title>
        <capabilities-view :capFlags="capabilities" :capEditable="true" @changeCap="onChangeCap"/>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!allValid" color="primary" @click="onAddNewUser">{{ $t('UserManagementDialog.addNewUser') }}</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="mode === 'Edit'">
      <v-toolbar color="indigo" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>{{ $t('UserManagementDialog.editUserTitle') }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="uinfo.admin" icon v-bind="attrs" v-on="on" @click="onDeleteUserClick">
              <v-icon color="red">delete</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('UserManagementDialog.deleteTxt') }}</span>
        </v-tooltip>
      </v-toolbar>

      <v-container fluid>
        <v-row dense>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                {{ $t('UserManagementDialog.passwordTitle') }}
              </v-card-title>
              <v-card-subtitle v-if="uinfo.admin">
                <span class="red--text">
                {{ $t('UserManagementDialog.adminWarning') }}
                </span>
              </v-card-subtitle>

              <v-card-text>
                <v-form v-model="usernameValid">
                  <v-text-field
                   readonly
                   v-model="username"
                   prepend-icon="account_circle"
                   :label="$t('UserManagementDialog.userInfo')"
                   :rules="[rules.requireUsername]"
                  />
                </v-form>
                <password-edit :disabled="uinfo.admin" :requireOrgPass="false" @passwordReady="onPasswordReady"/>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="!passwordValid" color="primary" @click="onUpdatePassword">{{ $t('UserManagementDialog.changePassword') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                {{ $t('UserManagementDialog.capabilitiesTitle') }}
              </v-card-title>
              <v-card-subtitle v-if="uinfo.admin">
                <span class="red--text">
                {{ $t('UserManagementDialog.adminWarning2') }}
                </span>
              </v-card-subtitle>

              <v-card-text>
                <capabilities-view :capFlags="capabilities" :capEditable="!uinfo.admin" @changeCap="onChangeCap"/>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onUpdateCapabilities" :disabled="uinfo.admin" >
                  {{ $t('UserManagementDialog.changeCapabilities') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import PasswordEdit from './PasswordEdit.vue';
import CapabilitiesView from './CapabilitiesView.vue';

export default {
  name: 'UserManagementDialog',
  components: {
    PasswordEdit,
    CapabilitiesView,
  },
  computed: {
    allValid() {
      return this.usernameValid && this.passwordValid;
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'New',
    },
    uinfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      usernameValid: false,
      username: '',
      passwordValid: false,
      password: '',
      capabilities: (0 >>> 0),
      rules: {
        requireUsername: (value) => (!!value || value.length >= 4) || this.$i18n.t('userProfile.err1'),
      },
    };
  },
  methods: {
    onAddNewUser() {
      this.$emit('addNewUser', {
        username: this.username,
        password: this.password,
        capabilities: this.capabilities,
      });
    },
    onUpdatePassword() {
      this.$emit('updatePassword', {
        username: this.username,
        password: this.password,
      });
    },
    onUpdateCapabilities() {
      this.$emit('updateCapabilities', {
        username: this.username,
        capabilities: this.capabilities,
      });
    },
    onDeleteUserClick() {
      this.$store.dispatch('showConfirmBottomSheet', {
        msg: this.$i18n.t('UserManagementDialog.deleteConfirm'),
        callback: this.onDeleteUser,
        cbArg: null,
      });
    },
    onDeleteUser() {
      this.$emit('deleteUser', {
        username: this.username,
      });
    },
    onPasswordReady(e) {
      if (e.ready === true) {
        this.passwordValid = true;
        this.password = e.newPassword;
      } else {
        this.passwordValid = false;
      }
    },
    onChangeCap(e) {
      this.capabilities = e.capFlags;
    },
  },
  mounted() {
    if (this.mode !== 'New') {
      this.username = this.uinfo.username;
      this.capabilities = (this.uinfo.capabilities >>> 0);
    }
  },
};
</script>
