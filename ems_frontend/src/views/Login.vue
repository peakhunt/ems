<template>
  <v-parallax src="@/assets/login_bg.jpg" height="100%" style="height:100%">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{$t('login.str1')}}</v-toolbar-title>
              <v-spacer/>

              <v-row>
                <v-col class="text-right">
                  <v-menu
                   open-on-hover
                   bottom
                   offset-y
                  >
                    <template v-slot:activator="{on, attrs}">
                      <v-btn text v-bind="attrs" v-on="on">
                        <v-icon left>
                          language
                        </v-icon>
                        {{ selectedLanguage.name }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                       v-for="(item, index) in languagesSupported"
                       :key="index"
                       link
                      >
                        <v-list-item-title @click="onLanguageClick(item)">{{ item.name }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>

            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="login" id="check-login-form">
                <v-text-field
                 prepend-icon="person"
                 v-model="username"
                 :label="$t('login.str2')"
                 type="text"
                 @input="clearAuthErr"
                >
                </v-text-field>
                <v-text-field
                 prepend-icon="lock"
                 v-model="password"
                 :label="$t('login.str3')"
                 type="password"
                 @input="clearAuthErr"
                >
                </v-text-field>
              </v-form>
              <v-alert v-if="authErr !== ''" outlined type="error" elevation="2">
                {{ authErr }}
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit" form="check-login-form">{{$t('login.str4')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-parallax>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Login',
  computed: {
    ...mapGetters([
      'authErr',
      'lang',
      'languagesSupported',
    ]),
    selectedLanguage: {
      get() {
        let l = {
          name: 'Bug',
          lang: this.lang,
        };

        this.languagesSupported.forEach((lg) => {
          if (this.lang === lg.lang) {
            l = lg;
          }
        });
        return l;
      },
    },
  },
  data: () => {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      const { username, password } = this;

      this.$store.dispatch('login', { username, password })
        .then(() => this.$router.push('/'))
        .catch((err) => console.log(err));
    },
    clearAuthErr() {
      this.$store.commit('clear_auth_err_msg');
    },
    onLanguageClick(item) {
      this.$store.commit('set_lang', item.lang);
    },
  },
};
</script>

<style>
html { overflow-y: auto }
</style>
