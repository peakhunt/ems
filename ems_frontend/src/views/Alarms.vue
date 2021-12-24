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
                      <v-chip dark color="purple" class="mr-2">
                        Total: {{ alarmStat.totalAlarms }}/{{ alarmStat.totalUnacked}}
                      </v-chip>
                      <v-chip dark color="red" class="mr-2">
                        Critical: {{ alarmStat.bySeverity['critical'].total }}/{{ alarmStat.bySeverity['critical'].unacked }}
                      </v-chip>
                      <v-chip dark color="orange" class="mr-2">
                        Major: {{ alarmStat.bySeverity['major'].total }}/{{ alarmStat.bySeverity['major'].unacked }}
                      </v-chip>
                      <v-chip dark color="yellow" text-color="black" class="mr-2">
                        Minor: {{ alarmStat.bySeverity['minor'].total }}/{{ alarmStat.bySeverity['minor'].unacked }}
                      </v-chip>
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
             :items="alarmArray"
             :search="search"
             :items-per-page="-1"
             :locale="$i18n.locale"
             sort-by="time"
             :sort-desc="true"
             hide-default-footer
             class="elevation-6"
             @dblclick:row="onAlarmItemDblClick"
            >
              <template v-slot:item.severity="{ item }">
                <AlarmChip :severity="item.severity" :ack="item.state === 3" :tick="tick500ms"/>
              </template>
            </v-data-table>
            <!--
            <v-list dense :elevation="6">
              <template v-for="(item, index) in alarmArray">
                <v-list-item
                 v-if="item.state !== 0"
                 :key="item.id"
                 @click="onAlarmItemClick"
                >
                  <v-container>
                    <v-row align="center" no-gutters>
                      <v-col cols="1">
                        <div>
                        {{item.id}}
                        </div>
                      </v-col>

                      <v-col cols="1">
                        <AlarmChip :severity="item.severity" :ack="item.state === 3" :tick="tick"/>
                      </v-col>

                      <v-col cols="2">
                        {{item.time}}
                      </v-col>

                      <v-col>
                        {{item.name}}
                      </v-col>
                    </v-row>
                  </v-container>
                </v-list-item>
                <v-divider :key="index"></v-divider>
              </template>
            </v-list>
            -->
          </v-card-text>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import MaterialCard from '@/components/MaterialCard.vue';
import AlarmChip from '@/components/AlarmChip.vue';

export default {
  name: 'Alarms',
  components: {
    MaterialCard,
    AlarmChip,
  },
  computed: {
    ...mapGetters([
      'alarmHash',
      'alarmArray',
      'alarmStat',
      'tick500ms',
    ]),
  },
  data() {
    return {
      search: '',
      headers: [
        {
          sortable: false,
          text: this.$i18n.t('alarms.code'),
          value: 'id',
          width: 130,
        },
        {
          sortable: false,
          text: 'state',
          value: 'state',
          width: 80,
          align: ' d-none',
          filter: (value) => value !== 0,
        },
        {
          sortable: false,
          text: this.$i18n.t('alarms.severity'),
          value: 'severity',
          width: 130,
          align: 'center',
        },
        {
          sortable: false,
          text: this.$i18n.t('alarms.time'),
          value: 'time',
          width: 200,
        },
        {
          sortable: false,
          text: this.$i18n.t('alarms.description'),
          value: 'name',
        },
      ],
    };
  },
  mounted() {
  },
  unmounted() {
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
    onAlarmItemDblClick(_, { item }) {
      this.$store.dispatch('ackAlarm', { ids: [item.id] });
    },
  },
};

</script>
