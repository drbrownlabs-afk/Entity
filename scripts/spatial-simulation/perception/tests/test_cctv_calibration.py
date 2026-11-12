import importlib.util
import unittest
from pathlib import Path
import numpy as np

spec=importlib.util.spec_from_file_location('cctv_eval',Path(__file__).resolve().parents[1]/'evaluate-cctv-probes.py')
evaluator=importlib.util.module_from_spec(spec);spec.loader.exec_module(evaluator)
class PixelCalibrationTest(unittest.TestCase):
 def setUp(self):
  self.background=np.zeros((160,120,3),dtype=np.uint8)
  self.full=self.background.copy();self.full[20:120,30:50]=200
 def test_no_rendered_actor_is_not_visibility(self):
  report=evaluator.measure(self.background,self.background,self.full)
  self.assertFalse(report['useful']);self.assertEqual(report['visible_pixels'],0)
 def test_real_occlusion_is_measured_against_amodal_reference(self):
  actual=self.full.copy();actual[:,40:]=0
  report=evaluator.measure(self.background,actual,self.full)
  self.assertEqual(report['visible_fraction_in_frame'],.5)
  self.assertEqual(report['visible_height_pixels'],100)
  self.assertTrue(report['useful'])
 def test_severe_occlusion_and_small_image_are_not_useful(self):
  actual=self.full.copy();actual[:,35:]=0
  self.assertFalse(evaluator.measure(self.background,actual,self.full)['useful'])
  actual=self.background.copy();actual[20:70,30:50]=200
  self.assertFalse(evaluator.measure(self.background,actual,actual)['useful'])
 def test_background_changes_outside_reference_do_not_count_as_actor(self):
  actual=self.background.copy();actual[100:150,70:110]=255
  self.assertEqual(evaluator.measure(self.background,actual,self.full)['visible_pixels'],0)
 def test_fast_evaluator_matches_occlusion_and_absence_results(self):
  spec=importlib.util.spec_from_file_location('fast_pixels',Path(__file__).resolve().parents[1]/'evaluator-pixels.py')
  fast=importlib.util.module_from_spec(spec);spec.loader.exec_module(fast)
  occluded=self.full.copy();occluded[:,40:]=0
  noise=self.background.copy();noise[100:150,70:110]=255
  for actual in [self.background,self.full,occluded,noise]:
   self.assertEqual(fast.measure(self.background,actual,self.full),evaluator.measure(self.background,actual,self.full))
if __name__=='__main__':unittest.main()
