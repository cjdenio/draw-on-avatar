<template>
  <div id="app">
    <v-app>
      <div id="content">
        <div class="toolbar buttons">
          <div
            :style="{
              width: '300px',
              margin: '10px auto 0 auto',
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
              :style="{ border: '1px solid white', margin: '10px 0 0 15px' }"
              ref="lineWidthCanvas"
            ></canvas>
          </div>
          <v-btn-toggle v-model="color" mandatory :style="{ marginTop: '0px' }">
            <v-btn v-for="color in colors" :key="color">
              <v-icon :style="{ height: lineWidth + 'px' }" :color="color"
                >mdi-checkbox-blank-circle</v-icon
              >
            </v-btn>
          </v-btn-toggle>
        </div>
        <canvas ref="canvas" id="canvas" width="512" height="512"></canvas>
        <div class="buttons">
          <v-btn color="primary">Save</v-btn>
          <v-btn color="error" @click="clear()">Clear</v-btn>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    color: 0,
    colors: ["#ff0000", "#00ff00", "#0000ff"],
    lineWidth: 5,
  }),
  watch: {
    lineWidth(v) {
      let canvas = this.$refs.lineWidthCanvas;
      let ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  },
  methods: {
    async init() {
      return new Promise((resolve, reject) => {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext("2d");

        let img = document.createElement("img");
        img.src = "https://avatars3.githubusercontent.com/u/34525547";
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
  },
  async mounted() {
    const self = this;

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
      ctx.strokeStyle = self.colors[self.color];

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
body,
html {
  margin: 0;
  height: 100%;
}
body {
  background-color: black;
}

#content {
  padding-top: 40px;
  text-align: center;
}

.buttons > * {
  margin: 10px 5px;
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
