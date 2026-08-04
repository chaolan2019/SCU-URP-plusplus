// Minimal feature lifecycle primitives for route-aware userscript modules.

function assertFunction(value, label) {
  if (typeof value !== 'function') throw new TypeError(`${label} must be a function`);
}

export function defineFeature(definition) {
  if (!definition || typeof definition !== 'object') {
    throw new TypeError('feature definition must be an object');
  }
  const id = String(definition.id || '').trim();
  if (!id) throw new TypeError('feature id is required');
  assertFunction(definition.matches, `${id}.matches`);
  assertFunction(definition.mount, `${id}.mount`);
  assertFunction(definition.unmount, `${id}.unmount`);
  return Object.freeze({
    id,
    matches: definition.matches,
    mount: definition.mount,
    unmount: definition.unmount,
  });
}

export function createFeatureRuntime(features) {
  if (!Array.isArray(features)) throw new TypeError('features must be an array');
  const registry = features.map(defineFeature);
  const ids = new Set();
  registry.forEach((feature) => {
    if (ids.has(feature.id)) throw new Error(`duplicate feature id: ${feature.id}`);
    ids.add(feature.id);
  });

  let activeFeature = null;
  let activeContext = null;

  function unmount() {
    if (!activeFeature) return;
    const feature = activeFeature;
    const context = activeContext;
    activeFeature = null;
    activeContext = null;
    feature.unmount(context);
  }

  function refresh(context = {}) {
    const next = registry.find((feature) => feature.matches(context));
    const sameLifecycle = next && activeFeature === next && context.lifecycleKey !== undefined
      && activeContext?.lifecycleKey === context.lifecycleKey;
    if (sameLifecycle) {
      try {
        next.mount(context);
        activeContext = context;
        return next.id;
      } catch (error) {
        unmount();
        throw error;
      }
    }

    unmount();
    if (!next) return null;
    try {
      next.mount(context);
      activeFeature = next;
      activeContext = context;
      return next.id;
    } catch (error) {
      try { next.unmount(context); } catch (_) {}
      throw error;
    }
  }

  return Object.freeze({
    refresh,
    unmount,
    getActiveFeatureId: () => activeFeature?.id || null,
    listFeatureIds: () => registry.map((feature) => feature.id),
  });
}
