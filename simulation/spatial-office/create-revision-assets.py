"""Original graphic surface textures, not reference-photo edits or synthetic evidence."""
import sys, math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'.runtime/denoise-python'))
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
from common import OUTPUT
folder=OUTPUT/'revision-assets';folder.mkdir(exist_ok=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
im=Image.new('RGB',(1280,720),'#101d29');d=ImageDraw.Draw(im)
d.text((74,52),'ENTITY',font=ImageFont.truetype(font,63),fill='#edf0e8')
d.text((78,145),'SALA DE REUNIONES',font=ImageFont.truetype(font,27),fill='#9bb3b9')
d.rounded_rectangle((72,235,826,625),radius=18,fill='#1c303d')
d.text((113,278),'ESPACIO PARA COLABORAR',font=ImageFont.truetype(font,28),fill='#d1a67b')
for i,(x,y) in enumerate([(175,435),(370,495),(560,406),(710,510)]):
 if i:d.line((px,py,x,y),fill='#607c85',width=5)
 d.ellipse((x-23,y-23,x+23,y+23),fill='#d6b78c' if i%2 else '#86a699');px,py=x,y
d.text((922,275),'12:00',font=ImageFont.truetype(font,60),fill='#edf0e8')
d.text((927,360),'SIMULACIÓN',font=ImageFont.truetype(font,21),fill='#9bb3b9')
d.text((927,400),'Referencia visual',font=ImageFont.truetype(font,16),fill='#9bb3b9')
im.save(folder/'meeting-screen.png')
im=Image.new('RGB',(640,440),'#e6dbca');d=ImageDraw.Draw(im)
d.ellipse((70,35,405,370),fill='#b47c56');d.rectangle((255,170,600,390),fill='#657467')
d.ellipse((160,125,480,440),fill='#d7b68b');d.arc((180,50,540,400),20,300,fill='#3c4c46',width=8)
im.save(folder/'lounge-art.png')
for i,caption in enumerate(['BIENVENIDO','ESPACIO PARA DESCONECTAR','CAFÉ Y CONVERSACIÓN','ENTITY WORKSPACE','WORK LOUNGE'],1):
    im=Image.new('RGB',(960,540),'#162c32');d=ImageDraw.Draw(im)
    d.ellipse((570,-170,1100,390),fill='#254742');d.ellipse((740,180,1200,670),fill='#516e60')
    d.text((55,65),'ENTITY',font=ImageFont.truetype(font,48),fill='#efe9dd')
    d.text((58,250),caption,font=ImageFont.truetype(font,21),fill='#d5b58d')
    d.text((58,300),'Coworking · referencia visual',font=ImageFont.truetype(font,18),fill='#94ada5')
    im.save(folder/f'screen-{i}.png')
# Original authored PBR terrazzo maps at 2K: restrained aggregate, micro-normal and roughness.
rng=np.random.default_rng(746);N=2048
grain=rng.normal(0,1.4,(N,N,1));base=np.clip(np.array([172,166,153])+grain,0,255).astype(np.uint8)
im=Image.fromarray(base);d=ImageDraw.Draw(im)
for i in range(1800):
    x,y=rng.uniform(0,N,2);rad=rng.uniform(2,10);corners=int(rng.integers(4,7));a=rng.uniform(0,6.28)
    pts=[(x+math.cos(a+j*math.tau/corners)*rad*rng.uniform(.65,1.2),y+math.sin(a+j*math.tau/corners)*rad*rng.uniform(.65,1.2)) for j in range(corners)]
    color=[(209,203,187),(133,126,112),(190,182,166),(101,99,88),(225,218,202)][i%5]
    d.polygon(pts,fill=color)
im.save(folder/'terrazzo-basecolor.png')
rough=np.clip(rng.normal(94,6,(N,N)),60,125).astype(np.uint8);Image.fromarray(rough).filter(ImageFilter.GaussianBlur(.5)).save(folder/'terrazzo-roughness.png')
h=rng.normal(0,1,(N,N));dy,dx=np.gradient(h);normal=np.stack((-dx*.012,-dy*.012,np.ones_like(h)),axis=2);normal/=np.linalg.norm(normal,axis=2)[...,None]
Image.fromarray(np.rint((normal*.5+.5)*255).astype(np.uint8)).save(folder/'terrazzo-normal.png')
# A woven, distressed rug, with mapped fibers and actual surface normal detail.
yy,xx=np.mgrid[0:N,0:N]
thread=np.sin(xx*2.6)*np.cos(yy*2.6)
coarse=np.sin(xx/87)*np.cos(yy/59)+np.sin((xx+yy)/31)*.3
pat=((xx//120+yy//120)%2)*.012
wear=np.sin(xx/317+np.cos(yy/211))*np.sin(yy/173)
tone=np.clip(.43+coarse*.09+wear*.14+thread*.024+rng.normal(0,.025,(N,N))+pat,.22,.78)
color=np.stack((tone*1.06,tone,tone*.89),axis=2)
Image.fromarray(np.rint(np.clip(color,0,1)*255).astype(np.uint8)).save(folder/'rug-basecolor.png')
hh=np.sin(xx*2.6)*.06+np.cos(yy*2.6)*.06;dy,dx=np.gradient(hh);norm=np.stack((-dx,-dy,np.ones_like(hh)),axis=2);norm/=np.linalg.norm(norm,axis=2)[...,None]
Image.fromarray(np.rint((norm*.5+.5)*255).astype(np.uint8)).save(folder/'rug-normal.png')
print('ORIGINAL_GRAPHIC_TEXTURES_READY')
# Original neutral desktop graphic; no counterfeit device readings or branding.
Nw,Nh=1024,576;yy,xx=np.mgrid[0:Nh,0:Nw];wave=Nh*.58+np.sin(xx/Nw*math.pi*2)*46
glow=np.exp(-((yy-wave)**2)/(2*20**2))*.55
rgb=np.stack((15+glow*65+yy/Nh*12,25+glow*87+yy/Nh*15,36+glow*110+yy/Nh*18),axis=2)
Image.fromarray(np.clip(rgb,0,255).astype(np.uint8)).save(folder/'workstation-screen.png')
# Chiclet key legends, aligned to the modeled key grid rather than painted on a flat slab.
im=Image.new('RGB',(1024,320),'#d9d7d0');d=ImageDraw.Draw(im)
rows=['ESC 1 2 3 4 5 6 7 8 9 0 - = DEL','TAB Q W E R T Y U I O P [ ] \\','CAP A S D F G H J K L ; QUOTE ENTER','SHIFT Z X C V B N M , . / UP SHIFT','CTRL FN ALT CMD SPACE SPACE SPACE SPACE SPACE CMD LEFT DOWN RIGHT FN']
for row,letters in enumerate(rows):
    for col,key in enumerate(letters.split()[:14]):
        x=((col-6.5)*.025/.38+.5)*1024;y=(1-((row-2)*.019/.12+.5))*320
        if key not in ['SPACE','QUOTE']:
            d.text((x,y),key,font=ImageFont.truetype(font,13 if len(key)>1 else 19),anchor='mm',fill='#575952')
im.save(folder/'keyboard-legends.png')
