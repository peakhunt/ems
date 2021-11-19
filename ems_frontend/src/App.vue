<template>
  <v-app>
    <v-navigation-drawer v-if="isLoggedIn"
     v-model="drawer"
     fixed
     temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Scanjet EMS
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
       dense
       nav
      >
        <v-list-item
         v-for="item in filteredNavItems"
         :key="item.title"
         :to="item.to"
         link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider/>

      <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $t('logout') }}</v-list-item-title>
          </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar v-if="isLoggedIn"
     app
     color="primary"
     dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <span class="text-h5">
        {{ currentRouteName }}
      </span>

      <v-spacer></v-spacer>

      <v-chip class="ma-2" color="primary" label @click="$router.push('/user_profile')">
        {{ userName }}
        <v-icon right large>account_circle</v-icon>
      </v-chip>

    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>

    <v-bottom-sheet :value="confirm_bottom_sheet_visible" width="700px" inset persistent>
      <v-card class="text-center" height="120px" color="#952175" dark>
        <v-card-title class="text-h6">
          <v-row align="center">
            <v-col cols="1">
              <v-icon color="red" x-large>dangerous</v-icon>
            </v-col>
            <v-col cols="11">
              {{ confirm_bottom_sheet_msg }}
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$store.dispatch('closeConfirmBottomSheet')">{{ $i18n.t('Cancel') }}</v-btn>
          <v-btn text @click="onBottomSheetConfirm">{{ $i18n.t('Confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

    <v-overlay :value="progress_overlay_visible">
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <v-progress-circular indeterminate :size="150" :width="18" color="primary">
            </v-progress-circular>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <p class="text-center text-h6">
            {{ progress_overlay_msg }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>

    <v-snackbar-queue
     :items="snackbar_queue_items"
     next-button-count-text="More"
     bottom
     center
     @remove="removeSnackbarItem"
    ></v-snackbar-queue>

    <v-dialog
     v-model="loggedOutDialog"
     persistent
     max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Warning
        </v-card-title>
        <v-card-text>
          You are logged out by the server
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
           color="green darken-1"
           text
           @click="onLoggedOutConfirm"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'userName',
      'caps',
      'confirm_bottom_sheet_visible',
      'confirm_bottom_sheet_msg',
      'progress_overlay_visible',
      'progress_overlay_msg',
      'snackbar_queue_items',
    ]),
    currentRouteName() {
      return this.$route.name;
    },
    filteredNavItems() {
      return this.navItems.filter((item) => {
        if (item.cap === 0 || this.caps(item.cap) === true) {
          return true;
        }
        return false;
      });
    },
  },
  name: 'App',
  data() {
    return {
      drawer: false,
      navItems: [
        {
          icon: 'home',
          title: this.$i18n.t('dashboard.name'),
          to: '/',
          cap: this.$router.options.routes[0].meta.cap,
        },
        {
          icon: 'manage_accounts',
          title: this.$i18n.t('userMgmt.name'),
          to: '/user_management',
          cap: this.$router.options.routes[3].meta.cap,
        },
        {
          icon: 'apps',
          title: this.$i18n.t('about.name'),
          to: '/about',
          cap: this.$router.options.routes[2].meta.cap,
        },
      ],
      loggedOutDialog: false,
      logoutInProress: false,
    };
  },
  created() {
    const self = this;

    self.$http.interceptors.response.use(undefined, (err) => {
      if (err.response.status === 401 && self.logoutInProress === false) {
        self.loggedOutDialog = true;
      }
      return Promise.reject(err);
    });
  },
  methods: {
    logout() {
      const self = this;

      self.logoutInProress = true;
      self.$store.dispatch('showProgress', 'Logging Out');

      self.$store.dispatch('logout')
        .then(() => {
          self.$store.dispatch('closeProgress');
          self.$router.push('/login');
          self.logoutInProress = false;
        })
        .catch(() => {
          self.$store.dispatch('closeProgress');
          self.$router.push('/login');
          self.logoutInProress = false;
        });
    },
    onBottomSheetConfirm() {
      this.$store.dispatch('closeConfirmBottomSheet');
      this.$store.getters.confirm_bottom_sheet_callback(this.$store.getters.confirm_bottom_sheet_cb_arg);
    },
    removeSnackbarItem(id) {
      this.$store.dispatch('removeFromSnackbar', id);
    },
    onLoggedOutConfirm() {
      this.loggedOutDialog = false;
      this.$store.dispatch('logout_force');
      this.$router.push('/login');
    },
  },
};
</script>
