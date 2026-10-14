"""Original deterministic SVGs for Moving Around. Python standard library only."""
from pathlib import Path
from html import escape

OUT=Path(__file__).resolve().parents[1]/'assets/ingles-means-of-transportation-outubro-2026'
OUT.mkdir(parents=True,exist_ok=True)
INK='#24364b'; BLUE='#2870b3'; SKY='#e5f4ff'; WATER='#b3e3f3'; YELLOW='#f5bf46'; RED='#a73538'

def rect(x,y,w,h,fill,rx=8): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>'
def line(x,y,x2,y2,stroke=INK,width=4): return f'<path d="M{x} {y}L{x2} {y2}" fill="none" stroke="{stroke}" stroke-width="{width}"/>'
def circle(x,y,r,fill): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
def path(d,fill,stroke=None): return f'<path d="{d}" fill="{fill}"'+(f' stroke="{stroke}"' if stroke else '')+'/>'
def text(x,y,value,size=18): return f'<text x="{x}" y="{y}" font-family="Arial,sans-serif" font-size="{size}" fill="{INK}" stroke="none">{escape(str(value))}</text>'
def group(x,y,scale,body): return f'<g transform="translate({x} {y}) scale({scale})">{body}</g>'
def person(x,y,adult=False,helmet=False,jacket=False,wheelchair=False):
    size=1.12 if adult else .9
    s=circle(0,0,13,'#efb487')+path('M-13 -3Q0 -24 13 -4L12 -10Q-2 -28 -13 -8Z','#543b30')
    s+=rect(-13,16,26,32,'#774f9c' if adult else '#e4773b')
    s+=line(-13,22,-25,38)+line(13,22,27,30)
    s+=line(-7,48,-12,72)+line(7,48,16,72)
    if helmet:
        s+=path('M-16 -3Q-17 -24 1 -25Q18 -24 18 -3Z',YELLOW,INK)+path('M-13 0L-7 12Q0 19 7 12L13 0','none',INK)
    if jacket:
        s+=path('M-16 14L-3 20L0 17L3 20L16 14L19 47L-19 47Z',YELLOW,INK)+line(-18,30,18,30)+line(-18,40,18,40)+rect(-3,26,6,9,INK,1)
    if wheelchair:
        s+=circle(-5,64,23,'none')+circle(-5,64,4,INK)+line(-5,64,-25,53)+line(-5,64,13,80)+line(-5,64,17,54)+line(-5,64,-25,76)+line(-20,20,-20,51)+line(-20,51,23,51)+line(23,51,30,74)+circle(30,78,7,INK)
    return group(x,y,size,s)

def vehicle(kind):
    wheel=lambda x,y=144: circle(x,y,17,INK)+circle(x,y,7,'#e9eff4')
    if kind=='car':
        # Top view: all four wheels remain separately visible; no cargo compartment.
        return rect(63,42,20,32,INK,5)+rect(63,119,20,32,INK,5)+rect(230,42,20,32,INK,5)+rect(230,119,20,32,INK,5)+rect(82,21,148,156,'#dd704b',28)+rect(99,64,114,68,SKY,8)+rect(109,85,36,29,'#728ba4',4)+rect(166,85,36,29,'#728ba4',4)+line(98,53,215,53)+rect(105,26,22,9,YELLOW,3)+rect(185,26,22,9,YELLOW,3)
    if kind=='bus':
        s=rect(20,49,264,93,BLUE)+rect(240,68,34,74,'#d7ecf9',3)
        for x in [32,73,114,155,196]:
            s+=rect(x,64,31,37,SKY,3)+line(x+6,80,x+6,96)+line(x+6,94,x+23,94)
        return s+line(257,68,257,138)+rect(29,113,32,12,YELLOW,2)+wheel(63)+wheel(224)
    if kind in ('bike','motorbike'):
        s=circle(62,132,34,'none')+circle(62,132,6,INK)+circle(234,132,34,'none')+circle(234,132,6,INK)
        if kind=='bike':
            s+=path('M62 132L107 72L154 132L62 132L155 76L234 132L155 76L107 72','none',INK)+line(108,72,104,59)+line(88,58,119,58)+line(155,76,177,56)+line(177,56,191,60)+circle(154,132,10,'none')+line(154,132,144,145)+line(135,145,153,145)+path('M62 132L154 132','none','#956438')
        else:
            s+=path('M65 121L94 85L163 79L196 103L166 132L101 132Z',RED,INK)+rect(108,96,57,28,'#74869a',3)+path('M106 81Q119 45 169 75L160 90L106 90Z',YELLOW,INK)+line(196,64,234,132)+line(181,58,199,64)+rect(72,74,40,9,INK,3)
        return s
    if kind=='lorry':
        return rect(24,36,158,99,'#8fb965')+path('M186 73L250 73L284 104L284 136L186 136Z',YELLOW,INK)+rect(201,84,39,30,SKY,2)+wheel(57)+wheel(151)+wheel(245)
    if kind=='train':
        s=line(8,166,306,166)+line(8,157,306,157)
        for x in range(20,310,22): s+=line(x,152,x,172,INK,2)
        for x in [18,118,218]:
            s+=rect(x,55,86,84,BLUE)+rect(x+9,70,25,31,SKY,3)+rect(x+43,70,25,31,SKY,3)+wheel(x+22,141)+wheel(x+66,141)
            if x<218: s+=line(x+86,124,x+100,124)
        return s+rect(23,41,34,14,YELLOW,2)
    if kind=='plane':
        return path('M19 94L95 89L127 26L146 23L136 88L229 87L277 51L290 56L266 93Q316 107 274 122L135 118L148 176L132 176L97 118L26 114Z','#f4b846',INK)+rect(205,88,35,12,BLUE,3)+rect(86,110,34,17,'#63788e',4)+rect(165,111,34,17,'#63788e',4)+line(62,88,44,64)
    if kind=='helicopter':
        return line(49,25,249,25,INK,7)+line(156,25,156,51)+path('M93 100L14 75L10 89L99 119Z',YELLOW,INK)+circle(19,80,17,'none')+line(8,67,30,94)+line(6,92,30,67)+path('M96 56Q149 36 220 65Q260 103 219 130L106 130Q69 92 96 56Z',YELLOW,INK)+path('M166 60Q205 58 225 89L169 89Z',SKY,INK)+line(123,132,123,149)+line(200,132,200,149)+line(99,150,225,150)
    if kind=='boat':
        return path('M32 119L288 119L251 165L79 165Z','#e2793c',INK)+rect(91,63,134,57,'#fff5dd',3)+rect(102,73,29,28,SKY,3)+rect(143,73,29,28,SKY,3)+rect(184,73,28,28,SKY,3)+line(162,63,162,28)+path('M25 174Q45 164 65 174T105 174T145 174T185 174T225 174T265 174T305 174','none',BLUE)
    raise ValueError(kind)

def background(water=False):
    return rect(0,0,480,280,SKY,16)+rect(0,185,480,95,WATER if water else '#d7ead3',0)

def sky():
    return rect(0,0,480,280,SKY,16)+circle(51,53,18,'#fff')+circle(70,42,25,'#fff')+circle(91,53,18,'#fff')+circle(371,229,18,'#fff')+circle(391,218,25,'#fff')+circle(411,229,18,'#fff')

def save(name,body,w=480,h=280):
    (OUT/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">{body}</svg>\n',encoding='utf-8')

for kind in ['car','bus','bike','motorbike','plane','helicopter','lorry','train','boat']:
    save(kind,(sky() if kind in ('plane','helicopter') else background(kind=='boat'))+group(67,30,1.08,vehicle(kind)))
for name,kind,label in [('motor-bus','bus','com motor'),('pedal-bike','bike','pedais · sem motor'),('motor-plane','plane','motores em uso')]:
    save(name,(sky() if kind=='plane' else background())+group(60,15,1.1,vehicle(kind))+text(145,260,label,21))
# Visible propulsion and oars touching the water.
boatHull=path('M70 170L409 170L362 216L115 216Z','#d7763c',INK)
save('rowing-boat',background(True)+person(230,91,adult=True,jacket=True)+boatHull+line(218,127,105,235,'#78532c',7)+line(242,127,360,235,'#78532c',7)+path('M90 230L111 251L126 235L105 217Z','#a1784d',INK)+path('M350 217L377 236L363 252L338 233Z','#a1784d',INK)+text(183,265,'sem motor',21))
save('motor-boat',background(True)+person(225,96,adult=True,jacket=True)+boatHull+rect(398,135,39,48,'#64768b',4)+line(421,180,421,223)+line(410,224,432,224)+path('M439 209Q457 218 441 228M447 201Q468 212 451 231','none',BLUE)+text(154,265,'motor em uso',21))

def bikeScene(helmet):
    return background()+rect(0,211,480,47,'#c5cbd1',0)+line(0,213,480,213,BLUE,5)+group(57,88,.83,vehicle('bike'))+person(192,102,helmet=helmet)+person(391,112,adult=True)+line(201,148,178,188)+line(178,188,187,202)
save('bike-no-helmet',bikeScene(False))
save('bike-helmet',bikeScene(True)+line(365,142,205,110))
save('bike-helmet-comparison',bikeScene(True))
save('helmet',background()+person(208,83,helmet=True)+person(338,103,adult=True)+line(306,132,218,100)+text(120,251,'tira ajustada sob o queixo',19))
save('seatbelt',background()+rect(52,46,300,202,'#edf1f6',12)+rect(108,56,120,176,'#758aa5',18)+rect(103,194,137,42,'#24364b',9)+rect(98,125,16,81,YELLOW,5)+rect(219,125,16,81,YELLOW,5)+person(168,91)+path('M198 109L148 169L198 187','none',INK)+line(122,182,212,182,INK,7)+person(357,85,adult=True)+line(332,121,199,164)+text(76,270,'carro parado · assento apropriado',19))
save('lifejacket',background(True)+person(188,85,jacket=True)+person(324,92,adult=True,jacket=True)+text(101,255,'fechos ajustados · adulto presente',18))
save('knee-pads',background()+person(205,71,helmet=True)+rect(185,119,12,17,YELLOW,3)+rect(213,119,12,17,YELLOW,3)+rect(183,134,28,9,BLUE,2)+rect(220,134,28,9,BLUE,2)+circle(189,149,5,INK)+circle(205,149,5,INK)+circle(225,149,5,INK)+circle(242,149,5,INK)+rect(27,207,426,43,'#d5d8dc',0)+text(156,247,'área protegida',18))
def river(jackets=True,moored=False):
    s=background(True)+person(201,107,jacket=jackets)+person(307,97,adult=True,jacket=True)+boatHull
    if moored: s+=rect(0,169,96,66,'#c89c71',0)+line(73,184,121,198,'#7f5940',4)
    return s
save('river-trip',river())
save('boat-no-jacket',river(False,True)+text(121,266,'no cais · antes de sair',20))
save('school-trip',background()+rect(290,16,167,152,'#e6c783',5)+path('M285 19L375 1L462 19Z','#b55847',INK)+text(311,48,'ESCOLA',22)+rect(355,91,35,75,'#667d95',0)+group(13,66,.86,vehicle('bus'))+person(313,170)+person(410,150,adult=True))

def street(onRoad=False,step=None):
    s=rect(0,0,480,280,'#e5f4ff',12)+rect(0,164,480,116,'#748395',0)+rect(0,111,480,53,'#e3ddcc',0)+line(0,164,480,164,INK,5)
    for x in range(310,455,26):s+=rect(x,178,16,89,'#ffffff',0)
    parked=step is not None
    s+=group(13,149,.55,vehicle('car'))+group(202,153,.46,vehicle('car'))
    if not parked:s+=line(66,249,125,249,'#fff',4)+path('M119 242L129 249L119 256','none','#fff')
    px=364 if step=='cross' else (177 if onRoad else 180)
    py=166 if step=='cross' else (182 if onRoad else 69)
    s+=person(px,py)+person(px+66,py-13,adult=True)
    if parked:
        s+=rect(425,17,38,64,INK,4)+signal('green-person' if step in ('cross','check') else 'red-person',430,29,.10)
        if step=='check':s+=line(241,84,275,150)
    return s
save('street-sidewalk',street())
save('street-road',street(True))

def signal(kind,x=140,y=12,scale=1):
    s=rect(6,5,197,236,INK,12)
    if kind=='green-circle':s+=circle(105,120,57,'#73d5a2')
    elif kind=='red-person':
        s+=circle(105,56,22,'#f28384')+rect(87,84,36,65,'#f28384',5)+line(87,94,66,140,'#f28384',14)+line(123,94,144,140,'#f28384',14)+line(94,149,94,206,'#f28384',14)+line(116,149,116,206,'#f28384',14)
    else:
        s+=circle(107,56,22,'#73d5a2')+line(105,90,91,141,'#73d5a2',25)+line(101,91,144,124,'#73d5a2',13)+line(91,112,54,142,'#73d5a2',13)+line(91,142,138,204,'#73d5a2',14)+line(91,142,57,201,'#73d5a2',14)
    return group(x,y,scale,s)
for kind in ['red-person','green-circle','green-person']:save(kind,background()+signal(kind))
for name,step,label in [('cross-step','cross','Cartão A'),('stop-step','stop','Cartão B'),('check-step','check','Cartão C')]:save(name,street(step=step)+text(15,30,label,22))
for name,points in [('left','M366 140H111M186 70L111 140L186 210'),('right','M110 140H366M292 70L366 140L292 210'),('up','M240 235V43M170 113L240 43L310 113')]:save(name,background()+path(points,'none',BLUE))

def trips(kinds,labels,adults=False):
    s=background()+line(28,116,451,116)+line(28,241,451,241)
    for i,(kind,label) in enumerate(zip(kinds,labels)):
        s+=group(28,4+i*125,.58,vehicle(kind))+text(302,81+i*125,label,22)
        if adults:s+=group(0,-7+i*125,.64,person(158,38,adult=True,helmet=True))
    return s
save('trip-adults',trips(['bike','motorbike'],['8 minutos','4 minutos'],True))
save('trip-models',trips(['bus','car'],['3 minutos','6 minutos']))
save('faster-support',trips(['plane','plane'],['5 minutos','2 minutos']))
for kind,count in [('car',2),('train',8),('bus',6),('helicopter',4)]:
    desenho=vehicle(kind)
    if kind=='bus':
        desenho=rect(20,49,264,93,BLUE)+rect(244,68,30,74,'#d7ecf9',3)
        for x in [28,63,98,133,168,203]:desenho+=rect(x,64,28,37,SKY,3)+line(x+5,80,x+5,96)+line(x+5,94,x+21,94)
        desenho+=line(259,68,259,138)+circle(63,144,17,INK)+circle(224,144,17,INK)
    save('model-'+kind,background()+group(52,9,1.05,desenho)+text(159,264,str(count)+' lugares',23))
s=background(True)+rect(0,40,480,98,'#ddd9ce',0)+line(0,87,480,87)+line(0,121,480,121)
for x in range(32,437,78):s+=person(x,34)
s+=text(34,171,'Estrada e trilhos · 6 bonecos',21)+text(36,253,'Depois: água · sem ponte',21)
save('model-trip',s)

def story(n):
    s=background(True)+rect(0,149,480,46,'#c5b79a',0)+line(0,197,480,197,INK,6)
    if n==1:
        s+=person(101,70)+person(229,70,wheelchair=True)+person(370,56,adult=True)+line(81,104,218,106)+line(256,106,344,82)
    if n==2:
        s+=group(175,9,.87,vehicle('bus'))+path('M383 131L328 166L347 175L409 132Z','#7d8d9e',INK)+rect(299,76,42,50,'#edf1f6',0)+circle(321,109,12,'none')+person(67,83)+person(158,92,wheelchair=True)+person(427,112,adult=True)
    if n==3:
        s+=person(86,70)+person(230,70,wheelchair=True)+person(370,56,adult=True)+rect(61,106,50,43,'#945936',5)+group(70,76,.14,vehicle('boat'))+line(102,104,92,94)
    if n==4:
        s+=group(261,141,.42,vehicle('boat'))+group(353,155,.32,vehicle('boat'))+person(64,50)+person(180,50,wheelchair=True)+person(295,37,adult=True)+rect(45,91,40,36,'#945936',4)+group(53,73,.1,vehicle('boat'))+line(0,139,480,139,INK,6)
    return s
for n in range(1,5):save('story-'+str(n),story(n))
save('story-summary',''.join(group((n-1)%2*480,(n-1)//2*280,1,story(n)+text(12,264,'Cena '+str(n),18)) for n in range(1,5)),960,560)

save('spring-trip',bikeScene(True)+rect(19,6,179,62,'#fff5e3',6)+text(34,45,'primavera',23)+path('M413 221V254','none','#246742')+circle(413,220,10,'#cf5179'))
s=background()+group(45,61,1.05,vehicle('bus'))+rect(19,6,160,62,'#fff5e3',6)+text(37,45,'inverno',23)
for x in range(230,459,32):s+=line(x,9,x-7,32,BLUE,2)
save('winter-trip',s)
s=background()+rect(0,211,480,47,'#c5cbd1',0)+line(0,213,480,213,BLUE,5)
s+=group(9,72,.65,vehicle('bike'))+person(100,80,adult=True,helmet=True)+line(103,135,108,158)
s+=group(244,92,.57,vehicle('bike'))+person(324,105,helmet=True)+line(321,148,332,167)
s2=river()+rect(0,120,65,81,'#c49b6e',0)+group(7,35,.28,vehicle('bike'))+group(7,77,.28,vehicle('bike'))+text(8,16,'Bicicletário',16)
save('final-trip',group(0,0,1,s)+group(0,280,1,s2),480,560)
save('map',rect(0,0,480,280,'#f5efdf',12)+rect(32,65,80,154,WATER,0)+rect(358,65,100,154,'#bfdfaf',0)+circle(240,140,20,YELLOW)+text(233,147,'S',20)+text(42,56,'CAIS',18)+text(366,56,'PARQUE',18)+path('M218 140H72M94 121L72 140L94 159','none',BLUE))
# Learning examples use labels; assessed images never expose English targets.
skate=rect(12,153,139,15,'#b78148',7)+circle(34,178,11,INK)+circle(128,178,11,INK)
canoe=path('M172 166L300 166Q275 197 197 188Z','#c47d39',INK)
balloon=path('M369 28Q328 33 329 82Q341 113 364 132L387 132Q414 110 419 80Q418 31 369 28Z',YELLOW,INK)+line(364,131,364,149)+line(387,131,387,149)+rect(360,149,33,27,'#936639',3)
save('env-support',background()+rect(162,153,148,95,WATER,0)+skate+canoe+balloon+text(40,244,'land',21)+text(199,244,'water',21)+text(357,244,'air',21))
save('motor-support',background()+group(10,45,.6,vehicle('train'))+group(282,-20,1,skate)+text(32,244,'trem: com motor',17)+text(264,244,'skate: sem motor',17))
save('tuk-tuk',background()+circle(71,218,22,INK)+circle(159,225,22,INK)+circle(343,212,22,INK)+path('M47 198L76 154L283 154L326 173L366 174L367 209L49 215Z',YELLOW,INK)+rect(99,83,188,16,BLUE,4)+line(112,98,91,156)+line(263,98,279,164)+rect(166,148,42,49,'#758799',3)+text(110,261,'3 rodas · com motor',21))
def animal(x,kind):
    color={'dog':'#b68153','cat':'#c09b65','lion':'#e0b34b','bear':'#956c4b'}[kind]
    s=rect(15,123,71,47,color,15)+circle(49,99,32,color)+line(22,155,22,183)+line(78,155,78,183)
    if kind=='lion':s=circle(49,99,45,'#9e653b')+s
    if kind in ['cat','lion']:s+=path('M22 81L21 50L43 70M54 70L79 51L76 84',color,INK)
    else:s+=circle(22,75,13,color)+circle(76,75,13,color)
    s+=circle(39,99,3,INK)+circle(60,99,3,INK)+path('M43 111L53 111L48 118Z',INK)
    return group(x,6,1,s)
save('animals',background()+''.join(animal(x,k)+text(x+10,243,label,17) for x,k,label in [(10,'dog','cachorro'),(130,'cat','gato'),(250,'lion','leão'),(365,'bear','urso')]))
save('practice',background()+rect(87,60,292,169,'#fff8e6',12)+line(230,76,230,211)+line(108,95,204,95)+line(108,119,204,119)+line(108,143,181,143)+line(251,95,352,95)+line(251,119,352,119)+line(251,143,332,143))
print(f'{len(list(OUT.glob("*.svg")))} SVGs originais em {OUT}')
