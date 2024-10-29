---
title: ElasticSearch入门学习
author: GaoJ
createTime: 2024/10/29 21:30:33
permalink: /article/sbma11kj/
---
# Elasticsearch学习

> Elasticsearch 是一个分布式搜索和分析引擎，适用于各种类型的数据，包括文本、数字、地理位置信息、结构化数据和非结构化数据。它基于 Apache Lucene 构建，提供了一个 RESTful 的接口来进行交互。

## 安装

### docker安装Elasticsearch

```shell
docker run -p 9200:9200 -p 9300:9300 --name elasticsearch --restart=always \
-e "discovery.type=single-node" \
-e "cluster.name=elasticsearch" \
-e "ES_JAVA_OPTS=-Xms512m -Xmx1024m" \
-v ~/DevEnv/docker/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-v ~/DevEnv/docker/elasticsearch/data:/usr/share/elasticsearch/data \
-d elasticsearch:7.17.3
```

安装测试：http://127.0.0.1:9200/

### 安装中文分词器analysis-ik
下载地址：https://github.com/infinilabs/analysis-ik/releases/download/v7.17.7/elasticsearch-analysis-ik-7.17.7.zip

> 注意，这里安装的elasticsearch版本是7.17.3，但是analysis-ik使用的版本是7.17.7。
> 在启动es的时候会出现java.lang.IllegalArgumentException: Plugin [analysis-ik] was built for Elasticsearch version 7.17.7 but version 7.17.3 is running
> 解决方法：修改elasticsearch-analysis-ik-7.17.7/plugin-descriptor.properties 配置文件中elasticsearch.version=7.17.3

### docker安装kibana

```shell
docker run --name kibana -p 5601:5601  --restart=always \
--link elasticsearch:es \
-e "elasticsearch.hosts=http://es:9200" \
-d kibana:7.17.3
```
安装测试：http://127.0.0.1:5601/



### 基础概念

一个cluster（集群）由一个或者多个node（节点）组成。每个node中包含多个shard。这些分片可以是primary shard（主分片）也可以是replica shard（副本分片）。
每个shard中都包含一个index（索引）中全部数据或者部分数据。一个index由一个shard或者多个shard组成。每个index包含无数的document，每个document由属性相同的JSON组成

#### Cluster

Cluster：集群，elasticsearch集群由一个或者多个节点组成。可以通过集群名称对其进行标识。可在配置文件elasticsearch.yaml中定制集群名称

#### Node

Node：每个Elasticsearch实例。每个cluster由一个或者多个node组成。根据node的作用可以将其分为以下几种类型
- **master-eligible**: 可以作为主node，一旦成为主node就可以管理整个cluster集群，包括新增，更新，删除index；添加或者删除node；为node分配shard；主node不参与数据的CRUD，但是它仍然知道文档的位置
- **data**：数据node，示例索引，删除，更新或其他与文档相关操作的node。
- **ingest**：数据接入。elasticsearch的主要目的是为了索引和搜索文档，但是通常需要在存储文档到es之前对文档内容进行修改或者增强。比如说
    - 对日志字符串提取有意义的数据
    - 使用NLP工具丰富字符串内容
    - 在摄取期间添加或着修改字符串内容，比如增加DataTime字段
- **coordinating node**：协调节点，严格来说，这并不是一个种类的节点。这种节点通常处理端到端地客户端请求处理。通常是接收客户端的http请求。当客户端请求来临时，协调节点会接收该请求，并请求集群中其他节点处理。它在收集和整理完结果并将结果返回给客户端之前一直等待响应

#### Document

document：文档，elasticsearch是面向文档的，这意味着文档是最小的数据单位。

#### Index

index：索引，索引是文档的集合

#### Shard

shard：分片。由于elasticsearch是分布式搜索引擎，index索引被拆分为分布在多个node上被称为分片的元素上。分片的类型分为两种

- **primary shard**：主分片。每篇文档都存储在一个primary shard上。索引文档时首先在primary shard上编制索引，然后在replica sahrd上编制索引。主分片进行读取和写入操作
- replica shard：副本分片。每个主分片可以具有零个或者多个副本分片。副本分片是只读的



### 创建一个文档及索引



```json
POST /students/_doc/1
{
  "student_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "2000-01-15",
  "gender": "Male",
  "email": "john.doe@example.com",
  "phone_number": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "admission_date": "2018-09-01T00:00:00",
  "graduation_date": null,
  "gpa": 3.50,
  "major": "Computer Science",
  "advisor_id": 1
}
```

在通常的情况下，新写入的文档并不能马上被用于搜索。新增的索引必须写入到 Segment 后才能被搜索到。需要等到 refresh 操作才可以。在默认的情况下每隔一秒的时间 refresh 一次。这就是我们通常所说的近实时。

POST新建文档如果不指定id，由es自动生成id。例如

```json
POST /students/_doc/
```



```json
POST /students/_doc/1?refresh=true
{
  "student_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "2000-01-15",
  "gender": "Male",
  "email": "john.doe@example.com",
  "phone_number": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "admission_date": "2018-09-01T00:00:00",
  "graduation_date": null,
  "gpa": 3.50,
  "major": "Computer Science",
  "advisor_id": 1
}

```

refresh=true方式可以强制使 Elasticsearch 进行 refresh 的操作，当然这个是有代价的。频繁的进行这种操作，可以使我们的 Elasticsearch 变得非常慢。另外一种方式是通过设置 refresh=wait_for。这样相当于一个同步的操作，它等待下一个 refresh 周期发生完后，才返回。这样可以确保我们在调用上面的接口后，马上可以搜索到我们刚才录入的文档


#### Elasticsearch的数据类型

- **text**：全文搜索字符串
- **keyword**：用于精确字符串匹配和聚合
- **date** 及 **date_nanos**：格式化为日期或数字日期的字符串
- **byte**, **short**, **integer**, **long**：整数类型
- **boolean**：布尔类型
- **float**，**double**，**half_float**：浮点数类型
- 分级的类型：**object** 及 **nested**。



### 修改文档



#### 全量修改

```json
PUT /students/_doc/1
{
  "student_id": 1,
  "first_name": "John",
  "last_name": "Doe"
}
```

使用PUT可以直接覆盖指定文档内容，需要指定文档id



#### 部分修改

```json
POST /students/_update/1
{
  "doc": {
    "gender":"Famale"
  }
}
```

使用`_update`端点修改指定id文档部分数据

#### 查询修改

```json
POST /students/_update_by_query
{
  "query": {
    "match": {
      "first_name": "John"
    }
  },
  "script": {
    "source": "ctx._source.gender=params.gender;ctx._source.email=params.email",
    "lang": "painless",
    "params": {
      "gender":"Male",
      "email":"gj37604@163.com"
    }
  }
}
```

根据`script`脚本中指令修改`query`查询出文档的数据

### 检查文档是否存在

```json
HEAD /students/_doc/1 #200 - OK
```

### 删除文档

```json
// 指定id删除
DELETE students/_doc/1

// 查询删除
POST /students/_delete_by_query
{
  "query": {
    "match": {
      "first_name": "John"
    }
  }
}
```

### 批量操作

```json
// 批量创建文档
POST _bulk
{"index":{"_index":"students","_id":1}}
{"student_id":1,"first_name":"John","last_name":"Doe","date_of_birth":"2000-01-15","gender":"Male","email":"john.doe@example.com","phone_number":"1234567890","address":"123 Main St","city":"New York","country":"USA","admission_date":"2018-09-01T00:00:00","graduation_date":null,"gpa":3.50,"major":"Computer Science","advisor_id":1}
{"index":{"_index":"students","_id":2}}
{"student_id":1,"first_name":"Alex","last_name":"Doe","date_of_birth":"2000-01-15","gender":"Male","email":"john.doe@example.com","phone_number":"1234567890","address":"123 Main St","city":"New York","country":"USA","admission_date":"2018-09-01T00:00:00","graduation_date":null,"gpa":3.50,"major":"Computer Science","advisor_id":1}

// 批量新增文档
POST _bulk
{"create":{"_index":"students","_id":1}}
{"student_id":1,"first_name":"John","last_name":"Doe","date_of_birth":"2000-01-15","gender":"Male","email":"john.doe@example.com","phone_number":"1234567890","address":"123 Main St","city":"New York","country":"USA","admission_date":"2018-09-01T00:00:00","graduation_date":null,"gpa":3.50,"major":"Computer Science","advisor_id":1}

// 批量删除文档
POST _bulk
{"delete":{"_index":"students","_id":1}}

// 批量修改文档
POST _bulk
{"update":{"_index":"students","_id":1}}
{"doc":{"first_name":"Alex"}}
```

### 查询所有文档

#### 分页查询

```json
GET /students/_search?size=2&from=2
```

#### 控制输出

```json
// 仅输出hits.total,hits.max_score内容
GET /students/_search?filter_path=hits.total,hits.max_score
```

#### 控制返回的字段

使用`_source`控制返回想要的字段，如果设置`_source`为false，则不反悔`_source`中任何字段

```json
GET /students/_search
{
  "_source": ["first_name","last_name"],
  "query": {
    "match": {
      "first_name": "David"
    }
  }
}

// 高级写法
GET /students/_search
{
  "_source": {
    // 包含哪些字段
    "includes": "{field}",
    // 排除哪些字段
    "excludes": "{field}"
  }
}
```

实际使用中可以使用`field`控制想要返回的字段，比`_source`更加高效

```json
GET /students/_search
{
  "_source": false,
  "fields": [
    "first_name",
    "last_name"
  ],
  "query": {
    "match": {
      "first_name": "David"
    }
  }
}
```

#### 返回自定义字段

有些时候我们需要返回`_source`中没有的字段，这个使用可以使用`script_fields`，例如我想返回学生的全名

```json
GET /students/_search
{
  "script_fields": {
    "full_name": {
      "script": {
        "source": "params['_source']['last_name']  +  params['_source']['first_name']"
      }
    }
  }
}
```



### 统计

如果想要统计文档数据，可以使用`_count`

```json
GET /students/_count
{
  "query": {
    "match": {
      "first_name": "John"
    }
  }
}
```



### 查询文档

#### match_query

查询出所有来自北京的所有用户，查询结果按照相关性从大到小排序

```json
GET /twitter/_search
{
  "query": {
    "match": {
      "city": "北京"
    }
  }
}
```

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 5,
      "relation" : "eq"
    },
    "max_score" : 0.48232412,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.48232412,
        "_source" : {
          "user" : "双榆树-张三",
          "message" : "今儿天气不错啊，出去转转去",
          "uid" : 2,
          "age" : 20,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市海淀区",
          "location" : {
            "lat" : "39.970718",
            "lon" : "116.325747"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 0.48232412,
        "_source" : {
          "user" : "东城区-老刘",
          "message" : "出发，下一站云南！",
          "uid" : 3,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区台基厂三条3号",
          "location" : {
            "lat" : "39.904313",
            "lon" : "116.412754"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 0.48232412,
        "_source" : {
          "user" : "东城区-李四",
          "message" : "happy birthday!",
          "uid" : 4,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区",
          "location" : {
            "lat" : "39.893801",
            "lon" : "116.408986"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 0.48232412,
        "_source" : {
          "user" : "朝阳区-老贾",
          "message" : "123,gogogo",
          "uid" : 5,
          "age" : 35,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区建国门",
          "location" : {
            "lat" : "39.718256",
            "lon" : "116.367910"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "5",
        "_score" : 0.48232412,
        "_source" : {
          "user" : "朝阳区-老王",
          "message" : "Happy BirthDay My Friend!",
          "uid" : 6,
          "age" : 50,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区国贸",
          "location" : {
            "lat" : "39.918256",
            "lon" : "116.467910"
          }
        }
      }
    ]
  }
}
```

查询出message字段包含`出`的文档

```json
GET /twitter/_search
{
  "query": {
    "match": {
      "message": "出"
    }
  }
}
```

```json
{
  "took" : 0,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0764678,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.0764678,
        "_source" : {
          "user" : "东城区-老刘",
          "message" : "出发，下一站云南！",
          "uid" : 3,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区台基厂三条3号",
          "location" : {
            "lat" : "39.904313",
            "lon" : "116.412754"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.8456129,
        "_source" : {
          "user" : "双榆树-张三",
          "message" : "今儿天气不错啊，出去转转去",
          "uid" : 2,
          "age" : 20,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市海淀区",
          "location" : {
            "lat" : "39.970718",
            "lon" : "116.325747"
          }
        }
      }
    ]
  }
}
```

可以通过指定`min_score`限定的文档相关性分数的最小值来减少文档的返回数量，例如将`min_score`的值设置为1

```json
GET /twitter/_search
{
  "min_score":1,
  "query": {
    "match": {
      "message": "出"
    }
  }
}
```

```json
// 仅返回_scroe大于1的文档
{
  "took" : 23,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0764678,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.0764678,
        "_source" : {
          "user" : "东城区-老刘",
          "message" : "出发，下一站云南！",
          "uid" : 3,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区台基厂三条3号",
          "location" : {
            "lat" : "39.904313",
            "lon" : "116.412754"
          }
        }
      }
    ]
  }
}
```

`match_query`默认是`or`操作，这意味着

```json
GET /twitter/_search
{
  "query": {
    "match": {
      "message":{
        "query": "出",
        "operator": "or"
      }
    }
  }
}

=== 等效于 ===

GET /twitter/_search
{
  "min_score":1,
  "query": {
    "match": {
      "message": "出"
    }
  }
}
```

#### Highlighting

突出显示能够让你从搜素结果中一个字段或者多个字眼中获取突出显示的片段，以便向用户显示查询的匹配

```json
GET /twitter/_search
{
  "query": {
    "match": {
      "address": "北京"
    }
  },
  "highlight": {
    "fields": {
      "address": {}
    }
  }
}


// 可以自定义高亮标签属性
GET /twitter/_search
{
  "query": {
    "match": {
      "address": "北京"
    }
  },
  "highlight": {
    "pre_tags": ["<my_tag>"],
    "post_tags": ["</my_tag>"], 
    "fields": {
      "address": {}
    }
  }
}
```

```json
{
  "took" : 42,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 5,
      "relation" : "eq"
    },
    "max_score" : 0.5253035,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.5253035,
        "_source" : {
          "user" : "双榆树-张三",
          "message" : "今儿天气不错啊，出去转转去",
          "uid" : 2,
          "age" : 20,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市海淀区",
          "location" : {
            "lat" : "39.970718",
            "lon" : "116.325747"
          }
        },
        "highlight" : {
          "address" : [
            "中国<em>北</em><em>京</em>市海淀区"
          ]
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 0.5253035,
        "_source" : {
          "user" : "东城区-李四",
          "message" : "happy birthday!",
          "uid" : 4,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区",
          "location" : {
            "lat" : "39.893801",
            "lon" : "116.408986"
          }
        },
        "highlight" : {
          "address" : [
            "中国<em>北</em><em>京</em>市东城区"
          ]
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "5",
        "_score" : 0.48232412,
        "_source" : {
          "user" : "朝阳区-老王",
          "message" : "Happy BirthDay My Friend!",
          "uid" : 6,
          "age" : 50,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区国贸",
          "location" : {
            "lat" : "39.918256",
            "lon" : "116.467910"
          }
        },
        "highlight" : {
          "address" : [
            "中国<em>北</em><em>京</em>市朝阳区国贸"
          ]
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 0.46336812,
        "_source" : {
          "user" : "朝阳区-老贾",
          "message" : "123,gogogo",
          "uid" : 5,
          "age" : 35,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区建国门",
          "location" : {
            "lat" : "39.718256",
            "lon" : "116.367910"
          }
        },
        "highlight" : {
          "address" : [
            "中国<em>北</em><em>京</em>市朝阳区建国门"
          ]
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 0.40042,
        "_source" : {
          "user" : "东城区-老刘",
          "message" : "出发，下一站云南！",
          "uid" : 3,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区台基厂三条3号",
          "location" : {
            "lat" : "39.904313",
            "lon" : "116.412754"
          }
        },
        "highlight" : {
          "address" : [
            "中国<em>北</em><em>京</em>市东城区台基厂三条3号"
          ]
        }
      }
    ]
  }
}
```



#### Prefix_query

返回提供字段中包含指定前缀的文档

```json
GET /twitter/_search
{
  "query": {
    "prefix": {
      "user": {
        "value": "朝"
      }
    }
  }
}
```

```json
{
  "took" : 6,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 1.0,
        "_source" : {
          "user" : "朝阳区-老贾",
          "message" : "123,gogogo",
          "uid" : 5,
          "age" : 35,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区建国门",
          "location" : {
            "lat" : "39.718256",
            "lon" : "116.367910"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "5",
        "_score" : 1.0,
        "_source" : {
          "user" : "朝阳区-老王",
          "message" : "Happy BirthDay My Friend!",
          "uid" : 6,
          "age" : 50,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区国贸",
          "location" : {
            "lat" : "39.918256",
            "lon" : "116.467910"
          }
        }
      }
    ]
  }
}
```

#### Term_query

在给定字段中进行精确字词的匹配

```json
GET /twitter/_search
{
  "query": {
    "term": {
      "user.keyword": {
        "value": "朝阳区-老贾"
      }
    }
  }
}
```

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.540445,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 1.540445,
        "_source" : {
          "user" : "朝阳区-老贾",
          "message" : "123,gogogo",
          "uid" : 5,
          "age" : 35,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区建国门",
          "location" : {
            "lat" : "39.718256",
            "lon" : "116.367910"
          }
        }
      }
    ]
  }
}
```

#### Terms_query

如果想要对多个term进行查询。

```json
GET /twitter/_search
{
  "query": {
    "terms": {
      "user.keyword": [
        "双榆树-张三",
        "东城区-老刘"
      ]
    }
  }
}
```

```json
{
  "took" : 5,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "user" : "双榆树-张三",
          "message" : "今儿天气不错啊，出去转转去",
          "uid" : 2,
          "age" : 20,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市海淀区",
          "location" : {
            "lat" : "39.970718",
            "lon" : "116.325747"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "user" : "东城区-老刘",
          "message" : "出发，下一站云南！",
          "uid" : 3,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区台基厂三条3号",
          "location" : {
            "lat" : "39.904313",
            "lon" : "116.412754"
          }
        }
      }
    ]
  }
}
```

#### 复合查询

上面的都是leaf查询，把多个leaf查询组合起来从而形成更为复杂的查询，复合查询由`bool`下的`filter`、`must`、`must_not`、`should`共同组成。可以通过设置`minumum_should_match`参数指定返回文档必须匹配子句的数量获取百分比。

布尔（bool）查询子句列表

| 子句     | 解释                                                         |
| -------- | ------------------------------------------------------------ |
| must     | must 子句包含查询，其中搜索条件必须在文档中匹配。 正匹配有助于提高相关性分数。 我们可以使用尽可能多的叶子查询来构建 must 子句 |
| must_not | 在 must_not 子句中，条件不得与文档匹配。 该子句不会对分数做出贡献（它在过滤上下文执行上下文中运行） |
| should   | 不强制要求在 should 子句中定义的标准必须匹配。 但是，如果匹配，相关性得分就会提高。有一个特殊情况必须匹配：在不含有 must, must_not 及 filter 的情况下，一个或更多的 should 必须有一个匹配才会有结果 |
| filter   | 在 filter 子句中，条件必须与文档匹配，类似于 must 子句。 唯一的区别是分数在过滤子句中是不相关的。 （它在过滤上下文执行上下文中运行） |



例如查询来自北京，并且年龄为30岁的用户

```json
GET /twitter/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "city.keyword": {
              "value": "北京"
            }
          }
        },
        {
          "term": {
            "age": {
              "value": "30"
            }
          }
        }
      ]
    }
  }
}
```

```json
{
  "took" : 7,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.2411621,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.2411621,
        "_source" : {
          "user" : "东城区-老刘",
          "message" : "出发，下一站云南！",
          "uid" : 3,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区台基厂三条3号",
          "location" : {
            "lat" : "39.904313",
            "lon" : "116.412754"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.2411621,
        "_source" : {
          "user" : "东城区-李四",
          "message" : "happy birthday!",
          "uid" : 4,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区",
          "location" : {
            "lat" : "39.893801",
            "lon" : "116.408986"
          }
        }
      }
    ]
  }
}
```



#### 位置查询

使用`geo_distance`进行位置查询，比如查询地址为北京，并且在经纬度（39.920086,116.454182）3km之内的用户

```json
GET /twitter/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "address": "北京"
          }
        }
      ]
    }
  },
  "post_filter": {
    "geo_distance": {
      "distance": "3km",
      "location": {
        "lat": 39.920086,
        "lon": 116.454182
      }
    }
  }
}
```

#### 范围查询

使用`range`查询指定范围内的文档，例如查询年龄在30到40之间的用户

```json
GET /twitter/_search
{
  "query": {
    "range": {
      "age": {
        "gte": 30,
        "lte": 40
      }
    }
  }
}
```

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "user" : "东城区-老刘",
          "message" : "出发，下一站云南！",
          "uid" : 3,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区台基厂三条3号",
          "location" : {
            "lat" : "39.904313",
            "lon" : "116.412754"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "user" : "东城区-李四",
          "message" : "happy birthday!",
          "uid" : 4,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区",
          "location" : {
            "lat" : "39.893801",
            "lon" : "116.408986"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 1.0,
        "_source" : {
          "user" : "朝阳区-老贾",
          "message" : "123,gogogo",
          "uid" : 5,
          "age" : 35,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区建国门",
          "location" : {
            "lat" : "39.718256",
            "lon" : "116.367910"
          }
        }
      }
    ]
  }
}
```



#### Exists

返回包含指定字段的文档。例如返回包含city字段的用户

```json
GET /twitter/_search
{
  "query": {
    "exists": {
      "field": "city"
    }
  }
}
```

#### 短语匹配

如果我们想要找到message内容包含`happy brithday`语句的文档。我们可以使用下列方式查询

```json
GET twitter/_search
{
  "query": {
    "match": {
      "message": "happy birthday"
    }
  }
}

// 此查询方式会查询出字段message包含happy和birthday两个单词的所有文档，只要包含一个单词即可，并且单词顺序也不影响查询
```

如果我们想要查询出，happy 在前，birthday在后。并且两个单词都要在message中出现的文档，就需要使用到短语匹配查询

```json
GET twitter/_search
{
  "query": {
    "match_phrase": {
      "message": "happy birthday"
    }
  }
}
```

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.9936416,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.9936416,
        "_source" : {
          "user" : "东城区-李四",
          "message" : "happy birthday!",
          "uid" : 4,
          "age" : 30,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市东城区",
          "location" : {
            "lat" : "39.893801",
            "lon" : "116.408986"
          }
        }
      },
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "5",
        "_score" : 1.7332871,
        "_source" : {
          "user" : "朝阳区-老王",
          "message" : "Happy BirthDay My Friend!",
          "uid" : 6,
          "age" : 50,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区国贸",
          "location" : {
            "lat" : "39.918256",
            "lon" : "116.467910"
          }
        }
      }
    ]
  }
}
```

如果允许happy和birthday之间存在单词，可以使用`slop`控制。例如

```json
GET /twitter/_search
{
  "query": {
    "match_phrase": {
      "message": {
        "query": "happy birthday",
        "slop": 1
      }
    }
  }
}
```

#### match_pharse_prefix

`match_phrase_prefix`是 Elasticsearch 中一种查询类型，用于查找与指定前缀匹配的短语（phrase）。它是一种扩展的短语查询，用于匹配指定字段中以给定的前缀开头的短语，特别适合需要处理前缀搜索的应用场景，如自动完成（autocomplete）功能。

`match_phrase_prefix`有两层含义：

1. 短语(phrase)匹配：与`match_pharse`一样，查询要求字段中查找与整个短语匹配的文档
2. 前缀匹配：`match_phrase_prefix`不仅要求短语匹配，而且还要求短语中最后一个词时一个前缀

举例来说，我要查询message匹配happy birthday的的文档，并且birthday下一个单词以m开头

```json
GET /twitter/_search
{
  "query": {
    "match_phrase_prefix": {
      "message": "happy birthday m"
    }
  }
}
```



```json
{
  "took" : 13,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 3.6593091,
    "hits" : [
      {
        "_index" : "twitter",
        "_type" : "_doc",
        "_id" : "5",
        "_score" : 3.6593091,
        "_source" : {
          "user" : "朝阳区-老王",
          "message" : "Happy BirthDay My Friend!",
          "uid" : 6,
          "age" : 50,
          "city" : "北京",
          "province" : "北京",
          "country" : "中国",
          "address" : "中国北京市朝阳区国贸",
          "location" : {
            "lat" : "39.918256",
            "lon" : "116.467910"
          }
        }
      }
    ]
  }
}
```



#### match_bool_prefix

`match_bool_prefix`是 Elasticsearch 中的一种查询类型，专门用于处理自动完成（autocomplete）和前缀搜索的场景。它结合了 `match` 查询和 `bool` 查询的优势，支持在输入部分词时进行高效的前缀匹配。



`match_bool_prefix` 查询允许用户输入一个包含多个词的短语，并且会在每个词上进行前缀匹配。它将短语拆分成多个部分，最后一个部分使用前缀匹配，前面的部分则完全匹配。

举例来说，如果我想匹配happy、birthday短语和以m开头的文档，只要满足一个条件即可。

```json
GET /twitter/_search
{
  "query": {
    "match_bool_prefix": {
      "message": "happy birthday m"
    }
  }
}

=== 等效于 ===

GET /twitter/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "message": {
              "value": "happy"
            }
          }
        },
        {
          "term": {
            "message": {
              "value": "birthday"
            }
          }
        },
        {
          "prefix": {
            "message": {
              "value": "m"
            }
          }
        }
      ]
    }
  }
}
```



#### 通配符查询

通配符查询（Wildcard Query）是 Elasticsearch 中的一种查询类型，允许在搜索时使用通配符（`*` 和 `?`）来匹配字段值中的模式。这种查询非常灵活，可以用于查找部分匹配的词或具有相似模式的词，但由于它可能匹配大量的文档，因此需要谨慎使用。

```json
GET twitter/_search
{
  "query": {
    "wildcard": {
      "city.keyword": {
        "value": "*京"
      }
    }
  }
}
```



### Spring-Boot-Data-Elasticsearch

Spring Boot Data Elasticsearch 是 Spring Data 项目中的一个子项目，它为 Spring 应用提供了与 Elasticsearch 数据库进行交互的支持。通过整合 Spring Boot 和 Elasticsearch，开发者可以方便地在 Spring 应用中使用 Elasticsearch 的强大搜索和数据分析功能。

#### 安装

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

#### 配置

```yaml
spring:
  elasticsearch:
    uris: http://127.0.0.1:9200
```

#### 实体类注解

```java
@Document(indexName = "twitter")
public class Twitter {

    @Field(type = FieldType.Integer)
    @Id
    private Integer uid;

    @Field(type = FieldType.Integer)
    private Integer age;

    @MultiField(mainField = @Field(type = FieldType.Text),otherFields = @InnerField(suffix = "keyword",type = FieldType.Keyword))
    private String user;
  
  	....
}
```

##### `@Document`

用于将一个 Java 类映射到 Elasticsearch 中的索引。它标识该类是一个 Elasticsearch 文档，并定义了该文档在 Elasticsearch 中的索引名称和类型等属性。

`@Document` 注解提供了一些属性来配置索引的细节：

1. **indexName**：指定 Elasticsearch 索引的名称。这是一个必需的属性。
2. **type**（可选，Elasticsearch 7.x 及以上版本不再使用）：指定文档的类型。在 Elasticsearch 7.x 及以上版本中类型被废弃，建议始终使用默认的 `_doc`。
3. **shards**（可选）：指定索引的主分片数量。
4. **replicas**（可选）：指定每个主分片的副本数量。
5. **createIndex**（可选，默认值为 `true`）：指定是否在应用启动时自动创建索引。
6. **versionType**（可选）：指定版本控制的类型。

##### `@Field`

用于标注实体类的字段，并指定该字段在 Elasticsearch 中的映射类型和相关属性。

- **type**: 指定字段的类型，常见的类型包括 `Text`, `Keyword`, `Integer`, `Long`, `Double`, `Date` 等。这些类型对应 Elasticsearch 的数据类型。
- **index**: 指定是否对该字段进行索引。默认值是 `true`。对于 `Text` 类型字段，通常需要索引以支持全文搜索，而 `Keyword` 类型字段用于精确匹配。
- **format**: 指定日期类型字段的格式。
- **store**: 指定是否单独存储该字段的值。默认值是 `false`，通常只有在需要单独检索字段的原始值时才设置为 `true`。
- **analyzer**: 指定该字段使用的分词器（analyzer）。分词器是 Elasticsearch 用于处理 `Text` 类型字段的组件，用于将文本拆分为词项。
- **ignoreAbove**: 对 `Keyword` 类型，指定字段值的最大长度。超过该长度的值将不会被索引。
- **coerce**: 对数值类型，指定是否自动将字符串转换为数值。

##### `@MultiField`

允许你将一个字段映射为多个不同的类型或分析方式。这种映射方式非常适合在需要对同一个字段进行不同的处理时使用，比如同时支持全文搜索和精确匹配，或者不同的分词策略等。

- **mainField**: 使用 `@Field` 注解来定义主字段。
- **otherFields**: 使用 `@InnerField` 注解的数组来定义其他的子字段。



##### `@InnerField`

`@MultiField` 注解的一部分，用于定义同一个字段的多个不同的子字段配置。每个 `@InnerField` 都代表一个独立的映射，这些子字段可以有不同的类型或分析方式。

- **suffix**: 指定子字段名称的后缀。最终子字段名称是主字段名称加上这个后缀。

- **type**: 定义子字段的类型，如 `Text`, `Keyword`, `Integer`, `Long`, `Date` 等。
- 参考`@Field`...



##### `@Id`

`@Id` 注解在 Spring Data Elasticsearch 中用于标识实体类中的唯一标识字段，这个字段会被用作 Elasticsearch 索引中的 `_id` 字段。`@Id` 注解是 Spring Data 的通用注解，适用于所有 Spring Data 支持的数据存储技术，包括关系数据库、MongoDB 和 Elasticsearch 等。主要用途如下：

- **唯一标识**: 标记实体类中的字段作为唯一标识符，用于在 Elasticsearch 中对应 `_id` 字段。
- **索引操作**: 在保存（indexing）、更新和删除操作时，Spring Data Elasticsearch 使用这个标识符来唯一标识文档。
- **查询**: 通过这个标识符可以执行单个文档的检索操作。



#### Mapping设置

使用注解自动配置索引映射，主要有两种方式。

##### 使用`@Mapping`

`@Mapping` 注解在 Spring Data Elasticsearch 中用于定义实体类的映射配置，特别是当需要自定义复杂的 Elasticsearch 映射时非常有用。通常和`@Document`一起使用

使用方式：

```java
@Document(indexName = "twitter")
@Mapping(mappingPath = "twitter_mapping.json")
public class Twitter {
  ...
}
```

```json
{
  "properties": {
    "address": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    },
    "age": {
      "type": "long"
    },
    "city": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    },
    "country": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    },
    "location": {
      "type": "geo_point"
    },
    "message": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    },
    "province": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    },
    "uid": {
      "type": "long"
    },
    "user": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    }
  }
}
```



```java
@Test
public void test_set_mapping(){
    IndexOperations indexOperations = elasticsearchRestTemplate.indexOps(Twitter.class);
    indexOperations.putMapping();
}
```

##### 使用`@Field`等注解

```java
@Document(indexName = "twitter")
public class Twitter {

    @Field(type = FieldType.Integer)
    @Id
    private Integer uid;

    @Field(type = FieldType.Integer)
    private Integer age;

    @MultiField(mainField = @Field(type = FieldType.Text),otherFields = @InnerField(suffix = "keyword",type = FieldType.Keyword))
    private String user;
  
  	....
}
```

```java
@Test
public void test_set_mapping(){
    IndexOperations indexOperations = elasticsearchRestTemplate.indexOps(Twitter.class);
    indexOperations.putMapping();
}
```







#### 创建Repository接口

用于定义基本的CRUD操作和自定义查询。自定义查询可以使用类似于JPA操作

```java
public interface TwitterRepository extends ElasticsearchRepository<Twitter,String> {
    Twitter getByUid(String id);
}
```

| 关键词                                    | 示例                                       | ES查询字符串                                                 |
| ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| `And`                                     | `findByNameAndPrice`                       | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "?", "fields" : [ "name" ] } }, { "query_string" : { "query" : "?", "fields" : [ "price" ] } } ] } }}` |
| `Or`                                      | `findByNameOrPrice`                        | `{ "query" : { "bool" : { "should" : [ { "query_string" : { "query" : "?", "fields" : [ "name" ] } }, { "query_string" : { "query" : "?", "fields" : [ "price" ] } } ] } }}` |
| `Is`                                      | `findByName`                               | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "?", "fields" : [ "name" ] } } ] } }}` |
| `Not`                                     | `findByNameNot`                            | `{ "query" : { "bool" : { "must_not" : [ { "query_string" : { "query" : "?", "fields" : [ "name" ] } } ] } }}` |
| `Between`                                 | `findByPriceBetween`                       | `{ "query" : { "bool" : { "must" : [ {"range" : {"price" : {"from" : ?, "to" : ?, "include_lower" : true, "include_upper" : true } } } ] } }}` |
| `LessThan`                                | `findByPriceLessThan`                      | `{ "query" : { "bool" : { "must" : [ {"range" : {"price" : {"from" : null, "to" : ?, "include_lower" : true, "include_upper" : false } } } ] } }}` |
| `LessThanEqual`                           | `findByPriceLessThanEqual`                 | `{ "query" : { "bool" : { "must" : [ {"range" : {"price" : {"from" : null, "to" : ?, "include_lower" : true, "include_upper" : true } } } ] } }}` |
| `GreaterThan`                             | `findByPriceGreaterThan`                   | `{ "query" : { "bool" : { "must" : [ {"range" : {"price" : {"from" : ?, "to" : null, "include_lower" : false, "include_upper" : true } } } ] } }}` |
| `GreaterThanEqual`                        | `findByPriceGreaterThan`                   | `{ "query" : { "bool" : { "must" : [ {"range" : {"price" : {"from" : ?, "to" : null, "include_lower" : true, "include_upper" : true } } } ] } }}` |
| `Before`                                  | `findByPriceBefore`                        | `{ "query" : { "bool" : { "must" : [ {"range" : {"price" : {"from" : null, "to" : ?, "include_lower" : true, "include_upper" : true } } } ] } }}` |
| `After`                                   | `findByPriceAfter`                         | `{ "query" : { "bool" : { "must" : [ {"range" : {"price" : {"from" : ?, "to" : null, "include_lower" : true, "include_upper" : true } } } ] } }}` |
| `Like`                                    | `findByNameLike`                           | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "?*", "fields" : [ "name" ] }, "analyze_wildcard": true } ] } }}` |
| `StartingWith`                            | `findByNameStartingWith`                   | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "?*", "fields" : [ "name" ] }, "analyze_wildcard": true } ] } }}` |
| `EndingWith`                              | `findByNameEndingWith`                     | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "*?", "fields" : [ "name" ] }, "analyze_wildcard": true } ] } }}` |
| `Contains/Containing`                     | `findByNameContaining`                     | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "*?*", "fields" : [ "name" ] }, "analyze_wildcard": true } ] } }}` |
| `In`（当注释为 FieldType.Keyword 时）     | `findByNameIn(Collection<String>names)`    | `{ "query" : { "bool" : { "must" : [ {"bool" : {"must" : [ {"terms" : {"name" : ["?","?"]}} ] } } ] } }}` |
| `In`                                      | `findByNameIn(Collection<String>names)`    | `{ "query": {"bool": {"must": [{"query_string":{"query": "\"?\" \"?\"", "fields": ["name"]}}]}}}` |
| `NotIn` （当注释为 FieldType.Keyword 时） | `findByNameNotIn(Collection<String>names)` | `{ "query" : { "bool" : { "must" : [ {"bool" : {"must_not" : [ {"terms" : {"name" : ["?","?"]}} ] } } ] } }}` |
| `NotIn`                                   | `findByNameNotIn(Collection<String>names)` | `{"query": {"bool": {"must": [{"query_string": {"query": "NOT(\"?\" \"?\")", "fields": ["name"]}}]}}}` |
| `Near`                                    | `findByStoreNear`                          | `Not Supported Yet !`                                        |
| `True`                                    | `findByAvailableTrue`                      | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "true", "fields" : [ "available" ] } } ] } }}` |
| `False`                                   | `findByAvailableFalse`                     | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "false", "fields" : [ "available" ] } } ] } }}` |
| `OrderBy`                                 | `findByAvailableTrueOrderByNameDesc`       | `{ "query" : { "bool" : { "must" : [ { "query_string" : { "query" : "true", "fields" : [ "available" ] } } ] } }, "sort":[{"name":{"order":"desc"}}] }` |



#### 新增文档

```java
    @Test
    public void test_save(){
        String json1 = "{\"user\":\"双榆树-张三\",\"message\":\"今儿天气不错啊，出去转转去\",\"uid\":2,\"age\":20,\"city\":\"北京\",\"province\":\"北京\",\"country\":\"中国\",\"address\":\"中国北京市海淀区\",\"location\":{\"lat\":\"39.970718\",\"lon\":\"116.325747\"}}";
        String json2 = "{\"user\":\"东城区-老刘\",\"message\":\"出发，下一站云南！\",\"uid\":3,\"age\":30,\"city\":\"北京\",\"province\":\"北京\",\"country\":\"中国\",\"address\":\"中国北京市东城区台基厂三条3号\",\"location\":{\"lat\":\"39.904313\",\"lon\":\"116.412754\"}}";
        String json3 = "{\"user\":\"东城区-李四\",\"message\":\"happy birthday!\",\"uid\":4,\"age\":30,\"city\":\"北京\",\"province\":\"北京\",\"country\":\"中国\",\"address\":\"中国北京市东城区\",\"location\":{\"lat\":\"39.893801\",\"lon\":\"116.408986\"}}";
        String json4 = "{\"user\":\"朝阳区-老贾\",\"message\":\"123,gogogo\",\"uid\":5,\"age\":35,\"city\":\"北京\",\"province\":\"北京\",\"country\":\"中国\",\"address\":\"中国北京市朝阳区建国门\",\"location\":{\"lat\":\"39.718256\",\"lon\":\"116.367910\"}}";
        String json5 = "{\"user\":\"朝阳区-老王\",\"message\":\"Happy BirthDay My Friend!\",\"uid\":6,\"age\":50,\"city\":\"北京\",\"province\":\"北京\",\"country\":\"中国\",\"address\":\"中国北京市朝阳区国贸\",\"location\":{\"lat\":\"39.918256\",\"lon\":\"116.467910\"}}";
        String json6 = "{\"user\":\"虹桥-老吴\",\"message\":\"好友来了都今天我生日，好友来了,什么 birthday happy 就成!\",\"uid\":7,\"age\":90,\"city\":\"上海\",\"province\":\"上海\",\"country\":\"中国\",\"address\":\"中国上海市闵行区\",\"location\":{\"lat\":\"31.175927\",\"lon\":\"121.383328\"}}";

        List<String> list = Arrays.asList(json1, json2, json3, json4, json5, json6);
        for (String json : list) {
            Twitter twitter = JSON.parseObject(json, Twitter.class);
            twitterRepository.save(twitter);
        }
    }
```



#### match_query

```java
    @Test
    public void test_match_query(){
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(QueryBuilders.matchQuery("city", "北京"))
                .build();
        SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
        for (SearchHit<Twitter> searchHit : searchHits.getSearchHits()) {
            LOGGER.info("查询结果为:{}",searchHit.getContent());
        }
    }

    @Test
    public void test_match_query_with_min_score(){
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(QueryBuilders.matchQuery("message", "出"))
                .withMinScore(1.0f)
                .build();
        SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
        for (SearchHit<Twitter> searchHit : searchHits.getSearchHits()) {
            LOGGER.info("文档得分score:{} 文档内容content:{}",searchHit.getScore(),searchHit.getContent());
        }
    }

```

#### HightLighting

```java
    @Test
    public void test_match_query_with_high_lighting(){
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(QueryBuilders.matchQuery("address", "北京"))
                .withHighlightFields(new HighlightBuilder.Field("address").preTags("<em>").postTags("</em>"))
                .build();
        SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
        for (SearchHit<Twitter> searchHit : searchHits.getSearchHits()) {
            LOGGER.info("查询结果为:{}",searchHit.getContent());
            String highLighting = searchHit.getHighlightFields().get("address").get(0);
            LOGGER.info("高亮显示为:{}",highLighting);
        }
    }
```

#### prefix_query

```java
    @Test
    public void test_prefix_query(){
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(QueryBuilders.prefixQuery("user", "朝"))
                .build();

        SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
        for (SearchHit<Twitter> searchHit : searchHits) {
            LOGGER.info("查询结果为:{}",searchHit.getContent());
        }
    }
```



#### term_query

```java
    @Test
    public void test_term_query(){
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(QueryBuilders.termQuery("user.keyword", "朝阳区-老贾"))
                .build();
        SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
        for (SearchHit<Twitter> searchHit : searchHits) {
            LOGGER.info("查询结果为:{}",searchHit.getContent());
        }
    }
```

#### terms_query

```java
    @Test
    public void test_terms_query(){
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(QueryBuilders.termsQuery("user.keyword", Arrays.asList("双榆树-张三", "东城区-老刘")))
                .build();

        SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
        for (SearchHit<Twitter> searchHit : searchHits) {
            LOGGER.info("查询结果为:{}",searchHit.getContent());
        }
    }
```



#### 复合查询

```java
@Test
public void test_compound_query(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.boolQuery()
                    .must(QueryBuilders.termQuery("city.keyword", "北京"))
                    .must(QueryBuilders.termQuery("age", 30))
            )
            .build();

    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```

#### 位置查询

```java
@Test
public void test_geo_query(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.boolQuery()
                    .must(QueryBuilders.matchQuery("address", "北京"))
                    .filter(QueryBuilders
                            .geoDistanceQuery("location")
                            .distance("3", DistanceUnit.KILOMETERS)
                            .point(39.920086, 116.454182)
                    )
            )
            .build();
    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```

#### 范围查询

```
@Test
public void test_range_query(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.rangeQuery("age").gte(30).lte(40))
            .build();
    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```

#### Exists 查询

```java
@Test
public void test_exists_query(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.existsQuery("city"))
            .build();
    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```

#### 短语匹配

```java
@Test
public void test_phrase_query(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.matchPhraseQuery("message", "happy birthday").slop(2))
            .build();
    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```



#### match_phrase_prefix_query

```java
@Test
public void test_phrase_prefix_query(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.matchPhrasePrefixQuery("message", "happy birthday m"))
            .build();
    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```



#### match_bool_prefix_query

```java
@Test
public void test_match_bool_prefix(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.matchBoolPrefixQuery("message", "happy birthday m"))
            .build();

    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```



#### 通配符匹配

```java
@Test
public void test_wildcard_query(){
    NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(QueryBuilders.wildcardQuery("city.keyword", "*京"))
            .build();

    SearchHits<Twitter> searchHits = elasticsearchRestTemplate.search(searchQuery, Twitter.class);
    for (SearchHit<Twitter> searchHit : searchHits) {
        LOGGER.info("查询结果为:{}",searchHit.getContent());
    }
}
```



> 参考博客：https://elasticstack.blog.csdn.net/article/details/102728604





