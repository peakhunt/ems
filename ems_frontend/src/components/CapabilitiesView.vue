<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-switch
         :disabled="true"
         v-model="capUserMgmt"
         :label="$t(`caps[${caps.CapUserManagement}]`)"
        >
        </v-switch>
      </v-col>
      <v-col cols="6">
        <v-switch
         :disabled="!capEditable"
         v-model="capTest1"
         :label="$t(`caps[${caps.CapTest1}]`)"
        >
        </v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-switch
         :disabled="!capEditable"
         v-model="capTest2"
         :label="$t(`caps[${caps.CapTest2}]`)"
        >
        </v-switch>
      </v-col>
      <v-col cols="6">
        <v-switch
         :disabled="!capEditable"
         v-model="capTest3"
         :label="$t(`caps[${caps.CapTest3}]`)"
        >
        </v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Capabilities from '@/Capabilities';

export default {
  name: 'CapabilitiesVew',
  props: {
    capFlags: { type: Number },
    capEditable: { type: Boolean },
  },
  computed: {
    capUserMgmt: {
      get() {
        return this.checkCap(Capabilities.CapUserManagement);
      },
      set(v) {
        this.touchCap(v, Capabilities.CapUserManagement);
      },
    },
    capTest1: {
      get() {
        return this.checkCap(Capabilities.CapTest1);
      },
      set(v) {
        this.touchCap(v, Capabilities.CapTest1);
      },
    },
    capTest2: {
      get() {
        return this.checkCap(Capabilities.CapTest2);
      },
      set(v) {
        this.touchCap(v, Capabilities.CapTest2);
      },
    },
    capTest3: {
      get() {
        return this.checkCap(Capabilities.CapTest3);
      },
      set(v) {
        this.touchCap(v, Capabilities.CapTest3);
      },
    },
  },
  data() {
    return {
      capabilities: 0,
      caps: Capabilities,
    };
  },
  methods: {
    checkCap(cap) {
      const u = new Uint32Array(1);
      u[0] = (this.capabilities >>> 0);

      return (u[0] & cap) !== 0;
    },
    touchCap(v, cap) {
      const u = new Uint32Array(1);
      u[0] = (this.capabilities >>> 0);

      if (v) {
        u[0] |= cap;
      } else {
        u[0] &= ~cap;
      }
      this.capabilities = u[0];
      this.$emit('changeCap', {
        capFlags: this.capabilities,
      });
    },
  },
  watch: {
    capFlags: {
      immediate: true,
      handler(newVal) {
        this.capabilities = newVal;
      },
    },
  },
};
</script>
