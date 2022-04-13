# Richi
## Quickstart
To use Richi you have to use the code below:

```html
<!--create the richtext container-->
<div id="richi"> 
  <p>Some Text</p> 
</div>

<!--add the script tag with the Richi script-->
<script src="https://cdn.jsdelivr.net/gh/janis-5/Richi_RichText@0.2.1/richi.js"></script>

<!--create Richi with the given ID from the container-->
<script>
  let richi = new Richi("richi");
</script>
```

## Settings
It's possible to customize Richi

```javascript
///create Richi with the given ID from the container and custom settings
let richi = new Richi("richi", {
  components: {
    //the default value is 'simple', on false it disappears in the toolbar
    heading: 'simple', //possible values: false, 'simple'

    //the default value is true, on false it disappears in the toolbar
    bold: true, //possible values: true, false
    italic: true, //possible values: true, false
    underline: true, //possible values: true, false
    link: true, //possible values: true, false
    clear: true, //possible values: true, false
    code: true //possible values: true, false
  },
  //Themes
  theme: 'default' //possible values: 'default', 'dark', 'janis'
});
```

Used Icons: 

https://icons8.com/icon/set/free-icons/material-rounded
