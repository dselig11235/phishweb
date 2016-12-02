import tornado.ioloop
from time import time
import tornado.web
import os
import json
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId

campaigns_db = MongoClient().phonephish.campaigns
archived_db = MongoClient().phonephish.archives

class DTSerializer(json.JSONEncoder):
    def default(self, obj):
        try:
            return obj.isoformat()
        except:
            pass
        return super(DTSerializer, self).default(obj)

class ObjectIdSerializer(DTSerializer):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(ObjectIdSerializer, self).default(obj)

def dtserializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    else:
        json.JSONEncoder().default(obj)

class BaseHandler(tornado.web.RequestHandler):
    def prepare(self):
        if 'Content-Type' in self.request.headers:
            if self.request.headers["Content-Type"].startswith("application/json"):
                self.json_args = json.loads(self.request.body)
                print self.request.body
        else:
            self.json_args = {}
    def jsonwrite(self, doc):
        self.set_header('Content-Type', 'application/json')
        self.write(ObjectIdSerializer().encode(doc))

class MainHandler(BaseHandler):
    def get(self, page):
        with open(page, 'r') as f:
            self.write(f.read())

class ListCampaigns(BaseHandler):
    def get(self):
        campaigns = [c for c in campaigns_db.find(projection=['name', 'company', 'numcalls', 'pretext', 'open', 'close', 'tz', 'notes'])]
        for c in campaigns:
            c['id'] = str(c['_id'])
            del c['_id']
        self.jsonwrite({'data': campaigns})

class SearchCampaigns(BaseHandler):
    def post(self):
        if len(self.json_args.keys()) == 1 and "" in self.json_args:
            self.json_args={}
        campaign = campaigns_db.find_one({'_id': ObjectId(self.json_args['id'])})
        campaign['id'] = str(campaign['_id'])
        self.jsonwrite({'data': campaign})

class GetDistinct(BaseHandler):
    def post(self):
        self.jsonwrite(campaigns_db.distinct(self.json_args['key']))

class UpdateCampaign(BaseHandler):
    def post(self):
        r = self.json_args
        q = {'_id': ObjectId(r['_id'])}
        del r['_id']
        print "updating", q, "to", r
        id = campaigns_db.update(q, r)
        self.jsonwrite({'id': str(id)})

class ArchiveCampaign(BaseHandler):
    def post(self):
        r = self.json_args
        id = campaigns_db.insert(r)
        self.jsonwrite({'id': str(id)})

class SaveCampaign(BaseHandler):
    def post(self):
        r = self.json_args
        id = campaigns_db.insert(r)
        self.jsonwrite({'id': str(id)})

class CacheDefeat(BaseHandler):
    def get(self, page):
        return self.redirect(str(time()) + '/' + page)

class UncachedFiles(MainHandler):
    def get(self, time, file):
        return super(UncachedFiles, self).get(file)

class DustHandler(MainHandler):
    def get(self, time, file):
        return super(DustHandler, self).get(file)


settings = {
    'debug': True,
}

application = tornado.web.Application([
    (r"/api/list", ListCampaigns),
    (r"/api/distinct", GetDistinct),
    (r"/api/archive", ArchiveCampaign),
    (r"/api/create", SaveCampaign),
    (r"/api/update", UpdateCampaign),
    (r"/api/campaign", SearchCampaigns),
    (r"/([\.\d]+)/(.*)", UncachedFiles),
    (r"/notcached-(.*)", CacheDefeat),
    (r"/(.*)/(.*\.dust)", DustHandler),
    (r"/(.*)", tornado.web.StaticFileHandler, dict(path=os.path.dirname(__file__))),
], **settings)

if __name__ == "__main__":
    import sys
    application.listen(sys.argv[1])
    tornado.ioloop.IOLoop.instance().start()

