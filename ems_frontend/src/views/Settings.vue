<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <material-card color="primary" full-header>
          <template #heading>
            <v-tabs
             v-model="tabs"
             background-color="transparent"
             slider-color="white"
             class="pa-8"
            >
              <span
               class="subheading font-weight-light mx-3"
               style="align-self: center"
              > {{ $i18n.t('settings.name') }}
              </span>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  language
                </v-icon>
                {{ $i18n.t('settings.lang') }}
              </v-tab>

              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  settings_ethernet
                </v-icon>
                blah blah option
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items v-model="tabs" background-color="transparent">
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
                       :items="languagesSupported"
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
          </v-tabs-items>

        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import MaterialCard from '../components/MaterialCard.vue';

export default {
  name: 'Settings',
  components: {
    MaterialCard,
  },
  computed: {
    ...mapGetters([
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
      set(v) {
        this.$store.commit('set_lang', v.lang);
      },
    },
  },
  data() {
    return {
      tabs: 0,
    };
  },
};
</script>

<style>
.my-tabs [role="tab"]{
  justify-content: flex-start;
}
</style>
