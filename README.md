docular-doc-api-http
====================

A plugin for docular (grunt-docular.com) to allow documentation of HTTP API.

###Grunt
To add the plugin using Grunt:

```
docular: {
  //Other options...
  plugins:[{id:'docular-doc-api-http'}]
}
```

See [grunt-docular](http://grunt-docular.com/documentation/docular/docularconfigure/index) for more configuration options.



###Usage

#### Doc Identifier
The doc identifier is: ``doc-http``.


#### Doc Types

Things to know about ``docTypes``.

1. ``DocTypes`` are what Docular uses to determine how to render the document.

2. ``DocTypes`` are the value specified next to the ``documentation identifier``.


##### @doc-http root
Root path or collection relating to a data entity - which you will have a number of paths and schema associated with it.

```
/**
 * @doc-http root
 * @name Media.protected:Album
 * 
 * @description
 * Some info.
 * 
 */
```

##### @doc-http path
A specific route/path with it's own HTTP method, parameters etc.

```
/**
 * @doc-http path
 * @name Media.protected:Album#get-many
 * 
 * @pathOf Media.protected:Album
 * 
 * @path /albums/:id
 * @method get-one //get, post, delete, put
 *
 * @param {string} id Albums unique id.
 * 
 * @description
 * Lists all albums that are associated with the user.
 * 
 */
```

##### @doc-http schema
Details the fields that are available to be selected from. Field follows the same structure as ``@param``.

```
/**
 * @doc-http schema
 * @name Media.protected:Album#schema
 * 
 * @schemaOf Media.protected:Album
 * 
 * @field {String} name Name of the album
 *
 */
```