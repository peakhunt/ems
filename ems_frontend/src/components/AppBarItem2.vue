<template>
  <v-hover v-slot="{ hover }">
    <v-list-item
     v-on="$listeners"
     v-bind="$attrs"
     :class="hover ? 'white--text primary elevation-12' : 'black--text'"
     link
    >
      <slot name="content">
      </slot>
    </v-list-item>
  </v-hover>
</template>

<script>
export default {
  name: 'AppBarItem2',
};
</script>
