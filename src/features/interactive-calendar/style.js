/**
 * @file 互动校历样式：清爽模式简略块 + 详细窗口 + 顶栏按钮 + 皮肤/暗色变体。
 * 由 index.js 拆出（P1-14），经 ensureCalendarStyle 注入。
 */

export const CALENDAR_STYLE_CSS = `
/* 清爽模式个人资料卡：左资料 + 右校历简览并排 */
#urppp-clean-root .uc-profile-card .uc-bd{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
/* 清爽模式个人资料卡右侧简略块 */
.uc-profile{flex:1 1 auto}
#urppp-clean-root .uc-cal-summary{display:flex;align-items:center;gap:14px;flex:0 0 auto;cursor:pointer;
  background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:10px 16px;
  color:var(--text);box-shadow:0 1px 2px rgba(0,0,0,.04);transition:transform .18s,box-shadow .18s,background .18s}
#urppp-clean-root .uc-cal-summary:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.08)}
#urppp-clean-root .uc-cal-summary .cal-s-left{display:flex;align-items:baseline;gap:3px;flex:none}
#urppp-clean-root .uc-cal-summary .cal-s-count{font-size:30px;font-weight:800;line-height:1;color:var(--primary);font-variant-numeric:tabular-nums}
#urppp-clean-root .uc-cal-summary .cal-s-unit{font-size:11px;color:var(--text-secondary);margin-bottom:3px}
#urppp-clean-root .uc-cal-summary .cal-s-right{display:flex;flex-direction:column;justify-content:center;gap:4px;min-width:150px;text-align:left}
#urppp-clean-root .uc-cal-summary .cal-s-wk{font-size:11px;color:var(--text-secondary)}
#urppp-clean-root .uc-cal-summary .cal-s-ev{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600}
#urppp-clean-root .uc-cal-summary .cal-s-ev i{width:8px;height:8px;border-radius:50%;flex:none}
#urppp-clean-root .uc-cal-summary .cal-s-date{font-size:11px;color:var(--text-secondary)}
#urppp-clean-root .uc-cal-summary .cal-s-prog{display:flex;justify-content:space-between;font-size:10px;color:var(--text-secondary);margin-top:1px}
#urppp-clean-root .uc-cal-summary .cal-s-bar{height:4px;background:var(--border);border-radius:4px;overflow:hidden}
#urppp-clean-root .uc-cal-summary .cal-s-bar i{display:block;height:100%;background:var(--primary);border-radius:4px}
/* 移动端紧凑版：单行有层次，不换行 */
#urppp-clean-root .uc-cal-summary-compact{display:flex;align-items:center;gap:10px;width:100%;min-width:0;margin-top:2px;padding:9px 12px;border:1px solid var(--border);border-radius:14px;background:var(--surface);color:var(--text);cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.05)}
#urppp-clean-root .uc-cal-summary-compact:hover{background:color-mix(in srgb,var(--primary) 5%,var(--surface))}
#urppp-clean-root .uc-cal-summary-compact .cal-c-dot{width:9px;height:9px;border-radius:50%;flex:none}
#urppp-clean-root .uc-cal-summary-compact .cal-c-count{display:flex;align-items:baseline;gap:3px;flex:none}
#urppp-clean-root .uc-cal-summary-compact .cal-c-count b{font-size:22px;font-weight:800;line-height:1;color:var(--primary);font-variant-numeric:tabular-nums}
#urppp-clean-root .uc-cal-summary-compact .cal-c-count em{font-style:normal;font-size:10px;color:var(--text-secondary)}
#urppp-clean-root .uc-cal-summary-compact .cal-c-info{flex:1;min-width:0;text-align:left}
#urppp-clean-root .uc-cal-summary-compact .cal-c-name{display:block;font-size:13.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#urppp-clean-root .uc-cal-summary-compact .cal-c-sub{display:block;font-size:10.5px;color:var(--text-secondary);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#urppp-clean-root .uc-cal-summary-compact .cal-c-prog{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
#urppp-clean-root .uc-cal-summary-compact .cal-c-bar{width:52px;height:4px;background:var(--border);border-radius:4px;overflow:hidden}
#urppp-clean-root .uc-cal-summary-compact .cal-c-bar i{display:block;height:100%;background:var(--primary);border-radius:4px}
#urppp-clean-root .uc-cal-summary-compact .cal-c-week{font-size:9.5px;color:var(--text-secondary);white-space:nowrap}
/* 详细窗口浮层 */
#urppp-cal-modal{position:fixed;inset:0;z-index:2147483000;font-family:inherit;color:var(--text,#16181d)}
#urppp-cal-modal .cal-overlay{position:absolute;inset:0;background:rgba(15,20,28,.45);backdrop-filter:blur(2px)}
/* 进入动画：容器淡入+缩放用 animation（总播，不依赖 initial 态渲染），内容逐条浮现 */
#urppp-cal-modal .cal-dialog{opacity:0;transform:translate(-50%,-50%) scale(.95)}
#urppp-cal-modal.open .cal-dialog{opacity:1;transform:translate(-50%,-50%) scale(1);animation:calPopIn .24s cubic-bezier(.16,1,.3,1) forwards}
@keyframes calPopIn{from{opacity:0;transform:translate(-50%,-50%) scale(.95)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
/* 退出动画：与进入对称（反向），用 animation 总播 */
#urppp-cal-modal.closing .cal-dialog{opacity:0;transform:translate(-50%,-50%) scale(.94);animation:calPopOut .18s ease forwards}
@keyframes calPopOut{from{opacity:1;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-50%) scale(.94)}}
#urppp-cal-modal.open .cal-modal-wrap>*{opacity:0;transform:translateY(10px);animation:cal-stagger .26s cubic-bezier(.16,1,.3,1) forwards;will-change:transform,opacity}
#urppp-cal-modal.open .cal-modal-wrap>*:nth-child(1){animation-delay:.05s}
#urppp-cal-modal.open .cal-modal-wrap>*:nth-child(2){animation-delay:.11s}
#urppp-cal-modal.open .cal-modal-wrap>*:nth-child(3){animation-delay:.17s}
@keyframes cal-stagger{to{opacity:1;transform:translateY(0)}}
#urppp-cal-modal .cal-dialog{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:min(880px,calc(100vw - 120px));max-width:calc(100vw - 120px);max-height:min(82vh,860px);
  display:flex;flex-direction:column;overflow:hidden;
  background:var(--surface,#fff);color:var(--text,#16181d);border:1px solid var(--border,#e5e5ea);border-radius:18px;
  box-shadow:0 24px 60px rgba(0,0,0,.28);padding:24px 28px 30px}
#urppp-cal-modal .cal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--border,#e5e5ea);background:transparent;color:var(--text,#16181d);cursor:pointer;font-size:14px;line-height:1;display:grid;place-items:center;flex:none}
#urppp-cal-modal .cal-close:hover{background:color-mix(in srgb,var(--primary,#2563eb) 10%,transparent)}
#urppp-cal-modal .cal-body{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;overflow-x:hidden;max-width:100%;width:100%}
#urppp-cal-modal .cal-modal-wrap{display:flex;flex-direction:column;gap:16px;flex:1;min-height:0;overflow-x:hidden;max-width:100%;width:100%}
#urppp-cal-modal .cal-widget{width:100%}
/* 防弹窗内容边界裁剪：允许收缩 + 长文本断行 */
#urppp-cal-modal .cal-dialog,#urppp-cal-modal .cal-body,#urppp-cal-modal .cal-modal-wrap,#urppp-cal-modal .cal-modal-top,
#urppp-cal-modal .cal-widget,#urppp-cal-modal .cal-timeline,#urppp-cal-modal .cal-ev{box-sizing:border-box}
#urppp-cal-modal .cal-modal-wrap>*,#urppp-cal-modal .cal-widget>*,#urppp-cal-modal .cal-ev>*{min-width:0}
#urppp-cal-modal .cal-ev,#urppp-cal-modal .cal-ev span,#urppp-cal-modal .cal-ev b,#urppp-cal-modal .cal-w-sub,
#urppp-cal-modal .cal-mon-label{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important;}
#urppp-cal-modal .cal-modal-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
#urppp-cal-modal .cal-modal-title{font-size:17px;font-weight:750}
#urppp-cal-modal .cal-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
#urppp-cal-modal .cal-term-pills{display:flex;gap:6px}
#urppp-cal-modal .cal-term{font-size:12px;padding:5px 13px;border-radius:999px;border:1px solid var(--border,#e5e5ea);background:transparent;color:var(--text-secondary,#5b5f69);cursor:pointer;font-weight:600;flex:none}
#urppp-cal-modal .cal-term.ac{background:var(--primary,#2563eb);color:#fff;border-color:transparent}
/* 横置小组件 */
#urppp-cal-modal .cal-widget{display:flex;align-items:center;gap:22px;background:color-mix(in srgb,var(--primary,#2563eb) 5%,#fff);
  border:1px solid var(--border,#e5e5ea);border-radius:16px;padding:18px 22px;flex-wrap:wrap}
/* 非 brutal 主题暗色：校历小部件背景改深色，避免白底+白字(brutal 另有覆盖) */
html.urppp-theme-dark #urppp-cal-modal .cal-widget{background:color-mix(in srgb,var(--primary,#2563eb) 12%,var(--surface,#0a0a0a))!important;}
#urppp-cal-modal .cal-w-left{flex:1;min-width:200px}
#urppp-cal-modal .cal-w-label{font-size:11px;color:var(--text-secondary,#5b5f69);letter-spacing:.03em}
#urppp-cal-modal .cal-w-ev{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;margin-top:3px}
#urppp-cal-modal .cal-w-ev i{width:11px;height:11px;border-radius:50%;flex:none}
#urppp-cal-modal .cal-w-sub{margin-top:4px;font-size:12px;color:var(--text-secondary,#5b5f69)}
#urppp-cal-modal .cal-w-mid{display:flex;align-items:baseline;gap:4px;flex:none}
#urppp-cal-modal .cal-w-num{font-size:46px;font-weight:820;line-height:.9;color:var(--primary,#2563eb);font-variant-numeric:tabular-nums}
#urppp-cal-modal .cal-w-unit{font-size:14px;color:var(--text-secondary,#5b5f69);font-weight:600}
#urppp-cal-modal .cal-w-right{flex:1;min-width:180px;display:flex;flex-direction:column;gap:6px}
#urppp-cal-modal .cal-w-wk{font-size:12px;color:var(--text-secondary,#5b5f69)}
#urppp-cal-modal .cal-w-prog-lbl{display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary,#5b5f69)}
#urppp-cal-modal .cal-w-prog-bar{height:7px;border-radius:7px;background:var(--border,#e5e5ea);overflow:hidden}
#urppp-cal-modal .cal-w-prog-bar i{display:block;height:100%;background:var(--primary,#2563eb);border-radius:7px}
/* 时间线：按月分组（独立滚动区，顶栏/下一个事件固定不滚） */
#urppp-cal-modal .cal-timeline{display:flex;flex-direction:column;gap:6px;margin-top:2px;padding:0 8px;overflow:auto;overflow-x:hidden;flex:1;min-height:0;overscroll-behavior:contain;scrollbar-gutter:stable;scrollbar-width:thin}
#urppp-cal-modal .cal-timeline::-webkit-scrollbar{width:8px}
#urppp-cal-modal .cal-timeline::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--text-secondary,#5b5f69) 45%,transparent);border-radius:8px}
#urppp-cal-modal .cal-mon{border-top:1px solid var(--border,#e5e5ea)}
#urppp-cal-modal .cal-mon:first-child{border-top:0}
#urppp-cal-modal .cal-mon-label{font-size:11px;font-weight:700;color:var(--text-secondary,#5b5f69);padding:12px 0 6px;letter-spacing:.05em}
#urppp-cal-modal .cal-mon-items{display:flex;flex-direction:column}
#urppp-cal-modal .cal-ev{display:flex;align-items:center;gap:12px;padding:9px 10px;border-radius:10px;transition:background .15s;width:100%;min-width:0;box-sizing:border-box}
#urppp-cal-modal .cal-ev:hover{background:color-mix(in srgb,var(--primary,#2563eb) 5%,transparent)}
#urppp-cal-modal .cal-ev.cal-today{outline:2px solid color-mix(in srgb,var(--primary,#2563eb) 40%,transparent)}
#urppp-cal-modal .cal-ev-dot{width:8px;height:8px;border-radius:50%;flex:none}
#urppp-cal-modal .cal-ev-date{min-width:82px;font-size:13px;font-weight:650;font-variant-numeric:tabular-nums}
#urppp-cal-modal .cal-ev-date em{display:block;font-style:normal;font-size:10px;color:var(--text-secondary,#5b5f69);font-weight:400}
#urppp-cal-modal .cal-ev-name{flex:1;min-width:0;font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#urppp-cal-modal .cal-ev-tag{font-size:10.5px;font-weight:600;padding:1px 8px;border-radius:999px;flex:none}
#urppp-cal-modal .cal-ev-wk{font-size:11px;color:var(--text-secondary,#5b5f69);flex:none;min-width:56px;text-align:right}
/* 移动端：时间+事件属性+周进度一行，事件名称换行整行 */
@media (max-width:700px){
  #urppp-cal-modal .cal-ev{flex-wrap:wrap;row-gap:3px}
  #urppp-cal-modal .cal-ev-date{min-width:0;text-align:left}
  #urppp-cal-modal .cal-ev-name{flex-basis:100%;order:5;margin-left:20px}
  #urppp-cal-modal .cal-ev-wk{min-width:0;text-align:right;margin-left:auto}
}

/* 皮肤适配：随各主题保持一致性（圆角/边框/材质由 Skin token 控制） */
/* 当前事件选中框(cal-today)跟各主题直角/圆角：editorial/flat/brutal 直角 */
html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-ev,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-ev,
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-ev{border-radius:0!important}
/* 编辑杂志：当前事件选中框矩形+黑描边，贴近 editorial 极简 */
html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-ev.cal-today{outline:2px solid var(--text)!important;outline-offset:-2px!important;border-radius:0!important}
/* 编辑杂志：学期切换选中按钮倒置(--text底+--surface字), 避免--primary浅色白底白字 */
html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-term.ac{background:var(--text)!important;color:var(--surface)!important;border-color:var(--text)!important}
html[data-urppp-skin="flat"] #urppp-clean-root .uc-cal-summary,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-dialog,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-widget,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-ev,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-term,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-close{border-radius:0!important;box-shadow:none!important}
html[data-urppp-skin="flat"] #urppp-clean-root .uc-cal-summary,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-dialog,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-term,
html[data-urppp-skin="flat"] #urppp-cal-modal .cal-close{border:2px solid var(--text,#16181d)!important}
html[data-urppp-skin="brutal"] #urppp-clean-root .uc-cal-summary,
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-dialog{border-radius:0!important;border:3px solid var(--text,#16181d)!important;box-shadow:6px 6px 0 var(--text,#16181d)!important}
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-widget,
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-ev,
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-term,
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-close{border-radius:0!important}
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-term,
html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-close{border:3px solid #000!important;box-shadow:4px 4px 0 #000!important}
html[data-urppp-skin="editorial"] #urppp-clean-root .uc-cal-summary,
html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-dialog{border-radius:0!important;box-shadow:none!important;border:1px solid var(--border,#e5e5ea)!important}
html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-widget{border-radius:0!important;box-shadow:none!important;border-color:var(--border,#e5e5ea)!important;background:var(--surface,#fff)!important}
html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-term,
html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-close{border-radius:0!important;box-shadow:none!important;border:0!important;text-decoration-line:underline!important;text-decoration-color:transparent!important}
html[data-urppp-skin="neu"] #urppp-clean-root .uc-cal-summary,
html[data-urppp-skin="neu"] #urppp-cal-modal .cal-dialog{box-shadow:4px 4px 10px rgba(0,0,0,.08),-4px -4px 12px #fff!important}
html[data-urppp-skin="neu"] #urppp-cal-modal .cal-term,
html[data-urppp-skin="neu"] #urppp-cal-modal .cal-close{box-shadow:2px 2px 6px rgba(0,0,0,.08),-2px -2px 6px #fff!important}
html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-clean-root .uc-cal-summary,
html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-clean-root .uc-cal-summary-compact,
html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-cal-modal .cal-dialog,
html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-cal-modal .cal-term,
html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-cal-modal .cal-close{box-shadow:4px 4px 10px var(--neu-shadow-dark),-4px -4px 12px var(--neu-shadow-light)!important}
@media (max-width:560px){
  #urppp-cal-modal .cal-widget{gap:12px}
  #urppp-cal-modal .cal-dialog{padding:16px;width:calc(100vw - 48px)!important;max-width:calc(100vw - 48px)!important;border-radius:14px}
    }
`;
