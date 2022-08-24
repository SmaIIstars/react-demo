/**
 * @param {number} [fps] - 帧率
 * @param {function} callback - 动画逻辑
 * @return {function} cancelRFA  - 取消播放
 */

export function rAF(callback: (...arg: any[]) => any, fps = 24) {
  let last = Date.now();
  let delta = last;
  const interval = 1000 / fps;
  let tick = 0;

  function draw() {
    if (tick !== 0) return;
    tick = requestAnimationFrame(draw);
    let now = Date.now();
    delta = now - last;
    console.error(now, last, delta, interval);
    if (delta > interval) {
      last = now - (delta % interval);
      callback();
    }
  }

  draw();

  return function cancelRAF() {
    console.error(tick);
    cancelAnimationFrame(tick);
  };
}
