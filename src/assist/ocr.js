export function getBase64FromImage(image) {
  if (!image) throw new Error('验证码图片不存在');
  if (image.src && image.src.startsWith('data:image')) return image.src.split(',')[1];
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width || 120;
  canvas.height = image.naturalHeight || image.height || 40;
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png').split(',')[1];
}

export function parseOcrResponse(responseText) {
  let result;
  try {
    result = JSON.parse(responseText || '{}');
  } catch (_) {
    throw new Error('OCR 响应解析失败');
  }
  const code = String(result.code || result.data || result.text || result.result || '').trim();
  if (!code) throw new Error(result.message || result.msg || 'OCR 识别失败');
  if (!/^[A-Za-z0-9]{4,8}$/.test(code)) throw new Error('OCR 返回的验证码格式无效');
  return code;
}

export function recognizeCaptcha(base64, ocrUrl, request) {
  return new Promise((resolve, reject) => {
    const url = String(ocrUrl || '').trim();
    if (!url) {
      reject(new Error('未配置 OCR 服务地址'));
      return;
    }
    if (typeof request !== 'function') {
      reject(new Error('不支持 GM_xmlhttpRequest'));
      return;
    }
    request({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ image: base64 }),
      timeout: 15000,
      onload(response) {
        try {
          resolve(parseOcrResponse(response.responseText));
        } catch (error) {
          reject(error);
        }
      },
      onerror() { reject(new Error('OCR 服务请求失败')); },
      ontimeout() { reject(new Error('OCR 服务超时')); },
    });
  });
}
