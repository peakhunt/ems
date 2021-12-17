<template>
  <v-chip dark :color="bgColor" :text-color="txtColor">
    {{ severity }}
  </v-chip>
</template>

<script>
export default {
  name: 'AlarmChip',
  props: {
    ack: { type: Boolean },
    severity: { type: String },
    tick: { type: Boolean },
  },
  computed: {
    bgColor() {
      if (this.ack || this.tick) {
        if (this.severity === 'minor') {
          return 'yellow';
        }
        if (this.severity === 'major') {
          return 'orange';
        }
        return 'red';
      }

      if (this.severity === 'minor') {
        return 'yellow lighten-5';
      }
      if (this.severity === 'major') {
        return 'orange lighten-5';
      }
      return 'red lighten-5';
    },
    txtColor() {
      if (this.ack || this.tick) {
        if (this.severity === 'minor') {
          return 'black';
        }
        if (this.severity === 'major') {
          return 'white';
        }
        return 'white';
      }

      if (this.severity === 'minor') {
        return 'black';
      }
      if (this.severity === 'major') {
        return 'black';
      }
      return 'black';
    },
  },
};

</script>
