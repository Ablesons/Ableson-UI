/**
 * @name: repeat-click
 * @description：处理长按鼠标时的函数
 * @author: Ablesons
 * @date: 2021/11/16 22:18
 * @update: 2021/11/16 22:18
 */
import { once, on } from '../utils/dom.js';

export default {
  bind(el, binding, vnode) {
    let interval = null;
    let startTime;
    // 获取对应要执行的事件
    const handler = () => vnode.context[binding.expression].apply();
    const clear = () => {
      // 当mousedonw与mouseuo之间的事件间隔小于0.1秒时，额外触发一次（单击这种情况），
      // 大于0.1s的都有setInterval去触发执行了
      if (Date.now() - startTime < 100) {
        handler();
      }
      clearInterval(interval);
      interval = null;
    }
    // 给el绑上了mousedonw的事件
    on(el, 'mousedown', (e) => {
      // 限制左键
      if (e.button !== 0) return;
      startTime = Date.now();
      // 在触发mousedown时，绑定了mouseup事件
      once(document, 'mouseup', clear);
      clearInterval(interval);
      // 每隔0.1s触发一次
      interval = setInterval(handler, 100);
    });
  }
}
