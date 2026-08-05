export function createNoticeTableBeautifier({
  isNativePdfIsolationActive,
  bindNoticeHoverScrub,
  scrubNoticeInlineBg,
  stripMistakenNoticeTable,
  disarmNoticeTableHover,
  pinNoticeRowSurface,
  isBusinessDataTable,
  isNoticeListTable,
  isNoticePageContext,
  isNoticeBulletText,
  documentRef = document,
  windowRef = window,
  logger = console,
}) {
  function beautifyNoticeTables() {
    if (isNativePdfIsolationActive()) return;
    try {
      bindNoticeHoverScrub();
      scrubNoticeInlineBg();
      // 先清理误伤业务表
      documentRef.querySelectorAll('table.urppp-notice-table, table.table').forEach((table) => {
        if (isBusinessDataTable(table) && (table.classList.contains('urppp-notice-table') || table.querySelector('.urppp-notice-row, .urppp-notice-title-cell'))) {
          stripMistakenNoticeTable(table);
        }
      });

      // 候选表：常规容器 + 公告页/结构兜底
      const tableSet = new Set(documentRef.querySelectorAll(
        '.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'
      ));
      if (isNoticePageContext()) {
        documentRef.querySelectorAll('table').forEach((table) => tableSet.add(table));
      } else {
        documentRef.querySelectorAll('table').forEach((table) => {
          if (isNoticeListTable(table)) tableSet.add(table);
        });
      }
      Array.from(tableSet).forEach((table) => {
        if (!table || isBusinessDataTable(table)) return;
        // 跳过真正业务数据表（有 thead 多列表头）；公告「标题+发布时间」放行
        if (table.querySelector('thead th') && table.querySelectorAll('thead th').length >= 3) {
          const thText = (table.querySelector('thead')?.textContent || '');
          if (!isNoticeListTable(table) && /序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(thText) && !/标题|公告|通知/.test(thText)) return;
        }
        const rows = Array.from(table.querySelectorAll('tbody > tr, tr')).filter((row) => row.querySelector('td'));
        if (!rows.length) return;

        // 判定是否公告列表
        // 评估公告链接常是 <a onclick=...> 没有 href，不能只查 a[href]
        let noticeLike = 0;
        rows.slice(0, 12).forEach((row) => {
          const tds = Array.from(row.children).filter((cell) => cell.tagName === 'TD' || cell.tagName === 'TH');
          if (tds.length >= 5) return;
          const text = (row.textContent || '').replace(/\s+/g, ' ').trim();
          const hasLink = !!row.querySelector('a[href], a[onclick], a');
          const hasDate = /\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(text);
          const hasBullet = tds.some((cell) => isNoticeBulletText(cell.textContent));
          if ((hasLink && hasDate) || (hasBullet && hasLink) || (hasBullet && hasDate)) {
            noticeLike += 1;
          }
        });
        const looksDashedNotice =
          table.classList.contains('no-border-top') ||
          /dashed|border-left-style/.test(table.getAttribute('style') || '');
        const inNoticePage = isNoticePageContext();
        if (noticeLike < 1) {
          if (inNoticePage) {
            // 公告页兜底：2~3 列且含 a/日期 的行
            const loose = rows.slice(0, 8).filter((row) => {
              const tds = Array.from(row.children).filter((cell) => cell.tagName === 'TD' || cell.tagName === 'TH');
              if (tds.length < 1 || tds.length > 4) return false;
              const text = (row.textContent || '').replace(/\s+/g, ' ').trim();
              return !!row.querySelector('a') || /\d{4}/.test(text);
            }).length;
            if (loose < 1 && !looksDashedNotice) return;
          } else if (!(looksDashedNotice && /公告|通知/.test(documentRef.title || ''))) {
            return;
          }
        }
        if (isBusinessDataTable(table)) return;
        table.classList.add('urppp-notice-table');
        table.dataset.urpppNoticeScan = '1';
        disarmNoticeTableHover(table);
        table.style.setProperty('border', 'none', 'important');
        table.style.setProperty('border-left', 'none', 'important');
        table.style.setProperty('background', 'transparent', 'important');
        table.style.setProperty('width', '100%', 'important');

        const wrap = table.closest('.urppp-table-wrap');
        if (wrap) {
          wrap.classList.add('urppp-notice-wrap');
          wrap.style.setProperty('border', 'none', 'important');
          wrap.style.setProperty('background', 'transparent', 'important');
          wrap.style.setProperty('box-shadow', 'none', 'important');
          wrap.style.setProperty('overflow', 'visible', 'important');
          wrap.style.setProperty('border-radius', '0', 'important');
        }

        rows.forEach((row) => {
          if (row.dataset.urpppNoticeDone === '1') return;
          const tds = Array.from(row.children).filter((cell) => cell.tagName === 'TD' || cell.tagName === 'TH');
          if (!tds.length) return;

          const clean = (value) => (value || '')
            .replace(/\u00AD/g, '')
            .replace(/\u200B/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          // ---- 形态 A：多列（圆点 / 标题 / 日期）----
          if (tds.length >= 2) {
            let bulletTd = null;
            let titleTd = null;
            let dateTd = null;

            tds.forEach((cell, index) => {
              const text = clean(cell.textContent);
              const hasLink = !!cell.querySelector('a');
              // 序号列 / 圆点列
              if (!bulletTd && isNoticeBulletText(text) && (index === 0 || tds.length >= 2)) {
                bulletTd = cell;
                return;
              }
              // 发布时间：2026-07-10 11:10:21
              if (!dateTd && (
                /\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(text) ||
                /\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(text) ||
                /text-align\s*:\s*right/i.test(cell.getAttribute('style') || '') ||
                (index === tds.length - 1 && text.length <= 28 && /\d{4}/.test(text))
              )) {
                if (/\d{4}/.test(text) && text.length <= 32) {
                  dateTd = cell;
                  return;
                }
              }
              if (!titleTd && (hasLink || text.length > 4)) {
                titleTd = cell;
              }
            });
            if (!titleTd) titleTd = tds.find((cell) => cell !== bulletTd && cell !== dateTd) || tds[0];
            if (!dateTd && tds.length >= 2) {
              const last = tds[tds.length - 1];
              if (last !== titleTd && last !== bulletTd) dateTd = last;
            }

            row.classList.add('urppp-notice-row');
            pinNoticeRowSurface(row);
            // 站点 width="88%" 等属性会在 hover 时把 flex 行挤换行
            row.removeAttribute('width');
            row.style.setProperty('flex-wrap', 'nowrap', 'important');
            tds.forEach((cell) => {
              cell.removeAttribute('width');
              cell.removeAttribute('height');
              cell.removeAttribute('align');
              cell.style.setProperty('border', 'none', 'important');
              cell.style.setProperty('background', 'transparent', 'important');
              cell.style.setProperty('vertical-align', 'middle', 'important');
              cell.style.removeProperty('width');
              cell.style.setProperty('width', 'auto', 'important');
            });

            // 隐藏原始 bullet 列，改用 CSS ::before
            if (bulletTd) {
              bulletTd.classList.add('urppp-notice-bullet-cell');
              bulletTd.style.setProperty('display', 'none', 'important');
              bulletTd.style.setProperty('width', '0', 'important');
              bulletTd.style.setProperty('padding', '0', 'important');
            }
            if (titleTd) {
              titleTd.classList.add('urppp-notice-title-cell');
              titleTd.removeAttribute('width');
              titleTd.style.setProperty('width', 'auto', 'important');
              titleTd.style.setProperty('max-width', '100%', 'important');
              titleTd.style.setProperty('min-width', '0', 'important');
              titleTd.style.setProperty('flex', '1 1 0%', 'important');
              titleTd.style.setProperty('overflow', 'hidden', 'important');
              titleTd.style.setProperty('padding', '0', 'important');
              titleTd.style.setProperty('pointer-events', 'auto', 'important');
              titleTd.style.setProperty('white-space', 'nowrap', 'important');
              // 链接可能不在 titleTd 内（误分类时），整行找
              let link = titleTd.querySelector('a[href], a[onclick], a');
              if (!link) link = row.querySelector('a[href], a[onclick], a');
              if (link) {
                // 若链接不在标题格，挪进标题格，避免点不到
                if (!titleTd.contains(link)) {
                  titleTd.innerHTML = '';
                  titleTd.appendChild(link);
                }
                link.classList.add('urppp-notice-link');
                // 只清文本节点，保留 href/onclick/target
                const href = link.getAttribute('href');
                const onclick = link.getAttribute('onclick');
                const target = link.getAttribute('target');
                const label = clean(link.textContent);
                link.textContent = label;
                if (href != null) link.setAttribute('href', href);
                if (onclick != null) link.setAttribute('onclick', onclick);
                if (target != null) link.setAttribute('target', target);
                link.style.setProperty('color', 'var(--text)', 'important');
                link.style.setProperty('text-decoration', 'none', 'important');
                link.style.setProperty('font-size', '14px', 'important');
                link.style.setProperty('font-weight', '500', 'important');
                link.style.setProperty('line-height', '1.5', 'important');
                link.style.setProperty('pointer-events', 'auto', 'important');
                link.style.setProperty('cursor', 'pointer', 'important');
                link.style.setProperty('position', 'relative', 'important');
                link.style.setProperty('z-index', '2', 'important');
                link.style.setProperty('display', 'block', 'important');
                link.style.setProperty('white-space', 'nowrap', 'important');
                link.style.setProperty('overflow', 'hidden', 'important');
                link.style.setProperty('text-overflow', 'ellipsis', 'important');
                // 整行可点：点卡片任意处触发链接
                if (row.dataset.urpppNoticeClickBound !== '1') {
                  row.dataset.urpppNoticeClickBound = '1';
                  row.style.setProperty('cursor', 'pointer', 'important');
                  row.addEventListener('click', (event) => {
                    if (event.target && event.target.closest && event.target.closest('a,button,input,select,textarea,label')) return;
                    // 优先原生跳转
                    if (link.getAttribute('onclick')) {
                      link.click();
                      return;
                    }
                    const hrefValue = link.getAttribute('href');
                    if (!hrefValue || hrefValue === '#' || hrefValue.indexOf('javascript:') === 0) {
                      link.click();
                      return;
                    }
                    if (link.target === '_blank') windowRef.open(hrefValue, '_blank');
                    else windowRef.location.href = hrefValue;
                  });
                }
              } else {
                // 无 a 时保留原 td 内容与事件，只做文本清理
                const onlyText = clean(titleTd.textContent);
                if (onlyText && !titleTd.querySelector('button, input, select')) {
                  // 若原本只有文字，保留文字；若有复杂结构不动
                  if (!titleTd.querySelector('*') || titleTd.children.length === 0) {
                    titleTd.textContent = onlyText;
                  }
                }
              }
            }
            if (dateTd) {
              dateTd.classList.add('urppp-notice-date-cell');
              dateTd.style.cssText = [
                'display:flex !important',
                'align-items:center !important',
                'justify-content:flex-end !important',
                'flex:0 0 auto !important',
                'width:auto !important',
                'max-width:none !important',
                'white-space:nowrap !important',
                'text-align:right !important',
                'padding:0 !important',
                'margin:0 0 0 auto !important',
                'border:none !important',
                'background:transparent !important',
                'float:none !important',
                'position:static !important',
                'right:auto !important',
                'left:auto !important',
                'top:auto !important'
              ].join(';');
              const dateText = clean(dateTd.textContent);
              dateTd.innerHTML = '';
              const badge = documentRef.createElement('span');
              badge.className = 'urppp-notice-time';
              badge.textContent = dateText;
              dateTd.appendChild(badge);
            }
            // 标题列吃满剩余空间，日期贴卡内右侧
            if (titleTd) {
              titleTd.style.setProperty('flex', '1 1 auto', 'important');
              titleTd.style.setProperty('min-width', '0', 'important');
              titleTd.style.setProperty('margin', '0', 'important');
              titleTd.style.setProperty('float', 'none', 'important');
              titleTd.style.setProperty('position', 'static', 'important');
            }
            row.style.setProperty('display', 'flex', 'important');
            row.style.setProperty('align-items', 'center', 'important');
            row.style.setProperty('justify-content', 'space-between', 'important');
            row.style.setProperty('gap', '16px', 'important');
            row.style.setProperty('max-width', '100%', 'important');
            row.style.setProperty('box-sizing', 'border-box', 'important');
            row.style.setProperty('overflow', 'hidden', 'important');
            row.dataset.urpppNoticeDone = '1';
            return;
          }

          // ---- 形态 B：单 td 内多层 span（旧逻辑）----
          const td = tds[0];
          const parts = Array.from(td.querySelectorAll(':scope > span'));
          if (parts.length < 2) {
            // 单格但有 a + 日期文本
            const link = td.querySelector('a');
            const full = clean(td.textContent);
            const dateMatch = full.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);
            if (link || dateMatch) {
              row.classList.add('urppp-notice-row');
              const card = documentRef.createElement('div');
              card.className = 'urppp-notice-card urppp-notice-card-row';
              const left = documentRef.createElement('div');
              left.className = 'urppp-notice-main';
              if (link) {
                // 移动原节点，保留事件与属性，避免 clone 丢监听
                link.classList.add('urppp-notice-link');
                const href = link.getAttribute('href');
                const onclick = link.getAttribute('onclick');
                const label = clean(link.textContent);
                link.textContent = label;
                if (href != null) link.setAttribute('href', href);
                if (onclick != null) link.setAttribute('onclick', onclick);
                link.style.setProperty('pointer-events', 'auto', 'important');
                link.style.setProperty('cursor', 'pointer', 'important');
                left.appendChild(link);
                if (row.dataset.urpppNoticeClickBound !== '1') {
                  row.dataset.urpppNoticeClickBound = '1';
                  row.style.setProperty('cursor', 'pointer', 'important');
                  row.addEventListener('click', (event) => {
                    if (event.target && event.target.closest && event.target.closest('a,button,input,select')) return;
                    if (link.getAttribute('onclick') || !link.getAttribute('href') || link.getAttribute('href') === '#') {
                      link.click();
                      return;
                    }
                    windowRef.location.href = link.getAttribute('href');
                  });
                }
              } else {
                const title = documentRef.createElement('div');
                title.className = 'urppp-notice-title';
                title.textContent = dateMatch ? full.replace(dateMatch[0], '').trim() : full;
                left.appendChild(title);
              }
              card.appendChild(left);
              if (dateMatch) {
                const meta = documentRef.createElement('div');
                meta.className = 'urppp-notice-meta';
                const timeElement = documentRef.createElement('span');
                timeElement.className = 'urppp-notice-time';
                timeElement.textContent = dateMatch[1];
                meta.appendChild(timeElement);
                card.appendChild(meta);
              }
              td.innerHTML = '';
              td.appendChild(card);
              td.dataset.urpppNoticeDone = '1';
              row.dataset.urpppNoticeDone = '1';
            }
            return;
          }

          // multi-span body notice
          let titleEl = null;
          let timeEl = null;
          const bodyEls = [];
          parts.forEach((part) => {
            const styleText = (part.getAttribute('style') || '') + ' ' + (part.style.cssText || '');
            const text = clean(part.textContent);
            if (!text) return;
            if (/font-size\s*:\s*18/i.test(styleText) || (!titleEl && /font-size\s*:\s*1[6-9]/i.test(styleText))) {
              titleEl = part; return;
            }
            if (/font-size\s*:\s*12/i.test(styleText) || /float\s*:\s*right/i.test(styleText) || /^\d{4}-\d{2}-\d{2}/.test(text)) {
              timeEl = part; return;
            }
            bodyEls.push(part);
          });
          if (!titleEl) titleEl = parts[0];
          if (!timeEl) {
            const last = parts[parts.length - 1];
            if (last !== titleEl) timeEl = last;
          }
          const card = documentRef.createElement('div');
          card.className = 'urppp-notice-card';
          if (titleEl) {
            const heading = documentRef.createElement('div');
            heading.className = 'urppp-notice-title';
            heading.textContent = clean(titleEl.textContent);
            card.appendChild(heading);
          }
          (bodyEls.length ? bodyEls : parts.filter((part) => part !== titleEl && part !== timeEl)).forEach((body) => {
            const paragraph = documentRef.createElement('div');
            paragraph.className = 'urppp-notice-body';
            paragraph.textContent = clean(body.textContent);
            if (paragraph.textContent) card.appendChild(paragraph);
          });
          if (timeEl) {
            const meta = documentRef.createElement('div');
            meta.className = 'urppp-notice-meta';
            const timeElement = documentRef.createElement('span');
            timeElement.className = 'urppp-notice-time';
            timeElement.textContent = clean(timeEl.textContent);
            meta.appendChild(timeElement);
            card.appendChild(meta);
          }
          td.innerHTML = '';
          td.appendChild(card);
          td.dataset.urpppNoticeDone = '1';
          row.dataset.urpppNoticeDone = '1';
          row.classList.add('urppp-notice-row');
        });
      });
    } catch (error) {
      logger.warn('[URP++] notice table beautify failed', error);
    }
  }

  return { beautifyNoticeTables };
}
