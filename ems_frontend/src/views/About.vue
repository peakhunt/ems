<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col
       cols="8"
      >
        <material-card
          color="orange"
          full-header
        >
          <template #heading>
            <div class="pa-4 white--text">
              <v-container class="text-h4 font-weight-light">
                <v-row justify="space-between">
                  <v-col cols="6">
                  </v-col>
                  <v-col cols="3">
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              class="elevation-6"
              hide-default-footer
            >
            </v-data-table>
          </v-card-text>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MaterialCard from '@/components/MaterialCard.vue';

export default {
  name: 'About',
  components: {
    MaterialCard,
  },
  computed: {
  },
  data() {
    return {
      headers: [
        {
          text: 'Item',
          value: 'name',
          width: 300,
          align: 'start',
          divider: true,
        },
        {
          text: 'Value',
          value: 'value',
          align: 'start',
          divider: true,
        },
      ],
      items: [
        {
          name: 'Client S/W Version',
          value: this.$store.getters.appVersion,
        },
        {
          name: 'Server S/W Version',
          value: this.$store.getters.sysVersion,
        },
      ],
    };
  },
  methods: {
  },
};
</script>

<style></style>
