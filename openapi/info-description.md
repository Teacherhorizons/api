# Introduction

## Plan

- Document current API here
- For new APIs, start trying to use the JSON API format

## Process

1. **Document a current API call** (old format)
   - Take a current API call which is not yet documented here and document it in the 'current' and/or 'deprecated' folders (as appropriate)
   - Keep this documentation relatively 'flat' (i.e. don't involve many files), since the current API calls are relatively dissimilar (i.e. they aren't consistent enough)
2. **Document a related proposed API call** (JSON API format)
   - If the current API call is not in the JSON API format, and if there's not yet a proposed API call which would have the same behaviour, document a related proposed API call
   - Use lots of nested files, since a lot of reuse should be possible

## Useful links

### OpenApi

- https://swagger.io/specification/ - OpenAPI Specification
- https://redoc.ly/docs/ - Redocly API reference docs
- https://github.com/OAI/OpenAPI-Specification/issues/1706 - Support deep objects for query parameters with deepObject style

### JSON API

- https://jsonapi.org/format/
- https://jsonapi.org/format/#fetching-sparse-fieldsets
- https://jsonapi.org/format/1.1/#query-parameters-families
- https://discuss.jsonapi.org/t/filtering-querying-deep-relationships-a-proposal-for-a-syntax/1746

### Java

- https://www.baeldung.com/json-api-java-spring-web-app

### To be organised

- https://tanzu.vmware.com/developer/guides/api-first-development/
- https://apisyouwonthate.com/blog/json-api-openapi-and-json-schema-working-in-harmony
- https://stackoverflow.com/a/49843322 - OData, JSON API, GraphQL, OpenAPI ("focus on building a consistent and well-documented API")


## Documentation limitations

- Filters aren't yet fully supported. Workaround: ...


<!-- This is an **example** API to demonstrate features of the OpenAPI specification. -->

<!-- TODO RR -->

<!-- This API definition is intended to to be a good starting point for
describing your API in 

[OpenAPI/Swagger
format](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md).

It also demonstrates features of the
[create-openapi-repo](https://github.com/Redocly/create-openapi-repo) tool
and 

the [Redoc](https://github.com/Redocly/Redoc) documentation engine. Beyond
the standard OpenAPI syntax, we use a few 

[vendor
extensions](https://github.com/Redocly/Redoc/blob/master/docs/redoc-vendor-extensions.md).


# OpenAPI Specification

The goal of The OpenAPI Specification is to define a standard,
language-agnostic interface to REST APIs which

allows both humans and computers to discover and understand the capabilities
of the service without access to source

code, documentation, or through network traffic inspection. When properly
defined via OpenAPI, a consumer can 

understand and interact with the remote service with a minimal amount of
implementation logic. Similar to what

interfaces have done for lower-level programming, OpenAPI removes the
guesswork in calling the service. -->

# Style guide

## TODO...

# JSON API (proposed)

### Current API call

/v3/schools/search/school-area/full?countries=2,3


### All possible values (simplified response, for example purposes):

```
{
  id,
  name,
  slug,
  completionLevel,
  city: {
    id,
    name,
    country: {
      id,
      name,
      currency,
      region: {
         id,
         name
      }
    }
  }
}
```

### Simple subset (sparse fieldset):

/schools?fields=id,name

```
{
  id,
  name
}
```

### Complex subset:

/schools?include=city,city.country&fields=id,name&fields[city]=name&fields[city.country]=id,currency

```
{
  id,
  name,
  city: {
    name,
    country: {
      id,
      currency
    }
  }
}
```

OR JSON API style:

```
data: {
  type: "school"
  id,
  "attributes": {
    name
  },
  "relationships": {
    "city": {
      "data": { "type": "city", "id": "9" }
    },
  }
}
included: {
  [
    {
      type: "city"
      id: 9
      "attributes": {
        name
      },
      "relationships": {
        "country": {
          "data": { "type": "country", "id": "17" }
        },
      }      
    },
    {
      type: "country"
      id: 17,
      "attributes": {
        currency
      },
    }
  }
  ]
}


```


<!-- /schools?include=city,city.country,city.country.region& -->