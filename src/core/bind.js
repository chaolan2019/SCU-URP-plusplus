/**
 * DOM 事件绑定守卫：同一节点 + 同一 key 只允许绑定一次。
 * 统一各模块的 window.__xBound / node.__xBound / dataset 混用机制。
 * 注意：window 级守卫（跨重建的全局一次性绑定）请继续用 window 显式属性，
 * 本工具面向"节点重建后守卫随节点消失"的场景。
 */

/** 节点绑定守卫：未绑过返回 true（调用方继续绑定），已绑过返回 false */
export function markBound(node, key) {
  if (!node) return false;
  if (!node.__urpppBoundKeys) node.__urpppBoundKeys = new Set();
  if (node.__urpppBoundKeys.has(key)) return false;
  node.__urpppBoundKeys.add(key);
  return true;
}

/** 查询节点是否已绑定某 key */
export function isBound(node, key) {
  return !!(node && node.__urpppBoundKeys && node.__urpppBoundKeys.has(key));
}
