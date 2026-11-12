"""Review media from camera pixels and model observations only; no evaluator reads."""
import html
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/spatial-simulation/evidence/p2-09/09.18'
colors=['#34d399','#60a5fa','#fbbf24','#f472b6','#a78bfa']
for variant in range(5):
    case='accept18-v'+str(variant)
    source=ROOT/f'simulation/spatial-office/.runtime/cctv-trial-{case}'
    result=json.loads((source/'output/accept18/global-tracks.json').read_text())
    observations=[dict(row,global_id=g['id']) for g in result['groups'] for row in g['observations']]
    sensors=sorted({r['camera_id'] for r in observations})
    identities={g['id']:colors[i%len(colors)] for i,g in enumerate(result['groups'])}
    duration=max(r['media_time_seconds'] for r in observations)
    svg=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="465" viewBox="0 0 1200 465">',
         '<rect width="1200" height="465" fill="#111827"/>','<g fill="#f9fafb" font-family="sans-serif">',
         f'<text x="24" y="30" font-size="20">{case}: {len(identities)} provisional global identity / {len(observations)} original camera observations</text>',
         '<text x="24" y="58" font-size="14">Same color = model association. Gray = no observation. No interpolated trajectory or civil identity.</text>']
    for j,sensor in enumerate(sensors):
        y=100+j*39;svg.append(f'<text x="24" y="{y+5}" font-size="14">{sensor}</text><rect x="120" y="{y-8}" width="1040" height="16" fill="#374151"/>')
        for row in observations:
            if row['camera_id']!=sensor:continue
            x=120+row['media_time_seconds']/duration*1040
            svg.append(f'<rect x="{x:.2f}" y="{y-8}" width="3" height="16" fill="{identities[row["global_id"]]}"/>')
    for t in [0,duration*.25,duration*.5,duration*.75,duration]:
        x=120+t/duration*1040;svg.append(f'<text x="{x-10:.2f}" y="430" font-size="13">{t:.1f}s</text>')
    svg+=['<text x="24" y="457" font-size="12">Synthetic imagery; independent optical feeds; original sensor, timestamp and frame hash retained.</text>','</g></svg>']
    folder=OUT/case;folder.mkdir(parents=True,exist_ok=True)
    (folder/'continuity.svg').write_text('\n'.join(svg)+'\n',encoding='utf-8')
    canvas=Image.new('RGB',(1320,610),'#111827');draw=ImageDraw.Draw(canvas)
    draw.text((12,10),case+' | Different timestamps per sensor; representative median model observation; synthetic pixels only',fill='white')
    for j,sensor in enumerate(sensors):
        rows=sorted([r for r in observations if r['camera_id']==sensor],key=lambda r:r['media_time_seconds']);row=rows[len(rows)//2]
        image=Image.open(source/'frames'/f'{sensor}-{row["frame_index"]:04}.png').convert('RGB');original=image.size
        image.thumbnail((320,240));x=10+(j%4)*330;y=45+(j//4)*278
        canvas.paste(image,(x,y+22));draw.text((x,y),sensor+' | '+f'{row["media_time_seconds"]:.1f}s',fill='white')
        for actual in observations:
            if actual['camera_id']==sensor and actual['frame_index']==row['frame_index']:
                b=actual['bbox'];box=[x+b[0]*image.width/original[0],y+22+b[1]*image.height/original[1],x+b[2]*image.width/original[0],y+22+b[3]*image.height/original[1]]
                draw.rectangle(box,outline=identities[actual['global_id']],width=2)
                draw.text((max(x,box[0]),max(y+22,box[1]-12)),actual['global_id'][-6:],fill='white',stroke_width=1,stroke_fill='black')
    canvas.save(folder/'camera-evidence.jpg',quality=85)
print('Five model-only timelines and camera evidence sheets generated; no GT read')
