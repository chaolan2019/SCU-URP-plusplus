import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

const scorePayload = {
  lnList: [
    {
      cjlx: '2024-2025-1',
      cjList: [
        { courseName: '高等数学', credit: 5, cj: '95', courseAttributeName: '必修', gradePointScore: 4.0, id: { courseNumber: 'C1' } },
        { courseName: '大学英语', credit: 3, cj: '86', courseAttributeName: '必修', gradePointScore: 3.5, id: { courseNumber: 'C2' } },
        { courseName: '大学体育', credit: 2, cj: '优秀', courseAttributeName: '选修', gradePointScore: 4.0, id: { courseNumber: 'C3' } },
        { courseName: '通识任选', credit: 2, cj: '良好', courseAttributeName: '任选', gradePointScore: 3.7, id: { courseNumber: 'C5' } },
      ],
    },
    {
      cjlx: '2024-2025-2',
      cjList: [
        { courseName: '线性代数', credit: 3, cj: '78', courseAttributeName: '必修', gradePointScore: 2.5, id: { courseNumber: 'C4' } },
      ],
    },
  ],
};

async function installScoreApiMock(page) {
  // fixture 的 init script 先定义了 GM_xmlhttpRequest（onerror），
  // loadUrpFixture 返回后再覆盖全局，userscript 每次调用时解析的都是新值
  await page.evaluate(({ payload }) => {
    window.GM_xmlhttpRequest = (options) => {
      const url = String((options && options.url) || '');
      if (typeof options.onload !== 'function') return;
      const isIndex = /scoreQuery\/(allPassingScores|schemeScores)\/index/.test(url);
      if (isIndex) {
        const hint = /allPassingScores/.test(url) ? 'allPassingScores' : 'schemeScores';
        options.onload({
          status: 200,
          responseText: `<html><body><script>var url="/student/integratedQuery/scoreQuery/${hint}/callback";</script></body></html>`,
        });
        return;
      }
      const isPassing = /allPassingScores\/callback/.test(url);
      options.onload({
        status: 200,
        responseText: JSON.stringify(isPassing ? payload : { lnList: [] }),
      });
    };
  }, { payload: scorePayload });
}

test('score query page mounts a collapsed analysis panel', async ({ page }) => {
  await installScoreApiMock(page);
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'grades' });
  const panel = page.locator('#urppp-score-analysis');
  await expect(panel).toHaveCount(1);
  await expect(panel).toHaveAttribute('data-urppp-sa-state', 'collapsed');
  await expect(panel.locator('.urppp-sa-toggle')).toContainText('成绩分析');
  await expect(page.locator('#urppp-score-analysis')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test('expanding renders metrics, trend, bands and detail rows', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'grades' });
  await installScoreApiMock(page);
  const panel = page.locator('#urppp-score-analysis');
  await panel.locator('.urppp-sa-toggle').click();
  await expect(panel).toHaveAttribute('data-urppp-sa-state', 'expanded');
  await expect(panel.locator('.urppp-sa-metric')).toHaveCount(5);
  await expect(panel.locator('.urppp-sa-trend svg')).toHaveCount(1);
  await expect(panel.locator('.urppp-sa-share svg')).toHaveCount(1);
  await expect(panel.locator('.urppp-sa-bands svg rect')).toHaveCount(11);
  await expect(panel.locator('.urppp-sa-legend-item')).toHaveCount(3);
  await expect(panel.locator('.urppp-sa-table tbody tr')).toHaveCount(2);
  await expect(panel.locator('.urppp-sa-table tbody tr').first()).toContainText('24-25-1');
  await expect(panel.locator('.urppp-sa-table tbody tr').last()).toContainText('24-25-2');
  // 布局：构成环图在趋势旁（第一行），绩点分段在明细前（第二行）
  const shareBeforeBands = await panel.locator('.urppp-sa-share').evaluate((el) => {
    const bands = document.querySelector('#urppp-score-analysis .urppp-sa-bands');
    return !!(bands && el.compareDocumentPosition(bands) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(shareBeforeBands).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('collapsing and re-expanding keeps one panel without page errors', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, { fixture: 'grades' });
  await installScoreApiMock(page);
  const toggle = page.locator('#urppp-score-analysis .urppp-sa-toggle');
  await toggle.click();
  await expect(page.locator('#urppp-score-analysis')).toHaveAttribute('data-urppp-sa-state', 'expanded');
  await toggle.click();
  await expect(page.locator('#urppp-score-analysis')).toHaveAttribute('data-urppp-sa-state', 'collapsed');
  await toggle.click();
  await expect(page.locator('#urppp-score-analysis')).toHaveAttribute('data-urppp-sa-state', 'expanded');
  await expect(page.locator('#urppp-score-analysis')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});
