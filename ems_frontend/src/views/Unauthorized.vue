<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <div class="text-h3 text-center red--text">
          You are not authorized to access this page!
          <br>
          Don't even think about it!
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Unauthorized',
  data: () => {
    return {
    };
  },
  methods: {
  },
};
</script>

<style></style>
