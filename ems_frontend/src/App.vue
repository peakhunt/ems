<template>
  <v-app>
    <v-navigation-drawer v-if="isLoggedIn"
     v-model="drawer"
     :right="$vuetify.rtl"
     :mini-variant.sync="mini"
     :src="false ? '' : require('@/assets/login_bg.jpg')"
     mini-variant-width="80"
     app
     width="260"
     dark
    >
      <template #img="props">
        <v-img gradient="rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)" v-bind="props"/>
      </template>

      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="require('@/assets/vmd.svg')"/>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <strong class="mr-1 font-weight-black">Scanjet</strong>
            <span class="primary--text">EMS</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            v{{ appVersion  }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mx-3 mb-2" />

      <v-list
       expand
       nav
      >
        <v-list-item
         v-for="item in filteredNavItems"
         :key="item.title"
         :to="item.to"
         active-class="primary white--text"
         class="py-1"
        >
          <v-list-item-icon class="my-2 align-self-center">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="pt-12" />
    </v-navigation-drawer>

    <v-app-bar v-if="isLoggedIn"
     app
     absolute
     class="v-bar--underline"
     color="transparent"
     :clipped-left="$vuetify.rtl"
     :clipped-right="!$vuetify.rtl"
     height="70"
     flat
    >
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- drawer toggle button -->
      <v-btn
       class="ml-3 mr-4 hidden-sm-and-down"
       elevation="1"
       fab
       small
       @click="mini = !mini"
      >
        <v-icon>
          {{ mini ? 'format_list_bulleted' : 'more_vert' }}
        </v-icon>
      </v-btn>

      <v-toolbar-title
       class="font-weight-light text-h5"
       v-text="currentRouteName"
      />

      <v-spacer/>

      <search class="hidden-sm-and-down" />

      <!-- go to home button -->
      <v-btn class="ml-2" min-width="0" text to="/" eaxct>
        <v-icon>dashboard</v-icon>
      </v-btn>

      <!-- notification button -->
      <v-menu
       bottom
       left
       offset-y
       origin="top left"
       transition="scale-transition"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
           class="ml-2"
           min-width="0"
           text
           v-bind="attrs"
           v-on="on"
          >
            <v-badge
             bordered
             color="red"
             overlap
            >
              <template v-slot:badge>
                <span>5</span>
              </template>
              <v-icon>notifications</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list
         flat
         nav
        >
          <app-bar-item2
           v-for="(n, i) in notifications"
           :key="i"
          >
            <template v-slot:content>
              <v-list-item-content>
                <v-list-item-title>{{ n }} </v-list-item-title>
              </v-list-item-content>
            </template>
          </app-bar-item2>
        </v-list>
      </v-menu>

      <!-- notification button -->
      <v-menu
       bottom
       left
       min-width="200"
       offset-y
       origin="top right"
       transition="scale-transition"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
           class="ml-2"
           min-width="0"
           text
           v-bind="attrs"
           v-on="on"
          >
            <v-icon>person</v-icon>
          </v-btn>
        </template>

        <v-list :tile="false" flat nav>
          <app-bar-item2
            to="/user_profile"
          >
            <template v-slot:content>
              <v-list-item-title>{{ $i18n.t('userProfile.name') }}</v-list-item-title>
            </template>
          </app-bar-item2>
          <v-divider
            class="mb-2 mt-2"
          />

          <app-bar-item2 @click="logout">
            <template v-slot:content>
              <v-list-item-title>{{ $i18n.t('logout') }}</v-list-item-title>
            </template>
          </app-bar-item2>

        </v-list>
      </v-menu>

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
          {{ $i18n.t('forcedLogout') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
           color="green darken-1"
           text
           @click="onLoggedOutConfirm"
          >
            {{ $i18n.t('Confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>

import { mapGetters } from 'vuex';
import AppBarItem2 from '@/components/AppBarItem2.vue';
import Search from '@/components/Search.vue';
// import '@/styles/overrides.sass';

export default {
  components: {
    AppBarItem2,
    Search,
  },
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
      'appVersion',
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
      drawer: true,
      mini: false,
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
          icon: 'settings',
          title: this.$i18n.t('settings.name'),
          to: '/settings',
          cap: this.$router.options.routes[5].meta.cap,
        },
        {
          icon: 'event',
          title: this.$i18n.t('eventLogs.name'),
          to: '/event_logs',
          cap: this.$router.options.routes[6].meta.cap,
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
      notifications: [
        'Mike John Responded to your email',
        'You have 5 new tasks',
        'You\'re now friends with Andrew',
        'Another Notification',
        'Another one',
      ],
      profile: [
        { title: 'Profile' },
        { divider: true },
        { title: 'Log Out' },
      ],
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
  mounted() {
    if (this.isLoggedIn !== true) return;

    this.systemInitialize();
  },
  methods: {
    logout() {
      const self = this;

      self.logoutInProress = true;
      self.$store.dispatch('showProgress', self.$i18n.t('loggingOut'));

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
    systemInitialize() {
      const self = this;

      self.$store.dispatch('showProgress', self.$i18n.t('initializing'));
      self.$store.dispatch('get_sys_info')
        .then(() => {
          self.$store.dispatch('closeProgress');
        })
        .catch(() => {
          self.$store.dispatch('closeProgress');
        });
    },
  },
  watch: {
    $route(to, from) {
      if (from.path === '/login' && to.path === '/') {
        this.systemInitialize();
      }
    },
  },
};
</script>

<style>
</style>
