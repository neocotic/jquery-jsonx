     __                                            
    /\ \_        __                                
    \/'__`\     /\_\    ____   ___    ___   __  _  
    /\ \_\_\    \/\ \  /',__\ / __`\/' _ `\/\ \/'\ 
    \ \____ \ __ \ \ \/\__, `\\ \L\ \\ \/\ \/>  </ 
     \/\ \_\ \\_\_\ \ \/\____/ \____/ \_\ \_\\_/\_\
      \ `\_ _//_/\ \_\ \/___/ \/___/ \/_/\/_///\/_/
       `\_/\_\  \ \____/                           
          \/_/   \/___/                            

[jquery-jsonx][] is a [jQuery][] plugin which allows simple transformation
between XML and JSON.

This is a [jQuery][] implementation for the [JSONX][] JavaScript library which
provides the same transformation support as well as additional manipulation and
management using the powerful [jQuery][] framework.

More information is coming soon…

## JSON to XML

```
$(*).jsonx(Object[]|String)
$.jsonx(Object[]|String)
$(*).jsonx('build', Object[]|String)
$.jsonx('build', Object[]|String)
```

## XML to JSON

```
$(*).jsonx('parse', jQuery|String)
$.jsonx('parse', jQuery|String)
```

The argument for `parse` is entirely optional and the [jQuery][] context will be
parsed if this argument is neglected.

## Stringify

```
$(*).jsonx('stringify', jQuery|Object[])
$.jsonx('stringify', jQuery|Object[])
```

The argument for `stringify` is entirely optional and the [jQuery][] context
will be transformed in to a string if this argument is neglected.

## Grammar

The following grammar (BNF) represents the XML to JSON transformation;

```
element
  = '[' element-name ',' attributes ',' element-list ']'
  | '[' element-name ',' attributes ']'
  | '[' element-name ',' element-list ']'
  | '[' element-name ']'
  | string
  ;
element-name
  = string
  ;
attributes
  = '{' attribute-list '}'
  | '{' '}'
  ;
attribute-list
  = attribute ',' attribute-list
  | attribute
  ;
attribute
  = attribute-name ':' attribute-value
  ;
attribute-name
  = string
  ;
attribute-value
  = string
  | number
  | 'true'
  | 'false'
  | 'null'
  ;
element-list
  = element ',' element-list
  | element
  ;
```

## Bugs

If you have any problems with this library or would like to see the changes
currently in development you can do so here;

https://github.com/neocotic/jquery-jsonx/issues

## Questions?

Take a look at the documentation to get a better understanding of what the code
is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please
visit the project's homepage;

http://neocotic.com/jquery-jsonx

[@neocotic]: https://twitter.com/#!/neocotic
[jquery]: htttp://jquery.com
[jquery-jsonx]: http://neocotic.com/jquery-jsonx
[jsonx]: http://neocotic.com/jsonx