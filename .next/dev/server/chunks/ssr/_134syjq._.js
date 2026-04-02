module.exports = [
"[project]/components/Hero/Hero.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "Hero-module__PgAKtG__active",
  "heroWrapper": "Hero-module__PgAKtG__heroWrapper",
  "image": "Hero-module__PgAKtG__image",
  "slide": "Hero-module__PgAKtG__slide",
});
}),
"[project]/components/Hero/Hero.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/Hero/Hero.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$axiosInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/axiosInstance.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const Hero = ()=>{
    const [banners, setBanners] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchActiveBanners = async ()=>{
            try {
                setLoading(true);
                // Public endpoint, backend should only send active banners
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$axiosInstance$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/banners');
                // Map backend's `_id` to `id` for React key prop and then sort.
                const processedBanners = response.data.map((banner)=>({
                        ...banner,
                        id: banner._id
                    })).sort((a, b)=>a.order - b.order);
                setBanners(processedBanners);
            } catch (error) {
                console.error('Failed to fetch banners:', error);
            } finally{
                setLoading(false);
            }
        };
        fetchActiveBanners();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (banners.length > 1) {
            const timer = setTimeout(()=>{
                setCurrentIndex((prevIndex)=>(prevIndex + 1) % banners.length);
            }, 5000); // Har 5 second me slide badle
            return ()=>clearTimeout(timer);
        }
    }, [
        currentIndex,
        banners.length
    ]);
    if (loading) {
        // Layout shift se bachne ke liye placeholder
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].heroWrapper,
            style: {
                aspectRatio: '16 / 7',
                backgroundColor: '#f0f0f0'
            }
        }, void 0, false, {
            fileName: "[project]/components/Hero/Hero.tsx",
            lineNumber: 56,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (!banners || banners.length === 0) {
        return null; // Agar koi banner nahi hai to kuch na dikhaye
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].heroWrapper,
        children: banners.map((banner, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].slide} ${index === currentIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ''}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: banner.link || '#',
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: banner.imageUrl,
                        alt: banner.title,
                        fill: true,
                        priority: index === 0,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].image,
                        sizes: "(max-width: 768px) 100vw, 50vw"
                    }, void 0, false, {
                        fileName: "[project]/components/Hero/Hero.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/Hero/Hero.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, banner.id, false, {
                fileName: "[project]/components/Hero/Hero.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/components/Hero/Hero.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Hero;
}),
"[project]/components/FeaturedProducts/FeaturedProducts.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "activeWishlist": "FeaturedProducts-module__s8Tlqq__activeWishlist",
  "button": "FeaturedProducts-module__s8Tlqq__button",
  "card": "FeaturedProducts-module__s8Tlqq__card",
  "container": "FeaturedProducts-module__s8Tlqq__container",
  "grid": "FeaturedProducts-module__s8Tlqq__grid",
  "heading": "FeaturedProducts-module__s8Tlqq__heading",
  "image": "FeaturedProducts-module__s8Tlqq__image",
  "imageWrapper": "FeaturedProducts-module__s8Tlqq__imageWrapper",
  "productName": "FeaturedProducts-module__s8Tlqq__productName",
  "rating": "FeaturedProducts-module__s8Tlqq__rating",
  "section": "FeaturedProducts-module__s8Tlqq__section",
  "starEmpty": "FeaturedProducts-module__s8Tlqq__starEmpty",
  "starFilled": "FeaturedProducts-module__s8Tlqq__starFilled",
  "wishlist": "FeaturedProducts-module__s8Tlqq__wishlist",
});
}),
"[project]/components/FeaturedProducts/FeaturedProducts.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FeaturedProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/FeaturedProducts/FeaturedProducts.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CartContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$WishlistContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/WishlistContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ProductContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/ProductContext.tsx [app-ssr] (ecmascript)"); // 1. useProducts import kiya
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
"use client";
;
;
;
;
;
;
;
;
function FeaturedProducts() {
    const { addToCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    const { wishlist, toggleWishlist } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$WishlistContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWishlist"])();
    const { bestSellers, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$ProductContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProducts"])(); // 2. Context se bestSellers aur loading li
    // ✅ Wishlist check logic
    const isInWishlist = (id)=>{
        return wishlist.some((item)=>item.id === id);
    };
    // Loading state dikhane ke liye
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
            children: "Loading best sellers..."
        }, void 0, false, {
            fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
            lineNumber: 23,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].heading,
                    children: "BEST SELLING PRODUCTS"
                }, void 0, false, {
                    fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].grid,
                    children: bestSellers.length > 0 ? bestSellers.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].wishlist} ${isInWishlist(product.id) ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].activeWishlist : ""}`,
                                    onClick: ()=>toggleWishlist(product),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        size: 18,
                                        fill: isInWishlist(product.id) ? "#14854e" : "none",
                                        color: "#14854e"
                                    }, void 0, false, {
                                        fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                        lineNumber: 44,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                    lineNumber: 38,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/products/${product.slug}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].imageWrapper,
                                            children: product.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: product.image,
                                                alt: product.name,
                                                fill: true,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].image,
                                                sizes: "(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            }, void 0, false, {
                                                fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                                lineNumber: 54,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: '#f0f0f0'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                                lineNumber: 62,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                            lineNumber: 52,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].productName,
                                            children: product.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                            lineNumber: 66,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                    lineNumber: 51,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].rating,
                                    children: Array.from({
                                        length: 5
                                    }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: index < (product.rating ?? 0) ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].starFilled : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].starEmpty,
                                            children: "★"
                                        }, index, false, {
                                            fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                            lineNumber: 71,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                    lineNumber: 69,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FeaturedProducts$2f$FeaturedProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].button,
                                    onClick: ()=>addToCart(product),
                                    children: "Add to Cart"
                                }, void 0, false, {
                                    fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                                    lineNumber: 84,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, product.id, true, {
                            fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                            lineNumber: 35,
                            columnNumber: 15
                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "No best selling products found."
                    }, void 0, false, {
                        fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                        lineNumber: 93,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/FeaturedProducts/FeaturedProducts.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/WhyChooseUs/WhyChooseUs.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "WhyChooseUs-module__49_FRW__container",
  "description": "WhyChooseUs-module__49_FRW__description",
  "heading": "WhyChooseUs-module__49_FRW__heading",
  "image": "WhyChooseUs-module__49_FRW__image",
  "imageBg": "WhyChooseUs-module__49_FRW__imageBg",
  "imageWrapper": "WhyChooseUs-module__49_FRW__imageWrapper",
  "mainHeading": "WhyChooseUs-module__49_FRW__mainHeading",
  "points": "WhyChooseUs-module__49_FRW__points",
  "section": "WhyChooseUs-module__49_FRW__section",
  "tag": "WhyChooseUs-module__49_FRW__tag",
});
}),
"[project]/components/WhyChooseUs/WhyChooseUs.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WhyChooseUs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/WhyChooseUs/WhyChooseUs.module.css [app-ssr] (css module)");
"use client";
;
;
;
function WhyChooseUs() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mainHeading,
                children: "WHY CHOOSE US"
            }, void 0, false, {
                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].content,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tag,
                                children: "ROOTED IN TRADITION"
                            }, void 0, false, {
                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                lineNumber: 14,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].heading,
                                children: [
                                    "Crafted by Nature. ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                        lineNumber: 17,
                                        columnNumber: 32
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Powered by ACI."
                                    }, void 0, false, {
                                        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                        lineNumber: 18,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                lineNumber: 16,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].description,
                                children: "ACI me hum ancient Ayurvedic wisdom ko modern science ke saath combine karke aise products banate hain jo aapke body ko naturally nourish kare. Har ingredient carefully source kiya jata hai, ethically process hota hai, aur proper testing ke baad hi use hota hai — taaki aapko mile pure, natural aur trusted wellness."
                            }, void 0, false, {
                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                lineNumber: 21,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].points,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "✔ 100% Natural"
                                            }, void 0, false, {
                                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                                lineNumber: 31,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "No artificial additives or preservatives."
                                            }, void 0, false, {
                                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                                lineNumber: 32,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                        lineNumber: 30,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "✔ Ethically Sourced"
                                            }, void 0, false, {
                                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                                lineNumber: 36,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Direct partnerships with trusted farmers."
                                            }, void 0, false, {
                                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                                lineNumber: 37,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                        lineNumber: 35,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "✔ Lab Tested"
                                            }, void 0, false, {
                                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                                lineNumber: 41,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Strict quality control for every batch."
                                            }, void 0, false, {
                                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                                lineNumber: 42,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].imageWrapper,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].imageBg
                            }, void 0, false, {
                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: "/certifiedIcons/whychooseus.png",
                                alt: "ACI Product",
                                fill: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WhyChooseUs$2f$WhyChooseUs$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].image,
                                sizes: "(max-width: 768px) 80vw, 40vw"
                            }, void 0, false, {
                                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WhyChooseUs/WhyChooseUs.jsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/Testimonials/Testimonials.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "Testimonials-module__3Z1FKa__card",
  "container": "Testimonials-module__3Z1FKa__container",
  "heading": "Testimonials-module__3Z1FKa__heading",
  "image": "Testimonials-module__3Z1FKa__image",
  "imageWrapper": "Testimonials-module__3Z1FKa__imageWrapper",
  "name": "Testimonials-module__3Z1FKa__name",
  "rating": "Testimonials-module__3Z1FKa__rating",
  "section": "Testimonials-module__3Z1FKa__section",
  "sliderWrapper": "Testimonials-module__3Z1FKa__sliderWrapper",
  "sub": "Testimonials-module__3Z1FKa__sub",
  "text": "Testimonials-module__3Z1FKa__text",
  "track": "Testimonials-module__3Z1FKa__track",
});
}),
"[project]/components/Testimonials/Testimonials.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Testimonials
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/Testimonials/Testimonials.module.css [app-ssr] (css module)");
"use client";
;
;
;
function Testimonials() {
    const [testimonials, setTestimonials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ✅ FETCH FROM BACKEND
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchTestimonials = async ()=>{
            try {
                const res = await fetch("http://localhost:5000/api/reviews/testimonials");
                const data = await res.json();
                // 🔥 MAP BACKEND DATA → FRONTEND FORMAT
                const formatted = data.testimonials.map((item)=>({
                        id: item.reviewId,
                        name: item.name,
                        text: item.comment,
                        img: item.productImage || "/certifiedIcons/image1.png",
                        rating: item.rating
                    }));
                setTestimonials(formatted);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            }
        };
        fetchTestimonials();
    }, []);
    // ✅ ANIMATION (RUN AFTER DATA LOAD)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const track = trackRef.current;
        if (!track || testimonials.length === 0) return;
        let animationFrame;
        let position = 0;
        const speed = 0.6;
        const singleWidth = track.scrollWidth / 2;
        const animate = ()=>{
            position -= speed;
            if (Math.abs(position) >= singleWidth) {
                position = 0;
            }
            track.style.transform = `translateX(${position}px)`;
            animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
        return ()=>cancelAnimationFrame(animationFrame);
    }, [
        testimonials
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].heading,
                    children: "REAL CUSTOMERS REAL RESULTS"
                }, void 0, false, {
                    fileName: "[project]/components/Testimonials/Testimonials.jsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sub,
                    children: "What customers are saying about ACI?"
                }, void 0, false, {
                    fileName: "[project]/components/Testimonials/Testimonials.jsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sliderWrapper,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].track,
                        ref: trackRef,
                        children: [
                            ...testimonials,
                            ...testimonials
                        ].map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].imageWrapper,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: 60,
                                                height: 60,
                                                borderRadius: "50%",
                                                backgroundColor: "#2e7d32",
                                                color: "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "1.8rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase"
                                            },
                                            children: item.name ? item.name.charAt(0) : ""
                                        }, void 0, false, {
                                            fileName: "[project]/components/Testimonials/Testimonials.jsx",
                                            lineNumber: 73,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Testimonials/Testimonials.jsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].name,
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/Testimonials/Testimonials.jsx",
                                        lineNumber: 92,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].rating,
                                        children: Array.from({
                                            length: 5
                                        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: i < item.rating ? "#2e7d32" : "#e0e0e0",
                                                    fontSize: "1.2rem"
                                                },
                                                children: "★"
                                            }, i, false, {
                                                fileName: "[project]/components/Testimonials/Testimonials.jsx",
                                                lineNumber: 96,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/Testimonials/Testimonials.jsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Testimonials$2f$Testimonials$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].text,
                                        children: [
                                            '"',
                                            item.text,
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Testimonials/Testimonials.jsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `${item.id}-${index}`, true, {
                                fileName: "[project]/components/Testimonials/Testimonials.jsx",
                                lineNumber: 71,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/Testimonials/Testimonials.jsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Testimonials/Testimonials.jsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Testimonials/Testimonials.jsx",
            lineNumber: 64,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Testimonials/Testimonials.jsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ShopByConcern/ShopByConcern.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "ShopByConcern-module__0D9lVq__card",
  "grid": "ShopByConcern-module__0D9lVq__grid",
  "heading": "ShopByConcern-module__0D9lVq__heading",
  "image": "ShopByConcern-module__0D9lVq__image",
  "imageWrapper": "ShopByConcern-module__0D9lVq__imageWrapper",
  "name": "ShopByConcern-module__0D9lVq__name",
  "section": "ShopByConcern-module__0D9lVq__section",
});
}),
"[project]/components/ShopByConcern/ShopByConcern.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopByConcern
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/ShopByConcern/ShopByConcern.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CategoryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CategoryContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ShopByConcern() {
    const { categories, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CategoryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCategories"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].heading,
                children: "SHOP BY CATEGORY"
            }, void 0, false, {
                fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].grid,
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Loading categories..."
                }, void 0, false, {
                    fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
                    lineNumber: 16,
                    columnNumber: 11
                }, this) : categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/collections/${category.slug}`,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].imageWrapper,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: category.image || "/certifiedIcons/product.jpeg",
                                    alt: category.name,
                                    width: 100,
                                    height: 100,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].image
                                }, void 0, false, {
                                    fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
                                    lineNumber: 25,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
                                lineNumber: 24,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShopByConcern$2f$ShopByConcern$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].name,
                                children: category.name
                            }, void 0, false, {
                                fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
                                lineNumber: 33,
                                columnNumber: 15
                            }, this)
                        ]
                    }, category._id, true, {
                        fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
                        lineNumber: 19,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
                lineNumber: 14,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ShopByConcern/ShopByConcern.jsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ScrollingStrip/ScrollingStrip.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "icon": "ScrollingStrip-module__wBddbW__icon",
  "item": "ScrollingStrip-module__wBddbW__item",
  "marquee": "ScrollingStrip-module__wBddbW__marquee",
  "scroll": "ScrollingStrip-module__wBddbW__scroll",
  "text": "ScrollingStrip-module__wBddbW__text",
  "wrapper": "ScrollingStrip-module__wBddbW__wrapper",
});
}),
"[project]/components/ScrollingStrip/ScrollingStrip.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CertifiedStrip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollingStrip$2f$ScrollingStrip$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/ScrollingStrip/ScrollingStrip.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
function CertifiedStrip() {
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const items = [
        {
            text: "No Artificial Colors or Flavors",
            icon: "/certifiedIcons/Asset_12.svg"
        },
        {
            text: "Certified Organic Products",
            icon: "/certifiedIcons/Asset_15.svg"
        },
        {
            text: "Sourced Directly from Farmers",
            icon: "/certifiedIcons/Asset_16.svg"
        },
        {
            text: "Maximize Farmers Profit",
            icon: "/certifiedIcons/Asset_13.svg"
        },
        {
            text: "100% Natural Herbs",
            icon: "/certifiedIcons/Asset_14.svg"
        },
        {
            text: "No Added Sugar",
            icon: "/certifiedIcons/Asset_17.svg"
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const track = trackRef.current;
        if (!track) return;
        let animationFrame = null;
        let position = 0;
        // Speed is set to 1 for a smoother animation.
        // Increase this value (e.g., to 2 or 3) to make it faster.
        const speed = 2;
        const animate = ()=>{
            position -= speed;
            // Reset position when half of the strip is scrolled for a seamless loop
            if (track.scrollWidth > 0 && Math.abs(position) >= track.scrollWidth / 2) {
                position = 0;
            }
            track.style.transform = `translateX(${position}px)`;
            animationFrame = requestAnimationFrame(animate);
        };
        const startAnimation = ()=>{
            if (animationFrame === null) {
                animationFrame = requestAnimationFrame(animate);
            }
        };
        const stopAnimation = ()=>{
            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        };
        track.addEventListener("mouseenter", stopAnimation);
        track.addEventListener("mouseleave", startAnimation);
        startAnimation();
        return ()=>{
            stopAnimation();
            if (track) {
                track.removeEventListener("mouseenter", stopAnimation);
                track.removeEventListener("mouseleave", startAnimation);
            }
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollingStrip$2f$ScrollingStrip$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollingStrip$2f$ScrollingStrip$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].marquee,
            ref: trackRef,
            children: [
                ...items,
                ...items
            ].map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollingStrip$2f$ScrollingStrip$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].item,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: item.icon,
                            alt: item.text,
                            width: 40,
                            height: 40,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollingStrip$2f$ScrollingStrip$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].icon
                        }, void 0, false, {
                            fileName: "[project]/components/ScrollingStrip/ScrollingStrip.jsx",
                            lineNumber: 76,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollingStrip$2f$ScrollingStrip$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].text,
                            children: item.text
                        }, void 0, false, {
                            fileName: "[project]/components/ScrollingStrip/ScrollingStrip.jsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/components/ScrollingStrip/ScrollingStrip.jsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/ScrollingStrip/ScrollingStrip.jsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ScrollingStrip/ScrollingStrip.jsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Heart
]);
/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
            key: "mvr1a0"
        }
    ]
];
const Heart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("heart", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Heart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_134syjq._.js.map