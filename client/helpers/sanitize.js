const sanitize = (input) => {
  const mapping = {
    "<": "&lt;",
    ">": "&gt;",
    "/": "&#x2F;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#x60;",
    "&": "&amp;",
    "=": "&#x3D;",
    ")": "&rpar;0",
    "(": "&lpar;"
  };
  return String(input).replace(/[<>"'`&=\(\)\/]/g, function (s) {
    return mapping[s];
  });
}