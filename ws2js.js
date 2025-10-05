/*
 * WS2JS 0.3
 * 
 * WS2JS is a library which convert Whitespace-0.3 to JavaScript.
 * 
 * @author: Luilak
 * @License: the MIT License
 */

/*
 * =========================================================================
 * HOW TO IMPLEMENT WS2JS FOR iOS - STEP BY STEP GUIDE
 * =========================================================================
 * 
 * WS2JS works seamlessly on iOS devices through Mobile Safari and other
 * iOS browsers. Follow these steps to implement it in your iOS web app:
 * 
 * STEP 1: CREATE YOUR HTML FILE
 * ------------------------------
 * Create an HTML file with proper iOS viewport configuration:
 * 
 *   <!DOCTYPE html>
 *   <html>
 *   <head>
 *     <meta charset="UTF-8">
 *     <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *     <title>WS2JS on iOS</title>
 *     <script src="ws2js.js"></script>
 *   </head>
 *   <body>
 *     <!-- Your content here -->
 *   </body>
 *   </html>
 * 
 * STEP 2: INCLUDE THE WS2JS LIBRARY
 * ----------------------------------
 * Add the ws2js.js file to your project directory and reference it in the
 * <head> section as shown above. The library is a single JavaScript file
 * with no external dependencies.
 * 
 * STEP 3: ADD YOUR WHITESPACE CODE
 * ---------------------------------
 * Add your Whitespace code inside a <script> tag in the body:
 * 
 *   <script>
 *     // Your Whitespace code (spaces, tabs, and newlines)
 *     var WS = "   \t  \t   \n\t\n     \t\t  \t \t\n...";
 *     
 *     // Convert and execute the Whitespace code
 *     eval(WS2JS.convert(WS));
 *   </script>
 * 
 * STEP 4: UNDERSTAND THE WS2JS.convert() METHOD
 * ----------------------------------------------
 * The convert() method takes up to 3 parameters:
 * 
 *   WS2JS.convert(code, complete, toASCII)
 * 
 *   - code (required): Your Whitespace source code string
 *   - complete (optional): Set to true to include WS2JS methods in output
 *   - toASCII (optional): Set to true to convert binary to ASCII in labels
 * 
 * STEP 5: HANDLE OUTPUT ON iOS
 * -----------------------------
 * WS2JS uses document.write() for output, which works perfectly on iOS:
 * 
 *   - Output appears inline where the script executes
 *   - Newlines are converted to <BR> tags automatically
 *   - All iOS browsers support document.write() natively
 * 
 * STEP 6: HANDLE INPUT ON iOS
 * ----------------------------
 * WS2JS uses prompt() for input, which works on iOS Safari:
 * 
 *   - Input dialogs appear as native iOS modal dialogs
 *   - The appearance may differ from desktop browsers
 *   - Both numeric and character input are supported
 * 
 * STEP 7: TEST ON iOS DEVICES
 * ----------------------------
 * There are multiple ways to test your implementation:
 * 
 *   Method A - Web Server:
 *     1. Upload your HTML file to a web server or GitHub Pages
 *     2. Open the URL in Safari on your iOS device
 *     3. The Whitespace code executes automatically on page load
 * 
 *   Method B - Local Files:
 *     1. Transfer the HTML file to your iOS device
 *     2. Open the "Files" app on iOS
 *     3. Navigate to the file and tap to open in Safari
 *     4. The code will execute when the page loads
 * 
 * iOS-SPECIFIC CONSIDERATIONS:
 * ----------------------------
 * - Viewport Meta Tag: Always include the viewport meta tag for proper
 *   mobile rendering (width=device-width, initial-scale=1.0)
 * 
 * - Touch Events: All standard web interactions work on iOS touch devices
 * 
 * - Safari Compatibility: WS2JS is fully compatible with Mobile Safari
 *   and other iOS browsers like Chrome and Firefox for iOS
 * 
 * - Performance: JavaScript execution is slightly slower on mobile devices,
 *   but WS2JS remains responsive for typical Whitespace programs
 * 
 * - Offline Usage: Once loaded, WS2JS works offline on iOS devices
 * 
 * COMPLETE iOS EXAMPLE:
 * ---------------------
 * See example-ios.html in this repository for a complete working example
 * with styling optimized for iOS devices.
 * 
 * TROUBLESHOOTING:
 * ----------------
 * - If output doesn't appear: Check that WS2JS.convert() is called inside
 *   a <script> tag in the <body>, not in the <head>
 * 
 * - If input doesn't work: Ensure your iOS browser allows JavaScript
 *   dialogs (check Settings > Safari > Block Pop-ups)
 * 
 * - If styling looks wrong: Verify the viewport meta tag is present in
 *   the <head> section
 * 
 * =========================================================================
 */

var WS2JS = (function () {

  var whiteSpace = " \t\n";

  var convertTable = {
    "00([01]*)2" : "stack.push(_0);",
    "020" : "stack.push(stack[stack.length - 1]);",
    "010([01]*)2" : "stack.push(stack[stack.length - 1 - (_0)]);",
    "021" : "stack.push(stack.pop(), stack.pop());",
    "022" : "--stack.length;",
    "012([01]*)2" : "stack[(buf = stack.length - (_0)) - 1] = stack.pop(); stack.length = buf;",
    "1000" : "stack.push(stack.pop() + stack.pop());",
    "1001" : "stack.push(-stack.pop() + stack.pop());",
    "1002" : "stack.push(stack.pop() * stack.pop());",
    "1010" : "buf = stack.pop(); stack.push(Math.floor(stack.pop() / buf));",
    "1011" : "buf = stack.pop(); stack.push(stack.pop() % buf);",
    "110" : "buf = stack.pop(); heap[stack.pop()] = buf;",
    "111" : "stack.push(heap[stack.pop()]);",
    "200([01]*)2" : "case _1:\n",
    "201([01]*)2" : "callStack.push(_2); label = _1; break; case _2:",
    "202([01]*)2" : "label = _1; break;",
    "210([01]*)2" : "if (!stack.pop()) { label = _1; break;}",
    "211([01]*)2" : "if (stack.pop() < 0) { label = _1; break;}",
    "212" : "label = callStack.pop(); break;",
    "222" : "label = 1; break;",
    "1200" : "WS2JS.putc(stack.pop());",
    "1201" : "WS2JS.putn(stack.pop());",
    "1210" : "WS2JS.getc(function (c) { heap[stack.pop()] = c; main(_2);}); label = 2; break; case _2:",
    "1211" : "WS2JS.getn(function (n) { heap[stack.pop()] = n; main(_2);}); label = 2; break; case _2:",
    ".{1,2}$" : ""
  };

  var wsreg = (function (a) {
    for (var i in convertTable)
      a.push(i);
    return new RegExp(a.join("|"), "g");
  })([]);

  function defaultMethod() {

    var inputBuffer = "", inputBufferIndex = 0;

    function getInput() {
      if (!inputBuffer || inputBuffer.length <= inputBufferIndex) {
        inputBuffer = prompt("");
        if (inputBuffer !== null) {
          document.write(inputBuffer);
          inputBuffer += "\n";
        }
        document.write("<BR>");
        inputBufferIndex = 0;
      }
    }

    return {

      putc : function (c) {
        document.write(c === 10 ? "\n<BR>" : String.fromCharCode(c));
      },

      putn : function (n) {
        document.write(n);
      },

      getc : function (callback) {
        getInput();
        var c = inputBuffer === null ? -1 : inputBuffer.charCodeAt(inputBufferIndex++);
        setTimeout(function () { callback(c);}, 0);
      },

      getn : function (callback) {
        getInput();
        var s = (inputBuffer||"").substr(inputBufferIndex), n = parseInt(s, 10) || 0;
        if (inputBuffer)
          inputBufferIndex += s.indexOf("\n") + 1;
        setTimeout(function () { callback(n);}, 0);
      },

      onExit : function () {
        document.write("\n");
        document.close();
      }

    };
  }

  var wtoj = defaultMethod();

  wtoj.convert = function (code, complete, toASCII) {

    var returnLabel = 3, index = 0;

    return "(function (stack, heap, callStack, main, buf) {\n\n" + (complete ? "  var WS2JS = (" + defaultMethod + ")();\n\n" : "") +
      "  (main = function (label, end) { do switch(label) {\n\n    case 0:\n\n" +
      code.replace(/\r\n|\r/g, "\n").replace(/\s|\S/g, function (s, n){ n = whiteSpace.indexOf(s); return n < 0 ? "" : n;}).replace(wsreg, function (s) {

        if (arguments[arguments.length - 2] !== index)
          throw new Error("Invalid character : " + index);
        index += s.length;

        for (var i in convertTable) if ((new RegExp("^" + i + "$")).test(s)) {
          var ret = convertTable[i];
          break;
        }

        var isLabel = i === "200([01]*)2", arg = RegExp.$1, repList = [
          (arg.charAt(0) === "1" ? -1 : 1) * (parseInt(arg.substr(1), 2) || 0),
          "'" + (toASCII ? arg.replace(/.{8}/g, function(s) { return String.fromCharCode(parseInt(s, 2));}).replace(/'/g, "\\'") : arg) + "'",
          returnLabel++
        ];

        return (isLabel ? "\n" : "  ") + "    " + ret.replace(/_([0-2])/g, function (s, n) { return repList[n];}) + "\n";

      }) + "\n    case 1:\n\n      WS2JS.onExit();\n\n    case 2:\n\n      end = 1; break;\n\n  default: throw new Error('Invalid label :' + label);} while (!end);})(0);\n\n})([], {}, []);\n\n";

  };

  return wtoj;

})();
