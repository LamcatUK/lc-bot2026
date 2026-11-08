/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/_shared/EditorBlockShell.js"
/*!********************************************!*\
  !*** ./blocks/_shared/EditorBlockShell.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditorBlockShell)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






/**
 * Wraps a block's edit.js output in a collapsible section with a title bar
 * and open/closed toggle, persisting the toggle state per block-instance
 * (keyed by the block's position path within the post plus the current
 * URL) in localStorage — so a page with many blocks stays scannable in the
 * editor instead of every block's full field set staying expanded at once.
 *
 * @param {Object}   props
 * @param {Object}   props.blockProps       Result of useBlockProps().
 * @param {string}   props.clientId         The block's clientId, for deriving its position path.
 * @param {string}   [props.classPrefix]    Class/prefix root, matches editor.css.
 * @param {string}   [props.textDomain]     i18n text domain for the toggle's aria-label.
 * @param {string}   [props.storageNamespace] Extra localStorage key segment, in case two shells need independent state on the same path.
 * @param {string}   props.title            Block name shown in the title bar.
 * @param {boolean}  [props.defaultOpen]    Initial state before localStorage is read.
 * @param {*}        props.children         The block's own field controls.
 */
/**
 * Keep Shift+Arrow inside the field being edited. Gutenberg's writing flow
 * listens for keydown on an ancestor and, when the caret is at the edge of a
 * field, turns Shift+Arrow into a block-level multi-selection — so extending
 * a text selection in one of this block's inputs jumps to selecting the whole
 * block. Stopping the React event here means the browser's native text
 * selection handles it and the writing flow never sees it.
 *
 * @param {KeyboardEvent} event React keydown event.
 */

function keepShiftArrowInField(event) {
  if (event.shiftKey && !event.ctrlKey && !event.metaKey && event.key.startsWith('Arrow')) {
    event.stopPropagation();
  }
}
function EditorBlockShell({
  blockProps,
  clientId,
  classPrefix = 'lc-bot2026',
  textDomain = 'lc-bot2026',
  storageNamespace = 'block',
  title,
  children,
  defaultOpen = true
}) {
  const [isOpen, setIsOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(defaultOpen);
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.useInstanceId)(EditorBlockShell);
  const contentId = `${classPrefix}-editor-block-content-${instanceId}`;
  const blockPath = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    if (!clientId) {
      return '';
    }
    const {
      getBlockIndex,
      getBlockRootClientId
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
    const path = [];
    let currentId = clientId;
    while (currentId) {
      const parentId = getBlockRootClientId(currentId) || '';
      path.unshift(String(getBlockIndex(currentId, parentId)));
      currentId = parentId || null;
    }
    return path.join('.');
  }, [clientId]);
  const storageKey = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    if (!clientId || !blockPath || typeof window === 'undefined') {
      return '';
    }
    return [classPrefix, 'editor-block-state', storageNamespace, window.location.pathname, window.location.search, blockPath].join(':');
  }, [blockPath, classPrefix, clientId, storageNamespace]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }
    const storedValue = window.localStorage.getItem(storageKey);
    if (storedValue === 'closed') {
      setIsOpen(false);
    } else if (storedValue === 'open') {
      setIsOpen(true);
    }
  }, [storageKey]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(storageKey, isOpen ? 'open' : 'closed');
  }, [isOpen, storageKey]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: `${classPrefix}-editor-block__title`,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        children: title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        type: "button",
        className: `${classPrefix}-editor-block__toggle`,
        onClick: () => setIsOpen(open => !open),
        "aria-expanded": isOpen,
        "aria-controls": contentId,
        "aria-label": isOpen ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide block fields', textDomain) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show block fields', textDomain),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          "aria-hidden": "true",
          children: isOpen ? '−' : '+'
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      id: contentId,
      className: `${classPrefix}-editor-block__content`,
      hidden: !isOpen,
      onKeyDown: keepShiftArrowInField,
      children: children
    })]
  });
}

/***/ },

/***/ "./blocks/_shared/RepeaterField.js"
/*!*****************************************!*\
  !*** ./blocks/_shared/RepeaterField.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RepeaterField)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _useRowMotion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useRowMotion */ "./blocks/_shared/useRowMotion.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Generic repeater UI for a block attribute holding an array of row objects.
 * The block-editor equivalent of the `repeater` field type in
 * inc/options.php — same sub-field vocabulary (text/textarea/image), separate
 * implementation since one runs in wp-admin and the other inside the block
 * editor's React tree.
 *
 * Rows lay out inline by default (`layout: 'row'`): each sub-field takes an
 * equal-width slot, with compact move-up/move-down/remove icon buttons at
 * the row's end. Sub-field labels render once, as column headers above the
 * rows, rather than repeating per row — `hideLabelFromVision` keeps them
 * screen-reader accessible on each control without rendering visually
 * twice.
 *
 * `layout: 'column'` stacks each row's sub-fields vertically instead —
 * there's no shared column header in that layout (it wouldn't line up with
 * anything), so each sub-field's own label renders visibly above its
 * control instead of being screen-reader-only.
 *
 * @param {Object}   props
 * @param {string}   props.label    Field group label.
 * @param {Object[]} props.value    Current rows.
 * @param {Function} props.onChange ( rows ) => void
 * @param {Object[]} props.fields   [ { name, label, type: 'text'|'number'|'textarea'|'image'|'file'|'link'|'radio', help, mimeTypes, linkTarget, options } ]
 *                                  `linkTarget` (link fields only) adds an "open in new tab" toggle,
 *                                  storing `{name}Target` on the row — same opt-in shape as the
 *                                  top-level `link` field type's `link_target` option. `options`
 *                                  (radio fields only) is `[ { label, value } ]`, mirroring the
 *                                  top-level `select`/`radio` field types' options shape.
 * @param {Object}   props.emptyRow Shape of a freshly-added row, e.g. { stat: '', title: '' }.
 * @param {string}   [props.layout] 'row' (default) or 'column'.
 */

function RepeaterField({
  label,
  value,
  onChange,
  fields,
  emptyRow,
  layout = 'row'
}) {
  const isColumn = 'column' === layout;
  const rows = value || [];
  function updateRow(index, patch) {
    const next = rows.slice();
    next[index] = {
      ...next[index],
      ...patch
    };
    onChange(next);
  }

  // Adding, moving and removing rows, with a slide and highlight on a move and focus kept on the arrow used.
  const {
    keys,
    setRowRef,
    movedKey,
    addRow,
    moveRow,
    removeRow
  } = (0,_useRowMotion__WEBPACK_IMPORTED_MODULE_3__["default"])(rows, onChange);
  function confirmRemove(index) {
    // eslint-disable-next-line no-alert -- a plain confirm() is enough
    // friction for an irreversible remove; no undo exists for this field.
    if (window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove this row?', 'lc-bot2026'))) {
      removeRow(index);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: isColumn ? 'lc-bot2026-repeater-field lc-bot2026-repeater-field--column' : 'lc-bot2026-repeater-field',
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
      className: "lc-bot2026-editor-field__label",
      children: label
    }), !isColumn && rows.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "lc-bot2026-repeater-field__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "lc-bot2026-repeater-field__number-spacer"
      }), fields.map(field => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: 'image' === field.type || 'file' === field.type ? 'lc-bot2026-repeater-field__header-cell lc-bot2026-repeater-field__header-cell--image' : 'lc-bot2026-repeater-field__header-cell',
        children: field.label
      }, field.name)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "lc-bot2026-repeater-field__row-actions-spacer"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "lc-bot2026-repeater-field__rows",
      children: rows.map((row, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: 'lc-bot2026-repeater-field__row' + (keys[index] === movedKey ? ' is-moved' : ''),
        ref: setRowRef(keys[index]),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
          className: "lc-bot2026-repeater-field__number",
          children: index + 1
        }), fields.map(field => {
          if ('image' === field.type) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                onSelect: media => updateRow(index, {
                  [field.name]: media.id,
                  [`${field.name}Url`]: media.url
                }),
                allowedTypes: ['image'],
                value: row[field.name],
                render: ({
                  open
                }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                  className: "lc-bot2026-repeater-field__image",
                  children: [row[`${field.name}Url`] && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
                    src: row[`${field.name}Url`],
                    alt: ""
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                    variant: "secondary",
                    size: "small",
                    onClick: open,
                    children: row[field.name] ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace', 'lc-bot2026') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'lc-bot2026')
                  })]
                })
              })
            }, field.name);
          }
          if ('link' === field.type) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "lc-bot2026-repeater-field__link",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`${field.label} Title`, 'lc-bot2026'),
                hideLabelFromVision: !isColumn,
                value: row[`${field.name}Text`] || '',
                onChange: v => updateRow(index, {
                  [`${field.name}Text`]: v
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                type: "url",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`${field.label} URL`, 'lc-bot2026'),
                hideLabelFromVision: !isColumn,
                value: row[field.name] || '',
                onChange: v => updateRow(index, {
                  [field.name]: v
                }),
                help: field.help
              }), field.linkTarget && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`Open ${field.label} in a new tab`, 'lc-bot2026'),
                checked: !!row[`${field.name}Target`],
                onChange: v => updateRow(index, {
                  [`${field.name}Target`]: v
                })
              })]
            }, field.name);
          }
          if ('file' === field.type) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                onSelect: media => updateRow(index, {
                  [field.name]: media.id,
                  [`${field.name}Name`]: media.filename || media.title || ''
                }),
                allowedTypes: field.mimeTypes || [],
                value: row[field.name],
                render: ({
                  open
                }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                  className: "lc-bot2026-repeater-field__image",
                  children: [row[`${field.name}Name`] && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                    className: "lc-bot2026-repeater-field__file-name",
                    children: row[`${field.name}Name`]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                    variant: "secondary",
                    size: "small",
                    onClick: open,
                    children: row[field.name] ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace', 'lc-bot2026') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'lc-bot2026')
                  })]
                })
              })
            }, field.name);
          }
          if ('textarea' === field.type) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
              label: field.label,
              hideLabelFromVision: !isColumn,
              value: row[field.name] || '',
              onChange: v => updateRow(index, {
                [field.name]: v
              }),
              help: field.help
            }, field.name);
          }
          if ('radio' === field.type) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
              label: field.label,
              hideLabelFromVision: !isColumn,
              selected: row[field.name] || '',
              options: field.options || [],
              onChange: v => updateRow(index, {
                [field.name]: v
              })
            }, field.name);
          }
          if ('number' === field.type) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              type: "number",
              label: field.label,
              hideLabelFromVision: !isColumn,
              value: row[field.name] ?? '',
              onChange: v => updateRow(index, {
                [field.name]: '' === v ? '' : Number(v)
              }),
              help: field.help
            }, field.name);
          }
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: field.label,
            hideLabelFromVision: !isColumn,
            value: row[field.name] || '',
            onChange: v => updateRow(index, {
              [field.name]: v
            }),
            help: field.help
          }, field.name);
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "lc-bot2026-repeater-field__row-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            "data-move": "up",
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move up', 'lc-bot2026'),
            onClick: () => moveRow(index, -1),
            disabled: 0 === index,
            children: "\u25B2"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            "data-move": "down",
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move down', 'lc-bot2026'),
            onClick: () => moveRow(index, 1),
            disabled: index === rows.length - 1,
            children: "\u25BC"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            isDestructive: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'lc-bot2026'),
            onClick: () => confirmRemove(index),
            children: "\xD7"
          })]
        })]
      }, keys[index]))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "primary",
      onClick: () => addRow(emptyRow),
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add row', 'lc-bot2026')
    })]
  });
}

/***/ },

/***/ "./blocks/_shared/useRowMotion.js"
/*!****************************************!*\
  !*** ./blocks/_shared/useRowMotion.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useRowMotion)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Shared row behaviour for repeater-style fields such as RepeaterField: add,
 * move and remove rows, and make a move obvious.
 *
 *  - Stable keys: each row keeps an identity as it moves, so React moves its
 *    DOM node instead of rewriting rows in place.
 *  - Slide: the two swapped rows animate past each other (FLIP), skipped when
 *    the visitor prefers reduced motion.
 *  - Highlight: the moved row gets .is-moved for a moment (CSS fades it).
 *  - Focus: stays on the same up/down button of the moved row, so pressing it
 *    again keeps moving the same row.
 *
 * The row element needs ref={ setRowRef( keys[ index ] ) }, key={ keys[ index ] },
 * the class is-moved when keys[ index ] === movedKey, and its move buttons
 * data-move="up" / data-move="down".
 *
 * @param {Object[]} rows     Current rows.
 * @param {Function} onChange ( rows ) => void
 * @return {Object} keys, setRowRef, movedKey, addRow( emptyRow ), moveRow( index, direction ), removeRow( index ).
 */
let counter = 0;
const newKey = () => `row-${++counter}`;
const HIGHLIGHT_MS = 1200;
const SLIDE_MS = 220;
function useRowMotion(rows, onChange) {
  const list = rows || [];
  const keysRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  const elementsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Map());
  const beforeRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [moved, setMoved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Rows can change from outside (undo, redo): keep one key per row.
  while (keysRef.current.length < list.length) {
    keysRef.current.push(newKey());
  }
  keysRef.current.length = list.length;
  const setRowRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(key => element => {
    if (element) {
      elementsRef.current.set(key, element);
    } else {
      elementsRef.current.delete(key);
    }
  }, []);

  // Slide: compare each row's position before and after a move.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const before = beforeRef.current;
    if (!before) {
      return;
    }
    beforeRef.current = null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    keysRef.current.forEach(key => {
      const element = elementsRef.current.get(key);
      const oldTop = before.get(key);
      if (!element || undefined === oldTop) {
        return;
      }
      const delta = oldTop - element.getBoundingClientRect().top;
      if (delta) {
        element.animate([{
          transform: `translateY(${delta}px)`
        }, {
          transform: 'none'
        }], {
          duration: SLIDE_MS,
          easing: 'ease-out'
        });
      }
    });
  }, [list]);

  // Highlight for a moment, and put focus back on the button that was used.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!moved) {
      return undefined;
    }
    const element = elementsRef.current.get(moved.key);
    if (element) {
      const button = element.querySelector(`[data-move="${moved.direction}"]:not([disabled])`) || element.querySelector('[data-move]:not([disabled])');
      if (button) {
        button.focus({
          preventScroll: true
        });
      }
    }
    const timer = window.setTimeout(() => setMoved(null), HIGHLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [moved]);
  const addRow = emptyRow => {
    onChange([...list, {
      ...emptyRow
    }]);
  };
  const moveRow = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= list.length) {
      return;
    }
    const keys = keysRef.current;
    const positions = new Map();
    keys.forEach(key => {
      const element = elementsRef.current.get(key);
      if (element) {
        positions.set(key, element.getBoundingClientRect().top);
      }
    });
    beforeRef.current = positions;
    const movedKey = keys[index];
    [keys[index], keys[target]] = [keys[target], keys[index]];
    const next = list.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setMoved({
      key: movedKey,
      direction: direction < 0 ? 'up' : 'down'
    });
    onChange(next);
  };
  const removeRow = index => {
    keysRef.current.splice(index, 1);
    onChange(list.filter((_row, i) => i !== index));
  };
  return {
    keys: keysRef.current,
    setRowRef,
    movedKey: moved ? moved.key : null,
    addRow,
    moveRow,
    removeRow
  };
}

/***/ },

/***/ "./blocks/pullquote/src/edit.js"
/*!**************************************!*\
  !*** ./blocks/pullquote/src/edit.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../_shared/EditorBlockShell */ "./blocks/_shared/EditorBlockShell.js");
/* harmony import */ var _shared_RepeaterField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../_shared/RepeaterField */ "./blocks/_shared/RepeaterField.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    brushTop,
    spaceTop,
    spaceBottom,
    title,
    quotes,
    surface
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'container lc-bot2026-editor-block'
  });
  const spaceOptions = [{
    value: 'normal',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Normal', 'lc-bot2026')
  }, {
    value: 'small',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Small', 'lc-bot2026')
  }, {
    value: 'none',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'lc-bot2026')
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_3__["default"], {
    blockProps: blockProps,
    clientId: clientId,
    title: "Pullquote",
    textDomain: "lc-bot2026",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add one quote to show it on its own. Add two or more and they become a slider.', 'lc-bot2026')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading (optional)', 'lc-bot2026'),
      value: title,
      onChange: v => setAttributes({
        title: v
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_RepeaterField__WEBPACK_IMPORTED_MODULE_4__["default"], {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Quotes', 'lc-bot2026'),
      value: quotes,
      onChange: v => setAttributes({
        quotes: v
      }),
      layout: "column",
      fields: [{
        name: 'quote',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Quote (no quotation marks)', 'lc-bot2026'),
        type: 'textarea'
      }, {
        name: 'name',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Name', 'lc-bot2026'),
        type: 'text'
      }, {
        name: 'detail',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Place or course', 'lc-bot2026'),
        type: 'text'
      }],
      emptyRow: {
        quote: '',
        name: '',
        detail: ''
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Surface', 'lc-bot2026'),
      value: surface,
      options: [{
        value: 'surface',
        label: 'Page (light)'
      }, {
        value: 'tint',
        label: 'Tint'
      }, {
        value: 'soft',
        label: 'Soft accent'
      }, {
        value: 'brand',
        label: 'Brand (dark)'
      }],
      onChange: v => setAttributes({
        surface: v
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      style: {
        display: 'flex',
        gap: '12px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        style: {
          flex: '1 1 0'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Space above', 'lc-bot2026'),
          value: spaceTop || 'normal',
          options: spaceOptions,
          onChange: v => setAttributes({
            spaceTop: v
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        style: {
          flex: '1 1 0'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Space below', 'lc-bot2026'),
          value: spaceBottom || 'normal',
          options: spaceOptions,
          onChange: v => setAttributes({
            spaceBottom: v
          })
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Brush edge at the top', 'lc-bot2026'),
      checked: !!brushTop,
      onChange: v => setAttributes({
        brushTop: v
      })
    })]
  });
}

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/compose"
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["compose"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./blocks/pullquote/block.json"
/*!*************************************!*\
  !*** ./blocks/pullquote/block.json ***!
  \*************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"lc-bot2026/pullquote","title":"Pullquote","category":"lc-bot2026","icon":"format-quote","description":"Client quotes, set large. One quote shows on its own; two or more become a slider. Replaces the old testimonials.","attributes":{"brushTop":{"type":"boolean","default":false},"spaceTop":{"type":"string","default":"normal"},"spaceBottom":{"type":"string","default":"normal"},"title":{"type":"string","default":""},"quotes":{"type":"array","default":[]},"surface":{"type":"string","default":"surface"}},"supports":{"anchor":true,"className":true,"align":false},"editorScript":"file:./build/index.js","render":"file:./render.php"}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./blocks/pullquote/src/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./blocks/pullquote/src/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../block.json */ "./blocks/pullquote/block.json");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map