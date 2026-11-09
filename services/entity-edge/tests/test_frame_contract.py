"""Frame transport forbids simulator annotations and path traversal; not detector accuracy tests."""
import unittest,json,copy
from pathlib import Path
import jsonschema
ROOT=Path(__file__).resolve().parents[3]
class FrameContractTests(unittest.TestCase):
 def setUp(self):
  self.schema=json.loads((ROOT/'packages/contracts/perception/v1/FrameManifest.json').read_text());self.valid={'schema_version':'1.0','simulation_only':True,'capture_fps':2,'clock_source':'unit test metadata only','frames':[{'camera_id':'CAMERA-PLANNED-01','frame_index':0,'observed_at':'2026-11-09T12:00:00Z','media_time_seconds':0,'file':'camera-0000.png','sha256':'a'*64,'capture_duration_ms':30}]}
 def test_legitimate_frame_metadata(self):jsonschema.validate(self.valid,self.schema)
 def test_no_actor_truth_or_precomputed_detection_fields(self):
  for field in ['actor_id','feet','trajectory','ground_truth','bbox','detections','identity','visibility']:
   for level in ['root','frame']:
    doc=copy.deepcopy(self.valid);(doc if level=='root'else doc['frames'][0])[field]='not allowed'
    with self.subTest(field=field,level=level),self.assertRaises(jsonschema.ValidationError):jsonschema.validate(doc,self.schema)
 def test_no_paths_to_evaluator_or_other_inputs(self):
  for filename in ['../truth.json','/tmp/truth.png','folder/image.png','camera.png?actor=1']:
   doc=copy.deepcopy(self.valid);doc['frames'][0]['file']=filename
   with self.subTest(filename=filename),self.assertRaises(jsonschema.ValidationError):jsonschema.validate(doc,self.schema)
