(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/Canvas.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonva$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonva.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonvaCore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$image$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-image/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
const MapObjectComponent = ({ shapeProps, isSelected, onSelect, onChange, keepAspectRatio })=>{
    _s();
    const shapeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const trRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [image] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$image$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(shapeProps.image, 'anonymous');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapObjectComponent.useEffect": ()=>{
            if (isSelected) {
                trRef.current?.nodes([
                    shapeRef.current
                ]);
                trRef.current?.getLayer()?.batchDraw();
            }
        }
    }["MapObjectComponent.useEffect"], [
        isSelected
    ]);
    const handleDragEnd = (e)=>{
        onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
        });
    };
    const handleTransformEnd = ()=>{
        const node = shapeRef.current;
        if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(shapeProps.flipX ? -1 : 1);
            node.scaleY(shapeProps.flipY ? -1 : 1);
            onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * Math.abs(scaleX)),
                height: Math.max(5, node.height() * Math.abs(scaleY))
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Image"], {
                ref: shapeRef,
                image: image,
                x: shapeProps.x,
                y: shapeProps.y,
                width: shapeProps.width,
                height: shapeProps.height,
                draggable: !shapeProps.isLocked,
                onClick: onSelect,
                onTap: onSelect,
                onDragEnd: handleDragEnd,
                onTransformEnd: handleTransformEnd,
                scaleX: shapeProps.flipX ? -1 : 1,
                scaleY: shapeProps.flipY ? -1 : 1,
                offsetX: shapeProps.flipX ? shapeProps.width : 0,
                offsetY: shapeProps.flipY ? shapeProps.height : 0
            }, void 0, false, {
                fileName: "[project]/src/components/Canvas.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transformer"], {
                ref: trRef,
                boundBoxFunc: (oldBox, newBox)=>{
                    if (keepAspectRatio) {
                        const aspectRatio = oldBox.width / oldBox.height;
                        newBox.width = newBox.height * aspectRatio;
                    }
                    if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                    }
                    return newBox;
                }
            }, void 0, false, {
                fileName: "[project]/src/components/Canvas.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
};
_s(MapObjectComponent, "evLqS+zHr57JMkskbrztADJMNaQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$image$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = MapObjectComponent;
const Canvas = ({ mapObjects, setMapObjects, selectedObject, setSelectedObject, canvasSize, placingObject, setPlacingObject, keepAspectRatio, onUpdateObject })=>{
    _s1();
    const [mousePos, setMousePos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const stageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const groupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [containerSize, setContainerSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width: 800,
        height: 600
    });
    const PADDING = 100;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Canvas.useEffect": ()=>{
            const updateSize = {
                "Canvas.useEffect.updateSize": ()=>{
                    if (containerRef.current) {
                        const { clientWidth, clientHeight } = containerRef.current;
                        setContainerSize({
                            width: clientWidth,
                            height: clientHeight
                        });
                    }
                }
            }["Canvas.useEffect.updateSize"];
            updateSize();
            const resizeObserver = new ResizeObserver(updateSize);
            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }
            return ({
                "Canvas.useEffect": ()=>resizeObserver.disconnect()
            })["Canvas.useEffect"];
        }
    }["Canvas.useEffect"], []);
    const getRelativePointerPosition = (node)=>{
        if (!node) return null;
        const transform = node.getAbsoluteTransform().copy();
        transform.invert();
        const pos = node.getStage()?.getPointerPosition();
        if (!pos) return null;
        return transform.point(pos);
    };
    const handleStageClick = (e)=>{
        if (placingObject && groupRef.current) {
            const pos = getRelativePointerPosition(groupRef.current);
            if (!pos) return;
            if (placingObject.name === 'random_fruit') {
                const newObject = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                    name: 'Случайный фрукт',
                    image: placingObject.image,
                    x: pos.x - placingObject.width / 2,
                    y: pos.y - placingObject.height / 2,
                    width: placingObject.width,
                    height: placingObject.height,
                    originalWidth: placingObject.originalWidth,
                    originalHeight: placingObject.originalHeight,
                    flipX: false,
                    flipY: false,
                    isLocked: false
                };
                setMapObjects([
                    ...mapObjects,
                    newObject
                ]);
                setPlacingObject(null);
            } else {
                const newObject = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                    ...placingObject,
                    x: pos.x - placingObject.width / 2,
                    y: pos.y - placingObject.height / 2,
                    flipX: false,
                    flipY: false,
                    isLocked: false
                };
                setMapObjects([
                    ...mapObjects,
                    newObject
                ]);
                setPlacingObject(null);
            }
            return;
        }
        if (e.target === e.target.getStage() || e.target.name() === 'level-background') {
            setSelectedObject(null);
        }
    };
    const handleMouseMove = (e)=>{
        if (placingObject && groupRef.current) {
            const pos = getRelativePointerPosition(groupRef.current);
            if (pos) {
                setMousePos(pos);
            }
        }
    };
    const handleMouseLeave = ()=>{
        setMousePos(null);
    };
    const [previewImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$image$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(placingObject?.image || '', 'anonymous');
    // Вычисляем позицию для центрирования карты
    const stageWidth = Math.max(containerSize.width, canvasSize.width + PADDING * 2);
    const stageHeight = Math.max(containerSize.height, canvasSize.height + PADDING * 2);
    const offsetX = Math.max(PADDING, (containerSize.width - canvasSize.width) / 2);
    const offsetY = Math.max(PADDING, (containerSize.height - canvasSize.height) / 2);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stage"], {
            ref: stageRef,
            width: containerSize.width,
            height: containerSize.height,
            onClick: handleStageClick,
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
            className: "bg-gray-100",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                    ref: groupRef,
                    x: offsetX,
                    y: offsetY,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                            name: "level-background",
                            width: canvasSize.width,
                            height: canvasSize.height,
                            fill: "white",
                            shadowBlur: 10,
                            shadowOpacity: 0.2
                        }, void 0, false, {
                            fileName: "[project]/src/components/Canvas.tsx",
                            lineNumber: 223,
                            columnNumber: 11
                        }, this),
                        mapObjects.map((obj)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapObjectComponent, {
                                shapeProps: obj,
                                isSelected: selectedObject?.id === obj.id,
                                onSelect: ()=>{
                                    if (placingObject) return;
                                    if (!obj.isLocked) {
                                        setSelectedObject(obj);
                                    }
                                },
                                onChange: onUpdateObject,
                                keepAspectRatio: keepAspectRatio
                            }, obj.id, false, {
                                fileName: "[project]/src/components/Canvas.tsx",
                                lineNumber: 232,
                                columnNumber: 13
                            }, this)),
                        mousePos && placingObject && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Image"], {
                            image: previewImage,
                            x: mousePos.x - placingObject.width / 2,
                            y: mousePos.y - placingObject.height / 2,
                            width: placingObject.width,
                            height: placingObject.height,
                            opacity: 0.6,
                            listening: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/Canvas.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Canvas.tsx",
                    lineNumber: 222,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Canvas.tsx",
                lineNumber: 221,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Canvas.tsx",
            lineNumber: 212,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Canvas.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
};
_s1(Canvas, "0slipFgKVrV8CIwtiiuJse3X2cw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$image$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c1 = Canvas;
const __TURBOPACK__default__export__ = Canvas;
var _c, _c1;
__turbopack_context__.k.register(_c, "MapObjectComponent");
__turbopack_context__.k.register(_c1, "Canvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Canvas.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/Canvas.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=src_components_Canvas_tsx_4e43f705._.js.map