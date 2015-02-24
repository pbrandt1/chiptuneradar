#!/bin/bash
curl -XGET "http://localhost:9200/chiptunes/_search" | python -m json.tool