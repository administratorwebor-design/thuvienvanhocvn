import asyncio,json,pathlib,sys,os
sys.path.insert(0,os.path.join(os.environ['TEMP'],'codex-video-review-deps'))
import edge_tts
out=pathlib.Path('frontend/public/reference/may-va-song')
async def main():
    for i,text in enumerate(json.loads((out/'narration.json').read_text(encoding='utf8')),1):
        for attempt in range(4):
            try:
                await edge_tts.Communicate(text,'vi-VN-HoaiMyNeural',rate='-5%').save(str(out/f'audio-{i}.mp3'))
                break
            except edge_tts.exceptions.NoAudioReceived:
                if attempt==3: raise
                await asyncio.sleep(2)
        print(f'Audio {i} ready',flush=True)
asyncio.run(main())
