<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <v-card>
          <v-app-bar>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>{{ $t('userMgmt.title') }}</v-toolbar-title>
            <v-divider
             class="mx-4"
             inset
             vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="getAllUsers">
                  <v-icon>
                    refresh
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('userMgmt.reload') }}</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="onNewUserClick">
                  <v-icon>
                    person_add
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('userMgmt.addNewUser') }}</span>
            </v-tooltip>

          </v-app-bar>
          <v-card-text>
            <v-simple-table dark>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      {{ $t('userMgmt.username') }}
                    </th>
                    <th class="text-left">
                      {{ $t('userMgmt.adminRole') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                   v-for="user in users"
                   :key="user.username"
                   @click="onUserClick(user)"
                  >
                    <td>{{ user.username }}</td>
                    <td>{{ user.admin ? $t('Yes') : $t('No') }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <user-management-dialog
     v-if="showUserMgmtDialog"
     v-model="showUserMgmtDialog"
     :mode="usrMgmtDialogMode"
     :uinfo="uinfo"
     @addNewUser="onAddNewUser"
     @updatePassword="onUpdatePassword"
     @updateCapabilities="onUpdateCapabilities"
     @deleteUser="onDeleteUser"
    />
  </v-container>
</template>

<script>
import UserManagementDialog from '../components/UserManagementDialog.vue';

export default {
  name: 'UserManagement',
  components: {
    UserManagementDialog,
  },
  data: () => {
    return {
      showUserMgmtDialog: false,
      usrMgmtDialogMode: 'New',
      uinfo: null,
      users: [
      ],
    };
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
    onUserClick(user) {
      this.usrMgmtDialogMode = 'Edit';
      this.uinfo = {
        username: user.username,
        capabilities: user.capabilities,
        admin: user.admin,
      };
      this.showUserMgmtDialog = true;
    },
    onNewUserClick() {
      this.usrMgmtDialogMode = 'New';
      this.showUserMgmtDialog = true;
    },
    onAddNewUser(e) {
      const self = this;

      self.$store.dispatch('showProgress', 'Adding New User');
      self.$store.dispatch('add_new_user', e)
        .then(() => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'success',
            message: self.$i18n.t('userMgmt.addSuccess'),
          });
          self.showUserMgmtDialog = false;
          self.getAllUsers();
        })
        .catch((errorCode) => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'error',
            message: self.$i18n.t(`errors[${errorCode}]`),
          });
        });
    },
    onUpdatePassword(e) {
      const self = this;

      self.$store.dispatch('showProgress', 'Updating password');
      self.$store.dispatch('update_password_for', e)
        .then(() => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'success',
            message: self.$i18n.t('userMgmt.updatePassSuccess'),
          });
          self.getAllUsers();
        })
        .catch((errorCode) => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'error',
            message: self.$i18n.t(`errors[${errorCode}]`),
          });
        });
    },
    onUpdateCapabilities(e) {
      const self = this;

      self.$store.dispatch('showProgress', 'Updating capabilities');

      self.$store.dispatch('update_capabilities', e)
        .then(() => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'success',
            message: self.$i18n.t('userMgmt.updateCapSuccess'),
          });
          self.getAllUsers();
        })
        .catch((errorCode) => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'error',
            message: self.$i18n.t(`errors[${errorCode}]`),
          });
        });
    },
    onDeleteUser(e) {
      const self = this;

      self.$store.dispatch('showProgress', 'Deleting a user account');

      self.$store.dispatch('delete_user', e)
        .then(() => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'success',
            message: self.$i18n.t('userMgmt.delSuccess'),
          });
          self.showUserMgmtDialog = false;
          self.getAllUsers();
        })
        .catch((errorCode) => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'error',
            message: self.$i18n.t(`errors[${errorCode}]`),
          });
        });
    },
    getAllUsers() {
      const self = this;

      self.$store.dispatch('showProgress', 'Retrieving All Users from Database');

      self.$store.dispatch('get_all_users')
        .then((users) => {
          self.users = users;
          self.$store.dispatch('closeProgress');
        })
        .catch(() => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'error',
            message: 'Failed to retrieve users data from database',
          });
        });
    },
  },
};
</script>

<style></style>
