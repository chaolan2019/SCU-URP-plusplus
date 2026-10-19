import test from 'node:test';
import assert from 'node:assert/strict';
import { parseApplicationJson } from '../src/features/clean-mode/applications.js';

// 字段与取值照抄 2026-2027 秋线上响应（todate=2026-10-19 23:55:40）
function payload(overrides = {}) {
  return {
    status: 200,
    msg: 'OK',
    data: Object.assign({
      todate: '20261019235540',
      zzykgcount: 1,
      xjydcount: 0,
      dlflkgcount: 0,
      dlflcount: 0,
      zyffxkgcount: 0,
      jxjcount: 0,
      xsdkffcount: 1,
      list: [
        { id: '11003', ywsm: '补办火车票优惠卡', url: '/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11003', qyf: '1', kg: '1', kssj: '20240408102100', jssj: '20340412102100' },
        { id: '11002', ywsm: '补办学生证', url: '/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11002', qyf: '1', kg: '1', kssj: '20240306163000', jssj: '20340307163000' },
        { id: '10008', ywsm: '辅修方案注册申请', url: '/student/rollManagement/minorProgramRegistration/index', qyf: '1', kg: '1', kssj: '20240101000000', jssj: '20240131000000' },
        { id: '10053', ywsm: '复学选课申请', url: '/student/application/chooseCourseAfterResumeSchooling/index', qyf: '1', kg: '1', kssj: '20250101000000', jssj: '20250301000000' },
        { id: '10006', ywsm: '辅修方案注销', url: null, qyf: '1', kg: '1', kssj: '20240101000000', jssj: '20340101000000' },
        { id: '10018', ywsm: '免修申请', url: '/student/personalManagement/individualApplication/exemptionApplication/index', qyf: '1', kg: '0', kssj: '20240101000000', jssj: '20340101000000' },
        { id: '10020', ywsm: '已停用业务', url: '/student/stopped/index', qyf: '0', kg: '1', kssj: '20240101000000', jssj: '20340101000000' },
      ],
    }, overrides),
  };
}

test('只取申请中：已关闭、kg=0、qyf=0 都不进来', () => {
  const titles = parseApplicationJson(payload()).map((item) => item.title);
  assert.deepEqual(titles, ['转专业申请', '补办火车票优惠卡', '补办学生证', '创新/创业']);
  assert.ok(!titles.includes('复学选课申请'));
  assert.ok(!titles.includes('免修申请'));
  assert.ok(!titles.includes('已停用业务'));
});

test('特殊入口由计数字段决定，为 0 时不出现在服务板块', () => {
  const titles = parseApplicationJson(payload({
    zzykgcount: 0, xsdkffcount: 0, jxjcount: 1, dlflkgcount: 1, dlflcount: 1,
  })).map((item) => item.title);
  assert.ok(!titles.includes('转专业申请'));
  assert.ok(!titles.includes('创新/创业'));
  assert.ok(titles.includes('奖学金申请'));
  assert.ok(titles.includes('大类分流'));
});

test('10008 单独成条：开放时显示「辅修方案注册/注销」', () => {
  const data = payload();
  data.data.list = data.data.list.map((item) => (item.id === '10008'
    ? Object.assign({}, item, { kssj: '20240101000000', jssj: '20340101000000' })
    : item));
  const titles = parseApplicationJson(data).map((item) => item.title);
  assert.ok(titles.includes('辅修方案注册/注销'));
  assert.ok(!titles.includes('辅修方案注册申请'));
});

test('没有 todate 时不出清单（不猜开放状态）', () => {
  assert.deepEqual(parseApplicationJson(payload({ todate: '' })), []);
  assert.deepEqual(parseApplicationJson(payload({ todate: undefined })), []);
});

test('响应不是 JSON 或结构不对时返回空数组', () => {
  assert.deepEqual(parseApplicationJson('<html>请先登录</html>'), []);
  assert.deepEqual(parseApplicationJson('{"status":200,"data":null}'), []);
  assert.deepEqual(parseApplicationJson(''), []);
});

test('字符串响应与对象响应结果一致（插件拿到的是文本）', () => {
  const data = payload();
  assert.deepEqual(parseApplicationJson(JSON.stringify(data)), parseApplicationJson(data));
});
