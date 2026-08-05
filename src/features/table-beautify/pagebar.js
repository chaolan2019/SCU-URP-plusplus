export function createPagebarBeautifier({
  destroyPagebarChosen,
  documentRef = document,
  logger = console,
}) {
  function beautifyPagebar(root) {
    try {
      const bars = root?.querySelectorAll
        ? root.querySelectorAll('#urppagebar')
        : documentRef.querySelectorAll('#urppagebar');
      bars.forEach((bar) => {
        if (!bar) return;
        bar.classList.add('urppp-pagebar');
        bar.style.setProperty('display', 'block', 'important');
        bar.style.setProperty('width', '100%', 'important');
        bar.style.setProperty('line-height', '1.5', 'important');

        const wrapper = bar.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]') || bar;
        const pageText = Array.from(bar.querySelectorAll('[id^="span_page_txt_"]'))
          .map((element) => String(element.textContent || '').trim())
          .join('');
        const pageSize = bar.querySelector('select[id^="pagination_pageSize_"]');
        const pageSizeValue = pageSize ? String(pageSize.value || '') : '';
        const jumpInput = bar.querySelector('[id^="turnpageto_"]');
        const jumpReadonly = Boolean(jumpInput && (jumpInput.readOnly || jumpInput.hasAttribute('readonly')));
        const jumpMode = pageText.includes('转到') && !jumpReadonly && !pageSizeValue.includes('_');

        if (!jumpMode) {
          bar.classList.add('urppp-pagebar-scroll');
          bar.classList.remove('urppp-pagebar-jump');
          bar.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach((list) => {
            list.style.setProperty('display', 'none', 'important');
          });
          bar.querySelectorAll('select').forEach((select) => {
            destroyPagebarChosen(select);
            select.style.setProperty('width', '128px', 'important');
            select.style.setProperty('min-width', '128px', 'important');
            select.style.setProperty('max-width', '128px', 'important');
          });
          bar.querySelectorAll('.chosen-container').forEach((container) => {
            try { container.style.setProperty('display', 'none', 'important'); } catch (_) { /* ignore */ }
          });
          return;
        }

        bar.classList.add('urppp-pagebar-jump');
        bar.classList.remove('urppp-pagebar-scroll');
        wrapper.style.setProperty('display', 'flex', 'important');
        wrapper.style.setProperty('align-items', 'center', 'important');
        wrapper.style.setProperty('flex-wrap', 'wrap', 'important');
        wrapper.style.setProperty('gap', '8px', 'important');
        wrapper.style.setProperty('position', 'relative', 'important');
        wrapper.style.setProperty('line-height', '1.5', 'important');

        bar.querySelectorAll('ul.pagination').forEach((list) => {
          list.classList.add('urppp-pagination');
          list.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'flex-wrap:wrap !important',
            'gap:4px !important',
            'margin:0 !important',
            'padding:0 !important',
            'list-style:none !important',
            'float:none !important',
            'position:static !important',
          ].join(';');
        });

        bar.querySelectorAll('ul.pagination > li').forEach((item) => {
          const active = item.classList.contains('active');
          const disabled = item.classList.contains('disabled');
          const previous = item.classList.contains('previous') || /previous/i.test(item.getAttribute('name') || '');
          const next = item.classList.contains('next') || /next/i.test(item.getAttribute('name') || '');
          item.classList.add('urppp-page-li');
          if (active) item.classList.add('urppp-page-li-active');
          if (disabled) item.classList.add('urppp-page-li-disabled');
          if (previous) item.classList.add('urppp-page-li-prev');
          if (next) item.classList.add('urppp-page-li-next');
          item.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'justify-content:center !important',
            'float:none !important',
            'position:static !important',
            'margin:0 !important',
            'padding:0 !important',
            'list-style:none !important',
            'border:none !important',
            'background:transparent !important',
            'height:auto !important',
            'min-height:0 !important',
          ].join(';');

          const chip = item.querySelector(':scope > span, :scope > a') || item.firstElementChild;
          if (!chip) return;
          chip.classList.add('urppp-page-chip');
          if (active) chip.classList.add('urppp-page-chip-active');
          if (disabled) chip.classList.add('urppp-page-chip-disabled');
          if (previous || next) chip.classList.add('urppp-page-chip-nav');

          const minimumWidth = previous || next ? '72px' : '40px';
          const background = active ? 'var(--pagination-active-bg, var(--primary))' : 'var(--surface)';
          const border = active ? 'var(--pagination-active-border, var(--primary))' : 'var(--border)';
          const foreground = active
            ? 'var(--pagination-active-foreground, var(--primary-foreground, #fff))'
            : (disabled ? 'var(--text-muted)' : 'var(--text)');
          chip.style.cssText = [
            'display:inline-flex !important',
            'align-items:center !important',
            'justify-content:center !important',
            'box-sizing:border-box !important',
            'float:none !important',
            'position:static !important',
            'width:auto !important',
            `min-width:${minimumWidth} !important`,
            'height:36px !important',
            'min-height:36px !important',
            'max-height:36px !important',
            'padding:0 12px !important',
            'margin:0 !important',
            'line-height:36px !important',
            'font-size:14px !important',
            'font-weight:600 !important',
            'border-radius:8px !important',
            `border:1px solid ${border} !important`,
            `background:${background} !important`,
            `color:${foreground} !important`,
            'box-shadow:none !important',
            'text-decoration:none !important',
            `cursor:${disabled ? 'default' : 'pointer'} !important`,
            'white-space:nowrap !important',
            'overflow:hidden !important',
          ].join(';');
        });

        bar.querySelectorAll('[id^="btn_turnpageto_"]').forEach((button) => {
          button.classList.add('urppp-page-confirm');
          button.style.setProperty('position', 'static', 'important');
          button.style.setProperty('left', 'auto', 'important');
          button.style.setProperty('top', 'auto', 'important');
          button.style.setProperty('float', 'none', 'important');
          button.style.setProperty('height', '32px', 'important');
          button.style.setProperty('min-width', '52px', 'important');
          button.style.setProperty('padding', '0 12px', 'important');
          button.style.setProperty('margin', '0 4px', 'important');
          button.style.setProperty('font-size', '13px', 'important');
          button.style.setProperty('line-height', '1', 'important');
          button.style.setProperty('vertical-align', 'middle', 'important');
        });

        bar.querySelectorAll('[id^="turnpageto_"]').forEach((input) => {
          input.classList.add('urppp-page-goto');
          input.style.setProperty('position', 'static', 'important');
          input.style.setProperty('display', 'inline-block', 'important');
          input.style.setProperty('height', '32px', 'important');
          input.style.setProperty('width', '48px', 'important');
          input.style.setProperty('margin', '0 4px', 'important');
          input.style.setProperty('padding', '4px 8px', 'important');
          input.style.setProperty('font-size', '14px', 'important');
          input.style.setProperty('line-height', '1.2', 'important');
          input.style.setProperty('box-sizing', 'border-box', 'important');
          input.style.setProperty('vertical-align', 'middle', 'important');
          const inputWrapper = input.parentElement;
          if (inputWrapper?.tagName === 'SPAN') {
            inputWrapper.style.setProperty('position', 'static', 'important');
            inputWrapper.style.setProperty('display', 'inline-flex', 'important');
            inputWrapper.style.setProperty('align-items', 'center', 'important');
            inputWrapper.style.setProperty('width', 'auto', 'important');
            inputWrapper.style.setProperty('height', 'auto', 'important');
            inputWrapper.style.setProperty('min-height', '0', 'important');
            inputWrapper.style.setProperty('vertical-align', 'middle', 'important');
          }
        });

        bar.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach((element) => {
          element.style.setProperty('display', 'inline', 'important');
          element.style.setProperty('border', 'none', 'important');
          element.style.setProperty('background', 'transparent', 'important');
          element.style.setProperty('padding', '0', 'important');
          element.style.setProperty('margin', '0', 'important');
          element.style.setProperty('height', 'auto', 'important');
          element.style.setProperty('line-height', '1.5', 'important');
          element.style.setProperty('font-size', '13px', 'important');
          element.style.setProperty('color', 'var(--text-secondary, var(--text-muted))', 'important');
        });
      });
    } catch (error) {
      logger.warn('[URP++] pagebar beautify failed', error);
    }
  }

  return { beautifyPagebar };
}
