/**
 * @file api.actions：给插件用的动作接口（会产生副作用，与只读的 api.data 分开）。
 *
 * 为什么单独一层：api.data 的承诺是「只读」。导出课表会写文件、触发下载，
 * 混进只读层会把这个承诺弄脏，后来人也不知道哪个方法不能随便调。
 *
 * 调用方的义务（写在这里，也写进插件侧）：**动手前先取得用户确认**。
 * 这层不替调用方弹确认，因为「怎么问用户」是界面的责任，不该由数据层决定。
 *
 * 仍然只做插件能担保的事：不替用户改教务系统的任何数据。
 */

const FORMAT_ALIASES = {
  ics: 'ics',
  ical: 'ics',
  calendar: 'ics',
  json: 'json',
  png: 'png',
  image: 'png',
  img: 'png',
  picture: 'png',
};

export const EXPORT_FORMATS = [
  { format: 'ics', label: 'ICS 日历文件', hint: '可导入手机/电脑日历' },
  { format: 'json', label: 'JSON 数据', hint: '便于自己处理或喂给别的工具' },
  { format: 'png', label: 'PNG 图片', hint: '课表长图，方便分享' },
];

export function createActionApi(deps) {
  const {
    loadSchedule,
    exportIcs,
    exportJson,
    exportPng,
  } = deps || {};

  const runners = {
    ics: exportIcs,
    json: exportJson,
    png: exportPng,
  };

  return {
    /** 可用的导出格式，插件拿它填工具说明与确认卡 */
    exportFormats() {
      return EXPORT_FORMATS
        .filter((item) => typeof runners[item.format] === 'function')
        .map((item) => Object.assign({}, item));
    },

    /**
     * 导出课表。副作用：生成文件并触发下载。
     * @param {object} options { format: 'ics' | 'json' | 'png' }
     */
    async exportSchedule(options = {}) {
      const wanted = FORMAT_ALIASES[String(options.format || '').toLowerCase()] || '';
      if (!wanted) {
        const names = EXPORT_FORMATS.map((item) => item.format).join(' / ');
        return { ok: false, error: `不支持的格式：${options.format || '（空）'}；可用：${names}` };
      }
      const runner = runners[wanted];
      if (typeof runner !== 'function') {
        return { ok: false, error: `这个版本的主脚本还不能导出 ${wanted}` };
      }
      try {
        if (typeof loadSchedule !== 'function') return { ok: false, error: '拿不到课表数据' };
        const data = await loadSchedule(false);
        if (!data) return { ok: false, error: '读不到课表（可能是登录已过期）' };
        if (data.error) return { ok: false, error: String(data.error).slice(0, 200) };
        await runner(data);
        return { ok: true, format: wanted };
      } catch (error) {
        return { ok: false, error: String((error && error.message) || error).slice(0, 200) };
      }
    },
  };
}
