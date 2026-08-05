export function createEvaluationAssist({ config, storage, deps }) {
  const { getBool, setVal, setJSON } = storage;
  const { EVAL, EVALUATION_LIST_PATH, DEFAULT_COMMENTS } = deps.constants;
  const {
    escapeHtml,
    escapeAttr,
    lettersForMulti,
    lettersForSingle,
    log,
    optionLetter,
    parsePerQuestionMap,
    pickRandom,
    randInt,
    setInputValue,
    setTextAreaValue,
    sleep,
  } = deps.utils;

  function buildEvalSection() {
    const c = config.evalConf();
    const perSingle = Object.keys(c.singlePerQ || {}).map((k) => `${k}:${c.singlePerQ[k]}`).join('\n');
    const perMulti = Object.keys(c.multiPerQ || {}).map((k) => `${k}:${c.multiPerQ[k]}`).join('\n');
    const sec = document.createElement('section');
    sec.className = 'urppp-set-sec urpppp-sec';
    sec.id = 'urpppp-eval-sec';
    sec.innerHTML = `
      <h3>评教助手</h3>
      <p class="urppp-set-tip">在评教填写页自动填写问卷。服务端有约 100 秒停留校验，已取消“跳过倒计时”；开启自动保存后会等到设定秒数再提交。</p>
      <div class="urpppp-switches">
        <button type="button" class="urppp-set-follow" id="urpppp-eval-enabled">功能：${c.enabled ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-autofill">进入页面自动填写：${c.autoFill ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-autosave">到时自动保存：${c.autoSave ? '开' : '关'}</button>
        <button type="button" class="urppp-set-follow" id="urpppp-eval-avoid-none">多选避开「以上均无」：${c.multiAvoidNone ? '开' : '关'}</button>
      </div>

      <div class="urpppp-sub">自动保存等待</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>等待秒数</label><input type="number" id="urpppp-eval-wait-sec" min="0" max="600" value="${escapeAttr(String(c.waitSec))}" /></div>
      </div>
      <p class="urpppp-tip">默认100秒，启用自动保存后会在计时结束自动保存。教务系统服务端也会进行倒计时，无法直接跳过等待秒数。</p>

      <div class="urpppp-sub">分数题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>随机下限</label><input type="number" id="urpppp-eval-score-min" min="1" max="100" value="${escapeAttr(String(c.scoreMin))}" /></div>
        <div class="urpppp-row"><label>随机上限</label><input type="number" id="urpppp-eval-score-max" min="1" max="100" value="${escapeAttr(String(c.scoreMax))}" /></div>
      </div>
      <p class="urpppp-tip">每位教师的分数题会在 [下限, 上限] 内独立随机整数。</p>

      <div class="urpppp-sub">单选题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>默认选项池</label><input type="text" id="urpppp-eval-single" value="${escapeAttr(c.singleLetters)}" placeholder="如 A 或 A,B" /></div>
        <div class="urpppp-row" style="align-items:start"><label>按题配置</label><textarea id="urpppp-eval-single-per" placeholder="每行：题号:选项池&#10;2:A,B&#10;5:A">${escapeHtml(perSingle)}</textarea></div>
      </div>
      <p class="urpppp-tip">不同问卷的部分题目特殊（如国际周课程的第7题），建议在执行自动评教前检查特殊题目并按题配置</p>
      <p class="urpppp-tip">题号为页面「2、3、4…」中的数字。选项池如 <code>A,B</code> 表示在 A/B 中随机。</p>

      <div class="urpppp-sub">多选题</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>默认勾选池</label><input type="text" id="urpppp-eval-multi" value="${escapeAttr(c.multiLetters)}" placeholder="如 A,B,C" /></div>
        <div class="urpppp-row" style="align-items:start"><label>按题配置</label><textarea id="urpppp-eval-multi-per" placeholder="每行：题号:选项池&#10;6:A,B,C,F">${escapeHtml(perMulti)}</textarea></div>
      </div>
      <p class="urpppp-tip">会勾选池内全部选项；若开启避开「以上均无」，不会勾选含「以上均无」的项。</p>

      <div class="urpppp-sub">主观题模板</div>
      <div class="urpppp-grid">
        <div class="urpppp-row" style="align-items:start"><label>评语模板</label><textarea id="urpppp-eval-comments" placeholder="每行一条，随机选用">${escapeHtml(c.commentTemplates)}</textarea></div>
        <div class="urpppp-row"><label>自动保存延迟(ms)</label><input type="number" id="urpppp-eval-save-delay" min="0" step="100" value="${escapeAttr(String(c.saveDelay))}" /></div>
      </div>
      <p class="urpppp-tip">评语模版以回车划分，可以自行添加新模板</p>

      <div class="urpppp-sub">全自动评教（列表页）</div>
      <div class="urpppp-grid">
        <div class="urpppp-row"><label>问卷间隔(秒)</label><input type="number" id="urpppp-eval-batch-gap" min="0" max="60" value="${escapeAttr(String(c.batchGapSec))}" /></div>
      </div>
      <p class="urpppp-tip">在「教学评估」列表页启动：自动找未评估 → 进入填写 → 等待秒数后保存 → 返回列表继续，直到全部完成。期间请勿手动关闭页面。</p>

      <div class="urpppp-actions">
        <button type="button" class="urppp-set-btn" id="urpppp-eval-save">保存评教设置</button>
        <button type="button" class="urppp-set-btn ghost" id="urpppp-eval-run">对当前评教页立即执行</button>
        <button type="button" class="urppp-set-btn" id="urpppp-eval-batch-start">启动全自动评教</button>
        <button type="button" class="urppp-set-btn ghost" id="urpppp-eval-batch-stop">停止全自动</button>
      </div>
      <div class="urpppp-status" id="urpppp-eval-status"></div>
    `;
    return sec;
  }

  function bindEvalSection(sec) {
    let enabled = getBool(EVAL.enabled, true);
    let autoFill = getBool(EVAL.autoFill, true);
    let autoSave = getBool(EVAL.autoSave, false);
    let avoidNone = getBool(EVAL.multiAvoidNone, true);
    const enabledBtn = sec.querySelector('#urpppp-eval-enabled');
    const fillBtn = sec.querySelector('#urpppp-eval-autofill');
    const saveAutoBtn = sec.querySelector('#urpppp-eval-autosave');
    const avoidBtn = sec.querySelector('#urpppp-eval-avoid-none');
    deps.syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    deps.syncToggle(fillBtn, autoFill, '进入页面自动填写：开', '进入页面自动填写：关');
    deps.syncToggle(saveAutoBtn, autoSave, '到时自动保存：开', '到时自动保存：关');
    deps.syncToggle(avoidBtn, avoidNone, '多选避开「以上均无」：开', '多选避开「以上均无」：关');

    enabledBtn.onclick = () => {
      enabled = !enabled; setVal(EVAL.enabled, enabled);
      deps.syncToggle(enabledBtn, enabled, '功能：开', '功能：关');
    };
    fillBtn.onclick = () => {
      autoFill = !autoFill; setVal(EVAL.autoFill, autoFill);
      deps.syncToggle(fillBtn, autoFill, '进入页面自动填写：开', '进入页面自动填写：关');
    };
    saveAutoBtn.onclick = () => {
      autoSave = !autoSave; setVal(EVAL.autoSave, autoSave);
      deps.syncToggle(saveAutoBtn, autoSave, '到时自动保存：开', '到时自动保存：关');
    };
    avoidBtn.onclick = () => {
      avoidNone = !avoidNone; setVal(EVAL.multiAvoidNone, avoidNone);
      deps.syncToggle(avoidBtn, avoidNone, '多选避开「以上均无」：开', '多选避开「以上均无」：关');
    };

    sec.querySelector('#urpppp-eval-save').onclick = () => {
      let min = Math.max(1, Math.min(100, parseInt(sec.querySelector('#urpppp-eval-score-min').value, 10) || 92));
      let max = Math.max(1, Math.min(100, parseInt(sec.querySelector('#urpppp-eval-score-max').value, 10) || 98));
      if (max < min) { const t = min; min = max; max = t; }
      setVal(EVAL.enabled, enabled);
      setVal(EVAL.autoFill, autoFill);
      setVal(EVAL.autoSave, autoSave);
      setVal(EVAL.multiAvoidNone, avoidNone);
      setVal(EVAL.waitSec, String(Math.max(0, parseInt(sec.querySelector('#urpppp-eval-wait-sec').value, 10) || 100)));
      setVal(EVAL.scoreMin, String(min));
      setVal(EVAL.scoreMax, String(max));
      setVal(EVAL.singleLetters, (sec.querySelector('#urpppp-eval-single').value || 'A').trim());
      setJSON(EVAL.singlePerQ, parsePerQuestionMap(sec.querySelector('#urpppp-eval-single-per').value));
      setVal(EVAL.multiLetters, (sec.querySelector('#urpppp-eval-multi').value || 'A,B,C').trim());
      setJSON(EVAL.multiPerQ, parsePerQuestionMap(sec.querySelector('#urpppp-eval-multi-per').value));
      setVal(EVAL.commentTemplates, sec.querySelector('#urpppp-eval-comments').value || '');
      setVal(EVAL.saveDelay, String(Math.max(0, parseInt(sec.querySelector('#urpppp-eval-save-delay').value, 10) || 500)));
      setVal(EVAL.batchGapSec, String(Math.max(0, parseInt(sec.querySelector('#urpppp-eval-batch-gap').value, 10) || 2)));
      deps.setStatus('urpppp-eval-status', '评教设置已保存', 'ok');
    };

    sec.querySelector('#urpppp-eval-run').onclick = async () => {
      try {
        const ok = await runEvaluationAssist({ force: true, forceSave: true });
        deps.setStatus('urpppp-eval-status', ok ? '已在当前评教页执行' : '当前不是评教填写页，或执行失败', ok ? 'ok' : 'err');
      } catch (e) {
        deps.setStatus('urpppp-eval-status', String(e && e.message || e), 'err');
      }
    };

    const batchStartBtn = sec.querySelector('#urpppp-eval-batch-start');
    const batchStopBtn = sec.querySelector('#urpppp-eval-batch-stop');
    if (batchStartBtn) {
      batchStartBtn.onclick = async () => {
        try {
          const n = await startFullAutoEvaluation();
          deps.setStatus('urpppp-eval-status', n > 0 ? ('已启动全自动，共 ' + n + ' 份未评估') : '当前列表没有未评估问卷（请先打开教学评估列表页）', n > 0 ? 'ok' : 'err');
        } catch (e) {
          deps.setStatus('urpppp-eval-status', String(e && e.message || e), 'err');
        }
      };
    }
    if (batchStopBtn) {
      batchStopBtn.onclick = () => {
        config.clearBatchState();
        deps.setStatus('urpppp-eval-status', '已停止全自动评教', 'ok');
        updateBatchHud();
      };
    }
  }

  function isEvaluationPage() {
    return /\/student\/teachingEvaluation\/newEvaluation\/evaluation\//i.test(location.pathname || '')
      || !!(document.getElementById('savebutton') && document.getElementById('timer') && document.forms.saveEvaluation);
  }

  function getGlobalScope() {
    try {
      if (typeof unsafeWindow !== 'undefined' && unsafeWindow) return unsafeWindow;
    } catch (_) { /* ignore */ }
    return window;
  }

  // save() 在页面全局；油猴沙箱需注入调用
  function injectPageScript(fn, arg) {
    try {
      const script = document.createElement('script');
      script.textContent = '(' + fn.toString() + ')(' + JSON.stringify(arg == null ? null : arg) + ');';
      const root = document.documentElement || document.head || document.body;
      root.appendChild(script);
      script.remove();
      return true;
    } catch (e) {
      console.warn('[URP++ 辅助] injectPageScript failed', e);
      return false;
    }
  }

  // 到点后仅启用保存按钮（不提前跳过页面倒计时）
  function enableSaveButtonInPage() {
    injectPageScript(function () {
      try {
        var btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('disabled');
          try { btn.classList.remove('disabled'); } catch (e0) {}
        }
        var ts = document.getElementById('tsxx');
        if (ts) ts.style.display = 'none';
      } catch (e) {
        console.warn('[URP++ 辅助] enable save failed', e);
      }
    });
    const btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('disabled');
    }
  }

  function questionIndexNear(el) {
    let node = el;
    for (let i = 0; i < 12 && node; i++) {
      const t = (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
      const m = t.match(/(?:^|\n)\s*(\d{1,2})\s*[、.．]/);
      if (m) return m[1];
      let prev = node.previousElementSibling;
      let guard = 0;
      while (prev && guard++ < 6) {
        const pt = (prev.innerText || prev.textContent || '').replace(/\s+/g, ' ').trim();
        const pm = pt.match(/^(\d{1,2})\s*[、.．]/);
        if (pm) return pm[1];
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }
    return '';
  }

  function fillScores(cfg) {
    let min = Number(cfg.scoreMin) || 92;
    let max = Number(cfg.scoreMax) || 98;
    if (max < min) { const t = min; min = max; max = t; }
    const inputs = Array.from(document.querySelectorAll('input[data-name="szt"], input[placeholder*="1-100"]'));
    let n = 0;
    inputs.forEach((input) => {
      if (input.type === 'hidden') return;
      const v = String(randInt(min, max));
      setInputValue(input, v);
      n++;
    });
    return n;
  }

  function fillRadios(cfg) {
    const names = [...new Set(Array.from(document.querySelectorAll('input[type="radio"]'))
      .map((r) => r.name)
      .filter((n) => n && !/zcms|week|kszc|jszc/i.test(n)))];
    let filled = 0;
    names.forEach((name) => {
      const radios = Array.from(document.querySelectorAll(`input[type="radio"][name="${CSS.escape ? CSS.escape(name) : name}"]`));
      if (!radios.length) return;
      if (radios.every((r) => /全周|单周|双周/.test(r.value || ''))) return;
      const qNo = questionIndexNear(radios[0]);
      const pool = lettersForSingle(qNo, cfg);
      const candidates = radios.filter((r) => {
        const letter = optionLetter(r.value) || optionLetter((r.nextSibling && r.nextSibling.textContent) || '') || optionLetter(r.parentElement && r.parentElement.textContent);
        return pool.includes(letter);
      });
      const pick = pickRandom(candidates.length ? candidates : radios);
      if (pick) {
        pick.checked = true;
        pick.dispatchEvent(new Event('click', { bubbles: true }));
        pick.dispatchEvent(new Event('change', { bubbles: true }));
        filled++;
      }
    });
    return filled;
  }

  function fillChecks(cfg) {
    const names = [...new Set(Array.from(document.querySelectorAll('input[type="checkbox"]')).map((c) => c.name).filter(Boolean))];
    let groups = 0;
    names.forEach((name) => {
      const boxes = Array.from(document.querySelectorAll(`input[type="checkbox"][name="${CSS.escape ? CSS.escape(name) : name}"]`));
      if (!boxes.length) return;
      const qNo = questionIndexNear(boxes[0]);
      const pool = lettersForMulti(qNo, cfg);
      boxes.forEach((b) => { b.checked = false; });
      let any = false;
      boxes.forEach((b) => {
        const label = b.value || (b.parentElement && b.parentElement.textContent) || '';
        const letter = optionLetter(b.value) || optionLetter(label);
        if (!pool.includes(letter)) return;
        if (cfg.multiAvoidNone && /以上均无|均无|无以上/.test(label)) return;
        b.checked = true;
        b.dispatchEvent(new Event('click', { bubbles: true }));
        b.dispatchEvent(new Event('change', { bubbles: true }));
        any = true;
      });
      if (!any) {
        const fallback = boxes.find((b) => !/以上均无|均无/.test(b.value || b.parentElement && b.parentElement.textContent || '')) || boxes[0];
        if (fallback) {
          fallback.checked = true;
          fallback.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      groups++;
    });
    return groups;
  }

  function fillComments(cfg) {
    const lines = String(cfg.commentTemplates || '')
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    const pool = lines.length ? lines : DEFAULT_COMMENTS.split('\n');
    const areas = Array.from(document.querySelectorAll('form[name="saveEvaluation"] textarea, #saveEvaluation textarea, textarea'))
      .filter((t) => t.name || t.closest('form'));
    let n = 0;
    areas.forEach((ta) => {
      if (/kszc|jszc|search/i.test(ta.name || ta.id || '')) return;
      const text = pickRandom(pool) || '老师认真负责，课程收获很大。';
      setTextAreaValue(ta, text.slice(0, ta.maxLength > 0 ? ta.maxLength : 500));
      n++;
    });
    return n;
  }

  function tryAutoSave(cfg) {
    if (!cfg.autoSave && !cfg.__forceSave) return false;
    enableSaveButtonInPage();
    const injected = injectPageScript(function () {
      try {
        var btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('disabled');
        }
        if (typeof save === 'function') {
          save();
          return;
        }
        if (btn) btn.click();
      } catch (e) {
        console.warn('[URP++ 辅助] page save failed', e);
        try {
          var b2 = document.getElementById('savebutton');
          if (b2) b2.click();
        } catch (e2) {}
      }
    });
    if (injected) {
      log('已请求页面保存');
      return true;
    }
    const btn = document.getElementById('savebutton') || document.getElementById('save') || document.getElementById('save2');
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('disabled');
      btn.click();
      log('已点击保存按钮');
      return true;
    }
    return false;
  }

  // 记录进入评教页时刻
  let evalPageEnterAt = 0;
  function markEvalPageEnter() {
    if (!isEvaluationPage()) return;
    if (!evalPageEnterAt) evalPageEnterAt = Date.now();
  }

  async function waitBeforeAutoSave(cfg) {
    const need = Math.max(0, Number(cfg.waitSec) || 0);
    if (need <= 0) return 0;
    if (!evalPageEnterAt) evalPageEnterAt = Date.now();
    const elapsed = (Date.now() - evalPageEnterAt) / 1000;
    const remain = Math.ceil(need - elapsed);
    if (remain <= 0) return 0;
    log(`自动保存等待 ${remain}s（不跳过服务端倒计时）`);
    let left = remain;
    while (left > 0) {
      const tip = document.getElementById('urpppp-eval-wait-tip');
      if (tip) tip.textContent = `评教助手：约 ${left} 秒后自动保存`;
      await sleep(1000);
      left -= 1;
    }
    const tip = document.getElementById('urpppp-eval-wait-tip');
    if (tip) tip.textContent = '评教助手：正在自动保存…';
    return remain;
  }

  function ensureWaitTip() {
    if (!isEvaluationPage()) return;
    if (document.getElementById('urpppp-eval-wait-tip')) return;
    const host = document.querySelector('.right_top_oper') || document.querySelector('#savebutton') && document.getElementById('savebutton').parentElement;
    if (!host) return;
    const tip = document.createElement('span');
    tip.id = 'urpppp-eval-wait-tip';
    host.appendChild(tip);
  }

  let evalRunning = false;
  async function runEvaluationAssist(opts) {
    opts = opts || {};
    if (!isEvaluationPage()) return false;
    markEvalPageEnter();
    ensureWaitTip();
    updateBatchHud();
    const cfg = config.evalConf();
    const batch = config.getBatchState();
    const forceSave = !!(opts.forceSave || batch.active);
    const forceFill = !!(opts.force || cfg.autoFill || batch.active);
    if (!cfg.enabled && !opts.force && !batch.active) return false;
    if (evalRunning) return false;
    evalRunning = true;
    try {
      log('评教页处理开始', cfg, batch);
      if (forceFill) {
        const s = fillScores(cfg);
        const r = fillRadios(cfg);
        const m = fillChecks(cfg);
        const t = fillComments(cfg);
        log(`已填充：分数${s} 单选${r} 多选${m} 主观${t}`);
        setBatchTip(`已填写，等待 ${cfg.waitSec}s 后保存（${batch.active ? ('队列 ' + (batch.index + 1) + '/' + batch.queue.length) : '单页'}）`);
      }
      if (cfg.autoSave || forceSave) {
        await waitBeforeAutoSave(cfg);
        await sleep(cfg.saveDelay || 0);
        enableSaveButtonInPage();
        if (batch.active) installSaveSuccessWatcher();
        tryAutoSave(Object.assign({}, cfg, { autoSave: true, __forceSave: true }));
        if (batch.active) {
          await sleep(2500);
          if (isEvaluationPage()) {
            log('保存后仍停留在填写页，可能失败；停止或回列表重试');
            setBatchTip('保存可能失败，请检查后重试/停止全自动');
          }
        }
      }
      return true;
    } catch (e) {
      console.error('[URP++ 辅助] 评教失败', e);
      return false;
    } finally {
      evalRunning = false;
    }
  }

  // ===================== 全自动评教（列表 → 逐份填写 → 保存后继续） =====================
  function isEvaluationListPage() {
    const p = String(location.pathname || '');
    return /\/student\/teachingEvaluation\/newEvaluation\/index/i.test(p);
  }

  function setBatchTip(text) {
    const el = document.getElementById('urpppp-eval-wait-tip') || document.getElementById('urpppp-batch-hud');
    if (el) el.textContent = text || '';
    log(text);
  }

  function updateBatchHud() {
    const batch = config.getBatchState();
    let hud = document.getElementById('urpppp-batch-hud');
    if (!batch.active) {
      if (hud) hud.remove();
      return;
    }
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'urpppp-batch-hud';
      document.documentElement.appendChild(hud);
      deps.settingsStyles();
    }
    const total = (batch.queue || []).length;
    const cur = Math.min(batch.index + 1, total);
    const item = batch.queue[batch.index];
    hud.innerHTML = `<div class="urpppp-hud-title">全自动评教进行中</div>
      <div class="urpppp-hud-line">进度：${cur}/${total}</div>
      <div class="urpppp-hud-course">${escapeHtml((item && item.title) || '')}</div>
      <button type="button" id="urpppp-batch-hud-stop">停止</button>`;
    const stop = document.getElementById('urpppp-batch-hud-stop');
    if (stop) stop.onclick = () => { config.clearBatchState(); updateBatchHud(); setBatchTip('已停止全自动评教'); };
  }

  function scanUnevaluatedFromList() {
    const out = [];
    const seen = new Set();
    document.querySelectorAll('a[onclick*="evaluation("], button[onclick*="evaluation("]').forEach((a) => {
      const oc = a.getAttribute('onclick') || '';
      const m = oc.match(/evaluation\s*\(\s*this\s*,\s*["']([0-9A-Fa-f]+)["']/);
      if (!m) return;
      const ktid = m[1];
      if (seen.has(ktid)) return;
      const tr = a.closest('tr');
      const rowText = ((tr && tr.innerText) || a.innerText || '').replace(/\s+/g, ' ').trim();
      const opText = (a.textContent || '').replace(/\s+/g, '');
      if (!(opText === '评估' || /\s否\s|是否已评估.*否|\b否\b/.test(rowText))) return;
      let title = '';
      if (tr) {
        const tds = Array.from(tr.cells || []).map((td) => (td.textContent || '').replace(/\s+/g, ' ').trim());
        title = tds[4] || tds[2] || tds.find((t) => t && !/^\d+$/.test(t) && t !== '评估' && t !== '否') || rowText;
      }
      seen.add(ktid);
      out.push({
        ktid,
        url: '/student/teachingEvaluation/newEvaluation/evaluation/' + ktid,
        title: String(title || ktid).slice(0, 80),
      });
    });
    return out;
  }

  async function startFullAutoEvaluation() {
    if (!isEvaluationListPage()) {
      config.setBatchState({ active: true, queue: [], index: 0 });
      location.href = EVALUATION_LIST_PATH;
      return 0;
    }
    await sleep(400);
    const queue = scanUnevaluatedFromList();
    if (!queue.length) {
      config.clearBatchState();
      updateBatchHud();
      return 0;
    }
    config.setBatchState({ active: true, queue, index: 0 });
    updateBatchHud();
    log('全自动队列', queue);
    await sleep(Math.max(0, (config.evalConf().batchGapSec || 0) * 1000));
    location.href = queue[0].url;
    return queue.length;
  }

  async function resumeFullAutoOnList() {
    const batch = config.getBatchState();
    if (!batch.active) return false;
    if (!isEvaluationListPage()) return false;
    await sleep(600);
    let queue = batch.queue || [];
    let index = batch.index || 0;
    if (!queue.length) {
      queue = scanUnevaluatedFromList();
      index = 0;
      if (!queue.length) {
        config.clearBatchState();
        updateBatchHud();
        setBatchTip('全自动完成：没有未评估问卷');
        alert('全自动评教完成：当前没有未评估问卷');
        return true;
      }
      config.setBatchState({ active: true, queue, index: 0 });
    }
    const fresh = scanUnevaluatedFromList();
    if (!fresh.length) {
      config.clearBatchState();
      updateBatchHud();
      setBatchTip('全自动完成：全部评教已完成');
      alert('全自动评教完成：全部已评估');
      return true;
    }
    config.setBatchState({ active: true, queue: fresh, index: 0 });
    updateBatchHud();
    const next = fresh[0];
    setBatchTip(`全自动：下一项 ${next.title}`);
    await sleep(Math.max(300, (config.evalConf().batchGapSec || 0) * 1000));
    location.href = next.url;
    return true;
  }

  function installSaveSuccessWatcher() {
    if (window.__urppppSaveWatch) return;
    window.__urppppSaveWatch = true;
    injectPageScript(function () {
      try {
        if (!window.jQuery || window.__urppppAjaxHooked) return;
        window.__urppppAjaxHooked = true;
        var $ = window.jQuery;
        var orig = $.ajax;
        $.ajax = function (opts) {
          var o = opts || {};
          var url = o.url || '';
          if (/doSave/i.test(url)) {
            var userSuccess = o.success;
            o = Object.assign({}, o, {
              success: function (data, status, xhr) {
                try {
                  window.dispatchEvent(new CustomEvent('urpppp-eval-saved', { detail: data || {} }));
                } catch (e) {}
                if (typeof userSuccess === 'function') userSuccess(data, status, xhr);
              }
            });
            return orig.call(this, o);
          }
          return orig.apply(this, arguments);
        };
      } catch (e) {
        console.warn('[URP++ 辅助] ajax hook failed', e);
      }
    });
    window.addEventListener('urpppp-eval-saved', async (ev) => {
      const data = (ev && ev.detail) || {};
      const batch = config.getBatchState();
      if (!batch.active) return;
      const ok = data && (data.result === 'ok' || (typeof data.result === 'string' && data.result.indexOf('/') !== -1));
      if (!ok && data.result && data.result !== 'ok') {
        log('保存返回非 ok', data);
      }
      setBatchTip('保存成功，返回列表继续…');
      config.setBatchState({
        active: true,
        queue: batch.queue,
        index: (batch.index || 0) + 1,
      });
      await sleep(Math.max(500, (config.evalConf().batchGapSec || 0) * 1000));
      location.href = EVALUATION_LIST_PATH;
    });
  }

  return {
    bindEvalSection,
    buildEvalSection,
    ensureWaitTip,
    installSaveSuccessWatcher,
    isEvaluationPage,
    isEvaluationListPage,
    markEvalPageEnter,
    resumeFullAutoOnList,
    runEvaluationAssist,
    startFullAutoEvaluation,
    updateBatchHud,
  };
}
