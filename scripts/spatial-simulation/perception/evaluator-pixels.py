"""Evaluator-only fast pixel silhouette measurement. Never mount in ENTITY."""
import cv2
import numpy as np

def measure(background,actual,amodal):
 full=cv2.bitwise_not(cv2.inRange(cv2.absdiff(amodal,background),(0,0,0),(12,12,12)))
 observed=cv2.bitwise_and(cv2.bitwise_not(cv2.inRange(cv2.absdiff(actual,background),(0,0,0),(12,12,12))),full)
 pixels=int(cv2.countNonZero(observed));total=int(cv2.countNonZero(full))
 def bbox(mask,count):
  if not count:return None
  x,y,w,h=cv2.boundingRect(mask);return [x,y,x+w,y+h]
 box=bbox(observed,pixels);whole=bbox(full,total);height=box[3]-box[1] if box else 0;fraction=pixels/total if total else 0.
 return {'visible_pixels':pixels,'amodal_pixels_in_frame':total,'visible_fraction_in_frame':fraction,'visible_bbox':box,'amodal_bbox':whole,'visible_height_pixels':height,'useful':bool(total>=200 and pixels>=120 and fraction>=.35 and height>=80)}
