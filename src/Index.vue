<template>
  <div>
    <v-snackbar v-model="upload.snackbar">
      Success! 🎉

      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="upload.snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div id="content">
      <div
        class="toolbar buttons"
        :style="{
          display: 'flex',
          alignItems: 'center',
          margin: '40px auto',
          justifyContent: 'center',
        }"
      >
        <div
          :style="{
            width: '300px',
            display: 'flex',
            alignItems: 'flex-start',
          }"
        >
          <v-slider
            min="1"
            max="10"
            v-model="lineWidth"
            thumb-label="always"
            label="Width"
          />
          <canvas
            height="10"
            width="10"
            :style="{ margin: '10px 0 0 15px' }"
            ref="lineWidthCanvas"
          ></canvas>
        </div>
        <v-color-picker
          v-model="colorOverride"
          elevation="5"
          :style="{ margin: '0 20px' }"
          hide-inputs
        />
      </div>
      <canvas ref="canvas" id="canvas" width="512" height="512"></canvas>
      <div class="buttons">
        <v-btn color="primary" @click="save()" :loading="upload.loading"
          >Save <v-icon right dark>mdi-cloud-upload</v-icon></v-btn
        >
        <v-btn color="error" @click="clear()"
          >Clear <v-icon right dark>mdi-delete</v-icon></v-btn
        >
        <div>
          Logged in as <b>{{ user }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  props: {
    user: String,
  },
  data: () => ({
    color: 0,
    colors: ["#ff0000", "#00ff00", "#0000ff"],
    lineWidth: 5,
    colorOverride: "#00ff00",
    upload: {
      loading: false,
      snackbar: false,
    },
  }),
  watch: {
    lineWidth(v) {
      this.setLineWidth(v);
    },
  },
  methods: {
    async init() {
      return new Promise((resolve, reject) => {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext("2d");

        let img = document.createElement("img");
        img.src = "/api/avatar";
        img.addEventListener("load", () => {
          ctx.drawImage(img, 0, 0, 512, 512);
          resolve();
        });
      });
    },
    clear() {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.init();
    },
    setLineWidth(v) {
      let canvas = this.$refs.lineWidthCanvas;
      let ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00afff";
      ctx.fillRect(canvas.width / 2 - v / 2, canvas.height / 2 - v / 2, v, v);
    },
    save() {
      let canvas = this.$refs.canvas;
      canvas.toBlob(async (b) => {
        try {
          this.upload.loading = true;
          await axios.post("/api/upload", b);
          this.upload.loading = false;
          this.upload.snackbar = true;
        } catch (e) {
          this.upload.loading = false;
          alert("Something went wrong");
        }
      });
    },
  },
  async mounted() {
    const self = this;

    this.setLineWidth(this.lineWidth);

    let canvas = this.$refs.canvas;
    let ctx = canvas.getContext("2d");

    await this.init();

    // Drawing stuff

    // last known position
    var pos = { x: 0, y: 0 };

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown", setPosition);
    canvas.addEventListener("mouseenter", setPosition);

    // new position from mouse event
    function setPosition(e) {
      let actualpos = getMousePos(e);
      pos.x = actualpos.x;
      pos.y = actualpos.y;
    }

    function draw(e) {
      // mouse left button must be pressed
      if (e.buttons !== 1) return;

      ctx.beginPath(); // begin

      ctx.lineWidth = self.lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = self.colorOverride;

      ctx.moveTo(pos.x, pos.y); // from
      setPosition(e);
      ctx.lineTo(pos.x, pos.y); // to

      ctx.stroke(); // draw it!
    }

    function getMousePos(evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    }
  },
};
</script>

<style>
#content {
  text-align: center;
}

.buttons > * {
  margin: 10px 5px;
  text-align: center;
}

.buttons {
  text-align: center;
}

#canvas {
  cursor: url("./assets/icons8-pencil-24.png"), default;
}

/* .toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
} */
</style>
