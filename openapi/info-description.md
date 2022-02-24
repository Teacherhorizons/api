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

### OpenApi (idea: document current and future API calls in a standard way)

- https://swagger.io/specification/ - OpenAPI Specification
- https://redoc.ly/docs/ - Redocly API reference docs
- http://redocly.github.io/redoc/ - Examples
- https://github.com/OAI/OpenAPI-Specification/issues/1706 - Support deep objects for query parameters with deepObject style
- https://openapi.tools/

### Auto-generation of OpenAPI YAML (idea: partly auto-generate the documentation of current APIs)

- https://roger13.github.io/SwagDefGen/ - Convert JSON response to YAML
- https://metamug.com/util/postman-to-swagger/ - Convert JSON response to YAML (very simple)
- https://support.google.com/admanager/answer/10358597?hl=en - Capture web session traffic (in a HAR file)
- https://github.com/dcarr178/har2openapi - Generate OpenAPI YAML from  HAR file
- https://springdoc.org/ - For future, generate OpenAPI YAML from Spring Boot

### Auto-generation of back-end code (for future)

- https://docs.openapiprocessor.io/ - generate Spring Boot interfaces and models

### Validation (idea: validate the latest spec against actual API calls)

- https://github.com/codekie/openapi-examples-validator - Validate JSON responses

### JSON API (idea: use a standard format for future API calls)

- https://jsonapi.org/format/
- https://jsonapi.org/format/#fetching-sparse-fieldsets
- https://jsonapi.org/format/1.1/#query-parameters-families
- https://discuss.jsonapi.org/t/filtering-querying-deep-relationships-a-proposal-for-a-syntax/1746
- https://discuss.jsonapi.org/t/openapi-3-0-spec-that-conforms-to-json-api/1803/6
- https://gist.github.com/naesean/d64185e45d1722ab3a53c45be47accae

### Java

- https://www.baeldung.com/json-api-java-spring-web-app
- https://cradlepoint.com/resources/blog/behind-the-code-series-java-jsonapi-a-journey/
- https://jsonapi.org/implementations/#server-libraries-java

### To be organised

- https://tanzu.vmware.com/developer/guides/api-first-development/
- https://apisyouwonthate.com/blog/json-api-openapi-and-json-schema-working-in-harmony
- https://stackoverflow.com/a/49843322 - Overview of OData, JSON API, GraphQL and OpenAPI (quote: "focus on building a consistent and well-documented API")

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

## Style guide

### TODO...

## JSON API (proposed)

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

## Approach to versioning

### Versioning of the whole api

- Initially none - address if we ever need it

### Versioning of individual API calls

- Initially none - address as/when we need it
- Probably do using 'content negotiation' (option 4 here https://www.xmatters.com/blog/blog-four-rest-api-versioning-strategies/) or, possibly simpler for our use cases, use e.g. `?version=2` in the url
- If no version specified, default to oldest 'supported' version

#### Versioning process

  1. change the spec so it describes what we want things to change to (no need to keep the spec for the 'old' version)
  2. if spec implies a significant breaking change, create parallel code in backend which requires version=2
  3. release backend
  4. update front-end to use version=2
  5. once nothing's using the 'old' version, delete the related backend code and gradually remove version=2 from everywhere

- This is to keep it simple. Will tweak if it isn't simple in a particular case.
- This way 'version' is only a *temporary state*, and exists only to support separate backend and front-end releases
- Add deprecation marking into the process if we ever need into
- Useful link: https://apisyouwonthate.com/blog/api-versioning-has-no-right-way

## Approach to error handling

TODO
## Approach to different user types

See the 'Pet' example.