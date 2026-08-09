# 移动端业务页顶栏清爽模式入口（可复用片段）

> 保存于 2026-08-07，来源 commit `475c218`（后已回退）。
> 用途：未来若要在移动端非首页顶栏恢复"清爽模式"按钮，直接应用下面两处改动即可。
> 回退原因：与桌面端逻辑对齐（清爽模式入口仅首页展示），此能力暂不启用。

## 效果

- 桌面端（视口 > 991px）：非首页不显示清爽按钮（与首页逻辑无关，保持现状）
- 移动端（视口 ≤ 991px）：所有页面顶栏右侧保留 `#urppp-nav-clean` 清爽按钮
- 首页：始终显示（不受影响）

## 改动 1：`src/features/clean-mode/controller.js`

在 `injectCleanEntry()` 中，把"仅首页"改为"窄视口下业务页也保留"：

```js
function injectCleanEntry() {
  try {
    deps.ensureStyle();
    let btn = document.getElementById('urppp-nav-clean');
    // 首页总是展示；非首页仅在窄视口（移动端）保留，桌面业务页移除
    if (!deps.isHomePage()) {
      const narrow = !!(deps.isNarrowViewport && deps.isNarrowViewport());
      if (!narrow) {
        if (btn) btn.remove();
        return;
      }
    }
    const host = document.getElementById('urppp-nav-theme')
      || document.querySelector('#navbar .navbar-header')
      || document.querySelector('#navbar');
    if (!host) return;
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'urppp-nav-clean';
      btn.title = '清爽模式';
      btn.innerHTML = `${deps.ico('clean')}<span>清爽</span>`;
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openCleanMode(false);
      });
      host.appendChild(btn);
    }
    // 尺寸与布局由组件控制；形状、边框、材质由 Skin token 控制
    Object.entries({
      display: 'inline-flex', 'align-items': 'center', height: '28px', 'min-height': '28px',
      padding: '0 12px', 'font-size': '12px', gap: '6px',
      width: 'auto', float: 'none',
    }).forEach(([key, value]) => btn.style.setProperty(key, value, 'important'));
  } catch (error) {
    console.warn('[URP++] clean entry', error);
  }
}
```

注意：`openCleanMode` 本身不限制首页，任何页面打开清爽模式都能工作，限制只在入口注入这一层。

## 改动 2：`src/userscripts/urppp.entry.js`

创建 controller 时注入 `isNarrowViewport`：

```js
deps: {
  // ...原有 deps
  isHomePage,
  isNarrowViewport: () => !!(window.matchMedia && window.matchMedia('(max-width: 991px)').matches),
  loadAll,
  // ...
}
```

## 改动 3（配套）：`tests/clean-mode-controller.test.js`

mock deps 补一行：

```js
isNarrowViewport: () => false,
```

## 改动 4（配套）：`tests/browser/mobile-navigation.spec.js`

在"mobile navbar and sidebar survive business-page route replacement"测试中，业务页路由重建后加断言：

```js
await expect(page.locator('#navbar #urppp-nav-clean')).toHaveCount(1);
```

（该测试视口 390x844，属窄视口；若恢复此能力，两条业务页断言处都要加。）

## 相关 CSS（无需改动，已生效）

`src/styles/mobile.css` 中移动端清爽按钮紧凑样式已存在：

```css
#navbar #urppp-nav-clean,
#urppp-nav-theme #urppp-nav-clean {
  height: 30px !important;
  min-height: 30px !important;
  margin: 0 8px 0 4px !important;
  padding: 0 10px !important;
  font-size: 12px !important;
}
```

## 回退操作（本次已执行）

- `controller.js`：恢复 `if (!deps.isHomePage()) { if (btn) btn.remove(); return; }`
- `entry.js`：删除 `isNarrowViewport` deps
- `clean-mode-controller.test.js`：删除 mock 行
- `mobile-navigation.spec.js`：删除业务页清爽按钮断言
