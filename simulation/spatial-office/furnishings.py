"""Blender composition of editable furniture, using the existing Studio mesh adapter.

No runtime engine. All generated geometry/materials are original project designs.
"""
import math, random
import bpy
from mathutils import Vector
from studio import Studio
from common import to_blender


def material(name, color, rough=.5, metal=0, texture=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nodes=m.node_tree.nodes; links=m.node_tree.links; p=nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal
    if texture:
        tex=nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value=145 if texture=='cloth' else 4
        tex.inputs['Detail'].default_value=2.5
        coords=nodes.new('ShaderNodeTexCoord')
        if texture=='wood':
            mapping=nodes.new('ShaderNodeVectorMath'); mapping.operation='MULTIPLY';mapping.inputs[1].default_value=(2,25,2)
            links.new(coords.outputs['Generated'],mapping.inputs[0]);links.new(mapping.outputs[0],tex.inputs['Vector'])
        else: links.new(coords.outputs['Generated'],tex.inputs['Vector'])
        ramp=nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color=(*(c*.65 for c in color),1)
        ramp.color_ramp.elements[1].color=(*(min(1,c*1.15) for c in color),1)
        links.new(tex.outputs['Fac'],ramp.inputs['Fac']);links.new(ramp.outputs['Color'],p.inputs['Base Color'])
        bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.17;bump.inputs['Distance'].default_value=.007 if texture=='cloth' else .004
        links.new(tex.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],p.inputs['Normal'])
        if texture=='cloth':p.inputs['Sheen Weight'].default_value=.28
    return m


class Furnishings(Studio):
    def mesh(self,id,verts,faces,mat,kind,env,smooth=True):
        m=bpy.data.meshes.new(id);m.from_pydata([to_blender(v) for v in verts],[],faces);m.update()
        o=bpy.data.objects.new(id,m);bpy.context.scene.collection.objects.link(o);m.materials.append(mat)
        if smooth:
            for p in m.polygons:p.use_smooth=True
        return self.reg(o,id,kind,env)

    def box(self,*a,**kw):
        o=super().box(*a,**kw)
        for m in o.modifiers:
            if m.type=='BEVEL':m.segments=4
        return o

    def lathe(self,id,p,profile,mat,kind,env,segments=40):
        x,y,z=p;verts=[]
        for r,h in profile:
            verts += [(x+r*math.cos(i*math.tau/segments),y+h,z+r*math.sin(i*math.tau/segments)) for i in range(segments)]
        faces=[]
        for row in range(len(profile)-1):
            for i in range(segments):
                j=(i+1)%segments;a=row*segments+i;b=row*segments+j
                faces.append((a,b,b+segments,a+segments))
        return self.mesh(id,verts,faces,mat,kind,env)

    def cylinder(self,id,p,r,h,mat,kind,env):
        return self.lathe(id,p,[(0,-h/2),(r,-h/2),(r,h/2),(0,h/2)],mat,kind,env)

    def ellipsoid(self,id,p,size,mat,kind,env):
        x,y,z=p;vs=[];N=24;R=12
        for j in range(R+1):
            a=math.pi*j/R
            for i in range(N):
                b=math.tau*i/N
                vs.append((x+size[0]/2*math.sin(a)*math.cos(b),y+size[1]/2*math.cos(a),z+size[2]/2*math.sin(a)*math.sin(b)))
        fs=[(j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i) for j in range(R) for i in range(N)]
        return self.mesh(id,vs,fs,mat,kind,env)

    def line(self,id,points,r,mat,kind,env):
        curve=bpy.data.curves.new(id,'CURVE');curve.dimensions='3D';curve.resolution_u=16;curve.bevel_depth=r;curve.bevel_resolution=3
        spline=curve.splines.new('BEZIER');spline.bezier_points.add(len(points)-1)
        for b,p in zip(spline.bezier_points,points):b.co=to_blender(p);b.handle_left_type='AUTO';b.handle_right_type='AUTO'
        o=bpy.data.objects.new(id,curve);bpy.context.scene.collection.objects.link(o);curve.materials.append(mat);return self.reg(o,id,kind,env)

    def text(self,id,body,p,size,mat,env,normal=(0,0,-1)):
        curve=bpy.data.curves.new(id,'FONT');curve.body=body;curve.align_x='CENTER';curve.align_y='CENTER';curve.size=size;curve.extrude=.0006
        o=bpy.data.objects.new(id,curve);bpy.context.scene.collection.objects.link(o);o.location=to_blender(p)
        o.rotation_euler=Vector(to_blender(normal)).to_track_quat('Z','Y').to_euler();curve.materials.append(mat)
        return self.reg(o,id,'Signage',env)

    def sofa(self,id,x,z,width,mat,wood,env,yaw=0,floor=-1.55,seats=2):
        def P(dx,h,dz):return (x+math.cos(yaw)*dx-math.sin(yaw)*dz,floor+h,z+math.sin(yaw)*dx+math.cos(yaw)*dz)
        def B(suffix,point,size,kind='Sofa',bevel=.055):
            o=self.box(id+':'+suffix,P(*point),size,mat,kind,env,bevel);o.rotation_euler.z=-yaw;return o
        B('base',(0,.25,0),(width,.28,.89))
        for i in range(seats):
            dx=(i-(seats-1)/2)*(width-.24)/seats
            B('cushion:'+str(i),(dx,.48,-.035),((width-.3)/seats-.025,.19,.70),bevel=.075)
            B('back:'+str(i),(dx,.80,.34),((width-.26)/seats-.025,.70,.20),bevel=.08)
        for j,dx in enumerate([-width/2+.07,width/2-.07]):B('arm:'+str(j),(dx,.59,0),(.16,.46,.87),bevel=.065)
        for j,(dx,dz) in enumerate([(-width/2+.18,-.31),(width/2-.18,-.31),(-width/2+.18,.31),(width/2-.18,.31)]):
            self.cylinder(id+':leg:'+str(j),P(dx,.10,dz),.027,.20,wood,'SofaLeg',env)
        return P

    def pillow(self,id,p,mat,env,yaw=0):
        o=self.box(id,p,(.37,.37,.14),mat,'Cushion',env,.085);o.rotation_euler.z=-yaw;return o

    def chair(self,id,x,z,yaw,mat,metal,env,floor=-1.55):
        def P(dx,h,dz):return (x+math.cos(yaw)*dx-math.sin(yaw)*dz,floor+h,z+math.sin(yaw)*dx+math.cos(yaw)*dz)
        seat=self.box(id+':seat',P(0,.49,0),(.48,.11,.46),mat,'Chair',env,.055);seat.rotation_euler.z=-yaw
        # Upholstered curved shell, not a rectangular back slab.
        vs=[]
        for row in range(4):
            h=.55+row*.125
            for i in range(13):
                a=-.9+1.8*i/12;vs.append(P(.30*math.sin(a),h,.25*math.cos(a)-.02))
        faces=[(r*13+i,r*13+i+1,(r+1)*13+i+1,(r+1)*13+i) for r in range(3) for i in range(12)]
        back=self.mesh(id+':back',vs,faces,mat,'Chair',env);solid=back.modifiers.new('Upholstered shell thickness','SOLIDIFY');solid.thickness=.045
        bevel=back.modifiers.new('Soft seam','BEVEL');bevel.width=.016;bevel.segments=3
        for j,(dx,dz) in enumerate([(-.17,-.16),(.17,-.16),(-.17,.16),(.17,.16)]):
            self.line(id+':leg:'+str(j),[P(dx*1.2,.025,dz*1.2),P(dx,.44,dz)],.018,metal,'ChairFrame',env)

    def table(self,id,x,z,r,wood,metal,env,floor=-1.55,height=.78):
        self.cylinder(id+':top',(x,floor+height,z),r,.065,wood,'CafeTable',env)
        self.cylinder(id+':edge',(x,floor+height-.028,z),r+.004,.012,metal,'TableEdge',env)
        self.cylinder(id+':stem',(x,floor+height/2,z),.038,height-.06,metal,'TableLeg',env)
        self.lathe(id+':base',(x,floor,z),[(0,.008),(.30,.008),(.30,.035),(.27,.052),(0,.052)],metal,'TableLeg',env)

    def plant(self,id,x,z,height,env,ceramic,soil,greens,stem,floor=-1.55,seed=1):
        rng=random.Random(seed);r=.19 if height<1 else .26;pot_h=.34 if height<1 else .46
        self.lathe(id+':pot',(x,floor,z),[(0,0),(r*.73,0),(r,pot_h),(r-.022,pot_h+.01),(r-.025,pot_h-.055),(0,pot_h-.055)],ceramic,'Planter',env)
        self.cylinder(id+':soil',(x,floor+pot_h-.042,z),r-.03,.02,soil,'PlantSoil',env)
        for j in range(11 if height>1 else 7):
            a=j*2.4;tip_h=height*(.64+rng.random()*.36);extent=.24+rng.random()*.16
            root=(x,floor+pot_h-.03,z);mid=(x+math.sin(a)*extent*.5,floor+tip_h*.75,z+math.cos(a)*extent*.5)
            tip=(x+math.sin(a)*extent,floor+tip_h,z+math.cos(a)*extent)
            self.line(id+':stem:'+str(j),[root,mid,tip],.006,stem,'Vegetation',env)
            for k in range(2):
                base=mid if k==0 else tip;a2=a+(1 if k==0 else -1)*.4;length=.26+rng.random()*.19
                direction=Vector((math.sin(a2)*.85,.30,math.cos(a2)*.85));side=Vector((math.cos(a2),0,-math.sin(a2)))
                vs=[]
                for row in range(9):
                    t=row/8;center=Vector(base)+direction*length*t;center.y+=math.sin(math.pi*t)*.075
                    w=math.sin(math.pi*t)**.8*length*.27
                    for col in [-1,0,1]:
                        p=center+side*w*col;p.y-=abs(col)*.022*math.sin(math.pi*t);vs.append(tuple(p))
                fs=[]
                for row in range(8):
                    for col in range(2):v=row*3+col;fs.append((v,v+1,v+4,v+3))
                self.mesh(id+f':leaf:{j}:{k}',vs,fs,greens[(j+k)%len(greens)],'Vegetation',env)

