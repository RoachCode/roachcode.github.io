function _componentToHex(c)
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b)
{
    return "#" + _componentToHex(r) + _componentToHex(g) + _componentToHex(b);
}