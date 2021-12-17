<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col
       cols="10"
      >
        <material-card
          color="blue-grey"
          full-header
        >
          <template #heading>
            <div class="pa-8 white--text">
              <v-container class="text-h4 font-weight-light">
                <v-row justify="space-between">
                  <v-col cols="8">
                    <div class="text-h3 font-weight-light">
                      {{ $i18n.t('alarms.caption') }}
                    </div>
                    <div class="text-caption mt-2">
                      <v-chip dark color="red" class="mr-2">Critical: {{ numCriticals }}</v-chip>
                      <v-chip dark color="orange" class="mr-2">Major: {{ numMajors }}</v-chip>
                      <v-chip dark color="yellow" text-color="black" class="mr-2">Minor: {{ numMinors }}</v-chip>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                     v-model="search"
                     append-icon="search"
                     :label="$i18n.t('eventLogs.search')"
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
             :items-per-page="-1"
             :locale="$i18n.locale"
             hide-default-footer
             class="elevation-6"
             @click:row="onAlarmItemClick"
            >
              <template v-slot:item.severity="{ item }">
                <AlarmChip :severity="item.severity" :ack="item.ack" :tick="tick"/>
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
import AlarmChip from '@/components/AlarmChip.vue';

export default {
  name: 'Alarms',
  components: {
    MaterialCard,
    AlarmChip,
  },
  computed: {
  },
  data() {
    return {
      blinkTimer: null,
      numCriticals: 1,
      numMajors: 1,
      numMinors: 1,
      tick: false,
      search: '',
      headers: [
        {
          sortable: false,
          text: this.$i18n.t('alarms.code'),
          value: 'id',
          width: 130,
        },
        {
          sortable: true,
          text: this.$i18n.t('alarms.severity'),
          value: 'severity',
          width: 130,
          align: 'center',
        },
        {
          sortable: true,
          text: this.$i18n.t('alarms.time'),
          value: 'time',
          width: 200,
        },
        {
          sortable: true,
          text: this.$i18n.t('alarms.description'),
          value: 'name',
        },
      ],
      items: [
        {
          id: 'ALM-1',
          severity: 'minor',
          time: '2021-12-15 13:21:33',
          name: 'Test Alarm Minor #1 Blah blah Bl;ah blah',
          ack: false,
        },
        {
          id: 'ALM-2',
          severity: 'major',
          time: '2021-12-15 13:31:00',
          name: 'Test Alarm Major #2 Blah blah Bl;ah blah',
          ack: false,
        },
        {
          id: 'ALM-3',
          severity: 'critical',
          time: '2021-12-15 14:21:55',
          name: 'Test Alarm Critical #3 Blah blah Bl;ah blah',
          ack: false,
        },
      ],
    };
  },
  mounted() {
    const self = this;

    self.blinkTimer = setInterval(() => {
      self.tick = !self.tick;
    }, 500);
  },
  unmounted() {
    clearInterval(this.blinkTimer);
  },
  methods: {
    getColor(category) {
      switch (category) {
        default:
        case 'minor':
          return 'yellow';
        case 'major':
          return 'orange';
        case 'critical':
          return 'red';
      }
    },
    onAlarmItemClick(arg) {
      const item = arg;
      item.ack = true;
    },
  },
};

</script>
