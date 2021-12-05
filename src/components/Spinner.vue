<template>
<div class="spin" v-if="!isloaded">
  <div class="page-bg"></div>
        <div class="animation-wrapper">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
        </div>
  <div class="ring"></div>
    <div class="orbit-spinner">
      <div class="orbit"></div>
      <div class="orbit"></div>
      <div class="orbit"></div>
  </div>
</div>

</template>

<script>


export default {
  data: () => {
    return{
      isloaded: false,
    }
  },
  beforeCreate(){
    this.loaded = false;
  },
  mounted() {
    document.onreadystatechange = () => {
      if(document.readyState == "complete") {
        this.isloaded = true;
      } else {
        this.isloaded = false;
      }
    }
  }

};

</script>

<style>
.spin{
  z-index:10;
  width:100%;
  height:100%;
  background: #fff;
  position: fixed;
}

.orbit-spinner, .orbit-spinner * {
      box-sizing: border-box;
    }
    .orbit-spinner {
      position: fixed;
      top: 50%;
      left: 50%;
      margin: 0 auto;
      transform: translate(-50%, -50%);
      height: 150px;
      width: 150px;
      border-radius: 50%;
      perspective: 800px;

    }

    .orbit-spinner .orbit {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .orbit-spinner .orbit:nth-child(1) {
      left: 0%;
      top: 0%;
      animation: orbit-spinner-orbit-one-animation 1200ms linear infinite;
      border-bottom: 3px solid #f4cf36;
    }

    .orbit-spinner .orbit:nth-child(2) {
      right: 0%;
      top: 0%;
      animation: orbit-spinner-orbit-two-animation 1200ms linear infinite;
      border-right: 3px solid #f4cf36;
    }

    .orbit-spinner .orbit:nth-child(3) {
      right: 0%;
      bottom: 0%;
      animation: orbit-spinner-orbit-three-animation 1200ms linear infinite;
      border-top: 3px solid #f4cf36;
    }

    @keyframes orbit-spinner-orbit-one-animation {
      0% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
      }
    }

    @keyframes orbit-spinner-orbit-two-animation {
      0% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
      }
    }

    @keyframes orbit-spinner-orbit-three-animation {
      0% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
      }
    }
</style>

