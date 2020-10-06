<template>
  <div class="app">
    <v-app>
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }"
      >
        <Index v-if="loaded && authed" :user="user" />
        <v-progress-circular
          color="primary"
          indeterminate
          v-else-if="!loaded"
        />
        <div v-else-if="!authed">
          <a href="/api/login"
            ><img src="https://api.slack.com/img/sign_in_with_slack.png"
          /></a>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import Index from "./Index.vue";
import axios from "axios";

export default {
  data: () => ({
    loaded: false,
    authed: false,
    user: "",
  }),
  created() {
    axios("/api/status")
      .then((res) => {
        this.loaded = true;

        if (res.data.ok) {
          this.authed = true;
          this.user = res.data.user.name;
        }
      })
      .catch(() => {
        this.loaded = true;
      });
  },
  components: {
    Index,
  },
};
</script>

<style>
body,
html {
  margin: 0;
  height: 100%;
}
body {
  background-color: black;
}
</style>
