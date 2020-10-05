<template>
  <div id="app">
    <v-app>
      <div id="content">
        <div id="buttons">
          <v-btn color="primary">Save</v-btn>
          <v-btn color="error">Clear</v-btn>
        </div>
        <canvas ref="canvas" id="canvas" width="512" height="512"></canvas>
      </div>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    let canvas = this.$refs.canvas;
    let ctx = canvas.getContext("2d");

    let img = document.createElement("img");
    img.src = "https://avatars3.githubusercontent.com/u/34525547";
    img.addEventListener("load", () => {
      ctx.drawImage(img, 0, 0, 512, 512);
    });

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

      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#c0392b";

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

#buttons {
  margin-bottom: 20px;
}
</style>
