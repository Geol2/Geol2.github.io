/*
 * 배경 효과 : 초록 문자가 위에서 아래로 흐른다.
 * 본문 위에 그리지 않는다(z-index -1, pointer-events none). 움직임 줄이기 설정이면 멈춘 한 장면만 그린다.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('code-rain');
  if (!canvas || !canvas.getContext) {
    return;
  }
  var ctx = canvas.getContext('2d');
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var SIZE = 16;
  var drops = [];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var cols = Math.ceil(canvas.width / SIZE);
    drops = [];
    for (var i = 0; i < cols; i++) {
      drops.push(Math.floor(Math.random() * canvas.height / SIZE));
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';      // 지난 글자를 서서히 지워 꼬리가 남는다
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = SIZE + 'px monospace';
    for (var i = 0; i < drops.length; i++) {
      var ch = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      ctx.fillText(ch, i * SIZE, drops[i] * SIZE);
      if (drops[i] * SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduce) {
    for (var n = 0; n < 40; n++) { draw(); }
    return;
  }

  var last = 0;
  (function loop(t) {
    if (t - last > 50) {                        // 약 20fps 로 제한해 CPU 부담을 줄인다
      draw();
      last = t;
    }
    window.requestAnimationFrame(loop);
  })(0);
})();
