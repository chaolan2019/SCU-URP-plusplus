// Pure SVG renderer for normalized schedule data and a resolved image theme.

import { escapeHtml } from '../../core/html.js';
import { mixHex } from '../../core/color.js';
import {
  exportCourseColor,
  layoutScheduleDay,
  scheduleExportEvents,
  scheduleImageTextLines,
  wrapScheduleFooter,
} from './image-layout.js';

function scheduleImageCourseStyle(theme, name) {
  const accent = exportCourseColor(name);
  const colors = theme.colors;
  const skin = theme.skin;
  if (skin === 'brutal') {
    return { fill: mixHex(colors.surface, accent, 0.48), stroke: '#000000', text: '#111111', secondary: '#242424', stripe: accent };
  }
  if (skin === 'flat') {
    return { fill: mixHex(colors.surface, accent, theme.dark ? 0.24 : 0.16), stroke: colors.text, text: colors.text, secondary: colors.secondary, stripe: accent };
  }
  if (skin === 'editorial') {
    return { fill: mixHex(colors.surface, accent, theme.dark ? 0.16 : 0.08), stroke: colors.border, text: colors.text, secondary: colors.secondary, stripe: accent };
  }
  return {
    fill: mixHex(colors.surface, accent, theme.dark ? 0.28 : (skin === 'organic' ? 0.2 : 0.14)),
    stroke: mixHex(colors.border, accent, theme.dark ? 0.52 : 0.42),
    text: colors.text,
    secondary: colors.secondary,
    stripe: accent,
  };
}

export function buildScheduleSvg(data, theme, options = {}) {
  if (!theme || !theme.colors || !theme.shape) throw new Error('课表图片主题未解析');
  const colors = theme.colors;
  const shape = theme.shape;
  const timestamp = options.now instanceof Date ? options.now : new Date();
  const width = 1960;
  const frameX = 40;
  const frameY = 136;
  const frameWidth = width - frameX * 2;
  const innerX = frameX + 24;
  const sectionWidth = 64;
  const dayGap = 8;
  const dayStart = innerX + sectionWidth + 12;
  const dayRight = frameX + frameWidth - 24;
  const columnWidth = (dayRight - dayStart - dayGap * 6) / 7;
  const gridTop = frameY + 88;
  const rowHeight = 108;
  const cellHeight = 102;
  const gridBottom = gridTop + rowHeight * 12;
  const frameHeight = gridBottom - frameY + 24;
  const unscheduledNames = data.courses.filter((course) => !course.arrangements.length).map((course) => course.name);
  const unscheduledLines = wrapScheduleFooter(unscheduledNames.join('、'), 92);
  const footerHeight = unscheduledLines.length ? 74 + unscheduledLines.length * 27 : 44;
  const height = frameY + frameHeight + footerHeight;
  const dayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  const headingFont = shape.serif ? 'Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif' : 'Microsoft YaHei,Segoe UI,sans-serif';
  const bodyFont = 'Microsoft YaHei,Segoe UI,sans-serif';
  const frameFilter = ['soft', 'warm', 'neu'].includes(shape.shadow) ? ' filter="url(#schedule-frame-shadow)"' : '';
  const cardFilter = ['soft', 'warm', 'neu'].includes(shape.shadow) ? ' filter="url(#schedule-card-shadow)"' : '';
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<defs>',
    `<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${theme.dark ? 10 : 7}" stdDeviation="${theme.dark ? 16 : 11}" flood-color="${theme.dark ? '#000000' : colors.text}" flood-opacity="${theme.dark ? 0.48 : 0.1}"/></filter>`,
    `<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${theme.dark ? '#000000' : colors.text}" flood-opacity="${theme.dark ? 0.34 : 0.1}"/></filter>`,
    '</defs>',
    `<rect width="100%" height="100%" fill="${colors.bg}"/>`,
    `<rect x="${frameX}" y="32" width="142" height="36" rx="${shape.headerRadius}" fill="${colors.primary}"/>`,
    `<text x="${frameX + 71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${bodyFont}">SCU URP++</text>`,
    `<text x="${frameX}" y="106" fill="${colors.text}" font-size="36" font-weight="700" font-family="${headingFont}">${escapeHtml(data.semester.label)}课表</text>`,
    `<text x="${width - frameX}" y="54" text-anchor="end" fill="${colors.secondary}" font-size="16" font-family="${bodyFont}">${escapeHtml(theme.label)}</text>`,
    `<text x="${width - frameX}" y="83" text-anchor="end" fill="${colors.muted}" font-size="14" font-family="${bodyFont}">${escapeHtml(timestamp.toLocaleString('zh-CN', { hour12: false }))}</text>`,
  ];
  if (shape.shadow === 'hard') parts.push(`<rect x="${frameX + 8}" y="${frameY + 8}" width="${frameWidth}" height="${frameHeight}" fill="#000000"/>`);
  parts.push(`<rect x="${frameX}" y="${frameY}" width="${frameWidth}" height="${frameHeight}" rx="${shape.frameRadius}" fill="${colors.surface}" stroke="${shape.shadow === 'hard' ? '#000000' : colors.border}" stroke-width="${shape.frameStroke}"${frameFilter}/>`);

  dayNames.forEach((name, index) => {
    const x = dayStart + index * (columnWidth + dayGap);
    parts.push(
      `<rect x="${x}" y="${frameY + 22}" width="${columnWidth}" height="48" rx="${shape.headerRadius}" fill="${colors.input}" stroke="${colors.border}" stroke-width="${shape.frameStroke ? 1 : 0}"/>`,
      `<text x="${x + columnWidth / 2}" y="${frameY + 53}" text-anchor="middle" fill="${colors.secondary}" font-size="17" font-weight="600" font-family="${bodyFont}">${name}</text>`,
    );
  });
  for (let section = 1; section <= 12; section += 1) {
    const y = gridTop + (section - 1) * rowHeight;
    parts.push(
      `<rect x="${innerX}" y="${y}" width="${sectionWidth}" height="${cellHeight}" rx="${shape.gridRadius}" fill="${colors.input}" stroke="${colors.border}" stroke-width="${shape.frameStroke ? 1 : 0}"/>`,
      `<text x="${innerX + sectionWidth / 2}" y="${y + cellHeight / 2 + 6}" text-anchor="middle" fill="${colors.muted}" font-size="16" font-weight="600" font-family="${bodyFont}">${section}</text>`,
    );
    dayNames.forEach((_, dayIndex) => {
      const x = dayStart + dayIndex * (columnWidth + dayGap);
      parts.push(`<rect x="${x}" y="${y}" width="${columnWidth}" height="${cellHeight}" rx="${shape.gridRadius}" fill="${colors.input}" stroke="${colors.border}" stroke-width="${shape.frameStroke ? 1 : 0}"/>`);
    });
  }
  [4, 9].forEach((section) => {
    const y = gridTop + section * rowHeight - 3;
    parts.push(`<line x1="${dayStart}" y1="${y}" x2="${dayRight}" y2="${y}" stroke="${colors.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`);
  });

  for (let day = 1; day <= 7; day += 1) {
    const dayEvents = layoutScheduleDay(scheduleExportEvents(data).filter((item) => item.day === day));
    dayEvents.forEach((item, index) => {
      const laneWidth = columnWidth / item.laneCount;
      const x = dayStart + (day - 1) * (columnWidth + dayGap) + item.lane * laneWidth;
      const y = gridTop + (item.startSection - 1) * rowHeight;
      const cardWidth = laneWidth;
      const cardHeight = Math.max(cellHeight, (item.endSection - item.startSection) * rowHeight + cellHeight);
      const card = scheduleImageCourseStyle(theme, item.course.name);
      const clipId = 'course-clip-' + day + '-' + index;
      const maxLines = Math.max(1, Math.floor((cardHeight - 18) / 23));
      const lines = scheduleImageTextLines({
        name: item.course.name,
        teacher: item.course.teacher,
        weekDescription: item.arrangement.weekDescription,
        startSection: item.startSection,
        endSection: item.endSection,
        campus: item.arrangement.campus,
        building: item.arrangement.building,
        classroom: item.arrangement.classroom,
      }, Math.floor((cardWidth - 22) / 16), maxLines);
      parts.push(
        `<clipPath id="${clipId}"><rect x="${x + 11}" y="${y + 8}" width="${Math.max(10, cardWidth - 22)}" height="${Math.max(18, cardHeight - 16)}" rx="${Math.max(0, shape.cardRadius - 5)}"/></clipPath>`,
        `<rect data-course-card="1" data-day="${day}" data-start="${item.startSection}" data-end="${item.endSection}" x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="${shape.cardRadius}" fill="${card.fill}" stroke="${card.stroke}" stroke-width="${shape.cardStroke}"${cardFilter}/>`,
      );
      if (theme.skin === 'brutal') parts.push(`<path d="M ${x + cardWidth - 4} ${y + 4} V ${y + cardHeight - 4} H ${x + 4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`);
      if (theme.skin === 'editorial') parts.push(`<rect x="${x}" y="${y}" width="6" height="${cardHeight}" fill="${card.stripe}"/>`);
      if (theme.skin === 'neu') parts.push(`<path d="M ${x + shape.cardRadius} ${y + 1} H ${x + cardWidth - shape.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`);
      parts.push('<g clip-path="url(#' + clipId + ')">');
      lines.forEach((line, lineIndex) => {
        const strong = line.kind === 'title';
        parts.push(`<text data-kind="${line.kind}" x="${x + 14}" y="${y + 28 + lineIndex * 23}" fill="${strong ? card.text : card.secondary}" font-size="${strong ? 16 : 13}" font-weight="${strong ? 700 : 500}" font-family="${strong && shape.serif ? headingFont : bodyFont}">${escapeHtml(line.text)}</text>`);
      });
      parts.push('</g>');
    });
  }

  const footerY = frameY + frameHeight + 30;
  if (unscheduledLines.length) {
    parts.push(`<text x="${frameX}" y="${footerY}" fill="${colors.secondary}" font-size="15" font-weight="700" font-family="${bodyFont}">未排定时间的课程</text>`);
    unscheduledLines.forEach((line, index) => parts.push(`<text x="${frameX}" y="${footerY + 29 + index * 27}" fill="${colors.muted}" font-size="14" font-family="${bodyFont}">${escapeHtml(line)}</text>`));
  } else {
    parts.push(`<text x="${frameX}" y="${footerY}" fill="${colors.muted}" font-size="14" font-family="${bodyFont}">由 SCU URP++ 基于结构化课表数据生成</text>`);
  }
  parts.push('</svg>');
  return { svg: parts.join(''), width, height, background: colors.bg, theme };
}
