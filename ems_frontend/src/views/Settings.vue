<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <v-card>
          <v-tabs vertical class="my-tabs">
            <v-tab>
              <v-icon left>
                language
              </v-icon>
              {{ $i18n.t('settings.lang') }}
            </v-tab>

            <v-tab>
              <v-icon left>
                settings_ethernet
              </v-icon>
              blah blah option
            </v-tab>

            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="3">
                      {{ $i18n.t('settings.langSelTitle') }}
                    </v-col>
                    <v-col cols="7">
                      <v-select
                       v-model="selectedLanguage"
                       :items="languages"
                       item-text="name"
                       item-value="lang"
                       return-object
                       single-line
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <p> Blah Blah Blah option!!!</p>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Settings',
  computed: {
    ...mapGetters([
      'lang',
    ]),
    selectedLanguage: {
      get() {
        let l = {
          name: 'Bug',
          lang: this.lang,
        };

        this.languages.forEach((lg) => {
          if (this.lang === lg.lang) {
            l = lg;
          }
        });
        return l;
      },
      set(v) {
        this.$store.commit('set_lang', v.lang);
        //
        // XXX
        // another dirty hack.
        // until I find a proper solution...
        //
        window.location.reload();
      },
    },
  },
  data() {
    return {
      languages: [
        { name: 'English', lang: 'en' },
        { name: '한국어', lang: 'kr' },
      ],
    };
  },
};
</script>

<style>
.my-tabs [role="tab"]{
  justify-content: flex-start;
}
</style>
