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
                    <v-menu
                     ref="menu"
                     v-model="showDatePicker"
                     :close-on-content-click="false"
                     transition="scale-transition"
                     offset-y
                     min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                         v-model="dateRangeText"
                         label="Please select range of dates"
                         prepend-icon="date_range"
                         readonly
                         v-bind="attrs"
                         v-on="on"
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                       v-model="dates"
                       no-title
                       range
                       @change="onDatePickerChange"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                     v-model="search"
                     append-icon="search"
                     label="Search"
                     single-line
                     hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              :search="search"
              class="elevation-7"
            >
              <template v-slot:item.category="{ item }">
                <v-chip
                 :color="getColor(item.category)"
                 dark
                >
                  {{ item.category }}
                </v-chip>
              </template>
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
  name: 'EventLogs',
  components: {
    MaterialCard,
  },
  computed: {
    dateRangeText() {
      if (this.dates.length !== 2) {
        return 'Please select range';
      }
      return this.dates.join(' ~ ');
    },
  },
  data: () => {
    return {
      showDatePicker: false,
      dates: [],
      search: '',
      headers: [
        {
          sortable: true,
          text: 'time',
          value: 'time',
          width: 200,
        },
        {
          sortable: true,
          text: 'category',
          value: 'category',
          width: 150,
          align: 'center',
        },
        {
          sortable: false,
          text: 'description',
          value: 'description',
        },
      ],
      items: [],
    };
  },
  mounted() {
  },
  methods: {
    onDatePickerChange() {
      const self = this;

      const d1 = Date.parse(self.dates[0]);
      const d2 = Date.parse(self.dates[1]);

      if (d1 >= d2) {
        const saved = self.dates[0];

        this.$set(self.dates, 0, self.dates[1]);
        this.$set(self.dates, 1, saved);
      }

      const cond = {
        start: `${self.dates[0]} 00:00:00`,
        end: `${self.dates[1]} 23:59:59`,
        category: ['info', 'warn', 'error'],
      };

      self.showDatePicker = false;
      self.$store.dispatch('showProgress', 'Retrieving Event Logs');

      self.$store.dispatch('get_event_logs', cond)
        .then((result) => {
          self.$store.dispatch('closeProgress');
          self.items = result;
        })
        .catch(() => {
          self.$store.dispatch('closeProgress');
          self.$store.dispatch('addToSnackbar', {
            color: 'error',
            message: 'Failed to retrieve event logs',
          });
        });
    },
    getColor(category) {
      switch (category) {
        default:
        case 'info':
          return 'green';
        case 'warn':
          return 'orange';
        case 'error':
          return 'red';
      }
    },
  },
};

</script>

<style></style>
