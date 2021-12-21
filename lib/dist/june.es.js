var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import React, { useMemo, useRef, useCallback, useEffect, Children, cloneElement } from "react";
import { createPortal } from "react-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
function toVal(mix) {
  var k, y, str = "";
  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if (y = toVal(mix[k])) {
            str && (str += " ");
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += " ");
          str += k;
        }
      }
    }
  }
  return str;
}
function classNames() {
  var i = 0, tmp, x, str = "";
  while (i < arguments.length) {
    if (tmp = arguments[i++]) {
      if (x = toVal(tmp)) {
        str && (str += " ");
        str += x;
      }
    }
  }
  return str;
}
const JIcon = ({ size, icon, className }) => {
  return /* @__PURE__ */ React.createElement("span", {
    className: classNames(["inline-flex items-stretch", `${className != null ? className : ""}`])
  }, /* @__PURE__ */ React.createElement("i", {
    style: { fontSize: size || "16px" },
    className: "iconify",
    "data-icon": icon,
    "data-inline": "true"
  }));
};
const JAlert = ({ type, icon, message }) => {
  const bgColor = useMemo(() => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  }, [type]);
  const iconName = useMemo(() => {
    switch (type) {
      case "success":
        return "ion:checkmark-circle-outline";
      case "warning":
        return "ion:alert-circle-outline";
      case "danger":
        return "ion:ban-outline";
      default:
        return "";
    }
  }, [type]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "j-alert"
  }, /* @__PURE__ */ React.createElement("div", {
    className: classNames(["j-alert__content", bgColor]),
    role: "alert"
  }, /* @__PURE__ */ React.createElement("span", null, " ", /* @__PURE__ */ React.createElement(JIcon, {
    icon: icon || iconName
  }), " "), /* @__PURE__ */ React.createElement("span", {
    className: "flex text-base font-normal flex-nowrap"
  }, message)));
};
const JAlertGroup = ({ alerts }) => {
  return createPortal(/* @__PURE__ */ React.createElement("div", {
    className: "fixed bottom-0 left-1/2 transform -translate-x-1/2 list-group z-50"
  }, /* @__PURE__ */ React.createElement(TransitionGroup, {
    is: "div",
    className: "flex flex-col justify-center items-center"
  }, alerts.map((alert) => /* @__PURE__ */ React.createElement(CSSTransition, {
    key: alert.id,
    timeout: 1e3,
    classNames: "j-alert-anim"
  }, /* @__PURE__ */ React.createElement(JAlert, __spreadValues({}, alert)))))), document.getElementById("alert-root"));
};
const JAvatar = ({
  src,
  size,
  rounded,
  imageSlot,
  iconSize,
  icon,
  contentClass,
  content
}) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames([
      "inline-block text-5xl align-middle relative",
      `${contentClass != null ? contentClass : ""}`
    ]),
    style: {
      fontSize: size || "40px",
      borderRadius: rounded ? "50%" : void 0,
      height: "1em",
      width: "1em"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-center overflow-hidden",
    style: {
      borderRadius: "inherit",
      height: "inherit",
      width: "inherit"
    }
  }, /* @__PURE__ */ React.createElement(React.Fragment, null, imageSlot ? imageSlot : src ? /* @__PURE__ */ React.createElement("img", {
    style: { borderRadius: "inherit", height: "inherit", width: "inherit" },
    src,
    alt: src,
    className: "object-cover"
  }) : icon ? /* @__PURE__ */ React.createElement(JIcon, {
    icon,
    size: iconSize
  }) : content && /* @__PURE__ */ React.createElement("div", {
    style: { fontSize: iconSize || "16px" }
  }, content.toUpperCase()))));
};
function useClickoutside(cb) {
  const ref = useRef(null);
  const memoCb = useCallback(cb, []);
  useWindowEvent("mousedown", (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      memoCb();
    }
  });
  return [ref];
}
/**
 * @license MIT
 * @borrows https://github.com/tailwindlabs/headlessui/blob/main/packages/@headlessui-react/src/hooks/use-window-event.ts
 */
function useWindowEvent(type, listener, options) {
  let listenerRef = useRef(listener);
  listenerRef.current = listener;
  useEffect(() => {
    function handler(event) {
      listenerRef.current.call(window, event);
    }
    window.addEventListener(type, handler, options);
    return () => window.removeEventListener(type, handler, options);
  }, [type, options]);
}
const JButton = (_a) => {
  var _b = _a, {
    block,
    size,
    color,
    flat,
    icon,
    invert,
    label,
    sm,
    iconSlot,
    labelSlot,
    loadingSlot,
    outline,
    round,
    loading,
    avatar,
    iconRight,
    dense,
    avatarRound,
    type,
    noBg,
    className,
    align,
    onClick
  } = _b, rest = __objRest(_b, [
    "block",
    "size",
    "color",
    "flat",
    "icon",
    "invert",
    "label",
    "sm",
    "iconSlot",
    "labelSlot",
    "loadingSlot",
    "outline",
    "round",
    "loading",
    "avatar",
    "iconRight",
    "dense",
    "avatarRound",
    "type",
    "noBg",
    "className",
    "align",
    "onClick"
  ]);
  const buttonClasses = useMemo(() => [
    noBg ? "bg-transparent hover:bg-transparent" : flat ? "hover:bg-lime-200" : outline ? "hover:bg-lime-200 border border-lime-400" : invert ? "bg-lime-300 hover:bg-lime-400" : "bg-lime-400 hover:bg-lime-300",
    dense ? "!px-[2px] !py-[2px]" : sm || sm && round ? "!px-2 !py-2" : round ? "!px-3 !py-3" : "",
    round ? "rounded-full" : "rounded-md",
    className || "",
    { "focus:ring-2 focus:ring-lime-200": !(noBg || flat) },
    {
      "w-full": !!block
    },
    align === "left" ? "justify-left" : align === "right" ? "justify-right" : "justify-center"
  ], [noBg, invert, flat, outline, dense, sm, round, className, block]);
  const buttonContentClasses = useMemo(() => [
    {
      "j-button__content--loading": loading,
      "flex-row-reverse !space-x-reverse ": iconRight
    }
  ], [loading, iconRight]);
  const children = /* @__PURE__ */ React.createElement(React.Fragment, null, " ", /* @__PURE__ */ React.createElement("span", {
    className: classNames(["j-button__content", ...buttonContentClasses])
  }, /* @__PURE__ */ React.createElement(React.Fragment, null, !!iconSlot ? /* @__PURE__ */ React.createElement("span", null, iconSlot) : icon ? /* @__PURE__ */ React.createElement(JIcon, {
    icon,
    size: size ? size : sm ? "12px" : "16px"
  }) : avatar && /* @__PURE__ */ React.createElement(JAvatar, {
    icon: avatar.startsWith("icn:") ? avatar.split("icn:")[1] : "",
    src: avatar.startsWith("img:") ? avatar.split("img:")[1] : "",
    size: size || "16px",
    content: (!avatar.startsWith("img:") || !avatar.startsWith("icn:")) && avatar.startsWith("con:") ? avatar.split("con:")[1] : avatar,
    rounded: avatarRound
  })), /* @__PURE__ */ React.createElement(React.Fragment, null, !!labelSlot ? labelSlot : label && /* @__PURE__ */ React.createElement("span", {
    className: classNames([{ "text-xs": sm }, "flex-grow"])
  }, label))), loading && /* @__PURE__ */ React.createElement("span", {
    className: "j-button__bottom"
  }, !!loadingSlot ? loadingSlot : /* @__PURE__ */ React.createElement("span", {
    className: classNames([
      "j-button__loading",
      `j-button__loading${flat || outline || noBg ? "--invert" : "--normal"}`
    ]),
    style: { height: sm ? "16px" : "20px", width: sm ? "16px" : "20px" }
  })));
  function handleClick(e) {
    e.stopPropagation();
    if (!!onClick) {
      onClick(e);
    }
  }
  return /* @__PURE__ */ React.createElement("button", __spreadValues({
    className: classNames(["j-button", ...buttonClasses]),
    type: type || "button",
    children,
    onClick: handleClick
  }, rest));
};
function randomId(len) {
  function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0");
  }
  const arr = new Uint8Array((len || 30) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}
const typeValidation = (expectedType) => (props, propName, componentName) => {
  if (props[propName] !== expectedType) {
    return new Error(`'${propName}' in '${componentName}'

You may NOT pass in a prop value for '${propName}'. It had 2 underscores in the prop name for a reason. So, if you would kindly remove it, we can all go about our error free day.
`);
  }
  return null;
};
function generateShades(color, type, shaderange) {
  return [...Array(shaderange).keys()].map((e) => !!e && `${type}-${color}-${e * 100}`).filter((x) => typeof x === "string");
}
const JuneTWindSafelist = ["fill-current text-red-700", generateShades("lime", "text", 10)];
var ElementTypes;
(function(ElementTypes2) {
  ElementTypes2["JPanel"] = "JPanel";
  ElementTypes2["JTabs"] = "JTabs";
})(ElementTypes || (ElementTypes = {}));
const JPanels = (_c) => {
  var _d = _c, { children, selected } = _d, rest = __objRest(_d, ["children", "selected"]);
  var _a;
  function getPanels() {
    var _a2;
    return (_a2 = Children.map(children, (child) => {
      if (!React.isValidElement(child))
        return null;
      if (child.props.__TYPE === ElementTypes.JPanel && child.props.children && typeof child.props.children === "object")
        return child.props.children;
    })) == null ? void 0 : _a2.filter((x) => !!x);
  }
  const panels = useMemo(getPanels, [children]);
  function renderTab() {
    return panels == null ? void 0 : panels.map((panel) => {
      if (!panel.props.id)
        throw new Error("no id prop found");
      const { id } = panel.props;
      if (id === selected)
        return panel;
      return null;
    });
  }
  const memoizedPanel = useMemo(renderTab, [children, selected]);
  function getTabs() {
    var _a2;
    return (_a2 = Children.map(children, (child) => {
      if (!React.isValidElement(child))
        return null;
      if (child.props.__TYPE === ElementTypes.JTabs)
        return cloneElement(child, __spreadValues({}, child.props));
    })) == null ? void 0 : _a2.filter((x) => !!x)[0];
  }
  const tabs = useMemo(getTabs, [children]);
  return /* @__PURE__ */ React.createElement("div", __spreadValues({}, rest), /* @__PURE__ */ React.createElement("div", {
    className: "bg-warm-gray-200 rounded-md flex items-center",
    role: "tablist"
  }, !!(tabs == null ? void 0 : tabs.props.children) ? tabs.props.children : (_a = tabs == null ? void 0 : tabs.props.tabs) == null ? void 0 : _a.map((tab, i) => {
    return /* @__PURE__ */ React.createElement(JButton, {
      key: i,
      label: !tabs.props.noLabel ? typeof tab === "string" ? tab : tab.label : void 0,
      noBg: true,
      icon: typeof tab === "string" ? void 0 : tab.icon,
      className: classNames([
        "self-stretch hover:(bg-warm-gray-300 rounded-md) flex-grow",
        (typeof tab === "string" ? tab : tab.label) === selected ? `${(tabs == null ? void 0 : tabs.props.activeClass) || "!bg-warm-gray-300"}` : ""
      ]),
      onClick: () => !!(tabs == null ? void 0 : tabs.props.onClick) && (tabs == null ? void 0 : tabs.props.onClick(typeof tab === "string" ? tab : tab.label))
    });
  })), /* @__PURE__ */ React.createElement("div", {
    role: "tabpanel",
    className: "pt-2"
  }, memoizedPanel));
};
const JPanel = ({ children }) => {
  return /* @__PURE__ */ React.createElement("div", null, children);
};
JPanel.propTypes = {
  __TYPE: typeValidation(ElementTypes.JPanel)
};
JPanel.defaultProps = { __TYPE: ElementTypes.JPanel };
const JTabs = ({ children }) => {
  return /* @__PURE__ */ React.createElement("div", null, children);
};
JTabs.propTypes = {
  __TYPE: typeValidation(ElementTypes.JTabs)
};
JTabs.defaultProps = { noLabel: false, __TYPE: ElementTypes.JTabs };
var lib = "";
export { ElementTypes, JAlert, JAlertGroup, JPanel, JPanels, JTabs, JuneTWindSafelist, randomId, typeValidation, useClickoutside, useWindowEvent };
