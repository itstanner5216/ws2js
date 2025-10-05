# WS2JS 0.3

## About

- WS2JS is a library which convert Whitespace-0.3 to JavaScript.

## Usage

The variable WS contains a sample of [the hello-world](http://compsoc.dur.ac.uk/whitespace/hworld.ws) in Whitespace language.

code:

  `eval(WS2JS.convert(WS));`

result:

  `Hello, world of spaces!`

[details](http://ws2js.luilak.net/document.html)

## iOS Usage

WS2JS works on iOS devices through Mobile Safari and other iOS browsers. Simply include the library in your HTML page and use it as shown in the usage example above.

See [example-ios.html](example-ios.html) for a complete working example optimized for iOS devices.

### Basic iOS Example

Create an HTML file with the following content:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WS2JS on iOS</title>
  <script src="ws2js.js"></script>
</head>
<body>
  <script>
    // Your Whitespace code here
    var WS = "   \t  \t   \n\t\n     \t\t  \t \t\n\t\n     \t\t \t\t  \n\t\n     \t\t \t\t  \n\t\n     \t\t \t\t\t\t\n\t\n     \t \t\t  \n\t\n     \t     \n\t\n     \t\t\t  \t\t\n\t\n     \t\t \t\t\t\t\n\t\n     \t\t\t  \t \n\t\n     \t\t \t\t  \n\t\n     \t\t  \t  \n\t\n     \t     \n\t\n     \t\t \t\t\t\t\n\t\n     \t\t\t \t\t \n\t\n     \t   \t\t\n\t\n     \t    \t \n\t\n     \t\t  \t \t\n\t\n     \t     \n\t\n     \t \t \t\t\n\t\n     \t\t\t  \t \n\t\n     \t\t  \t  \n\t\n     \t     \n\t\n     \t  \t\t\t\n\t\n     \t     \n\t\n  \n\n\n";
    eval(WS2JS.convert(WS));
  </script>
</body>
</html>
```

### iOS Considerations

- **Input Dialogs**: The library uses `prompt()` for input, which works on iOS Safari but may appear differently than on desktop browsers.
- **Output**: Output is written using `document.write()`, which is fully supported on iOS browsers.
- **Viewport**: Include the viewport meta tag (as shown above) for proper rendering on iOS devices.
- **Touch Events**: All standard web interactions work as expected on iOS touch devices.

### Testing on iOS

1. Upload your HTML file to a web server or use a service like GitHub Pages
2. Open the URL in Safari on your iOS device
3. The Whitespace code will execute and display output

Alternatively, for local testing, you can use the "Files" app on iOS to open local HTML files in Safari.

## License

  the MIT License

## Author

  [Luilak](http://luilak.net/)
