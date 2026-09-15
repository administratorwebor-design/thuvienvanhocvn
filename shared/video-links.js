export function videoLink(value, source) {
  let url;
  try { url = new URL(value.trim()); } catch { throw Error('Hãy nhập đường dẫn video hợp lệ.'); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) throw Error('Đường dẫn video không hợp lệ.');
  const host = url.hostname.toLowerCase();
  if (source === 'youtube') {
    let id;
    if (host === 'youtu.be') id = url.pathname.slice(1);
    else if (['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)\/?$/)?.[1];
    }
    if (!/^[\w-]{11}$/.test(id || '')) throw Error('Link YouTube chưa hợp lệ. Dùng link xem, chia sẻ hoặc Shorts của video.');
    return { url:`https://www.youtube.com/watch?v=${id}`, embed:`https://www.youtube.com/embed/${id}`, id, thumbnail:`https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
  }
  if (source === 'drive') {
    const id = host === 'drive.google.com' ? url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/)?.[1] || (['/open','/uc'].includes(url.pathname) ? url.searchParams.get('id') : null) : null;
    if (!/^[\w-]{10,200}$/.test(id || '')) throw Error('Hãy dùng link chia sẻ một tệp video Google Drive, không phải link thư mục.');
    const key=url.searchParams.get('resourcekey');
    if(key&&!/^[\w-]{1,200}$/.test(key))throw Error('Link Drive có mã truy cập không hợp lệ.');
    const suffix=key?'?resourcekey='+encodeURIComponent(key):'';
    return { url:`https://drive.google.com/file/d/${id}/view${suffix}`, embed:`https://drive.google.com/file/d/${id}/preview${suffix}`, id };
  }
  throw Error('Nguồn video không được hỗ trợ.');
}
