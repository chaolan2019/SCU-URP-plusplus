import test from 'node:test';
import assert from 'node:assert/strict';
import { parseApplicationList } from '../src/features/clean-mode/applications.js';

// 夹具照抄 2026-2027 秋线上页面的真实结构：#apply_body = 申请中，#close_body = 已关闭
const PAGE = `
<div class="tab-content" id="tab_content">
  <div id="apply_body" class="tab-pane fade active in">
    <a href="/student/ordertransfer/specialty/application/index" class="btn btn-app btn-info" style="font-size: 14px;">转专业申请</a>
    <a title="补办火车票优惠卡" href="/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11003" class="btn btn-app btn-info ">补办火车<br>票优惠卡</a>
    <a title="补办学生证" href="/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11002" class="btn btn-app btn-info ">补办学生证</a>
    <a title="替代课申请" href="/student/personalManagement/personalApplication/curriculumReplacement/index">替代课申请</a>
    <a href="javascript:void(0);">不该出现</a>
    <a href="#">也不该出现</a>
    <a href="/dup">替代课申请</a>
  </div>
  <div id="close_body" class="tab-pane fade">
    <a title="免修申请" href="/student/personalManagement/individualApplication/exemptionApplication/index">免修申请</a>
    <a title="奖学金申请" href="/student/personalManagement/individualApplication/scholarshipApplication/index">奖学金申请</a>
  </div>
</div>`;

test('parseApplicationList：只取申请中，已关闭的不进来', () => {
  const list = parseApplicationList(PAGE);
  const titles = list.map((item) => item.title);
  assert.deepEqual(titles, ['转专业申请', '补办火车票优惠卡', '补办学生证', '替代课申请']);
  assert.ok(!titles.includes('免修申请'), '已关闭的业务不得进入服务板块');
  assert.ok(!titles.includes('奖学金申请'));
});

test('parseApplicationList：title 属性优先，<br> 不留下空格', () => {
  const list = parseApplicationList(PAGE);
  const card = list.find((item) => item.title === '补办学生证');
  assert.equal(card.href, '/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11002');
  // <br> 版本的文案靠 title 拿到，不会变成「补办火车 票优惠卡」
  assert.ok(list.some((item) => item.title === '补办火车票优惠卡'));
  assert.ok(!list.some((item) => /票 优惠卡/.test(item.title)));
});

test('parseApplicationList：跳过 javascript: 与 # 链接', () => {
  const list = parseApplicationList(PAGE);
  assert.ok(list.every((item) => !/^javascript:/i.test(item.href)));
  assert.ok(list.every((item) => item.href !== '#'));
});

test('parseApplicationList：页面没有 apply_body 时返回空数组', () => {
  assert.deepEqual(parseApplicationList('<html><body>请先登录</body></html>'), []);
  assert.deepEqual(parseApplicationList(''), []);
});

test('parseApplicationList：已关闭栏在申请中栏之前时不会串味', () => {
  const swapped = `
    <div id="close_body"><a href="/closed">已关闭业务</a></div>
    <div id="apply_body"><a href="/open">申请中业务</a></div>`;
  const list = parseApplicationList(swapped);
  assert.deepEqual(list.map((item) => item.title), ['申请中业务']);
});
