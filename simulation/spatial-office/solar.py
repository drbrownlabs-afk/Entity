"""Astral-backed configurable sun; explicit design-reference fallback when location is unknown."""
import sys,math
from pathlib import Path
from datetime import datetime,date,timedelta
from zoneinfo import ZoneInfo
sys.path.insert(0,str(Path(__file__).resolve().parent/'.runtime/python'))
from astral import Observer
from astral.sun import elevation,azimuth

def angles(hour,cfg):
 h=float(hour)%24;s=cfg['solar']
 if (s['latitude'] is None)!=(s['longitude'] is None):raise ValueError('Supply both observer coordinates')
 if s['latitude'] is not None and s['longitude'] is not None:
  if isinstance(s['latitude'],bool) or isinstance(s['longitude'],bool) or not -90<=float(s['latitude'])<=90 or not -180<=float(s['longitude'])<=180:raise ValueError('Invalid observer coordinates')
  observer=Observer(float(s['latitude']),float(s['longitude']))
  d=date.fromisoformat(s['date']);dt=datetime(d.year,d.month,d.day,tzinfo=ZoneInfo(s['timezone']))+timedelta(hours=h)
  return elevation(observer,dt),azimuth(observer,dt)+s['north_rotation_degrees'],'Astral observer supplied'
 keys=cfg['artistic_sun']
 for a,b in zip(keys,keys[1:]):
  if a[0]<=h<=b[0]:
   t=(h-a[0])/(b[0]-a[0]);return a[1]+t*(b[1]-a[1]),a[2]+t*(b[2]-a[2])+s['north_rotation_degrees'],'artistic reference; no location asserted'
 raise ValueError('Incomplete trajectory')
