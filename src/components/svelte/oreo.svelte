<script lang="ts">
  import { onMount } from 'svelte';
  const audio = [
    new Audio('https://gulkoa.github.io/Oreo/sounds/rempop.wav'),
    new Audio('https://gulkoa.github.io/Oreo/sounds/pop (1).wav'),
    new Audio('https://gulkoa.github.io/Oreo/sounds/pop (2).wav'),
    new Audio('https://gulkoa.github.io/Oreo/sounds/pop (3).wav'),
    new Audio('https://gulkoa.github.io/Oreo/sounds/pop (4).wav'),
    new Audio('https://gulkoa.github.io/Oreo/sounds/pop (5).wav'),
    new Audio('https://gulkoa.github.io/Oreo/sounds/pop (6).wav'),
    new Audio('https://gulkoa.github.io/Oreo/sounds/pop (7).wav'),
  ];

  let cookieLayers = []
  let lastLayerIndex = 0
  function addlayer(type, sound: boolean=true) {
    if (sound) {
      audio[Math.floor(Math.random() * 7 + 1)].play()
    }

    const newLayer = document.createElement('img')
    if (type == 'top')
    {
        newLayer.src = 'https://gulkoa.github.io/Oreo/img/oreo-top.png'
        newLayer.classList = 'oreo-top oreo-layer'
        cookieLayers.push('top')
    }
    else if (type == 'mid')
    {
        newLayer.src = 'https://gulkoa.github.io/Oreo/img/oreo-middle.png'
        newLayer.classList = 'oreo-middle oreo-layer'
        cookieLayers.push('mid')
    }
    else if (type == 'bot')
    {
        newLayer.src = 'https://gulkoa.github.io/Oreo/img/oreo-bottom.png'
        newLayer.classList = 'oreo-bottom oreo-layer'
        cookieLayers.push('bot')
    }

    newLayer.draggable = false
    newLayer.style = 'z-index: ' + (lastLayerIndex + 1) + ';'

    cookie.insertBefore(newLayer, cookie.childNodes[0]);

    lastLayerIndex++
  }

  function randomOreo(minLayers, maxLayer, sound: boolean=true) {
    setTimeout(() => {
        const amountOfLayers = Math.floor(Math.random() * (maxLayer - minLayers + 1) + minLayers)
        const types = ['bot', 'mid', 'top']
        for (let i = 0; i < amountOfLayers; i++)
        {
            let type = Math.floor(Math.random() * 3)
            addlayer(types[type], sound)
        }
    }, 250)
  }

  onMount(() => {
    randomOreo(3, 7, false)
  })

</script>

<div class="cookie" id="cookie">
  <img src="https://gulkoa.github.io/Oreo/img/oreo-base.png" class="oreo-base oreo-layer" draggable="false">
</div>


<style>
  .cookie {
    position: relative;
    top: 500px;
    margin-left: auto;
    margin-right: auto;
    width: 520px;
    max-width: 100%;
  }

  .oreo-layer {
      position: relative;
      margin-top: -300px;
      z-index: 0;
      animation: slideOnTop 0.3s ease;
      max-width: 100%;
  }


  .oreo-layer.removing {
      animation: remove 0.3s ease;
  }


  @keyframes slideOnTop {
      0% {
          opacity: 0.5;
          transform: translateY(-500px);
      }

      100% {
          opacity: 1;
          transform: translateY(0);
      }
  }

  @keyframes remove {
      0% {
          opacity: 1;
          transform: translateX(0);
      }

      100% {
          opacity: 0;
          transform: translateX(-300px);
      }
  }

</style>