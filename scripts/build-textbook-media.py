"""Build demo assets from the supplied scanned textbook and authored study notes.
Requires pymupdf, Pillow, edge-tts and imageio-ffmpeg (installed in task temp deps).
"""
import asyncio, hashlib, json, os, pathlib, re, subprocess, sys
sys.path.insert(0, os.path.join(os.environ.get('TEMP', '/tmp'), 'codex-video-review-deps'))
import pymupdf
import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'frontend/public/reference/textbook'
WORK = ROOT / 'artifacts/textbook/media'
OUT.mkdir(parents=True, exist_ok=True)
WORK.mkdir(parents=True, exist_ok=True)
topics = json.loads((ROOT / 'docs/textbook-demo.json').read_text(encoding='utf-8'))
pdf = pymupdf.open(next(ROOT.glob('*.pdf')))
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
font_dir = pathlib.Path('C:/Windows/Fonts')
def font(size, bold=False):
    return ImageFont.truetype(str(font_dir / ('segoeuib.ttf' if bold else 'segoeui.ttf')), size)

def lines(text, f, width):
    result, line = [], ''
    for word in text.split():
        trial = (line + ' ' + word).strip()
        if f.getlength(trial) > width and line:
            result.append(line); line = word
        else: line = trial
    if line: result.append(line)
    return result

def card(topic, slide, art, destination, index=0):
    im = Image.new('RGB', (1280,720), '#f5f3ec'); d = ImageDraw.Draw(im)
    color = topic['color']
    d.rounded_rectangle((30,30,1250,690), radius=28, fill='white')
    d.rounded_rectangle((55,55,510,665), radius=22, fill=color)
    copy = art.copy(); copy.thumbnail((400,450))
    im.paste(copy, (282-copy.width//2, 105+(450-copy.height)//2))
    d.text((80,590), 'ĐỌC • HIỂU • KẾT NỐI', font=font(22,True), fill='white')
    d.text((550,66), 'NGỮ VĂN 6  /  KẾT NỐI TRI THỨC', font=font(18,True), fill=color)
    y=115
    for line in lines(slide['title'],font(38,True),630):
        d.text((550,y),line,font=font(38,True),fill='#22352f'); y+=52
    y+=25
    for line in lines(slide['body'],font(27),625):
        d.text((550,y),line,font=font(27),fill='#4c5757'); y+=42
    d.line((550,602,1200,602), fill='#dce3df',width=2)
    d.text((550,624), f"{topic['title']}  ·  {index+1:02d} / 06",font=font(18),fill=color)
    im.save(destination,quality=94)

async def main():
    for topic in topics:
        folder=OUT/topic['id']; folder.mkdir(exist_ok=True)
        work=WORK/topic['id']; work.mkdir(exist_ok=True)
        art_spec=topic['art']; p=pdf[art_spec['page']-1]
        x0,y0,x1,y1=art_spec['crop']; rect=p.rect
        pix=p.get_pixmap(matrix=pymupdf.Matrix(3,3),clip=pymupdf.Rect(x0*rect.width,y0*rect.height,x1*rect.width,y1*rect.height))
        art=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
        art.save(folder/'illustration.jpg',quality=94)
        lesson='''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bài giảng</title><link rel="stylesheet" href="../lesson.css"><script defer src="topic.js"></script><script defer src="../lesson.js"></script></head><body>
<header><div><p id="unit"></p><h1 id="title"></h1></div><div><button id="menu-toggle" aria-expanded="false" aria-controls="sidebar">Mục lục</button><button id="fullscreen" aria-label="Toàn màn hình">⛶</button></div></header>
<main><aside id="sidebar"><strong>Nội dung bài học</strong><div id="menu"></div></aside><section class="stage"><progress id="progress" aria-label="Vị trí trong bài học"></progress><article id="content"></article><div class="controls"><button id="previous">← Trước</button><output id="counter" aria-live="polite"></output><button id="next">Tiếp →</button><audio id="audio" controls preload="metadata" aria-label="Nghe lời giảng"></audio></div><p id="status" class="lesson-status" role="status"></p><p id="source" class="source"></p></section></main></body></html>'''
        (folder/'lesson.html').write_text(lesson,encoding='utf-8')
        (folder/'topic.js').write_text('window.LESSON = '+json.dumps(topic,ensure_ascii=False)+';',encoding='utf-8')
        total=0
        for i,slide in enumerate(topic['slides']):
            image=folder/f'slide-{i}.jpg'; card(topic,slide,art,image,i)
            audio=folder/f'audio-{i}.mp3'
            if not audio.exists():
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(slide['narration'],'vi-VN-HoaiMyNeural',rate='-5%').save(str(audio)); break
                    except Exception:
                        if attempt==2: raise
                        await asyncio.sleep(2)
            probe=subprocess.run([ffmpeg,'-i',str(audio)],capture_output=True,text=True,encoding='utf-8',errors='replace').stderr
            match=re.search(r'Duration: (\d+):(\d+):([\d.]+)',probe)
            if not match: raise RuntimeError('Cannot read audio duration')
            duration=int(match[1])*3600+int(match[2])*60+float(match[3])+0.5
            slide['duration']=round(duration,2);total+=duration
            print(topic['id'],i+1,'/ 6 ready',flush=True)
        card(topic,{'title':topic['title'],'body':topic['intro']},art,folder/'poster.jpg')
        (folder/'topic.js').write_text('window.LESSON = '+json.dumps(topic,ensure_ascii=False)+';',encoding='utf-8')
        (folder/'media.json').write_text(json.dumps({'duration':round(total),'voice':'vi-VN-HoaiMyNeural','kind':'Video tóm tắt có lời đọc tổng hợp và chuyển động hình ảnh'}),encoding='utf-8')
        print(topic['id'],'lesson narration duration',round(total),'seconds',flush=True)

asyncio.run(main())
