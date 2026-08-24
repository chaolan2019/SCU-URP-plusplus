export const ASSIST_NAMESPACE = 'urpppp_assist_v1';

export const LOGIN_KEYS = {
  enabled: `${ASSIST_NAMESPACE}_login_enabled`,
  autoSubmit: `${ASSIST_NAMESPACE}_login_auto_submit`,
  ocrUrl: `${ASSIST_NAMESPACE}_login_ocr_url`,
  zhjwUser: `${ASSIST_NAMESPACE}_login_zhjw_user`,
  zhjwPass: `${ASSIST_NAMESPACE}_login_zhjw_pass`,
  casUser: `${ASSIST_NAMESPACE}_login_cas_user`,
  casPass: `${ASSIST_NAMESPACE}_login_cas_pass`,
  passwordStorage: `${ASSIST_NAMESPACE}_login_password_storage`,
  shareCred: `${ASSIST_NAMESPACE}_login_share_cred`,
  submitDelay: `${ASSIST_NAMESPACE}_login_submit_delay`,
  guardState: `${ASSIST_NAMESPACE}_login_guard_state`,
};

export const EVALUATION_KEYS = {
  enabled: `${ASSIST_NAMESPACE}_eval_enabled`,
  waitSec: `${ASSIST_NAMESPACE}_eval_wait_sec`,
  scoreMin: `${ASSIST_NAMESPACE}_eval_score_min`,
  scoreMax: `${ASSIST_NAMESPACE}_eval_score_max`,
  singleLetters: `${ASSIST_NAMESPACE}_eval_single_letters`,
  singlePerQ: `${ASSIST_NAMESPACE}_eval_single_per_q`,
  multiLetters: `${ASSIST_NAMESPACE}_eval_multi_letters`,
  multiPerQ: `${ASSIST_NAMESPACE}_eval_multi_per_q`,
  multiAvoidNone: `${ASSIST_NAMESPACE}_eval_multi_avoid_none`,
  commentTemplates: `${ASSIST_NAMESPACE}_eval_comment_templates`,
  autoFill: `${ASSIST_NAMESPACE}_eval_auto_fill`,
  autoSave: `${ASSIST_NAMESPACE}_eval_auto_save`,
  saveDelay: `${ASSIST_NAMESPACE}_eval_save_delay`,
  batchActive: `${ASSIST_NAMESPACE}_eval_batch_active`,
  batchQueue: `${ASSIST_NAMESPACE}_eval_batch_queue`,
  batchIndex: `${ASSIST_NAMESPACE}_eval_batch_index`,
  batchGapSec: `${ASSIST_NAMESPACE}_eval_batch_gap_sec`,
};

export const SESSION_KEYS = {
  keepAliveEnabled: `${ASSIST_NAMESPACE}_session_keepalive_enabled`,
  keepAliveInterval: `${ASSIST_NAMESPACE}_session_keepalive_interval`,
  keepAliveUrl: `${ASSIST_NAMESPACE}_session_keepalive_url`,
  autoSend2fa: `${ASSIST_NAMESPACE}_session_autosend_2fa`,
};

// 会话保持默认值：
// - 心跳间隔 8 分钟（教务 session 多在 25~30 分钟空闲后失效，留足余量）
// - 心跳目标：本学期课表页（服务端渲染、GET、会话失效时自动回登录页，可作登录态自检）
export const DEFAULT_KEEPALIVE_URL = '/student/courseSelect/thisSemesterCurriculum/index';
export const DEFAULT_KEEPALIVE_INTERVAL = 8 * 60; // 秒

export const LOGIN_FAILURE_LIMIT = 3;
export const LOGIN_PENDING_TTL = 10 * 60 * 1000;
export const DEFAULT_OCR_EXAMPLE = 'https://ocr.yanjiangrd.site/api/ocr';
export const EVALUATION_LIST_PATH = '/student/teachingEvaluation/newEvaluation/index';
export const DEFAULT_COMMENTS = [
  '老师授课认真负责，讲解清晰，收获很大。',
  '课堂氛围好，内容充实，希望继续保持。',
  '课程安排合理，老师答疑及时，总体满意。',
].join('\n');
